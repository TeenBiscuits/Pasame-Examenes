import { useSound } from "../sound/hooks";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeHighIcon, VolumeMute01Icon } from "@hugeicons/core-free-icons";
import { play } from "cuelume";

export default function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound();
  const t = useT();

  function handleToggle() {
    triggerLight();
    const nextState = !soundEnabled;
    toggleSound();
    track("sound_toggle", { enabled: nextState });

    // Play a toggle sound if enabling
    if (nextState) {
      setTimeout(() => {
        play("toggle");
      }, 50);
    }
  }

  const label = soundEnabled ? t.header.soundEnabled : t.header.soundDisabled;

  return (
    <button
      type="button"
      className="border-border hover:bg-surface text-fg-secondary hover:text-fg cursor-pointer rounded border px-2 py-1 transition active:scale-95"
      onClick={handleToggle}
      aria-label={label}
      title={label}
    >
      <span className="block" key={soundEnabled ? "on" : "off"}>
        <HugeiconsIcon
          icon={soundEnabled ? VolumeHighIcon : VolumeMute01Icon}
          size={16}
          color="currentColor"
          strokeWidth={2}
        />
      </span>
    </button>
  );
}
