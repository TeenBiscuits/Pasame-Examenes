import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import SubjectHome from "./pages/SubjectHome";
import PracticeHome from "./pages/PracticeHome";
import PracticeTopic from "./pages/PracticeTopic";
import ExamSimulation from "./pages/ExamSimulation";
import { useT } from "./i18n/hooks";
import { track } from "./lib/umami";

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    track("page_view", { path: location.pathname });
  }, [location.pathname]);

  return null;
}

function Footer() {
  const t = useT();
  return (
    <footer className="bg-card border-t border-border py-6 text-sm text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-medium">{t.footer.byline}</p>
        <a
          href="https://github.com/TeenBiscuits/Pasame-Examenes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded px-2 py-1 transition-colors"
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
    <BrowserRouter>
      <div className="min-h-svh flex flex-col bg-background text-foreground font-sans">
        <PageViewTracker />
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:subjectId" element={<SubjectHome />} />
            <Route path="/:subjectId/practice" element={<PracticeHome />} />
            <Route
              path="/:subjectId/practice/:topic"
              element={<PracticeTopic />}
            />
            <Route path="/:subjectId/exam/:year" element={<ExamSimulation />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
