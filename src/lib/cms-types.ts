import type { QuestionType, QuestionTable } from "../data/types";

export interface QuestionPatch {
  exam?: string;
  topic?: string;
  type?: QuestionType;
  points?: number;
  question?: string;
  subquestions?: string[] | null;
  options?: string[] | null;
  correctAnswer?:
    | string
    | string[]
    | Record<string, string>
    | null;
  explanation?: string | null;
  image?: string | null;
  explanationImage?: string | null;
  table?: QuestionTable | null;
  repeated?: boolean;
}

export interface ExamPatch {
  title?: string;
  date?: string | null;
  passPoints?: number;
  totalPoints?: number;
  durationMinutes?: number;
  description?: string;
  hasPdf?: boolean;
}

export interface TopicPatch {
  label?: string;
  icon?: string;
  color?: string;
}

export interface MetaPatch {
  name?: string;
  university?: string;
  courseCode?: string;
  icon?: string;
  acknowledgments?: string | null;
  topics?: Record<string, TopicPatch>;
  exams?: Record<string, ExamPatch>;
}

export interface Patches {
  meta?: MetaPatch;
  questions?: Record<string, QuestionPatch>;
}
