import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { CmsContext } from "./cms-context";
import type { Patches, QuestionPatch, MetaPatch } from "./cms-types";

async function apiFetch(
  path: string,
  options?: RequestInit,
): Promise<unknown> {
  const res = await fetch(`/api/cms${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    throw new Error(`CMS API error: ${res.status}`);
  }
  return res.json();
}

export function CmsProvider({ children }: { children: ReactNode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [patchVersion, setPatchVersion] = useState(0);
  const [patchesBySubject, setPatchesBySubject] = useState<
    Record<string, Patches>
  >({});
  const patchesRef = useRef(patchesBySubject);

  useEffect(() => {
    patchesRef.current = patchesBySubject;
  }, [patchesBySubject]);

  const fetchPatches = useCallback(async (subjectId: string) => {
    if (!import.meta.env.DEV) return;
    try {
      const data = (await apiFetch(
        `/patches/${subjectId}`,
      )) as Patches;
      setPatchesBySubject((prev) => ({
        ...prev,
        [subjectId]: data,
      }));
    } catch {
      // ignore in dev
    }
  }, []);

  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const patchQuestion = useCallback(
    async (
      subjectId: string,
      questionId: string,
      patch: QuestionPatch,
    ) => {
      if (!import.meta.env.DEV) return;
      await apiFetch(`/patches/${subjectId}/${questionId}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      await fetchPatches(subjectId);
      setPatchVersion((v) => v + 1);
    },
    [fetchPatches],
  );

  const patchMeta = useCallback(
    async (subjectId: string, patch: MetaPatch) => {
      if (!import.meta.env.DEV) return;
      await apiFetch(`/patches/${subjectId}`, {
        method: "PATCH",
        body: JSON.stringify({ meta: patch }),
      });
      await fetchPatches(subjectId);
      setPatchVersion((v) => v + 1);
    },
    [fetchPatches],
  );

  const resetQuestionPatch = useCallback(
    async (subjectId: string, questionId: string) => {
      if (!import.meta.env.DEV) return;
      await apiFetch(`/patches/${subjectId}/${questionId}`, {
        method: "DELETE",
      });
      await fetchPatches(subjectId);
      setPatchVersion((v) => v + 1);
    },
    [fetchPatches],
  );

  const availableImages = useCallback(
    async (subjectId: string) => {
      if (!import.meta.env.DEV) return { images: [] };
      try {
        return (await apiFetch(`/images/${subjectId}`)) as {
          images: string[];
        };
      } catch {
        return { images: [] };
      }
    },
    [],
  );

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "E") {
        e.preventDefault();
        setIsEditing((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <CmsContext.Provider
      value={{
        isEditing,
        toggleEditing,
        patchVersion,
        patchesBySubject,
        patchQuestion,
        patchMeta,
        resetQuestionPatch,
        availableImages,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}
