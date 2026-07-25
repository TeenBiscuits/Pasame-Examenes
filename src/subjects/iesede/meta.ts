import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "iesede",
  lastmod: "2026-07-25",
  name: "Internet y Sistemas Distribuidos",
  university: "Universidade da Coruña",
  courseCode: "200188",
  icon: "🌐",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la universidad. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
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
      title: "Recopilación",
      passPoints: 9,
      totalPoints: 18,
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
