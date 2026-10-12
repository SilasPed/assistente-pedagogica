//#region node_modules/.nitro/vite/services/ssr/assets/workspace-store-BG080nhz.js
async function readWorkspaceJson(sql, userId) {
	return (await sql`select data from ped_workspace where user_id = ${userId}`)[0]?.data ?? null;
}
async function writeWorkspaceJson(sql, userId, data) {
	await sql`
    insert into ped_workspace (user_id, data, updated_at)
    values (${userId}, ${data}, now())
    on conflict (user_id) do update set data = excluded.data, updated_at = now()
  `;
}
async function readTeacherProfile(sql, userId) {
	return (await sql`
    select display_name, place from teacher_profile where user_id = ${userId}
  `)[0] ?? {
		display_name: "",
		place: ""
	};
}
async function writeTeacherProfile(sql, userId, displayName, place) {
	await sql`
    insert into teacher_profile (user_id, display_name, place, updated_at)
    values (${userId}, ${displayName}, ${place}, now())
    on conflict (user_id) do update
      set display_name = excluded.display_name, place = excluded.place, updated_at = now()
  `;
}
//#endregion
export { readTeacherProfile, readWorkspaceJson, writeTeacherProfile, writeWorkspaceJson };
