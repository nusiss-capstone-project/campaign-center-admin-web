import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else if (entry.isFile() && path.endsWith(".ts")) files.push(path);
  }
  return files;
}

const targets = [
  join(root, "src/lib/api"),
  join(root, "src/lib/reward-api"),
  join(root, "src/lib/usergroup-api"),
];

let changed = 0;
for (const target of targets) {
  for (const file of walk(target)) {
    const before = readFileSync(file, "utf8");
    const after = before.replace(/^\/\* eslint-disable \*\/\n/gm, "");
    if (after !== before) {
      writeFileSync(file, after);
      changed += 1;
    }
  }
}

console.log(`Removed bare /* eslint-disable */ from ${changed} generated files.`);
