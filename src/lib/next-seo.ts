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

export function getRouteMetadata(lang: Lang, slug: string[]): Metadata {
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
  const slugs: string[][] = [[]];
  for (const subject of subjects) {
    slugs.push([subject.id]);
    for (const topic of subject.topics) {
      slugs.push([subject.id, "practice", topic.key]);
    }
    for (const exam of subject.exams) {
      slugs.push([subject.id, "exam", exam.year]);
    }
  }
  return LANGS.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}
