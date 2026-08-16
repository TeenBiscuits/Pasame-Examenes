import type { SubjectMeta, Question } from "../data/types";
import { isPublicSubject } from "./visibility";

interface MetaModule {
  meta: SubjectMeta;
}

interface QuestionsModule {
  questions: Question[];
}

// Auto-discover subjects using Vite's import.meta.glob.
// _template is loaded for static analysis but is never a navigable subject.
const metaModules = import.meta.glob<MetaModule>(["./*/meta.ts"], {
  eager: true,
});
const questionsModules = import.meta.glob<QuestionsModule>([
  "./*/questions.ts",
]);

const discoveredSubjects: SubjectMeta[] = [];
for (const m of Object.values(metaModules)) {
  if (m.meta.id === "_template") continue;
  discoveredSubjects.push(m.meta);
}

export const subjects = discoveredSubjects.filter((subject) =>
  isPublicSubject(subject.id),
);

export function getSubject(id: string): SubjectMeta | undefined {
  if (id === "_template") return undefined;
  return discoveredSubjects.find((s) => s.id === id);
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
  examId: string,
): Promise<Question[]> {
  const qs = await getAllQuestions(subjectId);
  return qs.filter((q) => q.examId === examId);
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
// patterns above do the actual work at runtime. Keep this server-only so the
// browser never downloads every question module as background work.
if (import.meta.env.SSR) void import("./_visibility");
