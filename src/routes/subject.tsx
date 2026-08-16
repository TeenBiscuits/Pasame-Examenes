import { useParams, type MetaFunction } from "react-router";
import SubjectHome from "../pages/SubjectHome";
import { isLang } from "../i18n/context-value";
import { getSubject } from "../subjects";
import { questionSummariesBySubject } from "../subjects/questionSummaries.generated";
import { buildSubjectMeta } from "../seo/meta";
import { pageMetaDescriptors } from "../seo/route-meta";

function getQuestionSummaries(subjectId: string) {
  return (
    questionSummariesBySubject[
      subjectId as keyof typeof questionSummariesBySubject
    ] ?? []
  );
}

export const meta: MetaFunction = ({ params }) => {
  if (!isLang(params.lang)) {
    return [{ name: "robots", content: "noindex, nofollow" }];
  }
  const subject = params.subjectId ? getSubject(params.subjectId) : undefined;
  if (!subject) {
    return [
      { title: "Pásame Exámenes" },
      { name: "robots", content: "noindex, nofollow" },
    ];
  }

  const availableExamIds = new Set<string>();
  for (const exam of subject.exams) {
    if (!exam.deleteRights) availableExamIds.add(exam.id);
  }
  const questionCount = getQuestionSummaries(subject.id).filter((question) =>
    availableExamIds.has(question.examId),
  ).length;
  const page = buildSubjectMeta(params.lang, subject, {
    questionCount,
  });
  return pageMetaDescriptors(page);
};

export default function SubjectRoute() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const questionSummaries = subjectId ? getQuestionSummaries(subjectId) : [];
  return <SubjectHome initialQuestions={[...questionSummaries]} />;
}
