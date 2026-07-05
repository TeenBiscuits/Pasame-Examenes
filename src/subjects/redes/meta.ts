import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "redes",
  name: "Redes",
  university: "Universidade da Coruña",
  courseCode: "202319",
  icon: "🕸️",
  acknowledgments:
    "Recopilatorio de preguntas de exámenes de Redes (Junio y Julio desde 2008) proporcionado por el alumnado de la asignatura de forma anónima.",
  topics: [
    {
      key: "tema-1",
      label: "Tema 1. Redes de ordenadores e Internet",
      icon: "🌐",
      color: "blue",
    },
    {
      key: "tema-2",
      label: "Tema 2. Introducción a TCP/IP",
      icon: "📚",
      color: "indigo",
    },
    {
      key: "tema-3-4",
      label: "Tema 3-4. Protocolos nivel de aplicación",
      icon: "📱",
      color: "green",
    },
    {
      key: "tema-5",
      label: "Tema 5. Protocolos de transporte UDP y TCP",
      icon: "📦",
      color: "purple",
    },
    {
      key: "tema-6",
      label: "Tema 6. Intercambio de datos TCP",
      icon: "🔄",
      color: "pink",
    },
    {
      key: "tema-7",
      label: "Tema 7. Nivel de red: protocolo IP",
      icon: "📨",
      color: "amber",
    },
    {
      key: "tema-8",
      label: "Tema 8. Enrutamiento",
      icon: "🧭",
      color: "red",
    },
    {
      key: "tema-9",
      label: "Tema 9. ICMP y fragmentación IP",
      icon: "⚠️",
      color: "cyan",
    },
    {
      key: "tema-10",
      label: "Tema 10. Protocolo IPv6",
      icon: "6️⃣",
      color: "orange",
    },
    {
      key: "tema-11",
      label: "Tema 11. TCP/IP y nivel de enlace",
      icon: "🔗",
      color: "blue",
    },
    {
      key: "tema-12",
      label: "Tema 12. Tecnologías del nivel de enlace",
      icon: "📡",
      color: "indigo",
    },
  ],
  exams: [
    {
      year: "daypo-recopilatorio-lara",
      title: "Daypo Recopilatorio (des. 2008)",
      description: "125 preguntas · 125 puntos",
      passPoints: 63,
      totalPoints: 125,
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      year: "daypo-recopilatorio-udc",
      title: "Daypo Recopilatorio (UDC)",
      description: "298 preguntas · 298 puntos",
      passPoints: 149,
      totalPoints: 298,
      durationMinutes: 240,
      hasPdf: false,
    },
    {
      year: "2025-05",
      title: "Mayo 2025 (incompl.)",
      description: "37 preguntas · 37 puntos",
      passPoints: 19,
      totalPoints: 37,
      durationMinutes: 120,
      hasPdf: false,
    },
  ],
};
