import type { SubjectMeta } from "../data/types";
import { useT } from "../i18n/hooks";
import { hasAuthorizedExamContent } from "../lib/content-policy";

interface ContentPolicyIconProps {
  subject: SubjectMeta;
  className?: string;
  svgOnly?: boolean;
}

export default function ContentPolicyIcon({
  subject,
  className = "",
  svgOnly = false,
}: ContentPolicyIconProps) {
  const t = useT();
  const isAuthorized = hasAuthorizedExamContent(subject);
  const label = isAuthorized
    ? t.contentPolicy.authorized
    : t.contentPolicy.community;
  const icon = isAuthorized ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={svgOnly ? className : "size-4"}
      role={svgOnly ? "img" : undefined}
      aria-label={svgOnly ? label : undefined}
      aria-hidden={svgOnly ? undefined : "true"}
    >
      <path d="M10 3.25a1 1 0 00-.447.106l-7 3.5a1 1 0 000 1.788l7 3.5a1 1 0 00.894 0l5.553-2.776V13a1 1 0 102 0V7.75a1 1 0 00-.553-.894l-7-3.5A1 1 0 0010 3.25z" />
      <path d="M5 10.35v2.15c0 1.933 2.239 3.5 5 3.5s5-1.567 5-3.5v-2.15l-3.658 1.829a3 3 0 01-2.684 0L5 10.35z" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={svgOnly ? className : "size-4"}
      role={svgOnly ? "img" : undefined}
      aria-label={svgOnly ? label : undefined}
      aria-hidden={svgOnly ? undefined : "true"}
    >
      <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM13 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM7 10c-2.761 0-5 1.79-5 4v1a1 1 0 001 1h8a1 1 0 001-1v-1c0-2.21-2.239-4-5-4zM13.5 11c-.587 0-1.146.104-1.657.293A4.78 4.78 0 0114 15v1h3a1 1 0 001-1v-.5c0-1.933-2.015-3.5-4.5-3.5z" />
    </svg>
  );

  if (svgOnly) {
    return icon;
  }

  return (
    <span
      className={`inline-flex size-6 shrink-0 items-center justify-center rounded border ${
        isAuthorized
          ? "border-accent-border bg-accent-light text-accent-fg"
          : "border-contribute-border bg-contribute-bg text-contribute-fg"
      } ${className}`}
      role="img"
      aria-label={label}
      title={label}
    >
      {icon}
    </span>
  );
}
