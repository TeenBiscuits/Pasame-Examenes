import type { Question } from "../data/types";

export function gradeQuestion(
  question: Question,
  answer: string,
  selfGrade?: "correct" | "incorrect",
): number {
  if (!answer || answer.trim() === "") return 0;
  if (question.type === "mc") {
    return answer === question.correctAnswer ? question.points : 0;
  }
  if (question.type === "matching") {
    try {
      const user = JSON.parse(answer) as Record<string, string>;
      const correct = question.correctAnswer as Record<string, string>;
      const items = Object.keys(correct);
      let correctCount = 0;
      for (const item of items) {
        if (user[item] === correct[item]) correctCount++;
      }
      return Math.round((correctCount / items.length) * question.points);
    } catch {
      return 0;
    }
  }
  if (question.type === "text") {
    return selfGrade === "correct" ? question.points : 0;
  }
  return 0;
}
