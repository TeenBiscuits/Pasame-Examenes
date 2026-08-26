# Documentación del dominio

Indica cómo deben leer las skills de ingeniería la documentación del dominio al explorar el código.

## Antes de explorar

Lee uno de estos archivos:

- `CONTEXT.md` en la raíz del repositorio.
- `CONTEXT-MAP.md` en la raíz, si existe. Este archivo enlaza los `CONTEXT.md` de cada contexto.

Lee también los ADRs de `docs/adr/` que afecten al área de trabajo.

Si estos archivos no existen, continúa sin avisar ni proponer crearlos. La skill `domain-modeling` los crea cuando se resuelven términos o decisiones que lo requieren.

## Estructura

Este es un repositorio `single-context`:

```text
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-decision.md
│   └── 0002-decision.md
└── src/
```

## Usa el vocabulario del glosario

Cuando un issue, una propuesta de refactor o un test nombre un concepto del dominio, usa el término definido en `CONTEXT.md`. Si el concepto no aparece allí, comprueba si falta documentarlo antes de inventar otro nombre.

## Señala conflictos con ADRs

Si una propuesta contradice un ADR existente, indícalo de forma explícita en lugar de sustituirlo sin avisar.

## Documentación frente a código

`CONTEXT.md` y los ADRs aceptados describen el comportamiento esperado del dominio. Si el código contradice esa documentación, trata la diferencia como una carencia de la aplicación y adapta el código al modelo documentado. Solo cambia la documentación cuando cambie la decisión del dominio.
