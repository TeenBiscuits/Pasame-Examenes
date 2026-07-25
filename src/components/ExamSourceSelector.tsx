import { useEffect, type RefObject } from "react";
import type { Exam, SubjectMeta } from "../data/types";
import { useT } from "../i18n/hooks";
import type { ExamQuestionStats } from "../lib/exam-stats";
import { formatPoints } from "../lib/points";
import { ChecklistAlt, CloseSquare2, Filter } from "reicon-react";

interface ExamSourceSelectorProps {
  subject: SubjectMeta;
  selectedExamYears: string[];
  onChange: (years: string[]) => void;
  dialogRef: RefObject<HTMLDialogElement | null>;
  examStats: ReadonlyMap<string, ExamQuestionStats>;
}

export default function ExamSourceSelector({
  subject,
  selectedExamYears,
  onChange,
  dialogRef,
  examStats,
}: ExamSourceSelectorProps) {
  const t = useT();
  const exams = subject.exams.filter((exam) => !exam.deleteRights);
  const selected = new Set(selectedExamYears);
  const allSelected = selected.size === exams.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;

      const rect = dialog.getBoundingClientRect();
      const insideDialog =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!insideDialog) dialog.close();
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [dialogRef]);

  function toggleExam(exam: Exam) {
    const next = new Set(selected);
    if (next.has(exam.year)) {
      next.delete(exam.year);
    } else {
      next.add(exam.year);
    }
    onChange([...next]);
  }

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      className="animate-dialog bg-surface-alt m-auto max-h-[86svh] w-[min(92vw,42rem)] overflow-hidden rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
      aria-labelledby="question-sources-title"
    >
      <div className="border-border mb-5 flex items-center justify-between gap-4 border-b pb-4">
        <h2
          id="question-sources-title"
          className="text-fg inline-flex items-center gap-2 text-lg font-semibold"
        >
          <Filter
            className="size-5 shrink-0"
            weight={allSelected ? "Outline" : "Filled"}
            aria-hidden="true"
          />
          {t.subjectHome.questionSources}
        </h2>
        <button
          type="button"
          data-cuelume-press
          onClick={() => dialogRef.current?.close()}
          className="text-fg-muted hover:text-fg-secondary focus-visible:ring-accent shrink-0 cursor-pointer rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label={t.footer.close}
        >
          <CloseSquare2 className="size-5" />
        </button>
      </div>
      <div className="max-h-[calc(86svh-7rem)] overflow-y-auto pr-1">
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
              data-cuelume-press
              className="text-accent hover:text-accent-hover focus-visible:ring-accent inline-flex shrink-0 items-center gap-1 rounded-md px-1 py-1 text-[0.625rem] leading-4 font-medium whitespace-nowrap underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40 sm:gap-1.5 sm:px-2 sm:text-sm"
              onClick={() => onChange(exams.map((exam) => exam.year))}
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
                key={exam.year}
                className="border-border hover:bg-surface-alt has-[:focus-visible]:ring-accent flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-[:focus-visible]:ring-2"
              >
                <input
                  type="checkbox"
                  className="accent-accent mt-0.5 size-4 shrink-0"
                  data-cuelume-toggle
                  checked={selected.has(exam.year)}
                  onChange={() => toggleExam(exam)}
                  disabled={selected.size === 1 && selected.has(exam.year)}
                />
                <span className="min-w-0">
                  <span className="text-fg block text-sm font-medium">
                    {exam.title}
                  </span>
                  <span className="text-fg-muted mt-0.5 block text-xs">
                    {examStats.has(exam.year)
                      ? t.exam.questionSummary
                          .replace(
                            "{questions}",
                            String(examStats.get(exam.year)?.questionCount),
                          )
                          .replace(
                            "{points}",
                            formatPoints(examStats.get(exam.year)?.points ?? 0),
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
