/* eslint-disable react-refresh/only-export-components */
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useMatches,
  isRouteErrorResponse,
  type LinksFunction,
  type MetaFunction,
} from "react-router";
import { useEffect } from "react";
import { I18nProvider } from "../src/i18n/context";
import { ThemeProvider } from "../src/theme/context";
import Header from "../src/components/Header";
import { useLang, useT } from "../src/i18n/hooks";
import { useTheme } from "../src/theme/hooks";
import { track, identify } from "../src/lib/umami";
import "../src/index.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SessionTracker() {
  const { lang } = useLang();
  const { theme } = useTheme();
  useEffect(() => {
    identify({ lang, theme });
  }, [lang, theme]);
  return null;
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

export const meta: MetaFunction = () => [
  { title: "Pásame Exámenes" },
];

export const links: LinksFunction = () => [
  {
    rel: "icon",
    type: "image/png",
    href: "/favicon-96x96.png?v=20260620",
    sizes: "96x96",
  },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=20260620" },
  { rel: "shortcut icon", href: "/favicon.ico?v=20260620" },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png?v=20260620",
  },
  { rel: "manifest", href: "/site.webmanifest?v=20260620" },
  { rel: "preconnect", href: "https://analytics.pablopl.dev" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const langMatch = matches
    .flatMap((m) => Object.values(m.params))
    .find((p): p is string => typeof p === "string" ? ["en", "es", "gl"].includes(p) : false) || "es";

  return (
    <html lang={langMatch} data-theme="system">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta id="theme-color" name="theme-color" content="#f9fafb" />
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var t = localStorage.getItem("theme") || "system";
  document.documentElement.setAttribute("data-theme", t);
  var colors = { light: "#ffffff", dark: "#1f2937", pink: "#ffffff", catppuccin: "#313244" };
  var color = colors[t];
  if (t === "system") {
    color = window.matchMedia("(prefers-color-scheme: dark)").matches ? colors.dark : colors.light;
  }
  var meta = document.getElementById("theme-color");
  if (meta) meta.setAttribute("content", color);
})();
            `.trim(),
          }}
        />
        <Meta />
        <Links />
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
        />
        <script
          defer
          src="https://analytics.pablopl.dev/recorder.js"
          data-website-id="63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4"
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <div className="min-h-screen min-h-svh flex flex-col bg-surface text-fg font-sans">
          <SessionTracker />
          <ScrollToTop />
          <Header />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-fg p-4">
      <h1 className="text-4xl font-bold mb-4">{message}</h1>
      <p className="text-fg-secondary">{details}</p>
      <a href="/" className="mt-6 text-accent hover:underline">
        Go back home
      </a>
    </div>
  );
}
