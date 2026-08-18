import { Suspense } from "react";
import { Skeleton } from "boneyard-js/react";
import { Outlet, useLocation, useNavigation } from "react-router";

type RouteSkeletonKind = "subject" | "practice" | "exam" | "page";

function getRouteSkeletonKind(pathname: string | undefined): RouteSkeletonKind {
  if (!pathname) return "page";

  const segments = pathname.split("/").filter(Boolean);
  if (segments[2] === "practice") return "practice";
  if (segments[2] === "exam") return "exam";
  if (segments.length >= 2) return "subject";
  return "page";
}

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-border/60 rounded-lg ${className}`}
    />
  );
}

function SubjectSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8">
      <div className="flex flex-col items-center py-10 text-center sm:py-14">
        <SkeletonBlock className="mb-4 h-3 w-44" />
        <SkeletonBlock className="mb-4 h-12 w-64 max-w-full sm:h-14 sm:w-80" />
        <SkeletonBlock className="h-5 w-full max-w-2xl" />
        <SkeletonBlock className="mt-2 h-5 w-3/4 max-w-xl" />
      </div>
      <div className="mb-8 flex justify-end">
        <SkeletonBlock className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonBlock key={index} className="h-[122px]" />
        ))}
      </div>
    </div>
  );
}

function PlayerSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-8">
      <SkeletonBlock className="mb-6 h-4 w-28" />
      <div className="mb-6 space-y-3">
        <SkeletonBlock className="h-8 w-2/3" />
        <SkeletonBlock className="h-4 w-1/3" />
        <SkeletonBlock className="h-8 w-full rounded-full" />
      </div>
      <SkeletonBlock className="h-[420px] w-full" />
    </div>
  );
}

function PageSkeleton({ kind }: { kind: RouteSkeletonKind }) {
  if (kind === "subject") return <SubjectSkeleton />;
  if (kind === "practice" || kind === "exam") return <PlayerSkeleton />;
  return <div className="mx-auto w-full max-w-3xl px-4 py-16" />;
}

export default function RouteTransitionSkeleton() {
  const navigation = useNavigation();
  const location = useLocation();
  const kind = getRouteSkeletonKind(
    navigation.location?.pathname ?? location.pathname,
  );
  const loading = navigation.state !== "idle";
  const fallback = <PageSkeleton kind={kind} />;

  return (
    <Skeleton
      name={`route-${kind}`}
      loading={loading}
      fixture={fallback}
      fallback={fallback}
      color="var(--color-border)"
      darkColor="var(--color-border)"
      animate="shimmer"
      transition={180}
      select="viewport"
      className="min-h-full"
    >
      <Suspense fallback={fallback}>
        <Outlet />
      </Suspense>
    </Skeleton>
  );
}
