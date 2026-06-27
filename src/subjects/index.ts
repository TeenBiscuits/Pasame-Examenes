import type { SubjectMeta, Question } from "../data/types";

interface MetaModule {
  meta: SubjectMeta;
}

interface QuestionsModule {
  questions: Question[];
}

// Auto-discover subjects using Vite's import.meta.glob.
// Exclude _template — it's a copy-paste starter, not a real subject.
const metaModules = import.meta.glob<MetaModule>(
  ["./*/meta.ts", "!./_template/meta.ts"],
  { eager: true },
);
const questionsModules = import.meta.glob<QuestionsModule>(
  ["./*/questions.ts", "!./_template/questions.ts"],
);

export const subjects: SubjectMeta[] = [];
for (const m of Object.values(metaModules)) {
  subjects.push(m.meta);
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
