import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizePedData, restoreDemoData } from "./origins.ts";
import type { Observation, PedData } from "./types.ts";

function observation(partial: Partial<Observation> & Pick<Observation, "id" | "studentId" | "text" | "origin">): Observation {
  return {
    classId: "7a",
    date: "2026-08-02",
    category: "geral",
    source: "texto",
    createdAt: "2026-08-02T00:00:00.000Z",
    ...partial,
  };
}

describe("registros locais e demonstração", () => {
  it("completa a origem antiga sem descartar nota isolada", () => {
    const normalized = normalizePedData({
      classes: [{ id: "7a", name: "7º A", subject: "Matemática" }],
      students: [
        { id: "alice", classId: "7a", name: "Alice Moreira" },
        { id: "real-9", classId: "7a", name: "Rita Lima" },
      ],
      grades: [{ id: "g-real", studentId: "real-9", classId: "7a", date: "2026-08-01", title: "Prova", score: 7 }],
    } as Partial<PedData>);
    assert.equal(normalized.students?.find((student) => student.id === "alice")?.origin, "demo");
    assert.equal(normalized.students?.find((student) => student.id === "real-9")?.origin, "local");
    assert.equal(normalized.grades?.length, 1);
    assert.equal(normalized.grades?.[0].origin, "local");
  });

  it("restaura a sala fictícia e preserva o que é local", () => {
    const current: PedData = {
      classes: [
        { id: "7a", name: "7º A", subject: "Matemática", origin: "demo" },
        { id: "extra", name: "1º C", subject: "História", origin: "local" },
      ],
      students: [
        { id: "alice", classId: "7a", name: "Alice Moreira", origin: "demo" },
        { id: "real-1", classId: "7a", name: "Rita Lima", origin: "local" },
      ],
      observations: [
        observation({ id: "demo-obs", studentId: "alice", text: "edição da demonstração", origin: "demo" }),
        observation({ id: "local-obs", studentId: "real-1", text: "registro deste aparelho", origin: "local" }),
      ],
      grades: [],
      attendance: [],
      exams: [],
      pendings: [],
    };
    const seed: PedData = {
      classes: [{ id: "7a", name: "7º A", subject: "Matemática", origin: "demo" }],
      students: [{ id: "alice", classId: "7a", name: "Alice Moreira", origin: "demo" }],
      observations: [observation({ id: "seed-obs", studentId: "alice", text: "sala fictícia", origin: "demo" })],
      grades: [],
      attendance: [],
      exams: [],
      pendings: [],
    };
    const restored = restoreDemoData(current, seed);
    assert.equal(restored.classes.filter((room) => room.id === "7a").length, 1);
    assert.equal(restored.classes.some((room) => room.id === "extra"), true);
    assert.equal(restored.students.some((student) => student.id === "real-1"), true);
    assert.equal(restored.observations.some((item) => item.id === "local-obs"), true);
    assert.equal(restored.observations.some((item) => item.id === "demo-obs"), false);
    assert.equal(restored.observations.some((item) => item.id === "seed-obs"), true);
  });
});
