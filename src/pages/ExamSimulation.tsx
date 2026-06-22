import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSubject,
  getQuestionsByExam,
  getTopicMegaTopicLabel,
} from "../subjects";
import type { Question, Exam } from "../data/types";
import { saveAttempt } from "../data/store";
import QuestionCard from "../components/QuestionCard";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight, triggerMedium } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";

const getNow = () => Date.now();

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

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

export default function ExamSimulation() {
  const { subjectId, year } = useParams<{ subjectId: string; year: string }>();
  const navigate = useNavigate();
  const t = useT();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const questions = useMemo(
    () => (subject && year ? getQuestionsByExam(subject.id, year) : []),
    [subject, year],
  );
  const examInfo = useMemo(
    () => subject?.exams.find((e: Exam) => e.year === year),
    [subject, year],
  );
  useDocumentTitle(
    examInfo && subject
      ? `${examInfo.title} \u2014 ${subject.name} \u2014 ${t.home.title}`
      : subject
        ? `${subject.name} \u2014 ${t.home.title}`
        : t.home.title,
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selfGrades, setSelfGrades] = useState<
    Record<string, "correct" | "incorrect">
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    (examInfo?.durationMinutes || 120) * 60,
  );
  const [started, setStarted] = useState(false);
  const startTimeRef = useRef<number>(0);
  const attemptIdRef = useRef<string>("");
  const timeUpTrackedRef = useRef(false);
  const [direction, setDirection] = useState<"next" | "prev" | undefined>();
  const navRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!startedRef.current) return;
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      const idx = currentIndexRef.current;
      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        const nextIndex = idx - 1;
        triggerLight();
        setDirection("prev");
        track("exam_navigate", {
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
        track("exam_navigate", {
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
    if (!subject || !examInfo) {
      navigate("/");
    }
  }, [subject, examInfo, navigate]);

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
  }, [questions, started]);

  const totalPoints = questions.reduce((s, q) => s + q.points, 0);

  useEffect(() => {
    if (!started || submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted]);

  useEffect(() => {
    if (timeLeft === 0 && started && !submitted && !timeUpTrackedRef.current) {
      timeUpTrackedRef.current = true;
      track("exam_time_up", {
        subjectId: subject?.id || "",
        year: year || "",
        questionsCount: questions.length,
      });
    }
  }, [timeLeft, started, submitted, subject?.id, year, questions.length]);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmit = () => {
    if (!subject || !year) return;

    if (!window.confirm(t.exam.submitConfirm)) return;

    triggerMedium();
    const elapsed = Math.floor((getNow() - startTimeRef.current) / 1000);
    const id = getNow().toString();
    attemptIdRef.current = id;
    let score = 0;
    for (const q of questions) {
      score += gradeQuestion(q, answers[q.id] || "", selfGrades[q.id]);
    }
    const answeredCount = Object.values(answers).filter(
      (a) => a && a.trim() !== "",
    ).length;
    track("exam_submit", {
      subjectId: subject.id,
      year: year || "",
      score,
      maxScore: totalPoints,
      timeSpent: elapsed,
      questionsCount: questions.length,
      answered: answeredCount,
    });
    saveAttempt(subject.id, {
      id,
      exam: year,
      mode: "exam",
      date: new Date().toISOString(),
      score,
      maxScore: totalPoints,
      answers,
      timeSpent: elapsed,
    });
    setSubmitted(true);
  };

  const handleSelfGrade = (
    questionId: string,
    grade: "correct" | "incorrect",
  ) => {
    if (!subject || !year) return;
    track("exam_self_grade", {
      subjectId: subject.id,
      year: year || "",
      questionId,
      grade,
    });
    setSelfGrades((prev) => {
      const next = { ...prev, [questionId]: grade };
      const elapsed = Math.floor((getNow() - startTimeRef.current) / 1000);
      let score = 0;
      for (const q of questions) {
        score += gradeQuestion(q, answers[q.id] || "", next[q.id]);
      }
      saveAttempt(subject.id, {
        id: attemptIdRef.current || getNow().toString(),
        exam: year,
        mode: "exam",
        date: new Date().toISOString(),
        score,
        maxScore: totalPoints,
        answers,
        timeSpent: elapsed,
      });
      return next;
    });
  };

  const handleStart = () => {
    triggerMedium();
    track("exam_start", {
      subjectId: subject?.id || "",
      year: year || "",
      questionsCount: questions.length,
      totalPoints,
    });
    setStarted(true);
    startTimeRef.current = getNow();
  };

  if (questions.length === 0 || !subject || !examInfo) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-fg-muted">{t.exam.noQuestions}</p>
        <Link
          to={subject ? `/${subject.id}` : "/"}
          className="text-accent hover:underline mt-4 inline-block"
          onClick={() => triggerLight()}
        >
          {t.exam.backToHome}
        </Link>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in animate-duration-fast">
        <div className="mb-6">
          <Link
            to={`/${subject.id}`}
            className="text-sm text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-md px-1"
          >
            {t.exam.backToSubject}
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-fg mb-2">{examInfo.title}</h1>
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
              <p className="font-semibold">{totalPoints}p</p>
            </div>
            <div>
              <span className="text-fg-muted">{t.exam.pass}</span>
              <p className="font-semibold">{examInfo.passPoints}p</p>
            </div>
            <div>
              <span className="text-fg-muted">{t.exam.timeLimit}</span>
              <p className="font-semibold">
                {examInfo.durationMinutes} {t.exam.minutes}
              </p>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            {t.exam.simulationNote}
          </div>
          <button
            type="button"
            className="w-full py-3 bg-accent text-white rounded-lg hover:bg-accent-hover active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition font-medium animate-pulse"
            onClick={handleStart}
          >
            {t.exam.startExam}
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentTopic = subject.topics.find(
    (tp) => tp.key === currentQuestion.topic,
  );

  const getScore = () => {
    let score = 0;
    for (const q of questions) {
      score += gradeQuestion(q, answers[q.id] || "", selfGrades[q.id]);
    }
    return score;
  };

  const score = getScore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in animate-duration-fast">
      <div className="mb-6">
        <Link
          to={`/${subject.id}`}
          onClick={(e) => {
            if (!submitted && !window.confirm(t.exam.exitConfirm)) {
              e.preventDefault();
            }
          }}
          className="text-sm text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-md px-1"
        >
          {t.exam.backToSubject}
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6 sticky top-14 bg-surface py-3 -mx-4 px-4 z-40 border-b border-border">
        <div>
          <span className="text-lg font-bold text-fg">{examInfo.title}</span>
          <span className="text-sm text-fg-muted ml-3">
            {totalPoints}p {t.exam.total}
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
              {score}/{totalPoints}p{" "}
              {score >= examInfo.passPoints ? t.exam.pass_ : t.exam.fail}
            </span>
          )}
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-lg bg-accent-light border border-accent-border text-sm animate-fade-in-up">
          <p className="font-semibold text-fg mb-1">
            {t.exam.submitted} {t.exam.score}: {score}
            {t.exam.outOf}
            {totalPoints} ({Math.round((score / totalPoints) * 100)}%)
          </p>
          <p className="text-accent-fg">
            {t.exam.passThreshold}: {examInfo.passPoints}p. {t.exam.reviewNote}
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
          const isCurrent = i === currentIndex;
          let cls =
            "w-8 h-8 rounded-md text-xs font-mono flex items-center justify-center border shrink-0 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition cursor-pointer";
          if (isCurrent) cls += " bg-accent text-white border-accent";
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
              {i + 1}
            </button>
          );
        })}
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        index={currentIndex}
        total={questions.length}
        topicLabel={currentTopic?.label || currentQuestion.topic}
        megatopicLabel={getTopicMegaTopicLabel(
          subject.id,
          currentQuestion.topic,
        )}
        examDate={examInfo?.date}
        subjectId={subject.id}
        onAnswer={handleAnswer}
        savedAnswer={answers[currentQuestion.id]}
        showResult={submitted}
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
            track("exam_navigate", {
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
            {t.exam.previous}
          </span>
        </button>
        <div className="flex justify-center gap-2 order-3 sm:order-2 w-full sm:w-auto">
          {!submitted && (
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none transition font-medium"
              onClick={handleSubmit}
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
            {t.exam.next}
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
