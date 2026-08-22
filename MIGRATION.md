# Migración a TanStack Start

## Objetivo

Recrear Pásame Exámenes sobre TanStack Start con una base más mantenible, mejor rendimiento inicial y metadatos SEO gestionados desde las rutas. La interfaz y el contenido visible deben conservar el aspecto y el comportamiento de la aplicación anterior siempre que no haya una razón técnica para cambiarlos.

Este documento es el registro de la migración. Se actualizará después de cada paso, junto con los problemas encontrados y las decisiones que cambien durante el trabajo.

## Acuerdos cerrados

- Se mantienen las URLs localizadas con los prefijos `/es`, `/gl` y `/en`. El español es el idioma por defecto.
- Se mantienen las redirecciones desde las URLs antiguas sin idioma.
- La ruta `/` resolverá el idioma en el cliente usando la preferencia guardada, el idioma del navegador y, como último recurso, `es`.
- No habrá SSR en cada petición.
- Sí se permite el renderizado durante el build que TanStack Start necesita para generar HTML estático prerenderizado.
- Se prerenderizarán las home localizadas y las páginas localizadas de cada asignatura. Las páginas de práctica y examen seguirán siendo rutas dinámicas.
- Las rutas inválidas usarán `notFound()` y un estado 404 localizado, sin convertir un error en una redirección 200.
- Los metadatos de asignaturas y las estadísticas que necesitan home y asignaturas se calcularán en build time.
- Los scripts actuales no se eliminarán durante esta migración. Se revisarán cuando la nueva aplicación esté funcionando.
- `reference/` se usará para recuperar componentes y lógica de la aplicación anterior. Se copiarán los archivos que sigan siendo válidos y se evitarán rewrites innecesarios.
- Los datos actuales de `src/data`, `src/i18n` y `src/subjects` son la fuente de verdad. `reference/` sirve como fuente de recuperación para las piezas eliminadas.
- `reference/` y `temp/` no deben contaminar el typecheck. Biome ya está configurado para ignorar el material de referencia.
- El estilo existente de `src/styles.css` se conserva.

## Estado inicial

La rama contiene una migración incompleta y cambios locales previos. No se deben descartar ni sobrescribir esos cambios.

La base actual ya tiene:

- TanStack Start, TanStack Router, Vite, Nitro y Tailwind CSS.
- La fábrica del router en `src/router.tsx`.
- El documento raíz y el layout compartido en `src/routes/__root.tsx`.
- El shell compartido de la aplicación y pantallas temporales para las rutas públicas en migración.
- Metadatos de asignaturas, preguntas, traducciones y almacenamiento local en `src/`.
- Descubrimiento eager de metadatos y carga lazy de preguntas en `src/subjects/index.ts`.
- La copia anterior de la aplicación en `reference/`.

Todavía falta recuperar o rehacer:

- Las rutas localizadas y las rutas de compatibilidad sin idioma.
- La validación de idioma, asignatura, topic y examen.
- La pantalla 404 localizada.
- Las páginas de práctica y simulación de examen.
- Los componentes interactivos eliminados durante el rewrite.
- El sistema de `head`, canonical, hreflang, Open Graph y JSON-LD por ruta.
- La configuración de prerender estático de TanStack Start.
- Un typecheck de aplicación separado del material ignorado y de los scripts legacy.

## Contrato de rutas

La forma pública que se debe recuperar es:

```text
/                                      Resolver idioma y redirigir a /<lang>
/<lang>                                Home localizada
/<lang>/<subjectId>                   Home de asignatura
/<lang>/<subjectId>/practice/<topic>  Práctica por topic
/<lang>/<subjectId>/exam/<examId>     Simulación de examen o recopilatorio
/<lang>/privacy                       Política de privacidad
```

También se conservarán las rutas antiguas sin idioma mediante redirecciones compatibles:

```text
/<subjectId>
/<subjectId>/practice/<topic>
/<subjectId>/exam/<examId>
```

La validación debe comprobar:

1. Que el idioma pertenece a `en`, `es` o `gl`.
2. Que la asignatura existe y es pública.
3. Que el topic pertenece a la asignatura.
4. Que el examen pertenece a la asignatura.

Cuando una comprobación falle, la ruta debe terminar en `notFound()` y mostrar un 404 localizado.

## Fases

### 0. Diagnóstico y plan

Estado: completado.

- Leer `CONTEXT.md`, el árbol actual y la aplicación de `reference/`.
- Consultar la documentación vigente de TanStack Start y Router.
- Fijar el contrato de URLs, prerender, carga de datos y uso de scripts.
- Crear este documento como registro vivo de la migración.

### 1. Base verificable del proyecto

Estado: completado.

- El typecheck de la aplicación se limita a `src/` y a las configuraciones de Vite y Nitro.
- `reference/`, `temp/` y `scripts/` quedan fuera del typecheck de la aplicación. Los scripts se mantienen en el repositorio.
- Se añadió el comando `pnpm typecheck`.
- Se recuperó la compatibilidad de `vite-imagetools` y `src/lib/image.ts`, que todavía necesitan los datos de preguntas con imágenes.
- Se verificó la generación de rutas con `pnpm generate-routes`.
- Se verificó el build de producción con `pnpm build`.

Biome ya no inspecciona `reference/` ni `temp/`. Los avisos de contenido, del script inline y de organización de imports se resolvieron durante la migración; `pnpm check` pasa sin diagnósticos.

Punto de prueba: ejecutar la aplicación y comprobar que el starter actual sigue arrancando y que las comprobaciones distinguen la app de los archivos auxiliares.

### 2. Rutas, idioma y 404

Estado: completado.

- Se eliminaron las rutas de plantilla `/about` y el contenido starter de `/`.
- Se añadió `src/start.ts` con `defaultSsr: false` para mantener la navegación como SPA sin SSR por petición.
- `/` redirige en cliente a `/<lang>` usando preferencia guardada, navegador y `es` como fallback.
- `/<lang>` valida el idioma y monta `I18nProvider`; las rutas nuevas cubren home, asignatura, práctica, examen y privacidad.
- Se añadieron loaders tipados para validar asignaturas, topics y exámenes con `notFound()`.
- Las URLs antiguas sin idioma redirigen a sus equivalentes localizados; las rutas legacy profundas tienen archivos explícitos.
- Las rutas con idioma inválido y las asignaturas inexistentes terminan en un 404 localizado.
- Las pantallas públicas usan temporalmente `MigrationPlaceholder`; la recuperación visual completa queda para la fase 3.
- Se verificó `pnpm generate-routes`, `pnpm typecheck`, `pnpm build` y navegación en el preview colaborativo.

Punto de prueba: probar navegación directa y navegación interna en los tres idiomas, incluyendo IDs inválidos y URLs antiguas.

### 3. Datos de build time y páginas públicas

Estado: completado.

- Se mantuvo eager la carga de metadatos y lazy la carga de preguntas completas.
- Se generó `contentStats.generated.ts` con contadores compactos de preguntas, temas y exámenes para evitar cargar contenido completo en las páginas públicas.
- Se copiaron desde `reference/` Home, SubjectHome y sus componentes compatibles: tarjetas, Hero, FAQ, modales, fuentes, avisos y progreso.
- Se recuperaron los helpers de recientes, diálogos, estadísticas, sonido, telemetría y SEO de cliente que esas pantallas necesitan.
- La ruta de asignatura valida con su loader y entrega estadísticas generadas a `SubjectHome`; las preguntas completas se mantienen lazy para las rutas interactivas.
- Se añadió `cuelume`, dependencia existente en la referencia, para conservar el feedback sonoro sin reescribir los componentes.
- Se verificó `pnpm generate-routes`, `pnpm typecheck`, `pnpm build` y navegación real en Home y una asignatura.

Punto de prueba: comprobar Home y varias asignaturas en los tres idiomas, sus contadores, progreso, modales, enlaces y traducciones.

#### 3.1. Shell común, modales, estilos y fuentes

Estado: completado.

- Se recuperaron desde `reference/` el Header, el botón de GitHub, el modal de ajustes y el proveedor de temas.
- Se recuperó el Footer con el modal de licencias, los enlaces legales, la política de privacidad y los enlaces del proyecto.
- Header y Footer viven dentro del layout `/$lang`, de modo que sus traducciones y enlaces siempre usan el idioma de la URL.
- Se mantuvo `src/styles.css` completo y se verificó que coincide con `reference/src/index.css`.
- Se importaron `@fontsource-variable/onest` y `@fontsource-variable/cascadia-code` desde `styles.css`, junto con sus declaraciones TypeScript; las declaraciones `@font-face` de Fontsource usan `font-display: swap`.
- Se mantuvieron la inicialización de sonido y el binding de `cuelume` para conservar el comportamiento interactivo de los componentes recuperados.
- Se añadieron los metadatos `color-scheme` y `theme-color`, y el script de inicialización reconoce todos los temas disponibles en el modal.
- Se verificó typecheck, build, carga real de las fuentes, apertura del modal de ajustes y apertura del modal de licencias en Home.
- Al comparar con producción se detectó que el shell de la migración aplicaba `antialiased` en el `<body>`, mientras que la app publicada usa el suavizado normal del navegador. Se retiró para igualar la renderización tipográfica.

Punto de prueba: revisar Header y Footer en Home y en una asignatura, cambiar idioma/tema desde Ajustes y abrir Licencias; comprobar también el aspecto con tema claro y oscuro.

#### 3.2. Visibilidad especial de `_template` y `espain`

Estado: completado.

- Se separaron las reglas de visibilidad de homepage, navegación e indexación en `src/subjects/visibility.ts`.
- `_template` se descubre y aparece en la homepage únicamente con `import.meta.env.DEV` o en un build donde `VERCEL_ENV=preview`.
- `_template` no se incluye en las páginas indexables ni en el sitemap, aunque esté visible en un preview.
- `espain` sigue siendo navegable por URL directa y desde SecretToro, pero no aparece en la homepage, metadatos indexables ni sitemap.
- `VERCEL_ENV` se inyecta en el bundle de Vite para que la comprobación de previews funcione también en el cliente.
- Los scripts de generación de metadatos, sitemap, README e imágenes OG reutilizan las reglas centrales en lugar de mantener filtros propios.

Punto de prueba: en `pnpm dev`, comprobar que `_template` aparece en Home y que `/es/espain` funciona; confirmar que `espain` no aparece en Home. En un build de producción, `_template` no debe exponerse.

#### 3.3. Estadísticas públicas calculadas en build time

Estado: completado.

- Se añadió `src/lib/content-stats.ts` como fuente única para calcular estadísticas compactas de homepage, temas y exámenes a partir de `QuestionSummary`.
- El loader de `/$lang/` entrega los contadores de cada tarjeta de asignatura; `SubjectCard` ya no importa ni carga `getAllQuestions` en el cliente.
- El loader de `/$lang/$subjectId` entrega una sola vez las estadísticas compactas de la asignatura. Las tarjetas de exámenes usan esos valores serializables y no cargan ni recorren preguntas completas.
- Cuando están seleccionadas todas las fuentes, las tarjetas de temas usan directamente sus estadísticas base. Si la persona filtra fuentes, los contadores y puntos se suman desde la matriz tema×fuente generada, manteniendo la respuesta interactiva sin una nueva carga.
- Los loaders de contenido estático usan `staleTime: Infinity`, ya que sus valores solo cambian al generar una nueva versión de la aplicación.
- El generador de datos incluye también `_template`, necesario para mostrar datos correctos en dev/previews; las reglas de visibilidad siguen excluyéndola de sitemap, indexación y prerender de producción.
- Se verificó `pnpm generate-routes`, `pnpm typecheck`, Biome dirigido, `pnpm build`, 42 páginas prerenderizadas y la ausencia de resúmenes completos en los módulos de las rutas públicas. También se comprobó que el filtro actualiza las tarjetas de temas de 6/57/61 a 3/52/56 preguntas al ocultar una fuente.

Punto de prueba: revisar los contadores de Home y de una asignatura, abrir `Fuentes de las preguntas`, desactivar una fuente y comprobar que cambian las tarjetas de temas sin que aparezca una carga adicional.

### 4. Práctica, examen y estado local

Estado: en curso; la práctica por tema y el simulador de examen están recuperados. Queda la revisión final de los flujos interactivos.

- [x] Recuperar `PracticeTopic` y sus componentes dependientes desde `reference/` con cambios mínimos.
- [x] Recuperar `ExamSimulation` y `useExamSession` desde `reference/` con cambios mínimos.
- [x] Recuperar para práctica la selección de fuentes, corrección, navegación por flechas y chips, puntuación y autocorrección/autoevaluación.
- [x] Completar la lógica equivalente del simulador de examen, incluido su temporizador, navegación, entrega y confirmaciones.
- [x] Mantener el progreso y los intentos de práctica en `localStorage` mediante `src/data/store.ts`.
- [x] Recuperar para práctica el disclaimer de preguntas, el tour, el sonido, la telemetría y los modales existentes.
- [x] Revisar los modales del flujo de examen; este flujo no tiene selector de fuentes independiente que recuperar.
- [x] Mantener los tipos de preguntas existentes, incluidos texto, respuesta múltiple, relación, relleno y tablas.

#### 4.1. Práctica por tema

Estado: completado.

- Se copiaron `PracticeTopic`, `QuestionCard`, `QuestionNavChips`, `ScoreProgress`, `Disclaimer`, `usePracticeSession`, `useKeyboardNav`, `grading`, `markdown`, `tour` y `useLangTo` desde `reference/`.
- La ruta `/$lang/$subjectId/practice/$topic` usa ahora `PracticeTopic` y conserva el loader tipado que valida asignatura y topic.
- La metadata sigue gestionada exclusivamente por `head`; se retiró el mutador SEO de cliente de la página recuperada.
- Se añadieron las dependencias de Markdown, KaTeX, resaltado de código y `driver.js` necesarias para renderizar preguntas y tours.
- La lista de preguntas se carga en el cliente, de acuerdo con `defaultSsr: false`; los resúmenes usados por SEO siguen disponibles en el loader.

Punto de prueba: completar una práctica y un examen, recargar la página y comprobar la persistencia del progreso sin afectar a la navegación.

#### 4.2. Simulador de examen

Estado: completado.

- Se copiaron `ExamSimulation` y `useExamSession` desde `reference/`, manteniendo la lógica existente de inicio, temporizador, navegación, respuestas, autocorrección, autoevaluación y entrega.
- Se conservaron los modales de entrega, tiempo agotado, salida y licencias, además del disclaimer, el tour, el sonido y la telemetría.
- La ruta de examen usa el `head` nativo de TanStack Router; se retiraron los mutadores SEO de cliente de la pantalla recuperada para evitar estados de metadata obsoletos al navegar.
- Las preguntas completas se cargan de forma lazy en el cliente, coherente con `defaultSsr: false`; la metadata y las estadísticas iniciales siguen llegando desde el loader de la ruta.
- Se verificó en el preview el examen `bede/recopilatorio-mayo-2026`: pantalla inicial, inicio del temporizador, respuesta en una pregunta abierta, navegación a la siguiente pregunta, confirmación de entrega y resultado `0/6` pendiente de autoevaluación.

Punto de prueba: iniciar un examen, responder preguntas de distintos tipos, avanzar y retroceder, abrir los modales de entrega y salida, y comprobar la autoevaluación de las preguntas de texto.

#### 4.3. Renderizado Markdown

Estado: completado.

- Se mantuvo `react-markdown` como adaptador React del pipeline `unified`: el contenido de las preguntas vive en módulos TypeScript y no corresponde convertirlo en `content-collections` ni recuperarlo mediante una server function.
- Se conservaron GFM, matemáticas con KaTeX, saltos de línea, tablas y componentes React personalizados, sin habilitar `rehypeRaw` ni introducir HTML sin sanitizar.
- Las imágenes Markdown pasan por un componente propio con `alt`, `loading="lazy"` y `decoding="async"`.
- El Markdown inline usa la salida `htmlAndMathml` por defecto de KaTeX, igual que el Markdown completo, para no perder la representación accesible de las fórmulas.
- Se sustituyó `PrismLight` y el registro eager de todos los lenguajes por `PrismAsyncLight`; los lenguajes se cargan bajo demanda y los alias existentes (`js`, `ts`, `html`, etc.) se mantienen.
- Se verificó el fixture `_template/markdown-complete`: headings, tablas, task lists, footnotes, blockquotes, fórmulas, soluciones inline y código TypeScript siguen renderizándose correctamente.

Punto de prueba: revisar el examen `/_template/exam/markdown-complete` en dev, incluyendo la solución de la primera pregunta, fórmulas y bloques de código.

### 5. SEO, GEO y prerender

Estado: en curso; metadatos nativos, rutas de descubrimiento, prerender de páginas públicas y recuperación de las páginas principales completados. La revisión final de la aplicación sigue pendiente.

- [x] Crear el adaptador tipado `src/seo/head.ts` y migrar la homepage (`/$lang/`) al `head` nativo. Se conservan title, description, robots, canonical, hreflang, Open Graph, Twitter Cards y JSON-LD.
- [x] Mantener sincronizado el atributo `lang` del documento desde el layout localizado, ya que `head` gestiona los elementos de `<head>` pero no atributos de `<html>`.
- [x] Añadir favicon PNG/SVG/ICO, Apple Touch Icon, título móvil de Apple y manifest versionados al `head` raíz para heredarlos en todas las páginas.
- [x] Trasladar los metadatos de home y asignatura al `head` de sus rutas. `src/seo/meta.ts` sigue siendo la fábrica pura de datos y la ruta de asignatura usa el adaptador tipado a `meta`, `links` y `scripts` de TanStack Router.
- [x] Usar `loaderData` y `params` para construir el SEO de home y asignatura. La descripción de asignatura usa el recuento estable de resúmenes generados, no el número de preguntas que el usuario haya seleccionado localmente.
- [x] Separar el copy de búsqueda del copy social. `title` y `description` se optimizan para la página, mientras que `og:title`, `og:description` y Twitter usan `socialTitle` y `socialDescription` con textos más directos para compartir.
- [x] Añadir las server routes `/llms.txt` e `/{INDEXNOW_KEY}.txt`. `llms.txt` se construye bajo demanda con imports dinámicos para no introducir sus metadatos en el chunk crítico; filtra `_template` y `espain`. IndexNow valida `INDEXNOW_KEY` y devuelve `404` si la clave no coincide.
- [x] Añadir `/sitemap.xml` como server route. Reproduce el contrato de `scripts/generate-sitemap.ts`: incluye las tres home y las 13 asignaturas indexables en `en`, `es` y `gl`, conserva `lastmod`, `changefreq`, `priority`, `hreflang` y `x-default`, respeta `SITE_URL` y excluye `_template` y `espain`.
- [x] Trasladar los metadatos de topic, examen, práctica, privacidad y 404 al `head` nativo. Las rutas de práctica, examen, privacidad y 404 usan `noindex, nofollow`; topic, examen y privacidad conservan canonical, hreflang y JSON-LD. `src/lib/seo.ts` ya no tiene consumidores en la aplicación.
- [x] Recuperar la página de política de privacidad desde `reference/`, con sus secciones traducidas, proveedores externos y enlaces con `noopener noreferrer`, manteniendo `noindex, nofollow` en su ruta.
- [x] Generar title, description, canonical, hreflang, Open Graph, Twitter Cards y JSON-LD desde datos tipados.
- [x] Mantener indexables solo home y páginas principales de asignatura.
- [x] Marcar práctica, examen, privacidad y 404 como no indexables cuando corresponda.
- [x] Configurar `tanstackStart({ prerender, pages })` para prerenderizar de forma explícita las tres homes lingüísticas y las páginas de cada asignatura pública. `autoStaticPathsDiscovery` y `crawlLinks` están desactivados para no convertir en HTML estático las rutas de práctica, examen, privacidad o los enlaces secretos.
- [x] Mantener la server route de sitemap mientras se completa el prerender nativo. La lista explícita reutiliza `isIndexableSubject`, por lo que `_template` y `espain` quedan fuera también en previews.
- [x] Mantener `defaultSsr: false` para las rutas interactivas. Las rutas públicas activan SSR solo cuando TanStack ejecuta el prerender del build mediante `TSS_PRERENDERING`; las peticiones normales siguen sin SSR.
- Mantener por ahora los scripts de sitemap, HTML SEO, rewrites e imágenes OG. Cuando el prerender y el sitemap nativos estén verificados, los primeros cuatro dejarán de formar parte del build, pero no se eliminarán durante esta migración.
- Mantener `public/robots.txt` como archivo estático; solo necesitaría una server route si las reglas pasasen a depender del entorno.

Punto de prueba: el build genera 42 archivos `index.html` (3 homes y 13 asignaturas por idioma), con title, description, robots, canonical, alternates, Open Graph y JSON-LD en el HTML inicial. Las rutas dinámicas no se prerenderizan y `_template`/`espain` no aparecen en la salida.

#### 5.1. Política de privacidad

Estado: completado.

- Se copió `PrivacyPolicy` desde `reference/` con cambios mínimos y se conectó a `/$lang/privacy` en lugar del `MigrationPlaceholder`.
- La página consume las traducciones existentes para las secciones, listas y proveedores, y conserva el tracking de enlaces externos.
- La metadata continúa gestionándose desde el `head` nativo de la ruta: título, descripción, canonical, alternates, JSON-LD y `noindex, nofollow`.
- Se verificó en preview en `es`, `en` y `gl` el contenido traducido, las seis tarjetas de proveedores y los enlaces externos.

Punto de prueba: revisar la política en los tres idiomas, comprobar los enlaces de proveedores y confirmar que no se incluye en el sitemap ni se indexa.

### 6. Verificación y revisión de scripts

Estado: en curso.

#### 6.1. Orden de opciones en la ruta de Home

Estado: completado.

- Se colocó `params` antes de `ssr` y `loader` en `src/routes/$lang.index.tsx`, respetando el orden que TanStack Router necesita para conservar la inferencia de tipos.
- `pnpm typecheck` y Biome pasan en la ruta modificada.
- `pnpm build` pasa y vuelve a prerenderizar las 42 páginas públicas.
- `react-doctor` deja de detectar el error de inferencia de rutas y sube de 82 a 91 puntos. Los tres avisos restantes pertenecen a otros trabajos de mantenimiento y no bloquean esta migración.

Punto de prueba: navegar a una homepage localizada y a una asignatura desde el menú para confirmar que el cambio, puramente declarativo, no altera la navegación.

#### 6.2. Recorrido único al filtrar temas

Estado: completado.

- Se sustituyó la cadena `filter().map()` de `TopicsSection` por un único recorrido sobre las estadísticas de temas.
- El conjunto resultante mantiene las mismas reglas: solo filtra temas sin preguntas en asignaturas normales y conserva todos los temas de `espain`.
- `pnpm typecheck`, Biome, `pnpm build` y React Doctor pasan; el diagnóstico queda limitado a dos avisos de mantenibilidad ya conocidos en `src/routes/$lang.tsx`.

Punto de prueba: abrir una asignatura, usar el filtro de exámenes y comprobar que las tarjetas de temas y sus recuentos siguen coincidiendo con la selección.

#### 6.3. Persistencia del modal de ajustes al cambiar idioma

Estado: completado.

- Se eliminó la `key` basada en el idioma del `I18nProvider`, que desmontaba `AppChrome` y cerraba el modal de ajustes al navegar.
- El proveedor sincroniza el idioma cuando cambia la URL directamente, pero conserva montado el `<dialog>` durante el cambio iniciado desde el selector.
- `pnpm typecheck`, Biome, React Doctor y `pnpm build` pasan. El diagnóstico mantiene únicamente los dos avisos de mantenibilidad conocidos en `src/routes/$lang.tsx`.

Punto de prueba: abrir Ajustes en `/es`, cambiar a inglés o gallego y confirmar que el modal sigue abierto, que sus textos se traducen y que el foco continúa dentro del diálogo.

#### 6.4. Rutas legacy y accesos directos

Estado: completado.

- La instancia de desarrollo aislada responde con el shell SPA a `/`, `/bede`, `/bede/practice/demo`, `/bede/exam/demo`, `/es`, `/es/bede`, `/es/_template`, `/es/espain` y `/es/no-existe`, como corresponde a una aplicación sin SSR por petición.
- La ruta wildcard raíz conserva las redirecciones client-side de asignaturas, práctica y examen, manteniendo `search`, `hash` y `replace`.
- La ruta localizada conserva el mismo comportamiento para URLs con idioma inválido o segmentos no reconocidos.
- El build contiene 42 `index.html` prerenderizados; `_template` y `espain` no aparecen en la salida estática. `/sitemap.xml` y `/llms.txt` responden con sus tipos de contenido correctos.

Punto de prueba: abrir `/bede`, `/bede/practice/demo` y `/bede/exam/demo` para confirmar que navegan a la versión localizada; abrir `/es/_template` y `/es/espain` directamente, y confirmar que ninguna de las dos aparece en Home ni en el sitemap.

#### 6.5. Bundle inicial y cargas diferidas

Estado: completado.

- La salida prerenderizada de Home carga aproximadamente 178 KB gzip de JavaScript inicial y una asignatura aproximadamente 186 KB gzip, dentro del presupuesto inicial de la aplicación.
- Los chunks de preguntas no se referencian desde el HTML inicial de Home ni de asignatura; se cargan al entrar en los flujos interactivos.
- El resaltado de Markdown (`PrismAsyncLight`) tampoco aparece en la carga inicial y mantiene sus lenguajes bajo demanda.
- El aviso `INEFFECTIVE_DYNAMIC_IMPORT` sobre `src/subjects/index.ts` solo afecta a la separación interna de las server routes de sitemap/LLMs: el registro de asignaturas ya es necesario en el cliente para Home y Header, y el aviso no añade preguntas al bundle inicial.

Punto de prueba: abrir Home y una asignatura con la red del navegador visible, confirmar que las preguntas se solicitan al iniciar práctica/examen y que el resaltado se solicita solo al mostrar código Markdown.

#### 6.6. Navegación por teclado y landmark 404

Estado: completado.

- Se añadió un enlace localizado para saltar el Header y el Footer, con foco visible y destino `#main-content`.
- El chrome global expone ahora un único `<main>` enfocable programáticamente.
- Se eliminó el `<main>` anidado de `NotFoundPage`; la ruta 404 conserva el landmark proporcionado por `AppChrome`.
- `pnpm typecheck`, Biome, React Doctor (91/100) y `pnpm build` pasan. Los únicos avisos de React Doctor son los dos avisos de mantenibilidad ya conocidos en `src/routes/$lang.tsx`.

Punto de prueba: pulsar Tab desde el inicio de `/es`, activar «Ir al contenido principal» y comprobar que el foco salta al contenido; abrir una ruta inexistente y comprobar que existe un único landmark principal.

#### 6.7. Rediseño de la página 404

Estado: completado.

- `NotFoundPage` reutiliza el componente `Hero` de la homepage para mantener la misma jerarquía visual y la misma animación de entrada; genera exactamente el mismo número de emojis flotantes que Home y los sustituye por `❓`.
- `404` es ahora el título principal y la traducción de «asignatura no encontrada» aparece como subtítulo.
- El enlace «volver al inicio» queda centrado debajo del Hero y reutiliza los colores, borde y superficie de las tarjetas de asignatura reciente.
- El enlace incorpora `ArrowLeft` de `reicon-react`, mantiene estados visibles de foco y pulsación y comparte los efectos de hover/press de las tarjetas recientes mediante `cuelume`.

Punto de prueba: abrir una URL de asignatura inexistente en los tres idiomas, comprobar el Hero, el subtítulo localizado, el botón centrado y su navegación al inicio.

#### 6.8. Versión visible en Ajustes

Estado: completado.

- El modal de configuración muestra una fila localizada con `Versión de la app` y el hash corto del commit actual.
- Vite inyecta `VERCEL_GIT_COMMIT_SHA` en previews y producción; en local obtiene el hash desde Git y usa `dev` como fallback si no existe un repositorio disponible.
- Se verificó en ejecución el valor `5ff752d` dentro del modal en español.

Punto de prueba: abrir Ajustes en cada idioma y comprobar que la fila de versión aparece al final del modal.

#### 6.9. Aviso de actualización para usuarios recurrentes

Estado: completado.

- `AppUpdateToast` compara la versión almacenada en `localStorage` con el hash actual y solo muestra el aviso automáticamente cuando detecta una versión nueva para ese navegador.
- La toast se sitúa en la esquina inferior izquierda en escritorio y centrada en la parte inferior en mobile, respetando el área segura y el tema activo.
- La entrada y la salida usan una transición breve de opacidad y desplazamiento vertical, con soporte para `prefers-reduced-motion`; permanece montada durante la salida para que la animación se complete.
- El mensaje conserva una sola línea desde 375 px en los tres idiomas y el hash usa el mismo fondo `bg-code` y fuente monoespaciada que en Ajustes.
- El mensaje y el cierre son accesibles mediante una región `aria-live="polite"` y un botón con etiqueta localizada; se autocierra tras ocho segundos.
- Se expone `window.showAppUpdateToast()` para previsualizarla manualmente desde la consola sin modificar la versión guardada.
- Se verificó visualmente en Home el mensaje `Actualizado a la última versión 5ff752d`, sin signos de exclamación, en los tres idiomas.

Punto de prueba: abrir DevTools y ejecutar `window.showAppUpdateToast()` para comprobar la toast en escritorio y mobile.

#### 6.10. Popup para apoyar el proyecto en GitHub

Estado: completado.

- Se recuperó `StarPopup` desde `reference/src/components/StarPopup.tsx` con cambios mínimos y se montó en el chrome persistente de la aplicación.
- Se mantiene la lógica de frecuencia existente: cinco visitas mínimas, probabilidad del 20 %, periodo de enfriamiento de siete días y persistencia de la decisión en `localStorage`.
- Se conservan el enlace a GitHub, los sonidos de interacción, los eventos de Umami, el cierre nativo del diálogo y las traducciones existentes de los tres idiomas.
- El popup no se desmonta innecesariamente al cambiar de idioma y sus estados de foco, cierre y apertura funcionan en mobile y escritorio.
- Se conserva la animación de modal compartida y su variante reducida para `prefers-reduced-motion`; el enlace de GitHub mantiene el feedback de `cuelume`.
- `pnpm typecheck`, la comprobación dirigida de Biome y `pnpm build` pasan. El build continúa generando las 42 páginas prerenderizadas.
- Se verificó visualmente la apertura en iPhone SE (375 px), el cierre animado, la persistencia de `star_popup_dismissed` y el bloqueo del popup durante el periodo de enfriamiento.

Punto de prueba: simular la condición de aparición, abrir el popup, activar el enlace de GitHub, descartarlo y comprobar que no reaparece durante el periodo de enfriamiento.

#### 6.11. Configuración de Vercel y caché

Estado: completado fuera de esta migración; el usuario creó `vercel.json` y no requiere modificaciones.

- Se mantiene intacto el `vercel.json` creado por el usuario. Esta migración no modifica su contenido.
- Como referencia para ese trabajo futuro quedan las decisiones analizadas: caché inmutable para assets hashados, caché prudente para archivos públicos estables, preservación de las cabeceras de las server routes y cabeceras de seguridad sin CSP hasta completar la auditoría de scripts.

Punto de prueba: cuando se retome este paso, revisar la política y comprobar con `curl -I` en Vercel los valores de `Cache-Control` en un asset hashado, un archivo público, una página prerenderizada y cada server route de descubrimiento.

#### 6.12. Script de Ahrefs

Estado: completado.

- Se añadió al `head` del root route mediante `head.scripts`, la API nativa de TanStack Router que consume `HeadContent`.
- Se conservaron la URL original, el `data-key` y la carga asíncrona del script de Ahrefs.
- Al estar definido en el root route, cubre todas las páginas y no depende de los metadatos SEO dinámicos de cada ruta.
- El build genera una única etiqueta de Ahrefs en el HTML prerenderizado de Home y de una asignatura.
- La navegación SPA entre `/es` y `/es/bede` mantiene exactamente una etiqueta en `<head>` y no crea duplicados.
- `pnpm typecheck` y `pnpm build` pasan. La comprobación dirigida de Biome ya no mantiene avisos del script de tema.

Punto de prueba: revisar en preview el HTML de Home y de una asignatura, confirmar la etiqueta única y verificar en la pestaña Network que la carga es asíncrona y no bloquea el renderizado.

#### 6.13. Analíticas de Umami

Estado: completado.

- Se añadieron al `head` del root route el script estándar de Umami y el recorder mediante `head.scripts`, con sus `data-website-id`, rendimiento, dominio, Do Not Track y carga `defer` originales.
- Se añadió el `preconnect` a `https://analytics.pablopl.dev`; `HeadContent` genera una única instancia de cada script durante el build y la navegación SPA.
- `SessionTracker` vive dentro del chrome de `/$lang`: identifica una vez el visitante con el identificador anónimo local `umami_uid` y sincroniza idioma y tema cuando cambian.
- Se conserva `src/lib/umami.ts` como wrapper tolerante a ausencia del proveedor, con limpieza de datos, `track`, `identify`, `setSessionData` y fallback a `identify` para versiones que no exponen `setSessionData`.
- Los efectos de sesión solo se ejecutan en el navegador después de la hidratación; el prerender genera HTML con los scripts, pero no ejecuta hooks ni llamadas de analítica durante el build.
- Los nombres y payloads de eventos existentes se mantienen respecto a `reference/`; la política de privacidad ya describe la analítica, el recorder y el muestreo indicado.
- `pnpm typecheck` y `pnpm build` pasan. El preview a 375 px confirma dos scripts, un `preconnect`, ausencia de duplicados y sincronización al cambiar de idioma.

Punto de prueba: navegar por Home, una asignatura, práctica y examen con DevTools abierto, comprobar las peticiones y eventos de Umami y confirmar que la app sigue funcionando al bloquear los scripts externos.

#### 6.14. Accesibilidad de los controles de práctica y examen

Estado: completado.

- Los botones inferiores de práctica y examen conservan el texto visual oculto en mobile, pero ahora exponen una etiqueta accesible localizada mediante `aria-label`.
- Los iconos de esos controles siguen marcados como decorativos con `aria-hidden="true"`, evitando nombres duplicados para lectores de pantalla.
- Los enlaces «Volver a temas» y «Volver a la asignatura» usan `activeOptions={{ exact: true }}` para que TanStack Router no añada `aria-current="page"` mientras la ruta hija está abierta.
- `LangLink` acepta las opciones de coincidencia activa necesarias sin perder su prefijo de idioma.
- Los objetivos genéricos del tour de `driver.js` ya no conservan `aria-haspopup`, `aria-expanded` ni `aria-controls`, que el proveedor añadía a contenedores sin un rol compatible; el objetivo de «Volver a temas» se coloca directamente sobre el enlace.
- `pnpm typecheck`, la comprobación dirigida de Biome y el preview a 375 px verifican los nombres accesibles y la ausencia de atributos ARIA incompatibles en todos los pasos de los tours.

Punto de prueba: abrir una práctica y un examen en mobile, recorrer con Tab los controles inferiores y confirmar que el lector de pantalla anuncia «Anterior», «Siguiente», «Corregir», «Enviar y ver soluciones» y «Entregar examen» según el caso.

#### 6.15. Icono de GitHub y carga de fuentes

Estado: completado.

- El enlace de GitHub del Footer usa `public/github-icon.svg` en lugar del SVG inline anterior.
- El recurso visual es decorativo (`aria-hidden="true"`) porque el enlace conserva el texto visible «GitHub» como nombre accesible.
- El SVG se aplica como máscara CSS para que herede `currentColor`, igual que los iconos de Reicon, incluidos sus estados hover y los distintos temas.
- Las hojas de estilo de Fontsource se importan desde `src/styles.css`; sus reglas `@font-face` mantienen `font-display: swap` para evitar texto invisible durante la carga.
- Se añadieron dimensiones explícitas al icono para evitar cambios de layout mientras se carga el recurso.
- `pnpm typecheck` y `pnpm build` pasan; el preview a 375 px confirma el recurso, sus dimensiones y el nombre accesible del enlace.

Punto de prueba: revisar el enlace de GitHub del Footer en Home y una asignatura, y comprobar que el texto aparece mientras se cargan las fuentes.

#### 6.16. Preparación de estadísticas e imágenes OG

Estado: completado.

- Se conserva `scripts/generate-question-summary-map.ts` como fuente de las estadísticas de contenido que consumen Home, asignaturas, topics y exámenes.
- Se añade `tsx` como dependencia de desarrollo y se crean comandos explícitos para generar estadísticas e imágenes OG.
- `dev` y `build` preparan ambos tipos de artefactos antes de arrancar Vite o prerenderizar las rutas; `typecheck` prepara las estadísticas para que un clon limpio pueda validar la aplicación.
- `scripts/generate-og-images.ts` vuelve a ejecutarse dentro del flujo de build y genera las 13 imágenes PNG de asignaturas indexables en `public/og/`; `_template` y `espain` siguen excluidas por las reglas de visibilidad.
- Se mantienen los scripts auxiliares de desarrollo y los generadores que todavía forman parte del flujo. Los seis scripts antiguos de SEO, sitemap, páginas estáticas, rewrites e IndexNow se retiran después de comprobar que sus responsabilidades ya están cubiertas por TanStack Start.
- `pnpm typecheck` y `pnpm build` pasan. El build prerenderiza 42 páginas, copia 13 imágenes OG al output de Vercel y `/og/bede.png` responde con `200`.

Punto de prueba: ejecutar `pnpm dev`, abrir una asignatura y comprobar que su imagen OG responde; después ejecutar `pnpm build` y revisar que el HTML prerenderizado contiene `og:image` y `meta description` específicos.

#### 6.17. Verificación global de la migración

Estado: completado; el formato, los avisos de código, la revisión funcional final y la auditoría de scripts legacy están cerrados.

- Se corrigieron los 7 errores bloqueantes que Biome detectó durante la revisión final: SVG decorativos del Footer, callback de suscriptores de GitHub, claves estables de los emojis del Hero y el script inline de inicialización del tema.
- Se hizo más defensivo el wrapper de Umami eliminando afirmaciones no nulas innecesarias, sin cambiar sus eventos ni su fallback.
- `pnpm check`, `pnpm typecheck`, `pnpm lint` y `pnpm build` pasan sin avisos. Los seis avisos de contenido heredado de ESEI y PEI se resolvieron conservando literalmente sus expresiones Markdown y LaTeX.
- El script `pnpm run doctor` usa `react-doctor --no-lint`: Biome es el linter oficial del proyecto y React Doctor queda como auditor complementario de arquitectura, seguridad, rendimiento y accesibilidad. Se usa `pnpm run` porque pnpm 11 reserva `pnpm doctor` para su propio diagnóstico.
- El preview a 375 px verifica Home, una asignatura, 404, las rutas legacy `/bede` y `/bede/exam/...`, además de los accesos directos a `_template` y `espain`.
- `/sitemap.xml`, `/llms.txt` y `/robots.txt` responden con sus tipos correctos; el sitemap no contiene `_template` ni `espain`.
- `pnpm format` ya no detecta diferencias en los 125 archivos comprobados. El formateo se aplicó sin cambiar la semántica ni el contenido de las preguntas.
- Se eliminaron los cuatro archivos sin consumidores de la app y se retiraron los dos exports sin uso detectados por React Doctor, manteniendo las APIs que sí consume la aplicación.
- El preview del build valida `/` → `/es`, `/bede` → `/es/bede`, `/bede/practice/ficheros` → `/es/bede/practice/ficheros` y `/bede/exam/recopilatorio-mayo-2026` → `/es/bede/exam/recopilatorio-mayo-2026`.
- `/en`, `/gl`, `/es/espain` y una 404 localizada cargan correctamente. `/es/_template` devuelve 404 en el preview local de producción, como corresponde a una asignatura visible solo en desarrollo o en previews de Vercel.
- En el mismo preview, `/sitemap.xml`, `/llms.txt` y `/robots.txt` devuelven `200`; el sitemap contiene 42 URLs y no incluye `_template` ni `espain`.
- Se confirmó manualmente la carga diferida de imágenes, la navegación por teclado, los estados de error y los cambios de tema, sin detectar regresiones.

Punto de prueba: mantener esta comprobación al desplegar un preview de Vercel y revisar las rutas legacy y directas después de la retirada de scripts.

- [x] Ejecutar typecheck, lint, build y preview.
- [x] Ejecutar `pnpm check` y resolver la organización de imports detectada por Biome.
- [x] Configurar React Doctor con `--no-lint`; Biome mantiene la responsabilidad del lint.
- [x] Homogeneizar las diferencias detectadas por `pnpm format` sin alterar el contenido de las preguntas.
- [x] Revisar y resolver los seis avisos de código de React Doctor documentados en la sección 6.18.
- [x] Resolver los seis avisos de lint de contenido en ESEI y PEI sin alterar el texto renderizado.
- [x] Probar enlaces antiguos y rutas directas en el preview de producción.
- [x] Revisar el bundle inicial y la carga diferida de preguntas e imágenes.
- [x] Comprobar navegación por teclado, estados de error y preferencias de tema.
- [x] Inventariar los scripts existentes sin eliminarlos automáticamente.
- [x] Actualizar este documento con las decisiones y comprobaciones de esta fase.
- [x] Decidir el destino de los scripts legacy después de la migración.
- [x] Retirar los scripts legacy reemplazados después de confirmar esta clasificación.

Punto de prueba: revisión completa de la aplicación migrada después de la retirada de scripts.

#### 6.19. Auditoría final de scripts legacy

Estado: completado; cada script ha sido clasificado y se han retirado los seis generadores reemplazados por TanStack Start.

- Se conservan como parte del flujo actual `generate-question-summary-map.ts` y `generate-og-images.ts`. El primero genera las estadísticas consumidas por la app antes de `typecheck`, `dev` y `build`; el segundo genera las imágenes OG y `public/subjects-meta.json` antes de `dev` y `build`. También se conservan sus recursos en `scripts/assets/`.
- `update-readme-subjects.ts` se conserva como herramienta manual (`pnpm readme`). El nuevo README contiene los marcadores que espera el script y su tabla se ha regenerado con 13 asignaturas públicas.
- `daypo_scraper.ts` y `mistral_ocr.ts` se conservan sin cambios como herramientas auxiliares para desarrolladores. Sus posibles mejoras, dependencias y validaciones quedan fuera del alcance de esta migración.
- Se retiran `generate-page-meta-map.ts`, `generate-sitemap.ts`, `generate-indexnow-key.ts`, `generate-static-seo-pages.ts`, `generate-subject-pages.ts` y `generate-vercel-rewrites.ts`. Las rutas nativas de sitemap, IndexNow y `llms.txt`, junto con el `head` de las rutas y el prerender de Vite, cubren sus responsabilidades. Además, varios de esos scripts dependían de artefactos ya inexistentes (`pageMetaMap.generated.ts`, `dist/index.html`, `dist/_spa-fallback.html` o `vercel.template.json`) o de dependencias que ya no están instaladas.
- Se mantienen `generate-question-summary-map.ts`, `generate-og-images.ts`, `update-readme-subjects.ts` y los recursos de `scripts/assets/`. El primero y el segundo forman parte del flujo actual; `update-readme-subjects.ts` sigue siendo manual y actualiza los marcadores del README.

Punto de prueba completado: ningún comando de desarrollo, build, despliegue o mantenimiento manual depende de los archivos retirados; `pnpm typecheck`, `pnpm lint` y `pnpm build` pasan.

#### 6.18. Avisos de React Doctor

Estado: completado para el código de la aplicación; el aviso de hardening de pnpm queda ignorado por decisión del usuario.

React Doctor 0.9.12, ejecutado con `--no-lint`, encontró 7 avisos en el proyecto migrado:

- `react-doctor/require-pnpm-hardening` en `pnpm-workspace.yaml`: se ignora por decisión del usuario. No se añadió `trustPolicy: no-downgrade` ni se modificó el lockfile.
- `deslop/unused-file` en `src/components/MigrationPlaceholder.tsx`, `src/components/ThemeToggle.tsx`, `src/lib/seo.ts` y `src/lib/title.ts`: se verificó que no tenían consumidores en la app y se eliminaron.
- `deslop/unused-export` en `src/lib/exam-stats.ts` (`getExamQuestionStats`) y `src/lib/lang-link-utils.ts` (`buildLocationSuffix`): se verificó que no tenían consumidores y se retiraron.
- React Doctor también escanea `reference/`, pero esa carpeta permanece fuera del typecheck y no se mezcla con la limpieza de la app.

Punto de prueba: ejecutar `pnpm run doctor` y confirmar que solo aparece el aviso de pnpm aceptado; comprobar también `pnpm typecheck`, `pnpm lint` y `pnpm build`.

#### 6.20. README y CONTRIBUTING

Estado: completado para esta primera versión.

- El README describe la aplicación, la arquitectura de TanStack Start, el desarrollo local, los comandos, la estructura del repositorio y el flujo para añadir asignaturas.
- Se añadieron badges actuales para React 19, TypeScript 6, Vite 8, Tailwind CSS 4, TanStack Start, Biome 2, pnpm, driver.js, Vercel, idiomas, pull requests, licencia y estrellas.
- Usa GFM, una advertencia para las asignaturas especiales y una tabla generada por `pnpm readme`.
- Se creó `.github/pull_request_template.md` con la sintaxis y la ubicación recomendadas por GitHub, adaptada a las comprobaciones y reglas de este repositorio.
- Se reescribió `CONTRIBUTING.md` con el flujo local actual, las reglas de derechos de contenido, las excepciones de `_template` y `espain`, las comprobaciones disponibles y el proceso de pull request.
- La guía evita duplicar la documentación general del README y enlaza las plantillas de issues, la plantilla de pull request, las licencias y el código de conducta.

Checklist:

- [x] Crear el primer README.
- [x] Añadir marcadores para la tabla generada de asignaturas.
- [x] Crear la plantilla de Pull Request.
- [x] Reescribir `CONTRIBUTING.md`.

Punto de prueba: revisar el README y `CONTRIBUTING.md`, comprobar que los comandos y las rutas descritas coinciden con el repositorio y probar el flujo de contribución con una asignatura o una pull request de ejemplo.

## Criterio para avanzar

Cada fase termina con una comprobación concreta y una pausa para probar la aplicación. No se empezará la siguiente fase si la actual deja rutas rotas, pérdida de contenido, regresiones visuales o errores que no estén documentados aquí.

## Registro de decisiones y problemas

| Fecha | Tema | Decisión o problema | Estado |
| --- | --- | --- | --- |
| 2026-08-21 | SSR | Sin SSR por petición; se permite prerender durante el build. | Cerrado |
| 2026-08-21 | Idiomas | `/` resuelve preferencia, navegador y fallback `es` en cliente. | Cerrado |
| 2026-08-21 | SEO | Solo home y páginas de asignatura son indexables y prerenderizadas. | Cerrado |
| 2026-08-21 | Scripts | Se conservan durante la migración y se auditan al final. | Cerrado |
| 2026-08-21 | Referencia | Se recuperan componentes desde `reference/` con cambios mínimos. | Cerrado |
| 2026-08-21 | Typecheck | `reference/`, `temp/` y scripts legacy quedan fuera del typecheck de la app. `pnpm typecheck`, generación de rutas y build pasan. | Cerrado |
| 2026-08-21 | Biome | `pnpm check`, `pnpm lint` y `pnpm format` pasan sin avisos después de ordenar los imports detectados por `assist/source/organizeImports`. | Cerrado |
| 2026-08-21 | Rutas legacy | Se conserva el wildcard raíz como fallback para redirigir rutas antiguas sin idioma. El índice localizado y su fallback validan `es`, `en` y `gl`, evitando que una URL dinámica con `.txt` sea interpretada como idioma. | Cerrado |
| 2026-08-21 | Preview SSR | El ciclo `router-*`/`router-*2` reaparecía al usar code splitting: los componentes de rutas importaban `Route` desde sus propios chunks y el server route cargaba metadatos estáticos. Se usan `getRouteApi(...)` en los componentes y imports dinámicos en `llms.txt`; el entry SSR vuelve a responder sin desactivar el split. | Cerrado |
| 2026-08-21 | UI pública | Home y SubjectHome se recuperan desde `reference/` con cambios mínimos y estadísticas generadas temporales. | Cerrado |
| 2026-08-21 | Sonido | Se incorpora `cuelume`, que ya era dependencia de la aplicación de referencia y es necesaria para conservar sus componentes interactivos. | Cerrado |
| 2026-08-21 | Tipografía | Producción y local cargan el mismo Onest `.woff2`, pero local aplicaba `-webkit-font-smoothing: antialiased` desde el `<body>`. Se retira para igualar la apariencia de los glifos. | Cerrado |
| 2026-08-21 | SEO nativo | La guía y la API instalada permiten mover metadatos a `head`, prerender explícito y sitemap integrado. Se migraron la homepage, las asignaturas y `/sitemap.xml`; las rutas no indexables también declaran su head nativo. | Cerrado |
| 2026-08-21 | SEO de asignaturas | La ruta `/$lang/$subjectId` declara ahora todo su SEO mediante `head` y `loaderData`. Se elimina el mutador antiguo de `SubjectHome`, que dejaba etiquetas OG de la asignatura al volver a Home y no generaba `meta description`. | Cerrado |
| 2026-08-21 | SEO de rutas no indexables | Topic, examen, privacidad y 404 usan `head` nativo. Los recuentos de preguntas y puntos se calculan desde `questionSummaries.generated.ts`, con puntos redondeados para evitar valores de coma flotante en las descripciones. | Cerrado |
| 2026-08-21 | Copy SEO y social | Se revisan títulos y descripciones de home y asignaturas en español, gallego e inglés. La metadata social usa copy propio, activo y breve, sin depender del texto de búsqueda. | Cerrado |
| 2026-08-21 | Rutas de descubrimiento | `/llms.txt` enumera solo páginas y asignaturas públicas; `/{INDEXNOW_KEY}.txt` solo expone la clave configurada en `INDEXNOW_KEY`. Ambas rutas responden como texto plano y no dependen de SSR de páginas. | Cerrado |
| 2026-08-21 | Sitemap | `/sitemap.xml` responde XML desde una server route y se comparó con la salida esperada de `scripts/generate-sitemap.ts`: 42 URLs, 168 alternates y `lastmod` correcto. | Cerrado |
| 2026-08-21 | Prerender | `vite.config.ts` lista las 42 páginas públicas desde `src/subjects`, excluye `_template` y `espain`, desactiva el descubrimiento automático y genera HTML con metadata completa durante el build. `TSS_PRERENDERING` activa SSR únicamente durante esa fase. | Cerrado |
| 2026-08-21 | Práctica por tema | Se recuperó el flujo interactivo desde `reference/`: preguntas, corrección, navegación, puntuación, autocorrección/autoevaluación, disclaimer, tour y persistencia del intento. | Cerrado |
| 2026-08-22 | Simulador de examen | Se recuperaron `ExamSimulation` y `useExamSession` desde `reference/`, se conservaron sus modales y temporizador, y se dejó el SEO exclusivamente en el `head` nativo de la ruta. El flujo básico se verificó en preview. | Cerrado |
| 2026-08-22 | Política de privacidad | Se recuperó `PrivacyPolicy` desde `reference/`, se mantuvo la metadata nativa no indexable y se verificó el contenido traducido y los enlaces externos en los tres idiomas. | Cerrado |
| 2026-08-22 | Markdown | Se mantuvo `react-markdown` sobre el pipeline `unified`, se añadió MathML e imágenes diferidas y se migró el resaltado a `PrismAsyncLight` para cargar los lenguajes bajo demanda. | Cerrado |
| 2026-08-22 | Inferencia de rutas | La ruta de Home declaraba `params` después de `ssr` y `loader`. Se reordenó la configuración para que TanStack Router pueda inferir correctamente los tipos dependientes. | Cerrado |
| 2026-08-22 | Rendimiento de temas | `TopicsSection` recorría dos veces las estadísticas al encadenar `filter().map()`. Se consolidó en un único recorrido sin cambiar el resultado. | Cerrado |
| 2026-08-22 | Modal de ajustes e idioma | Se conserva montado el chrome de la aplicación al cambiar el idioma, evitando que el modal de ajustes se cierre durante la navegación localizada. | Cerrado |
| 2026-08-22 | Rutas legacy y directas | El preview del build redirige las rutas antiguas válidas, carga las rutas localizadas y directas, mantiene `espain` accesible por URL y devuelve 404 para `_template` fuera de desarrollo o Vercel Preview. Los endpoints de descubrimiento responden 200 y el sitemap conserva 42 URLs públicas. | Cerrado |
| 2026-08-22 | Bundle y cargas diferidas | Home y asignaturas mantienen un bundle inicial inferior a 200 KB gzip; preguntas y resaltado Markdown se cargan bajo demanda. | Cerrado |
| 2026-08-22 | Teclado y 404 | Se añadió un skip link localizado y se corrigió el landmark `<main>` anidado de la página 404. | Cerrado |
| 2026-08-22 | Diseño de 404 | La página de error usa el Hero de la homepage, muestra `404` como título, el mensaje localizado como subtítulo y un retorno centrado con el estilo de las tarjetas recientes y `ArrowLeft`. | Cerrado |
| 2026-08-22 | Versión en Ajustes | El modal muestra el hash corto del commit actual, inyectado por Vite desde Git local o `VERCEL_GIT_COMMIT_SHA` en Vercel, con traducciones para los tres idiomas. | Cerrado |
| 2026-08-22 | Aviso de actualización | Los usuarios recurrentes reciben una toast cuando cambia el hash de versión; la vista se puede probar con `window.showAppUpdateToast()`. | Cerrado |
| 2026-08-22 | Popup de GitHub | Se recuperó `StarPopup` en el chrome persistente con su frecuencia, modal, sonidos y eventos de analítica. | Cerrado |
| 2026-08-22 | Configuración de Vercel | El usuario creó `vercel.json`; se mantiene sin modificaciones por parte de la migración. | Cerrado |
| 2026-08-22 | Ahrefs | Se recuperó el script de Ahrefs en `head.scripts` del root route, con carga asíncrona y sin duplicados durante la navegación. | Cerrado |
| 2026-08-22 | Umami | Se recuperan scripts, recorder, `preconnect`, sesión y eventos mediante `head.scripts` y un tracker localizado cliente-only. | Cerrado |
| 2026-08-22 | Scripts de build | Se reactivan de forma explícita los generadores de estadísticas e imágenes OG antes de `dev`/`build`; se mantienen las herramientas auxiliares de desarrollo sin incorporarlas al flujo de la app. | Cerrado |
| 2026-08-22 | Verificación global | Typecheck, lint, build, prerender, rutas directas, carga diferida, teclado, errores y temas pasan. El formato está limpio y los avisos de código de React Doctor están resueltos. | Cerrado |
| 2026-08-22 | React Doctor | `pnpm run doctor` usa `--no-lint` porque Biome es el linter oficial; así se evita que React Doctor intente leer el `index.html` que TanStack Start ya no necesita. | Cerrado |
| 2026-08-22 | Avisos de React Doctor | Se resolvieron los seis avisos de código. El aviso de hardening de pnpm se ignora por decisión del usuario y no se modifica `pnpm-workspace.yaml`. | Cerrado |
| 2026-08-22 | Lint de contenido | Se resolvieron los seis avisos de Biome en preguntas de ESEI y PEI usando literales raw para preservar LaTeX y una interpolación de shell escapada. | Cerrado |
| 2026-08-22 | Accesibilidad práctica/examen | Se añadieron nombres accesibles a los controles iconográficos, se mantuvieron sus textos como `sr-only` en mobile y se corrigieron los atributos que `driver.js` añadía a los objetivos genéricos del tour. | Cerrado |
| 2026-08-22 | Footer y tipografía | El Footer usa `public/github-icon.svg` y las fuentes de Fontsource se cargan desde `styles.css` con `font-display: swap`. | Cerrado |
| 2026-08-22 | Auditoría de scripts legacy | Se conservan sin cambios los scripts auxiliares de desarrollo y se retiran los seis generadores reemplazados por TanStack Start. | Cerrado |
| 2026-08-22 | README | Se crea una primera versión concisa, con comandos reales, arquitectura, badges tecnológicas, flujo de contenido, rutas SEO y tabla de asignaturas generada. | En curso |
| 2026-08-22 | Pull Request | Se añade `.github/pull_request_template.md` con validaciones de Biome, typecheck, build, React Doctor, accesibilidad, SEO y reglas de visibilidad. | Cerrado |
| 2026-08-22 | CONTRIBUTING | Se reescribe la guía con el flujo local actual, derechos de contenido, reglas de `_template` y `espain`, comprobaciones y proceso de pull request. | Cerrado |
