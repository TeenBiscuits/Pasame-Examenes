#!/usr/bin/env tsx
/**
 * Scrape a daypo.com test and export questions as a TypeScript Question array.
 *
 * Usage:
 *     tsx scripts/daypo_scraper.ts <url> [--output FILE] [--topic TOPIC] [--exam EXAM]
 *
 * Examples:
 *     tsx scripts/daypo_scraper.ts https://www.daypo.com/xp-practica.html
 *     tsx scripts/daypo_scraper.ts https://www.daypo.com/xp-teoria.html --topic teoria --exam scraped --output xp-teoria.ts
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const LETTERS = ["a", "b", "c", "d", "e"] as const;

interface DaypoQuestion {
  type: string;
  question: string;
  code: string;
  options: string[];
  hint: string;
}

interface DaypoTest {
  title: string;
  description: string;
  author: string;
  questions: DaypoQuestion[];
}

function parseArgs(args: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--output" || args[i] === "-o") {
      flags.output = args[++i] ?? "";
    } else if (args[i] === "--topic") {
      flags.topic = args[++i] ?? "";
    } else if (args[i] === "--exam") {
      flags.exam = args[++i] ?? "";
    } else if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      flags[key] = args[++i] ?? "";
    } else {
      positional.push(args[i]);
    }
  }

  return { url: positional[0], flags };
}

function extractNtest(html: string): number | null {
  const m = /ntest\s*=\s*(\d+)/.exec(html);
  return m ? Number.parseInt(m[1], 10) : null;
}

async function fetchXml(ntest: number, referer: string): Promise<string> {
  const response = await fetch("https://www.daypo.com/asps/load.php", {
    method: "POST",
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: referer,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `tes=${ntest}`,
  });
  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }
  return response.text();
}

function parseCorrectIndices(code: string): number[] {
  const indices: number[] = [];
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "2") indices.push(i);
  }
  return indices;
}

function unescapeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTag(xml: string, tag: string): string {
  const open = `<${tag}>`;
  const close = `</${tag}>`;
  const start = xml.indexOf(open);
  if (start === -1) return "";
  const end = xml.indexOf(close, start);
  if (end === -1) return "";
  return xml.substring(start + open.length, end);
}

function parseXml(xml: string): DaypoTest {
  const title = unescapeXml(extractTag(xml, "t"));
  const description = unescapeXml(extractTag(xml, "d"));
  const author = unescapeXml(extractTag(xml, "a"));

  const questions: DaypoQuestion[] = [];

  let pos = 0;
  const startMarker = "<c><t>";

  while ((pos = xml.indexOf(startMarker, pos)) !== -1) {
    const typeStart = pos + startMarker.length;
    const typeEnd = xml.indexOf("</t>", typeStart);
    if (typeEnd === -1) {
      pos++;
      continue;
    }
    const type = xml.substring(typeStart, typeEnd);
    if (type !== "0" && type !== "1") {
      pos++;
      continue;
    }

    let depth = 1;
    let searchPos = pos + 3;
    while (depth > 0 && searchPos < xml.length) {
      const nextOpen = xml.indexOf("<c>", searchPos);
      const nextClose = xml.indexOf("</c>", searchPos);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        searchPos = nextOpen + 3;
      } else {
        depth--;
        if (depth === 0) {
          searchPos = nextClose + 4;
          break;
        }
        searchPos = nextClose + 4;
      }
    }

    const block = xml.substring(pos, searchPos);

    let inner = block;
    if (inner.startsWith("<c>")) inner = inner.substring(3);
    if (inner.endsWith("</c>")) inner = inner.substring(0, inner.length - 4);

    const question = unescapeXml(extractTag(inner, "p"));
    const code = extractTag(inner, "c");
    const hint = unescapeXml(extractTag(inner, "h"));

    const options: string[] = [];
    let oPos = 0;
    while (true) {
      const oStart = inner.indexOf("<o>", oPos);
      if (oStart === -1) break;
      const oEnd = inner.indexOf("</o>", oStart);
      if (oEnd === -1) break;
      options.push(unescapeXml(inner.substring(oStart + 3, oEnd)));
      oPos = oEnd + 4;
    }

    questions.push({ type, question, code, options, hint });

    pos = searchPos;
  }

  return { title, description, author, questions };
}

function buildTsOutput(test: DaypoTest, topic: string, exam: string): string {
  const lines: string[] = [
    'import type { Question } from "../../data/types";',
    "",
    "export const questions: Question[] = [",
  ];

  for (let i = 0; i < test.questions.length; i++) {
    const q = test.questions[i];
    const qId = `${exam}_${String(i + 1).padStart(2, "0")}`;
    const correctIndices = parseCorrectIndices(q.code);
    const correctLetters = correctIndices
      .filter((idx) => idx >= 0 && idx < LETTERS.length)
      .map((idx) => LETTERS[idx]);
    const options = q.options.map(
      (o, oi) => `${String.fromCharCode(65 + oi)}. ${o}`,
    );

    lines.push("  {");
    lines.push(`    id: "${qId}",`);
    lines.push(`    exam: "${exam}",`);
    lines.push(`    topic: "${topic}",`);
    lines.push(`    type: "mc",`);
    lines.push(`    points: 1,`);
    lines.push(`    question: ${JSON.stringify(q.question)},`);

    if (options.length > 0) {
      lines.push(`    options: ${JSON.stringify(options)},`);
    }

    const hasMultipleCorrect = correctLetters.length > 1;
    const fallbackExplanation = hasMultipleCorrect
      ? `Daypo correct options: ${correctLetters.join(", ").toUpperCase()}`
      : "";

    if (correctLetters.length >= 1) {
      lines.push(`    correctAnswer: "${correctLetters[0]}",`);
    } else {
      lines.push(`    correctAnswer: "a",`);
    }

    if (q.hint && fallbackExplanation) {
      lines.push(
        `    explanation: ${JSON.stringify(`${fallbackExplanation}. ${q.hint}`)},`,
      );
    } else if (fallbackExplanation) {
      lines.push(`    explanation: ${JSON.stringify(fallbackExplanation)},`);
    } else if (q.hint) {
      lines.push(`    explanation: ${JSON.stringify(q.hint)},`);
    }

    lines.push("  },");
  }

  lines.push("];");
  lines.push("");

  return lines.join("\n");
}

async function main() {
  const args = process.argv.slice(2);
  const { url, flags } = parseArgs(args);

  if (!url) {
    console.error("Usage: tsx scripts/daypo_scraper.ts <url> [--output FILE]");
    process.exit(1);
  }

  const topic = flags.topic || "scraped";
  const exam = flags.exam || "scraped";

  console.log(`Fetching page: ${url}`);
  const htmlResp = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!htmlResp.ok) {
    console.error(`Failed to fetch page: ${htmlResp.status}`);
    process.exit(1);
  }
  const html = await htmlResp.text();

  const ntest = extractNtest(html);
  if (!ntest) {
    console.error("Error: could not extract test ID from the page.");
    process.exit(1);
  }

  console.log(`Downloading test data (ID: ${ntest})...`);
  const xml = await fetchXml(ntest, url);

  console.log("Parsing questions...");
  const test = parseXml(xml);

  const multiCorrectCount = test.questions.filter(
    (q) => parseCorrectIndices(q.code).length > 1,
  ).length;

  if (multiCorrectCount > 0) {
    console.warn(
      `Warning: ${multiCorrectCount} question(s) have multiple correct answers in Daypo. Only the first correct answer is used; check the explanation field for all correct options.`,
    );
  }

  console.log("Generating TypeScript...");
  const ts = buildTsOutput(test, topic, exam);

  const pathname = new URL(url).pathname;
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const slug = lastSegment?.replace(/\.html$/, "") || `daypo-${ntest}`;
  const outPath = resolve(flags.output || `${slug}.ts`);

  writeFileSync(outPath, ts, "utf-8");
  console.log(
    `Done. ${test.questions.length} questions exported to: ${outPath}`,
  );
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
