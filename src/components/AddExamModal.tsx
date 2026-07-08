import { useImperativeHandle, useEffect, useRef, type Ref } from "react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";

export interface AddExamModalHandle {
  open: () => void;
  close: () => void;
}

interface AddExamModalProps {
  onClose: () => void;
  subjectId: string;
  subjectName: string;
  ref: Ref<AddExamModalHandle>;
}

function AddExamModal({
  onClose,
  subjectId,
  subjectName,
  ref,
}: AddExamModalProps) {
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

  const issueUrl = `${t.addExam.openIssueUrl}&title=${encodeURIComponent(subjectName)}&subject=${encodeURIComponent(subjectId)}`;

  return (
    <dialog
      ref={dialogRef}
      className="animate-dialog bg-surface-alt m-auto max-w-sm rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
      aria-labelledby="add-exam-title"
      onClose={() => {
        track("modal_close", {
          modal: "add_exam",
          method: closeMethodRef.current,
          subjectId,
        });
        onClose();
      }}
    >
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h2 id="add-exam-title" className="text-fg text-lg font-semibold">
            {t.addExam.title}
          </h2>
          <button
            type="button"
            onClick={() => {
              closeMethodRef.current = "x";
              dialogRef.current?.close();
            }}
            className="text-fg-muted hover:text-fg-secondary cursor-pointer transition-colors"
            aria-label={t.addExam.close}
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

        <div className="space-y-3">
          <p className="border-border bg-surface/50 text-fg-muted rounded-xl border p-3 text-xs">
            {t.addExam.legalNotice}
          </p>

          <a
            href={issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("add_exam_open_issue", { subjectId })}
            className="border-accent-border bg-accent-light hover:bg-accent-light hover:border-accent flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left text-inherit no-underline transition-colors"
          >
            <span className="text-xl">📝</span>
            <div>
              <div className="text-fg text-sm font-medium">
                {t.addExam.openIssue}
              </div>
              <div className="text-fg-muted text-xs">
                {t.addExam.openIssueDesc}
              </div>
            </div>
          </a>

          <a
            href="https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("add_exam_contribute", { subjectId })}
            className="border-contribute-border bg-contribute-bg hover:bg-contribute-hover-bg hover:border-contribute-hover-border flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left text-inherit no-underline transition-colors"
          >
            <span className="text-xl">🚀</span>
            <div>
              <div className="text-fg text-sm font-medium">
                {t.addExam.contribute}
              </div>
              <div className="text-fg-muted text-xs">
                {t.addExam.contributeDesc}
              </div>
            </div>
          </a>

          <div className="border-border border-t pt-2">
            <a
              href="mailto:pablo.portas@udc.es"
              onClick={() => track("add_exam_email", { subjectId })}
              className="border-border bg-surface/50 hover:bg-surface hover:border-border flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left text-inherit no-underline transition-colors"
            >
              <span className="text-xl">✉️</span>
              <div>
                <div className="text-fg-secondary text-sm font-medium">
                  {t.addExam.email}
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

export default AddExamModal;
