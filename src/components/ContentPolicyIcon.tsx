import type { SubjectMeta } from "../data/types";
import { useT } from "../i18n/hooks";
import { hasAuthorizedExamContent } from "../lib/content-policy";
import { Users3, GraduationCap } from "reicon-react";

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
    <GraduationCap
      size={24}
      weight="Filled"
      className={svgOnly ? className : "size-4"}
      role="img"
      aria-label={label}
    />
  ) : (
    <Users3
      className={svgOnly ? className : "size-4"}
      role="img"
      weight="Filled"
      aria-label={label}
    />
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
      title={label}
    >
      {icon}
    </span>
  );
}
