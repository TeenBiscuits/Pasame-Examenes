import type { ReactNode } from "react";

interface ScoreProgressProps {
  score: number;
  totalPoints: number;
  pendingPoints: number;
  colorClassName: string;
  className?: string;
  children: ReactNode;
}

export default function ScoreProgress({
  score,
  totalPoints,
  pendingPoints,
  colorClassName,
  className = "",
  children,
}: ScoreProgressProps) {
  const progress =
    totalPoints > 0 ? Math.min(1, Math.max(0, score / totalPoints)) : 0;
  const potentialProgress =
    totalPoints > 0
      ? Math.min(1, Math.max(progress, (score + pendingPoints) / totalPoints))
      : 0;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className={`pointer-events-none absolute right-4 bottom-4 left-4 h-2 overflow-hidden rounded-full bg-current/15 ${colorClassName}`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 origin-left rounded-full bg-current transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
        {potentialProgress > progress && (
          <div
            className="absolute inset-0 opacity-60 transition-[clip-path] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, currentColor 0 3px, transparent 3px 6px)",
              clipPath: `inset(0 ${(1 - potentialProgress) * 100}% 0 ${progress * 100}%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
