import { use, useState, useEffect } from "react";
import { ThemeContext } from "./context-value";

export function useTheme() {
  return use(ThemeContext);
}

export function useIsDark(): boolean {
  const { theme } = useTheme();
  const [prefersDark, setPrefersDark] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  if (theme === "system") return prefersDark;
  return theme === "dark" || theme === "catppuccin";
}
