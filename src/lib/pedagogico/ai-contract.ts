import { z } from "zod";
import { fmtScore, inRange, mean } from "./dates.ts";
import { frequency } from "./insights.ts";
import { categoryLabel, type Category } from "./types.ts";

export const AI_TAGS = [
  "participacao",
  "aprendizagem",
  "autonomia",
  "frequencia",
  "interacao",
  "atividades",
  "acompanhamento",
] as const;

export const AI_TAG_LABELS: Record<(typeof AI_TAGS)[number], string> = {
  participacao: "Participação",
  aprendizagem: "Aprendizagem",
  autonomia: "Autonomia",
  frequencia: "Frequência",
  interacao: "Interação",
  atividades: "Cumprimento de atividades",
  acompanhamento: "Pontos para acompanhar",
};

const STORED_CATEGORIES = ["participacao", "comportamento", "dificuldades", "evolucao", "geral"] as const;
const originSchema = z.enum(["demo", "local"]);
const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const periodSchema = z.object({
  label: z.string().trim().min(1).max(60),
  start: daySchema,
  end: daySchema,
});

export const assistInputSchema = z
  .object({
    action: z.enum(["organizar", "parecer", "evolucao", "intervencoes"]),
    origin: originSchema,
    student: z.object({
      id: z.string().trim().min(1).max(80),
      name: z.string().trim().min(1).max(80),
      className: z.string().trim().min(1).max(40),
      subject: z.string().trim().min(1).max(40),
    }),
    period: periodSchema,
    comparePeriod: periodSchema.optional(),
    rawText: z.string().max(4000).optional(),
    observations: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(80),
          date: daySchema,
          category: z.string().trim().min(1).max(40),
          text: z.string().trim().min(1).max(2000),
          origin: originSchema,
        }),
      )
      .max(40),
    grades: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(80),
          date: daySchema,
          title: z.string().trim().min(1).max(80),
          score: z.number().min(0).max(10),
          origin: originSchema,
        }),
      )
      .max(40),
    attendance: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(80),
          date: daySchema,
          status: z.enum(["presente", "falta", "atraso", "justificada"]),
          origin: originSchema,
        }),
      )
      .max(80),
    exams: z
      .array(
        z.object({
          id: z.string().trim().min(1).max(80),
          date: daySchema,
          title: z.string().trim().min(1).max(80),
          origin: originSchema,
        }),
      )
      .max(12),
  })
  .strict();

export type AssistInput = z.infer<typeof assistInputSchema>;

export type Evidence = { id: string; label: string; text: string };

export type FactSheet = {
  facts: string[];
  missing: string[];
  limits: string[];
  evidence: Evidence[];
  enough: boolean;
};

const TOKEN = "[[A1]]";

export function maskNames(text: string, name: string) {
  const first = name.split(" ")[0] ?? name;
  const ordered = [name, first].filter((part, index, list) => part.length > 2 && list.indexOf(part) === index);
  let masked = text;
  for (const part of ordered.sort((a, b) => b.length - a.length)) {
    masked = masked.split(part).join(TOKEN);
  }
  return masked;
}

export function restoreToken(text: string, name: string) {
  return text.split(TOKEN).join(name);
}

export function buildFactSheet(input: AssistInput): FactSheet {
  const periodObs = input.observations.filter((row) => inRange(row.date, input.period.start, input.period.end));
  const periodGrades = input.grades.filter((row) => inRange(row.date, input.period.start, input.period.end));
  const periodAttendance = input.attendance.filter((row) => inRange(row.date, input.period.start, input.period.end));
  const compareObs = input.comparePeriod
    ? input.observations.filter((row) => inRange(row.date, input.comparePeriod!.start, input.comparePeriod!.end))
    : [];
  const compareGrades = input.comparePeriod
    ? input.grades.filter((row) => inRange(row.date, input.comparePeriod!.start, input.comparePeriod!.end))
    : [];
  const compareAttendance = input.comparePeriod
    ? input.attendance.filter((row) => inRange(row.date, input.comparePeriod!.start, input.comparePeriod!.end))
    : [];

  const evidence: Evidence[] = [
    ...input.observations.map((row) => ({
      id: row.id,
      label: `${row.date} · ${categoryLabel(row.category as Category)}`,
      text: row.text,
    })),
    ...input.grades.map((row) => ({
      id: row.id,
      label: `${row.date} · ${row.title}`,
      text: `Nota registrada: ${fmtScore(row.score)}`,
    })),
    ...input.attendance
      .filter((row) => row.status !== "presente")
      .map((row) => ({
        id: row.id,
        label: `${row.date} · frequência`,
        text:
          row.status === "falta" ? "Falta registrada" : row.status === "atraso" ? "Atraso registrado" : "Falta justificada registrada",
      })),
  ];

  const facts: string[] = [];
  const missing: string[] = [];
  const limits: string[] = [];

  const describePeriod = (
    label: string,
    observations: typeof periodObs,
    grades: typeof periodGrades,
    attendance: typeof periodAttendance,
  ) => {
    if (!observations.length && !grades.length && !attendance.length) {
      limits.push(`Não há registros em ${label}. Nenhuma evolução ou conclusão pode ser afirmada nesse intervalo.`);
      return;
    }
    const avg = mean(grades.map((grade) => grade.score));
    const freq = frequency(
      attendance.map((row) => ({
        id: row.id,
        studentId: input.student.id,
        classId: "",
        date: row.date,
        status: row.status,
        origin: row.origin,
      })),
    );
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
      return { facts, missing, limits, evidence: [], enough: false };
    }
    facts.push("O texto abaixo é o único material desta organização. Nada além dele foi registrado aqui.");
    return { facts, missing, limits, evidence: [{ id: "rascunho", label: "Texto original", text }], enough: true };
  }

  describePeriod(input.period.label, periodObs, periodGrades, periodAttendance);
  if (input.action === "evolucao") {
    if (!input.comparePeriod) {
      missing.push("Falta o período de comparação.");
      return { facts, missing, limits, evidence, enough: false };
    }
    describePeriod(input.comparePeriod.label, compareObs, compareGrades, compareAttendance);
  }

  const currentCount = periodObs.length + periodGrades.length + periodAttendance.length;
  const compareCount = compareObs.length + compareGrades.length + compareAttendance.length;
  const enough = input.action === "evolucao" ? currentCount + compareCount > 0 : currentCount > 0;
  if (!enough) {
    missing.push("Não há observação, nota nem frequência desse estudante no período pedido.");
  }
  return { facts, missing, limits, evidence, enough };
}

export function dossierForModel(input: AssistInput, sheet: FactSheet) {
  const mask = (value: string) => maskNames(value, input.student.name);
  return {
    aluno: TOKEN,
    turma: input.student.className,
    componente: input.student.subject,
    origem: input.origin === "demo" ? "dados fictícios de demonstração" : "registros locais do aparelho",
    periodo: input.period,
    periodoComparado: input.comparePeriod ?? null,
    fatosCalculadosPeloSistema: sheet.facts.map(mask),
    lacunas: sheet.missing,
    limitacoes: sheet.limits,
    evidencias: sheet.evidence.map((item) => ({
      id: item.id,
      rotulo: mask(item.label),
      texto: mask(item.text),
    })),
    textoOriginal: input.action === "organizar" ? mask(input.rawText?.trim() ?? "") : undefined,
  };
}

export const organizeResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    organizedText: { type: "string" },
    tags: { type: "array", items: { type: "string", enum: [...AI_TAGS] } },
    storedCategory: { type: "string", enum: [...STORED_CATEGORIES] },
    caution: { type: "string" },
  },
  required: ["organizedText", "tags", "storedCategory"],
} as const;

export const analysisResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reading: { type: "string" },
    suggestions: { type: "array", items: { type: "string" } },
    evidenceIds: { type: "array", items: { type: "string" } },
    missing: { type: "array", items: { type: "string" } },
    limits: { type: "array", items: { type: "string" } },
  },
  required: ["reading", "suggestions", "evidenceIds", "missing", "limits"],
} as const;

export const organizeResultSchema = z.object({
  organizedText: z.string().trim().min(1).max(2500),
  tags: z.array(z.enum(AI_TAGS)).max(5),
  storedCategory: z.enum(STORED_CATEGORIES),
  caution: z.string().max(400).optional(),
});

export const analysisResultSchema = z.object({
  reading: z.string().trim().min(1).max(4000),
  suggestions: z.array(z.string().trim().min(1).max(500)).max(6),
  evidenceIds: z.array(z.string()).max(12),
  missing: z.array(z.string().trim().max(300)).max(8),
  limits: z.array(z.string().trim().max(300)).max(6),
});

export function knownEvidenceIds(sheet: FactSheet) {
  return new Set(sheet.evidence.map((item) => item.id));
}

export const SYSTEM_PROMPT = [
  "Você ajuda um professor a organizar registros e a redigir uma leitura para ele revisar.",
  "Use somente o JSON enviado. Não invente notas, faltas, datas, comportamentos, diagnósticos ou causas.",
  "Não atribua diagnóstico psicológico, médico ou rótulo definitivo.",
  "Não transforme correlação em causa. Hipótese fica marcada como hipótese.",
  "Se um período não tiver registros, diga isso e não preencha a lacuna.",
  "Chame a pessoa apenas de [[A1]].",
  "evidenceIds só pode repetir ids que já estão nas evidências.",
  "Responda apenas JSON no esquema pedido.",
].join(" ");
