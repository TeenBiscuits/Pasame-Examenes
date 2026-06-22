import { useParams, Link } from "react-router-dom";
import { getSubject, getAllQuestions } from "../subjects";
import { getTopicProgress } from "../data/store";
import TopicCard from "../components/TopicCard";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SubjectHome() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const t = useT();
  const subject = subjectId ? getSubject(subjectId) : undefined;

  if (!subject) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {t.subjectHome.notFound}
        </h1>
        <Link
          to="/"
          className="text-primary hover:underline"
          onClick={() => triggerLight()}
        >
          {t.subjectHome.returnHome}
        </Link>
      </div>
    );
  }

  const allQuestions = getAllQuestions(subject.id);
  const progress = getTopicProgress(
    subject.id,
    allQuestions.map((q) => ({ topic: q.topic, points: q.points })),
  );

  const description = t.subjectHome.description
    .replace("{count}", String(allQuestions.length))
    .replace("{exams}", String(subject.exams.length));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in animate-duration-fast">
      <div className="text-center mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
          {subject.courseCode} &middot; {subject.university}
        </p>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {subject.name}
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">{description}</p>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">
        {t.subjectHome.practiceByTopic}
      </h2>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ${subject.topics.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
      >
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

      <h2 className="text-lg font-semibold text-foreground mb-4">
        {t.subjectHome.examSimulations}
      </h2>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ${subject.exams.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
      >
        {subject.exams.map((exam) => (
          <Link
            key={exam.year}
            to={`/${subject.id}/exam/${exam.year}`}
            className="block hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none rounded-xl transition-transform duration-200"
            onClick={() => {
              triggerLight();
              track("exam_card_click", {
                subjectId: subject.id,
                year: exam.year,
              });
            }}
          >
            <Card className="hover:ring-primary/30 transition-shadow">
              <CardContent className="pt-(--card-spacing)">
                <div className="text-2xl mb-2" role="img" aria-hidden="true">
                  📝
                </div>
                <h3 className="font-semibold text-foreground">{exam.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {exam.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {subject.exams.some((exam) => exam.hasPdf !== false) && (
        <Card className="mb-10">
          <CardContent className="pt-(--card-spacing)">
            <h3 className="font-semibold text-foreground mb-2">
              {t.subjectHome.originalExams}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t.subjectHome.examDocsDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              {subject.exams
                .filter((exam) => exam.hasPdf !== false)
                .map((exam) => (
                  <Button
                    key={exam.year}
                    variant="outline"
                    asChild
                    className="text-primary border-primary/30 hover:bg-primary/10"
                  >
                    <a
                      href={`/exams/${subject.id}/Exam-${exam.year}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
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
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {subject.acknowledgments && (
        <div className="text-right text-sm text-muted-foreground mt-10">
          <p className="font-semibold text-foreground/80 mb-1">
            {t.subjectHome.acknowledgments}
          </p>
          <p>{subject.acknowledgments}</p>
        </div>
      )}
    </div>
  );
}
