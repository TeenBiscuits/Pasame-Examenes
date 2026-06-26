import { LangLink as Link } from "../lib/lang-link";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { useCms } from "../lib/cms-context";
import EditableField from "../components/CmsEditor/EditableField";
import type { Exam } from "../data/types";

interface ExamCardEditorProps {
  subjectId: string;
  exam: Exam;
}

export default function ExamCardEditor({ subjectId, exam }: ExamCardEditorProps) {
  const { isEditing, patchMeta } = useCms();

  return (
    <div key={exam.year}>
      <Link
        to={`/${subjectId}/exam/${exam.year}`}
        className="block p-6 rounded-xl border-2 border-border hover:border-accent bg-surface-alt hover:bg-accent-light/30 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors transition-transform duration-200"
        onClick={() => {
          triggerLight();
          track("exam_card_click", {
            subjectId,
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
      {isEditing && (
        <div className="mt-2 p-2 border border-dashed border-amber-400/60 rounded-lg space-y-2">
          <span className="text-[10px] font-mono text-amber-600">
            Edit exam: {exam.year}
          </span>
          <EditableField
            value={exam.title}
            onChange={(v) =>
              patchMeta(subjectId, {
                exams: { [exam.year]: { title: v } },
              })
            }
            label="Title"
          />
          <EditableField
            value={exam.description}
            onChange={(v) =>
              patchMeta(subjectId, {
                exams: { [exam.year]: { description: v } },
              })
            }
            label="Description"
          />
          <EditableField
            value={String(exam.passPoints)}
            onChange={(v) => {
              const n = Number(v);
              if (!isNaN(n))
                patchMeta(subjectId, {
                  exams: { [exam.year]: { passPoints: n } },
                });
            }}
            type="number"
            label="Pass Points"
          />
          <EditableField
            value={String(exam.totalPoints)}
            onChange={(v) => {
              const n = Number(v);
              if (!isNaN(n))
                patchMeta(subjectId, {
                  exams: { [exam.year]: { totalPoints: n } },
                });
            }}
            type="number"
            label="Total Points"
          />
          <EditableField
            value={String(exam.durationMinutes)}
            onChange={(v) => {
              const n = Number(v);
              if (!isNaN(n))
                patchMeta(subjectId, {
                  exams: { [exam.year]: { durationMinutes: n } },
                });
            }}
            type="number"
            label="Duration (min)"
          />
          {exam.date != null && (
            <EditableField
              value={exam.date}
              onChange={(v) =>
                patchMeta(subjectId, {
                  exams: { [exam.year]: { date: v || null } },
                })
              }
              label="Date"
            />
          )}
        </div>
      )}
    </div>
  );
}
