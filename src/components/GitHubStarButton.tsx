import { useState, useEffect } from "react";
import { Star } from "reicon-react";
import { track } from "../lib/umami";

const REPO = "TeenBiscuits/Pasame-Examenes";
const CACHE_KEY = "gh_star_count";
const CACHE_TS_KEY = "gh_star_count_ts";
const CACHE_TTL = 60 * 60 * 1000;

let cachedCount: number | null = null;
let fetchPromise: Promise<void> | null = null;
const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

function getStoredCount(): number | null {
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    const storedTs = sessionStorage.getItem(CACHE_TS_KEY);
    if (stored && storedTs) {
      const age = Date.now() - Number(storedTs);
      if (age < CACHE_TTL) return Number(stored);
    }
  } catch {
    /* sessionStorage unavailable */
  }
  return null;
}

function ensureCountLoaded() {
  if (cachedCount !== null || fetchPromise !== null) return;

  cachedCount = getStoredCount();
  if (cachedCount !== null) {
    notify();
    return;
  }

  fetchPromise = fetch(`https://api.github.com/repos/${REPO}`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: { stargazers_count?: number }) => {
      cachedCount = data.stargazers_count ?? null;
      try {
        sessionStorage.setItem(CACHE_KEY, String(cachedCount ?? 0));
        sessionStorage.setItem(CACHE_TS_KEY, String(Date.now()));
      } catch {
        /* unavailable */
      }
      notify();
    })
    .catch(() => {
      fetchPromise = null;
    });
}

function getStarCount(): number | null {
  return cachedCount;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function StarIcon({ className }: { className?: string }) {
  return (
    <Star
      size={16}
      weight="Filled"
      aria-hidden="true"
      className={className}
      color=""
    />
  );
}

export default function GitHubStarButton() {
  const [count, setCount] = useState(() => getStarCount());

  useEffect(() => {
    const unsubscribe = subscribe(() => setCount(getStarCount()));
    ensureCountLoaded();
    return unsubscribe;
  }, []);

  const href = `https://github.com/${REPO}`;

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="border-border hover:bg-surface text-fg-secondary hidden cursor-pointer items-center gap-1.5 rounded border px-2 py-1 text-xs font-medium no-underline transition active:scale-95 sm:inline-flex"
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
        className="border-border hover:bg-surface inline-flex cursor-pointer items-center rounded border px-2 py-1 text-amber-500 transition active:scale-95 sm:hidden"
        onClick={() => track("github_star_click", { location: "header" })}
        aria-label="Star on GitHub"
      >
        <StarIcon />
      </a>
    </>
  );
}
