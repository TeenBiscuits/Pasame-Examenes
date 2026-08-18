const subjectRoutePromises = new Map<string, Promise<unknown>>();
const subjectRouteModules = import.meta.glob<() => Promise<unknown>>(
  "../routes/subject.tsx",
);

/**
 * Starts loading the subject route chunk before a user activates its card.
 * The promise is cached so hover, focus and the eventual navigation share one
 * browser request instead of creating duplicate imports.
 */
export function prefetchSubjectPage(subjectId: string): void {
  if (typeof window === "undefined" || subjectRoutePromises.has(subjectId)) {
    return;
  }

  const loadSubjectRoute = subjectRouteModules["../routes/subject.tsx"];
  if (!loadSubjectRoute) return;

  subjectRoutePromises.set(subjectId, loadSubjectRoute());
}
