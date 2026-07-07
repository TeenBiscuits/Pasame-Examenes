import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "peese",
  name: "Proceso Software",
  university: "Universidade da Coruña",
  courseCode: "202321",
  icon: "🗓️",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la universidad. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
  topics: [{ key: "teoria", label: "Teoría", icon: "📖", color: "blue" }],
  exams: [
    {
      year: "2026-05",
      title: "Recopilatorio Mayo 2026",
      date: "Mayo 2026",
      description: "8.5 ptos · 17 preguntas",
      passPoints: 4.25,
      totalPoints: 8.5,
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
