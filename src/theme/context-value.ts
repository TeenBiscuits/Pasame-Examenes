import { createContext } from "react";
import type { Theme } from "./types";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  cycleTheme: () => {},
});
