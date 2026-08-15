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
// Use sRGB values here because installed mobile web apps have historically
// been stricter than the page CSS when parsing `theme-color`.
export const themeSurfaceAlt: Record<ThemeAppearance, string> = {
  light: "#ffffff",
  dark: "#1f2937",
};
