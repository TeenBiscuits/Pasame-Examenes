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
export type ConcreteTheme = Exclude<Theme, "system">;

export type ColorScheme = "system" | "light" | "dark";

export const lightThemeOrder = ["light", "princess", "latte"] as const;
export const darkThemeOrder = ["dark", "frappe", "macchiato", "mocha"] as const;

export type ThemeAppearance = "light" | "dark";

export const themeAppearance: Record<ConcreteTheme, ThemeAppearance> = {
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
export const themeSurfaceAlt: Record<ConcreteTheme, string> = {
	light: "#ffffff",
	dark: "#1f2937",
	princess: "#fefbfb",
	latte: "#dce0e8",
	frappe: "#232634",
	macchiato: "#181926",
	mocha: "#11111b",
};
