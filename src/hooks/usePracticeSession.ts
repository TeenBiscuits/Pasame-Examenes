import { useCallback, useEffect, useReducer, useRef } from "react";
import { createAttempt, saveAttempt } from "../data/store";
import type { Question, SelfGrade } from "../data/types";
import {
	getQuestionScore,
	getTotalScore,
	isSelfGradedQuestion,
} from "../lib/grading";
import { playError, playSound, playSuccess } from "../lib/sound";
import { track } from "../lib/umami";

const getNow = () => Date.now();

interface PracticeState {
	currentIndex: number;
	answers: Record<string, string>;
	selfGrades: Record<string, SelfGrade>;
	submitted: boolean;
	checkedQuestions: Record<string, boolean>;
}

type PracticeAction =
	| { type: "SET_CURRENT_INDEX"; index: number }
	| { type: "SYNC_CURRENT_INDEX"; maxIndex: number }
	| { type: "ANSWER"; questionId: string; answer: string }
	| { type: "SELF_GRADE"; questionId: string; grade: SelfGrade }
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
	selectedExamIds: readonly string[] = [],
) {
	const [state, dispatch] = useReducer(reducer, {
		currentIndex: 0,
		answers: {},
		selfGrades: {},
		submitted: false,
		checkedQuestions: {},
	});

	const attemptIdRef = useRef("");
	const attemptDateRef = useRef("");
	const attemptQuestionsRef = useRef<Question[]>([]);
	const attemptSelectedExamIdsRef = useRef<string[]>([]);

	const persistAttempt = useCallback(
		(
			id: string,
			attemptQuestions: Question[],
			attemptSelectedExamIds: readonly string[],
			date: string,
			answers: Record<string, string>,
			selfGrades: Record<string, SelfGrade>,
			score: number,
		) => {
			saveAttempt(
				subjectId,
				createAttempt({
					id,
					examId: "practice",
					mode: "practice",
					topic,
					selectedExamIds: [...attemptSelectedExamIds],
					questions: attemptQuestions,
					date,
					score,
					answers,
					selfGrades,
				}),
			);
		},
		[subjectId, topic],
	);

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
		if (state.submitted || attemptIdRef.current || questions.length === 0)
			return;

		const id = getNow().toString();
		const date = new Date().toISOString();
		attemptIdRef.current = id;
		attemptDateRef.current = date;
		attemptQuestionsRef.current = questions;
		attemptSelectedExamIdsRef.current = [...selectedExamIds];
		const maxScore = questions.reduce((s, q) => s + q.points, 0);
		const score = getTotalScore(questions, state.answers, state.selfGrades);
		const answeredCount = Object.values(state.answers).filter(
			(a) => a && a.trim() !== "",
		).length;
		track("practice_submit", {
			subjectId,
			topic,
			score,
			maxScore,
			questionsCount: questions.length,
			answered: answeredCount,
		});
		persistAttempt(
			id,
			questions,
			selectedExamIds,
			date,
			state.answers,
			state.selfGrades,
			score,
		);
		dispatch({ type: "SUBMIT" });
	}, [
		subjectId,
		topic,
		questions,
		selectedExamIds,
		state.answers,
		state.selfGrades,
		state.submitted,
		persistAttempt,
	]);

	const handleSelfGrade = useCallback(
		(questionId: string, grade: SelfGrade) => {
			track("practice_self_grade", { subjectId, topic, questionId, grade });
			dispatch({ type: "SELF_GRADE", questionId, grade });
			if (!state.submitted || !attemptIdRef.current) return;

			const nextGrades = { ...state.selfGrades, [questionId]: grade };
			const attemptQuestions = attemptQuestionsRef.current;
			const score = getTotalScore(attemptQuestions, state.answers, nextGrades);
			persistAttempt(
				attemptIdRef.current,
				attemptQuestions,
				attemptSelectedExamIdsRef.current,
				attemptDateRef.current,
				state.answers,
				nextGrades,
				score,
			);
		},
		[
			subjectId,
			topic,
			state.answers,
			state.selfGrades,
			state.submitted,
			persistAttempt,
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
