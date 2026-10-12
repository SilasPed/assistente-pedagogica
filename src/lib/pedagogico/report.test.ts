import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Packer } from "docx";
import { buildReportDraft, EMPTY_SECTION, SCHOOL_NAME } from "./report.ts";
import { reportDocument } from "./report-docx.ts";
import type { Observation } from "./types.ts";

function note(partial: Partial<Observation> & Pick<Observation, "id" | "category" | "text" | "date">): Observation {
  return {
    studentId: "s1",
    classId: "7a",
    source: "texto",
    createdAt: "2026-08-12T00:00:00.000Z",
    origin: "local",
    ...partial,
  };
}

const base = {
  studentName: "Rita Lima",
  className: "7º A",
  subject: "Matemática",
  teacher: "Professora Helena",
  place: "",
  today: "2026-10-12",
  periodLabel: "3º bimestre",
  periodStart: "2026-08-03",
  periodEnd: "2026-09-18",
  observations: [] as Observation[],
  grades: [],
  attendance: [],
};

describe("parecer individual", () => {
  it("não inventa texto quando o período não tem registro", () => {
    const draft = buildReportDraft(base);
    assert.equal(draft.school, SCHOOL_NAME);
    for (const value of [
      draft.comunicativos,
      draft.emocionais,
      draft.avancos,
      draft.leitura,
      draft.escrita,
      draft.concentracao,
      draft.outrasDificuldades,
      draft.causas,
      draft.intervencao,
      draft.estrategias,
      draft.geral,
    ]) {
      assert.equal(value, EMPTY_SECTION);
    }
    assert.match(draft.quantitativo, /Não observado no período/);
    assert.equal(draft.place, "");
  });

  it("separa categoria, dificuldade nomeada e causa explícita", () => {
    const draft = buildReportDraft({
      ...base,
      observations: [
        note({ id: "1", date: "2026-08-10", category: "participacao", text: "Explicou o exercício para a dupla." }),
        note({ id: "2", date: "2026-08-11", category: "dificuldades", text: "Errou a conta de frações." }),
        note({ id: "3", date: "2026-08-12", category: "dificuldades", text: "A leitura ainda é silabada." }),
        note({ id: "4", date: "2026-08-13", category: "comportamento", text: "Chegou agitado porque não dormiu." }),
        note({ id: "5", date: "2026-08-14", category: "evolucao", text: "Passou a conferir o sinal antes de entregar." }),
        note({ id: "6", date: "2026-01-02", category: "geral", text: "Registro antigo que não entra." }),
      ],
      grades: [{ id: "g", studentId: "s1", classId: "7a", date: "2026-08-20", title: "Prova", score: 8, origin: "local" }],
    });
    assert.match(draft.comunicativos, /Explicou o exercício/);
    assert.equal(draft.emocionais.includes("Explicou"), false);
    assert.match(draft.outrasDificuldades, /frações/);
    assert.equal(draft.leitura.includes("frações"), false);
    assert.match(draft.leitura, /silabada/);
    assert.match(draft.causas, /não dormiu/);
    assert.equal(draft.causas.includes("frações"), false);
    assert.match(draft.avancos, /conferir o sinal/);
    assert.equal(draft.geral, EMPTY_SECTION);
    assert.equal(draft.intervencao, EMPTY_SECTION);
    assert.equal(draft.estrategias, EMPTY_SECTION);
    assert.match(draft.quantitativo, /8,0/);
    assert.equal(draft.comunicativos.includes("Registro antigo"), false);
  });

  it("gera um .docx compactado", async () => {
    const buffer = await Packer.toBuffer(reportDocument(buildReportDraft(base)));
    assert.equal(buffer.subarray(0, 2).toString(), "PK");
    assert.ok(buffer.length > 1000);
  });
});
