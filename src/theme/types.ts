export const themeOrder = ["system", "light", "dark"] as const;
export type Theme = (typeof themeOrder)[number];

export type ThemeAppearance = "light" | "dark";

export const themeAppearance: Record<
  Exclude<Theme, "system">,
  ThemeAppearance
> = {
  light: "light",
  dark: "dark",
};

// Header and footer use `surface-alt`, which is also the browser chrome color.
// Keep these values in CSS notation so the meta tag follows the OKLCH system.
export const themeSurfaceAlt: Record<ThemeAppearance, string> = {
  light: "oklch(1 0 0)",
  dark: "oklch(0.278 0.030 256.848)",
};
