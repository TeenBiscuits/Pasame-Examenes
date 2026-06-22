import { useState } from "react";
import { subjects } from "../subjects";
import SubjectCard from "../components/SubjectCard";
import AddSubjectModal from "../components/AddSubjectModal";
import { useT } from "../i18n/hooks";

export default function Home() {
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-center animate-fade-in animate-duration-fast">
      <h1 className="text-3xl font-bold text-fg mb-3">{t.home.title}</h1>
      <p className="text-fg-secondary max-w-xl mx-auto mb-10">{t.home.subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="block w-full p-5 rounded-xl border-2 border-dashed border-border text-fg-muted hover:text-accent hover:border-accent hover:bg-accent-light/30 hover:scale-[1.02] transition-colors transition-transform duration-200 cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[120px] gap-2">
            <span className="text-4xl font-light leading-none">+</span>
            <span className="text-sm font-medium">{t.home.addSubject}</span>
          </div>
        </button>
      </div>

      <AddSubjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
