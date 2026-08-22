import { createFileRoute } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import ExamSimulation from "../pages/ExamSimulation";
import { createPageHead } from "../seo/head";
import { buildExamMeta } from "../seo/meta";
import { examRouteData } from "./-route-data";

export const Route = createFileRoute("/$lang/$subjectId_/exam/$examId")({
	loader: ({ params }) => examRouteData(params.subjectId, params.examId),
	head: ({ params, loaderData }) => {
		if (!loaderData) return {};
		const lang = isLang(params.lang) ? params.lang : "es";
		return createPageHead(
			buildExamMeta(
				lang,
				loaderData.subject,
				loaderData.exam,
				loaderData.stats,
			),
			false,
		);
	},
	component: ExamSimulation,
});
