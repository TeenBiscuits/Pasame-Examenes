import { createFileRoute } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import { preloadSimulatorDependencies } from "../lib/route-preloads";
import { createPageHead } from "../seo/head";
import { buildTopicMeta } from "../seo/meta";
import { getQuestionsByTopic, getTopicMegaTopicLabel } from "../subjects";
import { topicRouteData } from "./-route-data";

export const Route = createFileRoute("/$lang/$subjectId_/practice_/$topic")({
	pendingMs: 0,
	pendingMinMs: 300,
	loader: async ({ params }) => {
		const routeData = topicRouteData(params.subjectId, params.topic);
		const [questions, megatopicLabel] = await Promise.all([
			getQuestionsByTopic(params.subjectId, params.topic),
			getTopicMegaTopicLabel(params.subjectId, params.topic),
		]);
		await preloadSimulatorDependencies(questions);

		return { ...routeData, questions, megatopicLabel };
	},
	head: async ({ params, loaderData }) => {
		if (!loaderData) return {};
		const lang = isLang(params.lang) ? params.lang : "es";
		return createPageHead(
			await buildTopicMeta(
				lang,
				loaderData.subject,
				loaderData.topic,
				loaderData.stats,
			),
			false,
		);
	},
});
