export type Category = "participacao" | "comportamento" | "dificuldades" | "evolucao" | "geral";

export type AttendanceStatus = "presente" | "falta" | "atraso" | "justificada";

export type ExamKind = "prova" | "trabalho" | "recuperacao";

export type ClassRoom = {
  id: string;
  name: string;
  subject: string;
};

export type Student = {
  id: string;
  classId: string;
  name: string;
};

export type Observation = {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  category: Category;
  text: string;
  source: "voz" | "texto";
  createdAt: string;
};

export type Grade = {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  title: string;
  score: number;
};

export type Attendance = {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
};

export type Exam = {
  id: string;
  classId: string;
  title: string;
  date: string;
  kind: ExamKind;
};

export type PendingItem = {
  id: string;
  classId: string;
  studentId: string | null;
  title: string;
  due: string;
  done: boolean;
};

export type PedData = {
  classes: ClassRoom[];
  students: Student[];
  observations: Observation[];
  grades: Grade[];
  attendance: Attendance[];
  exams: Exam[];
  pendings: PendingItem[];
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "participacao", label: "Participação" },
  { id: "comportamento", label: "Comportamento" },
  { id: "dificuldades", label: "Dificuldades" },
  { id: "evolucao", label: "Evolução" },
  { id: "geral", label: "Geral" },
];

export const ATTENDANCE_OPTIONS: { id: AttendanceStatus; short: string; label: string }[] = [
  { id: "presente", short: "P", label: "Presente" },
  { id: "falta", short: "F", label: "Falta" },
  { id: "atraso", short: "A", label: "Atraso" },
  { id: "justificada", short: "J", label: "Justificada" },
];

export const EXAM_KINDS: { id: ExamKind; label: string }[] = [
  { id: "prova", label: "Prova" },
  { id: "trabalho", label: "Trabalho" },
  { id: "recuperacao", label: "Recuperação" },
];

export function categoryLabel(id: Category) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Geral";
}

export function examKindLabel(id: ExamKind) {
  return EXAM_KINDS.find((k) => k.id === id)?.label ?? "Prova";
}
