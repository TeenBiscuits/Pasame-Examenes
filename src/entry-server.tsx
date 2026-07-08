import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppContent, type AppPages } from "./App";
import { I18nProvider } from "./i18n/context";
import type { Lang } from "./i18n/context";
import { ThemeProvider } from "./theme/context";
import { PrerenderDataProvider } from "./lib/prerender-data-provider";
import type { PrerenderData } from "./lib/prerender-data";
import { getAllQuestions } from "./subjects";
import Home from "./pages/Home";
import SubjectHome from "./pages/SubjectHome";
import PracticeTopic from "./pages/PracticeTopic";
import ExamSimulation from "./pages/ExamSimulation";

// Eager imports so the SSR render produces real content (React's `lazy`
// would suspend and `renderToStaticMarkup` would only emit the Suspense
// fallback). The client build still code-splits via the `lazy()` wrappers in
// App.tsx.
const pages: AppPages = {
  Home,
  SubjectHome,
  PracticeTopic,
  ExamSimulation,
};

export interface RenderInput {
  path: string;
  lang: Lang;
}

export interface RenderResult {
  bodyHtml: string;
  preloadData: PrerenderData | null;
}

function extractSubjectId(path: string): string | undefined {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2) return undefined;
  try {
    return decodeURIComponent(segments[1]);
  } catch {
    return segments[1];
  }
}

export async function render({
  path,
  lang,
}: RenderInput): Promise<RenderResult> {
  const subjectId = extractSubjectId(path);

  let preloadData: PrerenderData | null = null;
  if (subjectId) {
    try {
      const questions = await getAllQuestions(subjectId);
      if (questions.length > 0) {
        preloadData = { [subjectId]: questions };
      }
    } catch {
      /* skip preload; the page will lazy-load on the client */
    }
  }

  const bodyHtml = renderToStaticMarkup(
    <StaticRouter location={path}>
      <ThemeProvider>
        <I18nProvider initialLang={lang}>
          <PrerenderDataProvider data={preloadData}>
            <AppContent pages={pages} />
          </PrerenderDataProvider>
        </I18nProvider>
      </ThemeProvider>
    </StaticRouter>,
  );

  return { bodyHtml, preloadData };
}
