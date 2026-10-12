//#region node_modules/.nitro/vite/services/ssr/assets/workspace-9sPa0GGy.js
var DEMO_CLASS_IDS = /* @__PURE__ */ new Set(["7a", "8b"]);
var DEMO_STUDENT_IDS = /* @__PURE__ */ new Set([
	"alice",
	"bruno",
	"camila",
	"diego",
	"elena",
	"felipe",
	"helena",
	"igor",
	"julia",
	"kaique",
	"lara",
	"miguel"
]);
function asOrigin(value, fallback) {
	return value === "demo" || value === "local" ? value : fallback;
}
function classOrigin(classId, current) {
	if (current === "demo" || current === "local") return current;
	return DEMO_CLASS_IDS.has(classId) ? "demo" : "local";
}
function studentOrigin(student) {
	if (student.origin === "demo" || student.origin === "local") return student.origin;
	return DEMO_STUDENT_IDS.has(student.id) ? "demo" : "local";
}
function normalizePedData(input) {
	if (!input) return {};
	if (![
		input?.classes,
		input?.students,
		input?.observations,
		input?.grades,
		input?.attendance,
		input?.exams,
		input?.pendings
	].some((rows) => Array.isArray(rows) && rows.length > 0)) return {};
	const classes = (input.classes ?? []).map((room) => ({
		...room,
		origin: classOrigin(room.id, room.origin)
	}));
	const students = (input.students ?? []).map((student) => ({
		...student,
		origin: studentOrigin(student)
	}));
	const originOfStudent = (studentId) => students.find((student) => student.id === studentId)?.origin ?? "local";
	return {
		classes,
		students,
		observations: (input.observations ?? []).map((row) => ({
			...row,
			origin: asOrigin(row.origin, originOfStudent(row.studentId))
		})),
		grades: (input.grades ?? []).map((row) => ({
			...row,
			origin: asOrigin(row.origin, originOfStudent(row.studentId))
		})),
		attendance: (input.attendance ?? []).map((row) => ({
			...row,
			origin: asOrigin(row.origin, originOfStudent(row.studentId))
		})),
		exams: (input.exams ?? []).map((row) => ({
			...row,
			origin: asOrigin(row.origin, classOrigin(row.classId))
		})),
		pendings: (input.pendings ?? []).map((row) => ({
			...row,
			origin: asOrigin(row.origin, row.studentId ? originOfStudent(row.studentId) : classOrigin(row.classId))
		}))
	};
}
function localRows(rows) {
	return rows.filter((row) => row.origin === "local");
}
/** Recria a sala fictícia e preserva o que foi incluído neste aparelho. */
function restoreDemoData(current, seed) {
	const seedClassIds = new Set(seed.classes.map((room) => room.id));
	return {
		classes: [...seed.classes, ...current.classes.filter((room) => room.origin === "local" && !seedClassIds.has(room.id))],
		students: [...seed.students, ...localRows(current.students)],
		observations: [...seed.observations, ...localRows(current.observations)],
		grades: [...seed.grades, ...localRows(current.grades)],
		attendance: [...seed.attendance, ...localRows(current.attendance)],
		exams: [...seed.exams, ...localRows(current.exams)],
		pendings: [...seed.pendings, ...localRows(current.pendings)]
	};
}
var LEGACY_STORAGE_KEY = "acompanhamento-pedagogico-v1";
function emptyPedData() {
	return {
		classes: [],
		students: [],
		observations: [],
		grades: [],
		attendance: [],
		exams: [],
		pendings: []
	};
}
function pedDataFromUnknown(raw) {
	if (!raw || typeof raw !== "object") return null;
	const source = raw;
	if (![
		"classes",
		"students",
		"observations",
		"grades",
		"attendance",
		"exams",
		"pendings"
	].some((key) => Array.isArray(source[key]))) return null;
	const normalized = normalizePedData(source);
	return {
		classes: normalized.classes ?? [],
		students: normalized.students ?? [],
		observations: normalized.observations ?? [],
		grades: normalized.grades ?? [],
		attendance: normalized.attendance ?? [],
		exams: normalized.exams ?? [],
		pendings: normalized.pendings ?? []
	};
}
function legacyStateFromJson(raw) {
	try {
		const parsed = JSON.parse(raw);
		return pedDataFromUnknown(parsed.state ?? parsed);
	} catch {
		return null;
	}
}
function readLegacyPedData() {
	if (typeof localStorage === "undefined") return null;
	const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
	if (!raw) return null;
	return legacyStateFromJson(raw);
}
function clearLegacyPedData() {
	if (typeof localStorage === "undefined") return;
	localStorage.removeItem(LEGACY_STORAGE_KEY);
}
function snapshotPed(state) {
	return {
		classes: state.classes,
		students: state.students,
		observations: state.observations,
		grades: state.grades,
		attendance: state.attendance,
		exams: state.exams,
		pendings: state.pendings
	};
}
function pedHasRows(data) {
	return data.classes.length + data.students.length + data.observations.length + data.grades.length + data.attendance.length + data.exams.length + data.pendings.length > 0;
}
//#endregion
export { pedHasRows as a, snapshotPed as c, pedDataFromUnknown as i, emptyPedData as n, readLegacyPedData as o, legacyStateFromJson as r, restoreDemoData as s, clearLegacyPedData as t };
