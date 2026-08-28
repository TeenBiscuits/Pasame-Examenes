import {
	type ReactNode,
	use,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { I18nContext, type Lang } from "./context-value";
import type { Translations } from "./en";

export type { Lang } from "./context-value";

type TranslationLoader = () => Promise<Translations>;

const translationLoaders: Record<Lang, TranslationLoader> = {
	en: () => import("./en").then(({ en }) => en),
	es: () => import("./es").then(({ es }) => es),
	gl: () => import("./gl").then(({ gl }) => gl),
};

const translationPromises = new Map<Lang, Promise<Translations>>();

function loadTranslations(lang: Lang) {
	const existingPromise = translationPromises.get(lang);
	if (existingPromise) return existingPromise;

	const promise = translationLoaders[lang]();
	translationPromises.set(lang, promise);
	return promise;
}

export function I18nProvider({
	children,
	initialLang = "es",
}: {
	children: ReactNode;
	initialLang?: Lang;
}) {
	const initialTranslations = use(loadTranslations(initialLang));
	const [state, setState] = useState(() => ({
		lang: initialLang,
		translations: initialTranslations,
	}));
	const pendingLanguageRef = useRef<{
		lang: Lang;
		routeLang: Lang;
	} | null>(null);
	const activeState = useMemo(() => {
		const pendingLanguage = pendingLanguageRef.current;
		const canUseState =
			state.lang === initialLang ||
			(pendingLanguage?.lang === state.lang &&
				pendingLanguage.routeLang === initialLang);

		return canUseState
			? state
			: { lang: initialLang, translations: initialTranslations };
	}, [initialLang, initialTranslations, state]);

	useEffect(() => {
		if (state.lang === initialLang) {
			pendingLanguageRef.current = null;
			return;
		}

		const pendingLanguage = pendingLanguageRef.current;
		if (
			pendingLanguage?.lang === state.lang &&
			pendingLanguage.routeLang === initialLang
		) {
			return;
		}

		let active = true;
		void loadTranslations(initialLang).then((translations) => {
			if (active) setState({ lang: initialLang, translations });
		});

		return () => {
			active = false;
		};
	}, [initialLang, state.lang]);

	const setLang = useCallback(
		async (l: Lang) => {
			const translations = await loadTranslations(l);
			pendingLanguageRef.current = { lang: l, routeLang: initialLang };
			setState({ lang: l, translations });
			try {
				localStorage.setItem("lang", l);
			} catch {
				/* localStorage unavailable */
			}
		},
		[initialLang],
	);

	const value = useMemo(
		() => ({
			t: activeState.translations,
			lang: activeState.lang,
			setLang,
		}),
		[activeState, setLang],
	);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
