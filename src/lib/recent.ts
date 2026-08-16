const STORAGE_KEY = "recent-subjects:v1";
const MAX_RECENT = 3;
const CHANGE_EVENT = "recent-subjects-change";
const EMPTY_RECENT_SUBJECTS: string[] = [];
let cachedValue: string | null | undefined;
let cachedSubjects = EMPTY_RECENT_SUBJECTS;

function notifyRecentSubjectsChanged() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getRecentSubjects(): string[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === cachedValue) return cachedSubjects;
    cachedValue = value;
    const parsed: unknown = value ? JSON.parse(value) : [];
    cachedSubjects = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : EMPTY_RECENT_SUBJECTS;
    return cachedSubjects;
  } catch {
    return EMPTY_RECENT_SUBJECTS;
  }
}

export function getServerRecentSubjects(): string[] {
  return EMPTY_RECENT_SUBJECTS;
}

export function subscribeToRecentSubjects(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function recordSubjectClick(subjectId: string) {
  try {
    const recent = getRecentSubjects().filter((id) => id !== subjectId);
    recent.unshift(subjectId);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
    notifyRecentSubjectsChanged();
  } catch {
    /* localStorage unavailable */
  }
}

export function clearRecentSubjects() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyRecentSubjectsChanged();
  } catch {
    /* localStorage unavailable */
  }
}
