import { readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const subjectsDir = resolve(root, "src", "subjects");
const outPath = resolve(root, "public", "route-meta.js");

const BASE_URL = process.env.SITE_URL || "https://pe.pablopl.dev";
const LANGS = ["en", "es", "gl"] as const;

interface RouteEntry {
  title: string;
  description: string;
  canonical: string;
  hreflangs: Record<string, string>;
  jsonLd: object[];
}

function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pásame Exámenes",
    url: BASE_URL,
  };
}

function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildCourseSchema(name: string, url: string, provider: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    url,
    provider: {
      "@type": "Organization",
      name: provider,
    },
  };
}

async function main() {
  const routeMeta: Record<string, RouteEntry> = {};

  const { en } = await import("../src/i18n/en.ts");
  const { es } = await import("../src/i18n/es.ts");
  const { gl } = await import("../src/i18n/gl.ts");
  const translations = { en, es, gl };

  const homeTitles = {
    en: en.home.title,
    es: es.home.title,
    gl: gl.home.title,
  };

  const homeDescriptions = {
    en: en.seo.homeDescription,
    es: es.seo.homeDescription,
    gl: gl.seo.homeDescription,
  };

  const entries = readdirSync(subjectsDir, { withFileTypes: true });
  const subjectDirs = entries.filter(
    (e) => e.isDirectory() && e.name !== "_template",
  );

  const subjectData: {
    id: string;
    name: string;
    university: string;
    courseCode: string;
    topics: { key: string; label: string }[];
    exams: { year: string; title: string }[];
  }[] = [];

  for (const dir of subjectDirs) {
    const subjectId = dir.name;
    const { meta } = await import(
      resolve(subjectsDir, subjectId, "meta.ts")
    );
    subjectData.push({
      id: subjectId,
      name: meta.name,
      university: meta.university,
      courseCode: meta.courseCode,
      topics: meta.topics.map((t: { key: string; label: string }) => ({
        key: t.key,
        label: t.label,
      })),
      exams: meta.exams.map((e: { year: string; title: string }) => ({
        year: e.year,
        title: e.title,
      })),
    });
  }

  for (const lang of LANGS) {
    const t = translations[lang];
    const homePath = `/${lang}`;
    const homeUrl = `${BASE_URL}${homePath}`;

    routeMeta[homePath] = {
      title: homeTitles[lang],
      description: homeDescriptions[lang],
      canonical: homeUrl,
      hreflangs: Object.fromEntries(
        LANGS.filter((l) => l !== lang).map((l) => [l, `${BASE_URL}/${l}`]),
      ),
      jsonLd: [
        buildWebsiteSchema(),
        buildBreadcrumbSchema([{ name: homeTitles[lang], url: homeUrl }]),
      ],
    };

    for (const s of subjectData) {
      const subjectPath = `/${lang}/${s.id}`;
      const subjectUrl = `${BASE_URL}${subjectPath}`;
      const subjectTitle = `${s.name} — ${homeTitles[lang]}`;
      const subjectDesc = `${s.name} (${s.courseCode}) — ${t.subjectHome.description
        .replace(/\{count\}/g, "")
        .replace(/\{repeated\}/g, "")
        .replace(/\{exams\}/g, "")
        .replace(/`/g, "")
        .trim()} — ${s.university}`;
      const subjectDescClean =
        subjectDesc.length > 3 ? subjectDesc : `${s.name} — ${s.university}`;

      routeMeta[subjectPath] = {
        title: subjectTitle,
        description: subjectDescClean,
        canonical: subjectUrl,
        hreflangs: Object.fromEntries(
          LANGS.filter((l) => l !== lang).map((l) => [
            l,
            `${BASE_URL}/${l}/${s.id}`,
          ]),
        ),
        jsonLd: [
          buildWebsiteSchema(),
          buildBreadcrumbSchema([
            { name: homeTitles[lang], url: homeUrl },
            { name: s.name, url: subjectUrl },
          ]),
          buildCourseSchema(s.name, subjectUrl, s.university),
        ],
      };

      for (const topic of s.topics) {
        const topicPath = `/${lang}/${s.id}/practice/${topic.key}`;
        const topicUrl = `${BASE_URL}${topicPath}`;
        routeMeta[topicPath] = {
          title: `${topic.label} — ${s.name}`,
          description: `${topic.label} — ${s.name} (${s.courseCode})`,
          canonical: topicUrl,
          hreflangs: Object.fromEntries(
            LANGS.filter((l) => l !== lang).map((l) => [
              l,
              `${BASE_URL}/${l}/${s.id}/practice/${topic.key}`,
            ]),
          ),
          jsonLd: [
            buildWebsiteSchema(),
            buildBreadcrumbSchema([
              { name: homeTitles[lang], url: homeUrl },
              { name: s.name, url: subjectUrl },
              { name: topic.label, url: topicUrl },
            ]),
          ],
        };
      }

      for (const exam of s.exams) {
        const examPath = `/${lang}/${s.id}/exam/${exam.year}`;
        const examUrl = `${BASE_URL}${examPath}`;
        routeMeta[examPath] = {
          title: `${exam.title} — ${s.name}`,
          description: `${exam.title} — ${s.name} (${s.courseCode})`,
          canonical: examUrl,
          hreflangs: Object.fromEntries(
            LANGS.filter((l) => l !== lang).map((l) => [
              l,
              `${BASE_URL}/${l}/${s.id}/exam/${exam.year}`,
            ]),
          ),
          jsonLd: [
            buildWebsiteSchema(),
            buildBreadcrumbSchema([
              { name: homeTitles[lang], url: homeUrl },
              { name: s.name, url: subjectUrl },
              { name: exam.title, url: examUrl },
            ]),
          ],
        };
      }
    }
  }

  const js = `window.__ROUTE_META__ = ${JSON.stringify(routeMeta)};\n`;
  writeFileSync(outPath, js, "utf-8");
  console.log(
    `Generated route metadata with ${Object.keys(routeMeta).length} entries → ${outPath}`,
  );
}

main().catch((err) => {
  console.error("Failed to generate route metadata:", err);
  process.exit(1);
});
