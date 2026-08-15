import { useCallback, useEffect, useRef } from "react";
import { useT } from "../i18n/hooks";
import { closeDialog, showDialog, useDialogDismiss } from "../lib/dialog";
import { playSound } from "../lib/sound";
import { track } from "../lib/umami";
import { StarSparkle } from "reicon-react";
import { compactModalDialogClass } from "./Modal";

const STORAGE_KEY_DISMISSED = "star_popup_dismissed";
const STORAGE_KEY_VISITS = "star_popup_visits";
const MIN_VISITS = 5;
const SHOW_CHANCE = 0.2;
const COOLDOWN_DAYS = 7;

function shouldShow(): boolean {
  try {
    const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
    if (dismissed) {
      const ts = Number(dismissed);
      const daysSince = (Date.now() - ts) / (1000 * 60 * 60 * 24);
      if (daysSince < COOLDOWN_DAYS) return false;
    }

    const visits = Number(localStorage.getItem(STORAGE_KEY_VISITS) || "0") + 1;
    localStorage.setItem(STORAGE_KEY_VISITS, String(visits));

    return visits >= MIN_VISITS && Math.random() < SHOW_CHANCE;
  } catch {
    return false;
  }
}

function writeDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY_DISMISSED, String(Date.now()));
  } catch {
    /* unavailable */
  }
}

function StarIcon() {
  return <StarSparkle size={20} weight="Filled" aria-hidden="true" />;
}

function handleSparkle() {
  playSound("sparkle");
}

export default function StarPopup() {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openRef = useRef<boolean | null>(null);

  const finish = useCallback((clickedStar: boolean) => {
    if (!openRef.current) return;
    openRef.current = false;
    writeDismissed();
    closeDialog(dialogRef.current);
    playSound(clickedStar ? "sparkle" : "droplet");
    track(clickedStar ? "star_popup_click" : "star_popup_dismiss");
  }, []);

  const dismiss = useCallback(() => finish(false), [finish]);
  const dismissRef = useRef(dismiss);

  useDialogDismiss(dialogRef, () => dismissRef.current());

  useEffect(() => {
    if (openRef.current === null) {
      openRef.current = shouldShow();
    }
    if (!openRef.current) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => dismissRef.current();

    if (!dialog.open) showDialog(dialog);
    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  function handleStar() {
    finish(true);
  }

  const repoUrl = "https://github.com/TeenBiscuits/Pasame-Examenes";

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      className={`${compactModalDialogClass} p-6`}
      aria-labelledby="star-popup-title"
    >
      <div className="text-center">
        <button
          type="button"
          aria-label={t.starPopup.sparkleButton}
          onClick={handleSparkle}
          className="bg-reward-light text-github-star mx-auto mb-4 flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color,scale] duration-150 ease-out hover:bg-reward-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reward-fg active:scale-[0.96]"
        >
          <StarIcon />
        </button>

        <h2
          id="star-popup-title"
          className="text-fg mb-2 text-lg font-semibold"
        >
          {t.starPopup.title}
        </h2>
        <p className="text-fg-secondary mb-6 text-sm">{t.starPopup.subtitle}</p>

        <div className="flex flex-col gap-2">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cuelume-hover="sparkle"
            onClick={handleStar}
            className="bg-reward text-on-reward hover:bg-reward-hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold no-underline transition-[background-color,scale] duration-150 ease-out active:scale-[0.96]"
          >
            <StarIcon />
            {t.starPopup.starButton}
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="text-fg-muted hover:text-fg-secondary hover:bg-surface cursor-pointer rounded-lg px-4 py-2 text-sm transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.96]"
          >
            {t.starPopup.dismiss}
          </button>
        </div>
      </div>
    </dialog>
  );
}
