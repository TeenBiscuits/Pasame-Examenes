import type { Question } from "../../data/types";
import type { Picture } from "vite-imagetools";
import { getImage } from "../../lib/image";
import type { ImageMap } from "../../lib/image";

// Load and optimize all images in ./assets/ automatically.
// Just drop image files into assets/ and reference them by filename.
const imageMap = import.meta.glob<{ default: Picture }>(
  "./assets/*.{png,jpeg,jpg}",
  {
    query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" },
    eager: true,
  },
) as ImageMap;

void imageMap;
void getImage;

export const questions: Question[] = [
  // ================================================================
  // Exam 2024
  // ================================================================

  // --- Topic 1 ---

  // === Multiple choice (minimal) ===
  // explanation is optional for mc — omit it and no "Open Solution" button is shown.
  {
    id: "2024_q1",
    exam: "2024",
    topic: "topic-1",
    type: "mc",
    points: 10,
    question: "What is the capital of France?",
    options: ["A. London", "B. Paris", "C. Berlin", "D. Madrid", "E. Rome"],
    correctAnswer: "b",
  },

  // === Text question (deprecated explanation) ===
  // For text questions, the model solution goes in `correctAnswer`.
  // The `explanation` field is **deprecated for text** — merge any extra
  // guidance into `correctAnswer` itself.
  {
    id: "2024_q2",
    exam: "2024",
    topic: "topic-1",
    type: "text",
    points: 20,
    question: "Explain the concept of supply and demand.",
    correctAnswer: `Supply and demand is an economic model that determines price in a market.

- **Law of demand**: as price increases, quantity demanded decreases.
- **Law of supply**: as price increases, quantity supplied increases.
- **Equilibrium**: the price where supply equals demand.

Key points to mention: define both laws, explain equilibrium, discuss market clearing.`,
  },

  // === Multiple choice with explanation ===
  // explanation IS valid for mc/matching — shown in the "Open Solution" panel.
  {
    id: "2024_q3",
    exam: "2024",
    topic: "topic-1",
    type: "mc",
    points: 5,
    question: `Which data structure uses LIFO ordering?

- LIFO means **L**ast **I**n, **F**irst **O**ut.
- Think about how \`push()\` and \`pop()\` work.`,
    options: ["A. Queue", "B. Stack", "C. Heap", "D. Tree"],
    correctAnswer: "b",
    explanation:
      "A stack follows LIFO — the last element added is the first removed. Queues use FIFO.",
  },

  // --- Topic 2 ---

  // === Matching (minimal) ===
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
  },

  // ================================================================
  // Exam January 2025
  // ================================================================

  // --- Topic 1 ---

  // === Text question with math (KaTeX) ===
  // Use $...$ for inline math and $$...$$ for display/block math.
  {
    id: "2025-01_q1",
    exam: "2025-01",
    topic: "topic-1",
    type: "text",
    points: 15,
    question: `Calculate the area of a circle with radius $r = 5\\ \\text{cm}$. Use $\\pi \\approx 3.14$.

The formula for the area of a circle is:

$$A = \\pi r^2$$`,
    correctAnswer: `$A = \\pi \\times r^2 = 3.14 \\times 25 = 78.5\\ \\text{cm}^2$

Substitute $r = 5$: $A = \\pi \\times 5^2 = \\pi \\times 25 \\approx 3.14 \\times 25 = 78.5\\ \\text{cm}^2$.`,
  },

  // === Text question with syntax-highlighted code block ===
  // The language annotation on fenced code blocks triggers syntax highlighting.
  {
    id: "2025-01_q2",
    exam: "2025-01",
    topic: "topic-1",
    type: "text",
    points: 15,
    question: `What does this code output, and why?

\`\`\`python
def foo(x):
    if x <= 1:
        return 1
    return x * foo(x - 1)

print(foo(5))
\`\`\`

Hint: remember that \`foo()\` calls itself recursively.`,
    correctAnswer: `The output is **120**.

The function \`foo()\` is a recursive factorial: each call multiplies $x$ by \`foo(x - 1)\` until $x$ reaches $1$ (the base case).

Calculation: $5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$.`,
  },

  // === Text question with inline markdown table ===
  // Use GFM pipe tables instead of the deprecated `table` field.
  {
    id: "2025-01_q3",
    exam: "2025-01",
    topic: "topic-1",
    type: "text",
    points: 10,
    question: `Calculate the mean and standard deviation for this dataset:

| Value | Frequency |
|-------|-----------|
| 10    | 3         |
| 20    | 5         |
| 30    | 2         |`,
    correctAnswer: `**Mean** = $(10 \\times 3 + 20 \\times 5 + 30 \\times 2) / 10 = 190 / 10 = 19$.

**Variance** = $((10-19)^2 \\times 3 + (20-19)^2 \\times 5 + (30-19)^2 \\times 2) / 10 = (243 + 5 + 242) / 10 = 49$.

**Standard deviation** = $\\sqrt{49} = 7$.

Weighted mean: multiply each value by its frequency, sum, divide by total. For SD: compute squared deviations, weight them, average, take square root.`,
  },

  // --- Topic 2 ---

  // === Multiple choice with rich text ===
  // Bold (**), italic (*), inline code (`), and strikethrough (~~) all work.
  {
    id: "2025-01_q4",
    exam: "2025-01",
    topic: "topic-2",
    type: "mc",
    points: 20,
    question: `Which of the following is a **prime number**?

- Consider numbers greater than $1$.
- A prime number has exactly *two* divisors: \`1\` and itself.
- ~~4~~, ~~9~~, ~~15~~, and ~~21~~ are all composite.`,
    options: ["A. 4", "B. 9", "C. 15", "D. 17", "E. 21"],
    correctAnswer: "d",
    explanation:
      "17 is prime because it is only divisible by 1 and itself. 4, 9, 15, and 21 are all composite.",
  },

  // === Text question with table ===
  // Another example of inline markdown tables replacing the deprecated `table` field.
  {
    id: "2025-01_q5",
    exam: "2025-01",
    topic: "topic-2",
    type: "text",
    points: 15,
    question: `Compare the following data:

| Year | Revenue | Profit | Employees |
|------|---------|--------|-----------|
| 2022 | $1.2M   | $200K  | 15        |
| 2023 | $1.8M   | $350K  | 22        |
| 2024 | $2.4M   | $500K  | 30        |`,
    correctAnswer: `Revenue grew **100%** from 2022 to 2024. Profit grew **150%** in the same period. Employee count doubled.

The profit margin improved from $16.7\\%$ to $20.8\\%$, indicating operational efficiency gains.`,
  },

  // === Matching with explanation ===
  // explanation is valid for matching — shown in the "Open Solution" panel.
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
    explanation: `| Structure | Access | Complexity |
|-----------|--------|------------|
| Array | Random access (A) | $O(1)$ |
| Linked list | Sequential (B) | $O(n)$ |
| Hash map | Key lookup (C) | $O(1)$ |
| Stack | LIFO (D) | |
| Queue | FIFO (E) | |`,
  },

  // ================================================================
  // Shared question (appears in both exams)
  // ================================================================

  // === Shared MC with `repeated: true` ===
  // Set `exam: "both"` and `repeated: true` to tag repeated questions.
  {
    id: "shared_q1",
    exam: "both",
    topic: "topic-1",
    type: "mc",
    points: 5,
    repeated: true,
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
  // Syntax highlighting fixtures (practice only)
  // ================================================================

  {
    id: "syntax_javascript",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `What value does this JavaScript expression return?

\`\`\`javascript
const scores = [8, 9, 10];
const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

console.log(average);
\`\`\``,
    correctAnswer: "It prints `9`.",
  },
  {
    id: "syntax_typescript",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `Which TypeScript feature makes the function parameter type-safe?

\`\`\`typescript
interface User {
  id: number;
  name: string;
}

function label(user: User): string {
  return user.id + ": " + user.name;
}
\`\`\``,
    correctAnswer:
      "The `User` interface defines the required shape, and the parameter annotation applies it to `user`.",
  },
  {
    id: "syntax_python",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `What list does this Python comprehension create?

\`\`\`python
even_squares = [number ** 2 for number in range(6) if number % 2 == 0]
print(even_squares)
\`\`\``,
    correctAnswer: "It creates `[0, 4, 16]`.",
  },
  {
    id: "syntax_java",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `What modern Java construct stores the two values?

\`\`\`java
record Point(int x, int y) {}

var point = new Point(3, 4);
System.out.println(point.x() + point.y());
\`\`\``,
    correctAnswer:
      "A `record` stores the values and generates accessors; the code prints `7`.",
  },
  {
    id: "syntax_c",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `What does the pointer change in this C program?

\`\`\`c
#include <stdio.h>

int main(void) {
    int value = 5;
    int *pointer = &value;
    *pointer += 2;
    printf("%d\\n", value);
    return 0;
}
\`\`\``,
    correctAnswer:
      "It changes `value` through its address, so the program prints `7`.",
  },
  {
    id: "syntax_cpp",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `How many elements does this C++ vector contain?

\`\`\`cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> values{2, 4, 6};
    values.push_back(8);
    std::cout << values.size() << '\\n';
}
\`\`\``,
    correctAnswer: "It contains four elements, so the program prints `4`.",
  },
  {
    id: "syntax_go",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `Which Go feature transfers the computed value?

\`\`\`go
package main

import "fmt"

func main() {
    results := make(chan int)
    go func() { results <- 6 * 7 }()
    fmt.Println(<-results)
}
\`\`\``,
    correctAnswer:
      "A channel transfers the value from the goroutine; the program prints `42`.",
  },
  {
    id: "syntax_rust",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `What does the question-mark operator do in this Rust function?

\`\`\`rust
fn parse_port(value: &str) -> Result<u16, std::num::ParseIntError> {
    let port = value.parse::<u16>()?;
    Ok(port)
}
\`\`\``,
    correctAnswer:
      "The `?` returns the parsing error early or unwraps the successful `u16` value.",
  },
  {
    id: "syntax_sql",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `Which rows does this SQL query return?

\`\`\`sql
SELECT department, AVG(salary) AS average_salary
FROM employees
WHERE active = TRUE
GROUP BY department
HAVING COUNT(*) >= 5
ORDER BY average_salary DESC;
\`\`\``,
    correctAnswer:
      "It returns departments with at least five active employees, ordered by descending average salary.",
  },
  {
    id: "syntax_bash",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `What fallback does this Bash script use?

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

name="\${1:-world}"
printf 'Hello, %s!\\n' "$name"
\`\`\``,
    correctAnswer:
      "The parameter expansion uses `world` when the first positional argument is missing or empty.",
  },
  {
    id: "syntax_html_css",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `How do the HTML and CSS work together in this card?

\`\`\`html
<article class="card">
  <h2>Build status</h2>
  <p>All checks passed.</p>
</article>
\`\`\`

\`\`\`css
.card {
  display: grid;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid currentColor;
}
\`\`\``,
    correctAnswer:
      "The semantic `article` receives a grid layout, spacing, padding, and a color-aware border through the `card` class.",
  },
  {
    id: "syntax_json",
    exam: "syntax-highlighting",
    topic: "syntax-highlighting",
    type: "text",
    points: 1,
    question: `Which JSON property contains an array?

\`\`\`json
{
  "name": "Template Subject",
  "published": true,
  "languages": ["en", "es", "gl"],
  "questionCount": 12
}
\`\`\``,
    correctAnswer:
      "The `languages` property contains an array of three strings.",
  },

  // ================================================================
  // Image + explanationImage examples
  // To use: add images to src/subjects/_template/assets/ and uncomment.
  // ================================================================
  //
  // --- Question with an image ---
  // {
  //   id: "2025-01_image",
  //   exam: "2025-01",
  //   topic: "topic-1",
  //   type: "text",
  //   points: 10,
  //   question: "Describe what the following diagram represents:",
  //   image: getImage(imageMap, "figure.png"),
  //   correctAnswer: "The diagram shows...",
  // },
  //
  // --- MC with explanationImage ---
  // {
  //   id: "2025-01_expimg",
  //   exam: "2025-01",
  //   topic: "topic-2",
  //   type: "mc",
  //   points: 10,
  //   question: "Which of these best describes the diagram below?",
  //   image: getImage(imageMap, "diagram.png"),
  //   options: ["A. Option one", "B. Option two", "C. Option three"],
  //   correctAnswer: "b",
  //   explanation: "Option two is correct because...",
  //   explanationImage: getImage(imageMap, "solution.png"),
  // },
];

void questions;
