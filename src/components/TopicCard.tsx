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
  blue: "border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50",
  indigo:
    "border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50",
  green:
    "border-green-200 hover:border-green-400 bg-green-50/50 hover:bg-green-50",
  purple:
    "border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50",
  pink: "border-pink-200 hover:border-pink-400 bg-pink-50/50 hover:bg-pink-50",
  amber:
    "border-amber-200 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50",
  red: "border-red-200 hover:border-red-400 bg-red-50/50 hover:bg-red-50",
  cyan: "border-cyan-200 hover:border-cyan-400 bg-cyan-50/50 hover:bg-cyan-50",
  orange:
    "border-orange-200 hover:border-orange-400 bg-orange-50/50 hover:bg-orange-50",
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
          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
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
