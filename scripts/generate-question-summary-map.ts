import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

interface QuestionSummary {
  id: string;
  examId: string;
  topic: string;
  points: number;
  repeated?: boolean;
}

interface TopicStats {
	questionCount: number;
	points: number;
}

interface GeneratedSubjectBuildStats {
	questionCount: number;
	repeatedQuestionCount: number;
	topicStats: Record<string, TopicStats>;
	examStats: Record<string, TopicStats>;
	topicStatsByExam: Record<string, Record<string, TopicStats>>;
	repeatedQuestionCountByExam: Record<string, number>;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const subjectsDir = resolve(root, "src", "subjects");
const outPath = resolve(subjectsDir, "questionSummaries.generated.ts");

function propertyName(node: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return undefined;
}

function stringValue(node: ts.Expression): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function numberValue(node: ts.Expression): number | undefined {
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (
    ts.isBinaryExpression(node) &&
    node.operatorToken.kind === ts.SyntaxKind.SlashToken
  ) {
    const left = numberValue(node.left);
    const right = numberValue(node.right);
    if (left !== undefined && right !== undefined) return left / right;
  }
  return undefined;
}

function parseQuestion(
  node: ts.Expression,
  sourcePath: string,
): QuestionSummary {
  if (!ts.isObjectLiteralExpression(node)) {
    throw new Error(`Expected a question object in ${sourcePath}`);
  }

  const values = new Map<string, ts.Expression>();
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = propertyName(property.name);
    if (name) values.set(name, property.initializer);
  }

  const id = values.get("id") && stringValue(values.get("id")!);
  const examId = values.get("examId") && stringValue(values.get("examId")!);
  const topic = values.get("topic") && stringValue(values.get("topic")!);
  const points = values.get("points") && numberValue(values.get("points")!);
  const repeatedNode = values.get("repeated");
  const repeated = repeatedNode?.kind === ts.SyntaxKind.TrueKeyword;

  if (!id || !examId || !topic || points === undefined) {
    throw new Error(
      `Question summary fields must be literals in ${sourcePath}`,
    );
  }

  return repeated
    ? { id, examId, topic, points, repeated }
    : { id, examId, topic, points };
}

function parseQuestions(sourcePath: string): QuestionSummary[] {
  const source = ts.createSourceFile(
    sourcePath,
    readFileSync(sourcePath, "utf-8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === "questions" &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        return declaration.initializer.elements.map((element) =>
          parseQuestion(element, sourcePath),
        );
      }
    }
  }

  throw new Error(`Could not find the questions array in ${sourcePath}`);
}

function addPoints(
	stats: Record<string, TopicStats>,
	key: string,
	points: number,
) {
	let current = stats[key];
	if (!current) {
		current = { questionCount: 0, points: 0 };
		stats[key] = current;
	}
	current.questionCount += 1;
	current.points += points;
}

function buildStats(questions: QuestionSummary[]): GeneratedSubjectBuildStats {
	const topicStats: Record<string, TopicStats> = {};
	const examStats: Record<string, TopicStats> = {};
	const topicStatsByExam: Record<string, Record<string, TopicStats>> = {};
	const repeatedQuestionCountByExam: Record<string, number> = {};

	for (const question of questions) {
		addPoints(topicStats, question.topic, question.points);
		addPoints(examStats, question.examId, question.points);
		const examTopics = (topicStatsByExam[question.examId] ??= {});
		addPoints(examTopics, question.topic, question.points);
		if (question.repeated) {
			repeatedQuestionCountByExam[question.examId] =
				(repeatedQuestionCountByExam[question.examId] ?? 0) + 1;
		}
	}

	return {
		questionCount: questions.length,
		repeatedQuestionCount: questions.filter((question) => question.repeated)
			.length,
		topicStats,
		examStats,
		topicStatsByExam,
		repeatedQuestionCountByExam,
	};
}

const summaries: Record<string, QuestionSummary[]> = {};
for (const entry of readdirSync(subjectsDir, { withFileTypes: true })) {
	if (!entry.isDirectory()) continue;
  const questionsPath = resolve(subjectsDir, entry.name, "questions.ts");
  summaries[entry.name] = parseQuestions(questionsPath);
}

const contentStats: Record<string, GeneratedSubjectBuildStats> = {};
for (const [subjectId, questions] of Object.entries(summaries)) {
	contentStats[subjectId] = buildStats(questions);
}

const output = [
	'import type { QuestionSummary } from "../data/types";',
	"",
	`export const questionSummariesBySubject = ${JSON.stringify(summaries, null, 2)} as const satisfies Record<string, readonly QuestionSummary[]>;`,
	"",
	"const questionSummaryMap = new Map(Object.entries(questionSummariesBySubject));",
	"",
	"export function getQuestionSummaries(subjectId: string) {",
	"\treturn questionSummaryMap.get(subjectId) ?? [];",
	"}",
].join("\n");

writeFileSync(outPath, output);

const statsPath = resolve(subjectsDir, "contentStats.generated.ts");
const statsOutput = [
	'import type { GeneratedSubjectBuildStats } from "../lib/content-stats";',
	"",
	`export const contentStatsBySubject: Record<string, GeneratedSubjectBuildStats> = ${JSON.stringify(contentStats, null, 2)};`,
	"",
].join("\n");
writeFileSync(statsPath, statsOutput);
console.log(
	`✓ Generated question summaries and compact content stats for ${Object.keys(summaries).length} subjects → ${outPath}`,
);
