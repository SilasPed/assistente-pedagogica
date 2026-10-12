import {
  countsLabel,
  firstName,
  fmtScore,
  formatDay,
  inRange,
  mean,
  possessive,
  type ResolvedPeriod,
} from "./dates.ts";
import type {
  Attendance,
  ClassRoom,
  Exam,
  Grade,
  Observation,
  Student,
} from "./types.ts";
import { categoryLabel } from "./types.ts";

export type Stat = { label: string; value: string };

export type Summary = {
  title: string;
  body: string;
  stats: Stat[];
  flags: string[];
};

export function presentish(status: Attendance["status"]) {
  return status === "presente" || status === "atraso";
}

export function frequency(rows: Attendance[]) {
  if (!rows.length) return null;
  const present = rows.filter((row) => presentish(row.status)).length;
  return { present, total: rows.length, pct: Math.round((present / rows.length) * 100) };
}

export function studentGrades(grades: Grade[], studentId: string, period: ResolvedPeriod) {
  return grades.filter(
    (grade) => grade.studentId === studentId && inRange(grade.date, period.start, period.end),
  );
}

function joinPhrase(parts: string[]) {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
}

function latestObservation(rows: Observation[]) {
  return rows.slice().sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))[0];
}

export function summarizeStudent(input: {
  student: Student;
  period: ResolvedPeriod;
  observations: Observation[];
  grades: Grade[];
  previousGrades: Grade[];
  attendance: Attendance[];
  nextExam: Exam | null;
}): Summary {
  const { student, period, observations, grades, previousGrades, attendance, nextExam } = input;
  const avg = mean(grades.map((grade) => grade.score));
  const prevAvg = mean(previousGrades.map((grade) => grade.score));
  const freq = frequency(attendance);
  const delays = attendance.filter((row) => row.status === "atraso").length;
  const justified = attendance.filter((row) => row.status === "justificada").length;
  const by = (category: Observation["category"]) =>
    observations.filter((row) => row.category === category).length;

  const facts: string[] = [];
  if (avg != null) {
    let sentence = `média ${fmtScore(avg)}`;
    if (prevAvg == null) sentence += ", sem dados do período anterior";
    else {
      const delta = avg - prevAvg;
      if (Math.abs(delta) < 0.25) sentence += ", estável em relação ao período anterior";
      else if (delta > 0) sentence += ` — ${fmtScore(delta)} acima do período anterior`;
      else sentence += ` — ${fmtScore(Math.abs(delta))} abaixo do período anterior`;
    }
    facts.push(sentence);
  }
  if (freq) {
    facts.push(`frequência de ${freq.pct}% (${freq.present} de ${freq.total})`);
  }

  let body = facts.length
    ? `${student.name} está com ${joinPhrase(facts)}.`
    : `${student.name} ainda não tem nota nem frequência ${period.phrase}.`;

  if (!observations.length) {
    body += " Não há observação qualitativa neste período.";
  } else {
    const pieces = [
      by("evolucao")
        ? countsLabel(by("evolucao"), "registro de evolução", "registros de evolução")
        : "",
      by("dificuldades")
        ? countsLabel(by("dificuldades"), "registro de dificuldade", "registros de dificuldade")
        : "",
      by("participacao")
        ? countsLabel(by("participacao"), "registro de participação", "registros de participação")
        : "",
      by("comportamento")
        ? countsLabel(by("comportamento"), "registro de comportamento", "registros de comportamento")
        : "",
      by("geral") ? countsLabel(by("geral"), "registro geral", "registros gerais") : "",
    ].filter(Boolean);
    body += ` Entre ${countsLabel(observations.length, "observação", "observações")}`;
    body += pieces.length ? `, ${joinPhrase(pieces)}.` : ".";
    const latest = latestObservation(observations);
    if (latest) {
      body += ` O mais recente (${formatDay(latest.date)}, ${categoryLabel(latest.category).toLowerCase()}): “${latest.text}”`;
    }
  }

  const flags: string[] = [];
  if (freq && freq.pct < 75) flags.push("Frequência abaixo de 75%");
  if (avg != null && avg < 6) flags.push("Média abaixo de 6");
  if (by("dificuldades") >= 2 && by("evolucao") === 0) flags.push("Dificuldade sem evolução registrada");
  if (delays >= 3) flags.push(countsLabel(delays, "atraso", "atrasos"));
  if (justified > 0) flags.push(countsLabel(justified, "falta justificada", "faltas justificadas"));
  if (flags.length) body += ` Atenção: ${joinPhrase(flags.map((flag) => flag.toLowerCase()))}.`;
  if (nextExam) body += ` Próxima avaliação da turma: ${nextExam.title}, ${formatDay(nextExam.date)}.`;

  return {
    title: `Evolução ${possessive(student.name)} ${firstName(student.name)} ${period.phrase}`,
    body,
    stats: [
      { label: "Média", value: avg == null ? "—" : fmtScore(avg) },
      { label: "Frequência", value: freq ? `${freq.pct}%` : "—" },
      { label: "Observações", value: String(observations.length) },
    ],
    flags,
  };
}

export function summarizeClass(input: {
  classRoom: ClassRoom;
  students: Student[];
  period: ResolvedPeriod;
  observations: Observation[];
  grades: Grade[];
  attendance: Attendance[];
  nextExam: Exam | null;
}): Summary {
  const { classRoom, students, period, observations, grades, attendance, nextExam } = input;
  const averages = students
    .map((student) => mean(grades.filter((grade) => grade.studentId === student.id).map((g) => g.score)))
    .filter((value): value is number => value != null);
  const freqs = students
    .map((student) => frequency(attendance.filter((row) => row.studentId === student.id)))
    .filter((value): value is NonNullable<typeof value> => value != null);
  const avg = mean(averages);
  const freq = freqs.length
    ? Math.round(freqs.reduce((sum, row) => sum + row.pct, 0) / freqs.length)
    : null;
  const watch = attentionForClass({ students, observations, grades, attendance }).slice(0, 3);

  let body = `${classRoom.name} de ${classRoom.subject} reúne ${countsLabel(students.length, "aluno", "alunos")}.`;
  if (avg != null || freq != null) {
    const bits = [
      avg != null ? `média da turma ${fmtScore(avg)}` : "",
      freq != null ? `frequência média ${freq}%` : "",
    ].filter(Boolean);
    body += ` ${period.phrase[0].toUpperCase()}${period.phrase.slice(1)}, ${joinPhrase(bits)}.`;
  } else {
    body += ` Ainda não há nota nem frequência ${period.phrase}.`;
  }
  body += observations.length
    ? ` ${countsLabel(observations.length, "observação registrada", "observações registradas")}.`
    : " Nenhuma observação qualitativa neste período.";
  if (watch.length) {
    body += ` Pedem olhar mais de perto: ${joinPhrase(
      watch.map((item) => `${firstName(item.student.name)} (${item.reasons[0].toLowerCase()})`),
    )}.`;
  } else if (students.length) {
    body += " Nenhum aluno isolado em atenção com os critérios atuais.";
  }
  if (nextExam) body += ` Próxima avaliação: ${nextExam.title}, ${formatDay(nextExam.date)}.`;

  return {
    title: `Panorama do ${classRoom.name} ${period.phrase}`,
    body,
    stats: [
      { label: "Média", value: avg == null ? "—" : fmtScore(avg) },
      { label: "Frequência", value: freq == null ? "—" : `${freq}%` },
      { label: "Observações", value: String(observations.length) },
    ],
    flags: watch.map((item) => `${firstName(item.student.name)} · ${item.reasons[0]}`),
  };
}

export type AttentionItem = {
  student: Student;
  reasons: string[];
};

export function attentionForClass(input: {
  students: Student[];
  observations: Observation[];
  grades: Grade[];
  attendance: Attendance[];
}): AttentionItem[] {
  const items: AttentionItem[] = [];
  for (const student of input.students) {
    const grades = input.grades.filter((grade) => grade.studentId === student.id);
    const attendance = input.attendance.filter((row) => row.studentId === student.id);
    const observations = input.observations.filter((row) => row.studentId === student.id);
    const avg = mean(grades.map((grade) => grade.score));
    const freq = frequency(attendance);
    const delays = attendance.filter((row) => row.status === "atraso").length;
    const difficulties = observations.filter((row) => row.category === "dificuldades").length;
    const growth = observations.filter((row) => row.category === "evolucao").length;
    const reasons: string[] = [];
    if (freq && freq.total >= 4 && freq.pct < 75) reasons.push(`Frequência ${freq.pct}%`);
    if (avg != null && avg < 6) reasons.push(`Média ${fmtScore(avg)}`);
    if (difficulties >= 2 && growth === 0) reasons.push("Dificuldade sem evolução");
    if (delays >= 3) reasons.push(countsLabel(delays, "atraso", "atrasos"));
    if (reasons.length) items.push({ student, reasons });
  }
  return items.sort((a, b) => b.reasons.length - a.reasons.length || a.student.name.localeCompare(b.student.name, "pt-BR"));
}

export function suggestCategory(text: string): Observation["category"] | null {
  const value = text.toLowerCase();
  if (/evolu|melhor|avanç|progred|sozinh/.test(value)) return "evolucao";
  if (/dificuld|não conseguiu|nao conseguiu|travou|confund/.test(value)) return "dificuldades";
  if (/particip|levantou a mão|levantou a mao|colabor/.test(value)) return "participacao";
  if (/comport|indisciplin|atras|interromp|conversou/.test(value)) return "comportamento";
  return null;
}
