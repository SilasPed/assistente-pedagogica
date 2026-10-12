import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dossierForModel, buildFactSheet, type AssistInput } from "./ai-contract.ts";
import { GeminiCallError, classifyGeminiFailure } from "./gemini.server.ts";
import { assistWith, resetAssistantRateLimit } from "./ai.server.ts";

const period = { label: "3º bimestre", start: "2026-08-03", end: "2026-09-18" };
const prior = { label: "2º bimestre", start: "2026-04-20", end: "2026-07-03" };

function input(overrides: Partial<AssistInput> = {}): AssistInput {
  return {
    action: "parecer",
    origin: "local",
    student: { id: "s1", name: "Alice Moreira", className: "7º A", subject: "Matemática" },
    period,
    observations: [
      {
        id: "obs-1",
        date: "2026-08-12",
        category: "participacao",
        text: "Alice Moreira explicou o exercício para a dupla.",
        origin: "local",
      },
    ],
    grades: [{ id: "g1", date: "2026-08-20", title: "Prova 1", score: 8, origin: "local" }],
    attendance: [{ id: "a1", date: "2026-08-12", status: "presente", origin: "local" }],
    exams: [],
    ...overrides,
  };
}

const okGenerate = async () =>
  JSON.stringify({
    reading: "[[A1]] manteve a participação descrita no registro.",
    suggestions: ["Pedir a [[A1]] que explique um exercício para a dupla."],
    evidenceIds: ["obs-1", "inventado"],
    missing: [],
    limits: ["Isto é uma leitura, não um diagnóstico."],
  });

describe("assistWith", () => {
  it("recusa entrada inválida sem chamar o modelo", async () => {
    let calls = 0;
    const result = await assistWith(
      { action: "parecer" },
      { apiKey: "k", generate: async () => { calls += 1; return "{}"; } },
    );
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "invalid");
    assert.equal(calls, 0);
  });

  it("recusa mistura de origem demonstrativa e local", async () => {
    let calls = 0;
    const mixed = input({
      observations: [{ ...input().observations[0], origin: "demo" }],
    });
    const result = await assistWith(mixed, { apiKey: "k", generate: async () => { calls += 1; return "{}"; } });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "mixed");
    assert.equal(calls, 0);
  });

  it("não chama o Gemini quando faltam registros", async () => {
    let calls = 0;
    const empty = input({ observations: [], grades: [], attendance: [] });
    const result = await assistWith(empty, { apiKey: "k", generate: async () => { calls += 1; return "{}"; } });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "insufficient");
      assert.ok(result.missing?.some((item) => item.includes("Não há")));
    }
    assert.equal(calls, 0);
  });

  it("informa chave ausente sem chamar o modelo", async () => {
    let calls = 0;
    const result = await assistWith(input(), { apiKey: "  ", generate: async () => { calls += 1; return "{}"; } });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "unconfigured");
    assert.equal(calls, 0);
  });

  it("não devolve a chave quando o provedor recusa", async () => {
    const secret = "AIza-SEGREDO-NAO-VAZAR";
    const result = await assistWith(input(), {
      apiKey: secret,
      generate: async () => {
        const error = new Error(`invalid key ${secret}`) as Error & { status: number };
        error.status = 401;
        throw new GeminiCallError(classifyGeminiFailure(error));
      },
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "rejected");
      assert.equal(JSON.stringify(result).includes(secret), false);
    }
  });

  it("traduz limite de uso e tempo esgotado", async () => {
    const quota = await assistWith(input(), {
      apiKey: "k",
      generate: async () => {
        throw new GeminiCallError(classifyGeminiFailure(Object.assign(new Error("rate"), { status: 429 })));
      },
    });
    assert.equal(quota.ok, false);
    if (!quota.ok) assert.equal(quota.code, "quota");

    const timeout = await assistWith(input(), {
      apiKey: "k",
      generate: async () => {
        const error = new Error("aborted");
        error.name = "TimeoutError";
        throw new GeminiCallError(classifyGeminiFailure(error));
      },
    });
    assert.equal(timeout.ok, false);
    if (!timeout.ok) assert.equal(timeout.code, "timeout");
  });

  it("limita a oitava análise seguinte", async () => {
    resetAssistantRateLimit();
    let calls = 0;
    const generate = async () => {
      calls += 1;
      return okGenerate();
    };
    for (let index = 0; index < 8; index += 1) {
      const result = await assistWith(input(), { apiKey: "k", generate, rateKey: "prof", now: 1_000 });
      assert.equal(result.ok, true);
    }
    const blocked = await assistWith(input(), { apiKey: "k", generate, rateKey: "prof", now: 1_000 });
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.equal(blocked.code, "rate_limited");
    assert.equal(calls, 8);
    resetAssistantRateLimit();
  });

  it("restaura o nome só na resposta e descarta evidência desconhecida", async () => {
    const result = await assistWith(input(), { apiKey: "k", generate: okGenerate, rateKey: "outro", now: 5_000 });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.reading.includes("Alice Moreira"), true);
      assert.equal(result.reading.includes("[[A1]]"), false);
      assert.deepEqual(result.evidence.map((item) => item.id), ["obs-1"]);
    }
  });

  it("declara o período vazio na comparação sem inventar evolução", async () => {
    const sheet = buildFactSheet(input({ action: "evolucao", comparePeriod: prior, observations: [], grades: [], attendance: [
      { id: "a2", date: "2026-05-04", status: "falta", origin: "local" },
    ] }));
    assert.equal(sheet.enough, true);
    assert.ok(sheet.limits.some((item) => item.includes("Não há registros em 3º bimestre")));
  });

  it("mascara o nome antes de montar o dossiê", () => {
    const base = input();
    const dossier = dossierForModel(base, buildFactSheet(base));
    const encoded = JSON.stringify(dossier);
    assert.equal(encoded.includes("Alice Moreira"), false);
    assert.equal(encoded.includes("[[A1]]"), true);
  });

  it("propaga o código já classificado", () => {
    const error = new GeminiCallError("quota");
    assert.equal(error.code, "quota");
    assert.equal(error.message.includes("key"), false);
  });
});
