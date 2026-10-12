import { createServerFn } from "@tanstack/react-start";
import type { AssistResult } from "@/lib/pedagogico/ai.server";

export const assistantAvailability = createServerFn({ method: "POST" }).handler(async () => {
  const { geminiConfigured } = await import("@/lib/pedagogico/ai.server");
  return { configured: geminiConfigured() };
});

export const runAssistant = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<AssistResult> => {
    try {
      const { assertSameSiteRequest, CrossSiteRequestError } = await import("@/lib/auth/isolation.server");
      const { getRequest } = await import("@tanstack/react-start/server");
      const { assist, rateKeyFromHeaders } = await import("@/lib/pedagogico/ai.server");
      try {
        assertSameSiteRequest();
      } catch (error) {
        if (error instanceof CrossSiteRequestError) {
          return { ok: false, code: "forbidden", message: "Pedido recusado." };
        }
        throw error;
      }
      const request = getRequest();
      return await assist(data, rateKeyFromHeaders(request?.headers));
    } catch {
      return {
        ok: false,
        code: "error",
        message: "Não foi possível concluir a análise. Os registros não foram alterados.",
      };
    }
  });
