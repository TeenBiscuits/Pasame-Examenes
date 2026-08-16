import { LangLink as Link } from "../lib/lang-link";
import type { Topic } from "../data/types";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { formatPoints } from "../lib/points";
import { getAllQuestions } from "../subjects";

interface TopicCardProps {
  subjectId: string;
  topic: Topic;
  topicIndex: number;
  questionCount: number;
  pointsCount: number;
  progress?: number;
}

// Presentation order only: topic metadata should never choose a card color.
const topicCardVariants = [
  {
    lower: "bg-topic-blue-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-blue-border",
    track: "bg-topic-blue-border/20",
    progress: "text-topic-blue-border",
  },
  {
    lower: "bg-topic-indigo-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-indigo-border",
    track: "bg-topic-indigo-border/20",
    progress: "text-topic-indigo-border",
  },
  {
    lower: "bg-topic-green-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-green-border",
    track: "bg-topic-green-border/20",
    progress: "text-topic-green-border",
  },
  {
    lower: "bg-topic-purple-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-purple-border",
    track: "bg-topic-purple-border/20",
    progress: "text-topic-purple-border",
  },
  {
    lower: "bg-topic-pink-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-pink-border",
    track: "bg-topic-pink-border/20",
    progress: "text-topic-pink-border",
  },
  {
    lower: "bg-topic-amber-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-amber-border",
    track: "bg-topic-amber-border/20",
    progress: "text-topic-amber-border",
  },
  {
    lower: "bg-topic-red-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-red-border",
    track: "bg-topic-red-border/20",
    progress: "text-topic-red-border",
  },
  {
    lower: "bg-topic-cyan-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-cyan-border",
    track: "bg-topic-cyan-border/20",
    progress: "text-topic-cyan-border",
  },
  {
    lower: "bg-topic-orange-bg/60",
    lowerBorder: "border-x-2 border-b-2 border-topic-orange-border",
    track: "bg-topic-orange-border/20",
    progress: "text-topic-orange-border",
  },
] as const;

export default function TopicCard({
  subjectId,
  topic,
  topicIndex,
  questionCount,
  pointsCount,
  progress,
}: TopicCardProps) {
  const t = useT();
  const variantIndex =
    ((topicIndex % topicCardVariants.length) + topicCardVariants.length) %
    topicCardVariants.length;
  const variant = topicCardVariants[variantIndex];
  const progressValue =
    progress === undefined ? undefined : Math.min(Math.max(progress, 0), 100);

  return (
    <Link
      to={`/${subjectId}/practice/${topic.key}`}
      rel="nofollow"
      prefetch="intent"
      onMouseEnter={() => void getAllQuestions(subjectId)}
      onFocus={() => void getAllQuestions(subjectId)}
      data-cuelume-hover="tick"
      data-cuelume-press
      className="interactive-card focus-visible:ring-accent flex h-[122px] flex-col rounded-xl hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
      onClick={() => {
        triggerLight();
        track("topic_card_click", { subjectId, topic: topic.key });
      }}
    >
      <div className="border-border bg-surface-alt flex flex-col rounded-t-xl border-x-2 border-t-2 px-3 pt-2 pb-1">
        <div className="flex items-start justify-between gap-4">
          <span className="text-3xl leading-none" aria-hidden="true">
            {topic.icon}
          </span>
          <span className="bg-code text-fg-secondary inline-flex shrink-0 items-center rounded px-2 py-1 text-xs font-semibold whitespace-nowrap tabular-nums">
            {questionCount} {t.subjectCard.questions}
          </span>
        </div>
        <h2
          className="text-fg mt-1 min-w-0 truncate text-base leading-snug font-semibold"
          title={topic.label}
        >
          {topic.label}
        </h2>
      </div>
      <div
        className={`${variant.lower} ${variant.lowerBorder} text-fg-muted flex-1 rounded-b-xl px-3 py-2 text-sm`}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span>
            {formatPoints(pointsCount)} {t.subjectCard.points}
          </span>
          {progressValue !== undefined && (
            <span className="tabular-nums">{Math.round(progressValue)}%</span>
          )}
        </div>
        {progressValue !== undefined && (
          <progress
            className={`${variant.track} ${variant.progress} mt-2 block h-1.5 w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-current [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-current`}
            aria-label={`${topic.label}: ${Math.round(progressValue)}%`}
            max={100}
            value={progressValue}
          />
        )}
      </div>
    </Link>
  );
}
