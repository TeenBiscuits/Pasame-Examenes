import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "equisi",
  name: "Xestión de Infraestruturas",
  university: "Universidade da Coruña",
  courseCode: "200190",
  icon: "🏗️",
  acknowledgments:
    "Preguntas recopiladas de exámenes oficiais do Grao en Enxeñaría Informática.",
  topics: [
    {
      key: "teoria",
      label: "Teoría",
      icon: "📖",
      color: "indigo",
    },
    {
      key: "practica",
      label: "Práctica",
      icon: "🛠️",
      color: "green",
    },
  ],
  exams: [
    {
      year: "2024-01",
      title: "Xaneiro 2024",
      date: "Xaneiro 2024",
      description: "16 preguntas · 10 puntos",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 120,
    },
    {
      year: "2026-01",
      title: "Xaneiro 2026",
      date: "Xaneiro 2026",
      description: "18 preguntas · 25 puntos",
      passPoints: 13,
      totalPoints: 25,
      durationMinutes: 180,
    },
  ],
};
