import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isIndexablePagePath } from "../src/seo/meta";
import { pages } from "../src/seo/pageMetaMap.generated";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist");
const indexPath = resolve(distDir, "index.html");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeJsonLd(value: string): string {
  return value.replace(/</g, "\\u003c");
}

function staticSeoTags(page: (typeof pages)[number]): string {
  const namedMeta = (id: string, name: string, content: string) =>
    `<meta id="${id}" name="${name}" content="${escapeHtml(content)}" />`;
  const propertyMeta = (id: string, property: string, content: string) =>
    `<meta id="${id}" property="${property}" content="${escapeHtml(content)}" />`;
  const link = (id: string, rel: string, href: string, extra = "") =>
    `<link id="${id}" rel="${rel}" href="${escapeHtml(href)}"${extra} />`;

  const alternates = page.alternates
    .map((alternate) => {
      const id =
        alternate.lang === "x-default"
          ? "link-hreflang-x-default"
          : `link-hreflang-${alternate.lang}`;
      return link(
        id,
        "alternate",
        alternate.href,
        ` hreflang="${alternate.lang}"`,
      );
    })
    .join("\n    ");

  return [
    propertyMeta("og:title", "og:title", page.title),
    propertyMeta("og:description", "og:description", page.description),
    propertyMeta("og:image", "og:image", page.ogImage),
    propertyMeta("og:image:type", "og:image:type", page.ogImageType),
    propertyMeta("og:image:width", "og:image:width", "1200"),
    propertyMeta("og:image:height", "og:image:height", "630"),
    propertyMeta("og:url", "og:url", page.canonicalUrl),
    propertyMeta("og:site_name", "og:site_name", page.siteName),
    propertyMeta("og:type", "og:type", "website"),
    propertyMeta("og:locale", "og:locale", page.locale),
    namedMeta("twitter:title", "twitter:title", page.title),
    namedMeta("twitter:description", "twitter:description", page.description),
    namedMeta("twitter:card", "twitter:card", "summary_large_image"),
    namedMeta("twitter:image", "twitter:image", page.ogImage),
    link("link-canonical", "canonical", page.canonicalUrl),
    alternates,
    `<script id="schema-jsonld" type="application/ld+json">${escapeJsonLd(page.jsonLd)}</script>`,
  ].join("\n    ");
}

function renderPage(baseHtml: string, page: (typeof pages)[number]): string {
  const html = baseHtml
    .replace(/<html lang="[^"]*"/, `<html lang="${page.lang}"`)
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(page.title)}</title>`,
    )
    .replace(
      /<meta\s+id="meta-description"[\s\S]*?\/>/,
      `<meta id="meta-description" name="description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<meta\s+id="meta-robots"[\s\S]*?\/>/,
      `<meta id="meta-robots" name="robots" content="index, follow" />`,
    )
    .replace(/<\/head>/, `    ${staticSeoTags(page)}\n  </head>`);

  return html;
}

function outputPath(page: (typeof pages)[number]): string {
  const path = page.pathWithoutLang === "/" ? "" : page.pathWithoutLang;
  return resolve(distDir, page.lang, path.slice(1), "index.html");
}

function main() {
  const baseHtml = readFileSync(indexPath, "utf-8");
  const indexablePages = pages.filter((page) =>
    isIndexablePagePath(page.pathWithoutLang),
  );

  for (const page of indexablePages) {
    const path = outputPath(page);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, renderPage(baseHtml, page), "utf-8");
  }

  console.log(
    `✓ Generated ${indexablePages.length} static SEO pages → ${distDir}`,
  );
}

main();
