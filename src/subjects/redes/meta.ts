import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "redes",
  lastmod: "2026-07-25",
  name: "Redes",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "202319",
  icon: "🕸️",
  contentPolicy: "community-practice",
  acknowledgments:
    "Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la institución. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
  topics: [
    {
      key: "tema-1",
      label: "Tema 1. Redes de ordenadores e Internet",
      icon: "🌐",
    },
    {
      key: "tema-2",
      label: "Tema 2. Introducción a TCP/IP",
      icon: "📚",
    },
    {
      key: "tema-3-4",
      label: "Tema 3-4. Protocolos nivel de aplicación",
      icon: "📱",
    },
    {
      key: "tema-5",
      label: "Tema 5. Protocolos de transporte UDP y TCP",
      icon: "📦",
    },
    {
      key: "tema-6",
      label: "Tema 6. Intercambio de datos TCP",
      icon: "🔄",
    },
    {
      key: "tema-7",
      label: "Tema 7. Nivel de red: protocolo IP",
      icon: "📨",
    },
    {
      key: "tema-8",
      label: "Tema 8. Enrutamiento",
      icon: "🧭",
    },
    {
      key: "tema-9",
      label: "Tema 9. ICMP y fragmentación IP",
      icon: "⚠️",
    },
    {
      key: "tema-10",
      label: "Tema 10. Protocolo IPv6",
      icon: "6️⃣",
    },
    {
      key: "tema-11",
      label: "Tema 11. TCP/IP y nivel de enlace",
      icon: "🔗",
    },
    {
      key: "tema-12",
      label: "Tema 12. Tecnologías del nivel de enlace",
      icon: "📡",
    },
  ],
  exams: [
    {
      id: "2026-01",
      title: "Recopilatorio Enero 2026",
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      id: "2025-05",
      title: "Recopilatorio Mayo 2025",
      durationMinutes: 120,
      hasPdf: false,
    },
    {
      id: "daypo-recopilatorio-lara",
      title: "Daypo Recopilatorio (des. 2008)",
      durationMinutes: 120,
      hasPdf: false,
      originalUrl: "https://www.daypo.com/redes-udc-examen-fic.html",
    },
    {
      id: "daypo-recopilatorio-udc",
      title: "Daypo Recopilatorio (UDC)",
      durationMinutes: 240,
      hasPdf: false,
      originalUrl: "https://www.daypo.com/redes-udc.html",
    },
  ],
};
