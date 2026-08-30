import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { getTopicProgress, saveAttempt } from "../store";
import type { ExamAttempt, QuestionSummary } from "../types";

const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem(key: string) {
			return store[key] ?? null;
		},
		setItem(key: string, value: string) {
			store[key] = value;
		},
		removeItem(key: string) {
			delete store[key];
		},
		clear() {
			store = {};
		},
	};
})();

Object.defineProperty(globalThis, "localStorage", {
	value: localStorageMock,
});

function makeAttempt(overrides: Partial<ExamAttempt> = {}): ExamAttempt {
	return {
		id: "1",
		examId: "practice",
		mode: "practice",
		topic: "topic-a",
		date: new Date().toISOString(),
		score: 10,
		maxScore: 15,
		answers: {},
		examIds: ["source-a", "source-b"],
		questionScores: {},
		...overrides,
	};
}

const questions: QuestionSummary[] = [
	{ id: "a-1", examId: "source-a", topic: "topic-a", points: 10 },
	{ id: "b-1", examId: "source-b", topic: "topic-a", points: 5 },
	{ id: "a-2", examId: "source-a", topic: "topic-b", points: 8 },
	{ id: "b-2", examId: "source-b", topic: "topic-b", points: 12 },
];

describe("getTopicProgress", () => {
	beforeEach(() => {
		localStorageMock.clear();
	});

	it("limits both progress and totals to the selected sources", () => {
		saveAttempt(
			"subject-1",
			makeAttempt({
				questionScores: { "a-1": 10, "b-1": 0, "a-2": 8, "b-2": 0 },
			}),
		);

		assert.deepEqual(getTopicProgress("subject-1", questions, ["source-a"]), {
			"topic-a": { attempted: 10, total: 10 },
			"topic-b": { attempted: 8, total: 8 },
		});
		assert.deepEqual(getTopicProgress("subject-1", questions, ["source-b"]), {
			"topic-a": { attempted: 0, total: 5 },
			"topic-b": { attempted: 0, total: 12 },
		});
		assert.deepEqual(
			getTopicProgress("subject-1", questions, ["source-a", "source-b"]),
			{
				"topic-a": { attempted: 10, total: 15 },
				"topic-b": { attempted: 8, total: 20 },
			},
		);
	});

	it("keeps the best result for each question instead of each attempt", () => {
		saveAttempt(
			"subject-2",
			makeAttempt({
				questionScores: { "a-1": 10, "b-1": 0 },
			}),
		);
		saveAttempt(
			"subject-2",
			makeAttempt({
				id: "2",
				questionScores: { "a-1": 0, "b-1": 5 },
			}),
		);

		assert.equal(
			getTopicProgress("subject-2", questions, ["source-a", "source-b"])[
				"topic-a"
			]?.attempted,
			15,
		);
	});

	it("updates the same attempt when self-evaluation changes its score", () => {
		saveAttempt("subject-5", makeAttempt({ questionScores: { "a-1": 0 } }));
		saveAttempt("subject-5", makeAttempt({ questionScores: { "a-1": 10 } }));

		assert.equal(
			JSON.parse(localStorageMock.getItem("exam-attempts:subject-5") ?? "[]")
				.length,
			1,
		);
		assert.equal(
			getTopicProgress("subject-5", questions, ["source-a"])["topic-a"]
				?.attempted,
			10,
		);
	});

	it("treats repeated questions with different IDs independently", () => {
		const repeatedQuestions: QuestionSummary[] = [
			{ id: "repeat-a", examId: "source-a", topic: "topic-a", points: 10 },
			{ id: "repeat-b", examId: "source-b", topic: "topic-a", points: 10 },
		];
		saveAttempt(
			"subject-3",
			makeAttempt({
				questionScores: { "repeat-a": 10, "repeat-b": 0 },
			}),
		);

		assert.equal(
			getTopicProgress("subject-3", repeatedQuestions, [
				"source-a",
				"source-b",
			])["topic-a"]?.attempted,
			10,
		);
		assert.equal(
			getTopicProgress("subject-3", repeatedQuestions, [
				"source-a",
				"source-b",
			])["topic-a"]?.total,
			20,
		);
	});

	it("ignores simulation attempts", () => {
		saveAttempt(
			"subject-4",
			makeAttempt({
				mode: "exam",
				questionScores: { "a-1": 10, "b-1": 5 },
			}),
		);

		assert.equal(
			getTopicProgress("subject-4", questions, ["source-a", "source-b"])[
				"topic-a"
			]?.attempted,
			0,
		);
	});
});
