import { useCallback, useEffect, useRef } from "react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/rybbit";
import { StarSparkle } from "reicon-react";

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

export default function StarPopup() {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openRef = useRef<boolean | null>(null);
  if (openRef.current === null) {
    openRef.current = shouldShow();
  }

  const finish = useCallback((clickedStar: boolean) => {
    if (!openRef.current) return;
    openRef.current = false;
    writeDismissed();
    dialogRef.current?.close();
    track(clickedStar ? "star_popup_click" : "star_popup_dismiss");
  }, []);

  const dismiss = useCallback(() => finish(false), [finish]);
  const dismissRef = useRef(dismiss);

  useEffect(() => {
    if (!openRef.current) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => dismissRef.current();
    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) dismissRef.current();
    };

    dialog.showModal();
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, []);

  function handleStar() {
    finish(true);
  }

  const repoUrl = "https://github.com/TeenBiscuits/Pasame-Examenes";

  return (
    <dialog
      ref={dialogRef}
      className="animate-dialog bg-surface-alt m-auto max-w-sm rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
      aria-labelledby="star-popup-title"
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-500/10">
          <span className="text-amber-500">
            <StarIcon />
          </span>
        </div>

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
            onClick={handleStar}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-amber-600 active:scale-[0.98]"
          >
            <StarIcon />
            {t.starPopup.starButton}
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="text-fg-muted hover:text-fg-secondary hover:bg-surface cursor-pointer rounded-lg px-4 py-2 text-sm transition"
          >
            {t.starPopup.dismiss}
          </button>
        </div>
      </div>
    </dialog>
  );
}
