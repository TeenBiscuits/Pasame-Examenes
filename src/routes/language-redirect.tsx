import { Navigate, useLocation } from "react-router";
import type { Lang } from "../i18n/context";

function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "es";

  const preferredLanguages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const preferredLanguage of preferredLanguages) {
    const language = preferredLanguage.toLowerCase();
    if (language.startsWith("en")) return "en";
    if (language.startsWith("es")) return "es";
    if (language.startsWith("gl")) return "gl";
  }

  return "es";
}

export default function LanguageRedirect() {
  const { pathname, search, hash } = useLocation();
  const lang = detectBrowserLang();
  const path = pathname === "/" ? "" : pathname;

  return <Navigate to={`/${lang}${path}${search}${hash}`} replace />;
}
