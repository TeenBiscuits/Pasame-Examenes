import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
	id: "equispe",
	lastmod: "2026-07-25",
	name: "Xestión de Proxectos",
	degree: "Grao en Enxeñaría informática",
	course: 3,
	courseCode: "202323",
	icon: "📋",
	contentPolicy: "community-practice",
	acknowledgments:
		"Las preguntas y respuestas incluidas en esta plataforma son ejercicios originales creados por estudiantes anónimos a partir del temario oficial. No se reproducen exámenes oficiales, enunciados originales ni materiales docentes protegidos del profesorado o de la institución. Si se detecta alguna coincidencia sustancial no autorizada, puede notificarse para su revisión y retirada.",
	topics: [
		{
			key: "teoria",
			label: "Teoría",
			icon: "📖",
		},
		{
			key: "practica",
			label: "Práctica",
			icon: "🛠️",
		},
	],
	exams: [
		{
			id: "2026-01",
			title: "Xaneiro 2026",
			durationMinutes: 180,
		},
		{
			id: "2024-01",
			title: "Xaneiro 2024",
			durationMinutes: 120,
		},
		{
			id: "daypo-tipo-udc",
			title: "Daypo Tipo UDC",
			durationMinutes: 90,
			hasPdf: false,
			originalUrl: "https://www.daypo.com/xp-examen-tipo-udc.html",
		},
		{
			id: "daypo-teoria",
			title: "Daypo Teoría",
			durationMinutes: 60,
			hasPdf: false,
			originalUrl: "https://www.daypo.com/xp-teoria.html",
		},
		{
			id: "daypo-practica",
			title: "Daypo Práctica",
			durationMinutes: 90,
			hasPdf: false,
			originalUrl: "https://www.daypo.com/xp-practica.html",
		},
	],
};
