import {
	createFileRoute,
	getRouteApi,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import { bind as bindCuelume } from "cuelume";
import { type ReactNode, useEffect } from "react";
import AppUpdateToast from "../components/AppUpdateToast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NotFoundPage from "../components/NotFoundPage";
import StarPopup from "../components/StarPopup";
import { I18nProvider } from "../i18n/context";
import { isLang } from "../i18n/context-value";
import { detectPreferredLang } from "../i18n/detect-lang";
import { useLang, useT } from "../i18n/hooks";
import { initializeSound } from "../lib/sound";
import { ssrDuringBuildPrerender } from "../lib/ssr";
import { getDistinctId, identify, setSessionData } from "../lib/umami";
import { createNoIndexHead } from "../seo/head";
import { buildNotFoundMeta } from "../seo/meta";
import { ThemeProvider } from "../theme/context";
import { useTheme } from "../theme/hooks";

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
	head: ({ params }) => {
		const lang = isLang(params.lang) ? params.lang : "es";
		return createNoIndexHead(buildNotFoundMeta(lang));
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
			<I18nProvider initialLang={lang}>
				<AppChrome>
					<Outlet />
				</AppChrome>
			</I18nProvider>
		</ThemeProvider>
	);
}

function LangNotFound() {
	const { lang: rawLang } = langRouteApi.useParams();
	const lang = isLang(rawLang) ? rawLang : "es";

	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);

	return (
		<ThemeProvider>
			<I18nProvider initialLang={lang}>
				<AppChrome>
					<NotFoundPage />
				</AppChrome>
			</I18nProvider>
		</ThemeProvider>
	);
}

function SessionTracker() {
	const { lang } = useLang();
	const { theme } = useTheme();

	useEffect(() => {
		const id = getDistinctId();
		if (id) identify({ id });
	}, []);

	useEffect(() => {
		setSessionData({ lang, theme });
	}, [lang, theme]);

	return null;
}

function AppChrome({ children }: { children: ReactNode }) {
	const t = useT();

	useEffect(() => {
		bindCuelume();
		initializeSound();
	}, []);

	return (
		<div className="bg-surface text-fg flex min-h-screen min-h-svh min-h-dvh flex-col font-sans">
			<SessionTracker />
			<a
				href="#main-content"
				className="focus-visible:ring-accent sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-fg focus-visible:ring-2 focus-visible:outline-none"
			>
				{t.header.skipToContent}
			</a>
			<Header />
			<main id="main-content" tabIndex={-1} className="flex-grow">
				{children}
			</main>
			<Footer />
			<AppUpdateToast />
			<StarPopup />
		</div>
	);
}
