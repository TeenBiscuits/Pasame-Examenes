---
name: New-Subject
description: Vas a añadir una nueva asignatura al proyecto.
---

Vas a añadir una nueva asignatura al proyecto. Sigue ESTRICTAMENTE estas fases
y NO inventes ni parafrasees texto en ningún momento. El texto de enunciados,
opciones y soluciones SIEMPRE debe ser literal del markdown OCR.

────────────────────────────────────────────────────────
FASE 0 — Recopilar datos (USA LA HERRAMIENTA `question`)
────────────────────────────────────────────────────────
Antes de nada, lee `src/data/types.ts` para conocer las interfaces SubjectMeta,
Topic, MegaTopic, Exam y Question, y revisa `src/subjects/_template/meta.ts` y
`src/subjects/_template/questions.ts` como referencia de formato.

Luego usa la herramienta `question` para pedirme estos datos. Agrupa las
preguntas de forma lógica y no continúes hasta tenerlos todos:

1. SubjectMeta:
   - id (slug en kebab-case; será la carpeta src/subjects/<id>/)
   - name, university, courseCode, icon (emoji)
   - acknowledgments (opcional)
   - Ruta de la carpeta con los escaneos OCR (full.md, pages/, images/)

2. Temas (Topic[]): pregúntame primero cuántos hay y luego, por cada uno:
   key, label, icon, color.
   - Pregúntame si hay megatemas (MegaTopic[]); si sí: key, label y qué
     topics agrupa.

3. Detecta los exámenes mirando las subcarpetas de la ruta OCR y, por cada uno
   (Exam), pregúntame: year, title, date (opcional), passPoints, totalPoints,
   durationMinutes, y si hay PDF original (hasPdf). El campo `description` lo
   generas tú con la convención "<totalPoints> points · <nº preguntas> questions".

Cuando tengas todo, escribe `input/<id>/meta.json` con esos datos, muéstrame un
resumen y pídeme confirmación antes de seguir.

────────────────────────────────────────────────────────
FASE 1 — Detección de layout (por cada examen)
────────────────────────────────────────────────────────

- Lee el `full.md` de cada examen.
- Determina si las respuestas están AL FINAL (Layout A) o INLINE bajo cada
  pregunta (Layout B). Anota y razona brevemente tu decisión.

────────────────────────────────────────────────────────
FASE 2 — Segmentación (NO copies texto, SOLO anclajes y metadatos)
────────────────────────────────────────────────────────
Para cada pregunta genera un objeto en `output/<examen>.questions.json`. Un
ANCLAJE es { "start": "...", "end": "..." } con las primeras y últimas 3-6
palabras EXACTAS del original. Campos:

- id, exam, topic, type ("mc" | "text" | "matching"), points
- question: anclaje
- subquestions: anclaje[] (opcional)
- options: anclaje[] (opcional; para "mc")
- correctAnswer SEGÚN EL TIPO:
  "mc" -> letra de la opción correcta en MINÚSCULA, p.ej. "b"
  (o ["a","c"] si hay varias). NUNCA el texto de la opción.
  "text" -> anclaje al texto literal de la solución.
  "matching" -> array de { "key": anclaje, "label": "A" } donde key es el
  ítem a emparejar (texto literal) y label la etiqueta en
  MAYÚSCULA.
- explanation: anclaje (opcional)
- image / explanationImage: SOLO el nombre del archivo de imagen (p.ej.
  "figura.png"); el archivo debe estar en src/subjects/<id>/assets/.
- table: { headers: string[], rows: string[][] } copiado tal cual (opcional)
- repeated: boolean (opcional)

REGLA: nunca escribas el enunciado, opción o solución completos; solo anclajes
y metadatos. La extracción literal la hace el script en la fase siguiente.

### ⚠️ Errores comunes (lecciones aprendidas)

**Workflow: validar cada examen individualmente, no en lote**: Tras crear el
`questions.json` de UN examen, ejecuta `extract.ts` SÓLO para ese examen
para validar los anclajes ANTES de pasar al siguiente. Si todos fallan, sabes
que el patrón de anclajes está mal y corriges a tiempo. Si acumulas 16
exámenes con errores, diagnosticar es mucho más costoso.

**full.md con varias partes**: Si un examen tiene múltiples bloques (ej.
Concurrencia + Paralelismo), concatena sus markdown en un único `full.md`
ANTES de empezar la segmentación. El script `extract.ts` necesita un solo
archivo por examen.

**Cómo verificar un anclaje manualmente**: Usa Python/normalize para buscar
el texto del anclaje en el markdown normalizado:

```python
import re
def norm(s): return re.sub(r'\s+', ' ', s).strip()
n = norm(open('full.md').read())
print(n.find('texto del anclaje'))  # -1 si no se encuentra
```

**Solución sin marcador**: Si una pregunta de Concurrencia no tiene
"Solución:" explícito (exámenes antiguos), la solución empieza directamente
con el código de implementación. Usa el inicio del código como anclaje
`correctAnswer.start`. El final de la pregunta es la última línea antes del
código.

**Anclajes — Coincidencia exacta**: El script `extract.ts` normaliza whitespace
(`\n` + `\t` + espacios → espacio simple) con `normWS()`, pero NO modifica
NINGÚN otro carácter. Los anclajes deben coincidir EXACTAMENTE con el texto
OCR tras esa normalización. Un carácter de diferencia y no encuentra el anclaje.

**Entidades HTML**: El OCR a veces escapa `>` como `&gt;` y `&` como `&amp;`.
Estas entidades SE PRESERVAN en el markdown. No las decodifiques. El anclaje
debe usar `&gt;` si el texto OCR lo usa.

**Artifacts OCR**: El OCR confunde `&` con `6` en código C (ej. `6bus->m` en vez
de `&bus->m`). Conserva estos artifacts en los anclajes.

**Formato antiguo vs. nuevo** (exámenes pre-2022 vs. 2023+):

- Pre-2022: sin delimitadores ` ```c ` antes del código en soluciones. El
  código va directo tras `# Solución`. Usan coma decimal: `[2,5p]` no `[2.5p]`.
  El carácter `->` es literal, NO `&gt;`.
- 2023+: con ` ```c ` antes del código. Usan punto decimal: `[2.5p]`.
  El `>` en código aparece como `&gt;`.

**Primera solución**: La primera ocurrencia de `Solución:`, `# Solución`,
`## Solución` en el documento es SIEMPRE de la pregunta 1. Para preguntas
posteriores, el anclaje `correctAnswer.start` debe incluir suficiente contexto
ÚNICO antes de "Solución:" para no coincidir con ocurrencias anteriores.

**Fin de pregunta (`question.end`)**: Debe ser el ÚLTIMO texto EXACTO antes
del marcador de solución. A menudo es una línea de declaración de función,
el cierre de un bloque de código, o la última frase de la descripción.

**Backslashes en LaTeX**: `\times`, `\frac`, `\_` etc. deben escaparse en JSON
como `\\times`, `\\frac`, `\\_`.

**Imágenes con nombres duplicados**: Diferentes exámenes tienen archivos
`img-0.jpeg`, `img-1.jpeg` etc. en carpetas distintas. La función
`getImage(imageMap, "img-0.jpeg")` falla por conflicto de nombres. Solución:
renombrar a `{exam-slug}_img-0.jpeg` antes de copiar a `assets/` y actualizar
las referencias. Si la imagen está embebida en el texto vía
`![img-0.jpeg](img-0.jpeg)`, se extrae como parte del enunciado pero NO se
resuelve como asset web.

────────────────────────────────────────────────────────
FASE 3 — Extracción literal + validación
────────────────────────────────────────────────────────
Ejecuta:

npx tsx scripts/extract.ts <id> \
 <full.md_examen1> output/<examen1>.questions.json \
 <full.md_examen2> output/<examen2>.questions.json ...

El script recorta el texto VERBATIM del full.md con los anclajes, valida los
tipos con Zod, emite las imágenes como getImage(imageMap, "...") y escribe
`src/subjects/<id>/questions.ts`. Si reporta anclajes no encontrados o errores
de tipo, NO los inventes: muéstramelos para revisión manual.

────────────────────────────────────────────────────────
FASE 4 — Generar meta.ts
────────────────────────────────────────────────────────
Ejecuta:

npx tsx scripts/generate-meta.ts input/<id>/meta.json

Genera `src/subjects/<id>/meta.ts` (SubjectMeta) con el mismo formato que el
template.

────────────────────────────────────────────────────────
FASE 5 — Imágenes y PDFs
────────────────────────────────────────────────────────

- Copia las imágenes referenciadas desde la carpeta OCR images/ a
  src/subjects/<id>/assets/ con el mismo nombre usado en los anclajes.
- Si algún examen tiene PDF original, colócalo en public/exams/<id>/ y asegúrate
  de que su Exam tenga hasPdf: true.

────────────────────────────────────────────────────────
FASE 6 — Verificación final
────────────────────────────────────────────────────────

- Ejecuta `npx tsc --noEmit` para confirmar que questions.ts y meta.ts compilan
  contra los tipos reales.
- NO edites src/subjects/index.ts (auto-descubrimiento).
- Resume: nº de preguntas extraídas, nº con dudas para revisión, exámenes
  procesados e imágenes copiadas.
