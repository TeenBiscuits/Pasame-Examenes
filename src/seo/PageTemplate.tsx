/* @jsxRuntime automatic */
import type { PageMetaData } from "./meta";

const themeScript = `(function () {
  var t = localStorage.getItem("theme") || "system";
  document.documentElement.setAttribute("data-theme", t);

  var colors = {
    light: "#ffffff",
    dark: "#1f2937",
    pink: "#ffffff",
    catppuccin: "#313244",
  };
  var color = colors[t];
  if (t === "system") {
    color = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? colors.dark
      : colors.light;
  }
  var meta = document.getElementById("theme-color");
  if (meta) meta.setAttribute("content", color);
})();`;

export default function PageTemplate(page: PageMetaData) {
  return (
    <html lang={page.lang}>
      <head>
        <meta charSet="UTF-8" />
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
        <meta name="apple-mobile-web-app-title" content={page.siteName} />
        <link rel="manifest" href="/site.webmanifest?v=20260620" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta id="theme-color" name="theme-color" content="#f9fafb" />
        <meta name="color-scheme" content="light dark" />
        <script>{themeScript}</script>
        <title>{page.title}</title>
        <meta
          id="meta-description"
          name="description"
          content={page.description}
        />
        <link id="link-canonical" rel="canonical" href={page.canonicalUrl} />
        {page.alternates.map((alternate) => (
          <link
            key={alternate.lang}
            id={`link-hreflang-${alternate.lang}`}
            rel="alternate"
            hrefLang={alternate.lang}
            href={alternate.href}
          />
        ))}
        <meta id="og:title" property="og:title" content={page.title} />
        <meta
          id="og:description"
          property="og:description"
          content={page.description}
        />
        <meta id="og:image" property="og:image" content={page.ogImage} />
        <meta
          id="og:image:type"
          property="og:image:type"
          content={page.ogImageType}
        />
        <meta id="og:image:width" property="og:image:width" content="1200" />
        <meta id="og:image:height" property="og:image:height" content="630" />
        <meta id="og:url" property="og:url" content={page.canonicalUrl} />
        <meta
          id="og:site_name"
          property="og:site_name"
          content={page.siteName}
        />
        <meta id="og:type" property="og:type" content="website" />
        <meta id="og:locale" property="og:locale" content={page.locale} />
        <meta id="twitter:title" name="twitter:title" content={page.title} />
        <meta
          id="twitter:description"
          name="twitter:description"
          content={page.description}
        />
        <meta
          id="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta id="twitter:image" name="twitter:image" content={page.ogImage} />
        <script type="application/ld+json" id="schema-jsonld">
          {page.jsonLd}
        </script>
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
        <div id="root"></div>
      </body>
    </html>
  );
}
