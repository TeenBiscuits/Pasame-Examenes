import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "reicon-react";
import { useT } from "../i18n/hooks";
import { APP_VERSION } from "../lib/version";

const APP_VERSION_STORAGE_KEY = "pasame-examenes:app-version";
const TOAST_DURATION = 8000;
const TOAST_EXIT_DURATION = 200;

type ToastState = "hidden" | "entering" | "visible" | "exiting";

declare global {
	interface Window {
		showAppUpdateToast?: () => void;
	}
}

function getStoredAppVersion(): string | null {
	try {
		return localStorage.getItem(APP_VERSION_STORAGE_KEY);
	} catch {
		return null;
	}
}

function storeAppVersion() {
	try {
		localStorage.setItem(APP_VERSION_STORAGE_KEY, APP_VERSION);
	} catch {
		/* localStorage unavailable */
	}
}

export default function AppUpdateToast() {
	const t = useT();
	const [toastState, setToastState] = useState<ToastState>("hidden");
	const timeoutRef = useRef<number | undefined>(undefined);
	const exitTimeoutRef = useRef<number | undefined>(undefined);
	const enterTimeoutRef = useRef<number | undefined>(undefined);

	const hideToast = useCallback(() => {
		if (timeoutRef.current !== undefined) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = undefined;
		}
		if (exitTimeoutRef.current !== undefined) {
			window.clearTimeout(exitTimeoutRef.current);
		}

		setToastState("exiting");
		exitTimeoutRef.current = window.setTimeout(() => {
			setToastState("hidden");
			exitTimeoutRef.current = undefined;
		}, TOAST_EXIT_DURATION);
	}, []);

	const showToast = useCallback(() => {
		if (enterTimeoutRef.current !== undefined) {
			window.clearTimeout(enterTimeoutRef.current);
		}
		if (timeoutRef.current !== undefined) {
			window.clearTimeout(timeoutRef.current);
		}
		if (exitTimeoutRef.current !== undefined) {
			window.clearTimeout(exitTimeoutRef.current);
			exitTimeoutRef.current = undefined;
		}

		setToastState("entering");
		enterTimeoutRef.current = window.setTimeout(() => {
			enterTimeoutRef.current = undefined;
			setToastState("visible");
		}, 0);
		timeoutRef.current = window.setTimeout(() => {
			hideToast();
			timeoutRef.current = undefined;
		}, TOAST_DURATION);
	}, [hideToast]);

	useEffect(() => {
		window.showAppUpdateToast = showToast;

		const previousVersion = getStoredAppVersion();
		if (previousVersion && previousVersion !== APP_VERSION) {
			showToast();
		}
		storeAppVersion();

		return () => {
			delete window.showAppUpdateToast;
			if (timeoutRef.current !== undefined) {
				window.clearTimeout(timeoutRef.current);
			}
			if (exitTimeoutRef.current !== undefined) {
				window.clearTimeout(exitTimeoutRef.current);
			}
			if (enterTimeoutRef.current !== undefined) {
				window.clearTimeout(enterTimeoutRef.current);
			}
		};
	}, [showToast]);

	const [messageBeforeVersion, messageAfterVersion = ""] =
		t.appUpdate.message.split("{version}");
	const isRendered = toastState !== "hidden";

	return (
		<div className="pointer-events-none fixed inset-x-3 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[90] flex justify-center sm:inset-x-auto sm:left-4 sm:justify-start">
			<output
				aria-live="polite"
				aria-atomic="true"
				className={
					!isRendered
						? "sr-only"
						: `pointer-events-auto flex w-max max-w-full items-center gap-2 rounded-xl border-2 border-border bg-surface-alt px-3 py-2 text-xs font-semibold text-fg shadow-lg transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] sm:text-sm ${
								toastState === "visible"
									? "translate-y-0 opacity-100"
									: "translate-y-2 opacity-0"
							} motion-reduce:translate-y-0 motion-reduce:transition-opacity`
				}
			>
				{isRendered && (
					<>
						<span className="whitespace-nowrap">
							{messageBeforeVersion}
							<code className="bg-code text-fg-secondary rounded-md px-2 py-1 font-mono text-xs">
								{APP_VERSION}
							</code>
							{messageAfterVersion}
						</span>
						<button
							type="button"
							data-cuelume-hover="whisper"
							data-cuelume-press
							className="text-fg-muted hover:text-fg focus-visible:ring-accent inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
							onClick={hideToast}
							aria-label={t.appUpdate.dismiss}
						>
							<X className="size-4" aria-hidden="true" />
						</button>
					</>
				)}
			</output>
		</div>
	);
}
