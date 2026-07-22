import { useTheme } from "./hooks";
import { themeLabels, themeOrder } from "./types";
import type { Theme } from "./types";
import { track } from "../lib/rybbit";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun03Icon,
  CrownIcon,
  Coffee03Icon,
  Moon02Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";

function ThemeIcon({ theme }: { theme: Theme }) {
  switch (theme) {
    case "system":
      return (
        <HugeiconsIcon
          icon={ComputerIcon}
          size={16}
          color="currentColor"
          strokeWidth={2}
        />
      );
    case "light":
      return (
        <HugeiconsIcon
          icon={Sun03Icon}
          size={16}
          color="currentColor"
          strokeWidth={2}
        />
      );
    case "dark":
      return (
        <HugeiconsIcon
          icon={Moon02Icon}
          size={16}
          color="currentColor"
          strokeWidth={2}
        />
      );
    case "pink":
      return (
        <HugeiconsIcon
          icon={CrownIcon}
          size={16}
          color="currentColor"
          strokeWidth={2}
        />
      );
    case "catppuccin":
      return (
        <HugeiconsIcon
          icon={Coffee03Icon}
          size={16}
          color="currentColor"
          strokeWidth={2}
        />
      );
  }
}

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  function handleToggle() {
    const idx = themeOrder.indexOf(theme);
    const next = themeOrder[(idx + 1) % themeOrder.length];
    cycleTheme();
    track("theme_toggle", { theme: next });
  }

  return (
    <button
      type="button"
      className="border-border hover:bg-surface cursor-pointer rounded border px-2 py-1 transition active:scale-95"
      onClick={handleToggle}
      aria-label={`Theme: ${themeLabels[theme]}`}
      title={themeLabels[theme]}
    >
      <span className="theme-icon block" key={theme}>
        <ThemeIcon theme={theme} />
      </span>
    </button>
  );
}
