import type { Metadata } from "next";
import { en } from "../i18n/en";
import { es } from "../i18n/es";
import { gl } from "../i18n/gl";
import type { Lang } from "../i18n/context";
import { getQuestionCount, getSubject, subjects } from "../subjects";

const BASE_URL = process.env.SITE_URL || "https://pe.pablopl.dev";
const LANGS: Lang[] = ["en", "es", "gl"];
const translations = { en, es, gl };
const locales: Record<Lang, string> = {
  en: "en_US",
  es: "es_ES",
  gl: "gl_ES",
};

export function isLang(lang: string): lang is Lang {
  return lang === "en" || lang === "es" || lang === "gl";
}

function pathFor(lang: Lang, slug: string[]) {
  return slug.length === 0 ? `/${lang}` : `/${lang}/${slug.join("/")}`;
}

function subjectDescription(lang: Lang, subjectId: string) {
  const subject = getSubject(subjectId);
  const t = translations[lang];
  if (!subject) return t.seo.defaultDescription;
  const desc = t.subjectHome.description
    .replace("{count}", String(getQuestionCount(subject.id)))
    .replace("{repeated}", "")
    .replace("{exams}", String(subject.exams.length))
    .replace(/`/g, "");
  return `${subject.name} (${subject.courseCode}) — ${desc} — ${subject.university}`;
}

function notFoundMetadata(lang: Lang): Metadata {
  const t = translations[lang];
  const url = `${BASE_URL}/${lang}/404`;
  return {
    title: `404 — ${t.home.title}`,
    description: t.seo.defaultDescription,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LANGS.map((alternateLang) => [
          alternateLang,
          `${BASE_URL}/${alternateLang}/404`,
        ]),
      ),
    },
    openGraph: {
      title: `404 — ${t.home.title}`,
      description: t.seo.defaultDescription,
      url,
      siteName: t.seo.siteName,
      type: "website",
      locale: locales[lang],
      images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `404 — ${t.home.title}`,
      description: t.seo.defaultDescription,
      images: ["/og.jpg"],
    },
  };
}

export function getRouteMetadata(lang: Lang, slug: string[]): Metadata {
  if (slug[0] === "404") return notFoundMetadata(lang);

  const t = translations[lang];
  const [subjectId, section, value] = slug;
  const subject = subjectId ? getSubject(subjectId) : undefined;
  let title = t.home.title;
  let description = slug.length === 0 ? t.seo.homeDescription : t.seo.defaultDescription;
  let image = "/og.jpg";

  if (subject) {
    image = `/og/${subject.id}.png`;
    title = `${subject.name} — ${t.home.title}`;
    description = subjectDescription(lang, subject.id);

    if (section === "practice" && value) {
      const topic = subject.topics.find((topic) => topic.key === value);
      if (topic) {
        title = `${topic.label} — ${subject.name}`;
        description = `${topic.label} — ${subject.name} (${subject.courseCode})`;
      }
    }

    if (section === "exam" && value) {
      const exam = subject.exams.find((exam) => exam.year === value);
      if (exam) {
        title = `${exam.title} — ${subject.name}`;
        description = `${exam.title} — ${subject.name} (${subject.courseCode})`;
      }
    }
  }

  const pathname = pathFor(lang, slug);
  const url = `${BASE_URL}${pathname}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        LANGS.map((alternateLang) => [alternateLang, `${BASE_URL}${pathFor(alternateLang, slug)}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: t.seo.siteName,
      type: "website",
      locale: locales[lang],
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function getStaticRouteParams() {
  const slugs: string[][] = [[], ["404"]];
  for (const subject of subjects) {
    slugs.push([subject.id], [subject.id, "practice"], [subject.id, "exam"]);
    for (const topic of subject.topics) {
      slugs.push([subject.id, "practice", topic.key]);
    }
    for (const exam of subject.exams) {
      slugs.push([subject.id, "exam", exam.year]);
    }
  }
  const localizedRoutes = LANGS.flatMap((lang) =>
    slugs.map((slug) => ({ lang, slug })),
  );
  const legacyRoutes = subjects.flatMap((subject) => {
    const subjectRoutes = [
      { lang: subject.id, slug: [] as string[] },
      { lang: subject.id, slug: ["practice"] },
      { lang: subject.id, slug: ["exam"] },
    ];
    for (const topic of subject.topics) {
      subjectRoutes.push({ lang: subject.id, slug: ["practice", topic.key] });
    }
    for (const exam of subject.exams) {
      subjectRoutes.push({ lang: subject.id, slug: ["exam", exam.year] });
    }
    return subjectRoutes;
  });
  return [...localizedRoutes, ...legacyRoutes];
}
