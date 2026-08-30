import type { ReactNode } from "react";
import { Monitor, Moon, Palette, Sun } from "reicon-react";
import { useT } from "../i18n/hooks";
import { playSound } from "../lib/sound";
import { track as trackEvent } from "../lib/umami";
import { useTheme } from "../theme/hooks";
import {
	type ColorScheme,
	type ConcreteTheme,
	darkThemeOrder,
	lightThemeOrder,
	themeAppearance,
} from "../theme/types";

const colorSchemeOptions: ColorScheme[] = ["system", "light", "dark"];
const themeOptions: ConcreteTheme[] = [...lightThemeOrder, ...darkThemeOrder];
const GITHUB_REPOSITORY_URL = "https://github.com/TeenBiscuits/Pasame-Examenes";
const previewChips = [
	{ color: "accent", id: "active" },
	{ color: "faint", id: "second" },
	{ color: "faint", id: "third" },
	{ color: "faint", id: "fourth" },
	{ color: "faint", id: "fifth" },
	{ color: "faint", id: "sixth" },
] as const;
const previewOptionClass = "h-3 rounded-[3px] border";
const choiceCardBaseClass =
	"border-border bg-surface-alt relative rounded-lg border-2 transition-[border-color,box-shadow,background-color] duration-150 ease-out";
const choiceCardStateClass =
	"peer-checked:border-accent peer-checked:shadow-[0_0_0_1px_var(--color-accent)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-alt";
const choiceCardLayoutClass = {
	horizontal:
		"flex min-h-20 items-center justify-between gap-0 overflow-hidden p-0",
	stacked: "block overflow-hidden p-0",
} as const;

const themePreviewGradients: Record<ConcreteTheme, string> = {
	light: "linear-gradient(110deg, #ffffff 0%, #dcfce7 52%, #15803d 100%)",
	dark: "linear-gradient(110deg, #111827 0%, #1f2937 52%, #22c55e 100%)",
	princess: "linear-gradient(110deg, #fff8fb 0%, #f6b8d1 52%, #eb8eb4 100%)",
	latte: "linear-gradient(110deg, #eff1f5 0%, #cdd6f4 52%, #aeb9dc 100%)",
	frappe: "linear-gradient(110deg, #303446 0%, #51576d 52%, #ca9ee6 100%)",
	macchiato: "linear-gradient(110deg, #24273a 0%, #494d64 52%, #c6a0f6 100%)",
	mocha: "linear-gradient(110deg, #1e1e2e 0%, #45475a 52%, #cba6f7 100%)",
};

type PreviewPalette = {
	page: string;
	header: string;
	text: string;
	border: string;
	muted: string;
	faint: string;
	card: string;
	option: string;
	accent: string;
	accentSoft: string;
};

const previewPalettes: Record<ConcreteTheme, PreviewPalette> = {
	light: {
		page: "#fbfcfe",
		header: "#ffffff",
		text: "#0f172a",
		border: "#e2e8f0",
		muted: "#cbd5e1",
		faint: "#eef2f7",
		card: "#ffffff",
		option: "#ffffff",
		accent: "#15803d",
		accentSoft: "#dcfce7",
	},
	princess: {
		page: "#fff8fb",
		header: "#ffffff",
		text: "#361526",
		border: "#f1d5e2",
		muted: "#d9a6bc",
		faint: "#f8e8ef",
		card: "#ffffff",
		option: "#fffafd",
		accent: "#b9165c",
		accentSoft: "#fce7f3",
	},
	latte: {
		page: "#eff1f5",
		header: "#ffffff",
		text: "#24243a",
		border: "#d9dce4",
		muted: "#a6adc2",
		faint: "#e5e7ef",
		card: "#fbfbfc",
		option: "#f6f7fa",
		accent: "#7c3aed",
		accentSoft: "#ede9fe",
	},
	dark: {
		page: "#111827",
		header: "#1f2937",
		text: "#f9fafb",
		border: "#374151",
		muted: "#9ca3af",
		faint: "#1f2937",
		card: "#1f2937",
		option: "#111827",
		accent: "#22c55e",
		accentSoft: "#052e16",
	},
	frappe: {
		page: "#303446",
		header: "#292c3c",
		text: "#c6d0f5",
		border: "#51576d",
		muted: "#737994",
		faint: "#414559",
		card: "#292c3c",
		option: "#303446",
		accent: "#ca9ee6",
		accentSoft: "#414559",
	},
	macchiato: {
		page: "#24273a",
		header: "#1e2030",
		text: "#cad3f5",
		border: "#494d64",
		muted: "#6e738d",
		faint: "#363a4f",
		card: "#1e2030",
		option: "#24273a",
		accent: "#c6a0f6",
		accentSoft: "#363a4f",
	},
	mocha: {
		page: "#1e1e2e",
		header: "#181825",
		text: "#cdd6f4",
		border: "#45475a",
		muted: "#6c7086",
		faint: "#313244",
		card: "#181825",
		option: "#1e1e2e",
		accent: "#cba6f7",
		accentSoft: "#313244",
	},
};

function getThemeLabel(label: string) {
	return label.replace(/^\S+\s/u, "");
}

function SchemeIcon({ scheme }: { scheme: ColorScheme }) {
	if (scheme === "system") return <Monitor size={18} aria-hidden="true" />;
	if (scheme === "light") return <Sun size={18} aria-hidden="true" />;
	return <Moon size={18} aria-hidden="true" />;
}

function PracticePreview({
	theme,
	splitTheme,
}: {
	theme: ConcreteTheme;
	splitTheme?: ConcreteTheme;
}) {
	if (splitTheme) {
		return (
			<div className="relative h-full w-full overflow-hidden">
				<div className="absolute inset-y-0 start-0 w-1/2 overflow-hidden">
					<div className="h-full w-[200%]">
						<PracticePreview theme={theme} />
					</div>
				</div>
				<div className="absolute inset-y-0 start-1/2 w-1/2 overflow-hidden">
					<div className="h-full w-[200%] -translate-x-1/2">
						<PracticePreview theme={splitTheme} />
					</div>
				</div>
				<div className="pointer-events-none absolute inset-y-0 start-1/2 w-px bg-black/10" />
			</div>
		);
	}

	const palette = previewPalettes[theme];

	return (
		<div
			className="h-full w-full overflow-hidden"
			style={{
				backgroundColor: palette.page,
				color: palette.text,
			}}
			aria-hidden="true"
		>
			<div
				className="flex h-6 items-center gap-1.5 border-b px-2"
				style={{
					backgroundColor: palette.header,
					borderBottomColor: palette.border,
				}}
			>
				<span
					className="size-2 rounded-[2px]"
					style={{ backgroundColor: palette.accent }}
				/>
				<span
					className="h-1.5 w-14 rounded-full"
					style={{ backgroundColor: palette.muted }}
				/>
				<span
					className="ms-auto h-3.5 w-9 rounded-md"
					style={{ backgroundColor: palette.accentSoft }}
				/>
				<span
					className="h-3.5 w-7 rounded-md"
					style={{ backgroundColor: palette.faint }}
				/>
				<span
					className="size-3.5 rounded-md border"
					style={{
						backgroundColor: palette.faint,
						borderColor: palette.muted,
					}}
				/>
			</div>
			<div className="px-2.5 py-2">
				<div className="flex items-center gap-1">
					<span
						className="text-[6px] font-semibold"
						style={{ color: palette.accent }}
					>
						‹
					</span>
					<span
						className="h-1.5 w-16 rounded-full"
						style={{ backgroundColor: palette.muted }}
					/>
				</div>
				<div
					className="mt-2 h-2.5 w-24 rounded-full"
					style={{ backgroundColor: palette.muted }}
				/>
				<div className="mt-1 flex gap-1">
					{previewChips.map(({ color, id }) => (
						<span
							key={id}
							className="h-3 w-5 rounded-[3px]"
							style={{ backgroundColor: palette[color] }}
						/>
					))}
				</div>
				<div
					className="my-2 h-px w-full"
					style={{ backgroundColor: palette.faint }}
				/>
				<div
					className="rounded-md border p-1.5"
					style={{
						backgroundColor: palette.card,
						borderColor: palette.border,
					}}
				>
					<div className="flex items-center gap-1">
						<span
							className="h-2 w-6 rounded-[2px]"
							style={{ backgroundColor: palette.faint }}
						/>
						<span
							className="h-2 w-5 rounded-[2px]"
							style={{ backgroundColor: palette.accentSoft }}
						/>
						<span
							className="h-2 w-14 rounded-full"
							style={{ backgroundColor: palette.muted }}
						/>
					</div>
					<div
						className="mt-2 h-2 w-28 rounded-full"
						style={{ backgroundColor: palette.muted }}
					/>
					<div className="mt-2 space-y-1">
						{["w-full", "w-[94%]", "w-[88%]"].map((width) => (
							<div
								key={width}
								className={`${previewOptionClass} ${width}`}
								style={{
									backgroundColor: palette.option,
									borderColor: palette.border,
								}}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function ColorSchemePreview({
	scheme,
	lightTheme,
	darkTheme,
}: {
	scheme: ColorScheme;
	lightTheme: ConcreteTheme;
	darkTheme: ConcreteTheme;
}) {
	const theme = scheme === "dark" ? darkTheme : lightTheme;

	return (
		<div className="h-32 overflow-hidden">
			<PracticePreview
				theme={theme}
				splitTheme={scheme === "system" ? darkTheme : undefined}
			/>
		</div>
	);
}

function ThemeGradient({ theme }: { theme: ConcreteTheme }) {
	return (
		<div
			className="relative shrink-0 overflow-hidden shadow-inner"
			style={{
				backgroundImage: themePreviewGradients[theme],
				height: "5rem",
				width: "5rem",
			}}
			aria-hidden="true"
		>
			<div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/10" />
		</div>
	);
}

function ThemeChoice({
	name,
	value,
	label,
	checked,
	ariaLabel,
	preview,
	onChange,
	horizontal = false,
}: {
	name: string;
	value: string;
	label: string;
	checked: boolean;
	ariaLabel: string;
	preview: ReactNode;
	onChange: () => void;
	horizontal?: boolean;
}) {
	return (
		<label
			data-cuelume-hover="tick"
			data-cuelume-press
			className="interactive-card relative block min-w-0 cursor-pointer rounded-lg hover:shadow-md"
		>
			<input
				type="radio"
				name={name}
				value={value}
				checked={checked}
				aria-label={ariaLabel}
				onChange={onChange}
				className="peer sr-only"
			/>
			<div
				className={`${choiceCardBaseClass} ${choiceCardStateClass} ${horizontal ? choiceCardLayoutClass.horizontal : choiceCardLayoutClass.stacked}`}
			>
				{horizontal ? (
					<>
						<span className="text-fg flex min-w-0 flex-1 items-center px-3 text-sm font-semibold">
							{label}
						</span>
						{preview}
					</>
				) : (
					<>
						{preview}
						<span className="border-border text-fg flex min-h-8 items-center justify-center gap-2 border-t-2 px-2 pb-1 pt-2 text-sm font-semibold">
							{label}
						</span>
					</>
				)}
			</div>
		</label>
	);
}

export default function SettingsAppearancePanel() {
	const t = useT();
	const {
		colorScheme,
		darkTheme,
		lightTheme,
		setColorScheme,
		setDarkTheme,
		setLightTheme,
	} = useTheme();

	function handleColorSchemeChange(nextScheme: ColorScheme) {
		if (nextScheme === colorScheme) return;
		playSound("toggle");
		setColorScheme(nextScheme);
		trackEvent("theme_toggle", { theme: nextScheme, source: "settings" });
	}

	function handleThemeChange(nextTheme: ConcreteTheme) {
		const appearance = themeAppearance[nextTheme];
		if (
			(appearance === "light" && nextTheme === lightTheme) ||
			(appearance === "dark" && nextTheme === darkTheme)
		) {
			return;
		}
		playSound("toggle");
		if (appearance === "light") setLightTheme(nextTheme);
		else setDarkTheme(nextTheme);
		trackEvent("theme_toggle", {
			theme: nextTheme,
			appearance,
			source: "settings",
		});
	}

	return (
		<div className="space-y-8">
			<div>
				<h2
					id="settings-appearance-title"
					className="text-fg text-base font-semibold"
				>
					{t.settings.appearance}
				</h2>
				<p className="text-fg-muted mt-1 text-sm leading-relaxed">
					{t.settings.appearanceDescription}
				</p>
			</div>

			<fieldset className="space-y-3">
				<legend className="text-fg text-sm font-semibold">
					{t.settings.colorScheme}
				</legend>
				<div className="grid gap-3 sm:grid-cols-3">
					{colorSchemeOptions.map((option) => (
						<ThemeChoice
							key={option}
							name="theme-color-scheme"
							value={option}
							label={t.settings.colorSchemeOptions[option]}
							checked={colorScheme === option}
							ariaLabel={t.settings.colorSchemeOptions[option]}
							onChange={() => handleColorSchemeChange(option)}
							preview={
								<div className="relative">
									<ColorSchemePreview
										scheme={option}
										lightTheme={lightTheme}
										darkTheme={darkTheme}
									/>
									<span
										className="text-fg-secondary absolute bottom-3 start-3 inline-flex size-6 items-center justify-center rounded-full bg-surface-alt/90 shadow-sm"
										aria-hidden="true"
									>
										<SchemeIcon scheme={option} />
									</span>
								</div>
							}
						/>
					))}
				</div>
			</fieldset>

			<fieldset className="space-y-3">
				<legend className="text-fg text-sm font-semibold">
					{t.settings.themes}
				</legend>
				<p className="text-fg-muted -mt-1 text-sm leading-relaxed">
					{t.settings.themesDescription}
				</p>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{themeOptions.map((option) => {
						const appearance = themeAppearance[option];
						const themeGroupLabel =
							appearance === "light"
								? t.settings.lightTheme
								: t.settings.darkTheme;
						return (
							<ThemeChoice
								key={option}
								name={`theme-${appearance}`}
								value={option}
								label={getThemeLabel(t.theme[option])}
								checked={
									appearance === "light"
										? lightTheme === option
										: darkTheme === option
								}
								ariaLabel={`${themeGroupLabel}: ${getThemeLabel(t.theme[option])}`}
								onChange={() => handleThemeChange(option)}
								preview={<ThemeGradient theme={option} />}
								horizontal
							/>
						);
					})}
					<a
						href={GITHUB_REPOSITORY_URL}
						target="_blank"
						rel="noopener noreferrer"
						data-cuelume-hover="tick"
						data-cuelume-press="bloom"
						className="interactive-card border-border text-fg-muted hover:border-accent hover:bg-accent-light/30 hover:text-accent-fg focus-visible:ring-accent flex min-h-20 min-w-0 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
						onClick={() => trackEvent("add_theme_repository_open")}
					>
						<Palette className="size-7" aria-hidden="true" />
						<span className="text-sm font-medium">{t.settings.addTheme}</span>
					</a>
				</div>
			</fieldset>
		</div>
	);
}
