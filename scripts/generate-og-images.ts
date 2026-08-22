import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GraduationCap, Users3 } from "reicon-react";
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isHomepageSubject } from "../src/subjects/visibility";

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

GlobalFonts.registerFromPath(resolve(fontsDir, "Onest[wght].ttf"), "Onest");
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

function renderPolicyIconSvg(isAuthorized: boolean): Buffer {
  const color = isAuthorized ? BADGE_AUTHORIZED_TEXT : BADGE_COMMUNITY_TEXT;
  const Icon = isAuthorized ? GraduationCap : Users3;
  const svg = renderToStaticMarkup(
    createElement(Icon, { color, size: 28, weight: "Filled" }),
  );

  return Buffer.from(svg.replaceAll("currentColor", color));
}

async function generateOgImage(
  icon: string,
  title: string,
  questionCount: number,
  topicCount: number,
  examCount: number,
  contentPolicy: ContentPolicy,
  faviconSvg: Buffer,
  authorizedIconSvg: Buffer,
  communityIconSvg: Buffer,
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
  ctx.font = `800 ${titleFontSize}px Onest`;
  while (ctx.measureText(title).width > maxTitleWidth && titleFontSize > 36) {
    titleFontSize -= 4;
    ctx.font = `800 ${titleFontSize}px Onest`;
  }
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_PRIMARY;
  ctx.textAlign = "left";
  ctx.fillText(title, 71, H / 2);

  ctx.textBaseline = "top";
  ctx.font = `400 37px Onest`;
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
  ctx.font = `600 24px Onest`;
  const badgeW = Math.ceil(ctx.measureText(policyLabel).width) + 91;
  roundedRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 12);
  ctx.fillStyle = BADGE_BG;
  ctx.fill();
  ctx.strokeStyle = BADGE_BORDER;
  ctx.lineWidth = 2;
  ctx.stroke();

  const iconBadgeX = badgeX + 5;
  const iconBadgeY = badgeY + 4.5;
  roundedRectPath(ctx, iconBadgeX, iconBadgeY, 36, 36, 7);
  ctx.fillStyle = hasAuthorizedExams ? BADGE_AUTHORIZED_BG : BADGE_COMMUNITY_BG;
  ctx.fill();
  ctx.strokeStyle = hasAuthorizedExams
    ? BADGE_AUTHORIZED_BORDER
    : BADGE_COMMUNITY_BORDER;
  ctx.lineWidth = 2;
  ctx.stroke();

  const policyIcon = await loadImage(
    hasAuthorizedExams ? authorizedIconSvg : communityIconSvg,
  );
  ctx.drawImage(policyIcon, iconBadgeX + 4, iconBadgeY + 4, 28, 28);
  ctx.fillStyle = hasAuthorizedExams
    ? BADGE_AUTHORIZED_TEXT
    : BADGE_COMMUNITY_TEXT;
  ctx.textBaseline = "middle";
  ctx.fillText(policyLabel, badgeX + 58, badgeY + badgeH / 2);

  ctx.textAlign = "center";
  const btnX = 827;
  const btnW = 299;
  const btnH = badgeY + badgeH - statsY;
  const btnTextY = (statsY + 37 + badgeY) / 2;
  const btnY = btnTextY - btnH / 2;
  roundedRectPath(ctx, btnX, btnY, btnW, btnH, 12);
  ctx.fillStyle = BUTTON_BG;
  ctx.fill();

  ctx.font = `600 27px Onest`;
  ctx.fillStyle = BUTTON_TEXT;
  ctx.textBaseline = "middle";
  ctx.fillText("Empezar a practicar", btnX + btnW / 2, btnTextY);

  return canvas.encode("png");
}

async function main() {
  mkdirSync(ogOutputDir, { recursive: true });

  const faviconSvg = readFileSync(faviconPath);
  const authorizedIconSvg = renderPolicyIconSvg(true);
  const communityIconSvg = renderPolicyIconSvg(false);

  const entries = readdirSync(subjectsDir, { withFileTypes: true });
  const subjectDirs = entries.filter(
    (e) =>
      e.isDirectory() &&
      isHomepageSubject(e.name),
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
      contentPolicy: ContentPolicy;
      degree: string;
      course: number;
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
          degree: string;
          course: number;
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
        authorizedIconSvg,
        communityIconSvg,
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
        degree: meta.degree,
        course: meta.course,
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
