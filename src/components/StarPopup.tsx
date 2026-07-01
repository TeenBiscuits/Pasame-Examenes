import { useCallback, useEffect, useRef } from "react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";

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

    const visits =
      Number(localStorage.getItem(STORAGE_KEY_VISITS) || "0") + 1;
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
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
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
  dismissRef.current = dismiss;

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
      className="animate-dialog m-auto max-w-sm rounded-2xl bg-surface-alt p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
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
          className="text-lg font-semibold text-fg mb-2"
        >
          {t.starPopup.title}
        </h2>
        <p className="text-sm text-fg-secondary mb-6">
          {t.starPopup.subtitle}
        </p>

        <div className="flex flex-col gap-2">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleStar}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 active:scale-[0.98] transition no-underline"
          >
            <StarIcon />
            {t.starPopup.starButton}
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="px-4 py-2 rounded-lg text-sm text-fg-muted hover:text-fg-secondary hover:bg-surface transition cursor-pointer"
          >
            {t.starPopup.dismiss}
          </button>
        </div>
      </div>
    </dialog>
  );
}
