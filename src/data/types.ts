import type { Picture } from "vite-imagetools";

export type QuestionType = "mc" | "text" | "matching" | "calculation";

export interface QuestionTable {
  headers: string[];
  rows: string[][];
}

export interface Question {
  id: string;
  exam: string;
  topic: string;
  type: QuestionType;
  points: number;
  question: string;
  subquestions?: string[];
  options?: string[];
  correctAnswer?: string | string[] | Record<string, string>;
  explanation: string;
  image?: Picture | string;
  explanationImage?: Picture | string;
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

export interface Exam {
  year: string;
  title: string;
  date?: string;
  passPoints: number;
  totalPoints: number;
  durationMinutes: number;
  description: string;
  hasPdf?: boolean;
}

export interface SubjectMeta {
  id: string;
  name: string;
  university: string;
  courseCode: string;
  icon: string;
  acknowledgments?: string;
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
