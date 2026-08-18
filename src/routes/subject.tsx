import { useParams, type MetaFunction } from "react-router";
import SubjectHome from "../pages/SubjectHome";
import { isLang } from "../i18n/context-value";
import { getSubject } from "../subjects";
import { questionOverviewsBySubject } from "../subjects/questionOverviews.generated";
import { buildSubjectMeta } from "../seo/meta";
import { pageMetaDescriptors } from "../seo/route-meta";

function getQuestionOverview(subjectId: string) {
  return questionOverviewsBySubject[
    subjectId as keyof typeof questionOverviewsBySubject
  ];
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
  const overview = getQuestionOverview(subject.id);
  const questionCount = overview
    ? Object.entries(overview.exams).reduce(
        (total, [examId, exam]) =>
          availableExamIds.has(examId) ? total + exam.questionCount : total,
        0,
      )
    : 0;
  const page = buildSubjectMeta(params.lang, subject, {
    questionCount,
  });
  return pageMetaDescriptors(page);
};

export default function SubjectRoute() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const overview = subjectId ? getQuestionOverview(subjectId) : undefined;
  return <SubjectHome overview={overview} />;
}
