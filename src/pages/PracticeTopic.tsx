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
import { computeQuestionResults } from "../lib/grading";
import {
  ArrowSquareLeft2,
  ArrowSquareRight2,
  Trash5,
  Eye,
  Send,
  Trophy,
} from "reicon-react";

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
  arrowAnimateRef: React.MutableRefObject<(dir: "prev" | "next") => void>;
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
  arrowAnimateRef,
}: PracticePlayerProps) {
  const t = useT();
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [hoverClear, setHoverClear] = useState(false);
  const [hoverCheck, setHoverCheck] = useState(false);
  const [hoverSubmit, setHoverSubmit] = useState(false);
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

  const currentQuestion = questions[currentIndex];

  const examDate = useMemo(() => {
    if (currentQuestion?.exam === "both") return undefined;
    const exam = currentQuestion
      ? subject.exams.find((e) => e.year === currentQuestion.exam)
      : undefined;
    return exam?.date || exam?.title;
  }, [subject, currentQuestion]);

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
          q.type === "text" &&
          (checkedQuestions[q.id] || submitted) &&
          !selfGrades[q.id],
      ).length,
    [questions, checkedQuestions, selfGrades, submitted],
  );

  const allTextGraded =
    questions.filter((q) => q.type === "text").length === 0 ||
    pendingTextCount === 0;

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

  return (
    <div className="animate-fade-in animate-duration-fast mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6" data-tour="practice-back">
        <Link
          to={`/${subject.id}`}
          data-cuelume-hover
          data-cuelume-press
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
        <div
          className={`animate-fade-in-up mb-6 rounded-lg border p-4 ${
            submitted && allTextGraded
              ? "border-correct-border bg-correct-bg"
              : "border-pending-border bg-pending-bg"
          }`}
        >
          <p className="text-fg flex items-center gap-1.5 font-semibold">
            <Trophy
              size={18}
              weight={submitted ? "Filled" : "Outline"}
              aria-hidden="true"
              className="shrink-0"
            />
            {submitted ? t.practice.score : t.practice.runningScore}:{" "}
            {formatPoints(getScore())} {t.exam.outOf}{" "}
            {formatPoints(totalPoints)} {t.practice.points}
          </p>
          <p
            className={`mt-1 text-sm ${
              submitted && allTextGraded ? "text-correct-fg" : "text-pending-fg"
            }`}
          >
            {submitted && pendingTextCount > 0
              ? t.practice.selfGradeHint
              : submitted
                ? t.practice.allSelfGraded
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
        questionResults={questionResults}
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
        className="mt-6 flex items-center gap-2 sm:justify-between sm:gap-3"
        data-tour="practice-nav-btns"
      >
        <button
          type="button"
          ref={prevBtnRef}
          data-cuelume-press
          className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent order-1 flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 disabled:opacity-30 sm:py-2"
          onMouseEnter={() => setHoverPrev(true)}
          onMouseLeave={() => setHoverPrev(false)}
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
          <ArrowSquareLeft2
            size={18}
            weight={hoverPrev ? "Filled" : "Outline"}
            aria-hidden="true"
            className="shrink-0"
          />
          <span className="hidden sm:inline sm:min-w-0 sm:truncate">
            {t.practice.previous}
          </span>
        </button>
        <div
          className="order-2 flex min-w-0 flex-1 justify-center gap-2 sm:flex-none"
          data-tour="practice-actions"
        >
          {(answers[currentQuestion.id] || currentQuestion?.type === "text") &&
            !submitted &&
            !checkedQuestions[currentQuestion.id] && (
              <>
                {answers[currentQuestion.id] &&
                  answers[currentQuestion.id].trim() !== "" && (
                    <button
                      type="button"
                      className="border-border text-fg-muted hover:text-fg-secondary hover:bg-surface focus-visible:ring-accent flex min-w-0 items-center gap-1.5 rounded-lg border px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 sm:py-2"
                      onMouseEnter={() => setHoverClear(true)}
                      onMouseLeave={() => setHoverClear(false)}
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
                      <Trash5
                        size={18}
                        weight={hoverClear ? "Filled" : "Outline"}
                        aria-hidden="true"
                        className="shrink-0"
                      />
                      <span className="hidden sm:inline sm:min-w-0 sm:truncate">
                        {t.practice.clear}
                      </span>
                    </button>
                  )}
                <button
                  type="button"
                  data-cuelume-press
                  className="flex min-w-0 items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-3 text-sm text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none active:scale-95 sm:py-2"
                  onMouseEnter={() => setHoverCheck(true)}
                  onMouseLeave={() => setHoverCheck(false)}
                  onClick={() => onCheckQuestion(currentQuestion.id)}
                >
                  <Eye
                    size={18}
                    weight={hoverCheck ? "Filled" : "Outline"}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                  <span className="hidden sm:inline sm:min-w-0 sm:truncate">
                    {t.practice.check}
                  </span>
                </button>
              </>
            )}
          {!submitted && (
            <button
              type="button"
              data-cuelume-press
              className="bg-accent hover:bg-accent-hover focus-visible:ring-accent flex min-w-0 items-center gap-1.5 rounded-lg px-4 py-3 text-sm text-white transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 sm:py-2"
              onMouseEnter={() => setHoverSubmit(true)}
              onMouseLeave={() => setHoverSubmit(false)}
              onClick={onSubmit}
            >
              <Send
                size={18}
                weight={hoverSubmit ? "Filled" : "Outline"}
                aria-hidden="true"
                className="shrink-0"
              />
              <span className="hidden sm:inline sm:min-w-0 sm:truncate">
                {t.practice.submit}
              </span>
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
          <span className="hidden sm:inline sm:min-w-0 sm:truncate">
            {t.practice.next}
          </span>
          <ArrowSquareRight2
            size={18}
            weight={hoverNext ? "Filled" : "Outline"}
            aria-hidden="true"
            className="shrink-0"
          />
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
  const arrowAnimateRef = useRef<(dir: "prev" | "next") => void>(() => {});
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
    onKeyPress: (dir) => arrowAnimateRef.current(dir),
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
        {questionsLoaded && null}
        <p className="text-fg-muted">{t.practice.noQuestions}</p>
        <Link
          to={subject ? `/${subject.id}` : "/"}
          data-cuelume-hover
          data-cuelume-press
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
    <>
      {questionsLoaded && null}
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
        arrowAnimateRef={arrowAnimateRef}
      />
    </>
  );
}
