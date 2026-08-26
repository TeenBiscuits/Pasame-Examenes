import { createFileRoute } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import ExamSimulation, { ExamSimulationPending } from "../pages/ExamSimulation";
import { createPageHead } from "../seo/head";
import { buildExamMeta } from "../seo/meta";
import { examRouteData } from "./-route-data";

export const Route = createFileRoute("/$lang/$subjectId_/exam/$examId")({
	pendingMs: 0,
	pendingMinMs: 300,
	pendingComponent: ExamSimulationPending,
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
