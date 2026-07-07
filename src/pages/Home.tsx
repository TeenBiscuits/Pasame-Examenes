import { useMemo, useRef, useState } from "react";
import { subjects } from "../subjects";
import SubjectCard from "../components/SubjectCard";
import AddSubjectModal, {
  type AddSubjectModalHandle,
} from "../components/AddSubjectModal";
import { useLang, useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";
import { LangLink } from "../lib/lang-link";
import { buildHomeMeta } from "../seo/meta";
import {
  getRecentSubjects,
  recordSubjectClick,
  clearRecentSubjects,
} from "../lib/recent";

const MAX_SLOTS = 3;

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" />
    </svg>
  );
}

function PlaceholderCard() {
  return (
    <div
      className="file-card-soft block w-full p-5"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 invisible">
        <span className="text-2xl">&nbsp;</span>
        <span className="font-semibold text-base">&nbsp;</span>
      </div>
    </div>
  );
}

function slotClassName(i: number, isPlaceholder: boolean): string | undefined {
  if (isPlaceholder) {
    if (i >= 2) return "hidden lg:block";
    return "hidden sm:block";
  }
  if (i >= 2) return "block sm:hidden lg:block";
  return undefined;
}

export default function Home() {
  const t = useT();
  const { lang } = useLang();
  const seoMeta = useMemo(() => buildHomeMeta(lang), [lang]);
  useDocumentTitle(seoMeta.title);
  useSeoHead({
    title: seoMeta.title,
    description: seoMeta.description,
    pathWithoutLang: seoMeta.pathWithoutLang,
    jsonLd: seoMeta.jsonLd,
  });
  const modalRef = useRef<AddSubjectModalHandle>(null);
  const [recentKey, setRecentKey] = useState(0);

  const recentIds = getRecentSubjects();
  const recentSubjects = recentIds
    .map((id) => subjects.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => s != null);

  function handleClearRecent() {
    clearRecentSubjects();
    track("clear_recent_subjects", { count: recentSubjects.length });
    setRecentKey((k) => k + 1);
  }

  const slots = Array.from({ length: MAX_SLOTS }, (_, i) => {
    const subject = recentSubjects[i];
    return subject
      ? { type: "subject" as const, subject }
      : { type: "placeholder" as const };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 animate-fade-in animate-duration-fast">
      <section className="study-hero mb-10 px-5 py-8 text-left sm:px-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:p-10">
        <div>
          <p className="section-label mb-5">{t.home.archiveLabel}</p>
          <h1 className="hero-title text-fg">
            Pásame <span className="hero-title-mark">exámenes</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-secondary text-pretty">
            {t.home.subtitle}
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-medium text-fg-secondary">
            <span className="rounded-full border border-border bg-surface-alt/70 px-3 py-1.5">
              {t.home.subjectCount.replace("{count}", String(subjects.length))}
            </span>
            <span className="rounded-full border border-border bg-surface-alt/70 px-3 py-1.5">
              {t.home.topicPractice}
            </span>
            <span className="rounded-full border border-border bg-surface-alt/70 px-3 py-1.5">
              {t.home.examSimulation}
            </span>
          </div>
        </div>
        <div className="mt-8 lg:mt-0" aria-hidden="true">
          <div className="exam-sheet p-6 sm:p-7">
            <div className="ml-10 flex items-start justify-between gap-4 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#244fe8]">
              <span>{t.home.sheetCallout}</span>
              <span className="exam-stamp">{t.home.sheetStamp}</span>
            </div>
            <div className="ml-10 mt-8 space-y-5 font-mono text-sm font-semibold text-[#17212b]">
              <div className="max-w-[12rem] border-b-2 border-[#244fe8] pb-2">
                {t.home.sheetLineTopic}
              </div>
              <div className="max-w-[16rem] border-b-2 border-[#244fe8] pb-2">
                {t.home.sheetLineMistakes}
              </div>
              <div className="max-w-[10rem] border-b-2 border-[#244fe8] pb-2">
                {t.home.sheetLineTomorrow}
              </div>
            </div>
            <div className="absolute bottom-5 right-6 font-mono text-5xl font-black tracking-[-0.12em] text-[#244fe8]/20">
              PE
            </div>
          </div>
        </div>
      </section>

      {recentSubjects.length > 0 && (
        <div className="mb-10 text-left" key={recentKey}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-label">
              {t.home.recentlyVisited}
            </h2>
            <button
              type="button"
              onClick={handleClearRecent}
              className="text-fg-muted hover:text-red-500 transition-colors p-1 rounded"
              aria-label={t.home.clearRecent}
              title={t.home.clearRecent}
            >
              <TrashIcon />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slots.map((slot, i) => (
              <div
                key={
                  slot.type === "subject" ? slot.subject.id : `placeholder-${i}`
                }
                className={slotClassName(i, slot.type === "placeholder")}
              >
                {slot.type === "subject" ? (
                  <LangLink
                    to={`/${slot.subject.id}`}
                    onClick={() => {
                      recordSubjectClick(slot.subject.id);
                      track("subject_card_click", {
                        subjectId: slot.subject.id,
                        location: "recent",
                      });
                    }}
                    className="file-card block w-full p-5 ps-7 transition duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">
                        {slot.subject.icon}
                      </span>
                      <span className="font-semibold text-fg text-base">
                        {slot.subject.name}
                      </span>
                    </div>
                  </LangLink>
                ) : (
                  <PlaceholderCard />
                )}
              </div>
            ))}
          </div>
          <hr className="mt-10 border-border" />
        </div>
      )}

      <div className="mb-4 flex items-end justify-between gap-4 text-left">
        <div>
          <p className="section-label">{t.home.availableSubjects}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
            {t.home.subjectGridTitle}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="animate-fade-in-up timeline-view animate-range-entry"
          >
            <SubjectCard subject={subject} />
          </div>
        ))}
        <div className="animate-fade-in-up timeline-view animate-range-entry">
          <button
            type="button"
            onClick={() => {
              modalRef.current?.open();
              track("add_subject_modal_open");
            }}
            className="file-card-soft block w-full p-5 text-fg-muted transition duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[120px] gap-2">
              <span className="text-4xl font-light leading-none">+</span>
              <span className="text-sm font-medium">{t.home.addSubject}</span>
            </div>
          </button>
        </div>
      </div>

      <AddSubjectModal ref={modalRef} onClose={() => {}} />
    </div>
  );
}
