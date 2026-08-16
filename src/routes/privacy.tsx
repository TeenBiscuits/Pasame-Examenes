import type { MetaFunction } from "react-router";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import { isLang } from "../i18n/context-value";
import { en } from "../i18n/en";
import { es } from "../i18n/es";
import { gl } from "../i18n/gl";

const translations = { en, es, gl } as const;

export const meta: MetaFunction = ({ params }) => {
  if (!isLang(params.lang)) {
    return [{ name: "robots", content: "noindex, nofollow" }];
  }

  const t = translations[params.lang];
  return [
    { title: `${t.footer.privacyTitle} | ${t.seo.siteName}` },
    { name: "description", content: t.footer.privacySummary },
  ];
};

export default PrivacyPolicy;
