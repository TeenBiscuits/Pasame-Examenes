import { describe, it, expect } from "vitest";
import { gradeQuestion } from "../grading";
import type { Question } from "../../data/types";

function makeMC(overrides: Partial<Question> = {}): Question {
  return {
    id: "q1",
    exam: "2024",
    topic: "topic1",
    type: "mc",
    points: 5,
    question: "What is 2+2?",
    options: ["A. 3", "B. 4", "C. 5"],
    correctAnswer: "b",
    ...overrides,
  };
}

function makeText(overrides: Partial<Question> = {}): Question {
  return {
    id: "q2",
    exam: "2024",
    topic: "topic1",
    type: "text",
    points: 10,
    question: "Explain...",
    correctAnswer: "Model answer",
    explanation: "Key points",
    ...overrides,
  };
}

function makeMatching(overrides: Partial<Question> = {}): Question {
  return {
    id: "q3",
    exam: "2024",
    topic: "topic1",
    type: "matching",
    points: 4,
    question: "Match concepts",
    correctAnswer: { A: "X", B: "Y" },
    ...overrides,
  };
}

describe("gradeQuestion", () => {
  describe("multiple choice", () => {
    it("awards full points for correct answer", () => {
      const q = makeMC({ correctAnswer: "b", points: 5 });
      expect(gradeQuestion(q, "b")).toBe(5);
    });

    it("awards 0 for wrong answer", () => {
      const q = makeMC({ correctAnswer: "b", points: 5 });
      expect(gradeQuestion(q, "a")).toBe(0);
      expect(gradeQuestion(q, "c")).toBe(0);
    });

    it("awards 0 for empty answer", () => {
      const q = makeMC();
      expect(gradeQuestion(q, "")).toBe(0);
      expect(gradeQuestion(q, "  ")).toBe(0);
    });

    it("is case-sensitive", () => {
      const q = makeMC({ correctAnswer: "B", points: 5 });
      expect(gradeQuestion(q, "b")).toBe(0);
      expect(gradeQuestion(q, "B")).toBe(5);
    });

    it("respects point values", () => {
      const q = makeMC({ correctAnswer: "a", points: 3 });
      expect(gradeQuestion(q, "a")).toBe(3);
    });
  });

  describe("text / open-ended", () => {
    it("awards full points when self-graded correct", () => {
      const q = makeText({ points: 10 });
      expect(gradeQuestion(q, "some answer", "correct")).toBe(10);
    });

    it("awards 0 when self-graded incorrect", () => {
      const q = makeText({ points: 10 });
      expect(gradeQuestion(q, "some answer", "incorrect")).toBe(0);
    });

    it("awards 0 when no self-grade provided", () => {
      const q = makeText({ points: 10 });
      expect(gradeQuestion(q, "some answer")).toBe(0);
      expect(gradeQuestion(q, "some answer", undefined)).toBe(0);
    });

    it("awards 0 for empty answer even if self-graded correct", () => {
      const q = makeText({ points: 10 });
      expect(gradeQuestion(q, "", "correct")).toBe(0);
      expect(gradeQuestion(q, "  ", "correct")).toBe(0);
    });
  });

  describe("matching", () => {
    it("awards full points when all matches correct", () => {
      const q = makeMatching({
        correctAnswer: { A: "X", B: "Y" },
        points: 4,
      });
      expect(gradeQuestion(q, JSON.stringify({ A: "X", B: "Y" }))).toBe(4);
    });

    it("awards half points for half matches", () => {
      const q = makeMatching({
        correctAnswer: { A: "X", B: "Y" },
        points: 4,
      });
      expect(gradeQuestion(q, JSON.stringify({ A: "X", B: "Z" }))).toBe(2);
    });

    it("awards 0 when all matches wrong", () => {
      const q = makeMatching({
        correctAnswer: { A: "X", B: "Y" },
        points: 4,
      });
      expect(gradeQuestion(q, JSON.stringify({ A: "Z", B: "W" }))).toBe(0);
    });

    it("rounds fractional points", () => {
      const q = makeMatching({
        correctAnswer: { A: "X", B: "Y", C: "Z" },
        points: 5,
      });
      expect(
        gradeQuestion(q, JSON.stringify({ A: "X", B: "Y", C: "W" })),
      ).toBe(3); // 2/3 of 5 = 3.33 → rounds to 3
    });

    it("returns 0 for invalid JSON", () => {
      const q = makeMatching();
      expect(gradeQuestion(q, "not json")).toBe(0);
      expect(gradeQuestion(q, "{broken")).toBe(0);
    });

    it("returns 0 for empty answer", () => {
      const q = makeMatching();
      expect(gradeQuestion(q, "")).toBe(0);
    });

    it("handles V/F matching (true/false style)", () => {
      const q = makeMatching({
        correctAnswer: { "Statement 1": "V", "Statement 2": "F" },
        points: 2,
      });
      expect(
        gradeQuestion(q, JSON.stringify({ "Statement 1": "V", "Statement 2": "F" })),
      ).toBe(2);
      expect(
        gradeQuestion(q, JSON.stringify({ "Statement 1": "V", "Statement 2": "V" })),
      ).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("returns 0 for undefined answer", () => {
      const q = makeMC();
      expect(gradeQuestion(q, undefined as unknown as string)).toBe(0);
    });

    it("respects different point values across types", () => {
      const mc = makeMC({ correctAnswer: "a", points: 7 });
      const text = makeText({ points: 3 });
      const matching = makeMatching({
        correctAnswer: { X: "A" },
        points: 6,
      });

      expect(gradeQuestion(mc, "a")).toBe(7);
      expect(gradeQuestion(text, "ans", "correct")).toBe(3);
      expect(gradeQuestion(matching, JSON.stringify({ X: "A" }))).toBe(6);
    });
  });
});
