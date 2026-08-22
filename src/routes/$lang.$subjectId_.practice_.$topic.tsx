import { createFileRoute } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import PracticeTopic from "../pages/PracticeTopic";
import { createPageHead } from "../seo/head";
import { buildTopicMeta } from "../seo/meta";
import { topicRouteData } from "./-route-data";

export const Route = createFileRoute("/$lang/$subjectId_/practice_/$topic")({
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
