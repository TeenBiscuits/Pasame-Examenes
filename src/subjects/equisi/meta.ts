import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "equisi",
  lastmod: "2026-07-25",
  name: "Xestión de Infraestruturas",
  degree: "Grao en Enxeñaría informática",
  course: 3,
  courseCode: "200190",
  icon: "🏗️",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la institución. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
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
      title: "Posibles preguntas Xullo 2024",
      date: "Xullo 2024",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 45,
    },
    {
      year: "daypo-modulo-i",
      title: "Daypo Módulo I",
      passPoints: 65,
      totalPoints: 130,
      durationMinutes: 120,
      hasPdf: false,
      daypoUrl: "https://www.daypo.com/xi-udc-modulo-i.html",
    },
    {
      year: "daypo-modulo-ii",
      title: "Daypo Módulo II",
      passPoints: 55,
      totalPoints: 109,
      durationMinutes: 120,
      hasPdf: false,
      daypoUrl: "https://www.daypo.com/xi-udc-modulo-ii.html",
    },
    {
      year: "megarecopilacion",
      title: "Megarecopilación Test XI",
      passPoints: 61,
      totalPoints: 122,
      durationMinutes: 90,
    },
  ],
};
