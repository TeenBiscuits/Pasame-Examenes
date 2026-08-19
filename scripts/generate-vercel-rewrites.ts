import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_LANG,
  buildCanonicalPath,
  isIndexablePagePath,
} from "../src/seo/meta";
import { pages } from "../src/seo/pageMetaMap.generated";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const templatePath = resolve(root, "vercel.template.json");
const outputPath = resolve(root, "vercel.json");

function main() {
  const staticSeoRewrites = pages
    .filter((page) => isIndexablePagePath(page.pathWithoutLang))
    .flatMap((page) => {
      const source = buildCanonicalPath(page.lang, page.pathWithoutLang);
      return [
        { source, destination: `${source}/index.html` },
        { source: `${source}/`, destination: `${source}/index.html` },
      ];
    });
  const rewrites = [
    { source: "/", destination: `/${DEFAULT_LANG}/index.html` },
    ...staticSeoRewrites,
    { source: "/(.*)", destination: "/_spa-fallback.html" },
  ];

  const template = readFileSync(templatePath, "utf-8");
  const rewritesJson = JSON.stringify(rewrites, null, 4);
  const output = template.split("__REWRITES__").join(rewritesJson);

  writeFileSync(outputPath, output);
  console.log("✓ Generated vercel.json with the TanStack Router SPA fallback");
}

main();
