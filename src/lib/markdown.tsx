import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import go from "react-syntax-highlighter/dist/esm/languages/prism/go";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useIsDark } from "../theme/hooks";
import type { ComponentProps, ReactNode } from "react";
import "katex/dist/katex.min.css";

const fullRemarkPlugins = [remarkGfm, remarkMath];
const inlineRemarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex];
const inlineRehypePlugins: [typeof rehypeKatex, { output: "html" }][] = [
  [rehypeKatex, { output: "html" }],
];

const codeFont =
  '"Cascadia Code Variable", "Cascadia Code", Consolas, "Courier New", monospace';

for (const [name, grammar] of Object.entries({
  bash,
  c,
  cpp,
  css,
  go,
  java,
  javascript,
  json,
  markup,
  python,
  rust,
  sql,
  typescript,
})) {
  SyntaxHighlighter.registerLanguage(name, grammar);
}

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

function ScrollableTable({ children }: { children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    <div className="not-prose relative m-0 max-w-full">
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
      components={{ code: CodeRenderer }}
      unwrapDisallowed
    >
      {children}
    </ReactMarkdown>
  );
}
