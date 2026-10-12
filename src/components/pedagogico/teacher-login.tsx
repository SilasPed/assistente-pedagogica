import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { Button, controlClassName } from "@/components/pedagogico/ui";
import { TestBanner } from "@/components/pedagogico/test-banner";

export function TeacherLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result =
      mode === "criar"
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password, callbackURL: "/" })
        : await authClient.signIn.email({ email: email.trim(), password, callbackURL: "/" });
    setBusy(false);
    if (result.error) {
      setError("Não foi possível entrar. Confira o e-mail e a senha, ou crie a conta do professor.");
      return;
    }
    window.location.assign("/");
  }

  return (
    <div className="min-h-dvh">
      <TestBanner />
      <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col justify-center gap-4 px-4 py-10">
      <div>
        <p className="text-sm font-medium text-muted">Sala de aula</p>
        <h1 className="display-title mt-1">
          Acompanhamento <span className="italic">pedagógico</span>
        </h1>
        <p className="mt-3 text-sm text-muted">
          Entre para testar com a sala fictícia. Sem login, os exemplos não abrem. Não cadastre aluno real.
        </p>
      </div>
      <form className="panel flex flex-col gap-3 p-4" onSubmit={(event) => void submit(event)}>
        {mode === "criar" ? (
          <label className="flex flex-col gap-1 text-sm">
            Nome
            <input className={controlClassName()} value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
        ) : null}
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input className={controlClassName()} type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Senha
          <input className={controlClassName()} type="password" autoComplete={mode === "criar" ? "new-password" : "current-password"} minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error ? <p className="text-sm">{error}</p> : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Aguarde…" : mode === "criar" ? "Criar conta" : "Entrar"}
        </Button>
        <button type="button" className="text-sm font-medium text-muted" onClick={() => { setMode(mode === "criar" ? "entrar" : "criar"); setError(""); }}>
          {mode === "criar" ? "Já tenho conta" : "Criar conta de professor"}
        </button>
      </form>
      <div className="flex flex-col gap-2">
        {GROK_PROVIDERS.map((provider) => (
          <button
            key={provider.providerId}
            type="button"
            className="press h-11 rounded-md border border-line bg-card text-sm font-medium"
            onClick={() => void signIn(provider.providerId, { callbackURL: "/" })}
          >
            Continuar com {provider.label}
          </button>
        ))}
      </div>
    </main>
    </div>
  );
}
