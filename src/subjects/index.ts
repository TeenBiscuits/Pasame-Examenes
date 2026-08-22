import type { Question, SubjectMeta } from "../data/types";
import { isHomepageSubject, isNavigableSubject } from "./visibility";

interface MetaModule {
	meta: SubjectMeta;
}

interface QuestionsModule {
	questions: Question[];
}

// Auto-discover subjects using Vite's import.meta.glob.
const metaModules = import.meta.glob<MetaModule>(["./*/meta.ts"], {
	eager: true,
});
const questionsModules = import.meta.glob<QuestionsModule>([
	"./*/questions.ts",
]);

const discoveredSubjects: SubjectMeta[] = [];
for (const m of Object.values(metaModules)) {
	discoveredSubjects.push(m.meta);
}

export const subjects = discoveredSubjects.filter((subject) =>
	isHomepageSubject(subject.id),
);

export function getSubject(id: string): SubjectMeta | undefined {
	const subject = discoveredSubjects.find((s) => s.id === id);
	return subject && isNavigableSubject(subject.id) ? subject : undefined;
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
