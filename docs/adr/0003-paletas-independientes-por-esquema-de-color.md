---
status: accepted
---

# Paletas independientes por esquema de color

La apariencia de la aplicación separa el esquema de color de las paletas que este aplica. Existen varias paletas claras y varias oscuras; `Claro` usa la paleta clara preferida, `Oscuro` usa la paleta oscura preferida y `Sistema` elige entre ambas según el sistema operativo, reaccionando también a sus cambios mientras la aplicación está abierta. Las preferencias iniciales son Sol y Luna.

Cambiar una paleta solo modifica la preferencia de su colección y no sobrescribe la de la otra apariencia. Si una preferencia deja de ser válida, se recupera la paleta predeterminada de su colección. Las preferencias antiguas de una única paleta se migran a la colección correspondiente y conservan una combinación válida.

## Alternativa descartada

No se mantiene una única paleta activa: ese modelo perdería la elección de la otra apariencia al cambiar entre `Claro`, `Oscuro` y `Sistema`.
