import { useMemo, useState } from "react";
import { GradeChart } from "@/components/pedagogico/grade-chart";
import { ReportPanel } from "@/components/pedagogico/report-view";
import { Button, controlClassName, Eyebrow, Panel } from "@/components/pedagogico/ui";
import {
  defaultPeriodKey,
  formatDay,
  formatRange,
  fmtScore,
  inRange,
  isoDate,
  mean,
  periodOptions,
  previousPeriod,
  resolvePeriod,
  upcomingExams,
} from "@/lib/pedagogico/dates";
import { frequency, summarizeClass, summarizeStudent } from "@/lib/pedagogico/insights";
import { buildReportDraft } from "@/lib/pedagogico/report";
import { usePedStore } from "@/lib/pedagogico/store";
import { categoryLabel } from "@/lib/pedagogico/types";

export function ConsultView({
  today,
  classId,
  studentId,
  teacher,
  place,
  onClassId,
  onStudentId,
}: {
  today: Date;
  classId: string;
  studentId: string;
  teacher: string;
  place: string;
  onClassId: (id: string) => void;
  onStudentId: (id: string) => void;
}) {
  const data = usePedStore();
  const [periodKey, setPeriodKey] = useState(defaultPeriodKey(today));
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const period = resolvePeriod(periodKey, today);
  const prior = previousPeriod(period);
  const options = periodOptions(today);
  const room = data.classes.find((item) => item.id === classId) ?? data.classes[0];
  const classStudents = data.students
    .filter((student) => student.classId === room?.id)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const student = classStudents.find((item) => item.id === studentId) ?? null;

  const scoped = useMemo(() => {
    if (!room) return null;
    const observations = data.observations.filter(
      (item) => item.classId === room.id && inRange(item.date, period.start, period.end),
    );
    const grades = data.grades.filter(
      (item) => item.classId === room.id && inRange(item.date, period.start, period.end),
    );
    const attendance = data.attendance.filter(
      (item) => item.classId === room.id && inRange(item.date, period.start, period.end),
    );
    const previousGrades = data.grades.filter(
      (item) => item.classId === room.id && inRange(item.date, prior.start, prior.end),
    );
    const todayIso = isoDate(today);
    const nextExam = upcomingExams(data.exams, todayIso, room.id)[0] ?? null;
    return { observations, grades, attendance, previousGrades, nextExam };
  }, [data.attendance, data.exams, data.grades, data.observations, period.end, period.start, prior.end, prior.start, room, today]);

  if (!room || !scoped) {
    return <Panel><p className="text-sm text-muted">Cadastre uma turma para consultar.</p></Panel>;
  }

  const summary = student
    ? summarizeStudent({
        student,
        period,
        observations: scoped.observations.filter((item) => item.studentId === student.id),
        grades: scoped.grades.filter((item) => item.studentId === student.id),
        previousGrades: scoped.previousGrades.filter((item) => item.studentId === student.id),
        attendance: scoped.attendance.filter((item) => item.studentId === student.id),
        nextExam: scoped.nextExam,
      })
    : summarizeClass({
        classRoom: room,
        students: classStudents,
        period,
        observations: scoped.observations,
        grades: scoped.grades,
        attendance: scoped.attendance,
        nextExam: scoped.nextExam,
      });

  const chartPoints = student
    ? data.grades
        .filter((grade) => grade.studentId === student.id)
        .slice()
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((grade) => ({
          label: formatDay(grade.date),
          nota: grade.score,
          title: grade.title,
        }))
    : [];

  const timeline = student
    ? [
        ...scoped.observations
          .filter((item) => item.studentId === student.id)
          .map((item) => ({
            kind: "obs" as const,
            id: item.id,
            date: item.date,
            title: categoryLabel(item.category),
            text: item.text,
            meta: item.source === "voz" ? "voz" : "texto",
          })),
        ...scoped.grades
          .filter((item) => item.studentId === student.id)
          .map((item) => ({
            kind: "grade" as const,
            id: item.id,
            date: item.date,
            title: item.title,
            text: `Nota ${fmtScore(item.score)}`,
            meta: "nota",
          })),
        ...scoped.attendance
          .filter((item) => item.studentId === student.id && item.status !== "presente")
          .map((item) => ({
            kind: "att" as const,
            id: item.id,
            date: item.date,
            title: item.status === "falta" ? "Falta" : item.status === "atraso" ? "Atraso" : "Falta justificada",
            text: "Frequência do dia",
            meta: "frequência",
          })),
      ].sort((a, b) => b.date.localeCompare(a.date))
    : [];

  const reportDraft = student
    ? buildReportDraft({
        studentName: student.name,
        className: room.name,
        subject: room.subject,
        teacher,
        place,
        today: isoDate(today),
        periodLabel: period.label,
        periodStart: period.start,
        periodEnd: period.end,
        observations: data.observations.filter((row) => row.studentId === student.id),
        grades: data.grades.filter((row) => row.studentId === student.id),
        attendance: data.attendance.filter((row) => row.studentId === student.id),
      })
    : null;

  return (
    <div className="flex flex-col gap-4">
      <Panel className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-muted">Turma</span>
          <select
            className={controlClassName()}
            value={room.id}
            onChange={(event) => {
              onClassId(event.target.value);
              onStudentId("all");
            }}
          >
            {data.classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.subject}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-muted">Aluno</span>
          <select aria-label="Aluno" className={controlClassName()} value={student ? student.id : "all"} onChange={(e) => onStudentId(e.target.value)}>
            <option value="all">Todos os alunos</option>
            {classStudents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-muted">Período</span>
          <select className={controlClassName()} value={periodKey} onChange={(e) => setPeriodKey(e.target.value)}>
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </Panel>

      <Panel className="flex flex-col gap-4">
        <div>
          <Eyebrow>
            {room.name} · {room.subject} · {formatRange(period.start, period.end)}
          </Eyebrow>
          <h2 className="mt-1 font-serif text-3xl font-medium tracking-tight">{summary.title}</h2>
        </div>
        <p className="max-w-3xl text-base leading-relaxed">{summary.body}</p>
        <div className="grid grid-cols-3 gap-2">
          {summary.stats.map((stat) => (
            <div key={stat.label} className="rounded-md bg-bg px-3 py-3">
              <p className="text-xs font-medium text-muted">{stat.label}</p>
              <p className="mt-1 font-serif text-2xl tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
        {summary.flags.length ? (
          <ul className="flex flex-wrap gap-2">
            {summary.flags.map((flag) => (
              <li key={flag} className="rounded-md border border-line px-2 py-1 text-sm text-fg">
                {flag}
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>

      {student && chartPoints.length > 1 ? (
        <Panel>
          <Eyebrow>Notas ao longo do ano</Eyebrow>
          <h3 className="font-serif text-xl font-medium">Trajetória de {student.name.split(" ")[0]}</h3>
          <GradeChart data={chartPoints} />
        </Panel>
      ) : null}

      {student ? (
        <Panel className="flex flex-col gap-2">
          <Eyebrow>No período</Eyebrow>
          <h3 className="font-serif text-xl font-medium">Registros de {student.name}</h3>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted">Nada lançado neste período para este aluno.</p>
          ) : (
            <ul className="flex flex-col">
              {timeline.map((item) => (
                <li key={`${item.kind}-${item.id}`} className="border-t border-line py-3 first:border-t-0">
                  <p className="text-sm text-muted">
                    {formatDay(item.date)} · {item.title} · {item.meta}
                  </p>
                  <p className="mt-1">{item.text}</p>
                  {item.kind !== "att" ? (
                    <button
                      type="button"
                      className="mt-1 text-sm text-muted"
                      onClick={() => {
                        if (confirmId === item.id) {
                          if (item.kind === "obs") data.removeObservation(item.id);
                          if (item.kind === "grade") data.removeGrade(item.id);
                          setConfirmId(null);
                        } else {
                          setConfirmId(item.id);
                        }
                      }}
                    >
                      {confirmId === item.id ? "Confirmar exclusão" : "Apagar"}
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : (
        <Panel className="flex flex-col gap-2">
          <Eyebrow>Por aluno</Eyebrow>
          <h3 className="font-serif text-xl font-medium">Leitura da turma</h3>
          <ul className="flex flex-col">
            {classStudents.map((item) => {
              const grades = scoped.grades.filter((grade) => grade.studentId === item.id);
              const avg = mean(grades.map((grade) => grade.score));
              const freq = frequency(scoped.attendance.filter((row) => row.studentId === item.id));
              const notes = scoped.observations.filter((row) => row.studentId === item.id).length;
              return (
                <li key={item.id} className="flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0">
                  <div className="min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm tabular-nums text-muted">
                      Média {avg == null ? "—" : fmtScore(avg)} · Frequência {freq ? `${freq.pct}%` : "—"} · {notes} obs.
                    </p>
                  </div>
                  <Button variant="ghost" className="h-10 shrink-0 px-3" onClick={() => onStudentId(item.id)}>
                    Abrir
                  </Button>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
      {student && reportDraft ? (
        <div className="flex flex-col gap-3">
          <Button variant="ghost" onClick={() => setShowReport((open) => !open)}>
            {showReport ? "Fechar parecer" : "Parecer em Word"}
          </Button>
          {showReport ? (
            <ReportPanel
              key={`${student.id}-${period.start}-${period.end}`}
              initial={reportDraft}
              onRebuild={() => reportDraft}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
