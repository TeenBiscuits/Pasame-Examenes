---
status: accepted
---

# Recuento semanal de visitantes con Umami

El recuento visible de `Estudiantes esta semana` usa la métrica `visitors` de Umami para `pe.pablopl.dev`, consultada en una ventana móvil de 168 horas. Umami es la misma herramienta que recibe el tráfico de la web y deduplica sus sesiones con su propio identificador anónimo, por lo que el contador representa mejor la métrica de visitantes de analítica que una fila por sesión anónima de Appwrite.

Una única Appwrite Function de presencia consulta Umami server-to-server y lee los perfiles publicados de la única base de datos de presencia. El navegador solo invoca esa Function y recibe el número agregado junto con los datos de los Blobatars públicos; las credenciales de Umami solo existen en las variables privadas de Appwrite. La misma Function atiende los heartbeats, los cambios de alias, la consulta del resumen y la limpieza programada.

Durante la transición se conserva la Function `presence_heartbeat` para que una versión anterior del frontend no pierda el registro de presencia. El frontend nuevo solo usa `presence_summary`; la Function antigua se podrá retirar después de publicar esta versión.

## Consecuencias

- El total de Umami puede diferir de personas reales: cambios de IP o User-Agent pueden separar sesiones y redes compartidas pueden agruparlas.
- Borrar datos del navegador o bloquear el tracker puede hacer que Umami no registre una visita; el contador no pretende ser un registro exhaustivo de personas.
- El intervalo consultado es el mismo para todas las personas y no depende de la sesión anónima de Appwrite, aunque la Function sí la usa para autorizar la operación y marcar el Blobatar propio.
- La métrica no significa que haya ese número de estudiantes conectados ahora. Para actividad actual se necesitaría consultar por separado la métrica de visitantes activos de Umami.

## Alternativa descartada

No se mantiene el total agregado contando filas de la base de datos de presencia. Esa identidad técnica mezclaba las sesiones anónimas de la aplicación con la métrica de visitantes de Umami y produjo el desfase observado.
