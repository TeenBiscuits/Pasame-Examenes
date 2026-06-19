import { Link } from "react-router-dom";
import type { SubjectMeta } from "../data/types";
import { getAllQuestions } from "../subjects";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";

interface SubjectCardProps {
  subject: SubjectMeta;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const t = useT();
  const qs = getAllQuestions(subject.id);
  const totalPoints = qs.reduce((acc, q) => acc + q.points, 0);

  return (
    <Link
      to={`/${subject.id}`}
      className="block p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-200"
      onClick={() => track("subject_card_click", { subjectId: subject.id })}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl" role="img" aria-hidden="true">
          {subject.icon}
        </span>
        <span className="text-xs font-mono font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
          {subject.courseCode}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 text-base mb-1">
        {subject.name}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{subject.university}</p>
      <div className="text-xs text-gray-400 flex items-center gap-2">
        <span>{qs.length} {t.subjectCard.questions}</span>
        <span>&middot;</span>
        <span>{totalPoints} {t.subjectCard.points}</span>
        <span>&middot;</span>
        <span>{subject.topics.length} {t.subjectCard.topics}</span>
      </div>
    </Link>
  );
}