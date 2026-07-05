# Contribuir a Pásame Exámenes

¡Gracias por ayudar a hacer crecer esta plataforma open source de práctica de exámenes!

## Cómo contribuir

### Reportar errores en preguntas

Cada pregunta tiene un enlace **"Report Issue"** en la vista de revisión. Úsalo para abrir un issue pre-rellenado con el ID de la pregunta y la asignatura.

### Añadir una nueva asignatura

#### 1. Copia la plantilla

```bash
cp -r src/subjects/_template src/subjects/{subject-id}
```

Usa kebab-case para el nombre de la carpeta: `calculus-1`, `operating-systems`, `machine-learning`.

#### 2. Edita `meta.ts`

```ts
import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "subject-id", // debe coincidir con el nombre de la carpeta
  name: "Nombre Asignatura",
  university: "Universidad",
  courseCode: "ABC123",
  icon: "📚",
  acknowledgments:
    "Preguntas proporcionadas por el departamento de... Respuestas por...", // opcional, se muestra al final de la página
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
      year: "2024", // string, usado en la URL /exam/2024
      title: "Examen 2024",
      date: "2024", // opcional, fecha legible mostrada en las preguntas (ej. "Enero 2024", "June 2025", "2024")
      description: "60 puntos · 15 preguntas",
      passPoints: 30,
      totalPoints: 60,
      durationMinutes: 180,
      hasPdf: true, // opcional, valor por defecto true. Pon false si no hay PDF
    },
  ],
};
```

#### 3. Añade las preguntas en `questions.ts`

> [!TIP]
> Puedes extraer preguntas de cualquier daypo en formato `Question[]` usando [`scripts/daypo_scraper.ts`](scripts/daypo_scraper.ts):
> ```bash
> pnpm tsx scripts/daypo_scraper.ts https://www.daypo.com/mi-test.html --topic mi-tema --exam 2024 -o src/subjects/mi-asignatura/preguntas.ts
> ```

Exporta un array `Question[]`. Tipos de pregunta:

- **`mc`** — Opción múltiple. `correctAnswer` es una letra `"a"`–`"e"`. Requiere `options[]`. Corrección automática.
- **`text`** — Respuesta libre. `correctAnswer` es la solución modelo. Auto-evaluada por el usuario; `explanation` puede añadir notas extra.
- **`matching`** — Emparejar conceptos (incluye verdadero/falso con `"V"`/`"F"`). `correctAnswer` es un `Record<string, string>`. Corrección automática.

```ts
import type { Question } from "../../data/types";

export const questions: Question[] = [
  // Opción múltiple
  {
    id: "2024_q1",
    exam: "2024",
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
    exam: "2024",
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
    exam: "2024",
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

Campos opcionales: `explanation`, `image`, `explanationImage`, `table`, `subquestions`, `options` (requerido para `mc`), `repeated`.

- `explanation` — nota explicativa mostrada al abrir soluciones. En `mc` y `matching`, si se omite y no hay `explanationImage`, no aparece el botón "Abrir soluciones". En `text`, la solución modelo sale de `correctAnswer` y `explanation` solo añade contexto extra.

- `repeated?: boolean` — por defecto `false`. Marca como `true` cuando la misma pregunta aparece en varios exámenes. Se muestra una etiqueta "Repetida" en la interfaz.

**Bloques de código:** Los campos de texto (`question`, `explanation`, `correctAnswer`, `subquestions`, `options` y celdas de tabla) soportan formato markdown:

- `` `código inline` `` — se renderiza como `<code>` con fuente monoespaciada y texto rosa sobre fondo gris.
- ` ``` ` bloques de código — se renderizan como un bloque de código oscuro. Funciona en `question`, `explanation` y `correctAnswer`.

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

**Preguntas compartidas entre exámenes:** Usa `exam: "both"` para que una pregunta aparezca en todos los exámenes de la asignatura.

**Preguntas repetidas:** Si una misma pregunta (o una variante casi idéntica) aparece en varios exámenes con distinto `exam`, marca `repeated: true` en cada ocurrencia. La interfaz mostrará un contador de repetidas en la página de la asignatura.

#### 4. Añade los PDFs de los exámenes

Copia los PDFs originales a `public/exams/{subject-id}/`:

```
public/exams/{subject-id}/Exam-2024.pdf
```

La convención es `Exam-{year}.pdf`. Si un examen no tiene PDF, marca `hasPdf: false` en su entrada de `meta.ts` para que el enlace de descarga no aparezca. Si ningún examen tiene PDF, la sección entera se oculta automáticamente.

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

### Flujo de trabajo para extraer preguntas de PDFs

1. Abre el PDF e identifica cada pregunta
2. Clasifícala como `mc`, `text` o `matching`
3. Asígnale un tema de tu array `topics` en `meta.ts`
4. Para MC: escribe las opciones exactamente como aparecen, marca la letra correcta
5. Para text: escribe una solución modelo
6. Para matching: crea el mapeo ítem → letra
7. Incluye notas explicativas en `explanation` cuando aporten contexto adicional

## Estructura del proyecto

```
src/
├── subjects/
│   ├── index.ts              # Auto-descubrimiento (no editar)
│   ├── _visibility.ts        # Registro de visibilidad para análisis estático (editar al añadir asignatura)
│   ├── _template/            # Plantilla para nuevas asignaturas
│   │   ├── meta.ts
│   │   └── questions.ts
│   ├── eseo/                 # Sistemas Operativos (UDC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── esei/                 # Sistemas Intelixentes (UDC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── cepe/                 # Concorrencia e Paralelismo (UDC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── ece/                  # Estrutura de Computadores (UDC)
│   │   ├── meta.ts
│   │   └── questions.ts
│   ├── emeele/               # Machine Learning (LNU)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── equisi/               # Xestión de Infraestruturas (UDC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── equispe/              # Xestión de Proxectos (UDC)
│   │   ├── meta.ts
│   │   ├── questions.ts
│   │   └── assets/
│   ├── iesede/               # Internet y Sistemas Distribuidos (UDC)
│   │   ├── meta.ts
│   │   └── questions.ts
│   └── pei/                  # Programación Integrativa (UDC)
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
└── exams/                    # PDFs originales; no todas las asignaturas tienen PDFs
    ├── cepe/
    ├── ece/
    ├── emeele/
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
- [ ] Las preguntas MC tienen opciones y una letra válida (`"a"`–`"e"`)
- [ ] Los bloques de código usan `\`\`\`` en template literals de TypeScript
- [ ] Los PDFs están en `public/exams/{subject-id}/` o los exámenes sin PDF tienen `hasPdf: false`
- [ ] Las imágenes están en `src/subjects/{subject-id}/assets/` e importadas correctamente (usa `image` para el enunciado y `explanationImage` para la solución)
- [ ] Las preguntas repetidas están marcadas con `repeated: true`
- [ ] Si añadiste una asignatura, sus exports están registrados en `src/subjects/_visibility.ts`
- [ ] `pnpm build` compila sin errores
- [ ] `pnpm lint` pasa
- [ ] `pnpm doctor` (React Doctor) no reporta nuevos problemas
- [ ] La asignatura carga correctamente en `pnpm dev`
