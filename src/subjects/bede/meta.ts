import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "bede",
  name: "Bases de Datos",
  university: "Universidade da Coruña",
  courseCode: "202315",
  icon: "🗄️",
  acknowledgments:
    "Exámenes originales y recopilatorios proporcionados por el alumnado de la asignatura de forma anónima.",
  topics: [{ key: "teoria", label: "Teoría", icon: "📖", color: "blue" }],
  exams: [
    {
      year: "daypo-preguntas",
      title: "Daypo Preguntas",
      description: "98 ptos · 98 preguntas",
      passPoints: 49,
      totalPoints: 98,
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
