import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Markdown, InlineMarkdown } from "../markdown";

describe("Markdown", () => {
  it("renders null for empty string", () => {
    const { container } = render(<Markdown>{""}</Markdown>);
    expect(container.firstChild).toBeNull();
  });

  it("renders plain text in a span", () => {
    const { container } = render(<Markdown>{"Hello world"}</Markdown>);
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
    expect(span?.textContent).toBe("Hello world");
  });

  it("renders inline code", () => {
    const { container } = render(<Markdown>{"Use `foo()` to call"}</Markdown>);
    const code = container.querySelector("code");
    expect(code).toBeTruthy();
    expect(code?.textContent).toBe("foo()");
    expect(code?.className).toContain("font-mono");
  });

  it("renders multiple inline code spans", () => {
    const { container } = render(<Markdown>{"`a` and `b`"}</Markdown>);
    const codes = container.querySelectorAll("code");
    expect(codes).toHaveLength(2);
  });

  it("renders fenced code blocks", () => {
    const { container } = render(
      <Markdown>
        {"```\ndef foo():\n    return 42\n```"}
      </Markdown>,
    );
    const pre = container.querySelector("pre");
    expect(pre).toBeTruthy();
    const code = pre?.querySelector("code");
    expect(code?.textContent?.trim()).toBe("def foo():\n    return 42");
  });

  it("renders mixed content with code block and inline code", () => {
    const { container } = render(
      <Markdown>{"Text before\n\n```\ncode block\n```\n\n`inline` after"}</Markdown>,
    );
    expect(container.querySelector("pre")).toBeTruthy();
    const inlineCodes = container.querySelectorAll("code");
    expect(inlineCodes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders markdown tables", () => {
    const { container } = render(
      <Markdown>
        {"| A | B |\n| --- | --- |\n| 1 | 2 |"}
      </Markdown>,
    );
    const table = container.querySelector("table");
    expect(table).toBeTruthy();
    const headers = table?.querySelectorAll("th");
    expect(headers).toHaveLength(2);
    expect(headers?.[0]?.textContent).toBe("A");
    expect(headers?.[1]?.textContent).toBe("B");
    const cells = table?.querySelectorAll("td");
    expect(cells).toHaveLength(2);
    expect(cells?.[0]?.textContent).toBe("1");
    expect(cells?.[1]?.textContent).toBe("2");
  });

  it("renders table with inline code in cells", () => {
    const { container } = render(
      <Markdown>
        {"| Col |\n| --- |\n| `x` |"}
      </Markdown>,
    );
    const td = container.querySelector("td");
    expect(td?.querySelector("code")?.textContent).toBe("x");
  });

  it("applies custom className", () => {
    const { container } = render(
      <Markdown className="custom-class">{"Hello"}</Markdown>,
    );
    expect(container.querySelector(".custom-class")).toBeTruthy();
  });
});

describe("InlineMarkdown", () => {
  it("renders null for empty string", () => {
    const { container } = render(<InlineMarkdown>{""}</InlineMarkdown>);
    expect(container.firstChild).toBeNull();
  });

  it("renders plain text", () => {
    const { container } = render(<InlineMarkdown>{"text"}</InlineMarkdown>);
    expect(container.textContent).toBe("text");
  });

  it("renders inline code", () => {
    const { container } = render(<InlineMarkdown>{"`code`"}</InlineMarkdown>);
    expect(container.querySelector("code")?.textContent).toBe("code");
  });

  it("renders mixed text and code", () => {
    const { container } = render(
      <InlineMarkdown>{"Hello `world` !"}</InlineMarkdown>,
    );
    expect(container.textContent).toBe("Hello world !");
    expect(container.querySelector("code")).toBeTruthy();
  });
});
