import { play, setEnabled, setVolume as setCuelumeVolume } from "cuelume";

const SOUND_ENABLED_KEY = "sound-enabled";
const SOUND_VOLUME_KEY = "sound-volume";
const LAST_AUDIBLE_VOLUME_KEY = "sound-last-audible-volume";
const soundVolumeListeners = new Set<() => void>();

export const DEFAULT_SOUND_VOLUME = 70;

function clampVolume(volume: number): number {
  if (!Number.isFinite(volume)) return DEFAULT_SOUND_VOLUME;
  return Math.min(100, Math.max(0, volume));
}

function applySoundVolume(volume: number) {
  setCuelumeVolume(volume / 100);
  setEnabled(volume > 0);
}

export function getStoredSoundVolume(): number {
  try {
    const storedValue = localStorage.getItem(SOUND_VOLUME_KEY);
    if (storedValue !== null) {
      return clampVolume(Number(storedValue));
    }
    if (localStorage.getItem(SOUND_ENABLED_KEY) === "false") return 0;
  } catch {
    /* localStorage unavailable */
  }
  return DEFAULT_SOUND_VOLUME;
}

export function getStoredLastAudibleVolume(): number {
  try {
    const storedValue = localStorage.getItem(LAST_AUDIBLE_VOLUME_KEY);
    if (storedValue !== null) {
      const storedVolume = clampVolume(Number(storedValue));
      if (storedVolume > 0) return storedVolume;
    }
  } catch {
    /* localStorage unavailable */
  }
  return DEFAULT_SOUND_VOLUME;
}

export function subscribeToSoundVolume(onChange: () => void) {
  soundVolumeListeners.add(onChange);
  return () => {
    soundVolumeListeners.delete(onChange);
  };
}

export function initializeSound() {
  applySoundVolume(getStoredSoundVolume());
}

export function updateSoundVolume(volume: number): number {
  const nextVolume = clampVolume(volume);
  const enabled = nextVolume > 0;

  applySoundVolume(nextVolume);
  try {
    localStorage.setItem(SOUND_VOLUME_KEY, String(nextVolume));
    localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
    if (enabled) {
      localStorage.setItem(LAST_AUDIBLE_VOLUME_KEY, String(nextVolume));
    }
  } catch {
    /* localStorage unavailable */
  }
  for (const listener of soundVolumeListeners) listener();

  return nextVolume;
}

export function playSound(name?: Parameters<typeof play>[0]) {
  play(name);
}

export function playSuccess() {
  playSound("success");
}

export function playError() {
  playSound("error");
}

export function playPage() {
  playSound("page");
}
