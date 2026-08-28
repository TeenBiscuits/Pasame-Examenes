import { use } from "react";
import { I18nContext } from "./context-value";

function useI18nContext() {
	const context = use(I18nContext);
	if (!context) {
		throw new Error("useI18nContext must be used inside I18nProvider");
	}
	return context;
}

export function useT() {
	return useI18nContext().t;
}

export function useLang() {
	const ctx = useI18nContext();
	return { lang: ctx.lang, setLang: ctx.setLang };
}
