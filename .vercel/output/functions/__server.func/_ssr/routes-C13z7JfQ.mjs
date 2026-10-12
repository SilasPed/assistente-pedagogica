import { i as __toESM, n as __exportAll } from "../_runtime.mjs";
import { G as require_react, K as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { a as House, c as BookOpen, i as Mic, n as Square, o as ClipboardList, r as Plus, s as Check } from "../_libs/lucide-react.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as startOfMonth, c as startOfDay, i as format, l as addDays, n as parseISO, o as endOfMonth, r as subDays, s as differenceInCalendarDays, t as ptBR } from "../_libs/date-fns.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C13z7JfQ.js
var routes_C13z7JfQ_exports = /* @__PURE__ */ __exportAll({ component: () => SplitComponent });
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
function isoDate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function parseDay(iso) {
	return startOfDay(parseISO(iso));
}
function bimesterBounds(year, index) {
	if (index === 1) return {
		start: new Date(year, 1, 2),
		end: new Date(year, 3, 17)
	};
	if (index === 2) return {
		start: new Date(year, 3, 20),
		end: new Date(year, 6, 3)
	};
	if (index === 3) return {
		start: new Date(year, 7, 3),
		end: new Date(year, 8, 18)
	};
	return {
		start: new Date(year, 8, 21),
		end: new Date(year, 11, 18)
	};
}
function bimesterFor(date) {
	const year = date.getFullYear();
	const items = [
		1,
		2,
		3,
		4
	].map((index) => ({
		index,
		...bimesterBounds(year, index)
	}));
	const inside = items.find((item) => date >= item.start && date <= item.end);
	if (inside) return {
		year,
		index: inside.index
	};
	const upcoming = items.find((item) => date < item.start);
	if (upcoming) return {
		year,
		index: upcoming.index
	};
	if (date < items[0].start) return {
		year,
		index: 1
	};
	return {
		year,
		index: 4
	};
}
function previousBimester(current) {
	if (current.index === 1) return {
		year: current.year - 1,
		index: 4
	};
	return {
		year: current.year,
		index: current.index - 1
	};
}
function bimesterLabel(index) {
	return `${index}º bimestre`;
}
function formatDay(iso) {
	return format(parseISO(iso), "d MMM", { locale: ptBR }).replace(".", "");
}
function formatLong(iso) {
	return format(parseISO(iso), "d 'de' MMMM", { locale: ptBR });
}
function formatRange(start, end) {
	return `${formatDay(start)} – ${formatDay(end)}`;
}
function relativeDay(iso, today) {
	const diff = differenceInCalendarDays(parseDay(iso), startOfDay(today));
	if (diff === 0) return "hoje";
	if (diff === 1) return "amanhã";
	if (diff === -1) return "ontem";
	if (diff > 1 && diff < 21) return `em ${diff} dias`;
	if (diff < -1 && diff > -21) return `há ${-diff} dias`;
	return formatDay(iso);
}
function recentWeekdays(today, count) {
	const days = [];
	let cursor = startOfDay(today);
	while (days.length < count) {
		cursor = addDays(cursor, -1);
		const weekday = cursor.getDay();
		if (weekday !== 0 && weekday !== 6) days.push(cursor);
	}
	return days.reverse();
}
function resolvePeriod(key, today) {
	const year = today.getFullYear();
	if (key === "month") {
		const start = startOfMonth(today);
		const end = endOfMonth(today);
		return {
			kind: "month",
			year,
			start: isoDate(start),
			end: isoDate(end),
			label: "Este mês",
			phrase: "neste mês"
		};
	}
	if (key === "last30") return {
		kind: "last30",
		year,
		start: isoDate(subDays(startOfDay(today), 29)),
		end: isoDate(today),
		label: "Últimos 30 dias",
		phrase: "nos últimos 30 dias"
	};
	const match = /^bim-([1-4])-(\d{4})$/.exec(key);
	const index = match ? Number(match[1]) : bimesterFor(today).index;
	const periodYear = match ? Number(match[2]) : year;
	const bounds = bimesterBounds(periodYear, index);
	return {
		kind: "bimester",
		year: periodYear,
		index,
		start: isoDate(bounds.start),
		end: isoDate(bounds.end),
		label: bimesterLabel(index),
		phrase: "neste bimestre"
	};
}
function previousPeriod(period) {
	if (period.kind === "month") {
		const start = startOfMonth(subDays(parseDay(period.start), 1));
		const end = endOfMonth(start);
		return {
			kind: "month",
			year: start.getFullYear(),
			start: isoDate(start),
			end: isoDate(end),
			label: "Mês anterior",
			phrase: "no mês anterior"
		};
	}
	if (period.kind === "last30") {
		const end = subDays(parseDay(period.start), 1);
		const start = subDays(end, 29);
		return {
			kind: "last30",
			year: start.getFullYear(),
			start: isoDate(start),
			end: isoDate(end),
			label: "30 dias anteriores",
			phrase: "nos 30 dias anteriores"
		};
	}
	const prev = previousBimester({
		year: period.year,
		index: period.index ?? 1
	});
	const bounds = bimesterBounds(prev.year, prev.index);
	return {
		kind: "bimester",
		year: prev.year,
		index: prev.index,
		start: isoDate(bounds.start),
		end: isoDate(bounds.end),
		label: bimesterLabel(prev.index),
		phrase: "no bimestre anterior"
	};
}
function periodOptions(today) {
	const year = today.getFullYear();
	const current = bimesterFor(today);
	return [
		...[
			1,
			2,
			3,
			4
		].map((index) => ({
			key: `bim-${index}-${year}`,
			label: index === current.index ? `${bimesterLabel(index)} (atual)` : bimesterLabel(index)
		})),
		{
			key: "month",
			label: "Este mês"
		},
		{
			key: "last30",
			label: "Últimos 30 dias"
		}
	];
}
function defaultPeriodKey(today) {
	const current = bimesterFor(today);
	return `bim-${current.index}-${current.year}`;
}
function inRange(date, start, end) {
	return date >= start && date <= end;
}
function fmtScore(value) {
	return value.toLocaleString("pt-BR", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	});
}
function mean(values) {
	if (!values.length) return null;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function firstName(name) {
	return name.split(" ")[0] ?? name;
}
var FEMININE_NAMES = /* @__PURE__ */ new Set([
	"alice",
	"beatriz",
	"carmen",
	"irene",
	"isabel",
	"isabelle",
	"nicole",
	"ester",
	"esther"
]);
function possessive(name) {
	const first = firstName(name).toLocaleLowerCase("pt-BR");
	if (first.endsWith("a") || FEMININE_NAMES.has(first)) return "da";
	return "do";
}
function countsLabel(count, singular, plural) {
	return `${count} ${count === 1 ? singular : plural}`;
}
var CATEGORIES = [
	{
		id: "participacao",
		label: "Participação"
	},
	{
		id: "comportamento",
		label: "Comportamento"
	},
	{
		id: "dificuldades",
		label: "Dificuldades"
	},
	{
		id: "evolucao",
		label: "Evolução"
	},
	{
		id: "geral",
		label: "Geral"
	}
];
var ATTENDANCE_OPTIONS = [
	{
		id: "presente",
		short: "P",
		label: "Presente"
	},
	{
		id: "falta",
		short: "F",
		label: "Falta"
	},
	{
		id: "atraso",
		short: "A",
		label: "Atraso"
	},
	{
		id: "justificada",
		short: "J",
		label: "Justificada"
	}
];
var EXAM_KINDS = [
	{
		id: "prova",
		label: "Prova"
	},
	{
		id: "trabalho",
		label: "Trabalho"
	},
	{
		id: "recuperacao",
		label: "Recuperação"
	}
];
function categoryLabel(id) {
	return CATEGORIES.find((c) => c.id === id)?.label ?? "Geral";
}
function examKindLabel(id) {
	return EXAM_KINDS.find((k) => k.id === id)?.label ?? "Prova";
}
function presentish(status) {
	return status === "presente" || status === "atraso";
}
function frequency(rows) {
	if (!rows.length) return null;
	const present = rows.filter((row) => presentish(row.status)).length;
	return {
		present,
		total: rows.length,
		pct: Math.round(present / rows.length * 100)
	};
}
function joinPhrase(parts) {
	if (parts.length === 0) return "";
	if (parts.length === 1) return parts[0];
	return `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
}
function latestObservation(rows) {
	return rows.slice().sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))[0];
}
function summarizeStudent(input) {
	const { student, period, observations, grades, previousGrades, attendance, nextExam } = input;
	const avg = mean(grades.map((grade) => grade.score));
	const prevAvg = mean(previousGrades.map((grade) => grade.score));
	const freq = frequency(attendance);
	const delays = attendance.filter((row) => row.status === "atraso").length;
	const justified = attendance.filter((row) => row.status === "justificada").length;
	const by = (category) => observations.filter((row) => row.category === category).length;
	const facts = [];
	if (avg != null) {
		let sentence = `média ${fmtScore(avg)}`;
		if (prevAvg != null) {
			const delta = avg - prevAvg;
			if (Math.abs(delta) < .25) sentence += ", estável em relação ao período anterior";
			else if (delta > 0) sentence += ` — ${fmtScore(delta)} acima do período anterior`;
			else sentence += ` — ${fmtScore(Math.abs(delta))} abaixo do período anterior`;
		}
		facts.push(sentence);
	}
	if (freq) facts.push(`frequência de ${freq.pct}% (${freq.present} de ${freq.total})`);
	let body = facts.length ? `${student.name} está com ${joinPhrase(facts)}.` : `${student.name} ainda não tem nota nem frequência ${period.phrase}.`;
	if (!observations.length) body += " Não há observação qualitativa neste período.";
	else {
		const pieces = [
			by("evolucao") ? countsLabel(by("evolucao"), "registro de evolução", "registros de evolução") : "",
			by("dificuldades") ? countsLabel(by("dificuldades"), "registro de dificuldade", "registros de dificuldade") : "",
			by("participacao") ? countsLabel(by("participacao"), "registro de participação", "registros de participação") : "",
			by("comportamento") ? countsLabel(by("comportamento"), "registro de comportamento", "registros de comportamento") : "",
			by("geral") ? countsLabel(by("geral"), "registro geral", "registros gerais") : ""
		].filter(Boolean);
		body += ` Entre ${countsLabel(observations.length, "observação", "observações")}`;
		body += pieces.length ? `, ${joinPhrase(pieces)}.` : ".";
		const latest = latestObservation(observations);
		if (latest) body += ` O mais recente (${formatDay(latest.date)}, ${categoryLabel(latest.category).toLowerCase()}): “${latest.text}”`;
	}
	const flags = [];
	if (freq && freq.pct < 75) flags.push("Frequência abaixo de 75%");
	if (avg != null && avg < 6) flags.push("Média abaixo de 6");
	if (by("dificuldades") >= 2 && by("evolucao") === 0) flags.push("Dificuldade sem evolução registrada");
	if (delays >= 3) flags.push(countsLabel(delays, "atraso", "atrasos"));
	if (justified > 0) flags.push(countsLabel(justified, "falta justificada", "faltas justificadas"));
	if (flags.length) body += ` Atenção: ${joinPhrase(flags.map((flag) => flag.toLowerCase()))}.`;
	if (nextExam) body += ` Próxima avaliação da turma: ${nextExam.title}, ${formatDay(nextExam.date)}.`;
	return {
		title: `Evolução ${possessive(student.name)} ${firstName(student.name)} ${period.phrase}`,
		body,
		stats: [
			{
				label: "Média",
				value: avg == null ? "—" : fmtScore(avg)
			},
			{
				label: "Frequência",
				value: freq ? `${freq.pct}%` : "—"
			},
			{
				label: "Observações",
				value: String(observations.length)
			}
		],
		flags
	};
}
function summarizeClass(input) {
	const { classRoom, students, period, observations, grades, attendance, nextExam } = input;
	const averages = students.map((student) => mean(grades.filter((grade) => grade.studentId === student.id).map((g) => g.score))).filter((value) => value != null);
	const freqs = students.map((student) => frequency(attendance.filter((row) => row.studentId === student.id))).filter((value) => value != null);
	const avg = mean(averages);
	const freq = freqs.length ? Math.round(freqs.reduce((sum, row) => sum + row.pct, 0) / freqs.length) : null;
	const watch = attentionForClass({
		students,
		observations,
		grades,
		attendance
	}).slice(0, 3);
	let body = `${classRoom.name} de ${classRoom.subject} reúne ${countsLabel(students.length, "aluno", "alunos")}.`;
	if (avg != null || freq != null) {
		const bits = [avg != null ? `média da turma ${fmtScore(avg)}` : "", freq != null ? `frequência média ${freq}%` : ""].filter(Boolean);
		body += ` ${period.phrase[0].toUpperCase()}${period.phrase.slice(1)}, ${joinPhrase(bits)}.`;
	} else body += ` Ainda não há nota nem frequência ${period.phrase}.`;
	body += observations.length ? ` ${countsLabel(observations.length, "observação registrada", "observações registradas")}.` : " Nenhuma observação qualitativa neste período.";
	if (watch.length) body += ` Pedem olhar mais de perto: ${joinPhrase(watch.map((item) => `${firstName(item.student.name)} (${item.reasons[0].toLowerCase()})`))}.`;
	else if (students.length) body += " Nenhum aluno isolado em atenção com os critérios atuais.";
	if (nextExam) body += ` Próxima avaliação: ${nextExam.title}, ${formatDay(nextExam.date)}.`;
	return {
		title: `Panorama do ${classRoom.name} ${period.phrase}`,
		body,
		stats: [
			{
				label: "Média",
				value: avg == null ? "—" : fmtScore(avg)
			},
			{
				label: "Frequência",
				value: freq == null ? "—" : `${freq}%`
			},
			{
				label: "Observações",
				value: String(observations.length)
			}
		],
		flags: watch.map((item) => `${firstName(item.student.name)} · ${item.reasons[0]}`)
	};
}
function attentionForClass(input) {
	const items = [];
	for (const student of input.students) {
		const grades = input.grades.filter((grade) => grade.studentId === student.id);
		const attendance = input.attendance.filter((row) => row.studentId === student.id);
		const observations = input.observations.filter((row) => row.studentId === student.id);
		const avg = mean(grades.map((grade) => grade.score));
		const freq = frequency(attendance);
		const delays = attendance.filter((row) => row.status === "atraso").length;
		const difficulties = observations.filter((row) => row.category === "dificuldades").length;
		const growth = observations.filter((row) => row.category === "evolucao").length;
		const reasons = [];
		if (freq && freq.total >= 4 && freq.pct < 75) reasons.push(`Frequência ${freq.pct}%`);
		if (avg != null && avg < 6) reasons.push(`Média ${fmtScore(avg)}`);
		if (difficulties >= 2 && growth === 0) reasons.push("Dificuldade sem evolução");
		if (delays >= 3) reasons.push(countsLabel(delays, "atraso", "atrasos"));
		if (reasons.length) items.push({
			student,
			reasons
		});
	}
	return items.sort((a, b) => b.reasons.length - a.reasons.length || a.student.name.localeCompare(b.student.name, "pt-BR"));
}
function suggestCategory(text) {
	const value = text.toLowerCase();
	if (/evolu|melhor|avanç|progred|sozinh/.test(value)) return "evolucao";
	if (/dificuld|não conseguiu|nao conseguiu|travou|confund/.test(value)) return "dificuldades";
	if (/particip|levantou a mão|levantou a mao|colabor/.test(value)) return "participacao";
	if (/comport|indisciplin|atras|interromp|conversou/.test(value)) return "comportamento";
	return null;
}
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
		name: "Alice Moreira"
	},
	{
		id: "bruno",
		classId: "7a",
		name: "Bruno Carvalho"
	},
	{
		id: "camila",
		classId: "7a",
		name: "Camila Dias"
	},
	{
		id: "diego",
		classId: "7a",
		name: "Diego Nunes"
	},
	{
		id: "elena",
		classId: "7a",
		name: "Elena Rocha"
	},
	{
		id: "felipe",
		classId: "7a",
		name: "Felipe Andrade"
	},
	{
		id: "helena",
		classId: "8b",
		name: "Helena Martins"
	},
	{
		id: "igor",
		classId: "8b",
		name: "Igor Pacheco"
	},
	{
		id: "julia",
		classId: "8b",
		name: "Júlia Ferreira"
	},
	{
		id: "kaique",
		classId: "8b",
		name: "Kaique Lima"
	},
	{
		id: "lara",
		classId: "8b",
		name: "Lara Souza"
	},
	{
		id: "miguel",
		classId: "8b",
		name: "Miguel Torres"
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
				status: STATUS[code] ?? "presente"
			});
		});
	}
	return {
		classes: [{
			id: "7a",
			name: "7º A",
			subject: "Matemática"
		}, {
			id: "8b",
			name: "8º B",
			subject: "Ciências"
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
			createdAt: `${day(offset)}T12:00:00.000Z`
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
			score
		})),
		attendance,
		exams: [
			{
				id: "exam-1",
				classId: "8b",
				title: "Entrega do relatório reescrito",
				date: day(3),
				kind: "trabalho"
			},
			{
				id: "exam-2",
				classId: "7a",
				title: "Prova de equações",
				date: day(5),
				kind: "prova"
			},
			{
				id: "exam-3",
				classId: "8b",
				title: "Avaliação de ecossistemas",
				date: day(11),
				kind: "prova"
			},
			{
				id: "exam-4",
				classId: "7a",
				title: "Recuperação paralela",
				date: day(14),
				kind: "recuperacao"
			}
		],
		pendings: [
			{
				id: "pend-1",
				classId: "8b",
				studentId: null,
				title: "Lançar as notas do relatório de ciências",
				due: day(-2),
				done: false
			},
			{
				id: "pend-2",
				classId: "7a",
				studentId: "camila",
				title: "Falar com a família da Camila Dias",
				due: day(0),
				done: false
			},
			{
				id: "pend-3",
				classId: "7a",
				studentId: null,
				title: "Devolver a correção da prova de frações",
				due: day(1),
				done: false
			},
			{
				id: "pend-4",
				classId: "7a",
				studentId: "diego",
				title: "Separar a lista de recuperação do Diego",
				due: day(6),
				done: false
			},
			{
				id: "pend-5",
				classId: "8b",
				studentId: "julia",
				title: "Devolver o modelo de relatório para a Júlia",
				due: day(-8),
				done: true
			}
		]
	};
}
function id() {
	return crypto.randomUUID();
}
var usePedStore = create()(persist((set) => ({
	...createSeed(/* @__PURE__ */ new Date()),
	addObservation: (input) => set((state) => ({ observations: [{
		...input,
		id: id(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}, ...state.observations] })),
	removeObservation: (observationId) => set((state) => ({ observations: state.observations.filter((item) => item.id !== observationId) })),
	addGrade: (input) => set((state) => ({ grades: [{
		...input,
		id: id()
	}, ...state.grades] })),
	removeGrade: (gradeId) => set((state) => ({ grades: state.grades.filter((item) => item.id !== gradeId) })),
	upsertAttendance: (input) => set((state) => {
		const index = state.attendance.findIndex((item) => item.studentId === input.studentId && item.date === input.date);
		if (index === -1) return { attendance: [...state.attendance, {
			...input,
			id: id()
		}] };
		const next = state.attendance.slice();
		next[index] = {
			...next[index],
			status: input.status
		};
		return { attendance: next };
	}),
	togglePending: (pendingId) => set((state) => ({ pendings: state.pendings.map((item) => item.id === pendingId ? {
		...item,
		done: !item.done
	} : item) })),
	addPending: (input) => set((state) => ({ pendings: [{
		...input,
		id: id(),
		done: false
	}, ...state.pendings] })),
	addExam: (input) => set((state) => ({ exams: [...state.exams, {
		...input,
		id: id()
	}].sort((a, b) => a.date.localeCompare(b.date)) })),
	removeExam: (examId) => set((state) => ({ exams: state.exams.filter((item) => item.id !== examId) })),
	addStudent: (classId, name) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		set((state) => ({ students: [...state.students, {
			id: id(),
			classId,
			name: trimmed
		}] }));
	},
	resetDemo: () => set(createSeed(/* @__PURE__ */ new Date()))
}), {
	name: "acompanhamento-pedagogico-v1",
	skipHydration: true,
	partialize: (state) => ({
		classes: state.classes,
		students: state.students,
		observations: state.observations,
		grades: state.grades,
		attendance: state.attendance,
		exams: state.exams,
		pendings: state.pendings
	})
}));
function ClassesView({ today, onOpenStudent }) {
	const data = usePedStore();
	const period = resolvePeriod(defaultPeriodKey(today), today);
	const [names, setNames] = (0, import_react.useState)({});
	const [confirmReset, setConfirmReset] = (0, import_react.useState)(false);
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: room.subject }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
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
							const avg = mean(data.grades.filter((grade) => grade.studentId === student.id && inRange(grade.date, period.start, period.end)).map((grade) => grade.score));
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
			className: "flex flex-col items-start gap-2 px-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Os registros ficam neste aparelho."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
			})]
		})]
	});
}
var GradeChart = (0, import_react.lazy)(() => import("./grade-chart-CV6rxtFO.mjs"));
function ConsultView({ today, classId, studentId, onClassId, onStudentId }) {
	const data = usePedStore();
	const [periodKey, setPeriodKey] = (0, import_react.useState)(defaultPeriodKey(today));
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
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
							const avg = mean(scoped.grades.filter((grade) => grade.studentId === item.id).map((grade) => grade.score));
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
			})
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
			return attentionForClass({
				students: data.students.filter((student) => student.classId === room.id),
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
		id: "turmas",
		label: "Turmas",
		icon: BookOpen
	}
];
function PedagogicoApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let active = true;
		Promise.resolve(usePedStore.persist.rehydrate()).finally(() => {
			if (active) setReady(true);
		});
		return () => {
			active = false;
		};
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
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
				children: "Abrindo os registros da sala…"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadyApp, {});
}
function ReadyApp() {
	const classes = usePedStore((state) => state.classes);
	const [today] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const [view, setView] = (0, import_react.useState)("inicio");
	const [classId, setClassId] = (0, import_react.useState)(classes[0]?.id ?? "");
	const [studentId, setStudentId] = (0, import_react.useState)("all");
	const [prefill, setPrefill] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		window.scrollTo(0, 0);
	}, [view]);
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
					className: "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted",
						children: "Sala de aula"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "display-title",
						children: ["Acompanhamento ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "italic",
							children: "pedagógico"
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: formatLong(isoDate(today))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: "Exemplo pronto para usar. Observações, notas e frequência ficam neste aparelho."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "dock fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-line bg-card md:static md:mt-5 md:flex md:gap-2 md:border-0 md:bg-transparent md:p-0",
					"aria-label": "Seções",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const active = view === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-current": active ? "page" : void 0,
							onClick: () => setView(item.id),
							className: cn("flex min-h-12 flex-col items-center justify-center gap-1 py-2 text-xs font-medium md:flex-row md:rounded-full md:px-4", active ? "text-primary md:bg-primary md:text-primary-fg" : "text-muted"),
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
					onClassId: setClassId,
					onStudentId: setStudentId
				}) : null,
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
export { SplitComponent as component, routes_C13z7JfQ_exports as t };
