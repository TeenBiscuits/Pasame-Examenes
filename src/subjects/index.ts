import type { SubjectMeta, Question } from "../data/types";
import { meta as bede } from "./bede/meta";
import { questions as bedeQuestions } from "./bede/questions";
import { meta as cepe } from "./cepe/meta";
import { questions as cepeQuestions } from "./cepe/questions";
import { meta as deese } from "./deese/meta";
import { questions as deeseQuestions } from "./deese/questions";
import { meta as ece } from "./ece/meta";
import { questions as eceQuestions } from "./ece/questions";
import { meta as emeele } from "./emeele/meta";
import { questions as emeeleQuestions } from "./emeele/questions";
import { meta as equisi } from "./equisi/meta";
import { questions as equisiQuestions } from "./equisi/questions";
import { meta as equispe } from "./equispe/meta";
import { questions as equispeQuestions } from "./equispe/questions";
import { meta as esei } from "./esei/meta";
import { questions as eseiQuestions } from "./esei/questions";
import { meta as eseo } from "./eseo/meta";
import { questions as eseoQuestions } from "./eseo/questions";
import { meta as iesede } from "./iesede/meta";
import { questions as iesedeQuestions } from "./iesede/questions";
import { meta as pei } from "./pei/meta";
import { questions as peiQuestions } from "./pei/questions";
import { meta as peese } from "./peese/meta";
import { questions as peeseQuestions } from "./peese/questions";
import { meta as redes } from "./redes/meta";
import { questions as redesQuestions } from "./redes/questions";

export const subjects: SubjectMeta[] = [
  bede,
  cepe,
  deese,
  ece,
  emeele,
  equisi,
  equispe,
  esei,
  eseo,
  iesede,
  pei,
  peese,
  redes,
];

const questionsBySubject: Record<string, Question[]> = {
  bede: bedeQuestions,
  cepe: cepeQuestions,
  deese: deeseQuestions,
  ece: eceQuestions,
  emeele: emeeleQuestions,
  equisi: equisiQuestions,
  equispe: equispeQuestions,
  esei: eseiQuestions,
  eseo: eseoQuestions,
  iesede: iesedeQuestions,
  pei: peiQuestions,
  peese: peeseQuestions,
  redes: redesQuestions,
};

export function getSubject(id: string): SubjectMeta | undefined {
  return subjects.find((s) => s.id === id);
}

export async function getAllQuestions(subjectId: string): Promise<Question[]> {
  return questionsBySubject[subjectId] ?? [];
}

export function getQuestionCount(subjectId: string): number {
  return questionsBySubject[subjectId]?.length ?? 0;
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

// Reachability marker: makes _visibility.ts discoverable by static analysis
// tools so they see every subject's named exports as consumed.
import("./_visibility");
