import type { ExamAttempt } from "./types";

function getAttempts(subjectId: string): ExamAttempt[] {
  try {
    const data = localStorage.getItem(`exam-attempts:${subjectId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(subjectId: string, attempt: ExamAttempt) {
  try {
    const attempts = getAttempts(subjectId);
    attempts.push(attempt);
    localStorage.setItem(
      `exam-attempts:${subjectId}`,
      JSON.stringify(attempts),
    );
  } catch (e) {
    console.error("Failed to save attempt", e);
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
