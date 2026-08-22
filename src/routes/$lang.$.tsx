import { createFileRoute, notFound } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";

export const Route = createFileRoute("/$lang/$")({
	params: {
		parse: (params: Record<string, string>) =>
			isLang(params.lang) ? params : false,
	},
	beforeLoad: () => {
		throw notFound();
	},
	component: () => null,
});
