import { Navigate, useParams } from "react-router";

export default function NotFound() {
  const { lang = "es" } = useParams();
  return <Navigate to={`/${lang}`} replace />;
}
