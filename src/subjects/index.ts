import type { SubjectMeta, Question } from "../data/types";

interface MetaModule {
  meta: SubjectMeta;
}

interface QuestionsModule {
  questions: Question[];
}

// Auto-discover subjects using Vite's import.meta.glob.
// _template is always loaded but hidden from the homepage in production.
const metaModules = import.meta.glob<MetaModule>(["./*/meta.ts"], {
  eager: true,
});
const questionsModules = import.meta.glob<QuestionsModule>([
  "./*/questions.ts",
]);

const isProduction =
  typeof __VERCEL_PRODUCTION__ !== "undefined" && __VERCEL_PRODUCTION__;

export const subjects: SubjectMeta[] = [];
for (const m of Object.values(metaModules)) {
  if (isProduction && m.meta.id === "_template") continue;
  subjects.push(m.meta);
}

export function getSubject(id: string): SubjectMeta | undefined {
  if (isProduction && id === "_template") return undefined;
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

// Reachability marker: makes _visibility.ts discoverable by static analysis
// tools so they see every subject's named exports as consumed. The glob
// patterns above do the actual work at runtime.
import("./_visibility");
