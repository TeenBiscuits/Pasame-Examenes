import { useMemo, useRef } from "react";
import { subjects } from "../subjects";
import SubjectCard from "../components/SubjectCard";
import AddSubjectModal, {
  type AddSubjectModalHandle,
} from "../components/AddSubjectModal";
import { useT } from "../i18n/hooks";
import { useDocumentTitle } from "../lib/title";
import { useSeoHead } from "../lib/seo";
import { LangLink } from "../lib/lang-link";
import { getRecentSubjects, recordSubjectClick } from "../lib/recent";

export default function Home() {
  const t = useT();
  useDocumentTitle(t.home.title);
  useSeoHead({
    title: t.home.title,
    description: t.seo.homeDescription,
    pathWithoutLang: "/",
  });
  const modalRef = useRef<AddSubjectModalHandle>(null);

  const recentSubjects = useMemo(() => {
    const recentIds = getRecentSubjects();
    return recentIds
      .map((id) => subjects.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s != null);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-center animate-fade-in animate-duration-fast">
      <h1 className="text-3xl font-bold text-fg mb-3">{t.home.title}</h1>
      <p className="text-fg-secondary max-w-xl mx-auto mb-10">
        {t.home.subtitle}
      </p>

      {recentSubjects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wide mb-3">
            {t.home.recentlyVisited}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {recentSubjects.map((subject) => (
              <LangLink
                key={subject.id}
                to={`/${subject.id}`}
                onClick={() => recordSubjectClick(subject.id)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface-alt text-fg hover:border-accent hover:bg-accent-light/30 hover:scale-[1.03] transition-colors transition-transform duration-200"
              >
                <span className="text-lg" aria-hidden="true">
                  {subject.icon}
                </span>
                <span className="text-sm font-medium">{subject.name}</span>
              </LangLink>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
        <button
          type="button"
          onClick={() => modalRef.current?.open()}
          className="block w-full p-5 rounded-xl border-2 border-dashed border-border text-fg-muted hover:text-accent hover:border-accent hover:bg-accent-light/30 hover:scale-[1.02] transition-colors transition-transform duration-200 cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[120px] gap-2">
            <span className="text-4xl font-light leading-none">+</span>
            <span className="text-sm font-medium">{t.home.addSubject}</span>
          </div>
        </button>
      </div>

      <AddSubjectModal ref={modalRef} onClose={() => {}} />
    </div>
  );
}
