import { useState, useEffect } from "react";
import { LangLink as Link } from "../lib/lang-link";
import type { SubjectMeta } from "../data/types";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { recordSubjectClick } from "../lib/recent";
import { getAllQuestions } from "../subjects";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import ContentPolicyIcon from "./ContentPolicyIcon";

interface SubjectCardProps {
  subject: SubjectMeta;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const t = useT();
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const availableExamCount = subject.exams.filter(
    (exam) => !exam.deleteRights,
  ).length;
  const examCountLabel = hasAuthorizedExamContent(subject)
    ? t.subjectCard.exams
    : t.subjectCard.practiceSets;

  useEffect(() => {
    let mounted = true;
    getAllQuestions(subject.id).then((qs) => {
      if (mounted) setQuestionCount(qs.length);
    });
    return () => {
      mounted = false;
    };
  }, [subject.id]);

  return (
    <Link
      to={`/${subject.id}`}
      className="border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 focus-visible:ring-accent block rounded-xl border-2 p-5 transition-colors transition-transform duration-200 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      onClick={() => {
        triggerLight();
        track("subject_card_click", {
          subjectId: subject.id,
          location: "grid",
        });
        recordSubjectClick(subject.id);
      }}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-2xl" aria-hidden="true">
          {subject.icon}
        </span>
        <div className="flex items-center gap-2">
          <ContentPolicyIcon subject={subject} />
          <span className="bg-code text-fg-secondary inline-flex h-6 items-center rounded px-2 font-mono text-xs font-semibold">
            {subject.courseCode}
          </span>
        </div>
      </div>
      <h2 className="text-fg mb-1 text-base font-semibold">{subject.name}</h2>
      <p className="text-fg-muted mb-4 text-sm">{subject.university}</p>
      <div className="text-fg-muted flex items-center gap-2 text-xs">
        <span>
          {questionCount !== null ? questionCount : "..."}{" "}
          {t.subjectCard.questions}
        </span>
        <span>&middot;</span>
        <span>
          {subject.topics.length} {t.subjectCard.topics}
        </span>
        <span>&middot;</span>
        <span>
          {availableExamCount} {examCountLabel}
        </span>
      </div>
    </Link>
  );
}
