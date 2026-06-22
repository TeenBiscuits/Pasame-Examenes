import { useState } from "react";
import type { Question, QuestionType } from "../data/types";
import { useT } from "../i18n/hooks";
import { Markdown, InlineMarkdown } from "../lib/markdown";
import { track } from "../lib/umami";
import {
  triggerLight,
  triggerSuccess,
  triggerError,
  triggerSelection,
} from "../lib/haptics";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  topicLabel: string;
  megatopicLabel?: string;
  examDate?: string;
  subjectId: string;
  onAnswer: (questionId: string, answer: string) => void;
  savedAnswer?: string;
  showResult?: boolean;
  selfGrade?: "correct" | "incorrect";
  onSelfGrade?: (questionId: string, grade: "correct" | "incorrect") => void;
  direction?: "next" | "prev";
}

function getQuestionTypeLabel(type: QuestionType): string {
  const map: Record<QuestionType, string> = {
    mc: "Multiple Choice (mc)",
    text: "Open Text (text)",
    calculation: "Calculation (calculation)",
    matching: "Matching (matching)",
  };
  return map[type];
}

function buildReportUrl(question: Question, subjectId: string): string {
  const base = "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new";
  const params = new URLSearchParams();
  params.set("template", "report-question.yml");
  params.set("title", `[Corregir Pregunta] ${question.id}`);
  params.set("subject", subjectId);
  params.set("question-id", question.id);
  params.set("question-type", getQuestionTypeLabel(question.type));
  return `${base}?${params.toString()}`;
}

function MCQuestion({
  question,
  onAnswer,
  savedAnswer,
  showResult,
}: QuestionCardProps) {
  if (!question.options) return null;

  return (
    <div className="space-y-2">
      {question.options.map((opt, i) => {
        const letter = String.fromCharCode(97 + i);
        const isSelected = savedAnswer === letter;
        const isCorrect = question.correctAnswer === letter;
        let className =
          "w-full p-3 rounded-lg border-2 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition duration-150 text-left text-sm flex items-start gap-3";
        if (showResult && isCorrect) {
          className += " bg-green-50 border-green-400";
        } else if (showResult && isSelected && !isCorrect) {
          className += " bg-red-50 border-red-400";
        } else if (isSelected) {
          className += " bg-green-50 border-green-400";
        } else {
          className += " border-gray-200 hover:border-gray-300 bg-white";
        }

        return (
          <button
            key={i}
            className={className}
            onClick={() => {
              if (showResult) return;
              triggerSelection();
              track("question_answer", {
                questionId: question.id,
                type: "mc",
                answer: letter,
              });
              onAnswer(question.id, letter);
            }}
            disabled={!!showResult}
          >
            <span
              className={`font-mono font-bold text-xs w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? "animate-pop" : ""}`}
            >
              {letter}
            </span>
            <span className="flex-1">
              <InlineMarkdown>{opt}</InlineMarkdown>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TextQuestion({
  question,
  onAnswer,
  savedAnswer,
  showResult,
  selfGrade,
  onSelfGrade,
}: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useT();

  return (
    <div>
      <label htmlFor={`answer-${question.id}`} className="sr-only">
        Your answer
      </label>
      <textarea
        id={`answer-${question.id}`}
        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-green-400 focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:outline-none resize-y min-h-[120px] text-sm"
        placeholder="Type your answer…"
        autoComplete="off"
        spellCheck={false}
        value={savedAnswer || ""}
        onChange={(e) => onAnswer(question.id, e.target.value)}
        disabled={!!showResult}
      />
      {showResult && (
        <div className="mt-3 space-y-3">
          <button
            type="button"
            className="text-sm text-green-600 hover:text-green-700 font-medium active:scale-95 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none rounded-md px-1.5 py-0.5 border border-transparent hover:border-green-200 transition"
            onClick={() => {
              triggerLight();
              const next = !isOpen;
              track(next ? "solution_toggle" : "solution_toggle", {
                questionId: question.id,
                action: next ? "open" : "close",
              });
              setIsOpen(next);
            }}
          >
            {isOpen
              ? t.questionCard.closeSolution
              : t.questionCard.openSolution}
          </button>

          {isOpen && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {t.questionCard.modelSolution}
              </h4>
              <Markdown className="text-xs whitespace-pre-wrap font-sans text-gray-700">
                {typeof question.correctAnswer === "string"
                  ? question.correctAnswer
                  : JSON.stringify(question.correctAnswer, null, 2)}
              </Markdown>
              <Markdown className="text-xs text-gray-500 italic">
                {question.explanation}
              </Markdown>

              {onSelfGrade && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    {t.questionCard.gradeAnswer}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerSuccess();
                        track("self_grade", {
                          questionId: question.id,
                          grade: "correct",
                        });
                        onSelfGrade(question.id, "correct");
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border-2 active:scale-95 transition focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none ${
                        selfGrade === "correct"
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-green-50/50 hover:border-green-300"
                      }`}
                    >
                      {t.questionCard.correct}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerError();
                        track("self_grade", {
                          questionId: question.id,
                          grade: "incorrect",
                        });
                        onSelfGrade(question.id, "incorrect");
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border-2 active:scale-95 transition focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none ${
                        selfGrade === "incorrect"
                          ? "bg-red-50 border-red-500 text-red-700"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-red-50/50 hover:border-red-300"
                      }`}
                    >
                      {t.questionCard.incorrect}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MatchingQuestion({
  question,
  onAnswer,
  savedAnswer,
  showResult,
}: QuestionCardProps) {
  const correctAnswer = question.correctAnswer as Record<string, string>;
  const items = Object.keys(correctAnswer);
  const letters = [...new Set(Object.values(correctAnswer))].sort(
    (a, b) => {
      if (a === "V" && b === "F") return -1;
      if (a === "F" && b === "V") return 1;
      return a.localeCompare(b);
    },
  );
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    if (savedAnswer) {
      try {
        return JSON.parse(savedAnswer);
      } catch {
        return {};
      }
    }
    return {};
  });

  const handleSelect = (item: string, letter: string) => {
    if (showResult) return;
    const next = { ...selected, [item]: letter };
    setSelected(next);
    onAnswer(question.id, JSON.stringify(next));
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const userAnswer = selected[item];

        return (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-6 text-center font-mono text-xs text-gray-400">
              {i + 1}.
            </span>
            <span className="flex-1 text-gray-700">
              <InlineMarkdown>{item}</InlineMarkdown>
            </span>
            <div className="flex gap-1">
              {letters.map((letter) => {
                const chosen = userAnswer === letter;
                const real = correctAnswer[item] === letter;
                let cls =
                  "w-8 h-8 rounded-md border-2 text-xs font-bold font-mono active:scale-90 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition flex items-center justify-center";
                if (showResult && real) {
                  cls += " bg-green-50 border-green-400 text-green-700";
                } else if (showResult && chosen && !real) {
                  cls += " bg-red-50 border-red-400 text-red-700";
                } else if (chosen) {
                  cls += " bg-green-50 border-green-400 text-green-700";
                } else {
                  cls +=
                    " border-gray-200 text-gray-500 hover:border-gray-400 bg-white";
                }
                return (
                  <button
                    key={letter}
                    className={cls}
                    onClick={() => {
                      triggerSelection();
                      track("question_answer", {
                        questionId: question.id,
                        type: "matching",
                        item,
                        answer: letter,
                      });
                      handleSelect(item, letter);
                    }}
                    disabled={!!showResult}
                    aria-label={`Match ${item} to ${letter}`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function QuestionCard(props: QuestionCardProps) {
  const { question } = props;
  const t = useT();

  const slideClass =
    props.direction === "next"
      ? "animate-slide-in-right animate-duration-fast"
      : props.direction === "prev"
        ? "animate-slide-in-left animate-duration-fast"
        : "animate-fade-in animate-duration-fast";

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm ${slideClass}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          Q{props.index + 1}/{props.total}
        </span>
        <span className="text-xs font-mono bg-green-50 text-green-700 px-2 py-0.5 rounded">
          {question.points}p
        </span>
        <span className="text-xs text-gray-400">
          {props.megatopicLabel
            ? `${props.megatopicLabel} › ${props.topicLabel}`
            : props.topicLabel}
        </span>
        {props.examDate && (
          <span className="text-xs text-gray-400 ml-auto">
            {props.examDate}
          </span>
        )}
        {question.repeated && (
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 ml-auto">
            {t.questionCard.repeated}
          </span>
        )}
      </div>
      <Markdown className="text-sm text-gray-900 font-medium mb-4">
        {question.question}
      </Markdown>
      {question.subquestions && (
        <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
          {question.subquestions.map((sq, i) => (
            <li key={i}>
              <InlineMarkdown>{sq}</InlineMarkdown>
            </li>
          ))}
        </ul>
      )}
      {question.image && (
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 max-w-full flex justify-center bg-gray-50 p-2">
          <img
            src={question.image}
            alt={`Illustration for ${question.id}`}
            width={question.imageWidth || 800}
            height={question.imageHeight || 400}
            className="max-h-[400px] object-contain w-auto h-auto"
            loading="lazy"
          />
        </div>
      )}
      {question.table && (
        <div className="mb-4 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {question.table.headers.map((h, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-2 text-left font-semibold text-gray-900 whitespace-nowrap"
                  >
                    <InlineMarkdown>{h}</InlineMarkdown>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {question.table.rows.map((row, ri) => (
                <tr key={ri} className="hover:bg-gray-50/50 transition-colors">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-2 text-gray-700 whitespace-nowrap"
                    >
                      <InlineMarkdown>{cell}</InlineMarkdown>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {question.type === "mc" && <MCQuestion {...props} />}
      {(question.type === "text" || question.type === "calculation") && (
        <TextQuestion {...props} />
      )}
      {question.type === "matching" && <MatchingQuestion {...props} />}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
        <span className="text-[10px] font-mono text-gray-300 select-all">
          {question.id}
        </span>
        <a
          href={buildReportUrl(question, props.subjectId)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded px-2 py-1 -mr-2"
          onClick={() => {
            triggerLight();
            track("report_issue", {
              questionId: question.id,
              subjectId: props.subjectId,
            });
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          {t.questionCard.reportIssue}
        </a>
      </div>
    </div>
  );
}
