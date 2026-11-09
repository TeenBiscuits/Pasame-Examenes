const STORAGE_KEY_DISMISSED = "star_popup_dismissed";
const STORAGE_KEY_VISITS = "star_popup_visits";
const MIN_VISITS = 5;
const SHOW_CHANCE = 0.2;
const COOLDOWN_DAYS = 7;

export function shouldShowRandomStarPopup(): boolean {
	try {
		const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
		if (dismissed) {
			const timestamp = Number(dismissed);
			const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
			if (daysSince < COOLDOWN_DAYS) return false;
		}

		const visits = Number(localStorage.getItem(STORAGE_KEY_VISITS) || "0") + 1;
		localStorage.setItem(STORAGE_KEY_VISITS, String(visits));

		return visits >= MIN_VISITS && Math.random() < SHOW_CHANCE;
	} catch {
		return false;
	}
}

export function writeStarPopupDismissed() {
	try {
		localStorage.setItem(STORAGE_KEY_DISMISSED, String(Date.now()));
	} catch {
		/* localStorage unavailable */
	}
}

// Persist only the first five question identities, shared across subjects and sessions.
const QUESTIONS_KEY = "star_popup_first_questions";
const MILESTONE_KEY = "star_popup_first_questions_shown";
const FIRST_QUESTIONS = 5;
export const STAR_POPUP_PROGRESS_EVENT = "star-popup-progress";

function readQuestions(): string[] {
	const value: unknown = JSON.parse(
		localStorage.getItem(QUESTIONS_KEY) || "[]",
	);
	return Array.isArray(value)
		? [
				...new Set(value.filter((id): id is string => typeof id === "string")),
			].slice(0, FIRST_QUESTIONS)
		: [];
}

export function recordStarPopupQuestions(
	subjectId: string,
	questionIds: string[],
) {
	try {
		if (localStorage.getItem(MILESTONE_KEY)) return;
		const questions = readQuestions();
		for (const questionId of questionIds) {
			if (questions.length >= FIRST_QUESTIONS) break;
			const key = JSON.stringify([subjectId, questionId]);
			if (!questions.includes(key)) questions.push(key);
		}
		localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
		window.dispatchEvent(new Event(STAR_POPUP_PROGRESS_EVENT));
	} catch {
		/* Storage unavailable: studying must still work. */
	}
}

// The milestone is independent of the random prompt's seven-day cooldown.
export function claimStarPopupMilestone(): boolean {
	try {
		if (localStorage.getItem(MILESTONE_KEY)) return false;
		if (readQuestions().length < FIRST_QUESTIONS) return false;
		localStorage.setItem(MILESTONE_KEY, "true");
		return true;
	} catch {
		return false;
	}
}
