import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LangLink as Link } from "../lib/lang-link";
import { useLangTo } from "../lib/useLangTo";
import {
  getSubject,
  getQuestionsByTopic,
  getTopicMegaTopicLabel,
} from "../subjects";
import type { Question } from "../data/types";
import QuestionCard from "../components/QuestionCard";
import QuestionNavChips from "../components/QuestionNavChips";
import Disclaimer from "../components/Disclaimer";
import { useLang, useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";
import { buildTopicMeta } from "../seo/meta";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import { startPracticeTour } from "../lib/tour";
import { formatPoints, roundPoints } from "../lib/points";

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
  textQuestionCount: number;
  direction: "next" | "prev" | undefined;
  setDirection: (d: "next" | "prev" | undefined) => void;
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
  textQuestionCount,
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
}: PracticePlayerProps) {
  const t = useT();
  const currentQuestion = questions[currentIndex];

  const examDate = useMemo(() => {
    if (currentQuestion?.exam === "both") return undefined;
    const exam = currentQuestion
      ? subject.exams.find((e) => e.year === currentQuestion.exam)
      : undefined;
    return exam?.date || exam?.title;
  }, [subject, currentQuestion]);

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

  return (
    <div className="animate-fade-in animate-duration-fast mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6" data-tour="practice-back">
        <Link
          to={`/${subject.id}`}
          className="text-accent focus-visible:ring-accent rounded-md px-1 text-sm hover:underline focus-visible:ring-2 focus-visible:outline-none"
          onClick={() =>
            track("nav_click", { target: "subject_home", from: "practice" })
          }
        >
          {t.practice.backToTopics}
        </Link>
        <h1 className="text-fg mt-2 text-2xl font-semibold">
          {topicInfo?.icon} {topicInfo?.label || topic}
        </h1>
        <p className="text-fg-muted mt-1 text-sm">
          {questions.length} {t.subjectCard.questions} &middot;{" "}
          {formatPoints(totalPoints)} {t.practice.pointsTotal}
        </p>
      </div>

      {(submitted || Object.keys(checkedQuestions).length > 0) && (
        <div className="bg-accent-light border-accent-border animate-fade-in-up mb-6 rounded-lg border p-4">
          <p className="text-fg font-semibold">
            {submitted ? t.practice.score : t.practice.runningScore}:{" "}
            {formatPoints(getScore())} {t.exam.outOf}{" "}
            {formatPoints(totalPoints)} {t.practice.points}
          </p>
          <p className="text-accent-fg mt-1 text-sm">
            {submitted
              ? textQuestionCount > 0
                ? `${Object.values(selfGrades).filter(Boolean).length} ${t.exam.outOf} ${textQuestionCount} ${t.practice.openEnded}`
                : t.practice.allCorrect
              : `${Object.keys(checkedQuestions).length} ${t.exam.outOf} ${questions.length} ${t.practice.checked}`}
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
        checkedQuestions={checkedQuestions}
        dataTour="practice-nav"
        eventName="practice_navigate"
        eventData={{ subjectId: subject.id, topic: topic || "" }}
        onSelectIndex={(i, dir) => {
          setDirection(dir);
          setCurrentIndex(i);
          scrollToNav(i);
        }}
      />

      <div data-tour="practice-card">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          topicLabel={topicInfo?.label || topic || ""}
          megatopicLabel={megatopicLabel}
          examDate={examDate}
          subjectId={subject.id}
          topicKey={topic || undefined}
          examYear={
            currentQuestion?.exam === "both" ? undefined : currentQuestion?.exam
          }
          mode="practice"
          onAnswer={onAnswer}
          savedAnswer={answers[currentQuestion.id]}
          showResult={submitted || !!checkedQuestions[currentQuestion.id]}
          selfGrade={selfGrades[currentQuestion.id]}
          onSelfGrade={onSelfGrade}
          direction={direction}
        />
      </div>

      <div
        className="mt-6 flex flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-between"
        data-tour="practice-nav-btns"
      >
        <button
          type="button"
          className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-1 rounded-lg border px-4 py-2 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30"
          onClick={() => {
            triggerLight();
            const nextIndex = Math.max(0, currentIndex - 1);
            setDirection("prev");
            track("practice_navigate", {
              subjectId: subject.id,
              topic: topic || "",
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
            {t.practice.previous}
          </span>
        </button>
        <div
          className="order-3 flex w-full justify-center gap-2 sm:order-2 sm:w-auto"
          data-tour="practice-actions"
        >
          {answers[currentQuestion.id] &&
            !submitted &&
            !checkedQuestions[currentQuestion.id] && (
              <>
                <button
                  type="button"
                  className="border-border text-fg-muted hover:text-fg-secondary hover:bg-surface focus-visible:ring-accent rounded-lg border px-4 py-2 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
                  onClick={() => {
                    triggerLight();
                    track("practice_clear_answer", {
                      questionId: currentQuestion.id,
                      subjectId: subject.id,
                      topic: topic || "",
                    });
                    onClearAnswer(currentQuestion.id);
                  }}
                >
                  {t.practice.clear}
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none active:scale-95"
                  onClick={() => onCheckQuestion(currentQuestion.id)}
                >
                  {t.practice.check}
                </button>
              </>
            )}
          {!submitted && (
            <button
              type="button"
              className="bg-accent hover:bg-accent-hover focus-visible:ring-accent rounded-lg px-4 py-2 text-sm text-white transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
              onClick={onSubmit}
            >
              {t.practice.submit}
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
            track("practice_navigate", {
              subjectId: subject.id,
              topic: topic || "",
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
            {t.practice.next}
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

export default function PracticeTopic() {
  const { subjectId, topic } = useParams<{
    subjectId: string;
    topic: string;
  }>();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const langTo = useLangTo();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoadedFor, setQuestionsLoadedFor] = useState<string | null>(
    null,
  );
  const [megatopicLabel, setMegatopicLabel] = useState<string | undefined>();
  const topicInfo = useMemo(
    () => subject?.topics.find((tp) => tp.key === topic),
    [subject, topic],
  );
  useEffect(() => {
    if (subject && topic) {
      getQuestionsByTopic(subject.id, topic).then((topicQuestions) => {
        setQuestions(topicQuestions);
        setQuestionsLoadedFor(`${subject.id}/${topic}`);
      });
      getTopicMegaTopicLabel(subject.id, topic).then(setMegatopicLabel);
    }
  }, [subject, topic]);
  const questionsLoaded =
    !!subject && !!topic && questionsLoadedFor === `${subject.id}/${topic}`;
  const textQuestionCount = useMemo(
    () => questions.filter((q) => q.type === "text").length,
    [questions],
  );
  const seoMeta = useMemo(
    () =>
      subject && topicInfo
        ? buildTopicMeta(lang, subject, topicInfo, {
            topicQuestionCounts: { [topicInfo.key]: questions.length },
          })
        : undefined,
    [subject, topicInfo, lang, questions.length],
  );
  useDocumentTitle(seoMeta?.title ?? t.home.title);

  useSeoHead({
    title: seoMeta?.title ?? t.home.title,
    description: seoMeta?.description ?? t.seo.defaultDescription,
    pathWithoutLang: seoMeta?.pathWithoutLang ?? "/",
    ogImage: subject ? `/og/${subject.id}.png` : undefined,
    jsonLd: seoMeta?.jsonLd,
    enabled: !(subject && topicInfo) || questionsLoaded,
  });

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
  } = usePracticeSession(questions, subject?.id || "", topic || "");

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
  });

  const subjectReadyRef = useRef(false);
  useEffect(() => {
    subjectReadyRef.current = !!subject;
  }, [subject]);

  const navEventData = useCallback(
    () => ({ subjectId: subject?.id || "", topic: topic || "" }),
    [subject?.id, topic],
  );

  useKeyboardNav({
    enabledRef: subjectReadyRef,
    questionsLength: questions.length,
    currentIndexRef,
    setCurrentIndex,
    scrollToNav,
    setDirection,
    eventName: "practice_navigate",
    eventData: navEventData,
  });

  useEffect(() => {
    if (!subject || !topicInfo) {
      navigate(langTo("/"), { replace: true });
    }
  }, [subject, topicInfo, navigate, langTo]);

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
  }, [questions, setNavState]);

  useEffect(() => {
    if (questions.length === 0) return;
    const timer = setTimeout(() => {
      startPracticeTour(
        [
          {
            element: '[data-tour="practice-back"]',
            popover: {
              title: t.tour.practice.step1Title,
              description: t.tour.practice.step1Desc,
              side: "bottom",
            },
          },
          {
            element: '[data-tour="practice-nav"]',
            popover: {
              title: t.tour.practice.step2Title,
              description: t.tour.practice.step2Desc,
              side: "bottom",
            },
          },
          {
            element: '[data-tour="practice-card"]',
            popover: {
              title: t.tour.practice.step3Title,
              description: t.tour.practice.step3Desc,
              side: "top",
            },
          },
          {
            element: '[data-tour="practice-actions"]',
            popover: {
              title: t.tour.practice.step4Title,
              description: t.tour.practice.step4Desc,
              side: "top",
            },
          },
          {
            element: '[data-tour="practice-nav-btns"]',
            popover: {
              title: t.tour.practice.step5Title,
              description: t.tour.practice.step5Desc,
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
  }, [questions.length, t]);

  const totalPoints = roundPoints(questions.reduce((s, q) => s + q.points, 0));

  const handleClearAnswer = useCallback(
    (questionId: string) => {
      handleAnswer(questionId, "");
    },
    [handleAnswer],
  );

  if (questions.length === 0 || !subject) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-fg-muted">{t.practice.noQuestions}</p>
        <Link
          to={subject ? `/${subject.id}` : "/"}
          className="text-accent mt-4 inline-block hover:underline"
          onClick={() => {
            triggerLight();
            track("nav_click", { target: "home", from: "practice_empty" });
          }}
        >
          {t.practice.backToHome}
        </Link>
      </div>
    );
  }

  return (
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
      totalPoints={totalPoints}
      textQuestionCount={textQuestionCount}
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
    />
  );
}
