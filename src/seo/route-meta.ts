import type { MetaDescriptor } from "react-router";
import type { PageMetaData } from "./meta";

export function pageMetaDescriptors(page: PageMetaData): MetaDescriptor[] {
  return [
    { title: page.title },
    { name: "description", content: page.description },
    { name: "robots", content: "index, follow" },
    { tagName: "link", rel: "canonical", href: page.canonicalUrl },
    ...page.alternates.map((alternate) => ({
      tagName: "link" as const,
      rel: "alternate",
      hrefLang: alternate.lang,
      href: alternate.href,
    })),
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:image", content: page.ogImage },
    { property: "og:image:type", content: page.ogImageType },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:url", content: page.canonicalUrl },
    { property: "og:site_name", content: page.siteName },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: page.locale },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: page.ogImage },
    { "script:ld+json": JSON.parse(page.jsonLd) as Record<string, unknown> },
  ];
}
