import { useEffect } from "react";
import { createRootRoute, useLocation } from "@tanstack/react-router";
import App from "../App";
import { I18nProvider } from "../i18n/context";
import type { Lang } from "../i18n/context";
import { initializeSound } from "../lib/sound";
import { ThemeProvider } from "../theme/context";

function langFromPathname(pathname: string): Lang {
  const match = pathname.match(/^\/(en|es|gl)(?:\/|$)/);
  return match ? (match[1] as Lang) : "es";
}

function Root() {
  const { pathname } = useLocation();

  useEffect(() => {
    initializeSound();
    if (import.meta.env.DEV) void import("react-grab");
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider initialLang={langFromPathname(pathname)}>
        <App />
      </I18nProvider>
    </ThemeProvider>
  );
}

export const Route = createRootRoute({
  component: Root,
});
