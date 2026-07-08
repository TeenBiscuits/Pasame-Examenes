if (import.meta.env.DEV) {
  import("react-grab");
}

import "@fontsource-variable/roboto";
import "@fontsource-variable/cascadia-code";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { I18nProvider } from "./i18n/context";
import { ThemeProvider } from "./theme/context";
import {
  PrerenderDataProvider,
} from "./lib/prerender-data-provider";
import { type PrerenderData } from "./lib/prerender-data";

// Read build-time-seeded question data so the first client render matches the
// prerendered HTML (no loading flash). Absent for routes that weren't
// prerendered or after client-side navigation.
function readPrerenderData(): PrerenderData | null {
  try {
    const el = document.getElementById("__PRERENDER_DATA__");
    if (!el?.textContent) return null;
    return JSON.parse(el.textContent) as PrerenderData;
  } catch {
    return null;
  }
}

const prerenderData = readPrerenderData();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <PrerenderDataProvider data={prerenderData}>
          <App />
        </PrerenderDataProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
