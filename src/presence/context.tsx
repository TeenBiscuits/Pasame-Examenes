import { useLocation } from "@tanstack/react-router";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useProfile } from "../profile/hooks";
import { containsProfanity } from "../profile/profanity";
import { getWeeklyPresence, recordWeeklyVisit } from "./appwrite-client";
import { getAppwritePresenceConfig } from "./config";
import { PresenceContext, type PresenceState } from "./context-value";
import { MOCK_WEEKLY_STUDENTS } from "./mock-weekly-students";
import { isHomepage } from "./pages";

const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;
const SUMMARY_REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const IS_MOCK_PRESENCE_ENABLED =
	import.meta.env.DEV || import.meta.env.VERCEL_ENV !== "production";

function createMockPresence(
	username: string,
	isNameShared: boolean,
): PresenceState {
	return {
		studentCount: MOCK_WEEKLY_STUDENTS.length,
		students: isNameShared
			? [
					{
						username,
						isCurrentStudent: true,
						profileKey: "local-student",
					},
					...MOCK_WEEKLY_STUDENTS.slice(1),
				]
			: MOCK_WEEKLY_STUDENTS,
		hasSummary: true,
		isUsingMockData: true,
	};
}

function initialPresence(): PresenceState {
	return {
		studentCount: 0,
		students: [],
		hasSummary: false,
		isUsingMockData: false,
	};
}

export function PresenceProvider({ children }: { children: ReactNode }) {
	const { pathname } = useLocation();
	const { profile, isReady } = useProfile();
	const [presence, setPresence] = useState<PresenceState>(initialPresence);
	const lastHeartbeatRef = useRef<number | null>(null);
	const heartbeatPromiseRef = useRef<Promise<boolean> | null>(null);
	const lastSummaryRef = useRef<number | null>(null);
	const summaryPromiseRef = useRef<Promise<boolean> | null>(null);
	const isRemotePresenceEnabled =
		!IS_MOCK_PRESENCE_ENABLED && getAppwritePresenceConfig() !== null;
	const shouldShowSummary =
		profile.isStudyPresenceBadgeVisible || isHomepage(pathname);

	const refreshPresence = useCallback(
		async (force = false) => {
			if (!isRemotePresenceEnabled) return false;

			const now = Date.now();
			if (
				!force &&
				lastSummaryRef.current !== null &&
				now - lastSummaryRef.current < SUMMARY_REFRESH_INTERVAL_MS
			) {
				return true;
			}
			if (summaryPromiseRef.current) return summaryPromiseRef.current;

			const summaryPromise = getWeeklyPresence()
				.then((nextPresence) => {
					if (!nextPresence) return false;
					lastSummaryRef.current = Date.now();
					setPresence({
						...nextPresence,
						hasSummary: true,
						isUsingMockData: false,
					});
					return true;
				})
				.catch(() => false)
				.finally(() => {
					summaryPromiseRef.current = null;
				});
			summaryPromiseRef.current = summaryPromise;
			return summaryPromise;
		},
		[isRemotePresenceEnabled],
	);

	const registerVisit = useCallback(async () => {
		if (!isReady || !isRemotePresenceEnabled) return false;

		const now = Date.now();
		if (
			lastHeartbeatRef.current !== null &&
			now - lastHeartbeatRef.current < HEARTBEAT_INTERVAL_MS
		) {
			return true;
		}
		if (heartbeatPromiseRef.current) return heartbeatPromiseRef.current;

		const heartbeatPromise = recordWeeklyVisit()
			.then((result) => {
				if (!result || result.isRateLimited) return false;
				lastHeartbeatRef.current = now;
				return true;
			})
			.catch(() => false)
			.finally(() => {
				heartbeatPromiseRef.current = null;
			});
		heartbeatPromiseRef.current = heartbeatPromise;
		return heartbeatPromise;
	}, [isReady, isRemotePresenceEnabled]);

	useEffect(() => {
		if (!isReady) return;
		if (IS_MOCK_PRESENCE_ENABLED) {
			setPresence(createMockPresence(profile.username, profile.isNameShared));
			return;
		}
		if (!isRemotePresenceEnabled) {
			setPresence(initialPresence());
			return;
		}

		function heartbeatIfVisible() {
			if (document.visibilityState === "visible") void registerVisit();
		}

		heartbeatIfVisible();
		const intervalId = window.setInterval(
			heartbeatIfVisible,
			HEARTBEAT_INTERVAL_MS,
		);
		document.addEventListener("visibilitychange", heartbeatIfVisible);
		window.addEventListener("focus", heartbeatIfVisible);
		return () => {
			window.clearInterval(intervalId);
			document.removeEventListener("visibilitychange", heartbeatIfVisible);
			window.removeEventListener("focus", heartbeatIfVisible);
		};
	}, [
		isReady,
		isRemotePresenceEnabled,
		profile.isNameShared,
		profile.username,
		registerVisit,
	]);

	useEffect(() => {
		if (!isRemotePresenceEnabled || !shouldShowSummary) return;

		function refreshIfVisible() {
			if (document.visibilityState !== "visible") return;
			void (async () => {
				await registerVisit();
				await refreshPresence();
			})();
		}

		refreshIfVisible();
		const intervalId = window.setInterval(
			refreshIfVisible,
			SUMMARY_REFRESH_INTERVAL_MS,
		);
		document.addEventListener("visibilitychange", refreshIfVisible);
		return () => {
			window.clearInterval(intervalId);
			document.removeEventListener("visibilitychange", refreshIfVisible);
		};
	}, [
		isRemotePresenceEnabled,
		refreshPresence,
		registerVisit,
		shouldShowSummary,
	]);

	const shareUsername = useCallback(
		async (username: string) => {
			const isProfane = await containsProfanity(username);
			if (IS_MOCK_PRESENCE_ENABLED) {
				return { isPublic: !isProfane, isRateLimited: false };
			}
			if (!isRemotePresenceEnabled) return null;

			try {
				const result = await recordWeeklyVisit(
					isProfane ? { type: "heartbeat" } : { type: "share", username },
				);
				if (!result || result.isRateLimited) return result;
				lastHeartbeatRef.current = Date.now();
				if (shouldShowSummary) void refreshPresence(true);
				return result;
			} catch {
				return null;
			}
		},
		[isRemotePresenceEnabled, refreshPresence, shouldShowSummary],
	);

	const stopSharingUsername = useCallback(async () => {
		if (IS_MOCK_PRESENCE_ENABLED) return true;
		if (!isRemotePresenceEnabled) return false;
		try {
			const result = await recordWeeklyVisit({ type: "unshare" });
			if (!result || result.isRateLimited) return false;
			lastHeartbeatRef.current = Date.now();
			if (shouldShowSummary) void refreshPresence(true);
			return true;
		} catch {
			return false;
		}
	}, [isRemotePresenceEnabled, refreshPresence, shouldShowSummary]);

	const value = useMemo(
		() => ({ ...presence, shareUsername, stopSharingUsername }),
		[presence, shareUsername, stopSharingUsername],
	);
	return (
		<PresenceContext.Provider value={value}>
			{children}
		</PresenceContext.Provider>
	);
}
