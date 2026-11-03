import type { GeneratedSubjectBuildStats } from "./content-stats";

/** The bank's order wins over the order in which sources were selected. */
export function getPracticeLoadingPreview(
	stats: GeneratedSubjectBuildStats | undefined,
	topic: string | undefined,
	selectedExamIds: readonly string[],
) {
	if (!stats || !topic) return undefined;
	const selected = new Set(selectedExamIds);
	const firstQuestion = stats.topicFirstQuestions[topic]?.find((question) =>
		selected.has(question.examId),
	);
	if (!firstQuestion) return undefined;
	let questionCount = 0;
	let totalPoints = 0;
	for (const examId of selected) {
		const counts = stats.topicStatsByExam[examId]?.[topic];
		questionCount += counts?.questionCount ?? 0;
		totalPoints += counts?.points ?? 0;
	}
	return { firstQuestion, questionCount, totalPoints };
}
