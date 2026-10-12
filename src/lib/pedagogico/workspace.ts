import { normalizePedData } from "./origins.ts";
import type { PedData } from "./types.ts";

export const LEGACY_STORAGE_KEY = "acompanhamento-pedagogico-v1";

export function emptyPedData(): PedData {
  return {
    classes: [],
    students: [],
    observations: [],
    grades: [],
    attendance: [],
    exams: [],
    pendings: [],
  };
}

export function pedDataFromUnknown(raw: unknown): PedData | null {
  if (!raw || typeof raw !== "object") return null;
  const source = raw as Partial<PedData>;
  const keys = ["classes", "students", "observations", "grades", "attendance", "exams", "pendings"] as const;
  if (!keys.some((key) => Array.isArray(source[key]))) return null;
  const normalized = normalizePedData(source);
  return {
    classes: normalized.classes ?? [],
    students: normalized.students ?? [],
    observations: normalized.observations ?? [],
    grades: normalized.grades ?? [],
    attendance: normalized.attendance ?? [],
    exams: normalized.exams ?? [],
    pendings: normalized.pendings ?? [],
  };
}

export function legacyStateFromJson(raw: string): PedData | null {
  try {
    const parsed = JSON.parse(raw) as { state?: unknown };
    return pedDataFromUnknown(parsed.state ?? parsed);
  } catch {
    return null;
  }
}

export function readLegacyPedData(): PedData | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return null;
  return legacyStateFromJson(raw);
}

export function clearLegacyPedData() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function snapshotPed(state: PedData): PedData {
  return {
    classes: state.classes,
    students: state.students,
    observations: state.observations,
    grades: state.grades,
    attendance: state.attendance,
    exams: state.exams,
    pendings: state.pendings,
  };
}

export function pedHasRows(data: PedData) {
  return (
    data.classes.length +
      data.students.length +
      data.observations.length +
      data.grades.length +
      data.attendance.length +
      data.exams.length +
      data.pendings.length >
    0
  );
}
