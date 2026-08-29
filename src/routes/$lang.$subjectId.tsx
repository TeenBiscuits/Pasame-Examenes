import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import { ssrDuringBuildPrerender } from "../lib/ssr";
import SubjectHome from "../pages/SubjectHome";
import { createPageHead } from "../seo/head";
import { buildSubjectMeta } from "../seo/meta";
import { getSubject } from "../subjects";
import { isIndexableSubject } from "../subjects/visibility";
import { subjectBuildStats, subjectRouteData } from "./-route-data";

export const Route = createFileRoute("/$lang/$subjectId")({
	ssr: ssrDuringBuildPrerender,
	loader: ({ params }) => {
		const subject = subjectRouteData(params.subjectId);
		return {
			stats: subjectBuildStats(subject),
		};
	},
	staleTime: Infinity,
	head: async ({ params, loaderData }) => {
		const subject = getSubject(params.subjectId);
		if (!subject) return {};

		const lang = isLang(params.lang) ? params.lang : "es";
		return createPageHead(
			await buildSubjectMeta(lang, subject, {
				questionCount: loaderData?.stats.questionCount ?? 0,
			}),
			isIndexableSubject(subject.id),
		);
	},
	component: SubjectRoute,
});

const subjectRouteApi = getRouteApi("/$lang/$subjectId");

function SubjectRoute() {
	const loaderData = subjectRouteApi.useLoaderData();
	return <SubjectHome buildStats={loaderData.stats} />;
}
