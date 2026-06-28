import { useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { LangLink as Link } from "../lib/lang-link";
import { getSubject, getAllQuestions } from "../subjects";
import { getTopicProgress } from "../data/store";
import TopicCard from "../components/TopicCard";
import AddExamModal, {
  type AddExamModalHandle,
} from "../components/AddExamModal";
import type { Question, Topic } from "../data/types";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";

export default function SubjectHome() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const t = useT();
  const examModalRef = useRef<AddExamModalHandle>(null);
  const subject = subjectId ? getSubject(subjectId) : undefined;
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  useDocumentTitle(
    subject ? `${subject.name} \u2014 ${t.home.title}` : t.home.title,
  );

  useEffect(() => {
    if (subject) {
      getAllQuestions(subject.id).then(setAllQuestions);
    }
  }, [subject]);

  const seoDescription = useMemo(() => {
    if (!subject) return t.seo.defaultDescription;
    const repeatedCount = allQuestions.filter((q) => q.repeated).length;
    const repeatedText =
      repeatedCount >= 20
        ? ` (${t.subjectHome.repeatedSuffix.replace("{count}", String(repeatedCount))})`
        : "";
    const desc = t.subjectHome.description
      .replace("{count}", String(allQuestions.length))
      .replace("{repeated}", repeatedText)
      .replace("{exams}", String(subject.exams.length));
    const clean = desc.replace(/`/g, "");
    return `${subject.name} (${subject.courseCode}) \u2014 ${clean} \u2014 ${subject.university}`;
  }, [subject, allQuestions, t]);

  useSeoHead({
    title: subject ? `${subject.name} \u2014 ${t.home.title}` : t.home.title,
    description: seoDescription,
    pathWithoutLang: subject ? `/${subject.id}` : "/",
  });

  if (!subject) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-fg mb-4">
          {t.subjectHome.notFound}
        </h1>
        <Link
          to="/"
          className="text-accent hover:underline"
          onClick={() => triggerLight()}
        >
          {t.subjectHome.returnHome}
        </Link>
      </div>
    );
  }

  const repeatedCount = allQuestions.filter((q) => q.repeated).length;
  const progress = getTopicProgress(
    subject.id,
    allQuestions.map((q) => ({ topic: q.topic, points: q.points })),
  );

  const repeatedText =
    repeatedCount >= 20
      ? ` (${t.subjectHome.repeatedSuffix.replace("{count}", String(repeatedCount))})`
      : "";

  const description = t.subjectHome.description
    .replace("{count}", String(allQuestions.length))
    .replace("{repeated}", repeatedText)
    .replace("{exams}", String(subject.exams.length));

  const renderTopicCard = (topic: Topic) => {
    const topicQs = allQuestions.filter((q) => q.topic === topic.key);
    const tp = progress[topic.key];
    const progressPct =
      tp && tp.total > 0 ? (tp.attempted / tp.total) * 100 : 0;
    return (
      <TopicCard
        key={topic.key}
        subjectId={subject.id}
        topic={topic}
        questionCount={topicQs.length}
        pointsCount={topicQs.reduce((s, q) => s + q.points, 0)}
        progress={progressPct}
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in animate-duration-fast">
      <div className="text-center mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-fg-muted mb-3">
          {subject.courseCode} &middot; {subject.university}
        </p>
        <h1 className="text-3xl font-semibold text-fg mb-3">{subject.name}</h1>
        <p className="text-fg-secondary max-w-xl mx-auto">{description}</p>
      </div>

      <h2 className="text-lg font-semibold text-fg mb-4">
        {t.subjectHome.practiceByTopic}
      </h2>

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
                  {mtTopics.map(renderTopicCard)}
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
              <div className="mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ungrouped.map(renderTopicCard)}
                </div>
              </div>
            );
          })()}
        </>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ${subject.topics.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
        >
          {subject.topics.map(renderTopicCard)}
        </div>
      )}

      <h2 className="text-lg font-semibold text-fg mb-4">
        {t.subjectHome.examSimulations}
      </h2>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ${subject.exams.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
      >
        {subject.exams.map((exam) => (
          <Link
            key={exam.year}
            to={`/${subject.id}/exam/${exam.year}`}
            className="block p-6 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors transition-transform duration-200"
            onClick={() => {
              triggerLight();
              track("exam_card_click", {
                subjectId: subject.id,
                year: exam.year,
              });
            }}
          >
            <div className="text-2xl mb-2" aria-hidden="true">
              📝
            </div>
            <h2 className="font-semibold text-fg">{exam.title}</h2>
            <p className="text-sm text-fg-muted mt-1">{exam.description}</p>
          </Link>
        ))}
        <button
          type="button"
          onClick={() => {
            triggerLight();
            examModalRef.current?.open();
          }}
          className="block w-full p-6 rounded-xl border-2 border-dashed border-border text-fg-muted hover:text-accent hover:border-accent hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md transition-colors transition-transform duration-200"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-4xl font-light leading-none">+</span>
            <span className="text-sm font-medium">{t.subjectHome.addExam}</span>
          </div>
        </button>
      </div>

      <AddExamModal
        ref={examModalRef}
        onClose={() => {}}
        subjectId={subject.id}
        subjectName={subject.name}
      />

      {subject.exams.some((exam) => exam.hasPdf !== false) && (
        <div className="bg-surface rounded-xl p-6 border border-border mb-10">
          <h3 className="font-semibold text-fg mb-2">
            {t.subjectHome.originalExams}
          </h3>
          <p className="text-sm text-fg-secondary mb-4">
            {t.subjectHome.examDocsDescription}
          </p>
          <div className="flex flex-wrap gap-4">
            {subject.exams.flatMap((exam) =>
              exam.hasPdf === false
                ? []
                : [
                    <a
                      key={exam.year}
                      href={`/exams/${subject.id}/Exam-${exam.year}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-fg bg-accent-light border border-accent-border rounded-lg hover:bg-accent-light active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition duration-150"
                      onClick={() => {
                        triggerLight();
                        track("file-download", {
                          file: `Exam-${exam.year}.pdf`,
                          subjectId: subject.id,
                          year: exam.year,
                        });
                      }}
                    >
                      <span aria-hidden="true">📄</span> {exam.title}{" "}
                      {t.subjectHome.pdf}
                    </a>,
                  ],
            )}
          </div>
        </div>
      )}

      {subject.acknowledgments && (
        <div className="text-right text-sm text-fg-muted mt-10">
          <p className="font-semibold text-fg-muted mb-1">
            {t.subjectHome.acknowledgments}
          </p>
          <p>{subject.acknowledgments}</p>
        </div>
      )}
    </div>
  );
}
