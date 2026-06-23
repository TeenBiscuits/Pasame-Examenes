/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { en, type Translations } from "./en";
import { es } from "./es";
import { gl } from "./gl";

export type Lang = "en" | "es" | "gl";

const translations: Record<Lang, Translations> = { en, es, gl };

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

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "es" || stored === "gl") return stored;
  } catch {
    /* localStorage unavailable */
  }
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("es")) return "es";
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

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
