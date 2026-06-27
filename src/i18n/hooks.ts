import { use } from "react";
import { I18nContext } from "./context-value";

export function useT() {
  return use(I18nContext).t;
}

export function useLang() {
  const ctx = use(I18nContext);
  return { lang: ctx.lang, setLang: ctx.setLang };
}
