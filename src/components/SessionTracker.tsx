import { useEffect } from "react";
import { useLang } from "../i18n/hooks";
import { getDistinctId, identify, setSessionData } from "../lib/umami";
import { useTheme } from "../theme/hooks";

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

	return null;
}
