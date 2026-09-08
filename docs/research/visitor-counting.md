# Investigación: visitantes únicos y presencia en tiempo real

Fecha de revisión: 8 de septiembre de 2026. El análisis combina el código de la aplicación, los datos del proyecto de Appwrite y la implementación pública de Umami y BrandMyMac.

## Conclusión

El valor `57` de Pásame Exámenes no era comparable con los `10` visitantes observados inicialmente en Umami. El contador de la aplicación contaba usuarios anónimos de Appwrite que habían actualizado su presencia en las últimas 168 horas. Umami cuenta sesiones únicas derivadas de la IP y del User-Agent. Son dos identificadores distintos y, por tanto, dos métricas distintas.

La ventana semanal no era la causa del desfase temporal. Aunque el resumen consultaba siete días, la tabla empezó a recibir casi todos sus registros después del despliegue de la presencia. En la comprobación con el MCP de Appwrite había 57 filas en `weekly_visits`, 61 usuarios anónimos y todas las filas correspondían a un `userId` de Appwrite. También se observó una concentración de 43 filas poco después del merge de la PR #158. El backend estaba devolviendo el número real de filas que se le pedía; no había una multiplicación producida por `parseSummary` ni por la consulta del resumen.

El 8 de septiembre se comprobó el acceso de solo lectura de `visit-counter` contra el sitio `pe.pablopl.dev`. Para la ventana móvil `2026-09-01T13:05:59.600Z`–`2026-09-08T13:05:59.600Z`, Umami devolvió `31 visitors`, `49 visits` y `234 pageviews`. El mismo sitio devolvió `0` visitantes activos en los cinco minutos anteriores en esa consulta. El valor es dinámico y no debe confundirse con el valor histórico de siete días.

## Cómo cuenta Umami

La documentación de Umami define `Visitors` como el número único de sesiones. Define una sesión mediante un hash de datos como el sitio, la IP y el User-Agent, con una sal que rota periódicamente. La documentación de sesiones confirma que el identificador se genera anónimamente a partir de IP, User-Agent y sitio, sin cookies. [Metric definitions](https://docs.umami.is/docs/metric-definitions) y [Sessions](https://docs.umami.is/docs/sessions).

El código actual de Umami concreta ese comportamiento en `src/app/api/send/route.ts`:

```ts
const sessionSalt = getSalt(saltRotation, createdAt);
const sessionId = uuid(sourceId, ip, userAgent, sessionSalt);
```

La sal es mensual por defecto, aunque puede configurarse como diaria o semanal. `uuid()` es un UUID determinista basado en un hash que incluye el secreto de la instalación. Por eso, durante la misma ventana de sal:

- Dos personas con la misma IP pública y el mismo User-Agent pueden quedar agrupadas.
- La misma persona puede generar otra sesión si cambia de IP, navegador, dispositivo o algunos datos del User-Agent.
- Al rotar la sal, una misma persona puede volver a contar como otra sesión.
- La IP se utiliza para derivar el identificador, pero el modelo de sesión no guarda la IP como campo de la sesión.

La métrica `Visits` es diferente. Umami deriva un `visitId` con la sesión y una sal horaria y lo renueva después de 30 minutos de inactividad. No debemos confundir `visitors`, `visits` y `active visitors`.

El panel de visitantes únicos cuenta `COUNT(DISTINCT session_id)` sobre los eventos del intervalo elegido, tanto en la consulta relacional como en ClickHouse. El código está en [getWebsiteStats.ts](https://github.com/umami-software/umami/blob/ca661c7057984aa98ed4f7083d84dae2f65bfcb0/src/queries/sql/getWebsiteStats.ts). El contador de activos de Umami tampoco es una sesión de Appwrite: cuenta las sesiones distintas que han producido un evento en los últimos cinco minutos, en [getActiveVisitors.ts](https://github.com/umami-software/umami/blob/ca661c7057984aa98ed4f7083d84dae2f65bfcb0/src/queries/sql/getActiveVisitors.ts).

Umami permite enviar un `Distinct ID`, pero no es el identificador anónimo por defecto. Sirve para enlazar actividad conocida entre sesiones, incluso entre dispositivos. Cada navegador sigue teniendo su propia sesión, que se asocia al Distinct ID. [Distinct IDs](https://docs.umami.is/docs/distinct-ids).

El endpoint de Umami también aplica una comprobación de bots antes de guardar el evento. Por tanto, automatizaciones, crawlers y algunos clientes sin navegador pueden aumentar Appwrite sin aumentar Umami.

## Qué hace realmente BrandMyMac

El bundle de producción inspeccionado contiene la lógica del contador. La página pública muestra los dos valores en [brandmymac.com](https://brandmymac.com), y la implementación se puede revisar en su [chunk de Next.js](https://brandmymac.com/_next/static/immutable/chunks/0v0jutfe0hluu.js).

### Total de visitantes

El código usa la clave `bmm.counted` en `sessionStorage`:

1. Si la clave no existe, llama a la RPC de Supabase `record_view` sin argumentos.
2. Muestra el valor devuelto por la RPC.
3. Guarda `bmm.counted = "1"`.
4. Si la clave ya existe, lee `site_stats.views`.

La clave vive en la pestaña y se pierde al cerrar la pestaña o abrir otra sesión de navegación. Por tanto, la unidad anti-repetición visible en el cliente es la sesión/pestaña que llama a una función de incremento, no un identificador persistente de persona o navegador. La propia función `record_view` no recibe ningún identificador de visitante desde el cliente. Su SQL no está expuesto públicamente, así que no se puede descartar que añada alguna deduplicación adicional por IP, pero el bundle no aporta evidencia de ello.

### Personas online

Para `online now`, el código mantiene otra clave, `bmm.presence`, en `sessionStorage`. Genera un UUID por pestaña, lo envía mediante `POST /api/presence` y repite la llamada cada 30 segundos mientras la página está visible. Después consulta la RPC `visitors_now`. El resultado depende de los registros recientes que filtre esa RPC, no del total histórico.

La inspección en vivo confirmó estas llamadas. En ese momento, una llamada al endpoint respondió `{ "ok": true }`, la RPC `visitors_now` devolvió `7` y la lectura de `site_stats` devolvió `113206`. El valor cambia entre cargas porque son métricas dinámicas. DataFast está cargado, pero el widget de DataFast solo aparece como fallback si las consultas de Supabase no están disponibles; no es el origen normal de los dos valores mostrados.

## Qué aporta Appwrite y qué no aporta

Appwrite tiene tres conceptos relevantes:

- `Account` y `User`: un usuario de Appwrite tiene un `userId` estable mientras se conserve su cuenta y su sesión.
- Sesión anónima: `createAnonymousSession()` crea un usuario invitado. Si el visitante borra los datos del navegador, cambia de dispositivo o la sesión expira, no puede volver a iniciar sesión anónimamente como el mismo usuario. [Anonymous login](https://appwrite.io/docs/products/auth/anonymous).
- Presencia: la API de Presences mantiene un estado corto con `userId`, `status`, `metadata` y `expiresAt`, con limpieza automática y eventos Realtime. Es útil para “online now”, pero sigue estando asociada al usuario de Appwrite que creó la presencia. [Presences](https://appwrite.io/docs/products/auth/presences).

Appwrite no ofrece un algoritmo incorporado que determine que dos navegadores son la misma persona. Su `userId` identifica una cuenta, no una persona real. Las identidades de Appwrite sirven para enlazar métodos de autenticación, especialmente proveedores OAuth, no para hacer fingerprinting anónimo de visitantes. [Identities](https://appwrite.io/docs/products/auth/identities).

Además, Appwrite advierte que cuando la API está en otro dominio los navegadores pueden bloquear cookies de terceros y el SDK puede caer en `localStorage`. Para una sesión más estable y segura recomienda un endpoint de Appwrite bajo el mismo dominio de la aplicación, por ejemplo `appwrite.example.com`. [Custom domains](https://appwrite.io/docs/products/network/custom-domains).

## Comparación con la implementación actual

En Pásame Exámenes:

- `ensureAnonymousSession()` reutiliza `account.get()` y solo crea una sesión anónima cuando no encuentra una sesión válida.
- La Function de presencia guarda la fila con `rowId = x-appwrite-user-id` y también atiende el resumen.
- El resumen lee los perfiles públicos de la última semana y obtiene el total mediante `getWebsiteStats` de Umami; ya no usa `total: true` de las filas de presencia.
- El cliente registra al entrar, al recuperar el foco y cada cinco minutos visibles.
- La tabla no tiene IP, User-Agent ni un `visitorKey` derivado. Solo tiene la identidad técnica de Appwrite y sus timestamps.

La comprobación del backend muestra que el valor `57` es coherente con ese diseño. La explicación más probable del desfase es que Umami está agrupando varias visitas que comparten IP pública y User-Agent, mientras Appwrite conserva cada cuenta anónima como una identidad distinta. También es posible que haya cuentas adicionales por sesiones creadas desde distintos navegadores, pestañas concurrentes o pérdida de la sesión/cookie. Los datos actuales prueban que hay 57 identidades de Appwrite, pero no permiten afirmar que sean 57 personas.

No se observó un fallo evidente de configuración de Umami en la producción revisada: la página carga el tracker para `pe.pablopl.dev`, el navegador llega a solicitar `/api/send` y el navegador de prueba no declara Do Not Track. Aun así, bloqueadores, navegadores con Do Not Track o errores de carga pueden hacer que Umami registre menos eventos que Appwrite.

El hecho de que la mayoría de las filas aparecieran en un burst tras el despliegue no demuestra por sí solo un bug: puede ser tráfico real concentrado o una combinación de sesiones anónimas nuevas. Sí indica que conviene medir la deduplicación antes de dar ese número por equivalente a visitantes únicos.

## Decisión aplicada

La aplicación usa una única Appwrite Function de presencia y una única base de datos:

- `heartbeat`, `share` y `unshare` actualizan la sesión anónima y los datos del Blobatar público.
- `summary` consulta en Appwrite los perfiles publicados y, desde la misma Function, llama a Umami con `@umami/api-client` para obtener `visitors` de las últimas 168 horas.
- La respuesta `{ count, students }` llega al navegador desde Appwrite. El navegador no contiene credenciales ni llama a Umami.
- La Function también conserva la limpieza programada de filas antiguas.

La métrica de Umami no identifica personas reales: agrupa redes compartidas y puede separar a la misma persona si cambia de IP, navegador o dispositivo. Es precisamente la aproximación que se busca para que el contador sea coherente con la analítica existente.

## Fuentes primarias

- [Umami metric definitions](https://docs.umami.is/docs/metric-definitions)
- [Umami sessions](https://docs.umami.is/docs/sessions)
- [Umami API client](https://docs.umami.is/docs/api/api-client)
- [Umami website statistics](https://docs.umami.is/docs/api/website-stats)
- [Umami send route](https://github.com/umami-software/umami/blob/ca661c7057984aa98ed4f7083d84dae2f65bfcb0/src/app/api/send/route.ts)
- [Umami crypto and salt rotation](https://github.com/umami-software/umami/blob/ca661c7057984aa98ed4f7083d84dae2f65bfcb0/src/lib/crypto.ts)
- [Appwrite anonymous login](https://appwrite.io/docs/products/auth/anonymous)
- [Appwrite accounts](https://appwrite.io/docs/products/auth/accounts)
- [Appwrite presences](https://appwrite.io/docs/products/auth/presences)
- [BrandMyMac live page](https://brandmymac.com)
- [BrandMyMac counter bundle](https://brandmymac.com/_next/static/immutable/chunks/0v0jutfe0hluu.js)
