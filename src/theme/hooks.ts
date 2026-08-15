import { use, useSyncExternalStore } from "react";
import { ThemeContext } from "./context-value";
import { themeAppearance } from "./types";

const darkQuery = "(prefers-color-scheme: dark)";

function subscribeToDarkPreference(onChange: () => void) {
  const mq = window.matchMedia(darkQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getDarkPreferenceSnapshot() {
  return window.matchMedia(darkQuery).matches;
}

function getServerDarkPreferenceSnapshot() {
  return false;
}

export function useTheme() {
  return use(ThemeContext);
}

export function useIsDark(): boolean {
  const { theme } = useTheme();
  const prefersDark = useSyncExternalStore(
    subscribeToDarkPreference,
    getDarkPreferenceSnapshot,
    getServerDarkPreferenceSnapshot,
  );

  if (theme === "system") return prefersDark;
  return themeAppearance[theme] === "dark";
}
