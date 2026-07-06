import { LangLink as Link } from "../lib/lang-link";
import { useT } from "../i18n/hooks";
import { useDocumentTitle } from "../lib/title";

export default function NotFound() {
  const t = useT();
  useDocumentTitle(`404 — ${t.home.title}`);

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in animate-duration-fast">
      <p className="text-sm font-mono text-fg-muted mb-3">404</p>
      <h1 className="text-3xl font-semibold text-fg mb-4">
        {t.subjectHome.notFound}
      </h1>
      <p className="text-fg-secondary mb-8">{t.seo.defaultDescription}</p>
      <Link to="/" className="text-accent hover:underline font-medium">
        {t.subjectHome.returnHome}
      </Link>
    </div>
  );
}
