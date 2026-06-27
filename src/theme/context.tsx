/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  startTransition,
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

const themeColors: Record<Exclude<Theme, "system">, string> = {
  light: "#ffffff",
  dark: "#1f2937",
  pink: "#ffffff",
  catppuccin: "#313244",
};

function resolveThemeColor(theme: Theme): string {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? themeColors.dark
      : themeColors.light;
  }
  return themeColors[theme];
}

function applyTheme(theme: Theme): Theme {
  if (typeof document === "undefined") return theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* localStorage unavailable */
  }
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.getElementById("theme-color");
  if (meta) meta.setAttribute("content", resolveThemeColor(theme));
  return theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    if (!document.startViewTransition) {
      setThemeState(applyTheme(next));
      return;
    }
    startTransition(() => {
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
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
