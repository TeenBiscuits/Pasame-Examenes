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
  correctAnswer: string | string[] | Record<string, string>;
  explanation: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  table?: QuestionTable;
}

export interface Topic {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export interface Exam {
  year: string;
  title: string;
  passPoints: number;
  totalPoints: number;
  durationMinutes: number;
  description: string;
}

export interface SubjectMeta {
  id: string;
  name: string;
  university: string;
  courseCode: string;
  icon: string;
  topics: Topic[];
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
