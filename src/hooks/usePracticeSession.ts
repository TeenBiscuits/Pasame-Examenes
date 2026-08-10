import { useReducer, useCallback, useEffect, useRef } from "react";
import type { Question } from "../data/types";
import { saveAttempt } from "../data/store";
import { track } from "../lib/umami";
import { triggerMedium } from "../lib/haptics";
import { playSuccess, playError } from "../lib/sound";
import { getQuestionScore, isSelfGradedQuestion } from "../lib/grading";

const getNow = () => Date.now();

interface PracticeState {
  currentIndex: number;
  answers: Record<string, string>;
  selfGrades: Record<string, "correct" | "incorrect">;
  submitted: boolean;
  checkedQuestions: Record<string, boolean>;
}

type PracticeAction =
  | { type: "SET_CURRENT_INDEX"; index: number }
  | { type: "SYNC_CURRENT_INDEX"; maxIndex: number }
  | { type: "ANSWER"; questionId: string; answer: string }
  | { type: "SELF_GRADE"; questionId: string; grade: "correct" | "incorrect" }
  | { type: "SUBMIT" }
  | { type: "CHECK_QUESTION"; questionId: string };

function reducer(state: PracticeState, action: PracticeAction): PracticeState {
  switch (action.type) {
    case "SET_CURRENT_INDEX":
      return { ...state, currentIndex: action.index };
    case "SYNC_CURRENT_INDEX": {
      const currentIndex = Math.min(state.currentIndex, action.maxIndex);
      return currentIndex === state.currentIndex
        ? state
        : { ...state, currentIndex };
    }
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
    case "CHECK_QUESTION":
      return {
        ...state,
        checkedQuestions: {
          ...state.checkedQuestions,
          [action.questionId]: true,
        },
      };
  }
}

export function usePracticeSession(
  questions: Question[],
  subjectId: string,
  topic: string,
) {
  const [state, dispatch] = useReducer(reducer, {
    currentIndex: 0,
    answers: {},
    selfGrades: {},
    submitted: false,
    checkedQuestions: {},
  });

  const attemptIdRef = useRef("");

  useEffect(() => {
    dispatch({
      type: "SYNC_CURRENT_INDEX",
      maxIndex: Math.max(0, questions.length - 1),
    });
  }, [questions.length]);

  const setCurrentIndex = useCallback(
    (index: number) =>
      dispatch({
        type: "SET_CURRENT_INDEX",
        index: Math.max(0, Math.min(index, Math.max(0, questions.length - 1))),
      }),
    [questions.length],
  );

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    dispatch({ type: "ANSWER", questionId, answer });
  }, []);

  const handleSubmit = useCallback(() => {
    triggerMedium();
    const id = getNow().toString();
    attemptIdRef.current = id;
    let score = 0;
    for (const q of questions) {
      score += getQuestionScore(q, state.answers[q.id] || "", state.selfGrades);
    }
    const answeredCount = Object.values(state.answers).filter(
      (a) => a && a.trim() !== "",
    ).length;
    track("practice_submit", {
      subjectId,
      topic,
      score,
      maxScore: questions.reduce((s, q) => s + q.points, 0),
      questionsCount: questions.length,
      answered: answeredCount,
    });
    saveAttempt(subjectId, {
      id,
      examId: "practice",
      mode: "practice",
      topic,
      date: new Date().toISOString(),
      score,
      maxScore: questions.reduce((s, q) => s + q.points, 0),
      answers: state.answers,
    });
    dispatch({ type: "SUBMIT" });
  }, [subjectId, topic, questions, state.answers, state.selfGrades]);

  const handleSelfGrade = useCallback(
    (questionId: string, grade: "correct" | "incorrect") => {
      track("practice_self_grade", { subjectId, topic, questionId, grade });
      dispatch({ type: "SELF_GRADE", questionId, grade });
      let score = 0;
      const nextGrades = { ...state.selfGrades, [questionId]: grade };
      for (const q of questions) {
        score += getQuestionScore(q, state.answers[q.id] || "", nextGrades);
      }
      saveAttempt(subjectId, {
        id: attemptIdRef.current || getNow().toString(),
        examId: "practice",
        mode: "practice",
        topic,
        date: new Date().toISOString(),
        score,
        maxScore: questions.reduce((s, q) => s + q.points, 0),
        answers: state.answers,
      });
    },
    [subjectId, topic, questions, state.answers, state.selfGrades],
  );

  const handleCheckQuestion = useCallback(
    (questionId: string) => {
      const question = questions.find((q) => q.id === questionId);
      if (
        question &&
        !isSelfGradedQuestion(question) &&
        state.answers[questionId]?.trim()
      ) {
        const isCorrect =
          getQuestionScore(question, state.answers[questionId]) ===
          question.points;
        if (isCorrect) {
          playSuccess();
        } else {
          playError();
        }
      }
      track("practice_check_question", { subjectId, topic, questionId });
      dispatch({ type: "CHECK_QUESTION", questionId });
    },
    [subjectId, topic, questions, state.answers],
  );

  // A source change in another tab can shrink the list while the session is open.
  const currentIndex = Math.max(
    0,
    Math.min(state.currentIndex, Math.max(0, questions.length - 1)),
  );

  return {
    ...state,
    currentIndex,
    setCurrentIndex,
    handleAnswer,
    handleSubmit,
    handleSelfGrade,
    handleCheckQuestion,
    dispatch,
  };
}
