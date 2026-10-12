import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button, controlClassName, Eyebrow, Panel } from "@/components/pedagogico/ui";
import { isoDate } from "@/lib/pedagogico/dates";
import { suggestCategory } from "@/lib/pedagogico/insights";
import {
  ATTENDANCE_OPTIONS,
  CATEGORIES,
  type Attendance,
  type AttendanceStatus,
  type Category,
  type ClassRoom,
  type Student,
} from "@/lib/pedagogico/types";

type SpeechResult = { isFinal: boolean; 0: { transcript: string } };

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<SpeechResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type Mode = "observacao" | "nota" | "chamada";

function recognitionCtor(): (new () => SpeechRec) | null {
  if (typeof window === "undefined") return null;
  const host = window as Window & {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}

function useVoice(onFinal: (chunk: string) => void) {
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;
  const recRef = useRef<SpeechRec | null>(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => recRef.current?.abort();
  }, []);

  function stop() {
    recRef.current?.stop();
    setListening(false);
    setInterim("");
  }

  function start() {
    const Ctor = recognitionCtor();
    if (!Ctor) {
      setMessage("Este navegador não transcreve voz. Digite a observação — o registro continua valendo.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const chunk = event.results[index]?.[0]?.transcript ?? "";
        if (event.results[index]?.isFinal) finalText += chunk;
        else interimText += chunk;
      }
      if (finalText.trim()) onFinalRef.current(finalText.trim());
      setInterim(interimText.trim());
    };
    rec.onerror = (event) => {
      if (event.error === "aborted" || event.error === "no-speech") {
        if (event.error === "no-speech") setMessage("Não ouvi fala. Tente de novo ou digite.");
        setListening(false);
        return;
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setMessage("O microfone está bloqueado. Digite a observação.");
      } else {
        setMessage("Não foi possível transcrever agora. Digite a observação.");
      }
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      setInterim("");
    };
    try {
      rec.start();
      recRef.current = rec;
      setListening(true);
      setMessage(null);
    } catch {
      setMessage("Não foi possível abrir o microfone. Digite a observação.");
      setListening(false);
    }
  }

  return {
    listening,
    interim,
    message,
    toggle: () => (listening ? stop() : start()),
  };
}

export function RegisterPanel({
  today,
  classes,
  students,
  attendance,
  prefill,
  onSaveObservation,
  onSaveGrade,
  onUpsertAttendance,
}: {
  today: Date;
  classes: ClassRoom[];
  students: Student[];
  attendance: Attendance[];
  prefill: { classId: string; studentId: string; nonce: number } | null;
  onSaveObservation: (input: {
    studentId: string;
    classId: string;
    date: string;
    category: Category;
    text: string;
    source: "voz" | "texto";
  }) => void;
  onSaveGrade: (input: {
    studentId: string;
    classId: string;
    date: string;
    title: string;
    score: number;
  }) => void;
  onUpsertAttendance: (input: {
    studentId: string;
    classId: string;
    date: string;
    status: AttendanceStatus;
  }) => void;
}) {
  const [mode, setMode] = useState<Mode>("observacao");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [studentId, setStudentId] = useState(
    students.find((student) => student.classId === classes[0]?.id)?.id ?? "",
  );
  const [date, setDate] = useState(isoDate(today));
  const [category, setCategory] = useState<Category>("geral");
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [text, setText] = useState("");
  const [source, setSource] = useState<"voz" | "texto">("texto");
  const [title, setTitle] = useState("Atividade");
  const [score, setScore] = useState(7);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (classes.length > 0 && !classes.some((room) => room.id === classId)) {
    setClassId(classes[0].id);
  }

  const classStudents = students
    .filter((student) => student.classId === classId)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  useEffect(() => {
    if (!prefill) return;
    setClassId(prefill.classId);
    setStudentId(prefill.studentId);
    setMode("observacao");
    setNotice(null);
    setError(null);
  }, [prefill]);

  useEffect(() => {
    const list = students.filter((student) => student.classId === classId);
    if (!list.some((student) => student.id === studentId)) {
      setStudentId(list[0]?.id ?? "");
    }
  }, [classId, studentId, students]);

  const voice = useVoice((chunk) => {
    setText((current) => (current.trim() ? `${current.trim()} ${chunk}` : chunk));
    setSource("voz");
    if (!categoryTouched) {
      const suggested = suggestCategory(chunk);
      if (suggested) setCategory(suggested);
    }
  });

  function flash(message: string) {
    setNotice(message);
    setError(null);
  }

  function saveObservation() {
    const clean = text.trim();
    if (!studentId) {
      setError("Escolha um aluno.");
      return;
    }
    if (!clean) {
      setError("Grave ou escreva a observação antes de salvar.");
      return;
    }
    onSaveObservation({
      studentId,
      classId,
      date,
      category,
      text: clean,
      source,
    });
    const student = students.find((item) => item.id === studentId);
    setText("");
    setSource("texto");
    setCategoryTouched(false);
    flash(`Observação de ${student?.name ?? "aluno"} salva em ${date.split("-").reverse().join("/")}.`);
  }

  function saveGrade() {
    if (!studentId) {
      setError("Escolha um aluno.");
      return;
    }
    if (!title.trim()) {
      setError("Dê um nome para a nota.");
      return;
    }
    if (Number.isNaN(score) || score < 0 || score > 10) {
      setError("A nota fica entre 0 e 10.");
      return;
    }
    onSaveGrade({
      studentId,
      classId,
      date,
      title: title.trim(),
      score,
    });
    const student = students.find((item) => item.id === studentId);
    flash(`Nota de ${student?.name ?? "aluno"} lançada.`);
  }

  const marked = classStudents.filter((student) =>
    attendance.some((row) => row.studentId === student.id && row.date === date),
  ).length;

  return (
    <Panel id="registrar" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Registro</Eyebrow>
          <h2 className="font-serif text-2xl font-medium tracking-tight">O que aconteceu na aula</h2>
        </div>
        <div className="grid grid-cols-3 rounded-md bg-bg p-1" role="tablist" aria-label="Tipo de registro">
          {(
            [
              ["observacao", "Observação"],
              ["nota", "Nota"],
              ["chamada", "Chamada"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => {
                setMode(id);
                setError(null);
              }}
              className={
                mode === id
                  ? "h-10 rounded-md bg-primary text-sm font-medium text-primary-fg"
                  : "h-10 rounded-md text-sm font-medium text-muted"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex min-w-0 flex-col gap-1.5 text-sm">
          <span className="font-medium text-muted">Turma</span>
          <select
            className={controlClassName()}
            value={classId}
            onChange={(event) => setClassId(event.target.value)}
          >
            {classes.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} · {room.subject}
              </option>
            ))}
          </select>
        </label>
        {mode === "chamada" ? (
          <label className="flex min-w-0 flex-col gap-1.5 text-sm sm:col-span-2">
            <span className="font-medium text-muted">Data da chamada</span>
            <input
              type="date"
              className={controlClassName()}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
        ) : (
          <>
            <label className="flex min-w-0 flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted">Aluno</span>
              <select
                className={controlClassName()}
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
              >
                {classStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-0 flex-col gap-1.5 text-sm">
              <span className="font-medium text-muted">Data</span>
              <input
                type="date"
                className={controlClassName()}
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
          </>
        )}
      </div>

      {mode === "observacao" ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Categoria">
            {CATEGORIES.map((item) => {
              const selected = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setCategory(item.id);
                    setCategoryTouched(true);
                  }}
                  className={
                    selected
                      ? "h-10 rounded-md bg-primary px-3 text-sm font-medium text-primary-fg"
                      : "h-10 rounded-md border border-line px-3 text-sm font-medium text-fg"
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative grid size-44 place-items-center">
              {voice.listening ? (
                <>
                  <span className="listen-ring pointer-events-none absolute size-32 rounded-full border border-primary" />
                  <span className="listen-ring listen-ring-late pointer-events-none absolute size-32 rounded-full border border-primary" />
                </>
              ) : null}
              <button
                type="button"
                aria-pressed={voice.listening}
                onClick={voice.toggle}
                className="press relative grid size-32 place-items-center rounded-full bg-primary text-primary-fg"
              >
                {voice.listening ? (
                  <Square className="size-7" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Mic className="size-8" strokeWidth={1.75} aria-hidden="true" />
                )}
                <span className="sr-only">{voice.listening ? "Parar gravação" : "Gravar observação"}</span>
              </button>
            </div>
            <p className="text-center text-sm text-muted">
              {voice.listening
                ? "Ouvindo… toque de novo para parar."
                : "Toque para falar. A transcrição pode ser editada antes de salvar."}
            </p>
          </div>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-muted">Observação</span>
            <textarea
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                if (source === "voz" && event.target.value.trim() === "") setSource("texto");
              }}
              rows={4}
              aria-live="polite"
              placeholder="Participação, comportamento, dificuldade ou evolução."
              className="min-h-28 w-full resize-y rounded-md border border-line bg-card px-3 py-3 text-base text-fg"
            />
          </label>
          {voice.interim ? <p className="text-sm text-muted">Ouvindo: {voice.interim}</p> : null}
          {voice.message ? <p className="text-sm text-fg">{voice.message}</p> : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-subtle">{source === "voz" ? "Entrada por voz" : "Entrada escrita"}</p>
            <Button onClick={saveObservation}>Salvar observação</Button>
          </div>
        </div>
      ) : null}

      {mode === "nota" ? (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-muted">Nome da avaliação</span>
            <input
              className={controlClassName()}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <div className="flex items-center justify-center gap-4 py-2">
            <Button
              variant="ghost"
              className="size-12 px-0"
              aria-label="Diminuir nota"
              onClick={() => setScore((value) => Math.max(0, Math.round((value - 0.5) * 10) / 10))}
            >
              −
            </Button>
            <p className="min-w-24 text-center font-serif text-5xl tabular-nums">
              {score.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </p>
            <Button
              variant="ghost"
              className="size-12 px-0"
              aria-label="Aumentar nota"
              onClick={() => setScore((value) => Math.min(10, Math.round((value + 0.5) * 10) / 10))}
            >
              +
            </Button>
          </div>
          <p className="text-center text-sm text-muted">Escala de 0 a 10, meio ponto.</p>
          <div className="flex justify-end">
            <Button onClick={saveGrade}>Salvar nota</Button>
          </div>
        </div>
      ) : null}

      {mode === "chamada" ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            {marked} de {classStudents.length} lançados. P presente, F falta, A atraso, J justificada.
          </p>
          <ul className="flex flex-col gap-2">
            {classStudents.map((student) => {
              const current = attendance.find(
                (row) => row.studentId === student.id && row.date === date,
              );
              return (
                <li
                  key={student.id}
                  className="flex flex-col gap-2 rounded-md bg-bg px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="min-w-0 truncate text-sm font-medium">{student.name}</span>
                  <div className="grid grid-cols-4 gap-1">
                    {ATTENDANCE_OPTIONS.map((option) => {
                      const selected = current?.status === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          aria-label={`${option.label} para ${student.name}`}
                          aria-pressed={selected}
                          onClick={() =>
                            onUpsertAttendance({
                              studentId: student.id,
                              classId,
                              date,
                              status: option.id,
                            })
                          }
                          className={
                            selected
                              ? "h-11 rounded-md bg-primary text-sm font-medium text-primary-fg"
                              : "h-11 rounded-md border border-line bg-card text-sm font-medium text-fg"
                          }
                        >
                          {option.short}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {notice ? <p className="text-sm text-ok">{notice}</p> : null}
    </Panel>
  );
}
