import { useTheme } from "./hooks";
import { themeLabels } from "./types";
import type { Theme } from "./types";

function ThemeIcon({ theme }: { theme: Theme }) {
  switch (theme) {
    case "system":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
          <clipPath id="moon-clip">
            <path d="M16 8a6 6 0 0 1-8 8 6 6 0 0 0 8-8Z" />
          </clipPath>
          <circle
            cx="14"
            cy="10"
            r="7"
            fill="currentColor"
            clipPath="url(#moon-clip)"
          />
        </svg>
      );
    case "light":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    case "dark":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case "pink":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v3" />
          <path d="M12 20v3" />
          <path d="M4.2 4.2l2.1 2.1" />
          <path d="M17.7 17.7l2.1 2.1" />
          <path d="M1 12h3" />
          <path d="M20 12h3" />
          <path d="M4.2 19.8l2.1-2.1" />
          <path d="M17.7 6.3l2.1-2.1" />
          <path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
          <path d="M9 9c.2-.7.8-1.4 1.5-1.7" />
          <path d="M13.5 10.3c.7.3 1.3.9 1.5 1.7" />
          <path d="M15 15c-.2.7-.8 1.4-1.5 1.7" />
          <path d="M10.5 13.7c-.7-.3-1.3-.9-1.5-1.7" />
        </svg>
      );
    case "catppuccin":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      );
  }
}

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      className="px-2 py-1 rounded border border-border hover:bg-surface active:scale-95 transition cursor-pointer"
      onClick={cycleTheme}
      aria-label={`Theme: ${themeLabels[theme]}`}
      title={themeLabels[theme]}
    >
      <span className="theme-icon block" key={theme}>
        <ThemeIcon theme={theme} />
      </span>
    </button>
  );
}
