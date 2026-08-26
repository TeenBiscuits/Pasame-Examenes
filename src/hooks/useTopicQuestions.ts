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

export function useTopicQuestions(
	subject: SubjectMeta | undefined,
	topic: string | undefined,
) {
	const requestKey = subject && topic ? `${subject.id}/${topic}` : null;
	const [loadState, setLoadState] = useState<TopicLoadState>({
		key: null,
		status: "idle",
	});
	const [retryToken, setRetryToken] = useState(0);
	const currentLoadState =
		loadState.key === requestKey
			? loadState
			: requestKey
				? { key: requestKey, status: "loading" as const }
				: { key: null, status: "idle" as const };
	const loadAttemptKey = requestKey ? `${requestKey}:${retryToken}` : null;

	useEffect(() => {
		if (!subject || !topic || !requestKey || !loadAttemptKey) return;

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
	}, [loadAttemptKey, requestKey, subject, topic]);

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
