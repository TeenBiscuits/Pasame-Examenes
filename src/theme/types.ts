export const themes = ["system", "light", "dark", "pink", "catppuccin"] as const;
export type Theme = (typeof themes)[number];

export const themeOrder: Theme[] = [
  "system",
  "light",
  "dark",
  "pink",
  "catppuccin",
];

export const themeLabels: Record<Theme, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
  pink: "Pink",
  catppuccin: "Catppuccin",
};
