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
const inlineRemarkPlugins = [remarkMath];
const rehypePlugins = [rehypeKatex];

const codeStyleLight = {
  ...oneLight,
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    fontFamily:
      '"Cascadia Code Variable", "Cascadia Code", Consolas, "Courier New", monospace',
  },
};

const codeStyleDark = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    fontFamily:
      '"Cascadia Code Variable", "Cascadia Code", Consolas, "Courier New", monospace',
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
        className="font-mono text-[0.85em] bg-code text-pink-600 px-1.5 py-0.5 rounded"
        {...rest}
      >
        {children}
      </code>
    );
  }

  return (
    <SyntaxHighlighter
      PreTag="div"
      language={match[1]}
      style={isDark ? codeStyleDark : codeStyleLight}
      customStyle={{
        margin: 0,
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
      }}
    >
      {code}
    </SyntaxHighlighter>
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
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={fullRemarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{ code: CodeRenderer }}
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
      rehypePlugins={rehypePlugins}
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
