import { useCallback, useEffect, useReducer, useRef } from "react";
import { createAttempt, saveAttempt } from "../data/store";
import type { Question, SelfGrade } from "../data/types";
import { getTotalScore } from "../lib/grading";
import { track } from "../lib/umami";

const getNow = () => Date.now();

interface ExamState {
	currentIndex: number;
	answers: Record<string, string>;
	selfGrades: Record<string, SelfGrade>;
	submitted: boolean;
	timeLeft: number;
	started: boolean;
}

type ExamAction =
	| { type: "SET_CURRENT_INDEX"; index: number }
	| { type: "ANSWER"; questionId: string; answer: string }
	| { type: "SELF_GRADE"; questionId: string; grade: SelfGrade }
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
	passPercentage?: number,
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
	const attemptIdRef = useRef("");
	const attemptDateRef = useRef("");
	const attemptQuestionsRef = useRef<Question[]>([]);
	const attemptTimeSpentRef = useRef(0);

	const persistAttempt = useCallback(
		(
			id: string,
			attemptQuestions: Question[],
			date: string,
			answers: Record<string, string>,
			selfGrades: Record<string, SelfGrade>,
			score: number,
			timeSpent: number,
		) => {
			saveAttempt(
				subjectId,
				createAttempt({
					id,
					examId,
					mode: "exam",
					selectedExamIds: [examId],
					questions: attemptQuestions,
					date,
					score,
					answers,
					selfGrades,
					timeSpent,
					durationSeconds: initialTimeLeft,
					...(passPercentage == null ? {} : { passPercentage }),
				}),
			);
		},
		[subjectId, examId, initialTimeLeft, passPercentage],
	);

	const setCurrentIndex = useCallback(
		(index: number) => dispatch({ type: "SET_CURRENT_INDEX", index }),
		[],
	);

	const handleAnswer = useCallback((questionId: string, answer: string) => {
		dispatch({ type: "ANSWER", questionId, answer });
	}, []);

	const handleStart = useCallback(() => {
		if (state.started) return;

		track("exam_start", {
			subjectId,
			examId,
			questionsCount: questions.length,
			totalPoints: questions.reduce((s, q) => s + q.points, 0),
		});
		dispatch({ type: "START" });
		startTimeRef.current = getNow();
	}, [subjectId, examId, questions, state.started]);

	const handleSubmit = useCallback(
		(skipConfirm = false) => {
			if (state.submitted || attemptIdRef.current || !state.started)
				return false;
			if (!skipConfirm && !window.confirm(t.exam.submitConfirm)) return false;

			const elapsed = Math.floor((getNow() - startTimeRef.current) / 1000);
			const id = getNow().toString();
			const date = new Date().toISOString();
			const maxScore = questions.reduce((s, q) => s + q.points, 0);
			const score = getTotalScore(questions, state.answers, state.selfGrades);
			attemptIdRef.current = id;
			attemptDateRef.current = date;
			attemptQuestionsRef.current = questions;
			attemptTimeSpentRef.current = elapsed;
			const answeredCount = Object.values(state.answers).filter(
				(a) => a && a.trim() !== "",
			).length;
			track("exam_submit", {
				subjectId,
				examId,
				score,
				maxScore,
				timeSpent: elapsed,
				questionsCount: questions.length,
				answered: answeredCount,
			});
			persistAttempt(
				id,
				questions,
				date,
				state.answers,
				state.selfGrades,
				score,
				elapsed,
			);
			dispatch({ type: "SUBMIT", elapsed });
			return true;
		},
		[
			subjectId,
			examId,
			questions,
			state.answers,
			state.selfGrades,
			state.started,
			state.submitted,
			t,
			persistAttempt,
		],
	);

	const handleSelfGrade = useCallback(
		(questionId: string, grade: SelfGrade) => {
			track("exam_self_grade", { subjectId, examId, questionId, grade });
			dispatch({ type: "SELF_GRADE", questionId, grade });
			if (!state.submitted || !attemptIdRef.current) return;

			const nextGrades = { ...state.selfGrades, [questionId]: grade };
			const attemptQuestions = attemptQuestionsRef.current;
			persistAttempt(
				attemptIdRef.current,
				attemptQuestions,
				attemptDateRef.current,
				state.answers,
				nextGrades,
				getTotalScore(attemptQuestions, state.answers, nextGrades),
				attemptTimeSpentRef.current,
			);
		},
		[
			subjectId,
			examId,
			state.answers,
			state.selfGrades,
			state.submitted,
			persistAttempt,
		],
	);

	// Timer
	useEffect(() => {
		if (!state.started || state.submitted || state.timeLeft <= 0) return;
		const timer = setInterval(() => {
			dispatch({ type: "TICK" });
		}, 1000);
		return () => clearInterval(timer);
	}, [state.started, state.submitted, state.timeLeft]);

	// Time up submits the attempt before notifying the page so the timeout is not lost.
	useEffect(() => {
		if (state.timeLeft <= 0 && state.started && !state.submitted) {
			if (!timeUpTrackedRef.current) {
				timeUpTrackedRef.current = true;
				track("exam_time_up", {
					subjectId,
					examId,
					questionsCount: questions.length,
				});
			}
			handleSubmit(true);
			onTimeUp();
		}
	}, [
		state.timeLeft,
		state.started,
		state.submitted,
		subjectId,
		examId,
		questions.length,
		handleSubmit,
		onTimeUp,
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
