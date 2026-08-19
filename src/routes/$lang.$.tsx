import { Navigate, createFileRoute } from "@tanstack/react-router";
import { isLang } from "../i18n/context-value";

export const Route = createFileRoute("/$lang/$")({
  component: NotFound,
});

function NotFound() {
  const { lang: paramLang } = Route.useParams();
  const lang = isLang(paramLang) ? paramLang : "es";

  return <Navigate to="/$lang" params={{ lang }} replace />;
}
