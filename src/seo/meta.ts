import type { SubjectMeta, Topic, Exam } from "../data/types";
import { en } from "../i18n/en";
import { es } from "../i18n/es";
import { gl } from "../i18n/gl";
import type { Lang } from "../i18n/context";

export const BASE_URL = "https://pe.pablopl.dev";
export const LANGS = ["en", "es", "gl"] as const;
export const DEFAULT_LANG: Lang = "es";
export const BUNDLE_ENTRY_POINT = "/src/main.tsx";

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
  alternates: { lang: Lang | "x-default"; href: string }[];
  jsonLd: string;
}

export interface SubjectStats {
  questionCount?: number;
  topicQuestionCounts?: Record<string, number>;
  examQuestionCounts?: Record<string, number>;
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
    alternates: alternates(pathWithoutLang),
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    }),
  };
}

export function buildHomeMeta(lang: Lang): PageMetaData {
  const tr = t(lang);
  const titleByLang: Record<Lang, string> = {
    en: "Practice University Exams",
    es: "Practica exámenes universitarios",
    gl: "Practica exames universitarios",
  };
  const descriptionByLang: Record<Lang, string> = {
    en: "Practice past university exams by topic or simulate full exams with model answers, self-grading, and multiple-choice, text, and matching questions.",
    es: "Practica exámenes universitarios anteriores por tema o simula exámenes completos con respuestas modelo, autocorrección y preguntas tipo test o desarrollo.",
    gl: "Practica exames universitarios anteriores por tema ou simula exames completos con respostas modelo, autocorrección e preguntas tipo test ou desenvolvemento.",
  };
  const title = appendBrand(titleByLang[lang], tr.seo.siteName);
  const description = descriptionByLang[lang];
  const canonicalUrl = fullUrl(buildCanonicalPath(lang, "/"));

  return makePageMeta(lang, "/", title, description, "/og.jpg", [
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
  ]);
}

export function buildSubjectMeta(
  lang: Lang,
  subject: SubjectMeta,
  stats: SubjectStats = {},
): PageMetaData {
  const tr = t(lang);
  const pathWithoutLang = `/${subject.id}`;
  const titleStem: Record<Lang, string> = {
    en: `${subject.name}: past "exams" and solved questions`,
    es: `${subject.name}: "exámenes" y preguntas resueltas`,
    gl: `${subject.name}: "exames" e preguntas resoltas`,
  };
  const availableExamCount = subject.exams.filter(
    (exam) => !exam.deleteRights,
  ).length;
  const count = stats.questionCount;
  const descriptionByLang: Record<Lang, string> = {
    en: `Practice ${count ? `${count} ` : ""}${subject.name} questions from ${availableExamCount} past "exams" with model answers and self-grading. ${subject.courseCode}, ${subject.university}.`,
    es: `Practica ${count ? `${count} ` : ""}preguntas de ${subject.name} de ${availableExamCount} "exámenes" anteriores con respuestas modelo y autocorrección. ${subject.courseCode}, ${subject.university}.`,
    gl: `Practica ${count ? `${count} ` : ""}preguntas de ${subject.name} de ${availableExamCount} "exames" anteriores con respostas modelo e autocorrección. ${subject.courseCode}, ${subject.university}.`,
  };
  const title = appendBrand(titleStem[lang], tr.seo.siteName);
  const description = descriptionByLang[lang];
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
          provider: {
            "@type": "CollegeOrUniversity",
            name: subject.university,
          },
        },
      },
      breadcrumbJsonLd(lang, pathWithoutLang, [
        { name: tr.seo.siteName, pathWithoutLang: "/" },
        { name: subject.name, pathWithoutLang },
      ]),
    ],
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
  const titleStem: Record<Lang, string> = {
    en: `${topic.label}: ${subject.name} exam questions`,
    es: `${topic.label}: preguntas de ${subject.name}`,
    gl: `${topic.label}: preguntas de ${subject.name}`,
  };
  const descriptionByLang: Record<Lang, string> = {
    en: `Practice ${count ? `${count} ` : ""}${topic.label} questions from past ${subject.name} "exams" with model answers and self-grading. ${subject.courseCode}, ${subject.university}.`,
    es: `Practica ${count ? `${count} ` : ""}preguntas de ${topic.label} de "exámenes" anteriores de ${subject.name}, con respuestas modelo y autocorrección. ${subject.courseCode}, ${subject.university}.`,
    gl: `Practica ${count ? `${count} ` : ""}preguntas de ${topic.label} de "exames" anteriores de ${subject.name}, con respostas modelo e autocorrección. ${subject.courseCode}, ${subject.university}.`,
  };
  const title = appendBrand(titleStem[lang], tr.seo.siteName);
  const description = descriptionByLang[lang];
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
  );
}

export function buildExamMeta(
  lang: Lang,
  subject: SubjectMeta,
  exam: Exam,
  stats: SubjectStats = {},
): PageMetaData {
  const tr = t(lang);
  const pathWithoutLang = `/${subject.id}/exam/${exam.year}`;
  const count = stats.examQuestionCounts?.[exam.year];
  const titleStem: Record<Lang, string> = {
    en: `${exam.title} ${subject.name}: exam simulator`,
    es: `${exam.title} de ${subject.name}: simulador`,
    gl: `${exam.title} de ${subject.name}: simulador`,
  };
  const descriptionByLang: Record<Lang, string> = {
    en: `Simulate the ${exam.title} ${subject.name} exam${count ? ` with ${count} questions` : ""}. ${exam.totalPoints} points, ${exam.durationMinutes} minutes, model answers and self-grading.`,
    es: `Simula el examen ${exam.title} de ${subject.name}${count ? ` con ${count} preguntas` : ""}. ${exam.totalPoints} puntos, ${exam.durationMinutes} minutos, respuestas modelo y autocorrección.`,
    gl: `Simula o exame ${exam.title} de ${subject.name}${count ? ` con ${count} preguntas` : ""}. ${exam.totalPoints} puntos, ${exam.durationMinutes} minutos, respostas modelo e autocorrección.`,
  };
  const title = appendBrand(titleStem[lang], tr.seo.siteName);
  const description = descriptionByLang[lang];
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
          provider: {
            "@type": "CollegeOrUniversity",
            name: subject.university,
          },
        },
      },
      breadcrumbJsonLd(lang, pathWithoutLang, [
        { name: tr.seo.siteName, pathWithoutLang: "/" },
        { name: subject.name, pathWithoutLang: `/${subject.id}` },
        { name: exam.title, pathWithoutLang },
      ]),
    ],
  );
}
