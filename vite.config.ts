import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

import { isIndexableSubject } from "./src/subjects/visibility.ts";

const LANGS = ["en", "es", "gl"] as const;

function getAppVersion(): string {
	const vercelCommit = process.env.VERCEL_GIT_COMMIT_SHA?.trim();
	if (vercelCommit) return vercelCommit.slice(0, 7);

	try {
		return execFileSync("git", ["rev-parse", "--short=7", "HEAD"], {
			encoding: "utf8",
		}).trim();
	} catch {
		return "dev";
	}
}

const subjectsDirectory = fileURLToPath(
	new URL("./src/subjects/", import.meta.url),
);
const indexableSubjectIds = readdirSync(subjectsDirectory, {
	withFileTypes: true,
})
	.filter((entry) => entry.isDirectory() && isIndexableSubject(entry.name))
	.map((entry) => entry.name)
	.sort();
const prerenderPages = [
	{ path: "/" },
	...LANGS.map((lang) => ({ path: `/${lang}` })),
	...LANGS.map((lang) => ({ path: `/${lang}/privacy` })),
	...LANGS.flatMap((lang) =>
		indexableSubjectIds.map((subjectId) => ({
			path: `/${lang}/${subjectId}`,
		})),
	),
];

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	define: {
		"import.meta.env.VITE_APP_VERSION": JSON.stringify(getAppVersion()),
		"import.meta.env.VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV ?? ""),
	},
	plugins: [
		devtools(),
		nitro({ preset: "vercel", rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		imagetools({
			defaultDirectives: () =>
				new URLSearchParams("w=400;800;1200&format=avif;webp;png"),
		}),
		tanstackStart({
			prerender: {
				enabled: true,
				autoStaticPathsDiscovery: false,
				crawlLinks: false,
				failOnError: true,
			},
			pages: prerenderPages,
			router: {
				codeSplittingOptions: {
					// Evita un ciclo de chunks SSR que rompe el helper __exportAll.
					defaultBehavior: [
						["component"],
						["errorComponent"],
						["notFoundComponent"],
					],
				},
			},
		}),
		viteReact(),
	],
});

export default config;
