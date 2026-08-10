import { useReducer, useCallback, useRef, useEffect } from "react";
import type { Question } from "../data/types";
import { track } from "../lib/umami";
import { triggerMedium } from "../lib/haptics";
import { getQuestionScore } from "../lib/grading";

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

export function useExamSession(
  questions: Question[],
  subjectId: string,
  examId: string,
  initialTimeLeft: number,
  t: { exam: { submitConfirm: string } },
  onTimeUp: () => void,
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
      examId,
      questionsCount: questions.length,
      totalPoints: questions.reduce((s, q) => s + q.points, 0),
    });
    dispatch({ type: "START" });
    startTimeRef.current = getNow();
  }, [subjectId, examId, questions]);

  const handleSubmit = useCallback(
    (skipConfirm = false) => {
      if (!skipConfirm && !window.confirm(t.exam.submitConfirm)) return;

      triggerMedium();
      const elapsed = Math.floor((getNow() - startTimeRef.current) / 1000);
      let score = 0;
      for (const q of questions) {
        score += getQuestionScore(
          q,
          state.answers[q.id] || "",
          state.selfGrades,
        );
      }
      const answeredCount = Object.values(state.answers).filter(
        (a) => a && a.trim() !== "",
      ).length;
      track("exam_submit", {
        subjectId,
        examId,
        score,
        maxScore: questions.reduce((s, q) => s + q.points, 0),
        timeSpent: elapsed,
        questionsCount: questions.length,
        answered: answeredCount,
      });
      dispatch({ type: "SUBMIT", elapsed });
    },
    [subjectId, examId, questions, state.answers, state.selfGrades, t],
  );

  const handleSelfGrade = useCallback(
    (questionId: string, grade: "correct" | "incorrect") => {
      track("exam_self_grade", { subjectId, examId, questionId, grade });
      dispatch({ type: "SELF_GRADE", questionId, grade });
    },
    [subjectId, examId],
  );

  // Timer
  useEffect(() => {
    if (!state.started || state.submitted || timeUp) return;
    const timer = setInterval(() => {
      if (state.timeLeft === 1) onTimeUp();
      dispatch({ type: "TICK" });
    }, 1000);
    return () => clearInterval(timer);
  }, [state.started, state.submitted, state.timeLeft, timeUp, onTimeUp]);

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
        examId,
        questionsCount: questions.length,
      });
    }
  }, [
    state.timeLeft,
    state.started,
    state.submitted,
    subjectId,
    examId,
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
