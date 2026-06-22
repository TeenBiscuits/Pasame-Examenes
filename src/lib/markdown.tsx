import type { ReactNode } from "react";

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  if (!children) return null;
  const nodes = renderBlocks(children);
  if (nodes.length === 1 && typeof nodes[0] === "string") {
    return <span className={className}>{nodes[0]}</span>;
  }
  return <div className={className}>{nodes}</div>;
}

export function InlineMarkdown({ children }: { children: string }) {
  if (!children) return null;
  return <>{parseInline(children)}</>;
}

function parseInline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      return (
        <code
          key={`code-${code.slice(0, 20)}-${i}`}
          className="font-mono text-[0.85em] bg-code text-pink-600 px-1.5 py-0.5 rounded"
        >
          {code}
        </code>
      );
    }
    return part;
  });
}

function renderBlocks(text: string): ReactNode[] {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.flatMap((part, i) => {
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^\n/, "").trimEnd();
      return [
        <div
          key={`cb-${code.slice(0, 20)}-${i}`}
          className="my-3 rounded-lg border border-border bg-code-block overflow-hidden"
        >
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
            <code className="text-gray-100 font-mono whitespace-pre">
              {code}
            </code>
          </pre>
        </div>,
      ];
    }
    if (part.length === 0) return [];
    return [
      <span key={`t-${part.slice(0, 20)}-${i}`} className="whitespace-pre-line">
        {parseInline(part)}
      </span>,
    ];
  });
}
