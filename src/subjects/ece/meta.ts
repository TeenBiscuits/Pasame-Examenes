import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "ece",
  lastmod: "2026-08-08",
  name: "Estrutura de Computadores",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "202314",
  icon: "💻",
  contentPolicy: "authorized-exams",
  acknowledgments:
    "Exámenes y soluciones originales proporcionadas por el profesorado de la asignatura.",
  topics: [
    { key: "rendimiento", label: "Rendimiento", icon: "⚡", color: "blue" },
    { key: "segmentacion", label: "Segmentación", icon: "🔄", color: "green" },
    { key: "cache", label: "Memoria caché", icon: "💾", color: "purple" },
    {
      key: "memoria-virtual",
      label: "Memoria virtual",
      icon: "📄",
      color: "amber",
    },
    { key: "buses", label: "Buses y E/S", icon: "🔌", color: "red" },
    { key: "raid", label: "RAID y almacenamiento", icon: "🗄️", color: "cyan" },
  ],
  exams: [
    {
      year: "2026-01",
      title: "Enero 2026",
      date: "Enero 2026",
      passPoints: 2,
      totalPoints: 4,
      durationMinutes: 90,
      hasPdf: false,
    },
  ],
};
