import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarizeStudent } from "./insights.ts";
import { upcomingExams } from "./dates.ts";
import type { Exam, Student } from "./types.ts";

const student: Student = { id: "alice", classId: "7a", name: "Alice Moreira", origin: "demo" };
const period = {
  kind: "bimester" as const,
  year: 2026,
  index: 4 as const,
  start: "2026-09-21",
  end: "2026-12-18",
  label: "4º bimestre",
  phrase: "neste bimestre",
};

describe("resumo do aluno", () => {
  it("não chama de estável um período sem nota anterior", () => {
    const summary = summarizeStudent({
      student,
      period,
      observations: [],
      grades: [{ id: "g1", studentId: "alice", classId: "7a", date: "2026-10-08", title: "Lista", score: 8.4, origin: "demo" }],
      previousGrades: [],
      attendance: [],
      nextExam: null,
    });
    assert.equal(summary.body.includes("estável"), false);
    assert.match(summary.body, /sem dados do período anterior/);
  });

  it("só compara quando existe média anterior", () => {
    const summary = summarizeStudent({
      student,
      period,
      observations: [],
      grades: [{ id: "g1", studentId: "alice", classId: "7a", date: "2026-10-08", title: "Lista", score: 8.4, origin: "demo" }],
      previousGrades: [{ id: "g0", studentId: "alice", classId: "7a", date: "2026-09-14", title: "Prova", score: 8.4, origin: "demo" }],
      attendance: [],
      nextExam: null,
    });
    assert.match(summary.body, /estável em relação ao período anterior/);
    assert.equal(summary.body.includes("sem dados do período anterior"), false);
  });
});

describe("próximas avaliações", () => {
  const exams: Exam[] = [
    { id: "old", classId: "7a", title: "Prova antiga", date: "2026-10-01", kind: "prova", origin: "demo" },
    { id: "a", classId: "7a", title: "Prova de equações", date: "2026-10-17", kind: "prova", origin: "demo" },
    { id: "b", classId: "8b", title: "Entrega do relatório reescrito", date: "2026-10-15", kind: "trabalho", origin: "demo" },
    { id: "c", classId: "7a", title: "Recuperação paralela", date: "2026-10-26", kind: "recuperacao", origin: "demo" },
  ];

  it("conta a partir de hoje e da turma, mesmo dentro do bimestre", () => {
    const today = "2026-10-12";
    assert.deepEqual(
      upcomingExams(exams, today).map((exam) => exam.id),
      ["b", "a", "c"],
    );
    assert.equal(upcomingExams(exams, today, "7a")[0]?.title, "Prova de equações");
    assert.equal(upcomingExams(exams, today, "8b")[0]?.title, "Entrega do relatório reescrito");
    assert.equal(upcomingExams(exams, today, "7a").some((exam) => exam.date < today), false);
  });
});
