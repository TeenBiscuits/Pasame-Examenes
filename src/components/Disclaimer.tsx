import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";

import type { QuestionType } from "../data/types";
import { getQuestionTypeLabel } from "./QuestionCard";

function buildDisclaimerReportUrl(
  subjectId: string,
  questionId: string,
  questionType: QuestionType,
): string {
  const base = "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new";
  const params = new URLSearchParams();
  params.set("template", "report-question.yml");
  params.set("subject", subjectId);
  params.set("question-id", questionId);
  params.set("question-type", getQuestionTypeLabel(questionType));
  return `${base}?${params.toString()}`;
}

export default function Disclaimer({
  subjectId,
  questionId,
  questionType,
}: {
  subjectId: string;
  questionId: string;
  questionType: QuestionType;
}) {
  const t = useT();
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <p className="text-xs text-fg-muted leading-relaxed">
        {t.disclaimer.text}{" "}
        <a
          href={buildDisclaimerReportUrl(subjectId, questionId, questionType)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-fg-muted hover:text-red-500 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded"
          onClick={() => {
            triggerLight();
            track("report_issue", {
              subjectId,
              source: "disclaimer",
            });
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          {t.disclaimer.reportLink}
        </a>
        {t.disclaimer.postLinkText}
      </p>
    </div>
  );
}
