import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Gear,
  Language,
  Palette,
  VolumeDown,
  VolumeMute,
  VolumeUp,
  XSquare,
} from "reicon-react";
import { useLang, useT } from "../i18n/hooks";
import type { Lang } from "../i18n/context";
import { replaceLangInPath } from "../lib/lang-link-utils";
import {
  DEFAULT_SOUND_VOLUME,
  getStoredLastAudibleVolume,
  getStoredSoundVolume,
  playSound,
  updateSoundVolume,
} from "../lib/sound";
import { track } from "../lib/umami";
import { useTheme } from "../theme/hooks";
import { themeOrder, type Theme } from "../theme/types";

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
  track("sound_volume_change", {
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

export default function SettingsModal() {
  const t = useT();
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeMethodRef = useRef<"x" | "backdrop" | "esc">("x");
  const [open, setOpen] = useState(false);
  const [volume, setVolumeState] = useState(getStoredSoundVolume);

  function openDialog() {
    closeMethodRef.current = "x";
    setOpen(true);
    dialogRef.current?.showModal();
    track("modal_open", { modal: "settings" });
  }

  function closeDialog(method: "x" | "backdrop") {
    closeMethodRef.current = method;
    dialogRef.current?.close();
  }

  function handleLanguageChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLang = event.target.value as Lang;
    if (nextLang === lang) return;
    playSound("toggle");
    setLang(nextLang);
    track("lang_toggle", { lang: nextLang, source: "settings" });
    navigate(replaceLangInPath(location.pathname, nextLang), {
      replace: true,
    });
  }

  function handleThemeChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextTheme = event.target.value;
    if (!isTheme(nextTheme) || nextTheme === theme) return;
    playSound("toggle");
    setTheme(nextTheme);
    track("theme_toggle", { theme: nextTheme, source: "settings" });
  }

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>) {
    const nextVolume = updateSoundVolume(Number(event.target.value));
    setVolumeState(nextVolume);
  }

  function toggleMuted() {
    if (volume > 0) {
      playSound("droplet");
      setVolumeState(updateSoundVolume(0));
      track("sound_volume_change", { volume: 0, muted: true });
      return;
    }

    const restoredVolume = getStoredLastAudibleVolume() || DEFAULT_SOUND_VOLUME;
    setVolumeState(updateSoundVolume(restoredVolume));
    playSound("toggle");
    track("sound_volume_change", {
      volume: restoredVolume,
      muted: false,
    });
  }

  return (
    <>
      <button
        type="button"
        data-cuelume-hover="whisper"
        data-cuelume-toggle="bloom"
        className="border-border hover:bg-surface focus-visible:ring-accent inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border text-fg-secondary transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
        onClick={openDialog}
        aria-label={t.settings.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={t.settings.title}
      >
        <Gear size={19} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        className="animate-dialog m-auto h-full max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 open:grid open:place-items-center"
        aria-labelledby="settings-modal-title"
        onCancel={(event) => {
          event.preventDefault();
          closeMethodRef.current = "esc";
          playSound("droplet");
          dialogRef.current?.close();
        }}
        onClose={() => {
          setOpen(false);
          track("modal_close", {
            modal: "settings",
            method: closeMethodRef.current,
          });
        }}
      >
        <button
          type="button"
          className="absolute inset-0 size-full cursor-default"
          onClick={() => {
            playSound("droplet");
            closeDialog("backdrop");
          }}
          aria-label={t.settings.close}
          tabIndex={-1}
        />
        <div className="bg-surface-alt relative z-10 max-h-[86svh] w-[min(92vw,28rem)] overscroll-contain rounded-2xl p-6 shadow-2xl">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2
              id="settings-modal-title"
              className="text-fg inline-flex items-center gap-2 text-lg font-semibold"
            >
              <Gear size={21} aria-hidden="true" />
              {t.settings.title}
            </h2>
            <button
              type="button"
              data-cuelume-toggle="droplet"
              onClick={() => closeDialog("x")}
              className="text-fg-muted hover:bg-surface hover:text-fg focus-visible:ring-accent inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
              aria-label={t.settings.close}
            >
              <XSquare size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-6">
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
          </div>
        </div>
      </dialog>
    </>
  );
}
