import { useCallback, useEffect, useMemo, useState } from "react";
import type { Question, SubjectMeta } from "../data/types";

const STORAGE_PREFIX = "exam-sources:v1:";

function getAvailableExamIds(subject: SubjectMeta): string[] {
  const examIds: string[] = [];
  for (const exam of subject.exams) {
    if (!exam.deleteRights) examIds.push(exam.id);
  }
  return examIds;
}

function readSelectedExamIds(
  subjectId: string,
  availableExamIds: string[],
): string[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${subjectId}`);
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

export function filterQuestionsByExamSelection(
  questions: Question[],
  selectedExamIds: string[],
): Question[] {
  const selected = new Set(selectedExamIds);
  return questions.filter((question) => selected.has(question.examId));
}

export function useExamSelection(subject: SubjectMeta | undefined) {
  const subjectId = subject?.id;
  const availableExamIds = useMemo(
    () => (subject ? getAvailableExamIds(subject) : []),
    [subject],
  );
  const availableExamIdsKey = availableExamIds.join(",");
  const storageKey = subjectId ? `${STORAGE_PREFIX}${subjectId}` : null;
  const selectionKey = subjectId
    ? `${subjectId}:${availableExamIdsKey}`
    : null;
  const [selectionState, setSelectionState] = useState<{
    key: string | null;
    ids: string[];
  }>(() => ({
    key: selectionKey,
    ids: subject ? readSelectedExamIds(subject.id, availableExamIds) : [],
  }));
  const selectedExamIds = useMemo(
    () =>
      selectionState.key === selectionKey
        ? selectionState.ids
        : subject
          ? readSelectedExamIds(subject.id, availableExamIds)
          : [],
    [
      availableExamIds,
      selectionKey,
      selectionState.key,
      selectionState.ids,
      subject,
    ],
  );

  useEffect(() => {
    if (!storageKey) return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || !subject) return;
      setSelectionState({
        key: selectionKey,
        ids: readSelectedExamIds(subject.id, availableExamIds),
      });
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey, subject, availableExamIds, selectionKey]);

  const updateSelectedExamIds = useCallback(
    (ids: string[]) => {
      if (!subjectId) return;

      const requested = new Set(ids);
      const next = availableExamIds.filter((id) => requested.has(id));
      if (next.length === 0) return;

      setSelectionState({ key: selectionKey, ids: next });
      try {
        localStorage.setItem(storageKey!, JSON.stringify(next));
      } catch {
        /* localStorage unavailable */
      }
    },
    [availableExamIds, selectionKey, subjectId, storageKey],
  );

  return {
    availableExamIds,
    selectedExamIds,
    setSelectedExamIds: updateSelectedExamIds,
  };
}
