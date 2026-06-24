import { describe, it, expect } from "vitest";
import { themes, themeOrder, themeLabels } from "../types";

describe("theme types", () => {
  it("has 5 themes", () => {
    expect(themes).toHaveLength(5);
    expect(themes).toContain("system");
    expect(themes).toContain("light");
    expect(themes).toContain("dark");
    expect(themes).toContain("pink");
    expect(themes).toContain("catppuccin");
  });

  it("themeOrder matches themes array", () => {
    expect(themeOrder).toEqual([...themes]);
  });

  it("themeLabels has all themes", () => {
    for (const theme of themes) {
      expect(themeLabels[theme]).toBeTruthy();
      expect(typeof themeLabels[theme]).toBe("string");
    }
  });
});
