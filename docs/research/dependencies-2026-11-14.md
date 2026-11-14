# Actualización de dependencias — 14 de noviembre de 2026

## Política y alcance

Actualización con `pnpm update --latest '!typescript6'`, seguida de la migración
del alias de compatibilidad de TypeScript. Se conserva `minimumReleaseAge: 1440`
y la lista `allowBuilds`, sin añadir excepciones. Esta actualización elimina
las excepciones temporales de `minimumReleaseAgeExclude`.

Las versiones publicadas hoy de `@tanstack/react-hotkeys` (0.25.1) y
`@tanstack/react-hotkeys-devtools` (0.14.10) quedan excluidas por antigüedad.
Las últimas elegibles son 0.25.0 y 0.14.9. El resto de dependencias que ya
estaban al día conserva su versión; las etiquetas `latest` existentes se mantienen.

## Cambios revisados

- **TanStack Hotkeys 0.25.0 / Devtools 0.14.9**: el grabador registra por nombre
  cuando puede (`recordBy: 'auto'`); los atajos físicos guardados siguen siendo
  válidos. Se eliminan exports internos no usados aquí. Las teclas mantenidas
  pasan a respetar mayúsculas salvo letras. El formateador directo queda
  deprecado, pero sigue disponible. [Changelog](https://github.com/TanStack/hotkeys/blob/main/packages/react-hotkeys/CHANGELOG.md).
- **TanStack Start 1.169.5, Router Devtools 1.167.3 y CLI 1.168.0**:
  correcciones y actualización de dependencias. La CLI requiere Node
  `^20.19.0 || >=22.12.0`; no cambia `tsr generate`.
  [Changelogs](https://github.com/TanStack/router/tree/main/packages).
- **Redact 0.3.1**: correcciones de hidratación, foco y streaming; nuevos
  adaptadores y selección independiente de cliente/SSR sin cambiar `redact()`.
  [Changelog](https://github.com/TanStack/redact/blob/main/packages/redact/CHANGELOG.md).
- **Nitro 3.0.261103-rc**: revisadas las tres RC desde la beta instalada.
  Requiere Node >=22.22.0 y un builder instalado (aquí Vite). Cambia caché,
  sufijos de rutas y reglas ISR de Vercel; la configuración actual no usa las
  opciones eliminadas. [Migración](https://nitro.build/blog/v3-rc#upgrading-from-beta),
  [releases](https://github.com/nitrojs/nitro/releases).
- **Driver.js 1.14.0**: mejoras de foco, diálogos, elementos reemplazados y
  recortes de elementos dentro de contenedores con scroll. La API usada por
  los tours compila sin cambios. [Releases](https://github.com/nilbuild/driver.js/releases).
- **Canvas 1.1.1**: desde 1.1.0 el renderizado de texto predeterminado es
  `portable`; pueden variar métricas y fallback. Se regeneraron las 13 imágenes
  OG y se inspeccionó visualmente la de Deseño de Software.
  [Cambio de renderizador](https://github.com/Brooooooklyn/canvas/releases/tag/v1.1.0).
- **Vite 8.3.8 / plugin React 6.3.0 / imagetools 12.0.2**: correcciones de
  build, resolución y caché; ampliaciones del plugin React sin cambios en la
  configuración usada. [Vite](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md),
  [plugin React](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/CHANGELOG.md),
  [imagetools](https://github.com/JonasKruckenberg/imagetools/blob/main/packages/vite/CHANGELOG.md).
- **Tailwind / plugin Vite 4.3.5**: correcciones de CSS, colores y escaneo.
  [Changelog](https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md).
- **KaTeX 0.19.1**: corrección de porcentajes en argumentos raw.
  [Release](https://github.com/KaTeX/KaTeX/releases/tag/v0.19.1).
- **Biome 2.6.7**: configuración migrada con `biome migrate --write`; solo
  cambia la URL del esquema. [Release](https://github.com/biomejs/biome/releases/tag/@biomejs/biome@2.6.7).
- **@types/node 26.6.6**: actualización de tipos verificada con `typecheck`.
- **pnpm 12.18.0**: revisadas las notas de 12.15–12.18; incluye correcciones
  de seguridad, peers e instalaciones reproducibles. Sin cambiar permisos
  de scripts ni aprobar nuevas skills. [Releases](https://github.com/pnpm/pnpm/releases).

## TypeScript: compilador y API separados

`typescript` sigue en 7.0.2. El alias `typescript6` pasa de
`npm:typescript@^6.0.3` a `npm:@typescript/typescript6@^6.0.2`, el paquete oficial
que reexporta la API de TypeScript 6 (resuelta a 6.0.3) y publica `tsc6` en lugar
de competir por `tsc`. Así los scripts existentes siguen importando
`typescript6`, y `typecheck` usa inequívocamente TypeScript 7.

TypeScript 7.0 no publica la API que necesitan los scripts de análisis del
contenido. [Guía oficial de convivencia](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

## Validación

- `pnpm install --frozen-lockfile`: política de suministro validada.
- `pnpm peers check`: sin conflictos.
- `pnpm exec tsc --version`: 7.0.2; `pnpm exec tsc6 --version`: 6.0.3.
- `pnpm typecheck` y `pnpm check`.
- `pnpm check:practice-loading`: 500 selecciones y las seis vistas de carga.
- `pnpm check:star-popup`.
- `pnpm build`: generación de 13 imágenes OG, build Vercel y prerenderizado
  de 46 páginas.

La instalación avisa de dos dependencias transitivas deprecadas
(`@tiptap/y-tiptap` y `@opentelemetry/sdk-trace-base`); no se añaden overrides
para forzar versiones fuera de las declaradas por sus paquetes padres.
