import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentTitle } from "../title";

describe("useDocumentTitle", () => {
  it("sets document title", () => {
    const originalTitle = document.title;
    const { unmount } = renderHook(() => useDocumentTitle("Test Title"));
    expect(document.title).toBe("Test Title");
    unmount();
    expect(document.title).toBe(originalTitle);
  });

  it("restores previous title on unmount", () => {
    document.title = "Before";
    const { unmount } = renderHook(() => useDocumentTitle("During"));
    expect(document.title).toBe("During");
    unmount();
    expect(document.title).toBe("Before");
  });

  it("updates title when prop changes", () => {
    const { rerender, unmount } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: "First" } },
    );
    expect(document.title).toBe("First");
    rerender({ title: "Second" });
    expect(document.title).toBe("Second");
    unmount();
  });
});
