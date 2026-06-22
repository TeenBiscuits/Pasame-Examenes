import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSubject,
  getQuestionsByTopic,
  getTopicMegaTopicLabel,
} from "../subjects";
import type { Question } from "../data/types";
import { saveAttempt } from "../data/store";
import QuestionCard from "../components/QuestionCard";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight, triggerMedium } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";

const getNow = () => Date.now();

function gradeQuestion(
  question: Question,
  answer: string,
  selfGrade?: "correct" | "incorrect",
): number {
  if (!answer || answer.trim() === "") return 0;
  if (question.type === "mc") {
    return answer === question.correctAnswer ? question.points : 0;
  }
  if (question.type === "matching") {
    try {
      const user = JSON.parse(answer) as Record<string, string>;
      const correct = question.correctAnswer as Record<string, string>;
      const items = Object.keys(correct);
      let correctCount = 0;
      for (const item of items) {
        if (user[item] === correct[item]) correctCount++;
      }
      return Math.round((correctCount / items.length) * question.points);
    } catch {
      return 0;
    }
  }
  if (question.type === "text" || question.type === "calculation") {
    return selfGrade === "correct" ? question.points : 0;
  }
  return 0;
}

export default function PracticeTopic() {
  const { subjectId, topic } = useParams<{
    subjectId: string;
    topic: string;
  }>();
  const navigate = useNavigate();
  const t = useT();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const questions = useMemo(
    () => (subject && topic ? getQuestionsByTopic(subject.id, topic) : []),
    [subject, topic],
  );
  const topicInfo = useMemo(
    () => subject?.topics.find((tp) => tp.key === topic),
    [subject, topic],
  );
  const megatopicLabel = useMemo(
    () =>
      subject && topic ? getTopicMegaTopicLabel(subject.id, topic) : undefined,
    [subject, topic],
  );
  const textQuestionCount = useMemo(
    () =>
      questions.filter((q) => q.type === "text" || q.type === "calculation")
        .length,
    [questions],
  );
  useDocumentTitle(
    subject && topicInfo
      ? `${topicInfo.label} \u2014 ${subject.name} \u2014 ${t.home.title}`
      : subject
        ? `${t.home.title} \u2014 ${subject.name}`
        : t.home.title,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selfGrades, setSelfGrades] = useState<
    Record<string, "correct" | "incorrect">
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<
    Record<string, boolean>
  >({});
  const attemptIdRef = useRef<string>("");
  const [direction, setDirection] = useState<"next" | "prev" | undefined>();
  const navRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      const idx = currentIndexRef.current;
      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        const nextIndex = idx - 1;
        triggerLight();
        setDirection("prev");
        track("practice_navigate", {
          direction: "prev",
          fromIndex: idx,
          toIndex: nextIndex,
        });
        setCurrentIndex(nextIndex);
        scrollToNav(nextIndex);
      } else if (e.key === "ArrowRight" && idx < questions.length - 1) {
        e.preventDefault();
        const nextIndex = idx + 1;
        triggerLight();
        setDirection("next");
        track("practice_navigate", {
          direction: "next",
          fromIndex: idx,
          toIndex: nextIndex,
        });
        setCurrentIndex(nextIndex);
        scrollToNav(nextIndex);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [questions.length, scrollToNav]);

  useEffect(() => {
    if (!subject || !topicInfo) {
      navigate("/");
    }
  }, [subject, topicInfo, navigate]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const check = () => {
      setShowLeftFade(el.scrollLeft > 4);
      setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [questions]);

  const currentQuestion = questions[currentIndex];

  const examDate = useMemo(() => {
    if (!subject || currentQuestion.exam === "both") return undefined;
    return subject.exams.find((e) => e.year === currentQuestion.exam)?.date;
  }, [subject, currentQuestion.exam]);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmit = () => {
    if (!subject) return;
    triggerMedium();
    const id = getNow().toString();
    attemptIdRef.current = id;
    let score = 0;
    for (const q of questions) {
      score += gradeQuestion(q, answers[q.id] || "", selfGrades[q.id]);
    }
    const answeredCount = Object.values(answers).filter(
      (a) => a && a.trim() !== "",
    ).length;
    track("practice_submit", {
      subjectId: subject.id,
      topic: topic || "",
      score,
      maxScore: questions.reduce((s, q) => s + q.points, 0),
      questionsCount: questions.length,
      answered: answeredCount,
    });
    saveAttempt(subject.id, {
      id,
      exam: "practice",
      mode: "practice",
      topic: topic,
      date: new Date().toISOString(),
      score,
      maxScore: questions.reduce((s, q) => s + q.points, 0),
      answers,
    });
    setSubmitted(true);
  };

  const handleSelfGrade = (
    questionId: string,
    grade: "correct" | "incorrect",
  ) => {
    if (!subject) return;
    track("practice_self_grade", {
      subjectId: subject.id,
      topic: topic || "",
      questionId,
      grade,
    });
    setSelfGrades((prev) => {
      const next = { ...prev, [questionId]: grade };
      let score = 0;
      for (const q of questions) {
        score += gradeQuestion(q, answers[q.id] || "", next[q.id]);
      }
      saveAttempt(subject.id, {
        id: attemptIdRef.current || getNow().toString(),
        exam: "practice",
        mode: "practice",
        topic: topic,
        date: new Date().toISOString(),
        score,
        maxScore: questions.reduce((s, q) => s + q.points, 0),
        answers,
      });
      return next;
    });
  };

  if (questions.length === 0 || !subject) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-fg-muted">{t.practice.noQuestions}</p>
        <Link
          to={subject ? `/${subject.id}` : "/"}
          className="text-accent hover:underline mt-4 inline-block"
          onClick={() => triggerLight()}
        >
          {t.practice.backToHome}
        </Link>
      </div>
    );
  }

  const totalPoints = questions.reduce((s, q) => s + q.points, 0);

  const getScore = () => {
    let score = 0;
    for (const q of questions) {
      score += gradeQuestion(q, answers[q.id] || "", selfGrades[q.id]);
    }
    return score;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in animate-duration-fast">
      <div className="mb-6">
        <Link
          to={`/${subject.id}`}
          className="text-sm text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-md px-1"
        >
          {t.practice.backToTopics}
        </Link>
        <h1 className="text-2xl font-bold text-fg mt-2">
          {topicInfo?.icon} {topicInfo?.label || topic}
        </h1>
        <p className="text-sm text-fg-muted mt-1">
          {questions.length} {t.subjectCard.questions} &middot; {totalPoints}{" "}
          {t.practice.pointsTotal}
        </p>
      </div>

      {(submitted || Object.keys(checkedQuestions).length > 0) && (
        <div className="mb-6 p-4 rounded-lg bg-accent-light border border-accent-border animate-fade-in-up">
          <p className="font-semibold text-fg">
            {submitted ? t.practice.score : t.practice.runningScore}:{" "}
            {getScore()} {t.exam.outOf} {totalPoints} {t.practice.points}
          </p>
          <p className="text-sm text-accent-fg mt-1">
            {submitted
              ? textQuestionCount > 0
                ? `${Object.values(selfGrades).filter(Boolean).length} ${t.exam.outOf} ${textQuestionCount} ${t.practice.openEnded}`
                : t.practice.allCorrect
              : `${Object.keys(checkedQuestions).length} ${t.exam.outOf} ${questions.length} ${t.practice.checked}`}
          </p>
        </div>
      )}

      <div
        ref={navRef}
        className="flex gap-1 mb-6 overflow-x-auto pb-6"
        style={{
          maskImage:
            showLeftFade && showRightFade
              ? "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)"
              : showLeftFade
                ? "linear-gradient(to right, transparent 0%, black 8%, black 100%)"
                : showRightFade
                  ? "linear-gradient(to right, black 0%, black 92%, transparent 100%)"
                  : undefined,
        }}
      >
        {questions.map((q, i) => {
          const isAnswered = answers[q.id] && answers[q.id].trim() !== "";
          const isChecked = !!checkedQuestions[q.id];
          const isCurrent = i === currentIndex;
          let cls =
            "w-8 h-8 rounded-md text-xs font-mono flex items-center justify-center border shrink-0 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition cursor-pointer";
          if (isCurrent) cls += " bg-accent text-white border-accent";
          else if (isChecked)
            cls += " bg-blue-50 border-blue-300 text-blue-700";
          else if (isAnswered)
            cls += " bg-accent-light border-accent-border text-accent-fg";
          else cls += " border-border text-fg-muted hover:border-fg-muted";
          return (
            <button
              type="button"
              key={q.id}
              className={cls}
              onClick={() => {
                triggerLight();
                setDirection(
                  i > currentIndex
                    ? "next"
                    : i < currentIndex
                      ? "prev"
                      : undefined,
                );
                setCurrentIndex(i);
                scrollToNav(i);
              }}
            >
              {isChecked && !isCurrent ? "\u2713" : i + 1}
            </button>
          );
        })}
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        index={currentIndex}
        total={questions.length}
        topicLabel={topicInfo?.label || topic || ""}
        megatopicLabel={megatopicLabel}
        examDate={examDate}
        subjectId={subject.id}
        onAnswer={handleAnswer}
        savedAnswer={answers[currentQuestion.id]}
        showResult={submitted || !!checkedQuestions[currentQuestion.id]}
        selfGrade={selfGrades[currentQuestion.id]}
        onSelfGrade={handleSelfGrade}
        direction={direction}
      />

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mt-6 sm:justify-between">
        <button
          type="button"
          className="order-1 px-4 py-2 text-sm rounded-lg border border-border text-fg-secondary hover:bg-surface active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-30 transition"
          onClick={() => {
            triggerLight();
            const nextIndex = Math.max(0, currentIndex - 1);
            setDirection("prev");
            track("practice_navigate", {
              direction: "prev",
              fromIndex: currentIndex,
              toIndex: nextIndex,
            });
            setCurrentIndex(nextIndex);
            scrollToNav(nextIndex);
          }}
          disabled={currentIndex === 0}
        >
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
              <path d="M14 8l-4 4 4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.practice.previous}
          </span>
        </button>
        <div className="flex justify-center gap-2 order-3 sm:order-2 w-full sm:w-auto">
          {answers[currentQuestion.id] &&
            !submitted &&
            !checkedQuestions[currentQuestion.id] && (
              <>
                <button
                  type="button"
                  className="px-4 py-2 text-sm rounded-lg border border-border text-fg-muted hover:text-fg-secondary hover:bg-surface active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition"
                  onClick={() => {
                    triggerLight();
                    track("practice_clear_answer", {
                      questionId: currentQuestion.id,
                    });
                    handleAnswer(currentQuestion.id, "");
                  }}
                >
                  {t.practice.clear}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition"
                  onClick={() => {
                    triggerMedium();
                    track("practice_check_question", {
                      questionId: currentQuestion.id,
                    });
                    setCheckedQuestions((prev) => ({
                      ...prev,
                      [currentQuestion.id]: true,
                    }));
                  }}
                >
                  {t.practice.check}
                </button>
              </>
            )}
          {!submitted && (
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-lg bg-accent text-white hover:bg-accent-hover active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition"
              onClick={handleSubmit}
            >
              {t.practice.submit}
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
            track("practice_navigate", {
              direction: "next",
              fromIndex: currentIndex,
              toIndex: nextIndex,
            });
            setCurrentIndex(nextIndex);
            scrollToNav(nextIndex);
          }}
          disabled={currentIndex === questions.length - 1}
        >
          <span className="flex items-center gap-1.5">
            {t.practice.next}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
              <path d="M10 8l4 4-4 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
