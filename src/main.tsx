import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { I18nProvider } from "./i18n/context";
import { ThemeProvider } from "./theme/context";
import { CmsProvider } from "./lib/cms";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <CmsProvider>
          <App />
        </CmsProvider>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);
