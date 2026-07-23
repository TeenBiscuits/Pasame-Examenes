import { useState, useEffect, useRef } from "react";
import type { Picture } from "vite-imagetools";
import type { Question, QuestionType } from "../data/types";
import { useT } from "../i18n/hooks";
import { Markdown, InlineMarkdown } from "../lib/markdown";
import { track } from "../lib/umami";
import { formatPoints } from "../lib/points";
import {
  triggerLight,
  triggerSuccess,
  triggerError,
  triggerSelection,
} from "../lib/haptics";
import {
  BookOpen,
  CaretRight,
  CheckSquare,
  Notebook,
  Restart,
  TriangleWarning,
  XSquare,
} from "reicon-react";

function QuestionImage({
  image,
  alt,
  maxHeight,
}: {
  image: Picture | string;
  alt: string;
  maxHeight: "300px" | "400px";
}) {
  const heightClass = maxHeight === "400px" ? "max-h-[400px]" : "max-h-[300px]";
  if (typeof image === "object") {
    return (
      <div className="border-border bg-surface flex max-w-full justify-center overflow-hidden rounded-lg border p-2">
        <picture>
          {Object.entries(image.sources).map(([format, srcset]) => (
            <source key={format} srcSet={srcset} type={`image/${format}`} />
          ))}
          <img
            src={image.img.src}
            alt={alt}
            width={image.img.w}
            height={image.img.h}
            style={{
              aspectRatio: `${image.img.w} / ${image.img.h}`,
            }}
            className={`${heightClass} max-w-full object-contain`}
            loading="lazy"
          />
        </picture>
      </div>
    );
  }
  return (
    <div className="border-border bg-surface flex max-w-full justify-center overflow-hidden rounded-lg border p-2">
      <img
        src={image}
        alt={alt}
        className={`${heightClass} max-w-full object-contain`}
        loading="lazy"
      />
    </div>
  );
}

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  topicLabel: string;
  megatopicLabel?: string;
  examDate?: string;
  subjectId: string;
  topicKey?: string;
  examYear?: string;
  mode?: "practice" | "exam";
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
  subjectId,
  topicKey,
  examYear,
  mode,
}: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useT();

  useEffect(() => {
    if (showResult || !question.options) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const key = e.key.toLowerCase();
      let selectedLetter: string | undefined;

      if (["a", "b", "c", "d", "e"].includes(key)) {
        selectedLetter = key;
      } else if (["1", "2", "3", "4", "5"].includes(key)) {
        selectedLetter = String.fromCharCode(96 + parseInt(key)); // '1' -> 'a'
      }

      if (selectedLetter) {
        const optionIndex = selectedLetter.charCodeAt(0) - 97;
        if (optionIndex < question.options!.length) {
          e.preventDefault();
          triggerSelection();
          track("question_answer", {
            questionId: question.id,
            type: "mc",
            answer: selectedLetter,
            subjectId,
            topic: topicKey,
            exam: examYear,
            mode,
          });
          onAnswer(question.id, selectedLetter);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showResult,
    question.id,
    question.options,
    onAnswer,
    subjectId,
    topicKey,
    examYear,
    mode,
  ]);

  if (!question.options) return null;

  return (
    <div className="space-y-2">
      {question.options.map((opt, i) => {
        const letter = String.fromCharCode(97 + i);
        const key = `${question.id}-opt-${letter}`;
        const isSelected = savedAnswer === letter;
        const isCorrect = question.correctAnswer === letter;
        let className =
          "w-full p-3 rounded-lg border-2 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition duration-150 text-left text-sm flex items-start gap-3";
        if (showResult && isCorrect) {
          className += " bg-correct-bg border-correct-border";
        } else if (isSelected && showResult && !isCorrect) {
          className += " bg-incorrect-bg border-incorrect-border";
        } else if (isSelected && !showResult) {
          className += " bg-accent-light border-accent";
        } else {
          className += " border-border hover:border-border bg-surface-alt";
        }

        return (
          <button
            type="button"
            key={key}
            className={className}
            onClick={() => {
              if (showResult) return;
              triggerSelection();
              track("question_answer", {
                questionId: question.id,
                type: "mc",
                answer: letter,
                subjectId,
                topic: topicKey,
                exam: examYear,
                mode,
              });
              onAnswer(question.id, letter);
            }}
            disabled={!!showResult}
          >
            <span
              className={`bg-code mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${isSelected ? "animate-pop" : ""}`}
            >
              {letter}
            </span>
            <span className="flex-1">
              <InlineMarkdown>
                {opt.replace(/^[a-eA-E][.)]\s*/, "")}
              </InlineMarkdown>
            </span>
          </button>
        );
      })}
      {showResult &&
        (question.explanation != null || question.explanationImage) && (
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="text-accent hover:text-accent-fg focus-visible:ring-accent hover:border-accent-border rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
              onClick={() => {
                triggerLight();
                const next = !isOpen;
                track("solution_toggle", {
                  questionId: question.id,
                  action: next ? "open" : "close",
                  subjectId,
                  topic: topicKey,
                  exam: examYear,
                  mode,
                });
                setIsOpen(next);
              }}
            >
              {isOpen
                ? t.questionCard.closeSolution
                : t.questionCard.openSolution}
            </button>
            {isOpen && (
              <div className="bg-surface border-border space-y-3 rounded-lg border p-4">
                {question.explanation != null && (
                  <Markdown className="text-fg-muted text-xs italic">
                    {question.explanation}
                  </Markdown>
                )}
                {question.explanationImage && (
                  <QuestionImage
                    image={question.explanationImage}
                    alt="Solution illustration"
                    maxHeight="300px"
                  />
                )}
              </div>
            )}
          </div>
        )}
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
  subjectId,
  topicKey,
  examYear,
  mode,
}: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useT();
  const textStartedRef = useRef(false);

  useEffect(() => {
    textStartedRef.current = false;
  }, [question.id]);

  return (
    <div>
      <label htmlFor={`answer-${question.id}`} className="sr-only">
        Your answer
      </label>
      <textarea
        id={`answer-${question.id}`}
        aria-label="Your answer"
        className="border-border focus:border-accent focus-visible:ring-accent min-h-[120px] w-full resize-y rounded-lg border-2 p-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        placeholder="Type your answer…"
        autoComplete="off"
        spellCheck={false}
        value={savedAnswer || ""}
        onChange={(e) => {
          onAnswer(question.id, e.target.value);
          if (!textStartedRef.current) {
            textStartedRef.current = true;
            track("question_answer", {
              questionId: question.id,
              type: "text",
              action: "started",
              subjectId,
              topic: topicKey,
              exam: examYear,
              mode,
            });
          }
        }}
        disabled={!!showResult}
      />
      {showResult && (
        <div className="mt-3 space-y-3">
          <button
            type="button"
            className="text-accent hover:text-accent-fg focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
            onClick={() => {
              triggerLight();
              const next = !isOpen;
              track("solution_toggle", {
                questionId: question.id,
                action: next ? "open" : "close",
              });
              setIsOpen(next);
            }}
          >
            <BookOpen size={16} aria-hidden="true" />
            {isOpen
              ? t.questionCard.closeSolution
              : t.questionCard.openAndSelfGrade}
          </button>

          {isOpen && (
            <div className="bg-surface border-border space-y-3 rounded-lg border p-4">
              <h4 className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
                {t.questionCard.modelSolution}
              </h4>
              <Markdown className="text-fg-secondary font-sans text-xs whitespace-pre-wrap">
                {typeof question.correctAnswer === "string"
                  ? question.correctAnswer
                  : JSON.stringify(question.correctAnswer, null, 2)}
              </Markdown>
              {question.explanation != null && (
                <Markdown className="text-fg-muted text-xs italic">
                  {question.explanation}
                </Markdown>
              )}
              {question.explanationImage && (
                <QuestionImage
                  image={question.explanationImage}
                  alt="Solution illustration"
                  maxHeight="300px"
                />
              )}

              {onSelfGrade && (
                <div className="border-border border-t pt-2">
                  <p className="text-fg-secondary mb-2 text-xs font-semibold">
                    {t.questionCard.gradeAnswer}
                  </p>
                  <div className="flex gap-2 *:flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        triggerSuccess();
                        onSelfGrade(question.id, "correct");
                      }}
                      className={`focus-visible:ring-accent flex items-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
                        selfGrade === "correct"
                          ? "bg-correct-bg border-correct-border text-correct-fg"
                          : "bg-surface-alt border-border text-fg-secondary hover:bg-accent-light/50 hover:border-accent-border"
                      }`}
                    >
                      <CheckSquare
                        size={14}
                        weight={selfGrade === "correct" ? "Filled" : "Outline"}
                        aria-hidden="true"
                      />
                      {t.questionCard.correct}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerError();
                        onSelfGrade(question.id, "incorrect");
                      }}
                      className={`focus-visible:ring-incorrect-fg flex items-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
                        selfGrade === "incorrect"
                          ? "border-incorrect-border bg-incorrect-bg text-incorrect-fg"
                          : "bg-surface-alt border-border text-fg-secondary hover:border-incorrect-border hover:bg-incorrect-bg/50"
                      }`}
                    >
                      <XSquare
                        size={14}
                        weight={
                          selfGrade === "incorrect" ? "Filled" : "Outline"
                        }
                        aria-hidden="true"
                      />
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
  subjectId,
  topicKey,
  examYear,
  mode,
}: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useT();
  const correctAnswer = question.correctAnswer as Record<string, string>;
  const items = Object.keys(correctAnswer);
  const letters = [...new Set(Object.values(correctAnswer))].toSorted(
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
          <div key={item} className="flex items-center gap-3 text-sm">
            <span className="text-fg-muted w-6 text-center font-mono text-xs">
              {i + 1}.
            </span>
            <span className="text-fg-secondary flex-1">
              <InlineMarkdown>{item}</InlineMarkdown>
            </span>
            <div className="flex gap-1">
              {letters.map((letter) => {
                const chosen = userAnswer === letter;
                const real = correctAnswer[item] === letter;
                let cls =
                  "w-8 h-8 rounded-md border-2 text-xs font-bold font-mono active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition flex items-center justify-center";
                if (showResult && real) {
                  cls += " bg-correct-bg border-correct-border text-correct-fg";
                } else if (showResult && chosen && !real) {
                  cls +=
                    " bg-incorrect-bg border-incorrect-border text-incorrect-fg";
                } else if (chosen) {
                  cls += " bg-accent-light border-accent text-accent-fg";
                } else {
                  cls +=
                    " border-border text-fg-muted hover:border-fg-muted bg-surface-alt";
                }
                return (
                  <button
                    type="button"
                    key={letter}
                    className={cls}
                    onClick={() => {
                      triggerSelection();
                      track("question_answer", {
                        questionId: question.id,
                        type: "matching",
                        item,
                        answer: letter,
                        subjectId,
                        topic: topicKey,
                        exam: examYear,
                        mode,
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
      {showResult &&
        (question.explanation != null || question.explanationImage) && (
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="text-accent hover:text-accent-fg focus-visible:ring-accent hover:border-accent-border rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
              onClick={() => {
                triggerLight();
                const next = !isOpen;
                track("solution_toggle", {
                  questionId: question.id,
                  action: next ? "open" : "close",
                  subjectId,
                  topic: topicKey,
                  exam: examYear,
                  mode,
                });
                setIsOpen(next);
              }}
            >
              {isOpen
                ? t.questionCard.closeSolution
                : t.questionCard.openSolution}
            </button>
            {isOpen && (
              <div className="bg-surface border-border space-y-3 rounded-lg border p-4">
                {question.explanation != null && (
                  <Markdown className="text-fg-muted text-xs italic">
                    {question.explanation}
                  </Markdown>
                )}
                {question.explanationImage && (
                  <QuestionImage
                    image={question.explanationImage}
                    alt="Solution illustration"
                    maxHeight="300px"
                  />
                )}
              </div>
            )}
          </div>
        )}
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
      className={`bg-surface-alt border-border rounded-xl border p-4 shadow-sm sm:p-6 ${slideClass}`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="bg-code text-fg-secondary rounded px-2 py-0.5 font-mono text-xs">
          Q{props.index + 1}/{props.total}
        </span>
        <span className="bg-accent-light text-accent-fg rounded px-2 py-0.5 font-mono text-xs">
          {formatPoints(question.points)}p
        </span>
        <span className="text-fg-muted order-last flex w-full min-w-0 items-center gap-0.5 text-xs sm:order-none sm:w-auto sm:flex-1">
          {props.megatopicLabel && (
            <>
              <span className="truncate">{props.megatopicLabel}</span>
              <CaretRight
                size={12}
                weight="Filled"
                aria-hidden="true"
                className="shrink-0"
              />
            </>
          )}
          <span className="truncate">{props.topicLabel}</span>
        </span>
        {(question.repeated || props.examDate) && (
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            {question.repeated && (
              <span className="flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                <Restart size={10} aria-hidden="true" />
                {t.questionCard.repeated}
              </span>
            )}
            {props.examDate && (
              <span className="text-fg-muted flex items-center gap-1 text-right text-xs whitespace-nowrap">
                <Notebook size={14} aria-hidden="true" />
                {props.examDate}
              </span>
            )}
          </div>
        )}
      </div>
      <Markdown className="text-fg mb-4 text-sm font-medium">
        {question.question}
      </Markdown>
      {question.subquestions && (
        <ul className="text-fg-secondary mb-4 list-inside list-disc space-y-1 text-sm">
          {question.subquestions.map((sq) => (
            <li key={sq}>
              <InlineMarkdown>{sq}</InlineMarkdown>
            </li>
          ))}
        </ul>
      )}
      {question.image && (
        <div className="mb-4">
          <QuestionImage
            image={question.image}
            alt={`Illustration for ${question.id}`}
            maxHeight="400px"
          />
        </div>
      )}
      {question.table && (
        <div className="border-border mb-4 overflow-x-auto rounded-lg border">
          <table className="divide-border min-w-full divide-y text-sm">
            <thead className="bg-surface">
              <tr>
                {question.table.headers.map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="text-fg px-4 py-2 text-left font-semibold whitespace-nowrap"
                  >
                    <InlineMarkdown>{h}</InlineMarkdown>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border bg-surface-alt divide-y">
              {question.table.rows.map((row, ri) => (
                <tr
                  key={`${question.id}-row-${ri}`}
                  className="hover:bg-surface/50 transition-colors"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={`${question.id}-cell-${ri}-${ci}`}
                      className="text-fg-secondary px-4 py-2 whitespace-nowrap"
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
      {question.type === "text" && <TextQuestion {...props} />}
      {question.type === "matching" && <MatchingQuestion {...props} />}
      <div className="border-border mt-4 flex items-center justify-end gap-2 border-t pt-4">
        <span className="text-fg-muted font-mono text-[10px] select-all">
          {question.id}
        </span>
        <a
          data-tour="report-issue"
          href={buildReportUrl(question, props.subjectId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg-muted hover:text-incorrect-fg focus-visible:ring-incorrect-fg -mr-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => {
            triggerLight();
            track("report_issue", {
              questionId: question.id,
              subjectId: props.subjectId,
              topic: props.topicKey,
              exam: props.examYear,
              mode: props.mode,
            });
          }}
        >
          <TriangleWarning size={16} aria-hidden="true" />
          {t.questionCard.reportIssue}
        </a>
      </div>
    </div>
  );
}
