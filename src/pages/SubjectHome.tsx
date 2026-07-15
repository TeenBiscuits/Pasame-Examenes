import { useRef, useState, useEffect, useMemo, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { LangLink as Link } from "../lib/lang-link";
import { getSubject, getAllQuestions } from "../subjects";
import { getTopicProgress, getAttempts } from "../data/store";
import type { Lang } from "../i18n/context";
import TopicCard from "../components/TopicCard";
import AddExamModal, {
  type AddExamModalHandle,
} from "../components/AddExamModal";
import CopyrightReportModal, {
  type CopyrightReportModalHandle,
} from "../components/CopyrightReportModal";
import ContentPolicyIcon from "../components/ContentPolicyIcon";
import Hero from "../components/Hero";
import type { Question, SubjectMeta, Topic } from "../data/types";
import { useLang, useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";
import { buildSubjectMeta } from "../seo/meta";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import { ArrowRightUp } from "reicon-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge02Icon,
  LegalHammerIcon,
  Legal01Icon,
  DashboardSquareAddIcon,
} from "@hugeicons/core-free-icons";

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

  const progress = useMemo(() => {
    if (!subject) return {};
    return getTopicProgress(
      subject.id,
      allQuestions.map((q) => ({ topic: q.topic, points: q.points })),
    );
  }, [subject, allQuestions]);

  const totalPoints = useMemo(() => allQuestions.reduce((sum, q) => sum + q.points, 0), [allQuestions]);
  const attemptedPoints = useMemo(() => Object.values(progress).reduce((sum, p) => sum + p.attempted, 0), [progress]);
  const overallProgressPct = totalPoints > 0 ? Math.round((attemptedPoints / totalPoints) * 100) : 0;

  const attempts = useMemo(() => (subject ? getAttempts(subject.id) : []), [subject]);
  const examAttempts = useMemo(() => attempts.filter((a) => a.mode === "exam"), [attempts]);
  const uniqueExamsSimulated = useMemo(() => new Set(examAttempts.map((a) => a.exam)).size, [examAttempts]);
  const bestExamScore = useMemo(() => (examAttempts.length > 0 ? Math.max(...examAttempts.map((a) => a.score)) : 0), [examAttempts]);

  if (!subject) {
    return <SubjectNotFound />;
  }

  const repeatedCount = allQuestions.filter((q) => q.repeated).length;
  const availableExams = subject.exams.filter((exam) => !exam.deleteRights);
  const hasAuthorizedExams = hasAuthorizedExamContent(subject);

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
    <div className="animate-fade-in animate-duration-fast">
      {questionsLoaded && null}
      <SubjectHeader subject={subject} description={description} />
      <div className="mx-auto max-w-6xl px-4 pb-8">
        {questionsLoaded && (
          <StatsSection
            lang={lang}
            totalQuestions={allQuestions.length}
            repeatedCount={repeatedCount}
            availableExamsCount={availableExams.length}
            totalPoints={totalPoints}
            attemptedPoints={attemptedPoints}
            overallProgressPct={overallProgressPct}
            uniqueExamsSimulated={uniqueExamsSimulated}
            bestExamScore={bestExamScore}
            subject={subject}
          />
        )}
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

        <PdfLinksSection
          subject={subject}
          hasAuthorizedExams={hasAuthorizedExams}
        />
        <DaypoLinksSection
          subject={subject}
          hasAuthorizedExams={hasAuthorizedExams}
        />
        <ContentNotes subject={subject} />
      </div>
    </div>
  );
}

function SubjectNotFound() {
  const t = useT();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-fg mb-4 text-2xl font-semibold">
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
    <Hero emojis={subject.topics.map((tp) => tp.icon)} compact>
      <p className="text-fg-muted mb-3 flex items-center justify-center gap-2 font-mono text-xs tracking-widest uppercase">
        <ContentPolicyIcon subject={subject} className="size-4" svgOnly />
        <span>
          {subject.courseCode} &middot; {subject.university}
        </span>
      </p>
      <h1 className="text-fg mb-3 text-4xl font-semibold sm:text-5xl lg:text-6xl">
        {subject.name}
      </h1>
      <p className="text-fg-secondary mx-auto max-w-2xl text-base sm:text-lg lg:text-xl">
        {description}
      </p>
    </Hero>
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
      <h2 className="text-fg mb-4 text-lg font-semibold">
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
                <h2 className="text-md text-fg-secondary mt-2 mb-3 font-medium">
                  {megatopic.label}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {megatopicTopics.map(renderTopicCard)}
                </div>
              </div>
            );
          })}
          <UngroupedTopics
            subject={subject}
            renderTopicCard={renderTopicCard}
          />
        </>
      ) : (
        <div
          className={`mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 ${subject.topics.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <h2 className="text-fg mb-4 text-lg font-semibold">
        {hasAuthorizedExams
          ? t.subjectHome.examSimulations
          : t.subjectHome.practiceSimulations}
      </h2>
      <div
        className={`mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 ${subject.exams.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
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
    <div className="border-t-red-border bg-t-red-bg/70 block rounded-xl border-2 border-dashed p-6">
      <div className="text-t-red-hover mb-2 text-2xl" aria-hidden="true">
        <HugeiconsIcon icon={Legal01Icon} />
      </div>
      <h2 className="text-fg font-semibold">{title}</h2>
      <p className="text-fg-secondary mt-2 text-sm font-medium">
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
  const t = useT();
  const isAuthorized = hasAuthorizedExamContent(subject);

  return (
    <Link
      to={`/${subject.id}/exam/${exam.year}`}
      className="border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 focus-visible:ring-accent block rounded-xl border-2 p-6 transition-colors transition-transform duration-200 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      onClick={() => {
        triggerLight();
        track("exam_card_click", {
          subjectId: subject.id,
          year: exam.year,
        });
      }}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="text-2xl" aria-hidden="true">
          📝
        </div>
        {isAuthorized && (
          <span
            className="border-t-amber-border bg-t-amber-bg text-t-amber-hover inline-flex size-6 shrink-0 items-center justify-center rounded border"
            title={t.contentPolicy.authorized}
          >
            <HugeiconsIcon
              icon={CheckmarkBadge02Icon}
              className="size-4"
              role="img"
              aria-label={t.contentPolicy.authorized}
            />
          </span>
        )}
      </div>
      <h2 className="text-fg font-semibold">{exam.title}</h2>
      <p className="text-fg-muted mt-1 text-sm">{exam.description}</p>
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
        className="border-border text-fg-muted hover:text-accent hover:border-accent hover:bg-accent-light/30 block w-full rounded-xl border-2 border-dashed p-4 transition-colors transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
      >
        <div className="flex h-full min-h-28 flex-col items-center justify-center gap-2">
          <span className="text-4xl leading-none font-light">
            <HugeiconsIcon icon={DashboardSquareAddIcon} size={35} />
          </span>
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
        className="border-t-red-border text-fg-secondary bg-t-red-bg/40 hover:text-fg hover:border-t-red-hover hover:bg-t-red-bg block w-full rounded-xl border-2 border-dashed p-4 transition-colors transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
      >
        <div className="flex h-full min-h-28 flex-col items-center justify-center gap-2">
          <span className="text-t-red-hover text-4xl leading-none font-light">
            <HugeiconsIcon icon={LegalHammerIcon} size={35} />
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
          className="text-accent-fg bg-accent-light border-accent-border hover:bg-accent-light focus-visible:ring-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
          onClick={() => {
            triggerLight();
            track("file_download", {
              file: `Exam-${exam.year}.pdf`,
              subjectId: subject.id,
              year: exam.year,
            });
          }}
        >
          <span aria-hidden="true">📄</span> {exam.title} {t.subjectHome.pdf}{" "}
          <ArrowRightUp weight="Filled" className="size-3.5" />
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
          className="text-accent-fg bg-accent-light border-accent-border hover:bg-accent-light focus-visible:ring-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
          onClick={() => {
            triggerLight();
            track("daypo_open", {
              subjectId: subject.id,
              year: exam.year,
            });
          }}
        >
          <span aria-hidden="true">🌐</span> {exam.title} {t.subjectHome.daypo}{" "}
          <ArrowRightUp weight="Filled" className="size-3.5" />
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
    <div className="bg-surface border-border mb-10 rounded-xl border p-6">
      <h3 className="text-fg mb-2 font-semibold">{title}</h3>
      <p className="text-fg-secondary mb-4 text-sm">{description}</p>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}

function ContentNotes({ subject }: { subject: SubjectMeta }) {
  const t = useT();

  if (!subject.acknowledgments && !subject.contentLicense) return null;

  return (
    <div className="text-fg-muted mt-10 space-y-4 text-right text-sm">
      {subject.acknowledgments ? (
        <div>
          <p className="text-fg-muted mb-1 font-semibold">
            {t.subjectHome.acknowledgments}
          </p>
          <p>{subject.acknowledgments}</p>
        </div>
      ) : null}
      {subject.contentLicense ? (
        <div>
          <p className="text-fg-muted mb-1 font-semibold">
            {t.subjectHome.contentLicense}
          </p>
          <p>{subject.contentLicense}</p>
        </div>
      ) : null}
    </div>
  );
}

const statsTranslations: Record<Lang, {
  overallProgress: string;
  points: string;
  examsSimulated: string;
  bestScore: string;
  totalQuestions: string;
  repeated: string;
  topics: string;
}> = {
  en: {
    overallProgress: "Overall Progress",
    points: "points",
    examsSimulated: "Simulations Completed",
    bestScore: "Best Score",
    totalQuestions: "Total Questions",
    repeated: "repeated",
    topics: "Topics",
  },
  es: {
    overallProgress: "Progreso General",
    points: "puntos",
    examsSimulated: "Simulaciones Completadas",
    bestScore: "Mejor Puntuación",
    totalQuestions: "Preguntas Totales",
    repeated: "repetidas",
    topics: "Temas",
  },
  gl: {
    overallProgress: "Progreso Xeral",
    points: "puntos",
    examsSimulated: "Simulacións Completadas",
    bestScore: "Mellor Puntuación",
    totalQuestions: "Preguntas Totais",
    repeated: "repetidas",
    topics: "Temas",
  }
};

function StatsSection({
  lang,
  totalQuestions,
  repeatedCount,
  availableExamsCount,
  totalPoints,
  attemptedPoints,
  overallProgressPct,
  uniqueExamsSimulated,
  bestExamScore,
  subject,
}: {
  lang: Lang;
  totalQuestions: number;
  repeatedCount: number;
  availableExamsCount: number;
  totalPoints: number;
  attemptedPoints: number;
  overallProgressPct: number;
  uniqueExamsSimulated: number;
  bestExamScore: number;
  subject: SubjectMeta;
}) {
  const trans = statsTranslations[lang] || statsTranslations.es;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 mt-2">
      {/* Overall Progress Bento Card */}
      <div className="bg-surface-alt border-border rounded-xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-accent/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-fg pointer-events-none text-7xl font-bold font-mono group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          %
        </div>
        <div>
          <span className="text-fg-secondary font-mono text-xs tracking-wider uppercase font-semibold block mb-2">
            {trans.overallProgress}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-fg text-3xl font-extrabold font-mono tracking-tight">
              {overallProgressPct}%
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-border h-2.5 overflow-hidden rounded-full relative mb-1.5">
            <div
              className="bg-accent h-full rounded-full transition-all duration-750 ease-out"
              style={{ width: `${overallProgressPct}%` }}
            />
          </div>
          <span className="text-fg-muted text-xs">
            {attemptedPoints.toFixed(1)} / {totalPoints.toFixed(1)} {trans.points}
          </span>
        </div>
      </div>

      {/* Exam Simulations Bento Card */}
      <div className="bg-surface-alt border-border rounded-xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-accent/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-fg pointer-events-none text-7xl font-bold font-mono group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          📝
        </div>
        <div>
          <span className="text-fg-secondary font-mono text-xs tracking-wider uppercase font-semibold block mb-2">
            {trans.examsSimulated}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-fg text-3xl font-extrabold font-mono tracking-tight">
              {uniqueExamsSimulated} / {availableExamsCount}
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-fg-muted text-xs">{trans.bestScore}</span>
          <span className="text-accent-fg bg-accent-light font-mono text-xs font-bold px-2.5 py-0.5 rounded-full">
            {bestExamScore.toFixed(1)}p
          </span>
        </div>
      </div>

      {/* Topics & Questions Bento Card */}
      <div className="bg-surface-alt border-border rounded-xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:border-accent/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-fg pointer-events-none text-7xl font-bold font-mono group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
          📚
        </div>
        <div>
          <span className="text-fg-secondary font-mono text-xs tracking-wider uppercase font-semibold block mb-2">
            {trans.totalQuestions}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-fg text-3xl font-extrabold font-mono tracking-tight">
              {totalQuestions}
            </span>
            {repeatedCount > 0 && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">
                {repeatedCount} {trans.repeated}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-fg-muted text-xs">{trans.topics}</span>
          <span className="text-fg font-mono text-xs font-semibold">
            {subject.topics.length}
          </span>
        </div>
      </div>
    </div>
  );
}
