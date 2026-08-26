# Tipos de pregunta y conversión a TypeScript

Las preguntas se escriben como objetos `Question[]` en `src/subjects/<subject-id>/questions.ts`. El enunciado y las soluciones admiten Markdown, fórmulas LaTeX, tablas y bloques de código.

Cada pregunta necesita estos campos:

```ts
{
	id: "2024_q1",
	examId: "2024",
	topic: "topic-1",
	type: "mc",
	points: 10,
	question: "...",
	correctAnswer: "...",
}
```

Usa el identificador real del examen o recopilatorio en `examId` y una clave válida de `topic`. No copies al campo `question` el número de la pregunta ni su puntuación si ya están representados por `id` y `points`.

## Test

Usa `mc` cuando la pregunta tiene opciones cerradas y una respuesta correcta. `correctAnswer` es la letra en minúscula.

Markdown de origen:

```md
2. [10 puntos] ¿Cuál es la capital de Francia? Marca la respuesta correcta.
- [ ] Londres
- [X] París
- [ ] Berlín
- [ ] Madrid
- [ ] Roma
```

Conversión:

```ts
{
	id: "2024_q1",
	examId: "2024",
	topic: "topic-1",
	type: "mc",
	points: 10,
	question: "¿Cuál es la capital de Francia?",
	options: [
		"A. Londres",
		"B. París",
		"C. Berlín",
		"D. Madrid",
		"E. Roma",
	],
	correctAnswer: "b",
}
```

Puedes añadir `explanation` para mostrar una explicación adicional después de corregir la pregunta.

## Texto

Usa `text` para una respuesta abierta. La solución de referencia va en `correctAnswer` y el estudiante la usa para autoevaluarse.

Markdown de origen:

```md
3. [5 puntos] Explica por qué una caché mejora el rendimiento de un programa.

Solución esperada: reduce el tiempo de acceso al reutilizar datos cercanos o usados recientemente.
```

Conversión:

```ts
{
	id: "2024_q2",
	examId: "2024",
	topic: "arquitectura",
	type: "text",
	points: 5,
	question: "Explica por qué una caché mejora el rendimiento de un programa.",
	correctAnswer:
		"Una caché reduce el tiempo de acceso al reutilizar datos cercanos o usados recientemente.",
}
```

Conserva en `question` el contexto necesario, incluidos Markdown, fórmulas y código. No pongas la solución dentro del enunciado.

## Emparejamiento

Usa `matching` para relacionar cada elemento con una opción. Las claves de `correctAnswer` son los elementos que aparecen en la pregunta y sus valores son las letras de las opciones correctas.

Markdown de origen:

```md
4. [4 puntos] Relaciona cada algoritmo con su complejidad.
- Ordenación burbuja: A. O(n²)
- Búsqueda binaria: B. O(log n)
- Búsqueda lineal: C. O(n)
```

Conversión:

```ts
{
	id: "2024_q3",
	examId: "2024",
	topic: "algoritmos",
	type: "matching",
	points: 4,
	question: "Relaciona cada algoritmo con su complejidad.",
	correctAnswer: {
		"Ordenación burbuja": "A",
		"Búsqueda binaria": "B",
		"Búsqueda lineal": "C",
	},
}
```

El emparejamiento puede recibir puntuación parcial. Usa `explanation` para la explicación o una tabla de soluciones.

## Rellenar huecos

Usa `fill` cuando el estudiante debe escribir una o varias respuestas cortas. Cada entrada de `fillStatements` representa un campo y contiene exactamente un marcador `{{blank}}`.

Markdown de origen:

```md
5. [2 puntos] Completa el cálculo.
a) 2 + 2 = ______
b) 3 × 4 = ______
```

Conversión:

```ts
{
	id: "2024_q4",
	examId: "2024",
	topic: "aritmética",
	type: "fill",
	points: 2,
	question: "Completa el cálculo.",
	fillStatements: [
		{ label: "a)", text: "2 + 2 = {{blank}}" },
		{ label: "b)", text: "3 × 4 = {{blank}}" },
	],
	correctAnswer: ["4", "12"],
}
```

Los valores de `correctAnswer` siguen el orden de `fillStatements`. Puedes añadir `development` para mostrar el procedimiento después de revisar la respuesta.

## Rellenar tablas

Usa `table-fill` cuando los huecos forman parte de una tabla. En `tableFill.rows`, escribe `{{blank}}` solo en las celdas que el estudiante debe completar.

Markdown de origen:

```md
6. [2 puntos] Completa la tabla.

| Expresión | Resultado |
| --- | --- |
| 5 + 3 | ______ |
| 6 × 2 | ______ |
```

Conversión:

```ts
{
	id: "2024_q5",
	examId: "2024",
	topic: "aritmética",
	type: "table-fill",
	points: 2,
	question: "Completa la tabla.",
	tableFill: {
		headers: ["Expresión", "Resultado"],
		rows: [
			["5 + 3", "{{blank}}"],
			["6 × 2", "{{blank}}"],
		],
	},
	correctAnswer: ["8", "12"],
}
```

Las respuestas siguen el orden de las filas y, dentro de cada fila, el orden de las celdas vacías.

## Texto con varias partes

Usa `multiple-text` cuando un enunciado contiene varias preguntas abiertas que deben responderse por separado. `textParts` contiene los apartados y `correctAnswer` contiene una solución modelo por apartado, en el mismo orden.

Markdown de origen:

```md
7. [5 puntos] Responde las siguientes cuestiones.
a) Define una variable.
b) Define una constante. [3 puntos]
```

Conversión:

```ts
{
	id: "2024_q6",
	examId: "2024",
	topic: "programación",
	type: "multiple-text",
	points: 5,
	question: "Responde las siguientes cuestiones.",
	textParts: [
		{ label: "a)", text: "Define una variable." },
		{ label: "b)", points: 3, text: "Define una constante." },
	],
	correctAnswer: [
		"Una variable es un nombre asociado a un valor que puede cambiar durante la ejecución.",
		"Una constante es un nombre asociado a un valor que no cambia durante la ejecución.",
	],
}
```

Los apartados sin `points` comparten a partes iguales los puntos restantes. Cada apartado se autoevalúa por separado y puede incluir `explanationImage`.

## Cuando ningún tipo encaja

El catálogo de tipos puede crecer. Si una pregunta no se adapta bien a un tipo existente, crea un tipo nuevo en lugar de deformar otro.

1. Añade el nuevo identificador a `QuestionType` en `src/data/types.ts`.
2. Define los campos específicos que necesite la pregunta.
3. Añade su renderizado en `src/components/QuestionCard.tsx`.
4. Añade su corrección y cálculo de puntuación en `src/lib/grading.ts`.
5. Incluye un ejemplo en `src/subjects/_template/questions.ts` y actualiza esta guía.
6. Ejecuta `pnpm check`, `pnpm typecheck` y `pnpm build`.

El nuevo tipo debe representar una estructura de pregunta que no pueda expresarse con claridad usando los tipos actuales.
