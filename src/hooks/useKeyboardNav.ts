import { useEffect, type RefObject } from "react";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";

type EventData = Record<string, string | number | boolean | undefined | null>;

interface KeyboardNavOpts {
  enabledRef: RefObject<boolean>;
  questionsLength: number;
  currentIndexRef: RefObject<number>;
  setCurrentIndex: (i: number) => void;
  scrollToNav: (i: number) => void;
  setDirection: (d: "next" | "prev" | undefined) => void;
  eventName: "practice_navigate" | "exam_navigate";
  eventData: () => EventData;
}

export function useKeyboardNav(opts: KeyboardNavOpts): void {
  const {
    enabledRef,
    questionsLength,
    currentIndexRef,
    setCurrentIndex,
    scrollToNav,
    setDirection,
    eventName,
    eventData,
  } = opts;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (!enabledRef.current) return;
      const idx = currentIndexRef.current;
      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        const nextIndex = idx - 1;
        triggerLight();
        setDirection("prev");
        track(eventName, {
          ...eventData(),
          direction: "prev",
          fromIndex: idx,
          toIndex: nextIndex,
          source: "keyboard",
        });
        setCurrentIndex(nextIndex);
        scrollToNav(nextIndex);
      } else if (e.key === "ArrowRight" && idx < questionsLength - 1) {
        e.preventDefault();
        const nextIndex = idx + 1;
        triggerLight();
        setDirection("next");
        track(eventName, {
          ...eventData(),
          direction: "next",
          fromIndex: idx,
          toIndex: nextIndex,
          source: "keyboard",
        });
        setCurrentIndex(nextIndex);
        scrollToNav(nextIndex);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enabledRef,
    questionsLength,
    currentIndexRef,
    setCurrentIndex,
    scrollToNav,
    setDirection,
    eventName,
    eventData,
  ]);
}
