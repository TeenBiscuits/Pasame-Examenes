import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "eseo",
  lastmod: "2026-07-29",
  name: "Sistemas Operativos",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "202318",
  icon: "💽",
  contentPolicy: "authorized-exams",
  acknowledgments:
    "Exámenes y soluciones originales proporcionadas por el profesorado de la asignatura.",
  topics: [
    {
      key: "sistema-ficheros",
      label: "Sistema de Ficheros",
      icon: "📁",
      color: "blue",
    },
    {
      key: "memoria",
      label: "Gestión de Memoria",
      icon: "🧠",
      color: "indigo",
    },
    { key: "procesos", label: "Procesos e Hilos", icon: "⚙️", color: "green" },
    {
      key: "entrada-salida",
      label: "Entrada/Salida",
      icon: "💾",
      color: "purple",
    },
  ],
  exams: [
    {
      year: "2024-07",
      title: "Julio 2024",
      date: "Julio 2024",
      passPoints: 5,
      totalPoints: 7.25,
      durationMinutes: 165,
      hasPdf: true,
    },
  ],
};
