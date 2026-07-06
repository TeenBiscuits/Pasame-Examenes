"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "../../i18n/context";
import { getSubject } from "../../subjects";

function detectLang(): Lang {
  try {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "es" || stored === "gl") return stored;
  } catch {
    /* localStorage unavailable */
  }

  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("en")) return "en";
  if (nav.startsWith("gl")) return "gl";
  return "es";
}

function isValidLegacyPath(path: string[]) {
  if (path.length === 0) return true;
  const [subjectId, section, value] = path;
  const subject = getSubject(subjectId);
  if (!subject) return false;
  if (!section) return true;
  if (section === "practice" && value) {
    return subject.topics.some((topic) => topic.key === value);
  }
  if (section === "exam" && value) {
    return subject.exams.some((exam) => exam.year === value);
  }
  return false;
}

function isLang(segment: string | undefined): segment is Lang {
  return segment === "en" || segment === "es" || segment === "gl";
}

export default function LegacyRedirect() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    const [first, ...rest] = segments;
    const lang = isLang(first) ? first : detectLang();
    const path = isLang(first) ? rest : segments;
    const target = isValidLegacyPath(path)
      ? `/${lang}${path.length === 0 ? "" : `/${path.join("/")}`}`
      : `/${lang}/404`;
    router.replace(target);
  }, [pathname, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface text-fg">
      <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </main>
  );
}
