import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { TriangleWarning } from "reicon-react";

import type { QuestionType } from "../data/types";

function getQuestionTypeLabel(
  type: QuestionType,
  labels: Record<QuestionType, string>,
): string {
  return labels[type];
}

function buildDisclaimerReportUrl(
  subjectId: string,
  questionId: string,
  questionType: QuestionType,
  reportTitle: string,
  questionTypes: Record<QuestionType, string>,
): string {
  const base = "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new";
  const params = new URLSearchParams();
  params.set("template", "report-question.yml");
  params.set("subject", subjectId);
  params.set("question-id", questionId);
  params.set("title", `[${reportTitle}] ${questionId}`);
  params.set(
    "question-type",
    getQuestionTypeLabel(questionType, questionTypes),
  );
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
    <div className="border-border mt-8 border-t pt-6">
      <p className="text-fg-muted text-xs leading-relaxed">
        {t.disclaimer.text}{" "}
        <a
          href={buildDisclaimerReportUrl(
            subjectId,
            questionId,
            questionType,
            t.questionCard.reportIssueTitle,
            t.questionCard.questionTypes,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="text-fg-muted hover:text-incorrect-fg focus-visible:ring-incorrect-fg rounded text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => {
            triggerLight();
            track("report_issue", {
              subjectId,
              source: "disclaimer",
            });
          }}
        >
          <TriangleWarning
            size={12}
            aria-hidden="true"
            className="mr-1 inline-block align-[-0.15em]"
          />
          {t.disclaimer.reportLink}
        </a>
        {t.disclaimer.postLinkText}
      </p>
    </div>
  );
}
