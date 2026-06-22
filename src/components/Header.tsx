import { Link, useLocation, useParams } from "react-router-dom";
import { getSubject } from "../subjects";
import { useT, useLang } from "../i18n/hooks";
import { track } from "../lib/umami";
import { triggerLight } from "../lib/haptics";
import { Button } from "@/components/ui/button";

export default function Header() {
  const location = useLocation();
  const { subjectId } = useParams<{ subjectId?: string }>();
  const t = useT();
  const { lang, setLang } = useLang();
  const subject = subjectId ? getSubject(subjectId) : null;

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-lg text-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none rounded-md transition-colors flex items-center gap-2.5"
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
            className="size-7 h-auto"
            aria-hidden="true"
          />
          {t.home.title}
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          {subject && (
            <nav className="flex items-center gap-2 sm:gap-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={
                  location.pathname === `/${subjectId}`
                    ? "bg-accent text-accent-foreground"
                    : ""
                }
              >
                <Link
                  to={`/${subjectId}`}
                  onClick={() => {
                    triggerLight();
                    track("nav_click", {
                      target: "subject_home",
                      subjectId: subjectId || "",
                    });
                  }}
                >
                  {t.header.home}
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={
                  location.pathname.startsWith(`/${subjectId}/practice`)
                    ? "bg-accent text-accent-foreground"
                    : ""
                }
              >
                <Link
                  to={`/${subjectId}/practice`}
                  onClick={() => {
                    triggerLight();
                    track("nav_click", {
                      target: "practice",
                      subjectId: subjectId || "",
                    });
                  }}
                >
                  {t.header.practice}
                </Link>
              </Button>
            </nav>
          )}
          <Button
            variant="outline"
            size="xs"
            onClick={() => {
              triggerLight();
              const nextLang = lang === "en" ? "es" : "en";
              track("lang_toggle", { lang: nextLang });
              setLang(nextLang);
            }}
            aria-label={
              lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"
            }
          >
            {lang === "en" ? "🇪🇸 ES" : "🇬🇧 EN"}
          </Button>
        </div>
      </div>
    </header>
  );
}
