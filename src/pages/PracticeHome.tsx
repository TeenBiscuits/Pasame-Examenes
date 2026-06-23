import { Link, useParams } from "react-router-dom";
import { getSubject, getQuestionsByTopic } from "../subjects";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";

export default function PracticeHome() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const t = useT();
  const subject = subjectId ? getSubject(subjectId) : undefined;
  useDocumentTitle(
    subject
      ? `${t.practiceHome.title} \u2014 ${subject.name} \u2014 ${t.home.title}`
      : t.home.title,
  );

  if (!subject) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in animate-duration-fast">
      <h1 className="text-2xl font-bold text-fg mb-2">
        {t.practiceHome.title}
      </h1>
      <p className="text-fg-muted mb-8">{t.practiceHome.subtitle}</p>

      {subject.megatopics ? (
        <>
          {subject.megatopics.map((mt) => {
            const mtTopics = subject.topics.filter((t) =>
              mt.topics.includes(t.key),
            );
            if (mtTopics.length === 0) return null;
            return (
              <div key={mt.key} className="mb-8">
                <h2 className="text-md font-medium text-fg-secondary mt-2 mb-3">
                  {mt.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mtTopics.map((topic) => {
                    const qs = getQuestionsByTopic(subject.id, topic.key);
                    return (
                      <Link
                        key={topic.key}
                        to={`/${subject.id}/practice/${topic.key}`}
                        className="block p-5 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors transition-transform duration-200"
                        onClick={() => {
                          triggerLight();
                          track("practice_topic_click", {
                            subjectId: subject.id,
                            topic: topic.key,
                          });
                        }}
                      >
                        <div
                          className="text-2xl mb-2"
                          role="img"
                          aria-hidden="true"
                        >
                          {topic.icon}
                        </div>
                        <h2 className="font-semibold text-fg text-sm">
                          {topic.label}
                        </h2>
                        <p className="text-xs text-fg-muted mt-1">
                          {qs.length} {t.subjectCard.questions} &middot;{" "}
                          {qs.reduce((s, q) => s + q.points, 0)}{" "}
                          {t.subjectCard.points}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {(() => {
            const groupedKeys = new Set(
              subject.megatopics.flatMap((mt) => mt.topics),
            );
            const ungrouped = subject.topics.filter(
              (t) => !groupedKeys.has(t.key),
            );
            if (ungrouped.length === 0) return null;
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {ungrouped.map((topic) => {
                  const qs = getQuestionsByTopic(subject.id, topic.key);
                  return (
                    <Link
                      key={topic.key}
                      to={`/${subject.id}/practice/${topic.key}`}
                      className="block p-5 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors transition-transform duration-200"
                      onClick={() => {
                        triggerLight();
                        track("practice_topic_click", {
                          subjectId: subject.id,
                          topic: topic.key,
                        });
                      }}
                    >
                      <div
                        className="text-2xl mb-2"
                        role="img"
                        aria-hidden="true"
                      >
                        {topic.icon}
                      </div>
                      <h2 className="font-semibold text-fg text-sm">
                        {topic.label}
                      </h2>
                      <p className="text-xs text-fg-muted mt-1">
                        {qs.length} {t.subjectCard.questions} &middot;{" "}
                        {qs.reduce((s, q) => s + q.points, 0)}{" "}
                        {t.subjectCard.points}
                      </p>
                    </Link>
                  );
                })}
              </div>
            );
          })()}
        </>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${subject.topics.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
        >
          {subject.topics.map((topic) => {
            const qs = getQuestionsByTopic(subject.id, topic.key);
            return (
              <Link
                key={topic.key}
                to={`/${subject.id}/practice/${topic.key}`}
                className="block p-5 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors transition-transform duration-200"
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
                <h2 className="font-semibold text-fg text-sm">{topic.label}</h2>
                <p className="text-xs text-fg-muted mt-1">
                  {qs.length} {t.subjectCard.questions} &middot;{" "}
                  {qs.reduce((s, q) => s + q.points, 0)} {t.subjectCard.points}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
