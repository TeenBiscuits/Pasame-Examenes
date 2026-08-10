import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "esei",
  lastmod: "2026-07-25",
  name: "Sistemas Intelixentes",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "202322",
  icon: "🧠",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la institución. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
  topics: [
    {
      key: "t1",
      label: "Tema 1: Introducción",
      icon: "👋",
      color: "blue",
    },
    {
      key: "t2",
      label: "Tema 2: Búsqueda",
      icon: "🔍",
      color: "indigo",
    },
    {
      key: "t3",
      label: "Tema 3: Representación",
      icon: "🧩",
      color: "purple",
    },
    {
      key: "t4",
      label: "Tema 4: Razonamiento",
      icon: "⚖️",
      color: "amber",
    },
    {
      key: "t5",
      label: "Tema 5: Planificación",
      icon: "📅",
      color: "orange",
    },
    {
      key: "t6",
      label: "Tema 6: Introducción a los sistemas subsimbólicos",
      icon: "🧠",
      color: "green",
    },
    {
      key: "t7",
      label: "Tema 7: Redes Neuronales Artificiales: modelos y características",
      icon: "🔬",
      color: "cyan",
    },
    {
      key: "t8",
      label: "Tema 8: Entrenamiento de Redes Neuronales Artificiales",
      icon: "🚀",
      color: "red",
    },
    {
      key: "t9",
      label: "Tema 9: Sistemas autoorganizativos",
      icon: "🗺️",
      color: "pink",
    },
    {
      key: "t10",
      label: "Tema 10: Computación Evolutiva",
      icon: "🧬",
      color: "purple",
    },
  ],
  megatopics: [
    {
      key: "simbolica",
      label: "Simbólica",
      topics: ["t1", "t2", "t3", "t4", "t5"],
    },
    {
      key: "subsimbolica",
      label: "Subsimbólica",
      topics: ["t6", "t7", "t8", "t9", "t10"],
    },
  ],
  exams: [
    {
      id: "2023",
      title: "2023",
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      id: "2024",
      title: "2024",
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      id: "2025-05",
      title: "Mayo 2025",
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      id: "2025-07",
      title: "Julio 2025",
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      id: "2026-06",
      title: "Junio 2026",
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
