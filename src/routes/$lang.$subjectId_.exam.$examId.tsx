import { createFileRoute } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import { preloadSimulatorDependencies } from "../lib/route-preloads";
import { createPageHead } from "../seo/head";
import { buildExamMeta } from "../seo/meta";
import { getQuestionsByExam, getTopicMegaTopicLabel } from "../subjects";
import { examRouteData } from "./-route-data";

export const Route = createFileRoute("/$lang/$subjectId_/exam/$examId")({
	pendingMs: 0,
	pendingMinMs: 300,
	loader: async ({ params }) => {
		const routeData = examRouteData(params.subjectId, params.examId);
		const questions = await getQuestionsByExam(params.subjectId, params.examId);
		const entriesPromise = Promise.all(
			[...new Set(questions.map((question) => question.topic))].map(
				async (topic) =>
					[
						topic,
						await getTopicMegaTopicLabel(params.subjectId, topic),
					] as const,
			),
		);
		const dependenciesPromise = preloadSimulatorDependencies(questions);
		const [entries] = await Promise.all([entriesPromise, dependenciesPromise]);
		const megatopicLabels: Record<string, string> = {};
		for (const [topic, label] of entries) {
			if (label != null) megatopicLabels[topic] = label;
		}
		return { ...routeData, questions, megatopicLabels };
	},
	head: async ({ params, loaderData }) => {
		if (!loaderData) return {};
		const lang = isLang(params.lang) ? params.lang : "es";
		return createPageHead(
			await buildExamMeta(
				lang,
				loaderData.subject,
				loaderData.exam,
				loaderData.stats,
			),
			false,
		);
	},
});
