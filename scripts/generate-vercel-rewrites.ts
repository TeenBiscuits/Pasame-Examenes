import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const templatePath = resolve(root, "vercel.template.json");
const outputPath = resolve(root, "vercel.json");

function main() {
  const rewrites = [{ source: "/(.*)", destination: "/index.html" }];

  const template = readFileSync(templatePath, "utf-8");
  const rewritesJson = JSON.stringify(rewrites, null, 4);
  const output = template.split("__REWRITES__").join(rewritesJson);

  writeFileSync(outputPath, output);
  console.log("✓ Generated vercel.json with the TanStack Router SPA fallback");
}

main();
