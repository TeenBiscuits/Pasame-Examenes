import type { ExamAttempt, QuestionSummary } from "./types";

function getAttempts(subjectId: string): ExamAttempt[] {
	try {
		const data = localStorage.getItem(`exam-attempts:${subjectId}`);
		const parsed: unknown = data ? JSON.parse(data) : [];
		return Array.isArray(parsed) ? (parsed as ExamAttempt[]) : [];
	} catch {
		return [];
	}
}

export function saveAttempt(subjectId: string, attempt: ExamAttempt) {
	try {
		const attempts = getAttempts(subjectId);
		const existingIndex = attempts.findIndex(({ id }) => id === attempt.id);
		if (existingIndex >= 0) {
			attempts[existingIndex] = attempt;
		} else {
			attempts.push(attempt);
		}
		localStorage.setItem(
			`exam-attempts:${subjectId}`,
			JSON.stringify(attempts),
		);
	} catch (e) {
		console.error("Failed to save attempt", e);
	}
}

export function clearTopicProgress(subjectId: string): number {
	try {
		const attempts = getAttempts(subjectId);
		localStorage.removeItem(`exam-attempts:${subjectId}`);
		return attempts.length;
	} catch (e) {
		console.error("Failed to clear topic progress", e);
		return 0;
	}
}

export function getTopicProgress(
	subjectId: string,
	questions: readonly QuestionSummary[],
	selectedExamIds: readonly string[],
) {
	const selectedExams = new Set(selectedExamIds);
	const selectedQuestions = questions.filter((question) =>
		selectedExams.has(question.examId),
	);
	const attempts = getAttempts(subjectId).filter((a) => a.mode === "practice");
	const progress: Record<string, { attempted: number; total: number }> = {};

	// Initialize totals
	for (const q of selectedQuestions) {
		if (!progress[q.topic]) {
			progress[q.topic] = { attempted: 0, total: 0 };
		}
		progress[q.topic].total += q.points;
	}

	// Keep the best known result for each concrete question across attempts.
	const questionScores: Record<string, number> = {};
	for (const a of attempts) {
		// Old attempts have no source or per-question data, so they cannot be
		// attributed to the selected sources without inventing progress.
		if (!Array.isArray(a.examIds) || !a.questionScores) continue;
		const attemptExams = new Set(
			a.examIds.filter(
				(examId): examId is string => typeof examId === "string",
			),
		);
		for (const question of selectedQuestions) {
			if (!attemptExams.has(question.examId)) continue;
			const score = a.questionScores[question.id];
			if (typeof score !== "number" || !Number.isFinite(score)) continue;
			questionScores[question.id] = Math.max(
				questionScores[question.id] ?? 0,
				Math.min(question.points, Math.max(0, score)),
			);
		}
	}

	for (const question of selectedQuestions) {
		progress[question.topic].attempted += questionScores[question.id] ?? 0;
	}

	return progress;
}
