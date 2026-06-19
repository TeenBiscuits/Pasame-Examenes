# Contributing to Pasame Examenes

Thanks for helping grow this open-source exam practice platform!

## Project Overview

Pasame Examenes is a client-side SPA built with Vite, React, TypeScript, and Tailwind CSS v4. There is no backend — all data lives in TypeScript files and user progress is saved to localStorage.

Each university subject is a self-contained folder under `src/subjects/` with its own questions, metadata, and assets. New subjects are auto-discovered at build time via Vite's `import.meta.glob`.

## Adding a New Subject

### 1. Copy the Template

```bash
cp -r src/subjects/_template src/subjects/{subject-id}
```

Use lowercase kebab-case for the folder name: `calculus-1`, `operating-systems`, `machine-learning`.

### 2. Edit `meta.ts`

Fill in the subject metadata:

| Field        | Description                                                         |
| ------------ | ------------------------------------------------------------------- |
| `id`         | Must match the folder name                                          |
| `name`       | Display name (e.g. "Introduction to Machine Learning")              |
| `university` | University name                                                     |
| `courseCode` | Course code (e.g. "2DV516")                                         |
| `icon`       | Single emoji representing the subject                               |
| `topics`     | Array of topics. Each has `key`, `label`, `icon`, and `color`       |
| `exams`      | Array of exam metadata (year, title, description, points, duration) |

Available topic colors: `blue`, `indigo`, `green`, `purple`, `pink`, `amber`, `red`, `cyan`, `orange`.

### 3. Add Questions to `questions.ts`

Export a `Question[]` array. See `src/data/types.ts` for the full type definition.

Question types:

- **`mc`** — Multiple choice with 5 options. `correctAnswer` is a letter string `"a"`–`"e"`.
- **`text`** — Free-text answer. Self-graded by the user against a model solution.
- **`calculation`** — Same as text, but labeled differently.
- **`matching`** — Match items to letters. `correctAnswer` is a `Record<string, string>`.

### 4. Add Exam PDFs

Place the original exam PDFs in `public/exams/{subject-id}/`:

```
public/exams/{subject-id}/Exam-2024.pdf
public/exams/{subject-id}/Exam-2025.pdf
```

The naming convention is `Exam-{year}.pdf`.

### 5. Add Question Images

If any questions reference figures or charts:

1. Screenshot/crop the image from the PDF
2. Save it to `src/subjects/{subject-id}/assets/`
3. Import it in `questions.ts` and set the `image` field:

```ts
import figure1 from "./assets/figure-1.png";

{
  // ...
  image: figure1,
  imageWidth: 800,
  imageHeight: 400,
}
```

### 6. Verify

```bash
pnpm dev
```

The subject should appear on the homepage and all features should work.

## Extraction Workflow for PDF Questions

When converting an exam PDF to the data format:

1. Identify each question in the PDF
2. Determine the question type (mc, text, calculation, matching)
3. Map each question to a topic from your `meta.ts` topics array
4. For MC questions: write all 5 options exactly as they appear, mark the correct letter
5. For text/calculation questions: write a model solution (can be sourced from official answer keys)
6. For matching questions: create the item-to-letter mapping
7. Include explanatory notes in the `explanation` field

## Project Structure

```
src/
├── subjects/
│   ├── index.ts              # Auto-discovery logic (don't edit)
│   ├── _template/            # Copy this to start a new subject
│   └── ml/                   # Example subject (Machine Learning)
│       ├── meta.ts
│       ├── questions.ts
│       └── assets/
├── components/               # Shared UI components
│   ├── Header.tsx
│   ├── SubjectCard.tsx
│   ├── TopicCard.tsx
│   └── QuestionCard.tsx
├── pages/                    # Route-level pages
│   ├── Home.tsx
│   ├── SubjectHome.tsx
│   ├── PracticeHome.tsx
│   ├── PracticeTopic.tsx
│   └── ExamSimulation.tsx
├── data/
│   ├── types.ts              # TypeScript type definitions
│   └── store.ts              # localStorage persistence
└── App.tsx                   # Root component with routing

public/
└── exams/                    # Original exam PDFs
    └── {subject-id}/
```

## Development

```bash
pnpm dev       # Start dev server
pnpm build     # Type-check and build for production
pnpm lint      # Run ESLint
pnpm preview   # Preview production build
```

## Pull Request Checklist

- [ ] Subject ID is lowercase kebab-case and matches folder name
- [ ] All topic keys in `questions.ts` match `meta.ts` topics
- [ ] All MC questions have exactly 5 options and a valid letter answer
- [ ] Exam PDFs are placed in `public/exams/{subject-id}/`
- [ ] Images are in `src/subjects/{subject-id}/assets/` and imported correctly
- [ ] `pnpm build` succeeds with no errors
- [ ] `pnpm lint` passes
- [ ] Subject loads correctly in development mode
