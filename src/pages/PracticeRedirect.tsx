import { Navigate, useParams } from "react-router";

export default function PracticeRedirect() {
  const { lang, subjectId } = useParams();
  return <Navigate to={`/${lang}/${subjectId}`} replace />;
}
