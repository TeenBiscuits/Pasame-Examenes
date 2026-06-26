import { createContext, useContext } from "react";
import type { Patches, QuestionPatch, MetaPatch } from "./cms-types";

export interface CmsContextValue {
  isEditing: boolean;
  toggleEditing: () => void;
  patchVersion: number;
  patchesBySubject: Record<string, Patches>;
  patchQuestion: (
    subjectId: string,
    questionId: string,
    patch: QuestionPatch,
  ) => Promise<void>;
  patchMeta: (subjectId: string, patch: MetaPatch) => Promise<void>;
  resetQuestionPatch: (
    subjectId: string,
    questionId: string,
  ) => Promise<void>;
  availableImages: (
    subjectId: string,
  ) => Promise<{ images: string[] }>;
}

export const CmsContext = createContext<CmsContextValue>({
  isEditing: false,
  toggleEditing: () => {},
  patchVersion: 0,
  patchesBySubject: {},
  patchQuestion: async () => {},
  patchMeta: async () => {},
  resetQuestionPatch: async () => {},
  availableImages: async () => ({ images: [] }),
});

export function useCms(): CmsContextValue {
  return useContext(CmsContext);
}
