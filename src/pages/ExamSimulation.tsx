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
import { startExamTour } from "../lib/tour";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import { formatPoints, roundPoints } from "../lib/points";

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
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in animate-duration-fast">
      <div className="mb-6">
        <Link
          to={`/${subject.id}`}
          className="text-sm text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-md px-1"
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
        <h1 className="text-3xl font-semibold text-fg mb-2">
          {examInfo.title}
        </h1>
        <p className="text-fg-muted mb-8">
          {subject.name} ({subject.courseCode})
        </p>
      </div>
      <div className="bg-surface-alt rounded-xl border border-border p-8 shadow-sm space-y-4">
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
            <p className="font-semibold">{formatPoints(examInfo.passPoints)}p</p>
          </div>
          <div>
            <span className="text-fg-muted">{t.exam.timeLimit}</span>
            <p className="font-semibold">
              {examInfo.durationMinutes} {t.exam.minutes}
            </p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          {simulationNote}
        </div>
        <button
          type="button"
          className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent-hover active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition font-medium animate-pulse"
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
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in animate-duration-fast">
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
          className="text-sm text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-md px-1"
        >
          {t.exam.backToSubject}
        </Link>
      </div>
      <div
        className="flex items-center justify-between mb-6 sticky top-14 bg-surface py-3 -mx-4 px-4 z-40 border-b border-border"
        data-tour="exam-header"
      >
        <div>
          <span className="text-lg font-bold text-fg">{examInfo.title}</span>
          <span className="text-sm text-fg-muted ml-3">
            {formatPoints(totalPoints)}p {t.exam.total}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {!submitted && (
            <span
              className={`font-mono text-sm font-bold ${timeLeft < 600 ? "text-red-600 animate-pulse" : "text-fg-secondary"}`}
            >
              {formatTime(timeLeft)}
            </span>
          )}
          {submitted && (
            <span
              className={`text-sm font-bold px-3 py-1 rounded animate-fade-in ${score >= examInfo.passPoints ? "bg-accent-light text-accent-fg" : "bg-red-50 text-red-700"}`}
            >
              {formatPoints(score)}/{formatPoints(totalPoints)}p{" "}
              {score >= examInfo.passPoints ? t.exam.pass_ : t.exam.fail}
            </span>
          )}
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-lg bg-accent-light border border-accent-border text-sm animate-fade-in-up">
          <p className="font-semibold text-fg mb-1">
            {t.exam.submitted} {t.exam.score}: {formatPoints(score)}
            {t.exam.outOf}
            {formatPoints(totalPoints)} ({Math.round((score / totalPoints) * 100)}%)
          </p>
          <p className="text-accent-fg">
            {t.exam.passThreshold}: {formatPoints(examInfo.passPoints)}p. {t.exam.reviewNote}
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

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mt-6 sm:justify-between">
        <button
          type="button"
          className="order-1 px-4 py-2 text-sm rounded-lg border border-border text-fg-secondary hover:bg-surface active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-30 transition"
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
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
              <path
                d="M14 8l-4 4 4 4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.exam.previous}
          </span>
        </button>
        <div
          className="flex justify-center gap-2 order-3 sm:order-2 w-full sm:w-auto"
          data-tour="exam-submit"
        >
          {!submitted && (
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none transition font-medium"
              onClick={onSubmit}
            >
              {t.exam.submitExam}
            </button>
          )}
        </div>
        <button
          type="button"
          className="order-2 sm:order-3 ms-auto sm:ms-0 px-4 py-2 text-sm rounded-lg border border-border text-fg-secondary hover:bg-surface active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-30 transition"
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
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
              <path
                d="M10 8l4 4-4 4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-fg-muted">{t.exam.noQuestions}</p>
        <Link
          to={subject ? `/${subject.id}` : "/"}
          className="text-accent hover:underline mt-4 inline-block"
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
      <ExamStartScreen
        subject={subject}
        examInfo={examInfo}
        questions={questions}
        totalPoints={totalPoints}
        onStart={handleStart}
      />
    );
  }

  return (
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
  );
}
