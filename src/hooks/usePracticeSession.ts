import { useCallback, useEffect, useReducer, useRef } from "react";
import { saveAttempt } from "../data/store";
import type { ExamAttempt, Question } from "../data/types";
import { getQuestionScore, isSelfGradedQuestion } from "../lib/grading";
import { playError, playSound, playSuccess } from "../lib/sound";
import { track } from "../lib/umami";

const getNow = () => Date.now();

function getQuestionScores(
	questions: Question[],
	answers: Record<string, string>,
	selfGrades: Record<string, "correct" | "incorrect">,
) {
	return Object.fromEntries(
		questions.map((question) => [
			question.id,
			getQuestionScore(question, answers[question.id] || "", selfGrades),
		]),
	);
}

function createPracticeAttempt(
	id: string,
	topic: string,
	questions: Question[],
	answers: Record<string, string>,
	selfGrades: Record<string, "correct" | "incorrect">,
	examIds: readonly string[],
): ExamAttempt {
	const questionScores = getQuestionScores(questions, answers, selfGrades);
	const score = Object.values(questionScores).reduce(
		(total, questionScore) => total + questionScore,
		0,
	);

	return {
		id,
		examId: "practice",
		mode: "practice",
		topic,
		date: new Date().toISOString(),
		score,
		maxScore: questions.reduce((total, question) => total + question.points, 0),
		answers,
		examIds: [...examIds],
		questionScores,
	};
}

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
	selectedExamIds: readonly string[],
) {
	const [state, dispatch] = useReducer(reducer, {
		currentIndex: 0,
		answers: {},
		selfGrades: {},
		submitted: false,
		checkedQuestions: {},
	});

	const attemptIdRef = useRef("");
	const submittedQuestionsRef = useRef<Question[] | null>(null);
	const submittedExamIdsRef = useRef<string[] | null>(null);

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
		const id = getNow().toString();
		attemptIdRef.current = id;
		submittedQuestionsRef.current = [...questions];
		submittedExamIdsRef.current = [...selectedExamIds];
		const attempt = createPracticeAttempt(
			id,
			topic,
			questions,
			state.answers,
			state.selfGrades,
			selectedExamIds,
		);
		const answeredCount = Object.values(state.answers).filter(
			(a) => a && a.trim() !== "",
		).length;
		track("practice_submit", {
			subjectId,
			topic,
			score: attempt.score,
			maxScore: attempt.maxScore,
			questionsCount: questions.length,
			answered: answeredCount,
		});
		saveAttempt(subjectId, attempt);
		dispatch({ type: "SUBMIT" });
	}, [
		subjectId,
		topic,
		questions,
		selectedExamIds,
		state.answers,
		state.selfGrades,
	]);

	const handleSelfGrade = useCallback(
		(questionId: string, grade: "correct" | "incorrect") => {
			track("practice_self_grade", { subjectId, topic, questionId, grade });
			dispatch({ type: "SELF_GRADE", questionId, grade });
			if (!state.submitted) return;

			const nextGrades = { ...state.selfGrades, [questionId]: grade };
			const submittedQuestions = submittedQuestionsRef.current ?? questions;
			const submittedExamIds = submittedExamIdsRef.current ?? selectedExamIds;
			const attempt = createPracticeAttempt(
				attemptIdRef.current,
				topic,
				submittedQuestions,
				state.answers,
				nextGrades,
				submittedExamIds,
			);
			saveAttempt(subjectId, attempt);
		},
		[
			subjectId,
			topic,
			questions,
			selectedExamIds,
			state.answers,
			state.selfGrades,
			state.submitted,
		],
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
			} else if (question && isSelfGradedQuestion(question)) {
				playSound("ready");
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
