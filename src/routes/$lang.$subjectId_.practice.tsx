import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/$subjectId_/practice")({
  component: SubjectPracticeRedirect,
});

function SubjectPracticeRedirect() {
  const { lang, subjectId } = Route.useParams();

  return (
    <Navigate to="/$lang/$subjectId" params={{ lang, subjectId }} replace />
  );
}
