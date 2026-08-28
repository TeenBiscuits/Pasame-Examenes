import type { Lang } from "./context-value";

const languageDownloadLabels: Record<Lang, string> = {
	en: "Downloading language...",
	es: "Descargando idioma...",
	gl: "Descargando idioma...",
};

export function getLanguageDownloadMessage(lang: Lang, progress: number) {
	return `${languageDownloadLabels[lang]} ${progress}%`;
}
