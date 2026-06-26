import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const subjectsDir = resolve(root, "src", "subjects");

interface Patches {
  meta?: Record<string, unknown>;
  questions?: Record<string, Record<string, unknown>>;
}

const IMAGE_EXT_RE = /\.(png|jpe?g|avif|webp|gif|svg)$/i;

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "undefined";
  if (typeof v === "string") {
    if (v.includes("\n") || v.includes("`")) {
      return `\`${v.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$")}\``;
    }
    return JSON.stringify(v);
  }
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const items = v.map((el) => formatValue(el)).join(", ");
    return `[${items}]`;
  }
  if (typeof v === "object") {
    const pairs = Object.entries(v as Record<string, unknown>).map(
      ([k, val]) => `${JSON.stringify(k)}: ${formatValue(val)}`,
    );
    return `{ ${pairs.join(", ")} }`;
  }
  return "undefined";
}

function findValueEnd(source: string, pos: number): number {
  let i = pos;
  while (i < source.length && (source[i] === " " || source[i] === "\t")) i++;

  const ch = source[i];
  if (ch === '"' || ch === "'") {
    const quote = ch;
    i++;
    while (i < source.length) {
      if (source[i] === "\\") { i += 2; continue; }
      if (source[i] === quote) { i++; break; }
      i++;
    }
    return i;
  }
  if (ch === "`") {
    i++;
    while (i < source.length) {
      if (source[i] === "\\") { i += 2; continue; }
      if (source[i] === "`") { i++; break; }
      if (source[i] === "$" && source[i + 1] === "{") {
        let depth = 1;
        i += 2;
        while (i < source.length && depth > 0) {
          if (source[i] === "{") depth++;
          else if (source[i] === "}") depth--;
          i++;
        }
        continue;
      }
      i++;
    }
    return i;
  }
  if (ch === "[" || ch === "{") {
    const open = ch;
    const close = open === "[" ? "]" : "}";
    i++;
    let depth = 1;
    while (i < source.length && depth > 0) {
      if (source[i] === '"' || source[i] === "'") {
        const q = source[i];
        i++;
        while (i < source.length && source[i] !== q) {
          if (source[i] === "\\") i++;
          i++;
        }
        if (i < source.length) i++;
        continue;
      }
      if (source[i] === "`") {
        i++;
        while (i < source.length) {
          if (source[i] === "\\") { i += 2; continue; }
          if (source[i] === "`") { i++; break; }
          i++;
        }
        continue;
      }
      if (source[i] === open) depth++;
      else if (source[i] === close) depth--;
      i++;
    }
    return i;
  }
  while (i < source.length && !/[\s,}\n]/.test(source[i])) {
    if (source[i] === "(") {
      i++;
      let depth = 1;
      while (i < source.length && depth > 0) {
        if (source[i] === '"' || source[i] === "'") {
          const q = source[i];
          i++;
          while (i < source.length && source[i] !== q) {
            if (source[i] === "\\") i++;
            i++;
          }
          if (i < source.length) i++;
          continue;
        }
        if (source[i] === "`") {
          i++;
          while (i < source.length) {
            if (source[i] === "\\") { i += 2; continue; }
            if (source[i] === "`") { i++; break; }
            i++;
          }
          continue;
        }
        if (source[i] === "(") depth++;
        else if (source[i] === ")") depth--;
        i++;
      }
    } else if (source[i] === "<") {
      while (i < source.length && source[i] !== ">") i++;
      if (i < source.length) i++;
    } else {
      i++;
    }
  }
  return i;
}

function findPropertyInRange(
  source: string,
  propName: string,
  rangeStart: number,
  rangeEnd: number,
): { valueStart: number; valueEnd: number } | null {
  const text = source.slice(rangeStart, rangeEnd);
  const regex = new RegExp(
    `\\b${propName}\\s*:\\s*`,
    "g",
  );
  const match = regex.exec(text);
  if (!match) return null;

  const valueStart = rangeStart + match.index + match[0].length;
  const valueEnd = findValueEnd(source, valueStart);
  return { valueStart, valueEnd };
}

function replacePropertyValue(
  source: string,
  propName: string,
  rangeStart: number,
  rangeEnd: number,
  newValue: string,
): string {
  const existing = findPropertyInRange(source, propName, rangeStart, rangeEnd);
  if (existing) {
    return (
      source.slice(0, existing.valueStart) +
      newValue +
      source.slice(existing.valueEnd)
    );
  }

  const text = source.slice(rangeStart, rangeEnd);

  let baseIndent = "";
  for (let i = rangeStart - 1; i >= 0 && source[i] !== "\n"; i--) {
    baseIndent = source[i] + baseIndent;
  }
  if (baseIndent.trim() === "{") {
    baseIndent = baseIndent.replace("{", "");
  }
  const indent = baseIndent + "  ";

  const closingBraceIdx = text.lastIndexOf("}");
  if (closingBraceIdx < 0) return source;

  const insertPos = rangeStart + closingBraceIdx;
  const beforeBrace = source.slice(0, insertPos);
  const afterBrace = source.slice(insertPos);
  const lastNewlineIdx = beforeBrace.lastIndexOf("\n");
  const prefix = beforeBrace.slice(0, lastNewlineIdx + 1);
  const closingWhitespace = beforeBrace.slice(lastNewlineIdx + 1);
  const trimmedEnd = prefix.trimEnd();
  const needsComma =
    trimmedEnd.length > rangeStart + 1 && !trimmedEnd.endsWith(",");

  return (
    prefix.trimEnd() +
    `${needsComma ? "," : ""}\n${indent}${propName}: ${newValue}\n${closingWhitespace}` +
    afterBrace
  );
}

function findObjectRange(
  source: string,
  propName: string,
  idValue: string,
): { start: number; end: number } | null {
  const escaped = idValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `${propName}:\\s*["'\`]${escaped}["'\`]`,
    "g",
  );

  let match;
  while ((match = pattern.exec(source)) !== null) {
    const beforePos = match.index;
    let depth = 0;
    let objStart = beforePos;

    for (let i = beforePos - 1; i >= 0; i--) {
      if (source[i] === "}") depth++;
      else if (source[i] === "{") {
        if (depth === 0) { objStart = i; break; }
        depth--;
      }
    }

    depth = 0;
    let objEnd = objStart;
    for (let i = objStart; i < source.length; i++) {
      if (source[i] === "{") depth++;
      else if (source[i] === "}") {
        depth--;
        if (depth === 0) { objEnd = i + 1; break; }
      }
    }

    if (objEnd > objStart + match[0].length) {
      return { start: objStart, end: objEnd };
    }
  }

  return null;
}

function applyQuestionPatches(
  source: string,
  patches: Record<string, Record<string, unknown>>,
): string {
  let result = source;

  for (const [questionId, fields] of Object.entries(patches)) {
    const range = findObjectRange(result, "id", questionId);
    if (!range) {
      console.warn(`  ⚠ Question ${questionId} not found in source`);
      continue;
    }

    for (const [field, value] of Object.entries(fields)) {
      let formatted: string;

      if (
        (field === "image" || field === "explanationImage") &&
        typeof value === "string" &&
        IMAGE_EXT_RE.test(value)
      ) {
        formatted = `getImage(imageMap, "${value}")`;
      } else if (value === null) {
        formatted = "undefined";
      } else {
        formatted = formatValue(value);
      }

      result = replacePropertyValue(
        result,
        field,
        range.start,
        range.end,
        formatted,
      );
    }
    console.log(`  ✓ Applied patch for ${questionId}`);
  }

  return result;
}

function applyMetaPatches(
  source: string,
  patches: Record<string, unknown>,
): string {
  let result = source;

  for (const [field, value] of Object.entries(patches)) {
    if (value === null || value === undefined) continue;

    if (field === "exams" || field === "topics") {
      result = applyArrayItemPatches(
        result,
        field,
        value as Record<string, Record<string, unknown>>,
      );
      continue;
    }

    const formatted = formatValue(value);
    result = replacePropertyInMetaObject(result, field, formatted);
    console.log(`  ✓ Applied meta.${field}`);
  }

  return result;
}

function replacePropertyInMetaObject(
  source: string,
  field: string,
  formatted: string,
): string {
  const metaStart = source.indexOf("export const meta");
  if (metaStart < 0) return source;

  const openBrace = source.indexOf("{", metaStart);
  if (openBrace < 0) return source;

  let depth = 0;
  let metaEnd = openBrace;
  for (let i = openBrace; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) { metaEnd = i + 1; break; }
    }
  }

  return replacePropertyValue(source, field, openBrace, metaEnd, formatted);
}

function applyArrayItemPatches(
  source: string,
  arrayName: string,
  patches: Record<string, Record<string, unknown>>,
): string {
  const lookupProp = arrayName === "exams" ? "year" : "key";
  let result = source;

  for (const [key, fields] of Object.entries(patches)) {
    const range = findObjectRange(result, lookupProp, key);
    if (!range) {
      console.warn(`  ⚠ ${arrayName} item "${key}" not found`);
      continue;
    }

    for (const [field, value] of Object.entries(fields)) {
      const formatted = value === null ? "undefined" : formatValue(value);
      result = replacePropertyValue(
        result,
        field,
        range.start,
        range.end,
        formatted,
      );
    }
    console.log(`  ✓ Applied meta.${arrayName}.${key}`);
  }

  return result;
}

function processSubject(subjectId: string) {
  const patchesPath = resolve(subjectsDir, subjectId, "patches.json");
  let patches: Patches;
  try {
    patches = JSON.parse(readFileSync(patchesPath, "utf-8"));
  } catch {
    return;
  }

  const hasQuestions =
    patches.questions && Object.keys(patches.questions).length > 0;
  const hasMeta = patches.meta && Object.keys(patches.meta).length > 0;

  if (!hasQuestions && !hasMeta) return;

  console.log(`\n📦 ${subjectId}`);

  if (hasQuestions) {
    const qPath = resolve(subjectsDir, subjectId, "questions.ts");
    const qSource = readFileSync(qPath, "utf-8");
    const updated = applyQuestionPatches(qSource, patches.questions!);
    writeFileSync(qPath, updated, "utf-8");
  }

  if (hasMeta) {
    const mPath = resolve(subjectsDir, subjectId, "meta.ts");
    const mSource = readFileSync(mPath, "utf-8");
    const updated = applyMetaPatches(mSource, patches.meta!);
    writeFileSync(mPath, updated, "utf-8");
  }

  writeFileSync(patchesPath, "{}\n", "utf-8");
  console.log("  📝 patches.json reset to {}");
}

const targetSubject = process.argv[2];

const entries = readdirSync(subjectsDir, { withFileTypes: true });
const subjectDirs = entries.filter(
  (e) => e.isDirectory() && e.name !== "_template",
);

if (targetSubject) {
  if (!subjectDirs.some((d) => d.name === targetSubject)) {
    console.error(`Subject "${targetSubject}" not found`);
    process.exit(1);
  }
  processSubject(targetSubject);
} else {
  for (const dir of subjectDirs) {
    processSubject(dir.name);
  }
}

console.log(
  "\n✅ Done. Check git diff and run pnpm lint before committing.",
);
