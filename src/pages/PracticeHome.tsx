import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LangLink as Link } from "../lib/lang-link";
import { getSubject, getQuestionsByTopic } from "../subjects";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";

function TopicCountLink({
  subjectId,
  topicKey,
  label,
  icon,
}: {
  subjectId: string;
  topicKey: string;
  label: string;
  icon: string;
}) {
  const t = useT();
  const [counts, setCounts] = useState<{ length: number; points: number }>({
    length: 0,
    points: 0,
  });

  useEffect(() => {
    let cancelled = false;
    getQuestionsByTopic(subjectId, topicKey).then((qs) => {
      if (cancelled) return;
      setCounts({
        length: qs.length,
        points: qs.reduce((s, q) => s + q.points, 0),
      });
    });
    return () => {
      cancelled = true;
    };
  }, [subjectId, topicKey]);

  return (
    <Link
      to={`/${subjectId}/practice/${topicKey}`}
      className="block p-5 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors transition-transform duration-200"
      onClick={() => {
        triggerLight();
        track("practice_topic_click", {
          subjectId,
          topic: topicKey,
        });
      }}
    >
      <div className="text-2xl mb-2" aria-hidden="true">
        {icon}
      </div>
      <h2 className="font-semibold text-fg text-sm">{label}</h2>
      <p className="text-xs text-fg-muted mt-1">
        {counts.length} {t.subjectCard.questions} &middot; {counts.points}{" "}
        {t.subjectCard.points}
      </p>
    </Link>
  );
}

export default function PracticeHome() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const t = useT();
  const subject = subjectId ? getSubject(subjectId) : undefined;
  useDocumentTitle(
    subject
      ? `${t.practiceHome.title} \u2014 ${subject.name} \u2014 ${t.home.title}`
      : t.home.title,
  );
  useSeoHead({
    title: subject
      ? `${t.practiceHome.title} \u2014 ${subject.name}`
      : t.home.title,
    description: subject
      ? `${t.practiceHome.subtitle} \u2014 ${subject.name} (${subject.courseCode})`
      : t.seo.defaultDescription,
    pathWithoutLang: subject ? `/${subject.id}/practice` : "/",
  });

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
                  {mtTopics.map((topic) => (
                    <TopicCountLink
                      key={topic.key}
                      subjectId={subject.id}
                      topicKey={topic.key}
                      label={topic.label}
                      icon={topic.icon}
                    />
                  ))}
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
                {ungrouped.map((topic) => (
                  <TopicCountLink
                    key={topic.key}
                    subjectId={subject.id}
                    topicKey={topic.key}
                    label={topic.label}
                    icon={topic.icon}
                  />
                ))}
              </div>
            );
          })()}
        </>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${subject.topics.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
        >
          {subject.topics.map((topic) => (
            <TopicCountLink
              key={topic.key}
              subjectId={subject.id}
              topicKey={topic.key}
              label={topic.label}
              icon={topic.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
}
