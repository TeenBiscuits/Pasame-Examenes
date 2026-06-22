import type { Question } from "../../data/types";

// To use images, create an assets/ folder and import them:
// import myImage from "./assets/figure.png";

export const questions: Question[] = [
  // ================================================================
  // Exam 2024
  // ================================================================

  // --- Topic 1 ---
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
    topic: "topic-1",
    type: "mc",
    points: 5,
    question: "Which data structure uses LIFO ordering?",
    subquestions: [
      "LIFO = Last In, First Out.",
      "Think about how `push()` and `pop()` work.",
    ],
    options: ["A. Queue", "B. Stack", "C. Heap", "D. Tree"],
    correctAnswer: "b",
    explanation:
      "A stack follows LIFO — the last element added is the first removed. Queues use FIFO.",
  },

  // --- Topic 2 ---
  {
    id: "2024_q4",
    exam: "2024",
    topic: "topic-2",
    type: "matching",
    points: 30,
    question: "Match each function to its runtime complexity:",
    correctAnswer: {
      "Bubble sort": "A",
      "Binary search": "B",
      "Merge sort": "C",
      "Hash lookup": "D",
    },
    explanation:
      "Bubble sort: O(n²) (A), Binary search: O(log n) (B), Merge sort: O(n log n) (C), Hash lookup: O(1) (D).",
  },

  // ================================================================
  // Exam January 2025
  // ================================================================

  // --- Topic 1 ---
  {
    id: "2025-01_q1",
    exam: "2025-01",
    topic: "topic-1",
    type: "calculation",
    points: 15,
    question:
      "Calculate the area of a circle with radius r = 5 cm. Use π ≈ 3.14.",
    correctAnswer: "Area = π × r² = 3.14 × 25 = 78.5 cm²",
    explanation:
      "The formula for the area of a circle is A = πr². Substitute r = 5: A = π × 5² = π × 25 ≈ 3.14 × 25 = 78.5 cm².",
  },
  {
    id: "2025-01_q2",
    exam: "2025-01",
    topic: "topic-1",
    type: "text",
    points: 15,
    question: `What does this code output, and why?

\`\`\`
def foo(x):
    if x <= 1:
        return 1
    return x * foo(x - 1)

print(foo(5))
\`\`\`

Hint: remember that \`foo()\` calls itself recursively.`,
    correctAnswer:
      "120. The function computes the factorial: 5 × 4 × 3 × 2 × 1 = 120.",
    explanation:
      "`foo()` is a recursive factorial function. Each call multiplies `x` by `foo(x - 1)` until `x` reaches 1 (the base case).",
  },
  {
    id: "2025-01_q3",
    exam: "2025-01",
    topic: "topic-1",
    type: "calculation",
    points: 10,
    question: "Calculate the mean and standard deviation for this dataset:",
    table: {
      headers: ["Value", "Frequency"],
      rows: [
        ["10", "3"],
        ["20", "5"],
        ["30", "2"],
      ],
    },
    correctAnswer:
      "Mean = (10×3 + 20×5 + 30×2) / 10 = 190/10 = 19. Variance = ((10-19)²×3 + (20-19)²×5 + (30-19)²×2) / 10 = (243 + 5 + 242) / 10 = 49. SD = √49 = 7.",
    explanation:
      "Weighted mean: multiply each value by its frequency, sum, divide by total. For SD: compute squared deviations, weight them, average, take square root.",
  },

  // --- Topic 2 ---
  {
    id: "2025-01_q4",
    exam: "2025-01",
    topic: "topic-2",
    type: "mc",
    points: 20,
    question: "Which of the following is a prime number?",
    subquestions: [
      "Consider numbers greater than 1.",
      "A prime number has exactly two divisors: `1` and itself.",
    ],
    options: ["A. 4", "B. 9", "C. 15", "D. 17", "E. 21"],
    correctAnswer: "d",
    explanation:
      "17 is prime because it is only divisible by 1 and itself. 4, 9, 15, and 21 are all composite.",
  },
  {
    id: "2025-01_q5",
    exam: "2025-01",
    topic: "topic-2",
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
  {
    id: "2025-01_q6",
    exam: "2025-01",
    topic: "topic-2",
    type: "matching",
    points: 10,
    question: "Match each data structure to its typical access pattern:",
    correctAnswer: {
      Array: "A",
      "Linked list": "B",
      "Hash map": "C",
      Stack: "D",
      Queue: "E",
    },
    explanation:
      "Array: O(1) random access (A). Linked list: O(n) sequential (B). Hash map: O(1) key lookup (C). Stack: LIFO (D). Queue: FIFO (E).",
  },

  // ================================================================
  // Shared question (appears in both exams)
  // ================================================================

  {
    id: "shared_q1",
    exam: "both",
    topic: "topic-1",
    type: "mc",
    points: 5,
    question: "What does `CPU` stand for?",
    options: [
      "A. Central Processing Unit",
      "B. Computer Personal Unit",
      "C. Central Program Utility",
      "D. Core Processing Unit",
    ],
    correctAnswer: "a",
    explanation:
      "CPU stands for Central Processing Unit — the main processor in a computer.",
  },

  // ================================================================
  // Image example (uncomment and add image to src/subjects/_template/assets/)
  // ================================================================
  //
  // {
  //   id: "2025-01_image",
  //   exam: "2025-01",
  //   topic: "topic-1",
  //   type: "text",
  //   points: 10,
  //   question: "Describe what the following diagram represents:",
  //   image: myImage,       // import from ./assets/
  //   imageWidth: 800,      // optional, native width in px
  //   imageHeight: 400,     // optional, native height in px
  //   correctAnswer: "The diagram shows...",
  //   explanation: "Key elements to identify: ...",
  // },
];
