import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectPreferredLang } from "../i18n/detect-lang";

export const Route = createFileRoute("/$subjectId_/practice_/$topic")({
	beforeLoad: ({ location, params }) => {
		throw redirect({
			to: "/$lang/$subjectId/practice/$topic",
			params: {
				lang: detectPreferredLang(),
				subjectId: params.subjectId,
				topic: params.topic,
			},
			search: location.search,
			hash: location.hash,
			replace: true,
		});
	},
	component: () => null,
});
