# Auditoría local de rendimiento

La configuración vive en `unlighthouse.config.ts` y usa Unlighthouse `0.18.0`.
Los informes generados se guardan en `unlighthouse/runs/`, una carpeta ignorada
por Git. Los JSON históricos que ya existen en `unlighthouse/` también se
mantienen solo localmente.

## Medición recomendada

Primero genera y sirve el build de producción:

```bash
pnpm build
pnpm perf:preview
```

Deja ese proceso ejecutándose y, en otra terminal, lanza el conjunto rápido:

```bash
pnpm perf:baseline
```

Este conjunto mide las siete URLs representativas usadas en el baseline:

- `/es`
- `/es/bede`
- `/es/calculo/exam/2023-01`
- `/es/deese/practice/intro-y-objetos`
- `/es/esei/exam/2025-07`
- `/es/iesede`
- `/es/privacy`

Unlighthouse abre su panel local para consultar los resultados. Para generar
un JSON expandido sin el panel, usa:

```bash
pnpm perf:baseline:json
```

La variante `:json` es la recomendada para comparar cambios: ejecuta las tres
muestras por URL y deja el resultado en `unlighthouse/runs/ci-result.json`.
La configuración inicializa un `localStorage` y un `sessionStorage` aislados
para que el popup de GitHub y su contador no alteren las mediciones; los
informes siguen siendo locales y no se suben al repositorio.

## Escaneo completo

Para descubrir todas las URLs mediante el sitemap y el crawler:

```bash
pnpm perf:full
```

El resultado JSON se puede generar con:

```bash
pnpm perf:full:json
```

El servidor local se inicia con `SITE_URL` para que el sitemap devuelva URLs
locales. Si usas otro puerto o un servidor de desarrollo, define ambas
variables al iniciar y al escanear:

```bash
SITE_URL=http://127.0.0.1:3000 pnpm dev
UNLIGHTHOUSE_SITE=http://127.0.0.1:3000 pnpm perf:baseline
```

La configuración usa móvil, throttling, tres muestras por URL y ejecuciones
seriales. Esto mantiene el benchmark comparable con las exportaciones
originales y evita ráfagas innecesarias de peticiones externas.
