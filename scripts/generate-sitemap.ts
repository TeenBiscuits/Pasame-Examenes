import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_LANG } from "../src/seo/meta";
import { pages } from "../src/seo/pageMetaMap.generated";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const BASE_URL = process.env.SITE_URL || "https://pe.pablopl.dev";

function withSitemapBase(url: string): string {
  return url.replace("https://pe.pablopl.dev", BASE_URL);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function priorityForPath(pathWithoutLang: string): number {
  if (pathWithoutLang === "/") return 1;
  if (pathWithoutLang.includes("/exam/")) return 0.8;
  if (pathWithoutLang.includes("/practice/")) return 0.6;
  return 0.9;
}

function changefreqForPath(pathWithoutLang: string) {
  if (pathWithoutLang === "/") return "weekly";
  if (
    pathWithoutLang.includes("/exam/") ||
    pathWithoutLang.includes("/practice/")
  ) {
    return "monthly";
  }
  return "weekly";
}

async function main() {
  const today = new Date().toISOString().split("T")[0];
  const defaultPages = pages.filter((page) => page.lang === DEFAULT_LANG);

  const xmlEntries = defaultPages.map((page) => {
    const alternates = page.alternates
      .map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${escapeXml(withSitemapBase(alternate.href))}" />`,
      )
      .join("\n");

    return (
      `  <url>\n` +
      `    <loc>${escapeXml(withSitemapBase(page.canonicalUrl))}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${changefreqForPath(page.pathWithoutLang)}</changefreq>\n` +
      `    <priority>${priorityForPath(page.pathWithoutLang)}</priority>\n` +
      `${alternates}\n` +
      `  </url>`
    );
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...xmlEntries,
    "</urlset>",
    "",
  ].join("\n");

  const outPath = resolve(root, "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");
  console.log(
    `Generated sitemap with ${defaultPages.length} URLs → ${outPath}`,
  );
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
