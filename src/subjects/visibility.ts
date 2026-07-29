const SECRET_SUBJECT_IDS = new Set(["espain"]);

export function isPublicSubject(subjectId: string): boolean {
  return !SECRET_SUBJECT_IDS.has(subjectId);
}
