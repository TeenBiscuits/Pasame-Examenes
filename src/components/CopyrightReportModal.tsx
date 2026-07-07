import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";

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
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === dialog) {
        closeMethodRef.current = "backdrop";
        dialog.close();
      }
    };
    const handleCancel = () => {
      closeMethodRef.current = "esc";
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
      className="animate-dialog m-auto max-w-sm rounded-2xl bg-surface-alt p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
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
        <div className="flex items-center justify-between mb-5">
          <h2
            id="copyright-report-title"
            className="text-lg font-semibold text-fg"
          >
            {t.copyrightReport.title}
          </h2>
          <button
            type="button"
            onClick={() => {
              closeMethodRef.current = "x";
              dialogRef.current?.close();
            }}
            className="text-fg-muted hover:text-fg-secondary transition-colors cursor-pointer"
            aria-label={t.copyrightReport.close}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-fg-secondary">
            {t.copyrightReport.description}
          </p>
          <p className="text-sm text-fg-muted">
            {t.copyrightReport.includeDetails}
          </p>

          <a
            href={mailtoUrl}
            onClick={() => track("copyright_report_email", { subjectId })}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-t-red-border bg-t-red-bg/70 hover:bg-t-red-bg hover:border-t-red-hover transition-colors cursor-pointer text-left no-underline text-fg"
          >
            <span className="text-xl text-t-red-hover" aria-hidden="true">
              !
            </span>
            <div>
              <div className="font-medium text-sm">
                {t.copyrightReport.email}
              </div>
              <div className="text-xs text-fg-muted">{CONTACT_EMAIL}</div>
            </div>
          </a>
        </div>
      </div>
    </dialog>
  );
}

export default CopyrightReportModal;
