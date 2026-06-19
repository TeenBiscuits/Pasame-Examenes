import { useParams, Link } from "react-router-dom";
import { getSubject, getAllQuestions } from "../subjects";
import { getTopicProgress } from "../data/store";
import TopicCard from "../components/TopicCard";

export default function SubjectHome() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const subject = subjectId ? getSubject(subjectId) : undefined;

  if (!subject) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Subject Not Found
        </h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const allQuestions = getAllQuestions(subject.id);
  const totalPoints = allQuestions.reduce((s, q) => s + q.points, 0);
  const progress = getTopicProgress(
    subject.id,
    allQuestions.map((q) => ({ topic: q.topic, points: q.points })),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
          {subject.courseCode} &middot; {subject.university}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {subject.name}
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Practice for {subject.name}. {totalPoints} points across{" "}
          {allQuestions.length} questions.
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Practice by Topic
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {subject.topics.map((topic) => {
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
        })}
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Full Exam Simulations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {subject.exams.map((exam) => (
          <Link
            key={exam.year}
            to={`/${subject.id}/exam/${exam.year}`}
            className="block p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-200"
          >
            <div className="text-2xl mb-2" role="img" aria-hidden="true">
              📝
            </div>
            <h3 className="font-semibold text-gray-900">{exam.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
          </Link>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-10">
        <h3 className="font-semibold text-gray-900 mb-2">
          Original Exam Documents
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Download or view the original PDF exams that these practice questions
          and simulations are based on.
        </p>
        <div className="flex flex-wrap gap-4">
          {subject.exams.map((exam) => (
            <a
              key={exam.year}
              href={`/exams/${subject.id}/Exam-${exam.year}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors duration-150"
            >
              <span role="img" aria-hidden="true">
                📄
              </span>{" "}
              {exam.title} PDF
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
