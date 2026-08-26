# Issue tracker: GitHub

Los issues y las especificaciones de este repositorio viven en GitHub Issues. Usa `gh` para todas las operaciones.

## Convenciones

- Crear un issue: `gh issue create --title "..." --body "..."`. Usa un heredoc para cuerpos multilínea.
- Leer un issue: `gh issue view <number> --comments`. Filtra los comentarios con `jq` y consulta también las etiquetas.
- Listar issues: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`, con los filtros `--label` y `--state` que correspondan.
- Comentar un issue: `gh issue comment <number> --body "..."`
- Añadir o quitar etiquetas: `gh issue edit <number> --add-label "..."` o `gh issue edit <number> --remove-label "..."`
- Cerrar un issue: `gh issue close <number> --comment "..."`

El repositorio se infiere de `git remote -v`. `gh` lo detecta al ejecutarse dentro de este clon.

## Pull requests como entrada de triage

**Los PRs no se usan como entrada de triage.** Cambia este valor a `yes` si el repositorio trata los PRs externos como solicitudes de funcionalidad.

Cuando el valor sea `yes`, los PRs usarán las mismas etiquetas y estados que los issues, mediante los comandos equivalentes de `gh pr`:

- Leer un PR: `gh pr view <number> --comments` y `gh pr diff <number>`.
- Listar PRs externos: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments`. Conserva solo `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR` o `NONE` en `authorAssociation`.
- Comentar, etiquetar o cerrar: `gh pr comment`, `gh pr edit --add-label` o `gh pr edit --remove-label`, y `gh pr close`.

GitHub comparte la numeración entre issues y PRs. Si `#42` puede referirse a cualquiera de los dos, prueba `gh pr view 42` y después `gh issue view 42`.

## Cuando una skill diga "publicar en el issue tracker"

Crea un issue de GitHub.

## Cuando una skill diga "obtener el ticket correspondiente"

Ejecuta `gh issue view <number> --comments`.

## Operaciones de wayfinder

Wayfinder usa un issue principal con issues hijos.

- Mapa: un issue con la etiqueta `wayfinder:map`, que contiene las secciones Notes, Decisions-so-far y Fog. Créalo con `gh issue create --label wayfinder:map`.
- Ticket hijo: un issue vinculado al mapa como sub-issue de GitHub. Si los sub-issues no están disponibles, añade el ticket a una lista de tareas del mapa y coloca `Part of #<map>` al principio del cuerpo. Usa las etiquetas `wayfinder:<type>` con `research`, `prototype`, `grilling` o `task`. Cuando se reclame el ticket, asígnalo al desarrollador que lo está llevando.
- Bloqueos: usa las dependencias nativas de GitHub. Añade una dependencia con `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, donde `<blocker-db-id>` es el `id` numérico del issue bloqueador. No uses el número visible ni el `node_id`. GitHub expone los bloqueos abiertos en `issue_dependencies_summary.blocked_by`. Si las dependencias no están disponibles, añade `Blocked by: #<n>, #<n>` al principio del cuerpo del ticket. Un ticket queda desbloqueado cuando todos sus bloqueos se cierran.
- Consulta de frontera: lista los tickets hijos abiertos del mapa, elimina los que tengan bloqueos abiertos o una persona asignada, y elige el primero según el orden del mapa.
- Reclamar: `gh issue edit <n> --add-assignee @me`. Esta debe ser la primera escritura de la sesión.
- Resolver: `gh issue comment <n> --body "<answer>"`, después `gh issue close <n>`, y añade al mapa un enlace al contexto de la decisión.
