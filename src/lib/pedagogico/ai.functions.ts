import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { AssistResult } from "@/lib/pedagogico/ai.server";

export const assistantAvailability = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async () => {
    const { geminiConfigured } = await import("@/lib/pedagogico/ai.server");
    return { configured: geminiConfigured() };
  });

export const runAssistant = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<AssistResult> => {
    try {
      const { assist, rateKeyFromHeaders } = await import("@/lib/pedagogico/ai.server");
      const { getRequest } = await import("@tanstack/react-start/server");
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
