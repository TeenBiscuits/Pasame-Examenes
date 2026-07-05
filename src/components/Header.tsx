import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [, , subjectId] = pathname.split("/");
  const t = useT();
  const { lang, setLang } = useLang();
  const subject = subjectId ? getSubject(subjectId) : null;

  const abbr = subject ? acronym(subject.name) : "";

  const subjectLinkClasses = `px-3 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors ${
    pathname === `/${lang}/${subjectId}` ||
    pathname.startsWith(`/${lang}/${subjectId}/`)
      ? "bg-accent-light text-accent-fg"
      : "text-fg-secondary hover:text-fg"
  }`;

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
          <Image
            src="/favicon.svg"
            alt=""
            width={28}
            height={32}
            unoptimized
            className="w-7 h-8"
            aria-hidden="true"
          />
          {t.home.title}
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
            className="px-2 py-1 text-xs font-medium rounded border border-border hover:bg-surface active:scale-95 transition"
            onClick={() => {
              triggerLight();
              const idx = langCycle.indexOf(lang);
              const nextLang = langCycle[(idx + 1) % langCycle.length];
              track("lang_toggle", { lang: nextLang });
              setLang(nextLang);
              router.replace(replaceLangInPath(pathname, nextLang));
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
