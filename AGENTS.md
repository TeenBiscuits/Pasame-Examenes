# AGENTS.md — Pásame Exámenes

## Development

```bash
pnpm dev       # Start Vite dev server (HMR)
pnpm build     # tsc -b && vite build (typecheck + production build)
pnpm lint      # ESLint (flat config, type-aware via tseslint)
pnpm format    # Prettier
pnpm preview   # Preview production build locally
```

- **pnpm** is the package manager (`pnpm-lock.yaml`).
- **No backend** — all data is static TypeScript files. User progress is in `localStorage`.
- **Tailwind CSS v4** — CSS-first config (`src/index.css` has `@import "tailwindcss"`). No `tailwind.config.js`.
- **`verbatimModuleSyntax: true`** — type-only imports must use `import type`. TypeScript v6 `/ erasableSyntaxOnly`.
- **`noUnusedLocals` / `noUnusedParameters`** are on — unused imports will fail `tsc`.
- `pnpm build` runs `tsc -b` first, so it catches type errors. There is no separate `typecheck` script.
- Vercel rewrites all paths to `/index.html` (SPA), configured in `vercel.json`.
- Umami analytics script is loaded in `index.html`; the wrapper `src/lib/umami.ts` silently no-ops if unavailable.

## Architecture

- **Subject auto-discovery**: `src/subjects/index.ts:12` uses `import.meta.glob` to find all `*/meta.ts` and `*/questions.ts` under `src/subjects/`. Just create the folder — no manual registration.
- **i18n**: Custom React context (`src/i18n/context.tsx`). Two languages: `en`/`es`. Adding a translation string requires updating the `Translations` interface in `en.ts` and adding the value in `es.ts`.
- **Routing** (`src/App.tsx`): `/` → Home, `/:subjectId` → SubjectHome, `/:subjectId/practice` → PracticeHome, `/:subjectId/practice/:topic` → PracticeTopic, `/:subjectId/exam/:year` → ExamSimulation.
- **Exam `year` field**: A string used in the URL segment `/exam/:year`. Can be a simple year (`"2024"`) or year-month (`"2020-01"`).
- **Exam `date` field**: Optional human-readable date displayed on question cards (e.g. `"Enero 2024"`, `"June 2025"`). If omitted, no date is shown.
- **Data model**: See `src/data/types.ts` for `SubjectMeta`, `Question`, `Exam`, `Topic`, `ExamAttempt`.

## Adding a New Subject

1. Copy `src/subjects/_template/` → `src/subjects/{subject-id}/`
2. Fill in `meta.ts` with the subject metadata
3. Fill in `questions.ts` with the exam questions
4. Add exam PDFs to `public/exams/{subject-id}/`
5. Add any question images to `src/subjects/{subject-id}/assets/`
6. Run `pnpm dev` to verify everything works
7. The subject is auto-discovered — no other files to edit

### Subject ID Convention

Use lowercase kebab-case: `machine-learning`, `calculus-1`, `operating-systems`.

### `meta.ts` — Subject Manifest

```ts
import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "your-subject-id", // must match folder name
  name: "Subject Name", // human-readable
  university: "University Name",
  courseCode: "ABC123",
  icon: "📚", // emoji
  acknowledgments: "Questions provided by the ... Department. Answers by ...", // optional, shown at page bottom
  topics: [
    {
      key: "topic-slug",
      label: "Topic Display Name",
      icon: "📌",
      color: "blue",
    },
  ],
  exams: [
    {
      year: "2024", // string, used in URL /exam/2024
      title: "2024 Exam", // shown on buttons/cards
      date: "2024", // optional, human-readable date shown on questions (e.g. "Enero 2024", "June 2025", "2024")
      description: "60 points · 15 questions",
      passPoints: 30, // minimum points to pass
      totalPoints: 60,
      durationMinutes: 180,
      hasPdf: true, // optional, default true. Set false if no PDF exists
    },
  ],
};
```

Available topic colors: `blue`, `indigo`, `green`, `purple`, `pink`, `amber`, `red`, `cyan`, `orange`.

### `questions.ts` — All Exam Questions

```ts
import type { Question } from "../../data/types";

export const questions: Question[] = [
  // --- Multiple Choice (mc) ---
  {
    id: "2024_q1", // unique, e.g. "{year}_q{number}"
    exam: "2024", // year string or "both" for shared questions
    topic: "topic-slug", // must match a key in meta.ts topics
    type: "mc",
    points: 5,
    question: "What is...?",
    options: ["A. Option one", "B. Option two", "C. Option three"],
    correctAnswer: "b", // single letter "a"-"e"
    explanation: "Because...",
  },

  // --- Text / Open-ended (text|calculation) ---
  {
    id: "2024_q2",
    exam: "2024",
    topic: "topic-slug",
    type: "text", // or "calculation" (same behavior, different label)
    points: 10,
    question: "Explain...",
    correctAnswer: "Model solution text...",
    explanation: "Key points to cover...",
  },

  // --- Matching ---
  {
    id: "2024_q3",
    exam: "2024",
    topic: "topic-slug",
    type: "matching",
    points: 5,
    question: "Match concepts to descriptions:",
    correctAnswer: {
      "Concept A": "X", // item -> matching letter
      "Concept B": "Y",
    },
    explanation: "A maps to X because...",
  },
];
```

**Question types:**

- `"mc"` — Multiple choice. `correctAnswer` is a letter string `"a"`–`"e"`. Include `options[]`.
- `"text"` — Free-text answer. `correctAnswer` is the model solution string. Self-graded by user.
- `"calculation"` — Same as text, shown as calculation question. Self-graded.
- `"matching"` — Match items to letters. `correctAnswer` is `Record<string, string>`.

**Optional fields:**

- `image?: string` — imported image: `import myImage from "./assets/figure.png"`
- `imageWidth?: number` — native width in px
- `imageHeight?: number` — native height in px
- `table?: { headers: string[], rows: string[][] }` — data table
- `subquestions?: string[]` — list of sub-question text
- `options?: string[]` — required for `mc` type

**Code blocks in text:** `question`, `explanation`, `correctAnswer`, `subquestions`, `options`, and table cell strings support markdown-style code formatting:

- `` `inline code` `` — renders as inline `<code>` with monospace font and pink text on gray background. Works inside any text field.
- ` ``` ` fenced code blocks — renders as a dark-themed code block. Works in `question`, `explanation`, and `correctAnswer` fields.

Example:

```ts
question: `What does this code output?

\`\`\`
def foo():
    return 42
print(foo())
\`\`\`

Hint: remember that \`foo()\` calls the function.`,
```

## Extracting Questions from Exam PDFs

1. Open the PDF and identify each question
2. Classify each question as `mc`, `text`, `calculation`, or `matching`
3. For each question, determine:
   - What topic it belongs to (from the `topics` array in `meta.ts`)
   - How many points it's worth
   - The correct answer (model solution for text/calculation)
4. Write the question into `questions.ts` following the schema above
5. If the question references a figure/chart:
   - Screenshot/crop the figure from the PDF
   - Save it to `src/subjects/{subject-id}/assets/`
   - Import it and reference it in the question's `image` field
6. Copy the original PDF to `public/exams/{subject-id}/Exam-{year}.pdf`

## Directory Structure After Adding

```
src/subjects/{subject-id}/
├── meta.ts           # Subject manifest
├── questions.ts      # All questions
└── assets/           # Images referenced by questions
    └── figure-1.png

public/exams/{subject-id}/
├── Exam-2024.pdf
└── Exam-2025.pdf
```

## Verification Checklist

- [ ] `pnpm build` succeeds with no errors
- [ ] `pnpm lint` passes
- [ ] Subject appears on the homepage grid
- [ ] Subject home page loads with all topics
- [ ] Practice mode works for each topic
- [ ] Exam simulation loads for each exam year
- [ ] Question images display correctly
- [ ] MC and matching questions auto-grade correctly
- [ ] Text/calculation questions show model solutions
- [ ] PDFs are downloadable from the subject page
