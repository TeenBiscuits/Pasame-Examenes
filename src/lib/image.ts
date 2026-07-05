import type { StaticImageData } from "next/image";

export interface Picture {
  sources: Record<string, string>;
  img: {
    src: string;
    w: number;
    h: number;
  };
}

export type QuestionImage = Picture | StaticImageData | string;

export type ImageMap =
  | Record<string, { default: QuestionImage }>
  | ((key: string) => { default: QuestionImage });

export function getImage(
  map: ImageMap,
  filename: string,
): QuestionImage | undefined {
  if (typeof map === "function") {
    try {
      return map(`./${filename}`).default;
    } catch {
      return undefined;
    }
  }
  return map[`./assets/${filename}`]?.default;
}
