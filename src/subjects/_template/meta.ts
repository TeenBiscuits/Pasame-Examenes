import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "template",
  name: "Template Subject",
  university: "Template University",
  courseCode: "TMP101",
  icon: "📝",
  topics: [{ key: "topic-1", label: "Topic 1", icon: "📌", color: "blue" }],
  exams: [
    {
      year: "2024",
      title: "2024 Exam Simulation",
      description: "Default exam simulation",
      passPoints: 50,
      totalPoints: 100,
      durationMinutes: 120,
    },
  ],
};
