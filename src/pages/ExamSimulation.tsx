import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LangLink as Link } from "../lib/lang-link";
import { useLangTo } from "../lib/useLangTo";
import {
  getSubject,
  getQuestionsByExam,
  getTopicMegaTopicLabel,
} from "../subjects";
import type { Question, Exam } from "../data/types";
import QuestionCard from "../components/QuestionCard";
import QuestionNavChips from "../components/QuestionNavChips";
import Disclaimer from "../components/Disclaimer";
import { useLang, useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";
import { buildExamMeta } from "../seo/meta";
import { useExamSession } from "../hooks/useExamSession";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { useBrowserNavigationGuard } from "../hooks/useBrowserNavigationGuard";
import { startExamTour } from "../lib/tour";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import { formatPoints, roundPoints } from "../lib/points";
import { computeQuestionResults } from "../lib/grading";
import ScoreProgress from "../components/ScoreProgress";
import {
  Alarm,
  ArrowSquareLeft2,
  ArrowSquareRight2,
  CloseSquare2,
  Exit,
  Send,
  Trophy,
} from "reicon-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge02Icon } from "@hugeicons/core-free-icons";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

interface ExamStartScreenProps {
  subject: NonNullable<ReturnType<typeof getSubject>>;
  examInfo: Exam;
  questions: Question[];
  totalPoints: number;
  onStart: () => void;
}

function ExamStartScreen({
  subject,
  examInfo,
  questions,
  totalPoints,
  onStart,
}: ExamStartScreenProps) {
  const t = useT();
  const simulationNote = hasAuthorizedExamContent(subject)
    ? t.exam.simulationNote
    : t.exam.practiceNote;
  const isAuthorized = hasAuthorizedExamContent(subject);
  return (
    <div className="animate-fade-in animate-duration-fast mx-auto max-w-2xl px-4 py-6 sm:py-16">
      <div className="mb-3 sm:mb-4">
        <Link
          to={`/${subject.id}`}
          data-cuelume-hover
          data-cuelume-press
          className="text-accent focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-md text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
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
              className="border-t-amber-border bg-t-amber-bg text-t-amber-hover inline-flex size-6 shrink-0 items-center justify-center rounded border"
              title={t.contentPolicy.authorized}
            >
              <HugeiconsIcon
                icon={CheckmarkBadge02Icon}
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
            <p className="font-semibold">{questions.length}</p>
          </div>
          <div>
            <span className="text-fg-muted">{t.exam.totalPoints}</span>
            <p className="font-semibold">{formatPoints(totalPoints)}p</p>
          </div>
          <div>
            <span className="text-fg-muted">{t.exam.pass}</span>
            <p className="font-semibold">
              {formatPoints(examInfo.passPoints)}p
            </p>
          </div>
          <div>
            <span className="text-fg-muted">{t.exam.timeLimit}</span>
            <p className="font-semibold">
              {examInfo.durationMinutes} {t.exam.minutes}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 sm:p-4">
          <Alarm size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          {simulationNote}
        </div>
        <button
          type="button"
          data-cuelume-press
          className="bg-accent hover:bg-accent-hover focus-visible:ring-accent w-full animate-pulse rounded-lg py-3 font-medium text-white transition focus-visible:ring-2 focus-visible:outline-none active:scale-[0.98]"
          onClick={onStart}
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
  timeUp: boolean;
  totalPoints: number;
  direction: "next" | "prev" | undefined;
  setDirection: (d: "next" | "prev" | undefined) => void;
  showLeftFade: boolean;
  showRightFade: boolean;
  navRef: React.RefObject<HTMLDivElement | null>;
  scrollToNav: (index: number) => void;
  onAnswer: (questionId: string, answer: string) => void;
  onSelfGrade: (questionId: string, grade: "correct" | "incorrect") => void;
  onSubmit: () => void;
  arrowAnimateRef: React.MutableRefObject<(dir: "prev" | "next") => void>;
}

type ExamSubject = ExamPlayerProps["subject"];

interface ExamPlayerHeaderProps {
  subject: ExamSubject;
  examInfo: Exam;
  questions: Question[];
  answers: Record<string, string>;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  submitted: boolean;
  timeLeft: number;
  totalPoints: number;
  score: number;
  pendingTextCount: number;
  questionResults: ReturnType<typeof computeQuestionResults>;
  setDirection: (d: "next" | "prev" | undefined) => void;
  showLeftFade: boolean;
  showRightFade: boolean;
  navRef: React.RefObject<HTMLDivElement | null>;
  scrollToNav: (index: number) => void;
  exitDialogRef: React.RefObject<HTMLDialogElement | null>;
}

function ExamPlayerHeader({
  subject,
  examInfo,
  questions,
  answers,
  currentIndex,
  setCurrentIndex,
  submitted,
  timeLeft,
  totalPoints,
  score,
  pendingTextCount,
  questionResults,
  setDirection,
  showLeftFade,
  showRightFade,
  navRef,
  scrollToNav,
  exitDialogRef,
}: ExamPlayerHeaderProps) {
  const t = useT();
  const isAuthorized = hasAuthorizedExamContent(subject);

  return (
    <>
      <div>
        <Link
          to={`/${subject.id}`}
          data-cuelume-hover
          data-cuelume-press
          onClick={(e) => {
            if (!submitted) {
              e.preventDefault();
              exitDialogRef.current?.showModal();
            }
          }}
          className="text-accent focus-visible:ring-accent inline-flex items-center gap-1.5 rounded-md text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          <Exit size={16} aria-hidden="true" className="shrink-0" />
          {t.exam.backToSubject}
        </Link>
      </div>
      <div
        className="bg-surface border-border sticky top-14 z-40 -mx-4 mb-4 border-b px-4 pt-2 pb-3 sm:mb-6"
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
                  className="border-t-amber-border bg-t-amber-bg text-t-amber-hover inline-flex size-5 shrink-0 items-center justify-center rounded border"
                  title={t.contentPolicy.authorized}
                >
                  <HugeiconsIcon
                    icon={CheckmarkBadge02Icon}
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
                className={`flex items-center gap-1.5 font-mono text-sm font-bold ${timeLeft < 600 ? "text-incorrect-fg animate-pulse" : "text-fg-secondary"}`}
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
                    : score >= examInfo.passPoints
                      ? "bg-correct-bg text-correct-fg"
                      : "bg-incorrect-bg text-incorrect-fg"
                }`}
              >
                {pendingTextCount > 0
                  ? t.exam.submitted
                  : score >= examInfo.passPoints
                    ? t.exam.pass_
                    : t.exam.fail}
              </span>
            )}
          </div>
        </div>
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
          eventData={{ subjectId: subject.id, year: examInfo.year }}
          className="mt-4 mb-0"
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
}

function ExamExitDialog({
  subject,
  examInfo,
  answers,
  timeLeft,
  dialogRef,
}: ExamExitDialogProps) {
  const t = useT();

  return (
    <dialog
      ref={dialogRef}
      className="animate-dialog bg-surface-alt m-auto max-w-sm rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
      aria-labelledby="exam-exit-modal-title"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2
          id="exam-exit-modal-title"
          className="text-fg inline-flex items-center gap-2 text-lg font-semibold"
        >
          <Exit size={24} aria-hidden="true" className="shrink-0" />
          {t.exam.exitModalTitle}
        </h2>
        <button
          type="button"
          data-cuelume-press
          onClick={() => dialogRef.current?.close()}
          className="text-fg-muted hover:text-fg-secondary focus-visible:ring-accent shrink-0 rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label={t.exam.exitModalCancel}
        >
          <CloseSquare2 className="size-5" />
        </button>
      </div>
      <p className="text-fg-secondary mb-6 text-sm">{t.exam.exitConfirm}</p>
      <div className="flex gap-3">
        <button
          type="button"
          data-cuelume-press
          onClick={() => dialogRef.current?.close()}
          className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent flex-1 rounded-lg border px-4 py-2 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
        >
          {t.exam.exitModalCancel}
        </button>
        <Link
          to={`/${subject.id}`}
          data-cuelume-press
          className="focus-visible:ring-incorrect-fg inline-flex flex-1 items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-red-700 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
          onClick={() => {
            dialogRef.current?.close();
            const answeredCount = Object.values(answers).filter(
              (answer) => answer && answer.trim() !== "",
            ).length;
            track("exam_abandon", {
              subjectId: subject.id,
              year: examInfo.year,
              answeredCount,
              timeLeft,
            });
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
}

function ExamScoreSummary({
  score,
  totalPoints,
  pendingTextCount,
  pendingTextPoints,
  passPoints,
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
      className="animate-fade-in-up mb-4 sm:mb-6"
    >
      <div
        className={`rounded-lg border p-3 pb-7 text-sm sm:p-4 sm:pb-8 ${panelClass}`}
      >
        <div className="text-fg mb-1 flex items-center gap-2">
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
        <p className={statusClass}>
          {pendingTextCount > 0
            ? t.exam.selfGradeHint
            : `${t.exam.passThreshold}: ${formatPoints(passPoints)}p. ${t.exam.reviewNote}`}
        </p>
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
  submitDialogRef: React.RefObject<HTMLDialogElement | null>;
  arrowAnimateRef: React.MutableRefObject<(dir: "prev" | "next") => void>;
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
  submitDialogRef,
  arrowAnimateRef,
}: ExamControlsProps) {
  const t = useT();
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const animateArrowPress = useCallback(
    (ref: React.RefObject<HTMLButtonElement | null>) => {
      ref.current?.animate(
        [{ transform: "scale(0.92)" }, { transform: "scale(1)" }],
        { duration: 150, easing: "ease-out" },
      );
    },
    [],
  );

  useEffect(() => {
    arrowAnimateRef.current = (dir) => {
      animateArrowPress(dir === "prev" ? prevBtnRef : nextBtnRef);
    };
  }, [arrowAnimateRef, animateArrowPress]);

  const navigateQuestion = (dir: "prev" | "next") => {
    triggerLight();
    const nextIndex =
      dir === "prev"
        ? Math.max(0, currentIndex - 1)
        : Math.min(questions.length - 1, currentIndex + 1);
    setDirection(dir);
    track("exam_navigate", {
      subjectId: subject.id,
      year: examInfo.year,
      direction: dir,
      fromIndex: currentIndex,
      toIndex: nextIndex,
      source: "arrow",
    });
    setCurrentIndex(nextIndex);
    scrollToNav(nextIndex);
  };

  return (
    <div className="mt-4 flex items-center gap-2 sm:mt-6 sm:justify-between sm:gap-3">
      <button
        type="button"
        ref={prevBtnRef}
        data-cuelume-press
        className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-1 flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30 sm:py-2"
        onMouseEnter={() => setHoverPrev(true)}
        onMouseLeave={() => setHoverPrev(false)}
        onClick={() => navigateQuestion("prev")}
        disabled={currentIndex === 0}
      >
        <ArrowSquareLeft2
          size={18}
          weight={hoverPrev ? "Filled" : "Outline"}
          aria-hidden="true"
          className="shrink-0"
        />
        <span className="hidden sm:inline sm:min-w-0 sm:truncate">
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
            data-cuelume-press
            className="focus-visible:ring-incorrect-fg flex min-w-0 items-center gap-1.5 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:ring-2 focus-visible:outline-none active:scale-95 sm:py-2"
            onClick={() => submitDialogRef.current?.showModal()}
          >
            <Send size={18} aria-hidden="true" className="shrink-0" />
            <span className="min-w-0 truncate">{t.exam.submitExam}</span>
          </button>
        )}
      </div>
      <button
        type="button"
        ref={nextBtnRef}
        data-cuelume-press
        className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-3 flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30 sm:py-2"
        onMouseEnter={() => setHoverNext(true)}
        onMouseLeave={() => setHoverNext(false)}
        onClick={() => navigateQuestion("next")}
        disabled={currentIndex === questions.length - 1}
      >
        <span className="hidden sm:inline sm:min-w-0 sm:truncate">
          {t.exam.next}
        </span>
        <ArrowSquareRight2
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

  return (
    <>
      <dialog
        ref={submitDialogRef}
        className="animate-dialog bg-surface-alt m-auto max-w-sm rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
        aria-labelledby="exam-submit-modal-title"
        onClose={() => {}}
      >
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2
              id="exam-submit-modal-title"
              className="text-fg text-lg font-semibold"
            >
              {t.exam.submitModalTitle}
            </h2>
            <button
              type="button"
              onClick={() => submitDialogRef.current?.close()}
              className="text-fg-muted hover:text-fg-secondary cursor-pointer transition-colors"
              aria-label="Close"
            >
              <CloseSquare2 className="size-5" />
            </button>
          </div>
          <p className="text-fg-secondary mb-6 text-sm">
            {t.exam.submitModalBody}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              data-cuelume-press
              onClick={() => submitDialogRef.current?.close()}
              className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent flex-1 rounded-lg border px-4 py-2 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
            >
              {t.exam.submitModalCancel}
            </button>
            <button
              type="button"
              data-cuelume-press
              onClick={() => {
                submitDialogRef.current?.close();
                onSubmit();
              }}
              className="focus-visible:ring-incorrect-fg flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
            >
              {t.exam.submitModalConfirm}
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={timeUpDialogRef}
        className="animate-dialog bg-surface-alt m-auto max-w-sm rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:transition-[background-color,overlay,display] backdrop:duration-200"
        aria-labelledby="exam-timeup-modal-title"
        onClose={() => {
          if (!submitted) onSubmit();
        }}
      >
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2
              id="exam-timeup-modal-title"
              className="text-fg text-lg font-semibold"
            >
              <span className="inline-flex items-center gap-2">
                <Alarm size={24} aria-hidden="true" />
                {t.exam.timeUpModalTitle}
              </span>
            </h2>
            <button
              type="button"
              data-cuelume-press
              onClick={() => timeUpDialogRef.current?.close()}
              className="text-fg-muted hover:text-fg-secondary cursor-pointer transition-colors"
              aria-label="Close"
            >
              <CloseSquare2 className="size-5" />
            </button>
          </div>
          <p className="text-fg-secondary mb-6 text-sm">
            {t.exam.timeUpModalBody}
          </p>
          <button
            type="button"
            data-cuelume-press
            onClick={() => timeUpDialogRef.current?.close()}
            className="bg-accent hover:bg-accent-hover focus-visible:ring-accent w-full rounded-lg px-4 py-2 text-sm font-medium text-white transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
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
  timeUp,
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
  arrowAnimateRef,
}: ExamPlayerProps) {
  const currentQuestion = questions[currentIndex];
  const currentTopic = subject.topics.find(
    (tp) => tp.key === currentQuestion.topic,
  );
  const submitDialogRef = useRef<HTMLDialogElement>(null);
  const timeUpDialogRef = useRef<HTMLDialogElement>(null);
  const exitDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (timeUp && !submitted) {
      timeUpDialogRef.current?.showModal();
    }
  }, [timeUp, submitted]);

  const getScore = () => {
    let score = 0;
    for (const q of questions) {
      if (q.type === "text") {
        if (selfGrades[q.id] === "correct") score += q.points;
        continue;
      }
      if (!answers[q.id] || answers[q.id].trim() === "") continue;
      if (q.type === "mc") {
        if (answers[q.id] === q.correctAnswer) score += q.points;
      } else if (q.type === "matching") {
        try {
          const user = JSON.parse(answers[q.id]) as Record<string, string>;
          const correct = q.correctAnswer as Record<string, string>;
          const items = Object.keys(correct);
          let correctCount = 0;
          for (const item of items) {
            if (user[item] === correct[item]) correctCount++;
          }
          score += Math.round((correctCount / items.length) * q.points);
        } catch {
          /* skip */
        }
      }
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
        (q) => q.type === "text" && submitted && !selfGrades[q.id],
      ).length,
    [questions, selfGrades, submitted],
  );

  const pendingTextPoints = useMemo(
    () =>
      questions
        .filter((q) => q.type === "text" && submitted && !selfGrades[q.id])
        .reduce((sum, q) => sum + q.points, 0),
    [questions, selfGrades, submitted],
  );

  return (
    <div className="animate-fade-in animate-duration-fast mx-auto max-w-3xl px-4 py-4 sm:py-8">
      <ExamPlayerHeader
        subject={subject}
        examInfo={examInfo}
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        submitted={submitted}
        timeLeft={timeLeft}
        totalPoints={totalPoints}
        score={score}
        pendingTextCount={pendingTextCount}
        questionResults={questionResults}
        setDirection={setDirection}
        showLeftFade={showLeftFade}
        showRightFade={showRightFade}
        navRef={navRef}
        scrollToNav={scrollToNav}
        exitDialogRef={exitDialogRef}
      />

      {submitted && (
        <ExamScoreSummary
          score={score}
          totalPoints={totalPoints}
          pendingTextCount={pendingTextCount}
          pendingTextPoints={pendingTextPoints}
          passPoints={examInfo.passPoints}
        />
      )}

      <div data-tour="exam-card">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          topicLabel={currentTopic?.label || currentQuestion.topic}
          megatopicLabel={megatopicLabels[currentQuestion.topic]}
          examDate={examInfo?.date || examInfo?.title}
          subjectId={subject.id}
          topicKey={currentQuestion.topic}
          examYear={examInfo.year}
          mode="exam"
          onAnswer={onAnswer}
          savedAnswer={answers[currentQuestion.id]}
          showResult={submitted}
          selfGrade={selfGrades[currentQuestion.id]}
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
        submitDialogRef={submitDialogRef}
        arrowAnimateRef={arrowAnimateRef}
      />

      <Disclaimer
        subjectId={subject.id}
        questionId={currentQuestion.id}
        questionType={currentQuestion.type}
      />

      <ExamDialogs
        submitted={submitted}
        submitDialogRef={submitDialogRef}
        timeUpDialogRef={timeUpDialogRef}
        onSubmit={onSubmit}
      />
      <ExamExitDialog
        subject={subject}
        examInfo={examInfo}
        answers={answers}
        timeLeft={timeLeft}
        dialogRef={exitDialogRef}
      />
    </div>
  );
}

function ExamEmptyState({
  subject,
  questionsLoaded,
}: {
  subject: ExamSubject | undefined;
  questionsLoaded: boolean;
}) {
  const t = useT();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 text-center sm:py-16">
      {questionsLoaded && null}
      <p className="text-fg-muted">{t.exam.noQuestions}</p>
      <Link
        to={subject ? `/${subject.id}` : "/"}
        data-cuelume-hover
        data-cuelume-press
        className="text-accent mt-4 inline-block hover:underline"
        onClick={() => {
          triggerLight();
          track("nav_click", { target: "home", from: "exam_empty" });
        }}
      >
        {t.exam.backToHome}
      </Link>
    </div>
  );
}

export default function ExamSimulation() {
  const { subjectId, year } = useParams<{ subjectId: string; year: string }>();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const langTo = useLangTo();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoadedFor, setQuestionsLoadedFor] = useState<string | null>(
    null,
  );
  const [megatopicLabels, setMegatopicLabels] = useState<
    Record<string, string>
  >({});
  const examInfo = useMemo(
    () => subject?.exams.find((e: Exam) => e.year === year && !e.deleteRights),
    [subject, year],
  );
  useEffect(() => {
    if (subject && year) {
      getQuestionsByExam(subject.id, year).then((examQuestions) => {
        setQuestions(examQuestions);
        setQuestionsLoadedFor(`${subject.id}/${year}`);
      });
    }
  }, [subject, year]);
  const questionsLoaded =
    !!subject && !!year && questionsLoadedFor === `${subject.id}/${year}`;

  useEffect(() => {
    if (!subject || questions.length === 0) return;
    const topics = [...new Set(questions.map((q) => q.topic))];
    Promise.all(
      topics.map(async (t) => {
        const label = await getTopicMegaTopicLabel(subject.id, t);
        return [t, label] as const;
      }),
    ).then((entries) => {
      const labels: Record<string, string> = {};
      for (const [t, l] of entries) {
        if (l != null) labels[t] = l;
      }
      setMegatopicLabels(labels);
    });
  }, [subject, questions]);
  const seoMeta = useMemo(
    () =>
      examInfo && subject
        ? buildExamMeta(lang, subject, examInfo, {
            examQuestionCounts: { [examInfo.year]: questions.length },
          })
        : undefined,
    [examInfo, subject, lang, questions.length],
  );
  useDocumentTitle(seoMeta?.title ?? t.home.title);

  useSeoHead({
    title: seoMeta?.title ?? t.home.title,
    description: seoMeta?.description ?? t.seo.defaultDescription,
    pathWithoutLang: seoMeta?.pathWithoutLang ?? "/",
    ogImage: subject ? `/og/${subject.id}.png` : undefined,
    jsonLd: seoMeta?.jsonLd,
    enabled: !(subject && examInfo) || questionsLoaded,
  });

  const {
    currentIndex,
    setCurrentIndex,
    answers,
    selfGrades,
    submitted,
    timeLeft,
    timeUp,
    started,
    handleAnswer,
    handleStart,
    handleSubmit,
    handleSelfGrade,
  } = useExamSession(
    questions,
    subject?.id || "",
    year || "",
    (examInfo?.durationMinutes || 120) * 60,
    t,
  );

  useBrowserNavigationGuard(questions.length > 0 && !!subject && !!examInfo);

  const handleSubmitConfirm = useCallback(
    () => handleSubmit(true),
    [handleSubmit],
  );

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
  const currentIndexRef = useRef(currentIndex);
  const startedRef = useRef(started);
  const arrowAnimateRef = useRef<(dir: "prev" | "next") => void>(() => {});

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
    () => ({ subjectId: subjectId || "", year: year || "" }),
    [subjectId, year],
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
    onKeyPress: (dir) => arrowAnimateRef.current(dir),
  });

  useEffect(() => {
    if (!subject) {
      navigate(langTo("/"), { replace: true });
    } else if (!examInfo) {
      navigate(langTo(`/${subject.id}`), { replace: true });
    }
  }, [subject, examInfo, navigate, langTo]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const check = () => {
      setNavState((prev) => ({
        ...prev,
        showLeftFade: el.scrollLeft > 4,
        showRightFade: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      }));
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [questions, started, setNavState]);

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

  const totalPoints = roundPoints(questions.reduce((s, q) => s + q.points, 0));

  if (questions.length === 0 || !subject || !examInfo) {
    return (
      <ExamEmptyState subject={subject} questionsLoaded={questionsLoaded} />
    );
  }

  if (!started) {
    return (
      <>
        {questionsLoaded && null}
        <ExamStartScreen
          subject={subject}
          examInfo={examInfo}
          questions={questions}
          totalPoints={totalPoints}
          onStart={handleStart}
        />
      </>
    );
  }

  return (
    <>
      {questionsLoaded && null}
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
        timeUp={timeUp}
        totalPoints={totalPoints}
        direction={direction}
        setDirection={setDirection}
        showLeftFade={showLeftFade}
        showRightFade={showRightFade}
        navRef={navRef}
        scrollToNav={scrollToNav}
        onAnswer={handleAnswer}
        onSelfGrade={handleSelfGrade}
        onSubmit={handleSubmitConfirm}
        arrowAnimateRef={arrowAnimateRef}
      />
    </>
  );
}
