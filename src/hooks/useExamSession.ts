import { useReducer, useCallback, useRef, useEffect } from "react";
import type { Question } from "../data/types";
import { saveAttempt } from "../data/store";
import { track } from "../lib/umami";
import { triggerMedium } from "../lib/haptics";

const getNow = () => Date.now();

interface ExamState {
  currentIndex: number;
  answers: Record<string, string>;
  selfGrades: Record<string, "correct" | "incorrect">;
  submitted: boolean;
  timeLeft: number;
  started: boolean;
}

type ExamAction =
  | { type: "SET_CURRENT_INDEX"; index: number }
  | { type: "ANSWER"; questionId: string; answer: string }
  | { type: "SELF_GRADE"; questionId: string; grade: "correct" | "incorrect" }
  | { type: "SUBMIT"; elapsed: number }
  | { type: "START" }
  | { type: "TICK" }
  | { type: "SET_TIME"; timeLeft: number };

function reducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "SET_CURRENT_INDEX":
      return { ...state, currentIndex: action.index };
    case "ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answer },
      };
    case "SELF_GRADE":
      return {
        ...state,
        selfGrades: { ...state.selfGrades, [action.questionId]: action.grade },
      };
    case "SUBMIT":
      return { ...state, submitted: true };
    case "START":
      return { ...state, started: true };
    case "TICK":
      return { ...state, timeLeft: state.timeLeft - 1 };
    case "SET_TIME":
      return { ...state, timeLeft: action.timeLeft };
  }
}

function gradeQuestion(
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

export function useExamSession(
  questions: Question[],
  subjectId: string,
  year: string,
  initialTimeLeft: number,
  t: { exam: { submitConfirm: string } },
) {
  const [state, dispatch] = useReducer(reducer, {
    currentIndex: 0,
    answers: {},
    selfGrades: {},
    submitted: false,
    timeLeft: initialTimeLeft,
    started: false,
  });

  const timeUp = state.timeLeft <= 0 && state.started && !state.submitted;

  const startTimeRef = useRef(0);
  const attemptIdRef = useRef("");
  const timeUpTrackedRef = useRef(false);

  const setCurrentIndex = useCallback(
    (index: number) => dispatch({ type: "SET_CURRENT_INDEX", index }),
    [],
  );

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    dispatch({ type: "ANSWER", questionId, answer });
  }, []);

  const handleStart = useCallback(() => {
    triggerMedium();
    track("exam_start", {
      subjectId,
      year,
      questionsCount: questions.length,
      totalPoints: questions.reduce((s, q) => s + q.points, 0),
    });
    dispatch({ type: "START" });
    startTimeRef.current = getNow();
  }, [subjectId, year, questions]);

  const handleSubmit = useCallback(
    (skipConfirm = false) => {
      if (!skipConfirm && !window.confirm(t.exam.submitConfirm)) return;

      triggerMedium();
      const elapsed = Math.floor((getNow() - startTimeRef.current) / 1000);
      const id = getNow().toString();
      attemptIdRef.current = id;
      let score = 0;
      for (const q of questions) {
        score += gradeQuestion(
          q,
          state.answers[q.id] || "",
          state.selfGrades[q.id],
        );
      }
      const answeredCount = Object.values(state.answers).filter(
        (a) => a && a.trim() !== "",
      ).length;
      track("exam_submit", {
        subjectId,
        year,
        score,
        maxScore: questions.reduce((s, q) => s + q.points, 0),
        timeSpent: elapsed,
        questionsCount: questions.length,
        answered: answeredCount,
      });
      saveAttempt(subjectId, {
        id,
        exam: year,
        mode: "exam",
        date: new Date().toISOString(),
        score,
        maxScore: questions.reduce((s, q) => s + q.points, 0),
        answers: state.answers,
        timeSpent: elapsed,
      });
      dispatch({ type: "SUBMIT", elapsed });
    },
    [subjectId, year, questions, state.answers, state.selfGrades, t],
  );

  const handleSelfGrade = useCallback(
    (questionId: string, grade: "correct" | "incorrect") => {
      track("exam_self_grade", { subjectId, year, questionId, grade });
      dispatch({ type: "SELF_GRADE", questionId, grade });
      const elapsed = Math.floor((getNow() - startTimeRef.current) / 1000);
      let score = 0;
      const nextGrades = { ...state.selfGrades, [questionId]: grade };
      for (const q of questions) {
        score += gradeQuestion(q, state.answers[q.id] || "", nextGrades[q.id]);
      }
      saveAttempt(subjectId, {
        id: attemptIdRef.current || getNow().toString(),
        exam: year,
        mode: "exam",
        date: new Date().toISOString(),
        score,
        maxScore: questions.reduce((s, q) => s + q.points, 0),
        answers: state.answers,
        timeSpent: elapsed,
      });
    },
    [subjectId, year, questions, state.answers, state.selfGrades],
  );

  // Timer
  useEffect(() => {
    if (!state.started || state.submitted || timeUp) return;
    const timer = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(timer);
  }, [state.started, state.submitted, timeUp]);

  // Time up tracking
  useEffect(() => {
    if (
      state.timeLeft === 0 &&
      state.started &&
      !state.submitted &&
      !timeUpTrackedRef.current
    ) {
      timeUpTrackedRef.current = true;
      track("exam_time_up", {
        subjectId,
        year,
        questionsCount: questions.length,
      });
    }
  }, [
    state.timeLeft,
    state.started,
    state.submitted,
    subjectId,
    year,
    questions.length,
  ]);

  return {
    ...state,
    timeUp,
    setCurrentIndex,
    handleAnswer,
    handleStart,
    handleSubmit,
    handleSelfGrade,
    dispatch,
  };
}
