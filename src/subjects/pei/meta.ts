import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "pei",
  name: "Programación Integrativa",
  university: "Universidade da Coruña",
  courseCode: "200214",
  icon: "🔗",
  acknowledgments: "Preguntas recopiladas de exámenes oficiales.",
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
      year: "recopilacion",
      title: "Recopilación",
      description: "54 preguntas",
      passPoints: 15,
      totalPoints: 30,
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
