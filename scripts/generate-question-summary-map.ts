import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

interface QuestionData {
  examId: string;
  topic: string;
  points: number;
  repeated?: boolean;
}

interface QuestionAggregate {
  questionCount: number;
  points: number;
  repeatedCount: number;
}

interface ExamQuestionOverview extends QuestionAggregate {
  topics: Record<string, QuestionAggregate>;
}

interface SubjectQuestionOverview extends QuestionAggregate {
  exams: Record<string, ExamQuestionOverview>;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const subjectsDir = resolve(root, "src", "subjects");
const outPath = resolve(subjectsDir, "questionOverviews.generated.ts");
const countsOutPath = resolve(subjectsDir, "questionCounts.generated.ts");

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

function parseQuestion(node: ts.Expression, sourcePath: string): QuestionData {
  if (!ts.isObjectLiteralExpression(node)) {
    throw new Error(`Expected a question object in ${sourcePath}`);
  }

  const values = new Map<string, ts.Expression>();
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = propertyName(property.name);
    if (name) values.set(name, property.initializer);
  }

  const examId = values.get("examId") && stringValue(values.get("examId")!);
  const topic = values.get("topic") && stringValue(values.get("topic")!);
  const points = values.get("points") && numberValue(values.get("points")!);
  const repeatedNode = values.get("repeated");
  const repeated = repeatedNode?.kind === ts.SyntaxKind.TrueKeyword;

  if (!examId || !topic || points === undefined) {
    throw new Error(
      `Question summary fields must be literals in ${sourcePath}`,
    );
  }

  return repeated
    ? { examId, topic, points, repeated }
    : { examId, topic, points };
}

function parseQuestions(sourcePath: string): QuestionData[] {
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

function emptyAggregate(): QuestionAggregate {
  return { questionCount: 0, points: 0, repeatedCount: 0 };
}

function buildOverview(questions: QuestionData[]): SubjectQuestionOverview {
  const overview: SubjectQuestionOverview = {
    ...emptyAggregate(),
    exams: {},
  };

  for (const question of questions) {
    overview.questionCount += 1;
    overview.points += question.points;
    if (question.repeated) overview.repeatedCount += 1;

    const exam = (overview.exams[question.examId] ??= {
      ...emptyAggregate(),
      topics: {},
    });
    exam.questionCount += 1;
    exam.points += question.points;
    if (question.repeated) exam.repeatedCount += 1;

    const topic = (exam.topics[question.topic] ??= emptyAggregate());
    topic.questionCount += 1;
    topic.points += question.points;
    if (question.repeated) topic.repeatedCount += 1;
  }

  return overview;
}

const questionData: Record<string, QuestionData[]> = {};
const overviews: Record<string, SubjectQuestionOverview> = {};
for (const entry of readdirSync(subjectsDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "_template") continue;
  const questionsPath = resolve(subjectsDir, entry.name, "questions.ts");
  const questions = parseQuestions(questionsPath);
  questionData[entry.name] = questions;
  overviews[entry.name] = buildOverview(questions);
}

const output = [
  'import type { SubjectQuestionOverview } from "../data/types";',
  "",
  `export const questionOverviewsBySubject = ${JSON.stringify(overviews, null, 2)} as const satisfies Record<string, SubjectQuestionOverview>;`,
  "",
].join("\n");

writeFileSync(outPath, output);
writeFileSync(
  countsOutPath,
  [
    `export const questionCountsBySubject = ${JSON.stringify(
      Object.fromEntries(
        Object.entries(questionData).map(([subjectId, questions]) => [
          subjectId,
          questions.length,
        ]),
      ),
      null,
      2,
    )} as const satisfies Record<string, number>;`,
    "",
  ].join("\n"),
);
console.log(
  `✓ Generated question overviews and counts for ${Object.keys(questionData).length} subjects`,
);
