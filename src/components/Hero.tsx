import { type CSSProperties, type ReactNode } from "react";
import FloatingEmoji from "./FloatingEmoji";

function pseudo(i: number, salt: number, seed: number): number {
  const x = Math.sin(i * 9301 + salt * 49297 + seed * 8347) * 233280;
  return x - Math.floor(x);
}

interface HeroProps {
  emojis: string[];
  children: ReactNode;
  className?: string;
  compact?: boolean;
}

function buildDesktopStyle(
  i: number,
  count: number,
  compact: boolean,
  seed: number,
): CSSProperties {
  const perZone = Math.max(1, Math.ceil(count / 4));
  const zone = i % 4;
  const zoneIndex = Math.floor(i / 4);
  const progress = perZone > 1 ? zoneIndex / (perZone - 1) : 0.5;
  let left: number;
  let top: number;

  if (zone === 0) {
    left = 8 + progress * 84 + (pseudo(i, 1, seed) - 0.5) * 3;
    top = 6 + pseudo(i, 2, seed) * 14;
  } else if (zone === 1) {
    left = 3 + pseudo(i, 1, seed) * 14;
    top = 24 + progress * 40 + (pseudo(i, 2, seed) - 0.5) * 3;
  } else if (zone === 2) {
    left = 83 + pseudo(i, 1, seed) * 14;
    top = 24 + progress * 40 + (pseudo(i, 2, seed) - 0.5) * 3;
  } else {
    left = 8 + progress * 84 + (pseudo(i, 1, seed) - 0.5) * 3;
    top = compact
      ? 54 + pseudo(i, 2, seed) * 8
      : 66 + pseudo(i, 2, seed) * 12;
  }

  const rotation = (pseudo(i, 3, seed) - 0.5) * 44;
  const delay = -(pseudo(i, 4, seed) * 8);
  const fontRem = compact
    ? 3 + pseudo(i, 5, seed) * 2.6
    : 3.4 + pseudo(i, 5, seed) * 3.2;

  return {
    left: `${left.toFixed(2)}%`,
    top: `${top.toFixed(2)}%`,
    transform: `rotate(${rotation.toFixed(1)}deg)`,
    animationDelay: `${delay.toFixed(2)}s`,
    fontSize: `clamp(3rem, 4.4vw, ${fontRem.toFixed(2)}rem)`,
    opacity: 0.9,
  };
}

function buildMobileStyle(
  i: number,
  count: number,
  seed: number,
  compact: boolean,
): CSSProperties {
  if (!compact) {
    const perZone = Math.max(1, Math.ceil(count / 4));
    const zone = i % 4;
    const zoneIndex = Math.floor(i / 4);
    const progress = perZone > 1 ? zoneIndex / (perZone - 1) : 0.5;
    let left: number;
    let top: number;

    if (zone === 0) {
      left = 6 + progress * 88 + (pseudo(i, 6, seed) - 0.5) * 4;
      top = 6 + pseudo(i, 7, seed) * 12;
    } else if (zone === 1) {
      left = 3 + pseudo(i, 6, seed) * 12;
      top = 22 + progress * 42 + (pseudo(i, 7, seed) - 0.5) * 4;
    } else if (zone === 2) {
      left = 85 + pseudo(i, 6, seed) * 12;
      top = 22 + progress * 42 + (pseudo(i, 7, seed) - 0.5) * 4;
    } else {
      left = 6 + progress * 88 + (pseudo(i, 6, seed) - 0.5) * 4;
      top = 66 + pseudo(i, 7, seed) * 10;
    }

    const rotation = (pseudo(i, 8, seed) - 0.5) * 38;
    const delay = -(pseudo(i, 9, seed) * 8);
    const fontRem = 1.95 + pseudo(i, 10, seed) * 1.55;

    return {
      left: `${left.toFixed(2)}%`,
      top: `${top.toFixed(2)}%`,
      transform: `rotate(${rotation.toFixed(1)}deg)`,
      animationDelay: `${delay.toFixed(2)}s`,
      fontSize: `clamp(1.65rem, 8.8vw, ${fontRem.toFixed(2)}rem)`,
      opacity: 0.78,
    };
  }

  const columns = Math.min(3, Math.max(1, count));
  const rows = Math.max(1, Math.ceil(count / columns));
  const col = i % columns;
  const row = Math.floor(i / columns);
  const colStep = columns > 1 ? 78 / (columns - 1) : 0;
  const rowStep = rows > 1 ? 56 / (rows - 1) : 0;
  const left = 11 + col * colStep + (pseudo(i, 6, seed) - 0.5) * 6;
  const top = 14 + row * rowStep + (pseudo(i, 7, seed) - 0.5) * 4;
  const rotation = (pseudo(i, 8, seed) - 0.5) * 38;
  const delay = -(pseudo(i, 9, seed) * 8);
  const fontRem = 1.95 + pseudo(i, 10, seed) * 1.55;

  return {
    left: `${Math.min(88, Math.max(4, left)).toFixed(2)}%`,
    top: `${Math.min(76, Math.max(8, top)).toFixed(2)}%`,
    transform: `rotate(${rotation.toFixed(1)}deg)`,
    animationDelay: `${delay.toFixed(2)}s`,
    fontSize: `clamp(1.65rem, 8.8vw, ${fontRem.toFixed(2)}rem)`,
    opacity: 0.78,
  };
}

export default function Hero({
  emojis,
  children,
  className = "",
  compact = false,
}: HeroProps) {
  const seed = 0;

  const placementOffset =
    emojis.length > 0 ? Math.floor(pseudo(0, 11, seed) * emojis.length) : 0;
  const spacing = compact ? "py-16 md:py-[50px]" : "py-24 sm:py-28 lg:py-32";

  return (
    <section className={`relative w-full overflow-hidden ${className}`}>
      <div
        className="absolute inset-y-0 left-1/2 z-0 hidden w-full max-w-6xl -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        {emojis.map((emoji, i) => {
          const slot = (i + placementOffset) % emojis.length;
          return (
            <FloatingEmoji
              key={`${emoji}-${i}`}
              emoji={emoji}
              style={buildDesktopStyle(slot, emojis.length, compact, seed)}
            />
          );
        })}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-full max-w-6xl -translate-x-1/2 md:hidden"
        aria-hidden="true"
      >
        {emojis.map((emoji, i) => {
          const slot = (i + placementOffset) % emojis.length;
          return (
            <span
              key={`${emoji}-${i}-mobile`}
              className="floating-emoji-mark select-none"
              style={buildMobileStyle(slot, emojis.length, seed, compact)}
            >
              {emoji}
            </span>
          );
        })}
      </div>
      <div
        className={`pointer-events-none relative z-10 mx-auto max-w-6xl px-4 text-center ${spacing}`}
      >
        {children}
      </div>
    </section>
  );
}
