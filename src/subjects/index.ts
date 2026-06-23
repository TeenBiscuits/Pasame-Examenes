declare const __VERCEL_PRODUCTION__: boolean;

import type { MegaTopic, SubjectMeta, Question } from "../data/types";

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
const questionsModules = import.meta.glob<QuestionsModule>("./*/questions.ts", {
  eager: true,
});

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

export function getAllQuestions(subjectId: string): Question[] {
  const modulePath = `./${subjectId}/questions.ts`;
  return questionsModules[modulePath]?.questions ?? [];
}

export function getQuestionsByTopic(
  subjectId: string,
  topic: string,
): Question[] {
  const qs = getAllQuestions(subjectId);
  return qs.filter((q) => q.topic === topic);
}

export function getQuestionsByExam(
  subjectId: string,
  exam: string,
): Question[] {
  const qs = getAllQuestions(subjectId);
  return qs.filter((q) => q.exam === exam || q.exam === "both");
}

export function getTopicMegaTopic(
  subjectId: string,
  topicKey: string,
): MegaTopic | undefined {
  const subject = getSubject(subjectId);
  if (!subject?.megatopics) return undefined;
  return subject.megatopics.find((mt) => mt.topics.includes(topicKey));
}

export function getTopicMegaTopicLabel(
  subjectId: string,
  topicKey: string,
): string | undefined {
  return getTopicMegaTopic(subjectId, topicKey)?.label;
}
