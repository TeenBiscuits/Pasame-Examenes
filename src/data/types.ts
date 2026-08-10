import type { Picture } from "vite-imagetools";

export type QuestionType =
  "mc" | "text" | "multiple-text" | "matching" | "fill" | "table-fill";

export interface FillStatement {
  label?: string;
  text: string;
}

export interface TextPart {
  /** Part label shown before the text, e.g. "a)". Defaults to a), b), c)... */
  label?: string;
  /** The subquestion statement. */
  text: string;
  /** Optional points awarded for this part. */
  points?: number;
  /** Optional worked-solution image shown inside this part's solution panel. */
  explanationImage?: Picture | string | (Picture | string)[];
}

export interface QuestionTable {
  headers: string[];
  rows: string[][];
}

export interface Question {
  id: string;
  /** The id of the single exam this question belongs to. */
  examId: string;
  topic: string;
  type: QuestionType;
  points: number;
  question: string;
  /** @deprecated Inline subquestions as markdown lists in `question` instead. */
  subquestions?: string[];
  options?: string[];
  correctAnswer: string | string[] | Record<string, string>;
  /** Sentences for `fill` questions. Use `{{blank}}` for each input. */
  fillStatements?: FillStatement[];
  /** Subquestions for `multiple-text` questions, one input per part. */
  textParts?: TextPart[];
  /** Table cells for `table-fill` questions. Use `{{blank}}` for each input. */
  tableFill?: QuestionTable;
  /** Optional worked solution shown in a collapsible panel for fill questions. */
  development?: string;
  /**
   * For mc/matching: an extra note shown in the solution panel.
   * @deprecated For text questions, use `correctAnswer` as the model solution instead.
   */
  explanation?: string;
  image?: Picture | string | (Picture | string)[];
  explanationImage?: Picture | string | (Picture | string)[];
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
  /** Slug used in URLs, PDF filenames and as `Question.examId`. */
  id: string;
  title: string;
  /**
   * Fraction of the total score required to pass (0-1).
   * Defaults to 0.5 (50%). The total is derived from the questions.
   */
  passPercentage?: number;
  durationMinutes: number;
  hasPdf?: boolean;
  /** Link to the original content source (e.g. a Daypo test). */
  originalUrl?: string;
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
  examId: string;
  mode: "practice" | "exam";
  topic?: string;
  date: string;
  score: number;
  maxScore: number;
  answers: Record<string, string>;
  timeSpent?: number;
}
