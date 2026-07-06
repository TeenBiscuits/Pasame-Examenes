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

function buildLegacyTargetPath(path: string[]) {
  if (path.length === 0) return "";
  const [subjectId, section, value] = path;
  const subject = getSubject(subjectId);
  if (!subject) return null;
  if (!section) return `/${subject.id}`;
  if ((section === "practice" || section === "exam") && !value) {
    return `/${subject.id}`;
  }
  if (section === "practice" && value) {
    return subject.topics.some((topic) => topic.key === value)
      ? `/${subject.id}/practice/${value}`
      : null;
  }
  if (section === "exam" && value) {
    return subject.exams.some((exam) => exam.year === value)
      ? `/${subject.id}/exam/${value}`
      : null;
  }
  return null;
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
    const targetPath = buildLegacyTargetPath(path);
    const target = targetPath == null ? `/${lang}/404` : `/${lang}${targetPath}`;
    router.replace(target);
  }, [pathname, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface text-fg">
      <div className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </main>
  );
}
