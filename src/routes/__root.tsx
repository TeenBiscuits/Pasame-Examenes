import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "../bones/registry";
import { isLang, type Lang } from "../i18n/context-value";
import { ssrDuringBuildPrerender } from "../lib/ssr";
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var themes=['system','light','princess','dark','latte','frappe','macchiato','mocha'];var mode=themes.indexOf(stored)>-1?stored:'system';var darkThemes=['dark','frappe','macchiato','mocha'];var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='system'?(prefersDark?'dark':'light'):(darkThemes.indexOf(mode)>-1?'dark':'light');var root=document.documentElement;root.setAttribute('data-theme',mode);root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
	ssr: ssrDuringBuildPrerender,
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "color-scheme",
				content: "light dark",
			},
			{
				id: "theme-color",
				name: "theme-color",
				content: "#ffffff",
			},
			{
				title: "Pásame Exámenes",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Pásame Exámenes",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "preconnect",
				href: "https://analytics.pablopl.dev",
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon-96x96.png?v=20260620",
				sizes: "96x96",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg?v=20260620",
			},
			{
				rel: "shortcut icon",
				href: "/favicon.ico?v=20260620",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png?v=20260620",
			},
			{
				rel: "manifest",
				href: "/site.webmanifest?v=20260620",
			},
		],
		scripts: [
			{
				id: "ahrefs-analytics",
				src: "https://analytics.ahrefs.com/analytics.js",
				"data-key": "41AHUOkOrsmT26f+Ow8zaQ",
				async: true,
			},
			{
				id: "umami-analytics",
				src: "https://analytics.pablopl.dev/script.js",
				"data-website-id": "63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4",
				"data-performance": "true",
				"data-domains": "pe.pablopl.dev",
				"data-do-not-track": "true",
				defer: true,
			},
			{
				id: "umami-recorder",
				src: "https://analytics.pablopl.dev/recorder.js",
				"data-website-id": "63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4",
				defer: true,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const documentLang = getDocumentLang(pathname);

	return (
		<html lang={documentLang} suppressHydrationWarning>
			<head>
				<script>{THEME_INIT_SCRIPT}</script>
				<HeadContent />
			</head>
			<body className="font-sans [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function getDocumentLang(pathname: string): Lang {
	const [rawLang] = pathname.split("/").filter(Boolean);
	return isLang(rawLang) ? rawLang : "es";
}
