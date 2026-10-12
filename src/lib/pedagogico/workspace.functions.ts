import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { pedDataFromUnknown } from "@/lib/pedagogico/workspace";

const MAX_CHARS = 1_500_000;

export const loadWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getSql } = await import("@/lib/db");
    const { readTeacherProfile, readWorkspaceJson } = await import("@/lib/pedagogico/workspace-store");
    const sql = await getSql();
    const [json, profile] = await Promise.all([
      readWorkspaceJson(sql, context.userId),
      readTeacherProfile(sql, context.userId),
    ]);
    let data = null;
    if (json) {
      try {
        data = pedDataFromUnknown(JSON.parse(json));
      } catch {
        data = null;
      }
    }
    return {
      data,
      teacherName: profile.display_name,
      place: profile.place,
    };
  });

export const saveWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => input)
  .handler(async ({ context, data }) => {
    const parsed = pedDataFromUnknown(data);
    if (!parsed) return { ok: false as const, message: "Os registros não puderam ser guardados." };
    const json = JSON.stringify(parsed);
    if (json.length > MAX_CHARS) return { ok: false as const, message: "Os registros passam do tamanho aceito." };
    const { getSql } = await import("@/lib/db");
    const { writeWorkspaceJson } = await import("@/lib/pedagogico/workspace-store");
    const sql = await getSql();
    await writeWorkspaceJson(sql, context.userId, json);
    return { ok: true as const };
  });

export const saveTeacherProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => input)
  .handler(async ({ context, data }) => {
    const row = data && typeof data === "object" ? (data as { displayName?: unknown; place?: unknown }) : {};
    const displayName = typeof row.displayName === "string" ? row.displayName.trim().slice(0, 80) : "";
    const place = typeof row.place === "string" ? row.place.trim().slice(0, 80) : "";
    const { getSql } = await import("@/lib/db");
    const { writeTeacherProfile } = await import("@/lib/pedagogico/workspace-store");
    const sql = await getSql();
    await writeTeacherProfile(sql, context.userId, displayName, place);
    return { ok: true as const };
  });
