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
      id: "2022-01",
      title: "Enero 2022",
      durationMinutes: 150,
      hasPdf: false,
    },
    {
      id: "2020-01",
      title: "Enero 2020",
      durationMinutes: 150,
      hasPdf: false,
    },
  ],
};
