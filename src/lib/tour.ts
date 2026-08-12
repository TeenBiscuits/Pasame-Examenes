import { driver, type DriveStep, type PopoverDOM } from "driver.js";
import "driver.js/dist/driver.css";

const PRACTICE_TOUR_KEY = "has-seen-practice-tour";
const EXAM_TOUR_KEY = "has-seen-exam-tour";

export interface TourButtonTexts {
  next: string;
  previous: string;
  done: string;
}

function hasSeenTour(key: string): boolean {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function markTourSeen(key: string): void {
  try {
    localStorage.setItem(key, "true");
  } catch {
    /* localStorage unavailable */
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function addTourSounds(
  popover: PopoverDOM,
  isLastStep: boolean,
) {
  popover.previousButton.dataset.cuelumeToggle = "page";
  popover.nextButton.dataset.cuelumeToggle = isLastStep ? "success" : "page";
  popover.closeButton.dataset.cuelumeToggle = "droplet";
}

export function startPracticeTour(
  steps: DriveStep[],
  buttonTexts: TourButtonTexts,
): boolean {
  if (hasSeenTour(PRACTICE_TOUR_KEY)) return false;
  const driverObj = driver({
    showProgress: true,
    animate: !prefersReducedMotion(),
    popoverClass: "tour-popover",
    nextBtnText: buttonTexts.next,
    prevBtnText: buttonTexts.previous,
    doneBtnText: buttonTexts.done,
    steps,
    onPopoverRender: (popover, { driver: driverObj }) =>
      addTourSounds(popover, driverObj.isLastStep()),
    onDestroyed: () => markTourSeen(PRACTICE_TOUR_KEY),
  });
  driverObj.drive();
  return true;
}

export function startExamTour(
  steps: DriveStep[],
  buttonTexts: TourButtonTexts,
): boolean {
  if (hasSeenTour(EXAM_TOUR_KEY)) return false;
  const driverObj = driver({
    showProgress: true,
    animate: !prefersReducedMotion(),
    popoverClass: "tour-popover",
    nextBtnText: buttonTexts.next,
    prevBtnText: buttonTexts.previous,
    doneBtnText: buttonTexts.done,
    steps,
    onPopoverRender: (popover, { driver: driverObj }) =>
      addTourSounds(popover, driverObj.isLastStep()),
    onDestroyed: () => markTourSeen(EXAM_TOUR_KEY),
  });
  driverObj.drive();
  return true;
}
