import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
	id: "calculo",
	lastmod: "2026-08-10",
	name: "Cálculo",
	degree: "Grao en Enxeñaría informática",
	course: 1,
	courseCode: "202305",
	icon: "🧮",
	contentPolicy: "authorized-exams",
	acknowledgments:
		"Exámenes y soluciones originales proporcionadas por el profesorado de la asignatura.",
	topics: [
		{
			key: "funciones-elementales",
			label: "Funciones Elementales",
			icon: "🧩",
		},
		{
			key: "limites-continuidad",
			label: "Límites y Continuidad",
			icon: "📈",
		},
		{
			key: "metodos-numericos",
			label: "Métodos Numéricos",
			icon: "🛠️",
		},
		{
			key: "derivadas",
			label: "Derivación",
			icon: "📉",
		},
		{
			key: "aplicaciones-derivada",
			label: "Aplicaciones de la Derivada",
			icon: "📊",
		},
		{
			key: "integral-definida",
			label: "Integral Definida",
			icon: "📐",
		},
		{
			key: "integracion-numerica",
			label: "Integración Numérica",
			icon: "📏",
		},
		{
			key: "aplicaciones-integral",
			label: "Aplicaciones de la Integral",
			icon: "📦",
		},
		{
			key: "ecuaciones-diferenciales",
			label: "Ecuaciones Diferenciales",
			icon: "🧬",
		},
	],
	exams: [
		{
			id: "2025-07",
			title: "Julio 2025",
			durationMinutes: 90,
			hasPdf: true,
		},
		{
			id: "2025-01",
			title: "Enero 2025",
			durationMinutes: 90,
			hasPdf: true,
		},
		{
			id: "2024-07",
			title: "Julio 2024",
			durationMinutes: 90,
			hasPdf: true,
		},
		{
			id: "2024-01",
			title: "Enero 2024",
			durationMinutes: 90,
			hasPdf: true,
		},
		{
			id: "2023-07",
			title: "Julio 2023",
			durationMinutes: 90,
			hasPdf: true,
		},
		{
			id: "2023-01",
			title: "Enero 2023",
			durationMinutes: 90,
			hasPdf: true,
		},
		{
			id: "2022-07",
			title: "Julio 2022",
			durationMinutes: 90,
			hasPdf: true,
		},
		{
			id: "2022-01",
			title: "Enero 2022",
			durationMinutes: 90,
			hasPdf: true,
		},
	],
};

void meta;
