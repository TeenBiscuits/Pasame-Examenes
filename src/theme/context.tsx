/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import type { Theme } from "./types";
import { themeOrder } from "./types";

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

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem("theme");
    if (stored && themeOrder.includes(stored as Theme)) return stored as Theme;
  } catch {
    /* localStorage unavailable */
  }
  return "system";
}

function applyTheme(theme: Theme): Theme {
  if (typeof document === "undefined") return theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* localStorage unavailable */
  }
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    if (!document.startViewTransition) {
      setThemeState(applyTheme(next));
      return;
    }
    document.startViewTransition(() => {
      setThemeState(applyTheme(next));
    });
  }, []);

  const cycleTheme = useCallback(() => {
    const idx = themeOrder.indexOf(theme);
    const next = themeOrder[(idx + 1) % themeOrder.length];
    setTheme(next);
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, cycleTheme }),
    [theme, setTheme, cycleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
