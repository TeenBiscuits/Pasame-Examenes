import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  createFileRoute,
  useLocation,
} from "@tanstack/react-router";
import { useLang } from "../i18n/hooks";
import { isLang } from "../i18n/context-value";
import { detectPreferredLang } from "../i18n/detect-lang";
import { buildLocationSuffix } from "../lib/lang-link-utils";

export const Route = createFileRoute("/$lang")({
  component: LangLayout,
});

function LangLayout() {
  const { lang: paramLang } = Route.useParams();
  const location = useLocation();
  const { setLang } = useLang();
  const validLang = isLang(paramLang) ? paramLang : null;

  useEffect(() => {
    if (validLang) setLang(validLang);
  }, [validLang, setLang]);

  if (!validLang) {
    const destination = `/${detectPreferredLang()}${location.pathname}${buildLocationSuffix(
      location.searchStr,
      location.hash,
    )}`;

    return <Navigate to={destination as never} replace />;
  }

  return <Outlet />;
}
