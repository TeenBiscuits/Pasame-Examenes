import { useImperativeHandle, useEffect, useRef, type Ref } from "react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { CloseSquare2 } from "reicon-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquareAddIcon } from "@hugeicons/core-free-icons";

export interface AddSubjectModalHandle {
  open: () => void;
  close: () => void;
}

interface AddSubjectModalProps {
  onClose: () => void;
  ref: Ref<AddSubjectModalHandle>;
}

function AddSubjectModal({ onClose, ref }: AddSubjectModalProps) {
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

  return (
    <dialog
      ref={dialogRef}
      className="animate-dialog bg-surface-alt m-auto max-w-sm rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
      aria-labelledby="add-subject-title"
      onClose={() => {
        track("modal_close", {
          modal: "add_subject",
          method: closeMethodRef.current,
        });
        onClose();
      }}
    >
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 id="add-subject-title" className="text-fg text-lg font-semibold">
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon
                icon={DashboardSquareAddIcon}
                size={24}
                strokeWidth={2}
              />{" "}
              {t.addSubject.title}
            </span>
          </h2>
          <button
            type="button"
            data-cuelume-press
            onClick={() => {
              closeMethodRef.current = "x";
              dialogRef.current?.close();
            }}
            className="text-fg-muted hover:text-fg-secondary cursor-pointer transition-colors"
            aria-label={t.addSubject.close}
          >
            <CloseSquare2 className="size-5" />
          </button>
        </div>

        <div className="space-y-3">
          <a
            href={t.addSubject.openIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("add_subject_open_issue")}
            className="border-accent-border bg-accent-light hover:bg-accent-light hover:border-accent flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left text-inherit no-underline transition-colors"
          >
            <span className="text-xl">📝</span>
            <div>
              <div className="text-fg text-sm font-medium">
                {t.addSubject.openIssue}
              </div>
              <div className="text-fg-muted text-xs">
                {t.addSubject.openIssueDesc}
              </div>
            </div>
          </a>

          <a
            href="https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("add_subject_contribute")}
            className="border-contribute-border bg-contribute-bg hover:bg-contribute-hover-bg hover:border-contribute-hover-border flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left text-inherit no-underline transition-colors"
          >
            <span className="text-xl">🚀</span>
            <div>
              <div className="text-fg text-sm font-medium">
                {t.addSubject.contribute}
              </div>
              <div className="text-fg-muted text-xs">
                {t.addSubject.contributeDesc}
              </div>
            </div>
          </a>

          <div className="border-border border-t pt-2">
            <a
              href="mailto:pablo.portas@udc.es"
              onClick={() => track("add_subject_email")}
              className="border-border bg-surface/50 hover:bg-surface hover:border-border flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left text-inherit no-underline transition-colors"
            >
              <span className="text-xl">✉️</span>
              <div>
                <div className="text-fg-secondary text-sm font-medium">
                  {t.addSubject.email}
                </div>
                <div className="text-fg-muted text-xs">pablo.portas@udc.es</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default AddSubjectModal;
