import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "reicon-react";
import { useLang, useT } from "../i18n/hooks";
import { subjects } from "../subjects";
import Hero from "./Hero";

const notFoundEmojis = subjects.map(() => "❓");

export default function NotFoundPage() {
	const t = useT();
	const { lang } = useLang();

	return (
		<div>
			<Hero
				emojis={notFoundEmojis}
				className="animate-fade-in animate-duration-fast"
			>
				<h1 className="text-fg mb-3 text-4xl font-semibold sm:text-5xl lg:text-6xl">
					404
				</h1>
				<p className="text-fg-secondary mx-auto max-w-2xl text-base sm:text-lg lg:text-xl">
					{t.subjectHome.notFound}
				</p>
			</Hero>

			<div className="animate-fade-in animate-duration-fast mx-auto max-w-6xl px-4 pb-20 text-center">
				<Link
					to="/$lang"
					params={{ lang }}
					data-cuelume-hover="tick"
					data-cuelume-press
					className="interactive-card border-border bg-surface-alt text-fg inline-flex items-center gap-2 rounded-xl border-2 px-5 py-4 font-semibold transition-[background-color,border-color,box-shadow,scale] duration-150 ease-out hover:shadow-md focus-visible:ring-accent focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
				>
					<ArrowLeft className="size-4" aria-hidden="true" />
					{t.subjectHome.returnHome}
				</Link>
			</div>
		</div>
	);
}
