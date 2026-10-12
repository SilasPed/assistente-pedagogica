import { Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { RegisterPanel } from "@/components/pedagogico/register-panel";
import { Button, controlClassName, Eyebrow, Panel } from "@/components/pedagogico/ui";
import {
  defaultPeriodKey,
  firstName,
  formatDay,
  inRange,
  isoDate,
  relativeDay,
  resolvePeriod,
} from "@/lib/pedagogico/dates";
import { attentionForClass } from "@/lib/pedagogico/insights";
import { usePedStore } from "@/lib/pedagogico/store";
import { categoryLabel, examKindLabel, EXAM_KINDS } from "@/lib/pedagogico/types";

export function HomeView({
  today,
  prefill,
  onConsultStudent,
}: {
  today: Date;
  prefill: { classId: string; studentId: string; nonce: number } | null;
  onConsultStudent: (classId: string, studentId: string) => void;
}) {
  const data = usePedStore();
  const todayIso = isoDate(today);
  const period = resolvePeriod(defaultPeriodKey(today), today);
  const openPendings = data.pendings
    .filter((item) => !item.done)
    .slice()
    .sort((a, b) => a.due.localeCompare(b.due));
  const overdue = openPendings.filter((item) => item.due < todayIso).length;
  const upcoming = data.exams
    .filter((exam) => exam.date >= todayIso)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));
  const nextExam = upcoming[0];
  const donePendings = data.pendings.filter((item) => item.done);
  const [showDone, setShowDone] = useState(false);
  const [showPendingForm, setShowPendingForm] = useState(false);
  const [showExamForm, setShowExamForm] = useState(false);
  const [pendingTitle, setPendingTitle] = useState("");
  const [pendingClass, setPendingClass] = useState(data.classes[0]?.id ?? "");
  const [pendingDue, setPendingDue] = useState(todayIso);
  const [examTitle, setExamTitle] = useState("");
  const [examClass, setExamClass] = useState(data.classes[0]?.id ?? "");
  const [examDate, setExamDate] = useState(todayIso);
  const [examKind, setExamKind] = useState<(typeof EXAM_KINDS)[number]["id"]>("prova");

  const attention = useMemo(() => {
    return data.classes.flatMap((room) => {
      const students = data.students.filter((student) => student.classId === room.id);
      return attentionForClass({
        students,
        observations: data.observations.filter(
          (item) => item.classId === room.id && inRange(item.date, period.start, period.end),
        ),
        grades: data.grades.filter(
          (item) => item.classId === room.id && inRange(item.date, period.start, period.end),
        ),
        attendance: data.attendance.filter(
          (item) => item.classId === room.id && inRange(item.date, period.start, period.end),
        ),
      }).map((item) => ({ ...item, className: room.name }));
    });
  }, [data.attendance, data.classes, data.grades, data.observations, data.students, period.end, period.start]);

  const recent = data.observations
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  function studentName(id: string | null) {
    if (!id) return null;
    return data.students.find((student) => student.id === id)?.name ?? null;
  }

  function className(id: string) {
    return data.classes.find((room) => room.id === id)?.name ?? "";
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => document.getElementById("pendencias")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="panel px-3 py-3 text-left"
        >
          <Eyebrow>Pendências</Eyebrow>
          <p className="mt-1 font-serif text-2xl tabular-nums">{openPendings.length} abertas</p>
          <p className={overdue ? "text-sm text-danger" : "text-sm text-muted"}>
            {overdue ? `${overdue} atrasada${overdue > 1 ? "s" : ""}` : "Nenhuma atrasada"}
          </p>
        </button>
        <button
          type="button"
          onClick={() => document.getElementById("testes")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="panel px-3 py-3 text-left"
        >
          <Eyebrow>Próximo teste</Eyebrow>
          <p className="mt-1 font-serif text-2xl">
            {nextExam ? relativeDay(nextExam.date, today) : "Nenhum"}
          </p>
          <p className="truncate text-sm text-muted">
            {nextExam ? `${nextExam.title} · ${className(nextExam.classId)}` : "Marque uma avaliação"}
          </p>
        </button>
      </div>

      <RegisterPanel
        today={today}
        classes={data.classes}
        students={data.students}
        attendance={data.attendance}
        prefill={prefill}
        onSaveObservation={data.addObservation}
        onSaveGrade={data.addGrade}
        onUpsertAttendance={data.upsertAttendance}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel id="pendencias" className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Eyebrow>Para resolver</Eyebrow>
              <h2 className="font-serif text-2xl font-medium">Pendências</h2>
            </div>
            <Button variant="ghost" className="h-10 px-3" onClick={() => setShowPendingForm((value) => !value)}>
              <Plus className="size-4" aria-hidden="true" />
              Nova
            </Button>
          </div>
          {showPendingForm ? (
            <form
              className="grid gap-2 rounded-md bg-bg p-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (!pendingTitle.trim()) return;
                data.addPending({
                  title: pendingTitle.trim(),
                  classId: pendingClass,
                  studentId: null,
                  due: pendingDue,
                });
                setPendingTitle("");
                setShowPendingForm(false);
              }}
            >
              <input
                className={controlClassName()}
                placeholder="O que precisa ser feito"
                value={pendingTitle}
                onChange={(event) => setPendingTitle(event.target.value)}
              />
              <div className="grid gap-2 sm:grid-cols-2">
                <select
                  className={controlClassName()}
                  value={pendingClass}
                  onChange={(event) => setPendingClass(event.target.value)}
                >
                  {data.classes.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className={controlClassName()}
                  value={pendingDue}
                  onChange={(event) => setPendingDue(event.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Adicionar pendência</Button>
              </div>
            </form>
          ) : null}
          {openPendings.length === 0 ? (
            <p className="text-sm text-muted">Nenhuma pendência aberta.</p>
          ) : (
            <ul className="flex flex-col">
              {openPendings.map((item) => {
                const late = item.due < todayIso;
                const who = studentName(item.studentId);
                return (
                  <li key={item.id} className="flex items-start gap-3 border-t border-line py-3 first:border-t-0">
                    <button
                      type="button"
                      aria-label={`Concluir ${item.title}`}
                      onClick={() => data.togglePending(item.id)}
                      className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-md border border-line"
                    >
                      <Check className="size-4 text-muted" aria-hidden="true" />
                    </button>
                    <div className="min-w-0">
                      <p className="font-medium">{item.title}</p>
                      <p className={late ? "text-sm text-danger" : "text-sm text-muted"}>
                        {className(item.classId)}
                        {who ? ` · ${who}` : ""} · {relativeDay(item.due, today)}
                        {late ? " · atrasada" : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {donePendings.length ? (
            <button
              type="button"
              className="self-start text-sm font-medium text-muted"
              onClick={() => setShowDone((value) => !value)}
            >
              {showDone ? "Ocultar concluídas" : `Ver concluídas (${donePendings.length})`}
            </button>
          ) : null}
          {showDone
            ? donePendings.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => data.togglePending(item.id)}
                  className="text-left text-sm text-subtle line-through"
                >
                  {item.title}
                </button>
              ))
            : null}
        </Panel>

        <Panel id="testes" className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Eyebrow>Calendário curto</Eyebrow>
              <h2 className="font-serif text-2xl font-medium">Próximos testes</h2>
            </div>
            <Button variant="ghost" className="h-10 px-3" onClick={() => setShowExamForm((value) => !value)}>
              <Plus className="size-4" aria-hidden="true" />
              Novo
            </Button>
          </div>
          {showExamForm ? (
            <form
              className="grid gap-2 rounded-md bg-bg p-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (!examTitle.trim()) return;
                data.addExam({
                  title: examTitle.trim(),
                  classId: examClass,
                  date: examDate,
                  kind: examKind,
                });
                setExamTitle("");
                setShowExamForm(false);
              }}
            >
              <input
                className={controlClassName()}
                placeholder="Nome da avaliação"
                value={examTitle}
                onChange={(event) => setExamTitle(event.target.value)}
              />
              <div className="grid gap-2 sm:grid-cols-3">
                <select className={controlClassName()} value={examClass} onChange={(e) => setExamClass(e.target.value)}>
                  {data.classes.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                <select
                  className={controlClassName()}
                  value={examKind}
                  onChange={(event) => setExamKind(event.target.value as typeof examKind)}
                >
                  {EXAM_KINDS.map((kind) => (
                    <option key={kind.id} value={kind.id}>
                      {kind.label}
                    </option>
                  ))}
                </select>
                <input type="date" className={controlClassName()} value={examDate} onChange={(e) => setExamDate(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Adicionar teste</Button>
              </div>
            </form>
          ) : null}
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted">Nenhum teste à frente.</p>
          ) : (
            <ul className="flex flex-col">
              {upcoming.map((exam) => (
                <li key={exam.id} className="flex items-center gap-3 border-t border-line py-3 first:border-t-0">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-bg text-center">
                    <span className="font-serif text-xl leading-none tabular-nums">{formatDay(exam.date).split(" ")[0]}</span>
                    <span className="text-xs uppercase text-muted">{formatDay(exam.date).split(" ")[1]}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{exam.title}</p>
                    <p className="text-sm text-muted">
                      {examKindLabel(exam.kind)} · {className(exam.classId)} · {relativeDay(exam.date, today)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-muted"
                    onClick={() => data.removeExam(exam.id)}
                  >
                    Tirar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel className="flex flex-col gap-3">
        <div>
          <Eyebrow>{period.label}</Eyebrow>
          <h2 className="font-serif text-2xl font-medium">Alunos em atenção</h2>
        </div>
        {attention.length === 0 ? (
          <p className="text-sm text-muted">Nenhum aluno isolado em atenção neste período.</p>
        ) : (
          <ul className="flex flex-col">
            {attention.map((item) => (
              <li key={item.student.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                <div className="min-w-0">
                  <p className="font-medium">{item.student.name}</p>
                  <p className="text-sm text-muted">
                    {item.className} · {item.reasons.join(" · ")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="h-10 shrink-0 px-3"
                  onClick={() => onConsultStudent(item.student.classId, item.student.id)}
                >
                  Ver {firstName(item.student.name)}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="flex flex-col gap-3">
        <div>
          <Eyebrow>Linha do tempo</Eyebrow>
          <h2 className="font-serif text-2xl font-medium">Últimos registros</h2>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma observação ainda.</p>
        ) : (
          <ul className="flex flex-col">
            {recent.map((item) => (
              <li key={item.id} className="border-t border-line py-3 first:border-t-0">
                <p className="text-sm text-muted">
                  {formatDay(item.date)} · {studentName(item.studentId)} · {categoryLabel(item.category)}
                  {item.source === "voz" ? " · voz" : ""}
                </p>
                <p className="mt-1">{item.text}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
