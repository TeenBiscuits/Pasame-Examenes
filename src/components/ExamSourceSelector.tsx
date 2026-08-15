import { type RefObject } from "react";
import type { Exam, SubjectMeta } from "../data/types";
import { useT } from "../i18n/hooks";
import type { ExamQuestionStats } from "../lib/exam-stats";
import { formatPoints } from "../lib/points";
import { ChecklistAlt, Filter } from "reicon-react";
import { playSound } from "../lib/sound";
import { closeDialog, useDialogDismiss } from "../lib/dialog";
import { ModalHeader, wideModalDialogClass } from "./Modal";

interface ExamSourceSelectorProps {
  subject: SubjectMeta;
  selectedExamIds: string[];
  onChange: (ids: string[]) => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
  examStats: ReadonlyMap<string, ExamQuestionStats>;
}

export default function ExamSourceSelector({
  subject,
  selectedExamIds,
  onChange,
  dialogRef,
  examStats,
}: ExamSourceSelectorProps) {
  const t = useT();
  const exams = subject.exams.filter((exam) => !exam.deleteRights);
  const selected = new Set(selectedExamIds);
  const allSelected = selected.size === exams.length;

  useDialogDismiss(dialogRef, () => playSound("droplet"));

  function toggleExam(exam: Exam) {
    const next = new Set(selected);
    if (next.has(exam.id)) {
      next.delete(exam.id);
    } else {
      next.add(exam.id);
    }
    onChange([...next]);
  }

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      className={`${wideModalDialogClass} p-6`}
      aria-labelledby="question-sources-title"
    >
      <ModalHeader
        titleId="question-sources-title"
        closeLabel={t.footer.close}
        onClose={() => closeDialog(dialogRef.current)}
      >
        <Filter
          className="size-5 shrink-0"
          weight={allSelected ? "Outline" : "Filled"}
          aria-hidden="true"
        />
        {t.subjectHome.questionSources}
      </ModalHeader>
      <div className="modal-dialog__scroll pr-1">
        <p className="text-fg-secondary mb-4 text-sm">
          {t.subjectHome.questionSourcesDescription}
        </p>
        <fieldset aria-labelledby="question-sources-selection-label">
          <div className="mb-3 flex min-w-0 items-center justify-between gap-2 sm:gap-3">
            <span
              id="question-sources-selection-label"
              className="text-fg-muted min-w-0 text-[0.625rem] leading-4 font-medium whitespace-nowrap sm:text-xs"
            >
              {t.subjectHome.selectedSources
                .replace("{selected}", String(selected.size))
                .replace("{total}", String(exams.length))}
            </span>
            <button
              type="button"
              data-cuelume-press="toggle"
              className="text-accent-fg hover:text-accent-hover focus-visible:ring-accent inline-flex shrink-0 items-center gap-1 rounded-md px-1 py-1 text-[0.625rem] leading-4 font-medium whitespace-nowrap underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40 sm:gap-1.5 sm:px-2 sm:text-sm"
              onClick={() => onChange(exams.map((exam) => exam.id))}
              disabled={allSelected}
            >
              <ChecklistAlt
                className="size-3.5 shrink-0 sm:size-4"
                aria-hidden="true"
              />
              {t.subjectHome.selectAllSources}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {exams.map((exam) => (
              <label
                key={exam.id}
                className="border-border hover:bg-surface-alt has-[:focus-visible]:ring-accent flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-[:focus-visible]:ring-2"
              >
                <input
                  type="checkbox"
                  className="accent-accent mt-0.5 size-4 shrink-0"
                  data-cuelume-toggle
                  aria-label={exam.title}
                  checked={selected.has(exam.id)}
                  onChange={() => toggleExam(exam)}
                  disabled={selected.size === 1 && selected.has(exam.id)}
                />
                <span className="min-w-0">
                  <span className="text-fg block text-sm font-medium">
                    {exam.title}
                  </span>
                  <span className="text-fg-muted mt-0.5 block text-xs">
                    {examStats.has(exam.id)
                      ? t.exam.questionSummary
                          .replace(
                            "{questions}",
                            String(examStats.get(exam.id)?.questionCount),
                          )
                          .replace(
                            "{points}",
                            formatPoints(examStats.get(exam.id)?.points ?? 0),
                          )
                      : "..."}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </dialog>
  );
}
