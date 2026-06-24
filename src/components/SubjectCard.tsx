import { LangLink as Link } from "../lib/lang-link";
import type { SubjectMeta } from "../data/types";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";

interface SubjectCardProps {
  subject: SubjectMeta;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const t = useT();

  return (
    <Link
      to={`/${subject.id}`}
      className="block p-5 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors transition-transform duration-200"
      onClick={() => {
        triggerLight();
        track("subject_card_click", { subjectId: subject.id });
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl" aria-hidden="true">
          {subject.icon}
        </span>
        <span className="text-xs font-mono font-semibold bg-code text-fg-secondary px-2 py-0.5 rounded">
          {subject.courseCode}
        </span>
      </div>
      <h2 className="font-semibold text-fg text-base mb-1">{subject.name}</h2>
      <p className="text-sm text-fg-muted mb-4">{subject.university}</p>
      <div className="text-xs text-fg-muted flex items-center gap-2">
        <span>
          {subject.topics.length} {t.subjectCard.questions}
        </span>
        <span>&middot;</span>
        <span>
          {subject.exams.length} {t.subjectCard.exams}
        </span>
      </div>
    </Link>
  );
}
