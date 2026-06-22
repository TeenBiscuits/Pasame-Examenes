import { Link, useParams } from "react-router-dom";
import { getSubject, getQuestionsByTopic } from "../subjects";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { useHaptics } from "../lib/haptics";

export default function PracticeHome() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const t = useT();
  const { triggerLight } = useHaptics();
  const subject = subjectId ? getSubject(subjectId) : undefined;

  if (!subject) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {t.practiceHome.title}
      </h1>
      <p className="text-gray-500 mb-8">{t.practiceHome.subtitle}</p>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${subject.topics.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
      >
        {subject.topics.map((topic) => {
          const qs = getQuestionsByTopic(subject.id, topic.key);
          return (
            <Link
              key={topic.key}
              to={`/${subject.id}/practice/${topic.key}`}
              className="block p-5 rounded-xl border-2 border-gray-200 hover:border-green-400 bg-white hover:bg-green-50/30 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition-colors duration-200"
              onClick={() => {
                triggerLight();
                track("practice_topic_click", {
                  subjectId: subject.id,
                  topic: topic.key,
                });
              }}
            >
              <div className="text-2xl mb-2" role="img" aria-hidden="true">
                {topic.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {topic.label}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {qs.length} {t.subjectCard.questions} &middot;{" "}
                {qs.reduce((s, q) => s + q.points, 0)} {t.subjectCard.points}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
