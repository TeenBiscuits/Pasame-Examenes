import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getSubject, getQuestionsByTopic } from "../subjects";
import type { Question } from "../data/types";
import { saveAttempt } from "../data/store";
import QuestionCard from "../components/QuestionCard";
import { useT } from "../i18n/hooks";

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
  const { subjectId, topic } = useParams<{ subjectId: string; topic: string }>();
  const navigate = useNavigate();
  const t = useT();

  const subject = subjectId ? getSubject(subjectId) : undefined;
  const questions = useMemo(
    () => (subject && topic) ? getQuestionsByTopic(subject.id, topic) : [],
    [subject, topic],
  );
  const topicInfo = useMemo(
    () => subject?.topics.find((tp) => tp.key === topic),
    [subject, topic],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selfGrades, setSelfGrades] = useState<Record<string, "correct" | "incorrect">>({});
  const [submitted, setSubmitted] = useState(false);
  const [attemptId, setAttemptId] = useState<string>("");

  useEffect(() => {
    if (!subject || !topicInfo) {
      navigate("/");
    }
  }, [subject, topicInfo, navigate]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(
    (questionId: string, answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    },
    [],
  );

  const handleSubmit = () => {
    if (!subject) return;
    const id = getNow().toString();
    setAttemptId(id);
    let score = 0;
    for (const q of questions) {
      score += gradeQuestion(q, answers[q.id] || "", selfGrades[q.id]);
    }
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

  const handleSelfGrade = (questionId: string, grade: "correct" | "incorrect") => {
    if (!subject) return;
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
          className="text-blue-600 hover:underline mt-4 inline-block"
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to={`/${subject.id}`}
          className="text-sm text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-md px-1"
        >
          {t.practice.backToTopics}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          {topicInfo?.icon} {topicInfo?.label || topic}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {questions.length} {t.subjectCard.questions} &middot; {totalPoints} {t.practice.pointsTotal}
        </p>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="font-semibold text-blue-900">
            {t.practice.score}: {getScore()} {t.exam.outOf} {totalPoints} {t.practice.points}
          </p>
          <p className="text-sm text-blue-700 mt-1">{t.practice.allCorrect}</p>
        </div>
      )}

      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {questions.map((q, i) => {
          const isAnswered = answers[q.id] && answers[q.id].trim() !== "";
          const isCurrent = i === currentIndex;
          let cls =
            "w-8 h-8 rounded-md text-xs font-mono flex items-center justify-center border shrink-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors cursor-pointer";
          if (isCurrent) cls += " bg-blue-600 text-white border-blue-600";
          else if (isAnswered)
            cls += " bg-green-50 border-green-300 text-green-700";
          else cls += " border-gray-200 text-gray-500 hover:border-gray-400";
          return (
            <button
              key={q.id}
              className={cls}
              onClick={() => setCurrentIndex(i)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <QuestionCard
        question={currentQuestion}
        index={currentIndex}
        total={questions.length}
        topicLabel={topicInfo?.label || topic || ""}
        onAnswer={handleAnswer}
        savedAnswer={answers[currentQuestion.id]}
        showResult={submitted}
        selfGrade={selfGrades[currentQuestion.id]}
        onSelfGrade={handleSelfGrade}
      />

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:opacity-30 transition-colors"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          {t.practice.previous}
        </button>
        <div className="flex gap-2">
          {answers[currentQuestion.id] && (
            <button
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors"
              onClick={() => handleAnswer(currentQuestion.id, "")}
            >
              {t.practice.clear}
            </button>
          )}
          {!submitted && (
            <button
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors"
              onClick={handleSubmit}
            >
              {t.practice.submit}
            </button>
          )}
        </div>
        <button
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:opacity-30 transition-colors"
          onClick={() =>
            setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
          }
          disabled={currentIndex === questions.length - 1}
        >
          {t.practice.next}
        </button>
      </div>
    </div>
  );
}
