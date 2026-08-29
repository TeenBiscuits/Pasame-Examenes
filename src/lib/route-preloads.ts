import type { Question } from "../data/types";
import { preloadMarkdownDependencies } from "./markdown-preload";

function questionContent(questions: Question[]): string[] {
	return questions.map((question) => JSON.stringify(question));
}

export async function preloadSimulatorDependencies(
	questions: Question[],
): Promise<void> {
	await Promise.all([
		import("./tour").then(({ preloadTour }) => preloadTour()),
		preloadMarkdownDependencies(questionContent(questions)),
	]);
}
