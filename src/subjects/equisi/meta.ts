import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "equisi",
  name: "Xestión de Infraestruturas",
  university: "Universidade da Coruña",
  courseCode: "200190",
  icon: "🏗️",
  acknowledgments:
    "Exámenes originales y recopilatorios proporcionados por el alumnado de la asignatura de forma anónima.",
  topics: [
    {
      key: "modulo-i",
      label: "Módulo I: Sinais e Comunicacións",
      icon: "📡",
      color: "blue",
    },
    {
      key: "modulo-ii",
      label: "Módulo II: Infraestruturas TI",
      icon: "🖥️",
      color: "green",
    },
  ],
  exams: [
    {
      year: "2024-07",
      title: "Xullo 2024",
      date: "Xullo 2024",
      description: "20 preguntas · 10 puntos",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 45,
    },
    {
      year: "daypo-modulo-i",
      title: "Daypo Módulo I",
      description: "130 preguntas · 130 puntos",
      passPoints: 65,
      totalPoints: 130,
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      year: "daypo-modulo-ii",
      title: "Daypo Módulo II",
      description: "109 preguntas · 109 puntos",
      passPoints: 55,
      totalPoints: 109,
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      year: "megarecopilacion",
      title: "Megarecopilación Test XI",
      description: "122 preguntas · 122 puntos",
      passPoints: 61,
      totalPoints: 122,
      durationMinutes: 90,
    },
  ],
};
