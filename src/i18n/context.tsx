import { useState, useCallback, useMemo, type ReactNode } from "react";
import { en, type Translations } from "./en";
import { es } from "./es";
import { gl } from "./gl";
import { I18nContext, type Lang } from "./context-value";

export type { Lang } from "./context-value";

const translations: Record<Lang, Translations> = { en, es, gl };

function getLangFromPathname(): Lang | null {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/(en|es|gl)(\/|$)/);
  if (match) return match[1] as Lang;
  return null;
}

function getInitialLang(): Lang {
  const urlLang = getLangFromPathname();
  if (urlLang) return urlLang;
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "es" || stored === "gl") return stored;
  } catch {
    /* localStorage unavailable */
  }
  if (typeof navigator === "undefined") return "es";
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("es")) return "es";
  return "en";
}

export function I18nProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(() => initialLang ?? getInitialLang());

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
