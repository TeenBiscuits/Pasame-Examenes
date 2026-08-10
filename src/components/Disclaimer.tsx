import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { FilePdf, LinkSquare, TriangleWarning } from "reicon-react";

import type { Exam, QuestionType } from "../data/types";

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

function getOriginalMaterial(
  exam: Exam | undefined,
  subjectId: string,
): { href: string; kind: "pdf" | "link" } | null {
  if (!exam) return null;

  if (exam.hasPdf !== false) {
    return {
      href: `https://github.com/TeenBiscuits/Pasame-Examenes/raw/refs/heads/main/public/exams/${subjectId}/Exam-${exam.id}.pdf`,
      kind: "pdf",
    };
  }

  if (exam.originalUrl) {
    return { href: exam.originalUrl, kind: "link" };
  }

  return null;
}

export default function Disclaimer({
  subjectId,
  questionId,
  questionType,
  exam,
}: {
  subjectId: string;
  questionId: string;
  questionType: QuestionType;
  exam?: Exam;
}) {
  const t = useT();
  const originalMaterial = getOriginalMaterial(exam, subjectId);

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
        {originalMaterial && (
          <>
            {" "}
            {t.disclaimer.originalMaterialPrefix}{" "}
            <a
              href={originalMaterial.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-fg-secondary focus-visible:ring-accent rounded text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {originalMaterial.kind === "pdf" ? (
                <FilePdf
                  size={12}
                  aria-hidden="true"
                  className="mr-1 inline-block align-[-0.15em]"
                />
              ) : (
                <LinkSquare
                  size={12}
                  aria-hidden="true"
                  className="mr-1 inline-block align-[-0.15em]"
                />
              )}
              {t.disclaimer.originalMaterialLink}
            </a>
          </>
        )}
      </p>
    </div>
  );
}
