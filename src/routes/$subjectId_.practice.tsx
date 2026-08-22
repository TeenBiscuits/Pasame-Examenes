import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectPreferredLang } from "../i18n/detect-lang";

export const Route = createFileRoute("/$subjectId_/practice")({
	beforeLoad: ({ location, params }) => {
		throw redirect({
			to: "/$lang/$subjectId",
			params: { lang: detectPreferredLang(), subjectId: params.subjectId },
			search: location.search,
			hash: location.hash,
			replace: true,
		});
	},
	component: () => null,
});
