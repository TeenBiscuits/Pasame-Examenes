# Tipografía y legibilidad

Revisión: 18 de noviembre de 2026. Alcance: landing, páginas de asignatura y tarjetas de pregunta en escritorio y móvil.

## Objetivo y proceso

Mejorar la jerarquía visual y la lectura sostenida conservando Allo, la identidad gráfica y las paletas existentes.

1. Leer `CONTEXT.md` y el ADR 0001 para distinguir práctica, simulación, examen, recopilatorio y solución modelo.
2. Ejecutar `pnpm exec intent list`. Ninguna skill local corresponde a esta migración CSS; no se descargaron sustitutos de Intent.
3. Aplicar `better-typography` y `better-writing`; contrastar Typeset con documentación oficial y Context7.
4. Inventariar el plugin, las clases `prose`, los renderers personalizados, las traducciones y las caras de Allo realmente instaladas.
5. Revisar el estado inicial en el navegador de T3 Code. Cerrar los avisos de estrella y recorrido para inspeccionar el contenido.
6. Incorporar Typeset y ajustar el ritmo de estudio; comprobar tamaños calculados, saltos, medida y desbordamiento mientras se modifica la interfaz.
7. Validar contenido real y las fixtures existentes de Markdown y los seis tipos de pregunta. Ejecutar tipos, Biome, build y React Doctor.

## Integración de Typeset

- Se elimina `@tailwindcss/typography` de `package.json` y del lockfile.
- `src/typeset.css` contiene el CSS oficial de shadcn/typeset, con su licencia MIT. Procedencia: `apps/v4/app/(app)/(typeset)/typeset.css`, blob `5c44d3352362e846f59e60427563fdc241d2c3d7`. Se conserva como base; la adaptación está separada.
- `src/markdown.css` importa esa base y define `typeset-study`, los tokens de las paletas y la medida de lectura.
- `Markdown` usa `typeset typeset-study`; los renderers de código y tablas usan `not-typeset`, porque ya tienen resaltado, bordes y scroll propios.
- `max-w-prose` sigue siendo una utilidad de anchura de Tailwind; no depende del plugin retirado.
- Typeset vive en la capa `components`. Las utilidades locales siguen pudiendo sobrescribirlo.

El preset de estudio fija `--typeset-size: 1rem`, `--typeset-leading: 1.6` y `--typeset-flow: 0.85em`. Se neutraliza su multiplicador móvil para conservar 16 px tanto en teléfonos como en escritorio con la configuración habitual del navegador. El tamaño sigue aumentando cuando cambia el tamaño base del lector.

La medida máxima del contenido Markdown es 70ch; el contenedor puede reducirla. El código, las tablas y las fórmulas anchas se desplazan dentro de su propio bloque. Las tablas conservan sus elementos HTML nativos.

## Escala y reglas de uso

Los roles compartidos están en `src/styles.css`, dentro de `components`:

| Rol | Tamaño | Peso | Interlineado | Uso |
| --- | --- | --- | --- | --- |
| `type-display` | 2.25–3.75rem fluido | 650 | 1.12 | Nombre de la web y de la asignatura |
| `type-intro` | 1–1.125rem fluido | heredado, 400 | 1.6 | Introducción, máximo 60ch |
| `type-section` | 1.25–1.5rem fluido | 650 | 1.3 | Secciones y título de práctica |
| `type-card-title` | 1.0625rem | 600 | 1.4 | Asignaturas, temas y exámenes |
| `type-answer` | 1rem | heredado, 400 | 1.6 | Opciones y apartados de respuesta |
| `typeset-study` | 1rem | heredado, 400 | 1.6 | Enunciados, soluciones y desarrollos |

Ajuste posterior: el título de la landing usa 5rem (80 px con base de 16 px) desde `lg` (1024 px), a petición del diseño. En móvil conserva `type-display`; los títulos de asignatura mantienen su escala.

Los encabezados de estudio descienden de 1.25em a 1em. Los niveles profundos no bajan del cuerpo. Los títulos de página usan `balance`, los párrafos y títulos de tarjeta `pretty`. El cuerpo no lleva tracking adicional. Las tarjetas de tema crecen con el título; no tienen altura fija ni truncado de una línea. La sigla de asignatura en el header no se parte.

Los metadatos secundarios usan 12–14 px; no se emplean para soluciones ni instrucciones de lectura sostenida. Las entradas de respuestas son de 1rem. El suavizado se declara una vez en la raíz. Las decoraciones del hero tienen menos opacidad para reducir la interferencia con el texto.

## Allo by Josh Puckett

Se mantiene `allo-font` **1.0.1**, la dependencia que ya tenía el proyecto. Los documentos públicos consultados describen 1.0.3; esta tarea no actualiza los binarios. El CSS instalado registra la variable normal 100–900 y nueve oblicuas reales, 100–900, con `font-display: swap`.

| Capacidad disponible | Decisión |
| --- | --- |
| Peso variable `wght`, 100–900 | Usar `font-weight`, incluidos 650 para display/secciones y 600 para tarjetas. Nunca controlar el peso mediante tags crudos. |
| Tamaño óptico `opsz`, 9–32 | Mantener `font-optical-sizing: auto`, sin fijar el eje. |
| Redondez `ROND`, 0–100 | Conservar 50 en cuerpo, 75 en encabezados y 0 en texto técnico. Requiere `font-variation-settings`. |
| Oblicuas reales | Conservar el import completo y la cursiva editorial donde ya se empleaba. No sintetizar otra familia. |
| `ss01`, a de un piso | Disponible, sin activación global: preserva el dibujo habitual en lectura. |
| `ss02`, desambiguación I/l/1/0 | Ya activo en código, teclas y `.font-mono`; se conserva. |
| `ss03`, cifras abiertas | Disponible para un contexto que lo necesite; no se impone globalmente. |
| `cv01`–`cv04` | Alternativas individuales de 1, 0, l e I, si se necesita un ajuste más estrecho que `ss02`. |
| `cv05` | Cero punteado disponible; el texto técnico conserva el cero barrado. |
| `tnum`, `zero` | Usar propiedades CSS: `tabular-nums` y `slashed-zero`. Cifras tabulares en indicadores técnicos y recuentos de tarjetas; proporcionales en prosa. |
| `frac`, fracciones | No activar globalmente: las expresiones académicas se renderizan con KaTeX. |
| `sups`, `subs`, `numr`, `dnom` | Disponibles para superíndices, subíndices y numeradores/denominadores. Conservar semántica HTML/KaTeX según el contenido. |
| `case` | Puntuación adaptada a mayúsculas disponible para rótulos específicos. |
| `liga`, `calt`, `kern` | Conservar valores normales del navegador en prosa. Desactivar solo alternancias contextuales en código (`no-contextual`) para mantener su lectura literal. El tracking puede desactivar ligaduras. |
| Flechas y símbolos | Hay flechas, operadores matemáticos, monedas, teclas y formas; no sustituyen las fórmulas completas ni los iconos accesibles de la aplicación. |
| Lenguas latinas | Cobertura documentada para español, galego e inglés, entre otras lenguas. |

`.font-mono` usa Allo por decisión previa del proyecto: desambiguación y cifras tabulares no convierten todas sus letras en monoespaciadas. No se ha cambiado esa decisión aquí.

## Revisión de textos

- Introducción más breve y orientada a la acción en español, galego e inglés.
- Se diferencia practicar por tema de simular un examen o recopilatorio; no se promete corrección automática para todas las respuestas.
- En español y galego se unifica «solución modelo» en la interfaz y los metadatos relacionados.
- Se aclaran los tipos de pregunta en las FAQ españolas, incluyendo rellenar tablas.
- Las acciones de añadir asignatura y añadir examen/recopilatorio describen la acción.
- Los recuentos de asignaturas y temas admiten singular en los tres idiomas, evitando «1 temas» o «1 exámenes» en las tarjetas de la landing.
- No se reescriben enunciados ni soluciones académicas originales.

## Hallazgos corregidos

Agrupados por principio; severidad del estado anterior. Las rutas y líneas se refieren al estado revisado.

| Severidad | Localización | Antes | Después | Motivo |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/components/QuestionCard.tsx:1192`, `:237`, `:549`, `:699`; `src/markdown.css:7` | Enunciados a 14 px; soluciones y desarrollo a 12 px | 1rem y 1.6 de interlineado | Suelo de lectura: permite estudiar sin forzar la vista ni reducir las explicaciones a notas |
| MEDIUM | `src/components/QuestionCard.tsx:324`, `:629`, `:762`, `:1057` | Respuestas a 14 px y ritmo desigual | Rol común `type-answer` | Jerarquía: respuesta y pregunta tienen una escala de lectura coherente |
| MEDIUM | `src/pages/Home.tsx:88`, `src/pages/SubjectHome.tsx:291`, `src/styles.css:1554` | Tamaños y ritmos elegidos por componente | Roles compartidos con tamaños fluidos y medida explícita | Escala y medida: títulos e introducciones se adaptan sin líneas demasiado largas |
| MEDIUM | `src/components/TopicCard.tsx:94`, `:113`; `src/pages/PracticeTopic.tsx:165`, `src/pages/ExamSimulation.tsx:302` | Títulos truncados; tarjeta con altura fija | Títulos completos y altura adaptable | Lectura y recuperación: el nombre se puede leer también sin hover |
| MEDIUM | `src/markdown.css:26` | El h1 base de Typeset dominaba el título de práctica en móvil | Encabezados de estudio de 20/18/17/16 px con base de 16 px | Jerarquía descendente en el contexto de estudio |
| LOW | `src/components/QuestionCard.tsx:1177`, `:1233`; `src/components/Header.tsx:33` | Metadatos de 10 px; siglas partidas | Mínimo 12 px en esos metadatos y sigla sin salto | Legibilidad de rótulos técnicos |
| LOW | `src/components/SubjectCard.tsx:56`, `src/components/FaqSection.tsx:49`, `src/pages/SubjectHome.tsx:723` | Grado truncado y bloques explicativos pequeños/largos | Grado completo, FAQ a 1rem y notas con medida limitada | Medida, reflujo y lectura sostenida |

## Verificación y límites

Navegador utilizado: **T3 Code**, servidor local Vite en puerto 3000. Se inspeccionaron imágenes y estilos calculados, no solo el código.

| Superficie | Comprobación | Resultado |
| --- | --- | --- |
| `/es` | Escritorio 1440×900; móvil 390×844 y 320×740 | Sin desbordamiento horizontal; título, introducción y tarjetas legibles; singular «1 examen» |
| `/es/iesede` | 1440×900 y 320×740 | Nombre largo completo; tema y recopilatorios sin recorte; scrollWidth igual al viewport |
| `/es/deese/practice/intro-y-objetos` | 390×844 y 1440×900; enviar práctica y abrir solución | Enunciado y explicación calculados a 16 px / 25.6 px; código con scroll interno |
| `/es/_template/practice/markdown-complete` | 320×740 y 1440×900; claro y oscuro | Listas, cita, tabla, código, notas, cursiva, enlace y KaTeX visibles; sin desbordar la página |
| `/es/_template/practice/question-types` | Recorrer los seis tipos a 320×740, oscuro | Test, texto, emparejamiento, huecos, tabla y texto por partes sin desbordamiento; entradas a 16 px |
| Fuente cargada | `document.fonts` y estilos calculados | Allo variable normal cargada; ROND 75 en título; familia Allo en cuerpo |
| `pnpm typecheck` | TypeScript | Pasa |
| Biome sobre archivos modificados | Formato y lint | Pasa |
| `pnpm build` | Build y prerender | Pasa, 46 páginas |
| `npx react-doctor@latest --verbose --scope changed` | Diagnóstico React de cambios | 100/100, sin hallazgos en el pase ejecutado |
| `git diff --check` | Espacios y conflicto de diff | Pasa |

**Not verified:** Safari/iOS en dispositivo real, zoom real del navegador al 200 %, todas las paletas individuales, cada pregunta del catálogo y recorrido visual completo de inglés/galego. El sistema conserva rem, tokens y traducciones, pero eso no equivale a certificar esas combinaciones. La reproducción se hace con las fixtures existentes; no se añaden tests que dupliquen declaraciones CSS.

Resultado: **Approve** para las superficies y tamaños inspeccionados; no quedan hallazgos HIGH en esa cobertura. Las verificaciones pendientes no están aprobadas por extensión.

## Referencias

- [Typeset: integración, presets y exclusiones](https://ui.shadcn.com/docs/typeset.md).
- [CSS de origen](https://github.com/shadcn-ui/ui/blob/main/apps/v4/app/(app)/(typeset)/typeset.css).
- [Allo by Josh Puckett](https://allo.joshpuckett.me).
- [Guía para agentes de Allo](https://allo.joshpuckett.me/llms.txt).
- [README de Allo: ejes y funciones OpenType](https://raw.githubusercontent.com/joshpuckett/allo/refs/heads/main/README.md).

## Corrección posterior: alineación de tarjetas de tema

En Redes, a 1024 px, una fila mezcla títulos de una y dos líneas. El `flex-1` del pie coloreado absorbía la diferencia: 74 px de pie en una tarjeta corta frente a 50 px en una larga. La altura exterior era igual, pero las divisiones, los puntos y las barras no quedaban alineados.

Se traslada `flex-1` a la cabecera y se aplica `shrink-0` al pie. Cada fila de la cuadrícula conserva su altura natural y el espacio sobrante queda bajo el título. No se fijan alturas de texto ni se truncan los títulos.

Verificado con T3 Code en `/es/redes`: a 1024 px, los seis primeros pies miden 50 px y las divisiones coinciden por fila; a 768 px se mantiene la alineación en dos columnas; a 320 px los títulos siguen completos y no hay desbordamiento horizontal. Biome y `git diff --check` pasan.

## Corrección posterior: bloques anidados

Comentario de revisión válido en `src/markdown.css:66`: el selector de hijo directo solo añadía margen a los wrappers de código y tablas en la raíz. Dentro de listas y citas, `not-typeset` excluía también el espaciado de Typeset y los wrappers quedaban pegados al párrafo anterior.

Reproducido en T3 Code con el renderer real, ampliando la fixture `markdown-complete_q1` con código y tablas dentro de listas numeradas y citas, además de código y tabla como primer elemento de una cita. Antes: cuatro wrappers anidados posteriores a un párrafo con `margin-block-start: 0px`; los wrappers directos tenían 13.6 px.

Se cambia el selector a descendiente y se conserva el reinicio del primer hijo de `.markdown-body`. Se añade el reinicio de wrappers que sean primer hijo de su contenedor, porque `not-typeset` también los excluye de ese reinicio en Typeset.

Verificación en T3 Code a 1440 px y 320 px: los cuatro wrappers anidados posteriores a párrafos tienen 13.6 px; los dos wrappers que abren una cita mantienen 0 px; los wrappers directos posteriores a contenido conservan 13.6 px. Sin desbordamiento de página en móvil. Biome, TypeScript y `git diff --check` pasan. La fixture queda en la asignatura interna de prueba para repetir la revisión.
