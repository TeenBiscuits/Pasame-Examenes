import { driver, type DriveStep } from "driver.js";
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

export function startPracticeTour(
  steps: DriveStep[],
  buttonTexts: TourButtonTexts,
): boolean {
  if (hasSeenTour(PRACTICE_TOUR_KEY)) return false;
  const driverObj = driver({
    showProgress: true,
    animate: true,
    smoothScroll: true,
    popoverOffset: 24,
    stagePadding: 4,
    popoverClass: "tour-popover",
    nextBtnText: buttonTexts.next,
    prevBtnText: buttonTexts.previous,
    doneBtnText: buttonTexts.done,
    steps,
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
    animate: true,
    smoothScroll: true,
    popoverOffset: 24,
    stagePadding: 4,
    popoverClass: "tour-popover",
    nextBtnText: buttonTexts.next,
    prevBtnText: buttonTexts.previous,
    doneBtnText: buttonTexts.done,
    steps,
    onDestroyed: () => markTourSeen(EXAM_TOUR_KEY),
  });
  driverObj.drive();
  return true;
}
