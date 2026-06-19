import { Link, useLocation, useParams } from "react-router-dom";
import { getSubject } from "../subjects";

export default function Header() {
  const location = useLocation();
  const { subjectId } = useParams<{ subjectId?: string }>();

  const subject = subjectId ? getSubject(subjectId) : null;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold text-lg text-gray-900 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-md transition-colors flex items-center gap-2.5"
        >
          <img
            src="/favicon.svg"
            alt=""
            width={28}
            height={32}
            className="w-7 h-8"
            aria-hidden="true"
          />
          Pasame Examenes
        </Link>
        {subject && (
          <nav className="flex items-center gap-2 sm:gap-4 text-sm">
            <Link
              to={`/${subjectId}`}
              className={`px-3 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors ${
                location.pathname === `/${subjectId}`
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {subject.courseCode} Home
            </Link>
            <Link
              to={`/${subjectId}/practice`}
              className={`px-3 py-1.5 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-colors ${
                location.pathname.startsWith(`/${subjectId}/practice`)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Practice
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
