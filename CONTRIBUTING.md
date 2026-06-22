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
  topics: [
    {
      key: "tema-slug",
      label: "Nombre del Tema",
      icon: "📌",
      color: "blue", // blue, indigo, green, purple, pink, amber, red, cyan, orange
    },
  ],
  exams: [
    {
      year: "2024", // string, usado en la URL /exam/2024
      title: "Examen 2024",
      description: "60 puntos · 15 preguntas",
      passPoints: 30,
      totalPoints: 60,
      durationMinutes: 180,
    },
  ],
};
```

#### 3. Añade las preguntas en `questions.ts`

Exporta un array `Question[]`. Tipos de pregunta:

- **`mc`** — Opción múltiple. `correctAnswer` es una letra `"a"`–`"e"`. Requiere `options[]`.
- **`text`** — Respuesta libre. Auto-evaluada por el usuario contra la solución modelo.
- **`calculation`** — Igual que text, pero etiquetado como cálculo.
- **`matching`** — Emparejar conceptos. `correctAnswer` es un `Record<string, string>`.

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

Campos opcionales: `image`, `imageWidth`, `imageHeight`, `table`, `subquestions`.

#### 4. Añade los PDFs de los exámenes

Copia los PDFs originales a `public/exams/{subject-id}/`:

```
public/exams/{subject-id}/Exam-2024.pdf
```

La convención es `Exam-{year}.pdf`.

#### 5. Añade imágenes (si las hay)

Si alguna pregunta referencia figuras o gráficos:

1. Recorta la figura del PDF
2. Guárdala en `src/subjects/{subject-id}/assets/`
3. Impórtala y referénciala en `questions.ts`:

```ts
import figura1 from "./assets/figura-1.png";

{
  // ...
  image: figura1,
  imageWidth: 800,
  imageHeight: 400,
}
```

#### 6. Verifica

```bash
pnpm dev
```

La asignatura debe aparecer en la pantalla principal y todas las funcionalidades deben funcionar.

### Flujo de trabajo para extraer preguntas de PDFs

1. Abre el PDF e identifica cada pregunta
2. Clasifícala como `mc`, `text`, `calculation` o `matching`
3. Asígnale un tema de tu array `topics` en `meta.ts`
4. Para MC: escribe las opciones exactamente como aparecen, marca la letra correcta
5. Para text/calculation: escribe una solución modelo
6. Para matching: crea el mapeo ítem → letra
7. Incluye notas explicativas en `explanation`

## Estructura del proyecto

```
src/
├── subjects/
│   ├── index.ts              # Auto-descubrimiento (no editar)
│   ├── _template/            # Plantilla para nuevas asignaturas
│   ├── eseo/                 # Sistemas Operativos (UDC)
│   │   ├── meta.ts
│   │   └── questions.ts
│   └── emeele/              # Machine Learning (LNU)
│       ├── meta.ts
│       ├── questions.ts
│       └── assets/
├── components/               # Componentes UI compartidos
│   ├── Header.tsx
│   ├── SubjectCard.tsx
│   ├── TopicCard.tsx
│   └── QuestionCard.tsx
├── pages/                    # Páginas por ruta
│   ├── Home.tsx
│   ├── SubjectHome.tsx
│   ├── PracticeHome.tsx
│   ├── PracticeTopic.tsx
│   └── ExamSimulation.tsx
├── data/
│   ├── types.ts              # Definiciones de tipos
│   └── store.ts              # Persistencia en localStorage
├── i18n/                     # Traducciones (en/es)
│   ├── en.ts
│   └── es.ts
├── lib/
│   └── umami.ts              # Analytics wrapper
└── App.tsx                   # Componente raíz con rutas

public/
├── favicon.svg
├── og.jpg
└── exams/                    # PDFs originales
    ├── eseo/
    └── emeele/
```

## Comandos

```bash
pnpm dev       # Servidor de desarrollo
pnpm build     # Type-check + build de producción
pnpm lint      # ESLint
pnpm preview   # Preview del build
pnpm format    # Prettier
```

## Checklist para Pull Requests

- [ ] El ID de la asignatura es kebab-case y coincide con la carpeta
- [ ] Todas las `topic` en `questions.ts` existen en `meta.ts`
- [ ] Las preguntas MC tienen exactamente 5 opciones y una letra válida
- [ ] Los PDFs están en `public/exams/{subject-id}/`
- [ ] Las imágenes están en `src/subjects/{subject-id}/assets/` e importadas correctamente
- [ ] `pnpm build` compila sin errores
- [ ] `pnpm lint` pasa
- [ ] La asignatura carga correctamente en `pnpm dev`
