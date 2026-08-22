import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectPreferredLang } from "../i18n/detect-lang";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({
			to: "/$lang",
			params: { lang: detectPreferredLang() },
			replace: true,
		});
	},
	component: () => null,
});
