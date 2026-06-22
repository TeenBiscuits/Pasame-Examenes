import { Link } from "react-router-dom";
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
  blue: "border-t-blue-border hover:border-t-blue-hover bg-t-blue-bg/50 hover:bg-t-blue-bg",
  indigo:
    "border-t-indigo-border hover:border-t-indigo-hover bg-t-indigo-bg/50 hover:bg-t-indigo-bg",
  green:
    "border-t-green-border hover:border-t-green-hover bg-t-green-bg/50 hover:bg-t-green-bg",
  purple:
    "border-t-purple-border hover:border-t-purple-hover bg-t-purple-bg/50 hover:bg-t-purple-bg",
  pink: "border-t-pink-border hover:border-t-pink-hover bg-t-pink-bg/50 hover:bg-t-pink-bg",
  amber:
    "border-t-amber-border hover:border-t-amber-hover bg-t-amber-bg/50 hover:bg-t-amber-bg",
  red: "border-t-red-border hover:border-t-red-hover bg-t-red-bg/50 hover:bg-t-red-bg",
  cyan: "border-t-cyan-border hover:border-t-cyan-hover bg-t-cyan-bg/50 hover:bg-t-cyan-bg",
  orange:
    "border-t-orange-border hover:border-t-orange-hover bg-t-orange-bg/50 hover:bg-t-orange-bg",
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
      className={`block p-5 rounded-xl border-2 hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors transition-transform duration-200 ${colorMap[topic.color] || colorMap.blue}`}
      onClick={() => {
        triggerLight();
        track("topic_card_click", { subjectId, topic: topic.key });
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl" role="img" aria-hidden="true">
          {topic.icon}
        </span>
        <span className="text-xs text-fg-muted font-medium">
          {questionCount} {t.subjectCard.questions} &middot; {pointsCount}{" "}
          {t.subjectCard.points}
        </span>
      </div>
      <h3 className="font-semibold text-fg text-sm mb-2">
        {topic.label}
      </h3>
      {progress !== undefined && (
        <div className="mt-2">
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
