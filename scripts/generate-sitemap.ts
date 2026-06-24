import { readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const subjectsDir = resolve(root, "src", "subjects");

const BASE_URL = process.env.SITE_URL || "https://pe.pablopl.dev";
const LANGS = ["en", "es", "gl"] as const;
const DEFAULT_LANG = "es";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface SitemapEntry {
  path: string;
  priority: number;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}

async function main() {
  const urls: SitemapEntry[] = [];

  urls.push({ path: "/", priority: 1.0, changefreq: "weekly" });

  const entries = readdirSync(subjectsDir, { withFileTypes: true });
  const subjectDirs = entries.filter(
    (e) => e.isDirectory() && e.name !== "_template",
  );

  for (const dir of subjectDirs) {
    const subjectId = dir.name;
    const metaPath = resolve(subjectsDir, subjectId, "meta.ts");

    const { meta } = await import(metaPath);

    urls.push({
      path: `/${subjectId}`,
      priority: 0.9,
      changefreq: "weekly",
    });

    for (const topic of meta.topics) {
      urls.push({
        path: `/${subjectId}/practice/${topic.key}`,
        priority: 0.6,
        changefreq: "monthly",
      });
    }

    for (const exam of meta.exams) {
      urls.push({
        path: `/${subjectId}/exam/${exam.year}`,
        priority: 0.8,
        changefreq: "monthly",
      });
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const xmlEntries: string[] = [];

  for (const url of urls) {
    const langUrls = LANGS.map((lang) => {
      const fullPath = url.path === "/" ? `/${lang}` : `/${lang}${url.path}`;
      return { lang, url: `${BASE_URL}${fullPath}` };
    });

    const defaultUrl = langUrls.find((u) => u.lang === DEFAULT_LANG)!.url;

    const altLinks = langUrls
      .map(
        (u) =>
          `    <xhtml:link rel="alternate" hreflang="${u.lang}" href="${escapeXml(u.url)}" />`,
      )
      .join("\n");

    const xDefaultLink = `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(defaultUrl)}" />`;

    const selfLink = `    <xhtml:link rel="alternate" hreflang="${DEFAULT_LANG}" href="${escapeXml(defaultUrl)}" />`;

    xmlEntries.push(
      `  <url>\n` +
        `    <loc>${escapeXml(defaultUrl)}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${url.changefreq}</changefreq>\n` +
        `    <priority>${url.priority}</priority>\n` +
        `${selfLink}\n` +
        `${altLinks}\n` +
        `${xDefaultLink}\n` +
        `  </url>`,
    );
  }

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
  console.log(`Generated sitemap with ${urls.length} URLs → ${outPath}`);
}

main().catch((err) => {
  console.error("Failed to generate sitemap:", err);
  process.exit(1);
});
