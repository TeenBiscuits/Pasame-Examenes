import { createFileRoute } from "@tanstack/react-router";
import { BASE_URL } from "../seo/meta";

const PUBLIC_LANGUAGES = [
	{ code: "es", label: "Español" },
	{ code: "en", label: "English" },
	{ code: "gl", label: "Galego" },
] as const;

async function buildLlmsContent() {
	const [{ subjects }, { isIndexableSubject }] = await Promise.all([
		import("../subjects"),
		import("../subjects/visibility"),
	]);
	const publicSubjects = subjects
		.filter((subject) => isIndexableSubject(subject.id))
		.slice()
		.sort((a, b) => a.name.localeCompare(b.name, "es"));

	return [
		"# Pásame Exámenes",
		"> Plataforma open source para practicar preguntas de exámenes de la Facultade de Informática da Coruña (FIC).",
		"",
		"Pásame Exámenes ayuda a estudiantes de la FIC a preparar sus asignaturas con preguntas organizadas por temas, recopilatorios y simulacros. Las páginas pueden incluir respuestas modelo y autocorrección.",
		"",
		"## Páginas principales",
		...PUBLIC_LANGUAGES.map(
			({ code, label }) =>
				`- [Página principal en ${label}](${BASE_URL}/${code})`,
		),
		`- [Sitemap](${BASE_URL}/sitemap.xml)`,
		"",
		"## Asignaturas públicas",
		...publicSubjects.map(
			(subject) =>
				`- [${subject.name}](${BASE_URL}/es/${subject.id}): ${subject.degree}, ${subject.course}º curso.`,
		),
		"",
		"## Alcance del contenido",
		"- Las páginas de asignatura son la referencia principal para el contenido de cada materia.",
		"- Las rutas de práctica y simulación permiten trabajar preguntas por tema o en sesiones cronometradas.",
		"- El contenido procede de materiales de referencia y puede contener errores; las respuestas modelo sirven como apoyo para revisar el razonamiento.",
		"",
		"## Idiomas",
		"- Las páginas públicas están disponibles en español (`/es`), inglés (`/en`) y gallego (`/gl`).",
		"- Para una asignatura, sustituye el prefijo `/es` de su URL por `/en` o `/gl` para consultar su versión traducida.",
		"",
	].join("\n");
}

export const Route = createFileRoute("/llms.txt")({
	server: {
		handlers: {
			GET: async () =>
				new Response(await buildLlmsContent(), {
					headers: {
						"Cache-Control": "public, max-age=3600",
						"Content-Type": "text/plain; charset=utf-8",
					},
				}),
		},
	},
});
