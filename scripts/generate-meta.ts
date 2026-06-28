import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { z } from "zod";
import type { SubjectMeta } from "../src/data/types";

const topicSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.string(),
  color: z.string(),
});
const megaSchema = z.object({
  key: z.string(),
  label: z.string(),
  topics: z.array(z.string()),
});
const examSchema = z.object({
  year: z.string(),
  title: z.string(),
  date: z.string().optional(),
  passPoints: z.number(),
  totalPoints: z.number(),
  durationMinutes: z.number(),
  description: z.string(),
  hasPdf: z.boolean().optional(),
});
const metaSchema = z.object({
  id: z.string(),
  name: z.string(),
  university: z.string(),
  courseCode: z.string(),
  icon: z.string(),
  acknowledgments: z.string().optional(),
  topics: z.array(topicSchema),
  megatopics: z.array(megaSchema).optional(),
  exams: z.array(examSchema),
});

const [, , metaJsonPath] = process.argv;
const meta: SubjectMeta = metaSchema.parse(
  JSON.parse(readFileSync(metaJsonPath, "utf-8")),
);

const outPath = `src/subjects/${meta.id}/meta.ts`;
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(
  outPath,
  `import type { SubjectMeta } from "../../data/types";\n\n` +
    `export const meta: SubjectMeta = ${JSON.stringify(meta, null, 2)};\n`,
  "utf-8",
);
console.log(`✅ meta.ts generado en ${outPath}`);
