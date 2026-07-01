import { Navigate, useLocation } from "react-router";
import type { Lang } from "../i18n/context";

function detectLang(): Lang {
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

export default function CatchAllRedirect() {
  const { pathname } = useLocation();
  const lang = detectLang();
  const target = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  return <Navigate to={target} replace />;
}
