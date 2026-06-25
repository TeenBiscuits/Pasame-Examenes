import { readFileSync } from "node:fs";
import { z } from "zod";

const questionTypeSchema = z.enum(["mc", "text", "matching"]);

const questionTableSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

const questionSchema = z
  .object({
    id: z.string(),
    exam: z.string(),
    topic: z.string(),
    type: questionTypeSchema,
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
    image: z.string().optional(), // Picture se resuelve en build
    explanationImage: z.string().optional(),
    table: questionTableSchema.optional(),
    repeated: z.boolean().optional(),
  })
  // Coherencia tipo → formato de correctAnswer
  .refine(
    (q) =>
      q.type !== "matching" ||
      (typeof q.correctAnswer === "object" && !Array.isArray(q.correctAnswer)),
    {
      message:
        "type 'matching' requiere correctAnswer como Record<string,string>",
    },
  )
  .refine((q) => q.type !== "text" || typeof q.correctAnswer === "string", {
    message: "type 'text' requiere correctAnswer como string",
  });

const topicSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.string(),
  color: z.string(),
});

const megaTopicSchema = z.object({
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

const subjectMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  university: z.string(),
  courseCode: z.string(),
  icon: z.string(),
  acknowledgments: z.string().optional(),
  topics: z.array(topicSchema),
  megatopics: z.array(megaTopicSchema).optional(),
  exams: z.array(examSchema),
});

// --- Fidelidad: similitud por Levenshtein ---
function levenshtein(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return dp[m][n];
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

/** Comprueba que `text` existe (>= umbral) dentro del markdown. */
function fidelity(text: string, md: string): number {
  const a = norm(text);
  const b = norm(md);
  if (b.includes(a)) return 1;
  // ventana deslizante aproximada
  let best = 0;
  const step = Math.max(1, Math.floor(a.length / 4));
  for (let i = 0; i + a.length <= b.length; i += step) {
    const sim = 1 - levenshtein(a, b.slice(i, i + a.length)) / a.length;
    if (sim > best) best = sim;
  }
  return best;
}

// --- CLI: validate.ts <questionsModule> <fullMdPath> [umbral] ---
const [, , questionsModule, mdPath, threshRaw] = process.argv;
const threshold = threshRaw ? Number(threshRaw) : 0.95;

(async () => {
  const { questions } = await import(questionsModule);
  const md = readFileSync(mdPath, "utf-8");

  let typeErrors = 0;
  const lowFidelity: { id: string; field: string; sim: number }[] = [];

  for (const q of questions) {
    const parsed = questionSchema.safeParse(q);
    if (!parsed.success) {
      typeErrors++;
      console.error(
        `❌ ${q.id}:`,
        parsed.error.issues.map((i) => i.message).join("; "),
      );
      continue;
    }
    const check = (field: string, text?: string) => {
      if (!text) return;
      const sim = fidelity(text, md);
      if (sim < threshold) lowFidelity.push({ id: q.id, field, sim });
    };
    check("question", q.question);
    q.options?.forEach((o: string, i: number) => check(`option[${i}]`, o));
    q.subquestions?.forEach((s: string, i: number) => check(`subq[${i}]`, s));
    check("explanation", q.explanation);
  }

  console.log(
    `\nValidación tipos: ${typeErrors === 0 ? "OK" : typeErrors + " errores"}`,
  );
  if (lowFidelity.length) {
    console.warn("\n⚠️  Baja fidelidad (revisar manualmente):");
    console.table(lowFidelity);
  } else {
    console.log("Fidelidad: OK (todos los textos provienen del original)");
  }

  if (typeErrors > 0 || lowFidelity.length > 0) process.exit(1);
})();
