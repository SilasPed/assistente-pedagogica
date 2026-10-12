import { n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-B2Bl48QL.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var assistantAvailability_createServerFn_handler = createServerRpc({
	id: "913178b5974f6a7505593057104a405a54e43ac8c1b9f7d65ea7c2b0042855c6",
	name: "assistantAvailability",
	filename: "src/lib/pedagogico/ai.functions.ts"
}, (opts) => assistantAvailability.__executeServer(opts));
var assistantAvailability = createServerFn({ method: "POST" }).handler(assistantAvailability_createServerFn_handler, async () => {
	const { geminiConfigured } = await import("./ai.server-BFJaybUg.mjs");
	return { configured: geminiConfigured() };
});
var runAssistant_createServerFn_handler = createServerRpc({
	id: "465efbab6ced4d9e382fe76362009d92b4327f7ca239d68e366c11359ae864ad",
	name: "runAssistant",
	filename: "src/lib/pedagogico/ai.functions.ts"
}, (opts) => runAssistant.__executeServer(opts));
var runAssistant = createServerFn({ method: "POST" }).validator((input) => input).handler(runAssistant_createServerFn_handler, async ({ data }) => {
	try {
		const { assertSameSiteRequest, CrossSiteRequestError } = await import("./isolation.server-DdG3f88r.mjs");
		const { getRequest } = await import("./ssr.mjs").then((n) => n.o).then((n) => n.t);
		const { assist } = await import("./ai.server-BFJaybUg.mjs");
		try {
			assertSameSiteRequest();
		} catch (error) {
			if (error instanceof CrossSiteRequestError) return {
				ok: false,
				code: "forbidden",
				message: "Pedido recusado."
			};
			throw error;
		}
		const forwarded = getRequest()?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
		return await assist(data, forwarded || "local");
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
