import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { I18nContext, type Lang } from "./context-value";
import { en, type Translations } from "./en";
import { es } from "./es";
import { gl } from "./gl";

export type { Lang } from "./context-value";

const translations: Record<Lang, Translations> = { en, es, gl };

export function I18nProvider({
	children,
	initialLang = "es",
}: {
	children: ReactNode;
	initialLang?: Lang;
}) {
	const [lang, setLangState] = useState<Lang>(initialLang);

	useEffect(() => {
		setLangState((currentLang) =>
			currentLang === initialLang ? currentLang : initialLang,
		);
	}, [initialLang]);

	const setLang = useCallback((l: Lang) => {
		setLangState(l);
		try {
			localStorage.setItem("lang", l);
		} catch {
			/* localStorage unavailable */
		}
	}, []);

	const value = useMemo(
		() => ({ t: translations[lang], lang, setLang }),
		[lang, setLang],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
