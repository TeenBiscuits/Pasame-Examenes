import { useLocation, useMatch } from "react-router";
import { getSubject } from "../subjects";
import { useT } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { LangLink as Link } from "../lib/lang-link";
import GitHubStarButton from "./GitHubStarButton";
import SettingsModal from "./SettingsModal";

function acronym(name: string): string {
  const letters = name.replace(/[^A-Z]/g, "");
  return letters || name.charAt(0).toUpperCase();
}

export default function Header() {
  const location = useLocation();
  const match = useMatch("/:lang/:subjectId/*");
  const subjectId = match?.params.subjectId;
  const t = useT();
  const subject = subjectId ? getSubject(subjectId) : null;

  const abbr = subject ? acronym(subject.name) : "";

  const subjectLinkBase = `rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors ${
    location.pathname === `/${subjectId}` ||
    location.pathname.startsWith(`/${subjectId}/`)
      ? "bg-accent-light text-accent-fg"
      : "text-fg-secondary hover:text-fg"
  }`;
  const acronymLinkClasses = `px-1.5 py-1 sm:px-3 sm:py-1.5 ${subjectLinkBase}`;
  const subjectLinkClasses = `px-3 py-1.5 ${subjectLinkBase}`;

  return (
    <header className="bg-surface-alt border-border border-b sm:sticky sm:top-0 sm:z-50">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          data-cuelume-hover="sparkle"
          data-cuelume-press
          className="text-fg hover:text-accent focus-visible:ring-accent group flex items-center gap-2 rounded-md text-lg font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onClick={() => {
            triggerLight();
            track("nav_click", { target: "home" });
          }}
        >
          <img
            src="/favicon.svg"
            alt=""
            width={28}
            height={32}
            className="h-8 w-7"
            aria-hidden="true"
          />
          <p className="text-sm sm:text-lg">{t.home.title}</p>
        </Link>
        <div className="flex items-center gap-1 text-sm sm:gap-3">
          {subject && (
            <>
              <Link
                to={`/${subjectId}`}
                data-cuelume-hover="tick"
                data-cuelume-press
                className={`sm:hidden ${acronymLinkClasses}`}
                onClick={() => {
                  triggerLight();
                  track("nav_click", {
                    target: "subject_home",
                    subjectId: subjectId || "",
                  });
                }}
                title={subject.name}
              >
                {abbr}
              </Link>
              <Link
                to={`/${subjectId}`}
                data-cuelume-hover="tick"
                data-cuelume-press
                className={`hidden max-w-56 truncate sm:block ${subjectLinkClasses}`}
                onClick={() => {
                  triggerLight();
                  track("nav_click", {
                    target: "subject_home",
                    subjectId: subjectId || "",
                  });
                }}
                title={subject.name}
              >
                {subject.name}
              </Link>
            </>
          )}
          <GitHubStarButton />
          <SettingsModal />
        </div>
      </div>
    </header>
  );
}
