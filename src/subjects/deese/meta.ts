import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "deese",
  name: "Deseño de Software",
  university: "Universidade da Coruña",
  courseCode: "202317",
  icon: "🎨",
  acknowledgments:
    "Exámenes originales proporcionados por el alumnado de la asignatura de forma anónima.",
  topics: [
    {
      key: "intro-y-objetos",
      label: "Introducción y Elementos Básicos de la OO",
      icon: "📦",
      color: "blue",
    },
    {
      key: "propiedades-oo",
      label: "Propiedades Básicas de la OO",
      icon: "🧬",
      color: "indigo",
    },
    {
      key: "uml",
      label: "UML",
      icon: "📐",
      color: "green",
    },
    {
      key: "principios-diseno",
      label: "Principios de Diseño",
      icon: "📏",
      color: "purple",
    },
    {
      key: "patrones-diseno",
      label: "Patrones de Diseño",
      icon: "🧩",
      color: "pink",
    },
  ],
  exams: [
    {
      year: "2020-01",
      title: "Enero 2020",
      date: "Enero 2020",
      description: "150 min · 30 preguntas",
      passPoints: 15,
      totalPoints: 30,
      durationMinutes: 150,
      hasPdf: false,
    },
    {
      year: "2022-01",
      title: "Enero 2022",
      date: "Enero 2022",
      description: "150 min · 25 preguntas",
      passPoints: 13,
      totalPoints: 25,
      durationMinutes: 150,
      hasPdf: false,
    },
  ],
};
