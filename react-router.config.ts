import type { Config } from "@react-router/dev/config";
import { pages } from "./src/seo/pageMetaMap.generated";
import { isIndexablePagePath } from "./src/seo/meta";

const prerenderPaths: string[] = [];
for (const page of pages) {
  // Practice and exam routes are intentionally noindex and stay on the SPA fallback.
  if (isIndexablePagePath(page.pathWithoutLang)) {
    prerenderPaths.push(new URL(page.canonicalUrl).pathname);
  }
}

export default {
  appDirectory: "src",
  buildDirectory: "dist",
  ssr: false,
  prerender: {
    paths: prerenderPaths,
    concurrency: 4,
  },
} satisfies Config;
