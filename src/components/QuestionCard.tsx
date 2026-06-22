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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  topicLabel: string;
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
    <div className="flex flex-col gap-2">
      {question.options.map((opt, i) => {
        const letter = String.fromCharCode(97 + i);
        const isSelected = savedAnswer === letter;
        const isCorrect = question.correctAnswer === letter;

        return (
          <button
            key={i}
            className={cn(
              "w-full p-3 rounded-lg border-2 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none transition duration-150 text-left text-sm flex items-start gap-3",
              showResult && isCorrect &&
                "bg-primary/10 border-primary text-primary",
              showResult && isSelected && !isCorrect &&
                "bg-destructive/10 border-destructive text-destructive",
              !showResult && isSelected &&
                "bg-primary/10 border-primary text-primary",
              !showResult && !isSelected &&
                "border-border hover:border-ring/50 bg-card",
            )}
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
              className={cn(
                "font-mono font-bold text-xs size-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5",
                isSelected && "animate-pop",
              )}
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
      <textarea
        id={`answer-${question.id}`}
        className="w-full p-3 border border-input rounded-lg bg-card text-sm focus:border-ring focus:ring-2 focus:ring-ring/50 focus:outline-none resize-y min-h-[120px]"
        placeholder="Type your answer…"
        autoComplete="off"
        spellCheck={false}
        value={savedAnswer || ""}
        onChange={(e) => onAnswer(question.id, e.target.value)}
        disabled={!!showResult}
      />
      {showResult && (
        <div className="mt-3 flex flex-col gap-3">
          <Button
            variant="link"
            size="sm"
            className="justify-start p-0 h-auto"
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
          </Button>

          {isOpen && (
            <div className="p-4 bg-muted rounded-lg border border-border flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t.questionCard.modelSolution}
              </h4>
              <Markdown className="text-xs whitespace-pre-wrap font-sans text-foreground">
                {typeof question.correctAnswer === "string"
                  ? question.correctAnswer
                  : JSON.stringify(question.correctAnswer, null, 2)}
              </Markdown>
              <Markdown className="text-xs text-muted-foreground italic">
                {question.explanation}
              </Markdown>

              {onSelfGrade && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-foreground mb-2">
                    {t.questionCard.gradeAnswer}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={selfGrade === "correct" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        triggerSuccess();
                        track("self_grade", {
                          questionId: question.id,
                          grade: "correct",
                        });
                        onSelfGrade(question.id, "correct");
                      }}
                    >
                      {t.questionCard.correct}
                    </Button>
                    <Button
                      variant={
                        selfGrade === "incorrect" ? "destructive" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        triggerError();
                        track("self_grade", {
                          questionId: question.id,
                          grade: "incorrect",
                        });
                        onSelfGrade(question.id, "incorrect");
                      }}
                    >
                      {t.questionCard.incorrect}
                    </Button>
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
  const letters = [...new Set(Object.values(correctAnswer))].sort();
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
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const userAnswer = selected[item];

        return (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-6 text-center font-mono text-xs text-muted-foreground">
              {i + 1}.
            </span>
            <span className="flex-1 text-foreground">
              <InlineMarkdown>{item}</InlineMarkdown>
            </span>
            <div className="flex gap-1">
              {letters.map((letter) => {
                const chosen = userAnswer === letter;
                const real = correctAnswer[item] === letter;

                return (
                  <button
                    key={letter}
                    className={cn(
                      "size-8 rounded-md border-2 text-xs font-bold font-mono active:scale-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none transition flex items-center justify-center",
                      showResult && real &&
                        "bg-primary/10 border-primary text-primary",
                      showResult && chosen && !real &&
                        "bg-destructive/10 border-destructive text-destructive",
                      !showResult && chosen &&
                        "bg-primary/10 border-primary text-primary",
                      !showResult && !chosen &&
                        "border-border text-muted-foreground hover:border-ring/50 bg-card",
                    )}
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
    <Card className={slideClass}>
      <CardContent className="pt-(--card-spacing)">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="font-mono">
            Q{props.index + 1}/{props.total}
          </Badge>
          <Badge variant="default" className="font-mono">
            {question.points}p
          </Badge>
          <span className="text-xs text-muted-foreground">
            {props.topicLabel}
          </span>
          {props.examDate && (
            <span className="text-xs text-muted-foreground ml-auto">
              {props.examDate}
            </span>
          )}
        </div>
        <Markdown className="text-sm text-foreground font-medium mb-4">
          {question.question}
        </Markdown>
        {question.subquestions && (
          <ul className="list-disc list-inside text-sm text-muted-foreground mb-4 flex flex-col gap-1">
            {question.subquestions.map((sq, i) => (
              <li key={i}>
                <InlineMarkdown>{sq}</InlineMarkdown>
              </li>
            ))}
          </ul>
        )}
        {question.image && (
          <div className="mb-4 rounded-lg overflow-hidden border border-border max-w-full flex justify-center bg-muted p-2">
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
          <div className="mb-4 overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted">
                <tr>
                  {question.table.headers.map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="px-4 py-2 text-left font-semibold text-foreground whitespace-nowrap"
                    >
                      <InlineMarkdown>{h}</InlineMarkdown>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {question.table.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-4 py-2 text-muted-foreground whitespace-nowrap"
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
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-end gap-2">
          <span className="text-[10px] font-mono text-muted-foreground/50 select-all">
            {question.id}
          </span>
          <a
            href={buildReportUrl(question, props.subjectId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded px-2 py-1 -mr-2"
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
      </CardContent>
    </Card>
  );
}
