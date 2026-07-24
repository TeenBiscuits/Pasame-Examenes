import type { RefObject } from "react";
import type { Question } from "../data/types";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import type { QuestionResult } from "../lib/grading";

type NavEventName = "practice_navigate" | "exam_navigate";

interface QuestionNavChipsProps {
  questions: Question[];
  answers: Record<string, string>;
  currentIndex: number;
  navRef: RefObject<HTMLDivElement | null>;
  showLeftFade: boolean;
  showRightFade: boolean;
  onSelectIndex: (i: number, direction: "next" | "prev" | undefined) => void;
  eventData:
    | Record<string, string | number | boolean | undefined | null>
    | (() => Record<string, string | number | boolean | undefined | null>);
  eventName: NavEventName;
  checkedQuestions?: Record<string, boolean>;
  questionResults?: Record<string, QuestionResult>;
  dataTour?: string;
}

export default function QuestionNavChips({
  questions,
  answers,
  currentIndex,
  navRef,
  showLeftFade,
  showRightFade,
  onSelectIndex,
  eventData,
  eventName,
  checkedQuestions,
  questionResults,
  dataTour,
}: QuestionNavChipsProps) {
  return (
    <div
      ref={navRef}
      className="mb-4 flex gap-2 overflow-x-auto overflow-y-hidden pb-2"
      data-tour={dataTour}
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
        const result = questionResults?.[q.id];
        const isAnswered = answers[q.id] && answers[q.id].trim() !== "";
        const isChecked = !!checkedQuestions?.[q.id];
        const isCurrent = i === currentIndex;
        let cls =
          "size-[42px] rounded-md text-xs font-mono flex items-center justify-center border shrink-0 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition cursor-pointer";
        if (isCurrent) cls += " bg-accent text-white border-accent";
        else if (result === "correct")
          cls += " bg-correct-bg border-correct-border text-correct-fg";
        else if (result === "incorrect")
          cls += " bg-incorrect-bg border-incorrect-border text-incorrect-fg";
        else if (result === "pending" || isChecked)
          cls += " bg-pending-bg border-pending-border text-pending-fg";
        else if (isAnswered)
          cls += " bg-accent-light border-accent-border text-accent-fg";
        else cls += " border-border text-fg-muted hover:border-fg-muted";
        const direction =
          i > currentIndex ? "next" : i < currentIndex ? "prev" : undefined;
        return (
          <button
            type="button"
            key={q.id}
            className={cls}
            onClick={() => {
              triggerLight();
              if (direction !== undefined) {
                const data =
                  typeof eventData === "function" ? eventData() : eventData;
                track(eventName, {
                  ...data,
                  direction,
                  fromIndex: currentIndex,
                  toIndex: i,
                  source: "chip",
                });
              }
              onSelectIndex(i, direction);
            }}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
