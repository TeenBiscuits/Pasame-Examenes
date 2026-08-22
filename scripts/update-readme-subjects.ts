import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { SubjectMeta } from "../src/data/types";
import { isIndexableSubject } from "../src/subjects/visibility";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const subjectsDir = resolve(root, "src", "subjects");
const readmePath = resolve(root, "README.md");

const START_MARKER = "<!-- SUBJECTS_TABLE:START -->";
const END_MARKER = "<!-- SUBJECTS_TABLE:END -->";

function examSummary(subject: SubjectMeta): string {
  const exams = subject.exams.filter((exam) => !exam.deleteRights);
  const years = [
    ...new Set(
      exams
        .map((exam) => exam.title)
        .flatMap((value) => value.match(/20\d{2}/g) ?? []),
    ),
  ].sort();

  if (years.length === 0) return String(exams.length);
  if (years.length === 1) return `${exams.length} (${years[0]})`;
  return `${exams.length} (${years[0]} a ${years.at(-1)})`;
}

async function loadSubjects(): Promise<SubjectMeta[]> {
  const entries = readdirSync(subjectsDir, { withFileTypes: true });
  const subjectIds = entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        isIndexableSubject(entry.name) &&
        existsSync(resolve(subjectsDir, entry.name, "meta.ts")),
    )
    .map((entry) => entry.name)
    .sort();

  const subjects: SubjectMeta[] = [];
  for (const subjectId of subjectIds) {
    const modulePath = resolve(subjectsDir, subjectId, "meta.ts");
    const module = (await import(modulePath)) as { meta: SubjectMeta };
    subjects.push(module.meta);
  }
  return subjects.sort(
    (a, b) => a.course - b.course || a.name.localeCompare(b.name, "gl"),
  );
}

function buildTable(subjects: SubjectMeta[]): string {
  const rows = subjects.map(
    (subject) =>
      `| ${subject.icon} ${subject.name} | ${subject.degree} | ${subject.course}º | ${examSummary(subject)} |`,
  );

  return [
    START_MARKER,
    "| Asignatura | Grado | Curso | Exámenes |",
    "| --- | --- | ---: | ---: |",
    ...rows,
    END_MARKER,
  ].join("\n");
}

async function main() {
  const readme = readFileSync(readmePath, "utf-8");
  const subjects = await loadSubjects();
  const table = buildTable(subjects);
  const markerPattern = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`);

  if (!markerPattern.test(readme)) {
    throw new Error("README subject table markers were not found");
  }

  writeFileSync(readmePath, readme.replace(markerPattern, table), "utf-8");
  console.log(`Updated README subject table with ${subjects.length} subjects`);
}

main().catch((error) => {
  console.error("Failed to update README subject table:", error);
  process.exit(1);
});
