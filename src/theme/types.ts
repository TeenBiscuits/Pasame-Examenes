export const themeOrder = [
  "system",
  "light",
  "dark",
  "pink",
  "catppuccin",
] as const;
export type Theme = (typeof themeOrder)[number];
