import { BookOpen, ClipboardList, House, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AssistantView } from "@/components/pedagogico/assistant-view";
import { ClassesView } from "@/components/pedagogico/classes-view";
import { ConsultView } from "@/components/pedagogico/consult-view";
import { HomeView } from "@/components/pedagogico/home-view";
import { TeacherLogin } from "@/components/pedagogico/teacher-login";
import { TestBanner } from "@/components/pedagogico/test-banner";
import { Button, controlClassName } from "@/components/pedagogico/ui";
import { UserButton } from "@/lib/auth/gates";
import { authClient } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatLong, isoDate } from "@/lib/pedagogico/dates";
import { DEFAULT_PLACE } from "@/lib/pedagogico/report";
import { createSeed } from "@/lib/pedagogico/seed";
import { TEST_PUBLICATION } from "@/lib/pedagogico/test-publication";
import { usePedStore } from "@/lib/pedagogico/store";
import type { PedData } from "@/lib/pedagogico/types";
import {
  clearLegacyPedData,
  emptyPedData,
  pedHasRows,
  readLegacyPedData,
  snapshotPed,
} from "@/lib/pedagogico/workspace";
import { loadWorkspace, saveTeacherProfile, saveWorkspace } from "@/lib/pedagogico/workspace.functions";
import { cn } from "@/lib/utils";

type View = "inicio" | "consultar" | "assistente" | "turmas";

const NAV: { id: View; label: string; icon: typeof House }[] = [
  { id: "inicio", label: "Início", icon: House },
  { id: "consultar", label: "Consultar", icon: ClipboardList },
  { id: "assistente", label: "Assistente", icon: Sparkles },
  { id: "turmas", label: "Turmas", icon: BookOpen },
];

export function PedagogicoApp() {
  const { user, isPending } = useCurrentUserState();
  const [mounted, setMounted] = useState(false);
  const [sessionSlow, setSessionSlow] = useState(false);
  const [sessionAttempt, setSessionAttempt] = useState(0);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted || !isPending) {
      setSessionSlow(false);
      return;
    }
    const retry = window.setTimeout(() => {
      void authClient.getSession();
    }, 4_000);
    const slow = window.setTimeout(() => setSessionSlow(true), 8_000);
    return () => {
      window.clearTimeout(retry);
      window.clearTimeout(slow);
    };
  }, [mounted, isPending, sessionAttempt]);
  if (!mounted || isPending) {
    return (
      <LoadingShell
        label="Abrindo a sessão…"
        slow={sessionSlow}
        onRetry={() => {
          setSessionSlow(false);
          setSessionAttempt((value) => value + 1);
          void authClient.getSession();
        }}
      />
    );
  }
  if (!user) return <TeacherLogin />;
  return <WorkspaceHost userId={user.id} accountName={user.displayName?.trim() ?? ""} />;
}

function LoadingShell({
  label,
  slow = false,
  onRetry,
}: {
  label: string;
  slow?: boolean;
  onRetry?: () => void;
}) {
  return (
    <main className="mx-auto min-h-dvh max-w-5xl">
      <TestBanner />
      <div className="px-4 py-8">
        <p className="text-sm font-medium text-muted">Sala de aula</p>
        <h1 className="display-title mt-1">
          Acompanhamento <span className="italic">pedagógico</span>
        </h1>
        <p className="mt-3 text-sm text-muted">{label}</p>
        <a
          className="session-retry mt-3 inline-block text-sm text-primary underline"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            window.location.reload();
          }}
        >
          A sessão demorou. Recarregar a página
        </a>
        {slow ? (
          <div className="mt-3 flex max-w-md flex-col items-start gap-2">
            <p className="text-sm">A sessão não respondeu. Nada foi apagado.</p>
            {onRetry ? (
              <Button onClick={onRetry}>Tentar de novo</Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}

function WorkspaceHost({ userId, accountName }: { userId: string; accountName: string }) {
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [teacherName, setTeacherName] = useState("");
  const [place, setPlace] = useState("");
  const [legacy, setLegacy] = useState<PedData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saveLabel, setSaveLabel] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [boundUser, setBoundUser] = useState(userId);
  if (boundUser !== userId) {
    setBoundUser(userId);
    setPhase("loading");
    setLegacy(null);
    setTeacherName("");
    setPlace("");
    setSaveLabel("");
    setLoadError("");
  }

  useEffect(() => {
    let active = true;
    setPhase("loading");
    setSaveLabel("");
    usePedStore.getState().replaceAll(emptyPedData());
    const timer = window.setTimeout(() => {
      if (!active) return;
      setLoadError("Os registros demoraram para abrir. Nada foi apagado.");
      setPhase("error");
    }, 12_000);
    void loadWorkspace()
      .then((result) => {
        if (!active) return;
        window.clearTimeout(timer);
        if (result.data && pedHasRows(result.data)) usePedStore.getState().replaceAll(result.data);
        setTeacherName(result.teacherName.trim() || accountName);
        setPlace(result.place.trim() || DEFAULT_PLACE);
        const stored = readLegacyPedData();
        setLegacy(stored && pedHasRows(stored) ? stored : null);
        setPhase("ready");
      })
      .catch(() => {
        if (!active) return;
        window.clearTimeout(timer);
        setLoadError("Não foi possível abrir os registros desta conta. Nada foi apagado.");
        setPhase("error");
      });
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [userId, accountName, loadAttempt]);

  useEffect(() => {
    if (phase !== "ready") return;
    let timer = 0;
    let ticket = 0;
    const unsub = usePedStore.subscribe(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const current = ++ticket;
        const data = snapshotPed(usePedStore.getState());
        setSaveLabel("Salvando…");
        void saveWorkspace({ data })
          .then((result) => {
            if (current !== ticket) return;
            setSaveLabel(result.ok ? "Salvo na sua conta" : result.message);
          })
          .catch(() => {
            if (current === ticket) setSaveLabel("Não foi possível salvar na conta.");
          });
      }, 600);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, [phase, userId]);

  async function commitProfile(nextName: string, nextPlace: string) {
    try {
      await saveTeacherProfile({ data: { displayName: nextName, place: nextPlace } });
    } catch {
      setSaveLabel("Não foi possível salvar o nome do professor.");
    }
  }

  async function importLegacy() {
    if (!legacy) return;
    if (!window.confirm("Isso substitui os registros desta conta pela cópia antiga deste navegador. Continuar?")) return;
    usePedStore.getState().replaceAll(legacy);
    try {
      const saved = await saveWorkspace({ data: legacy });
      if (!saved.ok) {
        setSaveLabel(saved.message);
        return;
      }
      clearLegacyPedData();
      setLegacy(null);
      setSaveLabel("Cópia deste navegador importada para a conta.");
    } catch {
      setSaveLabel("A cópia entrou na tela, mas não foi gravada na conta. O navegador ainda guarda o arquivo antigo.");
    }
  }

  if (phase === "loading") return <LoadingShell label="Abrindo os registros da conta…" />;
  if (phase === "error") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col gap-3 px-4 py-8">
        <h1 className="display-title">Acompanhamento <span className="italic">pedagógico</span></h1>
        <p className="text-sm">{loadError}</p>
        <Button className="self-start" onClick={() => setLoadAttempt((value) => value + 1)}>
          Tentar de novo
        </Button>
      </main>
    );
  }

  return (
    <ReadyApp
      teacherName={teacherName}
      place={place}
      saveLabel={saveLabel}
      legacy={legacy}
      onTeacherName={setTeacherName}
      onPlace={setPlace}
      onProfileCommit={(nextName, nextPlace) => void commitProfile(nextName, nextPlace)}
      onImportLegacy={() => void importLegacy()}
      onDismissLegacy={() => setLegacy(null)}
      onLoadDemo={() => usePedStore.getState().replaceAll(createSeed(new Date()))}
    />
  );
}

function ReadyApp({
  teacherName,
  place,
  saveLabel,
  legacy,
  onTeacherName,
  onPlace,
  onProfileCommit,
  onImportLegacy,
  onDismissLegacy,
  onLoadDemo,
}: {
  teacherName: string;
  place: string;
  saveLabel: string;
  legacy: PedData | null;
  onTeacherName: (value: string) => void;
  onPlace: (value: string) => void;
  onProfileCommit: (name: string, place: string) => void;
  onImportLegacy: () => void;
  onDismissLegacy: () => void;
  onLoadDemo: () => void;
}) {
  const classCount = usePedStore((state) => state.classes.length);
  const firstClassId = usePedStore((state) => state.classes[0]?.id ?? "");
  const [today] = useState(() => new Date());
  const [view, setView] = useState<View>("inicio");
  const [classId, setClassId] = useState(firstClassId);
  const [studentId, setStudentId] = useState("all");
  const [prefill, setPrefill] = useState<{ classId: string; studentId: string; nonce: number } | null>(null);
  const profileTimer = useRef(0);

  useEffect(() => {
    if (!classId && firstClassId) setClassId(firstClassId);
  }, [classId, firstClassId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  function scheduleProfile(nextName: string, nextPlace: string) {
    window.clearTimeout(profileTimer.current);
    profileTimer.current = window.setTimeout(() => onProfileCommit(nextName, nextPlace), 500);
  }

  function openStudent(nextClass: string, nextStudent: string) {
    setClassId(nextClass);
    setStudentId(nextStudent);
    setView("consultar");
  }

  function recordAbout(nextClass: string, nextStudent: string) {
    setPrefill({ classId: nextClass, studentId: nextStudent, nonce: Date.now() });
    setView("inicio");
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <TestBanner />
      <header className="mx-auto flex w-full max-w-5xl flex-col px-4 pt-6 md:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Sala de aula</p>
            <h1 className="display-title">
              Acompanhamento <span className="italic">pedagógico</span>
            </h1>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            <p className="text-sm text-muted">{formatLong(isoDate(today))}</p>
            <UserButton />
            {saveLabel ? <p className="text-xs text-muted">{saveLabel}</p> : null}
          </div>
        </div>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Conta de teste. Carregue a sala fictícia e gere o parecer dela. Não use aluno real.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            Nome no parecer
            <input
              className={controlClassName()}
              value={teacherName}
              maxLength={80}
              onChange={(event) => {
                onTeacherName(event.target.value);
                scheduleProfile(event.target.value, place);
              }}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Local no parecer
            <input
              className={controlClassName()}
              value={place}
              maxLength={80}
              placeholder="Cidade, sem inventar"
              onChange={(event) => {
                onPlace(event.target.value);
                scheduleProfile(teacherName, event.target.value);
              }}
            />
          </label>
        </div>
        <nav className="dock fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-line bg-card md:static md:mt-5 md:flex md:gap-2 md:border-0 md:bg-transparent md:p-0" aria-label="Seções">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => setView(item.id)}
                className={cn(
                  "flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium leading-tight md:flex-row md:rounded-full md:px-4 md:text-xs",
                  active ? "text-primary md:bg-primary md:text-primary-fg" : "text-muted",
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-5 pb-28 md:px-8 md:pb-16">
        {legacy && !TEST_PUBLICATION ? (
          <section className="panel flex flex-col gap-2 p-4">
            <p className="text-sm">
              Este navegador ainda tem uma cópia antiga dos registros. Ela não entra sozinha. Importar substitui o que está nesta conta.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={onImportLegacy}>Importar cópia deste navegador</Button>
              <Button variant="ghost" onClick={onDismissLegacy}>
                Agora não
              </Button>
            </div>
          </section>
        ) : null}
        {legacy && TEST_PUBLICATION ? (
          <section className="panel p-4">
            <p className="text-sm">
              Este navegador tem uma cópia antiga. Esta versão de teste não a importa, para não misturar dado real com a sala fictícia.
            </p>
          </section>
        ) : null}
        {classCount === 0 ? (
          <section className="panel flex flex-col gap-2 p-4">
            <p className="text-sm">Esta conta ainda não tem turma. A sala fictícia é só um exemplo, marcada como demonstração.</p>
            <Button className="self-start" onClick={onLoadDemo}>
              Carregar sala fictícia
            </Button>
          </section>
        ) : null}
        {view === "inicio" ? (
          <HomeView
            today={today}
            classId={classId || firstClassId}
            prefill={prefill}
            onConsultStudent={(nextClass, nextStudent) => {
              openStudent(nextClass, nextStudent);
            }}
          />
        ) : null}
        {view === "consultar" ? (
          <ConsultView
            today={today}
            classId={classId}
            studentId={studentId}
            teacher={teacherName}
            place={place}
            onClassId={setClassId}
            onStudentId={setStudentId}
          />
        ) : null}
        {view === "assistente" ? <AssistantView today={today} /> : null}
        {view === "turmas" ? (
          <ClassesView
            today={today}
            onOpenStudent={(nextClass, nextStudent) => {
              recordAbout(nextClass, nextStudent);
              openStudent(nextClass, nextStudent);
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
