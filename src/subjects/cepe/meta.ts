import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "cepe",
  lastmod: "2026-07-25",
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
      year: "2025-07",
      title: "Julio 2025",
      date: "Julio 2025",
      passPoints: 5,
      totalPoints: 10,
      durationMinutes: 180,
    },
  ],
};
