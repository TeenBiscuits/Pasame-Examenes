#!/usr/bin/env tsx
/**
 * OCR exam page scans with Mistral OCR and build a multi-page PDF per exam.
 *
 * Page images follow the gei-cal site naming convention
 * (e.g. cap6-2025-Enero-1.png, cap6_2023_Enero_resuelto-2.png). Images for
 * the same exam (year + month, optionally "-resuelto") are grouped in page
 * order, merged into a single landscape PDF, and each page is sent to
 * Mistral OCR. The markdown and raw page metadata are written under
 * `--out/Exam-{id}/` mirroring the layout used by the temp/ folders.
 *
 * Usage:
 *     tsx scripts/mistral_ocr.ts [--images DIR] [--out DIR] [--pdf-dir DIR]
 *         [--group PATTERN] [--pdf-only] [--ocr-only]
 *
 * Examples:
 *     tsx scripts/mistral_ocr.ts --images public/exams/calculo --out temp/calculo
 *     tsx scripts/mistral_ocr.ts --images public/exams/calculo --pdf-only
 *     tsx scripts/mistral_ocr.ts --images public/exams/calculo --group 2025
 *
 * Requires MISTRAL_API_KEY, loaded from .env in the repo root.
 */

import { createHash } from "node:crypto";
import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import { Mistral } from "@mistralai/mistralai";

const MONTHS: Record<string, string> = {
  enero: "01",
  julio: "07",
};

interface ParsedPage {
  year: string;
  month: string;
  resuelto: boolean;
  page: number;
  file: string;
}

interface ExamGroup {
  id: string;
  pdfName: string;
  pages: ParsedPage[];
}

function parseArgs(args: string[]) {
  const flags: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--images") flags.images = args[++i] ?? "";
    else if (args[i] === "--out") flags.out = args[++i] ?? "";
    else if (args[i] === "--pdf-dir") flags.pdfDir = args[++i] ?? "";
    else if (args[i] === "--group") flags.group = args[++i] ?? "";
    else if (args[i] === "--pdf-only") flags.pdfOnly = "1";
    else if (args[i] === "--ocr-only") flags.ocrOnly = "1";
    else if (args[i].startsWith("--")) flags[args[i].slice(2)] = args[++i] ?? "";
  }
  return flags;
}

function parsePageFilename(filename: string): ParsedPage | null {
  const base = basename(filename, extname(filename));
  const tokens = base.split(/[-_]/).map((t) => t.toLowerCase());
  if (tokens[0] !== "cap6") return null;

  const yearToken = tokens.find((t) => /^\d{4}$/.test(t));
  const monthToken = tokens.find((t) => t in MONTHS);
  const pageToken = tokens.find(
    (t) => /^\d+$/.test(t) && t !== yearToken,
  );
  if (!yearToken || !monthToken) return null;

  return {
    year: yearToken,
    month: MONTHS[monthToken],
    resuelto: tokens.includes("resuelto"),
    page: pageToken ? Number.parseInt(pageToken, 10) : 1,
    file: filename,
  };
}

function groupIdOf(p: ParsedPage): string {
  return p.resuelto ? `${p.year}-${p.month}-resuelto` : `${p.year}-${p.month}`;
}

function collectGroups(imagesDir: string): ExamGroup[] {
  const files = readdirSync(imagesDir)
    .filter((f) => /\.png$/i.test(f))
    .map((f) => join(imagesDir, f));

  const entries = files
    .map((file) => ({ file, parsed: parsePageFilename(basename(file)) }))
    .filter((e): e is { file: string; parsed: ParsedPage } => e.parsed !== null);

  const seenHash = new Map<string, string>();
  const deduped: ParsedPage[] = [];
  for (const { file, parsed } of entries) {
    const hash = createHash("sha256")
      .update(readFileSync(file))
      .digest("hex");
    const existing = seenHash.get(hash);
    if (existing) {
      const existingParsed = entries.find((e) => e.file === existing)?.parsed;
      if (existingParsed && existingParsed.page === parsed.page) {
        console.log(
          `Skipping duplicate: ${basename(file)} (same content as ${basename(existing)})`,
        );
        continue;
      }
    }
    seenHash.set(hash, file);
    deduped.push({ ...parsed, file });
  }

  const groups = new Map<string, ExamGroup>();
  for (const page of deduped) {
    const id = groupIdOf(page);
    const existing = groups.get(id);
    if (existing) {
      existing.pages.push(page);
    } else {
      groups.set(id, {
        id,
        pdfName: `Exam-${id}.pdf`,
        pages: [page],
      });
    }
  }

  return [...groups.values()]
    .map((g) => ({
      ...g,
      pages: g.pages.sort((a, b) => a.page - b.page),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

import { PDFDocument } from "pdf-lib";

const PDF_PAGE_WIDTH = 841.89; // A4 landscape
const PDF_PAGE_HEIGHT = 595.28;

async function buildPdf(group: ExamGroup, pdfDir: string): Promise<void> {
  const inputs = [...group.pages]
    .sort((a, b) => a.page - b.page)
    .map((p) => p.file);
  const pdfPath = join(pdfDir, group.pdfName);
  mkdirSync(pdfDir, { recursive: true });

  const pdfDoc = await PDFDocument.create();
  for (const input of inputs) {
    const image = await pdfDoc.embedPng(readFileSync(input));
    const { width, height } = image.scale(1);
    const scale = Math.min(
      PDF_PAGE_WIDTH / width,
      PDF_PAGE_HEIGHT / height,
    );
    const page = pdfDoc.addPage([PDF_PAGE_WIDTH, PDF_PAGE_HEIGHT]);
    page.drawImage(image, {
      x: (PDF_PAGE_WIDTH - width * scale) / 2,
      y: (PDF_PAGE_HEIGHT - height * scale) / 2,
      width: width * scale,
      height: height * scale,
    });
  }
  writeFileSync(pdfPath, await pdfDoc.save());
  console.log(`PDF: ${pdfPath} (${inputs.length} page(s))`);
}

function encodeFile(path: string): string {
  return readFileSync(path).toString("base64");
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function ocrPage(
  client: Mistral,
  file: string,
  retries = 3,
): Promise<{ markdown: string; page: unknown }> {
  const base64File = encodeFile(file);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
          type: "image_url",
          imageUrl: `data:image/png;base64,${base64File}`,
        },
        includeImageBase64: false,
        includeBlocks: true,
      });
      const page = response.pages?.[0];
      if (!page) throw new Error("OCR response contained no pages");
      const { images: _images, ...rest } = page as {
        images?: unknown;
        [k: string]: unknown;
      };
      return { markdown: String(page.markdown ?? ""), page: rest };
    } catch (err) {
      const last = attempt === retries;
      const status = (err as { status?: number }).status;
      if (last || (status !== undefined && status < 500 && status !== 429)) {
        throw err;
      }
      const delay = 2 ** attempt * 1000;
      console.warn(
        `Retrying ${basename(file)} (attempt ${attempt}/${retries}) in ${delay}ms: ${
          (err as Error).message
        }`,
      );
      await sleep(delay);
    }
  }
  throw new Error(`OCR failed for ${file}`);
}

async function ocrExam(
  client: Mistral,
  group: ExamGroup,
  outDir: string,
): Promise<void> {
  const examDir = join(outDir, `Exam-${group.id}`);
  rmSync(examDir, { recursive: true, force: true });
  mkdirSync(examDir, { recursive: true });

  const combined: string[] = [];
  for (const page of group.pages) {
    const pageDir = join(examDir, "pages", `page-${page.page}`);
    mkdirSync(pageDir, { recursive: true });
    console.log(`OCR: ${basename(page.file)} ...`);
    const { markdown, page: metadata } = await ocrPage(client, page.file);
    writeFileSync(join(pageDir, "markdown.md"), markdown, "utf-8");
    writeFileSync(
      join(pageDir, "page-metadata.json"),
      JSON.stringify(metadata, null, 2),
      "utf-8",
    );
    combined.push(markdown);
    await sleep(250);
  }

  writeFileSync(join(examDir, "markdown.md"), combined.join("\n\n"), "utf-8");
  console.log(`OCR: ${group.pages.length} page(s) -> ${examDir}/markdown.md`);
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const imagesDir = resolve(flags.images || "public/exams");
  const outDir = resolve(flags.out || `temp/${basename(imagesDir)}`);
  const pdfDir = resolve(flags.pdfDir || imagesDir);

  try {
    process.loadEnvFile();
  } catch {
    // No .env file; MISTRAL_API_KEY may still be in the environment.
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    console.error("Error: MISTRAL_API_KEY not found (checked .env and env)");
    process.exit(1);
  }

  const groups = collectGroups(imagesDir).filter(
    (g) => !flags.group || g.id.includes(flags.group),
  );
  if (groups.length === 0) {
    console.error("Error: no exam page images found in", imagesDir);
    process.exit(1);
  }

  console.log(`Found ${groups.length} exam group(s) in ${imagesDir}:`);
  for (const g of groups) {
    console.log(
      `  ${g.id}: ${g.pages.map((p) => basename(p.file)).join(", ")}`,
    );
  }

  if (!flags.ocrOnly) {
    for (const group of groups) {
      await buildPdf(group, pdfDir);
    }
  }

  if (!flags.pdfOnly) {
    const client = new Mistral({ apiKey });
    for (const group of groups) {
      await ocrExam(client, group, outDir);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
