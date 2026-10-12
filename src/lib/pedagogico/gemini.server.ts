import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export type GeminiFailureCode = "rejected" | "quota" | "timeout" | "unavailable";
export type GeminiThinking = "budget0" | "low" | "none";

export type GeminiAttempt = {
  model: string;
  thinking: GeminiThinking;
};

export class GeminiCallError extends Error {
  readonly code: GeminiFailureCode;
  readonly status: number;

  constructor(code: GeminiFailureCode, status = 0) {
    super(code);
    this.name = "GeminiCallError";
    this.code = code;
    this.status = status;
  }
}

const STABLE_MODEL = "gemini-2.5-flash";
const ALIAS_MODEL = "gemini-flash-latest";
export const GEMINI_TIMEOUT_MS = 45_000;

/** Alias móvel. Em outubro de 2026 aponta para um Flash com raciocínio ligado. */
const UNSTABLE_ALIASES = new Set(["gemini-flash-latest", "gemini-pro-latest"]);

/** Modelos que responderam 404 nesta instância. Não é persistente. */
const rejectedModels = new Set<string>();

export function resolveGeminiModel(configured: string | undefined) {
  const name = configured?.trim();
  if (!name || UNSTABLE_ALIASES.has(name)) return STABLE_MODEL;
  return name;
}

export function geminiModel() {
  return resolveGeminiModel(process.env.GEMINI_MODEL);
}

function thinkingFor(model: string): GeminiThinking {
  if (model.includes("2.5-pro")) return "none";
  if (model.includes("2.5")) return "budget0";
  if (model.startsWith("gemini-3") || model.endsWith("-latest")) return "low";
  return "none";
}

/**
 * `gemini-2.5-flash` desliga o raciocínio com thinkingBudget 0.
 * Se a publicação recusar esse id (foi o caso do teste de 1 s), o alias que já
 * completou uma análise entra em seguida, com nível baixo e folga de tokens.
 */
export function geminiAttemptPlan(configured: string | undefined): GeminiAttempt[] {
  const raw = configured?.trim() ?? "";
  const preferred = resolveGeminiModel(configured);
  const useStableChain = !raw || raw === STABLE_MODEL || UNSTABLE_ALIASES.has(raw) || preferred === STABLE_MODEL;
  if (!useStableChain) return [{ model: preferred, thinking: thinkingFor(preferred) }];
  return [
    { model: STABLE_MODEL, thinking: "budget0" },
    { model: ALIAS_MODEL, thinking: "low" },
  ];
}

export function geminiThinkingConfig(thinking: GeminiThinking) {
  if (thinking === "budget0") return { thinkingConfig: { thinkingBudget: 0 } };
  if (thinking === "low") return { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } };
  return {};
}

function statusOf(error: unknown) {
  if (error instanceof GeminiCallError && error.status) return error.status;
  if (typeof error === "object" && error && "status" in error) {
    const status = Number((error as { status: unknown }).status);
    if (Number.isFinite(status)) return status;
  }
  return 0;
}

export function classifyGeminiFailure(error: unknown): GeminiFailureCode {
  if (error instanceof GeminiCallError) return error.code;
  if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) return "timeout";
  const status = statusOf(error);
  if (status === 429) return "quota";
  if (status === 401 || status === 403) return "rejected";
  if (status === 408 || status === 504) return "timeout";
  return "unavailable";
}

export function geminiFailureShouldFallback(error: unknown) {
  if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) return false;
  if (error instanceof GeminiCallError) return error.code === "unavailable";
  const status = statusOf(error);
  if (status === 401 || status === 403 || status === 429 || status === 408 || status === 504) return false;
  return true;
}

export function geminiFailureMessage(code: GeminiFailureCode) {
  if (code === "rejected") return "A chave do Gemini foi recusada. Confira GEMINI_API_KEY no servidor. Nada foi salvo.";
  if (code === "quota") return "O limite de uso do Gemini foi atingido. Tente mais tarde. Nada foi salvo.";
  if (code === "timeout") return "O Gemini demorou demais para responder. Tente de novo. Nada foi salvo.";
  return "O Gemini não respondeu agora. Nada foi alterado nos registros.";
}

type GeminiPart = { text?: string; thought?: boolean };
type GeminiResponse = {
  text?: string;
  candidates?: Array<{ content?: { parts?: GeminiPart[] } }>;
};

export function geminiResponseText(response: GeminiResponse) {
  const direct = response.text?.trim();
  if (direct) return direct;
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const visible = parts
    .filter((part) => part.text && !part.thought)
    .map((part) => part.text)
    .join("")
    .trim();
  if (visible) return visible;
  const thought = parts
    .filter((part) => part.text && part.thought)
    .map((part) => part.text)
    .join("")
    .trim();
  const json = thought.match(/\{[\s\S]*\}/)?.[0] ?? "";
  if (json.includes("organizedText") || json.includes('"reading"')) return json;
  return "";
}

export async function firstGeminiText(
  attempts: GeminiAttempt[],
  call: (attempt: GeminiAttempt, relaxThinking: boolean) => Promise<string>,
) {
  let last: unknown;
  for (const attempt of attempts) {
    try {
      return await call(attempt, false);
    } catch (error) {
      last = error;
      if (!geminiFailureShouldFallback(error)) throw error;
      if (statusOf(error) === 400 && attempt.thinking !== "none") {
        try {
          return await call(attempt, true);
        } catch (retryError) {
          last = retryError;
          if (!geminiFailureShouldFallback(retryError)) throw retryError;
        }
      }
    }
  }
  throw last ?? new GeminiCallError("unavailable");
}

export async function generateGeminiJson(args: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  schema: object;
  signal: AbortSignal;
}) {
  const ai = new GoogleGenAI({
    apiKey: args.apiKey,
    httpOptions: { timeout: GEMINI_TIMEOUT_MS + 5_000 },
  });
  const planned = geminiAttemptPlan(args.model).filter((attempt) => !rejectedModels.has(attempt.model));
  const attempts = planned.length ? planned : geminiAttemptPlan(args.model);

  try {
    return await firstGeminiText(attempts, async (attempt, relaxThinking) => {
      try {
        const response = await ai.models.generateContent({
          model: attempt.model,
          contents: args.user,
          config: {
            systemInstruction: args.system,
            temperature: 0.2,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseJsonSchema: args.schema,
            abortSignal: args.signal,
            ...geminiThinkingConfig(relaxThinking ? "none" : attempt.thinking),
          },
        });
        const text = geminiResponseText(response);
        if (!text) throw new GeminiCallError("unavailable");
        return text;
      } catch (error) {
        if (statusOf(error) === 404) rejectedModels.add(attempt.model);
        throw error;
      }
    });
  } catch (error) {
    throw fail(error);
  }
}

function fail(error: unknown): GeminiCallError {
  if (error instanceof GeminiCallError) return error;
  const status = statusOf(error);
  const code = classifyGeminiFailure(error);
  console.error(`[gemini] falha status=${status} code=${code}`);
  return new GeminiCallError(code, status);
}
