---
status: accepted
---

# Presencia semanal con Appwrite

Pásame Exámenes guarda la última visita y un identificador anónimo de presencia en una tabla privada de Appwrite. Un alias público solo se guarda tras una acción explícita del estudiante y si supera el filtro de contenido; el alias local puede ser distinto y no se comparte. Un alias que luego no supera el filtro conserva su última versión pública hasta que caduque, salvo que el estudiante el retire explícitamente. El navegador crea una sesión anónima de Appwrite y solo puede invocar Functions que registran una visita o devuelven el resumen semanal. El alias no es una clave y el identificador local de Umami no se envía a Appwrite.

La tabla registra todas las sesiones visibles dentro de una ventana móvil de 168 horas, aunque no compartan perfil. El navegador registra la visita al entrar, al recuperar el foco y cada cinco minutos visibles; la Function aplica el mismo límite para que un cliente modificado no agote las escrituras. Compartir o retirar un alias público tiene además un límite persistente de una acción por sesión anónima cada cinco minutos; una respuesta limitada no modifica la tabla. La consulta de resumen se limita a Home y portadas de asignatura, al entrar y cada quince minutos visibles, para preservar la cuota de lecturas. Una Function programada elimina los registros que superan ocho días para limitar la conservación.

Appwrite aplica un límite de borde por sesión anónima y Function: hasta veinticuatro invocaciones por hora para el heartbeat y otras veinticuatro para el resumen. El margen permite los doce heartbeats horarios normales y las actualizaciones forzadas después de un cambio de perfil, pero limita un cliente modificado antes de que alcance las Functions. El plan actual admite dos reglas WAF, por lo que se reservan para estos dos límites por sesión; la creación de sesiones anónimas conserva además los límites nativos de Appwrite por IP. Los límites del cliente reducen el tráfico legítimo; los de la Function y el borde son los que se consideran de seguridad.

La misma tabla conserva como máximo los cincuenta alias públicos válidos más recientes y devuelve una muestra de treinta perfiles. El filtro `@2toad/profanity` con inglés y español se ejecuta tanto en cliente como en Function; el botón de compartir siempre guarda el alias local, aunque no llegue a publicarse. Solo el entorno Production de Vercel sincroniza Appwrite. El servidor de desarrollo, `pnpm preview` y los Preview Deployments de Vercel usan treinta perfiles simulados y no envían heartbeats ni cambios de nombre. Producción no inventa presencia: conserva el último resumen válido en memoria o esconde el card si no puede obtenerlo.

## Dimensionamiento y cuota

Con la referencia observada entre el 23 de junio y el 10 de julio (1,2 mil visitantes, 3 mil visitas y 6 min 59 s de duración media), una visita genera normalmente dos escrituras: entrada y el heartbeat de cinco minutos. Son aproximadamente 6 mil escrituras en 18 días, o 10 mil al mes, muy por debajo de las 250 mil escrituras mensuales del plan gratuito de Appwrite.

En el caso conservador de que las 3 mil visitas entren en Home o una portada de asignatura, cada resumen lee un total y hasta treinta perfiles: 31 lecturas. Son como máximo 93 mil lecturas en 18 días, o unas 155 mil al mes. La actualización cada quince minutos, el TTL de cinco minutos de Appwrite y el límite de treinta perfiles mantienen ese presupuesto por debajo de las 500 mil lecturas mensuales gratuitas. Estas cifras cuentan operaciones de datos; las Functions se mantienen en dos para respetar también el límite del plan gratuito.

## Alternativa descartada

No se accede a la tabla desde el navegador ni se le da acceso público. Eso permitiría leer, modificar o suplantar presencia sin que la Function pudiera validar la identidad anónima de Appwrite.

No se usa el identificador de Umami para presencia. Hacerlo permitiría correlacionar directamente los datos de analítica y Appwrite sin ser necesario para el recuento.
