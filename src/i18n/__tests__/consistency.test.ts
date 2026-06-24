import { describe, it, expect } from "vitest";
import { en } from "../en";
import { es } from "../es";
import { gl } from "../gl";

function getAllKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      keys.push(...getAllKeys(value, newPrefix));
    } else {
      keys.push(newPrefix);
    }
  }
  return keys.sort();
}

describe("i18n translation consistency", () => {
  const enKeys = getAllKeys(en);
  const esKeys = getAllKeys(es);
  const glKeys = getAllKeys(gl);

  it("en has all expected top-level sections", () => {
    const sections = Object.keys(en).sort();
    expect(sections).toEqual([
      "addExam",
      "addSubject",
      "exam",
      "footer",
      "header",
      "home",
      "practice",
      "practiceHome",
      "questionCard",
      "seo",
      "subjectCard",
      "subjectHome",
    ]);
  });

  it("es has the same keys as en", () => {
    const missing = enKeys.filter((k) => !esKeys.includes(k));
    const extra = esKeys.filter((k) => !enKeys.includes(k));
    expect(missing).toEqual([]);
    expect(extra).toEqual([]);
  });

  it("gl has the same keys as en", () => {
    const missing = enKeys.filter((k) => !glKeys.includes(k));
    const extra = glKeys.filter((k) => !enKeys.includes(k));
    expect(missing).toEqual([]);
    expect(extra).toEqual([]);
  });

  it("all three languages have the same number of keys", () => {
    expect(esKeys.length).toBe(enKeys.length);
    expect(glKeys.length).toBe(enKeys.length);
  });
});
