import {
	createFileRoute,
	getRouteApi,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { Suspense, useEffect } from "react";
import AppChrome from "../components/AppChrome";
import LangNotFound from "../components/LangNotFound";
import { I18nProvider } from "../i18n/context";
import { isLang } from "../i18n/context-value";
import { detectPreferredLang } from "../i18n/detect-lang";
import { ssrDuringBuildPrerender } from "../lib/ssr";
import { createNoIndexHead } from "../seo/head";
import { buildNotFoundMeta } from "../seo/meta";
import { ThemeProvider } from "../theme/context";

export const Route = createFileRoute("/$lang")({
	ssr: ssrDuringBuildPrerender,
	beforeLoad: ({ location, params }) => {
		if (isLang(params.lang)) return;

		const segments = location.pathname.split("/").filter(Boolean);
		const [subjectId, section, value] = segments;
		const lang = detectPreferredLang();

		if (subjectId && segments.length === 1) {
			throw redirect({
				to: "/$lang/$subjectId",
				params: { lang, subjectId },
				search: location.search,
				hash: location.hash,
				replace: true,
			});
		}

		if (subjectId && section === "practice" && value) {
			throw redirect({
				to: "/$lang/$subjectId/practice/$topic",
				params: { lang, subjectId, topic: value },
				search: location.search,
				hash: location.hash,
				replace: true,
			});
		}

		if (subjectId && section === "exam" && value) {
			throw redirect({
				to: "/$lang/$subjectId/exam/$examId",
				params: { lang, subjectId, examId: value },
				search: location.search,
				hash: location.hash,
				replace: true,
			});
		}

		throw redirect({
			to: "/$lang/$",
			params: { lang, _splat: segments.join("/") },
			search: location.search,
			hash: location.hash,
			replace: true,
		});
	},
	head: async ({ params }) => {
		const lang = isLang(params.lang) ? params.lang : "es";
		return createNoIndexHead(await buildNotFoundMeta(lang));
	},
	component: LangLayout,
	notFoundComponent: LangNotFound,
});

const langRouteApi = getRouteApi("/$lang");

function LangLayout() {
	const { lang: rawLang } = langRouteApi.useParams();
	const lang = isLang(rawLang) ? rawLang : "es";

	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);

	return (
		<ThemeProvider>
			<Suspense fallback={<LanguageLoadingFallback />}>
				<I18nProvider initialLang={lang}>
					<AppChrome>
						<Outlet />
					</AppChrome>
				</I18nProvider>
			</Suspense>
		</ThemeProvider>
	);
}

function LanguageLoadingFallback() {
	return (
		<main
			className="bg-surface text-fg flex min-h-screen min-h-svh min-h-dvh items-center justify-center font-sans"
			aria-busy="true"
		>
			<div className="text-fg-muted text-sm">…</div>
		</main>
	);
}
