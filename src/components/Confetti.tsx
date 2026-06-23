import { useEffect, useRef } from "react";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8B500", "#FF8A5C",
];

interface Piece {
  id: number;
  color: string;
  width: number;
  height: number;
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
  rotation: number;
  delay: number;
  duration: number;
}

const PIECE_COUNT = 40;

function createPiece(i: number): Piece {
  const fromLeft = Math.random() > 0.5;
  const size = 6 + Math.random() * 8;
  return {
    id: i,
    color: COLORS[i % COLORS.length],
    width: size,
    height: Math.random() > 0.5 ? size : size * 0.6,
    startX: fromLeft ? -10 : 110,
    startY: Math.random() * 60,
    midX: 25 + Math.random() * 50,
    midY: 5 + Math.random() * 80,
    endX: fromLeft ? 85 + Math.random() * 20 : -(Math.random() * 20),
    endY: Math.random() * 100,
    rotation: (Math.random() - 0.5) * 1080,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1.5,
  };
}

function generateCss(pieces: Piece[]): string {
  return pieces
    .map(
      (p) => `
@keyframes c${p.id} {
  0%   { transform: translate(${p.startX}vw, ${p.startY}vh) rotate(0deg); opacity: 1; }
  35%  { transform: translate(${p.midX}vw, ${p.midY}vh) rotate(${p.rotation * 0.4}deg); opacity: 1; }
  100% { transform: translate(${p.endX}vw, ${p.endY}vh) rotate(${p.rotation}deg); opacity: 0; }
}`,
    )
    .join("\n");
}

export default function Confetti({ fire }: { fire: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (fire <= 0) return;

    cleanupRef.current?.();

    const pieces = Array.from({ length: PIECE_COUNT }, (_, i) =>
      createPiece(i),
    );

    const style = document.createElement("style");
    style.textContent = generateCss(pieces);
    document.head.appendChild(style);

    const container = containerRef.current;
    if (!container) return;

    const fragment = document.createDocumentFragment();
    for (const p of pieces) {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.top = "0";
      div.style.left = "0";
      div.style.width = `${p.width}px`;
      div.style.height = `${p.height}px`;
      div.style.backgroundColor = p.color;
      div.style.borderRadius = "2px";
      div.style.animationName = `c${p.id}`;
      div.style.animationDuration = `${p.duration}s`;
      div.style.animationDelay = `${p.delay}s`;
      div.style.animationTimingFunction = "ease-out";
      div.style.animationFillMode = "forwards";
      fragment.appendChild(div);
    }
    container.appendChild(fragment);

    const cleanup = () => {
      if (container) container.innerHTML = "";
      style.remove();
    };
    cleanupRef.current = cleanup;

    const timer = setTimeout(cleanup, 4000);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [fire]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
}
