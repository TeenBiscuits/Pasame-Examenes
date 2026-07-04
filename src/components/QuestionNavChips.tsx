import type { RefObject } from "react";
import type { Question } from "../data/types";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";

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
  dataTour,
}: QuestionNavChipsProps) {
  return (
    <div
      ref={navRef}
      className="flex gap-1 mb-6 overflow-x-auto pb-6"
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
        const isAnswered = answers[q.id] && answers[q.id].trim() !== "";
        const isChecked = !!checkedQuestions?.[q.id];
        const isCurrent = i === currentIndex;
        let cls =
          "w-8 h-8 rounded-md text-xs font-mono flex items-center justify-center border shrink-0 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition cursor-pointer";
        if (isCurrent) cls += " bg-accent text-white border-accent";
        else if (isChecked) cls += " bg-blue-50 border-blue-300 text-blue-700";
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
            {isChecked && !isCurrent ? "\u2713" : i + 1}
          </button>
        );
      })}
    </div>
  );
}
