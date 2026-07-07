import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "_template",
  name: "Template Subject",
  university: "Template University",
  courseCode: "TMP101",
  icon: "📝",
  contentPolicy: "community-practice",
  acknowledgments:
    "Questions provided by the Template Department. Answers by Prof. Example.",
  topics: [
    { key: "topic-1", label: "Topic 1", icon: "📌", color: "blue" },
    { key: "topic-2", label: "Topic 2", icon: "🔍", color: "green" },
  ],
  megatopics: [
    {
      key: "group-a",
      label: "Group A",
      topics: ["topic-1"],
    },
    {
      key: "group-b",
      label: "Group B",
      topics: ["topic-2"],
    },
  ],
  exams: [
    {
      year: "2024",
      title: "2024 Exam",
      date: "2024",
      description: "70 points · 5 questions",
      passPoints: 35,
      totalPoints: 70,
      durationMinutes: 120,
    },
    {
      year: "2025-01",
      title: "January 2025",
      date: "January 2025",
      description: "90 points · 7 questions",
      passPoints: 45,
      totalPoints: 90,
      durationMinutes: 150,
      hasPdf: false,
    },
    {
      year: "2023",
      title: "2023 Exam",
      date: "2023",
      description: "Removed for copyright reasons",
      passPoints: 0,
      totalPoints: 0,
      durationMinutes: 0,
      hasPdf: false,
      deleteRights: true,
    },
  ],
};

void meta;
