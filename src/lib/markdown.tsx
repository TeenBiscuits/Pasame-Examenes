import type { ComponentProps, ReactNode } from "react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ExtraProps } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

const SyntaxHighlighter = lazy(() => import("./MarkdownSyntaxHighlighter"));

// A single newline is an intentional line break in question data. Markdown's
// default soft-break behavior would otherwise make it depend on the field or
// its surrounding CSS whether the line break is visible.
const fullRemarkPlugins = [remarkGfm, remarkMath, remarkBreaks];
const inlineRemarkPlugins = [remarkGfm, remarkMath, remarkBreaks];
const rehypePlugins = [rehypeKatex];
const inlineRehypePlugins = [rehypeKatex];

const codeFont =
	'"Cascadia Code Variable", "Cascadia Code", Consolas, "Courier New", monospace';

const languageAliases = {
	html: "markup",
	js: "javascript",
	jsx: "javascript",
	mjs: "javascript",
	sh: "bash",
	shell: "bash",
	ts: "typescript",
	tsx: "typescript",
	xml: "markup",
};

const supportedLanguages = new Set([
	"bash",
	"c",
	"cpp",
	"css",
	"go",
	"java",
	"javascript",
	"json",
	"markup",
	"python",
	"rust",
	"sql",
	"typescript",
]);

function normalizeLanguage(language: string) {
	return languageAliases[language as keyof typeof languageAliases] ?? language;
}

const codeStyle = {
	plain: {
		color: "var(--color-code-block-fg)",
		background: "transparent",
		fontFamily: codeFont,
	},
	'pre[class*="language-"]': {
		color: "var(--color-code-block-fg)",
		fontFamily: codeFont,
		background: "transparent",
		margin: 0,
		padding: 0,
		overflow: "visible",
	},
	'code[class*="language-"]': {
		color: "var(--color-code-block-fg)",
		fontFamily: codeFont,
		background: "transparent",
	},
	comment: { color: "var(--color-code-comment)" },
	prolog: { color: "var(--color-code-comment)" },
	cdata: { color: "var(--color-code-comment)" },
	doctype: { color: "var(--color-code-comment)" },
	punctuation: { color: "var(--color-code-punctuation)" },
	property: { color: "var(--color-code-property)" },
	tag: { color: "var(--color-code-keyword)" },
	boolean: { color: "var(--color-code-number)" },
	constant: { color: "var(--color-code-number)" },
	number: { color: "var(--color-code-number)" },
	symbol: { color: "var(--color-code-number)" },
	deleted: { color: "var(--color-danger-fg)" },
	selector: { color: "var(--color-code-property)" },
	"attr-name": { color: "var(--color-code-property)" },
	string: { color: "var(--color-code-string)" },
	char: { color: "var(--color-code-string)" },
	builtin: { color: "var(--color-code-function)" },
	inserted: { color: "var(--color-correct-fg)" },
	operator: { color: "var(--color-code-operator)" },
	entity: { color: "var(--color-code-property)" },
	url: { color: "var(--color-code-property)" },
	variable: { color: "var(--color-code-class)" },
	atrule: { color: "var(--color-code-keyword)" },
	"attr-value": { color: "var(--color-code-string)" },
	keyword: { color: "var(--color-code-keyword)" },
	function: { color: "var(--color-code-function)" },
	"class-name": { color: "var(--color-code-class)" },
	regex: { color: "var(--color-code-string)" },
	important: { color: "var(--color-code-keyword)" },
	bold: { fontWeight: "700" },
	italic: { fontStyle: "italic" },
};

function ScrollableTable({ children }: { children: ReactNode }) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState<boolean>();
	const [canScrollRight, setCanScrollRight] = useState<boolean>();

	useEffect(() => {
		const element = scrollRef.current;
		if (!element) return;

		const updateShadows = () => {
			const maxScrollLeft = element.scrollWidth - element.clientWidth;
			setCanScrollLeft(element.scrollLeft > 1);
			setCanScrollRight(maxScrollLeft - element.scrollLeft > 1);
		};

		updateShadows();
		element.addEventListener("scroll", updateShadows, { passive: true });
		const resizeObserver = new ResizeObserver(updateShadows);
		resizeObserver.observe(element);
		return () => {
			element.removeEventListener("scroll", updateShadows);
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div className="not-prose markdown-table relative m-0 max-w-full">
			<div
				ref={scrollRef}
				className="max-w-full overflow-x-auto overflow-y-hidden"
			>
				{children}
			</div>
			<span
				aria-hidden="true"
				className={`from-surface via-surface/70 pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r to-transparent transition-opacity duration-200 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
			/>
			<span
				aria-hidden="true"
				className={`from-surface via-surface/70 pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l to-transparent transition-opacity duration-200 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
			/>
		</div>
	);
}

function PlainCodeBlock({
	code,
	language,
}: {
	code: string;
	language?: string;
}) {
	return (
		<div className="not-prose markdown-code-block bg-code-block border-border overflow-hidden rounded-lg border">
			{language && (
				<div className="border-border/50 flex items-center border-b px-4 py-1.5">
					<span className="text-fg-muted font-mono text-[11px] font-semibold tracking-wider uppercase">
						{language}
					</span>
				</div>
			)}
			<pre className="text-code-block-fg m-0 max-w-full overflow-x-auto p-4 font-mono text-sm leading-relaxed whitespace-pre">
				<code>{code}</code>
			</pre>
		</div>
	);
}

function getCodeLanguage(node: ExtraProps["node"]): string | undefined {
	const child = node?.children[0];
	if (child?.type !== "element" || child.tagName !== "code") {
		return undefined;
	}

	const className = child.properties.className;
	const classes = Array.isArray(className)
		? className.join(" ")
		: String(className ?? "");
	return /language-([\w-]+)/.exec(classes)?.[1]?.toLowerCase();
}

function getCodeText(node: ExtraProps["node"]): string {
	const child = node?.children[0];
	if (child?.type !== "element" || child.tagName !== "code") {
		return "";
	}

	return child.children.reduce(
		(text, grandchild) =>
			grandchild.type === "text" ? text + grandchild.value : text,
		"",
	);
}

function MarkdownPre({ children, node }: ComponentProps<"pre"> & ExtraProps) {
	// Typed blocks are rendered by CodeRenderer. Fenced blocks without a
	// language have no className, so they need an explicit block fallback here.
	if (getCodeLanguage(node)) return <>{children}</>;

	return <PlainCodeBlock code={getCodeText(node).replace(/\n$/, "")} />;
}

function MarkdownLink({ children, href, title }: ComponentProps<"a">) {
	return (
		<a
			href={href}
			title={title}
			className="text-accent-fg hover:text-accent-hover underline decoration-current underline-offset-2"
		>
			{children}
		</a>
	);
}

function MarkdownImage({ alt, src, title, ...props }: ComponentProps<"img">) {
	if (!src) return null;

	return (
		<img
			{...props}
			src={src}
			alt={alt ?? ""}
			title={title}
			loading="lazy"
			decoding="async"
		/>
	);
}

function CodeRenderer({ className, children }: ComponentProps<"code">) {
	const match = /language-([\w-]+)/.exec(className || "");
	const code = String(children).replace(/\n$/, "");

	if (!match) {
		return (
			<code className="bg-code text-code-fg rounded px-1.5 py-0.5 font-mono text-[0.85em]">
				{children}
			</code>
		);
	}

	const language = match[1].toLowerCase();
	const prismLanguage = normalizeLanguage(language);
	if (!supportedLanguages.has(prismLanguage)) {
		return <PlainCodeBlock code={code} language={language} />;
	}

	return (
		<div className="not-prose markdown-code-block bg-code-block border-border overflow-hidden rounded-lg border">
			<div className="border-border/50 flex items-center border-b px-4 py-1.5">
				<span className="text-fg-muted font-mono text-[11px] font-semibold tracking-wider uppercase">
					{language}
				</span>
			</div>
			<div className="overflow-x-auto text-sm leading-relaxed">
				<Suspense
					fallback={
						<pre className="text-code-block-fg m-0 max-w-full overflow-x-auto p-4 font-mono text-sm leading-relaxed whitespace-pre">
							<code>{code}</code>
						</pre>
					}
				>
					<SyntaxHighlighter
						PreTag="pre"
						language={prismLanguage}
						style={codeStyle}
						customStyle={{
							margin: 0,
							padding: "1rem",
							borderRadius: 0,
							background: "transparent",
						}}
					>
						{code}
					</SyntaxHighlighter>
				</Suspense>
			</div>
		</div>
	);
}

export function Markdown({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	if (!children) return null;
	return (
		<div
			className={`markdown-body prose prose-sm max-w-none ${className ?? ""}`}
		>
			<ReactMarkdown
				remarkPlugins={fullRemarkPlugins}
				rehypePlugins={rehypePlugins}
				components={{
					pre: MarkdownPre,
					code: CodeRenderer,
					a: MarkdownLink,
					img: MarkdownImage,
					table: ({ children }) => (
						<ScrollableTable>
							<table className="m-0 w-max min-w-full border-collapse text-left text-sm leading-normal">
								{children}
							</table>
						</ScrollableTable>
					),
					th: ({ children }) => (
						<th className="border-border border-b px-3 py-2 font-semibold whitespace-nowrap">
							{children}
						</th>
					),
					td: ({ children }) => (
						<td className="border-border border-b px-3 py-2 whitespace-nowrap">
							{children}
						</td>
					),
				}}
			>
				{children}
			</ReactMarkdown>
		</div>
	);
}

export function InlineMarkdown({ children }: { children: string }) {
	if (!children) return null;
	return (
		<ReactMarkdown
			remarkPlugins={inlineRemarkPlugins}
			rehypePlugins={inlineRehypePlugins}
			allowedElements={[
				"a",
				"code",
				"del",
				"em",
				"strong",
				"sub",
				"sup",
				"br",
				"span",
				"img",
			]}
			components={{
				a: MarkdownLink,
				code: CodeRenderer,
				img: MarkdownImage,
			}}
			unwrapDisallowed
		>
			{children}
		</ReactMarkdown>
	);
}
