const STORAGE_KEY = "recent-subjects";
const MAX_RECENT = 3;
const CHANGE_EVENT = "recent-subjects-change";
const EMPTY_RECENT: string[] = [];
let lastRaw: string | null = null;
let lastParsed: string[] = EMPTY_RECENT;

export function getRecentSubjects(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return EMPTY_RECENT;
    if (data === lastRaw) return lastParsed;
    lastRaw = data;
    lastParsed = JSON.parse(data) as string[];
    return lastParsed;
  } catch {
    return EMPTY_RECENT;
  }
}

export function recordSubjectClick(subjectId: string) {
  try {
    const recent = getRecentSubjects().filter((id) => id !== subjectId);
    recent.unshift(subjectId);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* localStorage unavailable */
  }
}

export function clearRecentSubjects() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* localStorage unavailable */
  }
}

export function subscribeRecentSubjects(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function getServerRecentSubjects(): string[] {
  return EMPTY_RECENT;
}
