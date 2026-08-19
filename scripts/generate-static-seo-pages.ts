import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import {
  DEFAULT_LANG,
  buildCanonicalPath,
  isIndexablePagePath,
} from "../src/seo/meta";
import { pages } from "../src/seo/pageMetaMap.generated";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const distDir = resolve(root, "dist");
const indexPath = resolve(distDir, "index.html");
const spaFallbackPath = resolve(distDir, "_spa-fallback.html");

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeJsonLd(value: string): string {
  return value.replace(/</g, "\\u003c");
}

function staticSeoTags(page: (typeof pages)[number]): string {
  const namedMeta = (id: string, name: string, content: string) =>
    `<meta id="${id}" name="${name}" content="${escapeHtml(content)}" />`;
  const propertyMeta = (id: string, property: string, content: string) =>
    `<meta id="${id}" property="${property}" content="${escapeHtml(content)}" />`;
  const link = (id: string, rel: string, href: string, extra = "") =>
    `<link id="${id}" rel="${rel}" href="${escapeHtml(href)}"${extra} />`;

  const alternates = page.alternates
    .map((alternate) => {
      const id =
        alternate.lang === "x-default"
          ? "link-hreflang-x-default"
          : `link-hreflang-${alternate.lang}`;
      return link(
        id,
        "alternate",
        alternate.href,
        ` hreflang="${alternate.lang}"`,
      );
    })
    .join("\n    ");

  return [
    propertyMeta("og:title", "og:title", page.title),
    propertyMeta("og:description", "og:description", page.description),
    propertyMeta("og:image", "og:image", page.ogImage),
    propertyMeta("og:image:type", "og:image:type", page.ogImageType),
    propertyMeta("og:image:width", "og:image:width", "1200"),
    propertyMeta("og:image:height", "og:image:height", "630"),
    propertyMeta("og:url", "og:url", page.canonicalUrl),
    propertyMeta("og:site_name", "og:site_name", page.siteName),
    propertyMeta("og:type", "og:type", "website"),
    propertyMeta("og:locale", "og:locale", page.locale),
    namedMeta("twitter:title", "twitter:title", page.title),
    namedMeta("twitter:description", "twitter:description", page.description),
    namedMeta("twitter:card", "twitter:card", "summary_large_image"),
    namedMeta("twitter:image", "twitter:image", page.ogImage),
    link("link-canonical", "canonical", page.canonicalUrl),
    alternates,
    `<script id="schema-jsonld" type="application/ld+json">${escapeJsonLd(page.jsonLd)}</script>`,
  ].join("\n    ");
}

function renderPage(
  baseHtml: string,
  page: (typeof pages)[number],
  bodyMarkup: string,
): string {
  const html = baseHtml
    .replace(/<html lang="[^"]*"/, `<html lang="${page.lang}"`)
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(page.title)}</title>`,
    )
    .replace(
      /<meta\s+id="meta-description"[\s\S]*?\/>/,
      `<meta id="meta-description" name="description" content="${escapeHtml(page.description)}" />`,
    )
    .replace(
      /<meta\s+id="meta-robots"[\s\S]*?\/>/,
      `<meta id="meta-robots" name="robots" content="index, follow" />`,
    )
    .replace(/<div id="root"><\/div>/, `<div id="root">${bodyMarkup}</div>`)
    .replace(/<\/head>/, `    ${staticSeoTags(page)}\n  </head>`);

  return html;
}

function outputPath(page: (typeof pages)[number]): string {
  const path = page.pathWithoutLang === "/" ? "" : page.pathWithoutLang;
  return resolve(distDir, page.lang, path.slice(1), "index.html");
}

function clientEntryPath(baseHtml: string): string {
  const entry = baseHtml.match(
    /<script type="module" crossorigin src="([^"]+)"/,
  )?.[1];

  if (!entry) {
    throw new Error("Could not find the built client entry in dist/index.html");
  }

  return resolve(distDir, entry.replace(/^\/+/, ""));
}

async function waitForClientRender(
  rootElement: HTMLElement,
  previousMarkup: string | undefined,
): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await window.happyDOM.whenAsyncComplete();

    const bodyMarkup = rootElement.innerHTML.trim();
    if (
      bodyMarkup &&
      rootElement.querySelector("h1") &&
      (!previousMarkup || bodyMarkup !== previousMarkup)
    ) {
      return bodyMarkup;
    }
  }

  throw new Error("Client prerender did not settle on new page content");
}

async function main() {
  const baseHtml = readFileSync(
    existsSync(spaFallbackPath) ? spaFallbackPath : indexPath,
    "utf-8",
  );
  const indexablePages = pages.filter((page) =>
    isIndexablePagePath(page.pathWithoutLang),
  );
  const defaultHomePage = indexablePages.find(
    (page) => page.lang === DEFAULT_LANG && page.pathWithoutLang === "/",
  );
  if (!defaultHomePage) {
    throw new Error("Could not find the default-language home page metadata");
  }
  const firstPath = buildCanonicalPath(
    indexablePages[0].lang,
    indexablePages[0].pathWithoutLang,
  );
  const entryPath = clientEntryPath(baseHtml);

  GlobalRegistrator.register({ url: `http://localhost${firstPath}` });

  try {
    document.body.innerHTML = '<div id="root"></div>';
    await import(`${pathToFileURL(entryPath).href}?prerender=1`);

    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("The prerendered app root element is missing");
    }

    let previousMarkup: string | undefined;
    let defaultHomeHtml: string | undefined;
    for (const [index, page] of indexablePages.entries()) {
      const routePath = buildCanonicalPath(page.lang, page.pathWithoutLang);
      if (index > 0) {
        window.history.pushState({}, "", routePath);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }

      const bodyMarkup = await waitForClientRender(rootElement, previousMarkup);
      previousMarkup = bodyMarkup;

      const path = outputPath(page);
      const pageHtml = renderPage(baseHtml, page, bodyMarkup);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, pageHtml, "utf-8");
      if (page === defaultHomePage) defaultHomeHtml = pageHtml;
    }

    if (!defaultHomeHtml) {
      throw new Error("Could not render the default-language home page");
    }

    writeFileSync(spaFallbackPath, baseHtml, "utf-8");
    writeFileSync(indexPath, defaultHomeHtml, "utf-8");
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await GlobalRegistrator.unregister();
  }

  console.log(
    `✓ Generated ${indexablePages.length} static SEO pages → ${distDir}`,
  );
}

main().catch((error: unknown) => {
  console.error("Failed to prerender static SEO pages:", error);
  process.exitCode = 1;
});
