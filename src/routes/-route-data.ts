import { notFound } from "@tanstack/react-router";
import type { Exam, SubjectMeta, Topic } from "../data/types";
import {
	getHomeSubjectBuildStats,
	getSubjectBuildStats,
	type HomeSubjectBuildStats,
	type SubjectBuildStats,
} from "../lib/content-stats";
import { roundPoints } from "../lib/points";
import { getSubject, subjects } from "../subjects";
import { contentStatsBySubject } from "../subjects/contentStats.generated";
import { isNavigableSubject } from "../subjects/visibility";

export function getNavigableSubjectOrNotFound(subjectId: string) {
	const subject = getSubject(subjectId);
	if (!subject || !isNavigableSubject(subject.id)) {
		throw notFound();
	}
	return subject;
}

export function getTopicOrNotFound(subject: SubjectMeta, topicKey: string) {
	const topic = subject.topics.find((candidate) => candidate.key === topicKey);
	if (!topic) {
		throw notFound();
	}
	return topic;
}

export function getExamOrNotFound(subject: SubjectMeta, examId: string) {
	const exam = subject.exams.find((candidate) => candidate.id === examId);
	if (!exam) {
		throw notFound();
	}
	return exam;
}

export function subjectRouteData(subjectId: string) {
	return getNavigableSubjectOrNotFound(subjectId);
}

export function homepageRouteData(): Record<string, HomeSubjectBuildStats> {
	return Object.fromEntries(
		subjects.map((subject) => [
			subject.id,
			getHomeSubjectBuildStats(subject, contentStatsBySubject[subject.id]),
		]),
	);
}

export function subjectBuildStats(subject: SubjectMeta): SubjectBuildStats {
	return getSubjectBuildStats(subject, contentStatsBySubject[subject.id]);
}

export function topicRouteData(subjectId: string, topicKey: string) {
	const subject = getNavigableSubjectOrNotFound(subjectId);
	const topic = getTopicOrNotFound(subject, topicKey);
	const stats = subjectBuildStats(subject);
	return {
		subject,
		topic,
		stats: {
			topicQuestionCounts: {
				[topic.key]: stats.topicStats[topic.key]?.questionCount ?? 0,
			},
		},
	} satisfies {
		subject: SubjectMeta;
		topic: Topic;
		stats: { topicQuestionCounts: Record<string, number> };
	};
}

export function examRouteData(subjectId: string, examId: string) {
	const subject = getNavigableSubjectOrNotFound(subjectId);
	const exam = getExamOrNotFound(subject, examId);
	const stats = subjectBuildStats(subject);
	return {
		subject,
		exam,
		stats: {
			examQuestionCounts: {
				[exam.id]: stats.examStats[exam.id]?.questionCount ?? 0,
			},
			examTotalPoints: {
				[exam.id]: roundPoints(stats.examStats[exam.id]?.points ?? 0),
			},
		},
	} satisfies {
		subject: SubjectMeta;
		exam: Exam;
		stats: {
			examQuestionCounts: Record<string, number>;
			examTotalPoints: Record<string, number>;
		};
	};
}
