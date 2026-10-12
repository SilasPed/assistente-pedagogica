import { create } from "zustand";
import { restoreDemoData } from "@/lib/pedagogico/origins";
import { createSeed } from "@/lib/pedagogico/seed";
import { emptyPedData } from "@/lib/pedagogico/workspace";
import type {
  Attendance,
  Exam,
  Grade,
  Observation,
  PedData,
  PendingItem,
  RecordOrigin,
} from "@/lib/pedagogico/types";

type Store = PedData & {
  addObservation: (input: Omit<Observation, "id" | "createdAt" | "origin">) => void;
  removeObservation: (id: string) => void;
  addGrade: (input: Omit<Grade, "id" | "origin">) => void;
  removeGrade: (id: string) => void;
  upsertAttendance: (input: Omit<Attendance, "id" | "origin">) => void;
  togglePending: (id: string) => void;
  addPending: (input: Omit<PendingItem, "id" | "done" | "origin">) => void;
  addExam: (input: Omit<Exam, "id" | "origin">) => void;
  removeExam: (id: string) => void;
  addStudent: (classId: string, name: string) => void;
  resetDemo: () => void;
  replaceAll: (data: PedData) => void;
};

function id() {
  return crypto.randomUUID();
}

function originForStudent(state: PedData, studentId: string): RecordOrigin {
  return state.students.find((student) => student.id === studentId)?.origin ?? "local";
}

export const usePedStore = create<Store>()((set) => ({
  ...emptyPedData(),
      addObservation: (input) =>
        set((state) => ({
          observations: [
            {
              ...input,
              origin: originForStudent(state, input.studentId),
              id: id(),
              createdAt: new Date().toISOString(),
            },
            ...state.observations,
          ],
        })),
      removeObservation: (observationId) =>
        set((state) => ({
          observations: state.observations.filter((item) => item.id !== observationId),
        })),
      addGrade: (input) =>
        set((state) => ({
          grades: [{ ...input, origin: originForStudent(state, input.studentId), id: id() }, ...state.grades],
        })),
      removeGrade: (gradeId) =>
        set((state) => ({
          grades: state.grades.filter((item) => item.id !== gradeId),
        })),
      upsertAttendance: (input) =>
        set((state) => {
          const index = state.attendance.findIndex(
            (item) => item.studentId === input.studentId && item.date === input.date,
          );
          const origin = originForStudent(state, input.studentId);
          if (index === -1) {
            return { attendance: [...state.attendance, { ...input, origin, id: id() }] };
          }
          const next = state.attendance.slice();
          next[index] = { ...next[index], status: input.status, origin };
          return { attendance: next };
        }),
      togglePending: (pendingId) =>
        set((state) => ({
          pendings: state.pendings.map((item) =>
            item.id === pendingId ? { ...item, done: !item.done } : item,
          ),
        })),
      addPending: (input) =>
        set((state) => ({
          pendings: [
            {
              ...input,
              origin: input.studentId
                ? originForStudent(state, input.studentId)
                : (state.classes.find((room) => room.id === input.classId)?.origin ?? "local"),
              id: id(),
              done: false,
            },
            ...state.pendings,
          ],
        })),
      addExam: (input) =>
        set((state) => ({
          exams: [
            ...state.exams,
            {
              ...input,
              origin: state.classes.find((room) => room.id === input.classId)?.origin ?? "local",
              id: id(),
            },
          ].sort((a, b) => a.date.localeCompare(b.date)),
        })),
      removeExam: (examId) =>
        set((state) => ({
          exams: state.exams.filter((item) => item.id !== examId),
        })),
      addStudent: (classId, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => ({
          students: [...state.students, { id: id(), classId, name: trimmed, origin: "local" }],
        }));
      },
      resetDemo: () => set((state) => restoreDemoData(state, createSeed(new Date()))),
      replaceAll: (data) =>
        set({
          classes: data.classes,
          students: data.students,
          observations: data.observations,
          grades: data.grades,
          attendance: data.attendance,
          exams: data.exams,
          pendings: data.pendings,
        }),
    }),
);