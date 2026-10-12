import { GoogleGenAI } from "@google/genai";

export type GeminiFailureCode = "rejected" | "quota" | "timeout" | "unavailable";

export class GeminiCallError extends Error {
  readonly code: GeminiFailureCode;

  constructor(code: GeminiFailureCode) {
    super(code);
    this.name = "GeminiCallError";
    this.code = code;
  }
}

const DEFAULT_MODEL = "gemini-2.5-flash";
export const GEMINI_TIMEOUT_MS = 45_000;

/** Alias móvel: na publicação ele pensava demais, estourava 20 s ou voltava sem JSON. */
const UNSTABLE_ALIASES = new Set(["gemini-flash-latest", "gemini-pro-latest"]);

export function resolveGeminiModel(configured: string | undefined) {
  const name = configured?.trim();
  if (!name || UNSTABLE_ALIASES.has(name)) return DEFAULT_MODEL;
  return name;
}

export function geminiModel() {
  return resolveGeminiModel(process.env.GEMINI_MODEL);
}

function statusOf(error: unknown) {
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
  return parts
    .filter((part) => part.text && !part.thought)
    .map((part) => part.text)
    .join("")
    .trim();
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

  const once = async (disableThinking: boolean) => {
    const response = await ai.models.generateContent({
      model: args.model,
      contents: args.user,
      config: {
        systemInstruction: args.system,
        temperature: 0.2,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseJsonSchema: args.schema,
        abortSignal: args.signal,
        // 2.5 Flash gasta a cota de saída em raciocínio e devolve texto vazio.
        ...(disableThinking ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
      },
    });
    const text = geminiResponseText(response);
    if (!text) throw new GeminiCallError("unavailable");
    return text;
  };

  try {
    return await once(true);
  } catch (error) {
    if (error instanceof GeminiCallError && error.code === "unavailable") {
      try {
        return await once(false);
      } catch (retryError) {
        throw fail(retryError);
      }
    }
    if (statusOf(error) === 400) {
      try {
        return await once(false);
      } catch (retryError) {
        throw fail(retryError);
      }
    }
    throw fail(error);
  }
}

function fail(error: unknown): GeminiCallError {
  if (error instanceof GeminiCallError) return error;
  const code = classifyGeminiFailure(error);
  console.error(`[gemini] falha status=${statusOf(error)} code=${code}`);
  return new GeminiCallError(code);
}
