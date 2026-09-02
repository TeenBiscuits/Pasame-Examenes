# Pásame Exámenes

Pásame Exámenes es una plataforma de estudio para que estudiantes de la FIC preparen sus asignaturas con preguntas de exámenes y ejercicios de práctica.

## Lenguaje

### Personas

**Estudiante**: Persona que usa Pásame Exámenes para preparar una asignatura.
_Evitar_: Usuario, cliente

**Perfil local**: Alias local y Blobatar que se crean y guardan en el navegador de un estudiante. El alias local puede repetirse entre estudiantes y nunca es su identificador único.
_Evitar_: Cuenta, identidad de estudiante

**Alias local**: Nombre que un estudiante elige o recibe de forma aleatoria y que ve en su propio perfil. Puede contener contenido no apto para mostrarse a terceros.
_Evitar_: Identificador de presencia, nombre público

**Alias público de presencia**: Nombre que se comparte con otros estudiantes junto al Blobatar durante la presencia semanal. Solo existe cuando un estudiante pulsa `Continuar` o `Compartir este nombre` y el alias supera el filtro de contenido. No es único. El botón también guarda el alias local aunque el filtro rechace su publicación. Si un alias público pasa a ser no apto, el último alias público válido permanece hasta que caduque su presencia; `Dejar de compartir mi nombre` lo retira inmediatamente.
_Evitar_: Alias local, identificador de estudiante

**Perfil público de presencia**: Alias público de presencia y Blobatar que pueden mostrarse junto al recuento semanal. Un estudiante puede contar en el recuento sin tener un perfil público de presencia.
_Evitar_: Perfil local, cuenta pública

**Identificador anónimo de presencia**: Identificador técnico que Appwrite asigna al navegador para asociar sus visitas semanales. No se muestra, no se deriva del alias y no es el identificador de analítica.
_Evitar_: Nombre de estudiante, identificador de Umami, cuenta visible

**Estudiantes esta semana**: Recuento visible de estudiantes cuya última visita registrada ocurrió dentro de las 168 horas anteriores al momento de consulta. Es una ventana móvil; no equivale a los estudiantes que visitaron la web entre el lunes y el domingo de una semana natural, ni a los que están conectados ahora. Se calcula por sesión anónima de navegador, por lo que no garantiza personas únicas ni exige tener un perfil público de presencia.
_Evitar_: Estudiantes conectados, estudiantes de la semana natural

### Catálogo académico

**Asignatura**: Unidad académica de un grado que reúne sus temas, exámenes y preguntas. Su código oficial dentro del grado es su identidad académica; el identificador corto es una referencia de navegación.
_Evitar_: Materia, subject

**Tema**: Parte de una asignatura que agrupa preguntas sobre un área concreta del temario.
_Evitar_: Topic, unidad

**Examen**: Conjunto publicado de preguntas que se presenta como un examen de una asignatura. Puede definir una duración, un criterio de aprobado y reglas de puntuación por pregunta.
_Evitar_: Recopilatorio, simulación

**Recopilatorio**: Conjunto publicado de preguntas para practicar en una asignatura que no comparte sus exámenes oficiales, o cuyo contenido no debe presentarse como un examen de la facultad. Puede definir las mismas reglas de práctica, simulación, duración, aprobado y puntuación por pregunta que un examen.
_Evitar_: Examen oficial, prueba oficial

**Pregunta**: Unidad evaluable que pertenece a una asignatura, a un único examen o recopilatorio de origen y a un único tema, y que puede practicarse dentro de ese tema. Tiene una puntuación y puede tener una penalización propias. Dos preguntas parecidas de fuentes distintas siguen siendo preguntas diferentes.
_Evitar_: Ítem, ejercicio, cuestión

**Tipo de pregunta**: Forma en que una pregunta presenta la respuesta y determina cómo se corrige. Los tipos actuales son test, texto, texto con varias partes, emparejamiento, rellenar huecos y rellenar tablas.
_Evitar_: Formato de pregunta

**Solución modelo**: Respuesta de referencia que explica o resuelve una pregunta y permite autoevaluar las respuestas abiertas.
_Evitar_: Respuesta correcta, solución oficial

### Sesiones y resultados

**Práctica**: Sesión de estudio centrada en un tema y sin límite de tiempo. Puede reunir preguntas de varias fuentes seleccionadas.
_Evitar_: Modo práctica

**Simulación de examen**: Sesión cronometrada basada en un único examen o recopilatorio publicado, que aplica sus reglas de aprobado y puntuación.
_Evitar_: Examen, modo examen

**Intento**: Resultado de enviar una práctica o una simulación de examen, incluida una simulación que termina al agotarse el tiempo. Conserva las respuestas, la puntuación y la configuración de la sesión. Una sesión abandonada antes del envío no es un intento.
_Evitar_: Sesión, resultado

La autoevaluación posterior completa el mismo intento y puede actualizar su puntuación hasta que todas las respuestas autoevaluables estén calificadas.

**Aprobado**: Resultado de una simulación cuya calificación está completa y alcanza el umbral definido para el examen.
_Evitar_: Superado, pass

**Calificación pendiente**: Estado de una simulación que todavía tiene respuestas autoevaluables sin calificar ni marcar como `En blanco`.
_Evitar_: Resultado final

**Progreso**: Estado de preparación de un estudiante en un tema y dentro de las fuentes seleccionadas, calculado a partir del mejor resultado conocido para cada pregunta de las prácticas. Se agrega solo con las preguntas de las fuentes seleccionadas, y las simulaciones no cambian el progreso del tema.
_Evitar_: Avance, porcentaje completado

**Corrección automática**: Evaluación de una respuesta mediante las reglas de la pregunta, sin que el estudiante tenga que decidir si acertó.
_Evitar_: Autocorrección

**Autoevaluación**: Valoración que hace el estudiante de una respuesta abierta al compararla con la solución modelo. La valoración forma parte de la puntuación de la sesión y puede completarse indicando que la pregunta quedó `En blanco`.
_Evitar_: Corrección automática

**Puntuación parcial**: Puntos que recibe una pregunta cuando solo una parte de sus respuestas o elementos es correcta. Si otra parte es incorrecta, la penalización de la pregunta se aplica una sola vez.
_Evitar_: Todo o nada

**Puntuación acumulativa**: Modelo en el que una respuesta correcta suma sus puntos y una respuesta incorrecta o marcada `En blanco` suma cero. Es el modelo predeterminado cuando la fuente no define penalizaciones.
_Evitar_: Puntuación negativa

**Penalización por respuesta incorrecta**: Regla opcional de un examen o recopilatorio que define una resta para cada pregunta concreta. Solo se aplica una vez en simulaciones de examen cuando el estudiante marca la respuesta como incorrecta, no cuando la marca `En blanco` ni en las prácticas.
_Evitar_: Penalización de práctica

**Respuesta no introducida**: Estado en el que la aplicación no contiene texto para una respuesta. No indica si el estudiante respondió fuera de la aplicación.
_Evitar_: En blanco, respuesta incorrecta

**En blanco**: Declaración explícita del estudiante de que no respondió a una pregunta. Recibe cero puntos y no activa una penalización por respuesta incorrecta.
_Evitar_: Campo vacío, respuesta no introducida

**Puntuación total**: Resultado de sumar los puntos obtenidos y aplicar las penalizaciones de una sesión. Nunca puede ser inferior a `0.0`.
_Evitar_: Puntuación bruta

**Selección de fuentes**: Conjunto de exámenes y recopilatorios que el estudiante elige para formar su práctica por tema y delimitar el progreso que quiere consultar. Cambiarlo no modifica el catálogo ni el contenido de las fuentes.
_Evitar_: Filtro de asignatura

**Configuración de la sesión**: Datos que definen qué se estudia en un intento: el modo, el tema o examen elegido y las fuentes seleccionadas. El idioma de la interfaz no forma parte de esta configuración.
_Evitar_: Preferencias de idioma

**Megatema**: Agrupación visible de temas relacionados dentro de una asignatura. No es una unidad independiente de práctica y no cambia la pertenencia de las preguntas.
_Evitar_: Supertema, categoría

**Pregunta repetida**: Pregunta cuyo contenido sustancial aparece también en otra pregunta de un examen o recopilatorio distinto. Cada aparición conserva su propio identificador, puede marcarse como repetida y mantiene su propio dominio.
_Evitar_: Pregunta similar, duplicado

**Fuente original**: PDF, enlace u otro material del que procede un examen o recopilatorio.
_Evitar_: Fuente de práctica

**Contenido retirado**: Pregunta o examen que sigue identificado dentro de una asignatura, pero ya no está disponible para practicarlo o simularlo.
_Evitar_: Contenido borrado, contenido eliminado

**Reinicio de progreso**: Acción que elimina todos los intentos de práctica de una asignatura.
_Evitar_: Borrar una selección

### Origen del contenido

**Contenido autorizado**: Preguntas o materiales de una asignatura cuya publicación cuenta con permiso para compartirlos.
_Evitar_: Contenido oficial, contenido libre

**Contenido comunitario**: Preguntas y ejercicios de una asignatura compartidos por la comunidad para practicar, sin presentar ese material como un examen oficial.
_Evitar_: Contenido de usuario, contenido oficial

Cada asignatura tiene una única política de contenido: autorizado o comunitario.

### Visibilidad

**Asignatura de prueba**: Asignatura que se conserva para probar contenido y comportamiento de la plataforma. Solo forma parte del catálogo durante el desarrollo interno.
_Evitar_: Asignatura pública

**Easter egg**: Funcionalidad o contenido oculto que forma parte intencionadamente de la experiencia de la web, aunque no aparezca en el catálogo público.
_Evitar_: Asignatura de prueba, contenido retirado

### Idioma

**Idioma de la interfaz**: Preferencia que cambia los textos y la navegación de la plataforma. Pásame Exámenes ofrece español, galego e inglés.
_Evitar_: Idioma de la asignatura

**Idioma del contenido**: Idioma en el que está escrita una pregunta o solución. Puede ser el idioma en el que se imparte la asignatura o el idioma del material del que procede.
_Evitar_: Traducción de la interfaz

### Apariencia

**Paleta**: Conjunto de colores y roles visuales que define la apariencia de la interfaz en un esquema claro u oscuro. La aplicación dispone de varias paletas claras y varias paletas oscuras.
_Evitar_: Tema de color, tema visual

**Esquema de color**: Preferencia que determina si la interfaz usa siempre una paleta clara, siempre una paleta oscura o alterna entre ambas según el sistema operativo, incluso cuando este cambia mientras la aplicación está abierta.
_Evitar_: Modo de tema, modo visual

**Paleta clara**: Cualquier paleta de la colección clara, aplicable cuando el esquema de color está en claro o cuando el sistema operativo indica una apariencia clara. La paleta predeterminada es Sol; si una preferencia no es válida, se usa Sol.
_Evitar_: Tema claro

**Paleta oscura**: Cualquier paleta de la colección oscura, aplicable cuando el esquema de color está en oscuro o cuando el sistema operativo indica una apariencia oscura. La paleta predeterminada es Luna; si una preferencia no es válida, se usa Luna.
_Evitar_: Tema oscuro
