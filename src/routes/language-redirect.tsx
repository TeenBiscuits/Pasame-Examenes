import { Navigate, useLocation } from "react-router";
import { detectPreferredLang } from "../i18n/detect-lang";

export default function LanguageRedirect() {
  const { pathname, search, hash } = useLocation();
  const lang = detectPreferredLang();
  const path = pathname === "/" ? "" : pathname;

  return <Navigate to={`/${lang}${path}${search}${hash}`} replace />;
}
