import { isLang, type Lang } from "./context-value";

export function detectPreferredLang(): Lang {
	try {
		const stored = localStorage.getItem("lang") ?? undefined;
		if (isLang(stored)) return stored;
	} catch {
		/* localStorage unavailable */
	}

	if (typeof navigator !== "undefined") {
		const preferredLanguages = navigator.languages?.length
			? navigator.languages
			: [navigator.language];

		for (const preferredLanguage of preferredLanguages) {
			const language = preferredLanguage.toLowerCase();
			if (language.startsWith("en")) return "en";
			if (language.startsWith("es")) return "es";
			if (language.startsWith("gl")) return "gl";
		}
	}

	return "es";
}
