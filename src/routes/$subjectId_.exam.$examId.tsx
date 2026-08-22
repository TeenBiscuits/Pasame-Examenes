import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectPreferredLang } from "../i18n/detect-lang";

export const Route = createFileRoute("/$subjectId_/exam/$examId")({
	beforeLoad: ({ location, params }) => {
		throw redirect({
			to: "/$lang/$subjectId/exam/$examId",
			params: {
				lang: detectPreferredLang(),
				subjectId: params.subjectId,
				examId: params.examId,
			},
			search: location.search,
			hash: location.hash,
			replace: true,
		});
	},
	component: () => null,
});
