[![Pásame Exámenes](./public/og.jpg)](https://pe.pablopl.dev/?utm_source=github-readme&utm_medium=social&utm_campaign=public-launch)

# <a href="https://pe.pablopl.dev/?utm_source=github-readme&utm_medium=social&utm_campaign=public-launch"><img src="https://raw.githubusercontent.com/TeenBiscuits/Pasame-Examenes/refs/heads/main/public/favicon.svg" alt="" align="left" width="40" height="40"></a> Pásame Exámenes

<div align="center">

[![React 19](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript 6](https://img.shields.io/badge/TypeScript_6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router v7](https://img.shields.io/badge/React_Router_v7-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![i18n](https://img.shields.io/badge/i18n-en_|_es_|_gl-34d399)](https://github.com/TeenBiscuits/Pasame-Examenes)
[![driver.js](https://img.shields.io/badge/driver.js-FF5722)](https://driverjs.com)
[![web-haptics](https://img.shields.io/badge/web--haptics-yellow)](https://haptics.lochie.me)
[![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel&logoColor=white)](https://vercel.com)
[![Pull Request](https://img.shields.io/github/issues-pr-closed/TeenBiscuits/Pasame-Examenes.svg?label=Pull%20Request)](https://github.com/TeenBiscuits/Pasame-Examenes/pulls)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE.md)
[![Stars](https://img.shields.io/github/stars/TeenBiscuits/Pasame-Examenes.svg)](https://github.com/TeenBiscuits/Pasame-Examenes)

</div>

<div align="center">
<br/>
<b>Pásame Exámenes</b> es una plataforma open source para practicar preguntas universitarias por tema o en modo cronometrado con temporizador y autocorrección.
<br/>
</div>

<div align="center">
<h3><a  href="https://pe.pablopl.dev/?utm_source=github-readme&utm_medium=social&utm_campaign=public-launch">👉 pe.pablopl.dev 🌐</a></h3>
</div>

## Cómo funciona

Cada asignatura es una carpeta autónoma dentro de `src/subjects/`. Solo necesitas crear la carpeta con dos archivos (`meta.ts` y `questions.ts`) y la asignatura aparece automáticamente en la web. No hay backend: todos los datos son archivos TypeScript y el progreso se guarda en `localStorage`.

### Modo Práctica

Elige un tema y practica pregunta a pregunta. Cada pregunta se corrige individualmente, con explicaciones detalladas y posibilidad de auto-evaluarte en las preguntas abiertas. Tu progreso por tema se guarda automáticamente.

### Modo cronometrado

Practica con temporizador, puntuación en directo y auto-entrega opcional. En asignaturas con exámenes autorizados puede reflejar el formato real; en el resto usa recopilatorios o ejercicios originales con estructura orientativa.

### Tipos de pregunta

- **Opción múltiple** — 5 opciones, corrección automática
- **Texto / Cálculo** — Respuesta libre, auto-evaluación contra la solución modelo
- **Emparejamiento** — Relaciona conceptos con letras, corrección automática

## Asignaturas

| Asignatura                          | Universidad            | Exámenes/etc   |
| ----------------------------------- | ---------------------- | -------------- |
| 💽 Sistemas Operativos              | Universidade da Coruña | 9 (2020–2024)  |
| 🧠 Sistemas Intelixentes            | Universidade da Coruña | 5 (2023–2026)  |
| ⚡ Concorrencia e Paralelismo       | Universidade da Coruña | 16 (2018–2025) |
| 🎨 Deseño de Software               | Universidade da Coruña | 2 (2020-2022)  |
| 💻 Estrutura de Computadores        | Universidade da Coruña | 11 (2021–2026) |
| 🏗️ Xestión de Infraestruturas       | Universidade da Coruña | 4              |
| 📋 Xestión de Proxectos             | Universidade da Coruña | 5 (2024-2026)  |
| 🤖 Introduction to Machine Learning | Linnaeus University    | 2 (2024–2025)  |
| 🕸️ Redes                            | Universidade da Coruña | 3 (2008-2025)  |
| 🔗 Programación Integrativa         | Universidade da Coruña | 1              |
| 🗓️ Proceso Software                 | Universidade da Coruña | 1 (2026)       |
| 🌐 Internet y Sistemas Distribuidos | Universidade da Coruña | 1              |

## Desarrollo

```bash
pnpm dev       # Servidor Vite con HMR; carga react-grab solo en desarrollo
pnpm build     # tsc -b + sitemap + IndexNow + OG images + build producción + páginas estáticas
pnpm lint      # ESLint flat config para TS/TSX; ignora scripts/
pnpm format    # Prettier --write
pnpm preview   # Preview del build de producción
pnpm doctor    # React Doctor
```

No hay script `test` ni `typecheck` separado: `pnpm build` es la verificación de tipos.

### i18n y temas

La plataforma es trilingüe (español, inglés, gallego) con un sistema de i18n propio en `src/i18n/`. Incluye 4 temas visuales (claro, oscuro, rosa, Catppuccin) conmutables desde la interfaz, aplicados mediante `data-theme` en `<html>`.

### Generación de OG images

El build genera automáticamente imágenes Open Graph por asignatura y página principal usando `@napi-rs/canvas`, que los crawlers usan para previsualizaciones en redes sociales.

## Contribuye ✨

¡Toda contribución es bienvenida! Puedes:

- Añadir **nuevas asignaturas** con exámenes autorizados, pruebas, recopilatorios o ejercicios originales
- Corregir **errores** en preguntas existentes
- Reportar **issues** directamente desde cualquier pregunta
- Mejorar la **web** (features, diseño, accesibilidad)

> [!IMPORTANT]  
> Lee la [guía de contribución](./CONTRIBUTING.md) para empezar.

> [!CAUTION]
> No se aceptan enunciados, PDFs o materiales docentes protegidos sin autorización para compartirlos.

## Licencia

El código de la plataforma se distribuye bajo la licencia **Apache 2.0**. Consulta [LICENSE.md](./LICENSE.md) para más detalles.

Las preguntas y soluciones son contribuciones de la comunidad, pueden cometer errores de los que no nos hacemos responsables, nuestro objetivo es corregir todos los errores posibles, si ves un error [repórtalo](https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=report-question.yml).

Consulta cada asignatura para más información.

```js
// Made with love by Pablo Portas López
```
