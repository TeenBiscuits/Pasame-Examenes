import type { Lang } from "../i18n/context-value";
import type { SeoTranslations } from "./translation-types";

type SeoTranslationLoader = () => Promise<SeoTranslations>;

const seoTranslationLoaders: Record<Lang, SeoTranslationLoader> = {
	en: () =>
		import("./translations/en").then(({ seoTranslations }) => seoTranslations),
	es: () =>
		import("./translations/es").then(({ seoTranslations }) => seoTranslations),
	gl: () =>
		import("./translations/gl").then(({ seoTranslations }) => seoTranslations),
};

const seoTranslationPromises = new Map<Lang, Promise<SeoTranslations>>();

export function loadSeoTranslations(lang: Lang): Promise<SeoTranslations> {
	const existingPromise = seoTranslationPromises.get(lang);
	if (existingPromise) return existingPromise;

	const promise = seoTranslationLoaders[lang]();
	seoTranslationPromises.set(lang, promise);
	return promise;
}
