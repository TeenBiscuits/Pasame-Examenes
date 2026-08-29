import { getRouteApi, useParams } from "@tanstack/react-router";
import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";
import {
	AngleLeftSquare,
	AngleRightSquare,
	Exit,
	Eye,
	Send,
	Trash5,
	Trophy,
} from "reicon-react";
import Disclaimer from "../components/Disclaimer";
import QuestionCard from "../components/QuestionCard";
import QuestionNavChips from "../components/QuestionNavChips";
import ScoreProgress from "../components/ScoreProgress";
import SimulatorSkeleton from "../components/SimulatorSkeleton";
import type { Question } from "../data/types";
import {
	filterQuestionsByExamSelection,
	useExamSelection,
} from "../hooks/useExamSelection";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { usePracticeTopicNavigation } from "../hooks/usePracticeTopicNavigation";
import { useTopicQuestions } from "../hooks/useTopicQuestions";
import { useT } from "../i18n/hooks";
import {
	computeQuestionResults,
	getPendingSelfGradePoints,
	getQuestionScore,
	isAutomaticallyCorrect,
	isFullySelfGraded,
	isSelfGradedQuestion,
} from "../lib/grading";
import { useCommandHandlers } from "../lib/keyboard-commands";
import { LangLink as Link } from "../lib/lang-link";
import { formatPoints, roundPoints } from "../lib/points";
import { track } from "../lib/umami";
import { getSubject } from "../subjects";

const minScrollRangeForCompactScore = 256;
const practiceRouteApi = getRouteApi("/$lang/$subjectId_/practice_/$topic");

interface PracticePlayerProps {
	subject: NonNullable<ReturnType<typeof getSubject>>;
	topic: string;
	questions: Question[];
	megatopicLabel: string | undefined;
	topicInfo: { icon: string; label: string } | undefined;
	currentIndex: number;
	setCurrentIndex: (i: number) => void;
	answers: Record<string, string>;
	selfGrades: Record<string, "correct" | "incorrect">;
	submitted: boolean;
	checkedQuestions: Record<string, boolean>;
	totalPoints: number;
	direction: "next" | "prev" | undefined;
	setDirection: (d: "next" | "prev" | undefined) => void;
	scrollToHeaderRef: React.MutableRefObject<() => void>;
	showLeftFade: boolean;
	showRightFade: boolean;
	navRef: React.RefObject<HTMLDivElement | null>;
	scrollToNav: (index: number) => void;
	onAnswer: (questionId: string, answer: string) => void;
	onSelfGrade: (questionId: string, grade: "correct" | "incorrect") => void;
	onSubmit: () => void;
	onCheckQuestion: (questionId: string) => void;
	onClearAnswer: (questionId: string) => void;
}

type PracticeSubject = PracticePlayerProps["subject"];

type HoveredPracticeControl =
	| "prev"
	| "next"
	| "clear"
	| "check"
	| "submit"
	| null;

type PracticeHoverAction =
	| { type: "enter"; control: Exclude<HoveredPracticeControl, null> }
	| { type: "leave"; control: Exclude<HoveredPracticeControl, null> };

function practiceHoverReducer(
	state: HoveredPracticeControl,
	action: PracticeHoverAction,
): HoveredPracticeControl {
	if (action.type === "enter") return action.control;
	return state === action.control ? null : state;
}

interface PracticePlayerHeaderProps {
	subject: PracticeSubject;
	topic: string;
	topicInfo: PracticePlayerProps["topicInfo"];
	headerAnchorRef: React.RefObject<HTMLDivElement | null>;
	scrollToHeaderRef: React.MutableRefObject<() => void>;
	questions: Question[];
	answers: Record<string, string>;
	checkedQuestions: Record<string, boolean>;
	currentIndex: number;
	setCurrentIndex: (i: number) => void;
	totalPoints: number;
	questionResults: ReturnType<typeof computeQuestionResults>;
	setDirection: (d: "next" | "prev" | undefined) => void;
	showLeftFade: boolean;
	showRightFade: boolean;
	navRef: React.RefObject<HTMLDivElement | null>;
	scrollToNav: (index: number) => void;
	scoreSummary: React.ReactNode;
}

function PracticePlayerHeader({
	subject,
	topic,
	topicInfo,
	headerAnchorRef,
	scrollToHeaderRef,
	questions,
	answers,
	checkedQuestions,
	currentIndex,
	setCurrentIndex,
	totalPoints,
	questionResults,
	setDirection,
	showLeftFade,
	showRightFade,
	navRef,
	scrollToNav,
	scoreSummary,
}: PracticePlayerHeaderProps) {
	const t = useT();

	return (
		<>
			<div>
				<Link
					to={`/${subject.id}`}
					activeOptions={{ exact: true }}
					data-tour="practice-back"
					data-cuelume-hover
					data-cuelume-press
					className="text-accent-fg focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-md text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
					onClick={() =>
						track("nav_click", { target: "subject_home", from: "practice" })
					}
				>
					<Exit size={16} aria-hidden="true" className="shrink-0" />
					{t.practice.backToTopics}
				</Link>
			</div>
			<div ref={headerAnchorRef} className="h-0" aria-hidden="true" />
			<div className="sticky-player-header bg-surface border-border sticky z-40 -mx-4 mb-4 border-b px-4 pt-2 pb-3 sm:mb-6">
				<div className="flex items-center justify-between gap-4">
					<div className="min-w-0">
						<h1 className="text-fg truncate text-xl font-semibold sm:text-2xl">
							{topicInfo?.icon} {topicInfo?.label || topic}
						</h1>
						<p className="text-fg-muted mt-1 text-sm">
							{questions.length} {t.subjectCard.questions} &middot;{" "}
							{formatPoints(totalPoints)} {t.practice.pointsTotal}
						</p>
					</div>
				</div>
				{scoreSummary && <div className="mt-3">{scoreSummary}</div>}
				<QuestionNavChips
					questions={questions}
					answers={answers}
					currentIndex={currentIndex}
					navRef={navRef}
					showLeftFade={showLeftFade}
					showRightFade={showRightFade}
					checkedQuestions={checkedQuestions}
					questionResults={questionResults}
					dataTour="practice-nav"
					eventName="practice_navigate"
					eventData={{ subjectId: subject.id, topic: topic || "" }}
					className={scoreSummary ? "mt-2 mb-0" : "mt-4 mb-0"}
					onSelectIndex={(i, dir) => {
						setDirection(dir);
						setCurrentIndex(i);
						scrollToHeaderRef.current();
						scrollToNav(i);
					}}
				/>
			</div>
		</>
	);
}

interface PracticeScoreSummaryProps {
	submitted: boolean;
	allTextGraded: boolean;
	pendingTextCount: number;
	pendingTextPoints: number;
	checkedCount: number;
	questionsLength: number;
	gradedScore: number;
	totalPoints: number;
	compact: boolean;
}

function PracticeScoreSummary({
	submitted,
	allTextGraded,
	pendingTextCount,
	pendingTextPoints,
	checkedCount,
	questionsLength,
	gradedScore,
	totalPoints,
	compact,
}: PracticeScoreSummaryProps) {
	const t = useT();
	const completed = submitted && allTextGraded;

	return (
		<ScoreProgress
			score={gradedScore}
			totalPoints={totalPoints}
			pendingPoints={pendingTextPoints}
			colorClassName={completed ? "text-correct-fg" : "text-pending-fg"}
			progressClassName={`transition-[left,right,bottom] duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "right-20 bottom-5 left-16" : "right-4 bottom-4 left-4"}`}
			className={`animate-fade-in-up relative transition-[height] duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "h-12 overflow-hidden" : "min-h-24"}`}
		>
			<div
				className={`relative rounded-lg border-2 transition-[background-color,border-color,padding] duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "h-full overflow-hidden p-0" : "min-h-24 p-3 pb-7 sm:p-4 sm:pb-8"} ${
					completed
						? "border-correct-border bg-correct-bg"
						: "border-pending-border bg-pending-bg"
				}`}
			>
				<div
					className={`text-fg flex items-center gap-2 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "pointer-events-none -translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
				>
					<Trophy
						size={18}
						weight={submitted ? "Filled" : "Outline"}
						aria-hidden="true"
						className="shrink-0"
					/>
					<p className="font-semibold">
						{submitted ? t.practice.score : t.practice.runningScore}
					</p>
					<p className="ml-auto text-lg font-bold whitespace-nowrap tabular-nums">
						{formatPoints(gradedScore)}
						<span className="text-fg-muted mx-1 text-sm font-medium">/</span>
						{formatPoints(totalPoints)}
						<span className="text-fg-muted ml-1 text-sm font-medium">
							{t.practice.points}
						</span>
					</p>
				</div>
				<p
					className={`mt-1 text-sm transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "pointer-events-none translate-y-1 opacity-0" : "translate-y-0 opacity-100"} ${completed ? "text-correct-fg" : "text-pending-fg"}`}
				>
					{submitted && pendingTextCount > 0
						? t.practice.selfGradeHint
						: submitted
							? t.practice.allSelfGraded
							: `${checkedCount} ${t.exam.outOf} ${questionsLength} ${t.practice.checked}`}
				</p>
				<div
					className={`pointer-events-none absolute inset-0 z-10 flex items-center gap-2 px-3 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "opacity-100" : "opacity-0"}`}
					aria-hidden="true"
				>
					<Trophy
						size={18}
						weight={submitted ? "Filled" : "Outline"}
						className={`shrink-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "translate-y-0" : "-translate-y-2"}`}
					/>
					<span className="text-fg ml-auto min-w-[3.5rem] text-right text-sm font-bold whitespace-nowrap tabular-nums">
						{formatPoints(gradedScore)}/{formatPoints(totalPoints)}
					</span>
				</div>
			</div>
		</ScoreProgress>
	);
}

interface PracticeControlsProps {
	subject: PracticeSubject;
	topic: string;
	questions: Question[];
	currentQuestion: Question;
	currentIndex: number;
	setCurrentIndex: (i: number) => void;
	answers: Record<string, string>;
	checkedQuestions: Record<string, boolean>;
	submitted: boolean;
	setDirection: (d: "next" | "prev" | undefined) => void;
	scrollToNav: (index: number) => void;
	scrollToHeader: () => void;
	onSubmit: () => void;
	onCheckQuestion: (questionId: string) => void;
	onClearAnswer: (questionId: string) => void;
}

function PracticeControls({
	subject,
	topic,
	questions,
	currentQuestion,
	currentIndex,
	setCurrentIndex,
	answers,
	checkedQuestions,
	submitted,
	setDirection,
	scrollToNav,
	scrollToHeader,
	onSubmit,
	onCheckQuestion,
	onClearAnswer,
}: PracticeControlsProps) {
	const t = useT();
	const [hoveredControl, dispatchHover] = useReducer(
		practiceHoverReducer,
		null,
	);
	const prevBtnRef = useRef<HTMLButtonElement>(null);
	const nextBtnRef = useRef<HTMLButtonElement>(null);

	const navigateQuestion = (
		dir: "prev" | "next",
		source: "arrow" | "keyboard" = "arrow",
	) => {
		const nextIndex =
			dir === "prev"
				? Math.max(0, currentIndex - 1)
				: Math.min(questions.length - 1, currentIndex + 1);
		if (nextIndex === currentIndex) return;
		setDirection(dir);
		track("practice_navigate", {
			subjectId: subject.id,
			topic: topic || "",
			direction: dir,
			fromIndex: currentIndex,
			toIndex: nextIndex,
			source,
		});
		setCurrentIndex(nextIndex);
		scrollToNav(nextIndex);
		scrollToHeader();
	};

	const navigateToBoundary = (boundary: "first" | "last") => {
		const nextIndex = boundary === "first" ? 0 : questions.length - 1;
		if (nextIndex === currentIndex) return;
		const direction = nextIndex > currentIndex ? "next" : "prev";
		setDirection(direction);
		track("practice_navigate", {
			subjectId: subject.id,
			topic: topic || "",
			direction,
			fromIndex: currentIndex,
			toIndex: nextIndex,
			source: "keyboard",
		});
		setCurrentIndex(nextIndex);
		scrollToNav(nextIndex);
		scrollToHeader();
	};

	const canCheckQuestion =
		!!(
			answers[currentQuestion.id] ||
			currentQuestion.type === "text" ||
			currentQuestion.type === "multiple-text"
		) &&
		!submitted &&
		!checkedQuestions[currentQuestion.id];
	const canClearAnswer =
		!!answers[currentQuestion.id] &&
		!submitted &&
		!checkedQuestions[currentQuestion.id];

	useCommandHandlers("practice-controls", {
		"previous-question":
			currentIndex > 0 ? () => navigateQuestion("prev", "keyboard") : undefined,
		"next-question":
			currentIndex < questions.length - 1
				? () => navigateQuestion("next", "keyboard")
				: undefined,
		"first-question":
			currentIndex > 0 ? () => navigateToBoundary("first") : undefined,
		"last-question":
			currentIndex < questions.length - 1
				? () => navigateToBoundary("last")
				: undefined,
		"check-question": canCheckQuestion
			? () => onCheckQuestion(currentQuestion.id)
			: undefined,
		"clear-answer": canClearAnswer
			? () => {
					track("practice_clear_answer", {
						questionId: currentQuestion.id,
						subjectId: subject.id,
						topic: topic || "",
					});
					onClearAnswer(currentQuestion.id);
				}
			: undefined,
		"submit-session": !submitted
			? () => {
					onSubmit();
					scrollToHeader();
				}
			: undefined,
	});

	return (
		<div
			className="mt-4 flex items-center gap-2 sm:mt-6 sm:justify-between sm:gap-3"
			data-tour="practice-nav-btns"
		>
			<button
				type="button"
				ref={prevBtnRef}
				aria-label={t.practice.previous}
				data-cuelume-press="page"
				className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-1 flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30 sm:py-2"
				onPointerEnter={(event) => {
					if (event.pointerType === "mouse")
						dispatchHover({ type: "enter", control: "prev" });
				}}
				onPointerLeave={(event) => {
					if (event.pointerType === "mouse")
						dispatchHover({ type: "leave", control: "prev" });
				}}
				onClick={() => navigateQuestion("prev")}
				disabled={currentIndex === 0}
			>
				<AngleLeftSquare
					size={18}
					weight={hoveredControl === "prev" ? "Filled" : "Outline"}
					aria-hidden="true"
					className="shrink-0"
				/>
				<span className="sr-only sm:not-sr-only sm:inline sm:min-w-0 sm:truncate">
					{t.practice.previous}
				</span>
			</button>
			<div
				className="order-2 flex min-w-0 flex-1 justify-center gap-2 sm:flex-none"
				data-tour="practice-actions"
			>
				{(answers[currentQuestion.id] ||
					currentQuestion.type === "text" ||
					currentQuestion.type === "multiple-text") &&
					!submitted &&
					!checkedQuestions[currentQuestion.id] && (
						<>
							{answers[currentQuestion.id] &&
								answers[currentQuestion.id].trim() !== "" && (
									<button
										type="button"
										aria-label={t.practice.clear}
										data-cuelume-press="droplet"
										className="border-border text-fg-muted hover:text-fg-secondary hover:bg-surface focus-visible:ring-accent flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 sm:py-2"
										onPointerEnter={(event) => {
											if (event.pointerType === "mouse")
												dispatchHover({ type: "enter", control: "clear" });
										}}
										onPointerLeave={(event) => {
											if (event.pointerType === "mouse")
												dispatchHover({ type: "leave", control: "clear" });
										}}
										onClick={() => {
											track("practice_clear_answer", {
												questionId: currentQuestion.id,
												subjectId: subject.id,
												topic: topic || "",
											});
											onClearAnswer(currentQuestion.id);
										}}
									>
										<Trash5
											size={18}
											weight={hoveredControl === "clear" ? "Filled" : "Outline"}
											aria-hidden="true"
											className="shrink-0"
										/>
										<span className="sr-only sm:not-sr-only sm:inline sm:min-w-0 sm:truncate">
											{t.practice.clear}
										</span>
									</button>
								)}
							<button
								type="button"
								aria-label={t.practice.check}
								className="bg-info text-on-info hover:bg-info-hover focus-visible:ring-info-fg flex min-w-0 items-center gap-1.5 rounded-lg px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 sm:py-2"
								onPointerEnter={(event) => {
									if (event.pointerType === "mouse")
										dispatchHover({ type: "enter", control: "check" });
								}}
								onPointerLeave={(event) => {
									if (event.pointerType === "mouse")
										dispatchHover({ type: "leave", control: "check" });
								}}
								onClick={() => onCheckQuestion(currentQuestion.id)}
							>
								<Eye
									size={18}
									weight={hoveredControl === "check" ? "Filled" : "Outline"}
									aria-hidden="true"
									className="shrink-0"
								/>
								<span className="sr-only sm:not-sr-only sm:inline sm:min-w-0 sm:truncate">
									{t.practice.check}
								</span>
							</button>
						</>
					)}
				{!submitted && (
					<button
						type="button"
						aria-label={t.practice.submit}
						data-cuelume-press="ready"
						className="bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-accent flex min-w-0 items-center gap-1.5 rounded-lg px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 sm:py-2"
						onPointerEnter={(event) => {
							if (event.pointerType === "mouse")
								dispatchHover({ type: "enter", control: "submit" });
						}}
						onPointerLeave={(event) => {
							if (event.pointerType === "mouse")
								dispatchHover({ type: "leave", control: "submit" });
						}}
						onClick={() => {
							onSubmit();
							scrollToHeader();
						}}
					>
						<Send
							size={18}
							weight={hoveredControl === "submit" ? "Filled" : "Outline"}
							aria-hidden="true"
							className="shrink-0"
						/>
						<span className="sr-only sm:not-sr-only sm:inline sm:min-w-0 sm:truncate">
							{t.practice.submit}
						</span>
					</button>
				)}
			</div>
			<button
				type="button"
				ref={nextBtnRef}
				aria-label={t.practice.next}
				data-cuelume-press="page"
				className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-3 flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30 sm:py-2"
				onPointerEnter={(event) => {
					if (event.pointerType === "mouse")
						dispatchHover({ type: "enter", control: "next" });
				}}
				onPointerLeave={(event) => {
					if (event.pointerType === "mouse")
						dispatchHover({ type: "leave", control: "next" });
				}}
				onClick={() => navigateQuestion("next")}
				disabled={currentIndex === questions.length - 1}
			>
				<span className="sr-only sm:not-sr-only sm:inline sm:min-w-0 sm:truncate">
					{t.practice.next}
				</span>
				<AngleRightSquare
					size={18}
					weight={hoveredControl === "next" ? "Filled" : "Outline"}
					aria-hidden="true"
					className="shrink-0"
				/>
			</button>
		</div>
	);
}

function PracticePlayer({
	subject,
	topic,
	questions,
	megatopicLabel,
	topicInfo,
	currentIndex,
	setCurrentIndex,
	answers,
	selfGrades,
	submitted,
	checkedQuestions,
	totalPoints,
	direction,
	setDirection,
	showLeftFade,
	showRightFade,
	navRef,
	scrollToNav,
	onAnswer,
	onSelfGrade,
	onSubmit,
	onCheckQuestion,
	onClearAnswer,
	scrollToHeaderRef,
}: PracticePlayerProps) {
	const currentQuestion = questions[currentIndex];
	const headerAnchorRef = useRef<HTMLDivElement>(null);
	const [scoreCompact, setScoreCompact] = useState(false);

	const scrollToHeader = useCallback(() => {
		const anchor = headerAnchorRef.current;
		if (!anchor) return;

		setScoreCompact(false);
		const desktopHeaderOffset = window.matchMedia("(min-width: 640px)").matches
			? 56
			: 0;
		window.scrollTo({
			top: Math.max(
				0,
				anchor.getBoundingClientRect().top +
					window.scrollY -
					desktopHeaderOffset,
			),
		});
	}, []);

	useEffect(() => {
		scrollToHeaderRef.current = scrollToHeader;
		return () => {
			scrollToHeaderRef.current = () => {};
		};
	}, [scrollToHeaderRef, scrollToHeader]);

	const currentExam = useMemo(() => {
		return currentQuestion
			? subject.exams.find((e) => e.id === currentQuestion.examId)
			: undefined;
	}, [subject, currentQuestion]);
	const examTitle = currentExam?.title;

	const questionResults = useMemo(
		() =>
			computeQuestionResults(
				questions,
				answers,
				checkedQuestions,
				selfGrades,
				submitted,
			),
		[questions, answers, checkedQuestions, selfGrades, submitted],
	);

	const pendingTextCount = useMemo(
		() =>
			questions.filter(
				(q) =>
					isSelfGradedQuestion(q) &&
					!isAutomaticallyCorrect(q, answers[q.id]) &&
					(checkedQuestions[q.id] || submitted) &&
					!isFullySelfGraded(q, selfGrades),
			).length,
		[questions, answers, checkedQuestions, selfGrades, submitted],
	);

	const pendingTextPoints = useMemo(
		() =>
			questions
				.filter(
					(q) =>
						isSelfGradedQuestion(q) &&
						!isAutomaticallyCorrect(q, answers[q.id]) &&
						(checkedQuestions[q.id] || submitted),
				)
				.reduce((sum, q) => sum + getPendingSelfGradePoints(q, selfGrades), 0),
		[questions, answers, checkedQuestions, selfGrades, submitted],
	);

	const allTextGraded =
		questions.filter(isSelfGradedQuestion).length === 0 ||
		pendingTextCount === 0;

	const getScore = (onlyGraded = false) => {
		let score = 0;
		for (const q of questions) {
			if (onlyGraded && !submitted && !checkedQuestions[q.id]) continue;
			score += getQuestionScore(q, answers[q.id], selfGrades);
		}
		return roundPoints(score);
	};

	const gradedScore = getScore(true);
	const checkedCount = Object.keys(checkedQuestions).length;
	const hasScoreSummary = submitted || checkedCount > 0;

	useEffect(() => {
		if (!hasScoreSummary) return;

		const updateScoreState = () => {
			const anchor = headerAnchorRef.current;
			if (!anchor) return;

			const titleTop = anchor.getBoundingClientRect().top + window.scrollY;
			const canCompact =
				document.documentElement.scrollHeight - window.innerHeight >=
				minScrollRangeForCompactScore;
			setScoreCompact((current) => {
				if (window.scrollY <= titleTop) return false;
				return current || canCompact;
			});
		};

		window.addEventListener("scroll", updateScoreState, { passive: true });
		return () => window.removeEventListener("scroll", updateScoreState);
	}, [hasScoreSummary]);

	return (
		<div
			className="animate-fade-in animate-duration-fast mx-auto max-w-3xl px-4 py-4 sm:py-8"
			style={{ overflowAnchor: "none" }}
		>
			<PracticePlayerHeader
				subject={subject}
				topic={topic}
				topicInfo={topicInfo}
				headerAnchorRef={headerAnchorRef}
				scrollToHeaderRef={scrollToHeaderRef}
				questions={questions}
				answers={answers}
				checkedQuestions={checkedQuestions}
				currentIndex={currentIndex}
				setCurrentIndex={setCurrentIndex}
				totalPoints={totalPoints}
				questionResults={questionResults}
				setDirection={setDirection}
				showLeftFade={showLeftFade}
				showRightFade={showRightFade}
				navRef={navRef}
				scrollToNav={scrollToNav}
				scoreSummary={
					hasScoreSummary ? (
						<PracticeScoreSummary
							submitted={submitted}
							allTextGraded={allTextGraded}
							pendingTextCount={pendingTextCount}
							pendingTextPoints={pendingTextPoints}
							checkedCount={checkedCount}
							questionsLength={questions.length}
							gradedScore={gradedScore}
							totalPoints={totalPoints}
							compact={scoreCompact}
						/>
					) : null
				}
			/>

			<div data-tour="practice-card">
				<QuestionCard
					key={currentQuestion.id}
					question={currentQuestion}
					index={currentIndex}
					total={questions.length}
					topicLabel={topicInfo?.label || topic || ""}
					megatopicLabel={megatopicLabel}
					examTitle={examTitle}
					subjectId={subject.id}
					topicKey={topic || undefined}
					examId={currentQuestion?.examId}
					mode="practice"
					onAnswer={onAnswer}
					savedAnswer={answers[currentQuestion.id]}
					showResult={submitted || !!checkedQuestions[currentQuestion.id]}
					selfGrade={selfGrades[currentQuestion.id]}
					selfGrades={selfGrades}
					onSelfGrade={onSelfGrade}
					direction={direction}
				/>
			</div>

			<PracticeControls
				subject={subject}
				topic={topic}
				questions={questions}
				currentQuestion={currentQuestion}
				currentIndex={currentIndex}
				setCurrentIndex={setCurrentIndex}
				answers={answers}
				checkedQuestions={checkedQuestions}
				submitted={submitted}
				setDirection={setDirection}
				scrollToNav={scrollToNav}
				scrollToHeader={scrollToHeader}
				onSubmit={onSubmit}
				onCheckQuestion={onCheckQuestion}
				onClearAnswer={onClearAnswer}
			/>

			<Disclaimer
				subjectId={subject.id}
				questionId={currentQuestion.id}
				questionType={currentQuestion.type}
				exam={currentExam}
			/>
		</div>
	);
}

type PracticeSession = ReturnType<typeof usePracticeSession>;
type PracticeTopicNavigation = ReturnType<typeof usePracticeTopicNavigation>;

interface PracticeTopicContentProps {
	subject: PracticeSubject | undefined;
	topic: string | undefined;
	topicInfo: PracticePlayerProps["topicInfo"];
	questions: Question[];
	megatopicLabel: string | undefined;
	status: ReturnType<typeof useTopicQuestions>["status"];
	retry: () => void;
	session: PracticeSession;
	navigation: PracticeTopicNavigation;
}

function PracticeTopicContent({
	subject,
	topic,
	topicInfo,
	questions,
	megatopicLabel,
	status,
	retry,
	session,
	navigation,
}: PracticeTopicContentProps) {
	const t = useT();
	const {
		currentIndex,
		setCurrentIndex,
		answers,
		selfGrades,
		submitted,
		checkedQuestions,
		handleAnswer,
		handleSubmit,
		handleSelfGrade,
		handleCheckQuestion,
	} = session;
	const {
		direction,
		showLeftFade,
		showRightFade,
		setDirection,
		navRef,
		scrollToNav,
		scrollToHeaderRef,
	} = navigation;
	const handleClearAnswer = useCallback(
		(questionId: string) => {
			handleAnswer(questionId, "");
		},
		[handleAnswer],
	);

	const isLoading = status === "loading";
	const isReady = status === "ready";
	const isError = status === "error";
	const emptyState = (
		<div className="mx-auto max-w-3xl px-4 py-8 text-center sm:py-16">
			<p className="text-fg-muted">{t.practice.noQuestions}</p>
			<Link
				to={subject ? `/${subject.id}` : "/"}
				data-cuelume-hover
				data-cuelume-press
				className="text-accent-fg mt-4 inline-block hover:underline"
				onClick={() => {
					track("nav_click", { target: "home", from: "practice_empty" });
				}}
			>
				{t.practice.backToHome}
			</Link>
		</div>
	);
	const errorState = (
		<div className="mx-auto max-w-3xl px-4 py-8 text-center sm:py-16">
			<p role="alert" className="text-fg-muted">
				{t.practice.loadError}
			</p>
			<button
				type="button"
				className="bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-accent mt-4 rounded-lg px-4 py-2 font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
				onClick={retry}
			>
				{t.practice.retry}
			</button>
		</div>
	);
	const player =
		isReady && questions.length > 0 && subject ? (
			<PracticePlayer
				subject={subject}
				topic={topic || ""}
				questions={questions}
				megatopicLabel={megatopicLabel}
				topicInfo={topicInfo}
				currentIndex={currentIndex}
				setCurrentIndex={setCurrentIndex}
				answers={answers}
				selfGrades={selfGrades}
				submitted={submitted}
				checkedQuestions={checkedQuestions}
				totalPoints={roundPoints(
					questions.reduce((sum, question) => sum + question.points, 0),
				)}
				direction={direction}
				setDirection={setDirection}
				showLeftFade={showLeftFade}
				showRightFade={showRightFade}
				navRef={navRef}
				scrollToNav={scrollToNav}
				onAnswer={handleAnswer}
				onSelfGrade={handleSelfGrade}
				onSubmit={handleSubmit}
				onCheckQuestion={handleCheckQuestion}
				onClearAnswer={handleClearAnswer}
				scrollToHeaderRef={scrollToHeaderRef}
			/>
		) : isError ? (
			errorState
		) : isReady || !subject ? (
			emptyState
		) : null;

	return (
		<SimulatorSkeleton
			kind="practice"
			loading={isLoading}
			loadingLabel={t.practice.loadingQuestions}
		>
			{player}
		</SimulatorSkeleton>
	);
}

export default function PracticeTopic() {
	const { subjectId, topic } = useParams({ strict: false });
	const { questions: initialQuestions, megatopicLabel: initialMegatopicLabel } =
		practiceRouteApi.useLoaderData();
	const initialTopicData = useMemo(
		() => ({
			questions: initialQuestions,
			megatopicLabel: initialMegatopicLabel,
		}),
		[initialMegatopicLabel, initialQuestions],
	);
	const subject = subjectId ? getSubject(subjectId) : undefined;
	const { selectedExamIds } = useExamSelection(subject);
	const topicInfo = useMemo(
		() => subject?.topics.find((currentTopic) => currentTopic.key === topic),
		[subject, topic],
	);
	const {
		questions: allTopicQuestions,
		megatopicLabel,
		status,
		retry,
	} = useTopicQuestions(subject, topic, initialTopicData);
	const questions = useMemo(
		() => filterQuestionsByExamSelection(allTopicQuestions, selectedExamIds),
		[allTopicQuestions, selectedExamIds],
	);
	const session = usePracticeSession(questions, subject?.id || "", topic || "");
	const navigation = usePracticeTopicNavigation({
		subject,
		topicInfo,
		questionsLength: questions.length,
	});

	return (
		<PracticeTopicContent
			subject={subject}
			topic={topic}
			topicInfo={topicInfo}
			questions={questions}
			megatopicLabel={megatopicLabel}
			status={status}
			retry={retry}
			session={session}
			navigation={navigation}
		/>
	);
}

export function PracticeTopicPending() {
	const t = useT();

	return (
		<SimulatorSkeleton
			kind="practice"
			loading
			loadingLabel={t.practice.loadingQuestions}
		/>
	);
}
