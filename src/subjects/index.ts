declare const __VERCEL_PRODUCTION__: boolean;

import type { Picture } from "vite-imagetools";
import type { SubjectMeta, Question } from "../data/types";
import type { Patches, QuestionPatch } from "../lib/cms-types";

interface MetaModule {
  meta: SubjectMeta;
}

interface QuestionsModule {
  questions: Question[];
}

interface PatchesModule {
  default: Patches;
}

const metaModules = import.meta.glob<MetaModule>("./*/meta.ts", {
  eager: true,
});
const questionsModules = import.meta.glob<QuestionsModule>("./*/questions.ts");
const patchesModules = import.meta.glob<PatchesModule>("./*/patches.json", {
  eager: true,
});

const allImageMap = import.meta.glob<{ default: Picture }>(
  "./*/assets/*.{png,jpeg,jpg}",
  {
    query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" },
    eager: true,
  },
);

function resolveImage(subjectId: string, filename: string): Picture | string {
  const key = `./${subjectId}/assets/${filename}`;
  const mod = allImageMap[key];
  return mod?.default ?? filename;
}

function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sv = (source as Record<string, unknown>)[key];
    if (sv === undefined) continue;
    if (sv === null) {
      (result as Record<string, unknown>)[key] = null;
    } else if (
      typeof sv === "object" &&
      !Array.isArray(sv) &&
      typeof (result as Record<string, unknown>)[key] === "object" &&
      !Array.isArray((result as Record<string, unknown>)[key]) &&
      (result as Record<string, unknown>)[key] !== null
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        (result as Record<string, unknown>)[key] as Record<string, unknown>,
        sv as Record<string, unknown>,
      );
    } else {
      (result as Record<string, unknown>)[key] = sv;
    }
  }
  return result;
}

function applyQuestionPatch(
  q: Question,
  patch: QuestionPatch,
  subjectId: string,
): Question {
  const merged = deepMerge(q as unknown as Record<string, unknown>, patch as unknown as Record<string, unknown>) as unknown as Question;

  if (patch.image !== undefined) {
    merged.image = patch.image
      ? resolveImage(subjectId, patch.image)
      : undefined;
  }
  if (patch.explanationImage !== undefined) {
    merged.explanationImage = patch.explanationImage
      ? resolveImage(subjectId, patch.explanationImage)
      : undefined;
  }

  return merged;
}

function getPatches(subjectId: string): Patches {
  const modulePath = `./${subjectId}/patches.json`;
  return patchesModules[modulePath]?.default ?? {};
}

export const subjects: SubjectMeta[] = [];
for (const m of Object.values(metaModules)) {
  const s = m.meta;
  if (
    !(import.meta.env.PROD && __VERCEL_PRODUCTION__ && s.id === "_template")
  ) {
    subjects.push(s);
  }
}

export function getSubject(id: string): SubjectMeta | undefined {
  const base = subjects.find((s) => s.id === id);
  if (!base) return undefined;
  const patches = getPatches(id);
  if (!patches.meta) return base;
  return deepMerge(
    base as unknown as Record<string, unknown>,
    patches.meta as unknown as Record<string, unknown>,
  ) as unknown as SubjectMeta;
}

export async function getAllQuestions(subjectId: string): Promise<Question[]> {
  const modulePath = `./${subjectId}/questions.ts`;
  const mod = await questionsModules[modulePath]?.();
  const questions = mod?.questions ?? [];
  const patches = getPatches(subjectId);
  if (!patches.questions) return questions;
  return questions.map((q) => {
    const qPatch = patches.questions?.[q.id];
    return qPatch ? applyQuestionPatch(q, qPatch, subjectId) : q;
  });
}

export async function getQuestionsByTopic(
  subjectId: string,
  topic: string,
): Promise<Question[]> {
  const qs = await getAllQuestions(subjectId);
  return qs.filter((q) => q.topic === topic);
}

export async function getQuestionsByExam(
  subjectId: string,
  exam: string,
): Promise<Question[]> {
  const qs = await getAllQuestions(subjectId);
  return qs.filter((q) => q.exam === exam || q.exam === "both");
}

export async function getTopicMegaTopicLabel(
  subjectId: string,
  topicKey: string,
): Promise<string | undefined> {
  const subject = getSubject(subjectId);
  if (!subject?.megatopics) return undefined;
  return subject.megatopics.find((mt) => mt.topics.includes(topicKey))?.label;
}
