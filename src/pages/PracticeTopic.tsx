import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubject, getQuestionsByTopic } from "../subjects";
import type { Question } from "../data/types";
import { saveAttempt } from "../data/store";
import QuestionCard from "../components/QuestionCard";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { useHaptics } from "../lib/haptics";

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
  const { triggerLight, triggerMedium } = useHaptics();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const questions = useMemo(
    () => (subject && topic ? getQuestionsByTopic(subject.id, topic) : []),
    [subject, topic],
  );
  const topicInfo = useMemo(
    () => subject?.topics.find((tp) => tp.key === topic),
    [subject, topic],
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
  const [attemptId, setAttemptId] = useState<string>("");
  const [direction, setDirection] = useState<"next" | "prev" | undefined>();
  const navRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

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

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const btn = container.children[currentIndex] as HTMLElement | undefined;
    if (!btn) return;
    requestAnimationFrame(() => {
      const cr = container.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      const step = 108;
      if (br.right > cr.right - 84) container.scrollBy({ left: step, behavior: "smooth" });
      else if (br.left < cr.left + 84) container.scrollBy({ left: -step, behavior: "smooth" });
    });
  }, [currentIndex]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmit = () => {
    if (!subject) return;
    triggerMedium();
    const id = getNow().toString();
    setAttemptId(id);
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
        id: attemptId || getNow().toString(),
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
        <p className="text-gray-500">{t.practice.noQuestions}</p>
        <Link
          to={subject ? `/${subject.id}` : "/"}
          className="text-green-600 hover:underline mt-4 inline-block"
          onClick={() => triggerLight()}
        >
          {t.practice.backToHome}
        </Link>
      </div>
    );
  }

  const totalPoints = questions.reduce((s, q) => s + q.points, 0);

  const textQuestionCount = useMemo(
    () =>
      questions.filter((q) => q.type === "text" || q.type === "calculation")
        .length,
    [questions],
  );

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
          className="text-sm text-green-600 hover:underline focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none rounded-md px-1"
        >
          {t.practice.backToTopics}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {topicInfo?.icon} {topicInfo?.label || topic}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {questions.length} {t.subjectCard.questions} &middot; {totalPoints}{" "}
          {t.practice.pointsTotal}
        </p>
      </div>

      {(submitted || Object.keys(checkedQuestions).length > 0) && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 animate-fade-in-up">
          <p className="font-semibold text-green-900">
            {submitted ? t.practice.score : t.practice.runningScore}:{" "}
            {getScore()} {t.exam.outOf} {totalPoints} {t.practice.points}
          </p>
          <p className="text-sm text-green-700 mt-1">
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
            "w-8 h-8 rounded-md text-xs font-mono flex items-center justify-center border shrink-0 active:scale-90 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition cursor-pointer";
          if (isCurrent) cls += " bg-green-600 text-white border-green-600";
          else if (isChecked)
            cls += " bg-blue-50 border-blue-300 text-blue-700";
          else if (isAnswered)
            cls += " bg-green-50 border-green-300 text-green-700";
          else cls += " border-gray-200 text-gray-500 hover:border-gray-400";
          return (
            <button
              key={q.id}
              className={cls}
              onClick={() => {
                triggerLight();
                setDirection(i > currentIndex ? "next" : i < currentIndex ? "prev" : undefined);
                setCurrentIndex(i);
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
        subjectId={subject.id}
        onAnswer={handleAnswer}
        savedAnswer={answers[currentQuestion.id]}
        showResult={submitted || !!checkedQuestions[currentQuestion.id]}
        selfGrade={selfGrades[currentQuestion.id]}
        onSelfGrade={handleSelfGrade}
        direction={direction}
      />

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none disabled:opacity-30 transition"
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
          }}
          disabled={currentIndex === 0}
        >
          {t.practice.previous}
        </button>
        <div className="flex gap-2">
          {answers[currentQuestion.id] &&
            !submitted &&
            !checkedQuestions[currentQuestion.id] && (
              <>
                <button
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition"
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
              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition"
              onClick={handleSubmit}
            >
              {t.practice.submit}
            </button>
          )}
        </div>
        <button
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none disabled:opacity-30 transition"
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
          }}
          disabled={currentIndex === questions.length - 1}
        >
          {t.practice.next}
        </button>
      </div>
    </div>
  );
}
