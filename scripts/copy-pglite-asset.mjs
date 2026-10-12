#!/usr/bin/env node
/**
 * Nitro bundles PGLite's JS away from the files it reads beside itself
 * (`pglite.data`, `pglite.wasm`, `initdb.wasm`). Copy them next to the server
 * bundle so the embedded fallback can start when DATABASE_URL is unset.
 * With Neon, that path is not used.
 */
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "node_modules/@electric-sql/pglite/dist");
const to = join(root, ".vercel/output/functions/__server.func/_libs");
const files = ["pglite.data", "pglite.wasm", "initdb.wasm"];

if (!existsSync(to)) {
  console.log("[pglite] asset copy skipped");
  process.exit(0);
}

for (const name of files) {
  const src = join(from, name);
  if (!existsSync(src)) {
    console.error(`[pglite] missing ${src}`);
    process.exit(1);
  }
  copyFileSync(src, join(to, name));
}

console.log("[pglite] copied data and wasm next to the server bundle");
