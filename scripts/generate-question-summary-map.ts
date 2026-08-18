import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
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

interface ParsedQuestion {
  summary: QuestionSummary;
  source: string;
  imageNames: string[];
  disableNoUselessEscape: boolean;
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

function parseQuestions(sourcePath: string): ParsedQuestion[] {
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
        return declaration.initializer.elements.map((element) => {
          const sourceText = element.getText(source);
          const imageNames = [
            ...sourceText.matchAll(
              /getImage\s*\(\s*imageMap\s*,\s*["']([^"']+)["']\s*,?\s*\)/g,
            ),
          ].map((match) => match[1]);

          return {
            summary: parseQuestion(element, sourcePath),
            source: sourceText,
            imageNames,
            disableNoUselessEscape: source.text.includes(
              "eslint-disable no-useless-escape",
            ),
          };
        });
      }
    }
  }

  throw new Error(`Could not find the questions array in ${sourcePath}`);
}

function safeModuleName(value: string): string {
  const name = value.replace(/[^a-zA-Z0-9_-]+/g, "-");
  if (!name) throw new Error(`Cannot create a module name for ${value}`);
  return name;
}

function writeQuestionPayload(
  outPath: string,
  subjectId: string,
  questions: ParsedQuestion[],
): void {
  const imageNames = [
    ...new Set(questions.flatMap((question) => question.imageNames)),
  ].sort();
  const imageImports =
    imageNames.length > 0
      ? `import type { Picture } from "vite-imagetools";\nimport { getImage } from "../../../../lib/image";\nimport type { ImageMap } from "../../../../lib/image";\n\nconst rawImageMap = import.meta.glob<{ default: Picture }>(\n  ${JSON.stringify(imageNames.map((name) => `../../../../${subjectId}/assets/${name}`))},\n  {\n    query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" },\n    eager: true,\n  },\n);\nconst imageMap = Object.fromEntries(\n  Object.entries(rawImageMap).map(([path, image]) => [\n    "./assets/" + path.slice(path.lastIndexOf("/") + 1),\n    image,\n  ]),\n) as ImageMap;\n\n`
      : "";

  const output = [
    ...(questions.some((question) => question.disableNoUselessEscape)
      ? ["/* eslint-disable no-useless-escape */"]
      : []),
    'import type { Question } from "../../../../data/types";',
    imageImports,
    "export const questions: Question[] = [",
    questions.map((question) => `  ${question.source}`).join(",\n"),
    "];",
    "",
  ].join("\n");

  writeFileSync(outPath, output);
}

const summaries: Record<string, QuestionSummary[]> = {};
const subjectQuestionCounts: Record<string, number> = {};
const generatedSubjectsDir = resolve(subjectsDir, "generated");
rmSync(generatedSubjectsDir, { recursive: true, force: true });
mkdirSync(generatedSubjectsDir, { recursive: true });

for (const entry of readdirSync(subjectsDir, { withFileTypes: true })) {
  if (
    !entry.isDirectory() ||
    entry.name === "_template" ||
    entry.name === "generated"
  )
    continue;
  const questionsPath = resolve(subjectsDir, entry.name, "questions.ts");
  const parsedQuestions = parseQuestions(questionsPath);
  summaries[entry.name] = parsedQuestions.map((question) => question.summary);
  subjectQuestionCounts[entry.name] = parsedQuestions.length;

  const topics = new Map<string, ParsedQuestion[]>();
  const exams = new Map<string, ParsedQuestion[]>();
  for (const question of parsedQuestions) {
    const topicQuestions = topics.get(question.summary.topic) ?? [];
    topicQuestions.push(question);
    topics.set(question.summary.topic, topicQuestions);

    const examQuestions = exams.get(question.summary.examId) ?? [];
    examQuestions.push(question);
    exams.set(question.summary.examId, examQuestions);
  }

  const subjectGeneratedDir = resolve(generatedSubjectsDir, entry.name);
  const topicsDir = resolve(subjectGeneratedDir, "topics");
  const examsDir = resolve(subjectGeneratedDir, "exams");
  mkdirSync(topicsDir, { recursive: true });
  mkdirSync(examsDir, { recursive: true });

  for (const [topic, questions] of topics) {
    writeQuestionPayload(
      resolve(topicsDir, `${safeModuleName(topic)}.ts`),
      entry.name,
      questions,
    );
  }
  for (const [examId, questions] of exams) {
    writeQuestionPayload(
      resolve(examsDir, `${safeModuleName(examId)}.ts`),
      entry.name,
      questions,
    );
  }
}

const output = [
  'import type { QuestionSummary } from "../data/types";',
  "",
  `export const questionSummariesBySubject = ${JSON.stringify(summaries, null, 2)} as const satisfies Record<string, readonly QuestionSummary[]>;`,
  "",
].join("\n");

writeFileSync(outPath, output);
writeFileSync(
  resolve(subjectsDir, "subjectQuestionCounts.generated.ts"),
  [
    "export const subjectQuestionCounts = ",
    `${JSON.stringify(subjectQuestionCounts, null, 2)} as const satisfies Record<string, number>;`,
    "",
  ].join("\n"),
);
console.log(
  `✓ Generated question summaries and route payloads for ${Object.keys(summaries).length} subjects → ${outPath}`,
);
