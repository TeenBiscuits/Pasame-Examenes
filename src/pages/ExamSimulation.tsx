import { getRouteApi, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Alarm,
	AngleLeftSquare,
	AngleRightSquare,
	Bulb,
	Exit,
	Send,
	Trophy,
	Verified,
} from "reicon-react";
import Disclaimer from "../components/Disclaimer";
import { compactModalDialogClass, ModalHeader } from "../components/Modal";
import QuestionCard from "../components/QuestionCard";
import QuestionNavChips from "../components/QuestionNavChips";
import ScoreProgress from "../components/ScoreProgress";
import SimulatorSkeleton from "../components/SimulatorSkeleton";
import type { Exam, Question } from "../data/types";
import { useExamSession } from "../hooks/useExamSession";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { useT } from "../i18n/hooks";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import { getSubjectBuildStats } from "../lib/content-stats";
import {
	closeDialog,
	showDialog,
	useDialogClose,
	useDialogDismiss,
} from "../lib/dialog";
import { getExamPassPoints } from "../lib/exam-stats";
import {
	computeQuestionResults,
	getPendingSelfGradePoints,
	getQuestionScore,
	isAutomaticallyCorrect,
	isFullySelfGraded,
	isSelfGradedQuestion,
} from "../lib/grading";
import { LangLink as Link } from "../lib/lang-link";
import { formatPoints, roundPoints } from "../lib/points";
import { playError, playSound } from "../lib/sound";
import { startExamTour } from "../lib/tour";
import { track } from "../lib/umami";
import { useLangTo } from "../lib/useLangTo";
import {
	getQuestionsByExam,
	getSubject,
	getTopicMegaTopicLabel,
} from "../subjects";
import { contentStatsBySubject } from "../subjects/contentStats.generated";

const minScrollRangeForCompactScore = 256;
const examRouteApi = getRouteApi("/$lang/$subjectId_/exam/$examId");

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

interface ExamStartScreenProps {
	subject: NonNullable<ReturnType<typeof getSubject>>;
	examInfo: Exam;
	questionCount: number;
	totalPoints: number;
	passPoints: number;
	loading: boolean;
	loadError: boolean;
	onStart: () => void;
	onRetry: () => void;
}

function ExamStartScreen({
	subject,
	examInfo,
	questionCount,
	totalPoints,
	passPoints,
	loading,
	loadError,
	onStart,
	onRetry,
}: ExamStartScreenProps) {
	const t = useT();
	const isAuthorized = hasAuthorizedExamContent(subject);
	const simulationNote = isAuthorized
		? t.exam.simulationNote
		: t.exam.practiceNote;
	const scoringNote = isAuthorized
		? t.exam.simulationScoringNote
		: t.exam.practiceScoringNote;
	return (
		<div className="animate-fade-in animate-duration-fast mx-auto max-w-2xl px-4 py-6 sm:py-16">
			<div className="mb-3 sm:mb-4">
				<Link
					to={`/${subject.id}`}
					activeOptions={{ exact: true }}
					data-cuelume-hover
					data-cuelume-press
					className="text-accent-fg focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-md text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
					onClick={() =>
						track("nav_click", {
							target: "subject_home",
							from: "exam_start_screen",
							subjectId: subject.id,
						})
					}
				>
					<Exit size={16} aria-hidden="true" className="shrink-0" />
					{t.exam.backToSubject}
				</Link>
			</div>
			<div className="text-center">
				<h1 className="text-fg mb-2 inline-flex items-center justify-center gap-2 text-2xl font-semibold sm:text-3xl">
					{examInfo.title}
					{isAuthorized && (
						<span
							className="border-warning-border bg-warning-bg text-warning-fg inline-flex size-6 shrink-0 items-center justify-center rounded border"
							title={t.contentPolicy.authorized}
						>
							<Verified
								className="size-4"
								role="img"
								aria-label={t.contentPolicy.authorized}
							/>
						</span>
					)}
				</h1>
				<p className="text-fg-muted mb-5 sm:mb-8">
					{subject.name} ({subject.courseCode})
				</p>
			</div>
			<div className="bg-surface-alt border-border space-y-3 rounded-xl border p-5 shadow-sm sm:space-y-4 sm:p-8">
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span className="text-fg-muted">{t.exam.questions}</span>
						<p className="font-semibold">{questionCount}</p>
					</div>
					<div>
						<span className="text-fg-muted">{t.exam.totalPoints}</span>
						<p className="font-semibold">{formatPoints(totalPoints)}p</p>
					</div>
					<div>
						<span className="text-fg-muted">{t.exam.pass}</span>
						<p className="font-semibold">{formatPoints(passPoints)}p</p>
					</div>
					<div>
						<span className="text-fg-muted">{t.exam.timeLimit}</span>
						<p className="font-semibold">
							{examInfo.durationMinutes} {t.exam.minutes}
						</p>
					</div>
				</div>
				<div className="border-warning-border bg-warning-bg text-warning-fg flex items-start gap-2 rounded-lg border p-3 text-sm sm:p-4">
					<Alarm size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
					{simulationNote}
				</div>
				<div className="border-contribute-border bg-contribute-bg text-contribute-fg flex items-start gap-2 rounded-lg border p-3 text-sm sm:p-4">
					<Bulb size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
					{scoringNote}
				</div>
				{loading && (
					<p role="status" className="text-fg-muted text-sm">
						{t.exam.loadingQuestions}
					</p>
				)}
				{loadError && (
					<div className="border-incorrect-border bg-incorrect-bg text-incorrect-fg flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
						<p role="alert">{t.exam.loadError}</p>
						<button
							type="button"
							className="border-incorrect-border bg-surface text-incorrect-fg hover:bg-incorrect-bg focus-visible:ring-incorrect-fg shrink-0 rounded-lg border px-3 py-2 font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
							onClick={onRetry}
						>
							{t.exam.retry}
						</button>
					</div>
				)}
				<button
					type="button"
					data-cuelume-press="ready"
					className="bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-accent w-full rounded-lg py-3 font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
					onClick={onStart}
					disabled={loadError}
				>
					{t.exam.startExam}
				</button>
			</div>
		</div>
	);
}

interface ExamPlayerProps {
	subject: NonNullable<ReturnType<typeof getSubject>>;
	examInfo: Exam;
	questions: Question[];
	megatopicLabels: Record<string, string>;
	currentIndex: number;
	setCurrentIndex: (i: number) => void;
	answers: Record<string, string>;
	selfGrades: Record<string, "correct" | "incorrect">;
	submitted: boolean;
	timeLeft: number;
	totalPoints: number;
	passPoints: number;
	direction: "next" | "prev" | undefined;
	setDirection: (d: "next" | "prev" | undefined) => void;
	scrollToHeaderRef: React.MutableRefObject<() => void>;
	showLeftFade: boolean;
	showRightFade: boolean;
	navRef: React.Ref<HTMLDivElement>;
	timeUpDialogRef: React.RefObject<HTMLDialogElement | null>;
	scrollToNav: (index: number) => void;
	onAnswer: (questionId: string, answer: string) => void;
	onSelfGrade: (questionId: string, grade: "correct" | "incorrect") => void;
	onSubmit: () => void;
	onExit: () => void;
}

type ExamSubject = ExamPlayerProps["subject"];

interface ExamPlayerHeaderProps {
	subject: ExamSubject;
	examInfo: Exam;
	questions: Question[];
	headerAnchorRef: React.RefObject<HTMLDivElement | null>;
	answers: Record<string, string>;
	currentIndex: number;
	setCurrentIndex: (i: number) => void;
	submitted: boolean;
	timeLeft: number;
	totalPoints: number;
	passPoints: number;
	score: number;
	pendingTextCount: number;
	questionResults: ReturnType<typeof computeQuestionResults>;
	setDirection: (d: "next" | "prev" | undefined) => void;
	showLeftFade: boolean;
	showRightFade: boolean;
	navRef: React.Ref<HTMLDivElement>;
	scrollToNav: (index: number) => void;
	exitDialogRef: React.RefObject<HTMLDialogElement | null>;
	scoreSummary: React.ReactNode;
}

function ExamPlayerHeader({
	subject,
	examInfo,
	questions,
	headerAnchorRef,
	answers,
	currentIndex,
	setCurrentIndex,
	submitted,
	timeLeft,
	totalPoints,
	passPoints,
	score,
	pendingTextCount,
	questionResults,
	setDirection,
	showLeftFade,
	showRightFade,
	navRef,
	scrollToNav,
	exitDialogRef,
	scoreSummary,
}: ExamPlayerHeaderProps) {
	const t = useT();
	const isAuthorized = hasAuthorizedExamContent(subject);

	return (
		<>
			<div>
				<Link
					to={`/${subject.id}`}
					activeOptions={{ exact: true }}
					data-cuelume-hover
					data-cuelume-press="bloom"
					onClick={(e) => {
						if (!submitted) {
							e.preventDefault();
							showDialog(exitDialogRef.current);
						}
					}}
					className="text-accent-fg focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-md text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
				>
					<Exit size={16} aria-hidden="true" className="shrink-0" />
					{t.exam.backToSubject}
				</Link>
			</div>
			<div ref={headerAnchorRef} className="h-0" aria-hidden="true" />
			<div
				className="sticky-player-header bg-surface border-border sticky z-40 -mx-4 mb-4 border-b px-4 pt-2 pb-3 sm:mb-6"
				data-tour="exam-header"
			>
				<div className="flex items-center justify-between gap-4">
					<div className="min-w-0">
						<span className="inline-flex max-w-full items-center gap-2">
							<span className="text-fg truncate text-xl font-semibold sm:text-2xl">
								{examInfo.title}
							</span>
							{isAuthorized && (
								<span
									className="border-warning-border bg-warning-bg text-warning-fg inline-flex size-5 shrink-0 items-center justify-center rounded border"
									title={t.contentPolicy.authorized}
								>
									<Verified
										className="size-3.5"
										role="img"
										aria-label={t.contentPolicy.authorized}
									/>
								</span>
							)}
						</span>
						<p className="text-fg-muted mt-1 text-sm">
							{formatPoints(totalPoints)}p {t.exam.total}
						</p>
					</div>
					<div className="shrink-0">
						{!submitted && (
							<span
								className={`flex items-center gap-1.5 font-mono text-sm font-bold ${timeLeft < 600 ? "text-incorrect-fg" : "text-fg-secondary"}`}
							>
								<Alarm size={16} aria-hidden="true" className="shrink-0" />
								{formatTime(timeLeft)}
							</span>
						)}
						{submitted && (
							<span
								className={`animate-fade-in rounded-md px-2.5 py-1 text-xs font-bold ${
									pendingTextCount > 0
										? "bg-pending-bg text-pending-fg"
										: score >= passPoints
											? "bg-correct-bg text-correct-fg"
											: "bg-incorrect-bg text-incorrect-fg"
								}`}
							>
								{pendingTextCount > 0
									? t.exam.submitted
									: score >= passPoints
										? t.exam.pass_
										: t.exam.fail}
							</span>
						)}
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
					questionResults={questionResults}
					dataTour="exam-nav"
					eventName="exam_navigate"
					eventData={{ subjectId: subject.id, examId: examInfo.id }}
					className={scoreSummary ? "mt-2 mb-0" : "mt-4 mb-0"}
					onSelectIndex={(i, dir) => {
						setDirection(dir);
						setCurrentIndex(i);
						scrollToNav(i);
					}}
				/>
			</div>
		</>
	);
}

interface ExamExitDialogProps {
	subject: ExamSubject;
	examInfo: Exam;
	answers: Record<string, string>;
	timeLeft: number;
	dialogRef: React.RefObject<HTMLDialogElement | null>;
	onExit: () => void;
}

function ExamExitDialog({
	subject,
	examInfo,
	answers,
	timeLeft,
	dialogRef,
	onExit,
}: ExamExitDialogProps) {
	const t = useT();

	useDialogDismiss(dialogRef, () => playSound("droplet"));

	return (
		<dialog
			ref={dialogRef}
			closedby="any"
			className={`${compactModalDialogClass} p-6`}
			aria-labelledby="exam-exit-modal-title"
		>
			<ModalHeader
				titleId="exam-exit-modal-title"
				closeLabel={t.exam.exitModalCancel}
				onClose={() => closeDialog(dialogRef.current)}
			>
				<Exit size={24} aria-hidden="true" className="shrink-0" />
				{t.exam.exitModalTitle}
			</ModalHeader>
			<p className="text-fg-secondary mb-6 text-sm">{t.exam.exitConfirm}</p>
			<div className="flex gap-3">
				<button
					type="button"
					data-cuelume-press="droplet"
					onClick={() => closeDialog(dialogRef.current)}
					className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent flex-1 rounded-lg border px-4 py-2 text-sm transition-[background-color,border-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
				>
					{t.exam.exitModalCancel}
				</button>
				<Link
					to={`/${subject.id}`}
					data-cuelume-press="droplet"
					className="bg-danger text-on-danger hover:bg-danger-hover focus-visible:ring-danger-fg inline-flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-center text-sm font-medium transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
					onClick={(event) => {
						event.preventDefault();
						const answeredCount = Object.values(answers).filter(
							(answer) => answer && answer.trim() !== "",
						).length;
						track("exam_abandon", {
							subjectId: subject.id,
							examId: examInfo.id,
							answeredCount,
							timeLeft,
						});
						closeDialog(dialogRef.current, onExit);
					}}
				>
					{t.exam.exitModalConfirm}
				</Link>
			</div>
		</dialog>
	);
}

interface ExamScoreSummaryProps {
	score: number;
	totalPoints: number;
	pendingTextCount: number;
	pendingTextPoints: number;
	passPoints: number;
	compact: boolean;
}

function ExamScoreSummary({
	score,
	totalPoints,
	pendingTextCount,
	pendingTextPoints,
	passPoints,
	compact,
}: ExamScoreSummaryProps) {
	const t = useT();
	const statusClass =
		pendingTextCount > 0
			? "text-pending-fg"
			: score >= passPoints
				? "text-correct-fg"
				: "text-incorrect-fg";
	const panelClass =
		pendingTextCount > 0
			? "border-pending-border bg-pending-bg"
			: score >= passPoints
				? "border-correct-border bg-correct-bg"
				: "border-incorrect-border bg-incorrect-bg";

	return (
		<ScoreProgress
			score={score}
			totalPoints={totalPoints}
			pendingPoints={pendingTextPoints}
			colorClassName={statusClass}
			progressClassName={`transition-[left,right,bottom] duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "right-20 bottom-5 left-16" : "right-4 bottom-4 left-4"}`}
			className={`animate-fade-in-up relative transition-[height] duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "h-12 overflow-hidden" : "min-h-24"}`}
		>
			<div
				className={`relative rounded-lg border-2 text-sm transition-[background-color,border-color,padding] duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "h-full overflow-hidden p-0" : "min-h-24 p-3 pb-7 sm:p-4 sm:pb-8"} ${panelClass}`}
			>
				<div
					className={`text-fg mb-1 flex items-center gap-2 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "pointer-events-none -translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
				>
					<Trophy
						size={18}
						weight="Filled"
						aria-hidden="true"
						className="shrink-0"
					/>
					<p className="font-semibold">
						{t.exam.submitted} {t.exam.score}
					</p>
					<p className="ml-auto text-lg font-bold whitespace-nowrap tabular-nums">
						{formatPoints(score)}
						<span className="text-fg-muted mx-1 text-sm font-medium">/</span>
						{formatPoints(totalPoints)}
						<span className="text-fg-muted ml-1 text-sm font-medium">
							({Math.round((score / totalPoints) * 100)}%)
						</span>
					</p>
				</div>
				<p
					className={`transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "pointer-events-none translate-y-1 opacity-0" : "translate-y-0 opacity-100"} ${statusClass}`}
				>
					{pendingTextCount > 0
						? t.exam.selfGradeHint
						: `${t.exam.passThreshold}: ${formatPoints(passPoints)}p. ${t.exam.reviewNote}`}
				</p>
				<div
					className={`pointer-events-none absolute inset-0 z-10 flex items-center gap-2 px-3 transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "opacity-100" : "opacity-0"}`}
					aria-hidden="true"
				>
					<Trophy
						size={18}
						weight="Filled"
						className={`shrink-0 transition-transform duration-[250ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${compact ? "translate-y-0" : "-translate-y-2"}`}
					/>
					<span className="text-fg ml-auto min-w-[3.5rem] text-right text-sm font-bold whitespace-nowrap tabular-nums">
						{formatPoints(score)}/{formatPoints(totalPoints)}
					</span>
				</div>
			</div>
		</ScoreProgress>
	);
}

interface ExamControlsProps {
	subject: ExamSubject;
	examInfo: Exam;
	questions: Question[];
	currentIndex: number;
	setCurrentIndex: (i: number) => void;
	submitted: boolean;
	setDirection: (d: "next" | "prev" | undefined) => void;
	scrollToNav: (index: number) => void;
	scrollToHeader: () => void;
	submitDialogRef: React.RefObject<HTMLDialogElement | null>;
}

function ExamControls({
	subject,
	examInfo,
	questions,
	currentIndex,
	setCurrentIndex,
	submitted,
	setDirection,
	scrollToNav,
	scrollToHeader,
	submitDialogRef,
}: ExamControlsProps) {
	const t = useT();
	const [hoverPrev, setHoverPrev] = useState(false);
	const [hoverNext, setHoverNext] = useState(false);
	const prevBtnRef = useRef<HTMLButtonElement>(null);
	const nextBtnRef = useRef<HTMLButtonElement>(null);

	const navigateQuestion = (dir: "prev" | "next") => {
		const nextIndex =
			dir === "prev"
				? Math.max(0, currentIndex - 1)
				: Math.min(questions.length - 1, currentIndex + 1);
		setDirection(dir);
		track("exam_navigate", {
			subjectId: subject.id,
			examId: examInfo.id,
			direction: dir,
			fromIndex: currentIndex,
			toIndex: nextIndex,
			source: "arrow",
		});
		setCurrentIndex(nextIndex);
		scrollToNav(nextIndex);
		scrollToHeader();
	};

	return (
		<div className="mt-4 flex items-center gap-2 sm:mt-6 sm:justify-between sm:gap-3">
			<button
				type="button"
				ref={prevBtnRef}
				aria-label={t.exam.previous}
				data-cuelume-press="page"
				className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-1 flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30 sm:py-2"
				onPointerEnter={(event) => {
					if (event.pointerType === "mouse") setHoverPrev(true);
				}}
				onPointerLeave={(event) => {
					if (event.pointerType === "mouse") setHoverPrev(false);
				}}
				onClick={() => navigateQuestion("prev")}
				disabled={currentIndex === 0}
			>
				<AngleLeftSquare
					size={18}
					weight={hoverPrev ? "Filled" : "Outline"}
					aria-hidden="true"
					className="shrink-0"
				/>
				<span className="sr-only sm:not-sr-only sm:inline sm:min-w-0 sm:truncate">
					{t.exam.previous}
				</span>
			</button>
			<div
				className="order-2 flex min-w-0 flex-1 justify-center gap-2 sm:flex-none"
				data-tour="exam-submit"
			>
				{!submitted && (
					<button
						type="button"
						aria-label={t.exam.submitExam}
						data-cuelume-press="bloom"
						className="bg-danger text-on-danger hover:bg-danger-hover focus-visible:ring-danger-fg flex min-w-0 items-center gap-1.5 rounded-lg px-4 py-3 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 sm:py-2"
						onClick={() => showDialog(submitDialogRef.current)}
					>
						<Send size={18} aria-hidden="true" className="shrink-0" />
						<span className="sr-only sm:not-sr-only sm:inline sm:min-w-0 sm:truncate">
							{t.exam.submitExam}
						</span>
					</button>
				)}
			</div>
			<button
				type="button"
				ref={nextBtnRef}
				aria-label={t.exam.next}
				data-cuelume-press="page"
				className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-3 flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30 sm:py-2"
				onPointerEnter={(event) => {
					if (event.pointerType === "mouse") setHoverNext(true);
				}}
				onPointerLeave={(event) => {
					if (event.pointerType === "mouse") setHoverNext(false);
				}}
				onClick={() => navigateQuestion("next")}
				disabled={currentIndex === questions.length - 1}
			>
				<span className="sr-only sm:not-sr-only sm:inline sm:min-w-0 sm:truncate">
					{t.exam.next}
				</span>
				<AngleRightSquare
					size={18}
					weight={hoverNext ? "Filled" : "Outline"}
					aria-hidden="true"
					className="shrink-0"
				/>
			</button>
		</div>
	);
}

interface ExamDialogsProps {
	submitted: boolean;
	submitDialogRef: React.RefObject<HTMLDialogElement | null>;
	timeUpDialogRef: React.RefObject<HTMLDialogElement | null>;
	onSubmit: () => void;
}

function ExamDialogs({
	submitted,
	submitDialogRef,
	timeUpDialogRef,
	onSubmit,
}: ExamDialogsProps) {
	const t = useT();

	useDialogDismiss(submitDialogRef, () => playSound("droplet"));
	useDialogDismiss(timeUpDialogRef, () => playSound("droplet"));
	useDialogClose(timeUpDialogRef, () => {
		if (!submitted) onSubmit();
	});

	return (
		<>
			<dialog
				ref={submitDialogRef}
				closedby="any"
				className={`${compactModalDialogClass} p-6`}
				aria-labelledby="exam-submit-modal-title"
			>
				<div>
					<ModalHeader
						titleId="exam-submit-modal-title"
						closeLabel={t.footer.close}
						onClose={() => closeDialog(submitDialogRef.current)}
					>
						{t.exam.submitModalTitle}
					</ModalHeader>
					<p className="text-fg-secondary mb-6 text-sm">
						{t.exam.submitModalBody}
					</p>
					<div className="flex gap-3">
						<button
							type="button"
							data-cuelume-press="droplet"
							onClick={() => closeDialog(submitDialogRef.current)}
							className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent flex-1 rounded-lg border px-4 py-2 text-sm transition-[background-color,border-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
						>
							{t.exam.submitModalCancel}
						</button>
						<button
							type="button"
							data-cuelume-press="ready"
							onClick={() => {
								closeDialog(submitDialogRef.current, onSubmit);
							}}
							className="bg-danger text-on-danger hover:bg-danger-hover focus-visible:ring-danger-fg flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
						>
							{t.exam.submitModalConfirm}
						</button>
					</div>
				</div>
			</dialog>
			<dialog
				ref={timeUpDialogRef}
				closedby="any"
				className={`${compactModalDialogClass} p-6`}
				aria-labelledby="exam-timeup-modal-title"
			>
				<div>
					<ModalHeader
						titleId="exam-timeup-modal-title"
						closeLabel={t.footer.close}
						onClose={() => closeDialog(timeUpDialogRef.current)}
					>
						<Alarm size={24} aria-hidden="true" />
						{t.exam.timeUpModalTitle}
					</ModalHeader>
					<p className="text-fg-secondary mb-6 text-sm">
						{t.exam.timeUpModalBody}
					</p>
					<button
						type="button"
						data-cuelume-press="ready"
						onClick={() => closeDialog(timeUpDialogRef.current)}
						className="bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-accent w-full rounded-lg px-4 py-2 text-sm font-medium transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
					>
						{t.exam.timeUpModalAcknowledge}
					</button>
				</div>
			</dialog>
		</>
	);
}

function ExamPlayer({
	subject,
	examInfo,
	questions,
	megatopicLabels,
	currentIndex,
	setCurrentIndex,
	answers,
	selfGrades,
	submitted,
	timeLeft,
	totalPoints,
	passPoints,
	direction,
	setDirection,
	showLeftFade,
	showRightFade,
	navRef,
	timeUpDialogRef,
	scrollToNav,
	onAnswer,
	onSelfGrade,
	onSubmit,
	onExit,
	scrollToHeaderRef,
}: ExamPlayerProps) {
	const currentQuestion = questions[currentIndex];
	const currentTopic = subject.topics.find(
		(tp) => tp.key === currentQuestion.topic,
	);
	const submitDialogRef = useRef<HTMLDialogElement>(null);
	const exitDialogRef = useRef<HTMLDialogElement>(null);
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

	const submitAndScroll = useCallback(() => {
		onSubmit();
		scrollToHeader();
	}, [onSubmit, scrollToHeader]);

	useEffect(() => {
		scrollToHeaderRef.current = scrollToHeader;
		return () => {
			scrollToHeaderRef.current = () => {};
		};
	}, [scrollToHeaderRef, scrollToHeader]);

	const getScore = () => {
		let score = 0;
		for (const q of questions) {
			score += getQuestionScore(q, answers[q.id], selfGrades);
		}
		return roundPoints(score);
	};

	const score = getScore();

	const questionResults = useMemo(
		() => computeQuestionResults(questions, answers, {}, selfGrades, submitted),
		[questions, answers, selfGrades, submitted],
	);

	const pendingTextCount = useMemo(
		() =>
			questions.filter(
				(q) =>
					isSelfGradedQuestion(q) &&
					!isAutomaticallyCorrect(q, answers[q.id]) &&
					submitted &&
					!isFullySelfGraded(q, selfGrades),
			).length,
		[questions, answers, selfGrades, submitted],
	);

	const pendingTextPoints = useMemo(
		() =>
			questions
				.filter(
					(q) =>
						isSelfGradedQuestion(q) &&
						!isAutomaticallyCorrect(q, answers[q.id]) &&
						submitted,
				)
				.reduce((sum, q) => sum + getPendingSelfGradePoints(q, selfGrades), 0),
		[questions, answers, selfGrades, submitted],
	);
	const hasScoreSummary = submitted;

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
			<ExamPlayerHeader
				subject={subject}
				examInfo={examInfo}
				questions={questions}
				headerAnchorRef={headerAnchorRef}
				answers={answers}
				currentIndex={currentIndex}
				setCurrentIndex={setCurrentIndex}
				submitted={submitted}
				timeLeft={timeLeft}
				totalPoints={totalPoints}
				passPoints={passPoints}
				score={score}
				pendingTextCount={pendingTextCount}
				questionResults={questionResults}
				setDirection={setDirection}
				showLeftFade={showLeftFade}
				showRightFade={showRightFade}
				navRef={navRef}
				scrollToNav={scrollToNav}
				exitDialogRef={exitDialogRef}
				scoreSummary={
					hasScoreSummary ? (
						<ExamScoreSummary
							score={score}
							totalPoints={totalPoints}
							pendingTextCount={pendingTextCount}
							pendingTextPoints={pendingTextPoints}
							passPoints={passPoints}
							compact={scoreCompact}
						/>
					) : null
				}
			/>

			<div data-tour="exam-card">
				<QuestionCard
					key={currentQuestion.id}
					question={currentQuestion}
					index={currentIndex}
					total={questions.length}
					topicLabel={currentTopic?.label || currentQuestion.topic}
					megatopicLabel={megatopicLabels[currentQuestion.topic]}
					examTitle={examInfo?.title}
					subjectId={subject.id}
					topicKey={currentQuestion.topic}
					examId={examInfo.id}
					mode="exam"
					onAnswer={onAnswer}
					savedAnswer={answers[currentQuestion.id]}
					showResult={submitted}
					selfGrade={selfGrades[currentQuestion.id]}
					selfGrades={selfGrades}
					onSelfGrade={onSelfGrade}
					direction={direction}
				/>
			</div>

			<ExamControls
				subject={subject}
				examInfo={examInfo}
				questions={questions}
				currentIndex={currentIndex}
				setCurrentIndex={setCurrentIndex}
				submitted={submitted}
				setDirection={setDirection}
				scrollToNav={scrollToNav}
				scrollToHeader={scrollToHeader}
				submitDialogRef={submitDialogRef}
			/>

			<Disclaimer
				subjectId={subject.id}
				questionId={currentQuestion.id}
				questionType={currentQuestion.type}
				exam={examInfo}
			/>

			<ExamDialogs
				submitted={submitted}
				submitDialogRef={submitDialogRef}
				timeUpDialogRef={timeUpDialogRef}
				onSubmit={submitAndScroll}
			/>
			<ExamExitDialog
				subject={subject}
				examInfo={examInfo}
				answers={answers}
				timeLeft={timeLeft}
				dialogRef={exitDialogRef}
				onExit={onExit}
			/>
		</div>
	);
}

function ExamEmptyState({ subject }: { subject: ExamSubject | undefined }) {
	const t = useT();

	return (
		<div className="mx-auto max-w-3xl px-4 py-8 text-center sm:py-16">
			<p className="text-fg-muted">{t.exam.noQuestions}</p>
			<Link
				to={subject ? `/${subject.id}` : "/"}
				data-cuelume-hover
				data-cuelume-press
				className="text-accent-fg mt-4 inline-block hover:underline"
				onClick={() => {
					track("nav_click", { target: "home", from: "exam_empty" });
				}}
			>
				{t.exam.backToHome}
			</Link>
		</div>
	);
}

function ExamLoadError({
	subject,
	onRetry,
}: {
	subject: ExamSubject;
	onRetry: () => void;
}) {
	const t = useT();

	return (
		<div className="mx-auto max-w-3xl px-4 py-8 text-center sm:py-16">
			<p role="alert" className="text-fg-muted">
				{t.exam.loadError}
			</p>
			<div className="mt-4 flex justify-center gap-3">
				<button
					type="button"
					className="bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-accent rounded-lg px-4 py-2 font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
					onClick={onRetry}
				>
					{t.exam.retry}
				</button>
				<Link
					to={`/${subject.id}`}
					className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent rounded-lg border px-4 py-2 font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
				>
					{t.exam.backToHome}
				</Link>
			</div>
		</div>
	);
}

interface LoadedExamData {
	questions: Question[];
	megatopicLabels: Record<string, string>;
}

type ExamLoadState =
	| { key: string; status: "loading" }
	| {
			key: string;
			status: "ready";
			questions: Question[];
			megatopicLabels: Record<string, string>;
	  }
	| { key: string; status: "error" }
	| { key: null; status: "idle" };

const examDataCache = new Map<string, Promise<LoadedExamData>>();

function loadExamData(subjectId: string, examId: string) {
	const cacheKey = `${subjectId}/${examId}`;
	const cached = examDataCache.get(cacheKey);
	if (cached) return cached;

	const promise: Promise<LoadedExamData> = getQuestionsByExam(
		subjectId,
		examId,
	).then(async (questions) => {
		const topics = [...new Set(questions.map((question) => question.topic))];
		const entries = await Promise.all(
			topics.map(async (topic) => {
				const label = await getTopicMegaTopicLabel(subjectId, topic);
				return [topic, label] as const;
			}),
		);
		const megatopicLabels: Record<string, string> = {};
		for (const [topic, label] of entries) {
			if (label != null) megatopicLabels[topic] = label;
		}
		return { questions, megatopicLabels };
	});
	examDataCache.set(cacheKey, promise);
	return promise;
}

function useExamData(subject: ExamSubject | undefined, examId?: string) {
	const requestKey = subject && examId ? `${subject.id}/${examId}` : null;
	const [loadState, setLoadState] = useState<ExamLoadState>({
		key: null,
		status: "idle",
	});
	const [retryToken, setRetryToken] = useState(0);
	const currentLoadState =
		loadState.key === requestKey
			? loadState
			: requestKey
				? { key: requestKey, status: "loading" as const }
				: { key: null, status: "idle" as const };
	const loadAttemptKey = requestKey ? `${requestKey}:${retryToken}` : null;

	useEffect(() => {
		if (!subject || !examId || !requestKey || !loadAttemptKey) return;

		let cancelled = false;
		setLoadState({ key: requestKey, status: "loading" });
		loadExamData(subject.id, examId)
			.then((loadedData) => {
				if (cancelled) return;
				setLoadState({
					key: requestKey,
					status: "ready",
					questions: loadedData.questions,
					megatopicLabels: loadedData.megatopicLabels,
				});
			})
			.catch(() => {
				if (cancelled) return;
				examDataCache.delete(requestKey);
				setLoadState({ key: requestKey, status: "error" });
			});

		return () => {
			cancelled = true;
		};
	}, [examId, loadAttemptKey, requestKey, subject]);

	const retry = useCallback(() => {
		if (!requestKey) return;
		setLoadState({ key: requestKey, status: "loading" });
		setRetryToken((current) => current + 1);
	}, [requestKey]);

	const questions =
		currentLoadState.status === "ready" ? currentLoadState.questions : [];
	const megatopicLabels =
		currentLoadState.status === "ready" ? currentLoadState.megatopicLabels : {};

	return {
		questions,
		status: currentLoadState.status,
		megatopicLabels,
		retry,
	};
}

export default function ExamSimulation() {
	const { subjectId, examId } = useParams({ strict: false });
	const navigate = useNavigate();
	const t = useT();
	const langTo = useLangTo();
	const { exam: routeExam, stats } = examRouteApi.useLoaderData();

	const subject = subjectId ? getSubject(subjectId) : undefined;
	const { questions, status, megatopicLabels, retry } = useExamData(
		subject,
		examId,
	);
	const examInfo = routeExam;
	const questionCount = stats.examQuestionCounts[examId || ""] ?? 0;
	const totalPoints = stats.examTotalPoints[examId || ""] ?? 0;
	const passPoints = getExamPassPoints(examInfo, totalPoints);
	const [startRequested, setStartRequested] = useState(false);
	const timeUpDialogRef = useRef<HTMLDialogElement>(null);
	const showTimeUpDialog = useCallback(() => {
		playError();
		showDialog(timeUpDialogRef.current);
	}, []);

	const {
		currentIndex,
		setCurrentIndex,
		answers,
		selfGrades,
		submitted,
		timeLeft,
		started,
		handleAnswer,
		handleStart,
		handleSubmit,
		handleSelfGrade,
	} = useExamSession(
		questions,
		subject?.id || "",
		examId || "",
		(examInfo?.durationMinutes || 120) * 60,
		t,
		showTimeUpDialog,
	);

	const handleSubmitConfirm = useCallback(
		() => handleSubmit(true),
		[handleSubmit],
	);
	const handleStartRequest = useCallback(() => {
		setStartRequested(true);
	}, []);

	useEffect(() => {
		if (subjectId || examId) setStartRequested(false);
	}, [subjectId, examId]);

	useEffect(() => {
		if (
			startRequested &&
			!started &&
			status === "ready" &&
			questions.length > 0
		) {
			handleStart();
		}
	}, [handleStart, questions.length, startRequested, started, status]);

	const [navState, setNavState] = useState({
		direction: undefined as "next" | "prev" | undefined,
		showLeftFade: false,
		showRightFade: false,
	});
	const { direction, showLeftFade, showRightFade } = navState;
	const setDirection = useCallback(
		(d: typeof navState.direction) =>
			setNavState((prev) => ({ ...prev, direction: d })),
		// setNavState is stable from useState
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
	const navRef = useRef<HTMLDivElement>(null);
	const navCleanupRef = useRef<() => void>(() => {});
	const setNavRef = useCallback((element: HTMLDivElement | null) => {
		navCleanupRef.current();
		navCleanupRef.current = () => {};
		navRef.current = element;
		if (!element) return;

		const check = () => {
			setNavState((prev) => ({
				...prev,
				showLeftFade: element.scrollLeft > 4,
				showRightFade:
					element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
			}));
		};
		check();
		element.addEventListener("scroll", check, { passive: true });
		const resizeObserver = new ResizeObserver(check);
		resizeObserver.observe(element);
		const mutationObserver = new MutationObserver(check);
		mutationObserver.observe(element, { childList: true });
		navCleanupRef.current = () => {
			element.removeEventListener("scroll", check);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	}, []);
	const currentIndexRef = useRef(currentIndex);
	const startedRef = useRef(started);
	const scrollToHeaderRef = useRef<() => void>(() => {});

	const scrollToNav = useCallback((index: number) => {
		const container = navRef.current;
		if (!container) return;
		const btn = container.children[index] as HTMLElement | undefined;
		if (!btn) return;
		requestAnimationFrame(() => {
			const cr = container.getBoundingClientRect();
			const br = btn.getBoundingClientRect();
			const step = 108;
			if (br.right > cr.right - 84)
				container.scrollBy({ left: step, behavior: "smooth" });
			else if (br.left < cr.left + 84)
				container.scrollBy({ left: -step, behavior: "smooth" });
		});
	}, []);

	useEffect(() => {
		currentIndexRef.current = currentIndex;
		startedRef.current = started;
	});

	const navEventData = useCallback(
		() => ({ subjectId: subjectId || "", examId: examId || "" }),
		[subjectId, examId],
	);

	useKeyboardNav({
		enabledRef: startedRef,
		questionsLength: questions.length,
		currentIndexRef,
		setCurrentIndex,
		scrollToNav,
		setDirection,
		eventName: "exam_navigate",
		eventData: navEventData,
		onKeyPress: () => {
			scrollToHeaderRef.current();
		},
	});

	useEffect(() => {
		if (!subject) {
			navigate({ to: langTo("/") as never, replace: true });
		} else if (!examInfo) {
			navigate({
				to: langTo(`/${subject.id}`) as never,
				replace: true,
			});
		}
	}, [subject, examInfo, navigate, langTo]);

	useEffect(() => {
		if (!started || questions.length === 0) return;
		const step1Description =
			subject && hasAuthorizedExamContent(subject)
				? t.tour.exam.step1Desc
				: t.tour.exam.practiceStep1Desc;
		const timer = setTimeout(() => {
			startExamTour(
				[
					{
						element: '[data-tour="exam-header"]',
						popover: {
							title: t.tour.exam.step1Title,
							description: step1Description,
							side: "bottom",
						},
					},
					{
						element: '[data-tour="exam-nav"]',
						popover: {
							title: t.tour.exam.step2Title,
							description: t.tour.exam.step2Desc,
							side: "bottom",
						},
					},
					{
						element: '[data-tour="exam-card"]',
						popover: {
							title: t.tour.exam.step3Title,
							description: t.tour.exam.step3Desc,
							side: "top",
						},
					},
					{
						element: '[data-tour="exam-submit"]',
						popover: {
							title: t.tour.exam.step4Title,
							description: t.tour.exam.step4Desc,
							side: "top",
						},
					},
					{
						element: '[data-tour="report-issue"]',
						popover: {
							title: t.tour.reportIssueTitle,
							description: t.tour.reportIssueDesc,
							side: "top",
						},
					},
				],
				{
					next: t.tour.next,
					previous: t.tour.previous,
					done: t.tour.done,
				},
			);
		}, 500);
		return () => clearTimeout(timer);
	}, [started, questions.length, subject, t]);

	if (!subject || !examInfo) {
		return <ExamEmptyState subject={subject} />;
	}

	if (status === "ready" && questions.length === 0) {
		return <ExamEmptyState subject={subject} />;
	}

	const player = (
		<ExamPlayer
			subject={subject}
			examInfo={examInfo}
			questions={questions}
			megatopicLabels={megatopicLabels}
			currentIndex={currentIndex}
			setCurrentIndex={setCurrentIndex}
			answers={answers}
			selfGrades={selfGrades}
			submitted={submitted}
			timeLeft={timeLeft}
			totalPoints={totalPoints}
			passPoints={passPoints}
			direction={direction}
			setDirection={setDirection}
			showLeftFade={showLeftFade}
			showRightFade={showRightFade}
			navRef={setNavRef}
			timeUpDialogRef={timeUpDialogRef}
			scrollToNav={scrollToNav}
			onAnswer={handleAnswer}
			onSelfGrade={handleSelfGrade}
			onSubmit={handleSubmitConfirm}
			onExit={() => navigate({ to: langTo(`/${subject.id}`) as never })}
			scrollToHeaderRef={scrollToHeaderRef}
		/>
	);
	const startScreen = (
		<ExamStartScreen
			subject={subject}
			examInfo={examInfo}
			questionCount={questionCount}
			totalPoints={totalPoints}
			passPoints={passPoints}
			loading={status === "loading"}
			loadError={status === "error"}
			onStart={handleStartRequest}
			onRetry={retry}
		/>
	);
	const loadError = <ExamLoadError subject={subject} onRetry={retry} />;
	const loadingSimulator =
		startRequested && !started && (status === "loading" || status === "ready");
	const content = started
		? player
		: startRequested
			? status === "error"
				? loadError
				: null
			: startScreen;

	return (
		<SimulatorSkeleton
			kind="exam"
			loading={loadingSimulator}
			loadingLabel={t.exam.loadingQuestions}
		>
			{content}
		</SimulatorSkeleton>
	);
}

export function ExamSimulationPending() {
	const { subjectId, examId } = useParams({ strict: false });
	const t = useT();
	const subject = subjectId ? getSubject(subjectId) : undefined;
	const examInfo = subject?.exams.find((exam) => exam.id === examId);
	const generatedStats = subject
		? contentStatsBySubject[subject.id]
		: undefined;

	if (!subject || !examInfo || !generatedStats) {
		return (
			<SimulatorSkeleton
				kind="exam"
				loading
				loadingLabel={t.exam.loadingQuestions}
			/>
		);
	}

	const stats = getSubjectBuildStats(subject, generatedStats);
	const totalPoints = roundPoints(stats.examStats[examInfo.id]?.points ?? 0);
	const questionCount = stats.examStats[examInfo.id]?.questionCount ?? 0;

	return (
		<ExamStartScreen
			subject={subject}
			examInfo={examInfo}
			questionCount={questionCount}
			totalPoints={totalPoints}
			passPoints={getExamPassPoints(examInfo, totalPoints)}
			loading
			loadError={false}
			onStart={() => {}}
			onRetry={() => {}}
		/>
	);
}
