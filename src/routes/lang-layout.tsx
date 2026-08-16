import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router";
import { useLang } from "../i18n/hooks";
import { isLang } from "../i18n/context-value";
import { detectPreferredLang } from "../i18n/detect-lang";

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
        to={`/${detectPreferredLang()}${pathname}${search}${hash}`}
        replace
      />
    );
  }

  return <Outlet />;
}
