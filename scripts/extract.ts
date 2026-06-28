import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { z } from "zod";
import type { Question, QuestionType, QuestionTable } from "../src/data/types";

type Anchor = { start: string; end: string };

interface RawQuestion {
  id: string;
  exam: string;
  topic: string;
  type: QuestionType;
  points: number;
  question: Anchor;
  subquestions?: Anchor[];
  options?: Anchor[];
  correctAnswer:
    | string
    | string[] // mc
    | Anchor // text
    | { key: Anchor; label: string }[]; // matching
  explanation?: Anchor;
  image?: string;
  explanationImage?: string;
  table?: QuestionTable;
  repeated?: boolean;
}

// ---------- Recorte literal por anclajes ----------
function normalizeWithMap(text: string) {
  let normalized = "";
  const map: number[] = [];
  let prevSpace = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      if (!prevSpace) {
        normalized += " ";
        map.push(i);
        prevSpace = true;
      }
    } else {
      normalized += ch;
      map.push(i);
      prevSpace = false;
    }
  }
  return { normalized, map };
}
const normWS = (s: string) => s.replace(/\s+/g, " ").trim();

function extractBetween(md: string, a: Anchor, ctx: string): string {
  const { normalized, map } = normalizeWithMap(md);
  const start = normWS(a.start),
    end = normWS(a.end);
  const sIdx = normalized.indexOf(start);
  if (sIdx === -1) throw new Error(`[${ctx}] START no encontrado: "${start}"`);
  const eIdx = normalized.indexOf(end, sIdx);
  if (eIdx === -1) throw new Error(`[${ctx}] END no encontrado: "${end}"`);
  const origStart = map[sIdx];
  const origEnd = map[eIdx + end.length - 1] + 1;
  return md.slice(origStart, origEnd).trim();
}

// ---------- correctAnswer por tipo ----------
function buildAnswer(md: string, raw: RawQuestion) {
  if (raw.type === "mc") return raw.correctAnswer as string | string[];
  if (raw.type === "text")
    return extractBetween(md, raw.correctAnswer as Anchor, `${raw.id} answer`);
  // matching
  const out: Record<string, string> = {};
  for (const { key, label } of raw.correctAnswer as {
    key: Anchor;
    label: string;
  }[]) {
    out[extractBetween(md, key, `${raw.id} matchKey`)] = label;
  }
  return out;
}

// Estructura intermedia: como Question pero image es nombre de archivo (string)
type BuiltQuestion = Omit<Question, "image" | "explanationImage"> & {
  image?: string;
  explanationImage?: string;
};

function buildQuestion(md: string, raw: RawQuestion): BuiltQuestion {
  return {
    id: raw.id,
    exam: raw.exam,
    topic: raw.topic,
    type: raw.type,
    points: raw.points,
    question: extractBetween(md, raw.question, `${raw.id} question`),
    ...(raw.subquestions && {
      subquestions: raw.subquestions.map((a, i) =>
        extractBetween(md, a, `${raw.id} subq[${i}]`),
      ),
    }),
    ...(raw.options && {
      options: raw.options.map((a, i) =>
        extractBetween(md, a, `${raw.id} opt[${i}]`),
      ),
    }),
    correctAnswer: buildAnswer(md, raw),
    ...(raw.explanation && {
      explanation: extractBetween(md, raw.explanation, `${raw.id} explanation`),
    }),
    ...(raw.image && { image: raw.image }),
    ...(raw.explanationImage && { explanationImage: raw.explanationImage }),
    ...(raw.table && { table: raw.table }),
    ...(raw.repeated !== undefined && { repeated: raw.repeated }),
  };
}

// ---------- Validación Zod (sobre los objetos en memoria) ----------
const tableSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});
const builtSchema = z
  .object({
    id: z.string(),
    exam: z.string(),
    topic: z.string(),
    type: z.enum(["mc", "text", "matching"]),
    points: z.number(),
    question: z.string().min(1),
    subquestions: z.array(z.string()).optional(),
    options: z.array(z.string()).optional(),
    correctAnswer: z.union([
      z.string(),
      z.array(z.string()),
      z.record(z.string(), z.string()),
    ]),
    explanation: z.string().optional(),
    image: z.string().optional(),
    explanationImage: z.string().optional(),
    table: tableSchema.optional(),
    repeated: z.boolean().optional(),
  })
  .refine(
    (q) =>
      q.type !== "matching" ||
      (typeof q.correctAnswer === "object" && !Array.isArray(q.correctAnswer)),
    { message: "matching requiere Record<string,string>" },
  )
  .refine((q) => q.type !== "text" || typeof q.correctAnswer === "string", {
    message: "text requiere correctAnswer string",
  })
  .refine(
    (q) =>
      q.type !== "mc" ||
      typeof q.correctAnswer === "string" ||
      Array.isArray(q.correctAnswer),
    { message: "mc requiere letra(s) de opción" },
  );

// ---------- Serialización a TS (image -> getImage) ----------
function serialize(q: BuiltQuestion): string {
  const f: string[] = [];
  const lit = (v: unknown) => JSON.stringify(v);
  f.push(`    id: ${lit(q.id)}`);
  f.push(`    exam: ${lit(q.exam)}`);
  f.push(`    topic: ${lit(q.topic)}`);
  f.push(`    type: ${lit(q.type)}`);
  f.push(`    points: ${q.points}`);
  if (q.repeated) f.push(`    repeated: true`);
  f.push(`    question: ${lit(q.question)}`);
  if (q.subquestions) f.push(`    subquestions: ${lit(q.subquestions)}`);
  if (q.options) f.push(`    options: ${lit(q.options)}`);
  if (q.image) f.push(`    image: getImage(imageMap, ${lit(q.image)})`);
  f.push(`    correctAnswer: ${lit(q.correctAnswer)}`);
  if (q.explanation) f.push(`    explanation: ${lit(q.explanation)}`);
  if (q.explanationImage)
    f.push(
      `    explanationImage: getImage(imageMap, ${lit(q.explanationImage)})`,
    );
  if (q.table) f.push(`    table: ${lit(q.table)}`);
  return `  {\n${f.join(",\n")},\n  }`;
}

const HEADER = `import type { Question } from "../../data/types";
import type { Picture } from "vite-imagetools";
import { getImage } from "../../lib/image";
import type { ImageMap } from "../../lib/image";

const imageMap = import.meta.glob<{ default: Picture }>(
  "./assets/*.{png,jpeg,jpg}",
  { query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" }, eager: true }
) as ImageMap;
void imageMap;
void getImage;

`;

// ---------- CLI: extract.ts <id> <full.md> <raw.json> [<full.md> <raw.json> ...] ----------
const [, , subjectId, ...pairs] = process.argv;
const built: BuiltQuestion[] = [];
const errors: string[] = [];

for (let i = 0; i < pairs.length; i += 2) {
  const md = readFileSync(pairs[i], "utf-8");
  const raws: RawQuestion[] = JSON.parse(readFileSync(pairs[i + 1], "utf-8"));
  for (const raw of raws) {
    try {
      const q = buildQuestion(md, raw);
      const parsed = builtSchema.safeParse(q);
      if (!parsed.success) {
        errors.push(
          `${raw.id}: ${parsed.error.issues.map((x) => x.message).join("; ")}`,
        );
        continue;
      }
      built.push(q);
    } catch (e) {
      errors.push((e as Error).message);
    }
  }
}

if (errors.length) {
  console.error("⚠️  Casos para revisión manual:");
  errors.forEach((e) => console.error("  - " + e));
}

const outPath = `src/subjects/${subjectId}/questions.ts`;
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(
  outPath,
  HEADER +
    `export const questions: Question[] = [\n${built.map(serialize).join(",\n")},\n];\n`,
  "utf-8",
);
console.log(`✅ ${built.length} preguntas en ${outPath}`);
if (errors.length) process.exit(1);
