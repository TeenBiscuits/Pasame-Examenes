import { useRef, useState, useLayoutEffect } from "react";

function acronym(name: string): string {
  const letters = name.replace(/[^A-Z]/g, "");
  return letters || name.charAt(0).toUpperCase();
}

interface OverflowAcronymProps {
  name: string;
  className?: string;
}

export default function OverflowAcronym({ name, className }: OverflowAcronymProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const didOverflow = useRef(false);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    didOverflow.current = false;
    setOverflowing(false);

    const el = containerRef.current;
    if (!el) return;

    const check = () => {
      if (didOverflow.current) return;
      if (el.scrollWidth > el.clientWidth) {
        didOverflow.current = true;
        setOverflowing(true);
      }
    };

    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [name]);

  return (
    <span
      ref={containerRef}
      className={className}
      aria-label={name}
      title={overflowing ? name : undefined}
    >
      {overflowing ? acronym(name) : name}
    </span>
  );
}
