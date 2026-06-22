import type { Question } from "../../data/types";

export const questions: Question[] = [
  {
    id: "2024_q1",
    exam: "2024",
    topic: "topic-1",
    type: "mc",
    points: 10,
    question: "What is the capital of France?",
    options: ["A. London", "B. Paris", "C. Berlin", "D. Madrid", "E. Rome"],
    correctAnswer: "b",
    explanation: "Paris is the capital and most populous city of France.",
  },
  {
    id: "2024_q2",
    exam: "2024",
    topic: "topic-1",
    type: "text",
    points: 20,
    question: "Explain the concept of supply and demand.",
    correctAnswer:
      "Supply and demand is an economic model that determines price in a market. The law of demand states that, all else being equal, as price increases, quantity demanded decreases. The law of supply states that as price increases, quantity supplied increases. The equilibrium price is where supply equals demand.",
    explanation:
      "Key points: define both laws, mention equilibrium, discuss market clearing.",
  },
  {
    id: "2024_q3",
    exam: "2024",
    topic: "topic-2",
    type: "matching",
    points: 30,
    question: "Match each language to its paradigm:",
    correctAnswer: {
      Python: "A",
      Haskell: "B",
      Java: "C",
      SQL: "D",
    },
    explanation:
      "Python: Multi-paradigm (A), Haskell: Functional (B), Java: Object-oriented (C), SQL: Declarative (D).",
  },
  {
    id: "2025-01_q1",
    exam: "2025-01",
    topic: "topic-1",
    type: "calculation",
    points: 15,
    question: "Calculate the area of a circle with radius r = 5 cm. Use π ≈ 3.14.",
    correctAnswer: "Area = π × r² = 3.14 × 25 = 78.5 cm²",
    explanation:
      "The formula for the area of a circle is A = πr². Substitute r = 5: A = π × 5² = π × 25 ≈ 3.14 × 25 = 78.5 cm².",
  },
  {
    id: "2025-01_q2",
    exam: "2025-01",
    topic: "topic-2",
    type: "mc",
    points: 20,
    question: "Which of the following is a prime number?",
    subquestions: [
      "Consider numbers greater than 1.",
      "A prime number has exactly two divisors.",
    ],
    options: ["A. 4", "B. 9", "C. 15", "D. 17", "E. 21"],
    correctAnswer: "d",
    explanation:
      "17 is prime because it is only divisible by 1 and itself. 4, 9, 15, and 21 are all composite.",
  },
  {
    id: "2025-01_q3",
    exam: "2025-01",
    topic: "topic-1",
    type: "text",
    points: 15,
    question: "Compare the following data:",
    table: {
      headers: ["Year", "Revenue", "Profit", "Employees"],
      rows: [
        ["2022", "$1.2M", "$200K", "15"],
        ["2023", "$1.8M", "$350K", "22"],
        ["2024", "$2.4M", "$500K", "30"],
      ],
    },
    correctAnswer:
      "Revenue grew 100% from 2022 to 2024. Profit grew 150% in the same period. Employee count doubled. The profit margin improved from 16.7% to 20.8%.",
    explanation:
      "Focus on trends: revenue, profit, and headcount all increased. Profit margin also improved, indicating operational efficiency gains.",
  },
];
