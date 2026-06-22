import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubject, getQuestionsByExam } from "../subjects";
import type { Question, Exam } from "../data/types";
import { saveAttempt } from "../data/store";
import QuestionCard from "../components/QuestionCard";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight, triggerMedium } from "../lib/haptics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

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
  const [attemptId, setAttemptId] = useState<string>("");
  const timeUpTrackedRef = useRef(false);
  const [direction, setDirection] = useState<"next" | "prev" | undefined>();
  const navRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const currentIndexRef = useRef(currentIndex);
  const startedRef = useRef(started);

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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [questions.length]);

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

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const btn = container.children[currentIndex] as HTMLElement | undefined;
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
  }, [currentIndex]);

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
  }, [timeLeft, started, submitted]);

  const handleAnswer = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmit = () => {
    if (!subject || !year) return;

    if (!window.confirm(t.exam.submitConfirm)) return;

    triggerMedium();
    const elapsed = Math.floor((getNow() - startTimeRef.current) / 1000);
    const id = getNow().toString();
    setAttemptId(id);
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
        id: attemptId || getNow().toString(),
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

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (questions.length === 0 || !subject || !examInfo) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t.exam.noQuestions}</p>
        <Link
          to={subject ? `/${subject.id}` : "/"}
          className="text-primary hover:underline mt-4 inline-block"
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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {examInfo.title}
          </h1>
          <p className="text-muted-foreground mb-8">
            {subject.name} ({subject.courseCode})
          </p>
        </div>
        <Card>
          <CardContent className="pt-(--card-spacing) flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t.exam.questions}</span>
                <p className="font-semibold">{questions.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t.exam.totalPoints}
                </span>
                <p className="font-semibold">{totalPoints}p</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t.exam.pass}</span>
                <p className="font-semibold">{examInfo.passPoints}p</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t.exam.timeLimit}</span>
                <p className="font-semibold">
                  {examInfo.durationMinutes} {t.exam.minutes}
                </p>
              </div>
            </div>
            <Alert variant="default">
              <AlertDescription>{t.exam.simulationNote}</AlertDescription>
            </Alert>
            <Button size="lg" className="w-full" onClick={handleStart}>
              {t.exam.startExam}
            </Button>
          </CardContent>
        </Card>
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
      <div className="flex items-center justify-between mb-6 sticky top-14 bg-background py-3 -mx-4 px-4 z-40 border-b border-border">
        <div>
          <span className="text-lg font-bold text-foreground">
            {examInfo.title}
          </span>
          <span className="text-sm text-muted-foreground ml-3">
            {totalPoints}p {t.exam.total}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {!submitted && (
            <span
              className={cn(
                "font-mono text-sm font-bold",
                timeLeft < 600
                  ? "text-destructive animate-pulse"
                  : "text-foreground",
              )}
            >
              {formatTime(timeLeft)}
            </span>
          )}
          {submitted && (
            <Badge
              variant={
                score >= examInfo.passPoints ? "default" : "destructive"
              }
              className="text-sm px-3 py-1 animate-fade-in"
            >
              {score}/{totalPoints}p{" "}
              {score >= examInfo.passPoints ? t.exam.pass_ : t.exam.fail}
            </Badge>
          )}
        </div>
      </div>

      {submitted && (
        <Alert className="mb-6 animate-fade-in-up">
          <AlertTitle>
            {t.exam.submitted} {t.exam.score}: {score}/{totalPoints}
            {" "}({Math.round((score / totalPoints) * 100)}%)
          </AlertTitle>
          <AlertDescription>
            {t.exam.passThreshold}: {examInfo.passPoints}p. {t.exam.reviewNote}
          </AlertDescription>
        </Alert>
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
          return (
            <button
              key={q.id}
              className={cn(
                "size-8 rounded-md text-xs font-mono flex items-center justify-center border shrink-0 active:scale-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none transition cursor-pointer",
                isCurrent && "bg-primary text-primary-foreground border-primary",
                !isCurrent && isAnswered &&
                  "bg-primary/5 border-primary/20 text-primary",
                !isCurrent && !isAnswered &&
                  "border-border text-muted-foreground hover:border-ring/50",
              )}
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
        examDate={examInfo?.date}
        subjectId={subject.id}
        onAnswer={handleAnswer}
        savedAnswer={answers[currentQuestion.id]}
        showResult={submitted}
        selfGrade={selfGrades[currentQuestion.id]}
        onSelfGrade={handleSelfGrade}
        direction={direction}
      />

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
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
          }}
          disabled={currentIndex === 0}
        >
          {t.exam.previous}
        </Button>
        <div className="flex gap-2">
          {!submitted && (
            <Button variant="destructive" onClick={handleSubmit}>
              {t.exam.submitExam}
            </Button>
          )}
        </div>
        <Button
          variant="outline"
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
          }}
          disabled={currentIndex === questions.length - 1}
        >
          {t.exam.next}
        </Button>
      </div>
    </div>
  );
}
