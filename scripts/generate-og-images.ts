import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const subjectsDir = resolve(root, "src", "subjects");
const fontsDir = resolve(__dirname, "assets", "fonts");
const ogOutputDir = resolve(root, "public", "og");
const faviconPath = resolve(__dirname, "assets", "og-favicon.svg");

const W = 1200;
const H = 630;

const BG = "#F9FAFB";
const TEXT_PRIMARY = "#111827";
const TEXT_SECONDARY = "#6B7280";
const BUTTON_BG = "#16A34A";
const BUTTON_TEXT = "#FFFFFF";

GlobalFonts.registerFromPath(resolve(fontsDir, "inter-regular.ttf"), "Inter");
GlobalFonts.registerFromPath(resolve(fontsDir, "inter-bold.ttf"), "Inter");
GlobalFonts.registerFromPath(resolve(fontsDir, "inter-extrabold.ttf"), "Inter");
GlobalFonts.registerFromPath(
  resolve(fontsDir, "NotoColorEmoji-Regular.ttf"),
  "Noto Color Emoji",
);

function countQuestions(questionsPath: string): number {
  try {
    const content = readFileSync(questionsPath, "utf-8");
    const matches = content.match(/\bid:\s*"/g);
    return matches ? matches.length : 0;
  } catch {
    return 0;
  }
}

function roundedRectPath(
  ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function generateOgImage(
  icon: string,
  title: string,
  questionCount: number,
  topicCount: number,
  examCount: number,
  faviconSvg: Buffer,
): Promise<Buffer> {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  const overlay = ctx.createRadialGradient(
    W / 2,
    H / 2,
    0,
    W / 2,
    H / 2,
    H * 0.55,
  );
  overlay.addColorStop(0, "rgba(255,255,255,1)");
  overlay.addColorStop(0.7, "rgba(255,255,255,0)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  const favicon = await loadImage(faviconSvg);
  ctx.drawImage(favicon, 1013, 45, 115, 115);

  ctx.textBaseline = "top";

  ctx.font = `400 180px "Noto Color Emoji", sans-serif`;
  ctx.fillStyle = TEXT_PRIMARY;
  ctx.fillText(icon, 71, 45);

  let titleFontSize = 109;
  const maxTitleWidth = 1057;
  ctx.font = `800 ${titleFontSize}px Inter`;
  while (ctx.measureText(title).width > maxTitleWidth && titleFontSize > 36) {
    titleFontSize -= 4;
    ctx.font = `800 ${titleFontSize}px Inter`;
  }
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_PRIMARY;
  ctx.textAlign = "left";
  ctx.fillText(title, 71, H / 2);

  ctx.textBaseline = "top";
  ctx.font = `400 37px Inter`;
  ctx.fillStyle = TEXT_SECONDARY;
  ctx.textAlign = "left";
  const stats = `${questionCount} preguntas · ${topicCount} temas · ${examCount} exámenes`;
  ctx.fillText(stats, 71, 437);

  ctx.textAlign = "center";
  const btnX = 827;
  const btnY = 437;
  const btnW = 299;
  const btnH = 84;
  roundedRectPath(ctx, btnX, btnY, btnW, btnH, 12);
  ctx.fillStyle = BUTTON_BG;
  ctx.fill();

  ctx.font = `600 27px Inter`;
  ctx.fillStyle = BUTTON_TEXT;
  ctx.textBaseline = "middle";
  ctx.fillText("Empezar a practicar", btnX + btnW / 2, btnY + btnH / 2);

  return canvas.encode("png");
}

async function main() {
  mkdirSync(ogOutputDir, { recursive: true });

  const faviconSvg = readFileSync(faviconPath);

  const entries = readdirSync(subjectsDir, { withFileTypes: true });
  const subjectDirs = entries.filter(
    (e) => e.isDirectory() && e.name !== "_template",
  );

  let generated = 0;
  const failures: string[] = [];
  const subjectsMeta: Record<
    string,
    {
      name: string;
      icon: string;
      questionCount: number;
      topicCount: number;
      examCount: number;
      university: string;
      courseCode: string;
    }
  > = {};

  for (const dir of subjectDirs) {
    const subjectId = dir.name;
    const metaPath = resolve(subjectsDir, subjectId, "meta.ts");
    const questionsPath = resolve(subjectsDir, subjectId, "questions.ts");

    if (!existsSync(metaPath)) continue;

    try {
      const mod = (await import(metaPath)) as {
        meta: {
          id: string;
          name: string;
          icon: string;
          topics: unknown[];
          exams: unknown[];
          university: string;
          courseCode: string;
        };
      };
      const { meta } = mod;

      const questionCount = countQuestions(questionsPath);
      const png = await generateOgImage(
        meta.icon,
        meta.name,
        questionCount,
        meta.topics.length,
        meta.exams.length,
        faviconSvg,
      );

      const outPath = resolve(ogOutputDir, `${subjectId}.png`);
      writeFileSync(outPath, png);
      console.log(`  ✓ ${subjectId}.png (${meta.name})`);

      subjectsMeta[subjectId] = {
        name: meta.name,
        icon: meta.icon,
        questionCount,
        topicCount: meta.topics.length,
        examCount: meta.exams.length,
        university: meta.university,
        courseCode: meta.courseCode,
      };

      generated++;
    } catch (err) {
      const msg = `${subjectId}: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`  ✗ ${msg}`);
      failures.push(msg);
    }
  }

  const metaOutPath = resolve(root, "public", "subjects-meta.json");
  writeFileSync(metaOutPath, JSON.stringify(subjectsMeta, null, 2));
  console.log(`\n  ✓ subjects-meta.json (${Object.keys(subjectsMeta).length} subjects)`);

  console.log(`\nGenerated ${generated} OG images → ${ogOutputDir}`);

  if (failures.length > 0) {
    throw new Error(
      `Failed to generate ${failures.length} OG image(s):\n  - ${failures.join("\n  - ")}`,
    );
  }
}

main().catch((err) => {
  console.error("Failed to generate OG images:", err);
  process.exit(1);
});
