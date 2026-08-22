import { getRouteApi } from "@tanstack/react-router";
import { useEffect } from "react";
import { I18nProvider } from "../i18n/context";
import { isLang } from "../i18n/context-value";
import { ThemeProvider } from "../theme/context";
import AppChrome from "./AppChrome";
import NotFoundPage from "./NotFoundPage";

const langRouteApi = getRouteApi("/$lang");

export default function LangNotFound() {
	const { lang: rawLang } = langRouteApi.useParams();
	const lang = isLang(rawLang) ? rawLang : "es";

	useEffect(() => {
		document.documentElement.lang = lang;
	}, [lang]);

	return (
		<ThemeProvider>
			<I18nProvider initialLang={lang}>
				<AppChrome>
					<NotFoundPage />
				</AppChrome>
			</I18nProvider>
		</ThemeProvider>
	);
}
