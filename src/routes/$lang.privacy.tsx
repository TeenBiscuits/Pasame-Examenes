import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import { useLang } from "../i18n/hooks";
import { en } from "../i18n/en";
import { es } from "../i18n/es";
import { gl } from "../i18n/gl";
import { useSeoHead } from "../lib/seo";
import { useDocumentTitle } from "../lib/title";

const translations = { en, es, gl } as const;

export const Route = createFileRoute("/$lang/privacy")({
  component: PrivacyRoute,
});

function PrivacyRoute() {
  const { lang } = useLang();
  const t = translations[lang];
  const title = `${t.footer.privacyTitle} | ${t.seo.siteName}`;

  useDocumentTitle(title);
  useSeoHead({
    title,
    description: t.footer.privacySummary,
    pathWithoutLang: "/privacy",
    indexable: false,
  });

  return <PrivacyPolicy />;
}
