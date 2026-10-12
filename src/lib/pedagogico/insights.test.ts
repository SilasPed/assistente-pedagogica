import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarizeStudent } from "./insights.ts";
import type { Student } from "./types.ts";

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
