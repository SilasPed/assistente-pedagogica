import { a as startOfMonth, c as startOfDay, i as format, l as addDays, n as parseISO, o as endOfMonth, r as subDays, s as differenceInCalendarDays, t as ptBR } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-DdMgi_fN.js
var AI_TAGS = [
	"participacao",
	"aprendizagem",
	"autonomia",
	"frequencia",
	"interacao",
	"atividades",
	"acompanhamento"
];
var AI_TAG_LABELS = {
	participacao: "Participação",
	aprendizagem: "Aprendizagem",
	autonomia: "Autonomia",
	frequencia: "Frequência",
	interacao: "Interação",
	atividades: "Cumprimento de atividades",
	acompanhamento: "Pontos para acompanhar"
};
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
//#endregion
export { resolvePeriod as C, summarizeStudent as E, relativeDay as S, summarizeClass as T, isoDate as _, EXAM_KINDS as a, previousPeriod as b, defaultPeriodKey as c, fmtScore as d, formatDay as f, inRange as g, frequency as h, CATEGORIES as i, examKindLabel as l, formatRange as m, AI_TAG_LABELS as n, attentionForClass as o, formatLong as p, ATTENDANCE_OPTIONS as r, categoryLabel as s, AI_TAGS as t, firstName as u, mean as v, suggestCategory as w, recentWeekdays as x, periodOptions as y };
