import type { SubjectMeta, Topic, Exam } from "../data/types";
import { en } from "../i18n/en";
import { es } from "../i18n/es";
import { gl } from "../i18n/gl";
import type { Lang } from "../i18n/context";
import { hasAuthorizedExamContent } from "../lib/content-policy";

export const BASE_URL = "https://pe.pablopl.dev";
export const LANGS = ["en", "es", "gl"] as const;
export const DEFAULT_LANG: Lang = "es";
export const BUNDLE_ENTRY_POINT = "/src/main.tsx";
export const SITEMAP_LASTMOD = {
  global: "2026-07-25",
  home: "2026-07-25",
} as const;

export const langMeta: Record<
  Lang,
  { locale: string; hreflang: string; alternateLocales: Lang[] }
> = {
  en: { locale: "en_US", hreflang: "en", alternateLocales: ["es", "gl"] },
  es: { locale: "es_ES", hreflang: "es", alternateLocales: ["en", "gl"] },
  gl: { locale: "gl_ES", hreflang: "gl", alternateLocales: ["en", "es"] },
};

export interface PageMetaData {
  url: string;
  bundleEntryPoint: string;
  lang: Lang;
  pathWithoutLang: string;
  title: string;
  description: string;
  siteName: string;
  canonicalUrl: string;
  ogImage: string;
  ogImageType: string;
  locale: string;
  lastmod: string;
  alternates: { lang: Lang | "x-default"; href: string }[];
  jsonLd: string;
}

export interface SubjectStats {
  questionCount?: number;
  topicQuestionCounts?: Record<string, number>;
  examQuestionCounts?: Record<string, number>;
  examTotalPoints?: Record<string, number>;
}

const translations = { en, es, gl } as const;

function t(lang: Lang) {
  return translations[lang];
}

export function buildCanonicalPath(
  lang: Lang,
  pathWithoutLang: string,
): string {
  const base =
    pathWithoutLang === "/"
      ? ""
      : pathWithoutLang
          .split("/")
          .map((segment) => (segment ? encodeURIComponent(segment) : segment))
          .join("/");
  return `/${lang}${base}`;
}

function appendBrand(title: string, siteName: string): string {
  const branded = `${title} | ${siteName}`;
  return branded.length <= 62 ? branded : title;
}

function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    String(values[key] ?? ""),
  );
}

function ogImageForSubject(subject?: SubjectMeta): string {
  return subject ? `/og/${subject.id}.png` : "/og.jpg";
}

function imageType(imageUrl: string): string {
  return imageUrl.endsWith(".png") ? "image/png" : "image/jpeg";
}

function fullUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

function alternates(pathWithoutLang: string) {
  const byLang = LANGS.map((l) => ({
    lang: l,
    href: fullUrl(buildCanonicalPath(l, pathWithoutLang)),
  }));
  return [
    ...byLang,
    {
      lang: "x-default" as const,
      href: fullUrl(buildCanonicalPath(DEFAULT_LANG, pathWithoutLang)),
    },
  ];
}

function breadcrumbJsonLd(
  lang: Lang,
  pathWithoutLang: string,
  items: { name: string; pathWithoutLang: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: fullUrl(buildCanonicalPath(lang, item.pathWithoutLang)),
    })),
    url: fullUrl(buildCanonicalPath(lang, pathWithoutLang)),
  };
}

function makePageMeta(
  lang: Lang,
  pathWithoutLang: string,
  title: string,
  description: string,
  ogImage: string,
  graph: unknown[],
  lastmod: string = SITEMAP_LASTMOD.global,
): PageMetaData {
  const meta = langMeta[lang];
  const canonicalUrl = fullUrl(buildCanonicalPath(lang, pathWithoutLang));
  return {
    url: `seo${buildCanonicalPath(lang, pathWithoutLang)}.html`,
    bundleEntryPoint: BUNDLE_ENTRY_POINT,
    lang,
    pathWithoutLang,
    title,
    description,
    siteName: t(lang).seo.siteName,
    canonicalUrl,
    ogImage: fullUrl(ogImage),
    ogImageType: imageType(ogImage),
    locale: meta.locale,
    lastmod:
      lastmod > SITEMAP_LASTMOD.global ? lastmod : SITEMAP_LASTMOD.global,
    alternates: alternates(pathWithoutLang),
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    }),
  };
}

export function buildHomeMeta(lang: Lang): PageMetaData {
  const tr = t(lang);
  const title = appendBrand(tr.seo.homeTitle, tr.seo.siteName);
  const description = tr.seo.homeMetaDescription;
  const canonicalUrl = fullUrl(buildCanonicalPath(lang, "/"));

  return makePageMeta(
    lang,
    "/",
    title,
    description,
    "/og.jpg",
    [
      {
        "@type": "WebSite",
        name: tr.seo.siteName,
        url: canonicalUrl,
        inLanguage: langMeta[lang].hreflang,
        description,
      },
      {
        "@type": "WebPage",
        name: title,
        url: canonicalUrl,
        inLanguage: langMeta[lang].hreflang,
        description,
      },
    ],
    SITEMAP_LASTMOD.home,
  );
}

export function buildSubjectMeta(
  lang: Lang,
  subject: SubjectMeta,
  stats: SubjectStats = {},
): PageMetaData {
  const tr = t(lang);
  const pathWithoutLang = `/${subject.id}`;
  const availableExamCount = subject.exams.filter(
    (exam) => !exam.deleteRights,
  ).length;
  const hasAuthorizedExams = hasAuthorizedExamContent(subject);
  const titleStem = interpolate(
    hasAuthorizedExams
      ? tr.seo.subjectAuthorizedTitle
      : tr.seo.subjectCommunityTitle,
    { subjectName: subject.name },
  );
  const count = stats.questionCount;
  const description = interpolate(
    hasAuthorizedExams
      ? tr.seo.subjectAuthorizedDescription
      : tr.seo.subjectCommunityDescription,
    {
      count: count ? `${count} ` : "",
      subjectName: subject.name,
      examCount: availableExamCount,
      courseCode: subject.courseCode,
      degree: subject.degree,
      course: subject.course,
    },
  );
  const title = appendBrand(titleStem, tr.seo.siteName);
  const canonicalUrl = fullUrl(buildCanonicalPath(lang, pathWithoutLang));

  return makePageMeta(
    lang,
    pathWithoutLang,
    title,
    description,
    ogImageForSubject(subject),
    [
      {
        "@type": "CollectionPage",
        name: title,
        url: canonicalUrl,
        inLanguage: langMeta[lang].hreflang,
        description,
        about: {
          "@type": "Course",
          name: subject.name,
          courseCode: subject.courseCode,
        },
      },
      breadcrumbJsonLd(lang, pathWithoutLang, [
        { name: tr.seo.siteName, pathWithoutLang: "/" },
        { name: subject.name, pathWithoutLang },
      ]),
    ],
    subject.lastmod,
  );
}

export function buildTopicMeta(
  lang: Lang,
  subject: SubjectMeta,
  topic: Topic,
  stats: SubjectStats = {},
): PageMetaData {
  const tr = t(lang);
  const pathWithoutLang = `/${subject.id}/practice/${topic.key}`;
  const count = stats.topicQuestionCounts?.[topic.key];
  const hasAuthorizedExams = hasAuthorizedExamContent(subject);
  const titleStem = interpolate(
    hasAuthorizedExams
      ? tr.seo.topicAuthorizedTitle
      : tr.seo.topicCommunityTitle,
    { topicName: topic.label, subjectName: subject.name },
  );
  const description = interpolate(
    hasAuthorizedExams
      ? tr.seo.topicAuthorizedDescription
      : tr.seo.topicCommunityDescription,
    {
      count: count ? `${count} ` : "",
      topicName: topic.label,
      subjectName: subject.name,
      courseCode: subject.courseCode,
      degree: subject.degree,
      course: subject.course,
    },
  );
  const title = appendBrand(titleStem, tr.seo.siteName);
  const canonicalUrl = fullUrl(buildCanonicalPath(lang, pathWithoutLang));

  return makePageMeta(
    lang,
    pathWithoutLang,
    title,
    description,
    ogImageForSubject(subject),
    [
      {
        "@type": "CollectionPage",
        name: title,
        url: canonicalUrl,
        inLanguage: langMeta[lang].hreflang,
        description,
        about: [
          { "@type": "Thing", name: topic.label },
          {
            "@type": "Course",
            name: subject.name,
            courseCode: subject.courseCode,
          },
        ],
      },
      breadcrumbJsonLd(lang, pathWithoutLang, [
        { name: tr.seo.siteName, pathWithoutLang: "/" },
        { name: subject.name, pathWithoutLang: `/${subject.id}` },
        { name: topic.label, pathWithoutLang },
      ]),
    ],
    subject.lastmod,
  );
}

export function buildExamMeta(
  lang: Lang,
  subject: SubjectMeta,
  exam: Exam,
  stats: SubjectStats = {},
): PageMetaData {
  const tr = t(lang);
  const pathWithoutLang = `/${subject.id}/exam/${exam.id}`;
  const count = stats.examQuestionCounts?.[exam.id];
  const hasAuthorizedExams = hasAuthorizedExamContent(subject);
  const titleStem = interpolate(
    hasAuthorizedExams ? tr.seo.examAuthorizedTitle : tr.seo.examPracticeTitle,
    { examName: exam.title, subjectName: subject.name },
  );
  const description = interpolate(
    hasAuthorizedExams
      ? tr.seo.examAuthorizedDescription
      : tr.seo.examPracticeDescription,
    {
      examName: exam.title,
      subjectName: subject.name,
      questionCount: count
        ? interpolate(tr.seo.questionCountSuffix, { count })
        : "",
      totalPoints: stats.examTotalPoints?.[exam.id] ?? 0,
      durationMinutes: exam.durationMinutes,
    },
  );
  const title = appendBrand(titleStem, tr.seo.siteName);
  const canonicalUrl = fullUrl(buildCanonicalPath(lang, pathWithoutLang));

  return makePageMeta(
    lang,
    pathWithoutLang,
    title,
    description,
    ogImageForSubject(subject),
    [
      {
        "@type": "WebPage",
        name: title,
        url: canonicalUrl,
        inLanguage: langMeta[lang].hreflang,
        description,
        about: {
          "@type": "Course",
          name: subject.name,
          courseCode: subject.courseCode,
        },
      },
      breadcrumbJsonLd(lang, pathWithoutLang, [
        { name: tr.seo.siteName, pathWithoutLang: "/" },
        { name: subject.name, pathWithoutLang: `/${subject.id}` },
        { name: exam.title, pathWithoutLang },
      ]),
    ],
    subject.lastmod,
  );
}
