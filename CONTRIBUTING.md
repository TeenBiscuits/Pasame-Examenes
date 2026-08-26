# Contribuir a Pásame Exámenes

Pásame Exámenes es una plataforma de estudio para que estudiantes de la FIC preparen sus asignaturas con preguntas de exámenes y ejercicios de práctica. Puedes contribuir con contenido, código, diseño, accesibilidad, rendimiento, SEO, documentación o herramientas.

## Antes de empezar

Busca primero si ya existe una issue relacionada. Si no encuentras una, abre una nueva:

- [Reportar un error en una pregunta](https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=report-question.yml)
- [Añadir material de estudio](https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=add-exam.yml)
- [Sugerir una asignatura](https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=suggest-subject.yml)

Para cambios grandes de arquitectura, rutas o reglas del producto, abre una issue antes de implementarlos.

## Preparar el entorno

Necesitas Node.js y pnpm. Desde la raíz del repositorio:

```bash
pnpm install
git switch -c mi-cambio
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000). Consulta el [README](./README.md) si necesitas conocer la estructura del proyecto o el resto de comandos.

Si usas un agente de programación, puedes consultar las [skills de Matt Pocock](https://www.aihero.dev/skills) para añadir flujos de trabajo guiados a tu agente.

> [!TIP]
> Pide a tu agente que te ponga al día con el proyecto antes de proponer cambios:
> ```txt
> Lee AGENTS.md, CONTEXT.md, README.md y CONTRIBUTING.md. Según la tarea, lee también docs/agents/domain.md, docs/content/question-types.md y los ADRs de docs/adr/.
>
> Resume en español la arquitectura, el modelo de dominio, la estructura del contenido y las convenciones que afectan a mi tarea. Indica qué archivos debería revisar y qué comprobaciones serían aplicables. No edites archivos todavía.
> ```

## Añadir una asignatura

Las asignaturas viven en `src/subjects/<subject-id>/`. Para crear una:

```bash
cp -R src/subjects/_template src/subjects/mi-asignatura
```

Después:

1. Actualiza `meta.ts` con el nombre, grado, curso, código oficial, temas y fuentes de la asignatura.
2. Indica si el profesorado comparte sus exámenes. Si los comparte, el contenido puede presentarse como `Examen`; si no, usa `Recopilatorio` para no sugerir una relación oficial con la facultad.
3. Añade las preguntas en `questions.ts` y sus imágenes en `assets/`.
4. Usa solo materiales que puedan publicarse legalmente.
5. Ejecuta `pnpm readme` para regenerar la tabla de asignaturas del README.

La plantilla `_template` es una asignatura de pruebas y solo debe aparecer en desarrollo y en previews de Vercel. `espain` es una asignatura secreta y no debe aparecer en la homepage ni en el sitemap.

> [!TIP]
> Pide a tu agente que cree una nueva asignatura siguiendo las convenciones del repositorio:
> ```txt
> Quiero añadir la asignatura <nombre> con el identificador <subject-id>.
>
> Lee AGENTS.md, CONTEXT.md, CONTRIBUTING.md, la plantilla src/subjects/_template/ y al menos una asignatura existente parecida. Inspecciona cómo se definen meta.ts, topics, exams y questions.ts.
>
> Usa la información que te proporcione sobre si el profesorado comparte sus exámenes y aplica la distinción entre Examen y Recopilatorio. Si falta esa información, pregúntamela antes de elegir. Implementa la asignatura, añade los temas y fuentes que te proporcione, genera el README con pnpm readme y ejecuta las comprobaciones aplicables. Termina indicando los archivos modificados, los comandos ejecutados y cualquier dato que falte.
> ```

## Añadir contenido a una asignatura

Para añadir preguntas o fuentes a una asignatura existente:

1. Modifica el `meta.ts` de la asignatura si añades una fuente, un tema o una imagen de asignatura.
2. Añade las preguntas en `questions.ts`. Cada pregunta debe tener un `examId` y un `topic` válidos.
3. Consulta la [guía de tipos de pregunta](./docs/content/question-types.md) para elegir la estructura adecuada. Si una pregunta no encaja en ningún tipo, crea un tipo nuevo siguiendo esa guía.
4. Guarda las imágenes de las preguntas en `assets/` y los PDFs autorizados en `public/exams/<subject-id>/`.
5. Ejecuta `pnpm readme` si has añadido o modificado una asignatura.

> [!CAUTION]
> Comparte únicamente material que puedas publicar legalmente. No adjuntes ni solicites enunciados, PDFs o materiales docentes protegidos sin autorización.

> [!TIP]
> Pide a tu agente que añada contenido a una asignatura existente:
> ```txt
> Quiero añadir contenido a src/subjects/<subject-id> a partir de estos archivos o enlaces: <archivos o enlaces>.
>
> Lee AGENTS.md, CONTEXT.md, CONTRIBUTING.md, docs/content/question-types.md y los archivos de la asignatura. Comprueba que el material puede publicarse, usa la información disponible para identificar si corresponde a un Examen o a un Recopilatorio y pregúntame si no es suficiente. Revisa los temas y tipos de pregunta disponibles.
>
> Implementa el contenido respetando las estructuras existentes, añade las imágenes necesarias, actualiza los metadatos y ejecuta pnpm readme si corresponde. Ejecuta las comprobaciones aplicables y termina indicando qué material has añadido, qué comandos has ejecutado y cualquier duda que deba revisar una persona.
> ```

## Cambios en la aplicación

- Mantén los tres idiomas disponibles: español, galego e inglés.
- Usa los componentes y utilidades existentes antes de crear variantes nuevas.
- Conserva la accesibilidad de botones, enlaces, iconos y controles.
- Si cambias una página pública, revisa sus metadatos SEO.
- Si cambias la práctica o la simulación de examen, prueba los estados relevantes en teclado y en pantallas pequeñas.
- No edites manualmente la tabla de asignaturas entre `SUBJECTS_TABLE:START` y `SUBJECTS_TABLE:END`.

## Documentación y decisiones del proyecto

`CONTEXT.md` contiene el vocabulario del dominio y los ADRs de `docs/adr/` explican decisiones importantes. Si una contribución cambia una regla del producto, actualiza la documentación correspondiente. Si el código no coincide con la documentación, adapta el código al comportamiento documentado salvo que haya cambiado la decisión del dominio.

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

Si el cambio afecta a la interfaz, prueba al menos una pantalla móvil, los tres idiomas y los temas claro y oscuro. Si afecta al contenido o al prerenderizado, comprueba también el build y las rutas públicas generadas.

## Pull requests

1. Crea una rama con un cambio acotado y explica el motivo de la modificación.
2. Mantén separados los cambios de contenido, interfaz y herramientas cuando no dependan entre sí.
3. Actualiza la documentación relacionada y añade capturas o pasos de prueba cuando el cambio sea visual.
4. Abre la pull request usando la [plantilla del repositorio](.github/pull_request_template.md).
5. Enlaza la issue correspondiente con `Closes #123` cuando proceda.
6. Responde a los comentarios de revisión y corrige los checks fallidos antes de solicitar la revisión final.

No incluyas secretos, archivos temporales, PDFs sin autorización ni artefactos generados que no sean necesarios para revisar el cambio.

Para las normas de convivencia, consulta el [código de conducta](./CODE_OF_CONDUCT.md).
