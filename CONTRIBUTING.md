# Contribuir a Pásame Exámenes

¡Gracias por ayudar a hacer crecer esta plataforma open source de práctica de la FIC!

## Derechos de autor y fuentes

Solo se aceptan contenidos que cumplan al menos una de estas condiciones:

- Son ejercicios originales creados por quien contribuye.
- Proceden de exámenes o materiales publicados oficialmente con permiso para compartirse.
- Han sido proporcionados o autorizados por el profesorado o la institución.
- Proceden de una fuente pública compatible con su uso en la plataforma.

No envíes enunciados, PDFs, soluciones o materiales docentes protegidos si no tienes autorización para compartirlos. Si una asignatura no comparte sus exámenes, aporta ejercicios originales basados en el temario en lugar de recreaciones exactas.

Salvo indicación específica, el contenido aceptado para la web se publicará bajo **CC BY-SA 4.0**. Esto incluye `questions.ts`, las imágenes de `assets/` y los PDFs originales de `public/exams/`. La licencia del código, la configuración y la documentación es **Apache 2.0**.

La asignación de licencias se mantiene sin cabeceras en [`REUSE.toml`](./REUSE.toml). Si una asignatura necesita una licencia de contenido diferente:

1. Añade el texto de la licencia en `LICENSES/`. Para una licencia SPDX existente, usa `REUSE download <SPDX-ID>`. Para una licencia propia, usa el identificador `LicenseRef-<id>` y guarda el texto en `LICENSES/LicenseRef-<id>.txt`.
2. Añade al final de `REUSE.toml` una anotación `[[annotations]]` para `src/subjects/<id>/questions.ts`, `src/subjects/<id>/assets/**` y, si procede, `public/exams/<id>/**`. Usa el mismo identificador SPDX en todas ellas.
3. Declara ese identificador y la información legible en `contentLicense` dentro de `meta.ts`. La página de la asignatura mostrará esta licencia en lugar de la predeterminada.

Por ejemplo:

```toml
[[annotations]]
path = [
  "src/subjects/eseo/questions.ts",
  "src/subjects/eseo/assets/**",
  "public/exams/eseo/**",
]
precedence = "override"
SPDX-FileCopyrightText = "2026 Autores de ESEO"
SPDX-License-Identifier = "LicenseRef-ESEO-Exams"
```

```ts
contentLicense: {
  spdxId: "LicenseRef-ESEO-Exams",
  name: "Licencia de los exámenes de ESEO",
  url: "https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/LICENSES/LicenseRef-ESEO-Exams.txt",
  notice: "Contenido proporcionado por el profesorado de la asignatura.",
},
```

## Cómo contribuir

### Reportar errores en preguntas

Cada pregunta tiene un enlace **"Report Issue"** en la vista de revisión. Úsalo para abrir un issue pre-rellenado con el ID de la pregunta y la asignatura.

### Añadir una nueva asignatura

#### 1. Copia la plantilla

```bash
cp -r src/subjects/_template src/subjects/{subject-id}
```

Usa kebab-case para el nombre de la carpeta: `calculo`, `sistemas-operativos`, `redes`.

#### 2. Edita `meta.ts`

```ts
import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "subject-id", // debe coincidir con el nombre de la carpeta
  lastmod: "2026-07-25", // fecha ISO para el sitemap de esta asignatura y sus subpáginas
  name: "Nombre Asignatura",
  degree: "Grao en Enxeñaría informática",
  course: 2,
  courseCode: "ABC123",
  icon: "📚",
  acknowledgments:
    "Preguntas proporcionadas por el departamento de... Respuestas por...", // opcional, se muestra al final de la página
  // Omite contentLicense para usar CC BY-SA 4.0. Para una excepción, consulta la sección de licencias.
  contentPolicy: "community-practice", // "authorized-exams" solo si los exámenes pueden compartirse
  topics: [
    {
      key: "tema-slug",
      label: "Nombre del Tema",
      icon: "📌",
      color: "blue", // blue, indigo, green, purple, pink, amber, red, cyan, orange
    },
  ],
  megatopics: [
    // opcional: agrupar temas en categorías superiores
    {
      key: "grupo-slug",
      label: "Nombre del Grupo",
      topics: ["tema-slug"], // claves de los temas que pertenecen a este megatopic
    },
  ],
  exams: [
    {
      id: "2024", // slug único, usado en la URL /exam/2024, los PDFs y como examId de las preguntas
      title: "2024",
      durationMinutes: 180,
      hasPdf: true, // opcional, valor por defecto true. Pon false si no hay PDF
      originalUrl: "https://www.daypo.com/mi-test.html", // opcional, enlace al contenido original usado como fuente
    },
  ],
};
```

#### 3. Añade las preguntas en `questions.ts`

> [!TIP]
> Puedes extraer preguntas de cualquier daypo en formato `Question[]` usando [`scripts/daypo_scraper.ts`](scripts/daypo_scraper.ts):
>
> ```bash
> pnpm tsx scripts/daypo_scraper.ts https://www.daypo.com/mi-test.html --topic mi-tema --exam-id 2024 -o src/subjects/mi-asignatura/preguntas.ts
> ```

Exporta un array `Question[]`. Tipos de pregunta:

- **`mc`** — Opción múltiple. `correctAnswer` es una letra `"a"`–`"e"`. Requiere `options[]`. Corrección automática.
- **`text`** — Respuesta libre. `correctAnswer` es la solución modelo. Auto-evaluada por el usuario; `explanation` puede añadir notas extra.
- **`multiple-text`** — Varias respuestas libres en una misma pregunta. `textParts` contiene cada parte (con `label` y `points` opcionales) y `correctAnswer` es un `string[]` con una solución modelo por parte, en el mismo orden. Cada parte se autoevalúa por separado; si una parte no declara `points`, las partes sin puntos explícitos se reparten el resto de los puntos de la pregunta.
- **`matching`** — Emparejar conceptos (incluye verdadero/falso con `"V"`/`"F"`). `correctAnswer` es un `Record<string, string>`. Corrección automática.
- **`fill`** — Una o varias frases con huecos. `fillStatements` contiene las frases y cada `{{blank}}` se sustituye por un campo; `correctAnswer` es un `string[]` con las respuestas en orden. Una coincidencia exacta ignorando mayúsculas se corrige automáticamente; en otro caso se muestra la solución y el usuario autoevalúa la respuesta. `development` puede añadir un desarrollo desplegable tras mostrar el resultado.
- **`table-fill`** — Una tabla con huecos en sus celdas. `tableFill` contiene `headers` y `rows`; cada `{{blank}}` se sustituye por un campo y `correctAnswer` es un `string[]` en orden fila por fila. Sigue la misma corrección automática por coincidencia exacta y autoevaluación alternativa que `fill`; `development` puede añadir un desarrollo desplegable tras mostrar el resultado.

```ts
import type { Question } from "../../data/types";

export const questions: Question[] = [
  // Opción múltiple
  {
    id: "2024_q1",
    examId: "2024",
    topic: "tema-slug",
    type: "mc",
    points: 5,
    question: "¿Qué es...?",
    options: ["A. Opción uno", "B. Opción dos", "C. Opción tres"],
    correctAnswer: "b",
    explanation: "Porque...",
  },

  // Texto / Cálculo
  {
    id: "2024_q2",
    examId: "2024",
    topic: "tema-slug",
    type: "text",
    points: 10,
    question: "Explica...",
    correctAnswer: "Solución modelo...",
    explanation: "Puntos clave...",
  },

  // Emparejamiento
  {
    id: "2024_q3",
    examId: "2024",
    topic: "tema-slug",
    type: "matching",
    points: 5,
    question: "Relaciona los conceptos:",
    correctAnswer: {
      "Concepto A": "X",
      "Concepto B": "Y",
    },
    explanation: "A se relaciona con X porque...",
  },
];
```

Campos obligatorios de cada pregunta: `id`, `examId`, `topic`, `type`, `points`, `question` y `correctAnswer`. `examId` debe ser un `string` que coincida exactamente con un único `Exam.id` de `meta.ts`; una pregunta no puede pertenecer a varios exámenes.

Los recuentos de preguntas y puntos que muestra la interfaz se calculan desde `questions.ts`. No añadas un campo `description` al examen para repetir esos datos. La puntuación total de un examen es la suma de los `points` de sus preguntas y el umbral de aprobado es el 50% de esa nota; usa `passPercentage` (fracción 0-1) en el examen solo si el umbral real es distinto.

Campos opcionales: `development`, `explanation`, `image`, `explanationImage`, `table`, `subquestions`, `options` (requerido para `mc`) y `repeated`.

- `development` — desarrollo matemático o razonamiento paso a paso en Markdown. Se muestra en un panel desplegable después de mostrar el resultado de preguntas `fill` y `table-fill`.

- `explanation` — nota explicativa mostrada al abrir soluciones. En `mc` y `matching`, si se omite y no hay `explanationImage`, no aparece el botón "Abrir soluciones". En `text`, la solución modelo sale de `correctAnswer` y `explanation` solo añade contexto extra.

- `repeated?: boolean` — por defecto `false`. Marca como `true` cuando la pregunta ya apareció en un examen anterior de forma igual o similar. Solo es una etiqueta visual para avisar al usuario.

**Bloques de código:** Los campos de texto (`question`, `development`, `explanation`, `correctAnswer`, `subquestions`, `options` y celdas de tabla) soportan formato markdown:

- `` `código inline` `` — se renderiza como `<code>` con fuente monoespaciada y texto rosa sobre fondo gris.
- ` ``` ` bloques de código — se renderizan como un bloque de código oscuro. Funciona en `question`, `development`, `explanation` y `correctAnswer`.

Ejemplo:

```ts
question: `¿Qué imprime este código?

\`\`\`
def foo(x):
    if x <= 1:
        return 1
    return x * foo(x - 1)

print(foo(5))
\`\`\`

Pista: recuerda que \`foo()\` se llama recursivamente.`,
```

**Preguntas repetidas:** Asigna cada pregunta a su examen real mediante `examId`. Si esa pregunta o una variante casi idéntica ya apareció en un examen de un año anterior, marca `repeated: true` como indicador visual. `repeated` no cambia la selección de exámenes ni hace que una pregunta aparezca en otros exámenes.

#### 4. Añade PDFs autorizados, si los hay

Copia únicamente PDFs que puedan compartirse públicamente o con autorización a `public/exams/{subject-id}/`:

```
public/exams/{subject-id}/Exam-2024.pdf
```

La convención es `Exam-{id}.pdf`. Si un examen o recopilatorio no tiene PDF autorizado, marca `hasPdf: false` en su entrada de `meta.ts` para que el enlace de descarga no aparezca. Si ningún elemento tiene PDF, la sección entera se oculta automáticamente.

#### 5. Añade imágenes (si las hay)

Si alguna pregunta referencia figuras o gráficos (en el enunciado o en la solución):

1. Recorta la figura del PDF
2. Guárdala en `src/subjects/{subject-id}/assets/`
3. Configura la carga automática de imágenes al inicio de `questions.ts`:

```ts
import type { Picture } from "vite-imagetools";
import { getImage } from "../../lib/image";
import type { ImageMap } from "../../lib/image";

const imageMap = import.meta.glob<{ default: Picture }>(
  "./assets/*.{png,jpeg,jpg}",
  {
    query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" },
    eager: true,
  },
) as ImageMap;
```

4. Referencia las imágenes por nombre de fichero en las preguntas:

```ts
{
  image: getImage(imageMap, "figura-1.png"),
  explanationImage: getImage(imageMap, "solucion-1.png"),
}
```

- `image`: se muestra en el cuerpo de la pregunta, antes de las opciones de respuesta.
- `explanationImage`: se muestra dentro del panel de solución colapsable (disponible para todos los tipos de pregunta: mc, text, matching).
- Las imágenes se optimizan automáticamente (múltiples tamaños y formatos: AVIF, WebP, PNG).

#### 6. Registra la asignatura en `_visibility.ts`

Edita `src/subjects/_visibility.ts` y añade dos líneas para tu asignatura:

```ts
import { meta as tuAsignaturaMeta } from "./tu-asignatura/meta";
import { questions as tuAsignaturaQuestions } from "./tu-asignatura/questions";
// ... y añade los void correspondientes:
void tuAsignaturaMeta;
void tuAsignaturaQuestions;
```

Este archivo existe para que herramientas de análisis estático como React Doctor vean que los exports de cada asignatura se consumen. La carga real en tiempo de ejecución la hace `import.meta.glob` en `index.ts`.

#### 7. Verifica

```bash
pnpm dev
```

La asignatura debe aparecer en la pantalla principal y todas las funcionalidades deben funcionar.

### Flujo de trabajo para añadir preguntas desde material autorizado

1. Comprueba que tienes permiso para usar el material o redacta preguntas originales basadas en el temario
2. Abre el PDF autorizado o tus notas e identifica cada pregunta
3. Clasifícala como `mc`, `text` o `matching`
4. Asígnale un tema de tu array `topics` en `meta.ts`
5. Para MC: escribe opciones originales o autorizadas, marca la letra correcta
6. Para text: escribe una solución modelo
7. Para matching: crea el mapeo ítem → letra
8. Incluye notas explicativas en `explanation` cuando aporten contexto adicional

## Estructura del proyecto

```
src/
├── subjects/
│   ├── index.ts              # Auto-descubrimiento (no editar)
│   ├── _visibility.ts        # Registro de visibilidad para análisis estático (editar al añadir asignatura)
│   ├── _template/            # Plantilla para nuevas asignaturas
│   │   ├── meta.ts
│   │   └── questions.ts
│   ├── eseo/                 # Sistemas Operativos (FIC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── esei/                 # Sistemas Intelixentes (FIC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── cepe/                 # Concorrencia e Paralelismo (FIC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── ece/                  # Estrutura de Computadores (FIC)
│   │   ├── meta.ts
│   │   └── questions.ts
│   ├── equisi/               # Xestión de Infraestruturas (FIC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── equispe/              # Xestión de Proxectos (FIC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── iesede/               # Internet y Sistemas Distribuidos (FIC)
│   │   ├── meta.ts
│   │   └── questions.ts
│   └── pei/                  # Programación Integrativa (FIC)
│       ├── meta.ts
│       └── questions.ts
├── components/               # Componentes UI compartidos
│   ├── Header.tsx
│   ├── SubjectCard.tsx
│   ├── TopicCard.tsx
│   ├── QuestionCard.tsx
│   ├── AddExamModal.tsx
│   └── AddSubjectModal.tsx
├── pages/                    # Páginas por ruta
│   ├── Home.tsx
│   ├── SubjectHome.tsx
│   ├── PracticeTopic.tsx
│   └── ExamSimulation.tsx
├── data/
│   ├── types.ts              # Definiciones de tipos
│   └── store.ts              # Persistencia en localStorage
├── i18n/                     # Traducciones (en/es/gl)
│   ├── en.ts
│   ├── es.ts
│   └── gl.ts
├── lib/
│   ├── markdown.tsx          # Renderizado de código inline y bloques
│   ├── haptics.ts            # Feedback háptico
│   └── umami.ts              # Analytics wrapper
└── App.tsx                   # Componente raíz con rutas

public/
├── favicon.svg
├── og.jpg
└── exams/                    # PDFs autorizados; no todas las asignaturas tienen PDFs
    ├── cepe/
    ├── ece/
    ├── equisi/
    └── eseo/
```

## Comandos

```bash
pnpm dev       # Servidor Vite con HMR; carga react-grab solo en desarrollo
pnpm build     # tsc -b + sitemap + IndexNow opcional + build de producción
pnpm lint      # ESLint flat config para TS/TSX; ignora scripts/
pnpm format    # Prettier --write
pnpm preview   # Preview del build de producción
pnpm doctor    # React Doctor
```

No hay script `test` ni `typecheck` separado: `pnpm build` es la verificación de tipos. El build reescribe `public/sitemap.xml` y solo genera `public/${INDEXNOW_KEY}.txt` si `INDEXNOW_KEY` está definido.

## Checklist para Pull Requests

- [ ] El ID de la asignatura es kebab-case y coincide con la carpeta
- [ ] Todas las `topic` en `questions.ts` existen en `meta.ts`
- [ ] Todas las preguntas tienen un `examId` que coincide con exactamente un `Exam.id`
- [ ] Las preguntas MC tienen opciones y una letra válida (`"a"`–`"e"`)
- [ ] Los bloques de código usan `\`\`\`` en template literals de TypeScript
- [ ] El contenido es original, autorizado o procede de una fuente pública compatible
- [ ] Los PDFs autorizados están en `public/exams/{subject-id}/` o los elementos sin PDF tienen `hasPdf: false`
- [ ] Las imágenes están en `src/subjects/{subject-id}/assets/` e importadas correctamente (usa `image` para el enunciado y `explanationImage` para la solución)
- [ ] Las preguntas repetidas están marcadas con `repeated: true`
- [ ] Si añadiste una asignatura, sus exports están registrados en `src/subjects/_visibility.ts`
- [ ] `pnpm build` compila sin errores
- [ ] `pnpm lint` pasa
- [ ] `pnpm doctor` (React Doctor) no reporta nuevos problemas
- [ ] La asignatura carga correctamente en `pnpm dev`
