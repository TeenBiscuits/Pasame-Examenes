import { useCallback, useEffect, useMemo, useState } from "react";
import type { Question, SubjectMeta } from "../data/types";

const STORAGE_PREFIX = "exam-sources:v1:";

function getAvailableExamYears(subject: SubjectMeta): string[] {
  const years: string[] = [];
  for (const exam of subject.exams) {
    if (!exam.deleteRights) years.push(exam.year);
  }
  return years;
}

function readSelectedExamYears(
  subjectId: string,
  availableExamYears: string[],
): string[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${subjectId}`);
    if (!stored) return availableExamYears;

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return availableExamYears;

    const storedYears = new Set(
      parsed.filter((year): year is string => typeof year === "string"),
    );
    const selected = availableExamYears.filter((year) => storedYears.has(year));
    return selected.length > 0 ? selected : availableExamYears;
  } catch {
    return availableExamYears;
  }
}

export function filterQuestionsByExamSelection(
  questions: Question[],
  selectedExamYears: string[],
): Question[] {
  const selected = new Set(selectedExamYears);
  return questions.filter(
    (question) => question.exam === "both" || selected.has(question.exam),
  );
}

export function useExamSelection(subject: SubjectMeta | undefined) {
  const subjectId = subject?.id;
  const availableExamYears = useMemo(
    () => (subject ? getAvailableExamYears(subject) : []),
    [subject],
  );
  const availableExamYearsKey = availableExamYears.join(",");
  const storageKey = subjectId ? `${STORAGE_PREFIX}${subjectId}` : null;
  const selectionKey = subjectId
    ? `${subjectId}:${availableExamYearsKey}`
    : null;
  const [selectionState, setSelectionState] = useState<{
    key: string | null;
    years: string[];
  }>(() => ({
    key: selectionKey,
    years: subject ? readSelectedExamYears(subject.id, availableExamYears) : [],
  }));
  const selectedExamYears = useMemo(
    () =>
      selectionState.key === selectionKey
        ? selectionState.years
        : subject
          ? readSelectedExamYears(subject.id, availableExamYears)
          : [],
    [
      availableExamYears,
      selectionKey,
      selectionState.key,
      selectionState.years,
      subject,
    ],
  );

  useEffect(() => {
    if (!storageKey) return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || !subject) return;
      setSelectionState({
        key: selectionKey,
        years: readSelectedExamYears(subject.id, availableExamYears),
      });
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey, subject, availableExamYears, selectionKey]);

  const updateSelectedExamYears = useCallback(
    (years: string[]) => {
      if (!subjectId) return;

      const requested = new Set(years);
      const next = availableExamYears.filter((year) => requested.has(year));
      if (next.length === 0) return;

      setSelectionState({ key: selectionKey, years: next });
      try {
        localStorage.setItem(storageKey!, JSON.stringify(next));
      } catch {
        /* localStorage unavailable */
      }
    },
    [availableExamYears, selectionKey, subjectId, storageKey],
  );

  return {
    availableExamYears,
    selectedExamYears,
    setSelectedExamYears: updateSelectedExamYears,
  };
}
