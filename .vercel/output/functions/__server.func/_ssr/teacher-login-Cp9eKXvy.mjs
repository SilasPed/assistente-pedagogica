import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as GROK_PROVIDERS } from "./server-Dnb-uQaE.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teacher-login-Cp9eKXvy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Panel({ className, children, id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		className: cn("panel p-4 md:p-5", className),
		children
	});
}
function Eyebrow({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm font-medium text-muted",
		children
	});
}
function controlClassName() {
	return "h-11 w-full min-w-0 rounded-md border border-line bg-card px-3 text-base text-fg";
}
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("press inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium disabled:opacity-40", variant === "primary" && "h-11 bg-primary px-4 text-primary-fg", variant === "ghost" && "h-11 border border-line bg-card px-4 text-fg", variant === "quiet" && "text-muted", className),
		...props
	});
}
function TeacherLogin() {
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("entrar");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setBusy(true);
		setError("");
		const result = mode === "criar" ? await authClient.signUp.email({
			name: name.trim(),
			email: email.trim(),
			password,
			callbackURL: "/"
		}) : await authClient.signIn.email({
			email: email.trim(),
			password,
			callbackURL: "/"
		});
		setBusy(false);
		if (result.error) {
			setError("Não foi possível entrar. Confira o e-mail e a senha, ou crie a conta do professor.");
			return;
		}
		window.location.assign("/");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted",
					children: "Sala de aula"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "display-title mt-1",
					children: ["Acompanhamento ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "italic",
						children: "pedagógico"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Entre com a conta do professor. Sem login, os registros dos alunos não abrem e não vão para o servidor."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel flex flex-col gap-3 p-4",
				onSubmit: (event) => void submit(event),
				children: [
					mode === "criar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["Nome", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: controlClassName(),
							value: name,
							onChange: (event) => setName(event.target.value),
							required: true
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["E-mail", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: controlClassName(),
							type: "email",
							autoComplete: "username",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["Senha", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: controlClassName(),
							type: "password",
							autoComplete: mode === "criar" ? "new-password" : "current-password",
							minLength: 8,
							value: password,
							onChange: (event) => setPassword(event.target.value),
							required: true
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: busy ? "Aguarde…" : mode === "criar" ? "Criar conta" : "Entrar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm font-medium text-muted",
						onClick: () => {
							setMode(mode === "criar" ? "entrar" : "criar");
							setError("");
						},
						children: mode === "criar" ? "Já tenho conta" : "Criar conta de professor"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "press h-11 rounded-md border border-line bg-card text-sm font-medium",
					onClick: () => void signIn(provider.providerId, { callbackURL: "/" }),
					children: ["Continuar com ", provider.label]
				}, provider.providerId))
			})
		]
	});
}
//#endregion
export { cn as a, TeacherLogin as i, Eyebrow as n, controlClassName as o, Panel as r, Button as t };
