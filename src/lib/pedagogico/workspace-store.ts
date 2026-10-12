import type { Sql } from "../db.ts";

export async function readWorkspaceJson(sql: Sql, userId: string) {
  const rows = await sql<{ data: string }>`select data from ped_workspace where user_id = ${userId}`;
  return rows[0]?.data ?? null;
}

export async function writeWorkspaceJson(sql: Sql, userId: string, data: string) {
  await sql`
    insert into ped_workspace (user_id, data, updated_at)
    values (${userId}, ${data}, now())
    on conflict (user_id) do update set data = excluded.data, updated_at = now()
  `;
}

export async function readTeacherProfile(sql: Sql, userId: string) {
  const rows = await sql<{ display_name: string; place: string }>`
    select display_name, place from teacher_profile where user_id = ${userId}
  `;
  return rows[0] ?? { display_name: "", place: "" };
}

export async function writeTeacherProfile(sql: Sql, userId: string, displayName: string, place: string) {
  await sql`
    insert into teacher_profile (user_id, display_name, place, updated_at)
    values (${userId}, ${displayName}, ${place}, now())
    on conflict (user_id) do update
      set display_name = excluded.display_name, place = excluded.place, updated_at = now()
  `;
}
