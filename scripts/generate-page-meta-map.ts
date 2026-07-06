import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SubjectMeta } from "../src/data/types";
import {
  buildExamMeta,
  buildHomeMeta,
  buildSubjectMeta,
  buildTopicMeta,
  LANGS,
  type PageMetaData,
  type SubjectStats,
} from "../src/seo/meta";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const subjectsDir = resolve(root, "src", "subjects");
const outPath = resolve(root, "src", "seo", "pageMetaMap.generated.ts");

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countMatches(
  content: string,
  field: "topic" | "exam",
  value: string,
): number {
  const pattern = new RegExp(
    `${field}:\\s*["']${escapeRegExp(value)}["']`,
    "g",
  );
  return content.match(pattern)?.length ?? 0;
}

function countQuestions(content: string): number {
  return content.match(/\bid:\s*["']/g)?.length ?? 0;
}

function collectStats(
  subject: SubjectMeta,
  questionsPath: string,
): SubjectStats {
  const content = readFileSync(questionsPath, "utf-8");
  const topicQuestionCounts: Record<string, number> = {};
  const examQuestionCounts: Record<string, number> = {};
  const bothCount = countMatches(content, "exam", "both");

  for (const topic of subject.topics) {
    topicQuestionCounts[topic.key] = countMatches(content, "topic", topic.key);
  }
  for (const exam of subject.exams) {
    examQuestionCounts[exam.year] =
      countMatches(content, "exam", exam.year) + bothCount;
  }

  return {
    questionCount: countQuestions(content),
    topicQuestionCounts,
    examQuestionCounts,
  };
}

async function loadSubjects() {
  const entries = readdirSync(subjectsDir, { withFileTypes: true });
  const subjectDirs = entries
    .filter((entry) => entry.isDirectory() && entry.name !== "_template")
    .map((entry) => entry.name)
    .sort();

  const subjects: { meta: SubjectMeta; stats: SubjectStats }[] = [];
  for (const subjectId of subjectDirs) {
    const metaPath = resolve(subjectsDir, subjectId, "meta.ts");
    const questionsPath = resolve(subjectsDir, subjectId, "questions.ts");
    const mod = (await import(metaPath)) as { meta: SubjectMeta };
    subjects.push({
      meta: mod.meta,
      stats: collectStats(mod.meta, questionsPath),
    });
  }
  return subjects;
}

async function main() {
  const subjects = await loadSubjects();
  const pages: PageMetaData[] = [];

  for (const lang of LANGS) {
    pages.push(buildHomeMeta(lang));
    for (const { meta: subject, stats } of subjects) {
      pages.push(buildSubjectMeta(lang, subject, stats));
      for (const topic of subject.topics) {
        pages.push(buildTopicMeta(lang, subject, topic, stats));
      }
      for (const exam of subject.exams) {
        pages.push(buildExamMeta(lang, subject, exam, stats));
      }
    }
  }

  const file = [
    'import type { PageMetaData } from "./meta";',
    "",
    `export const pages = ${JSON.stringify(pages, null, 2)} as const satisfies readonly PageMetaData[];`,
    "",
  ].join("\n");

  writeFileSync(outPath, file, "utf-8");
  console.log(`✓ Generated ${pages.length} static SEO pages → ${outPath}`);
}

main().catch((err) => {
  console.error("Failed to generate SEO page meta map:", err);
  process.exit(1);
});
