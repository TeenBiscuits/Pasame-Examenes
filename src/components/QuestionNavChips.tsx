import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
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
  className?: string;
}

interface NavDragState {
  pointerId: number | null;
  startX: number;
  startY: number;
  startScrollLeft: number;
  dragging: boolean;
  suppressClick: boolean;
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
  className = "mb-4",
}: QuestionNavChipsProps) {
  const dragRef = useRef<NavDragState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    dragging: false,
    suppressClick: false,
  });

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: event.currentTarget.scrollLeft,
      dragging: false,
      suppressClick: false,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (!drag.dragging) {
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
        drag.pointerId = null;
        return;
      }
      if (Math.abs(deltaX) <= 8) return;

      drag.dragging = true;
      drag.suppressClick = true;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        /* Pointer capture is unavailable in a few embedded webviews. */
      }
    }

    event.preventDefault();
    event.currentTarget.scrollLeft = drag.startScrollLeft - deltaX;
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    if (drag.dragging) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        /* Pointer capture may already have been released by the browser. */
      }
    }
    drag.pointerId = null;
    drag.dragging = false;
  }

  function handleClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!dragRef.current.suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.suppressClick = false;
  }

  return (
    <div
      ref={navRef}
      className={`question-nav-scroll flex gap-2 overflow-x-auto overflow-y-hidden pb-0 sm:pb-2 ${className}`}
      data-tour={dataTour}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClickCapture={handleClickCapture}
      style={{
        maskImage:
          showLeftFade && showRightFade
            ? "linear-gradient(to right, transparent 0%, var(--color-mask) 8%, var(--color-mask) 92%, transparent 100%)"
            : showLeftFade
              ? "linear-gradient(to right, transparent 0%, var(--color-mask) 8%, var(--color-mask) 100%)"
              : showRightFade
                ? "linear-gradient(to right, var(--color-mask) 0%, var(--color-mask) 92%, transparent 100%)"
                : undefined,
      }}
    >
      {questions.map((q, i) => {
        const result = questionResults?.[q.id];
        const isAnswered = answers[q.id] && answers[q.id].trim() !== "";
        const isChecked = !!checkedQuestions?.[q.id];
        const isCurrent = i === currentIndex;
        let cls =
          "size-[42px] rounded-md text-xs font-mono flex items-center justify-center border shrink-0 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition cursor-pointer";
        if (isCurrent) cls += " bg-accent text-on-accent border-accent";
        else if (result === "correct")
          cls += " bg-correct-bg border-correct-border text-correct-fg";
        else if (result === "incorrect")
          cls += " bg-incorrect-bg border-incorrect-border text-incorrect-fg";
        else if (result === "pending" || isChecked)
          cls += " bg-pending-bg border-pending-border text-pending-fg";
        else if (isAnswered)
          cls += " bg-pending-bg border-pending-border text-pending-fg";
        else cls += " border-border text-fg-muted hover:border-fg-muted";
        const direction =
          i > currentIndex ? "next" : i < currentIndex ? "prev" : undefined;
        return (
          <button
            type="button"
            key={q.id}
            data-cuelume-press="page"
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
