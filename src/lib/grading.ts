import type { Question } from "../data/types";

export type QuestionResult = "correct" | "incorrect" | "pending" | undefined;

export function getQuestionResult(
  q: Question,
  answer: string | undefined,
): "correct" | "incorrect" | undefined {
  const trimmed = (answer || "").trim();
  if (!trimmed) return undefined;

  if (q.type === "mc") {
    return trimmed === q.correctAnswer ? "correct" : "incorrect";
  }
  if (q.type === "matching") {
    try {
      const user = JSON.parse(trimmed) as Record<string, string>;
      const correct = q.correctAnswer as Record<string, string>;
      const items = Object.keys(correct);
      let correctCount = 0;
      for (const item of items) {
        if (user[item] === correct[item]) correctCount++;
      }
      return correctCount === items.length ? "correct" : "incorrect";
    } catch {
      return "incorrect";
    }
  }
  return undefined;
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

    if (q.type === "text") {
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
        results[q.id] = getQuestionResult(q, answer);
      }
    }
  }
  return results;
}
