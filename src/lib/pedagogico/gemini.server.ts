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

export function classifyGeminiFailure(error: unknown): GeminiFailureCode {
  if (error instanceof GeminiCallError) return error.code;
  if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) return "timeout";
  const status =
    typeof error === "object" && error && "status" in error ? Number((error as { status: unknown }).status) : NaN;
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

const DEFAULT_MODEL = "gemini-flash-latest";

export function geminiModel() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export async function generateGeminiJson(args: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
  schema: object;
  signal: AbortSignal;
}) {
  const ai = new GoogleGenAI({ apiKey: args.apiKey });
  try {
    const response = await ai.models.generateContent({
      model: args.model,
      contents: args.user,
      config: {
        systemInstruction: args.system,
        temperature: 0.2,
        maxOutputTokens: 1200,
        responseMimeType: "application/json",
        responseJsonSchema: args.schema,
        abortSignal: args.signal,
      },
    });
    const text = response.text?.trim();
    if (!text) throw new GeminiCallError("unavailable");
    return text;
  } catch (error) {
    if (error instanceof GeminiCallError) throw error;
    throw new GeminiCallError(classifyGeminiFailure(error));
  }
}
