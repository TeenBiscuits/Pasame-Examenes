import type { PageMetaData } from "./meta";

export function createPageHead(meta: PageMetaData, indexable = true) {
	return {
		meta: [
			{ title: meta.title },
			{ name: "description", content: meta.description },
			{
				name: "robots",
				content: indexable ? "index, follow" : "noindex, nofollow",
			},
			{ property: "og:title", content: meta.socialTitle },
			{ property: "og:description", content: meta.socialDescription },
			{ property: "og:image", content: meta.ogImage },
			{ property: "og:image:type", content: meta.ogImageType },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:url", content: meta.canonicalUrl },
			{ property: "og:site_name", content: meta.siteName },
			{ property: "og:type", content: "website" },
			{ property: "og:locale", content: meta.locale },
			{ name: "twitter:title", content: meta.socialTitle },
			{ name: "twitter:description", content: meta.socialDescription },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:image", content: meta.ogImage },
		],
		links: [
			{ rel: "canonical", href: meta.canonicalUrl },
			...meta.alternates.map((alternate) => ({
				rel: "alternate",
				href: alternate.href,
				hrefLang: alternate.lang,
			})),
		],
		scripts: [
			{
				type: "application/ld+json",
				children: meta.jsonLd,
			},
		],
	};
}

export function createNoIndexHead(
	meta: Pick<PageMetaData, "title" | "description">,
) {
	return {
		meta: [
			{ title: meta.title },
			{ name: "description", content: meta.description },
			{ name: "robots", content: "noindex, nofollow" },
			{ property: "og:title", content: meta.title },
			{ property: "og:description", content: meta.description },
			{ name: "twitter:title", content: meta.title },
			{ name: "twitter:description", content: meta.description },
		],
	};
}
