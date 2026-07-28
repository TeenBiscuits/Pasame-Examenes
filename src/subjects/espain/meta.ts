import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "espain",
  lastmod: "2026-07-28",
  name: "Nacionalidad Española",
  degree: "¿Eres español/a?",
  course: 1,
  courseCode: "ESPAÑA",
  icon: "🇪🇸",
  contentPolicy: "authorized-exams",
  topics: [
    {
      key: "tarea-1",
      label: "Tarea 1: Gobierno e instituciones",
      icon: "🏛️",
      color: "blue",
    },
    {
      key: "tarea-2",
      label: "Tarea 2: Nacionalidad y ciudadanía",
      icon: "⚖️",
      color: "indigo",
    },
    {
      key: "tarea-3",
      label: "Tarea 3: Territorio y geografía",
      icon: "🗺️",
      color: "green",
    },
    {
      key: "tarea-4",
      label: "Tarea 4: Cultura e historia",
      icon: "🎨",
      color: "purple",
    },
    {
      key: "tarea-5",
      label: "Tarea 5: Vida cotidiana y trámites",
      icon: "🧾",
      color: "orange",
    },
  ],
  exams: [
    {
      year: "ccse",
      title: "Prueba CCSE",
      date: "Oficial",
      passPoints: 15,
      totalPoints: 25,
      durationMinutes: 45,
      hasPdf: false,
    },
  ],
};
