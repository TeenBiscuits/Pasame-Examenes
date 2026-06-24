import type { Picture } from "vite-imagetools";

export type ImageMap = Record<string, { default: Picture }>;

export function getImage(map: ImageMap, filename: string): Picture | undefined {
  return map[`./assets/${filename}`]?.default;
}
