import type { Exam, SubjectMeta, Topic } from "../data/types";
import type { Lang } from "../i18n/context";
import { en } from "../i18n/en";
import { es } from "../i18n/es";
import { gl } from "../i18n/gl";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import { isIndexableSubject } from "../subjects/visibility";

export const BASE_URL = "https://pe.pablopl.dev";
export const LANGS = ["en", "es", "gl"] as const;
export const DEFAULT_LANG: Lang = "es";
export const BUNDLE_ENTRY_POINT = "/src/main.tsx";
export const MAX_TITLE_LENGTH = 59;
export const MAX_DESCRIPTION_LENGTH = 157;
export const SITEMAP_LASTMOD = {
	global: "2026-08-23",
	home: "2026-08-16",
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
	socialTitle: string;
	socialDescription: string;
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

export function isIndexablePagePath(pathWithoutLang: string): boolean {
	const segments = pathWithoutLang.split("/").filter(Boolean);

	return (
		segments.length === 0 ||
		(segments.length === 1 && isIndexableSubject(segments[0]))
	);
}

function trimToWordBoundary(value: string, maxLength: number): string {
	if (value.length <= maxLength) return value;

	const withEllipsis = value.slice(0, maxLength - 1).trimEnd();
	const withoutPartialWord = withEllipsis.replace(/\s+\S*$/, "");
	return `${withoutPartialWord || withEllipsis}…`;
}

function pickWithinLimit(candidates: string[], maxLength: number): string {
	const candidate = candidates.find((value) => value.length <= maxLength);
	return candidate ?? trimToWordBoundary(candidates.at(-1) ?? "", maxLength);
}

function appendBrand(title: string, siteName: string): string {
	return pickWithinLimit([`${title} | ${siteName}`, title], MAX_TITLE_LENGTH);
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
		socialTitle: title,
		socialDescription: description,
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
			{
				"@type": "FAQPage",
				name: tr.home.faqTitle,
				url: canonicalUrl,
				inLanguage: langMeta[lang].hreflang,
				mainEntity: tr.home.faqs.map((faq) => ({
					"@type": "Question",
					name: faq.question,
					acceptedAnswer: {
						"@type": "Answer",
						text: faq.answer,
					},
				})),
			},
		],
		SITEMAP_LASTMOD.home,
	);
}

export function buildPrivacyMeta(lang: Lang): PageMetaData {
	const tr = t(lang);
	const title = appendBrand(tr.footer.privacyTitle, tr.seo.siteName);
	const description = tr.seo.privacyMetaDescription;
	const pathWithoutLang = "/privacy";
	const canonicalUrl = fullUrl(buildCanonicalPath(lang, pathWithoutLang));

	return makePageMeta(lang, pathWithoutLang, title, description, "/og.jpg", [
		{
			"@type": "WebPage",
			name: title,
			url: canonicalUrl,
			inLanguage: langMeta[lang].hreflang,
			description,
		},
	]);
}

export function buildNotFoundMeta(lang: Lang) {
	const tr = t(lang);
	return {
		title: appendBrand(tr.subjectHome.notFound, tr.seo.siteName),
		description: tr.seo.defaultDescription,
	};
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
	const questionLabel =
		count === 1 ? tr.seo.questionSingular : tr.seo.questionPlural;
	const examLabel =
		availableExamCount === 1 ? tr.seo.examSingular : tr.seo.examPlural;
	const compilationLabel =
		availableExamCount === 1
			? tr.seo.compilationSingular
			: tr.seo.compilationPlural;
	const description = interpolate(
		hasAuthorizedExams
			? tr.seo.subjectAuthorizedDescription
			: tr.seo.subjectCommunityDescription,
		{
			count: count ? `${count} ` : "",
			subjectName: subject.name,
			examCount: availableExamCount,
			examLabel,
			compilationLabel,
			questionLabel,
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
	const questionLabel =
		count === 1 ? tr.seo.questionSingular : tr.seo.questionPlural;
	const hasAuthorizedExams = hasAuthorizedExamContent(subject);
	const titleStem = interpolate(
		hasAuthorizedExams
			? tr.seo.topicAuthorizedTitle
			: tr.seo.topicCommunityTitle,
		{ topicName: topic.label, subjectName: subject.name },
	);
	const shortTopicName = topic.label.includes(":")
		? topic.label.slice(0, topic.label.lastIndexOf(":")).trim()
		: topic.label;
	const description = pickWithinLimit(
		[
			interpolate(
				hasAuthorizedExams
					? tr.seo.topicAuthorizedDescription
					: tr.seo.topicCommunityDescription,
				{
					count: count ? `${count} ` : "",
					topicName: topic.label,
					subjectName: subject.name,
					questionLabel,
				},
			),
			interpolate(
				hasAuthorizedExams
					? tr.seo.topicAuthorizedDescriptionShort
					: tr.seo.topicCommunityDescriptionShort,
				{
					count: count ? `${count} ` : "",
					topicName: topic.label,
					questionLabel,
				},
			),
		],
		MAX_DESCRIPTION_LENGTH,
	);
	const title = appendBrand(
		pickWithinLimit([titleStem, shortTopicName, topic.label], MAX_TITLE_LENGTH),
		tr.seo.siteName,
	);
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
	const questionCount = count
		? interpolate(tr.seo.questionCountSuffix, {
				count,
				questionLabel:
					count === 1 ? tr.seo.questionSingular : tr.seo.questionPlural,
			})
		: "";
	const descriptionValues = {
		examName: exam.title,
		subjectName: subject.name,
		questionCount,
		durationMinutes: exam.durationMinutes,
	};
	const description = pickWithinLimit(
		[
			interpolate(
				hasAuthorizedExams
					? tr.seo.examAuthorizedDescription
					: tr.seo.examPracticeDescription,
				descriptionValues,
			),
			interpolate(
				hasAuthorizedExams
					? tr.seo.examAuthorizedDescriptionShort
					: tr.seo.examPracticeDescriptionShort,
				descriptionValues,
			),
		],
		MAX_DESCRIPTION_LENGTH,
	);
	const title = appendBrand(
		pickWithinLimit(
			[
				titleStem,
				interpolate(
					hasAuthorizedExams
						? tr.seo.examAuthorizedShortTitle
						: tr.seo.examPracticeShortTitle,
					{ examName: exam.title },
				),
				exam.title,
			],
			MAX_TITLE_LENGTH,
		),
		tr.seo.siteName,
	);
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
