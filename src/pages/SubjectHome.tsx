import { useParams, Link } from "react-router-dom";
import { getSubject, getAllQuestions } from "../subjects";
import { getTopicProgress } from "../data/store";
import TopicCard from "../components/TopicCard";
import type { Topic } from "../data/types";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";

export default function SubjectHome() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const t = useT();
  const subject = subjectId ? getSubject(subjectId) : undefined;

  if (!subject) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {t.subjectHome.notFound}
        </h1>
        <Link
          to="/"
          className="text-green-600 hover:underline"
          onClick={() => triggerLight()}
        >
          {t.subjectHome.returnHome}
        </Link>
      </div>
    );
  }

  const allQuestions = getAllQuestions(subject.id);
  const repeatedCount = allQuestions.filter((q) => q.repeated).length;
  const progress = getTopicProgress(
    subject.id,
    allQuestions.map((q) => ({ topic: q.topic, points: q.points })),
  );

  const repeatedText =
    repeatedCount > 0
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
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
          {subject.courseCode} &middot; {subject.university}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {subject.name}
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">{description}</p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                <h3 className="text-md font-medium text-gray-700 mt-2 mb-3">
                  {mt.label}
                </h3>
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

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t.subjectHome.examSimulations}
      </h2>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ${subject.exams.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
      >
        {subject.exams.map((exam) => (
          <Link
            key={exam.year}
            to={`/${subject.id}/exam/${exam.year}`}
            className="block p-6 rounded-xl border-2 border-gray-200 hover:border-green-400 bg-white hover:bg-green-50/30 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition-colors transition-transform duration-200"
            onClick={() => {
              triggerLight();
              track("exam_card_click", {
                subjectId: subject.id,
                year: exam.year,
              });
            }}
          >
            <div className="text-2xl mb-2" role="img" aria-hidden="true">
              📝
            </div>
            <h3 className="font-semibold text-gray-900">{exam.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
          </Link>
        ))}
      </div>

      {subject.exams.some((exam) => exam.hasPdf !== false) && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-10">
          <h3 className="font-semibold text-gray-900 mb-2">
            {t.subjectHome.originalExams}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t.subjectHome.examDocsDescription}
          </p>
          <div className="flex flex-wrap gap-4">
            {subject.exams
              .filter((exam) => exam.hasPdf !== false)
              .map((exam) => (
                <a
                  key={exam.year}
                  href={`/exams/${subject.id}/Exam-${exam.year}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 active:scale-95 focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:outline-none transition duration-150"
                  onClick={() => {
                    triggerLight();
                    track("pdf_download", {
                      subjectId: subject.id,
                      year: exam.year,
                    });
                  }}
                >
                  <span role="img" aria-hidden="true">
                    📄
                  </span>{" "}
                  {exam.title} {t.subjectHome.pdf}
                </a>
              ))}
          </div>
        </div>
      )}

      {subject.acknowledgments && (
        <div className="text-right text-sm text-gray-400 mt-10">
          <p className="font-semibold text-gray-500 mb-1">
            {t.subjectHome.acknowledgments}
          </p>
          <p>{subject.acknowledgments}</p>
        </div>
      )}
    </div>
  );
}
