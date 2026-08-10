import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "cepe",
  lastmod: "2026-08-09",
  name: "Concorrencia e Paralelismo",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "202320",
  icon: "⚡",
  contentPolicy: "authorized-exams",
  acknowledgments:
    "Exámenes y soluciones originales proporcionadas por el profesorado de la asignatura.",
  topics: [
    {
      key: "concurrencia-mutex",
      label: "Mutex y Condiciones",
      icon: "🔒",
      color: "blue",
    },
    {
      key: "concurrencia-erlang",
      label: "Erlang",
      icon: "🧵",
      color: "purple",
    },
    {
      key: "paralelismo-teoria",
      label: "Preguntas Teóricas",
      icon: "📖",
      color: "green",
    },
    {
      key: "paralelismo-mpi",
      label: "Ejercicios de MPI",
      icon: "🔄",
      color: "amber",
    },
  ],
  megatopics: [
    {
      key: "concurrencia",
      label: "Concurrencia",
      topics: ["concurrencia-mutex", "concurrencia-erlang"],
    },
    {
      key: "paralelismo",
      label: "Paralelismo",
      topics: ["paralelismo-teoria", "paralelismo-mpi"],
    },
  ],
  exams: [
    {
      id: "2024-06",
      title: "Junio 2024",
      durationMinutes: 180,
      hasPdf: true,
    },
    {
      id: "2024-07",
      title: "Julio 2024",
      durationMinutes: 180,
      hasPdf: true,
    },
    {
      id: "2025-06",
      title: "Junio 2025",
      durationMinutes: 180,
      hasPdf: true,
    },
    {
      id: "2025-07",
      title: "Julio 2025",
      durationMinutes: 180,
    },
  ],
};
