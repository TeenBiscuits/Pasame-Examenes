import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useIsDark } from "../theme/hooks";
import type { ComponentProps } from "react";
import "katex/dist/katex.min.css";

const fullRemarkPlugins = [remarkGfm, remarkMath];
const inlineRemarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex];
const inlineRehypePlugins: [typeof rehypeKatex, { output: "html" }][] = [
  [rehypeKatex, { output: "html" }],
];

const codeFont =
  '"Cascadia Code Variable", "Cascadia Code", Consolas, "Courier New", monospace';

const codeStyleLight = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    fontFamily: codeFont,
    background: "transparent",
    margin: 0,
    padding: 0,
    overflow: "visible",
  },
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    fontFamily: codeFont,
    background: "transparent",
  },
};

const codeStyleDark = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    fontFamily: codeFont,
    background: "transparent",
    margin: 0,
    padding: 0,
    overflow: "visible",
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    fontFamily: codeFont,
    background: "transparent",
  },
};

function CodeRenderer({
  className,
  children,
  ...rest
}: ComponentProps<"code">) {
  const isDark = useIsDark();
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");

  if (!match) {
    return (
      <code
        className="bg-code rounded px-1.5 py-0.5 font-mono text-[0.85em] text-pink-600"
        {...rest}
      >
        {children}
      </code>
    );
  }

  return (
    <div
      className={`not-prose border-border my-3 overflow-hidden rounded-lg border ${isDark ? "bg-code-block" : "bg-code"}`}
    >
      <div className="border-border/50 flex items-center border-b px-4 py-1.5">
        <span className="text-fg-muted font-mono text-[11px] font-semibold tracking-wider uppercase">
          {match[1]}
        </span>
      </div>
      <div className="overflow-x-auto text-sm leading-relaxed">
        <SyntaxHighlighter
          PreTag="pre"
          language={match[1]}
          style={isDark ? codeStyleDark : codeStyleLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            borderRadius: 0,
            background: "transparent",
          }}
        >
          {code}
        </SyntaxHighlighter>
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
  const isDark = useIsDark();

  if (!children) return null;
  return (
    <div
      className={`prose prose-sm max-w-none ${isDark ? "prose-invert" : ""} ${className ?? ""}`}
    >
      <ReactMarkdown
        remarkPlugins={fullRemarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: CodeRenderer,
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
      components={{ code: CodeRenderer }}
      unwrapDisallowed
    >
      {children}
    </ReactMarkdown>
  );
}
