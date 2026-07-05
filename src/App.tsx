import { lazy, Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./components/Header";
import StarPopup from "./components/StarPopup";
import { useLang, useT } from "./i18n/hooks";
import { track, identify, setSessionData, getDistinctId } from "./lib/umami";
import { useTheme } from "./theme/hooks";

const Home = lazy(() => import("./screens/Home"));
const SubjectHome = lazy(() => import("./screens/SubjectHome"));
const PracticeTopic = lazy(() => import("./screens/PracticeTopic"));
const ExamSimulation = lazy(() => import("./screens/ExamSimulation"));

function PageLoader() {
  return (
    <div
      className="flex items-center justify-center py-16"
      style={{ minHeight: "60svh" }}
    >
      <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function SessionTracker() {
  const { lang } = useLang();
  const { theme } = useTheme();

  useEffect(() => {
    const id = getDistinctId();
    if (id) identify({ id });
  }, []);

  useEffect(() => {
    setSessionData({ lang, theme });
  }, [lang, theme]);

  return null;
}

function CurrentPage() {
  const pathname = usePathname() ?? "/";
  const parts = pathname.split("/").filter(Boolean);
  const [paramLang, subjectId, section, value] = parts;

  if (!paramLang || !["en", "es", "gl"].includes(paramLang)) {
    return <Home />;
  }

  if (!subjectId)
    return (
      <Home />
    );
  if (section === "practice" && value)
    return (
      <PracticeTopic />
    );
  if (section === "exam" && value)
    return (
      <ExamSimulation />
    );
  return (
    <SubjectHome />
  );
}
function Footer() {
  const t = useT();
  return (
    <footer className="bg-surface-alt border-t border-border pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-sm text-fg-muted">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-medium">{t.footer.byline}</p>
        <a
          href="https://github.com/TeenBiscuits/Pasame-Examenes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-fg-muted hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded px-2 py-1 transition-colors"
          onClick={() => track("external_link_click", { target: "github" })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
            aria-hidden="true"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span>{t.footer.github}</span>
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen min-h-svh flex flex-col bg-surface text-fg font-sans">
      <SessionTracker />
      <ScrollToTop />
      <Header />
      <StarPopup />
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <CurrentPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
