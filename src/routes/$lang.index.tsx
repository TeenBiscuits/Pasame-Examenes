import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import { ssrDuringBuildPrerender } from "../lib/ssr";
import Home from "../pages/Home";
import { createPageHead } from "../seo/head";
import { buildHomeMeta } from "../seo/meta";
import { homepageRouteData } from "./-route-data";

export const Route = createFileRoute("/$lang/")({
	params: {
		parse: (params: Record<string, string>) =>
			isLang(params.lang) ? params : false,
	},
	ssr: ssrDuringBuildPrerender,
	loader: homepageRouteData,
	staleTime: Infinity,
	head: async ({ params }) => {
		const lang = isLang(params.lang) ? params.lang : "es";
		return createPageHead(await buildHomeMeta(lang));
	},
	component: HomeRoute,
});

const homeRouteApi = getRouteApi("/$lang/");

function HomeRoute() {
	return <Home subjectStats={homeRouteApi.useLoaderData()} />;
}
