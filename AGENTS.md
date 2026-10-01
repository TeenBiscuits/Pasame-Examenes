## Agent skills

### Issue tracker

Los issues y las especificaciones viven en GitHub Issues y se gestionan con `gh`. Consulta `docs/agents/issue-tracker.md`.

### Triage labels

Se usan las cinco etiquetas predeterminadas de triage. Consulta `docs/agents/triage-labels.md`.

### Domain docs

El repositorio usa un diseño `single-context`, con `CONTEXT.md` en la raíz y ADRs en `docs/adr/`. Consulta `docs/agents/domain.md`.

<!-- intent-skills:start -->
## Skill Loading

Use the repository’s installed Intent. If it is unavailable, report the missing dependency instead of downloading a replacement.
Before editing files for a substantial task:
- Run `pnpm exec intent list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm exec intent load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->
