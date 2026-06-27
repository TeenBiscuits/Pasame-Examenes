import { useEffect } from "react";
import { useT, useLang } from "../i18n/hooks";
import type { Lang } from "../i18n/context";

const BASE_URL = "https://pe.pablopl.dev";

const langMeta: Record<
  Lang,
  { locale: string; hreflang: string; alternateLocales: Lang[] }
> = {
  en: { locale: "en_US", hreflang: "en", alternateLocales: ["es", "gl"] },
  es: { locale: "es_ES", hreflang: "es", alternateLocales: ["en", "gl"] },
  gl: { locale: "gl_ES", hreflang: "gl", alternateLocales: ["en", "es"] },
};

function setMeta(
  id: string,
  content: string,
  attr: "content" | "property" | "name" = "content",
) {
  let el = document.getElementById(id) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.id = id;
    if (attr === "property") el.setAttribute("property", id);
    else if (attr === "name") el.setAttribute("name", id);
    el.setAttribute("content", content);
    document.head.appendChild(el);
  } else {
    el.setAttribute("content", content);
  }
}

function setLink(
  id: string,
  rel: string,
  href: string,
  extra?: Record<string, string>,
) {
  let el = document.getElementById(id) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.id = id;
    el.rel = rel;
    el.href = href;
    if (extra) {
      for (const [key, val] of Object.entries(extra)) {
        el.setAttribute(key, val);
      }
    }
    document.head.appendChild(el);
  } else {
    el.href = href;
  }
}

function buildCanonicalPath(lang: Lang, pathWithoutLang: string): string {
  const base = pathWithoutLang === "/" ? "" : pathWithoutLang;
  return `/${lang}${base}`;
}

export interface SeoPageMeta {
  title: string;
  description: string;
  pathWithoutLang: string;
}

export function useSeoHead({
  title,
  description,
  pathWithoutLang,
}: SeoPageMeta) {
  const t = useT();
  const { lang } = useLang();
  const meta = langMeta[lang];

  useEffect(() => {
    document.documentElement.lang = meta.hreflang;

    const canonicalPath = buildCanonicalPath(lang, pathWithoutLang);
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    const metaOps = [
      { id: "meta-description", content: description, attr: "name" as const },
      { id: "og:title", content: title, attr: "property" as const },
      { id: "og:description", content: description, attr: "property" as const },
      { id: "og:locale", content: meta.locale, attr: "property" as const },
      { id: "og:url", content: canonicalUrl, attr: "property" as const },
      { id: "og:site_name", content: t.seo.siteName, attr: "property" as const },
      { id: "og:type", content: "website", attr: "property" as const },
      { id: "twitter:title", content: title, attr: "name" as const },
      { id: "twitter:description", content: description, attr: "name" as const },
      { id: "twitter:card", content: "summary_large_image", attr: "name" as const },
    ];

    const linkOps = [
      { id: "link-canonical", rel: "canonical", href: canonicalUrl },
      ...meta.alternateLocales.map((altLang) => ({
        id: `link-hreflang-${altLang}`,
        rel: "alternate" as const,
        href: `${BASE_URL}${buildCanonicalPath(altLang, pathWithoutLang)}`,
        extra: { hreflang: langMeta[altLang].hreflang },
      })),
    ];

    for (const op of metaOps) {
      setMeta(op.id, op.content, op.attr);
    }
    for (const op of linkOps) {
      setLink(op.id, op.rel, op.href, "extra" in op ? op.extra : undefined);
    }
  }, [title, description, pathWithoutLang, lang, meta, t.seo.siteName]);
}
