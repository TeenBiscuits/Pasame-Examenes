import { useEffect } from "react";
import { useT, useLang } from "../i18n/hooks";
import type { Lang } from "../i18n/context";

const BASE_URL = "https://pe.pablopl.dev";

function safeJsonStringify(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const langMeta: Record<
  Lang,
  { locale: string; hreflang: string; alternateLocales: Lang[] }
> = {
  en: { locale: "en_US", hreflang: "en", alternateLocales: ["es", "gl"] },
  es: { locale: "es_ES", hreflang: "es", alternateLocales: ["en", "gl"] },
  gl: { locale: "gl_ES", hreflang: "gl", alternateLocales: ["en", "es"] },
};

function buildCanonicalPath(lang: Lang, pathWithoutLang: string): string {
  const base = pathWithoutLang === "/" ? "" : pathWithoutLang;
  return `/${lang}${base}`;
}

function buildWebsiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pásame Exámenes",
    url: BASE_URL,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface SeoPageMeta {
  title: string;
  description: string;
  pathWithoutLang: string;
  structuredData?: object | object[];
}

export function useSeoHead({
  title,
  description,
  pathWithoutLang,
  structuredData,
}: SeoPageMeta) {
  const t = useT();
  const { lang } = useLang();
  const meta = langMeta[lang];

  useEffect(() => {
    document.documentElement.lang = meta.hreflang;
  }, [meta.hreflang]);

  const canonicalPath = buildCanonicalPath(lang, pathWithoutLang);
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  const schemas = [buildWebsiteSchema(meta.locale)];
  if (structuredData) {
    const extra = Array.isArray(structuredData)
      ? structuredData
      : [structuredData];
    schemas.push(...extra);
  }

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image:alt" content={t.seo.ogImageAlt} />
      <meta property="og:locale" content={meta.locale} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={t.seo.siteName} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href={canonicalUrl} />
      {meta.alternateLocales.map((altLang) => (
        <link
          key={`hreflang-${altLang}`}
          rel="alternate"
          hrefLang={langMeta[altLang].hreflang}
          href={`${BASE_URL}${buildCanonicalPath(altLang, pathWithoutLang)}`}
        />
      ))}
      <script type="application/ld+json">
        {safeJsonStringify(schemas.length === 1 ? schemas[0] : schemas)}
      </script>
    </>
  );
}
