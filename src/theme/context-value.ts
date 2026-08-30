import { createContext } from "react";
import type { ColorScheme, ConcreteTheme, Theme } from "./types";

export interface ThemeContextType {
	/** The concrete theme currently applied to the document. */
	theme: ConcreteTheme;
	colorScheme: ColorScheme;
	lightTheme: ConcreteTheme;
	darkTheme: ConcreteTheme;
	setTheme: (theme: Theme) => void;
	setColorScheme: (scheme: ColorScheme) => void;
	setLightTheme: (theme: ConcreteTheme) => void;
	setDarkTheme: (theme: ConcreteTheme) => void;
	cycleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
	theme: "light",
	colorScheme: "system",
	lightTheme: "light",
	darkTheme: "dark",
	setTheme: () => {},
	setColorScheme: () => {},
	setLightTheme: () => {},
	setDarkTheme: () => {},
	cycleTheme: () => {},
});
