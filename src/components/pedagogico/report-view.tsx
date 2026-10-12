import { useState } from "react";
import { Button, controlClassName, Eyebrow, Panel } from "@/components/pedagogico/ui";
import { reportToBlob } from "@/lib/pedagogico/report-docx";
import { reportSignatureLine, SCHOOL_NAME, type ReportDraft } from "@/lib/pedagogico/report";

const SECTIONS: { key: keyof ReportDraft; label: string }[] = [
  { key: "quantitativo", label: "Registros quantitativos do período" },
  { key: "comunicativos", label: "Aspectos comunicativos" },
  { key: "emocionais", label: "Aspectos emocionais e comportamentais" },
  { key: "avancos", label: "Avanços observados" },
  { key: "leitura", label: "Desafios e dificuldades — Leitura" },
  { key: "escrita", label: "Desafios e dificuldades — Escrita" },
  { key: "concentracao", label: "Desafios e dificuldades — Concentração" },
  { key: "outrasDificuldades", label: "Desafios e dificuldades — Outros registros" },
  { key: "causas", label: "Possíveis causas e desafios" },
  { key: "intervencao", label: "Intervenção individualizada" },
  { key: "estrategias", label: "Estratégias pedagógicas diferenciadas" },
  { key: "geral", label: "Observação geral" },
];

function fileSlug(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "aluno";
}

export function ReportPanel({
  initial,
  onRebuild,
}: {
  initial: ReportDraft;
  onRebuild: () => ReportDraft;
}) {
  const [draft, setDraft] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function setText(key: keyof ReportDraft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function download() {
    setBusy(true);
    setError("");
    try {
      const blob = await reportToBlob({ ...draft, school: SCHOOL_NAME });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `parecer-${fileSlug(draft.student)}.docx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Não foi possível gerar o arquivo Word.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel className="flex flex-col gap-3">
      <div>
        <Eyebrow>Parecer individual</Eyebrow>
        <h3 className="font-serif text-2xl font-medium">Pré-visualização editável</h3>
      </div>
      <p className="text-sm text-muted">
        O texto nasce só dos registros do período. Onde não há registro, fica “Não observado no período”. O que você alterar aqui entra no Word; isso não muda as observações salvas e não inventa nota nem frequência.
      </p>
      <p className="text-center text-sm font-medium">{SCHOOL_NAME}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {(
          [
            ["student", "Estudante"],
            ["className", "Turma"],
            ["subject", "Componente"],
            ["teacher", "Professor"],
            ["periodLabel", "Período"],
            ["place", "Local"],
            ["dateLabel", "Data"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex flex-col gap-1 text-sm">
            {label}
            <input className={controlClassName()} value={draft[key]} onChange={(event) => setText(key, event.target.value)} />
          </label>
        ))}
      </div>
      {SECTIONS.map((section) => (
        <label key={section.key} className="flex flex-col gap-1 text-sm">
          {section.label}
          <textarea
            className="min-h-24 w-full rounded-md border border-line bg-card px-3 py-2 text-base"
            value={draft[section.key]}
            onChange={(event) => setText(section.key, event.target.value)}
          />
        </label>
      ))}
      <p className="text-sm text-muted">
        {reportSignatureLine(draft.place, draft.dateLabel)} Assinatura: {draft.teacher.trim() || "Professor(a)"}.
      </p>
      {error ? <p className="text-sm">{error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => void download()} disabled={busy}>
          {busy ? "Gerando…" : "Baixar Word"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setDraft(onRebuild());
            setError("");
          }}
        >
          Recarregar dos registros
        </Button>
      </div>
    </Panel>
  );
}
