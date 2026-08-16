import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { QuestionSummary, SubjectMeta } from "../data/types";

const STORAGE_PREFIX = "exam-sources:v1:";
const CHANGE_EVENT = "exam-sources-change";

function getAvailableExamIds(subject: SubjectMeta): string[] {
  const examIds: string[] = [];
  for (const exam of subject.exams) {
    if (!exam.deleteRights) examIds.push(exam.id);
  }
  return examIds;
}

function parseSelectedExamIds(
  stored: string | null,
  availableExamIds: string[],
): string[] {
  try {
    if (!stored) return availableExamIds;

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return availableExamIds;

    const storedIds = new Set(
      parsed.filter((id): id is string => typeof id === "string"),
    );
    const selected = availableExamIds.filter((id) => storedIds.has(id));
    return selected.length > 0 ? selected : availableExamIds;
  } catch {
    return availableExamIds;
  }
}

function readStoredSelection(storageKey: string | null): string | null {
  if (!storageKey) return null;
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function filterQuestionsByExamSelection<T extends QuestionSummary>(
  questions: T[],
  selectedExamIds: string[],
): T[] {
  const selected = new Set(selectedExamIds);
  return questions.filter((question) => selected.has(question.examId));
}

export function useExamSelection(subject: SubjectMeta | undefined) {
  const subjectId = subject?.id;
  const availableExamIds = useMemo(
    () => (subject ? getAvailableExamIds(subject) : []),
    [subject],
  );
  const storageKey = subjectId ? `${STORAGE_PREFIX}${subjectId}` : null;
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!storageKey) return () => {};
      const handleStorage = (event: StorageEvent) => {
        if (event.key === storageKey) onChange();
      };
      window.addEventListener("storage", handleStorage);
      window.addEventListener(CHANGE_EVENT, onChange);
      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(CHANGE_EVENT, onChange);
      };
    },
    [storageKey],
  );
  const getSnapshot = useCallback(
    () => readStoredSelection(storageKey),
    [storageKey],
  );
  const storedSelection = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => null,
  );
  const selectedExamIds = parseSelectedExamIds(
    storedSelection,
    availableExamIds,
  );

  const updateSelectedExamIds = useCallback(
    (ids: string[]) => {
      if (!subjectId) return;

      const requested = new Set(ids);
      const next = availableExamIds.filter((id) => requested.has(id));
      if (next.length === 0) return;

      try {
        localStorage.setItem(storageKey!, JSON.stringify(next));
        window.dispatchEvent(new Event(CHANGE_EVENT));
      } catch {
        /* localStorage unavailable */
      }
    },
    [availableExamIds, subjectId, storageKey],
  );

  return {
    availableExamIds,
    selectedExamIds,
    setSelectedExamIds: updateSelectedExamIds,
  };
}
