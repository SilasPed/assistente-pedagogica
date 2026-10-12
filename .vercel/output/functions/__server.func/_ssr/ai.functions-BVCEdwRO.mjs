import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-FkX9NQas.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-BVCEdwRO.js
var assistantAvailability_createServerFn_handler = createServerRpc({
	id: "913178b5974f6a7505593057104a405a54e43ac8c1b9f7d65ea7c2b0042855c6",
	name: "assistantAvailability",
	filename: "src/lib/pedagogico/ai.functions.ts"
}, (opts) => assistantAvailability.__executeServer(opts));
var assistantAvailability = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(assistantAvailability_createServerFn_handler, async () => {
	const { geminiConfigured } = await import("./ai.server-BV8p-VwI.mjs");
	return { configured: geminiConfigured() };
});
var runAssistant_createServerFn_handler = createServerRpc({
	id: "465efbab6ced4d9e382fe76362009d92b4327f7ca239d68e366c11359ae864ad",
	name: "runAssistant",
	filename: "src/lib/pedagogico/ai.functions.ts"
}, (opts) => runAssistant.__executeServer(opts));
var runAssistant = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(runAssistant_createServerFn_handler, async ({ data }) => {
	try {
		const { assist, rateKeyFromHeaders } = await import("./ai.server-BV8p-VwI.mjs");
		const { getRequest } = await import("./ssr.mjs").then((n) => n.s).then((n) => n.t);
		return await assist(data, rateKeyFromHeaders(getRequest()?.headers));
	} catch {
		return {
			ok: false,
			code: "error",
			message: "Não foi possível concluir a análise. Os registros não foram alterados."
		};
	}
});
//#endregion
export { assistantAvailability_createServerFn_handler, runAssistant_createServerFn_handler };
