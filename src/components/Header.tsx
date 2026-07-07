import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { getSubject } from "../subjects";
import { useT, useLang } from "../i18n/hooks";
import type { Lang } from "../i18n/context";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import ThemeToggle from "../theme/ThemeToggle";
import { LangLink as Link } from "../lib/lang-link";
import { replaceLangInPath } from "../lib/lang-link-utils";
import GitHubStarButton from "./GitHubStarButton";

const langCycle: Lang[] = ["en", "es", "gl"];

const langLabel: Record<Lang, string> = {
  en: "🇬🇧 EN",
  es: "🇪🇸 ES",
  gl: "🧜🏻‍♀️ GL",
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

  const subjectLinkClasses = `px-3 py-1.5 rounded-full font-mono text-xs font-semibold tracking-wide transition-colors ${
    location.pathname === `/${lang}/${subjectId}` ||
    location.pathname.startsWith(`/${lang}/${subjectId}/`)
      ? "bg-accent text-white"
      : "border border-border bg-surface text-fg-secondary hover:text-fg"
  }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface-alt/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-lg text-fg transition-colors hover:text-accent"
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
            className="h-8 w-7 rotate-[-3deg] transition-transform group-hover:rotate-3"
            aria-hidden="true"
          />
          <span className="font-mono text-base font-black tracking-[-0.06em] sm:text-lg">
            {t.home.title}
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 text-sm">
          {subject && (
            <>
              <Link
                to={`/${subjectId}`}
                className={`sm:hidden ${subjectLinkClasses}`}
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
                className={`hidden sm:block max-w-56 truncate ${subjectLinkClasses}`}
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
          <button
            type="button"
            className="rounded-full border border-border bg-surface px-2.5 py-1.5 font-mono text-xs font-semibold text-fg-secondary transition hover:border-accent hover:text-accent active:scale-95"
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
            {langLabel[lang]}
          </button>
        </div>
      </div>
    </header>
  );
}
