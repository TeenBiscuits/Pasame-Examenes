import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "../index.css";

const siteUrl = process.env.SITE_URL || "https://pe.pablopl.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pásame Exámenes",
    template: "%s — Pásame Exámenes",
  },
  description:
    "Practica exámenes universitarios con respuestas modelo y autocorrección. Preguntas tipo test, de desarrollo y de emparejar de exámenes anteriores.",
  applicationName: "Pásame Exámenes",
  appleWebApp: {
    title: "Pásame Éxamenes",
  },
  manifest: "/site.webmanifest?v=20260620",
  openGraph: {
    title: "Pásame Exámenes",
    description:
      "Plataforma de código abierto para practicar exámenes universitarios por tema o simular el examen completo.",
    url: siteUrl,
    siteName: "Pásame Exámenes",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pásame Exámenes",
    description:
      "Plataforma de código abierto para practicar exámenes universitarios por tema o simular el examen completo.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png?v=20260620", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg?v=20260620", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico?v=20260620",
    apple: [{ url: "/apple-touch-icon.png?v=20260620", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f9fafb",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){var t=localStorage.getItem("theme")||"system";document.documentElement.setAttribute("data-theme",t);var colors={light:"#ffffff",dark:"#1f2937",pink:"#ffffff",catppuccin:"#313244"};var color=colors[t];if(t==="system"){color=window.matchMedia("(prefers-color-scheme: dark)").matches?colors.dark:colors.light;}var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute("content",color);})();`}
        </Script>
        {children}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="41AHUOkOrsmT26f+Ow8zaQ"
          strategy="afterInteractive"
        />
        <Script
          src="https://analytics.pablopl.dev/script.js"
          data-website-id="63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4"
          data-performance="true"
          data-domains="pe.pablopl.dev"
          data-do-not-track="true"
          strategy="lazyOnload"
        />
        <Script
          src="https://analytics.pablopl.dev/recorder.js"
          data-website-id="63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
