import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../dist/server/entry-server.js";
import { BASE_URL } from "../src/seo/meta";
import { pages } from "../src/seo/pageMetaMap.generated";
import type { PrerenderData } from "../src/lib/prerender-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist");
const indexHtmlPath = resolve(distDir, "index.html");

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Escape JSON for safe embedding inside <script type="application/json">:
// only `<` (and `>`) can terminate the script element, so escape both.
function jsonScriptEscape(s: string): string {
  return s.replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}

function replaceMetaContent(html: string, id: string, content: string): string {
  const regex = new RegExp(
    `<meta\\s+id="${id}"[^>]*?content="[^"]*"[^>]*?/?>`,
    "g",
  );
  return html.replace(regex, (match) =>
    match.replace(/\bcontent="[^"]*"/, `content="${htmlEscape(content)}"`),
  );
}

function replaceTag(
  html: string,
  id: string,
  tag: string,
  attrs: string,
  content: string,
): string {
  // Replace an existing tag by id, or no-op if not present.
  const regex = new RegExp(
    `<${tag}\\s+id="${id}"[^>]*>[\\s\\S]*?</${tag}>`,
    "g",
  );
  return html.replace(
    regex,
    `<${tag} id="${id}"${attrs}>${content}</${tag}>`,
  );
}

function injectBeforeHeadClose(html: string, snippet: string): string {
  return html.replace("</head>", `${snippet}\n  </head>`);
}

function buildHeadSnippets(page: (typeof pages)[number]): string {
  const canonical = `<link id="link-canonical" rel="canonical" href="${htmlEscape(page.canonicalUrl)}" />`;
  const hreflang = page.alternates
    .map(
      (alt) =>
        `<link id="link-hreflang-${alt.lang}" rel="alternate" hreflang="${alt.lang}" href="${htmlEscape(alt.href)}" />`,
    )
    .join("\n    ");
  const jsonLd = `<script type="application/ld+json" id="schema-jsonld">${jsonScriptEscape(
    page.jsonLd,
  )}</script>`;
  return `    ${canonical}\n    ${hreflang}\n    ${jsonLd}`;
}

function applyPage(
  baseHtml: string,
  page: (typeof pages)[number],
  bodyHtml: string,
  preloadData: PrerenderData | null,
): string {
  let html = baseHtml;

  // <html lang>
  html = html.replace(/<html(?!\s+lang)/, `<html lang="${page.lang}"`);

  // <title>
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${htmlEscape(page.title)}</title>`,
  );

  // Replace existing meta tags by id (base index.html ships these defaults).
  html = replaceMetaContent(html, "meta-description", page.description);
  html = replaceMetaContent(html, "og:title", page.title);
  html = replaceMetaContent(html, "og:description", page.description);
  html = replaceMetaContent(html, "og:image", page.ogImage);
  html = replaceMetaContent(html, "og:image:type", page.ogImageType);
  html = replaceMetaContent(html, "og:url", page.canonicalUrl);
  html = replaceMetaContent(html, "og:locale", page.locale);
  html = replaceMetaContent(html, "twitter:title", page.title);
  html = replaceMetaContent(html, "twitter:description", page.description);
  html = replaceMetaContent(html, "twitter:image", page.ogImage);

  // Inject canonical / hreflang / JSON-LD (absent from the base index.html).
  html = injectBeforeHeadClose(html, buildHeadSnippets(page));

  // Body: render the app into #root and embed the build-time-seeded question
  // data so the first client render matches (no loading flash).
  const dataScript = preloadData
    ? `<script type="application/json" id="__PRERENDER_DATA__">${jsonScriptEscape(
        JSON.stringify(preloadData),
      )}</script>`
    : "";
  html = html.replace(
    /<div id="root"[^>]*><\/div>/,
    `<div id="root">${bodyHtml}</div>\n    ${dataScript}`,
  );

  return html;
}

async function main() {
  if (!existsSync(indexHtmlPath)) {
    console.error("dist/index.html not found — run `vite build` first");
    process.exit(1);
  }
  if (!existsSync(resolve(distDir, "server", "entry-server.js"))) {
    console.error(
      "dist/server/entry-server.js not found — run `vite build --ssr` first",
    );
    process.exit(1);
  }

  const baseHtml = readFileSync(indexHtmlPath, "utf-8");
  let written = 0;
  let failed = 0;

  for (const page of pages) {
    const path = page.canonicalUrl.slice(BASE_URL.length) || "/";
    try {
      const { bodyHtml, preloadData } = await render({
        path,
        lang: page.lang,
      });
      const outHtml = applyPage(baseHtml, page, bodyHtml, preloadData);
      const outPath = resolve(distDir, page.url);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, outHtml);
      written++;
    } catch (err) {
      failed++;
      console.error(`✗ ${page.url} (${path}):`, err);
    }
  }

  console.log(
    `\nPrerendered ${written} pages (${failed} failed) → ${distDir}/seo/`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
