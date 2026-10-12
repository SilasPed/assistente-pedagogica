import { useRef, useState } from "react";
import { Button, controlClassName, Eyebrow, Panel } from "@/components/pedagogico/ui";
import { defaultPeriodKey, fmtScore, inRange, mean, resolvePeriod } from "@/lib/pedagogico/dates";
import { frequency } from "@/lib/pedagogico/insights";
import { usePedStore } from "@/lib/pedagogico/store";
import { legacyStateFromJson, pedDataFromUnknown, snapshotPed } from "@/lib/pedagogico/workspace";
import { saveWorkspace } from "@/lib/pedagogico/workspace.functions";

export function ClassesView({
  today,
  onOpenStudent,
}: {
  today: Date;
  onOpenStudent: (classId: string, studentId: string) => void;
}) {
  const data = usePedStore();
  const period = resolvePeriod(defaultPeriodKey(today), today);
  const [names, setNames] = useState<Record<string, string>>({});
  const [confirmReset, setConfirmReset] = useState(false);
  const [backupNote, setBackupNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function downloadBackup() {
    const blob = new Blob([JSON.stringify(snapshotPed(usePedStore.getState()), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "acompanhamento-pedagogico.json";
    link.click();
    URL.revokeObjectURL(url);
    setBackupNote("Arquivo baixado. Guarde-o você mesmo: isto não é um backup automático do servidor.");
  }

  async function restoreBackup(file: File) {
    setBackupNote("");
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text()) as unknown;
    } catch {
      setBackupNote("O arquivo não é um JSON válido. Nada foi substituído.");
      return;
    }
    const wrapped = parsed && typeof parsed === "object" && "state" in parsed ? (parsed as { state: unknown }).state : parsed;
    const next = pedDataFromUnknown(wrapped) ?? legacyStateFromJson(JSON.stringify(parsed));
    if (!next) {
      setBackupNote("O arquivo não tem registros reconhecíveis. Nada foi substituído.");
      return;
    }
    if (!window.confirm("Isso substitui os registros desta conta pelo arquivo. Continuar?")) return;
    usePedStore.getState().replaceAll(next);
    try {
      const saved = await saveWorkspace({ data: next });
      setBackupNote(saved.ok ? "Cópia restaurada nesta conta." : saved.message);
    } catch {
      setBackupNote("A cópia entrou na tela, mas não foi possível gravá-la na conta.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {data.classes.map((room) => {
        const students = data.students
          .filter((student) => student.classId === room.id)
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        const next = data.exams
          .filter((exam) => exam.classId === room.id && exam.date >= period.start)
          .slice()
          .sort((a, b) => a.date.localeCompare(b.date))[0];
        return (
          <Panel key={room.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <Eyebrow>
                  {room.subject}
                  {room.origin === "demo" ? " · demonstração" : " · seus registros"}
                </Eyebrow>
                <h2 className="font-serif text-2xl font-medium">{room.name}</h2>
              </div>
              <p className="text-sm text-muted">
                {students.length} alunos
                {next ? ` · próximo: ${next.title}` : ""}
              </p>
            </div>
            <ul className="flex flex-col">
              {students.map((student) => {
                const grades = data.grades.filter(
                  (grade) =>
                    grade.studentId === student.id && inRange(grade.date, period.start, period.end),
                );
                const avg = mean(grades.map((grade) => grade.score));
                const freq = frequency(
                  data.attendance.filter(
                    (row) =>
                      row.studentId === student.id && inRange(row.date, period.start, period.end),
                  ),
                );
                return (
                  <li key={student.id} className="border-t border-line first:border-t-0">
                    <button
                      type="button"
                      onClick={() => onOpenStudent(room.id, student.id)}
                      className="flex w-full items-center justify-between gap-3 py-3 text-left"
                    >
                      <span className="font-medium">{student.name}</span>
                      <span className="shrink-0 text-sm tabular-nums text-muted">
                        {avg == null ? "s/ nota" : fmtScore(avg)} · {freq ? `${freq.pct}%` : "s/ freq."}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                data.addStudent(room.id, names[room.id] ?? "");
                setNames((current) => ({ ...current, [room.id]: "" }));
              }}
            >
              <input
                className={controlClassName()}
                placeholder="Nome do novo aluno"
                value={names[room.id] ?? ""}
                onChange={(event) => setNames((current) => ({ ...current, [room.id]: event.target.value }))}
              />
              <Button type="submit" className="shrink-0">
                Incluir aluno
              </Button>
            </form>
          </Panel>
        );
      })}

      <div className="flex flex-col items-start gap-3 px-1">
        <p className="text-sm text-muted">
          Restaurar o exemplo recria a sala fictícia e mantém alunos e registros incluídos por você. A cópia em JSON é um arquivo que você guarda. Não é um backup testado do servidor: na pré-visualização o banco some ao reiniciar.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="ghost" onClick={downloadBackup}>
            Baixar cópia JSON
          </Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>
            Restaurar cópia JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void restoreBackup(file);
            }}
          />
        </div>
        {backupNote ? <p className="text-sm">{backupNote}</p> : null}
        <button
          type="button"
          className="text-sm font-medium text-muted"
          onClick={() => {
            if (!confirmReset) {
              setConfirmReset(true);
              return;
            }
            data.resetDemo();
            setConfirmReset(false);
          }}
        >
          {confirmReset ? "Confirmar restauração do exemplo" : "Restaurar exemplo"}
        </button>
      </div>
    </div>
  );
}
