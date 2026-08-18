import type { SubjectMeta, Question } from "../data/types";
import { isPublicSubject } from "./visibility";
import { subjectQuestionCounts } from "./subjectQuestionCounts.generated";

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
const topicQuestionsModules = import.meta.glob<QuestionsModule>(
  "./generated/*/topics/*.ts",
);
const examQuestionsModules = import.meta.glob<QuestionsModule>(
  "./generated/*/exams/*.ts",
);

const discoveredSubjects: SubjectMeta[] = [];
for (const m of Object.values(metaModules)) {
  if (m.meta.id === "_template") continue;
  discoveredSubjects.push(m.meta);
}

export const subjects = discoveredSubjects.filter((subject) =>
  isPublicSubject(subject.id),
);

export { subjectQuestionCounts };

export function getSubject(id: string): SubjectMeta | undefined {
  if (id === "_template") return undefined;
  return discoveredSubjects.find((s) => s.id === id);
}

export async function getQuestionsByTopic(
  subjectId: string,
  topic: string,
): Promise<Question[]> {
  const modulePath = `./generated/${subjectId}/topics/${safeModuleName(topic)}.ts`;
  const mod = await topicQuestionsModules[modulePath]?.();
  return mod?.questions ?? [];
}

export async function getQuestionsByExam(
  subjectId: string,
  examId: string,
): Promise<Question[]> {
  const modulePath = `./generated/${subjectId}/exams/${safeModuleName(examId)}.ts`;
  const mod = await examQuestionsModules[modulePath]?.();
  return mod?.questions ?? [];
}

function safeModuleName(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

export async function getTopicMegaTopicLabel(
  subjectId: string,
  topicKey: string,
): Promise<string | undefined> {
  const subject = getSubject(subjectId);
  if (!subject?.megatopics) return undefined;
  return subject.megatopics.find((mt) => mt.topics.includes(topicKey))?.label;
}

// Keep the reachability marker available to React Doctor and other static
// analysis tools without loading all canonical question files in production.
if (import.meta.env.DEV) {
  void import("./_visibility");
}
