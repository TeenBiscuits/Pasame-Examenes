import { Alarm, AngleLeftSquare, AngleRightSquare, Exit } from "reicon-react";
import { SkeletonBox } from "skullet/react";
import type { QuestionType } from "../data/types";
import { useT } from "../i18n/hooks";
import { formatPoints } from "../lib/points";
import SimulatorLayout from "./SimulatorLayout";

export interface SimulatorPreviewProps {
	kind?: "practice" | "exam";
	questionType?: QuestionType;
	optionCount?: number;
	textPartCount?: number;
	title?: string;
	topicLabel?: string;
	questionCount?: number;
	totalPoints?: number;
}

const placeholderRows = (count: number) =>
	Array.from({ length: count }, (_, index) => index + 1);

function AnswerPreview({
	questionType,
	optionCount = 4,
	textPartCount = 2,
}: SimulatorPreviewProps & { questionType: QuestionType }) {
	switch (questionType) {
		case "mc":
			return (
				<div className="space-y-2">
					{placeholderRows(optionCount).map((option) => (
						<div
							key={option}
							data-loading-option
							className="border-border flex items-center gap-3 rounded-lg border-2 p-3"
						>
							<SkeletonBox
								width={20}
								height={20}
								radius="50%"
								className="shrink-0"
							/>
							<SkeletonBox width="75%" height={14} />
						</div>
					))}
				</div>
			);
		case "text":
			return <SkeletonBox width="100%" height={120} radius={8} />;
		case "multiple-text":
			return (
				<div className="space-y-4">
					{placeholderRows(textPartCount).map((part) => (
						<div key={part} data-loading-part className="space-y-2">
							<SkeletonBox width="85%" height={14} />
							<SkeletonBox width="100%" height={100} radius={8} />
						</div>
					))}
				</div>
			);
		case "fill":
			return (
				<div className="space-y-3">
					{[1, 2].map((statement) => (
						<div key={statement} className="flex flex-wrap items-center gap-2">
							<SkeletonBox width="40%" height={14} />
							<SkeletonBox width={96} height={34} radius={6} />
							<SkeletonBox width="20%" height={14} />
						</div>
					))}
				</div>
			);
		case "table-fill":
			return (
				<div className="border-border overflow-hidden rounded-lg border">
					<table className="w-full text-sm">
						<thead className="bg-surface">
							<tr>
								{[1, 2, 3].map((column) => (
									<th key={column} scope="col" className="px-4 py-2">
										<SkeletonBox width="80%" height={14} />
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-border divide-y">
							{[1, 2].map((row) => (
								<tr key={row}>
									{[1, 2, 3].map((column) => (
										<td key={column} className="px-4 py-2">
											<SkeletonBox
												width="100%"
												height={column === 3 ? 34 : 14}
												radius={6}
											/>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
		case "matching":
			return (
				<div className="space-y-2">
					{[1, 2, 3].map((item) => (
						<div key={item} className="flex items-center gap-3">
							<div className="min-w-0 flex-1">
								<SkeletonBox width="80%" height={14} />
							</div>
							<div className="flex shrink-0 gap-1">
								{[1, 2, 3].map((choice) => (
									<SkeletonBox key={choice} width={36} height={36} radius={6} />
								))}
							</div>
						</div>
					))}
				</div>
			);
		default: {
			const unhandled: never = questionType;
			return unhandled;
		}
	}
}

const sampleChips = Array.from({ length: 30 }, (_, index) => index + 1);

/** Critical-route placeholders: no question rendering, Markdown, or session code. */
export default function SimulatorPreview({
	kind = "practice",
	questionType = "mc",
	optionCount,
	textPartCount,
	title,
	topicLabel,
	questionCount = 12,
	totalPoints = questionCount,
}: SimulatorPreviewProps) {
	const t = useT();
	const labels = kind === "exam" ? t.exam : t.practice;

	return (
		<div inert aria-hidden="true" data-question-type={questionType}>
			<SimulatorLayout>
				<div className="text-accent-fg mb-3 inline-flex items-center gap-1.5 text-sm sm:mb-4">
					<Exit size={16} aria-hidden="true" />
					{kind === "exam" ? t.exam.backToSubject : t.practice.backToTopics}
				</div>
				<div className="sticky-player-header bg-surface border-border sticky z-40 -mx-4 mb-4 border-b px-4 pt-2 pb-3 sm:mb-6">
					<div className="flex items-center justify-between gap-4">
						<div className="min-w-0">
							<h2 className="text-fg truncate text-xl font-semibold sm:text-2xl">
								{title ?? labels.loadingQuestions}
							</h2>
							<p className="text-fg-muted mt-1 text-sm">
								{questionCount} {t.subjectCard.questions} ·{" "}
								{formatPoints(totalPoints)} {t.practice.pointsTotal}
							</p>
						</div>
						{kind === "exam" && (
							<span className="text-fg-secondary flex shrink-0 items-center gap-1.5 font-mono text-sm font-bold">
								<Alarm size={16} aria-hidden="true" />
								60:00
							</span>
						)}
					</div>
					<div className="question-nav-scroll mt-4 mb-0 flex gap-2 overflow-x-auto overflow-y-hidden pb-0 sm:pb-2">
						{sampleChips.slice(0, questionCount).map((number) => (
							<span
								key={number}
								className="border-border text-fg-muted flex size-[42px] shrink-0 items-center justify-center rounded-md border font-mono text-xs"
							>
								{number}
							</span>
						))}
					</div>
				</div>
				<div className="flex flex-col rounded-xl shadow-sm">
					<div className="border-border bg-surface-alt rounded-t-xl border-x-2 border-t-2 px-4 py-4 sm:px-6 sm:py-6">
						<div className="mb-4 flex flex-wrap items-center gap-2">
							<SkeletonBox width={48} height={24} radius={4} />
							<SkeletonBox width={32} height={24} radius={4} />
							<span className="text-fg-muted min-w-0 truncate text-xs">
								{topicLabel ?? title ?? labels.loadingQuestions}
							</span>
						</div>
						<div className="mb-4 space-y-2">
							<SkeletonBox width="100%" height={14} />
							<SkeletonBox width="85%" height={14} />
							<SkeletonBox width="60%" height={14} />
						</div>
						<AnswerPreview
							questionType={questionType}
							optionCount={optionCount}
							textPartCount={textPartCount}
						/>
					</div>
					<div className="bg-card-footer border-card-footer-border flex h-[34px] items-center justify-between rounded-b-xl border-x-2 border-b-2 px-4 sm:px-6">
						<SkeletonBox width={18} height={18} radius={4} />
						<SkeletonBox width={100} height={12} />
					</div>
				</div>
				<div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-6">
					<span className="border-border inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm">
						<AngleLeftSquare size={18} aria-hidden="true" />
						{labels.previous}
					</span>
					<span className="bg-accent text-on-accent rounded-lg px-4 py-2 text-sm font-medium">
						{kind === "exam" ? t.exam.submitExam : t.practice.submit}
					</span>
					<span className="border-border inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm">
						{labels.next}
						<AngleRightSquare size={18} aria-hidden="true" />
					</span>
				</div>
			</SimulatorLayout>
		</div>
	);
}
