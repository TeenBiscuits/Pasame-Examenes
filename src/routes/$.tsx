import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectPreferredLang } from "../i18n/detect-lang";

export const Route = createFileRoute("/$")({
	beforeLoad: ({ location }) => {
		const [subjectId, section, value] = location.pathname
			.replace(/^\/+/, "")
			.split("/");
		const lang = detectPreferredLang();
		const shared = {
			search: location.search,
			hash: location.hash,
			replace: true,
		} as const;

		if (section === "practice" && subjectId && value) {
			throw redirect({
				...shared,
				to: "/$lang/$subjectId/practice/$topic",
				params: { lang, subjectId, topic: value },
			});
		}

		if (section === "exam" && subjectId && value) {
			throw redirect({
				...shared,
				to: "/$lang/$subjectId/exam/$examId",
				params: { lang, subjectId, examId: value },
			});
		}

		if (subjectId && !section) {
			throw redirect({
				...shared,
				to: "/$lang/$subjectId",
				params: { lang, subjectId },
			});
		}

		if (subjectId) {
			throw redirect({
				...shared,
				to: "/$lang/$",
				params: {
					lang,
					_splat: location.pathname.replace(/^\/+/, ""),
				},
			});
		}

		throw redirect({
			...shared,
			to: "/$lang",
			params: { lang },
		});
	},
});
