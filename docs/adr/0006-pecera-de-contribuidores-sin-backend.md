---
status: accepted
---

# Pecera de contribuidores sin backend

Se retiran Appwrite, sus Functions, las sesiones anónimas, los perfiles locales y públicos de estudiantes y el contador semanal. Esta decisión sustituye los ADR 0004 y 0005 para reducir mantenimiento.

La pecera conserva sus Blobatars y su interacción de arrastre. Sus nombres son los handles reales de GitHub de los contribuidores, enumerados en `src/data/contributors.ts`. No consulta una API en tiempo de ejecución ni requiere credenciales. La lista se verificó el 3 de noviembre de 2026 combinando `gh api repos/TeenBiscuits/Pasame-Examenes/contributors` con las firmas `Co-authored-by` de los commits (sin distinguir mayúsculas). La API de contribuidores no incluye todos los coautores que aparecen en GitHub. Se excluye únicamente `dependabot[bot]`.

Todas las aportaciones cuentan, también issues y correos: el mantenedor añade el handle a `scripts/contributors.manual.ts` al reconocer la contribución, aunque no haya commits. `pnpm update-contributors` combina esas aportaciones con los contribuidores y coautores de GitHub y genera la lista local; se ejecuta explícitamente, sin depender de GitHub durante el build ni en el navegador. El Blobatar transparente abre un modal con enlaces para abrir un issue, consultar CONTRIBUTING.md o escribir un correo y pide indicar el handle de GitHub.

Las preferencias de estudio y apariencia siguen guardándose localmente. Umami continúa como analítica sin recibir nombres de estudiantes. No se modifica la infraestructura remota de Appwrite desde este cambio: sus recursos y variables de despliegue ya no son utilizados por la web y pueden retirarse por separado.
