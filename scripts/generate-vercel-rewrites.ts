import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const __dirname = dirname(new URL(import.meta.url).pathname);
const root = resolve(__dirname, "..");
const subjectsDir = resolve(root, "src", "subjects");
const templatePath = resolve(root, "vercel.template.json");
const outputPath = resolve(root, "vercel.json");

function main() {
  const entries = readdirSync(subjectsDir, { withFileTypes: true });
  const subjectDirs = entries.filter(
    (e) =>
      e.isDirectory() &&
      !(process.env.VERCEL_ENV === "production" && e.name === "_template"),
  );
  const subjectIds = subjectDirs.map((d) => d.name).sort();

  const langPattern = "(en|es|gl)";
  const subjectPattern = `(${subjectIds.join("|")})`;

  const rewrites = [
    {
      source: `/:lang${langPattern}`,
      destination: "/og-pages/:lang/home.html",
    },
    {
      source: `/:lang${langPattern}/:subjectId${subjectPattern}`,
      destination: "/og-pages/:lang/:subjectId.html",
    },
    {
      source: `/:lang${langPattern}/:subjectId${subjectPattern}/practice/:topic*`,
      destination: "/og-pages/:lang/:subjectId.html",
    },
    {
      source: `/:lang${langPattern}/:subjectId${subjectPattern}/exam/:year`,
      destination: "/og-pages/:lang/:subjectId.html",
    },
    { source: "/en/(.*)", destination: "/index.html" },
    { source: "/es/(.*)", destination: "/index.html" },
    { source: "/gl/(.*)", destination: "/index.html" },
    { source: "/(.*)", destination: "/index.html" },
  ];

  const template = readFileSync(templatePath, "utf-8");
  const rewritesJson = JSON.stringify(rewrites, null, 4);
  const output = template.replace("__REWRITES__", rewritesJson);

  writeFileSync(outputPath, output);
  console.log(`✓ Generated vercel.json with ${subjectIds.length} subjects`);
}

main();
