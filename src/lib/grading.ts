import type { Question } from "../data/types";
import { roundPoints } from "./points";

export type QuestionResult = "correct" | "incorrect" | "pending" | undefined;

export function isSelfGradedQuestion(q: Question): boolean {
	return (
		q.type === "text" ||
		q.type === "multiple-text" ||
		q.type === "fill" ||
		q.type === "table-fill"
	);
}

/** Composite key for the self-grade of one part of a `multiple-text` question. */
export function getPartSelfGradeKey(
	questionId: string,
	partIndex: number,
): string {
	return `${questionId}:${partIndex}`;
}

/**
 * Points awarded for a `multiple-text` part. Explicit `part.points` wins;
 * otherwise the remaining points (after explicit parts) are split equally
 * among the parts without explicit points, absorbing rounding remainders.
 */
export function getTextPartPoints(q: Question, partIndex: number): number {
	const parts = q.textParts || [];
	if (parts.length === 0) return q.points;
	const explicit = parts[partIndex]?.points;
	if (explicit != null) return explicit;

	const implicitCount = parts.filter((p) => p.points == null).length;
	if (implicitCount === 0) return 0;

	const explicitTotal = parts.reduce((s, p) => s + (p.points ?? 0), 0);
	const remaining = q.points - explicitTotal;
	const share = roundPoints(remaining / implicitCount);
	const shareTotal = roundPoints(share * implicitCount);
	const implicitIndex = parts
		.slice(0, partIndex)
		.filter((p) => p.points == null).length;
	if (implicitIndex === implicitCount - 1) {
		return roundPoints(share + (remaining - shareTotal));
	}
	return share;
}

/** Points still pending self-grading for a question. */
export function getPendingSelfGradePoints(
	q: Question,
	selfGrades: Record<string, "correct" | "incorrect">,
): number {
	if (q.type === "multiple-text") {
		const parts = q.textParts || [];
		let pending = 0;
		for (let i = 0; i < parts.length; i++) {
			if (selfGrades[getPartSelfGradeKey(q.id, i)] == null) {
				pending += getTextPartPoints(q, i);
			}
		}
		return roundPoints(pending);
	}
	return selfGrades[q.id] == null ? q.points : 0;
}

/** Whether every part (or the whole question) has been self-graded. */
export function isFullySelfGraded(
	q: Question,
	selfGrades: Record<string, "correct" | "incorrect">,
): boolean {
	if (q.type === "multiple-text") {
		const parts = q.textParts || [];
		if (parts.length === 0) return true;
		return parts.every(
			(_, i) => selfGrades[getPartSelfGradeKey(q.id, i)] != null,
		);
	}
	return selfGrades[q.id] != null;
}

function isFillQuestion(q: Question): boolean {
	return q.type === "fill" || q.type === "table-fill";
}

function parseFillAnswers(answer: string | undefined): unknown[] | undefined {
	if (!answer) return undefined;
	try {
		const parsed = JSON.parse(answer) as unknown;
		return Array.isArray(parsed) ? parsed : undefined;
	} catch {
		return undefined;
	}
}

export function isFillAnswerCorrect(
	answer: string | undefined,
	expected: string,
	index: number,
): boolean {
	const userAnswers = parseFillAnswers(answer);
	const value = userAnswers?.[index];
	return (
		typeof value === "string" &&
		value.trim().toLocaleLowerCase() === expected.trim().toLocaleLowerCase()
	);
}

export function isAutomaticallyCorrect(
	q: Question,
	answer: string | undefined,
): boolean {
	if (!isFillQuestion(q) || !answer) return false;

	const userAnswers = parseFillAnswers(answer);
	const correctAnswers = q.correctAnswer as string[];
	return (
		userAnswers?.length === correctAnswers.length &&
		correctAnswers.every((expected, index) =>
			isFillAnswerCorrect(answer, expected, index),
		)
	);
}

export function getQuestionScore(
	q: Question,
	answer: string | undefined,
	selfGrades: Record<string, "correct" | "incorrect"> = {},
): number {
	if (q.type === "multiple-text") {
		const parts = q.textParts || [];
		let score = 0;
		for (let i = 0; i < parts.length; i++) {
			if (selfGrades[getPartSelfGradeKey(q.id, i)] === "correct") {
				score += getTextPartPoints(q, i);
			}
		}
		return roundPoints(score);
	}
	if (isSelfGradedQuestion(q)) {
		if (isAutomaticallyCorrect(q, answer)) return q.points;
		return selfGrades[q.id] === "correct" ? q.points : 0;
	}
	const trimmed = (answer || "").trim();
	if (!trimmed) return 0;

	if (q.type === "mc") {
		return trimmed === q.correctAnswer ? q.points : 0;
	}
	if (q.type === "matching") {
		try {
			const user = JSON.parse(trimmed) as Record<string, string>;
			const correct = q.correctAnswer as Record<string, string>;
			const items = Object.keys(correct);
			const correctCount = items.filter(
				(item) => user[item] === correct[item],
			).length;
			return roundPoints((correctCount / items.length) * q.points);
		} catch {
			return 0;
		}
	}
	return 0;
}

export function computeQuestionResults(
	questions: Question[],
	answers: Record<string, string>,
	checkedQuestions: Record<string, boolean>,
	selfGrades: Record<string, "correct" | "incorrect">,
	submitted: boolean,
): Record<string, QuestionResult> {
	const results: Record<string, QuestionResult> = {};
	for (const q of questions) {
		const isVisible = !!checkedQuestions[q.id] || submitted;
		if (!isVisible) continue;

		if (isSelfGradedQuestion(q)) {
			if (isAutomaticallyCorrect(q, answers[q.id])) {
				results[q.id] = "correct";
				continue;
			}
			if (q.type === "multiple-text") {
				const parts = q.textParts || [];
				if (parts.length === 0) {
					results[q.id] = "pending";
					continue;
				}
				const grades = parts.map(
					(_, i) => selfGrades[getPartSelfGradeKey(q.id, i)],
				);
				if (grades.every((grade) => grade === "correct")) {
					results[q.id] = "correct";
				} else if (grades.some((grade) => grade === "incorrect")) {
					results[q.id] = "incorrect";
				} else {
					results[q.id] = "pending";
				}
				continue;
			}
			if (selfGrades[q.id] === "correct") {
				results[q.id] = "correct";
			} else if (selfGrades[q.id] === "incorrect") {
				results[q.id] = "incorrect";
			} else {
				results[q.id] = "pending";
			}
		} else {
			const answer = answers[q.id];
			if (!answer || answer.trim() === "") {
				results[q.id] = "incorrect";
			} else {
				results[q.id] =
					getQuestionScore(q, answer) === q.points ? "correct" : "incorrect";
			}
		}
	}
	return results;
}
