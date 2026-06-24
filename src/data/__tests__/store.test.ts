import { describe, it, expect, beforeEach } from "vitest";
import { getTopicProgress, saveAttempt } from "../store";
import type { ExamAttempt } from "../types";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] ?? null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

function makeAttempt(overrides: Partial<ExamAttempt> = {}): ExamAttempt {
  return {
    id: "1",
    exam: "practice",
    mode: "practice",
    topic: "topic-a",
    date: new Date().toISOString(),
    score: 10,
    maxScore: 20,
    answers: {},
    ...overrides,
  };
}

describe("getTopicProgress", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const questions = [
    { topic: "topic-a", points: 10 },
    { topic: "topic-a", points: 5 },
    { topic: "topic-b", points: 10 },
    { topic: "topic-b", points: 10 },
  ];

  it("returns zero progress when no attempts", () => {
    const progress = getTopicProgress("subject-1", questions);
    expect(progress["topic-a"]).toEqual({ attempted: 0, total: 15 });
    expect(progress["topic-b"]).toEqual({ attempted: 0, total: 20 });
  });

  it("tracks correct total points per topic", () => {
    const progress = getTopicProgress("subject-2", questions);
    expect(progress["topic-a"]?.total).toBe(15);
    expect(progress["topic-b"]?.total).toBe(20);
  });

  it("uses max score from attempts for each topic", () => {
    saveAttempt("subject-3", makeAttempt({ topic: "topic-a", score: 8 }));
    saveAttempt("subject-3", makeAttempt({ topic: "topic-a", score: 12 }));
    saveAttempt("subject-3", makeAttempt({ topic: "topic-b", score: 5 }));

    const progress = getTopicProgress("subject-3", questions);
    expect(progress["topic-a"]?.attempted).toBe(12);
    expect(progress["topic-b"]?.attempted).toBe(5);
  });

  it("ignores exam mode attempts", () => {
    saveAttempt("subject-4", makeAttempt({ topic: "topic-a", score: 8, mode: "exam" }));

    const progress = getTopicProgress("subject-4", questions);
    expect(progress["topic-a"]?.attempted).toBe(0);
  });

  it("handles attempts without topic", () => {
    saveAttempt("subject-5", makeAttempt({ topic: undefined, score: 20 }));

    const progress = getTopicProgress("subject-5", questions);
    expect(progress["topic-a"]?.attempted).toBe(0);
  });

  it("handles corrupt localStorage data gracefully", () => {
    localStorage.setItem("exam-attempts:subject-6", "not-valid-json");
    const progress = getTopicProgress("subject-6", questions);
    expect(progress["topic-a"]).toEqual({ attempted: 0, total: 15 });
  });

  it("returns empty object for empty questions array", () => {
    const progress = getTopicProgress("subject-7", []);
    expect(Object.keys(progress)).toHaveLength(0);
  });
});
