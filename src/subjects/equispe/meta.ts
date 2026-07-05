import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "equispe",
  name: "Xestión de Proxectos",
  university: "Universidade da Coruña",
  courseCode: "202323",
  icon: "📋",
  acknowledgments:
    "Exámenes originales y recopilatorios proporcionados por el alumnado de la asignatura de forma anónima.",
  topics: [
    {
      key: "teoria",
      label: "Teoría",
      icon: "📖",
      color: "indigo",
    },
    {
      key: "practica",
      label: "Práctica",
      icon: "🛠️",
      color: "green",
    },
  ],
  exams: [
    {
      year: "2024-01",
      title: "Xaneiro 2024",
      date: "Xaneiro 2024",
      description: "16 preguntas · 10 puntos",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 120,
    },
    {
      year: "2026-01",
      title: "Xaneiro 2026",
      date: "Xaneiro 2026",
      description: "18 preguntas · 25 puntos",
      passPoints: 13,
      totalPoints: 25,
      durationMinutes: 180,
    },
    {
      year: "daypo-tipo-udc",
      title: "Daypo Tipo UDC",
      description: "63 preguntas · 63 puntos",
      passPoints: 32,
      totalPoints: 63,
      durationMinutes: 90,
      hasPdf: false,
    },
    {
      year: "daypo-teoria",
      title: "Daypo Teoría",
      description: "34 preguntas · 34 puntos",
      passPoints: 17,
      totalPoints: 34,
      durationMinutes: 60,
      hasPdf: false,
    },
    {
      year: "daypo-practica",
      title: "Daypo Práctica",
      description: "58 preguntas · 58 puntos",
      passPoints: 29,
      totalPoints: 58,
      durationMinutes: 90,
      hasPdf: false,
    },
  ],
};
