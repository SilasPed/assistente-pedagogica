import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-FkX9NQas.mjs";
import { i as pedDataFromUnknown } from "./workspace-9sPa0GGy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace.functions-CZqCAsPB.js
var MAX_CHARS = 15e5;
var loadWorkspace_createServerFn_handler = createServerRpc({
	id: "faf514c89fe6022b6047999a38117ba1ace68a533b25e26dd57811cc3aee2e2e",
	name: "loadWorkspace",
	filename: "src/lib/pedagogico/workspace.functions.ts"
}, (opts) => loadWorkspace.__executeServer(opts));
var loadWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadWorkspace_createServerFn_handler, async ({ context }) => {
	const { getSql } = await import("./db-CTCrI-s1.mjs").then((n) => n.t).then((n) => n.t);
	const { readTeacherProfile, readWorkspaceJson } = await import("./workspace-store-BG080nhz.mjs");
	const sql = await getSql();
	const [json, profile] = await Promise.all([readWorkspaceJson(sql, context.userId), readTeacherProfile(sql, context.userId)]);
	let data = null;
	if (json) try {
		data = pedDataFromUnknown(JSON.parse(json));
	} catch {
		data = null;
	}
	return {
		data,
		teacherName: profile.display_name,
		place: profile.place
	};
});
var saveWorkspace_createServerFn_handler = createServerRpc({
	id: "949f20a62f960a59b6cd076cfca26f459d0a7f0a6a5e1b7c7ba6b541b9a2cec8",
	name: "saveWorkspace",
	filename: "src/lib/pedagogico/workspace.functions.ts"
}, (opts) => saveWorkspace.__executeServer(opts));
var saveWorkspace = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveWorkspace_createServerFn_handler, async ({ context, data }) => {
	const parsed = pedDataFromUnknown(data);
	if (!parsed) return {
		ok: false,
		message: "Os registros não puderam ser guardados."
	};
	const json = JSON.stringify(parsed);
	if (json.length > MAX_CHARS) return {
		ok: false,
		message: "Os registros passam do tamanho aceito."
	};
	const { getSql } = await import("./db-CTCrI-s1.mjs").then((n) => n.t).then((n) => n.t);
	const { writeWorkspaceJson } = await import("./workspace-store-BG080nhz.mjs");
	await writeWorkspaceJson(await getSql(), context.userId, json);
	return { ok: true };
});
var saveTeacherProfile_createServerFn_handler = createServerRpc({
	id: "95a55828c7d6ee3d87cdd311870c163d4131f0b336916c050f8bb4fa62e2d44b",
	name: "saveTeacherProfile",
	filename: "src/lib/pedagogico/workspace.functions.ts"
}, (opts) => saveTeacherProfile.__executeServer(opts));
var saveTeacherProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveTeacherProfile_createServerFn_handler, async ({ context, data }) => {
	const row = data && typeof data === "object" ? data : {};
	const displayName = typeof row.displayName === "string" ? row.displayName.trim().slice(0, 80) : "";
	const place = typeof row.place === "string" ? row.place.trim().slice(0, 80) : "";
	const { getSql } = await import("./db-CTCrI-s1.mjs").then((n) => n.t).then((n) => n.t);
	const { writeTeacherProfile } = await import("./workspace-store-BG080nhz.mjs");
	await writeTeacherProfile(await getSql(), context.userId, displayName, place);
	return { ok: true };
});
//#endregion
export { loadWorkspace_createServerFn_handler, saveTeacherProfile_createServerFn_handler, saveWorkspace_createServerFn_handler };
