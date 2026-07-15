if (import.meta.env.DEV) {
  import("react-grab");
}

import "@fontsource-variable/onest";
import "@fontsource-variable/cascadia-code";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { I18nProvider } from "./i18n/context";
import { ThemeProvider } from "./theme/context";
import { SoundProvider } from "./sound/context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SoundProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </SoundProvider>
    </ThemeProvider>
  </StrictMode>,
);
