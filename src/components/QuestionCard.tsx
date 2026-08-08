import { useState, useEffect, useRef } from "react";
import type { Picture } from "vite-imagetools";
import type { Question, QuestionType } from "../data/types";
import { useT } from "../i18n/hooks";
import { Markdown, InlineMarkdown } from "../lib/markdown";
import {
  getPartSelfGradeKey,
  getTextPartPoints,
  isAutomaticallyCorrect,
  isFillAnswerCorrect,
} from "../lib/grading";
import { track } from "../lib/umami";
import { formatPoints } from "../lib/points";
import {
  triggerLight,
  triggerSuccess,
  triggerError,
  triggerSelection,
} from "../lib/haptics";
import { playSuccess, playError } from "../lib/sound";
import {
  BookOpen,
  CaretRight,
  CheckSquare,
  Notebook,
  Restart,
  TriangleWarning,
  XSquare,
} from "reicon-react";

function defaultLabel(index: number) {
  return `${String.fromCharCode(97 + index)})`;
}

function QuestionImage({
  image,
  alt,
  maxHeight,
}: {
  image: Picture | string | (Picture | string)[];
  alt: string;
  maxHeight: "300px" | "400px";
}) {
  const heightClass = maxHeight === "400px" ? "max-h-[400px]" : "max-h-[300px]";
  const images = Array.isArray(image) ? image : [image];

  return (
    <div className="border-border bg-surface flex max-w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border p-2">
      {images.map((source, index) =>
        typeof source === "object" ? (
          <picture key={source.img.src}>
            {Object.entries(source.sources).map(([format, srcset]) => (
              <source key={format} srcSet={srcset} type={`image/${format}`} />
            ))}
            <img
              src={source.img.src}
              alt={images.length > 1 ? `${alt} ${index + 1}` : alt}
              width={source.img.w}
              height={source.img.h}
              style={{
                aspectRatio: `${source.img.w} / ${source.img.h}`,
              }}
              className={`${heightClass} max-w-full object-contain`}
              loading="lazy"
            />
          </picture>
        ) : (
          <img
            key={source}
            src={source}
            alt={images.length > 1 ? `${alt} ${index + 1}` : alt}
            className={`${heightClass} max-w-full object-contain`}
            loading="lazy"
          />
        ),
      )}
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
  /** Per-question self-grades keyed by `getPartSelfGradeKey` for `multiple-text` parts. */
  selfGrades?: Record<string, "correct" | "incorrect">;
  onSelfGrade?: (questionId: string, grade: "correct" | "incorrect") => void;
  direction?: "next" | "prev";
}

function getQuestionTypeLabel(
  type: QuestionType,
  labels: Record<QuestionType, string>,
): string {
  return labels[type];
}

function buildReportUrl(
  question: Question,
  subjectId: string,
  reportTitle: string,
  questionTypes: Record<QuestionType, string>,
): string {
  const base = "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new";
  const params = new URLSearchParams();
  params.set("template", "report-question.yml");
  params.set("title", `[${reportTitle}] ${question.id}`);
  params.set("subject", subjectId);
  params.set("question-id", question.id);
  params.set(
    "question-type",
    getQuestionTypeLabel(question.type, questionTypes),
  );
  return `${base}?${params.toString()}`;
}

const solutionPanelClass =
  "bg-surface border-border -mx-4 space-y-3 border-y px-4 py-4 sm:-mx-6 sm:px-6";

function DevelopmentDisclosure({
  development,
  questionId,
  subjectId,
  topicKey,
  examYear,
  mode,
}: {
  development: string;
  questionId: string;
  subjectId: string;
  topicKey?: string;
  examYear?: string;
  mode?: "practice" | "exam";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useT();

  return (
    <div className="mt-3 space-y-3">
      <button
        type="button"
        data-cuelume-press
        className="text-accent hover:text-accent-fg focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
        onClick={() => {
          triggerLight();
          const next = !isOpen;
          track("solution_toggle", {
            questionId,
            action: next ? "open" : "close",
            panel: "development",
            subjectId,
            topic: topicKey,
            exam: examYear,
            mode,
          });
          setIsOpen(next);
        }}
      >
        <BookOpen size={16} aria-hidden="true" />
        {isOpen
          ? t.questionCard.closeDevelopment
          : t.questionCard.openDevelopment}
      </button>
      {isOpen && (
        <div className={solutionPanelClass}>
          <h4 className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
            {t.questionCard.development}
          </h4>
          <Markdown className="text-fg-secondary font-sans text-xs">
            {development}
          </Markdown>
        </div>
      )}
    </div>
  );
}

function getFillInputWidth(answer: string): "w-16" | "w-24" | "w-36" | "w-52" {
  const length = answer.trim().length;
  if (length <= 4) return "w-16";
  if (length <= 9) return "w-24";
  if (length <= 18) return "w-36";
  return "w-52";
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
            data-cuelume-press
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
              data-cuelume-press
              className="text-accent hover:text-accent-fg focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
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
              <BookOpen size={16} aria-hidden="true" />
              {isOpen
                ? t.questionCard.closeSolution
                : t.questionCard.openSolution}
            </button>
            {isOpen && (
              <div className={solutionPanelClass}>
                {question.explanation != null && (
                  <Markdown className="text-fg-muted text-xs italic">
                    {question.explanation}
                  </Markdown>
                )}
                {question.explanationImage && (
                  <QuestionImage
                    image={question.explanationImage}
                    alt={t.questionCard.solutionIllustration}
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
        {t.questionCard.yourAnswer}
      </label>
      <textarea
        id={`answer-${question.id}`}
        aria-label={t.questionCard.yourAnswer}
        className="border-border focus:border-accent focus-visible:ring-accent min-h-[120px] w-full resize-y rounded-lg border-2 p-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        placeholder={t.questionCard.typeAnswer}
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
            data-cuelume-press
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
            <div className={solutionPanelClass}>
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
                  alt={t.questionCard.solutionIllustration}
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
                      data-cuelume-press
                      onClick={() => {
                        triggerSuccess();
                        playSuccess();
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
                      data-cuelume-press
                      onClick={() => {
                        triggerError();
                        playError();
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

function MultipleTextQuestion({
  question,
  onAnswer,
  savedAnswer,
  showResult,
  onSelfGrade,
  selfGrades,
  subjectId,
  topicKey,
  examYear,
  mode,
}: QuestionCardProps) {
  const [openParts, setOpenParts] = useState<Record<number, boolean>>({});
  const t = useT();
  const textStartedRef = useRef(false);
  const parts = question.textParts || [];
  const solutions = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [];

  useEffect(() => {
    textStartedRef.current = false;
  }, [question.id]);

  let answers: string[] = [];
  if (savedAnswer) {
    try {
      const parsed = JSON.parse(savedAnswer);
      if (Array.isArray(parsed)) answers = parsed;
    } catch {
      answers = [];
    }
  }

  return (
    <div className="space-y-4">
      {parts.map((part, partIndex) => {
        const isOpen = !!openParts[partIndex];
        const grade = selfGrades?.[getPartSelfGradeKey(question.id, partIndex)];
        return (
          <div key={`${question.id}-part-${partIndex}`}>
            <div className="mb-1.5 flex items-baseline gap-2">
              <span className="bg-code text-fg-secondary shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-bold">
                {part.label || defaultLabel(partIndex)}
              </span>
              <span className="text-fg-secondary flex-1 text-sm">
                <InlineMarkdown>{part.text}</InlineMarkdown>
              </span>
              <span className="bg-accent-light text-accent-fg shrink-0 rounded px-1.5 py-0.5 font-mono text-xs whitespace-nowrap">
                {formatPoints(getTextPartPoints(question, partIndex))}
                {t.questionCard.pointsShort}
              </span>
            </div>
            <label
              htmlFor={`answer-${question.id}-${partIndex}`}
              className="sr-only"
            >
              {part.label || defaultLabel(partIndex)} {t.questionCard.yourAnswer}
            </label>
            <textarea
              id={`answer-${question.id}-${partIndex}`}
              aria-label={`${part.label || defaultLabel(partIndex)} ${t.questionCard.yourAnswer}`}
              className="border-border focus:border-accent focus-visible:ring-accent min-h-[100px] w-full resize-y rounded-lg border-2 p-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              placeholder={t.questionCard.typeAnswer}
              autoComplete="off"
              spellCheck={false}
              value={answers[partIndex] || ""}
              onChange={(e) => {
                const next = [...answers];
                next[partIndex] = e.target.value;
                onAnswer(question.id, JSON.stringify(next));
                if (!textStartedRef.current) {
                  textStartedRef.current = true;
                  track("question_answer", {
                    questionId: question.id,
                    type: "multiple-text",
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
            {showResult && typeof solutions[partIndex] === "string" && (
              <div className="mt-3 space-y-3">
                <button
                  type="button"
                  data-cuelume-press
                  className="text-accent hover:text-accent-fg focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
                  onClick={() => {
                    triggerLight();
                    const next = !isOpen;
                    track("solution_toggle", {
                      questionId: question.id,
                      action: next ? "open" : "close",
                      panel: "part",
                      part: partIndex,
                    });
                    setOpenParts((prev) => ({ ...prev, [partIndex]: next }));
                  }}
                >
                  <BookOpen size={16} aria-hidden="true" />
                  {isOpen
                    ? t.questionCard.closeSolution
                    : t.questionCard.openSolution}
                </button>
                {isOpen && (
                  <div className={solutionPanelClass}>
                    <h4 className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
                      {t.questionCard.modelSolution}
                    </h4>
                    <Markdown className="text-fg-secondary font-sans text-xs whitespace-pre-wrap">
                      {solutions[partIndex]}
                    </Markdown>
                    {onSelfGrade && (
                      <div className="border-border border-t pt-2">
                        <p className="text-fg-secondary mb-2 text-xs font-semibold">
                          {t.questionCard.gradeAnswer}
                        </p>
                        <div className="flex gap-2 *:flex-1">
                          <button
                            type="button"
                            data-cuelume-press
                            onClick={() => {
                              triggerSuccess();
                              playSuccess();
                              onSelfGrade(
                                getPartSelfGradeKey(question.id, partIndex),
                                "correct",
                              );
                            }}
                            className={`focus-visible:ring-accent flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
                              grade === "correct"
                                ? "bg-correct-bg border-correct-border text-correct-fg"
                                : "bg-surface-alt border-border text-fg-secondary hover:bg-accent-light/50 hover:border-accent-border"
                            }`}
                          >
                            <CheckSquare
                              size={14}
                              weight={grade === "correct" ? "Filled" : "Outline"}
                              aria-hidden="true"
                            />
                            {t.questionCard.correct}
                          </button>
                          <button
                            type="button"
                            data-cuelume-press
                            onClick={() => {
                              triggerError();
                              playError();
                              onSelfGrade(
                                getPartSelfGradeKey(question.id, partIndex),
                                "incorrect",
                              );
                            }}
                            className={`focus-visible:ring-incorrect-fg flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
                              grade === "incorrect"
                                ? "border-incorrect-border bg-incorrect-bg text-incorrect-fg"
                                : "bg-surface-alt border-border text-fg-secondary hover:border-incorrect-border hover:bg-incorrect-bg/50"
                            }`}
                          >
                            <XSquare
                              size={14}
                              weight={grade === "incorrect" ? "Filled" : "Outline"}
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
      })}
    </div>
  );
}

function FillQuestion({
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
  const t = useT();
  const statements = question.fillStatements || [];
  const correctAnswers = question.correctAnswer as string[];
  const automaticallyCorrect = isAutomaticallyCorrect(question, savedAnswer);
  let answers: string[] = [];
  if (savedAnswer) {
    try {
      const parsed = JSON.parse(savedAnswer);
      if (Array.isArray(parsed)) answers = parsed;
    } catch {
      answers = [];
    }
  }

  let blankIndex = 0;
  return (
    <div className="space-y-3">
      {statements.map((statement, statementIndex) => {
        const parts = statement.text.split("{{blank}}");
        return (
          <div
            key={`${question.id}-fill-${statementIndex}`}
            className="text-fg-secondary flex items-baseline gap-2 text-sm leading-relaxed"
          >
            {statement.label && (
              <span className="text-fg-muted shrink-0 font-semibold">
                {statement.label}
              </span>
            )}
            <span>
              {parts.map((part, partIndex) => {
                const currentBlankIndex = blankIndex;
                const hasBlankAfter = partIndex < parts.length - 1;
                if (hasBlankAfter) blankIndex++;
                return (
                  <span
                    key={`${question.id}-fill-part-${statementIndex}-${partIndex}`}
                  >
                    <InlineMarkdown>{part}</InlineMarkdown>
                    {hasBlankAfter && (
                      <>
                        <label
                          htmlFor={`${question.id}-blank-${currentBlankIndex}`}
                          className="sr-only"
                        >
                          {statement.label || `${statementIndex + 1}`}{" "}
                          {currentBlankIndex + 1}
                        </label>
                        <input
                          id={`${question.id}-blank-${currentBlankIndex}`}
                          name={`${question.id}-blank-${currentBlankIndex}`}
                          type="text"
                          autoComplete="off"
                          enterKeyHint="next"
                          value={answers[currentBlankIndex] || ""}
                          onChange={(event) => {
                            const next = [...answers];
                            next[currentBlankIndex] = event.target.value;
                            onAnswer(question.id, JSON.stringify(next));
                            track("question_answer", {
                              questionId: question.id,
                              type: "fill",
                              blank: currentBlankIndex,
                              subjectId,
                              topic: topicKey,
                              exam: examYear,
                              mode,
                            });
                          }}
                          disabled={!!showResult}
                          className={`mx-1 inline-block min-h-8 ${getFillInputWidth(correctAnswers[currentBlankIndex] || "")} focus-visible:ring-accent max-w-[min(100%,13rem)] rounded-md border-2 px-1.5 py-0.5 align-middle text-sm transition-colors transition-shadow duration-200 focus-visible:ring-2 focus-visible:outline-none ${
                            showResult
                              ? isFillAnswerCorrect(
                                  savedAnswer,
                                  correctAnswers[currentBlankIndex] || "",
                                  currentBlankIndex,
                                )
                                ? "border-correct-border bg-correct-bg text-correct-fg"
                                : "border-contribute-border bg-contribute-bg text-contribute-fg"
                              : "border-border bg-surface"
                          }`}
                        />
                        {showResult && (
                          <span className="text-fg-muted text-xs">
                            ({t.questionCard.modelSolution}:{" "}
                            {correctAnswers[currentBlankIndex]})
                          </span>
                        )}
                      </>
                    )}
                  </span>
                );
              })}
            </span>
          </div>
        );
      })}
      {showResult && onSelfGrade && !automaticallyCorrect && (
        <div className="border-border mt-3 border-t pt-2">
          <p className="text-fg-secondary mb-2 text-xs font-semibold">
            {t.questionCard.gradeAnswer}
          </p>
          <div className="flex gap-2 *:flex-1">
            <button
              type="button"
              data-cuelume-press
              onClick={() => {
                triggerSuccess();
                playSuccess();
                onSelfGrade(question.id, "correct");
              }}
              className={`focus-visible:ring-accent flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
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
              data-cuelume-press
              onClick={() => {
                triggerError();
                playError();
                onSelfGrade(question.id, "incorrect");
              }}
              className={`focus-visible:ring-incorrect-fg flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
                selfGrade === "incorrect"
                  ? "border-incorrect-border bg-incorrect-bg text-incorrect-fg"
                  : "bg-surface-alt border-border text-fg-secondary hover:border-incorrect-border hover:bg-incorrect-bg/50"
              }`}
            >
              <XSquare
                size={14}
                weight={selfGrade === "incorrect" ? "Filled" : "Outline"}
                aria-hidden="true"
              />
              {t.questionCard.incorrect}
            </button>
          </div>
        </div>
      )}
      {showResult && question.development && (
        <DevelopmentDisclosure
          development={question.development}
          questionId={question.id}
          subjectId={subjectId}
          topicKey={topicKey}
          examYear={examYear}
          mode={mode}
        />
      )}
    </div>
  );
}

function TableFillQuestion({
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
  const t = useT();
  const table = question.tableFill;
  const correctAnswers = question.correctAnswer as string[];
  const automaticallyCorrect = isAutomaticallyCorrect(question, savedAnswer);
  let answers: string[] = [];
  if (savedAnswer) {
    try {
      const parsed = JSON.parse(savedAnswer);
      if (Array.isArray(parsed)) answers = parsed;
    } catch {
      answers = [];
    }
  }

  if (!table) return null;

  let blankIndex = 0;
  return (
    <div className="space-y-3">
      <div className="border-border overflow-x-auto rounded-lg border">
        <table className="divide-border min-w-full divide-y text-sm">
          <thead className="bg-surface">
            <tr>
              {table.headers.map((header, index) => (
                <th
                  key={`${question.id}-table-fill-header-${index}`}
                  scope="col"
                  className="text-fg px-4 py-2 text-left font-semibold whitespace-nowrap"
                >
                  <InlineMarkdown>{header}</InlineMarkdown>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-border bg-surface-alt divide-y">
            {table.rows.map((row, rowIndex) => (
              <tr key={`${question.id}-table-fill-row-${rowIndex}`}>
                {row.map((cell, columnIndex) => {
                  const parts = cell.split("{{blank}}");
                  return (
                    <td
                      key={`${question.id}-table-fill-cell-${rowIndex}-${columnIndex}`}
                      className="text-fg-secondary px-4 py-2 align-middle"
                    >
                      {parts.map((part, partIndex) => {
                        const currentBlankIndex = blankIndex;
                        const hasBlankAfter = partIndex < parts.length - 1;
                        if (hasBlankAfter) blankIndex++;
                        return (
                          <span
                            key={`${question.id}-table-fill-part-${rowIndex}-${columnIndex}-${partIndex}`}
                          >
                            <InlineMarkdown>{part}</InlineMarkdown>
                            {hasBlankAfter && (
                              <>
                                <label
                                  htmlFor={`${question.id}-table-blank-${currentBlankIndex}`}
                                  className="sr-only"
                                >
                                  {rowIndex + 1}-{columnIndex + 1} blank{" "}
                                  {currentBlankIndex + 1}
                                </label>
                                <input
                                  id={`${question.id}-table-blank-${currentBlankIndex}`}
                                  name={`${question.id}-table-blank-${currentBlankIndex}`}
                                  type="text"
                                  autoComplete="off"
                                  enterKeyHint="next"
                                  value={answers[currentBlankIndex] || ""}
                                  onChange={(event) => {
                                    const next = [...answers];
                                    next[currentBlankIndex] =
                                      event.target.value;
                                    onAnswer(question.id, JSON.stringify(next));
                                    track("question_answer", {
                                      questionId: question.id,
                                      type: "table-fill",
                                      blank: currentBlankIndex,
                                      subjectId,
                                      topic: topicKey,
                                      exam: examYear,
                                      mode,
                                    });
                                  }}
                                  disabled={!!showResult}
                                  className={`mx-1 inline-block min-h-8 ${getFillInputWidth(correctAnswers[currentBlankIndex] || "")} focus-visible:ring-accent max-w-[min(100%,13rem)] rounded-md border-2 px-1.5 py-0.5 align-middle text-sm transition-colors transition-shadow duration-200 focus-visible:ring-2 focus-visible:outline-none ${
                                    showResult
                                      ? isFillAnswerCorrect(
                                          savedAnswer,
                                          correctAnswers[currentBlankIndex] ||
                                            "",
                                          currentBlankIndex,
                                        )
                                        ? "border-correct-border bg-correct-bg text-correct-fg"
                                        : "border-contribute-border bg-contribute-bg text-contribute-fg"
                                      : "border-border bg-surface"
                                  }`}
                                />
                                {showResult && (
                                  <span className="text-fg-muted text-xs">
                                    ({t.questionCard.modelSolution}:{" "}
                                    {correctAnswers[currentBlankIndex]})
                                  </span>
                                )}
                              </>
                            )}
                          </span>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showResult && onSelfGrade && !automaticallyCorrect && (
        <div className="border-border mt-3 border-t pt-2">
          <p className="text-fg-secondary mb-2 text-xs font-semibold">
            {t.questionCard.gradeAnswer}
          </p>
          <div className="flex gap-2 *:flex-1">
            <button
              type="button"
              data-cuelume-press
              onClick={() => {
                triggerSuccess();
                playSuccess();
                onSelfGrade(question.id, "correct");
              }}
              className={`focus-visible:ring-accent flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
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
              data-cuelume-press
              onClick={() => {
                triggerError();
                playError();
                onSelfGrade(question.id, "incorrect");
              }}
              className={`focus-visible:ring-incorrect-fg flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 px-3 py-1.5 text-xs font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95 ${
                selfGrade === "incorrect"
                  ? "border-incorrect-border bg-incorrect-bg text-incorrect-fg"
                  : "bg-surface-alt border-border text-fg-secondary hover:border-incorrect-border hover:bg-incorrect-bg/50"
              }`}
            >
              <XSquare
                size={14}
                weight={selfGrade === "incorrect" ? "Filled" : "Outline"}
                aria-hidden="true"
              />
              {t.questionCard.incorrect}
            </button>
          </div>
        </div>
      )}
      {showResult && question.development && (
        <DevelopmentDisclosure
          development={question.development}
          questionId={question.id}
          subjectId={subjectId}
          topicKey={topicKey}
          examYear={examYear}
          mode={mode}
        />
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
                  "w-9 h-9 rounded-md border-2 text-xs font-bold font-mono active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition flex items-center justify-center";
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
                    data-cuelume-press
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
                    aria-label={t.questionCard.matchItemTo
                      .replace("{item}", item)
                      .replace("{letter}", letter)}
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
              data-cuelume-press
              className="text-accent hover:text-accent-fg focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
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
              <BookOpen size={16} aria-hidden="true" />
              {isOpen
                ? t.questionCard.closeSolution
                : t.questionCard.openSolution}
            </button>
            {isOpen && (
              <div className={solutionPanelClass}>
                {question.explanation != null && (
                  <Markdown className="text-fg-muted text-xs italic">
                    {question.explanation}
                  </Markdown>
                )}
                {question.explanationImage && (
                  <QuestionImage
                    image={question.explanationImage}
                    alt={t.questionCard.solutionIllustration}
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
  const questionProps = props;
  const { question } = questionProps;
  const t = useT();

  const slideClass =
    questionProps.direction === "next"
      ? "animate-slide-in-right animate-duration-fast"
      : questionProps.direction === "prev"
        ? "animate-slide-in-left animate-duration-fast"
        : "animate-fade-in animate-duration-fast";

  return (
    <div
      className={`bg-surface-alt border-border rounded-xl border p-4 shadow-sm sm:p-6 ${slideClass}`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="bg-code text-fg-secondary rounded px-2 py-0.5 font-mono text-xs">
          {t.questionCard.questionPrefix}
          {questionProps.index + 1}/{questionProps.total}
        </span>
        <span className="bg-accent-light text-accent-fg rounded px-2 py-0.5 font-mono text-xs">
          {formatPoints(question.points)}
          {t.questionCard.pointsShort}
        </span>
        <span className="text-fg-muted order-last flex w-full min-w-0 items-center gap-0.5 text-xs sm:order-none sm:w-auto sm:flex-1">
          {questionProps.megatopicLabel && (
            <>
              <span className="truncate">{questionProps.megatopicLabel}</span>
              <CaretRight
                size={12}
                weight="Filled"
                aria-hidden="true"
                className="shrink-0"
              />
            </>
          )}
          <span className="truncate">{questionProps.topicLabel}</span>
        </span>
        {(question.repeated || questionProps.examDate) && (
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            {question.repeated && (
              <span className="flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                <Restart size={10} aria-hidden="true" />
                {t.questionCard.repeated}
              </span>
            )}
            {questionProps.examDate && (
              <span className="text-fg-muted flex items-center gap-1 text-right text-xs whitespace-nowrap">
                <Notebook size={14} aria-hidden="true" />
                {questionProps.examDate}
              </span>
            )}
          </div>
        )}
      </div>
      <div>
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
      </div>
      {question.type === "mc" && (
        <MCQuestion
          key={`mc-${question.id}-${questionProps.savedAnswer || ""}`}
          {...questionProps}
        />
      )}
      {question.type === "text" && <TextQuestion {...questionProps} />}
      {question.type === "multiple-text" && (
        <MultipleTextQuestion {...questionProps} />
      )}
      {question.type === "fill" && <FillQuestion {...questionProps} />}
      {question.type === "table-fill" && (
        <TableFillQuestion {...questionProps} />
      )}
      {question.type === "matching" && (
        <MatchingQuestion
          key={`match-${question.id}-${questionProps.savedAnswer || ""}`}
          {...questionProps}
        />
      )}
      <div className="border-border mt-4 flex items-center justify-between gap-3 border-t pt-4">
        <span className="text-fg-muted inline-flex min-w-0 items-center gap-1.5 text-xs font-semibold">
          <span
            className="question-card-brand-mark bg-fg-muted size-[18px] shrink-0"
            aria-hidden="true"
          />
          <span className="hidden truncate sm:inline">Pásame Exámenes</span>
        </span>
        <div className="flex min-w-0 items-center justify-end gap-2">
          <span className="text-fg-muted min-w-0 truncate font-mono text-[10px] select-all">
            {question.id}
          </span>
          <a
            data-tour="report-issue"
            data-cuelume-hover="whisper"
            href={buildReportUrl(
              question,
              questionProps.subjectId,
              t.questionCard.reportIssueTitle,
              t.questionCard.questionTypes,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-incorrect-fg focus-visible:ring-incorrect-fg -mr-2 inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => {
              triggerLight();
              track("report_issue", {
                questionId: question.id,
                subjectId: questionProps.subjectId,
                topic: questionProps.topicKey,
                exam: questionProps.examYear,
                mode: questionProps.mode,
              });
            }}
          >
            <TriangleWarning size={16} aria-hidden="true" />
            {t.questionCard.reportIssue}
          </a>
        </div>
      </div>
    </div>
  );
}
