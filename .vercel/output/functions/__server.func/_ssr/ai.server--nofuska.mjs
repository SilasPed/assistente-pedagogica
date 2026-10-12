import { d as fmtScore, g as inRange, h as frequency, s as categoryLabel, t as AI_TAGS, v as mean } from "./insights-DdMgi_fN.mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { t as GoogleGenAI } from "../_libs/@google/genai.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.server--nofuska.js
var STORED_CATEGORIES = [
	"participacao",
	"comportamento",
	"dificuldades",
	"evolucao",
	"geral"
];
var originSchema = _enum(["demo", "local"]);
var daySchema = string().regex(/^\d{4}-\d{2}-\d{2}$/);
var periodSchema = object({
	label: string().trim().min(1).max(60),
	start: daySchema,
	end: daySchema
});
var assistInputSchema = object({
	action: _enum([
		"organizar",
		"parecer",
		"evolucao",
		"intervencoes"
	]),
	origin: originSchema,
	student: object({
		id: string().trim().min(1).max(80),
		name: string().trim().min(1).max(80),
		className: string().trim().min(1).max(40),
		subject: string().trim().min(1).max(40)
	}),
	period: periodSchema,
	comparePeriod: periodSchema.optional(),
	rawText: string().max(4e3).optional(),
	observations: array(object({
		id: string().trim().min(1).max(80),
		date: daySchema,
		category: string().trim().min(1).max(40),
		text: string().trim().min(1).max(2e3),
		origin: originSchema
	})).max(40),
	grades: array(object({
		id: string().trim().min(1).max(80),
		date: daySchema,
		title: string().trim().min(1).max(80),
		score: number().min(0).max(10),
		origin: originSchema
	})).max(40),
	attendance: array(object({
		id: string().trim().min(1).max(80),
		date: daySchema,
		status: _enum([
			"presente",
			"falta",
			"atraso",
			"justificada"
		]),
		origin: originSchema
	})).max(80),
	exams: array(object({
		id: string().trim().min(1).max(80),
		date: daySchema,
		title: string().trim().min(1).max(80),
		origin: originSchema
	})).max(12)
}).strict();
var TOKEN = "[[A1]]";
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function maskNames(text, name) {
	const trimmed = name.trim();
	const parts = trimmed.split(/\s+/).filter((part) => part.length > 2);
	const needles = [.../* @__PURE__ */ new Set([trimmed, ...parts])].filter((part) => part.length > 2);
	needles.sort((a, b) => b.length - a.length);
	let masked = text;
	for (const part of needles) {
		const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(part)}(?![\\p{L}\\p{N}])`, "giu");
		masked = masked.replace(pattern, TOKEN);
	}
	return masked;
}
function restoreToken(text, name) {
	return text.split(TOKEN).join(name);
}
function buildFactSheet(input) {
	const periodObs = input.observations.filter((row) => inRange(row.date, input.period.start, input.period.end));
	const periodGrades = input.grades.filter((row) => inRange(row.date, input.period.start, input.period.end));
	const periodAttendance = input.attendance.filter((row) => inRange(row.date, input.period.start, input.period.end));
	const compareObs = input.comparePeriod ? input.observations.filter((row) => inRange(row.date, input.comparePeriod.start, input.comparePeriod.end)) : [];
	const compareGrades = input.comparePeriod ? input.grades.filter((row) => inRange(row.date, input.comparePeriod.start, input.comparePeriod.end)) : [];
	const compareAttendance = input.comparePeriod ? input.attendance.filter((row) => inRange(row.date, input.comparePeriod.start, input.comparePeriod.end)) : [];
	const cited = (date) => {
		if (inRange(date, input.period.start, input.period.end)) return true;
		return Boolean(input.action === "evolucao" && input.comparePeriod && inRange(date, input.comparePeriod.start, input.comparePeriod.end));
	};
	const evidence = [
		...input.observations.filter((row) => cited(row.date)).map((row) => ({
			id: row.id,
			label: `${row.date} · ${categoryLabel(row.category)}`,
			text: row.text
		})),
		...input.grades.filter((row) => cited(row.date)).map((row) => ({
			id: row.id,
			label: `${row.date} · ${row.title}`,
			text: `Nota registrada: ${fmtScore(row.score)}`
		})),
		...input.attendance.filter((row) => cited(row.date) && row.status !== "presente").map((row) => ({
			id: row.id,
			label: `${row.date} · frequência`,
			text: row.status === "falta" ? "Falta registrada" : row.status === "atraso" ? "Atraso registrado" : "Falta justificada registrada"
		}))
	];
	const facts = [];
	const missing = [];
	const limits = [];
	const describePeriod = (label, observations, grades, attendance) => {
		if (!observations.length && !grades.length && !attendance.length) {
			limits.push(`Não há registros em ${label}. Nenhuma evolução ou conclusão pode ser afirmada nesse intervalo.`);
			return;
		}
		const avg = mean(grades.map((grade) => grade.score));
		const freq = frequency(attendance.map((row) => ({
			id: row.id,
			studentId: input.student.id,
			classId: "",
			date: row.date,
			status: row.status,
			origin: row.origin
		})));
		if (avg != null) facts.push(`${label}: média ${fmtScore(avg)} em ${grades.length} nota(s) registrada(s).`);
		else missing.push(`${label}: não há notas lançadas.`);
		if (freq) facts.push(`${label}: frequência ${freq.pct}% (${freq.present} de ${freq.total} lançamentos).`);
		else missing.push(`${label}: não há lançamentos de frequência.`);
		if (observations.length) facts.push(`${label}: ${observations.length} observação(ões) qualitativa(s).`);
		else missing.push(`${label}: não há observação qualitativa.`);
	};
	if (input.action === "organizar") {
		const text = input.rawText?.trim() ?? "";
		if (text.length < 15) {
			missing.push("Falta um texto ou uma transcrição com pelo menos uma frase.");
			return {
				facts,
				missing,
				limits,
				evidence: [],
				enough: false
			};
		}
		facts.push("O texto abaixo é o único material desta organização. Nada além dele foi registrado aqui.");
		return {
			facts,
			missing,
			limits,
			evidence: [{
				id: "rascunho",
				label: "Texto original",
				text
			}],
			enough: true
		};
	}
	describePeriod(input.period.label, periodObs, periodGrades, periodAttendance);
	if (input.action === "evolucao") {
		if (!input.comparePeriod) {
			missing.push("Falta o período de comparação.");
			return {
				facts,
				missing,
				limits,
				evidence,
				enough: false
			};
		}
		describePeriod(input.comparePeriod.label, compareObs, compareGrades, compareAttendance);
	}
	const currentCount = periodObs.length + periodGrades.length + periodAttendance.length;
	const compareCount = compareObs.length + compareGrades.length + compareAttendance.length;
	const enough = input.action === "evolucao" ? currentCount + compareCount > 0 : currentCount > 0;
	if (!enough) missing.push("Não há observação, nota nem frequência desse estudante no período pedido.");
	return {
		facts,
		missing,
		limits,
		evidence,
		enough
	};
}
function dossierForModel(input, sheet) {
	const mask = (value) => maskNames(value, input.student.name);
	return {
		aluno: TOKEN,
		turma: input.student.className,
		componente: input.student.subject,
		origem: input.origin === "demo" ? "dados fictícios de demonstração" : "registros locais do aparelho",
		periodo: input.period,
		periodoComparado: input.action === "evolucao" ? input.comparePeriod ?? null : null,
		fatosCalculadosPeloSistema: sheet.facts.map(mask),
		lacunas: sheet.missing,
		limitacoes: sheet.limits,
		evidencias: sheet.evidence.map((item, index) => ({
			id: `e${index + 1}`,
			rotulo: mask(item.label),
			texto: mask(item.text)
		})),
		textoOriginal: input.action === "organizar" ? mask(input.rawText?.trim() ?? "") : void 0
	};
}
function evidenceFromModelIds(sheet, ids) {
	const byPublic = new Map(sheet.evidence.map((item, index) => [`e${index + 1}`, item]));
	const seen = /* @__PURE__ */ new Set();
	const picked = [];
	for (const id of ids) {
		const item = byPublic.get(id);
		if (!item || seen.has(item.id)) continue;
		seen.add(item.id);
		picked.push(item);
	}
	return picked;
}
var organizeResponseSchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		organizedText: { type: "string" },
		tags: {
			type: "array",
			items: {
				type: "string",
				enum: [...AI_TAGS]
			}
		},
		storedCategory: {
			type: "string",
			enum: [...STORED_CATEGORIES]
		},
		caution: { type: "string" }
	},
	required: [
		"organizedText",
		"tags",
		"storedCategory"
	]
};
var analysisResponseSchema = {
	type: "object",
	additionalProperties: false,
	properties: {
		reading: { type: "string" },
		suggestions: {
			type: "array",
			items: { type: "string" }
		},
		evidenceIds: {
			type: "array",
			items: { type: "string" }
		},
		missing: {
			type: "array",
			items: { type: "string" }
		},
		limits: {
			type: "array",
			items: { type: "string" }
		}
	},
	required: [
		"reading",
		"suggestions",
		"evidenceIds",
		"missing",
		"limits"
	]
};
var organizeResultSchema = object({
	organizedText: string().trim().min(1).max(2500),
	tags: array(_enum(AI_TAGS)).max(5),
	storedCategory: _enum(STORED_CATEGORIES),
	caution: string().max(400).optional()
});
var analysisResultSchema = object({
	reading: string().trim().min(1).max(4e3),
	suggestions: array(string().trim().min(1).max(500)).max(6),
	evidenceIds: array(string()).max(12),
	missing: array(string().trim().max(300)).max(8),
	limits: array(string().trim().max(300)).max(6)
});
var SYSTEM_PROMPT = [
	"Você ajuda um professor a organizar registros e a redigir uma leitura para ele revisar.",
	"Use somente o JSON enviado. Não invente notas, faltas, datas, comportamentos, diagnósticos ou causas.",
	"Não atribua diagnóstico psicológico, médico ou rótulo definitivo.",
	"Não transforme correlação em causa. Hipótese fica marcada como hipótese.",
	"Se um período não tiver registros, diga isso e não preencha a lacuna.",
	"Chame a pessoa apenas de [[A1]].",
	"evidenceIds só pode repetir ids que já estão nas evidências.",
	"Responda apenas JSON no esquema pedido."
].join(" ");
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
var INSTANCE_LIMIT = 40;
var buckets = /* @__PURE__ */ new Map();
function geminiConfigured() {
	return Boolean(process.env.GEMINI_API_KEY?.trim());
}
function rateKeyFromHeaders(headers) {
	const real = headers?.get("x-real-ip")?.split(",")[0]?.trim() ?? "";
	if (real && real.length <= 80 && /^[0-9a-fA-F:.]+$/.test(real)) return `ip:${real}`;
	return "unverified";
}
function bucketAllows(key, now, limit) {
	const current = buckets.get(key);
	if (!current || now >= current.reset) return true;
	return current.count < limit;
}
function bucketCommit(key, now) {
	const current = buckets.get(key);
	if (!current || now >= current.reset) {
		buckets.set(key, {
			count: 1,
			reset: now + WINDOW_MS
		});
		return;
	}
	current.count += 1;
}
function takeSlot(key, now) {
	const caller = `caller:${key}`;
	if (!bucketAllows(caller, now, LIMIT) || !bucketAllows("instance", now, INSTANCE_LIMIT)) return false;
	bucketCommit(caller, now);
	bucketCommit("instance", now);
	return true;
}
function payloadTooLarge(raw) {
	if (!raw || typeof raw !== "object") return false;
	const row = raw;
	const len = (key) => Array.isArray(row[key]) ? row[key].length : 0;
	return len("observations") > 40 || len("grades") > 40 || len("attendance") > 80 || len("exams") > 12 || typeof row.rawText === "string" && row.rawText.length > 4e3;
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
		message: payloadTooLarge(raw) ? "Há registros demais neste pedido. Reduza o período. Nada foi salvo." : "Os dados enviados não puderam ser analisados. Nada foi salvo."
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
		const evidence = evidenceFromModelIds(sheet, analysis.evidenceIds);
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
export { assist, geminiConfigured, rateKeyFromHeaders };
