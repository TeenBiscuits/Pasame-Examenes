import type { Lang } from "./context-value";
import type { Translations } from "./en";

type TranslationLoader = () => Promise<Translations>;

const translationLoaders: Record<Lang, TranslationLoader> = {
	en: () => import("./en").then(({ en }) => en),
	es: () => import("./es").then(({ es }) => es),
	gl: () => import("./gl").then(({ gl }) => gl),
};

const translationPromises = new Map<Lang, Promise<Translations>>();
const loadedTranslations = new Set<Lang>();

export function loadTranslations(lang: Lang) {
	const existingPromise = translationPromises.get(lang);
	if (existingPromise) return existingPromise;

	const promise = translationLoaders[lang]().then((translations) => {
		loadedTranslations.add(lang);
		return translations;
	});
	translationPromises.set(lang, promise);
	return promise;
}

export function isLanguageCached(lang: Lang) {
	return loadedTranslations.has(lang);
}
