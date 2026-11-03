import { useParams } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Question } from "../data/types";
import { useExamSelection } from "../hooks/useExamSelection";
import { useT } from "../i18n/hooks";
import { getPracticeLoadingPreview } from "../lib/practice-loading";
import { getSubject } from "../subjects";
import { contentStatsBySubject } from "../subjects/contentStats.generated";
import SimulatorLoading from "./SimulatorLoading";

export function PracticeTopicLoading({
	subjectId,
	topic,
	loading,
	question,
	children,
}: {
	subjectId: string | undefined;
	topic: string | undefined;
	loading: boolean;
	question?: Question;
	children?: ReactNode;
}) {
	const t = useT();
	const subject = subjectId ? getSubject(subjectId) : undefined;
	const { selectedExamIds } = useExamSelection(subject);
	const preview = getPracticeLoadingPreview(
		subjectId ? contentStatsBySubject[subjectId] : undefined,
		topic,
		selectedExamIds,
	);
	const topicInfo = subject?.topics.find(
		(candidate) => candidate.key === topic,
	);
	const firstQuestion = question ?? preview?.firstQuestion;
	if (loading && !firstQuestion) {
		return (
			<p role="status" className="text-fg-muted mx-auto max-w-3xl px-4 py-8">
				{t.practice.loadingQuestions}
			</p>
		);
	}
	return (
		<SimulatorLoading
			kind="practice"
			loading={loading}
			loadingLabel={t.practice.loadingQuestions}
			questionType={firstQuestion?.type}
			optionCount={
				question?.options?.length ?? preview?.firstQuestion.optionCount
			}
			textPartCount={
				question?.textParts?.length ?? preview?.firstQuestion.textPartCount
			}
			shapeId={firstQuestion?.id}
			title={topicInfo ? `${topicInfo.icon} ${topicInfo.label}` : topic}
			topicLabel={topicInfo?.label}
			questionCount={preview?.questionCount}
			totalPoints={preview?.totalPoints}
		>
			{children}
		</SimulatorLoading>
	);
}

/** Critical-route fallback: available before the question bank and player chunks. */
export default function PracticeTopicPending() {
	const { subjectId, topic } = useParams({ strict: false });
	return <PracticeTopicLoading subjectId={subjectId} topic={topic} loading />;
}
