import { Skeleton } from "boneyard-js/react";
import type { ReactNode } from "react";

const skeletonProps = {
  animate: "solid" as const,
  boneClass: "app-skeleton-bone",
  select: "viewport" as const,
  snapshotConfig: {
    excludeSelectors: ["[data-no-skeleton]"],
  },
};

export function HomeCardsSkeletonFixture({ count = 13 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="border-border bg-surface-alt flex min-h-[160px] flex-col rounded-xl border-2 px-5 py-5"
        >
          <div className="mb-4 flex items-start justify-between">
            <span className="app-skeleton-placeholder size-10 rounded-full text-transparent">
              A
            </span>
            <span className="app-skeleton-placeholder h-6 w-20 rounded text-transparent">
              ABC123
            </span>
          </div>
          <h2 className="app-skeleton-placeholder mb-2 w-3/5 rounded text-base font-semibold text-transparent">
            Nombre asignatura
          </h2>
          <p className="app-skeleton-placeholder w-4/5 rounded text-sm text-transparent">
            Grado en Ingeniería Informática
          </p>
          <div className="mt-auto flex justify-between pt-3 text-xs">
            <span className="app-skeleton-placeholder rounded text-transparent">
              100 preguntas
            </span>
            <span className="app-skeleton-placeholder rounded text-transparent">
              8 temas · 4 exámenes
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeCardsSkeleton({
  loading,
  children,
  fixture,
}: {
  loading: boolean;
  children: ReactNode;
  fixture?: ReactNode;
}) {
  const loadingFallback = fixture ?? children;

  return (
    <Skeleton
      {...skeletonProps}
      name="home-subject-cards"
      loading={loading}
      fixture={loadingFallback}
      fallback={loadingFallback}
    >
      {children}
    </Skeleton>
  );
}

export function SubjectContentSkeletonFixture() {
  return (
    <div aria-hidden="true">
      <div className="border-border bg-surface-alt app-skeleton-placeholder mb-6 h-12 rounded-xl border" />
      <h2 className="app-skeleton-placeholder mb-4 w-44 rounded text-lg font-semibold text-transparent">
        Práctica por temas
      </h2>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="border-border bg-surface-alt h-[122px] rounded-xl border-2 p-4"
          >
            <div className="app-skeleton-placeholder mb-5 size-8 rounded-full text-transparent">
              T
            </div>
            <p className="app-skeleton-placeholder w-3/5 rounded text-transparent">
              Nombre del tema
            </p>
          </div>
        ))}
      </div>
      <h2 className="app-skeleton-placeholder mb-4 w-56 rounded text-lg font-semibold text-transparent">
        Simulaciones de examen
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="border-border bg-surface-alt h-[122px] rounded-xl border-2 p-4"
          >
            <div className="app-skeleton-placeholder mb-5 size-7 rounded text-transparent">
              E
            </div>
            <p className="app-skeleton-placeholder w-4/5 rounded text-transparent">
              Convocatoria de examen
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubjectContentSkeleton({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  const fixture = <SubjectContentSkeletonFixture />;
  return (
    <Skeleton
      {...skeletonProps}
      name="subject-content"
      loading={loading}
      fixture={fixture}
      fallback={fixture}
    >
      {children}
    </Skeleton>
  );
}
