import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "peese",
  lastmod: "2026-07-25",
  name: "Proceso Software",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "202321",
  icon: "🗓️",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la institución. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
  topics: [{ key: "teoria", label: "Teoría", icon: "📖" }],
  exams: [
    {
      id: "2026-05",
      title: "Mayo 2026",
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
