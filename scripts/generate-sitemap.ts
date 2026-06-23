import { readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const subjectsDir = resolve(root, "src", "subjects");

const BASE_URL = process.env.SITE_URL || "https://pe.pablopl.dev";

interface SitemapEntry {
  loc: string;
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

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
  const urls: SitemapEntry[] = [];

  urls.push({ loc: "/", priority: 1.0, changefreq: "weekly" });

  const entries = readdirSync(subjectsDir, { withFileTypes: true });
  const subjectDirs = entries.filter(
    (e) => e.isDirectory() && e.name !== "_template",
  );

  for (const dir of subjectDirs) {
    const subjectId = dir.name;
    const metaPath = resolve(subjectsDir, subjectId, "meta.ts");

    const { meta } = await import(metaPath);

    urls.push({
      loc: `/${subjectId}`,
      priority: 0.9,
      changefreq: "weekly",
    });

    urls.push({
      loc: `/${subjectId}/practice`,
      priority: 0.7,
      changefreq: "monthly",
    });

    for (const topic of meta.topics) {
      urls.push({
        loc: `/${subjectId}/practice/${topic.key}`,
        priority: 0.6,
        changefreq: "monthly",
      });
    }

    for (const exam of meta.exams) {
      urls.push({
        loc: `/${subjectId}/exam/${exam.year}`,
        priority: 0.8,
        changefreq: "monthly",
      });
    }
  }

  const today = new Date().toISOString().split("T")[0];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (u) =>
        `  <url>\n` +
        `    <loc>${escapeXml(BASE_URL + u.loc)}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`,
    ),
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
