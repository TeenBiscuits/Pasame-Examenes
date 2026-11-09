import assert from "node:assert/strict";
import {
	claimStarPopupMilestone,
	recordStarPopupQuestions,
	shouldShowRandomStarPopup,
	STAR_POPUP_PROGRESS_EVENT,
	writeStarPopupDismissed,
} from "../src/lib/star-popup";

const data = new Map<string, string>();
const events = new EventTarget();
Object.defineProperty(globalThis, "localStorage", {
	configurable: true,
	value: {
		getItem: (key: string) => data.get(key) ?? null,
		setItem: (key: string, value: string) => data.set(key, value),
	},
});
Object.defineProperty(globalThis, "window", { configurable: true, value: events });
let notifications = 0;
events.addEventListener(STAR_POPUP_PROGRESS_EVENT, () => notifications++);

// Four distinct questions, spread across sessions; repeated checks/grades don't count.
recordStarPopupQuestions("a", ["1", "2"]);
recordStarPopupQuestions("a", ["1", "2", "3", "4"]);
assert.equal(claimStarPopupMilestone(), false);
assert.equal(JSON.parse(data.get("star_popup_first_questions")!).length, 4);
assert.equal(notifications, 2);
// The same local question ID in another subject is a different question.
writeStarPopupDismissed();
recordStarPopupQuestions("b", ["1"]);
assert.equal(claimStarPopupMilestone(), true, "milestone bypasses random cooldown");
assert.equal(claimStarPopupMilestone(), false, "milestone is consumed only once");
recordStarPopupQuestions("a", ["5", "6"]);
assert.equal(JSON.parse(data.get("star_popup_first_questions")!).length, 5);
assert.equal(claimStarPopupMilestone(), false, "later sessions cannot repeat milestone");

// An exam submission can cross the threshold in one batch.
data.clear();
recordStarPopupQuestions("exam", ["1", "2", "3", "4", "5", "6", "7"]);
recordStarPopupQuestions("exam", ["8"]);
assert.equal(claimStarPopupMilestone(), true);
assert.equal(JSON.parse(data.get("star_popup_first_questions")!).length, 5);

const random = Math.random;
try {
	data.clear();
	Math.random = () => 0;
	for (let visit = 1; visit < 5; visit++) assert.equal(shouldShowRandomStarPopup(), false);
	assert.equal(shouldShowRandomStarPopup(), true);
	Math.random = () => 0.2;
	assert.equal(shouldShowRandomStarPopup(), false, "20% boundary is unchanged");
	Math.random = () => 0.199;
	assert.equal(shouldShowRandomStarPopup(), true);
	writeStarPopupDismissed();
	assert.equal(shouldShowRandomStarPopup(), false, "dismissal starts cooldown");
	data.set("star_popup_dismissed", String(Date.now() - 7 * 86400000));
	assert.equal(shouldShowRandomStarPopup(), true, "random prompt returns after seven days");
} finally {
	Math.random = random;
}

Object.defineProperty(globalThis, "localStorage", {
	get() { throw new Error("Storage blocked"); },
});
assert.doesNotThrow(() => recordStarPopupQuestions("a", ["1"]));
assert.doesNotThrow(writeStarPopupDismissed);
assert.equal(claimStarPopupMilestone(), false);
assert.equal(shouldShowRandomStarPopup(), false);
console.log("Star popup: milestone, deduplication, persistence, random prompt and storage failure verified.");
