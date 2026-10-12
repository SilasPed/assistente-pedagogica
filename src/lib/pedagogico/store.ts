import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSeed } from "@/lib/pedagogico/seed";
import type {
  Attendance,
  Exam,
  Grade,
  Observation,
  PedData,
  PendingItem,
} from "@/lib/pedagogico/types";

type Store = PedData & {
  addObservation: (input: Omit<Observation, "id" | "createdAt">) => void;
  removeObservation: (id: string) => void;
  addGrade: (input: Omit<Grade, "id">) => void;
  removeGrade: (id: string) => void;
  upsertAttendance: (input: Omit<Attendance, "id">) => void;
  togglePending: (id: string) => void;
  addPending: (input: Omit<PendingItem, "id" | "done">) => void;
  addExam: (input: Omit<Exam, "id">) => void;
  removeExam: (id: string) => void;
  addStudent: (classId: string, name: string) => void;
  resetDemo: () => void;
};

function id() {
  return crypto.randomUUID();
}

export const usePedStore = create<Store>()(
  persist(
    (set) => ({
      ...createSeed(new Date()),
      addObservation: (input) =>
        set((state) => ({
          observations: [
            { ...input, id: id(), createdAt: new Date().toISOString() },
            ...state.observations,
          ],
        })),
      removeObservation: (observationId) =>
        set((state) => ({
          observations: state.observations.filter((item) => item.id !== observationId),
        })),
      addGrade: (input) =>
        set((state) => ({
          grades: [{ ...input, id: id() }, ...state.grades],
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
          if (index === -1) {
            return { attendance: [...state.attendance, { ...input, id: id() }] };
          }
          const next = state.attendance.slice();
          next[index] = { ...next[index], status: input.status };
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
          pendings: [{ ...input, id: id(), done: false }, ...state.pendings],
        })),
      addExam: (input) =>
        set((state) => ({
          exams: [...state.exams, { ...input, id: id() }].sort((a, b) => a.date.localeCompare(b.date)),
        })),
      removeExam: (examId) =>
        set((state) => ({
          exams: state.exams.filter((item) => item.id !== examId),
        })),
      addStudent: (classId, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => ({
          students: [...state.students, { id: id(), classId, name: trimmed }],
        }));
      },
      resetDemo: () => set(createSeed(new Date())),
    }),
    {
      name: "acompanhamento-pedagogico-v1",
      skipHydration: true,
      partialize: (state) => ({
        classes: state.classes,
        students: state.students,
        observations: state.observations,
        grades: state.grades,
        attendance: state.attendance,
        exams: state.exams,
        pendings: state.pendings,
      }),
    },
  ),
);
