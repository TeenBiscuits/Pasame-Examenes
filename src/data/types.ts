import type { Picture } from "vite-imagetools";

export type QuestionType = "mc" | "text" | "matching";

export interface QuestionTable {
  headers: string[];
  rows: string[][];
}

export interface Question {
  id: string;
  /** The single exam this question belongs to. */
  exam: string;
  topic: string;
  type: QuestionType;
  points: number;
  question: string;
  /** @deprecated Inline subquestions as markdown lists in `question` instead. */
  subquestions?: string[];
  options?: string[];
  correctAnswer: string | string[] | Record<string, string>;
  /**
   * For mc/matching: an extra note shown in the solution panel.
   * @deprecated For text questions, use `correctAnswer` as the model solution instead.
   */
  explanation?: string;
  image?: Picture | string;
  explanationImage?: Picture | string;
  /** @deprecated Use markdown pipe tables inside `question` instead. */
  table?: QuestionTable;
  repeated?: boolean;
}

export interface Topic {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export interface MegaTopic {
  key: string;
  label: string;
  topics: string[];
}

export type ContentPolicy = "authorized-exams" | "community-practice";

export interface ContentLicense {
  /** SPDX identifier, including LicenseRef-* for a custom license. */
  spdxId: string;
  name: string;
  url: string;
  notice?: string;
}

export interface Exam {
  year: string;
  title: string;
  date?: string;
  passPoints: number;
  totalPoints: number;
  durationMinutes: number;
  hasPdf?: boolean;
  daypoUrl?: string;
  deleteRights?: boolean;
}

export interface SubjectMeta {
  id: string;
  /** ISO date used by the sitemap for this subject and its child pages. */
  lastmod: string;
  name: string;
  degree: string;
  course: number;
  courseCode: string;
  icon: string;
  contentPolicy?: ContentPolicy;
  acknowledgments?: string;
  /** Omit to use the repository's default content license. */
  contentLicense?: ContentLicense;
  topics: Topic[];
  megatopics?: MegaTopic[];
  exams: Exam[];
}

export interface ExamAttempt {
  id: string;
  exam: string;
  mode: "practice" | "exam";
  topic?: string;
  date: string;
  score: number;
  maxScore: number;
  answers: Record<string, string>;
  timeSpent?: number;
}
