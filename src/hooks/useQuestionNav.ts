import { useState, useCallback, useRef, useEffect } from "react";
import { triggerLight } from "../lib/haptics";

export function useQuestionNav(
  questionCount: number,
  currentIndex: number,
  setCurrentIndex: (i: number) => void,
  enabled: boolean,
  trackNavigate: (
    direction: "next" | "prev",
    fromIndex: number,
    toIndex: number,
  ) => void,
) {
  const [navState, setNavState] = useState<{
    direction: "next" | "prev" | undefined;
    showLeftFade: boolean;
    showRightFade: boolean;
  }>({
    direction: undefined,
    showLeftFade: false,
    showRightFade: false,
  });
  const { direction, showLeftFade, showRightFade } = navState;

  const setDirection = (d: "next" | "prev" | undefined) => {
    setNavState((prev) => ({ ...prev, direction: d }));
  };

  const navRef = useRef<HTMLDivElement>(null);

  const scrollToNav = useCallback((index: number) => {
    const container = navRef.current;
    if (!container) return;
    const btn = container.children[index] as HTMLElement | undefined;
    if (!btn) return;
    requestAnimationFrame(() => {
      const cr = container.getBoundingClientRect();
      const br = btn.getBoundingClientRect();
      const step = 108;
      if (br.right > cr.right - 84)
        container.scrollBy({ left: step, behavior: "smooth" });
      else if (br.left < cr.left + 84)
        container.scrollBy({ left: -step, behavior: "smooth" });
    });
  }, []);

  const currentIndexRef = useRef(currentIndex);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
    enabledRef.current = enabled;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabledRef.current) return;
      const tag = document.activeElement?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      const idx = currentIndexRef.current;
      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        const nextIndex = idx - 1;
        triggerLight();
        setNavState((prev) => ({ ...prev, direction: "prev" }));
        trackNavigate("prev", idx, nextIndex);
        setCurrentIndex(nextIndex);
        scrollToNav(nextIndex);
      } else if (e.key === "ArrowRight" && idx < questionCount - 1) {
        e.preventDefault();
        const nextIndex = idx + 1;
        triggerLight();
        setNavState((prev) => ({ ...prev, direction: "next" }));
        trackNavigate("next", idx, nextIndex);
        setCurrentIndex(nextIndex);
        scrollToNav(nextIndex);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [questionCount, trackNavigate, setCurrentIndex, scrollToNav]);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const check = () => {
      setNavState((prev) => ({
        ...prev,
        showLeftFade: el.scrollLeft > 4,
        showRightFade: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      }));
    };
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [questionCount]);

  return {
    direction,
    setDirection,
    showLeftFade,
    showRightFade,
    navRef,
    scrollToNav,
  };
}
