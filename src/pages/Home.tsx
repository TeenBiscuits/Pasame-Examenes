import { subjects } from "../subjects";
import SubjectCard from "../components/SubjectCard";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Pasame Examenes</h1>
      <p className="text-gray-600 max-w-xl mx-auto mb-10">
        Open-source platform for practicing university exams. Choose a subject
        below to start drilling questions from past exams.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  );
}
