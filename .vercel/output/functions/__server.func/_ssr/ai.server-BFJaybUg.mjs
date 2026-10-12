import { C as knownEvidenceIds, E as organizeResultSchema, M as restoreToken, T as organizeResponseSchema, a as SYSTEM_PROMPT, c as assistInputSchema, o as analysisResponseSchema, p as dossierForModel, s as analysisResultSchema, u as buildFactSheet } from "./ai-contract-CXb3E94M.mjs";
import { t as GoogleGenAI } from "../_libs/@google/genai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.server-BFJaybUg.js
var GeminiCallError = class extends Error {
	code;
	constructor(code) {
		super(code);
		this.name = "GeminiCallError";
		this.code = code;
	}
};
function classifyGeminiFailure(error) {
	if (error instanceof GeminiCallError) return error.code;
	if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) return "timeout";
	const status = typeof error === "object" && error && "status" in error ? Number(error.status) : NaN;
	if (status === 429) return "quota";
	if (status === 401 || status === 403) return "rejected";
	if (status === 408 || status === 504) return "timeout";
	return "unavailable";
}
function geminiFailureMessage(code) {
	if (code === "rejected") return "A chave do Gemini foi recusada. Confira GEMINI_API_KEY no servidor. Nada foi salvo.";
	if (code === "quota") return "O limite de uso do Gemini foi atingido. Tente mais tarde. Nada foi salvo.";
	if (code === "timeout") return "O Gemini demorou demais para responder. Tente de novo. Nada foi salvo.";
	return "O Gemini não respondeu agora. Nada foi alterado nos registros.";
}
var DEFAULT_MODEL = "gemini-flash-latest";
function geminiModel() {
	return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}
async function generateGeminiJson(args) {
	const ai = new GoogleGenAI({ apiKey: args.apiKey });
	try {
		const text = (await ai.models.generateContent({
			model: args.model,
			contents: args.user,
			config: {
				systemInstruction: args.system,
				temperature: .2,
				maxOutputTokens: 1200,
				responseMimeType: "application/json",
				responseJsonSchema: args.schema,
				abortSignal: args.signal
			}
		})).text?.trim();
		if (!text) throw new GeminiCallError("unavailable");
		return text;
	} catch (error) {
		if (error instanceof GeminiCallError) throw error;
		throw new GeminiCallError(classifyGeminiFailure(error));
	}
}
var WINDOW_MS = 6e5;
var LIMIT = 8;
var buckets = /* @__PURE__ */ new Map();
function geminiConfigured() {
	return Boolean(process.env.GEMINI_API_KEY?.trim());
}
function takeSlot(key, now) {
	const current = buckets.get(key);
	if (!current || now >= current.reset) {
		buckets.set(key, {
			count: 1,
			reset: now + WINDOW_MS
		});
		return true;
	}
	if (current.count >= LIMIT) return false;
	current.count += 1;
	return true;
}
function parseModelJson(raw) {
	const trimmed = raw.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
	return JSON.parse(trimmed);
}
function sameOrigin(input) {
	return [
		...input.observations,
		...input.grades,
		...input.attendance,
		...input.exams
	].every((row) => row.origin === input.origin);
}
function taskPrompt(input) {
	if (input.action === "organizar") return "Organize o texto original em uma observação clara e objetiva, sem acrescentar fatos. Sugira categorias pedagógicas e uma categoria de arquivo.";
	if (input.action === "parecer") return "Redija uma leitura individual para o professor revisar. Não escreva um parecer oficial fechado. Aponte só o que os fatos calculados e as evidências sustentam.";
	if (input.action === "evolucao") return "Compare os dois períodos usando apenas os registros disponíveis. Se um período estiver vazio, declare a limitação e não invente evolução.";
	return "Sugira intervenções pedagógicas práticas e individualizadas. Elas são sugestões, não decisões, e não substituem o julgamento do professor.";
}
async function assistWith(raw, options) {
	const parsed = assistInputSchema.safeParse(raw);
	if (!parsed.success) return {
		ok: false,
		code: "invalid",
		message: "Os dados enviados não puderam ser analisados. Nada foi salvo."
	};
	const input = parsed.data;
	if (!sameOrigin(input)) return {
		ok: false,
		code: "mixed",
		message: "Não dá para misturar a sala fictícia de demonstração com alunos incluídos por você. Escolha só um dos grupos."
	};
	if (input.action === "evolucao" && !input.comparePeriod) return {
		ok: false,
		code: "invalid",
		message: "Escolha o período de comparação. Nada foi salvo."
	};
	const sheet = buildFactSheet(input);
	if (!sheet.enough) return {
		ok: false,
		code: "insufficient",
		message: "Ainda não há registros suficientes para esta análise.",
		missing: sheet.missing,
		limits: sheet.limits
	};
	const apiKey = options.apiKey?.trim();
	if (!apiKey) return {
		ok: false,
		code: "unconfigured",
		message: "O assistente não está configurado neste ambiente. Defina GEMINI_API_KEY no servidor. Nada foi salvo."
	};
	const now = options.now ?? Date.now();
	if (!takeSlot(options.rateKey ?? "anonymous", now)) return {
		ok: false,
		code: "rate_limited",
		message: "Muitas análises em pouco tempo. Espere alguns minutos. Nada foi salvo."
	};
	const dossier = dossierForModel(input, sheet);
	const schema = input.action === "organizar" ? organizeResponseSchema : analysisResponseSchema;
	const user = `${taskPrompt(input)}\n\n${JSON.stringify(dossier)}`;
	const signal = AbortSignal.timeout(2e4);
	let rawText = "";
	try {
		rawText = await (options.generate ?? generateGeminiJson)({
			apiKey,
			model: options.model?.trim() || geminiModel(),
			system: SYSTEM_PROMPT,
			user,
			schema,
			signal
		});
	} catch (error) {
		const code = error instanceof GeminiCallError ? error.code : "unavailable";
		return {
			ok: false,
			code,
			message: geminiFailureMessage(code)
		};
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
				demonstrative: input.origin === "demo"
			};
		}
		const analysis = analysisResultSchema.parse(json);
		const allowed = knownEvidenceIds(sheet);
		const evidence = sheet.evidence.filter((item) => analysis.evidenceIds.includes(item.id) && allowed.has(item.id));
		const reading = restoreToken(analysis.reading, name);
		const suggestions = analysis.suggestions.map((item) => restoreToken(item, name));
		const missing = [...sheet.missing, ...analysis.missing.map((item) => restoreToken(item, name))];
		const limits = [...sheet.limits, ...analysis.limits.map((item) => restoreToken(item, name))];
		const draft = [reading, suggestions.length ? `Sugestões para revisar:\n${suggestions.map((item) => `- ${item}`).join("\n")}` : ""].filter(Boolean).join("\n\n");
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
			demonstrative: input.origin === "demo"
		};
	} catch {
		return {
			ok: false,
			code: "unavailable",
			message: "A resposta do Gemini não pôde ser usada. Nada foi alterado nos registros."
		};
	}
}
async function assist(raw, rateKey = "anonymous") {
	return assistWith(raw, {
		apiKey: process.env.GEMINI_API_KEY,
		model: geminiModel(),
		rateKey
	});
}
//#endregion
export { assist, geminiConfigured };
