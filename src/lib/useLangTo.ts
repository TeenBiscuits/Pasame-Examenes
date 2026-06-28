import { useCallback } from "react";
import { useLang } from "../i18n/hooks";
import { buildLangPath } from "./lang-link-utils";

export function useLangTo() {
  const { lang } = useLang();
  return useCallback((path: string) => buildLangPath(lang, path), [lang]);
}
