[![Pásame Exámenes](./public/og.jpg)](https://pe.pablopl.dev)

# <a href="https://pe.pablopl.dev"><img src="https://raw.githubusercontent.com/TeenBiscuits/Pasame-Examenes/refs/heads/main/public/favicon.svg" alt="" align="left" width="40" height="40"></a> Pásame Exámenes

<div align="center">

[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)
[![Pull Request](https://img.shields.io/github/issues-pr-closed/TeenBiscuits/Pasame-Examenes.svg?label=Pull%20Request)](https://github.com/TeenBiscuits/Pasame-Examenes/pulls)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE.md)
[![Stars](https://img.shields.io/github/stars/TeenBiscuits/Pasame-Examenes.svg)](https://github.com/TeenBiscuits/Pasame-Examenes)

</div>

<div align="center">
<br/>
<b>Pásame Exámenes</b> es una plataforma open source para practicar exámenes universitarios por tema o simular el examen completo con temporizador y autocorrección.
<br/>
</div>

<div align="center">
<h3><a  href="https://pe.pablopl.dev">👉 pe.pablopl.dev 🌐</a></h3>
</div>

## Cómo funciona

Cada asignatura es una carpeta autónoma dentro de `src/subjects/`. Solo necesitas crear la carpeta con dos archivos (`meta.ts` y `questions.ts`) y la asignatura aparece automáticamente en la web. No hay backend: todos los datos son archivos TypeScript y el progreso se guarda en `localStorage`.

### Modo Práctica

Elige un tema y practica pregunta a pregunta. Cada pregunta se corrige individualmente, con explicaciones detalladas y posibilidad de auto-evaluarte en las preguntas abiertas. Tu progreso por tema se guarda automáticamente.

### Modo Examen

Simula el examen real: temporizador en cuenta atrás, puntuación en directo, y auto-entrega opcional. Al terminar, revisas todas las respuestas y ves si apruebas o suspendes.

### Tipos de pregunta

- **Opción múltiple** — 5 opciones, corrección automática
- **Texto / Cálculo** — Respuesta libre, auto-evaluación contra la solución modelo
- **Emparejamiento** — Relaciona conceptos con letras, corrección automática

## Asignaturas

| Asignatura                          | Universidad            | Exámenes      |
| ----------------------------------- | ---------------------- | ------------- |
| 💻 Sistemas Operativos              | Universidade da Coruña | 9 (2020–2024) |
| 🧠 Sistemas Intelixentes            | Universidade da Coruña | 5 (2023-2026) |
| 🤖 Introduction to Machine Learning | Linnaeus University    | 2 (2024–2025) |

## Tecnologías

<div align="center">

[![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router v7](https://img.shields.io/badge/React_Router_v7-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

</div>

## Desarrollo

```bash
pnpm dev       # Servidor de desarrollo con HMR
pnpm build     # Type-check + build de producción
pnpm lint      # ESLint
pnpm preview   # Preview del build de producción
pnpm format    # Prettier
```

## Contribuye ✨

¡Toda contribución es bienvenida! Puedes:

- Añadir **nuevas asignaturas** con sus exámenes
- Corregir **errores** en preguntas existentes
- Reportar **issues** directamente desde cualquier pregunta
- Mejorar la **web** (features, diseño, accesibilidad)

> [!IMPORTANT]  
> Lee la [guía de contribución](./CONTRIBUTING.md) para empezar.

## Licencia

El código de la plataforma se distribuye bajo la licencia **Apache 2.0**. Consulta [LICENSE.md](./LICENSE.md) para más detalles.

Las preguntas y soluciones son contribuciones de la comunidad, pueden cometer errores de los que no nos hacemos responsables, nuestro objetivo es correguir todos los errores posibles, si ves un error [reportalo](https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=report-question.yml).

Consulta cada asignatura para más información.

```js
// Made with love by Pablo Portas López
```
