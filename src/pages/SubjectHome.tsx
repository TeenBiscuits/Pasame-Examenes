import { useRef, useState, useEffect, useMemo, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { LangLink as Link } from "../lib/lang-link";
import { getSubject, getAllQuestions } from "../subjects";
import { getTopicProgress } from "../data/store";
import TopicCard from "../components/TopicCard";
import AddExamModal, {
  type AddExamModalHandle,
} from "../components/AddExamModal";
import CopyrightReportModal, {
  type CopyrightReportModalHandle,
} from "../components/CopyrightReportModal";
import ContentPolicyIcon from "../components/ContentPolicyIcon";
import type { Question, SubjectMeta, Topic } from "../data/types";
import { useLang, useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";
import { buildSubjectMeta } from "../seo/meta";
import { hasAuthorizedExamContent } from "../lib/content-policy";

export default function SubjectHome() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const t = useT();
  const { lang } = useLang();
  const examModalRef = useRef<AddExamModalHandle>(null);
  const copyrightModalRef = useRef<CopyrightReportModalHandle>(null);
  const subject = subjectId ? getSubject(subjectId) : undefined;
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questionsLoadedFor, setQuestionsLoadedFor] = useState<string | null>(
    null,
  );
  const questionsLoaded = !!subject && questionsLoadedFor === subject.id;
  const seoMeta = useMemo(
    () =>
      subject
        ? buildSubjectMeta(lang, subject, {
            questionCount: allQuestions.length,
          })
        : undefined,
    [subject, lang, allQuestions.length],
  );
  useDocumentTitle(seoMeta?.title ?? t.home.title);

  useEffect(() => {
    if (subject) {
      getAllQuestions(subject.id).then((questions) => {
        setAllQuestions(questions);
        setQuestionsLoadedFor(subject.id);
      });
    }
  }, [subject]);

  useSeoHead({
    title: seoMeta?.title ?? t.home.title,
    description: seoMeta?.description ?? t.seo.defaultDescription,
    pathWithoutLang: seoMeta?.pathWithoutLang ?? "/",
    ogImage: subject ? `/og/${subject.id}.png` : undefined,
    jsonLd: seoMeta?.jsonLd,
    enabled: !subject || questionsLoaded,
  });

  if (!subject) {
    return <SubjectNotFound />;
  }

  const repeatedCount = allQuestions.filter((q) => q.repeated).length;
  const availableExams = subject.exams.filter((exam) => !exam.deleteRights);
  const hasAuthorizedExams = hasAuthorizedExamContent(subject);
  const progress = getTopicProgress(
    subject.id,
    allQuestions.map((q) => ({ topic: q.topic, points: q.points })),
  );

  const repeatedText =
    repeatedCount >= 20
      ? ` (${t.subjectHome.repeatedSuffix.replace("{count}", String(repeatedCount))})`
      : "";

  const descriptionTemplate = hasAuthorizedExams
    ? t.subjectHome.description
    : t.subjectHome.communityDescription;
  const description = descriptionTemplate
    .replace("{count}", String(allQuestions.length))
    .replace("{repeated}", repeatedText)
    .replace("{exams}", String(availableExams.length));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in animate-duration-fast">
      <SubjectHeader subject={subject} description={description} />
      <TopicsSection
        subject={subject}
        questions={allQuestions}
        progress={progress}
      />
      <ExamSimulationsSection
        subject={subject}
        hasAuthorizedExams={hasAuthorizedExams}
        onAddExam={() => examModalRef.current?.open()}
        onReportCopyright={() => copyrightModalRef.current?.open()}
      />

      <AddExamModal
        ref={examModalRef}
        onClose={() => {}}
        subjectId={subject.id}
        subjectName={subject.name}
      />
      <CopyrightReportModal
        ref={copyrightModalRef}
        onClose={() => {}}
        subjectId={subject.id}
        subjectName={subject.name}
      />

      <PdfLinksSection subject={subject} hasAuthorizedExams={hasAuthorizedExams} />
      <DaypoLinksSection
        subject={subject}
        hasAuthorizedExams={hasAuthorizedExams}
      />
      <ContentNotes subject={subject} />
    </div>
  );
}

function SubjectNotFound() {
  const t = useT();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-fg mb-4">
        {t.subjectHome.notFound}
      </h1>
      <Link
        to="/"
        className="text-accent hover:underline"
        onClick={() => {
          triggerLight();
          track("nav_click", { target: "home", reason: "subject_not_found" });
        }}
      >
        {t.subjectHome.returnHome}
      </Link>
    </div>
  );
}

function SubjectHeader({
  subject,
  description,
}: {
  subject: SubjectMeta;
  description: string;
}) {
  return (
    <div className="text-center mb-10">
      <p className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-fg-muted mb-3">
        <ContentPolicyIcon subject={subject} className="size-4" svgOnly />
        <span>
          {subject.courseCode} &middot; {subject.university}
        </span>
      </p>
      <h1 className="text-3xl font-semibold text-fg mb-3">{subject.name}</h1>
      <p className="text-fg-secondary max-w-xl mx-auto">{description}</p>
    </div>
  );
}

function TopicsSection({
  subject,
  questions,
  progress,
}: {
  subject: SubjectMeta;
  questions: Question[];
  progress: ReturnType<typeof getTopicProgress>;
}) {
  const t = useT();
  const renderTopicCard = (topic: Topic) => {
    const topicQuestions = questions.filter((q) => q.topic === topic.key);
    const topicProgress = progress[topic.key];
    const progressPct =
      topicProgress && topicProgress.total > 0
        ? (topicProgress.attempted / topicProgress.total) * 100
        : 0;

    return (
      <TopicCard
        key={topic.key}
        subjectId={subject.id}
        topic={topic}
        questionCount={topicQuestions.length}
        pointsCount={topicQuestions.reduce((sum, q) => sum + q.points, 0)}
        progress={progressPct}
      />
    );
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-fg mb-4">
        {t.subjectHome.practiceByTopic}
      </h2>
      {subject.megatopics ? (
        <>
          {subject.megatopics.map((megatopic) => {
            const megatopicTopics = subject.topics.filter((topic) =>
              megatopic.topics.includes(topic.key),
            );
            if (megatopicTopics.length === 0) return null;
            return (
              <div key={megatopic.key} className="mb-8">
                <h2 className="text-md font-medium text-fg-secondary mt-2 mb-3">
                  {megatopic.label}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {megatopicTopics.map(renderTopicCard)}
                </div>
              </div>
            );
          })}
          <UngroupedTopics subject={subject} renderTopicCard={renderTopicCard} />
        </>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ${subject.topics.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
        >
          {subject.topics.map(renderTopicCard)}
        </div>
      )}
    </>
  );
}

function UngroupedTopics({
  subject,
  renderTopicCard,
}: {
  subject: SubjectMeta;
  renderTopicCard: (topic: Topic) => ReactNode;
}) {
  const groupedKeys = new Set(subject.megatopics?.flatMap((mt) => mt.topics));
  const ungroupedTopics = subject.topics.filter(
    (topic) => !groupedKeys.has(topic.key),
  );

  if (ungroupedTopics.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ungroupedTopics.map(renderTopicCard)}
      </div>
    </div>
  );
}

function ExamSimulationsSection({
  subject,
  hasAuthorizedExams,
  onAddExam,
  onReportCopyright,
}: {
  subject: SubjectMeta;
  hasAuthorizedExams: boolean;
  onAddExam: () => void;
  onReportCopyright: () => void;
}) {
  const t = useT();

  return (
    <>
      <h2 className="text-lg font-semibold text-fg mb-4">
        {hasAuthorizedExams
          ? t.subjectHome.examSimulations
          : t.subjectHome.practiceSimulations}
      </h2>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 ${subject.exams.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
      >
        {subject.exams.map((exam) =>
          exam.deleteRights ? (
            <RemovedExamCard key={exam.year} title={exam.title} />
          ) : (
            <ExamCard key={exam.year} subject={subject} exam={exam} />
          ),
        )}
        <ExamActionButtons
          subjectId={subject.id}
          onAddExam={onAddExam}
          onReportCopyright={onReportCopyright}
        />
      </div>
    </>
  );
}

function RemovedExamCard({ title }: { title: string }) {
  const t = useT();

  return (
    <div className="block p-6 rounded-xl border-2 border-dashed border-t-red-border bg-t-red-bg/70">
      <div className="text-2xl text-t-red-hover mb-2" aria-hidden="true">
        !
      </div>
      <h2 className="font-semibold text-fg">{title}</h2>
      <p className="text-sm font-medium text-fg-secondary mt-2">
        {t.subjectHome.copyrightRemoved}
      </p>
    </div>
  );
}

function ExamCard({
  subject,
  exam,
}: {
  subject: SubjectMeta;
  exam: SubjectMeta["exams"][number];
}) {
  return (
    <Link
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
  );
}

function ExamActionButtons({
  subjectId,
  onAddExam,
  onReportCopyright,
}: {
  subjectId: string;
  onAddExam: () => void;
  onReportCopyright: () => void;
}) {
  const t = useT();

  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => {
          triggerLight();
          onAddExam();
          track("add_exam_modal_open", { subjectId });
        }}
        className="block w-full p-4 rounded-xl border-2 border-dashed border-border text-fg-muted hover:text-accent hover:border-accent hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md transition-colors transition-transform duration-200"
      >
        <div className="flex h-full min-h-28 flex-col items-center justify-center gap-2">
          <span className="text-4xl font-light leading-none">+</span>
          <span className="text-sm font-medium">{t.subjectHome.addExam}</span>
        </div>
      </button>
      <button
        type="button"
        onClick={() => {
          triggerLight();
          onReportCopyright();
          track("copyright_report_modal_open", { subjectId });
        }}
        className="block w-full p-4 rounded-xl border-2 border-dashed border-t-red-border text-fg-secondary bg-t-red-bg/40 hover:text-fg hover:border-t-red-hover hover:bg-t-red-bg hover:scale-[1.02] hover:shadow-md transition-colors transition-transform duration-200"
      >
        <div className="flex h-full min-h-28 flex-col items-center justify-center gap-2">
          <span className="text-4xl font-light leading-none text-t-red-hover">
            !
          </span>
          <span className="text-sm font-medium">
            {t.subjectHome.reportCopyright}
          </span>
        </div>
      </button>
    </div>
  );
}

function PdfLinksSection({
  subject,
  hasAuthorizedExams,
}: {
  subject: SubjectMeta;
  hasAuthorizedExams: boolean;
}) {
  const t = useT();
  const pdfExams = subject.exams.filter(
    (exam) => !exam.deleteRights && exam.hasPdf !== false,
  );

  if (pdfExams.length === 0) return null;

  return (
    <ResourceLinksShell
      title={
        hasAuthorizedExams
          ? t.subjectHome.originalExams
          : t.subjectHome.sourceMaterials
      }
      description={
        hasAuthorizedExams
          ? t.subjectHome.examDocsDescription
          : t.subjectHome.sourceMaterialsDescription
      }
    >
      {pdfExams.map((exam) => (
        <a
          key={exam.year}
          href={`/exams/${subject.id}/Exam-${exam.year}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-fg bg-accent-light border border-accent-border rounded-lg hover:bg-accent-light active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition duration-150"
          onClick={() => {
            triggerLight();
            track("file_download", {
              file: `Exam-${exam.year}.pdf`,
              subjectId: subject.id,
              year: exam.year,
            });
          }}
        >
          <span aria-hidden="true">📄</span> {exam.title} {t.subjectHome.pdf}
        </a>
      ))}
    </ResourceLinksShell>
  );
}

function DaypoLinksSection({
  subject,
  hasAuthorizedExams,
}: {
  subject: SubjectMeta;
  hasAuthorizedExams: boolean;
}) {
  const t = useT();
  const daypoExams = subject.exams.filter(
    (exam) => !exam.deleteRights && exam.daypoUrl != null,
  );

  if (daypoExams.length === 0) return null;

  return (
    <ResourceLinksShell
      title={
        hasAuthorizedExams
          ? t.subjectHome.originalDaypos
          : t.subjectHome.sourceMaterials
      }
      description={
        hasAuthorizedExams
          ? t.subjectHome.daypoDocsDescription
          : t.subjectHome.sourceMaterialsDescription
      }
    >
      {daypoExams.map((exam) => (
        <a
          key={exam.year}
          href={exam.daypoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-fg bg-accent-light border border-accent-border rounded-lg hover:bg-accent-light active:scale-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition duration-150"
          onClick={() => {
            triggerLight();
            track("daypo_open", {
              subjectId: subject.id,
              year: exam.year,
            });
          }}
        >
          <span aria-hidden="true">🌐</span> {exam.title} {t.subjectHome.daypo}
        </a>
      ))}
    </ResourceLinksShell>
  );
}

function ResourceLinksShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-border mb-10">
      <h3 className="font-semibold text-fg mb-2">{title}</h3>
      <p className="text-sm text-fg-secondary mb-4">{description}</p>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}

function ContentNotes({ subject }: { subject: SubjectMeta }) {
  const t = useT();

  if (!subject.acknowledgments && !subject.contentLicense) return null;

  return (
    <div className="mt-10 space-y-4 text-right text-sm text-fg-muted">
      {subject.acknowledgments ? (
        <div>
          <p className="font-semibold text-fg-muted mb-1">
            {t.subjectHome.acknowledgments}
          </p>
          <p>{subject.acknowledgments}</p>
        </div>
      ) : null}
      {subject.contentLicense ? (
        <div>
          <p className="font-semibold text-fg-muted mb-1">
            {t.subjectHome.contentLicense}
          </p>
          <p>{subject.contentLicense}</p>
        </div>
      ) : null}
    </div>
  );
}
