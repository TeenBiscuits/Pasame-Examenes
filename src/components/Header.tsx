import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { getSubject } from "../subjects";
import { useT, useLang } from "../i18n/hooks";
import type { Lang } from "../i18n/context";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import ThemeToggle from "../theme/ThemeToggle";
import SoundToggle from "./SoundToggle";
import { LangLink as Link } from "../lib/lang-link";
import { replaceLangInPath } from "../lib/lang-link-utils";
import GitHubStarButton from "./GitHubStarButton";

const langCycle: Lang[] = ["en", "es", "gl"];

const langLabel: Record<Lang, string> = {
  en: "🇬🇧 EN",
  es: "🇪🇸 ES",
  gl: "🧜🏻‍♀️ GL",
};

const langFlag: Record<Lang, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  gl: "🧜🏻‍♀️",
};

function acronym(name: string): string {
  const letters = name.replace(/[^A-Z]/g, "");
  return letters || name.charAt(0).toUpperCase();
}

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch("/:lang/:subjectId/*");
  const subjectId = match?.params.subjectId;
  const t = useT();
  const { lang, setLang } = useLang();
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
    <header className="bg-surface-alt border-border sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          data-cuelume-hover="tick"
          data-cuelume-press
          data-cuelume-release
          className="text-fg hover:text-accent focus-visible:ring-accent flex items-center gap-2 rounded-md text-lg font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
                data-cuelume-release
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
                data-cuelume-release
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
          <ThemeToggle />
          <SoundToggle />
          <button
            type="button"
            data-cuelume-hover="tick"
            data-cuelume-press
            data-cuelume-release="toggle"
            className="border-border hover:bg-surface rounded border px-2 py-1 text-xs font-medium transition active:scale-95"
            onClick={() => {
              triggerLight();
              const idx = langCycle.indexOf(lang);
              const nextLang = langCycle[(idx + 1) % langCycle.length];
              track("lang_toggle", { lang: nextLang });
              setLang(nextLang);
              navigate(replaceLangInPath(location.pathname, nextLang), {
                replace: true,
              });
            }}
            aria-label={langLabel[lang]}
          >
            <span className="sm:hidden">{langFlag[lang]}</span>
            <span className="hidden sm:inline">{langLabel[lang]}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
