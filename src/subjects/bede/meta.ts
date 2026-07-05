import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "bede",
  name: "Bases de Datos",
  university: "Universidade da Coruña",
  courseCode: "202315",
  icon: "🗃️",
  acknowledgments:
    "Recopilatorios proporcionados por el alumnado de la asignatura de forma anónima.",
  topics: [
    {
      key: "recuperacion-concurrencia",
      label: "Recuperación y Concurrencia",
      icon: "🔄",
      color: "purple",
    },
    { key: "ficheros", label: "Ficheros", icon: "📁", color: "green" },
  ],
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
