import { formatDay, formatLong, fmtScore, inRange, mean } from "./dates.ts";
import { frequency } from "./insights.ts";
import type { Attendance, Grade, Observation } from "./types.ts";

export const SCHOOL_NAME = "ESCOLA CIDADÃ INTEGRAL TÉCNICA ERENICE CAVALCANTE FIDELES";
export const EMPTY_SECTION = "Não observado no período";

export type ReportDraft = {
  school: string;
  student: string;
  className: string;
  subject: string;
  teacher: string;
  place: string;
  dateLabel: string;
  periodLabel: string;
  quantitativo: string;
  comunicativos: string;
  emocionais: string;
  avancos: string;
  leitura: string;
  escrita: string;
  concentracao: string;
  outrasDificuldades: string;
  causas: string;
  intervencao: string;
  estrategias: string;
  geral: string;
};

const READING = ["leitura", " ler ", " leu ", "lendo", "leitor"];
const WRITING = ["escrita", "escrever", "escreveu", "escrevendo", "redação", "redacao"];
const FOCUS = ["concentração", "concentracao", "atenção", "atencao", "concentrou"];
const CAUSE = ["porque", "devido", "motivo", "causa"];
const INTERVENTION = ["intervenção", "intervencao", "intervir"];
const STRATEGY = ["estratégia", "estrategia", "adaptação", "adaptacao", "diferenciada"];

function hasWord(text: string, needles: string[]) {
  const padded = ` ${text.toLocaleLowerCase("pt-BR")} `;
  return needles.some((needle) => padded.includes(needle));
}

function dated(rows: Observation[]) {
  if (!rows.length) return EMPTY_SECTION;
  return rows
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map((row) => `${formatDay(row.date)} — ${row.text.trim()}`)
    .join("\n");
}

export function buildReportDraft(input: {
  studentName: string;
  className: string;
  subject: string;
  teacher: string;
  place: string;
  today: string;
  periodLabel: string;
  periodStart: string;
  periodEnd: string;
  observations: Observation[];
  grades: Grade[];
  attendance: Attendance[];
}): ReportDraft {
  const observations = input.observations.filter((row) => inRange(row.date, input.periodStart, input.periodEnd));
  const grades = input.grades.filter((row) => inRange(row.date, input.periodStart, input.periodEnd));
  const attendance = input.attendance.filter((row) => inRange(row.date, input.periodStart, input.periodEnd));
  const of = (category: Observation["category"]) => observations.filter((row) => row.category === category);
  const difficulties = of("dificuldades");
  const reading = difficulties.filter((row) => hasWord(row.text, READING));
  const writing = difficulties.filter((row) => hasWord(row.text, WRITING));
  const focus = difficulties.filter((row) => hasWord(row.text, FOCUS));
  const used = new Set([...reading, ...writing, ...focus].map((row) => row.id));
  const other = difficulties.filter((row) => !used.has(row.id));
  const avg = mean(grades.map((grade) => grade.score));
  const freq = frequency(attendance);
  const quantitativo = [
    avg == null ? `Notas: ${EMPTY_SECTION}` : `Média ${fmtScore(avg)} em ${grades.length} nota(s) registrada(s).`,
    freq ? `Frequência ${freq.pct}% (${freq.present} de ${freq.total} lançamentos).` : `Frequência: ${EMPTY_SECTION}`,
  ].join("\n");

  return {
    school: SCHOOL_NAME,
    student: input.studentName,
    className: input.className,
    subject: input.subject,
    teacher: input.teacher.trim(),
    place: input.place.trim(),
    dateLabel: formatLong(input.today),
    periodLabel: input.periodLabel,
    quantitativo,
    comunicativos: dated(of("participacao")),
    emocionais: dated(of("comportamento")),
    avancos: dated(of("evolucao")),
    leitura: dated(reading),
    escrita: dated(writing),
    concentracao: dated(focus),
    outrasDificuldades: dated(other),
    causas: dated(observations.filter((row) => hasWord(row.text, CAUSE))),
    intervencao: dated(observations.filter((row) => hasWord(row.text, INTERVENTION))),
    estrategias: dated(observations.filter((row) => hasWord(row.text, STRATEGY))),
    geral: dated(of("geral")),
  };
}
