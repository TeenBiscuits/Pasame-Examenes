import { useEffect, type ReactNode } from "react";
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import "@fontsource-variable/onest";
import "@fontsource-variable/cascadia-code";
import "./index.css";
import "./bones/registry";
import App, { PageLoader } from "./App";
import { I18nProvider } from "./i18n/context";
import type { Lang } from "./i18n/context";
import { initializeSound } from "./lib/sound";
import { ThemeProvider } from "./theme/context";
import { themeScript } from "./theme/theme-script";
import { themeSurfaceAlt } from "./theme/types";

function langFromPathname(pathname: string): Lang {
  const match = pathname.match(/^\/(en|es|gl)(?:\/|$)/);
  return match ? (match[1] as Lang) : "es";
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const lang = langFromPathname(pathname);

  return (
    <html lang={lang} data-theme="system" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png?v=20260620"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260620" />
        <link rel="shortcut icon" href="/favicon.ico?v=20260620" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=20260620"
        />
        <meta name="apple-mobile-web-app-title" content="Pásame Exámenes" />
        <link rel="manifest" href="/site.webmanifest?v=20260620" />
        <meta
          id="theme-color"
          name="theme-color"
          content={themeSurfaceAlt.light}
        />
        <meta name="color-scheme" content="light dark" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="41AHUOkOrsmT26f+Ow8zaQ"
          async
        />
        <script
          defer
          src="https://analytics.pablopl.dev/script.js"
          data-website-id="63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4"
          data-performance="true"
          data-domains="pe.pablopl.dev"
          data-do-not-track="true"
        />
        <script
          defer
          src="https://analytics.pablopl.dev/recorder.js"
          data-website-id="63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4"
        />
        <link rel="preconnect" href="https://analytics.pablopl.dev" />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function meta() {
  return [
    { title: "Pásame Exámenes" },
    {
      name: "description",
      content:
        "Practica preguntas de exámenes de la FIC con respuestas modelo y autocorrección.",
    },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function Root() {
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

export function HydrateFallback() {
  return <PageLoader />;
}
