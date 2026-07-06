import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pages } from "../src/seo/pageMetaMap.generated";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const templatePath = resolve(root, "vercel.template.json");
const outputPath = resolve(root, "vercel.json");

function main() {
  const rewrites = [
    ...pages.map((page) => ({
      source: page.canonicalUrl.replaceAll("https://pe.pablopl.dev", ""),
      destination: `/${page.url}`,
    })),
    { source: "/en/(.*)", destination: "/index.html" },
    { source: "/es/(.*)", destination: "/index.html" },
    { source: "/gl/(.*)", destination: "/index.html" },
    { source: "/(.*)", destination: "/index.html" },
  ];

  const template = readFileSync(templatePath, "utf-8");
  const rewritesJson = JSON.stringify(rewrites, null, 4);
  const output = template.replace("__REWRITES__", rewritesJson);

  writeFileSync(outputPath, output);
  console.log(
    `✓ Generated vercel.json with ${pages.length} static SEO rewrites`,
  );
}

main();
