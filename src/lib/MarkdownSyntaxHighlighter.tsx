import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";

export default function MarkdownSyntaxHighlighter(
	props: SyntaxHighlighterProps,
) {
	return <SyntaxHighlighter {...props} />;
}
