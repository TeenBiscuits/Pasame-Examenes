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
  return parts.map((part) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      return (
        <code
          key={`code-${code.slice(0, 20)}`}
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
  const result: ReactNode[] = [];
  let keyIndex = 0;
  for (const part of parts) {
    if (part.length === 0) continue;
    if (part.startsWith("```") && part.endsWith("```")) {
      const code = part.slice(3, -3).replace(/^\n/, "").trimEnd();
      result.push(
        <div
          key={`cb-${keyIndex++}`}
          className="my-3 rounded-lg border border-border bg-code-block overflow-hidden"
        >
          <pre className="p-4 overflow-x-auto text-xs leading-relaxed">
            <code className="text-gray-100 font-mono whitespace-pre">
              {code}
            </code>
          </pre>
        </div>,
      );
    } else {
      const nodes = renderTableBlocks(part, keyIndex);
      keyIndex += nodes.length;
      result.push(...nodes);
    }
  }
  return result;
}

const TABLE_RE = /(\|.+\|\n\|[-| :]+\|\n(?:\|.+\|\n?)*)/g;

function renderTableBlocks(text: string, startKey: number): ReactNode[] {
  const result: ReactNode[] = [];
  let lastIndex = 0;
  let keyIndex = startKey;
  let match: RegExpExecArray | null;
  const re = new RegExp(TABLE_RE.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      if (before.trim()) {
        result.push(
          <span key={`t-${keyIndex++}`} className="whitespace-pre-line">
            {parseInline(before)}
          </span>,
        );
      }
    }
    result.push(renderTable(match[1], `table-${keyIndex++}`));
    lastIndex = match.index + match[1].length;
  }
  if (lastIndex < text.length) {
    const after = text.slice(lastIndex);
    if (after.trim()) {
      result.push(
        <span key={`t-${keyIndex}`} className="whitespace-pre-line">
          {parseInline(after)}
        </span>,
      );
    }
  }
  return result;
}

function renderTable(mdTable: string, key: string): ReactNode {
  const lines = mdTable.trim().split("\n");
  if (lines.length < 2) return null;
  const headerCells = lines[0]
    .split("|")
    .map((c) => c.trim())
    .filter(Boolean);
  const bodyLines = lines.slice(2);
  const rows = bodyLines.map((line) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean),
  );
  return (
    <div
      key={key}
      className="my-3 overflow-x-auto rounded-lg border border-border"
    >
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-surface">
          <tr>
            {headerCells.map((h, i) => (
              <th
                key={i}
                scope="col"
                className="px-3 py-2 text-left font-semibold text-fg whitespace-nowrap"
              >
                <InlineMarkdown>{h}</InlineMarkdown>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-surface-alt">
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 text-fg-secondary whitespace-nowrap"
                >
                  <InlineMarkdown>{cell}</InlineMarkdown>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
