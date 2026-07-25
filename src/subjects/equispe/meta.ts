import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "equispe",
  lastmod: "2026-07-25",
  name: "Xestión de Proxectos",
  university: "Universidade da Coruña",
  courseCode: "202323",
  icon: "📋",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la universidad. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
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
      title: "Posibles preguntas Xaneiro 2024",
      date: "Xaneiro 2024",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 120,
    },
    {
      year: "2026-01",
      title: "Posibles preguntas Xaneiro 2026",
      date: "Xaneiro 2026",
      passPoints: 13,
      totalPoints: 25,
      durationMinutes: 180,
    },
    {
      year: "daypo-tipo-udc",
      title: "Daypo Tipo UDC",
      passPoints: 32,
      totalPoints: 63,
      durationMinutes: 90,
      hasPdf: false,
      daypoUrl: "https://www.daypo.com/xp-examen-tipo-udc.html",
    },
    {
      year: "daypo-teoria",
      title: "Daypo Teoría",
      passPoints: 17,
      totalPoints: 34,
      durationMinutes: 60,
      hasPdf: false,
      daypoUrl: "https://www.daypo.com/xp-teoria.html",
    },
    {
      year: "daypo-practica",
      title: "Daypo Práctica",
      passPoints: 29,
      totalPoints: 58,
      durationMinutes: 90,
      hasPdf: false,
      daypoUrl: "https://www.daypo.com/xp-practica.html",
    },
  ],
};
