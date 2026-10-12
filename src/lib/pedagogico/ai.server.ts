import {
  analysisResponseSchema,
  analysisResultSchema,
  assistInputSchema,
  buildFactSheet,
  dossierForModel,
  evidenceFromModelIds,
  organizeResponseSchema,
  organizeResultSchema,
  restoreToken,
  SYSTEM_PROMPT,
  type AssistInput,
  type FactSheet,
} from "./ai-contract.ts";
import { GeminiCallError, geminiFailureMessage, geminiModel, generateGeminiJson } from "./gemini.server.ts";
import type { Category } from "./types.ts";

export type AssistSuccess = {
  ok: true;
  action: AssistInput["action"];
  origin: AssistInput["origin"];
  facts: string[];
  missing: string[];
  limits: string[];
  evidence: FactSheet["evidence"];
  reading: string;
  suggestions: string[];
  tags: string[];
  storedCategory: Category;
  draft: string;
  demonstrative: boolean;
};

export type AssistFailure = {
  ok: false;
  code: "invalid" | "mixed" | "insufficient" | "unconfigured" | "rate_limited" | "rejected" | "quota" | "timeout" | "unavailable" | "forbidden" | "error";
  message: string;
  missing?: string[];
  limits?: string[];
};

export type AssistResult = AssistSuccess | AssistFailure;

type Generate = (args: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  schema: object;
  signal: AbortSignal;
}) => Promise<string>;

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;
const INSTANCE_LIMIT = 40;
const buckets = new Map<string, { count: number; reset: number }>();

export function resetAssistantRateLimit() {
  buckets.clear();
}

export function geminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function rateKeyFromHeaders(headers: { get(name: string): string | null } | null | undefined) {
  const real = headers?.get("x-real-ip")?.split(",")[0]?.trim() ?? "";
  if (real && real.length <= 80 && /^[0-9a-fA-F:.]+$/.test(real)) return `ip:${real}`;
  return "unverified";
}

function bucketAllows(key: string, now: number, limit: number) {
  const current = buckets.get(key);
  if (!current || now >= current.reset) return true;
  return current.count < limit;
}

function bucketCommit(key: string, now: number) {
  const current = buckets.get(key);
  if (!current || now >= current.reset) {
    buckets.set(key, { count: 1, reset: now + WINDOW_MS });
    return;
  }
  current.count += 1;
}

function takeSlot(key: string, now: number) {
  const caller = `caller:${key}`;
  if (!bucketAllows(caller, now, LIMIT) || !bucketAllows("instance", now, INSTANCE_LIMIT)) return false;
  bucketCommit(caller, now);
  bucketCommit("instance", now);
  return true;
}

function payloadTooLarge(raw: unknown) {
  if (!raw || typeof raw !== "object") return false;
  const row = raw as Record<string, unknown>;
  const len = (key: string) => (Array.isArray(row[key]) ? row[key].length : 0);
  return (
    len("observations") > 40 ||
    len("grades") > 40 ||
    len("attendance") > 80 ||
    len("exams") > 12 ||
    (typeof row.rawText === "string" && row.rawText.length > 4000)
  );
}

function parseModelJson(raw: string) {
  const trimmed = raw.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
  return JSON.parse(trimmed) as unknown;
}

function sameOrigin(input: AssistInput) {
  const rows = [...input.observations, ...input.grades, ...input.attendance, ...input.exams];
  return rows.every((row) => row.origin === input.origin);
}

function taskPrompt(input: AssistInput) {
  if (input.action === "organizar") {
    return "Organize o texto original em uma observação clara e objetiva, sem acrescentar fatos. Sugira categorias pedagógicas e uma categoria de arquivo.";
  }
  if (input.action === "parecer") {
    return "Redija uma leitura individual para o professor revisar. Não escreva um parecer oficial fechado. Aponte só o que os fatos calculados e as evidências sustentam.";
  }
  if (input.action === "evolucao") {
    return "Compare os dois períodos usando apenas os registros disponíveis. Se um período estiver vazio, declare a limitação e não invente evolução.";
  }
  return "Sugira intervenções pedagógicas práticas e individualizadas. Elas são sugestões, não decisões, e não substituem o julgamento do professor.";
}

export async function assistWith(
  raw: unknown,
  options: { apiKey?: string; model?: string; generate?: Generate; rateKey?: string; now?: number },
): Promise<AssistResult> {
  const parsed = assistInputSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      code: "invalid",
      message: payloadTooLarge(raw)
        ? "Há registros demais neste pedido. Reduza o período. Nada foi salvo."
        : "Os dados enviados não puderam ser analisados. Nada foi salvo.",
    };
  }
  const input = parsed.data;
  if (!sameOrigin(input)) {
    return {
      ok: false,
      code: "mixed",
      message: "Não dá para misturar a sala fictícia de demonstração com alunos incluídos por você. Escolha só um dos grupos.",
    };
  }
  if (input.action === "evolucao" && !input.comparePeriod) {
    return { ok: false, code: "invalid", message: "Escolha o período de comparação. Nada foi salvo." };
  }

  const sheet = buildFactSheet(input);
  if (!sheet.enough) {
    return {
      ok: false,
      code: "insufficient",
      message: "Ainda não há registros suficientes para esta análise.",
      missing: sheet.missing,
      limits: sheet.limits,
    };
  }

  const apiKey = options.apiKey?.trim();
  if (!apiKey) {
    return {
      ok: false,
      code: "unconfigured",
      message: "O assistente não está configurado neste ambiente. Defina GEMINI_API_KEY no servidor. Nada foi salvo.",
    };
  }

  const now = options.now ?? Date.now();
  if (!takeSlot(options.rateKey ?? "anonymous", now)) {
    return {
      ok: false,
      code: "rate_limited",
      message: "Muitas análises em pouco tempo. Espere alguns minutos. Nada foi salvo.",
    };
  }

  const dossier = dossierForModel(input, sheet);
  const schema = input.action === "organizar" ? organizeResponseSchema : analysisResponseSchema;
  const user = `${taskPrompt(input)}\n\n${JSON.stringify(dossier)}`;
  const signal = AbortSignal.timeout(20_000);

  let rawText = "";
  try {
    const generate = options.generate ?? generateGeminiJson;
    rawText = await generate({
      apiKey,
      model: options.model?.trim() || geminiModel(),
      system: SYSTEM_PROMPT,
      user,
      schema,
      signal,
    });
  } catch (error) {
    const code = error instanceof GeminiCallError ? error.code : "unavailable";
    return { ok: false, code, message: geminiFailureMessage(code) };
  }

  try {
    const json = parseModelJson(rawText);
    const name = input.student.name;
    if (input.action === "organizar") {
      const organized = organizeResultSchema.parse(json);
      const text = restoreToken(organized.organizedText, name);
      return {
        ok: true,
        action: input.action,
        origin: input.origin,
        facts: sheet.facts,
        missing: sheet.missing,
        limits: organized.caution ? [...sheet.limits, restoreToken(organized.caution, name)] : sheet.limits,
        evidence: sheet.evidence,
        reading: text,
        suggestions: [],
        tags: organized.tags,
        storedCategory: organized.storedCategory,
        draft: text,
        demonstrative: input.origin === "demo",
      };
    }
    const analysis = analysisResultSchema.parse(json);
    const evidence = evidenceFromModelIds(sheet, analysis.evidenceIds);
    const reading = restoreToken(analysis.reading, name);
    const suggestions = analysis.suggestions.map((item) => restoreToken(item, name));
    const missing = [...sheet.missing, ...analysis.missing.map((item) => restoreToken(item, name))];
    const limits = [...sheet.limits, ...analysis.limits.map((item) => restoreToken(item, name))];
    const draft = [reading, suggestions.length ? `Sugestões para revisar:\n${suggestions.map((item) => `- ${item}`).join("\n")}` : ""]
      .filter(Boolean)
      .join("\n\n");
    return {
      ok: true,
      action: input.action,
      origin: input.origin,
      facts: sheet.facts,
      missing,
      limits,
      evidence,
      reading,
      suggestions,
      tags: [],
      storedCategory: "geral",
      draft,
      demonstrative: input.origin === "demo",
    };
  } catch {
    return {
      ok: false,
      code: "unavailable",
      message: "A resposta do Gemini não pôde ser usada. Nada foi alterado nos registros.",
    };
  }
}

export async function assist(raw: unknown, rateKey = "anonymous") {
  return assistWith(raw, {
    apiKey: process.env.GEMINI_API_KEY,
    model: geminiModel(),
    rateKey,
  });
}
