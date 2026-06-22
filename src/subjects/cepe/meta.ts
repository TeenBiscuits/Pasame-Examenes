import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "cepe",
  name: "Concorrencia e Paralelismo",
  university: "Universidade da Coruña",
  courseCode: "202320",
  icon: "⚡",
  acknowledgments:
    "Exams provided by the Computer Science Department, Universidade da Coruña.",
  topics: [
    {
      key: "concurrencia",
      label: "Concurrencia",
      icon: "🧵",
      color: "blue",
    },
    {
      key: "paralelismo",
      label: "Paralelismo",
      icon: "🔄",
      color: "green",
    },
  ],
  exams: [
    {
      year: "2025-06",
      title: "Mayo 2025",
      date: "Mayo 2025",
      description: "10 puntos · 5 preguntas",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 180,
    },
    {
      year: "2025-07",
      title: "Julio 2025",
      date: "Julio 2025",
      description: "10 puntos · 5 preguntas",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 180,
    },
  ],
};
