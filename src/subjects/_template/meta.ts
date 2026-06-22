import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "template",
  name: "Template Subject",
  university: "Template University",
  courseCode: "TMP101",
  icon: "📝",
  acknowledgments:
    "Questions provided by the Template Department. Answers by Prof. Example.",
  topics: [
    { key: "topic-1", label: "Topic 1", icon: "📌", color: "blue" },
    { key: "topic-2", label: "Topic 2", icon: "🔍", color: "green" },
  ],
  exams: [
    {
      year: "2024",
      title: "2024 Exam",
      description: "60 points · 3 questions",
      passPoints: 30,
      totalPoints: 60,
      durationMinutes: 120,
    },
    {
      year: "2025-01",
      title: "January 2025",
      description: "50 points · 3 questions",
      passPoints: 25,
      totalPoints: 50,
      durationMinutes: 90,
      hasPdf: false,
    },
  ],
};
