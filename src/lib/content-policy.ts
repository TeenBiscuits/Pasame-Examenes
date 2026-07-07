import type { SubjectMeta } from "../data/types";

export function hasAuthorizedExamContent(subject: SubjectMeta): boolean {
  return subject.contentPolicy === "authorized-exams";
}
