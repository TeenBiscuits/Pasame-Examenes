import { describe, it, expect } from "vitest";
import { buildLangPath, replaceLangInPath } from "../lang-link";
import type { Lang } from "../../i18n/context";

describe("buildLangPath", () => {
  it("prepends lang to root path", () => {
    expect(buildLangPath("en", "/")).toBe("/en");
    expect(buildLangPath("es", "/")).toBe("/es");
    expect(buildLangPath("gl", "/")).toBe("/gl");
  });

  it("prepends lang to any path", () => {
    expect(buildLangPath("en", "/machine-learning")).toBe(
      "/en/machine-learning",
    );
    expect(buildLangPath("es", "/calculus/practice")).toBe(
      "/es/calculus/practice",
    );
  });

  it("handles path without leading slash", () => {
    expect(buildLangPath("en", "machine-learning")).toBe(
      "/enmachine-learning",
    );
  });
});

describe("replaceLangInPath", () => {
  it("replaces en with es", () => {
    expect(replaceLangInPath("/en/machine-learning", "es")).toBe(
      "/es/machine-learning",
    );
  });

  it("replaces es with gl", () => {
    expect(replaceLangInPath("/es/calculus/exam/2024", "gl")).toBe(
      "/gl/calculus/exam/2024",
    );
  });

  it("replaces language at root level", () => {
    expect(replaceLangInPath("/en", "es")).toBe("/es");
    expect(replaceLangInPath("/es/", "gl")).toBe("/gl");
  });

  it("handles path without language prefix", () => {
    expect(replaceLangInPath("/machine-learning", "en")).toBe(
      "/en/machine-learning",
    );
  });

  it("handles bare root path", () => {
    expect(replaceLangInPath("/", "es")).toBe("/es");
  });

  it("keeps empty string as root", () => {
    expect(replaceLangInPath("", "en")).toBe("/en");
  });

  it("handles all language pairs", () => {
    const langs: Lang[] = ["en", "es", "gl"];
    for (const from of langs) {
      for (const to of langs) {
        const path = `/${from}/subject/practice/topic`;
        const result = replaceLangInPath(path, to);
        expect(result).toBe(`/${to}/subject/practice/topic`);
      }
    }
  });
});
