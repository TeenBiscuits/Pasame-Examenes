import assert from "node:assert/strict";
import { getPracticeLoadingPreview } from "../src/lib/practice-loading";
import { contentStatsBySubject } from "../src/subjects/contentStats.generated";
import { getQuestionSummaries } from "../src/subjects/questionSummaries.generated";

let checked = 0;
for (const [subjectId, stats] of Object.entries(contentStatsBySubject)) {
	const questions = getQuestionSummaries(subjectId);
	for (const topic of Object.keys(stats.topicFirstQuestions)) {
		const topicQuestions = questions.filter((question) => question.topic === topic);
		const examIds = [...new Set(topicQuestions.map((question) => question.examId))];
		// All sources, each source alone, and a selection that excludes the first source.
		for (const selected of [examIds, ...examIds.map((id) => [id]), examIds.slice(1), [...examIds].reverse()]) {
			const expected = topicQuestions.filter((question) => selected.includes(question.examId));
			const preview = getPracticeLoadingPreview(stats, topic, selected);
			assert.equal(preview?.firstQuestion.id, expected[0]?.id, `${subjectId}/${topic}: first question`);
			assert.equal(preview?.firstQuestion.type, expected[0]?.type, `${subjectId}/${topic}: question type`);
			if (expected.length > 0) {
				assert.equal(preview?.questionCount, expected.length);
				const points = expected.reduce((sum, question) => sum + question.points, 0);
				assert(Math.abs((preview?.totalPoints ?? 0) - points) < 1e-8);
			} else assert.equal(preview, undefined);
			checked++;
		}
	}
}
assert.equal(getPracticeLoadingPreview(undefined, "missing", []), undefined);
console.log(`Verified ${checked} topic/source selections against question-bank order and types.`);
