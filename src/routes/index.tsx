import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { detectPreferredLang } from "../i18n/detect-lang";
import { ssrDuringBuildPrerender } from "../lib/ssr";
import { createRedirectFallbackHead } from "../seo/head";
import { buildHomeMeta, DEFAULT_LANG } from "../seo/meta";

export const Route = createFileRoute("/")({
	ssr: ssrDuringBuildPrerender,
	head: async () =>
		createRedirectFallbackHead(await buildHomeMeta(DEFAULT_LANG)),
	component: RootFallback,
});

function RootFallback() {
	const navigate = useNavigate();

	useEffect(() => {
		void navigate({
			to: "/$lang",
			params: { lang: detectPreferredLang() },
			replace: true,
		});
	}, [navigate]);

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-prose flex-col justify-center gap-6 px-4 py-10">
			<h1 className="text-fg text-3xl font-bold tracking-tight sm:text-4xl">
				Pásame Exámenes
			</h1>
			<div className="text-fg-secondary space-y-2 leading-relaxed">
				<p lang="es">
					Si no eres redirigido automáticamente, pulsa{" "}
					<Link
						to="/$lang"
						params={{ lang: "es" }}
						className="text-accent-fg underline underline-offset-4"
					>
						este enlace para continuar en español
					</Link>
					.
				</p>
				<p lang="en">
					If you are not redirected automatically, follow{" "}
					<Link
						to="/$lang"
						params={{ lang: "en" }}
						className="text-accent-fg underline underline-offset-4"
					>
						this link to continue in English
					</Link>
					.
				</p>
				<p lang="gl">
					Se non es redirixido automaticamente, preme{" "}
					<Link
						to="/$lang"
						params={{ lang: "gl" }}
						className="text-accent-fg underline underline-offset-4"
					>
						nesta ligazón para continuar en galego
					</Link>
					.
				</p>
			</div>
		</main>
	);
}
