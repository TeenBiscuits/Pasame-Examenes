import { useEffect } from "react";
import { useT, useLang } from "../i18n/hooks";
import {
  BASE_URL,
  DEFAULT_LANG,
  LANGS,
  buildCanonicalPath,
  langMeta,
} from "../seo/meta";

function updateMeta(
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

function updateLink(
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
    if (extra) {
      for (const [key, val] of Object.entries(extra)) {
        el.setAttribute(key, val);
      }
    }
  }
}

function updateJsonLd(jsonLd?: string) {
  if (!jsonLd) return;
  let el = document.getElementById("schema-jsonld") as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = "schema-jsonld";
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = jsonLd;
}

export interface SeoPageMeta {
  title: string;
  description: string;
  pathWithoutLang: string;
  ogImage?: string;
  jsonLd?: string;
  enabled?: boolean;
}

export function useSeoHead({
  title,
  description,
  pathWithoutLang,
  ogImage,
  jsonLd,
  enabled = true,
}: SeoPageMeta) {
  const t = useT();
  const { lang } = useLang();
  const meta = langMeta[lang];

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.lang = meta.hreflang;

    const canonicalPath = buildCanonicalPath(lang, pathWithoutLang);
    const canonicalUrl = `${BASE_URL}${canonicalPath}`;

    const imageUrl = ogImage || "/og.jpg";
    const imageType = imageUrl.endsWith(".png") ? "image/png" : "image/jpeg";
    const ogImageOps = [
      {
        id: "og:image",
        content: `${BASE_URL}${imageUrl}`,
        attr: "property" as const,
      },
      { id: "og:image:type", content: imageType, attr: "property" as const },
      { id: "og:image:width", content: "1200", attr: "property" as const },
      { id: "og:image:height", content: "630", attr: "property" as const },
      {
        id: "twitter:image",
        content: `${BASE_URL}${imageUrl}`,
        attr: "name" as const,
      },
    ];

    const metaOps = [
      ...ogImageOps,
      { id: "meta-description", content: description, attr: "name" as const },
      { id: "og:title", content: title, attr: "property" as const },
      { id: "og:description", content: description, attr: "property" as const },
      { id: "og:locale", content: meta.locale, attr: "property" as const },
      { id: "og:url", content: canonicalUrl, attr: "property" as const },
      {
        id: "og:site_name",
        content: t.seo.siteName,
        attr: "property" as const,
      },
      { id: "og:type", content: "website", attr: "property" as const },
      { id: "twitter:title", content: title, attr: "name" as const },
      {
        id: "twitter:description",
        content: description,
        attr: "name" as const,
      },
      {
        id: "twitter:card",
        content: "summary_large_image",
        attr: "name" as const,
      },
    ];

    const linkOps = [
      { id: "link-canonical", rel: "canonical", href: canonicalUrl },
      ...LANGS.map((altLang) => ({
        id: `link-hreflang-${altLang}`,
        rel: "alternate" as const,
        href: `${BASE_URL}${buildCanonicalPath(altLang, pathWithoutLang)}`,
        extra: { hreflang: langMeta[altLang].hreflang },
      })),
      {
        id: "link-hreflang-x-default",
        rel: "alternate" as const,
        href: `${BASE_URL}${buildCanonicalPath(DEFAULT_LANG, pathWithoutLang)}`,
        extra: { hreflang: "x-default" },
      },
    ];

    for (const op of metaOps) {
      updateMeta(op.id, op.content, op.attr);
    }
    for (const op of linkOps) {
      updateLink(op.id, op.rel, op.href, "extra" in op ? op.extra : undefined);
    }
    updateJsonLd(jsonLd);
  }, [
    title,
    description,
    pathWithoutLang,
    lang,
    meta,
    t.seo.siteName,
    ogImage,
    jsonLd,
    enabled,
  ]);
}
