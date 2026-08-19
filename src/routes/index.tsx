import { createFileRoute, redirect } from "@tanstack/react-router";
import { detectPreferredLang } from "../i18n/detect-lang";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    throw redirect({
      to: "/$lang",
      params: { lang: detectPreferredLang() },
      search: location.search,
      hash: location.hash,
      replace: true,
    });
  },
});
