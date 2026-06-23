import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const key = process.env.INDEXNOW_KEY;

if (!key) {
  console.log("INDEXNOW_KEY not set — skipping indexnow key file generation");
  process.exit(0);
}

const outPath = resolve(root, "public", `${key}.txt`);
writeFileSync(outPath, key, "utf-8");
console.log(`Created indexnow key file → ${outPath}`);
