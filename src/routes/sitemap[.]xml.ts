import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_BASE_URL = "https://pe.pablopl.dev";
const LANGS = ["en", "es", "gl"] as const;
const SITEMAP_GLOBAL_LASTMOD = "2026-08-16";

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function priorityForPath(pathWithoutLang: string): number {
	if (pathWithoutLang === "/") return 1;
	if (pathWithoutLang.includes("/exam/")) return 0.8;
	if (pathWithoutLang.includes("/practice/")) return 0.6;
	return 0.9;
}

function changefreqForPath(pathWithoutLang: string): string {
	if (pathWithoutLang === "/") return "weekly";
	if (
		pathWithoutLang.includes("/exam/") ||
		pathWithoutLang.includes("/practice/")
	) {
		return "monthly";
	}
	return "weekly";
}

function withSitemapBase(url: string, baseUrl: string, defaultBaseUrl: string) {
	return url.startsWith(defaultBaseUrl)
		? `${baseUrl}${url.slice(defaultBaseUrl.length)}`
		: url;
}

async function buildSitemapXml(): Promise<string> {
	const [subjectData, visibility] = await Promise.all([
		import("../subjects"),
		import("../subjects/visibility"),
	]);
	const defaultBaseUrl = DEFAULT_BASE_URL;
	const configuredBaseUrl =
		typeof process !== "undefined"
			? process.env.SITE_URL?.trim() || defaultBaseUrl
			: defaultBaseUrl;
	const baseUrl = configuredBaseUrl.replace(/\/+$/, "");
	const indexableSubjects = subjectData.subjects.filter((subject) =>
		visibility.isIndexableSubject(subject.id),
	);
	const sitemapPages = LANGS.flatMap((lang) => [
		{
			pathWithoutLang: "/",
			canonicalUrl: `${defaultBaseUrl}/${lang}`,
			lastmod: SITEMAP_GLOBAL_LASTMOD,
			alternates: [
				...LANGS.map((alternateLang) => ({
					lang: alternateLang,
					href: `${defaultBaseUrl}/${alternateLang}`,
				})),
				{ lang: "x-default", href: `${defaultBaseUrl}/es` },
			],
		},
		...indexableSubjects.map((subject) => ({
			pathWithoutLang: `/${subject.id}`,
			canonicalUrl: `${defaultBaseUrl}/${lang}/${encodeURIComponent(subject.id)}`,
			lastmod:
				subject.lastmod > SITEMAP_GLOBAL_LASTMOD
					? subject.lastmod
					: SITEMAP_GLOBAL_LASTMOD,
			alternates: [
				...LANGS.map((alternateLang) => ({
					lang: alternateLang,
					href: `${defaultBaseUrl}/${alternateLang}/${encodeURIComponent(subject.id)}`,
				})),
				{
					lang: "x-default",
					href: `${defaultBaseUrl}/es/${encodeURIComponent(subject.id)}`,
				},
			],
		})),
	]);

	const xmlEntries = sitemapPages
		.map((page) => {
			const alternates = page.alternates
				.map(
					(alternate) =>
						`    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${escapeXml(withSitemapBase(alternate.href, baseUrl, defaultBaseUrl))}" />`,
				)
				.join("\n");
			return [
				"  <url>",
				`    <loc>${escapeXml(withSitemapBase(page.canonicalUrl, baseUrl, defaultBaseUrl))}</loc>`,
				`    <lastmod>${escapeXml(page.lastmod)}</lastmod>`,
				`    <changefreq>${changefreqForPath(page.pathWithoutLang)}</changefreq>`,
				`    <priority>${priorityForPath(page.pathWithoutLang)}</priority>`,
				alternates,
				"  </url>",
			].join("\n");
		})
		.join("\n");

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
		'        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		xmlEntries,
		"</urlset>",
		"",
	].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () =>
				new Response(await buildSitemapXml(), {
					headers: {
						"Cache-Control": "public, max-age=3600",
						"Content-Type": "application/xml; charset=utf-8",
					},
				}),
		},
	},
});
