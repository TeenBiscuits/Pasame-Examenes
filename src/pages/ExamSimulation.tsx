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
import { track } from "../lib/rybbit";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";
import { buildExamMeta } from "../seo/meta";
import { useExamSession } from "../hooks/useExamSession";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { startExamTour } from "../lib/tour";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import { formatPoints, roundPoints } from "../lib/points";
import { ArrowSquareLeft2, ArrowSquareRight2 } from "reicon-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge02Icon } from "@hugeicons/core-free-icons";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
    <div className="animate-fade-in animate-duration-fast mx-auto max-w-2xl px-4 py-16">
      <div className="mb-6">
        <Link
          to={`/${subject.id}`}
          className="text-accent focus-visible:ring-accent rounded-md px-1 text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
          onClick={() =>
            track("nav_click", {
              target: "subject_home",
              from: "exam_start_screen",
              subjectId: subject.id,
            })
          }
        >
          {t.exam.backToSubject}
        </Link>
      </div>
      <div className="text-center">
        <h1 className="text-fg mb-2 inline-flex items-center justify-center gap-2 text-3xl font-semibold">
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
        <p className="text-fg-muted mb-8">
          {subject.name} ({subject.courseCode})
        </p>
      </div>
      <div className="bg-surface-alt border-border space-y-4 rounded-xl border p-8 shadow-sm">
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
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {simulationNote}
        </div>
        <button
          type="button"
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
  direction,
  setDirection,
  showLeftFade,
  showRightFade,
  navRef,
  scrollToNav,
  onAnswer,
  onSelfGrade,
  onSubmit,
}: ExamPlayerProps) {
  const t = useT();
  const currentQuestion = questions[currentIndex];
  const currentTopic = subject.topics.find(
    (tp) => tp.key === currentQuestion.topic,
  );
  const isAuthorized = hasAuthorizedExamContent(subject);

  const getScore = () => {
    let score = 0;
    for (const q of questions) {
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
      } else if (q.type === "text") {
        if (selfGrades[q.id] === "correct") score += q.points;
      }
    }
    return roundPoints(score);
  };

  const score = getScore();

  return (
    <div className="animate-fade-in animate-duration-fast mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          to={`/${subject.id}`}
          onClick={(e) => {
            if (!submitted) {
              if (!window.confirm(t.exam.exitConfirm)) {
                e.preventDefault();
              } else {
                const answeredCount = Object.values(answers).filter(
                  (a) => a && a.trim() !== "",
                ).length;
                track("exam_abandon", {
                  subjectId: subject.id,
                  year: examInfo.year,
                  answeredCount,
                  timeLeft,
                });
              }
            }
          }}
          className="text-accent focus-visible:ring-accent rounded-md px-1 text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
        >
          {t.exam.backToSubject}
        </Link>
      </div>
      <div
        className="bg-surface border-border sticky top-14 z-40 -mx-4 mb-6 flex items-center justify-between border-b px-4 py-3"
        data-tour="exam-header"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <span className="text-fg text-lg font-bold">{examInfo.title}</span>
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
          <span className="text-fg-muted text-sm">
            {formatPoints(totalPoints)}p {t.exam.total}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {!submitted && (
            <span
              className={`font-mono text-sm font-bold ${timeLeft < 600 ? "animate-pulse text-red-600" : "text-fg-secondary"}`}
            >
              {formatTime(timeLeft)}
            </span>
          )}
          {submitted && (
            <span
              className={`animate-fade-in rounded px-3 py-1 text-sm font-bold ${score >= examInfo.passPoints ? "bg-accent-light text-accent-fg" : "bg-red-50 text-red-700"}`}
            >
              {formatPoints(score)}/{formatPoints(totalPoints)}p{" "}
              {score >= examInfo.passPoints ? t.exam.pass_ : t.exam.fail}
            </span>
          )}
        </div>
      </div>

      {submitted && (
        <div className="bg-accent-light border-accent-border animate-fade-in-up mb-6 rounded-lg border p-4 text-sm">
          <p className="text-fg mb-1 font-semibold">
            {t.exam.submitted} {t.exam.score}: {formatPoints(score)}
            {t.exam.outOf}
            {formatPoints(totalPoints)} (
            {Math.round((score / totalPoints) * 100)}%)
          </p>
          <p className="text-accent-fg">
            {t.exam.passThreshold}: {formatPoints(examInfo.passPoints)}p.{" "}
            {t.exam.reviewNote}
          </p>
        </div>
      )}

      <QuestionNavChips
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
        navRef={navRef}
        showLeftFade={showLeftFade}
        showRightFade={showRightFade}
        dataTour="exam-nav"
        eventName="exam_navigate"
        eventData={{ subjectId: subject.id, year: examInfo.year }}
        onSelectIndex={(i, dir) => {
          setDirection(dir);
          setCurrentIndex(i);
          scrollToNav(i);
        }}
      />

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

      <div className="mt-6 flex flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-between">
        <button
          type="button"
          className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-1 rounded-lg border px-4 py-2 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30"
          onClick={() => {
            triggerLight();
            const nextIndex = Math.max(0, currentIndex - 1);
            setDirection("prev");
            track("exam_navigate", {
              subjectId: subject.id,
              year: examInfo.year,
              direction: "prev",
              fromIndex: currentIndex,
              toIndex: nextIndex,
              source: "arrow",
            });
            setCurrentIndex(nextIndex);
            scrollToNav(nextIndex);
          }}
          disabled={currentIndex === 0}
        >
          <span className="flex items-center gap-1.5">
            <ArrowSquareLeft2 size={18} aria-hidden="true" />
            {t.exam.previous}
          </span>
        </button>
        <div
          className="order-3 flex w-full justify-center gap-2 sm:order-2 sm:w-auto"
          data-tour="exam-submit"
        >
          {!submitted && (
            <button
              type="button"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none active:scale-95"
              onClick={onSubmit}
            >
              {t.exam.submitExam}
            </button>
          )}
        </div>
        <button
          type="button"
          className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-2 ms-auto rounded-lg border px-4 py-2 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30 sm:order-3 sm:ms-0"
          onClick={() => {
            triggerLight();
            const nextIndex = Math.min(questions.length - 1, currentIndex + 1);
            setDirection("next");
            track("exam_navigate", {
              subjectId: subject.id,
              year: examInfo.year,
              direction: "next",
              fromIndex: currentIndex,
              toIndex: nextIndex,
              source: "arrow",
            });
            setCurrentIndex(nextIndex);
            scrollToNav(nextIndex);
          }}
          disabled={currentIndex === questions.length - 1}
        >
          <span className="flex items-center gap-1.5">
            {t.exam.next}
            <ArrowSquareRight2 size={18} aria-hidden="true" />
          </span>
        </button>
      </div>

      <Disclaimer
        subjectId={subject.id}
        questionId={currentQuestion.id}
        questionType={currentQuestion.type}
      />
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
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        {questionsLoaded && null}
        <p className="text-fg-muted">{t.exam.noQuestions}</p>
        <Link
          to={subject ? `/${subject.id}` : "/"}
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
        totalPoints={totalPoints}
        direction={direction}
        setDirection={setDirection}
        showLeftFade={showLeftFade}
        showRightFade={showRightFade}
        navRef={navRef}
        scrollToNav={scrollToNav}
        onAnswer={handleAnswer}
        onSelfGrade={handleSelfGrade}
        onSubmit={handleSubmit}
      />
    </>
  );
}
