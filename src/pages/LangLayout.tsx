import { Outlet, useParams, Navigate, useLocation } from "react-router";
import { useEffect } from "react";
import { useLang } from "../i18n/hooks";
import type { Lang } from "../i18n/context";

export default function LangLayout() {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const location = useLocation();
  const { lang, setLang } = useLang();

  useEffect(() => {
    if (
      paramLang &&
      (paramLang === "en" || paramLang === "es" || paramLang === "gl") &&
      paramLang !== lang
    ) {
      setLang(paramLang);
    }
  }, [paramLang, lang, setLang]);

  if (!paramLang || !["en", "es", "gl"].includes(paramLang)) {
    const detected = detectLang();
    return (
      <Navigate
        to={`/${detected}${location.pathname.replace(/^\/(en|es|gl)\/?/, "/") || "/"}`}
        replace
      />
    );
  }

  return <Outlet />;
}

function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "es" || stored === "gl")
      return stored as Lang;
  } catch {
    /* localStorage unavailable */
  }
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("es")) return "es";
  return "en";
}
