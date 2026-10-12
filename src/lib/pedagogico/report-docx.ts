import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { ReportDraft } from "./report.ts";

const FONT = "Times New Roman";
const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const LINE = { style: BorderStyle.SINGLE, size: 4, color: "1F3A42" };

function run(text: string, options?: { bold?: boolean; size?: number }) {
  return new TextRun({ text, bold: options?.bold, font: FONT, size: options?.size ?? 22 });
}

function paragraph(text: string, options?: { bold?: boolean; center?: boolean; size?: number; before?: number; after?: number }) {
  return new Paragraph({
    alignment: options?.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { before: options?.before ?? 0, after: options?.after ?? 120 },
    children: [run(text, options)],
  });
}

function lines(text: string) {
  const parts = text.split("\n");
  return parts.map((line, index) =>
    paragraph(line || " ", { after: index === parts.length - 1 ? 160 : 40 }),
  );
}

function cell(text: string, bold = false) {
  return new TableCell({
    width: { size: bold ? 28 : 72, type: WidthType.PERCENTAGE },
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    borders: { top: LINE, bottom: LINE, left: LINE, right: LINE },
    children: [paragraph(text, { bold, after: 0 })],
  });
}

function row(label: string, value: string) {
  return new TableRow({ children: [cell(label, true), cell(value || " ")] });
}

function section(title: string, body: string) {
  return [paragraph(title, { bold: true, size: 24, before: 280, after: 80 }), ...lines(body)];
}

export function reportDocument(draft: ReportDraft) {
  return new Document({
    sections: [
      {
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } },
        },
        children: [
          paragraph(draft.school, { bold: true, center: true, size: 28, after: 80 }),
          paragraph("Parecer individual", { center: true, size: 24, after: 240 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
            rows: [
              row("Estudante", draft.student),
              row("Turma", draft.className),
              row("Componente", draft.subject),
              row("Professor", draft.teacher || " "),
              row("Período", draft.periodLabel),
            ],
          }),
          ...section("Registros quantitativos do período", draft.quantitativo),
          ...section("Aspectos comunicativos", draft.comunicativos),
          ...section("Aspectos emocionais e comportamentais", draft.emocionais),
          ...section("Avanços observados", draft.avancos),
          ...section("Desafios e dificuldades — Leitura", draft.leitura),
          ...section("Desafios e dificuldades — Escrita", draft.escrita),
          ...section("Desafios e dificuldades — Concentração", draft.concentracao),
          ...section("Desafios e dificuldades — Outros registros", draft.outrasDificuldades),
          ...section("Possíveis causas e desafios", draft.causas),
          ...section("Intervenção individualizada", draft.intervencao),
          ...section("Estratégias pedagógicas diferenciadas", draft.estrategias),
          ...section("Observação geral", draft.geral),
          paragraph(`${draft.place || "Local"} , ${draft.dateLabel}.`, { before: 400, after: 360 }),
          paragraph("________________________________", { center: true, after: 40 }),
          paragraph(draft.teacher || "Professor(a)", { center: true, after: 0 }),
        ],
      },
    ],
  });
}

export function reportToBlob(draft: ReportDraft) {
  return Packer.toBlob(reportDocument(draft));
}
