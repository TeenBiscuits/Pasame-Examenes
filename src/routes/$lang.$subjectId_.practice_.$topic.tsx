import { createFileRoute } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import PracticeTopic, { PracticeTopicPending } from "../pages/PracticeTopic";
import { createPageHead } from "../seo/head";
import { buildTopicMeta } from "../seo/meta";
import { topicRouteData } from "./-route-data";

export const Route = createFileRoute("/$lang/$subjectId_/practice_/$topic")({
	pendingMs: 0,
	pendingMinMs: 300,
	pendingComponent: PracticeTopicPending,
	loader: ({ params }) => topicRouteData(params.subjectId, params.topic),
	head: ({ params, loaderData }) => {
		if (!loaderData) return {};
		const lang = isLang(params.lang) ? params.lang : "es";
		return createPageHead(
			buildTopicMeta(
				lang,
				loaderData.subject,
				loaderData.topic,
				loaderData.stats,
			),
			false,
		);
	},
	component: PracticeTopic,
});
