import { useLocation, useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, type KeyboardEvent, useState } from "react";
import {
	Language,
	Palette,
	VolumeDown,
	VolumeMute,
	VolumeUp,
} from "reicon-react";
import type { Lang } from "../i18n/context";
import { useLang, useT } from "../i18n/hooks";
import { replaceLangInPath } from "../lib/lang-link-utils";
import {
	DEFAULT_SOUND_VOLUME,
	getStoredLastAudibleVolume,
	getStoredSoundVolume,
	playSound,
	updateSoundVolume,
} from "../lib/sound";
import { track as trackEvent } from "../lib/umami";
import { APP_VERSION } from "../lib/version";
import { useTheme } from "../theme/hooks";
import { type Theme, themeOrder } from "../theme/types";

const languageOptions: ReadonlyArray<{ value: Lang; label: string }> = [
	{ value: "es", label: "🇪🇸 Español" },
	{ value: "en", label: "🇬🇧 Inglés" },
	{ value: "gl", label: "🧜🏻‍♀️ Galego" },
];

function isTheme(value: string): value is Theme {
	return themeOrder.some((theme) => theme === value);
}

function VolumeIcon({ volume }: { volume: number }) {
	if (volume === 0) return <VolumeMute size={20} aria-hidden="true" />;
	if (volume < 50) return <VolumeDown size={20} aria-hidden="true" />;
	return <VolumeUp size={20} aria-hidden="true" />;
}

function commitVolume(nextVolume: number) {
	if (nextVolume > 0) playSound("tick");
	trackEvent("sound_volume_change", {
		volume: nextVolume,
		muted: nextVolume === 0,
	});
}

function handleVolumeKeyUp(event: KeyboardEvent<HTMLInputElement>) {
	if (
		["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "Home", "End"].includes(
			event.key,
		)
	) {
		commitVolume(Number(event.currentTarget.value));
	}
}

export default function SettingsGeneralPanel() {
	const t = useT();
	const { lang, setLang } = useLang();
	const { theme, setTheme } = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const [volume, setVolumeState] = useState(getStoredSoundVolume);

	function handleLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
		const nextLang = event.target.value as Lang;
		if (nextLang === lang) return;
		playSound("toggle");
		setLang(nextLang);
		trackEvent("lang_toggle", { lang: nextLang, source: "settings" });
		const nextPath = replaceLangInPath(location.pathname, nextLang);
		navigate({
			to: nextPath as never,
			search: location.search as never,
			hash: location.hash,
			replace: true,
		});
	}

	function handleThemeChange(event: ChangeEvent<HTMLSelectElement>) {
		const nextTheme = event.target.value;
		if (!isTheme(nextTheme) || nextTheme === theme) return;
		playSound("toggle");
		setTheme(nextTheme);
		trackEvent("theme_toggle", { theme: nextTheme, source: "settings" });
	}

	function handleVolumeChange(event: ChangeEvent<HTMLInputElement>) {
		const nextVolume = updateSoundVolume(Number(event.target.value));
		setVolumeState(nextVolume);
	}

	function toggleMuted() {
		if (volume > 0) {
			playSound("droplet");
			setVolumeState(updateSoundVolume(0));
			trackEvent("sound_volume_change", { volume: 0, muted: true });
			return;
		}

		const restoredVolume = getStoredLastAudibleVolume() || DEFAULT_SOUND_VOLUME;
		setVolumeState(updateSoundVolume(restoredVolume));
		playSound("toggle");
		trackEvent("sound_volume_change", {
			volume: restoredVolume,
			muted: false,
		});
	}

	return (
		<div className="space-y-8">
			<div>
				<h2
					id="settings-general-title"
					className="text-fg text-base font-semibold"
				>
					{t.settings.general}
				</h2>
				<p className="text-fg-muted mt-1 text-sm leading-relaxed">
					{t.settings.generalDescription}
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<div className="space-y-2">
					<label
						htmlFor="settings-language"
						className="text-fg inline-flex items-center gap-2 text-sm font-semibold"
					>
						<Language size={18} aria-hidden="true" />
						{t.settings.language}
					</label>
					<select
						id="settings-language"
						name="language"
						value={lang}
						onChange={handleLanguageChange}
						className="border-border bg-surface text-fg focus-visible:ring-accent min-h-11 w-full cursor-pointer rounded-lg border-2 px-3 text-base transition-[border-color,box-shadow,background-color] focus-visible:ring-2 focus-visible:outline-none"
					>
						{languageOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="settings-theme"
						className="text-fg inline-flex items-center gap-2 text-sm font-semibold"
					>
						<Palette size={18} aria-hidden="true" />
						{t.settings.theme}
					</label>
					<select
						id="settings-theme"
						name="theme"
						value={theme}
						onChange={handleThemeChange}
						className="border-border bg-surface text-fg focus-visible:ring-accent min-h-11 w-full cursor-pointer rounded-lg border-2 px-3 text-base transition-[border-color,box-shadow,background-color] focus-visible:ring-2 focus-visible:outline-none"
					>
						{themeOrder.map((option) => (
							<option key={option} value={option}>
								{t.theme[option]}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between gap-4">
					<label
						htmlFor="settings-volume"
						className="text-fg inline-flex items-center gap-2 text-sm font-semibold"
					>
						<VolumeIcon volume={volume} />
						{t.settings.volume}
					</label>
					<output
						htmlFor="settings-volume"
						className="bg-code text-fg-secondary min-w-12 rounded-md px-2 py-1 text-center font-mono text-xs tabular-nums"
					>
						{volume}%
					</output>
				</div>
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={toggleMuted}
						className="border-border bg-surface text-fg-secondary hover:border-accent hover:text-accent-fg focus-visible:ring-accent inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
						aria-label={volume > 0 ? t.settings.mute : t.settings.unmute}
						aria-pressed={volume === 0}
					>
						<VolumeIcon volume={volume} />
					</button>
					<input
						id="settings-volume"
						name="sound-volume"
						type="range"
						min="0"
						max="100"
						step="10"
						value={volume}
						aria-label={t.settings.volume}
						onChange={handleVolumeChange}
						onPointerUp={(event) =>
							commitVolume(Number(event.currentTarget.value))
						}
						onKeyUp={handleVolumeKeyUp}
						className="accent-accent h-11 min-w-0 flex-1 cursor-pointer"
					/>
				</div>
				<p className="text-fg-muted text-xs leading-relaxed">
					{t.settings.volumeDescription}
				</p>
			</div>

			<div className="border-border flex items-center justify-between gap-3 border-t pt-4 sm:hidden">
				<span className="text-fg-muted text-sm">{t.settings.version}</span>
				<code className="bg-code text-fg-secondary shrink-0 rounded-md px-2 py-1 font-mono text-xs">
					{APP_VERSION}
				</code>
			</div>
		</div>
	);
}
