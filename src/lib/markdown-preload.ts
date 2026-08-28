import type { ComponentProps } from "react";
import type ReactMarkdown from "react-markdown";

export type MathPlugins = {
	remark: NonNullable<
		ComponentProps<typeof ReactMarkdown>["remarkPlugins"]
	>[number];
	rehype: NonNullable<
		ComponentProps<typeof ReactMarkdown>["rehypePlugins"]
	>[number];
};

let mathPluginsPromise: Promise<MathPlugins> | undefined;
let loadedMathPlugins: MathPlugins | null = null;
let syntaxHighlighterPromise:
	| ReturnType<typeof importSyntaxHighlighter>
	| undefined;
let syntaxHighlighterLoaded = false;

function importSyntaxHighlighter() {
	return import("./MarkdownSyntaxHighlighter");
}

export function containsMathSyntax(value: string): boolean {
	return /(^|[^\\])(?:\${1,2}|\\(?:\(|\[))/.test(value);
}

export function loadMathPlugins(): Promise<MathPlugins> {
	mathPluginsPromise ??= Promise.all([
		import("remark-math"),
		import("rehype-katex"),
		import("katex/dist/katex-swap.min.css"),
	])
		.then(([remarkMath, rehypeKatex]) => ({
			remark: remarkMath.default,
			rehype: rehypeKatex.default,
		}))
		.then((plugins) => {
			loadedMathPlugins = plugins;
			return plugins;
		});
	return mathPluginsPromise;
}

export function getLoadedMathPlugins(): MathPlugins | null {
	return loadedMathPlugins;
}

export function loadSyntaxHighlighter() {
	syntaxHighlighterPromise ??= importSyntaxHighlighter().then((module) => {
		syntaxHighlighterLoaded = true;
		return module;
	});
	return syntaxHighlighterPromise;
}

export function isSyntaxHighlighterLoaded(): boolean {
	return syntaxHighlighterLoaded;
}

export async function preloadMarkdownDependencies(
	contents: string[],
): Promise<void> {
	const content = contents.join("\n");
	const dependencies: Promise<unknown>[] = [];

	if (containsMathSyntax(content)) dependencies.push(loadMathPlugins());
	if (/```[\w-]+[\s\S]*?```/.test(content)) {
		dependencies.push(loadSyntaxHighlighter());
	}

	await Promise.all(dependencies);
}
