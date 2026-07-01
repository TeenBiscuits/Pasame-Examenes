import { useState, useEffect } from "react";
import { track } from "../lib/umami";

const REPO = "TeenBiscuits/Pasame-Examenes";
const CACHE_KEY = "gh_star_count";
const CACHE_TS_KEY = "gh_star_count_ts";
const CACHE_TTL = 60 * 60 * 1000;

let cachedCount: number | null = null;

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

export default function GitHubStarButton() {
  const [count, setCount] = useState<number | null>(() => {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      const storedTs = sessionStorage.getItem(CACHE_TS_KEY);
      if (stored && storedTs) {
        const age = Date.now() - Number(storedTs);
        if (age < CACHE_TTL) {
          cachedCount = Number(stored);
          return cachedCount;
        }
      }
    } catch {
      /* sessionStorage unavailable */
    }
    return null;
  });

  useEffect(() => {
    if (cachedCount !== null) return;

    let cancelled = false;
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((res) => res.json())
      .then((data: { stargazers_count?: number }) => {
        if (cancelled || !data?.stargazers_count) return;
        cachedCount = data.stargazers_count;
        try {
          sessionStorage.setItem(CACHE_KEY, String(cachedCount));
          sessionStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        } catch {
          /* unavailable */
        }
        setCount(cachedCount);
      })
      .catch(() => {
        /* fetch failed, leave count null */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const href = `https://github.com/${REPO}`;

  const formatCount = (n: number): string => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded border border-border hover:bg-surface active:scale-95 transition cursor-pointer no-underline text-fg-secondary text-xs font-medium"
        onClick={() => track("github_star_click", { location: "header" })}
        aria-label="Star on GitHub"
      >
        <StarIcon className="text-amber-500" />
        <span>Star</span>
        {count !== null && (
          <span className="tabular-nums">{formatCount(count)}</span>
        )}
      </a>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden inline-flex items-center px-2 py-1 rounded border border-border hover:bg-surface active:scale-95 transition cursor-pointer text-amber-500"
        onClick={() => track("github_star_click", { location: "header" })}
        aria-label="Star on GitHub"
      >
        <StarIcon />
      </a>
    </>
  );
}
