import {
  useRef,
  useState,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { useParams } from "@tanstack/react-router";
import { LangLink as Link } from "../lib/lang-link";
import { getSubject, getAllQuestions } from "../subjects";
import { clearTopicProgress, getTopicProgress } from "../data/store";
import TopicCard from "../components/TopicCard";
import ExamSourceSelector from "../components/ExamSourceSelector";
import AddExamModal, {
  type AddExamModalHandle,
} from "../components/AddExamModal";
import CopyrightReportModal, {
  type CopyrightReportModalHandle,
} from "../components/CopyrightReportModal";
import ContentPolicyIcon from "../components/ContentPolicyIcon";
import Hero from "../components/Hero";
import type { QuestionSummary, SubjectMeta, Topic } from "../data/types";
import { useLang, useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";
import { buildSubjectMeta } from "../seo/meta";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import { isPublicSubject } from "../subjects/visibility";
import { getExamQuestionStats } from "../lib/exam-stats";
import type { ExamQuestionStats } from "../lib/exam-stats";
import { formatPoints } from "../lib/points";
import { closeDialog, showDialog, useDialogDismiss } from "../lib/dialog";
import { playSound } from "../lib/sound";
import {
  filterQuestionsByExamSelection,
  useExamSelection,
} from "../hooks/useExamSelection";
import {
  ArrowRightUp,
  Copyright,
  FilePlus,
  FilePdf,
  DocText,
  Filter,
  Restart,
} from "reicon-react";
import { compactModalDialogClass, ModalHeader } from "../components/Modal";

const subscribeToHydration = () => () => {};

export default function SubjectHome({
  initialQuestions = [],
}: {
  initialQuestions?: QuestionSummary[];
}) {
  const { subjectId } = useParams({ strict: false });
  const t = useT();
  const { lang } = useLang();
  const examModalRef = useRef<AddExamModalHandle>(null);
  const copyrightModalRef = useRef<CopyrightReportModalHandle>(null);
  const resetProgressDialogRef = useRef<HTMLDialogElement>(null);
  const examSourceDialogRef = useRef<HTMLDialogElement>(null);
  const subject = subjectId ? getSubject(subjectId) : undefined;
  const { selectedExamIds, setSelectedExamIds } = useExamSelection(subject);
  const [allQuestions, setAllQuestions] =
    useState<QuestionSummary[]>(initialQuestions);
  const [questionsLoadedFor, setQuestionsLoadedFor] = useState<string | null>(
    initialQuestions.length > 0 && subject ? subject.id : null,
  );
  const questionsLoaded = !!subject && questionsLoadedFor === subject.id;
  const [, setProgressRevision] = useState(0);
  const storageReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const selectedQuestions = useMemo(
    () => filterQuestionsByExamSelection(allQuestions, selectedExamIds),
    [allQuestions, selectedExamIds],
  );
  const examStats = useMemo(
    () =>
      subject ? getExamQuestionStats(subject.exams, allQuestions) : new Map(),
    [subject, allQuestions],
  );
  const progress =
    subject && questionsLoaded && storageReady
      ? getTopicProgress(
          subject.id,
          selectedQuestions.map((q) => ({ topic: q.topic, points: q.points })),
        )
      : {};
  const seoMeta = useMemo(
    () =>
      subject
        ? buildSubjectMeta(lang, subject, {
            questionCount: selectedQuestions.length,
          })
        : undefined,
    [subject, lang, selectedQuestions.length],
  );
  useDocumentTitle(seoMeta?.title ?? t.home.title);

  useEffect(() => {
    if (subject && questionsLoadedFor !== subject.id) {
      getAllQuestions(subject.id).then((questions) => {
        setAllQuestions(
          questions.map(({ id, examId, topic, points, repeated }) => ({
            id,
            examId,
            topic,
            points,
            repeated,
          })),
        );
        setQuestionsLoadedFor(subject.id);
      });
    }
  }, [subject, questionsLoadedFor]);

  useSeoHead({
    title: seoMeta?.title ?? t.home.title,
    description: seoMeta?.description ?? t.seo.defaultDescription,
    pathWithoutLang: seoMeta?.pathWithoutLang ?? "/",
    ogImage: subject ? `/og/${subject.id}.png` : undefined,
    jsonLd: seoMeta?.jsonLd,
    indexable: Boolean(subject && isPublicSubject(subject.id)),
    enabled: !subject || questionsLoaded,
  });

  if (!subject) {
    return <SubjectNotFound />;
  }

  const repeatedCount = selectedQuestions.filter((q) => q.repeated).length;
  const hasAuthorizedExams = hasAuthorizedExamContent(subject);
  const currentSubjectId = subject.id;
  const allExamSourcesSelected =
    selectedExamIds.length ===
    subject.exams.filter((exam) => !exam.deleteRights).length;
  const repeatedText =
    repeatedCount >= 20
      ? ` (${t.subjectHome.repeatedSuffix.replace("{count}", String(repeatedCount))})`
      : "";

  const descriptionTemplate = hasAuthorizedExams
    ? t.subjectHome.description
    : t.subjectHome.communityDescription;
  const description = descriptionTemplate
    .replace("{count}", String(selectedQuestions.length))
    .replace("{repeated}", repeatedText)
    .replace("{exams}", String(selectedExamIds.length));

  function handleResetTopicProgress() {
    const clearedCount = clearTopicProgress(currentSubjectId);
    track("reset_topic_progress", {
      subjectId: currentSubjectId,
      clearedCount,
    });
    if (clearedCount > 0) {
      setProgressRevision((revision) => revision + 1);
    }
    closeDialog(resetProgressDialogRef.current);
  }

  return (
    <div className="animate-fade-in animate-duration-fast">
      {questionsLoaded && null}
      <SubjectHeader subject={subject} description={description} />
      <div className="mx-auto max-w-6xl px-4 pb-8">
        <ExamSourceSelector
          subject={subject}
          selectedExamIds={selectedExamIds}
          onChange={setSelectedExamIds}
          dialogRef={examSourceDialogRef}
          examStats={examStats}
        />
        <TopicsSection
          subject={subject}
          questions={selectedQuestions}
          progress={progress}
          allExamSourcesSelected={allExamSourcesSelected}
          onOpenExamSources={() => showDialog(examSourceDialogRef.current)}
          onResetProgress={() => {
            track("reset_topic_progress_modal_open", {
              subjectId: currentSubjectId,
            });
            showDialog(resetProgressDialogRef.current);
          }}
        />
        <ExamSimulationsSection
          subject={subject}
          hasAuthorizedExams={hasAuthorizedExams}
          examStats={examStats}
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
        <ResetTopicProgressDialog
          dialogRef={resetProgressDialogRef}
          onConfirm={handleResetTopicProgress}
        />

        <PdfLinksSection
          subject={subject}
          hasAuthorizedExams={hasAuthorizedExams}
        />
        <OriginalContentLinksSection subject={subject} />
        <ContentNotes subject={subject} />
      </div>
    </div>
  );
}

function ResetTopicProgressDialog({
  dialogRef,
  onConfirm,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  onConfirm: () => void;
}) {
  const t = useT();

  useDialogDismiss(dialogRef, () => playSound("droplet"));

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      className={`${compactModalDialogClass} p-6`}
      aria-labelledby="reset-topic-progress-title"
    >
      <ModalHeader
        titleId="reset-topic-progress-title"
        closeLabel={t.subjectHome.resetTopicProgressCancel}
        onClose={() => closeDialog(dialogRef.current)}
      >
        <Restart
          className="size-5 shrink-0"
          weight="Filled"
          aria-hidden="true"
        />
        {t.subjectHome.resetTopicProgress}
      </ModalHeader>
      <p className="text-fg-secondary mb-6 text-sm">
        {t.subjectHome.resetTopicProgressConfirm}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          data-cuelume-press="droplet"
          onClick={() => closeDialog(dialogRef.current)}
          className="border-border text-fg-secondary hover:bg-surface focus-visible:ring-accent flex-1 rounded-lg border px-4 py-2 text-sm transition-[background-color,border-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
        >
          {t.subjectHome.resetTopicProgressCancel}
        </button>
        <button
          type="button"
          data-cuelume-press="error"
          onClick={onConfirm}
          className="bg-danger text-on-danger hover:bg-danger-hover focus-visible:ring-danger-fg flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-[background-color,color,scale] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none active:scale-[0.96]"
        >
          {t.subjectHome.resetTopicProgressAction}
        </button>
      </div>
    </dialog>
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
        data-cuelume-hover
        data-cuelume-press
        className="text-accent-fg hover:underline"
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
  const t = useT();

  return (
    <Hero emojis={subject.topics.map((tp) => tp.icon)} compact>
      <p className="text-fg-muted mb-3 flex items-center justify-center gap-2 font-mono text-xs tracking-widest uppercase">
        <ContentPolicyIcon subject={subject} className="size-4" svgOnly />
        <span>
          {subject.courseCode} &middot; {subject.degree} &middot;{" "}
          {t.subjectCard.course.replace("{course}", String(subject.course))}
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
  allExamSourcesSelected,
  onOpenExamSources,
  onResetProgress,
}: {
  subject: SubjectMeta;
  questions: QuestionSummary[];
  progress: ReturnType<typeof getTopicProgress>;
  allExamSourcesSelected: boolean;
  onOpenExamSources: () => void;
  onResetProgress: () => void;
}) {
  const t = useT();
  const topicKeysWithQuestions = new Set(
    questions.map((question) => question.topic),
  );
  const topicIndices = new Map(
    subject.topics.map((topic, index) => [topic.key, index]),
  );
  const topicsWithQuestions =
    subject.id === "espain"
      ? subject.topics
      : subject.topics.filter((topic) => topicKeysWithQuestions.has(topic.key));
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
        topicIndex={topicIndices.get(topic.key) ?? 0}
        questionCount={topicQuestions.length}
        pointsCount={topicQuestions.reduce((sum, q) => sum + q.points, 0)}
        progress={progressPct}
      />
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-fg text-lg font-semibold">
          {t.subjectHome.practiceByTopic}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            data-cuelume-hover="whisper"
            data-cuelume-press="bloom"
            onClick={onOpenExamSources}
            className="text-fg-muted hover:text-accent-fg focus-visible:ring-accent rounded p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label={t.subjectHome.questionSources}
            title={t.subjectHome.questionSources}
          >
            <Filter
              className="size-4"
              weight={allExamSourcesSelected ? "Outline" : "Filled"}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            data-cuelume-hover="whisper"
            data-cuelume-press="bloom"
            onClick={onResetProgress}
            className="text-fg-muted hover:text-incorrect-fg focus-visible:ring-accent rounded p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label={t.subjectHome.resetTopicProgress}
            title={t.subjectHome.resetTopicProgress}
          >
            <Restart className="size-4" weight="Filled" aria-hidden="true" />
          </button>
        </div>
      </div>
      {subject.megatopics ? (
        <>
          {subject.megatopics.map((megatopic) => {
            const megatopicKeys = new Set(megatopic.topics);
            const megatopicTopics = subject.topics.filter(
              (topic) =>
                megatopicKeys.has(topic.key) &&
                topicKeysWithQuestions.has(topic.key),
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
            topics={topicsWithQuestions}
            renderTopicCard={renderTopicCard}
          />
        </>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicsWithQuestions.map(renderTopicCard)}
        </div>
      )}
    </>
  );
}

function UngroupedTopics({
  subject,
  topics,
  renderTopicCard,
}: {
  subject: SubjectMeta;
  topics: Topic[];
  renderTopicCard: (topic: Topic) => ReactNode;
}) {
  const groupedKeys = new Set(subject.megatopics?.flatMap((mt) => mt.topics));
  const ungroupedTopics = topics.filter((topic) => !groupedKeys.has(topic.key));

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
  examStats,
  onAddExam,
  onReportCopyright,
}: {
  subject: SubjectMeta;
  hasAuthorizedExams: boolean;
  examStats: ReadonlyMap<string, ExamQuestionStats>;
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
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subject.exams.map((exam) =>
          exam.deleteRights ? (
            <RemovedExamCard key={exam.id} title={exam.title} />
          ) : (
            <ExamCard
              key={exam.id}
              subject={subject}
              exam={exam}
              stats={examStats.get(exam.id)}
            />
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
    <div className="flex min-h-[122px] flex-col rounded-xl">
      <div className="border-danger-border bg-danger-light flex flex-col rounded-t-xl border-x-2 border-t-2 border-dashed px-4 pt-4 pb-1">
        <div className="flex items-start justify-between gap-4">
          <Copyright className="text-danger-fg size-7" aria-hidden="true" />
        </div>
        <h2 className="text-fg mt-3 text-base leading-snug font-semibold">
          {title}
        </h2>
      </div>
      <div className="border-danger-border bg-danger-light text-danger-fg flex flex-1 flex-wrap items-center rounded-b-xl border-x-2 border-b-2 border-dashed px-4 py-1 text-sm">
        <span>{t.subjectHome.copyrightRemoved}</span>
      </div>
    </div>
  );
}

function ExamCard({
  subject,
  exam,
  stats,
}: {
  subject: SubjectMeta;
  exam: SubjectMeta["exams"][number];
  stats: ExamQuestionStats | undefined;
}) {
  const t = useT();

  return (
    <Link
      to={`/${subject.id}/exam/${exam.id}`}
      rel="nofollow"
      data-cuelume-hover="tick"
      data-cuelume-press
      className="interactive-card focus-visible:ring-accent flex min-h-[122px] flex-col rounded-xl hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      onClick={() => {
        triggerLight();
        track("exam_card_click", {
          subjectId: subject.id,
          examId: exam.id,
        });
      }}
    >
      <div className="border-border bg-surface-alt flex flex-col rounded-t-xl border-x-2 border-t-2 px-4 pt-4 pb-1">
        <div className="flex items-start justify-between gap-4">
          <div className="text-3xl leading-none" aria-hidden="true">
            <DocText className="size-7" aria-hidden="true" />
          </div>
          <ContentPolicyIcon subject={subject} variant="verified" />
        </div>
        <h2 className="text-fg mt-3 text-base leading-snug font-semibold">
          {exam.title}
        </h2>
      </div>
      <div className="bg-card-footer border-card-footer-border text-fg flex flex-1 flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-b-xl border-x-2 border-b-2 px-4 py-1 text-sm">
        <span>
          {stats
            ? t.exam.questionSummary
                .replace("{questions}", String(stats.questionCount))
                .replace("{points}", formatPoints(stats.points))
            : "..."}
        </span>
        <span>
          {exam.durationMinutes} {t.exam.minutes}
        </span>
      </div>
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
        data-cuelume-hover="tick"
        data-cuelume-press="bloom"
        onClick={() => {
          triggerLight();
          onAddExam();
          track("add_exam_modal_open", { subjectId });
        }}
        className="interactive-card border-border text-fg-muted hover:text-accent-fg hover:border-accent hover:bg-accent-light/30 block h-full min-h-[122px] min-w-0 w-full rounded-xl border-2 border-dashed p-4 hover:shadow-md"
      >
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <FilePlus className="size-8" aria-hidden="true" />
          <span className="text-sm font-medium">{t.subjectHome.addExam}</span>
        </div>
      </button>
      <button
        type="button"
        data-cuelume-hover="tick"
        data-cuelume-press="bloom"
        onClick={() => {
          triggerLight();
          onReportCopyright();
          track("copyright_report_modal_open", { subjectId });
        }}
        className="interactive-card border-danger-border text-danger-fg bg-danger-light hover:text-fg hover:border-danger-fg hover:bg-danger-light block h-full min-h-[122px] min-w-0 w-full rounded-xl border-2 border-dashed p-4 hover:shadow-md"
      >
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <Copyright className="text-danger-fg size-8" aria-hidden="true" />
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
          key={exam.id}
          data-cuelume-hover="whisper"
          data-cuelume-press
          href={`https://github.com/TeenBiscuits/Pasame-Examenes/raw/refs/heads/main/public/exams/${subject.id}/Exam-${exam.id}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-fg bg-accent-light border-accent-border hover:bg-accent-light focus-visible:ring-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
          onClick={() => {
            triggerLight();
            track("file_download", {
              file: `Exam-${exam.id}.pdf`,
              subjectId: subject.id,
              examId: exam.id,
            });
          }}
        >
          <FilePdf className="size-4" aria-hidden="true" /> {exam.title}{" "}
          {t.subjectHome.pdf}{" "}
          <ArrowRightUp weight="Filled" className="size-3.5" />
        </a>
      ))}
    </ResourceLinksShell>
  );
}

function OriginalContentLinksSection({ subject }: { subject: SubjectMeta }) {
  const t = useT();
  const originalExams = subject.exams.filter(
    (exam) => !exam.deleteRights && exam.originalUrl != null,
  );

  if (originalExams.length === 0) return null;

  return (
    <ResourceLinksShell
      title={t.subjectHome.originalContent}
      description={t.subjectHome.originalContentDescription}
    >
      {originalExams.map((exam) => (
        <a
          key={exam.id}
          data-cuelume-hover="whisper"
          data-cuelume-press
          href={exam.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-fg bg-accent-light border-accent-border hover:bg-accent-light focus-visible:ring-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition duration-150 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
          onClick={() => {
            triggerLight();
            track("original_content_open", {
              subjectId: subject.id,
              examId: exam.id,
            });
          }}
        >
          <span aria-hidden="true">🌐</span> {exam.title}{" "}
          {t.subjectHome.original}{" "}
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
  const specificLicense = subject.contentLicense;
  const hasAcknowledgments = Boolean(subject.acknowledgments);
  const hasSpecificLicense = Boolean(specificLicense);
  const contentWidthClass =
    hasAcknowledgments && hasSpecificLicense ? "max-w-prose" : "max-w-4xl";

  if (!hasAcknowledgments && !hasSpecificLicense) return null;

  return (
    <aside
      aria-labelledby="subject-legal-notes-title"
      className="border-border text-fg-muted mt-10 border-t pt-5 text-sm"
    >
      <h2 id="subject-legal-notes-title" className="sr-only">
        {t.subjectHome.legalInformation}
      </h2>
      <div
        className={
          hasAcknowledgments && hasSpecificLicense
            ? "grid gap-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] sm:gap-8"
            : "block"
        }
      >
        {hasAcknowledgments ? (
          <div className={contentWidthClass}>
            <h3 className="text-fg-secondary mb-1 text-xs font-semibold tracking-wide">
              {t.subjectHome.acknowledgments}
            </h3>
            <p className="leading-relaxed">{subject.acknowledgments}</p>
          </div>
        ) : null}
        {specificLicense ? (
          <div className={contentWidthClass}>
            <h3 className="text-fg-secondary mb-1 text-xs font-semibold tracking-wide">
              {t.subjectHome.contentLicense}
            </h3>
            <p>
              <a
                href={specificLicense.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-fg focus-visible:ring-accent rounded underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                {specificLicense.name}
              </a>{" "}
              <code className="text-fg-muted text-xs">
                ({specificLicense.spdxId})
              </code>
            </p>
            {specificLicense.notice ? (
              <p className="mt-2 leading-relaxed">{specificLicense.notice}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
