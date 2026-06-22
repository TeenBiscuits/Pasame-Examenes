import { useEffect, useRef } from "react";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";

interface AddExamModalProps {
  open: boolean;
  onClose: () => void;
  subjectId: string;
  subjectName: string;
}

export default function AddExamModal({
  open,
  onClose,
  subjectId,
  subjectName,
}: AddExamModalProps) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const issueUrl = `${t.addExam.openIssueUrl}&title=${encodeURIComponent(`${subjectName}`)}`;

  return (
    <dialog
      ref={dialogRef}
      className="animate-dialog m-auto max-w-sm rounded-2xl bg-white p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
      aria-labelledby="add-exam-title"
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      onClose={() => {
        track("add_exam_modal_close", { subjectId });
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2
            id="add-exam-title"
            className="text-lg font-semibold text-gray-900"
          >
            {t.addExam.title}
          </h2>
          <button
            type="button"
            onClick={() => {
              track("add_exam_modal_close_btn", { subjectId });
              dialogRef.current?.close();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label={t.addExam.close}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          <a
            href={issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("add_exam_open_issue", { subjectId })}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400 transition-colors cursor-pointer text-left no-underline text-inherit"
          >
            <span className="text-xl">📝</span>
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {t.addExam.openIssue}
              </div>
              <div className="text-xs text-gray-500">
                {t.addExam.openIssueDesc}
              </div>
            </div>
          </a>

          <a
            href="https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("add_exam_contribute", { subjectId })}
            className="flex items-center gap-3 p-3 rounded-xl border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-colors cursor-pointer text-left no-underline text-inherit"
          >
            <span className="text-xl">🚀</span>
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {t.addExam.contribute}
              </div>
              <div className="text-xs text-gray-500">
                {t.addExam.contributeDesc}
              </div>
            </div>
          </a>

          <div className="pt-2 border-t border-gray-200">
            <a
              href="mailto:pablo.portas@udc.es"
              onClick={() => track("add_exam_email", { subjectId })}
              className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer text-left no-underline text-inherit"
            >
              <span className="text-xl">✉️</span>
              <div>
                <div className="font-medium text-gray-600 text-sm">
                  {t.addExam.email}
                </div>
                <div className="text-xs text-gray-400">pablo.portas@udc.es</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
