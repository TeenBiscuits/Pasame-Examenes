import type { Question } from "../../data/types";
import type { Picture } from "vite-imagetools";
import { getImage } from "../../lib/image";
import type { ImageMap } from "../../lib/image";

const imageMap = import.meta.glob<{ default: Picture }>(
  "./assets/*.{png,jpeg,jpg}",
  {
    query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" },
    eager: true,
  },
) as ImageMap;

export const questions: Question[] = [
  {
    id: "daypo-preguntas_01",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Por que una base de datos está normalmente formada por varios esquemas y relaciones",
    options: [
      "A. para evitar problemas de insercion, actualizado y borrado",
      "B. para tener la información más ordenada",
      "C. para que sea mas fácil entender la estructura de la base de datos",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_02",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Según el modelo relacional toórico, cuántas claves candidatas puede haber en una relación?",
    options: [
      "A. 0 o +",
      "B. 1 o +",
      "C. por lo menos dos, para tener donde escoger la clave primaria",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_03",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Por que se puede dar una anomalía de inserción en una base de datos?",
    options: [
      "A. porque se introducen los datos de forma incorrecta",
      "B. porque no se creo un índice sobre la clave primaria de la tabla",
      "C. porque la base de datos está mal diseñada",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_04",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Tenemos un tipo de entidad A y otro B. Existe un tipo de relación 1:N entre B y A ( unha entidade B puede relacionarse con muchas A, y una A sólo con una B). Si realizamos el paso a modelo relacional...",
    options: [
      "A. A incluirá como clave foránea el identificador de B.",
      "B. A incluirá el identificador de B como clave foránea, y también como parte de su clave primaria.",
      "C. En este caso tenemos que crear una nueva table, donde clave será la unión de los indentificadores de A y B",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_05",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "En el modelo relacional, un atributo de una tupla:",
    options: [
      "A. se tiene que almacenar obligatoriamente un valor del dominio del atributo o un nulo.",
      "B. se pueden almacenar varios valores del dominio del atributo o un nulo.",
      "C. se pueden almacenar otra relación o un nulo.",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_06",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Indica lo correcto sobre un sistema de control de concurrencia multiversión",
    options: [
      "A. Todas las lecturas se hacen de forma inmediata, sin esperas",
      "B. Es posible que una transacción que intenta escribir un dato tenga que abordar, debido a que una transacción más reciente ya leyó ese dato.",
      "C. Las  dos anteriores son correctas",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_07",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Tenemos un nivel de aislamiento READ UNCOMMITTED. Que problemas pueden aparecer en una ejecución concurrente de transacciones?",
    options: [
      "A. Perdida de actualización y lectura fantasma",
      "B. Lectura sucia (entre otros)",
      "C. Sólo puede aparecer el problema de lectura no repetible",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_08",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: 'Las técnicas "Esperar-Morir" y "Hervir-Esperar" son...',
    options: [
      "A. Protocolos de bloqueos, similares al protocolo de bloqueo en 2 fases.",
      "B. Técnicas de prevención de interbloqueos. Evitan que usando bloqueos, por ejemplo usando el protocolo 2PL, aparezca un interbloqueo",
      "C. Técnicas de detección de interbloqueos: si se produce un interbloqueo, seleccionan la víctima (la transacción más reciente) y hacen rollblack de esa transacción.",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_09",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Considera un escenariuo en el que no se aplica ninguna técnica de prevención de interbloqueos. Una transacción T1 bloquea en modo S (compartido) und ato. Otra transacción T2 solicita un bloqueo en modo X (eexclusivo) de ese mismo dato.En que caso se le concede el bloqueo a T2?",
    options: [
      "A. Sólo si T2 empezó antes de T1",
      "B. Sólo si T2 empezó después de T1 y no estamos en modo de aislamiento serializable.",
      "C. En ningún caso se le concede el bloqueo a T2",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_10",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "En el protocolo de bloqueo riguros de dos fases",
    options: [
      "A. los bloqueos se pueden adquirir durante toda la transacción y se liberaran cuando termina.",
      "B. los bloqueos sólo se pueden adquirir en el isntante de creación de la transacción y no se liberan yhasta que la transacción termina.",
      "C. hay unra fase de crecimiento que dura mientras sólo se adquieren bloqueos, la fase de decreciemiento comienza con la primera liberación de un bloqueo en cualquier moemento de la transacción, a partir de ese moemento, ya no se pueden adquierir nuevos bloqueos, y sólo se pueden liberar.",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_11",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Si una ejecución concurrente de dos transacciones T1 e T2 es serializable",
    options: [
      "A. El resultado final es igual al resultante de ejecutar primero T1 y luego T2 o ejecutar primero T2 y luego T1.",
      "B. El resultado final es igual al resultante de ejecutar primero T1 y luego T2 y también igual a ejecutar T2 y luego T1.",
      "C. Eol resultado final está bien, pero puede que no sea el mismo que ejecutar primero T1 y luego T2 ni tampoco ejecutar primero T2 y luego T1.",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_12",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "En el nivel de aislamiento REPEATABLE READ",
    options: [
      "A. Se puede dar el problema de lectura sucia",
      "B. Se puede dar el problema de lectura fantasma",
      "C. Se puede dar el problema de lectura no repetible",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_13",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "Una transacción",
    options: [
      "A. evita por si sola problemas de concurrencia",
      "B. empieza tomando un estado consistente de la base de datos y acaba en otro estado consistente",
      "C. mientras este activa la base de datos nunca esta en un estado inconsciente",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_14",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "El nivel de aislamiento Read committed",
    options: [
      "A. evita el problema de la lectura fantasma",
      "B. evita el problema de la lectura repetible",
      "C. evita el problema de la lectura sucia",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_15",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "En un sistema de control de concurrencia por multiversionado",
    options: [
      "A. siempre es posible leer sin esperas ",
      "B. siempre es posible escribir sin esperas",
      "C. siempre es posible leer pero puede que se tenga que esperar",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_16",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Usando bloqueos compartidos para lecturas y exclusivos para escrituras",
    options: [
      "A. se garantiza seriabilidad",
      "B. es necesario combinalos con un protocolo de bloqueo para garantizar seriabilidad",
      "C. se garantiza que no va a haber problemas debidos a fallos",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_17",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "Usando bloqueos compartidos y exclusivos",
    options: [
      "A. se asegura la seriabilidad",
      "B. no se asegura seriabilidad",
      "C. se asegura que no se producirá un interbloqueo",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_18",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "Usando un mecanismo multiversión",
    options: [
      "A. siempre se puede leer sin esperar",
      "B. cuando se escribe puede también tengamos que esperar",
      "C. las transacciónes nunca se abortan",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_19",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "Con el nivel de aislamiento READ COMMITTED",
    options: [
      "A. el problema de lectura no repetible puede ocurrir",
      "B. el problema de lectura fantasma no puede ocurrir",
      "C. el problema de lectura sucia puede ocurrir",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_20",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un tamaño de bloque físico grande en un sistema de ficheros",
    options: [
      "A. favorece las lecturas secuenciales de ficheros",
      "B. perjudica las lecturas secuenciales de ficheros",
      "C. favorece la lectura de un único fichero",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_21",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En el hash extensible",
    options: [
      "A. es posible encontrar, con una única lectura física, un registro que tenga un valor",
      "B. el fichero de datos tiene un tamaño fijo",
      "C. cuando se inserta un nuevo registro es posible que se tengan que recolocar los registros que había anteriormente en el fichero",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_22",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un árbol B+",
    options: [
      "A. es un árbol homogéneo",
      "B. tiene dos tipos de punteros en cada nodo",
      "C. tiene todos los nodos hoja enlazados por punteros",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_23",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Para actualizar un resgistro de un fichero son necesarias",
    options: [
      "A. una lectura física",
      "B. dos escrituras físicas",
      "C. una lectura y una escritura física",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_24",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un indice disperso",
    options: [
      "A. indexa todos los valores de la clave",
      "B. indexa algunos valores de la clave",
      "C. indexa el campo por el que esta ordenado el fichero",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_25",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un factor de bloqueo alto en un fichero",
    options: [
      "A. favorece la lectura secuencial del fichero",
      "B. favorece la lectura de registros individualmente",
      "C. no afecta en nada a las operaciones de lectura",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_26",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En los ficheros ordenados ¿Qué es cierto?",
    options: [
      "A. obtener un registro por igualdad de clave cuesta siempre una lectura física",
      "B. insertar un nuevo registro es simple",
      "C. hay que mantener el orden usando punteros",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_27",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En hash normal (estático), ¿Qué es cierto?",
    options: [
      "A. buscar registros por igualdad en la clave es ineficiente",
      "B. es imposible leer todos los registros que hay en el fichero",
      "C. si cambia el tamaño del fichero, probablemente habrá que recolocar casi todos los registros almacenados anteriormente",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_28",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "En que tipo de índice es más fácil hacer un recorrido ordenado de las claves indexadas?",
    options: ["A. Árbol B", "B. Árbol B+", "C. Fichero hash extensible"],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_29",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En un fichero hash estático",
    options: [
      "A. el fichero de overflow es usado para almacenar los sinónimos, y es una técnica muy eficiente cuando el factor de carga es superior ó 85%",
      "B. el direccionamiento abierto por prueba l8ineal requiere un espacio extra en el fichero de aproximadamente 36,7% para almacenar los sinónimos",
      "C. el direccionamiento abierto por rehashing no requiere un espacio extra en el fichero de hash, pero normalmente no se ve beneficiado por un alto factor de bloqueo",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_30",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "los ficheros en montículo (heap)",
    options: [
      "A.  facilitan la inserción, ya que se puede insertar en cualquiera de los bloques del fichero que tenga espacio suficiente para el nuevo registro",
      "B. se benefician de tener un factor de bloqueo alto para ofrecer buenas prestaciones a la hora de obtener todos los registros ordenados por clave",
      "C. son poco eficientes en el borrado ya que tienen que desplazar una posición hacia atrás todos los registros que están a continuación del registro borrado.",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_31",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Tenemos un fichero en el que vamos añadiendo registros. Que tipología de fichero es más susceptible de necesitar realizar una reorganización completa del fichero de forma periódica ?",
    options: [
      "A. fichero en montículo",
      "B. fichero ordenado",
      "C. fichero hash dinámico",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_32",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Cuál de los siguiente ses un índice en forma de árbol que tiene repetidos los valores de las claves en los nodos no hoja?",
    options: ["A. Árbol B", "B. Árbol B+", "C. Fichero hash dinámico"],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_33",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "paa leer los registros de un fichero en orden ascendente de clave, en que tipologías de fichero (montículo, ordenado, hash) es necesario utilizar la operación de ordenación merge-sort?",
    options: [
      "A. sólo el hash",
      "B. montículo y ordenados",
      "C. sólo montículo",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_34",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Que sucede si intentamos insertar una clave directamente en un nodo intermedio (no hoja) de un Árbol B q7ue ya está completo (produciéndose, por lo tanto, un overflow)? ",
    options: [
      "A. primero intentar redistribuir los datos con los hermanos adyacentes, y si no puede, dividirá el nodo y promocionará la clave central al nodo padre",
      "B. en los nodos no hoja no se intenta la redistribución. Si se produce overflow siempre se opta p9or la división del nodo.",
      "C. la situación presentada no es posible, ya que sólo se puede isnertar en los nodos hoja de los árboles B",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_35",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "En un fichero hash con función de Hash K mod N, y direccionamiento abierto por prueba lineal",
    options: [
      "A. el fichero tiene tamaño variable",
      "B. probamos a guardar el registro en el bloque indicado por la función hash. Si está lleno, probamos en el siguiente bloque y asi sucesivamente",
      "C. las dos respuestas anteriores son ciertas",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_36",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un factor de bloqueo alto en un fichero",
    options: [
      "A. favorece la lectura secuencial del fichero",
      "B. favorece la lectura de registros iindividualmente",
      "C. no afecta en nada a las operaciones de lectura",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_37",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Hash extensible: borramos el registro J en este fichero conservando el L ¿Qué valor tendrán después d y d´ para que el bloque que contenga a L?",
    image: getImage(imageMap, "daypo-preguntas-image-0.jpg"),
    options: ["A. d=3 d´=3", "B. d=3 d´=2", "C. d=2 d´=2"],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_38",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "La técnica slotted-page",
    options: [
      "A. es una estrategia usada por el sistema de paginación",
      "B. es una estrategia usada para almacenar registros de tamaño variable en los bloques de un fichero",
      "C. es una estrategia utilizada para gestionar colisiones en ficheros hash",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_39",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un árbol B+",
    options: [
      "A. es un árbol heterogéneo",
      "B. cada nodo posee dos tipos de punteros",
      "C. las 2 respuestas anteriores son correctas",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_40",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Un índice sobre un atributo que no es una clave primaria o candidata",
    options: [
      "A. se puede crear, y puede ser beneficioso en caso de que pocas tuplas compartan un mismo valor para ese atributo",
      "B. se puede crear, y puede ser beneficioso en caso de que muchas tuplas compartan un mismo valor para ese atributo y estén agrupadas por clave primaria",
      "C. no puede ser creado",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_41",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Árboles B: Si borramos el valor 20 en este árbol, con d=1 ¿Qué valores almacenará el nodo que ahora tiene el 17?",
    image: getImage(imageMap, "daypo-preguntas-image-1.jpg"),
    options: ["A. 17", "B. 14", "C. 12 y 14"],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_42",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "El protocolo de bloqueo de dos fases",
    options: [
      "A. especifica que se tienen que adquierir los bloqueos compartidos antes que los exclusivos",
      "B. especidifa que se tienen que adquirir todos los bloqueos justo en el momento de completar la transacción",
      "C. especifica que se tienen que adquirir todos los bloqueos antes de liberar ninguno",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_43",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "Los logs o registros histórico son utilizados para ",
    options: [
      "A. la recuperación ante fallos de una base de datos",
      "B. el control de concurrencia de una base de datos",
      "C. la optimización de consultas de una base de datos",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_44",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Considera el siguiente plan de ejecución, en el que dos transacciones acceden al mismo dato X ¿Qué problema se puede producir?",
    image: getImage(imageMap, "daypo-preguntas-image-2.jpg"),
    options: [
      "A. Problema de pérdida",
      "B. Problema de lectura sucia",
      "C. Problema de lectura no repetible",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_45",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "Cuando hacemos Rollback en Oracle",
    options: [
      "A. se deshace la última operación realizada en la base de datos",
      "B. es cuando se produce un fallo en la BD, y al recuperarse el sistema, éste recupera el estado de la BD inmediatamente anterior al fallo",
      "C. se recupera el estado de la BD que había al inicio de la transacción que termina con ese rollback",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_46",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "Un usuario dado de alta en un SGBD Oracle ",
    options: [
      "A. puede tener más de un rol",
      "B. tiene siempre un único rol",
      "C. no existen papeles en Oracle",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_47",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Las anomalías de inserción, borrado y modificaciones son debidas a ",
    options: [
      "A. utilizar de forma errónea SQL para introducir datos",
      "B. un mal diseño de la base de datos",
      "C. manipular los datos de forma incorrecta, especialmente cuando hay restricciones not null",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_48",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Usar la técnica de hash es más adecuado cuando:",
    options: [
      'A. las consultas que me importa acelerar son las de igualdad en la llave, del tipo "el empleado con número=7869".',
      "B. las consultas que me importa acelerar son de rango, del tipo empleados que ganan más de 1000€",
      "C. las consultas que me imporata acelerar son las de obtener todos los registros por orden de llave",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_49",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "En el hash normal (estático), qué es la técnica de preuba lineal?",
    options: [
      "A. si la función hash indica la posición i, entonces la entrada del directorio con ese número es accedida, y allí se encontrará el puntero que apunta al bloque de disco en el que el registro será insertado",
      "B. durante la la inserción, si la función hash indica la posición i, pero se produce una colisión, las posiciones i+1, i+2, i+3,... son probadas",
      "C. durante la inserción, si la función hash indica la posición i, pero se produce una colisión, las posiciones i+j, i+2j, i+3j,... son probadas, con j obtenida a partir de una segunda función hash",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_50",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "En un fichero hash, con redireccionamiento abierto por rehashing",
    options: [
      "A. a diferencia del redireccionamiento por linear-probing (prueba lineal), evita la congestión de determinadas zonas del fichero",
      "B. a diferencia del redireccionamiento por linear-probing (prueba lineal), puede provocar la congestión de determiandas zonas del fichero",
      "C. utilizar un factor de bloqueo alto favorece la realización de una búsqueda por igualdad en la clave",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_51",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "La técnica slotted-page",
    options: [
      "A. es una estrategia usada por el sistema de paginación",
      "B. es una estrategia usada para almacenar registros de tamaño variable",
      "C. es una estrategia utilizada para gestionar colisiones en ficheros hash",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_52",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "En una estructura de bloques con slots (slotted-page) usada para almacenar los registros de un fichero ¿qué es cierto?",
    options: [
      "A. el número de registros que caben como máximo en cada bloque es variable, porque almacena registros de tamaño variable",
      "B. cada bloque está compuesto por varios slots, y cada unod e ellos puede ser transferido a la memoria independientemente de los demás",
      "C. el número de registros que caben como máximo en cada bloque bloque es fijo, porque almacena registros de tamaño fijo",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_53",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Supongamos una búsqueda por igualdad en una clave en un fichero de datos con un índice sobre esa clave, sabiendo que sólo hay un registro con el valor de esa clave. En la práctica real, ¿cuál es normalmente el número de lecturas físicas que supone esta operación?",
    options: [
      "A. 4: una correspondiente al fichero de datos y 3 al índice (árbol), suponiendo que el árbol tenga 3 niveles",
      "B. 2: una correspondiente al fichero de datos, y 1 al índice (árbol). Suponiendo que el árbol tenga 3 niveles, los 2 primeros estén en memoria RAM y solamente el último nivel está en disco",
      "C. N/2B. Siendo N el núemro de registros del fichero y B el factor de bloqueo",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_54",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "En una tabla de empleados, supongamos que hay 100 empleados por bloque físico, y que hay en una buena probabilidad de que haya por lo menos un empleado de cada uno de los departamentos de la empresa por bloque. En una consulta que retorna los empleados de un departamento determinado",
    options: [
      "A. un índice por número de departamento no afectará en absoluta al tiempo de respuesta de la consulta",
      "B. un índice por el número de departamento acelerará la búsqueda seguro",
      "C. un índice por número de departamento probablemente no ayudará",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_55",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "La BD de la facultad guarda en un fichero ordenado por código los datos de las materias del grado (código, nombre, cuatrimiestre), en N registros de longitud fija. Si B es el factor de blqoeueo del fichero ¿cuál sería el coste medio normalmente de buscar en al fichero una materia (que sabemos que xiste) usando su código como clave?",
    options: [
      "A. N/B lecturas físicas",
      "B. B/N lecturas físicas",
      "C. N/2B lecturas físicas",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_56",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Cuando se inserta un registro en un fichero ordenado que ya tiene registros, ¿cuál de estas sería la mejor opción?",
    options: [
      "A. se hace siempre un hueco en el lugar apropiado para la inserción",
      'B. el registro se inserta en una posición no corresponde con el orden "natural" del fichero, pero se mantiene el orden usando putneros',
      "C. el fichero siempre tiene un hueco libre para insertar el registro, ya que en el fichero siempre dejamos esos espacios",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_57",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En una lectura secuencial de un fichero lo que conviene es ",
    options: [
      "A. tener un factor de bloqueo bajo",
      "B. tener un factor de bloqueo alto",
      "C. dejar huecos con espacio libre entre los registros",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_58",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un índice disperso",
    options: [
      "A. indexa algunos valores de clave",
      "B. indexa el campo por el que está ordenado el fichero",
      "C. indexa todos los valores clave",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_59",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Si tengo un fichero hash que coloca los sinónimos siendo la técnica de prueba lienal ¿qué me favorece?",
    options: [
      "A. que el fichero tenga un número de slots que sea un número par",
      "B. tener un factor de bloqueo bajo",
      "C. tener un factor de bloqueo alto",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_60",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Árboles B: Si añadimos el valor 7 en este árbol, con d=1 ¿qué valores almacenará el nodo que ahora contiene el valor 2?",
    image: getImage(imageMap, "daypo-preguntas-image-3.jpg"),
    options: ["A. 2 y 5", "B. 2 y 4", "C. 4"],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_61",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Árboles B: si añadimos el valor 13 en este árbol, con d=1 ¿qué valores almacenará el nodo que ahora contiene el valor 17?",
    image: getImage(imageMap, "daypo-preguntas-image-3.jpg"),
    options: ["A. 14", "B. 14 y 17", "C. 12 y 17"],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_62",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Árboles B: si borramos el valor 12 en este árbol, con d=1 ¿qué  valores almacenará el nodo que ahora contiene el valor 17?",
    image: getImage(imageMap, "daypo-preguntas-image-3.jpg"),
    options: ["A. 14", "B. 17", "C. 12 y 14"],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_63",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En un árbol heterogéneo",
    options: [
      "A. las búsquedas pueden terminar en nodos hoja",
      "B. cada nodo posee dos tipos de punteros",
      "C. las búsquedas siempre llegan a nivel de nodos hoja",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_64",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "La longitud media de las búsquedas por un valor concreto de clave, es mayor",
    options: [
      "A. en los árboles heterogéneos",
      "B. en los árboles homogéneos",
      "C. la longitud es la misma en los dos casos",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_65",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Árboles B",
    options: [
      "A. en los árboles B no es posible un recorrido secuencial por orden de clave",
      "B. no es posible construir un árbol B sobre una clave con valores duplicados",
      "C. cuánto más bajo, más rápidas son las búsquedas",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_66",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question:
      "Cuando se quiere modificar el valor de un campo de registro (por ejemplo, cambiar el salario de un empleado)",
    options: [
      "A. el sistema operativo debe trasladar de disco a memoria principal exclusivamente los bytes donde se almacena el campo del registro a modificar, en memoria se hace la modificación, y finalmente se debe escribir en disco esos  bytes modificados",
      "B. el sistema operativo debe trasladar de disco a memoria principal el bloque fisico entero donde está el registro a modificar, en memoria se hace la modificación del campo, y finalmente se debe escribir en disco el bloque modificado",
      "C. el sistema sobreescribe directamente en disco los bytes correspondientes al campo modificado",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_67",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Tenemos una dependiencia funcional A->B en un esquema de relación R. Sean s y t dos tuplas en una relación r (R). Si sabemos s [A]!=t[A], entonces",
    options: [
      "A. s[B]=t[B]",
      "B. s[B]!=t[B]",
      "C. no se puede asegurar nada sobre si s[B] y t[B] son iguales o distintos",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_68",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Si una clave candidata se le añade un atributo ¿sigue siendo clave candidata?",
    options: ["A. si", "B. no", "C. depende del caso"],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_69",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "La relación R(Calle, n, CP, Localidad) con dependencias funcionales f={Calle, n, localidad ->CP, CP-> localidad} ¿en qué forma normal está?",
    options: ["A. 1FN", "B. 3FN", "C. FNBC"],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_70",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "La relación R(Calle, n, CP, Localidad, teléfono) cuando el atributo teléfonos almacena todos los teléfonos asociados a las personas que viven en esa dirección ¿en qué forma normal está?",
    options: ["A. No está en 1FN", "B. FNBC", "C. 1FN"],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_71",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "El esquema de relación R(A,B,C,D), donde se dan las dependencias funcionales F{AB->C, AB->D, C->A}, asumiendo que cumple con la 1FN ¿en que forma normal está?",
    options: ["A. 1FN", "B. 3FN", "C. FNBC"],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_72",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Se4a R(A,B,C,D), donde se dan las dependencias funcionales F={AC->BD, B->A}. De las siguientes bases de datos con esos atributos, cuál es una BD donde todos los esquemas de la realizacion están en FNBC y no hay pérdida de información",
    options: [
      "A. R1(A,C,D) y R2(A,B)",
      "B. R1(B,C,D) y R2(A,B)",
      "C. R(A,B,C,D)",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_73",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Puede que al descomponer hasta FNBC se pierdan dependencias funcionales",
    options: [
      "A. si",
      "B. con pérdida de información, sí, sin perdida de información, no",
      "C. no",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_74",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Considera la relación R(numdept, nomdept, numpro,dedicación), con las dependencias funcionales F={numdept, numpro -> dedicación; numdept->nomdept; nomdept->numdept} ¿cuál dee estas bases de datos es una descomposición de R donde los esquemas de relación están en FNBC y no hay pérdida de información ?",
    options: [
      "A. R1 (numdepts, nomdept, numpro) y R2(numdept, dedicación)",
      "B. R1 (nomdeppt, numpro, dedicación) y R2(numdept, nomdept)",
      "C. R (numdept, nomdept, numpro, dedicación)",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_75",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "En la relación R(IdEquipoLocal, NomEquipoLocal, IdEquipoVisitante, NomEquipoVisitante, Jornada, Año, Resultado), con las dependencias funcionales\nF={ IdEquipoLocal, Jornada, Año -> Resultado, IdEquipoVisitante;\nIdEquipoVisitante, Jornada, Año -> Resultado, IdEquipoLocal;\nIdEquipoLocal->NomEquipoLocal;\nIdEquipoVisitante->NomEquipoVisitante}, las claves candidatas son:",
    options: [
      "A. {IdEquipoLocal, Jornada, Año} y {IdEquipoVisitante, Jornada, Año}",
      "B. {IdEquipoLocal} y {IdEquipoVisitante}",
      "C. {IdEquipoLocal, IdEquipoVisitante, Jornada, Año}",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_76",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "En la relación R(N1 envío, Destinatario, Fecha, Cod_prod) con las dependencias funcionales \nF={nEnvio -> Destinatario, Fecha;\nDestinatario, Fecha -> nEnvio} las claves candidatas son:",
    options: [
      "A. {nEnvio}",
      "B. {nEnvio} y {Destinatario, Fecha}",
      "C. {nEnvio, Cod_prod} y {Destinatario, Fecha, Cod_prod}",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_77",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "En la relación R (empno, prono, ename, pname, hours), con las dependencias funcionales \nF={empno,prono->hours;\nempno->ename;\nprono->pname;\npname->prono} las claves candidatas son:",
    options: [
      "A. {empno,prono} y {ename,pname}",
      "B. {empno,prono} y {ename,pname} y {ename,prono}",
      "C. {empno,prono} y {empno,pname}",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_78",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Considera la relación R(nTicket , nLinea, cod_prod, nom_prod, cantidad) con las dependencias funcionales \nF={nTicket, nLinea -> cod_prod, cantidad;\nnTicket, cod_prod ->nLinea;\ncod_prod -> nom_prod;\nnom_prod->cod_prod} \n¿cuál de estas bhases de datos son una descomposición de R donde todos los esquemas de la relación están en FNBC y no hay pérdida de información?",
    options: [
      "A. R(nTicket, nLinea, cod_prod, nom_prod, cantidad)",
      "B. R(nTicket, nLinea, cod_prod, cantidad) y R2 (cod_prod, nom_prod)",
      "C. R(nTicket, nLinea, cod_prod) y R2 (cod_prod, nom_prod, cantidad)",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_79",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "¿cuál  de estos tres, no es un problema del esquema multiversión para control de concurrencia?",
    options: [
      "A. las lecturas requieren actualizar una mar5ca de lectura, lo que implica dos accesos potenciales al disco",
      "B. las lecturas pueden tardar demasiado por quedarse bloqueadas",
      "C. los conflictos ser resuelven retrocediendo transaaciones",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_80",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "El protocolo de bloqueo de dos fases",
    options: [
      "A. especifica que una vez liberado un bloqueo ya nunca más se puede adquierir ningún otro en la misma transacción",
      "B. especifica que se tienen que adquirir los bloqueos compartidos antes que los exclusivos",
      "C. especifica que se tienen que liberar todos los bloqueos justo en el momento de terminar la transacción",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_81",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "El uso de bloqueos compartidos y exclusivos",
    options: [
      "A. no garantiza la seriabilidad, a menos que sea en combinación con un protocolo de bloqueo",
      "B. garantiza la seriabilidad",
      "C. no garantiza la seriabilidad, pero sí que no se produzcan interbloqueos",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_82",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Supongamos el siguiente ejemplo de utilización de esquemas de multiversión para control de concurrencia ¿qué versión del dato x leerá una transacción cuya marca temporal asociada es 2?",
    image: getImage(imageMap, "daypo-preguntas-image-4.jpg"),
    options: [
      "A. la versión Q2",
      "B. la versión Q1",
      "C. ninguna de ellas, ya que la transacción será abortada",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_83",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Una lectura en un sistema de gestión de base de datos con control de concurrencia basado en bloqueos y un protocolo de bloqueo de 2 fases estricto",
    options: [
      "A. puede que tenga que esperar",
      "B. nunca espera pero puede dar una versión antigua del dato",
      "C. nunca espera",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_84",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "Los logs o registros históricos son utilizados para",
    options: [
      "A. el control de concurrencia de una base de datos",
      "B. la recuperación de una base de datos",
      "C. la optimización de consultas de una base de datos",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_85",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un factor de bloqueo alto en un fichero",
    options: [
      "A. favorece la elctura secuencial del fichero",
      "B. favorece la lectura de registros individualmente",
      "C. no afecta en nada a las operaciones de lectura",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_86",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En los ficheros ordenados ¿qué es cierto?",
    options: [
      "A. obtener un registro por igualdad ede clave cuesta siempre una lectura física",
      "B. insertar un nuevo registro es fácil",
      "C. hay que mantener el orden usando punteros",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_87",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En hash normal(estático) ¿qué es cierto?",
    options: [
      "A. buscar registros por igualdad en la clave es ineficiente",
      "B. es imposihle leer todos los registros que hay en el fichero",
      "C. si cambia el tamaño del fichero, probablemente habrá que recolocar casi todos los registros almacenados anteriormente",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_88",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un índice",
    options: [
      "A. ayuda en  todas las operaciones de inserción, borado y búsqueda",
      "B. ayuda siempre en todas las búsquedas y no perjudica las inserciones y borrados",
      "C.  puede ayudar en búsquedas y perjudica las inserciones y borrados",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_89",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "En el esquema de relación R (A,B,C,D) con dependencias funcionales f=(AB->CD, D->B) suponiendo que está en 1 FN",
    options: ["A. 2FN", "B. 3FN", "C. FNBC"],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_90",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "En el protocolo de bloqueo riguroso de dos fases",
    options: [
      "A. los bloqueos se pueden adquirir durante toda la transacción y se liberan cuando termina",
      "B. los bloqueos solo se pueden adquirir en el isntante de creación de la transacción y no se liberan hasta que la transacción termina",
      "C. hay una fase de crecimeinto que dura mientras solo se adquieren gloqueos, la fase de decrecimiento comienza con la primera liberación de un bloqueo en cualquier momento de la transacción, a partir de ese isntante, ya no se pueden adquirir nuevos bloqueos, y solo se pueden liberar",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_91",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question:
      "Si una ejecución concurrente de dos transacciones T1 e T2 es serializable",
    options: [
      "A. el resultado final se igual al resultante de ejecutar primero T1 y luego T2 o ejecutar primero T2 y luego T1",
      "B. el resultado final e igual al resultante de ejecutar primero T1 y luego T2 y también igual a ejecutar T2 y luego T1",
      "C. el resultado final está bien, pero puede que no sea el mismo que ejecutar primero T1 y luego T2 ni ejecutar primero T2 y luego T1",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_92",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "En el nivel de aislamiento REPEATABLE READ",
    options: [
      "A. se puede dar el problema de lectura sucia",
      "B. se puede dar el problema de lectura fantasma",
      "C. se puede dar el problema de la lectura no repetible",
    ],
    correctAnswer: "b",
  },
  {
    id: "daypo-preguntas_93",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Un árbol B+",
    options: [
      "A. es un árbol homogéneo",
      "B. tiene 2 tipos de punteros en cada nodo",
      "C. tiene todos los nodos hoja enlazados por punteros",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_94",
    exam: "daypo-preguntas",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 1,
    question: "En el modelo relacional, un atributo de una tupla",
    options: [
      "A. tiene que almacenar obligatoriamente un valor de dominio del atributo o un nulo",
      "B. se pueden almacenar varios valores del dominio del atributo o un nulo",
      "C. se pueden almacenar otra relación o un nulo",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_95",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Para actualizar un registro de un fichero son necesarias",
    options: [
      "A. una lectura física",
      "B. dos escrituras físicas",
      "C. una lectura y una escritura física",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_96",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "En los ficheros ordenados ¿qué es cierto?",
    options: [
      "A. obtener un registro por igualdad de clave cuesta siempre una lectura física",
      "B. insertar un nuevo registro es simple",
      "C. hay que mantener el orden usando punteros",
    ],
    correctAnswer: "a",
  },
  {
    id: "daypo-preguntas_97",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "La técnica de Hash es más acertada cuando",
    options: [
      "A. las consultas que me importa acelerar son de rango, del tipo empleados que ganan más de un determinado valor",
      "B. las consultas que me importa acelerar son las de obtener todos los registros por orden de clave",
      "C. las consultas que me importa acelerar son las de igualdad de clave, del tipo, el empleado con código 20",
    ],
    correctAnswer: "c",
  },
  {
    id: "daypo-preguntas_98",
    exam: "daypo-preguntas",
    topic: "ficheros",
    type: "mc",
    points: 1,
    question: "Usar un indice sobr eun campo que no es clave primaria",
    options: [
      "A. siempre acelera las búsquedas",
      "B. puede ser contraproducente y hacer las búsquedas más lentas",
      "C. siempre acelera todas las operaciones (búsquedas, inserciones borrados y actualizaciones)",
    ],
    correctAnswer: "c",
  },
  {
    id: "recopilatorio-mayo-2026_01",
    exam: "recopilatorio-mayo-2026",
    topic: "modelado-normalizacion",
    type: "text",
    points: 2,
    question: `Modelo Entidad-Relación.

Dibuja el diagrama Entidad-Relación que modela el dominio que se describe a continuación.

Debes identificar claramente las entidades fuertes y débiles (identificando también como débil el tipo de relación que se establece entre ellas), todos los atributos e identificadores de los tipos de entidad, y los atributos, cardinalidad y participación de los tipos de relación, utilizando la notación utilizada en clase (no está permitido usar la notación de mínimos-máximos).

Los supervillanos de PC Comics llevan tiempo sin reciclarse, por lo que están perdiendo la guerra contra los superhéroes sin plantear las debidas dificultades. PC Comics ha creado una academia a la que pueden acudir para modernizarse, y ahora nos encarga construir una base de datos para gestionarla.

Lo primero que debe hacer la base de datos es recoger información sobre todos los supervillanos conocidos (nos da igual si han asistido o no a cursos). De cada uno guardamos su código (que identifica a cada villano entre todos los demás), nombre completo, nacionalidad, y su especialidad (o especialidades, porque pueden ser varias).

Los supervillanos, ocasionalmente, unen esfuerzos, agrupándose en Ligas de Supervillanos. Queremos registrar información sobre todas las ligas conocidas. En particular, queremos registrar su nombre (que identifica a una liga entre todas las demás), y su año de creación.

Las reglas de las ligas de supervillanos son muy estrictas, y no se permite que un villano forme parte de dos ligas al mismo tiempo. Por otra parte, los supervillanos suelen ser caprichosos: un villano puede pasar de estar en una liga durante un tiempo a, de repente, abandonarla y pasar una temporada delinquiendo en solitario, quizás para más adelante unirse a otra liga diferente, o incluso volver a una liga en la que ya había estado antes (es decir, repitiendo liga). Teniendo todo eso en cuenta, queremos que la base de datos nos permita saber todas las ligas en las que ha estado integrado cada villano, y las fechas de inicio y de fin del período - o períodos - en los que formó parte de cada una.

Si se considera necesario, los cursos de reciclaje impartidos en la academia pueden exigir (o recomendar) dominar un conjunto de superpoderes para poder asistir. La base de datos debe contar con espacio para almacenar todos los superpoderes conocidos (estén o no asociados a algún curso). De cada superpoder guardaremos su código (que identifica a cada superpoder entre todos los demás), su descripción, y su utilidad principal (sólo una). Por ejemplo, para desplazamiento, para pelea, para curación...

Cada vez que registremos un curso, debemos indicar (si es el caso) qué superpoderes (de entre los registrados en la base de datos) son obligatorios (pueden ser varios), y cuáles son recomendables (también pueden ser varios). También deberemos guardar el código del curso (que identifica a cada curso entre todos los demás), su título y su precio actual.

Un curso, si se considera necesario, puede establecer como condición de acceso haber superado determinados cursos anteriores, que actúan como prerrequisitos. Por ejemplo, puede decidirse que el curso "Aniquilación mundial mediante esporas de camomila" tenga como prerrequisitos los cursos "Biología básica para supervillanos" y "Botánica elemental". Y, a su vez, podríamos decidir que "Aniquilación mundial mediante esporas de camomila" fuese prerrequisito de los cursos "Aniquilación selectiva de entidades superheroicas" y "Repoblación mundial: de la teoría a la práctica". Queremos poder representar información como esa en la base de datos.

Está previsto que de cada curso se realice una edición cada año (sólo una al año, sin excepción). De cada edición de un curso debemos almacenar el año en el que se celebró (o se celebrará), su duración (número de semanas), y la fecha límite para inscribirse (interesante para ediciones con matrícula aún abierta).

En cuanto una edición de un curso se registra en la base de datos, los supervillanos pueden empezar a inscribirse. Queremos que la base de datos recoja qué supervillanos están inscritos ya en una edición, en qué fecha lo hizo cada uno, y si al final aprobaron o no (en el caso de ediciones ya concluidas).

Una vez superada una edición de un curso, un supervillano debe superar la prueba definitiva: realizar un TFG de dominación mundial. Queremos que la base de datos almacene información sobre todos los TFG presentados: su código (que identifica a un TFG entre todos los demás registrados en la base de datos, sean del curso que sean), y su título (que no tiene por qué ser único). Por supuesto, para cada TFG queremos saber también el supervillano que lo realizó (el TFG es individual, no se puede hacer en equipo), y la edición en la que lo presentó (sólo una: no se puede reutilizar el mismo TFG en ediciones diferentes). Y además también debemos conocer la nota final que obtuvo el TFG (en cuanto se sepa).

Finalmente, nos interesa conocer no sólo cuáles, sino cuántos TFG están vinculados a cada supervillano en la base de datos hasta la fecha de hoy.

Avisos: no inventes atributos ni tipos de relaciones; no inventes códigos para identificar tipos de entidad; representa como atributo derivado/calculado los datos calculables; no se admiten tipos de entidad débil dependientes de más de un tipo de entidad fuerte a la vez; evita almacenamiento redundante.`,
    correctAnswer: "Solución modelo no disponible.",
  },
  {
    id: "recopilatorio-mayo-2026_02",
    exam: "recopilatorio-mayo-2026",
    topic: "modelado-normalizacion",
    type: "text",
    points: 0.75,
    question:
      "Paso a relacional. Transforma el siguiente diagrama ER al esquema relacional equivalente (los esquemas de relación correspondientes al diagrama ER), indicando claramente las claves primarias y representando gráficamente (con flechas) las restricciones de integridad referencial existentes. Utiliza la notación vista en clase.",
    image: getImage(imageMap, "recopilatorio-mayo-2026-paso-relacional.png"),
    correctAnswer: "Solución modelo no disponible.",
  },
  {
    id: "recopilatorio-mayo-2026_03",
    exam: "recopilatorio-mayo-2026",
    topic: "modelado-normalizacion",
    type: "text",
    points: 1.25,
    question: `Normalización.

**a) Dependencias funcionales [0.4 p]**

La cadena de supermercados Mercachifle necesita una base de datos para gestionar la información relativa a sus repartos a domicilio. Lo que conocemos es lo siguiente:

- La cadena está formada por un conjunto de supermercados distribuidos por todo el país.
- Cada supermercado dispone de un servicio de reparto a domicilio que cubre un conjunto fijo y predefinido de varias localidades colindantes.
- En la situación actual existen localidades que son atendidas simultáneamente por varios supermercados.
- Cada supermercado define sus propias rutas de reparto: cada ruta pertenece a un único supermercado; no existen rutas compartidas entre supermercados; cada ruta pasa siempre por el mismo conjunto de localidades, por lo que las rutas son fijas e inalterables; dentro de un mismo supermercado, no puede haber dos rutas que pasen por la misma localidad; una localidad es atendida por ese supermercado siempre a través de una única ruta; una localidad puede, no obstante, ser atendida por varias rutas distintas si estas pertenecen a supermercados diferentes.
- La empresa dispone de una flota común de camiones de reparto, compartida por todos los supermercados. La asignación de camiones a rutas se realiza diariamente: cada ruta, cada día, es realizada por un único camión, que puede ser el mismo que hizo la ruta el día anterior u otro camión diferente; un mismo camión puede realizar varias rutas en un mismo día.

Se ha diseñado una base de datos que incluye una relación donde se registra la asignación de camiones a rutas:

\`\`\`
Asignado(super, ruta, localidad, día, camión)
\`\`\`

Descripción de atributos: \`super\` es el código del supermercado; \`ruta\` es el código de la ruta y no puede repetirse ni siquiera si son supermercados diferentes; \`localidad\` es el código de localidad; \`día\` es la fecha del reparto; \`camión\` es la matrícula del camión de reparto.

Indica el conjunto de dependencias funcionales completas que existen en \`Asignado\`. No es necesario incluir aquellas deducibles a partir de las indicadas.

**b) Forma normal y claves [0.25 p]**

Una revista cultureta quiere crear una base de datos donde recoger información sobre películas nacionales e internacionales. La base contiene, entre otras, la relación:

\`\`\`
Interpreta(CodPeli, Titulo, Año, Genero, CodActor, Salario, Personaje, Tipo)
\`\`\`

Dependencias funcionales completas asociadas a \`Interpreta\`:

1. \`CodPeli -> Titulo, Año, Genero\`
2. \`Titulo, Año -> CodPeli, Genero\`
3. \`CodPeli, CodActor -> Salario\`
4. \`CodPeli, Personaje -> Tipo\`

Indica la/s clave/s candidata/s y la forma normal en la que está \`Interpreta\`. Puedes suponer que, como mínimo, está en 1FN.

**c) Descomposición [0.6 p]**

Descompón la relación \`Interpreta\` del apartado (b) hasta encontrar una descomposición donde no se pierda información y todas las relaciones estén en FNBC. Indica, para cada relación resultante: esquema, dependencias funcionales y clave/claves candidatas.`,
    correctAnswer: "Solución modelo no disponible.",
  },
  {
    id: "recopilatorio-mayo-2026_04",
    exam: "recopilatorio-mayo-2026",
    topic: "ficheros",
    type: "mc",
    points: 0.2,
    question:
      "En un fichero montículo, el coste de la operación de búsqueda de registros con un valor de clave específico:",
    options: [
      "A. Siempre es B/2, siendo B el número de bloques del fichero.",
      "B. Siempre es B, siendo B el número de bloques del fichero.",
      "C. Ninguna de las dos respuestas anteriores es correcta.",
    ],
    correctAnswer: "a",
  },
  {
    id: "recopilatorio-mayo-2026_05",
    exam: "recopilatorio-mayo-2026",
    topic: "ficheros",
    type: "mc",
    points: 0.2,
    question: "En un árbol B+, cuántos más punteros a nodos hijos por nodo ...",
    options: [
      "A. Más ancho y menos alto será el árbol.",
      "B. Más lentas serán las búsquedas.",
      "C. Las dos respuestas anteriores son correctas.",
    ],
    correctAnswer: "a",
  },
  {
    id: "recopilatorio-mayo-2026_06",
    exam: "recopilatorio-mayo-2026",
    topic: "ficheros",
    type: "mc",
    points: 0.2,
    question: "Si tenemos un fichero montículo, y añadimos un índice ...",
    options: [
      "A. El índice será siempre un índice primario/agrupado.",
      "B. El índice será siempre un índice secundario.",
      "C. El índice podrá ser primario/agrupado o secundario, según el usuario decida durante su creación.",
    ],
    correctAnswer: "b",
  },
  {
    id: "recopilatorio-mayo-2026_07",
    exam: "recopilatorio-mayo-2026",
    topic: "ficheros",
    type: "mc",
    points: 0.2,
    question:
      "En la tabla SOCIO (código, categoría, nombre, fechaNac, teléfono, país) de una aerolínea, que físicamente se guarda en un fichero montículo, hay almacenadas miles de tuplas, pero nunca hay más de dos o tres tuplas que compartan el mismo valor del campo teléfono. En una consulta que devuelva los socios vinculados a un teléfono determinado:",
    options: [
      "A. Un índice por teléfono acelerará la búsqueda con total seguridad.",
      "B. Un índice por teléfono probablemente no ayudará y podría incluso hacer más lenta la consulta.",
      "C. Un índice por teléfono no afectará en absoluto al tiempo de respuesta de la consulta.",
    ],
    correctAnswer: "a",
  },
  {
    id: "recopilatorio-mayo-2026_08",
    exam: "recopilatorio-mayo-2026",
    topic: "ficheros",
    type: "mc",
    points: 0.2,
    question:
      "La tabla de VENTAS de una empresa ha sido particionada usando como campo de particionamiento la localidad de venta.",
    options: [
      "A. Si una consulta especifica una condición sobre el campo localidad, el SGBD puede acelerar la búsqueda lanzando la consulta solo sobre las particiones afectadas.",
      "B. Si una consulta especifica una condición sobre un campo diferente de localidad, el SGBD no podrá acelerar la búsqueda de ninguna manera.",
      "C. Las dos respuestas anteriores son correctas.",
    ],
    correctAnswer: "a",
  },
  {
    id: "recopilatorio-mayo-2026_09",
    exam: "recopilatorio-mayo-2026",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 0.2,
    question: "Transacciones:",
    options: [
      "A. El resultado final de la ejecución de dos planificaciones serializables sobre las mismas transacciones siempre es el mismo.",
      "B. Toda planificación serie es serializable.",
      "C. Ninguna de las dos respuestas anteriores es correcta.",
    ],
    correctAnswer: "b",
  },
  {
    id: "recopilatorio-mayo-2026_10",
    exam: "recopilatorio-mayo-2026",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 0.2,
    question: "En el protocolo de bloqueo riguroso de dos fases:",
    options: [
      "A. Los bloqueos solo se pueden adquirir en el instante en que la transacción empieza y no se liberan hasta que la transacción termina.",
      "B. Los bloqueos se pueden adquirir durante toda la transacción y se liberan cuando la transacción termina.",
      "C. Hay una fase de crecimiento que dura mientras solo se adquieren bloqueos. La fase de decrecimiento comienza con la primera liberación de un bloqueo en cualquier momento de la transacción; a partir de ese momento, ya no se pueden adquirir más bloqueos.",
    ],
    correctAnswer: "b",
  },
  {
    id: "recopilatorio-mayo-2026_11",
    exam: "recopilatorio-mayo-2026",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 0.2,
    question:
      "En relación al método esquema multiversión para control de concurrencia ...",
    options: [
      "A. Las escrituras no siempre tienen éxito (y puede ser necesario retroceder una transacción).",
      "B. Las lecturas pueden tardar demasiado por quedarse esperando.",
      "C. Las dos respuestas anteriores son correctas.",
    ],
    correctAnswer: "a",
  },
  {
    id: "recopilatorio-mayo-2026_12",
    exam: "recopilatorio-mayo-2026",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 0.2,
    question: `Dadas las siguientes sentencias:

\`\`\`sql
CREATE ROLE accesoBronce
CREATE ROLE accesoPlata
CREATE ROLE accesoOro
GRANT SELECT ON ventas TO accesoBronce
GRANT UPDATE ON ventas TO accesoPlata
GRANT INSERT, DELETE ON ventas TO accesoOro
GRANT accesoBronce TO accesoPlata
GRANT accesoPlata TO "Ramón"
GRANT accesoBronce TO "Luisa"
\`\`\`

¿Cuál de las siguientes afirmaciones es cierta?`,
    options: [
      "A. Ramón puede realizar actualizaciones sobre la tabla ventas, pero no consultas.",
      "B. Luisa puede realizar consultas sobre la tabla ventas, pero no actualizaciones.",
      "C. Las dos respuestas anteriores son correctas.",
    ],
    correctAnswer: "b",
  },
  {
    id: "recopilatorio-mayo-2026_13",
    exam: "recopilatorio-mayo-2026",
    topic: "recuperacion-concurrencia",
    type: "mc",
    points: 0.2,
    question: `Dada la siguiente sentencia de inserción de datos:

\`\`\`sql
INSERT INTO emp (ename, job, empno, hiredate, deptno) VALUES
('Adrián', 'Manager', 2002, '24/07/23', NULL);
\`\`\`

Y suponiendo que la tabla \`emp\` se ha definido de la siguiente forma:

\`\`\`sql
CREATE TABLE emp (
  empno NUMERIC(4) CONSTRAINT PK_emp PRIMARY KEY,
  ename VARCHAR(15) NOT NULL,
  hiredate DATE NOT NULL,
  job VARCHAR(15) NOT NULL,
  sal NUMERIC(7,2) NOT NULL DEFAULT 1400,
  comm NUMERIC(7,2),
  mgr NUMERIC(4) REFERENCES emp (empno),
  deptno NUMERIC(2) REFERENCES departamento (deptno)
);
\`\`\`

¿Cuál de las siguientes afirmaciones es cierta?`,
    options: [
      "A. La inserción producirá un error porque el orden de las columnas en la sentencia no coincide con el orden de las columnas en la tabla.",
      "B. La inserción producirá un error asociado a la columna deptno.",
      "C. La inserción se realizará correctamente.",
    ],
    correctAnswer: "c",
  },
];
