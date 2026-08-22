import { createFileRoute } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import { createPageHead } from "../seo/head";
import { buildPrivacyMeta } from "../seo/meta";

export const Route = createFileRoute("/$lang/privacy")({
	head: ({ params }) => {
		const lang = isLang(params.lang) ? params.lang : "es";
		return createPageHead(buildPrivacyMeta(lang), false);
	},
	component: PrivacyPolicy,
});
