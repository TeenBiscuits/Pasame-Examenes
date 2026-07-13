import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

interface FloatingEmojiProps {
  emoji: string;
  style: CSSProperties;
}

interface DragState {
  active: boolean;
  moved: boolean;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

const SPRING_MS = 800;
const SPRING_EASING = "cubic-bezier(0.18, 0.89, 0.32, 1.28)";

export default function FloatingEmoji({ emoji, style }: FloatingEmojiProps) {
  const drag = useRef<DragState>({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [flying, setFlying] = useState(false);
  const [pressed, setPressed] = useState(false);
  const baseTransform = style.transform as string | undefined;

  function handlePointerDown(e: ReactPointerEvent<HTMLSpanElement>) {
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: 0,
      offsetY: 0,
    };
    setFlying(false);
    setPressed(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLSpanElement>) {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.current.moved = true;
    drag.current.offsetX = dx;
    drag.current.offsetY = dy;
    setOffset({ x: dx, y: dy });
  }

  function endDrag(e: ReactPointerEvent<HTMLSpanElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    drag.current.active = false;
    setPressed(false);
    if (drag.current.moved) {
      setFlying(true);
      setOffset({ x: 0, y: 0 });
      window.setTimeout(() => setFlying(false), SPRING_MS);
    } else if (offset.x !== 0 || offset.y !== 0) {
      setOffset({ x: 0, y: 0 });
    }
  }

  const dragging = offset.x !== 0 || offset.y !== 0;

  let transform = baseTransform ?? "";
  if (dragging) {
    transform = `translate(${offset.x}px, ${offset.y}px) ${baseTransform ?? ""}`;
  }
  if (pressed) {
    transform += " scale(1.18)";
  }

  const isAnimating = pressed || dragging || flying;

  return (
    <span
      className={`floating-emoji-mark floating-emoji-interactive cursor-grab touch-none select-none active:cursor-grabbing ${
        isAnimating ? "will-change-transform" : ""
      }`}
      style={{
        ...style,
        transform,
        transition: flying
          ? `transform ${SPRING_MS}ms ${SPRING_EASING}`
          : pressed && !dragging
            ? "transform 0.15s ease-out"
            : undefined,
        animationPlayState: dragging || flying ? "paused" : undefined,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {emoji}
    </span>
  );
}
