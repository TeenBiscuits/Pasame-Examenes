import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "cepe",
  name: "Concorrencia e Paralelismo",
  university: "Universidade da Coruña",
  courseCode: "202320",
  icon: "⚡",
  acknowledgments:
    "Exámenes y soluciones originales proporcionadas por el profesorado de la asignatura.",
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
      year: "2024-06",
      title: "Junio 2024",
      date: "Junio 2024",
      description: "10 puntos · 5 preguntas",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 180,
    },
    {
      year: "2024-07",
      title: "Julio 2024",
      date: "Julio 2024",
      description: "10 puntos · 5 preguntas",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 180,
    },
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
