import { useEffect, useState } from "react";
import { Alarm } from "reicon-react";
import { useT } from "../i18n/hooks";

const MATCH_STATUS_ENDPOINT = "/api/match-status";
const CHECK_DELAY_MS = 5000;
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

type IdleWindow = Window & {
	requestIdleCallback?: (
		callback: () => void,
		options?: { timeout: number },
	) => number;
	cancelIdleCallback?: (id: number) => void;
};

function isMatchStatus(value: unknown): value is { blocked: boolean } {
	return (
		typeof value === "object" &&
		value !== null &&
		"blocked" in value &&
		typeof value.blocked === "boolean"
	);
}

export default function MatchWarningBanner() {
	const t = useT();
	const [isBlocked, setIsBlocked] = useState(false);

	useEffect(() => {
		let cancelled = false;
		let intervalId: number | undefined;

		const checkMatchStatus = async () => {
			try {
				const response = await fetch(MATCH_STATUS_ENDPOINT, {
					cache: "no-store",
				});
				if (!response.ok) throw new Error(`HTTP ${response.status}`);

				const result: unknown = await response.json();
				if (!isMatchStatus(result)) throw new Error("Invalid match status");

				if (!cancelled) setIsBlocked(result.blocked);
			} catch {
				// This auxiliary warning should never affect the rest of the app.
			}
		};

		const startChecks = () => {
			void checkMatchStatus();
			intervalId = window.setInterval(() => {
				void checkMatchStatus();
			}, CHECK_INTERVAL_MS);
		};

		const browserWindow = window as IdleWindow;
		let idleId: number | undefined;
		const delayId = window.setTimeout(() => {
			if (browserWindow.requestIdleCallback) {
				idleId = browserWindow.requestIdleCallback(startChecks, {
					timeout: CHECK_DELAY_MS,
				});
			} else {
				startChecks();
			}
		}, CHECK_DELAY_MS);

		return () => {
			cancelled = true;
			window.clearTimeout(delayId);
			if (idleId !== undefined) {
				browserWindow.cancelIdleCallback?.(idleId);
			}
			if (intervalId !== undefined) window.clearInterval(intervalId);
		};
	}, []);

	if (!isBlocked) return null;

	return (
		<div
			role="status"
			aria-live="polite"
			aria-atomic="true"
			className="border-warning-border bg-warning-bg text-warning-fg border-b"
		>
			<div className="mx-auto flex max-w-6xl items-start justify-center gap-2 px-4 py-2.5 text-center text-sm leading-relaxed sm:items-center sm:py-2">
				<Alarm
					size={16}
					aria-hidden="true"
					className="mt-0.5 shrink-0 sm:mt-0"
				/>
				<p>
					{t.header.matchWarning}{" "}
					<a
						href="https://hayahora.futbol/"
						target="_blank"
						rel="noopener noreferrer"
						className="font-semibold underline decoration-current underline-offset-4 hover:no-underline focus-visible:ring-2 focus-visible:ring-warning-fg focus-visible:outline-none"
					>
						{t.header.matchWarningMore}
					</a>
				</p>
			</div>
		</div>
	);
}
