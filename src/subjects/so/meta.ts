import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "so",
  name: "Sistemas Operativos",
  university: "Universidade da Coruña",
  courseCode: "202318",
  icon: "💻",
  topics: [
    { key: "sistema-ficheros", label: "Sistema de Ficheros", icon: "📁", color: "blue" },
    { key: "memoria", label: "Gestión de Memoria", icon: "🧠", color: "indigo" },
    { key: "procesos", label: "Procesos e Hilos", icon: "⚙️", color: "green" },
    { key: "entrada-salida", label: "Entrada/Salida", icon: "💾", color: "purple" },
  ],
  exams: [
    { year: "2020-01", title: "Enero 2020", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
    { year: "2021-01", title: "Enero 2021", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
    { year: "2021-07", title: "Julio 2021", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
    { year: "2022-01", title: "Enero 2022", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
    { year: "2022-07", title: "Julio 2022", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
    { year: "2023-01", title: "Enero 2023", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
    { year: "2023-07", title: "Julio 2023", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
    { year: "2024-01", title: "Enero 2024", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
    { year: "2024-07", title: "Julio 2024", description: "165 min · 4 partes", passPoints: 50, totalPoints: 100, durationMinutes: 165 },
  ],
};