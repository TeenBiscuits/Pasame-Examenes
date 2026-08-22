import type { SubjectMeta } from "../data/types";
import type { ExamQuestionStats } from "./exam-stats";

export interface TopicBuildStats {
	questionCount: number;
	points: number;
}

export interface GeneratedSubjectBuildStats {
	questionCount: number;
	repeatedQuestionCount: number;
	topicStats: Record<string, TopicBuildStats>;
	examStats: Record<string, ExamQuestionStats>;
	topicStatsByExam: Record<string, Record<string, TopicBuildStats>>;
	repeatedQuestionCountByExam: Record<string, number>;
}

export interface SubjectBuildStats extends GeneratedSubjectBuildStats {}

export interface HomeSubjectBuildStats {
	questionCount: number;
	topicCount: number;
	examCount: number;
}

export interface SelectedSubjectBuildStats {
	questionCount: number;
	repeatedQuestionCount: number;
	topicStats: Record<string, TopicBuildStats>;
}

export function getSubjectBuildStats(
	subject: SubjectMeta,
	generated: GeneratedSubjectBuildStats,
): SubjectBuildStats {
	const topicStats: Record<string, TopicBuildStats> = {};
	for (const topic of subject.topics) {
		topicStats[topic.key] = { questionCount: 0, points: 0 };
	}
	Object.assign(topicStats, generated.topicStats);

	const examStats: Record<string, ExamQuestionStats> = {};
	for (const exam of subject.exams) {
		examStats[exam.id] = { questionCount: 0, points: 0 };
	}
	Object.assign(examStats, generated.examStats);

	return { ...generated, topicStats, examStats };
}

export function getHomeSubjectBuildStats(
	subject: SubjectMeta,
	generated: GeneratedSubjectBuildStats,
): HomeSubjectBuildStats {
	return {
		questionCount: generated.questionCount,
		topicCount: subject.topics.length,
		examCount: subject.exams.filter((exam) => !exam.deleteRights).length,
	};
}

export function getSelectedSubjectBuildStats(
	buildStats: SubjectBuildStats,
	selectedExamIds: readonly string[],
): SelectedSubjectBuildStats {
	const topicStats: Record<string, TopicBuildStats> = {};
	let questionCount = 0;
	let repeatedQuestionCount = 0;

	for (const examId of selectedExamIds) {
		const examStats = buildStats.examStats[examId];
		if (examStats) questionCount += examStats.questionCount;
		repeatedQuestionCount +=
			buildStats.repeatedQuestionCountByExam[examId] ?? 0;

		for (const [topicKey, stats] of Object.entries(
			buildStats.topicStatsByExam[examId] ?? {},
		)) {
			let topic = topicStats[topicKey];
			if (!topic) {
				topic = { questionCount: 0, points: 0 };
				topicStats[topicKey] = topic;
			}
			topic.questionCount += stats.questionCount;
			topic.points += stats.points;
		}
	}

	return { questionCount, repeatedQuestionCount, topicStats };
}
