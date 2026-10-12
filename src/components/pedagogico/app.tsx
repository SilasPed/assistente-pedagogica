import { BookOpen, ClipboardList, House, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AssistantView } from "@/components/pedagogico/assistant-view";
import { ClassesView } from "@/components/pedagogico/classes-view";
import { ConsultView } from "@/components/pedagogico/consult-view";
import { HomeView } from "@/components/pedagogico/home-view";
import { formatLong, isoDate } from "@/lib/pedagogico/dates";
import { usePedStore } from "@/lib/pedagogico/store";
import { cn } from "@/lib/utils";

type View = "inicio" | "consultar" | "assistente" | "turmas";

const NAV: { id: View; label: string; icon: typeof House }[] = [
  { id: "inicio", label: "Início", icon: House },
  { id: "consultar", label: "Consultar", icon: ClipboardList },
  { id: "assistente", label: "Assistente", icon: Sparkles },
  { id: "turmas", label: "Turmas", icon: BookOpen },
];

export function PedagogicoApp() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.resolve(usePedStore.persist.rehydrate()).finally(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <main className="mx-auto min-h-dvh max-w-5xl px-4 py-8">
        <p className="text-sm font-medium text-muted">Sala de aula</p>
        <h1 className="display-title mt-1">
          Acompanhamento <span className="italic">pedagógico</span>
        </h1>
        <p className="mt-3 text-sm text-muted">Abrindo os registros da sala…</p>
      </main>
    );
  }

  return <ReadyApp />;
}

function ReadyApp() {
  const classes = usePedStore((state) => state.classes);
  const [today] = useState(() => new Date());
  const [view, setView] = useState<View>("inicio");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [studentId, setStudentId] = useState("all");
  const [prefill, setPrefill] = useState<{ classId: string; studentId: string; nonce: number } | null>(
    null,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

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
      <header className="mx-auto flex w-full max-w-5xl flex-col px-4 pt-6 md:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted">Sala de aula</p>
            <h1 className="display-title">
              Acompanhamento <span className="italic">pedagógico</span>
            </h1>
          </div>
          <p className="text-sm text-muted">{formatLong(isoDate(today))}</p>
        </div>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Exemplo pronto para usar. Observações, notas e frequência ficam neste aparelho.
        </p>
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
        {view === "inicio" ? (
          <HomeView
            today={today}
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
