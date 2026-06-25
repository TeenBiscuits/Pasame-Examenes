const STORAGE_KEY = "recent-subjects";
const MAX_RECENT = 3;

export function getRecentSubjects(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function recordSubjectClick(subjectId: string) {
  try {
    const recent = getRecentSubjects().filter((id) => id !== subjectId);
    recent.unshift(subjectId);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch {
    /* localStorage unavailable */
  }
}
