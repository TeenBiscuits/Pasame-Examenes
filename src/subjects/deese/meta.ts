import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "deese",
  lastmod: "2026-07-25",
  name: "Deseño de Software",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "202317",
  icon: "🎨",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la institución. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
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
      title: "Posibles preguntas Enero 2020",
      date: "Enero 2020",
      passPoints: 15,
      totalPoints: 30,
      durationMinutes: 150,
      hasPdf: false,
    },
    {
      year: "2022-01",
      title: "Posibles preguntas Enero 2022",
      date: "Enero 2022",
      passPoints: 13,
      totalPoints: 25,
      durationMinutes: 150,
      hasPdf: false,
    },
  ],
};
