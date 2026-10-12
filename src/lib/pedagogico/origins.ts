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
} from "@/lib/pedagogico/types";

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
  if (!input?.students?.length && !input?.observations?.length && !input?.classes?.length) return {};

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
