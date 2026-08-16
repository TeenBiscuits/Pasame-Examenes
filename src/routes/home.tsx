import type { MetaFunction } from "react-router";
import Home from "../pages/Home";
import { isLang } from "../i18n/context-value";
import { buildHomeMeta } from "../seo/meta";
import { pageMetaDescriptors } from "../seo/route-meta";

export const meta: MetaFunction = ({ params }) => {
  if (!isLang(params.lang)) {
    return [{ name: "robots", content: "noindex, nofollow" }];
  }
  return pageMetaDescriptors(buildHomeMeta(params.lang));
};

export default Home;
