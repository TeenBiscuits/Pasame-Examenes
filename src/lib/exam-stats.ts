import type { Exam, Question } from "../data/types";
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

export function getExamQuestionStats(
  exams: Exam[],
  questions: Question[],
): Map<string, ExamQuestionStats> {
  const stats = new Map<string, ExamQuestionStats>();

  for (const exam of exams) {
    const examQuestions = questions.filter(
      (question) => question.examId === exam.id,
    );
    stats.set(exam.id, {
      questionCount: examQuestions.length,
      points: examQuestions.reduce((sum, question) => sum + question.points, 0),
    });
  }

  return stats;
}
