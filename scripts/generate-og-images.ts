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
const BADGE_BORDER = "#D1D5DB";
const BADGE_BG = "#FFFFFF";
const BADGE_AUTHORIZED_TEXT = "#15803D";
const BADGE_COMMUNITY_TEXT = "#2563EB";
const BADGE_AUTHORIZED_BG = "#F0FDF4";
const BADGE_AUTHORIZED_BORDER = "#BBF7D0";
const BADGE_COMMUNITY_BG = "#EFF6FF";
const BADGE_COMMUNITY_BORDER = "#93C5FD";

type ContentPolicy = "authorized-exams" | "community-practice";

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

function drawMortarboardIcon(
  ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  x: number,
  y: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 2);
  ctx.bezierCurveTo(x + 13.4, y + 1.7, x + 12.6, y + 1.7, x + 12, y + 2);
  ctx.lineTo(x + 2.2, y + 6.9);
  ctx.bezierCurveTo(x + 1.4, y + 7.3, x + 1.4, y + 8.7, x + 2.2, y + 9.1);
  ctx.lineTo(x + 12, y + 14);
  ctx.bezierCurveTo(x + 12.6, y + 14.3, x + 13.4, y + 14.3, x + 14, y + 14);
  ctx.lineTo(x + 21.8, y + 10.1);
  ctx.lineTo(x + 21.8, y + 16);
  ctx.bezierCurveTo(x + 21.8, y + 17.1, x + 22.7, y + 18, x + 23.8, y + 18);
  ctx.bezierCurveTo(x + 24.9, y + 18, x + 25.8, y + 17.1, x + 25.8, y + 16);
  ctx.lineTo(x + 25.8, y + 8);
  ctx.bezierCurveTo(x + 25.8, y + 7.4, x + 25.4, y + 6.9, x + 24.8, y + 6.7);
  ctx.lineTo(x + 14, y + 2);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(x + 5.5, y + 12.7, 15, 8.3, 3);
  ctx.fill();
}

function drawCommunityIcon(
  ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  x: number,
  y: number,
) {
  ctx.beginPath();
  ctx.arc(x + 9.5, y + 7.5, 5.4, 0, Math.PI * 2);
  ctx.arc(x + 20.5, y + 8, 4.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.roundRect(x + 1, y + 16, 18, 10.5, 4.5);
  ctx.roundRect(x + 16.5, y + 17, 13.5, 9.5, 4.5);
  ctx.fill();
}

function drawPolicyBadgeIcon(
  ctx: ReturnType<ReturnType<typeof createCanvas>["getContext"]>,
  x: number,
  y: number,
  isAuthorized: boolean,
) {
  roundedRectPath(ctx, x, y, 36, 36, 7);
  ctx.fillStyle = isAuthorized ? BADGE_AUTHORIZED_BG : BADGE_COMMUNITY_BG;
  ctx.fill();
  ctx.strokeStyle = isAuthorized
    ? BADGE_AUTHORIZED_BORDER
    : BADGE_COMMUNITY_BORDER;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = isAuthorized
    ? BADGE_AUTHORIZED_TEXT
    : BADGE_COMMUNITY_TEXT;
  if (isAuthorized) {
    drawMortarboardIcon(ctx, x + 5, y + 7);
  } else {
    drawCommunityIcon(ctx, x + 3, y + 5);
  }
}

async function generateOgImage(
  icon: string,
  title: string,
  questionCount: number,
  topicCount: number,
  examCount: number,
  contentPolicy: ContentPolicy,
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
  const hasAuthorizedExams = contentPolicy === "authorized-exams";
  const examLabel = hasAuthorizedExams ? "exámenes" : "recopilatorios";
  const stats = `${questionCount} preguntas · ${topicCount} temas · ${examCount} ${examLabel}`;
  const statsY = 421;
  ctx.fillText(stats, 71, statsY);

  const policyLabel = hasAuthorizedExams
    ? "Exámenes verificados"
    : "Recopilatorios comunitarios";
  const badgeX = 71;
  const badgeY = 476;
  const badgeH = 45;
  ctx.font = `600 24px Inter`;
  const badgeW = Math.ceil(ctx.measureText(policyLabel).width) + 91;
  roundedRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 12);
  ctx.fillStyle = BADGE_BG;
  ctx.fill();
  ctx.strokeStyle = BADGE_BORDER;
  ctx.lineWidth = 2;
  ctx.stroke();

  drawPolicyBadgeIcon(ctx, badgeX + 5, badgeY + 4.5, hasAuthorizedExams);
  ctx.fillStyle = hasAuthorizedExams
    ? BADGE_AUTHORIZED_TEXT
    : BADGE_COMMUNITY_TEXT;
  ctx.textBaseline = "middle";
  ctx.fillText(policyLabel, badgeX + 58, badgeY + badgeH / 2);

  ctx.textAlign = "center";
  const btnX = 827;
  const btnY = statsY;
  const btnW = 299;
  const btnH = badgeY + badgeH - statsY;
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
    (e) =>
      e.isDirectory() &&
      !(process.env.VERCEL_ENV === "production" && e.name === "_template"),
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
          contentPolicy?: ContentPolicy;
          university: string;
          courseCode: string;
        };
      };
      const { meta } = mod;

      const questionCount = countQuestions(questionsPath);
      const contentPolicy = meta.contentPolicy ?? "community-practice";
      const png = await generateOgImage(
        meta.icon,
        meta.name,
        questionCount,
        meta.topics.length,
        meta.exams.length,
        contentPolicy,
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
        contentPolicy,
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
  console.log(
    `\n  ✓ subjects-meta.json (${Object.keys(subjectsMeta).length} subjects)`,
  );

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
