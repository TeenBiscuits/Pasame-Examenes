import { useImperativeHandle, useEffect, useRef, type Ref } from "react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/rybbit";
import { CloseSquare2 } from "reicon-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquareAddIcon } from "@hugeicons/core-free-icons";

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
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon
                icon={DashboardSquareAddIcon}
                size={24}
                strokeWidth={2}
              />{" "}
              {t.addExam.title}
            </span>
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
            <CloseSquare2 className="size-5" />
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
