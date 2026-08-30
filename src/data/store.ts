import type { ExamAttempt, Question } from "./types";

export interface AttemptInput
	extends Omit<ExamAttempt, "maxScore" | "questionIds"> {
	questions: Pick<Question, "id" | "points">[];
}

export function createAttempt({
	questions,
	...attempt
}: AttemptInput): ExamAttempt {
	return {
		...attempt,
		questionIds: questions.map((question) => question.id),
		maxScore: questions.reduce((score, question) => score + question.points, 0),
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function parseStringRecord(value: unknown): Record<string, string> {
	if (!isRecord(value)) return {};
	return Object.fromEntries(
		Object.entries(value).filter(
			(entry): entry is [string, string] => typeof entry[1] === "string",
		),
	);
}

function parseSelfGrades(
	value: unknown,
): Record<string, "correct" | "incorrect"> {
	if (!isRecord(value)) return {};
	return Object.fromEntries(
		Object.entries(value).filter(
			(entry): entry is [string, "correct" | "incorrect"] =>
				entry[1] === "correct" || entry[1] === "incorrect",
		),
	);
}

function normalizeAttempt(value: unknown): ExamAttempt | null {
	if (!isRecord(value)) return null;
	if (
		typeof value.id !== "string" ||
		typeof value.examId !== "string" ||
		(value.mode !== "practice" && value.mode !== "exam") ||
		typeof value.date !== "string" ||
		typeof value.score !== "number" ||
		typeof value.maxScore !== "number"
	) {
		return null;
	}

	const answers = parseStringRecord(value.answers);
	const questionIds = Array.isArray(value.questionIds)
		? value.questionIds.filter((id): id is string => typeof id === "string")
		: Object.keys(answers);
	const selectedExamIds = Array.isArray(value.selectedExamIds)
		? value.selectedExamIds.filter((id): id is string => typeof id === "string")
		: value.mode === "exam"
			? [value.examId]
			: [];

	return {
		id: value.id,
		examId: value.examId,
		mode: value.mode,
		...(typeof value.topic === "string" ? { topic: value.topic } : {}),
		selectedExamIds,
		questionIds,
		date: value.date,
		score: value.score,
		maxScore: value.maxScore,
		answers,
		selfGrades: parseSelfGrades(value.selfGrades),
		...(typeof value.timeSpent === "number"
			? { timeSpent: value.timeSpent }
			: {}),
		...(typeof value.durationSeconds === "number"
			? { durationSeconds: value.durationSeconds }
			: {}),
		...(typeof value.passPercentage === "number"
			? { passPercentage: value.passPercentage }
			: {}),
	};
}

export function getAttempts(subjectId: string): ExamAttempt[] {
	try {
		const data = localStorage.getItem(`exam-attempts:${subjectId}`);
		if (!data) return [];
		const parsed: unknown = JSON.parse(data);
		if (!Array.isArray(parsed)) return [];

		const attemptsById = new Map<string, ExamAttempt>();
		for (const value of parsed) {
			const attempt = normalizeAttempt(value);
			if (attempt) attemptsById.set(attempt.id, attempt);
		}
		return [...attemptsById.values()];
	} catch {
		return [];
	}
}

export function saveAttempt(subjectId: string, attempt: ExamAttempt) {
	try {
		const attempts = getAttempts(subjectId);
		let replaced = false;
		const nextAttempts: ExamAttempt[] = [];
		for (const current of attempts) {
			if (current.id !== attempt.id) {
				nextAttempts.push(current);
				continue;
			}
			if (!replaced) {
				nextAttempts.push(attempt);
				replaced = true;
			}
		}
		if (!replaced) nextAttempts.push(attempt);
		localStorage.setItem(
			`exam-attempts:${subjectId}`,
			JSON.stringify(nextAttempts),
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
	questions: { topic: string; points: number }[],
) {
	const attempts = getAttempts(subjectId).filter((a) => a.mode === "practice");
	const progress: Record<string, { attempted: number; total: number }> = {};

	// Initialize totals
	for (const q of questions) {
		if (!progress[q.topic]) {
			progress[q.topic] = { attempted: 0, total: 0 };
		}
		progress[q.topic].total += q.points;
	}

	// Calculate attempted from max score per topic across attempts
	const topicScores: Record<string, number> = {};
	for (const a of attempts) {
		if (a.topic) {
			if (!topicScores[a.topic] || a.score > topicScores[a.topic]) {
				topicScores[a.topic] = a.score;
			}
		}
	}

	for (const [topic, score] of Object.entries(topicScores)) {
		if (progress[topic]) {
			progress[topic].attempted = score;
		}
	}

	return progress;
}
