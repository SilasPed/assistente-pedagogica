import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Exam } from "./types.ts";

export type BimesterIndex = 1 | 2 | 3 | 4;

export type PeriodKind = "bimester" | "month" | "last30";

export type ResolvedPeriod = {
  kind: PeriodKind;
  start: string;
  end: string;
  label: string;
  phrase: string;
  index?: BimesterIndex;
  year: number;
};

export function isoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDay(iso: string) {
  return startOfDay(parseISO(iso));
}

export function bimesterBounds(year: number, index: BimesterIndex) {
  if (index === 1) return { start: new Date(year, 1, 2), end: new Date(year, 3, 17) };
  if (index === 2) return { start: new Date(year, 3, 20), end: new Date(year, 6, 3) };
  if (index === 3) return { start: new Date(year, 7, 3), end: new Date(year, 8, 18) };
  return { start: new Date(year, 8, 21), end: new Date(year, 11, 18) };
}

export function bimesterFor(date: Date): { year: number; index: BimesterIndex } {
  const year = date.getFullYear();
  const items = ([1, 2, 3, 4] as const).map((index) => ({
    index,
    ...bimesterBounds(year, index),
  }));
  const inside = items.find((item) => date >= item.start && date <= item.end);
  if (inside) return { year, index: inside.index };
  const upcoming = items.find((item) => date < item.start);
  if (upcoming) return { year, index: upcoming.index };
  if (date < items[0].start) return { year, index: 1 };
  return { year, index: 4 };
}

export function previousBimester(current: { year: number; index: BimesterIndex }) {
  if (current.index === 1) return { year: current.year - 1, index: 4 as const };
  return { year: current.year, index: (current.index - 1) as BimesterIndex };
}

export function bimesterLabel(index: BimesterIndex) {
  return `${index}º bimestre`;
}

export function formatDay(iso: string) {
  return format(parseISO(iso), "d MMM", { locale: ptBR }).replace(".", "");
}

export function formatLong(iso: string) {
  return format(parseISO(iso), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function upcomingExams(exams: Exam[], todayIso: string, classId?: string) {
  return exams
    .filter((exam) => exam.date >= todayIso && (!classId || exam.classId === classId))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, "pt-BR"));
}

export function formatRange(start: string, end: string) {
  return `${formatDay(start)} – ${formatDay(end)}`;
}

export function relativeDay(iso: string, today: Date) {
  const diff = differenceInCalendarDays(parseDay(iso), startOfDay(today));
  if (diff === 0) return "hoje";
  if (diff === 1) return "amanhã";
  if (diff === -1) return "ontem";
  if (diff > 1 && diff < 21) return `em ${diff} dias`;
  if (diff < -1 && diff > -21) return `há ${-diff} dias`;
  return formatDay(iso);
}

export function recentWeekdays(today: Date, count: number) {
  const days: Date[] = [];
  let cursor = startOfDay(today);
  while (days.length < count) {
    cursor = addDays(cursor, -1);
    const weekday = cursor.getDay();
    if (weekday !== 0 && weekday !== 6) days.push(cursor);
  }
  return days.reverse();
}

export function resolvePeriod(key: string, today: Date): ResolvedPeriod {
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
      phrase: "neste mês",
    };
  }
  if (key === "last30") {
    return {
      kind: "last30",
      year,
      start: isoDate(subDays(startOfDay(today), 29)),
      end: isoDate(today),
      label: "Últimos 30 dias",
      phrase: "nos últimos 30 dias",
    };
  }
  const match = /^bim-([1-4])-(\d{4})$/.exec(key);
  const index = (match ? Number(match[1]) : bimesterFor(today).index) as BimesterIndex;
  const periodYear = match ? Number(match[2]) : year;
  const bounds = bimesterBounds(periodYear, index);
  return {
    kind: "bimester",
    year: periodYear,
    index,
    start: isoDate(bounds.start),
    end: isoDate(bounds.end),
    label: bimesterLabel(index),
    phrase: "neste bimestre",
  };
}

export function previousPeriod(period: ResolvedPeriod): ResolvedPeriod {
  if (period.kind === "month") {
    const start = startOfMonth(subDays(parseDay(period.start), 1));
    const end = endOfMonth(start);
    return {
      kind: "month",
      year: start.getFullYear(),
      start: isoDate(start),
      end: isoDate(end),
      label: "Mês anterior",
      phrase: "no mês anterior",
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
      phrase: "nos 30 dias anteriores",
    };
  }
  const prev = previousBimester({ year: period.year, index: period.index ?? 1 });
  const bounds = bimesterBounds(prev.year, prev.index);
  return {
    kind: "bimester",
    year: prev.year,
    index: prev.index,
    start: isoDate(bounds.start),
    end: isoDate(bounds.end),
    label: bimesterLabel(prev.index),
    phrase: "no bimestre anterior",
  };
}

export function periodOptions(today: Date) {
  const year = today.getFullYear();
  const current = bimesterFor(today);
  const bimesters = ([1, 2, 3, 4] as const).map((index) => ({
    key: `bim-${index}-${year}`,
    label: index === current.index ? `${bimesterLabel(index)} (atual)` : bimesterLabel(index),
  }));
  return [
    ...bimesters,
    { key: "month", label: "Este mês" },
    { key: "last30", label: "Últimos 30 dias" },
  ];
}

export function defaultPeriodKey(today: Date) {
  const current = bimesterFor(today);
  return `bim-${current.index}-${current.year}`;
}

export function inRange(date: string, start: string, end: string) {
  return date >= start && date <= end;
}

export function fmtScore(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function mean(values: number[]) {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function firstName(name: string) {
  return name.split(" ")[0] ?? name;
}

const FEMININE_NAMES = new Set([
  "alice",
  "beatriz",
  "carmen",
  "irene",
  "isabel",
  "isabelle",
  "nicole",
  "ester",
  "esther",
]);

export function possessive(name: string) {
  const first = firstName(name).toLocaleLowerCase("pt-BR");
  if (first.endsWith("a") || FEMININE_NAMES.has(first)) return "da";
  return "do";
}

export function countsLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}
