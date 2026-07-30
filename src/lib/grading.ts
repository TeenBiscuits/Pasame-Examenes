import type { Question } from "../data/types";
import { roundPoints } from "./points";

export type QuestionResult = "correct" | "incorrect" | "pending" | undefined;

export function isSelfGradedQuestion(q: Question): boolean {
  return q.type === "text" || q.type === "fill" || q.type === "table-fill";
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
  selfGrade?: "correct" | "incorrect",
): number {
  if (isSelfGradedQuestion(q)) {
    if (isAutomaticallyCorrect(q, answer)) return q.points;
    return selfGrade === "correct" ? q.points : 0;
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
