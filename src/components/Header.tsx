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
import OverflowAcronym from "./OverflowAcronym";

const langCycle: Lang[] = ["en", "es", "gl"];

const langLabel: Record<Lang, string> = {
  en: "🇬🇧 EN",
  es: "🇪🇸 ES",
  gl: "🧜🏻‍♀️ GL",
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch("/:lang/:subjectId/*");
  const subjectId = match?.params.subjectId;
  const t = useT();
  const { lang, setLang } = useLang();
  const subject = subjectId ? getSubject(subjectId) : null;

  return (
    <header className="bg-surface-alt border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-lg text-fg hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-md transition-colors flex items-center gap-2.5"
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
            className="w-7 h-8"
            aria-hidden="true"
          />
          {t.home.title}
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 text-sm">
          {subject && (
            <Link
              to={`/${subjectId}`}
              className={`block max-w-56 truncate px-3 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors ${
                location.pathname === `/${subjectId}` ||
                location.pathname.startsWith(`/${subjectId}/`)
                  ? "bg-accent-light text-accent-fg"
                  : "text-fg-secondary hover:text-fg"
              }`}
              onClick={() => {
                triggerLight();
                track("nav_click", {
                  target: "subject_home",
                  subjectId: subjectId || "",
                });
              }}
              title={subject.name}
            >
              <OverflowAcronym name={subject.name} className="block truncate" />
            </Link>
          )}
          <GitHubStarButton />
          <ThemeToggle />
          <button
            type="button"
            className="px-2 py-1 text-xs font-medium rounded border border-border hover:bg-surface active:scale-95 transition"
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
