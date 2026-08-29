import { useCallback, useEffect, useState } from "react";
import type { Question, SubjectMeta } from "../data/types";
import { getQuestionsByTopic, getTopicMegaTopicLabel } from "../subjects";

export type TopicLoadStatus = "loading" | "ready" | "error" | "idle";

type TopicLoadState =
	| { key: string; status: "loading" }
	| {
			key: string;
			status: "ready";
			questions: Question[];
			megatopicLabel: string | undefined;
	  }
	| { key: string; status: "error" }
	| { key: null; status: "idle" };

const EMPTY_QUESTIONS: Question[] = [];

export interface InitialTopicQuestions {
	questions: Question[];
	megatopicLabel: string | undefined;
}

export function useTopicQuestions(
	subject: SubjectMeta | undefined,
	topic: string | undefined,
	initialData?: InitialTopicQuestions,
) {
	const requestKey = subject && topic ? `${subject.id}/${topic}` : null;
	const [loadState, setLoadState] = useState<TopicLoadState>(() =>
		requestKey && initialData
			? {
					key: requestKey,
					status: "ready",
					questions: initialData.questions,
					megatopicLabel: initialData.megatopicLabel,
				}
			: { key: null, status: "idle" },
	);
	const [retryToken, setRetryToken] = useState(0);
	const hasInitialData = Boolean(requestKey && initialData);
	const currentLoadState =
		loadState.key === requestKey
			? loadState
			: hasInitialData && initialData
				? {
						key: requestKey,
						status: "ready" as const,
						questions: initialData.questions,
						megatopicLabel: initialData.megatopicLabel,
					}
				: requestKey
					? { key: requestKey, status: "loading" as const }
					: { key: null, status: "idle" as const };
	const loadAttemptKey = requestKey ? `${requestKey}:${retryToken}` : null;

	useEffect(() => {
		if (!subject || !topic || !requestKey || !loadAttemptKey) return;
		if (initialData && retryToken === 0) return;

		let cancelled = false;
		setLoadState({ key: requestKey, status: "loading" });
		Promise.all([
			getQuestionsByTopic(subject.id, topic),
			getTopicMegaTopicLabel(subject.id, topic),
		])
			.then(([questions, megatopicLabel]) => {
				if (cancelled) return;
				setLoadState({
					key: requestKey,
					status: "ready",
					questions,
					megatopicLabel,
				});
			})
			.catch(() => {
				if (!cancelled) setLoadState({ key: requestKey, status: "error" });
			});

		return () => {
			cancelled = true;
		};
	}, [initialData, loadAttemptKey, requestKey, retryToken, subject, topic]);

	const retry = useCallback(() => {
		if (!requestKey) return;
		setRetryToken((current) => current + 1);
	}, [requestKey]);

	return {
		questions:
			currentLoadState.status === "ready"
				? currentLoadState.questions
				: EMPTY_QUESTIONS,
		megatopicLabel:
			currentLoadState.status === "ready"
				? currentLoadState.megatopicLabel
				: undefined,
		status: currentLoadState.status as TopicLoadStatus,
		retry,
	};
}
