import { describe, it, expect } from "vitest";
import { getImage, type ImageMap } from "../image";

describe("getImage", () => {
  const mockMap: ImageMap = {
    ["./assets/figure-1.png"]: {
      default: {
        img: { src: "/figure-1.png", w: 800, h: 600 },
        sources: { avif: "", webp: "", png: "" },
      } as unknown as ImageMap[string]["default"],
    },
    ["./assets/diagram.png"]: {
      default: {
        img: { src: "/diagram.png", w: 400, h: 300 },
        sources: { avif: "", webp: "", png: "" },
      } as unknown as ImageMap[string]["default"],
    },
  };

  it("returns image for matching filename", () => {
    const result = getImage(mockMap, "figure-1.png");
    expect(result).toBeDefined();
    expect(result?.img.src).toBe("/figure-1.png");
  });

  it("returns undefined for missing filename", () => {
    const result = getImage(mockMap, "nonexistent.png");
    expect(result).toBeUndefined();
  });

  it("handles empty map", () => {
    const result = getImage({}, "anything.png");
    expect(result).toBeUndefined();
  });

  it("returns correct image for different filenames", () => {
    const result = getImage(mockMap, "diagram.png");
    expect(result).toBeDefined();
    expect(result?.img.src).toBe("/diagram.png");
  });
});
