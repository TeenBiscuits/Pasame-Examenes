import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "peese",
  name: "Proceso Software",
  university: "Universidade da Coruña",
  courseCode: "202321",
  icon: "🗓️",
  acknowledgments:
    "Examen original proporcionado por el alumnado de la asignatura.",
  topics: [{ key: "teoria", label: "Teoría", icon: "📖", color: "blue" }],
  exams: [
    {
      year: "2026-05",
      title: "Mayo 2026",
      date: "Mayo 2026",
      description: "8.5 ptos · 17 preguntas",
      passPoints: 4.25,
      totalPoints: 8.5,
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
