import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const __dirname = dirname(new URL(import.meta.url).pathname);
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist");
const indexHtmlPath = resolve(distDir, "index.html");
const metaJsonPath = resolve(distDir, "subjects-meta.json");
const outDir = resolve(distDir, "og-pages");

interface SubjectMeta {
  name: string;
  icon: string;
  questionCount: number;
  topicCount: number;
  examCount: number;
  university: string;
  courseCode: string;
}

function main() {
  if (!existsSync(indexHtmlPath)) {
    console.error("dist/index.html not found — run vite build first");
    process.exit(1);
  }

  const subjectsMeta: Record<string, SubjectMeta> = existsSync(metaJsonPath)
    ? JSON.parse(readFileSync(metaJsonPath, "utf-8"))
    : {};

  if (Object.keys(subjectsMeta).length === 0) {
    console.error("No subjects found in dist/subjects-meta.json");
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  const baseHtml = readFileSync(indexHtmlPath, "utf-8");

  // Also discover subjects from dist/og/ PNG files (in case JSON is stale)
  const ogDir = resolve(distDir, "og");
  const knownIds = new Set<string>();
  if (existsSync(ogDir)) {
    for (const f of readdirSync(ogDir)) {
      const m = f.match(/^(.+)\.png$/);
      if (m) knownIds.add(m[1]);
    }
  }

  let generated = 0;

  for (const subjectId of knownIds) {
    const meta = subjectsMeta[subjectId];
    if (!meta) continue;

    const ogImagePath = `/og/${subjectId}.png`;
    const title = `${meta.name} \u2014 Pasame Ex\u00e1menes`;
    const description = `${meta.name} (${meta.courseCode}): ${meta.questionCount} preguntas en ${meta.topicCount} temas con ${meta.examCount} ex\u00e1menes \u2014 ${meta.university}`;

    let html = baseHtml;

    html = html.replace(
      /<meta id="og:image".*?\/?>/g,
      `<meta id="og:image" property="og:image" content="${ogImagePath}" />`,
    );
    html = html.replace(
      /<meta id="og:image:type".*?\/?>/g,
      `<meta id="og:image:type" property="og:image:type" content="image/png" />`,
    );
    html = html.replace(
      /<meta id="twitter:image".*?\/?>/g,
      `<meta id="twitter:image" name="twitter:image" content="${ogImagePath}" />`,
    );

    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${title}</title>`,
    );

    const ogBlock = [
      `<meta id="og:title" property="og:title" content="${title}" />`,
      `<meta id="og:description" property="og:description" content="${description}" />`,
      `<meta id="twitter:title" name="twitter:title" content="${title}" />`,
      `<meta id="twitter:description" name="twitter:description" content="${description}" />`,
      `<meta id="twitter:card" name="twitter:card" content="summary_large_image" />`,
    ].join("\n    ");

    html = html.replace(
      '<meta id="og:image:height"',
      `${ogBlock}\n    <meta id="og:image:height"`,
    );

    const outPath = resolve(outDir, `${subjectId}.html`);
    writeFileSync(outPath, html);
    console.log(`  ✓ ${subjectId}.html (${meta.name})`);
    generated++;
  }

  console.log(`\nGenerated ${generated} subject pages → ${outDir}`);
}

main();
