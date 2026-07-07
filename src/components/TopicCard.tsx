import { LangLink as Link } from "../lib/lang-link";
import type { Topic } from "../data/types";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";

interface TopicCardProps {
  subjectId: string;
  topic: Topic;
  questionCount: number;
  pointsCount: number;
  progress?: number;
}

const colorMap: Record<string, string> = {
  blue: "border-t-blue-border hover:border-t-blue-hover bg-t-blue-bg/70 hover:bg-t-blue-bg",
  indigo:
    "border-t-indigo-border hover:border-t-indigo-hover bg-t-indigo-bg/70 hover:bg-t-indigo-bg",
  green:
    "border-t-green-border hover:border-t-green-hover bg-t-green-bg/70 hover:bg-t-green-bg",
  purple:
    "border-t-purple-border hover:border-t-purple-hover bg-t-purple-bg/70 hover:bg-t-purple-bg",
  pink: "border-t-pink-border hover:border-t-pink-hover bg-t-pink-bg/70 hover:bg-t-pink-bg",
  amber:
    "border-t-amber-border hover:border-t-amber-hover bg-t-amber-bg/70 hover:bg-t-amber-bg",
  red: "border-t-red-border hover:border-t-red-hover bg-t-red-bg/70 hover:bg-t-red-bg",
  cyan: "border-t-cyan-border hover:border-t-cyan-hover bg-t-cyan-bg/70 hover:bg-t-cyan-bg",
  orange:
    "border-t-orange-border hover:border-t-orange-hover bg-t-orange-bg/70 hover:bg-t-orange-bg",
};

export default function TopicCard({
  subjectId,
  topic,
  questionCount,
  pointsCount,
  progress,
}: TopicCardProps) {
  const t = useT();
  return (
    <Link
      to={`/${subjectId}/practice/${topic.key}`}
      className={`block rounded-2xl border border-l-4 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${colorMap[topic.color] || colorMap.blue}`}
      onClick={() => {
        triggerLight();
        track("topic_card_click", { subjectId, topic: topic.key });
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-surface-alt/70 text-2xl" aria-hidden="true">
          {topic.icon}
        </span>
        <span className="max-w-32 text-right font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-fg-muted">
          {questionCount} {t.subjectCard.questions} &middot; {pointsCount}{" "}
          {t.subjectCard.points}
        </span>
      </div>
      <h2 className="mb-3 text-sm font-semibold leading-snug text-fg">{topic.label}</h2>
      {progress !== undefined && (
        <div className="mt-2">
          <div className="h-2 overflow-hidden rounded-full bg-surface-alt/80 ring-1 ring-border/70">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
