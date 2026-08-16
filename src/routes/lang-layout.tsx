import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router";
import { useLang } from "../i18n/hooks";
import type { Lang } from "../i18n/context";
import { isLang } from "../i18n/context-value";

function detectBrowserLang(): Lang {
  if (typeof navigator === "undefined") return "es";
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const preferredLanguage of languages) {
    const language = preferredLanguage.toLowerCase();
    if (language.startsWith("en")) return "en";
    if (language.startsWith("es")) return "es";
    if (language.startsWith("gl")) return "gl";
  }
  return "es";
}

export default function LangLayout() {
  const { lang: paramLang } = useParams<{ lang: string }>();
  const { pathname, search, hash } = useLocation();
  const { lang, setLang } = useLang();
  const validLang = isLang(paramLang) ? paramLang : null;

  useEffect(() => {
    if (validLang && validLang !== lang) setLang(validLang);
  }, [validLang, lang, setLang]);

  if (!validLang) {
    return (
      <Navigate
        to={`/${detectBrowserLang()}${pathname}${search}${hash}`}
        replace
      />
    );
  }

  return <Outlet />;
}
