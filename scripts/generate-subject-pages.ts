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

function replaceMeta(html: string, id: string, content: string): string {
  const regex = new RegExp(
    `<meta\\s+id="${id}"[^>]*?content="[^"]*"[^>]*?/?>`,
    "g",
  );
  return html.replace(regex, (match) =>
    match.replace(/\bcontent="[^"]*"/, `content="${content}"`),
  );
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
    const ogUrl = `https://pe.pablopl.dev/es/${subjectId}`;

    let html = baseHtml;

    html = html.replace(
      /<title>.*?<\/title>/,
      `<title>${title}</title>`,
    );

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

    html = replaceMeta(html, "og:title", title);
    html = replaceMeta(html, "og:description", description);
    html = replaceMeta(html, "og:url", ogUrl);
    html = replaceMeta(html, "twitter:title", title);
    html = replaceMeta(html, "twitter:description", description);
    html = replaceMeta(html, "meta-description", description);

    const outPath = resolve(outDir, `${subjectId}.html`);
    writeFileSync(outPath, html);
    console.log(`  ✓ ${subjectId}.html (${meta.name})`);
    generated++;
  }

  console.log(`\nGenerated ${generated} subject pages → ${outDir}`);
}

main();
