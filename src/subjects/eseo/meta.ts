import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "eseo",
  lastmod: "2026-08-09",
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
    },
    {
      key: "memoria",
      label: "Gestión de Memoria",
      icon: "🧠",
    },
    { key: "procesos", label: "Procesos e Hilos", icon: "⚙️" },
    {
      key: "entrada-salida",
      label: "Entrada/Salida",
      icon: "💾",
    },
  ],
  exams: [
    {
      id: "2024-07",
      title: "Julio 2024",
      durationMinutes: 165,
      hasPdf: true,
    },
    {
      id: "2024-01",
      title: "Enero 2024",
      durationMinutes: 165,
      hasPdf: true,
    },
    {
      id: "2023-07",
      title: "Julio 2023",
      durationMinutes: 165,
      hasPdf: true,
    },
    {
      id: "2023-01",
      title: "Enero 2023",
      durationMinutes: 165,
      hasPdf: true,
    },
  ],
};
