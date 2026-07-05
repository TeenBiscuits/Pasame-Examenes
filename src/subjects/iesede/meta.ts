import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "iesede",
  name: "Internet y Sistemas Distribuidos",
  university: "Universidade da Coruña",
  courseCode: "200188",
  icon: "🌐",
  acknowledgments: "Examen transcrito desde fotos.",
  topics: [
    {
      key: "general",
      label: "General",
      icon: "📚",
      color: "blue",
    },
  ],
  exams: [
    {
      year: "examen_recopilatorio",
      title: "Examen Recopilatorio",
      description: "18 preguntas · 18 puntos",
      passPoints: 9,
      totalPoints: 18,
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
