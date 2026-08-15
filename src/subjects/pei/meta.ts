import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "pei",
  lastmod: "2026-07-25",
  name: "Programación Integrativa",
  degree: "Grao en Enxeñaría informática",
  course: 3,
  courseCode: "200214",
  icon: "🔗",
  contentPolicy: "community-practice",
  acknowledgments:
    "Preguntas recopiladas por el alumnado de la asignatura de forma anónima.",
  topics: [
    {
      key: "pandas",
      label: "Pandas y Datos Estructurados",
      icon: "🐼",
    },
    {
      key: "poo",
      label: "POO en Python",
      icon: "🧱",
    },
    {
      key: "scripting",
      label: "Scripting y Regex",
      icon: "💻",
    },
    {
      key: "django-apis",
      label: "Django, APIs e Integración",
      icon: "🌐",
    },
    {
      key: "conceptos",
      label: "Conceptos y Test",
      icon: "📝",
    },
  ],
  exams: [
    {
      id: "recopilacion",
      title: "Recopilación",
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
