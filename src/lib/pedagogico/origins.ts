import type {
  Attendance,
  ClassRoom,
  Exam,
  Grade,
  Observation,
  PedData,
  PendingItem,
  RecordOrigin,
  Student,
} from "./types.ts";

export const DEMO_CLASS_IDS = new Set(["7a", "8b"]);

export const DEMO_STUDENT_IDS = new Set([
  "alice",
  "bruno",
  "camila",
  "diego",
  "elena",
  "felipe",
  "helena",
  "igor",
  "julia",
  "kaique",
  "lara",
  "miguel",
]);

function asOrigin(value: unknown, fallback: RecordOrigin): RecordOrigin {
  return value === "demo" || value === "local" ? value : fallback;
}

export function classOrigin(classId: string, current?: unknown): RecordOrigin {
  if (current === "demo" || current === "local") return current;
  return DEMO_CLASS_IDS.has(classId) ? "demo" : "local";
}

export function studentOrigin(student: { id: string; origin?: unknown }): RecordOrigin {
  if (student.origin === "demo" || student.origin === "local") return student.origin;
  return DEMO_STUDENT_IDS.has(student.id) ? "demo" : "local";
}

export function normalizePedData(input: Partial<PedData> | null | undefined): Partial<PedData> {
  if (!input) return {};
  const collections = [
    input?.classes,
    input?.students,
    input?.observations,
    input?.grades,
    input?.attendance,
    input?.exams,
    input?.pendings,
  ];
  if (!collections.some((rows) => Array.isArray(rows) && rows.length > 0)) return {};

  const classes: ClassRoom[] = (input.classes ?? []).map((room) => ({
    ...room,
    origin: classOrigin(room.id, room.origin),
  }));
  const students: Student[] = (input.students ?? []).map((student) => ({
    ...student,
    origin: studentOrigin(student),
  }));
  const originOfStudent = (studentId: string | null) =>
    students.find((student) => student.id === studentId)?.origin ?? "local";

  const observations: Observation[] = (input.observations ?? []).map((row) => ({
    ...row,
    origin: asOrigin(row.origin, originOfStudent(row.studentId)),
  }));
  const grades: Grade[] = (input.grades ?? []).map((row) => ({
    ...row,
    origin: asOrigin(row.origin, originOfStudent(row.studentId)),
  }));
  const attendance: Attendance[] = (input.attendance ?? []).map((row) => ({
    ...row,
    origin: asOrigin(row.origin, originOfStudent(row.studentId)),
  }));
  const exams: Exam[] = (input.exams ?? []).map((row) => ({
    ...row,
    origin: asOrigin(row.origin, classOrigin(row.classId)),
  }));
  const pendings: PendingItem[] = (input.pendings ?? []).map((row) => ({
    ...row,
    origin: asOrigin(row.origin, row.studentId ? originOfStudent(row.studentId) : classOrigin(row.classId)),
  }));

  return { classes, students, observations, grades, attendance, exams, pendings };
}

function localRows<T extends { origin: RecordOrigin }>(rows: T[]) {
  return rows.filter((row) => row.origin === "local");
}

/** Recria a sala fictícia e preserva o que foi incluído neste aparelho. */
export function restoreDemoData(current: PedData, seed: PedData): PedData {
  const seedClassIds = new Set(seed.classes.map((room) => room.id));
  return {
    classes: [...seed.classes, ...current.classes.filter((room) => room.origin === "local" && !seedClassIds.has(room.id))],
    students: [...seed.students, ...localRows(current.students)],
    observations: [...seed.observations, ...localRows(current.observations)],
    grades: [...seed.grades, ...localRows(current.grades)],
    attendance: [...seed.attendance, ...localRows(current.attendance)],
    exams: [...seed.exams, ...localRows(current.exams)],
    pendings: [...seed.pendings, ...localRows(current.pendings)],
  };
}
