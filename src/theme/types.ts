export const themeOrder = [
  "system",
  "light",
  "dark",
  "pink",
  "catppuccin",
] as const;
export type Theme = (typeof themeOrder)[number];

export const themeLabels: Record<Theme, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
  pink: "Pink",
  catppuccin: "Catppuccin",
};
