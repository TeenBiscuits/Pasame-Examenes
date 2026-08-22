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
		{ key: "rendimiento", label: "Rendimiento", icon: "⚡" },
		{ key: "segmentacion", label: "Segmentación", icon: "🔄" },
		{ key: "cache", label: "Memoria caché", icon: "💾" },
		{
			key: "memoria-virtual",
			label: "Memoria virtual",
			icon: "📄",
		},
		{ key: "buses", label: "Buses y E/S", icon: "🔌" },
		{ key: "raid", label: "RAID y almacenamiento", icon: "🗄️" },
	],
	exams: [
		{
			id: "2026-01",
			title: "Enero 2026",
			durationMinutes: 90,
			hasPdf: false,
		},
	],
};
