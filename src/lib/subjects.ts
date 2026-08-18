import ts from "typescript";
import type {
  QuestionSummary,
  SubjectMeta,
} from "../data/types";
import { isPublicSubject } from "../subjects/visibility";

interface MetaModule {
  meta: SubjectMeta;
}

const metaModules = import.meta.glob<MetaModule>(
  "../subjects/*/meta.ts",
  { eager: true },
);
const questionSources = import.meta.glob<string>(
  "../subjects/*/questions.ts",
  { eager: true, query: "?raw", import: "default" },
);

function subjectIdFromPath(path: string): string | undefined {
  return path.match(/\/subjects\/([^/]+)\/(?:meta|questions)\.ts$/)?.[1];
}

const allSubjects = Object.entries(metaModules)
  .map(([path, module]) => ({ path, meta: module.meta }))
  .filter(({ meta }) => meta.id !== "_template")
  .sort((a, b) => a.path.localeCompare(b.path))
  .map(({ meta }) => meta);

export const subjects = allSubjects.filter((subject) =>
  isPublicSubject(subject.id),
);

const sourceBySubject = new Map<string, string>();
for (const [path, source] of Object.entries(questionSources)) {
  const subjectId = subjectIdFromPath(path);
  if (subjectId && subjectId !== "_template") sourceBySubject.set(subjectId, source);
}

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

function parseQuestion(node: ts.Expression, subjectId: string): QuestionSummary {
  if (!ts.isObjectLiteralExpression(node)) {
    throw new Error(`Expected a question object in ${subjectId}`);
  }

  const values = new Map<string, ts.Expression>();
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = propertyName(property.name);
    if (name) values.set(name, property.initializer);
  }

  const idNode = values.get("id");
  const examIdNode = values.get("examId");
  const topicNode = values.get("topic");
  const pointsNode = values.get("points");
  const id = idNode && stringValue(idNode);
  const examId = examIdNode && stringValue(examIdNode);
  const topic = topicNode && stringValue(topicNode);
  const points = pointsNode && numberValue(pointsNode);
  const repeated = values.get("repeated")?.kind === ts.SyntaxKind.TrueKeyword;

  if (!id || !examId || !topic || points === undefined) {
    throw new Error(`Question summary fields must be literals in ${subjectId}`);
  }

  return repeated
    ? { id, examId, topic, points, repeated }
    : { id, examId, topic, points };
}

function parseQuestions(subjectId: string): QuestionSummary[] {
  const sourceText = sourceBySubject.get(subjectId);
  if (!sourceText) return [];
  const source = ts.createSourceFile(
    `${subjectId}/questions.ts`,
    sourceText,
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
          parseQuestion(element, subjectId),
        );
      }
    }
  }

  throw new Error(`Could not find the questions array for ${subjectId}`);
}

const summaries = new Map(
  allSubjects.map((subject) => [subject.id, parseQuestions(subject.id)]),
);

export function getSubject(id: string): SubjectMeta | undefined {
  return allSubjects.find((subject) => subject.id === id);
}

export function getQuestionSummaries(subjectId: string): QuestionSummary[] {
  return summaries.get(subjectId) ?? [];
}

export function formatPoints(points: number): string {
  return (Math.round((points + Number.EPSILON) * 1000) / 1000).toString();
}

export function hasAuthorizedExamContent(subject: SubjectMeta): boolean {
  return subject.contentPolicy === "authorized-exams";
}
