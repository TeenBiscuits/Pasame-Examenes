import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Star } from "reicon-react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";

const REPO = "TeenBiscuits/Pasame-Examenes";
const CACHE_KEY = "gh_star_count";
const CACHE_TS_KEY = "gh_star_count_ts";
const CACHE_TTL = 60 * 60 * 1000;
const COUNT_ANIMATION_DURATION_MS = 1_200;

let cachedCount: number | null = null;
let fetchPromise: Promise<void> | null = null;
const subscribers = new Set<() => void>();

function notify() {
	subscribers.forEach((fn) => {
		fn();
	});
}

function subscribe(fn: () => void) {
	subscribers.add(fn);
	ensureCountLoaded();
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

function getServerStarCount(): null {
	return null;
}

function formatCount(n: number): string {
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
	return String(n);
}

function bezierPoint(
	progress: number,
	firstControlPoint: number,
	secondControlPoint: number,
) {
	const inverseProgress = 1 - progress;
	return (
		3 * inverseProgress * inverseProgress * progress * firstControlPoint +
		3 * inverseProgress * progress * progress * secondControlPoint +
		progress * progress * progress
	);
}

function easeStarCount(progress: number) {
	let lowerBound = 0;
	let upperBound = 1;

	for (let index = 0; index < 8; index += 1) {
		const estimate = (lowerBound + upperBound) / 2;
		if (bezierPoint(estimate, 0.16, 0.3) < progress) {
			lowerBound = estimate;
		} else {
			upperBound = estimate;
		}
	}

	return bezierPoint((lowerBound + upperBound) / 2, 1, 1);
}

function AnimatedStarCount({ count }: { count: number }) {
	const [displayedCount, setDisplayedCount] = useState(0);
	const displayedCountRef = useRef(0);

	useEffect(() => {
		const from = displayedCountRef.current;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			displayedCountRef.current = count;
			setDisplayedCount(count);
			return;
		}

		const startedAt = performance.now();
		let animationFrameId = 0;

		function animate(now: number) {
			const progress = Math.min(
				(now - startedAt) / COUNT_ANIMATION_DURATION_MS,
				1,
			);
			const nextCount = Math.round(
				from + (count - from) * easeStarCount(progress),
			);
			displayedCountRef.current = nextCount;
			setDisplayedCount(nextCount);

			if (progress < 1) animationFrameId = requestAnimationFrame(animate);
		}

		animationFrameId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrameId);
	}, [count]);

	return (
		<span className="hidden tabular-nums sm:inline">
			{formatCount(displayedCount)}
		</span>
	);
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
	const t = useT();
	const count = useSyncExternalStore(
		subscribe,
		getStarCount,
		getServerStarCount,
	);

	const href = `https://github.com/${REPO}`;

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			data-cuelume-hover="sparkle"
			data-cuelume-press="sparkle"
			className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-medium no-underline transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96] sm:px-3"
			onClick={() => track("github_star_click", { location: "header" })}
			aria-label={t.header.starOnGithub}
		>
			<StarIcon className="text-github-star" />
			<span className="hidden sm:inline">{t.header.star}</span>
			{count !== null && <AnimatedStarCount count={count} />}
		</a>
	);
}
