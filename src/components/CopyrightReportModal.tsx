import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { XSquare } from "reicon-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LegalHammerIcon } from "@hugeicons/core-free-icons";
import { showDialog } from "../lib/dialog";
import { playSound } from "../lib/sound";

const CONTACT_EMAIL = "pablo.portas@udc.es";

export interface CopyrightReportModalHandle {
  open: () => void;
  close: () => void;
}

interface CopyrightReportModalProps {
  onClose: () => void;
  subjectId: string;
  subjectName: string;
  ref: Ref<CopyrightReportModalHandle>;
}

function CopyrightReportModal({
  onClose,
  subjectId,
  subjectName,
  ref,
}: CopyrightReportModalProps) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeMethodRef = useRef<"x" | "backdrop" | "esc">("backdrop");

  useImperativeHandle(ref, () => ({
    open: () => showDialog(dialogRef.current),
    close: () => dialogRef.current?.close(),
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        closeMethodRef.current = "backdrop";
        playSound("droplet");
        dialog.close();
      }
    };
    const handleCancel = () => {
      closeMethodRef.current = "esc";
      playSound("droplet");
    };
    dialog.addEventListener("click", handleBackdropClick);
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("click", handleBackdropClick);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, []);

  const emailSubject = t.copyrightReport.emailSubject.replace(
    "{subjectName}",
    subjectName,
  );
  const emailBody = t.copyrightReport.emailBody
    .replace("{subjectName}", subjectName)
    .replace("{subjectId}", subjectId);
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <dialog
      ref={dialogRef}
      className="animate-dialog bg-surface-alt m-auto max-w-sm rounded-2xl p-6 shadow-2xl backdrop:bg-overlay backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
      aria-labelledby="copyright-report-title"
      onClose={() => {
        track("modal_close", {
          modal: "copyright_report",
          method: closeMethodRef.current,
          subjectId,
        });
        onClose();
      }}
    >
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="copyright-report-title"
            className="text-fg text-lg font-semibold"
          >
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon icon={LegalHammerIcon} size={24} strokeWidth={2} />
              {t.copyrightReport.title}{" "}
            </span>
          </h2>
          <button
            type="button"
            data-cuelume-press="droplet"
            onClick={() => {
              closeMethodRef.current = "x";
              dialogRef.current?.close();
            }}
            className="text-fg-muted hover:text-fg-secondary cursor-pointer transition-colors"
            aria-label={t.copyrightReport.close}
          >
            <XSquare className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-fg-secondary text-sm">
            {t.copyrightReport.description}
          </p>
          <p className="text-fg-muted text-sm">
            {t.copyrightReport.includeDetails}
          </p>

          <a
            data-cuelume-hover="tick"
            data-cuelume-press
            href={mailtoUrl}
            onClick={() => track("copyright_report_email", { subjectId })}
            className="border-danger-border bg-danger-light hover:bg-danger-light hover:border-danger-fg text-fg flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left no-underline transition-colors"
          >
            <span className="text-danger-fg text-xl" aria-hidden="true">
              !
            </span>
            <div>
              <div className="text-sm font-medium">
                {t.copyrightReport.email}
              </div>
              <div className="text-fg-muted text-xs">{CONTACT_EMAIL}</div>
            </div>
          </a>
        </div>
      </div>
    </dialog>
  );
}

export default CopyrightReportModal;
