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

interface Translations {
  seo: {
    siteName: string;
    locale: string;
    homeDescription: string;
    defaultDescription: string;
  };
  subjectHome: {
    description: string;
  };
}

const LANGS = { en: "en_US", es: "es_ES", gl: "gl_ES" } as const;
type Lang = keyof typeof LANGS;

function htmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

function buildSubjectDescription(
  t: Translations,
  meta: SubjectMeta,
): string {
  const desc = t.subjectHome.description
    .replace("{count}", String(meta.questionCount))
    .replace("{repeated}", "")
    .replace("{exams}", String(meta.examCount))
    .replace(/`/g, "");
  return `${meta.name} (${meta.courseCode}) \u2014 ${desc} \u2014 ${meta.university}`;
}

async function main() {
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

  const i18nDir = resolve(root, "src", "i18n");
  const translations: Record<Lang, Translations> = {
    en: ((await import(resolve(i18nDir, "en.ts"))) as { en: Translations }).en,
    es: ((await import(resolve(i18nDir, "es.ts"))) as { es: Translations }).es,
    gl: ((await import(resolve(i18nDir, "gl.ts"))) as { gl: Translations }).gl,
  };

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

  for (const lang of Object.keys(LANGS) as Lang[]) {
    const t = translations[lang];
    const locale = LANGS[lang];

    mkdirSync(resolve(outDir, lang), { recursive: true });

    for (const subjectId of knownIds) {
      const meta = subjectsMeta[subjectId];
      if (!meta) continue;

      const imagePath = `/og/${subjectId}.png`;
      const title = `${meta.name} \u2014 Pasame Ex\u00e1menes`;
      const description = buildSubjectDescription(t, meta);
      const ogUrl = `https://pe.pablopl.dev/${lang}/${subjectId}`;

      let html = baseHtml;

      html = html.replace(/<title>.*?<\/title>/, `<title>${htmlEscape(title)}</title>`);

      html = html.replace(
        /<meta id="og:image".*?\/?>/g,
        `<meta id="og:image" property="og:image" content="${imagePath}" />`,
      );
      html = html.replace(
        /<meta id="og:image:type".*?\/?>/g,
        `<meta id="og:image:type" property="og:image:type" content="image/png" />`,
      );
      html = html.replace(
        /<meta id="twitter:image".*?\/?>/g,
        `<meta id="twitter:image" name="twitter:image" content="${imagePath}" />`,
      );

      html = replaceMetaContent(html, "og:title", title);
      html = replaceMetaContent(html, "og:description", description);
      html = replaceMetaContent(html, "og:url", ogUrl);
      html = replaceMetaContent(html, "og:locale", locale);
      html = replaceMetaContent(html, "twitter:title", title);
      html = replaceMetaContent(html, "twitter:description", description);
      html = replaceMetaContent(html, "meta-description", description);

      const outPath = resolve(outDir, lang, `${subjectId}.html`);
      writeFileSync(outPath, html);
      generated++;
    }

    const homeTitle = "Pásame Exámenes";
    const homeDescription = t.seo.homeDescription;
    const homeMetaDesc = t.seo.defaultDescription;
    const homeUrl = `https://pe.pablopl.dev/${lang}`;

    let homeHtml = baseHtml;

    homeHtml = homeHtml.replace(
      /<title>.*?<\/title>/,
      `<title>${htmlEscape(homeTitle)}</title>`,
    );

    homeHtml = replaceMetaContent(homeHtml, "og:title", homeTitle);
    homeHtml = replaceMetaContent(homeHtml, "og:description", homeDescription);
    homeHtml = replaceMetaContent(homeHtml, "og:url", homeUrl);
    homeHtml = replaceMetaContent(homeHtml, "og:locale", locale);
    homeHtml = replaceMetaContent(homeHtml, "twitter:title", homeTitle);
    homeHtml = replaceMetaContent(homeHtml, "twitter:description", homeDescription);
    homeHtml = replaceMetaContent(homeHtml, "meta-description", homeMetaDesc);

    const homePath = resolve(outDir, lang, "home.html");
    writeFileSync(homePath, homeHtml);
    generated++;
    console.log(`  ✓ ${lang}/home.html`);
  }

  console.log(`\nGenerated ${generated} subject+home pages → ${outDir}`);
}

main().catch((err) => {
  console.error("Failed to generate subject pages:", err);
  process.exit(1);
});
