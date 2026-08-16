import type { Config } from "@react-router/dev/config";
import { pages } from "./src/seo/pageMetaMap.generated";

const prerenderPaths = pages
  .filter((page) => page.pathWithoutLang.split("/").filter(Boolean).length <= 1)
  .map((page) => new URL(page.canonicalUrl).pathname);

export default {
  appDirectory: "src",
  buildDirectory: "dist",
  ssr: false,
  prerender: {
    paths: prerenderPaths,
    concurrency: 4,
  },
} satisfies Config;
