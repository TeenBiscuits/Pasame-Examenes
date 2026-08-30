import { TanStackDevtools } from "@tanstack/react-devtools";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "../bones/registry";
import onestFontUrl from "@fontsource-variable/onest/files/onest-latin-wght-normal.woff2?url";
import { isLang, type Lang } from "../i18n/context-value";
import { ssrDuringBuildPrerender } from "../lib/ssr";
import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var themes=['light','princess','latte','dark','frappe','macchiato','mocha'];var lightThemes=['light','princess','latte'];var darkThemes=['dark','frappe','macchiato','mocha'];var storedScheme=window.localStorage.getItem('theme-color-scheme');var storedLight=window.localStorage.getItem('theme-light');var storedDark=window.localStorage.getItem('theme-dark');var hasPreferences=storedScheme!==null||storedLight!==null||storedDark!==null;var legacy=window.localStorage.getItem('theme');if(!hasPreferences&&legacy&&legacy!=='system'&&themes.indexOf(legacy)>-1){if(lightThemes.indexOf(legacy)>-1){storedLight=legacy;storedScheme='light';}else{storedDark=legacy;storedScheme='dark';}}var scheme=storedScheme==='light'||storedScheme==='dark'||storedScheme==='system'?storedScheme:'system';var light=lightThemes.indexOf(storedLight)>-1?storedLight:'light';var dark=darkThemes.indexOf(storedDark)>-1?storedDark:'dark';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var active=scheme==='dark'?dark:scheme==='light'?light:(prefersDark?dark:light);var resolved=darkThemes.indexOf(active)>-1?'dark':'light';var root=document.documentElement;root.setAttribute('data-theme',active);root.style.colorScheme=scheme==='system'?'light dark':resolved;}catch(e){}})();`;

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
				rel: "preload",
				as: "font",
				type: "font/woff2",
				href: onestFontUrl,
				crossOrigin: "anonymous",
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
						hotkeysDevtoolsPlugin(),
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
