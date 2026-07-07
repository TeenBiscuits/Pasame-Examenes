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
      className="file-card block p-5 ps-7 transition duration-200 hover:-translate-y-0.5"
      onClick={() => {
        triggerLight();
        track("subject_card_click", {
          subjectId: subject.id,
          location: "grid",
        });
        recordSubjectClick(subject.id);
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-2xl border border-border bg-surface text-2xl" aria-hidden="true">
          {subject.icon}
        </span>
        <div className="flex items-center gap-2">
          <ContentPolicyIcon subject={subject} />
          <span className="inline-flex h-7 items-center rounded-full border border-border bg-code px-2.5 font-mono text-xs font-bold text-fg-secondary">
            {subject.courseCode}
          </span>
        </div>
      </div>
      <h2 className="mb-1 text-lg font-semibold leading-snug tracking-tight text-fg">
        {subject.name}
      </h2>
      <p className="mb-5 text-sm text-fg-muted">{subject.university}</p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-3 font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-fg-muted">
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
