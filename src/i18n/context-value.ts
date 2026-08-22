import { createContext } from "react";
import { en, type Translations } from "./en";

export type Lang = "en" | "es" | "gl";

export function isLang(value: string | undefined): value is Lang {
	return value === "en" || value === "es" || value === "gl";
}

export interface I18nContextType {
	t: Translations;
	lang: Lang;
	setLang: (lang: Lang) => void;
}

export const I18nContext = createContext<I18nContextType>({
	t: en,
	lang: "en",
	setLang: () => {},
});
