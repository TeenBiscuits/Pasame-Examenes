import { useEffect, type RefObject } from "react";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { playPress } from "../lib/sound";

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
  onKeyPress?: (direction: "prev" | "next") => void;
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
    onKeyPress,
  } = opts;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (!enabledRef.current) return;
      const idx = currentIndexRef.current;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        triggerLight();
        playPress();
        onKeyPress?.("prev");
        if (idx > 0) {
          const nextIndex = idx - 1;
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
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        triggerLight();
        playPress();
        onKeyPress?.("next");
        if (idx < questionsLength - 1) {
          const nextIndex = idx + 1;
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
    onKeyPress,
  ]);
}
