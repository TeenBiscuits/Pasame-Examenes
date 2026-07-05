"use client";

import { StrictMode, useEffect } from "react";
import App from "../../../App";
import type { Lang } from "../../../i18n/context";
import { I18nProvider } from "../../../i18n/context";
import { ThemeProvider } from "../../../theme/context";

export default function ClientApp({ lang }: { lang: Lang }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      import("react-grab");
    }
  }, []);

  return (
    <StrictMode>
      <ThemeProvider>
        <I18nProvider initialLang={lang}>
          <App />
        </I18nProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
