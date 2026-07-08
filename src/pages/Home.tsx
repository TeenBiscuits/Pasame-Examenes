import { useMemo, useRef, useState } from "react";
import { subjects } from "../subjects";
import SubjectCard from "../components/SubjectCard";
import Hero from "../components/Hero";
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
      className="block w-full p-5 rounded-xl border-2 border-dashed border-border"
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
    <>
      <Hero
        emojis={subjects.map((s) => s.icon)}
        className="animate-fade-in animate-duration-fast"
      >
        <h1 className="text-4xl font-semibold text-fg mb-3 sm:text-5xl lg:text-6xl">
          {t.home.title}
        </h1>
        <p className="mx-auto max-w-2xl text-base text-fg-secondary sm:text-lg lg:text-xl">
          {t.home.subtitle}
        </p>
      </Hero>
      <div className="max-w-6xl mx-auto px-4 pb-8 text-center animate-fade-in animate-duration-fast">
        {recentSubjects.length > 0 && (
        <div className="mb-10 text-left" key={recentKey}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wide">
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
                    className="block w-full p-5 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md transition-colors transition-transform duration-200"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
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
            className="block w-full p-5 rounded-xl border-2 border-dashed border-border text-fg-muted hover:text-accent hover:border-accent hover:bg-accent-light/30 hover:scale-[1.02] transition-colors transition-transform duration-200 cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center h-full min-h-[120px] gap-2">
              <span className="text-4xl font-light leading-none">+</span>
              <span className="text-sm font-medium">{t.home.addSubject}</span>
            </div>
          </button>
        </div>
      </div>

      <blockquote className="mx-auto mt-14 max-w-2xl border-y border-border py-8 text-center text-xl font-medium italic text-fg-secondary sm:text-2xl">
        “{t.home.quote}”
      </blockquote>

      <AddSubjectModal ref={modalRef} onClose={() => {}} />
      </div>
    </>
  );
}
