import { useEffect } from "react";
import { useLang } from "../i18n/hooks";
import { getDistinctId, identify, setSessionData } from "../lib/umami";
import { useTheme } from "../theme/hooks";

const RECORDER_SCRIPT_ID = "umami-recorder";
const RECORDER_SRC = "https://analytics.pablopl.dev/recorder.js";
const UMAMI_WEBSITE_ID = "63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4";
const RECORDER_DELAY_MS = 5000;

function scheduleAfterIdle(callback: () => void): () => void {
	const browserWindow = window as Window & {
		requestIdleCallback?: (
			callback: () => void,
			options?: { timeout: number },
		) => number;
		cancelIdleCallback?: (id: number) => void;
	};
	let cancelIdle = () => {};
	const delayId = setTimeout(() => {
		const idleCallback = browserWindow.requestIdleCallback;
		if (idleCallback) {
			const idleId = idleCallback(callback, { timeout: 3000 });
			cancelIdle = () => browserWindow.cancelIdleCallback?.(idleId);
			return;
		}

		const idleTimeoutId = setTimeout(callback, 1500);
		cancelIdle = () => clearTimeout(idleTimeoutId);
	}, RECORDER_DELAY_MS);

	return () => {
		clearTimeout(delayId);
		cancelIdle();
	};
}

export default function SessionTracker() {
	const { lang } = useLang();
	const { theme } = useTheme();

	useEffect(() => {
		const id = getDistinctId();
		if (id) identify({ id });
	}, []);

	useEffect(() => {
		setSessionData({ lang, theme });
	}, [lang, theme]);

	useEffect(() => {
		return scheduleAfterIdle(() => {
			if (document.getElementById(RECORDER_SCRIPT_ID)) return;

			const script = document.createElement("script");
			script.id = RECORDER_SCRIPT_ID;
			script.src = RECORDER_SRC;
			script.async = true;
			script.dataset.websiteId = UMAMI_WEBSITE_ID;
			document.head.appendChild(script);
		});
	}, []);

	return null;
}
