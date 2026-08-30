import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { ThemeContext } from "./context-value";
import {
	type ColorScheme,
	type ConcreteTheme,
	type Theme,
	themeAppearance,
	themeSurfaceAlt,
} from "./types";

const CHANGE_EVENT = "theme-change";
const LEGACY_THEME_KEY = "theme";
const COLOR_SCHEME_KEY = "theme-color-scheme";
const LIGHT_THEME_KEY = "theme-light";
const DARK_THEME_KEY = "theme-dark";

interface ThemePreferences {
	colorScheme: ColorScheme;
	lightTheme: ConcreteTheme;
	darkTheme: ConcreteTheme;
}

const defaultPreferences: ThemePreferences = {
	colorScheme: "system",
	lightTheme: "light",
	darkTheme: "dark",
};

function isColorScheme(value: string | null): value is ColorScheme {
	return value === "system" || value === "light" || value === "dark";
}

function isConcreteTheme(value: string | null): value is ConcreteTheme {
	return (
		value === "light" ||
		value === "princess" ||
		value === "dark" ||
		value === "latte" ||
		value === "frappe" ||
		value === "macchiato" ||
		value === "mocha"
	);
}

function isThemeForAppearance(
	value: string | null,
	appearance: "light" | "dark",
): value is ConcreteTheme {
	return isConcreteTheme(value) && themeAppearance[value] === appearance;
}

function getStoredPreferences(): ThemePreferences {
	try {
		const storedScheme = localStorage.getItem(COLOR_SCHEME_KEY);
		const storedLightTheme = localStorage.getItem(LIGHT_THEME_KEY);
		const storedDarkTheme = localStorage.getItem(DARK_THEME_KEY);
		const hasPreferences =
			storedScheme !== null ||
			storedLightTheme !== null ||
			storedDarkTheme !== null;

		if (!hasPreferences) {
			const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);
			if (legacyTheme === "system" || !legacyTheme) {
				return defaultPreferences;
			}
			if (isConcreteTheme(legacyTheme)) {
				const appearance = themeAppearance[legacyTheme];
				return {
					...defaultPreferences,
					colorScheme: appearance,
					[appearance === "light" ? "lightTheme" : "darkTheme"]: legacyTheme,
				};
			}
		}

		return {
			colorScheme: isColorScheme(storedScheme)
				? storedScheme
				: defaultPreferences.colorScheme,
			lightTheme: isThemeForAppearance(storedLightTheme, "light")
				? storedLightTheme
				: defaultPreferences.lightTheme,
			darkTheme: isThemeForAppearance(storedDarkTheme, "dark")
				? storedDarkTheme
				: defaultPreferences.darkTheme,
		};
	} catch {
		/* localStorage unavailable */
		return defaultPreferences;
	}
}

function prefersDarkAppearance() {
	return (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches
	);
}

function resolveTheme(preferences: ThemePreferences): ConcreteTheme {
	if (preferences.colorScheme === "light") return preferences.lightTheme;
	if (preferences.colorScheme === "dark") return preferences.darkTheme;
	return prefersDarkAppearance()
		? preferences.darkTheme
		: preferences.lightTheme;
}

function persistPreferences(preferences: ThemePreferences) {
	try {
		localStorage.setItem(COLOR_SCHEME_KEY, preferences.colorScheme);
		localStorage.setItem(LIGHT_THEME_KEY, preferences.lightTheme);
		localStorage.setItem(DARK_THEME_KEY, preferences.darkTheme);
	} catch {
		/* localStorage unavailable */
	}
}

function applyPreferences(preferences: ThemePreferences): ConcreteTheme {
	const activeTheme = resolveTheme(preferences);
	if (typeof document === "undefined") return activeTheme;

	persistPreferences(preferences);
	document.documentElement.setAttribute("data-theme", activeTheme);
	const surfaceAlt = themeSurfaceAlt[activeTheme];
	const browserColorScheme =
		preferences.colorScheme === "system"
			? "light dark"
			: themeAppearance[activeTheme];
	document.documentElement.style.colorScheme = browserColorScheme;
	document.documentElement.style.setProperty(
		"--browser-chrome-color",
		surfaceAlt,
	);
	const themeColor = document.getElementById("theme-color");
	if (themeColor) themeColor.setAttribute("content", surfaceAlt);
	const colorScheme = document.querySelector<HTMLMetaElement>(
		'meta[name="color-scheme"]',
	);
	if (colorScheme) {
		colorScheme.content = browserColorScheme;
	}
	return activeTheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [preferences, setPreferences] =
		useState<ThemePreferences>(defaultPreferences);

	useEffect(() => {
		const nextPreferences = getStoredPreferences();
		setPreferences(nextPreferences);
		applyPreferences(nextPreferences);

		const handleStorage = (event: StorageEvent) => {
			if (
				event.key !== LEGACY_THEME_KEY &&
				event.key !== COLOR_SCHEME_KEY &&
				event.key !== LIGHT_THEME_KEY &&
				event.key !== DARK_THEME_KEY
			) {
				return;
			}
			const next = getStoredPreferences();
			setPreferences(next);
			applyPreferences(next);
		};
		const handleThemeChange = () => {
			const next = getStoredPreferences();
			setPreferences(next);
			applyPreferences(next);
		};

		window.addEventListener("storage", handleStorage);
		window.addEventListener(CHANGE_EVENT, handleThemeChange);
		return () => {
			window.removeEventListener("storage", handleStorage);
			window.removeEventListener(CHANGE_EVENT, handleThemeChange);
		};
	}, []);

	useEffect(() => {
		if (preferences.colorScheme !== "system") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			applyPreferences(preferences);
			setPreferences((current) => ({ ...current }));
		};
		media.addEventListener("change", handler);
		return () => media.removeEventListener("change", handler);
	}, [preferences]);

	const commitPreferences = useCallback((next: ThemePreferences) => {
		setPreferences(next);
		applyPreferences(next);
		window.dispatchEvent(new Event(CHANGE_EVENT));
	}, []);

	const setColorScheme = useCallback(
		(next: ColorScheme) => {
			if (next === preferences.colorScheme) return;
			commitPreferences({ ...preferences, colorScheme: next });
		},
		[commitPreferences, preferences],
	);

	const setLightTheme = useCallback(
		(next: ConcreteTheme) => {
			if (
				themeAppearance[next] !== "light" ||
				next === preferences.lightTheme
			) {
				return;
			}
			commitPreferences({ ...preferences, lightTheme: next });
		},
		[commitPreferences, preferences],
	);

	const setDarkTheme = useCallback(
		(next: ConcreteTheme) => {
			if (themeAppearance[next] !== "dark" || next === preferences.darkTheme) {
				return;
			}
			commitPreferences({ ...preferences, darkTheme: next });
		},
		[commitPreferences, preferences],
	);

	const setTheme = useCallback(
		(next: Theme) => {
			if (next === "system") {
				setColorScheme("system");
				return;
			}
			const appearance = themeAppearance[next];
			commitPreferences({
				...preferences,
				colorScheme: appearance,
				[appearance === "light" ? "lightTheme" : "darkTheme"]: next,
			});
		},
		[commitPreferences, preferences, setColorScheme],
	);

	const cycleTheme = useCallback(() => {
		const schemes: ColorScheme[] = ["system", "light", "dark"];
		const index = schemes.indexOf(preferences.colorScheme);
		const next = schemes[(index + 1) % schemes.length];
		setColorScheme(next);
	}, [preferences.colorScheme, setColorScheme]);

	const theme = resolveTheme(preferences);
	const value = useMemo(
		() => ({
			theme,
			colorScheme: preferences.colorScheme,
			lightTheme: preferences.lightTheme,
			darkTheme: preferences.darkTheme,
			setTheme,
			setColorScheme,
			setLightTheme,
			setDarkTheme,
			cycleTheme,
		}),
		[
			cycleTheme,
			preferences.colorScheme,
			preferences.darkTheme,
			preferences.lightTheme,
			setColorScheme,
			setDarkTheme,
			setLightTheme,
			setTheme,
			theme,
		],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
