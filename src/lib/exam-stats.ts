import type { Exam, Question } from "../data/types";

export interface ExamQuestionStats {
  questionCount: number;
  points: number;
}

export function getExamQuestionStats(
  exams: Exam[],
  questions: Question[],
): Map<string, ExamQuestionStats> {
  const stats = new Map<string, ExamQuestionStats>();

  for (const exam of exams) {
    const examQuestions = questions.filter(
      (question) => question.exam === exam.year,
    );
    stats.set(exam.year, {
      questionCount: examQuestions.length,
      points: examQuestions.reduce((sum, question) => sum + question.points, 0),
    });
  }

  return stats;
}
