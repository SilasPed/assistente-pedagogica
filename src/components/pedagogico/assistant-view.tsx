import { useEffect, useMemo, useState } from "react";
import { Button, controlClassName, Eyebrow, Panel } from "@/components/pedagogico/ui";
import { AI_TAG_LABELS } from "@/lib/pedagogico/ai-contract";
import { assistantAvailability, runAssistant } from "@/lib/pedagogico/ai.functions";
import type { AssistResult, AssistSuccess } from "@/lib/pedagogico/ai.server";
import {
  defaultPeriodKey,
  isoDate,
  periodOptions,
  previousPeriod,
  resolvePeriod,
} from "@/lib/pedagogico/dates";
import { usePedStore } from "@/lib/pedagogico/store";
import { CATEGORIES, categoryLabel, type Category } from "@/lib/pedagogico/types";

type Action = "organizar" | "parecer" | "evolucao" | "intervencoes";

const ACTIONS: { id: Action; label: string }[] = [
  { id: "organizar", label: "Organizar observação" },
  { id: "parecer", label: "Gerar parecer" },
  { id: "evolucao", label: "Analisar evolução" },
  { id: "intervencoes", label: "Sugerir intervenções" },
];

export function AssistantView({ today }: { today: Date }) {
  const data = usePedStore();
  const options = periodOptions(today);
  const [classId, setClassId] = useState(data.classes[0]?.id ?? "");
  const [studentId, setStudentId] = useState("");
  const [periodKey, setPeriodKey] = useState(defaultPeriodKey(today));
  const [action, setAction] = useState<Action>("organizar");
  const [rawText, setRawText] = useState("");
  const [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [result, setResult] = useState<AssistResult | null>(null);
  const [draft, setDraft] = useState("");
  const [category, setCategory] = useState<Category>("geral");
  const [saved, setSaved] = useState(false);

  const room = data.classes.find((item) => item.id === classId) ?? data.classes[0];
  const students = data.students
    .filter((student) => student.classId === room?.id)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const student = students.find((item) => item.id === studentId) ?? students[0];
  const period = resolvePeriod(periodKey, today);
  const prior = previousPeriod(period);
  const origin = student?.origin ?? room?.origin ?? "demo";

  useEffect(() => {
    let active = true;
    void assistantAvailability()
      .then((value) => {
        if (active) setConfigured(value.configured);
      })
      .catch(() => {
        if (active) setConfigured(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const payload = useMemo(() => {
    if (!room || !student) return null;
    const mine = <T extends { studentId: string; origin: "demo" | "local" }>(rows: T[]) =>
      rows.filter((row) => row.studentId === student.id && row.origin === origin);
    return {
      action,
      origin,
      student: { id: student.id, name: student.name, className: room.name, subject: room.subject },
      period: { label: period.label, start: period.start, end: period.end },
      comparePeriod:
        action === "evolucao" ? { label: prior.label, start: prior.start, end: prior.end } : undefined,
      rawText: action === "organizar" ? rawText : undefined,
      observations: mine(data.observations).map((row) => ({
        id: row.id,
        date: row.date,
        category: row.category,
        text: row.text,
        origin: row.origin,
      })),
      grades: mine(data.grades).map((row) => ({
        id: row.id,
        date: row.date,
        title: row.title,
        score: row.score,
        origin: row.origin,
      })),
      attendance: mine(data.attendance).map((row) => ({
        id: row.id,
        date: row.date,
        status: row.status,
        origin: row.origin,
      })),
      exams:
        action === "organizar"
          ? []
          : data.exams
              .filter((row) => row.classId === room.id && row.origin === origin)
              .map((row) => ({ id: row.id, date: row.date, title: row.title, origin: row.origin })),
    };
  }, [action, data.attendance, data.exams, data.grades, data.observations, origin, period.end, period.label, period.start, prior.end, prior.label, prior.start, rawText, room, student]);

  async function run() {
    if (!payload || busy) return;
    setBusy(true);
    setSaved(false);
    setResult(null);
    try {
      const next = await runAssistant({ data: payload });
      setResult(next);
      if (next.ok) {
        setDraft(next.draft);
        setCategory(next.storedCategory);
      }
    } catch {
      setResult({
        ok: false,
        code: "error",
        message: "Não foi possível concluir a análise. Os registros não foram alterados.",
      });
    } finally {
      setBusy(false);
    }
  }

  function saveDraft() {
    if (!room || !student || !draft.trim()) return;
    data.addObservation({
      studentId: student.id,
      classId: room.id,
      date: isoDate(today),
      category,
      text: draft.trim(),
      source: "texto",
    });
    setSaved(true);
  }

  function exportDraft() {
    const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "parecer-para-revisao.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!room || !student || !payload) {
    return <Panel><p className="text-sm text-muted">Inclua uma turma e um aluno para usar o assistente.</p></Panel>;
  }

  const success = result?.ok ? result : null;

  return (
    <div className="flex flex-col gap-4">
      <Panel className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <Eyebrow>Assistente</Eyebrow>
            <h2 className="font-serif text-2xl font-medium">Leitura para o professor revisar</h2>
          </div>
          <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
            {origin === "demo" ? "Sala de demonstração" : "Registros deste aparelho"}
          </span>
        </div>
        <p className="text-sm text-muted">
          O texto gerado não é salvo sozinho e não altera nota nem frequência. Sem a chave do Gemini no servidor, nada é inventado no lugar da resposta.
        </p>
        {configured === false ? (
          <p className="text-sm text-muted">GEMINI_API_KEY não está definida neste ambiente.</p>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {ACTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={action === item.id}
              onClick={() => {
                setAction(item.id);
                setResult(null);
                setSaved(false);
              }}
              className={
                action === item.id
                  ? "h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-fg"
                  : "h-11 rounded-md border border-line bg-card px-3 text-sm font-medium"
              }
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="flex flex-col gap-1 text-sm">
          Turma
          <select className={controlClassName()} value={room.id} onChange={(event) => { setClassId(event.target.value); setStudentId(""); setResult(null); }}>
            {data.classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.subject}{item.origin === "demo" ? " · demonstração" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Aluno
          <select className={controlClassName()} value={student.id} onChange={(event) => { setStudentId(event.target.value); setResult(null); }}>
            {students.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}{item.origin === "demo" ? " · demonstração" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Período
          <select className={controlClassName()} value={periodKey} onChange={(event) => { setPeriodKey(event.target.value); setResult(null); }}>
            {options.map((item) => (
              <option key={item.key} value={item.key}>{item.label}</option>
            ))}
          </select>
        </label>
        {action === "evolucao" ? (
          <p className="text-sm text-muted">A comparação usa {prior.label.toLowerCase()}, só com os registros que existirem.</p>
        ) : null}
        {action === "organizar" ? (
          <label className="flex flex-col gap-1 text-sm">
            Texto ou transcrição
            <textarea
              className="min-h-28 w-full rounded-md border border-line bg-card px-3 py-2 text-base"
              value={rawText}
              maxLength={4000}
              onChange={(event) => setRawText(event.target.value)}
              placeholder="Cole ou dite a observação que quer organizar."
            />
          </label>
        ) : null}
        <Button onClick={() => void run()} disabled={busy || (action === "organizar" && rawText.trim().length < 15)}>
          {busy ? "Consultando o Gemini…" : ACTIONS.find((item) => item.id === action)?.label}
        </Button>
      </Panel>

      {busy ? <Panel><p className="text-sm text-muted">Aguardando a resposta. Os registros continuam como estão.</p></Panel> : null}

      {result && !result.ok ? (
        <Panel className="flex flex-col gap-2">
          <Eyebrow>Não foi possível analisar</Eyebrow>
          <p className="text-sm">{result.message}</p>
          {result.missing?.length ? (
            <ul className="list-disc pl-5 text-sm text-muted">
              {result.missing.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
        </Panel>
      ) : null}

      {success ? <Review result={success} draft={draft} category={category} saved={saved} onDraft={setDraft} onCategory={setCategory} onSave={saveDraft} onExport={exportDraft} /> : null}
    </div>
  );
}

function Review({
  result,
  draft,
  category,
  saved,
  onDraft,
  onCategory,
  onSave,
  onExport,
}: {
  result: AssistSuccess;
  draft: string;
  category: Category;
  saved: boolean;
  onDraft: (value: string) => void;
  onCategory: (value: Category) => void;
  onSave: () => void;
  onExport: () => void;
}) {
  return (
    <Panel className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Eyebrow>Gerado pelo Gemini · revise antes de guardar</Eyebrow>
        {result.demonstrative ? <span className="text-xs font-medium text-muted">Base fictícia de demonstração</span> : null}
      </div>
      <div>
        <h3 className="text-sm font-medium">Fatos calculados neste aparelho</h3>
        <ul className="mt-1 list-disc pl-5 text-sm text-muted">
          {result.facts.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-medium">Leitura da IA, não um fato</h3>
        <p className="mt-1 text-sm">{result.reading}</p>
      </div>
      {result.suggestions.length ? (
        <div>
          <h3 className="text-sm font-medium">Sugestões, não decisões</h3>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {result.suggestions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
      {result.tags.length ? (
        <p className="text-sm text-muted">
          Categorias sugeridas: {result.tags.map((tag) => (tag in AI_TAG_LABELS ? AI_TAG_LABELS[tag as keyof typeof AI_TAG_LABELS] : tag)).join(", ")}
        </p>
      ) : null}
      {result.evidence.length ? (
        <div>
          <h3 className="text-sm font-medium">Evidências citadas</h3>
          <ul className="mt-1 flex flex-col gap-1 text-sm text-muted">
            {result.evidence.map((item) => (
              <li key={item.id}><span className="font-medium text-fg">{item.label}.</span> {item.text}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {result.missing.length || result.limits.length ? (
        <div>
          <h3 className="text-sm font-medium">O que não está nos registros</h3>
          <ul className="mt-1 list-disc pl-5 text-sm text-muted">
            {[...result.limits, ...result.missing].map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ) : null}
      <label className="flex flex-col gap-1 text-sm">
        Texto para aprovar
        <textarea className="min-h-36 w-full rounded-md border border-line bg-card px-3 py-2 text-base" value={draft} onChange={(event) => onDraft(event.target.value)} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Categoria ao salvar
        <select className={controlClassName()} value={category} onChange={(event) => onCategory(event.target.value as Category)}>
          {CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </label>
      <p className="text-sm text-muted">Categoria sugerida para o arquivo: {categoryLabel(result.storedCategory)}. Salvar cria só uma observação.</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onSave} disabled={!draft.trim()}>Salvar como observação</Button>
        <Button variant="ghost" onClick={onExport} disabled={!draft.trim()}>Exportar texto</Button>
      </div>
      {saved ? <p className="text-sm">Observação guardada neste aparelho. Notas e frequência não mudaram.</p> : null}
    </Panel>
  );
}
