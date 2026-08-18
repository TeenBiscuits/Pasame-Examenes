import { LangLink as Link } from "../lib/lang-link";
import type { SubjectMeta } from "../data/types";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { recordSubjectClick } from "../lib/recent";
import { prefetchSubjectPage } from "../lib/subject-prefetch";
import { subjectQuestionCounts } from "../subjects";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import ContentPolicyIcon from "./ContentPolicyIcon";

interface SubjectCardProps {
  subject: SubjectMeta;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const t = useT();
  const questionCount =
    subjectQuestionCounts[subject.id as keyof typeof subjectQuestionCounts] ??
    0;
  const availableExamCount = subject.exams.filter(
    (exam) => !exam.deleteRights,
  ).length;
  const examCountLabel = hasAuthorizedExamContent(subject)
    ? t.subjectCard.exams
    : t.subjectCard.practiceSets;

  return (
    <Link
      to={`/${subject.id}`}
      data-cuelume-hover="tick"
      data-cuelume-press
      onMouseEnter={() => prefetchSubjectPage(subject.id)}
      onFocus={() => prefetchSubjectPage(subject.id)}
      className="interactive-card focus-visible:ring-accent flex min-h-[160px] flex-col rounded-xl hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      onClick={() => {
        triggerLight();
        track("subject_card_click", {
          subjectId: subject.id,
          location: "grid",
        });
        recordSubjectClick(subject.id);
      }}
    >
      <div className="border-border bg-surface-alt flex flex-col rounded-t-xl border-x-2 border-t-2 px-5 pt-5 pb-2">
        <div className="mb-2 flex items-start justify-between">
          <span className="text-4xl leading-none" aria-hidden="true">
            {subject.icon}
          </span>
          <div className="flex items-center gap-2">
            <ContentPolicyIcon subject={subject} />
            <span className="bg-code text-fg-secondary inline-flex h-6 items-center rounded px-2 font-mono text-xs font-semibold">
              {subject.courseCode}
            </span>
          </div>
        </div>
        <h2 className="text-fg mb-0.5 text-base font-semibold">
          {subject.name}
        </h2>
        <div className="text-fg-muted flex min-w-0 items-center justify-between gap-2 text-sm">
          <span className="min-w-0 truncate" title={subject.degree}>
            {subject.degree}
          </span>
          <span className="shrink-0">
            {t.subjectCard.course.replace("{course}", String(subject.course))}
          </span>
        </div>
      </div>
      <div className="bg-card-footer border-card-footer-border text-fg flex flex-1 flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-b-xl border-x-2 border-b-2 px-5 py-1 text-xs">
        <span>
          {questionCount} {t.subjectCard.questions}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <span>
            {subject.topics.length} {t.subjectCard.topics}
          </span>
          <span aria-hidden="true">&middot;</span>
          <span>
            {availableExamCount} {examCountLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
