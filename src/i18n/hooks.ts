import { useContext } from "react";
import { I18nContext } from "./context";

export function useT() {
  return useContext(I18nContext).t;
}

export function useLang() {
  const ctx = useContext(I18nContext);
  return { lang: ctx.lang, setLang: ctx.setLang };
}
