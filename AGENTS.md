# AGENTS.md - Pasame Examenes

## Commands

```bash
pnpm dev       # Vite dev server; src/main.tsx loads react-grab only in DEV
pnpm build     # tsc -b, generate sitemap, optional IndexNow key, then vite build
pnpm lint      # ESLint flat config for TS/TSX; scripts/ is ignored
pnpm format    # Prettier write
pnpm preview   # Preview production build
pnpm doctor    # React Doctor via npx
```

- Use `pnpm`; this repo has `pnpm-lock.yaml` and an empty `pnpm-workspace.yaml` (`packages: []`), so it is a single app, not a monorepo.
- There is no `test` or standalone `typecheck` script. `pnpm build` is the typecheck source of truth.
- `pnpm build` rewrites `public/sitemap.xml` and writes `public/${INDEXNOW_KEY}.txt` only when `INDEXNOW_KEY` is set. `SITE_URL` overrides the sitemap base URL; otherwise it uses `https://pe.pablopl.dev`.

## Toolchain Gotchas

- TypeScript 6 uses `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`, and `noUnusedParameters`; use `import type` for type-only imports and avoid enums/namespaces/non-erasable TS syntax.
- Tailwind CSS v4 is configured in CSS, not `tailwind.config.js`: `src/index.css` imports `tailwindcss` and `tailwind-animations`, defines theme tokens in `@theme`, and uses `html[data-theme=...]` overrides.
- Vite plugins are React, Tailwind, and `vite-imagetools`; image glob queries should request `w=400;800;1200` and `format=avif;webp;png` unless there is a reason to differ.
- Vercel serves this as an SPA: `vercel.json` rewrites `/en/*`, `/es/*`, `/gl/*`, and all other paths to `/index.html`.

## Architecture

- No backend: subjects/questions are static TypeScript under `src/subjects/`; attempts/progress, language, and theme are persisted in `localStorage`.
- Runtime subject discovery is in `src/subjects/index.ts`: eager `import.meta.glob` loads every `*/meta.ts`, lazy glob loads `*/questions.ts`, and `_template` is excluded.
- `src/subjects/_visibility.ts` is still required when adding a subject so React Doctor/static analysis sees named `meta` and `questions` exports as consumed.
- Routes live in `src/App.tsx` under `/:lang` for `en`, `es`, and `gl`: `/:lang`, `/:lang/:subjectId`, `/:lang/:subjectId/practice/:topic`, and `/:lang/:subjectId/exam/:year`. `/:lang/:subjectId/practice` redirects back to the subject page.
- i18n is a custom context in `src/i18n/`; adding a string means updating the `Translations` shape in `en.ts` and adding matching values in `es.ts` and `gl.ts`.
- Theme state is in `src/theme/`; valid themes come from `themeOrder` in `src/theme/types.ts` and are applied with `data-theme` on `<html>`.
- Analytics scripts are in `index.html`; app code should use `src/lib/rybbit.ts`, which no-ops when analytics is unavailable.

## Subject Data

- To add a subject, copy `src/subjects/_template/`, then create exported `meta` and `questions` from `src/data/types.ts`; see `CONTRIBUTING.md` for full examples.
- Subject folder names and `meta.id` must match. Use lowercase kebab-case unless preserving the existing short-code convention (`eseo`, `cepe`, etc.).
- Topic keys referenced by `questions.ts` must exist in `meta.topics`; topic colors must have matching CSS variables in `src/index.css` (`blue`, `indigo`, `green`, `purple`, `pink`, `amber`, `red`, `cyan`, `orange`).
- `Exam.year` is a string and is used directly in URLs and PDF filenames. PDFs are linked as `public/exams/{subject-id}/Exam-{year}.pdf`; set `hasPdf: false` for exams without a PDF.
- Questions can use `exam: "both"` to appear in every exam for that subject. Mark repeated or near-duplicate questions with `repeated: true` so the UI labels/counts them.
- `mc` answers are stored as lowercase letters (`"a"`-`"e"`); `text` questions show `correctAnswer` as the model solution for self-grading; `matching` uses `Record<string, string>`.
- Optional `explanation` only controls the extra solution panel for `mc`/`matching`; `text` always opens a model solution and can also show `explanation`.
- Markdown-style inline code and fenced code blocks are rendered in question text, explanations, model answers, options, subquestions, and table cells via `src/lib/markdown.tsx`.

## Images

- Put question images in `src/subjects/{subject-id}/assets/` and reference them with `getImage(imageMap, "filename.png")`.
- The standard import block is in `src/subjects/_template/questions.ts`; keep `Picture`/`ImageMap` as type-only imports.
- Use `image` for the question body and `explanationImage` for the solution panel.

## Verification

- For code changes, run `pnpm build` and `pnpm lint` unless the change is docs-only.
- For subject additions/large subject edits, also run `pnpm doctor` and manually check the subject page, each topic route, each exam route, images, grading, and PDF links in `pnpm dev`.
