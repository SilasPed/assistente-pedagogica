import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import type { Sql } from "../db.ts";
import { legacyStateFromJson, pedDataFromUnknown, pedHasRows, emptyPedData } from "./workspace.ts";
import { hasLocalOrigin } from "./test-publication.ts";
import {
  readTeacherProfile,
  readWorkspaceJson,
  writeTeacherProfile,
  writeWorkspaceJson,
} from "./workspace-store.ts";

function asSql(pg: PGlite): Sql {
  const sql = (async <T = Record<string, unknown>>(strings: TemplateStringsArray, ...values: unknown[]) => {
    let text = strings[0] ?? "";
    for (let index = 0; index < values.length; index += 1) text += `$${index + 1}${strings[index + 1] ?? ""}`;
    const result = await pg.query<T>(text, values);
    return result.rows;
  }) as Sql;
  sql.query = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) => {
    const result = await pg.query<T>(text, params);
    return result.rows;
  };
  return sql;
}

describe("cópia antiga do navegador", () => {
  it("aceita o envelope do zustand e rejeita lixo", () => {
    const wrapped = legacyStateFromJson(
      JSON.stringify({ state: { classes: [], students: [{ id: "s", classId: "c", name: "Rita", origin: "local" }] } }),
    );
    assert.ok(wrapped);
    assert.equal(wrapped.students[0]?.name, "Rita");
    assert.equal(pedHasRows(wrapped), true);
    assert.equal(legacyStateFromJson("{"), null);
    assert.equal(pedDataFromUnknown({}), null);
    const empty = pedDataFromUnknown({
      classes: [],
      students: [],
      observations: [],
      grades: [],
      attendance: [],
      exams: [],
      pendings: [],
    });
    assert.ok(empty);
    assert.equal(pedHasRows(empty), false);
    assert.equal(hasLocalOrigin(emptyPedData()), false);
    assert.equal(wrapped !== null && hasLocalOrigin(wrapped), true);
  });
});

describe("isolamento do parecer no postgres embutido", () => {
  it("não devolve o documento de outro professor", async () => {
    const pg = new PGlite();
    await pg.waitReady;
    await pg.exec(await readFile(new URL("../../../migrations/0002_pedagogico.sql", import.meta.url), "utf8"));
    const sql = asSql(pg);
    await writeWorkspaceJson(sql, "prof-a", '{"classes":[{"id":"a"}]}');
    await writeWorkspaceJson(sql, "prof-b", '{"classes":[{"id":"b"}]}');
    await writeTeacherProfile(sql, "prof-a", "Helena", "João Pessoa");
    await writeTeacherProfile(sql, "prof-b", "Paulo", "Campina Grande");
    assert.equal(await readWorkspaceJson(sql, "prof-a"), '{"classes":[{"id":"a"}]}');
    assert.equal(await readWorkspaceJson(sql, "prof-b"), '{"classes":[{"id":"b"}]}');
    assert.equal(await readWorkspaceJson(sql, "prof-c"), null);
    const profile = await readTeacherProfile(sql, "prof-a");
    assert.equal(profile.display_name, "Helena");
    assert.equal(profile.place, "João Pessoa");
    assert.deepEqual(await readTeacherProfile(sql, "prof-c"), { display_name: "", place: "" });
    await pg.close();
  });
});
