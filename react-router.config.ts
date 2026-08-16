import type { Config } from "@react-router/dev/config";
import { pages } from "./src/seo/pageMetaMap.generated";

const prerenderPaths: string[] = [];
for (const page of pages) {
  const pathSegments = page.pathWithoutLang.split("/").filter(Boolean);
  if (pathSegments.length <= 1) {
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
