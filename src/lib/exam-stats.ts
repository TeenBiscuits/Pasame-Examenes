import type { Exam } from "../data/types";
import { roundPoints } from "./points";

const DEFAULT_PASS_PERCENTAGE = 0.5;

export interface ExamQuestionStats {
	questionCount: number;
	points: number;
}

export function getExamPassPoints(exam: Exam, totalPoints: number) {
	return roundPoints(
		totalPoints * (exam.passPercentage ?? DEFAULT_PASS_PERCENTAGE),
	);
}
