import { Link } from "react-router-dom";
import type { Topic } from "../data/types";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  subjectId: string;
  topic: Topic;
  questionCount: number;
  pointsCount: number;
  progress?: number;
}

const colorClasses: Record<string, string> = {
  blue: "hover:ring-blue-400/50",
  indigo: "hover:ring-indigo-400/50",
  green: "hover:ring-green-400/50",
  purple: "hover:ring-purple-400/50",
  pink: "hover:ring-pink-400/50",
  amber: "hover:ring-amber-400/50",
  red: "hover:ring-red-400/50",
  cyan: "hover:ring-cyan-400/50",
  orange: "hover:ring-orange-400/50",
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
      className={cn(
        "block hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none rounded-xl transition-transform duration-200",
        colorClasses[topic.color] || colorClasses.blue,
      )}
      onClick={() => {
        triggerLight();
        track("topic_card_click", { subjectId, topic: topic.key });
      }}
    >
      <Card className="transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <span className="text-2xl" role="img" aria-hidden="true">
              {topic.icon}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {questionCount} {t.subjectCard.questions} &middot; {pointsCount}{" "}
              {t.subjectCard.points}
            </span>
          </div>
          <CardTitle className="text-sm">{topic.label}</CardTitle>
        </CardHeader>
        {progress !== undefined && (
          <CardContent>
            <Progress value={Math.min(progress, 100)} />
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
