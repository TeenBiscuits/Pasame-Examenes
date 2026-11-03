---
status: accepted
---

# Pecera de contribuidores sin backend

Se retiran Appwrite, sus Functions, las sesiones anónimas, los perfiles locales y públicos de estudiantes y el contador semanal. Esta decisión sustituye los ADR 0004 y 0005 para reducir mantenimiento.

La pecera conserva sus Blobatars y su interacción de arrastre. Sus nombres son los handles reales de GitHub de los contribuidores, enumerados en `src/data/contributors.ts`. No consulta una API en tiempo de ejecución ni requiere credenciales. La lista se verificó el 3 de noviembre de 2026 combinando `gh api repos/TeenBiscuits/Pasame-Examenes/contributors` con las firmas `Co-authored-by` de los commits (sin distinguir mayúsculas). La API de contribuidores no incluye todos los coautores que aparecen en GitHub. Se excluye únicamente `dependabot[bot]`.

Todas las aportaciones cuentan, también issues y correos: el mantenedor añade el handle a `scripts/contributors.manual.ts` al reconocer la contribución, aunque no haya commits. `pnpm update-contributors` combina esas aportaciones con los contribuidores y coautores de GitHub y genera la lista local; se ejecuta explícitamente, sin depender de GitHub durante el build ni en el navegador. El Blobatar transparente abre el modal existente con dos pasos: una demo local para probar un Blobatar y, al pulsar `Siguiente`, el texto y los enlaces para abrir un issue, consultar CONTRIBUTING.md o escribir un correo. El Blobatar de la demo acompaña al texto de ese segundo paso.

Las preferencias de estudio y apariencia siguen guardándose localmente. Umami continúa como analítica sin recibir nombres de estudiantes. No se modifica la infraestructura remota de Appwrite desde este cambio: sus recursos y variables de despliegue ya no son utilizados por la web y pueden retirarse por separado.

## Excepción intencionada: nombre libre en la demo local

El campo `¿Cómo te llamas?` de `BlobatarCreator` sirve únicamente para generar una vista previa que ve la propia persona. Acepta cualquier texto, incluido el vacío, sin comprobar formato, longitud, contenido ni existencia de una cuenta de GitHub. `Siguiente` permanece habilitado. El texto no representa un handle verificado, no crea un perfil, no se guarda y no se envía mediante las opciones de contribución. Al cerrar el modal, se descarta.

El botón de correo de `ContributeModal` abre `mailto:pablo.portas@udc.es`, sin incorporar el nombre de la demo ni exigir un @ de GitHub. La ausencia de validación del campo, de un recordatorio para indicar el handle y de un nombre precargado en el correo es comportamiento esperado, no un defecto que deba corregirse en revisión. No se debe volver a introducir el recordatorio eliminado para satisfacer la redacción anterior de este ADR.

Esta excepción se limita a la demo y al flujo de contacto del modal. La lista pública de la pecera sigue usando handles reales de GitHub, verificados por `pnpm update-contributors` antes de generar `src/data/contributors.ts`. La demo no publica ni añade automáticamente su Blobatar a esa lista. Contribuir por correo no requiere tener ni indicar una cuenta de GitHub; el reconocimiento en la pecera puede acordarse posteriormente con el mantenedor.
