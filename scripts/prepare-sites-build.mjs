#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
const workerText = (await import('node:fs/promises')).readFile;
let built = await workerText(worker,'utf8');
built = built.replace("'../server/api.js'", "'./api.js'");
(await import('node:fs')).writeFileSync(path.join(dist,'server','index.js'), built);
copyFileSync(path.join(root,'server','api.js'),path.join(dist,'server','api.js'));
cpSync(path.join(root,'.openai','drizzle'),path.join(dist,'.openai','drizzle'),{recursive:true});
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

console.log("Prepared Sites build: dist/server/index.js and dist/.openai/hosting.json");
