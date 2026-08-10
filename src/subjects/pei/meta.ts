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
      color: "blue",
    },
    {
      key: "poo",
      label: "POO en Python",
      icon: "🧱",
      color: "green",
    },
    {
      key: "scripting",
      label: "Scripting y Regex",
      icon: "💻",
      color: "amber",
    },
    {
      key: "django-apis",
      label: "Django, APIs e Integración",
      icon: "🌐",
      color: "purple",
    },
    {
      key: "conceptos",
      label: "Conceptos y Test",
      icon: "📝",
      color: "pink",
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
