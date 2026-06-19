import { Link, useLocation, useParams } from "react-router-dom";
import { getSubject } from "../subjects";
import { useT, useLang } from "../i18n/hooks";
import { track } from "../lib/umami";

export default function Header() {
  const location = useLocation();
  const { subjectId } = useParams<{ subjectId?: string }>();
  const t = useT();
  const { lang, setLang } = useLang();
  const subject = subjectId ? getSubject(subjectId) : null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-lg text-gray-900 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-md transition-colors flex items-center gap-2.5"
          onClick={() => track("nav_click", { target: "home" })}
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
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          {subject && (
            <nav className="flex items-center gap-2 sm:gap-4 text-sm">
              <Link
                to={`/${subjectId}`}
                className={`px-3 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors ${
                  location.pathname === `/${subjectId}`
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => track("nav_click", { target: "subject_home", subjectId: subjectId || "" })}
              >
                {t.header.home}
              </Link>
              <Link
                to={`/${subjectId}/practice`}
                className={`px-3 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors ${
                  location.pathname.startsWith(`/${subjectId}/practice`)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => track("nav_click", { target: "practice", subjectId: subjectId || "" })}
              >
                {t.header.practice}
              </Link>
            </nav>
          )}
          <button
            className="px-2 py-1 text-xs font-medium rounded border border-gray-200 hover:bg-gray-100 transition-colors"
            onClick={() => {
              const nextLang = lang === "en" ? "es" : "en";
              track("lang_toggle", { lang: nextLang });
              setLang(nextLang);
            }}
            aria-label={lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
          >
            {lang === "en" ? "🇪🇸 ES" : "🇬🇧 EN"}
          </button>
        </div>
      </div>
    </header>
  );
}
