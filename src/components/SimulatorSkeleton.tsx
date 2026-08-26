import { Skeleton } from "boneyard-js/react";
import type { ReactNode } from "react";

const PLACEHOLDER_CHIPS = Array.from({ length: 24 }, (_, index) => index);
const SKELETON_COLOR = "var(--color-border)";

type SimulatorKind = "practice" | "exam";

interface SimulatorSkeletonProps {
	kind: SimulatorKind;
	loading: boolean;
	loadingLabel: string;
	children?: ReactNode;
}

function SkeletonBlock({ className }: { className: string }) {
	return (
		<div
			aria-hidden="true"
			className={`bg-border/60 animate-pulse motion-reduce:animate-none ${className}`}
		/>
	);
}

function SimulatorSkeletonFixture({ kind }: { kind: SimulatorKind }) {
	const isExam = kind === "exam";

	return (
		<div
			className="mx-auto max-w-3xl px-4 py-4 sm:py-8"
			style={{ overflowAnchor: "none" }}
		>
			<SkeletonBlock className="mb-3 h-4 w-32 rounded sm:mb-4" />

			<div className="sticky-player-header bg-surface border-border sticky z-40 -mx-4 mb-4 border-b px-4 pt-2 pb-3 sm:mb-6">
				<div className="flex items-center justify-between gap-4">
					<div className="min-w-0 flex-1 space-y-2">
						<SkeletonBlock className="h-6 w-3/4 rounded sm:h-7" />
						<SkeletonBlock className="h-4 w-28 rounded" />
					</div>
					{isExam && <SkeletonBlock className="h-5 w-20 shrink-0 rounded" />}
				</div>
				<div className="mt-4 flex gap-2 overflow-hidden">
					{PLACEHOLDER_CHIPS.map((chip) => (
						<SkeletonBlock
							key={chip}
							className="h-8 w-10 shrink-0 rounded-full"
						/>
					))}
				</div>
			</div>

			<div className="border-border bg-surface flex flex-col gap-4 overflow-hidden rounded-lg border p-4 sm:p-6">
				<div className="flex items-center justify-between gap-4">
					<SkeletonBlock className="h-4 w-24 rounded" />
					<SkeletonBlock className="h-4 w-16 rounded" />
				</div>
				<div className="space-y-3">
					<SkeletonBlock className="h-5 w-full rounded" />
					<SkeletonBlock className="h-5 w-11/12 rounded" />
					<SkeletonBlock className="h-5 w-2/3 rounded" />
				</div>
				<div className="space-y-3 pt-2">
					{[0, 1, 2, 3].map((option) => (
						<div
							key={option}
							className="border-border bg-surface-alt flex items-center gap-3 rounded-lg border p-3"
						>
							<SkeletonBlock className="size-5 shrink-0 rounded-full" />
							<SkeletonBlock className="h-4 w-4/5 rounded" />
						</div>
					))}
				</div>
			</div>

			<div className="mt-4 flex items-center justify-between gap-3 sm:mt-6">
				<SkeletonBlock className="h-11 w-28 rounded-lg sm:h-9" />
				<SkeletonBlock className="h-11 w-28 rounded-lg sm:h-9" />
				<SkeletonBlock className="h-11 w-28 rounded-lg sm:h-9" />
			</div>

			<SkeletonBlock className="mt-6 h-20 w-full rounded-lg" />
		</div>
	);
}

export default function SimulatorSkeleton({
	kind,
	loading,
	loadingLabel,
	children,
}: SimulatorSkeletonProps) {
	const fixture = <SimulatorSkeletonFixture kind={kind} />;
	const loadingLayout = (
		<div
			aria-hidden="true"
			style={{ visibility: "hidden", pointerEvents: "none" }}
		>
			{fixture}
		</div>
	);

	return (
		<>
			{loading && (
				<div role="status" aria-live="polite" className="sr-only">
					{loadingLabel}
				</div>
			)}
			<Skeleton
				name={`simulator-${kind}`}
				loading={loading}
				fixture={fixture}
				fallback={fixture}
				color={SKELETON_COLOR}
				darkColor={SKELETON_COLOR}
				select="viewport"
				transition={300}
			>
				{loading ? loadingLayout : children}
			</Skeleton>
		</>
	);
}
