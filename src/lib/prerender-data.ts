import { createContext, useContext } from "react";
import type { Question } from "../data/types";

/**
 * Per-subject question lists seeded at build time into the prerendered HTML.
 *
 * The server (entry-server) preloads a subject's questions and seeds them here
 * so the page renders synchronously during SSG. On the client, `main.tsx` reads
 * the `#__PRERENDER_DATA__` script tag and seeds the same data so the first
 * client render matches the prerendered HTML (no loading flash). When absent
 * (client-side navigation, or routes that weren't prerendered), pages fall back
 * to the existing lazy `getAllQuestions`/`getQuestionsByTopic`/`getQuestionsByExam`
 * effect.
 */
export type PrerenderData = Record<string, Question[]>;

export const PrerenderDataContext = createContext<PrerenderData | null>(null);

/**
 * Returns the full question list for a subject if it was seeded during
 * prerender, or `null` when no prerendered data is available.
 */
export function usePrerenderedQuestions(subjectId?: string): Question[] | null {
  const data = useContext(PrerenderDataContext);
  if (!data || !subjectId) return null;
  return data[subjectId] ?? null;
}
