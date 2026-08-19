import { createFileRoute } from "@tanstack/react-router";
import SubjectHome from "../pages/SubjectHome";
import { questionSummariesBySubject } from "../subjects/questionSummaries.generated";

function getQuestionSummaries(subjectId: string) {
  return (
    questionSummariesBySubject[
      subjectId as keyof typeof questionSummariesBySubject
    ] ?? []
  );
}

export const Route = createFileRoute("/$lang/$subjectId")({
  component: SubjectRoute,
});

function SubjectRoute() {
  const { subjectId } = Route.useParams();
  const questionSummaries = getQuestionSummaries(subjectId);

  return <SubjectHome initialQuestions={[...questionSummaries]} />;
}
