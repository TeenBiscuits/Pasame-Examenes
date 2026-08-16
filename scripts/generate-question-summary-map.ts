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

const summaries: Record<string, QuestionSummary[]> = {};
for (const entry of readdirSync(subjectsDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "_template") continue;
  const questionsPath = resolve(subjectsDir, entry.name, "questions.ts");
  summaries[entry.name] = parseQuestions(questionsPath);
}

const output = [
  'import type { QuestionSummary } from "../data/types";',
  "",
  `export const questionSummariesBySubject = ${JSON.stringify(summaries, null, 2)} as const satisfies Record<string, readonly QuestionSummary[]>;`,
  "",
].join("\n");

writeFileSync(outPath, output);
console.log(
  `✓ Generated question summaries for ${Object.keys(summaries).length} subjects → ${outPath}`,
);
