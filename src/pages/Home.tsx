import { useState } from "react";
import { subjects } from "../subjects";
import SubjectCard from "../components/SubjectCard";
import AddSubjectModal from "../components/AddSubjectModal";
import { useT } from "../i18n/hooks";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useT();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-center animate-fade-in animate-duration-fast">
      <h1 className="text-3xl font-bold text-foreground mb-3">
        {t.home.title}
      </h1>
      <p className="text-muted-foreground max-w-xl mx-auto mb-10">
        {t.home.subtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
        <Button
          variant="outline"
          className="w-full h-auto min-h-[180px] rounded-xl border-dashed hover:border-primary hover:text-primary flex flex-col items-center justify-center gap-2 p-5"
          onClick={() => setModalOpen(true)}
        >
          <span className="text-4xl font-light leading-none">+</span>
          <span className="text-sm font-medium">{t.home.addSubject}</span>
        </Button>
      </div>

      <AddSubjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
