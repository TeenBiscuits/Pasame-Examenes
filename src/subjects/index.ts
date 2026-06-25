declare const __VERCEL_PRODUCTION__: boolean;

import type { SubjectMeta, Question } from "../data/types";

interface MetaModule {
  meta: SubjectMeta;
}

interface QuestionsModule {
  questions: Question[];
}

// Auto-discover subjects using Vite's import.meta.glob
const metaModules = import.meta.glob<MetaModule>("./*/meta.ts", {
  eager: true,
});
const questionsModules = import.meta.glob<QuestionsModule>("./*/questions.ts");

export const subjects: SubjectMeta[] = [];
for (const m of Object.values(metaModules)) {
  const s = m.meta;
  if (
    !(import.meta.env.PROD && __VERCEL_PRODUCTION__ && s.id === "_template")
  ) {
    subjects.push(s);
  }
}

export function getSubject(id: string): SubjectMeta | undefined {
  return subjects.find((s) => s.id === id);
}

export async function getAllQuestions(subjectId: string): Promise<Question[]> {
  const modulePath = `./${subjectId}/questions.ts`;
  const mod = await questionsModules[modulePath]?.();
  return mod?.questions ?? [];
}

export async function getQuestionsByTopic(
  subjectId: string,
  topic: string,
): Promise<Question[]> {
  const qs = await getAllQuestions(subjectId);
  return qs.filter((q) => q.topic === topic);
}

export async function getQuestionsByExam(
  subjectId: string,
  exam: string,
): Promise<Question[]> {
  const qs = await getAllQuestions(subjectId);
  return qs.filter((q) => q.exam === exam || q.exam === "both");
}

export async function getTopicMegaTopicLabel(
  subjectId: string,
  topicKey: string,
): Promise<string | undefined> {
  const subject = getSubject(subjectId);
  if (!subject?.megatopics) return undefined;
  return subject.megatopics.find((mt) => mt.topics.includes(topicKey))?.label;
}
