import type { Question } from "../../data/types";
import type { Picture } from "vite-imagetools";
import { getImage } from "../../lib/image";
import type { ImageMap } from "../../lib/image";

// Load and optimize all images in ./assets/ automatically.
// Just drop image files into assets/ and reference them by filename.
const imageMap = import.meta.glob<{ default: Picture }>(
  "./assets/*.{png,jpeg,jpg,svg}",
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
    examId: "2024",
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
    examId: "2024",
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
    examId: "2024",
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
    examId: "2024",
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
    examId: "2025-01",
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
    examId: "2025-01",
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
    examId: "2025-01",
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
    examId: "2025-01",
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
    examId: "2025-01",
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
    examId: "2025-01",
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
  // Repeated question example
  // ================================================================

  // === Shared MC with `repeated: true` ===
  // Assign the question to its actual exam and use `repeated: true` only as
  // the visual marker that it also appeared in an earlier exam.
  {
    id: "shared_q1",
    examId: "2024",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
    examId: "syntax-highlighting",
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
  // Code rendering exam
  // This exam intentionally exercises every grammar registered in
  // src/lib/markdown.tsx, plus a plain fenced block and inline code.
  // ================================================================

  {
    id: "code-rendering_q1",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `What does this JavaScript program print?

\`\`\`javascript
const values = [2, 4, 6];
const doubled = values.map((value) => value * 2);
console.log(doubled.join(", "));
\`\`\``,
    correctAnswer:
      "It prints `4, 8, 12`. The `map()` callback creates a new array.",
  },
  {
    id: "code-rendering_q2",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `Which type does the function return?

\`\`\`typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}
\`\`\``,
    correctAnswer:
      "It returns `T | undefined`: the first element has type `T`, but an empty array has no first element.",
  },
  {
    id: "code-rendering_q3",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `What list is produced by this Python expression?

\`\`\`python
words = ["red", "blue", "green"]
long_words = [word.upper() for word in words if len(word) > 3]
print(long_words)
\`\`\``,
    correctAnswer:
      "It produces `['BLUE', 'GREEN']`; `red` is filtered out because its length is not greater than 3.",
  },
  {
    id: "code-rendering_q4",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `What value is printed by this Java stream?

\`\`\`java
var numbers = java.util.List.of(1, 2, 3, 4);
var result = numbers.stream()
    .filter(number -> number % 2 == 0)
    .mapToInt(Integer::intValue)
    .sum();
System.out.println(result);
\`\`\``,
    correctAnswer:
      "It prints `6`: the even values are 2 and 4, whose sum is 6.",
  },
  {
    id: "code-rendering_q5",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `What does the pointer modify in this C program?

\`\`\`c
int value = 10;
int *pointer = &value;
*pointer = *pointer + 5;
printf("%d\\n", value);
\`\`\``,
    correctAnswer:
      "The pointer writes through the address of `value`, so the program prints `15`.",
  },
  {
    id: "code-rendering_q6",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `How many elements remain in this C++ vector?

\`\`\`cpp
std::vector<int> values{1, 2, 3, 4};
values.erase(values.begin() + 1);
std::cout << values.size();
\`\`\``,
    correctAnswer:
      "Three elements remain because `erase` removes the element at index 1, the value `2`.",
  },
  {
    id: "code-rendering_q7",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `What does this Go program print?

\`\`\`go
package main

import "fmt"

func main() {
  values := []int{3, 5, 7}
  fmt.Println(values[len(values)-1])
}
\`\`\``,
    correctAnswer: "It prints `7`, the element at the last valid slice index.",
  },
  {
    id: "code-rendering_q8",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `What does the \`?\` operator do here?

\`\`\`rust
fn read_count(input: &str) -> Result<usize, std::num::ParseIntError> {
    let count = input.parse::<usize>()?;
    Ok(count)
}
\`\`\``,
    correctAnswer:
      "It propagates a parsing error immediately; otherwise it unwraps the successful `usize` value.",
  },
  {
    id: "code-rendering_q9",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `Which departments can appear in the result?

\`\`\`sql
SELECT department, COUNT(*) AS total
FROM employees
WHERE active = TRUE
GROUP BY department
HAVING COUNT(*) >= 3
ORDER BY total DESC;
\`\`\``,
    correctAnswer:
      "Only departments with at least three active employees appear, ordered from the largest count to the smallest.",
  },
  {
    id: "code-rendering_q10",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `What fallback value does this Bash script use?

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
port="\${1:-8080}"
printf 'Listening on %s\\n' "$port"
\`\`\``,
    correctAnswer:
      "The parameter expansion uses `8080` when the first argument is missing or empty.",
  },
  {
    id: "code-rendering_q11",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `What semantic element and layout are used here?

\`\`\`markup
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
}
\`\`\``,
    correctAnswer:
      "The `article` is semantic, and the CSS gives the card a grid layout, gap, and padding.",
  },
  {
    id: "code-rendering_q12",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `Which property contains an array?

\`\`\`json
{
  "name": "Template Subject",
  "published": true,
  "languages": ["en", "es", "gl"],
  "questionCount": 42
}
\`\`\``,
    correctAnswer:
      "The `languages` property contains an array of three strings.",
  },
  {
    id: "code-rendering_q13",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "text",
    points: 5,
    question: `This fenced block has no language annotation. It should still render as readable code:

\`\`\`
const fallback = "plain text";
console.log(fallback);
\`\`\``,
    correctAnswer:
      "The block uses the inline-code fallback because no language was specified.",
  },
  {
    id: "code-rendering_q14",
    examId: "code-rendering",
    topic: "syntax-highlighting",
    type: "mc",
    points: 5,
    question:
      "Which detail makes a fenced block use a registered syntax grammar?",
    options: [
      "A. Adding a language name after the opening fence",
      "B. Wrapping the code in a table",
      "C. Using only inline code",
      "D. Adding a mathematical formula",
    ],
    correctAnswer: "a",
    explanation:
      "A fence such as ` ```typescript ` supplies the `language-typescript` class used by the renderer.",
  },

  // ================================================================
  // Markdown coverage exam
  // ================================================================

  {
    id: "markdown-complete_q1",
    examId: "markdown-complete",
    topic: "markdown-complete",
    type: "text",
    points: 20,
    question: `# Markdown field guide

This paragraph contains **strong text**, *emphasis*, ~~deletion~~, \`inline code\`, and a [link to the project](https://github.com/).

> Blockquotes should keep their visual hierarchy and can contain **inline formatting**.

1. Ordered item
2. Another ordered item
   1. Nested item

- Unordered item
- [x] Completed task
- [ ] Pending task

---

| Alignment | Example |
| :--- | ---: |
| Left | 10 |
| Right | 20 |

The formula is $f(x) = x^2 + 1$ and the display version is:

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

Here is a footnote reference.[^fixture]

[^fixture]: Footnotes are part of the GFM fixture too.

\`\`\`typescript
const rendered = true;
\`\`\``,
    correctAnswer: `The renderer should preserve the heading, paragraph styles, emphasis, deletion, inline code, link, blockquote, both list types, task-list states, horizontal rule, aligned table, inline and block math, footnote, and the typed code block.

The inline expression is $f(x) = x^2 + 1$; the sum formula uses $n(n+1)/2$.`,
  },
  {
    id: "markdown-complete_q2",
    examId: "markdown-complete",
    topic: "markdown-complete",
    type: "mc",
    points: 10,
    question: `Which option includes every inline style being tested?

- Bold: **important**
- Italic: *context*
- Strike: ~~removed~~
- Code: \`value\``,
    options: [
      "A. **bold**, *italic*, ~~strike~~, and `code`",
      "B. Only a heading and a table",
      "C. A code block without a language",
      "D. A mathematical display only",
    ],
    correctAnswer: "a",
    explanation:
      "The first option contains the four inline constructs listed in the prompt.",
  },
  {
    id: "markdown-complete_q3",
    examId: "markdown-complete",
    topic: "markdown-complete",
    type: "matching",
    points: 10,
    question: `Match each Markdown construct with the fixture that demonstrates it:

> The answer panel should render this instruction as a blockquote.`,
    correctAnswer: {
      Heading: "A",
      "Task list": "B",
      Table: "C",
      "Block math": "D",
      "Fenced code": "E",
    },
    explanation: `| Construct | Fixture |
| --- | --- |
| Heading | A |
| Task list | B |
| Table | C |
| Block math | D |
| Fenced code | E |`,
  },
  {
    id: "markdown-complete_q4",
    examId: "markdown-complete",
    topic: "markdown-complete",
    type: "text",
    points: 10,
    question: `Read this table and calculate the total:

| Sprint | Done | Blocked |
| --- | ---: | ---: |
| One | 8 | 2 |
| Two | 11 | 1 |
| Three | 9 | 0 |`,
    correctAnswer: `The total completed work is **28**: $8 + 11 + 9 = 28$.

The total blocked work is **3**: $2 + 1 + 0 = 3$.`,
  },
  {
    id: "markdown-complete_q5",
    examId: "markdown-complete",
    topic: "markdown-complete",
    type: "text",
    points: 10,
    question: `Write a short model answer using a heading, a quote, a list, inline \`code\`, and a link.

The answer is intentionally self-referential so the solution panel can be inspected too.`,
    correctAnswer: `## Model answer

> A concise answer can still be structured.

- Start with the conclusion.
- Support it with \`evidence\`.

Read more at [the Markdown guide](https://commonmark.org/help/).`,
  },

  // ================================================================
  // Long-form Lorem ipsum exam
  // ================================================================

  {
    id: "lorem-ipsum_q1",
    examId: "lorem-ipsum",
    topic: "lorem-ipsum",
    type: "text",
    points: 20,
    question: `# De litteris et ordine

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer at lacus vitae arcu facilisis tincidunt. Praesent finibus, sapien at posuere commodo, neque justo vestibulum nibh, vitae tempus massa eros sit amet erat. Curabitur consequat, justo non dignissim maximus, nisl arcu fermentum nibh, vitae feugiat massa nunc at libero.

Suspendisse potenti. Donec vulputate, magna ac bibendum interdum, justo turpis consequat mauris, non efficitur lectus augue sed nibh. Aenean vel ligula id neque blandit consectetur. Nunc sed sem in lorem luctus porttitor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

## A second paragraph

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed id purus at erat bibendum faucibus. Mauris sit amet ligula at erat placerat elementum. Aliquam erat volutpat. Quisque finibus, velit non faucibus maximus, erat mi tincidunt lacus, a porta urna justo non mauris.

The passage uses **bold emphasis**, *italic emphasis*, and a deliberately long line to test wrapping on narrow screens. It also includes a table:

| Section | Words | Status |
| --- | ---: | --- |
| Opening | 54 | Ready |
| Middle | 48 | Ready |
| Closing | 42 | Review |

Explain the organization and identify the section that still needs review.`,
    correctAnswer: `The text has a title, two prose sections, inline emphasis, and a summary table. The opening and middle sections are marked **Ready**, while the closing section is marked **Review**.

The exact word counts are less important than identifying the document hierarchy and reading the table correctly.`,
  },
  {
    id: "lorem-ipsum_q2",
    examId: "lorem-ipsum",
    topic: "lorem-ipsum",
    type: "mc",
    points: 10,
    question: `Which statement best describes the long passage above?

It is intentionally verbose so the interface can be checked with **realistic line wrapping** and multiple paragraphs.`,
    options: [
      "A. It contains only a single short sentence",
      "B. It combines headings, long paragraphs, emphasis, and a table",
      "C. It is a fenced code block",
      "D. It contains no Markdown structure",
    ],
    correctAnswer: "b",
    explanation:
      "The passage is a long-form Markdown fixture containing several block-level elements.",
  },
  {
    id: "lorem-ipsum_q3",
    examId: "lorem-ipsum",
    topic: "lorem-ipsum",
    type: "matching",
    points: 10,
    question: "Match each section with the status shown in the table:",
    correctAnswer: {
      Opening: "A",
      Middle: "B",
      Closing: "C",
    },
    explanation: `| Section | Status |
| --- | --- |
| Opening | A. Ready |
| Middle | B. Ready |
| Closing | C. Review |`,
  },

  // ================================================================
  // Image and solution rendering exam
  // ================================================================

  {
    id: "visual-assets_q1",
    examId: "visual-assets",
    topic: "visual-assets",
    type: "text",
    points: 20,
    question: `Describe the flow shown in the diagram. Mention the three inputs, the processing step, and both outputs.`,
    image: getImage(imageMap, "template-diagram.svg"),
    correctAnswer: `The diagram shows **Input A**, **Input B**, and **Input C** flowing into a central **Process** node labelled \`render + grade\`. That node produces an **Answer** solution panel and **Feedback** practice result.

The arrows show a left-to-right data flow.`,
    explanationImage: getImage(imageMap, "template-solution.svg"),
  },
  {
    id: "visual-assets_q2",
    examId: "visual-assets",
    topic: "visual-assets",
    type: "mc",
    points: 15,
    question: "Which stage is represented by the central yellow node?",
    image: getImage(imageMap, "template-diagram.svg"),
    options: [
      "A. Input collection",
      "B. Rendering and grading",
      "C. PDF download",
      "D. Language selection",
    ],
    correctAnswer: "b",
    explanation:
      "The center node is labelled `Process` and its subtitle is `render + grade`.",
    explanationImage: getImage(imageMap, "template-solution.svg"),
  },
  {
    id: "visual-assets_q3",
    examId: "visual-assets",
    topic: "visual-assets",
    type: "matching",
    points: 15,
    question: `Use the second image as a visual reference and match each checklist step with its letter:

The solution image should appear after opening the explanation.`,
    image: getImage(imageMap, "template-solution.svg"),
    correctAnswer: {
      "Identify the inputs": "A",
      "Apply the transformation": "B",
      "Check the intermediate result": "C",
      "State the final answer": "D",
    },
    explanation: `| Step | Letter |
| --- | --- |
| Identify the inputs | A |
| Apply the transformation | B |
| Check the intermediate result | C |
| State the final answer | D |`,
    explanationImage: getImage(imageMap, "template-diagram.svg"),
  },

  // ================================================================
  // Question type and solution-panel fixtures
  // ================================================================

  {
    id: "question-types_q1",
    examId: "question-types",
    topic: "question-types",
    type: "mc",
    points: 10,
    question:
      "Which question type is automatically graded from a letter answer?",
    options: [
      "A. Multiple choice",
      "B. Free text only",
      "C. Image upload",
      "D. Essay review",
    ],
    correctAnswer: "a",
    explanation:
      "Multiple-choice questions store a lowercase answer letter such as `a` or `b`.",
  },
  {
    id: "question-types_q2",
    examId: "question-types",
    topic: "question-types",
    type: "text",
    points: 10,
    question:
      "Explain when a text question should use `correctAnswer` instead of `explanation`.",
    correctAnswer:
      "The `correctAnswer` field is the model solution shown for a text question. The `explanation` field is reserved for extra solution notes on multiple-choice and matching questions.",
  },
  {
    id: "question-types_q3",
    examId: "question-types",
    topic: "question-types",
    type: "matching",
    points: 10,
    question: "Match each question type with its answer representation:",
    correctAnswer: {
      mc: "A",
      text: "B",
      matching: "C",
    },
    explanation: `| Type | Representation |
| --- | --- |
| mc | A. Lowercase letter |
| text | B. Model solution text |
| matching | C. Record of pairs |`,
  },
  // === Fill in the blanks ===
  // Use one `{{blank}}` per input. Answers are stored in statement order.
  // `development` is optional and appears in a collapsible panel after checking.
  {
    id: "question-types_q4",
    examId: "question-types",
    topic: "question-types",
    type: "fill",
    points: 5,
    question: "Complete the calculation:",
    fillStatements: [
      { label: "a)", text: "$2 + 2 =$ {{blank}}" },
      { label: "b)", text: "$3 \\times 4 =$ {{blank}}" },
    ],
    correctAnswer: ["4", "12"],
    development: `$$
2 + 2 = 4
$$

$$
3 \\times 4 = 12
$$`,
  },
  // === Fill in a table ===
  // Table answers follow row order, then column order, considering only blanks.
  {
    id: "question-types_q5",
    examId: "question-types",
    topic: "question-types",
    type: "table-fill",
    points: 5,
    question: "Complete the results in the table:",
    tableFill: {
      headers: ["Expression", "Result"],
      rows: [
        ["$5 + 3$", "{{blank}}"],
        ["$6 \\times 2$", "{{blank}}"],
      ],
    },
    correctAnswer: ["8", "12"],
    development: `$$
5 + 3 = 8
$$

$$
6 \\times 2 = 12
$$`,
  },
];

void questions;
