export const themeOrder = [
  "system",
  "light",
  "princess",
  "dark",
  "latte",
  "frappe",
  "macchiato",
  "mocha",
] as const;
export type Theme = (typeof themeOrder)[number];

export type ThemeAppearance = "light" | "dark";

export const themeAppearance: Record<
  Exclude<Theme, "system">,
  ThemeAppearance
> = {
  light: "light",
  dark: "dark",
  princess: "light",
  latte: "light",
  frappe: "dark",
  macchiato: "dark",
  mocha: "dark",
};

// Header and footer use `surface-alt`, which is also the browser chrome color.
// Keep these values in sRGB: Safari and installed web apps are stricter than
// page CSS when parsing `theme-color` metadata.
export const themeSurfaceAlt: Record<Exclude<Theme, "system">, string> = {
  light: "#ffffff",
  dark: "#1f2937",
  princess: "#fefbfb",
  latte: "#dce0e8",
  frappe: "#232634",
  macchiato: "#181926",
  mocha: "#11111b",
};
