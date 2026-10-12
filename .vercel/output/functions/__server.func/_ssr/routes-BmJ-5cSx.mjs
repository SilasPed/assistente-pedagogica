import { o as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-FkX9NQas.mjs";
import { l as addDays } from "../_libs/date-fns.mjs";
import { C as resolvePeriod, E as summarizeStudent, S as relativeDay, T as summarizeClass, _ as isoDate, a as EXAM_KINDS, b as previousPeriod, c as defaultPeriodKey, d as fmtScore, f as formatDay, g as inRange, h as frequency, i as CATEGORIES, l as examKindLabel, m as formatRange, n as AI_TAG_LABELS, o as attentionForClass, p as formatLong, r as ATTENDANCE_OPTIONS, s as categoryLabel, u as firstName, v as mean, w as suggestCategory, x as recentWeekdays, y as periodOptions } from "./insights-DdMgi_fN.mjs";
import { i as signOut, t as authClient } from "./client-IWHfIGH2.mjs";
import { a as hasGateSessionMarker } from "./server-Dnb-uQaE.mjs";
import { a as cn, i as TeacherLogin, n as Eyebrow, o as controlClassName, r as Panel, t as Button } from "./teacher-login-Cp9eKXvy.mjs";
import { a as Mic, c as Check, i as Plus, l as BookOpen, n as Square, o as House, r as Sparkles, s as ClipboardList } from "../_libs/lucide-react.mjs";
import { a as pedHasRows, c as snapshotPed, i as pedDataFromUnknown, n as emptyPedData, o as readLegacyPedData, r as legacyStateFromJson, s as restoreDemoData, t as clearLegacyPedData } from "./workspace-9sPa0GGy.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as Paragraph, c as TableRow, i as Packer, l as TextRun, n as BorderStyle, o as Table, r as File, s as TableCell, t as AlignmentType, u as WidthType } from "../_libs/docx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BmJ-5cSx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var assistantAvailability = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("913178b5974f6a7505593057104a405a54e43ac8c1b9f7d65ea7c2b0042855c6"));
var runAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("465efbab6ced4d9e382fe76362009d92b4327f7ca239d68e366c11359ae864ad"));
var STATUS = {
	P: "presente",
	F: "falta",
	A: "atraso",
	J: "justificada"
};
var ROLLS = {
	alice: "PPPPPPPP",
	bruno: "PPAPPPPP",
	camila: "PFPFPFPF",
	diego: "PPPPPPPP",
	elena: "PPPPPPJP",
	felipe: "PPPFPPPP",
	helena: "PPPPPPPP",
	igor: "PPPPAPPP",
	julia: "PPJPPPPP",
	kaique: "APAPPAPP",
	lara: "PPPPPPPP",
	miguel: "PPFPPFPP"
};
var NOTES = [
	[
		"alice",
		"7a",
		-16,
		"evolucao",
		"Passou a explicar o raciocínio em voz alta. Os erros de sinal diminuíram."
	],
	[
		"alice",
		"7a",
		-8,
		"participacao",
		"Levantou a mão várias vezes e ajudou o colega da frente sem ser solicitada."
	],
	[
		"alice",
		"7a",
		-2,
		"evolucao",
		"Resolveu o problema de equações sem ajuda e explicou o caminho para a dupla."
	],
	[
		"bruno",
		"7a",
		-9,
		"comportamento",
		"O grupo dispersou no início. Depois do combinado, trabalhou até o fim da aula."
	],
	[
		"camila",
		"7a",
		-18,
		"comportamento",
		"Chegou no segundo tempo. Disse que ajuda a cuidar do irmão de manhã."
	],
	[
		"camila",
		"7a",
		-7,
		"dificuldades",
		"Não acompanhou a correção. Ficou em silêncio quando foi chamada."
	],
	[
		"camila",
		"7a",
		-1,
		"geral",
		"Faltou de novo. Vale um contato com a família antes da prova."
	],
	[
		"diego",
		"7a",
		-15,
		"dificuldades",
		"Travou na passagem da linguagem para a equação. Copiou o quadro, mas não resolveu sozinho."
	],
	[
		"diego",
		"7a",
		-6,
		"dificuldades",
		"Confundiu incógnita e coeficiente no exercício 4."
	],
	[
		"diego",
		"7a",
		-4,
		"participacao",
		"Pediu para refazer o exercício no intervalo. Tentou, ainda com apoio."
	],
	[
		"elena",
		"7a",
		-12,
		"participacao",
		"Apresentou a resolução no quadro com segurança."
	],
	[
		"elena",
		"7a",
		-5,
		"evolucao",
		"Organizou o caderno e passou a entregar as tarefas no prazo."
	],
	[
		"felipe",
		"7a",
		-14,
		"comportamento",
		"Interrompeu a explicação duas vezes. No fim da aula reconheceu e combinamos um sinal."
	],
	[
		"felipe",
		"7a",
		-1,
		"participacao",
		"Participou da correção com respostas curtas e corretas."
	],
	[
		"helena",
		"8b",
		-11,
		"evolucao",
		"O relatório de observação do pátio ficou claro, com hipótese e evidência separadas."
	],
	[
		"igor",
		"8b",
		-7,
		"participacao",
		"Quase não fala em aula. No papel, respondeu com precisão."
	],
	[
		"julia",
		"8b",
		-16,
		"dificuldades",
		"O texto do relatório misturou opinião e dado. Precisa de um modelo na próxima versão."
	],
	[
		"julia",
		"8b",
		-4,
		"evolucao",
		"Reescreveu o relatório separando o que observou do que concluiu."
	],
	[
		"kaique",
		"8b",
		-6,
		"comportamento",
		"Terceiro atraso da semana. Entrou sem o caderno de ciências."
	],
	[
		"lara",
		"8b",
		-8,
		"geral",
		"Entrega constante. Ajudou a organizar o material do grupo sem ser chamada."
	],
	[
		"miguel",
		"8b",
		-13,
		"dificuldades",
		"Não concluiu a atividade de cadeias alimentares."
	],
	[
		"miguel",
		"8b",
		-3,
		"dificuldades",
		"Disse que não estudou. A nota da última atividade caiu."
	]
];
var STUDENTS = [
	{
		id: "alice",
		classId: "7a",
		name: "Alice Moreira",
		origin: "demo"
	},
	{
		id: "bruno",
		classId: "7a",
		name: "Bruno Carvalho",
		origin: "demo"
	},
	{
		id: "camila",
		classId: "7a",
		name: "Camila Dias",
		origin: "demo"
	},
	{
		id: "diego",
		classId: "7a",
		name: "Diego Nunes",
		origin: "demo"
	},
	{
		id: "elena",
		classId: "7a",
		name: "Elena Rocha",
		origin: "demo"
	},
	{
		id: "felipe",
		classId: "7a",
		name: "Felipe Andrade",
		origin: "demo"
	},
	{
		id: "helena",
		classId: "8b",
		name: "Helena Martins",
		origin: "demo"
	},
	{
		id: "igor",
		classId: "8b",
		name: "Igor Pacheco",
		origin: "demo"
	},
	{
		id: "julia",
		classId: "8b",
		name: "Júlia Ferreira",
		origin: "demo"
	},
	{
		id: "kaique",
		classId: "8b",
		name: "Kaique Lima",
		origin: "demo"
	},
	{
		id: "lara",
		classId: "8b",
		name: "Lara Souza",
		origin: "demo"
	},
	{
		id: "miguel",
		classId: "8b",
		name: "Miguel Torres",
		origin: "demo"
	}
];
function createSeed(now) {
	const day = (offset) => isoDate(addDays(now, offset));
	const weekdays = recentWeekdays(now, 8);
	const attendance = [];
	for (const student of STUDENTS) {
		const roll = ROLLS[student.id] ?? "PPPPPPPP";
		weekdays.forEach((date, index) => {
			const code = roll[index] ?? "P";
			attendance.push({
				id: `att-${student.id}-${isoDate(date)}`,
				studentId: student.id,
				classId: student.classId,
				date: isoDate(date),
				status: STATUS[code] ?? "presente",
				origin: "demo"
			});
		});
	}
	return {
		classes: [{
			id: "7a",
			name: "7º A",
			subject: "Matemática",
			origin: "demo"
		}, {
			id: "8b",
			name: "8º B",
			subject: "Ciências",
			origin: "demo"
		}],
		students: STUDENTS,
		observations: NOTES.map(([studentId, classId, offset, category, text], index) => ({
			id: `obs-${index + 1}`,
			studentId,
			classId,
			date: day(offset),
			category,
			text,
			source: "texto",
			createdAt: `${day(offset)}T12:00:00.000Z`,
			origin: "demo"
		})),
		grades: [
			[
				"alice",
				"7a",
				-28,
				"Prova de frações",
				7.6
			],
			[
				"alice",
				"7a",
				-4,
				"Lista de equações",
				8.4
			],
			[
				"bruno",
				"7a",
				-28,
				"Prova de frações",
				7
			],
			[
				"bruno",
				"7a",
				-4,
				"Lista de equações",
				7.2
			],
			[
				"camila",
				"7a",
				-28,
				"Prova de frações",
				6.5
			],
			[
				"camila",
				"7a",
				-4,
				"Lista de equações",
				6
			],
			[
				"diego",
				"7a",
				-28,
				"Prova de frações",
				5.5
			],
			[
				"diego",
				"7a",
				-4,
				"Lista de equações",
				4.8
			],
			[
				"elena",
				"7a",
				-28,
				"Prova de frações",
				7.2
			],
			[
				"elena",
				"7a",
				-4,
				"Lista de equações",
				8
			],
			[
				"felipe",
				"7a",
				-28,
				"Prova de frações",
				6.8
			],
			[
				"felipe",
				"7a",
				-4,
				"Lista de equações",
				7
			],
			[
				"helena",
				"8b",
				-28,
				"Prova de células",
				9
			],
			[
				"helena",
				"8b",
				-4,
				"Relatório do pátio",
				9.2
			],
			[
				"igor",
				"8b",
				-28,
				"Prova de células",
				6.5
			],
			[
				"igor",
				"8b",
				-4,
				"Relatório do pátio",
				6.4
			],
			[
				"julia",
				"8b",
				-28,
				"Prova de células",
				6
			],
			[
				"julia",
				"8b",
				-4,
				"Relatório do pátio",
				7.5
			],
			[
				"kaique",
				"8b",
				-28,
				"Prova de células",
				7
			],
			[
				"kaique",
				"8b",
				-4,
				"Relatório do pátio",
				6.6
			],
			[
				"lara",
				"8b",
				-28,
				"Prova de células",
				8
			],
			[
				"lara",
				"8b",
				-4,
				"Relatório do pátio",
				8.1
			],
			[
				"miguel",
				"8b",
				-28,
				"Prova de células",
				7.2
			],
			[
				"miguel",
				"8b",
				-4,
				"Relatório do pátio",
				5.5
			]
		].map(([studentId, classId, offset, title, score], index) => ({
			id: `grade-${index + 1}`,
			studentId,
			classId,
			date: day(offset),
			title,
			score,
			origin: "demo"
		})),
		attendance,
		exams: [
			{
				id: "exam-1",
				classId: "8b",
				title: "Entrega do relatório reescrito",
				date: day(3),
				kind: "trabalho",
				origin: "demo"
			},
			{
				id: "exam-2",
				classId: "7a",
				title: "Prova de equações",
				date: day(5),
				kind: "prova",
				origin: "demo"
			},
			{
				id: "exam-3",
				classId: "8b",
				title: "Avaliação de ecossistemas",
				date: day(11),
				kind: "prova",
				origin: "demo"
			},
			{
				id: "exam-4",
				classId: "7a",
				title: "Recuperação paralela",
				date: day(14),
				kind: "recuperacao",
				origin: "demo"
			}
		],
		pendings: [
			{
				id: "pend-1",
				classId: "8b",
				studentId: null,
				title: "Lançar as notas do relatório de ciências",
				due: day(-2),
				done: false,
				origin: "demo"
			},
			{
				id: "pend-2",
				classId: "7a",
				studentId: "camila",
				title: "Falar com a família da Camila Dias",
				due: day(0),
				done: false,
				origin: "demo"
			},
			{
				id: "pend-3",
				classId: "7a",
				studentId: null,
				title: "Devolver a correção da prova de frações",
				due: day(1),
				done: false,
				origin: "demo"
			},
			{
				id: "pend-4",
				classId: "7a",
				studentId: "diego",
				title: "Separar a lista de recuperação do Diego",
				due: day(6),
				done: false,
				origin: "demo"
			},
			{
				id: "pend-5",
				classId: "8b",
				studentId: "julia",
				title: "Devolver o modelo de relatório para a Júlia",
				due: day(-8),
				done: true,
				origin: "demo"
			}
		]
	};
}
function id() {
	return crypto.randomUUID();
}
function originForStudent(state, studentId) {
	return state.students.find((student) => student.id === studentId)?.origin ?? "local";
}
var usePedStore = create()((set) => ({
	...emptyPedData(),
	addObservation: (input) => set((state) => ({ observations: [{
		...input,
		origin: originForStudent(state, input.studentId),
		id: id(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...state.observations] })),
	removeObservation: (observationId) => set((state) => ({ observations: state.observations.filter((item) => item.id !== observationId) })),
	addGrade: (input) => set((state) => ({ grades: [{
		...input,
		origin: originForStudent(state, input.studentId),
		id: id()
	}, ...state.grades] })),
	removeGrade: (gradeId) => set((state) => ({ grades: state.grades.filter((item) => item.id !== gradeId) })),
	upsertAttendance: (input) => set((state) => {
		const index = state.attendance.findIndex((item) => item.studentId === input.studentId && item.date === input.date);
		const origin = originForStudent(state, input.studentId);
		if (index === -1) return { attendance: [...state.attendance, {
			...input,
			origin,
			id: id()
		}] };
		const next = state.attendance.slice();
		next[index] = {
			...next[index],
			status: input.status,
			origin
		};
		return { attendance: next };
	}),
	togglePending: (pendingId) => set((state) => ({ pendings: state.pendings.map((item) => item.id === pendingId ? {
		...item,
		done: !item.done
	} : item) })),
	addPending: (input) => set((state) => ({ pendings: [{
		...input,
		origin: input.studentId ? originForStudent(state, input.studentId) : state.classes.find((room) => room.id === input.classId)?.origin ?? "local",
		id: id(),
		done: false
	}, ...state.pendings] })),
	addExam: (input) => set((state) => ({ exams: [...state.exams, {
		...input,
		origin: state.classes.find((room) => room.id === input.classId)?.origin ?? "local",
		id: id()
	}].sort((a, b) => a.date.localeCompare(b.date)) })),
	removeExam: (examId) => set((state) => ({ exams: state.exams.filter((item) => item.id !== examId) })),
	addStudent: (classId, name) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		set((state) => ({ students: [...state.students, {
			id: id(),
			classId,
			name: trimmed,
			origin: "local"
		}] }));
	},
	resetDemo: () => set((state) => restoreDemoData(state, createSeed(/* @__PURE__ */ new Date()))),
	replaceAll: (data) => set({
		classes: data.classes,
		students: data.students,
		observations: data.observations,
		grades: data.grades,
		attendance: data.attendance,
		exams: data.exams,
		pendings: data.pendings
	})
}));
var ACTIONS = [
	{
		id: "organizar",
		label: "Organizar observação"
	},
	{
		id: "parecer",
		label: "Gerar parecer"
	},
	{
		id: "evolucao",
		label: "Analisar evolução"
	},
	{
		id: "intervencoes",
		label: "Sugerir intervenções"
	}
];
function AssistantView({ today }) {
	const data = usePedStore();
	const options = periodOptions(today);
	const [classId, setClassId] = (0, import_react.useState)(data.classes[0]?.id ?? "");
	const [studentId, setStudentId] = (0, import_react.useState)("");
	const [periodKey, setPeriodKey] = (0, import_react.useState)(defaultPeriodKey(today));
	const [action, setAction] = (0, import_react.useState)("organizar");
	const [rawText, setRawText] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [configured, setConfigured] = (0, import_react.useState)(null);
	const [availabilityNote, setAvailabilityNote] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("geral");
	const [saved, setSaved] = (0, import_react.useState)(false);
	const room = data.classes.find((item) => item.id === classId) ?? data.classes[0];
	const students = data.students.filter((student) => student.classId === room?.id).slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
	const student = students.find((item) => item.id === studentId) ?? students[0];
	const period = resolvePeriod(periodKey, today);
	const prior = previousPeriod(period);
	const origin = student?.origin ?? room?.origin ?? "demo";
	(0, import_react.useEffect)(() => {
		let active = true;
		assistantAvailability().then((value) => {
			if (active) setConfigured(value.configured);
		}).catch(() => {
			if (active) setAvailabilityNote("Não foi possível saber se o assistente está disponível.");
		});
		return () => {
			active = false;
		};
	}, []);
	const payload = (0, import_react.useMemo)(() => {
		if (!room || !student) return null;
		const spans = action === "evolucao" ? [period, prior] : [period];
		const inWindow = (date) => spans.some((span) => inRange(date, span.start, span.end));
		const mine = (rows) => rows.filter((row) => row.studentId === student.id && row.origin === origin);
		return {
			action,
			origin,
			student: {
				id: student.id,
				name: student.name,
				className: room.name,
				subject: room.subject
			},
			period: {
				label: period.label,
				start: period.start,
				end: period.end
			},
			comparePeriod: action === "evolucao" ? {
				label: prior.label,
				start: prior.start,
				end: prior.end
			} : void 0,
			rawText: action === "organizar" ? rawText : void 0,
			observations: action === "organizar" ? [] : mine(data.observations).filter((row) => inWindow(row.date)).map((row) => ({
				id: row.id,
				date: row.date,
				category: row.category,
				text: row.text,
				origin: row.origin
			})),
			grades: action === "organizar" ? [] : mine(data.grades).filter((row) => inWindow(row.date)).map((row) => ({
				id: row.id,
				date: row.date,
				title: row.title,
				score: row.score,
				origin: row.origin
			})),
			attendance: action === "organizar" ? [] : mine(data.attendance).filter((row) => inWindow(row.date)).map((row) => ({
				id: row.id,
				date: row.date,
				status: row.status,
				origin: row.origin
			})),
			exams: action === "organizar" ? [] : data.exams.filter((row) => row.classId === room.id && row.origin === origin && inWindow(row.date)).map((row) => ({
				id: row.id,
				date: row.date,
				title: row.title,
				origin: row.origin
			}))
		};
	}, [
		action,
		data.attendance,
		data.exams,
		data.grades,
		data.observations,
		origin,
		period,
		prior,
		rawText,
		room,
		student
	]);
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
				message: "Não foi possível concluir a análise. Os registros não foram alterados."
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
			source: "texto"
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
	if (!room || !student || !payload) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Inclua uma turma e um aluno para usar o assistente."
	}) });
	const success = result?.ok ? result : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Assistente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-medium",
							children: "Leitura para o professor revisar"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-line px-3 py-1 text-xs font-medium text-muted",
							children: origin === "demo" ? "Sala de demonstração" : "Registros da conta"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "A leitura sai só para você revisar. Sem a chave do Gemini no servidor, nada é inventado no lugar da resposta. O pedido segue com o nome mascarado e só com o recorte do período."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "O texto gerado não é salvo sozinho e não altera nota nem frequência. Login identifica a conta, mas não impede o modelo de errar. Não trate a leitura como parecer oficial."
					}),
					configured === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "GEMINI_API_KEY não está definida neste ambiente."
					}) : null,
					availabilityNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: availabilityNote
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: ACTIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": action === item.id,
							onClick: () => {
								setAction(item.id);
								setResult(null);
								setSaved(false);
							},
							className: action === item.id ? "h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-fg" : "h-11 rounded-md border border-line bg-card px-3 text-sm font-medium",
							children: item.label
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["Turma", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: controlClassName(),
							value: room.id,
							onChange: (event) => {
								setClassId(event.target.value);
								setStudentId("");
								setResult(null);
							},
							children: data.classes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: item.id,
								children: [
									item.name,
									" · ",
									item.subject,
									item.origin === "demo" ? " · demonstração" : ""
								]
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["Aluno", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: controlClassName(),
							value: student.id,
							onChange: (event) => {
								setStudentId(event.target.value);
								setResult(null);
							},
							children: students.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: item.id,
								children: [item.name, item.origin === "demo" ? " · demonstração" : ""]
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["Período", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: controlClassName(),
							value: periodKey,
							onChange: (event) => {
								setPeriodKey(event.target.value);
								setResult(null);
							},
							children: options.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.key,
								children: item.label
							}, item.key))
						})]
					}),
					action === "evolucao" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"A comparação usa ",
							prior.label.toLowerCase(),
							", só com os registros que existirem."
						]
					}) : null,
					action === "organizar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["Texto ou transcrição", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "min-h-28 w-full rounded-md border border-line bg-card px-3 py-2 text-base",
							value: rawText,
							maxLength: 4e3,
							onChange: (event) => setRawText(event.target.value),
							placeholder: "Cole ou dite a observação que quer organizar."
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void run(),
						disabled: busy || action === "organizar" && rawText.trim().length < 15,
						children: busy ? "Consultando o Gemini…" : ACTIONS.find((item) => item.id === action)?.label
					})
				]
			}),
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Aguardando a resposta. Os registros continuam como estão."
			}) }) : null,
			result && !result.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Não foi possível analisar" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: result.message
					}),
					result.missing?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc pl-5 text-sm text-muted",
						children: result.missing.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
					}) : null
				]
			}) : null,
			success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Review, {
				result: success,
				draft,
				category,
				saved,
				onDraft: setDraft,
				onCategory: setCategory,
				onSave: saveDraft,
				onExport: exportDraft
			}) : null
		]
	});
}
function Review({ result, draft, category, saved, onDraft, onCategory, onSave, onExport }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Gerado pelo Gemini · revise antes de guardar" }), result.demonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-muted",
					children: "Base fictícia de demonstração"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: "Fatos calculados a partir dos registros"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 list-disc pl-5 text-sm text-muted",
				children: result.facts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: "Leitura da IA, não um fato"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm",
				children: result.reading
			})] }),
			result.suggestions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: "Sugestões, não decisões"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 list-disc pl-5 text-sm",
				children: result.suggestions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
			})] }) : null,
			result.tags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: ["Categorias sugeridas: ", result.tags.map((tag) => tag in AI_TAG_LABELS ? AI_TAG_LABELS[tag] : tag).join(", ")]
			}) : null,
			result.evidence.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: "Evidências citadas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 flex flex-col gap-1 text-sm text-muted",
				children: result.evidence.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium text-fg",
						children: [item.label, "."]
					}),
					" ",
					item.text
				] }, item.id))
			})] }) : null,
			result.missing.length || result.limits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium",
				children: "O que não está nos registros"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 list-disc pl-5 text-sm text-muted",
				children: [...result.limits, ...result.missing].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm",
				children: ["Texto para aprovar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "min-h-36 w-full rounded-md border border-line bg-card px-3 py-2 text-base",
					value: draft,
					onChange: (event) => onDraft(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm",
				children: ["Categoria ao salvar", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: controlClassName(),
					value: category,
					onChange: (event) => onCategory(event.target.value),
					children: CATEGORIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item.id,
						children: item.label
					}, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Categoria sugerida para o arquivo: ",
					categoryLabel(result.storedCategory),
					". Salvar cria só uma observação."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onSave,
					disabled: !draft.trim(),
					children: "Salvar como observação"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onExport,
					disabled: !draft.trim(),
					children: "Exportar texto"
				})]
			}),
			saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: "Observação guardada na sua conta. Notas e frequência não mudaram."
			}) : null
		]
	});
}
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("faf514c89fe6022b6047999a38117ba1ace68a533b25e26dd57811cc3aee2e2e"));
var saveWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("949f20a62f960a59b6cd076cfca26f459d0a7f0a6a5e1b7c7ba6b541b9a2cec8"));
var saveTeacherProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("95a55828c7d6ee3d87cdd311870c163d4131f0b336916c050f8bb4fa62e2d44b"));
function ClassesView({ today, onOpenStudent }) {
	const data = usePedStore();
	const period = resolvePeriod(defaultPeriodKey(today), today);
	const [names, setNames] = (0, import_react.useState)({});
	const [confirmReset, setConfirmReset] = (0, import_react.useState)(false);
	const [backupNote, setBackupNote] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	function downloadBackup() {
		const blob = new Blob([JSON.stringify(snapshotPed(usePedStore.getState()), null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "acompanhamento-pedagogico.json";
		link.click();
		URL.revokeObjectURL(url);
		setBackupNote("Arquivo baixado. Guarde-o você mesmo: isto não é um backup automático do servidor.");
	}
	async function restoreBackup(file) {
		setBackupNote("");
		let parsed;
		try {
			parsed = JSON.parse(await file.text());
		} catch {
			setBackupNote("O arquivo não é um JSON válido. Nada foi substituído.");
			return;
		}
		const wrapped = parsed && typeof parsed === "object" && "state" in parsed ? parsed.state : parsed;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [data.classes.map((room) => {
			const students = data.students.filter((student) => student.classId === room.id).slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
			const next = data.exams.filter((exam) => exam.classId === room.id && exam.date >= period.start).slice().sort((a, b) => a.date.localeCompare(b.date))[0];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eyebrow, { children: [room.subject, room.origin === "demo" ? " · demonstração" : " · seus registros"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-medium",
							children: room.name
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								students.length,
								" alunos",
								next ? ` · próximo: ${next.title}` : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col",
						children: students.map((student) => {
							const grades = data.grades.filter((grade) => grade.studentId === student.id && inRange(grade.date, period.start, period.end));
							const avg = mean(grades.map((grade) => grade.score));
							const freq = frequency(data.attendance.filter((row) => row.studentId === student.id && inRange(row.date, period.start, period.end)));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-t border-line first:border-t-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => onOpenStudent(room.id, student.id),
									className: "flex w-full items-center justify-between gap-3 py-3 text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: student.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 text-sm tabular-nums text-muted",
										children: [
											avg == null ? "s/ nota" : fmtScore(avg),
											" · ",
											freq ? `${freq.pct}%` : "s/ freq."
										]
									})]
								})
							}, student.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-2 sm:flex-row",
						onSubmit: (event) => {
							event.preventDefault();
							data.addStudent(room.id, names[room.id] ?? "");
							setNames((current) => ({
								...current,
								[room.id]: ""
							}));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: controlClassName(),
							placeholder: "Nome do novo aluno",
							value: names[room.id] ?? "",
							onChange: (event) => setNames((current) => ({
								...current,
								[room.id]: event.target.value
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "shrink-0",
							children: "Incluir aluno"
						})]
					})
				]
			}, room.id);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-start gap-3 px-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Restaurar o exemplo recria a sala fictícia e mantém alunos e registros incluídos por você. A cópia em JSON é um arquivo que você guarda. Não é um backup testado do servidor: na pré-visualização o banco some ao reiniciar."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: downloadBackup,
							children: "Baixar cópia JSON"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => fileRef.current?.click(),
							children: "Restaurar cópia JSON"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "application/json,.json",
							className: "hidden",
							onChange: (event) => {
								const file = event.target.files?.[0];
								event.target.value = "";
								if (file) restoreBackup(file);
							}
						})
					]
				}),
				backupNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: backupNote
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm font-medium text-muted",
					onClick: () => {
						if (!confirmReset) {
							setConfirmReset(true);
							return;
						}
						data.resetDemo();
						setConfirmReset(false);
					},
					children: confirmReset ? "Confirmar restauração do exemplo" : "Restaurar exemplo"
				})
			]
		})]
	});
}
var FONT = "Times New Roman";
var NONE = {
	style: BorderStyle.NONE,
	size: 0,
	color: "FFFFFF"
};
var LINE = {
	style: BorderStyle.SINGLE,
	size: 4,
	color: "1F3A42"
};
function run(text, options) {
	return new TextRun({
		text,
		bold: options?.bold,
		font: FONT,
		size: options?.size ?? 22
	});
}
function paragraph(text, options) {
	return new Paragraph({
		alignment: options?.center ? AlignmentType.CENTER : AlignmentType.LEFT,
		spacing: {
			before: options?.before ?? 0,
			after: options?.after ?? 120
		},
		children: [run(text, options)]
	});
}
function lines(text) {
	const parts = text.split("\n");
	return parts.map((line, index) => paragraph(line || " ", { after: index === parts.length - 1 ? 160 : 40 }));
}
function cell(text, bold = false) {
	return new TableCell({
		width: {
			size: bold ? 28 : 72,
			type: WidthType.PERCENTAGE
		},
		margins: {
			top: 60,
			bottom: 60,
			left: 80,
			right: 80
		},
		borders: {
			top: LINE,
			bottom: LINE,
			left: LINE,
			right: LINE
		},
		children: [paragraph(text, {
			bold,
			after: 0
		})]
	});
}
function row(label, value) {
	return new TableRow({ children: [cell(label, true), cell(value || " ")] });
}
function section(title, body) {
	return [paragraph(title, {
		bold: true,
		size: 24,
		before: 280,
		after: 80
	}), ...lines(body)];
}
function reportDocument(draft) {
	return new File({ sections: [{
		properties: { page: { margin: {
			top: 720,
			bottom: 720,
			left: 900,
			right: 900
		} } },
		children: [
			paragraph(draft.school, {
				bold: true,
				center: true,
				size: 28,
				after: 80
			}),
			paragraph("Parecer individual", {
				center: true,
				size: 24,
				after: 240
			}),
			new Table({
				width: {
					size: 100,
					type: WidthType.PERCENTAGE
				},
				borders: {
					top: NONE,
					bottom: NONE,
					left: NONE,
					right: NONE,
					insideHorizontal: NONE,
					insideVertical: NONE
				},
				rows: [
					row("Estudante", draft.student),
					row("Turma", draft.className),
					row("Componente", draft.subject),
					row("Professor", draft.teacher || " "),
					row("Período", draft.periodLabel)
				]
			}),
			...section("Registros quantitativos do período", draft.quantitativo),
			...section("Aspectos comunicativos", draft.comunicativos),
			...section("Aspectos emocionais e comportamentais", draft.emocionais),
			...section("Avanços observados", draft.avancos),
			...section("Desafios e dificuldades — Leitura", draft.leitura),
			...section("Desafios e dificuldades — Escrita", draft.escrita),
			...section("Desafios e dificuldades — Concentração", draft.concentracao),
			...section("Desafios e dificuldades — Outros registros", draft.outrasDificuldades),
			...section("Possíveis causas e desafios", draft.causas),
			...section("Intervenção individualizada", draft.intervencao),
			...section("Estratégias pedagógicas diferenciadas", draft.estrategias),
			...section("Observação geral", draft.geral),
			paragraph(`${draft.place || "Local"} , ${draft.dateLabel}.`, {
				before: 400,
				after: 360
			}),
			paragraph("________________________________", {
				center: true,
				after: 40
			}),
			paragraph(draft.teacher || "Professor(a)", {
				center: true,
				after: 0
			})
		]
	}] });
}
function reportToBlob(draft) {
	return Packer.toBlob(reportDocument(draft));
}
var SCHOOL_NAME = "ESCOLA CIDADÃ INTEGRAL TÉCNICA ERENICE CAVALCANTE FIDELES";
var EMPTY_SECTION = "Não observado no período";
var READING = [
	"leitura",
	" ler ",
	" leu ",
	"lendo",
	"leitor"
];
var WRITING = [
	"escrita",
	"escrever",
	"escreveu",
	"escrevendo",
	"redação",
	"redacao"
];
var FOCUS = [
	"concentração",
	"concentracao",
	"atenção",
	"atencao",
	"concentrou"
];
var CAUSE = [
	"porque",
	"devido",
	"motivo",
	"causa"
];
var INTERVENTION = [
	"intervenção",
	"intervencao",
	"intervir"
];
var STRATEGY = [
	"estratégia",
	"estrategia",
	"adaptação",
	"adaptacao",
	"diferenciada"
];
function hasWord(text, needles) {
	const padded = ` ${text.toLocaleLowerCase("pt-BR")} `;
	return needles.some((needle) => padded.includes(needle));
}
function dated(rows) {
	if (!rows.length) return EMPTY_SECTION;
	return rows.slice().sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)).map((row) => `${formatDay(row.date)} — ${row.text.trim()}`).join("\n");
}
function buildReportDraft(input) {
	const observations = input.observations.filter((row) => inRange(row.date, input.periodStart, input.periodEnd));
	const grades = input.grades.filter((row) => inRange(row.date, input.periodStart, input.periodEnd));
	const attendance = input.attendance.filter((row) => inRange(row.date, input.periodStart, input.periodEnd));
	const of = (category) => observations.filter((row) => row.category === category);
	const difficulties = of("dificuldades");
	const reading = difficulties.filter((row) => hasWord(row.text, READING));
	const writing = difficulties.filter((row) => hasWord(row.text, WRITING));
	const focus = difficulties.filter((row) => hasWord(row.text, FOCUS));
	const used = new Set([
		...reading,
		...writing,
		...focus
	].map((row) => row.id));
	const other = difficulties.filter((row) => !used.has(row.id));
	const avg = mean(grades.map((grade) => grade.score));
	const freq = frequency(attendance);
	const quantitativo = [avg == null ? `Notas: ${EMPTY_SECTION}` : `Média ${fmtScore(avg)} em ${grades.length} nota(s) registrada(s).`, freq ? `Frequência ${freq.pct}% (${freq.present} de ${freq.total} lançamentos).` : `Frequência: ${EMPTY_SECTION}`].join("\n");
	return {
		school: SCHOOL_NAME,
		student: input.studentName,
		className: input.className,
		subject: input.subject,
		teacher: input.teacher.trim(),
		place: input.place.trim(),
		dateLabel: formatLong(input.today),
		periodLabel: input.periodLabel,
		quantitativo,
		comunicativos: dated(of("participacao")),
		emocionais: dated(of("comportamento")),
		avancos: dated(of("evolucao")),
		leitura: dated(reading),
		escrita: dated(writing),
		concentracao: dated(focus),
		outrasDificuldades: dated(other),
		causas: dated(observations.filter((row) => hasWord(row.text, CAUSE))),
		intervencao: dated(observations.filter((row) => hasWord(row.text, INTERVENTION))),
		estrategias: dated(observations.filter((row) => hasWord(row.text, STRATEGY))),
		geral: dated(of("geral"))
	};
}
var SECTIONS = [
	{
		key: "quantitativo",
		label: "Registros quantitativos do período"
	},
	{
		key: "comunicativos",
		label: "Aspectos comunicativos"
	},
	{
		key: "emocionais",
		label: "Aspectos emocionais e comportamentais"
	},
	{
		key: "avancos",
		label: "Avanços observados"
	},
	{
		key: "leitura",
		label: "Desafios e dificuldades — Leitura"
	},
	{
		key: "escrita",
		label: "Desafios e dificuldades — Escrita"
	},
	{
		key: "concentracao",
		label: "Desafios e dificuldades — Concentração"
	},
	{
		key: "outrasDificuldades",
		label: "Desafios e dificuldades — Outros registros"
	},
	{
		key: "causas",
		label: "Possíveis causas e desafios"
	},
	{
		key: "intervencao",
		label: "Intervenção individualizada"
	},
	{
		key: "estrategias",
		label: "Estratégias pedagógicas diferenciadas"
	},
	{
		key: "geral",
		label: "Observação geral"
	}
];
function fileSlug(name) {
	return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "aluno";
}
function ReportPanel({ initial, onRebuild }) {
	const [draft, setDraft] = (0, import_react.useState)(initial);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	function setText(key, value) {
		setDraft((current) => ({
			...current,
			[key]: value
		}));
	}
	async function download() {
		setBusy(true);
		setError("");
		try {
			const blob = await reportToBlob({
				...draft,
				school: SCHOOL_NAME
			});
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Parecer individual" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-2xl font-medium",
				children: "Pré-visualização editável"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "O texto nasce só dos registros do período. Onde não há registro, fica “Não observado no período”. O que você alterar aqui entra no Word; isso não muda as observações salvas e não inventa nota nem frequência."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm font-medium",
				children: SCHOOL_NAME
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: [
					["student", "Estudante"],
					["className", "Turma"],
					["subject", "Componente"],
					["teacher", "Professor"],
					["periodLabel", "Período"],
					["place", "Local"],
					["dateLabel", "Data"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex flex-col gap-1 text-sm",
					children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: controlClassName(),
						value: draft[key],
						onChange: (event) => setText(key, event.target.value)
					})]
				}, key))
			}),
			SECTIONS.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-1 text-sm",
				children: [section.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: "min-h-24 w-full rounded-md border border-line bg-card px-3 py-2 text-base",
					value: draft[section.key],
					onChange: (event) => setText(section.key, event.target.value)
				})]
			}, section.key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					draft.place.trim() || "Local",
					" , ",
					draft.dateLabel || "data",
					". Assinatura: ",
					draft.teacher.trim() || "Professor(a)",
					"."
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void download(),
					disabled: busy,
					children: busy ? "Gerando…" : "Baixar Word"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						setDraft(onRebuild());
						setError("");
					},
					children: "Recarregar dos registros"
				})]
			})
		]
	});
}
var GradeChart = (0, import_react.lazy)(() => import("./grade-chart-CV6rxtFO.mjs"));
function ConsultView({ today, classId, studentId, teacher, place, onClassId, onStudentId }) {
	const data = usePedStore();
	const [periodKey, setPeriodKey] = (0, import_react.useState)(defaultPeriodKey(today));
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const [showReport, setShowReport] = (0, import_react.useState)(false);
	const period = resolvePeriod(periodKey, today);
	const prior = previousPeriod(period);
	const options = periodOptions(today);
	const room = data.classes.find((item) => item.id === classId) ?? data.classes[0];
	const classStudents = data.students.filter((student) => student.classId === room?.id).slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
	const student = classStudents.find((item) => item.id === studentId) ?? null;
	const scoped = (0, import_react.useMemo)(() => {
		if (!room) return null;
		return {
			observations: data.observations.filter((item) => item.classId === room.id && inRange(item.date, period.start, period.end)),
			grades: data.grades.filter((item) => item.classId === room.id && inRange(item.date, period.start, period.end)),
			attendance: data.attendance.filter((item) => item.classId === room.id && inRange(item.date, period.start, period.end)),
			previousGrades: data.grades.filter((item) => item.classId === room.id && inRange(item.date, prior.start, prior.end)),
			nextExam: data.exams.filter((exam) => exam.classId === room.id && exam.date >= period.start).slice().sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
		};
	}, [
		data.attendance,
		data.exams,
		data.grades,
		data.observations,
		period.end,
		period.start,
		prior.end,
		prior.start,
		room
	]);
	if (!room || !scoped) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Cadastre uma turma para consultar."
	}) });
	const summary = student ? summarizeStudent({
		student,
		period,
		observations: scoped.observations.filter((item) => item.studentId === student.id),
		grades: scoped.grades.filter((item) => item.studentId === student.id),
		previousGrades: scoped.previousGrades.filter((item) => item.studentId === student.id),
		attendance: scoped.attendance.filter((item) => item.studentId === student.id),
		nextExam: scoped.nextExam
	}) : summarizeClass({
		classRoom: room,
		students: classStudents,
		period,
		observations: scoped.observations,
		grades: scoped.grades,
		attendance: scoped.attendance,
		nextExam: scoped.nextExam
	});
	const chartPoints = student ? data.grades.filter((grade) => grade.studentId === student.id).slice().sort((a, b) => a.date.localeCompare(b.date)).map((grade) => ({
		label: formatDay(grade.date),
		nota: grade.score,
		title: grade.title
	})) : [];
	const timeline = student ? [
		...scoped.observations.filter((item) => item.studentId === student.id).map((item) => ({
			kind: "obs",
			id: item.id,
			date: item.date,
			title: categoryLabel(item.category),
			text: item.text,
			meta: item.source === "voz" ? "voz" : "texto"
		})),
		...scoped.grades.filter((item) => item.studentId === student.id).map((item) => ({
			kind: "grade",
			id: item.id,
			date: item.date,
			title: item.title,
			text: `Nota ${fmtScore(item.score)}`,
			meta: "nota"
		})),
		...scoped.attendance.filter((item) => item.studentId === student.id && item.status !== "presente").map((item) => ({
			kind: "att",
			id: item.id,
			date: item.date,
			title: item.status === "falta" ? "Falta" : item.status === "atraso" ? "Atraso" : "Falta justificada",
			text: "Frequência do dia",
			meta: "frequência"
		}))
	].sort((a, b) => b.date.localeCompare(a.date)) : [];
	const reportDraft = student ? buildReportDraft({
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
		attendance: data.attendance.filter((row) => row.studentId === student.id)
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-muted",
							children: "Turma"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: controlClassName(),
							value: room.id,
							onChange: (event) => {
								onClassId(event.target.value);
								onStudentId("all");
							},
							children: data.classes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: item.id,
								children: [
									item.name,
									" · ",
									item.subject
								]
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-muted",
							children: "Aluno"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: controlClassName(),
							value: student ? student.id : "all",
							onChange: (e) => onStudentId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "Turma inteira"
							}), classStudents.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.id,
								children: item.name
							}, item.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-muted",
							children: "Período"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: controlClassName(),
							value: periodKey,
							onChange: (e) => setPeriodKey(e.target.value),
							children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: option.key,
								children: option.label
							}, option.key))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eyebrow, { children: [
						room.name,
						" · ",
						room.subject,
						" · ",
						formatRange(period.start, period.end)
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-serif text-3xl font-medium tracking-tight",
						children: summary.title
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-3xl text-base leading-relaxed",
						children: summary.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: summary.stats.map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-bg px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-muted",
								children: stat.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-serif text-2xl tabular-nums",
								children: stat.value
							})]
						}, stat.label))
					}),
					summary.flags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-wrap gap-2",
						children: summary.flags.map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-md border border-line px-2 py-1 text-sm text-fg",
							children: flag
						}, flag))
					}) : null
				]
			}),
			student && chartPoints.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Notas ao longo do ano" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "font-serif text-xl font-medium",
					children: ["Trajetória de ", student.name.split(" ")[0]]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48" }),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChart, { data: chartPoints })
				})
			] }) : null,
			student ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "No período" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-serif text-xl font-medium",
						children: ["Registros de ", student.name]
					}),
					timeline.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Nada lançado neste período para este aluno."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col",
						children: timeline.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line py-3 first:border-t-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										formatDay(item.date),
										" · ",
										item.title,
										" · ",
										item.meta
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: item.text
								}),
								item.kind !== "att" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-1 text-sm text-muted",
									onClick: () => {
										if (confirmId === item.id) {
											if (item.kind === "obs") data.removeObservation(item.id);
											if (item.kind === "grade") data.removeGrade(item.id);
											setConfirmId(null);
										} else setConfirmId(item.id);
									},
									children: confirmId === item.id ? "Confirmar exclusão" : "Apagar"
								}) : null
							]
						}, `${item.kind}-${item.id}`))
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Por aluno" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xl font-medium",
						children: "Leitura da turma"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col",
						children: classStudents.map((item) => {
							const grades = scoped.grades.filter((grade) => grade.studentId === item.id);
							const avg = mean(grades.map((grade) => grade.score));
							const freq = frequency(scoped.attendance.filter((row) => row.studentId === item.id));
							const notes = scoped.observations.filter((row) => row.studentId === item.id).length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm tabular-nums text-muted",
										children: [
											"Média ",
											avg == null ? "—" : fmtScore(avg),
											" · Frequência ",
											freq ? `${freq.pct}%` : "—",
											" · ",
											notes,
											" obs."
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									className: "h-10 shrink-0 px-3",
									onClick: () => onStudentId(item.id),
									children: "Abrir"
								})]
							}, item.id);
						})
					})
				]
			}),
			student && reportDraft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setShowReport((open) => !open),
					children: showReport ? "Fechar parecer" : "Parecer em Word"
				}), showReport ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportPanel, {
					initial: reportDraft,
					onRebuild: () => reportDraft
				}, `${student.id}-${period.start}-${period.end}`) : null]
			}) : null
		]
	});
}
function recognitionCtor() {
	if (typeof window === "undefined") return null;
	const host = window;
	return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}
function useVoice(onFinal) {
	const onFinalRef = (0, import_react.useRef)(onFinal);
	onFinalRef.current = onFinal;
	const recRef = (0, import_react.useRef)(null);
	const [listening, setListening] = (0, import_react.useState)(false);
	const [interim, setInterim] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
			if (event.error === "not-allowed" || event.error === "service-not-allowed") setMessage("O microfone está bloqueado. Digite a observação.");
			else setMessage("Não foi possível transcrever agora. Digite a observação.");
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
		toggle: () => listening ? stop() : start()
	};
}
function RegisterPanel({ today, classes, students, attendance, prefill, onSaveObservation, onSaveGrade, onUpsertAttendance }) {
	const [mode, setMode] = (0, import_react.useState)("observacao");
	const [classId, setClassId] = (0, import_react.useState)(classes[0]?.id ?? "");
	const [studentId, setStudentId] = (0, import_react.useState)(students.find((student) => student.classId === classes[0]?.id)?.id ?? "");
	const [date, setDate] = (0, import_react.useState)(isoDate(today));
	const [category, setCategory] = (0, import_react.useState)("geral");
	const [categoryTouched, setCategoryTouched] = (0, import_react.useState)(false);
	const [text, setText] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("texto");
	const [title, setTitle] = (0, import_react.useState)("Atividade");
	const [score, setScore] = (0, import_react.useState)(7);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const classStudents = students.filter((student) => student.classId === classId).slice().sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
	(0, import_react.useEffect)(() => {
		if (!prefill) return;
		setClassId(prefill.classId);
		setStudentId(prefill.studentId);
		setMode("observacao");
		setNotice(null);
		setError(null);
	}, [prefill]);
	(0, import_react.useEffect)(() => {
		const list = students.filter((student) => student.classId === classId);
		if (!list.some((student) => student.id === studentId)) setStudentId(list[0]?.id ?? "");
	}, [
		classId,
		studentId,
		students
	]);
	const voice = useVoice((chunk) => {
		setText((current) => current.trim() ? `${current.trim()} ${chunk}` : chunk);
		setSource("voz");
		if (!categoryTouched) {
			const suggested = suggestCategory(chunk);
			if (suggested) setCategory(suggested);
		}
	});
	function flash(message) {
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
			source
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
			score
		});
		flash(`Nota de ${students.find((item) => item.id === studentId)?.name ?? "aluno"} lançada.`);
	}
	const marked = classStudents.filter((student) => attendance.some((row) => row.studentId === student.id && row.date === date)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		id: "registrar",
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Registro" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-medium tracking-tight",
					children: "O que aconteceu na aula"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 rounded-md bg-bg p-1",
					role: "tablist",
					"aria-label": "Tipo de registro",
					children: [
						["observacao", "Observação"],
						["nota", "Nota"],
						["chamada", "Chamada"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": mode === id,
						onClick: () => {
							setMode(id);
							setError(null);
						},
						className: mode === id ? "h-10 rounded-md bg-primary text-sm font-medium text-primary-fg" : "h-10 rounded-md text-sm font-medium text-muted",
						children: label
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-w-0 flex-col gap-1.5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-muted",
						children: "Turma"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: controlClassName(),
						value: classId,
						onChange: (event) => setClassId(event.target.value),
						children: classes.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: room.id,
							children: [
								room.name,
								" · ",
								room.subject
							]
						}, room.id))
					})]
				}), mode === "chamada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-w-0 flex-col gap-1.5 text-sm sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-muted",
						children: "Data da chamada"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						className: controlClassName(),
						value: date,
						onChange: (event) => setDate(event.target.value)
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-w-0 flex-col gap-1.5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-muted",
						children: "Aluno"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: controlClassName(),
						value: studentId,
						onChange: (event) => setStudentId(event.target.value),
						children: classStudents.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: student.id,
							children: student.name
						}, student.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-w-0 flex-col gap-1.5 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-muted",
						children: "Data"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						className: controlClassName(),
						value: date,
						onChange: (event) => setDate(event.target.value)
					})]
				})] })]
			}),
			mode === "observacao" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						role: "group",
						"aria-label": "Categoria",
						children: CATEGORIES.map((item) => {
							const selected = category === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": selected,
								onClick: () => {
									setCategory(item.id);
									setCategoryTouched(true);
								},
								className: selected ? "h-10 rounded-md bg-primary px-3 text-sm font-medium text-primary-fg" : "h-10 rounded-md border border-line px-3 text-sm font-medium text-fg",
								children: item.label
							}, item.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative grid size-44 place-items-center",
							children: [voice.listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "listen-ring pointer-events-none absolute size-32 rounded-full border border-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "listen-ring listen-ring-late pointer-events-none absolute size-32 rounded-full border border-primary" })] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": voice.listening,
								onClick: voice.toggle,
								className: "press relative grid size-32 place-items-center rounded-full bg-primary text-primary-fg",
								children: [voice.listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
									className: "size-7",
									strokeWidth: 2,
									"aria-hidden": "true"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {
									className: "size-8",
									strokeWidth: 1.75,
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: voice.listening ? "Parar gravação" : "Gravar observação"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-sm text-muted",
							children: voice.listening ? "Ouvindo… toque de novo para parar." : "Toque para falar. A transcrição pode ser editada antes de salvar."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-muted",
							children: "Observação"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: text,
							onChange: (event) => {
								setText(event.target.value);
								if (source === "voz" && event.target.value.trim() === "") setSource("texto");
							},
							rows: 4,
							"aria-live": "polite",
							placeholder: "Participação, comportamento, dificuldade ou evolução.",
							className: "min-h-28 w-full resize-y rounded-md border border-line bg-card px-3 py-3 text-base text-fg"
						})]
					}),
					voice.interim ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: ["Ouvindo: ", voice.interim]
					}) : null,
					voice.message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: voice.message
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-subtle",
							children: source === "voz" ? "Entrada por voz" : "Entrada escrita"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: saveObservation,
							children: "Salvar observação"
						})]
					})
				]
			}) : null,
			mode === "nota" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-muted",
							children: "Nome da avaliação"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: controlClassName(),
							value: title,
							onChange: (event) => setTitle(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "size-12 px-0",
								"aria-label": "Diminuir nota",
								onClick: () => setScore((value) => Math.max(0, Math.round((value - .5) * 10) / 10)),
								children: "−"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "min-w-24 text-center font-serif text-5xl tabular-nums",
								children: score.toLocaleString("pt-BR", {
									minimumFractionDigits: 1,
									maximumFractionDigits: 1
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "size-12 px-0",
								"aria-label": "Aumentar nota",
								onClick: () => setScore((value) => Math.min(10, Math.round((value + .5) * 10) / 10)),
								children: "+"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-muted",
						children: "Escala de 0 a 10, meio ponto."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: saveGrade,
							children: "Salvar nota"
						})
					})
				]
			}) : null,
			mode === "chamada" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						marked,
						" de ",
						classStudents.length,
						" lançados. P presente, F falta, A atraso, J justificada."
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: classStudents.map((student) => {
						const current = attendance.find((row) => row.studentId === student.id && row.date === date);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col gap-2 rounded-md bg-bg px-3 py-2 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 truncate text-sm font-medium",
								children: student.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-1",
								children: ATTENDANCE_OPTIONS.map((option) => {
									const selected = current?.status === option.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `${option.label} para ${student.name}`,
										"aria-pressed": selected,
										onClick: () => onUpsertAttendance({
											studentId: student.id,
											classId,
											date,
											status: option.id
										}),
										className: selected ? "h-11 rounded-md bg-primary text-sm font-medium text-primary-fg" : "h-11 rounded-md border border-line bg-card text-sm font-medium text-fg",
										children: option.short
									}, option.id);
								})
							})]
						}, student.id);
					})
				})]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: error
			}) : null,
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ok",
				children: notice
			}) : null
		]
	});
}
function HomeView({ today, prefill, onConsultStudent }) {
	const data = usePedStore();
	const todayIso = isoDate(today);
	const period = resolvePeriod(defaultPeriodKey(today), today);
	const openPendings = data.pendings.filter((item) => !item.done).slice().sort((a, b) => a.due.localeCompare(b.due));
	const overdue = openPendings.filter((item) => item.due < todayIso).length;
	const upcoming = data.exams.filter((exam) => exam.date >= todayIso).slice().sort((a, b) => a.date.localeCompare(b.date));
	const nextExam = upcoming[0];
	const donePendings = data.pendings.filter((item) => item.done);
	const [showDone, setShowDone] = (0, import_react.useState)(false);
	const [showPendingForm, setShowPendingForm] = (0, import_react.useState)(false);
	const [showExamForm, setShowExamForm] = (0, import_react.useState)(false);
	const [pendingTitle, setPendingTitle] = (0, import_react.useState)("");
	const [pendingClass, setPendingClass] = (0, import_react.useState)(data.classes[0]?.id ?? "");
	const [pendingDue, setPendingDue] = (0, import_react.useState)(todayIso);
	const [examTitle, setExamTitle] = (0, import_react.useState)("");
	const [examClass, setExamClass] = (0, import_react.useState)(data.classes[0]?.id ?? "");
	const [examDate, setExamDate] = (0, import_react.useState)(todayIso);
	const [examKind, setExamKind] = (0, import_react.useState)("prova");
	const attention = (0, import_react.useMemo)(() => {
		return data.classes.flatMap((room) => {
			const students = data.students.filter((student) => student.classId === room.id);
			return attentionForClass({
				students,
				observations: data.observations.filter((item) => item.classId === room.id && inRange(item.date, period.start, period.end)),
				grades: data.grades.filter((item) => item.classId === room.id && inRange(item.date, period.start, period.end)),
				attendance: data.attendance.filter((item) => item.classId === room.id && inRange(item.date, period.start, period.end))
			}).map((item) => ({
				...item,
				className: room.name
			}));
		});
	}, [
		data.attendance,
		data.classes,
		data.grades,
		data.observations,
		data.students,
		period.end,
		period.start
	]);
	const recent = data.observations.slice().sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
	function studentName(id) {
		if (!id) return null;
		return data.students.find((student) => student.id === id)?.name ?? null;
	}
	function className(id) {
		return data.classes.find((room) => room.id === id)?.name ?? "";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => document.getElementById("pendencias")?.scrollIntoView({
						behavior: "smooth",
						block: "start"
					}),
					className: "panel px-3 py-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Pendências" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-serif text-2xl tabular-nums",
							children: [openPendings.length, " abertas"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: overdue ? "text-sm text-danger" : "text-sm text-muted",
							children: overdue ? `${overdue} atrasada${overdue > 1 ? "s" : ""}` : "Nenhuma atrasada"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => document.getElementById("testes")?.scrollIntoView({
						behavior: "smooth",
						block: "start"
					}),
					className: "panel px-3 py-3 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Próximo teste" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-serif text-2xl",
							children: nextExam ? relativeDay(nextExam.date, today) : "Nenhum"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm text-muted",
							children: nextExam ? `${nextExam.title} · ${className(nextExam.classId)}` : "Marque uma avaliação"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterPanel, {
				today,
				classes: data.classes,
				students: data.students,
				attendance: data.attendance,
				prefill,
				onSaveObservation: data.addObservation,
				onSaveGrade: data.addGrade,
				onUpsertAttendance: data.upsertAttendance
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					id: "pendencias",
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Para resolver" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-2xl font-medium",
								children: "Pendências"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "h-10 px-3",
								onClick: () => setShowPendingForm((value) => !value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Nova"]
							})]
						}),
						showPendingForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "grid gap-2 rounded-md bg-bg p-3",
							onSubmit: (event) => {
								event.preventDefault();
								if (!pendingTitle.trim()) return;
								data.addPending({
									title: pendingTitle.trim(),
									classId: pendingClass,
									studentId: null,
									due: pendingDue
								});
								setPendingTitle("");
								setShowPendingForm(false);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: controlClassName(),
									placeholder: "O que precisa ser feito",
									value: pendingTitle,
									onChange: (event) => setPendingTitle(event.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: controlClassName(),
										value: pendingClass,
										onChange: (event) => setPendingClass(event.target.value),
										children: data.classes.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: room.id,
											children: room.name
										}, room.id))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: controlClassName(),
										value: pendingDue,
										onChange: (event) => setPendingDue(event.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										children: "Adicionar pendência"
									})
								})
							]
						}) : null,
						openPendings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Nenhuma pendência aberta."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col",
							children: openPendings.map((item) => {
								const late = item.due < todayIso;
								const who = studentName(item.studentId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 border-t border-line py-3 first:border-t-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": `Concluir ${item.title}`,
										onClick: () => data.togglePending(item.id),
										className: "mt-0.5 grid size-11 shrink-0 place-items-center rounded-md border border-line",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											className: "size-4 text-muted",
											"aria-hidden": "true"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: late ? "text-sm text-danger" : "text-sm text-muted",
											children: [
												className(item.classId),
												who ? ` · ${who}` : "",
												" · ",
												relativeDay(item.due, today),
												late ? " · atrasada" : ""
											]
										})]
									})]
								}, item.id);
							})
						}),
						donePendings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "self-start text-sm font-medium text-muted",
							onClick: () => setShowDone((value) => !value),
							children: showDone ? "Ocultar concluídas" : `Ver concluídas (${donePendings.length})`
						}) : null,
						showDone ? donePendings.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => data.togglePending(item.id),
							className: "text-left text-sm text-subtle line-through",
							children: item.title
						}, item.id)) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					id: "testes",
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Calendário curto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-2xl font-medium",
								children: "Próximos testes"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "h-10 px-3",
								onClick: () => setShowExamForm((value) => !value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
									className: "size-4",
									"aria-hidden": "true"
								}), "Novo"]
							})]
						}),
						showExamForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "grid gap-2 rounded-md bg-bg p-3",
							onSubmit: (event) => {
								event.preventDefault();
								if (!examTitle.trim()) return;
								data.addExam({
									title: examTitle.trim(),
									classId: examClass,
									date: examDate,
									kind: examKind
								});
								setExamTitle("");
								setShowExamForm(false);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: controlClassName(),
									placeholder: "Nome da avaliação",
									value: examTitle,
									onChange: (event) => setExamTitle(event.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: controlClassName(),
											value: examClass,
											onChange: (e) => setExamClass(e.target.value),
											children: data.classes.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: room.id,
												children: room.name
											}, room.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											className: controlClassName(),
											value: examKind,
											onChange: (event) => setExamKind(event.target.value),
											children: EXAM_KINDS.map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: kind.id,
												children: kind.label
											}, kind.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											className: controlClassName(),
											value: examDate,
											onChange: (e) => setExamDate(e.target.value)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										children: "Adicionar teste"
									})
								})
							]
						}) : null,
						upcoming.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Nenhum teste à frente."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col",
							children: upcoming.map((exam) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 border-t border-line py-3 first:border-t-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid h-14 w-14 shrink-0 place-items-center rounded-md bg-bg text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-serif text-xl leading-none tabular-nums",
											children: formatDay(exam.date).split(" ")[0]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase text-muted",
											children: formatDay(exam.date).split(" ")[1]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: exam.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted",
											children: [
												examKindLabel(exam.kind),
												" · ",
												className(exam.classId),
												" · ",
												relativeDay(exam.date, today)
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-sm text-muted",
										onClick: () => data.removeExam(exam.id),
										children: "Tirar"
									})
								]
							}, exam.id))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: period.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-medium",
					children: "Alunos em atenção"
				})] }), attention.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nenhum aluno isolado em atenção neste período."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col",
					children: attention.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 border-t border-line py-3 first:border-t-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: item.student.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									item.className,
									" · ",
									item.reasons.join(" · ")
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "h-10 shrink-0 px-3",
							onClick: () => onConsultStudent(item.student.classId, item.student.id),
							children: ["Ver ", firstName(item.student.name)]
						})]
					}, item.student.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Linha do tempo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-medium",
					children: "Últimos registros"
				})] }), recent.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nenhuma observação ainda."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col",
					children: recent.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-line py-3 first:border-t-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								formatDay(item.date),
								" · ",
								studentName(item.studentId),
								" · ",
								categoryLabel(item.category),
								item.source === "voz" ? " · voz" : ""
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: item.text
						})]
					}, item.id))
				})]
			})
		]
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var NAV = [
	{
		id: "inicio",
		label: "Início",
		icon: House
	},
	{
		id: "consultar",
		label: "Consultar",
		icon: ClipboardList
	},
	{
		id: "assistente",
		label: "Assistente",
		icon: Sparkles
	},
	{
		id: "turmas",
		label: "Turmas",
		icon: BookOpen
	}
];
function PedagogicoApp() {
	const { user, isPending } = useCurrentUserState();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted || isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingShell, { label: "Abrindo a sessão…" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherLogin, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceHost, { userId: user.id });
}
function LoadingShell({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto min-h-dvh max-w-5xl px-4 py-8",
		children: [
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
				children: label
			})
		]
	});
}
function WorkspaceHost({ userId }) {
	const [phase, setPhase] = (0, import_react.useState)("loading");
	const [teacherName, setTeacherName] = (0, import_react.useState)("");
	const [place, setPlace] = (0, import_react.useState)("");
	const [legacy, setLegacy] = (0, import_react.useState)(null);
	const [loadError, setLoadError] = (0, import_react.useState)("");
	const [saveLabel, setSaveLabel] = (0, import_react.useState)("");
	const [boundUser, setBoundUser] = (0, import_react.useState)(userId);
	if (boundUser !== userId) {
		setBoundUser(userId);
		setPhase("loading");
		setLegacy(null);
		setTeacherName("");
		setPlace("");
		setSaveLabel("");
		setLoadError("");
	}
	(0, import_react.useEffect)(() => {
		let active = true;
		setPhase("loading");
		setSaveLabel("");
		usePedStore.getState().replaceAll(emptyPedData());
		loadWorkspace().then((result) => {
			if (!active) return;
			if (result.data && pedHasRows(result.data)) usePedStore.getState().replaceAll(result.data);
			setTeacherName(result.teacherName);
			setPlace(result.place);
			const stored = readLegacyPedData();
			setLegacy(stored && pedHasRows(stored) ? stored : null);
			setPhase("ready");
		}).catch(() => {
			if (!active) return;
			setLoadError("Não foi possível abrir os registros desta conta. Nada foi apagado.");
			setPhase("error");
		});
		return () => {
			active = false;
		};
	}, [userId]);
	(0, import_react.useEffect)(() => {
		if (phase !== "ready") return;
		let timer = 0;
		let ticket = 0;
		const unsub = usePedStore.subscribe(() => {
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				const current = ++ticket;
				const data = snapshotPed(usePedStore.getState());
				setSaveLabel("Salvando…");
				saveWorkspace({ data }).then((result) => {
					if (current !== ticket) return;
					setSaveLabel(result.ok ? "Salvo na sua conta" : result.message);
				}).catch(() => {
					if (current === ticket) setSaveLabel("Não foi possível salvar na conta.");
				});
			}, 600);
		});
		return () => {
			window.clearTimeout(timer);
			unsub();
		};
	}, [phase, userId]);
	async function commitProfile(nextName, nextPlace) {
		try {
			await saveTeacherProfile({ data: {
				displayName: nextName,
				place: nextPlace
			} });
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
	if (phase === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingShell, { label: "Abrindo os registros da conta…" });
	if (phase === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-xl flex-col gap-3 px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "display-title",
			children: ["Acompanhamento ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "italic",
				children: "pedagógico"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: loadError
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadyApp, {
		teacherName,
		place,
		saveLabel,
		legacy,
		onTeacherName: setTeacherName,
		onPlace: setPlace,
		onProfileCommit: (nextName, nextPlace) => void commitProfile(nextName, nextPlace),
		onImportLegacy: () => void importLegacy(),
		onDismissLegacy: () => setLegacy(null),
		onLoadDemo: () => usePedStore.getState().replaceAll(createSeed(/* @__PURE__ */ new Date()))
	});
}
function ReadyApp({ teacherName, place, saveLabel, legacy, onTeacherName, onPlace, onProfileCommit, onImportLegacy, onDismissLegacy, onLoadDemo }) {
	const classCount = usePedStore((state) => state.classes.length);
	const firstClassId = usePedStore((state) => state.classes[0]?.id ?? "");
	const [today] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [view, setView] = (0, import_react.useState)("inicio");
	const [classId, setClassId] = (0, import_react.useState)(firstClassId);
	const [studentId, setStudentId] = (0, import_react.useState)("all");
	const [prefill, setPrefill] = (0, import_react.useState)(null);
	const profileTimer = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!classId && firstClassId) setClassId(firstClassId);
	}, [classId, firstClassId]);
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [view]);
	function scheduleProfile(nextName, nextPlace) {
		window.clearTimeout(profileTimer.current);
		profileTimer.current = window.setTimeout(() => onProfileCommit(nextName, nextPlace), 500);
	}
	function openStudent(nextClass, nextStudent) {
		setClassId(nextClass);
		setStudentId(nextStudent);
		setView("consultar");
	}
	function recordAbout(nextClass, nextStudent) {
		setPrefill({
			classId: nextClass,
			studentId: nextStudent,
			nonce: Date.now()
		});
		setView("inicio");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex w-full max-w-5xl flex-col px-4 pt-6 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted",
						children: "Sala de aula"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "display-title",
						children: ["Acompanhamento ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "italic",
							children: "pedagógico"
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-start gap-1 sm:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: formatLong(isoDate(today))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}),
							saveLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: saveLabel
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: "Os registros ficam na conta de quem entrou. A cópia em JSON, em Turmas, é um arquivo seu — não é um backup automático do servidor."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-2 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["Nome no parecer", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: controlClassName(),
							value: teacherName,
							maxLength: 80,
							onChange: (event) => {
								onTeacherName(event.target.value);
								scheduleProfile(event.target.value, place);
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-sm",
						children: ["Local no parecer", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: controlClassName(),
							value: place,
							maxLength: 80,
							placeholder: "Cidade, sem inventar",
							onChange: (event) => {
								onPlace(event.target.value);
								scheduleProfile(teacherName, event.target.value);
							}
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "dock fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-line bg-card md:static md:mt-5 md:flex md:gap-2 md:border-0 md:bg-transparent md:p-0",
					"aria-label": "Seções",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const active = view === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-current": active ? "page" : void 0,
							onClick: () => setView(item.id),
							className: cn("flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium leading-tight md:flex-row md:rounded-full md:px-4 md:text-xs", active ? "text-primary md:bg-primary md:text-primary-fg" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: 1.75,
								"aria-hidden": "true"
							}), item.label]
						}, item.id);
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pt-5 pb-28 md:px-8 md:pb-16",
			children: [
				legacy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel flex flex-col gap-2 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Este navegador ainda tem uma cópia antiga dos registros. Ela não entra sozinha. Importar substitui o que está nesta conta."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: onImportLegacy,
							children: "Importar cópia deste navegador"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: onDismissLegacy,
							children: "Agora não"
						})]
					})]
				}) : null,
				classCount === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel flex flex-col gap-2 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Esta conta ainda não tem turma. A sala fictícia é só um exemplo, marcada como demonstração."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "self-start",
						onClick: onLoadDemo,
						children: "Carregar sala fictícia"
					})]
				}) : null,
				view === "inicio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {
					today,
					prefill,
					onConsultStudent: (nextClass, nextStudent) => {
						openStudent(nextClass, nextStudent);
					}
				}) : null,
				view === "consultar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConsultView, {
					today,
					classId,
					studentId,
					teacher: teacherName,
					place,
					onClassId: setClassId,
					onStudentId: setStudentId
				}) : null,
				view === "assistente" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssistantView, { today }) : null,
				view === "turmas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClassesView, {
					today,
					onOpenStudent: (nextClass, nextStudent) => {
						recordAbout(nextClass, nextStudent);
						openStudent(nextClass, nextStudent);
					}
				}) : null
			]
		})]
	});
}
var SplitComponent = PedagogicoApp;
//#endregion
export { SplitComponent as component };
