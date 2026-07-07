import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "deese",
  name: "Deseño de Software",
  university: "Universidade da Coruña",
  courseCode: "202317",
  icon: "🎨",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la universidad. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
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
      description: "150 min · 30 preguntas",
      passPoints: 15,
      totalPoints: 30,
      durationMinutes: 150,
      hasPdf: false,
    },
    {
      year: "2022-01",
      title: "Posibles preguntas Enero 2022",
      date: "Enero 2022",
      description: "150 min · 25 preguntas",
      passPoints: 13,
      totalPoints: 25,
      durationMinutes: 150,
      hasPdf: false,
    },
  ],
};
