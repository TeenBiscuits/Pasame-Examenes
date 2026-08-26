# Contribuir a Pásame Exámenes

Pásame Exámenes es una plataforma de práctica para las asignaturas de la Facultade de Informática da Coruña. Se aceptan mejoras de contenido, interfaz, accesibilidad, rendimiento, SEO, documentación y herramientas del proyecto.

## Antes de empezar

Busca primero si ya existe una issue relacionada. Si no encuentras una, abre una nueva usando la plantilla que mejor encaje:

- [Reportar un error en una pregunta](.github/ISSUE_TEMPLATE/report-question.yml)
- [Añadir material de práctica autorizado](.github/ISSUE_TEMPLATE/add-exam.yml)
- [Sugerir una asignatura](.github/ISSUE_TEMPLATE/suggest-subject.yml)

Para cambios grandes de arquitectura, rutas o modelo de contenido, abre una issue antes de preparar la implementación. Así podemos acordar el alcance antes de invertir tiempo en una solución que no encaje con la aplicación.

## Preparar el entorno

Necesitas Node.js y pnpm. Desde la raíz del repositorio:

```bash
pnpm install
git switch -c mi-cambio
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000). El comando `pnpm dev` genera antes las estadísticas de contenido y las imágenes Open Graph necesarias para el entorno local.

Consulta el [README](./README.md) para conocer la arquitectura y el resto de comandos disponibles.

## Contenido y derechos de uso

Solo se pueden añadir preguntas, soluciones, imágenes y documentos que cumplan una de estas condiciones:

- son originales de quien contribuye;
- tienen autorización para compartirse;
- proceden de una fuente pública compatible con su redistribución;
- los ha proporcionado el profesorado o la institución con permiso suficiente.

No subas enunciados, PDFs, soluciones ni otros materiales protegidos si no tienes permiso para compartirlos. Si no puedes verificar los derechos de un examen, aporta ejercicios originales basados en el temario.

El contenido usa CC BY-SA 4.0 por defecto. El código, la configuración y la documentación usan Apache 2.0. La asignación concreta se mantiene en [`REUSE.toml`](./REUSE.toml) y el texto de la licencia de contenido está en [`LICENSE-CONTENT.md`](./LICENSE-CONTENT.md).

Si una asignatura necesita una licencia distinta, añade el texto correspondiente en `LICENSES/`, configura la anotación de la ruta en `REUSE.toml` y declara `contentLicense` en su `meta.ts`. No marques como autorizado un examen que no pueda compartirse legalmente.

## Añadir o actualizar una asignatura

Las asignaturas viven en `src/subjects/<subject-id>/` y normalmente contienen:

- `meta.ts`, con la información de la asignatura, temas y exámenes;
- `questions.ts`, con las preguntas;
- `assets/`, con imágenes usadas por las preguntas.

Para crear una asignatura nueva, copia la plantilla y sustituye el identificador:

```bash
cp -R src/subjects/_template src/subjects/mi-asignatura
```

Después:

1. Actualiza `meta.ts`. El campo `id` debe coincidir con el nombre de la carpeta y `lastmod` debe usar una fecha ISO.
2. Define los temas y los exámenes disponibles.
3. Añade las preguntas en `questions.ts` como un array `Question[]`.
4. Comprueba que cada pregunta tiene un `examId` que coincide con un examen de `meta.ts` y un `topic` válido.
5. Añade solo PDFs autorizados en `public/exams/<subject-id>/` y usa `hasPdf: false` cuando un examen no tenga un PDF compartible.
6. Guarda las imágenes de las preguntas en `assets/` y referencia sus versiones optimizadas con las utilidades existentes.
7. Ejecuta `pnpm readme` para regenerar la tabla de asignaturas del README.

Los tipos de pregunta disponibles son `mc`, `text`, `multiple-text`, `matching`, `fill` y `table-fill`. Los campos de texto admiten Markdown, fórmulas y bloques de código. Consulta la [guía de tipos de pregunta](./docs/content/question-types.md), [`src/data/types.ts`](./src/data/types.ts) y una asignatura existente antes de añadir una estructura nueva.

La plantilla `_template` sirve como asignatura de pruebas. Solo debe aparecer en desarrollo y en previews de Vercel. No la conviertas en una asignatura pública ni la incluyas en el sitemap. `espain` es una asignatura secreta: se accede por URL directa o mediante SecretToro y no debe aparecer en la homepage ni en el sitemap.

## Cambios en la aplicación

Ten en cuenta estas reglas al modificar la interfaz o las rutas:

- Mantén los tres idiomas disponibles: español, galego e inglés.
- Usa los componentes y utilidades existentes antes de crear una variante nueva.
- Conserva los nombres accesibles de botones, enlaces, iconos y controles, también cuando el texto se oculte en mobile.
- Si cambias una página pública, revisa `title`, `description`, canonical, Open Graph, datos estructurados y sitemap.
- Si cambias el flujo de práctica o examen, prueba navegación por teclado, estados de error y tamaños de pantalla pequeños.
- No edites a mano las filas de asignaturas generadas entre `SUBJECTS_TABLE:START` y `SUBJECTS_TABLE:END`.

## Comprobaciones

Ejecuta las comprobaciones que correspondan al cambio. Para una pull request de código, usa como mínimo:

```bash
pnpm check
pnpm typecheck
pnpm build
```

Según el alcance, comprueba también:

```bash
pnpm lint
pnpm run doctor
pnpm preview
```

`pnpm check` y `pnpm lint` usan Biome. `pnpm run doctor` ejecuta React Doctor sin su linter integrado. Los scripts `scripts/daypo_scraper.ts` y `scripts/mistral_ocr.ts` son herramientas auxiliares para desarrolladores y no forman parte de la comprobación normal de la aplicación.

Si el cambio afecta a la interfaz, prueba al menos una pantalla móvil, los tres idiomas y los temas claro y oscuro. Si afecta a contenido o prerender, comprueba también el build y las rutas públicas generadas.

## Pull requests

1. Crea una rama con un cambio acotado y explica el motivo de la modificación.
2. Mantén separados los cambios de contenido, interfaz y herramientas cuando no dependan entre sí.
3. Actualiza la documentación relacionada y añade capturas o pasos de prueba cuando el cambio sea visual.
4. Abre la pull request usando la [plantilla del repositorio](.github/pull_request_template.md).
5. Enlaza la issue correspondiente con `Closes #123` cuando proceda.
6. Responde a los comentarios de revisión y corrige los checks fallidos antes de solicitar la revisión final.

No incluyas secretos, archivos temporales, PDFs sin autorización ni artefactos generados que no sean necesarios para revisar el cambio.

Para las normas de convivencia, consulta el [código de conducta](./CODE_OF_CONDUCT.md).
