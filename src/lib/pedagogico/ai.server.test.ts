import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ThinkingLevel } from "@google/genai";
import { dossierForModel, buildFactSheet, maskNames, analysisResponseSchema, organizeResponseSchema, type AssistInput } from "./ai-contract.ts";
import { GeminiCallError, classifyGeminiFailure, firstGeminiText, geminiAttemptPlan, geminiFailureMessage, geminiFailureShouldFallback, geminiResponseText, geminiThinkingConfig, resolveGeminiModel } from "./gemini.server.ts";
import { assistWith, rateKeyFromHeaders, resetAssistantRateLimit } from "./ai.server.ts";

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
    evidenceIds: ["e1", "obs-1", "inventado"],
    missing: [],
    limits: ["Isto é uma leitura, não um diagnóstico."],
  });

describe("modelo do Gemini", () => {
  it("não usa o flash 2.5 que a publicação recusou e tenta ids atuais", () => {
    assert.equal(resolveGeminiModel(undefined), "gemini-flash-latest");
    assert.equal(resolveGeminiModel("gemini-2.5-flash"), "gemini-flash-latest");
    assert.equal(resolveGeminiModel("gemini-flash-latest"), "gemini-flash-latest");
    assert.deepEqual(
      geminiAttemptPlan(undefined).map((attempt) => attempt.model),
      ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.8-flash", "gemini-flash-latest"],
    );
    assert.deepEqual(geminiAttemptPlan("gemini-2.5-flash"), geminiAttemptPlan(undefined));
    assert.deepEqual(geminiAttemptPlan("gemini-2.5-pro"), [{ model: "gemini-2.5-pro", thinking: "none" }]);
    assert.deepEqual(geminiThinkingConfig("budget0"), { thinkingConfig: { thinkingBudget: 0 } });
    assert.deepEqual(geminiThinkingConfig("low"), { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } });
    assert.deepEqual(geminiThinkingConfig("none"), {});
  });

  it("não troca de modelo em chave recusada nem em tempo esgotado", () => {
    assert.equal(geminiFailureShouldFallback({ status: 404 }), true);
    assert.equal(geminiFailureShouldFallback({ status: 400 }), true);
    assert.equal(geminiFailureShouldFallback(new GeminiCallError("unavailable")), true);
    assert.equal(geminiFailureShouldFallback({ status: 401 }), false);
    assert.equal(geminiFailureShouldFallback({ status: 429 }), false);
    const aborted = new Error("aborted");
    aborted.name = "TimeoutError";
    assert.equal(geminiFailureShouldFallback(aborted), false);
  });

  it("passa ao modelo seguinte quando o primeiro responde 503", async () => {
    const seen: string[] = [];
    const text = await firstGeminiText(geminiAttemptPlan("gemini-flash-latest"), async (attempt) => {
      seen.push(attempt.model);
      if (attempt.model === "gemini-3.5-flash-lite") {
        throw Object.assign(new Error("unavailable"), { status: 503 });
      }
      return '{"ok":true}';
    });
    assert.equal(text, '{"ok":true}');
    assert.deepEqual(seen, ["gemini-3.5-flash-lite", "gemini-3.6-flash"]);
  });

  it("tenta o modelo seguinte se o primeiro estourar o tempo", async () => {
    const seen: string[] = [];
    const text = await firstGeminiText(
      [
        { model: "gemini-3.5-flash-lite", thinking: "none" },
        { model: "gemini-3.6-flash", thinking: "none" },
      ],
      async (attempt) => {
        seen.push(attempt.model);
        if (attempt.model === "gemini-3.5-flash-lite") {
          const timeout = new Error("slow");
          timeout.name = "TimeoutError";
          throw timeout;
        }
        return '{"ok":true}';
      },
    );
    assert.equal(text, '{"ok":true}');
    assert.deepEqual(seen, ["gemini-3.5-flash-lite", "gemini-3.6-flash"]);
  });

  it("repete sem raciocínio mesmo quando a recusa não é HTTP 400", async () => {
    const seen: string[] = [];
    const text = await firstGeminiText([{ model: "gemini-flash-latest", thinking: "low" }], async (_attempt, relax) => {
      seen.push(String(relax));
      if (!relax) throw new Error("thinkingLevel recusado pelo SDK");
      return '{"ok":true}';
    });
    assert.equal(text, '{"ok":true}');
    assert.deepEqual(seen, ["false", "true"]);
  });

  it("guarda só modelo e código no diagnóstico, sem o corpo do erro", async () => {
    const secret = "AIza-segredo-nao-mostrar";
    await assert.rejects(
      () =>
        firstGeminiText([{ model: "gemini-2.5-flash", thinking: "budget0" }], async () => {
          throw Object.assign(new Error(`corpo ${secret}`), { status: 404 });
        }),
      (error: unknown) => {
        assert.ok(error instanceof GeminiCallError);
        assert.equal(error.detail.includes("gemini-2.5-flash"), true);
        assert.equal(error.detail.includes(secret), false);
        assert.equal(error.message.includes(secret), false);
        return true;
      },
    );
  });

  it("ignora o raciocínio e lê o JSON da resposta", () => {
    assert.equal(
      geminiResponseText({
        text: "",
        candidates: [{ content: { parts: [{ thought: true, text: "pensando" }, { text: '{"ok":true}' }] } }],
      }),
      '{"ok":true}',
    );
    assert.equal(
      geminiResponseText({
        candidates: [{ content: { parts: [{ thought: true, text: 'rascunho {"organizedText":"ok"}' }] } }],
      }),
      '{"organizedText":"ok"}',
    );
  });
});

describe("assistWith", { concurrency: 1 }, () => {
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
      assert.equal(JSON.stringify(result).includes("inventado"), false);
      assert.equal(Object.hasOwn(result, "grades"), false);
      assert.equal(Object.hasOwn(result, "attendance"), false);
      assert.match(result.facts.join(" "), /8,0/);
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

  it("não copia o corpo do provedor para a mensagem", () => {
    const secret = "AIza-CORPO-BRUTO";
    assert.equal(classifyGeminiFailure({ status: 429, message: `quota ${secret}` }), "quota");
    assert.equal(classifyGeminiFailure({ status: 403, message: secret }), "rejected");
    assert.equal(classifyGeminiFailure({ status: 504, message: secret }), "timeout");
    const aborted = new Error(`slow ${secret}`);
    aborted.name = "AbortError";
    assert.equal(classifyGeminiFailure(aborted), "timeout");
    assert.equal(classifyGeminiFailure({ status: 500, message: secret }), "unavailable");
    for (const code of ["quota", "rejected", "timeout", "unavailable"] as const) {
      assert.equal(geminiFailureMessage(code).includes(secret), false);
    }
  });

  it("não consome o limite quando a chave está ausente", async () => {
    resetAssistantRateLimit();
    let calls = 0;
    for (let index = 0; index < 10; index += 1) {
      const skipped = await assistWith(input(), {
        apiKey: "",
        generate: async () => {
          calls += 1;
          return "{}";
        },
        rateKey: "vazio",
        now: 20_000,
      });
      assert.equal(skipped.ok, false);
      if (!skipped.ok) assert.equal(skipped.code, "unconfigured");
    }
    const after = await assistWith(input(), { apiKey: "k", generate: okGenerate, rateKey: "vazio", now: 20_000 });
    assert.equal(after.ok, true);
    assert.equal(calls, 0);
    resetAssistantRateLimit();
  });

  it("abre a janela de novo depois de dez minutos", async () => {
    resetAssistantRateLimit();
    for (let index = 0; index < 8; index += 1) {
      const result = await assistWith(input(), { apiKey: "k", generate: okGenerate, rateKey: "janela", now: 30_000 });
      assert.equal(result.ok, true);
    }
    const blocked = await assistWith(input(), { apiKey: "k", generate: okGenerate, rateKey: "janela", now: 30_000 });
    assert.equal(blocked.ok, false);
    const later = await assistWith(input(), {
      apiKey: "k",
      generate: okGenerate,
      rateKey: "janela",
      now: 30_000 + 10 * 60 * 1000,
    });
    assert.equal(later.ok, true);
    resetAssistantRateLimit();
  });

  it("não deixa um endereço forjado multiplicar o limite da instância", async () => {
    resetAssistantRateLimit();
    let calls = 0;
    const generate = async () => {
      calls += 1;
      return okGenerate();
    };
    for (let index = 0; index < 40; index += 1) {
      const result = await assistWith(input(), { apiKey: "k", generate, rateKey: `ip:${index}`, now: 90_000 });
      assert.equal(result.ok, true);
    }
    const blocked = await assistWith(input(), { apiKey: "k", generate, rateKey: "ip:novo", now: 90_000 });
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.equal(blocked.code, "rate_limited");
    assert.equal(calls, 40);
    resetAssistantRateLimit();
  });

  it("recusa JSON inválido sem devolver a chave", async () => {
    const secret = "AIza-NAO-ECOAR";
    const result = await assistWith(input(), {
      apiKey: secret,
      generate: async () => `não é json ${secret}`,
      rateKey: "json",
      now: 200_000,
    });
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.code, "unavailable");
    assert.equal(JSON.stringify(result).includes(secret), false);
  });

  it("avisa quando o pedido passa do teto de registros", async () => {
    let calls = 0;
    const huge = input();
    huge.observations = Array.from({ length: 41 }, (_, index) => ({
      ...huge.observations[0],
      id: `obs-${index}`,
    }));
    const result = await assistWith(huge, {
      apiKey: "k",
      generate: async () => {
        calls += 1;
        return "{}";
      },
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.code, "invalid");
      assert.match(result.message, /demais/);
    }
    assert.equal(calls, 0);
  });

  it("mascara sobrenome e maiúsculas sem cortar outra palavra", () => {
    assert.equal(maskNames("A análise de Ana foi boa.", "Ana Silva"), "A análise de [[A1]] foi boa.");
    assert.equal(maskNames("o moreira faltou.", "Alice Moreira").includes("moreira"), false);
    assert.equal(maskNames("Alê chegou e Bruno Carvalho veio.", "Alice Moreira"), "Alê chegou e Bruno Carvalho veio.");
  });

  it("não envia histórico, id interno nem nome no dossiê", () => {
    const base = input({
      attendance: [{ id: "att-alice-2026-08-12", date: "2026-08-12", status: "falta", origin: "local" }],
      observations: [
        input().observations[0],
        { id: "old", date: "2026-01-10", category: "geral", text: "Segredo antigo de Alice Moreira", origin: "local" },
      ],
    });
    const encoded = JSON.stringify(dossierForModel(base, buildFactSheet(base)));
    assert.equal(encoded.includes("Alice"), false);
    assert.equal(encoded.includes("Moreira"), false);
    assert.equal(encoded.includes("alice"), false);
    assert.equal(encoded.includes("att-alice"), false);
    assert.equal(encoded.includes("obs-1"), false);
    assert.equal(encoded.includes("Segredo"), false);
    assert.equal(encoded.includes("[[A1]]"), true);

    const organized = input({ action: "organizar", rawText: "Falou pouco na correção de equações hoje." });
    const organizedText = JSON.stringify(dossierForModel(organized, buildFactSheet(organized)));
    assert.equal(organizedText.includes("explicou"), false);
    assert.equal(organizedText.includes("Prova"), false);
    assert.equal(organizedText.includes("Falou pouco"), true);
    assert.equal(organizedText.includes("Alice"), false);
  });

  it("ignora o IP enviado pelo cliente e usa só x-real-ip", () => {
    const headers = {
      get(name: string) {
        if (name === "x-forwarded-for") return "9.9.9.9";
        if (name === "x-real-ip") return "2001:db8::1";
        return null;
      },
    };
    assert.equal(rateKeyFromHeaders(headers), "ip:2001:db8::1");
    assert.equal(rateKeyFromHeaders({ get: (name) => (name === "x-forwarded-for" ? "9.9.9.9" : null) }), "unverified");
    assert.equal(rateKeyFromHeaders({ get: () => "não-é-ip" }), "unverified");
  });

  it("monta um JSON Schema sem composição que o código não valida", () => {
    for (const schema of [organizeResponseSchema, analysisResponseSchema]) {
      const encoded = JSON.stringify(schema);
      assert.equal(schema.type, "object");
      assert.equal(encoded.includes("$ref"), false);
      assert.equal(encoded.includes("anyOf"), false);
      assert.equal(encoded.includes("oneOf"), false);
    }
  });
});
