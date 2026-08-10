import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "bede",
  lastmod: "2026-07-25",
  name: "Bases de Datos",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "202315",
  icon: "🗃️",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la institución. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
  topics: [
    {
      key: "modelado-normalizacion",
      label: "Modelado y Normalización",
      icon: "🧩",
      color: "blue",
    },
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
      id: "daypo-preguntas",
      title: "Daypo Preguntas",
      durationMinutes: 120,
      hasPdf: false,
      originalUrl: "https://www.daypo.com/bd-preguntas-examen-udc.html",
    },
    {
      id: "recopilatorio-mayo-2026",
      title: "Recopilatorio Mayo 2026",
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      id: "recopilatorio-mayo-2022",
      title: "Recopilatorio Mayo 2022",
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
