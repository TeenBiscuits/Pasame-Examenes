import type { Question } from "../../data/types";

export const questions: Question[] = [
  // ============================================================
  // SISTEMA DE FICHEROS — Cálculos de i-nodos y bloques
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q1",
    exam: "2020-01",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 7,
    question: "Un sistema de archivos tipo UNIX System V tiene un tamaño de bloque de 2Kbytes, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 8 bytes. Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con un tamaño de 130 Mbytes+1byte, diferenciando entre bloques de datos y bloques de índices.",
    correctAnswer: `Tamaño de bloque: 2KB = 2048 bytes. 130 MB + 1 byte ≈ 136,314,881 bytes
Nº bloques de datos = ceil(136,314,881 / 2048) = 66,561 bloques

Direcciones por bloque de índices = 2048 / 8 = 256 direcciones
Capacidad con 10 directas + indirecta simple (256) + indirecta doble (256² = 65,536) = 65,802 bloques
Faltan 66,561 − 65,802 = 759 bloques → necesitan triple indirección
759 / 256 ≈ 3 bloques de índice de 3er nivel

Nº bloques de índices = 1 (simple) + 1 (doble) + 256 (doble 2º) + 1 (triple) + 1 (triple 2º) + 3 (triple 3º) = 263

Fragmentación interna: 2048 − (136,314,881 mod 2048) = 2047 bytes`,
    explanation: "El cálculo de bloques de índices es clave: cada nivel de indirección añade capacidad pero también overhead de bloques de metadatos.",
  },
  {
    id: "so_2021_q1",
    exam: "2021-01",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 6,
    question: "Un sistema de archivos tipo UNIX System V tiene tamaño de bloque de 4Kbytes, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 8 bytes. Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con un tamaño de 1 Gbyte + 6 Mbytes + 40 Kbytes.",
    correctAnswer: `Tamaño total = 1,080,074,240 bytes. Bloque = 4KB = 4,096 bytes
Nº bloques de datos = ceil(1,080,074,240 / 4,096) = 263,690 bloques

Direcciones por bloque de índices = 4096/8 = 512
Con 10 directas + indirecta simple (512) + indirecta doble (512²=262,144) = 262,666 bloques
Faltan 263,690 − 262,666 = 1,024 bloques → triple indirección: 2 bloques índice 3er nivel

Índices: 1 (simple) + 1 (doble) + 512 (doble 2º) + 1 (triple) + 1 (triple 2º) + 2 (triple 3º) = 518
Fragmentación interna: 0 bytes (división exacta)`,
    explanation: "Con bloques más grandes caben más direcciones por bloque de índices (512 vs 256), reduciendo los niveles de indirección necesarios.",
  },
  // 2021-07
  {
    id: "so_2021jul_q1",
    exam: "2021-07",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 6,
    question: "Un sistema de archivos tipo UNIX System V tiene un tamaño de bloque de 8Kbytes, i-nodos con 12 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 8 bytes. Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con un tamaño de 8 Gbytes + 32 Mbytes + 1024 bytes.",
    correctAnswer: `Tamaño total ≈ 8,623,587,328 bytes. Bloque = 8KB = 8,192 bytes.
Nº bloques datos = ceil(8,623,587,328 / 8,192) = 1,052,684 bloques.

Direcciones por bloque índices = 8192 / 8 = 1024
12 directas → 12 bloques
Indirecta simple: +1024 → 1,036
Indirecta doble: +1024² = +1,048,576 → 1,049,612
Faltan: 1,052,684 − 1,049,612 = 3,072 bloques → triple indirección

Índices: 1 (simple) + 1 (doble) + 1024 (doble 2º) + 1 (triple) + 1 (triple 2º) + 3 (triple 3º) = 1,031
Fragmentación interna: 8,192 − (8,623,587,328 mod 8,192) = 7,168 bytes`,
    explanation: "Al aumentar el tamaño de bloque, cada nivel de indirección escala cuadráticamente/cúbicamente. Con bloques de 8KB y direcciones de 8B, cada bloque de índices contiene 1024 punteros.",
  },
  // 2022-01
  {
    id: "so_2022_q1",
    exam: "2022-01",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 6,
    question: "Un sistema de archivos tipo UNIX System V tiene un tamaño de bloque de 2Kbytes, i-nodos con 12 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 4 bytes. Calcular el tamaño máximo de un fichero al utilizar los niveles de indirección simple, doble y triple. Indicar también el número de bloques de índices usado exclusivamente en cada nivel.",
    correctAnswer: `Bloque = 2KB, direcciones de 4B → 512 punteros por bloque índice.

Indirecta simple: 512 × 2KB = 1MB (+12 directas × 2KB = 24KB) = 1MB + 24KB. 1 bloque índice.
Indirecta doble: 512² × 2KB = 512MB. Total: 512MB + 1MB + 24KB. Bloques índice: 1 + 512 = 513.
Indirecta triple: 512³ × 2KB = 256GB. Total: 256GB + 512MB + 1MB + 24KB. Bloques índice: 1 + 512 + 512² = 262,657.`,
    explanation: "La capacidad escala: ×512 por cada nivel de indirección adicional. Con direcciones de 4 bytes caben el doble de punteros por bloque que con 8 bytes.",
  },
  // 2023-01
  {
    id: "so_2023_q1",
    exam: "2023-01",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 6,
    question: "Calcular cuántos bloques de disco son necesarios (en el área de datos) para representar un archivo de tamaño 1 Gbyte + 6 Mbytes + 10 Kbytes. Sistema UNIX, tamaño de bloque 4 KB, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple, direcciones de bloque de 8 bytes.",
    correctAnswer: `Tamaño = 1,079,705,610 bytes. Bloques 4KB → 262,403 bloques totales.
Direcciones por bloque = 4096/8 = 512.
10 directas + 512 indirecta simple + 512² indirecta doble = 262,666 (cubre todo con doble indirección parcial).
Datos: 262,403 − 10 − 512 − 512×511 = 262,147 bloques datos.
Índices: 1 (simple) + 1 (doble) + 516 (doble 2º nivel) = 518.
Fragmentación: 2048 bytes.`,
    explanation: "Similar al problema de 2021 pero con datos diferentes para practicar el mismo concepto desde otro ángulo.",
  },
  // 2023-07
  {
    id: "so_2023jul_q1",
    exam: "2023-07",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 6,
    question: "Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con tamaño de 516 Mbytes + 1048 bytes. Sistema UNIX System V, bloque 2KB, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple, direcciones de bloque de 4 bytes.",
    correctAnswer: `Tamaño = 516MB + 1048B = 541,066,280 bytes. Bloques 2KB → 264,193 bloques.
Direcciones por bloque = 2048/4 = 512.
10 directas + 512 indirecta simple + 512² = 262,666 (cubre con doble indirección). Sobran bloques de triple.
Datos: 264,193 − 10 − 512 − 512×515 = 258,049. Índices: 1 + 1 + 517 = 519.
Fragmentación: 1000 bytes.`,
    explanation: "Con direcciones de 4 bytes en bloques de 2KB caben 512 punteros, igual que con direcciones de 8 bytes en bloques de 4KB.",
  },
  // 2024-01
  {
    id: "so_2024_q1",
    exam: "2024-01",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 6,
    question: "Un sistema de archivos tipo UNIX tiene un tamaño de bloque de 8Kbytes, i-nodos con 12 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 4 bytes. i) Calcular el tamaño máximo de un fichero usando indirección doble. ii) Calcular cuántos bloques son necesarios para un fichero de 96 Gbytes + 103 Kbytes. iii) Calcular la fragmentación interna.",
    correctAnswer: `i) Direcciones por bloque = 8KB/4B = 2048. Indirecta doble: 2048² × 8KB = 32GB. Con simple (2048×8KB=16MB) y 12 directas (96KB) → máximo = 32GB + 16MB + 96KB.

ii) 96GB + 103KB = 103,079,215,104 bytes. Bloques datos = 12,582,912 + 13. Índices = 6,149.
iii) Fragmentación interna: 1024 bytes.`,
    explanation: "Con bloques de 8KB y direcciones de 4 bytes, cada bloque de índices tiene 2048 entradas, lo que acelera el crecimiento de la capacidad por nivel.",
  },

  // ============================================================
  // SISTEMA DE FICHEROS — Problemas con código y permisos
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q3_perm",
    exam: "2020-01",
    topic: "sistema-ficheros",
    type: "mc",
    points: 3,
    question: "Tras ejecutar chmod con 0420 sobre un fichero, ¿qué permisos se muestran en formato rwxrwxrwx?",
    options: ["rwx r-- ---", "r-- -w- ---", "r-- r-- r--", "--- -w- ---", "-w- r-- ---"],
    correctAnswer: "b",
    explanation: "0420 en octal: owner=4 (r--), group=2 (-w-), others=0 (---). Resultado: r---w----",
  },
  // 2021-01
  {
    id: "so_2021_q4_tf",
    exam: "2021-01",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica si es cierto (C) o falso (F) cada afirmación sobre sistemas de ficheros UNIX:",
    correctAnswer: {
      "Mientras un fichero está abierto, el S.O. mantiene una copia de su inodo en memoria principal": "C",
      "El contenido de un directorio se almacena en el área de datos": "C",
      "El código enlazado con una librería dinámica es autocontenido": "F",
      "El código binario de fork() se encuentra en la librería estándar de C (libC)": "F",
      "Es posible crear hard links entre diferentes sistemas de ficheros montados": "F",
      "El tipo de fichero 'link simbólico' se codifica en el campo modo del inodo": "C",
      "El journaling registra las operaciones de metadatos antes de aplicarlas para recuperación tras caídas": "C",
      "El Buffer Cache no minimiza errores ante caídas de alimentación": "C",
    },
    explanation: "El inodo en memoria se mantiene mientras el fichero está abierto. Los hard links solo funcionan dentro del mismo sistema de ficheros. El journaling registra operaciones para recuperación.",
  },
  // 2021-07
  {
    id: "so_2021jul_q4_tf",
    exam: "2021-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica si es cierto (C) o falso (F) sobre sistemas de ficheros:",
    correctAnswer: {
      "El S.O. mantiene una copia en memoria del inodo de un fichero abierto hasta el último cierre": "C",
      "Al enlazar con librería dinámica, las funciones se integran en el ejecutable": "F",
      "Al ejecutar printf se incrementa el tiempo en modo usuario y en modo sistema": "C",
      "Es posible crear soft links entre diferentes sistemas de ficheros montados": "C",
      "La idea fundamental del journaling es llevar control histórico de asignaciones de inodos": "F",
      "El Buffer Cache reduce el número de lecturas y escrituras físicas sobre los discos": "C",
    },
    explanation: "Los soft links almacenan rutas, no dependen del inodo destino → pueden cruzar sistemas de ficheros. Los hard links no pueden.",
  },
  // 2022-01
  {
    id: "so_2022_q4_tf",
    exam: "2022-01",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica si es cierto (C) o falso (F):",
    correctAnswer: {
      "Una llamada al sistema se puede implementar con una interrupción software que cambia el modo de ejecución": "C",
      "Al ejecutar printf, el proceso está ejecutando exclusivamente en modo sistema": "F",
      "El código binario de lseek() se encuentra en la librería estándar de C": "F",
      "Las librerías estáticas permiten compartir código entre procesos en tiempo de ejecución": "F",
      "La fragmentación externa no existe con asignación indexada de bloques": "C",
      "El bit UID y el sticky bit forman parte del campo 'modo' del inodo": "C",
    },
    explanation: "printf se ejecuta en modo usuario (formateo) y modo sistema (write). lseek es llamada al sistema, su código está en el kernel. Las librerías dinámicas (no estáticas) permiten compartir código.",
  },
  // 2023-01
  {
    id: "so_2023_q4_tf",
    exam: "2023-01",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica si es cierto (C) o falso (F) sobre sistemas de ficheros:",
    correctAnswer: {
      "En modo usuario se puede ejecutar todo el repertorio de instrucciones del procesador": "F",
      "Al ejecutar perror(), el proceso está exclusivamente en modo usuario": "F",
      "El código binario de chmod() se encuentra en libC": "F",
      "Las librerías dinámicas se usan para tener ejecutables autocontenidos": "F",
      "Con asignación indexada de bloques puede existir fragmentación externa": "F",
      "El Buffer Cache permite reducir tanto lecturas como escrituras": "C",
    },
    explanation: "En modo usuario solo instrucciones no privilegiadas. Las librerías estáticas (no dinámicas) producen ejecutables autocontenidos. La asignación indexada elimina la fragmentación externa.",
  },
  // 2023-07
  {
    id: "so_2023jul_q4_tf",
    exam: "2023-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica si es cierto (C) o falso (F) sobre sistemas de ficheros:",
    correctAnswer: {
      "El S.O. mantiene el número de aperturas en el inodo en memoria, no en el inodo en disco": "C",
      "Al enlazar con librería dinámica, las funciones se integran en el fichero ejecutable": "F",
      "Al ejecutar printf se incrementa tanto el tiempo en modo usuario como en modo sistema": "C",
      "Es posible crear hard links entre diferentes sistemas de ficheros montados": "F",
      "El journaling es un registro histórico de creaciones y eliminaciones de ficheros": "F",
      "El Buffer Cache reduce tanto lecturas como escrituras físicas": "C",
    },
    explanation: "El contador de aperturas es información volátil en el in-core inode. Las librerías dinámicas no integran su código en el ejecutable. El journaling registra operaciones, no es un historial.",
  },
  // 2024-01
  {
    id: "so_2024_q4_tf",
    exam: "2024-01",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica si es cierto (C) o falso (F) sobre sistemas de ficheros:",
    correctAnswer: {
      "El número de aperturas de un fichero se mantiene en el inodo en memoria, no en el inodo en disco": "C",
      "Al ejecutar sin(x) de la librería matemática, el proceso está exclusivamente en modo usuario": "C",
      "La librería estándar de C (libC) incluye el código binario de unlink()": "F",
      "Las librerías dinámicas facilitan la actualización de componentes del SO": "C",
      "Un sistema de ficheros con journaling disminuye la fragmentación externa": "F",
      "La asociación entre uid y nombre de usuario está en /etc/passwd (getpwuid)": "C",
    },
    explanation: "sin() es una función puramente matemática que no requiere llamadas al sistema. unlink() es una llamada al sistema, su código está en el kernel. El journaling no afecta a la fragmentación.",
  },

  // ============================================================
  // SISTEMA DE FICHEROS — Hard/soft links y código UNIX
  // ============================================================

  // 2021-07
  {
    id: "so_2021jul_q3_links",
    exam: "2021-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 4,
    question: "Se crea soft link (ln -s practica.c slink) y posteriormente hard link al soft link (ln slink hard_slink). a) Indicar el tamaño (bytes) del fichero hard_slink. b) Número de hard links de hard_slink. c) Al borrar practica.c, ¿se puede acceder al contenido a través de slink? d) ¿Y a través de hard_slink?",
    correctAnswer: `a) 10 bytes (hard_slink es hard link a slink, que es symlink → su tamaño es la longitud de la ruta "practica.c")
b) 2 (slink tenía 1 hard link, al crear hard_slink ahora tiene 2)
c) No (slink apunta a "practica.c" que ya no existe → symlink roto)
d) No (hard_slink es hard link a slink, no a practica.c → sigue la misma ruta simbólica rota)`,
    explanation: "Un hard link a un symlink no 'hereda' el destino del symlink, solo comparte su inodo. Al borrar el destino, el symlink se rompe independientemente de cómo se acceda a él.",
  },
  // 2022-07
  {
    id: "so_2022jul_q2_superbloque",
    exam: "2022-07",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 4,
    question: "En sistema UNIX con bloque 2KB, boot ocupa 3 bloques. Superbloque empieza en bloque 3. Fichero 'datos' con inodo 325 ocupa bloque 30. Tamaño inodo: 128 bytes. Calcular tamaño del superbloque en KB.",
    correctAnswer: `Inodos por bloque = 2048/128 = 16 inodos/bloque.
Inodo 325 → bloque = 325/16 = 20 (empezando desde 0 en área de inodos).
El área de inodos empieza tras el superbloque (bloque 3).
Si el inodo 325 está en el bloque 20 del área de inodos:
Bloque lógico = 3 + tamaño_superbloque + 20 = 30
Tamaño superbloque = 30 - 3 - 20 = 7 bloques = 14 KB`,
    explanation: "El superbloque contiene el mapa de bits de inodos/bloques libres y metadatos del sistema de ficheros.",
  },
  // 2024-01
  {
    id: "so_2024_q3_code",
    exam: "2024-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    question: "Un proceso abre '/home/juan/practicas/p1.c' (inodo 5002, 2 hard links, 32GB). Se crea hard link practica1.c, luego symlink p1_slink → practica1.c. chmod 0640, dup, lseek 2.000.000, fgetc. Después close y dos unlink. a) Valor de fd2 (dup de fd1). b) Bloques leídos para fgetc(fd2). c) Permisos del inodo 5002 tras chmod. d) Hard links de p1_slink. e) Hard links del inodo 5002 tras ambos unlink.",
    correctAnswer: `a) 4 (fd1=3, dup(fd1)=4)
b) 2 bloques (bloque índice + bloque datos, el offset 2.000.000 está en zona de indirección simple)
c) rw- r-- --- (0640 = rw-r-----)
d) 1 (p1_slink es un symlink nuevo, tiene su propio inodo con 1 hard link)
e) 1 (inicialmente 2, link crea practica1.c → 3, unlink practica1.c → 2, unlink p1.c → 1)`,
    explanation: "Cada symlink es un fichero independiente con su propio inodo. Los hard links comparten inodo. Cada unlink decrementa el contador de hard links del inodo.",
  },
  // 2023-07 código
  {
    id: "so_2023jul_q3_code",
    exam: "2023-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    question: "Código: open p1.c (3MB, hard links=2), link crea practica1.c (hard link), symlink crea slink_practica1.c. chmod 0752. a) Accesos a disco en 1ª apertura (cachés vacías, entrada p1.c en 2º bloque de su directorio). b) Bloques leídos para fgetc(fd2) con lseek 524288. c) Valor de fd3=dup(fd2). d) Bloques de datos liberados al hacer unlink de p1.c. e) Hard links de slink_practica1.c tras unlink.",
    correctAnswer: `a) 5 accesos (bloques de directorios: raíz, home, juan, so(2ºbloque), p1.c)
b) 2 bloques (524288 = 512KB, está en bloque 256 → indirección simple: índice + datos)
c) 5 (fd1=3, fd2=4, fd3=dup(fd2)=5)
d) 0 bloques (unlink borra p1.c pero contador de hard links pasa de 3 a 2 → no llega a 0)
e) 1 (slink_practica1.c es symlink independiente, siempre tiene 1 hard link)`,
    explanation: "Los bloques solo se liberan cuando el contador de hard links llega a 0. El symlink es un fichero aparte con su propio inodo y contador.",
  },

  // ============================================================
  // GESTIÓN DE MEMORIA — Verdadero/Falso
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q4_mem",
    exam: "2020-01",
    topic: "memoria",
    type: "matching",
    points: 5,
    question: "Responde Verdadero (V) o Falso (F) sobre gestión de memoria:",
    correctAnswer: {
      "En la pila del proceso están las variables locales y parámetros de funciones": "V",
      "Las variables automáticas definidas en main() no están en la pila del proceso": "F",
      "Para un proceso con varios hilos, cada hilo tiene su propio espacio de direcciones": "F",
      "Con tabla de páginas en un nivel (sin caché/TLB), una instrucción simple implica dos accesos a memoria": "V",
      "Con tabla de páginas de dos niveles (sin caché/TLB), una instrucción simple implica exactamente dos accesos": "F",
      "Con TLB y caché, ejecutar una instrucción puede implicar ningún acceso a memoria": "V",
      "Con páginas más grandes, el tamaño de la tabla de páginas de un nivel se reduce": "V",
      "Una tabla de páginas multinivel típicamente reduce la memoria necesaria vs un nivel": "V",
      "Con Tablas de Páginas Invertidas, las páginas virtuales pueden ser más grandes que las físicas": "F",
      "Cuando el dirty bit está a 0, existe copia exacta de la página en almacenamiento": "V",
    },
    explanation: "Los hilos comparten espacio de direcciones pero tienen pilas independientes. La TLB y caché pueden evitar accesos a RAM. Las TP multinivel ahorran memoria al crear solo tablas necesarias.",
  },
  // 2021-07
  {
    id: "so_2021jul_q1_mem",
    exam: "2021-07",
    topic: "memoria",
    type: "matching",
    points: 10,
    question: "Responde V/F sobre gestión de memoria:",
    correctAnswer: {
      "En la pila del proceso está el código de las funciones que se llaman": "F",
      "Las variables locales de main() están en el segmento de datos": "F",
      "Para un proceso con varios hilos, los hilos comparten código y datos": "V",
      "El código de malloc está en el espacio de direcciones del kernel": "F",
      "Con tabla de páginas de 3 niveles (sin caché/TLB), ejecutar una instrucción implica 4 accesos a memoria": "V",
      "Con TLB y caché, ejecutar una instrucción puede implicar 0 accesos a memoria": "V",
      "En segmentación pura sin paginación, es imposible implementar memoria virtual": "F",
      "Con direcciones físicas de 32 bits y páginas de 4KB, la página virtual puede ser de 33 bits": "V",
      "Con Tabla de Páginas Invertida hay una tabla de páginas por proceso": "F",
      "Con N páginas virtuales y N marcos, LRU produce los mismos fallos que con N+1 marcos": "V",
    },
    explanation: "En la pila están los marcos de activación (datos), no el código. Las variables locales de main() están en la pila. La TP invertida es global, una entrada por marco físico.",
  },

  // ============================================================
  // GESTIÓN DE MEMORIA — Cálculos de tablas de páginas
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q5_tp",
    exam: "2020-01",
    topic: "memoria",
    type: "calculation",
    points: 5,
    question: "Sistema con direccionamiento de memoria física de 8GB, tamaño de página de 8KB y entrada de TP de 4 bytes. ¿Cuántos niveles de TP son necesarios para direcciones virtuales de 46 bits si cada TP es de tamaño una página? ¿Cuántos bits de control/no usados hay en una entrada?",
    correctAnswer: `Página = 8KB = 2¹³ bytes. Entradas por TP = 2¹³/4 = 2¹¹ = 2048 entradas.
1 nivel: 2¹¹ × 2¹³ = 2²⁴ bytes (16MB)
2 niveles: 2¹¹ × 2¹¹ × 2¹³ = 2³⁵ bytes (32GB)
3 niveles: 2¹¹ × 2¹¹ × 2¹¹ × 2¹³ = 2⁴⁶ bytes ✓

→ 3 niveles.

Memoria física 8GB = 2³³ bytes. Páginas 2¹³ → 2²⁰ páginas físicas → 20 bits.
Entrada TP = 32 bits → bits control/no usados = 32 − 20 = 12 bits.`,
    explanation: "Con 3 niveles de 11 bits + 13 bits offset = 46 bits. Los 12 bits restantes se usan para válido, R/W, referencia, dirty, etc.",
  },
  // 2021-01
  {
    id: "so_2021_q6_tp",
    exam: "2021-01",
    topic: "memoria",
    type: "calculation",
    points: 5,
    question: "Arquitectura con direcciones virtuales de 64 bits, físicas de 52 bits, páginas de 256KB (2¹⁸ bytes), TP en 2 niveles con igual número de bits por nivel y entradas de 8 bytes. ¿Bits no usados en dirección virtual? ¿Bits para seleccionar entrada de TP raíz?",
    correctAnswer: `Página = 256KB = 2¹⁸ bytes.
Entradas por TP = 2¹⁸/8 = 2¹⁵ → 15 bits/nivel.
Formato: [no usados] [15 bits] [15 bits] [18 bits offset]
Total usado = 15 + 15 + 18 = 48 bits.
Bits no usados = 64 − 48 = 16 bits.
Bits para tabla raíz = 15 bits.`,
    explanation: "64 bits de dirección virtual son más que suficientes. Solo se usan 48 bits. La TP raíz se indexa con los 15 bits superiores.",
  },
  // 2023-07
  {
    id: "so_2023jul_q2_tp",
    exam: "2023-07",
    topic: "memoria",
    type: "calculation",
    points: 6,
    question: "Sistema de paginación con direcciones lógicas de 16 bits y páginas de 4KB. a) Traduce direcciones lógicas 11034 (P1) y 12345 (P2) a direcciones físicas usando sus tablas de páginas. b) Sin memoria virtual, ¿podrían ejecutarse copias de P1 y P2 simultáneamente? c) ¿Podría ejecutarse un P3 que necesite 20 páginas lógicas? d) Construye una tabla de páginas invertida para P1 y P2.",
    correctAnswer: `a) P1: 11034/4096 = 2, offset = 2842. TP P1: pág 2 → frame 1 → física = 1×4096+2842 = 6938.
   P2: 12345/4096 = 3, offset = 57. TP P2: pág 3 → frame 4 → física = 4×4096+57 = 16441.

b) Sí, si hay suficiente memoria física para alojar todos los frames.

c) No. 16 bits − 12 offset = 4 bits para nº página → máximo 16 páginas lógicas.

d) TP invertida: cada frame físico una entrada (PID, pág_lógica).`,
    explanation: "Con 16 bits totales y páginas de 4KB (offset 12 bits), solo quedan 4 bits para direccionar páginas → máximo 16 páginas por proceso.",
  },

  // ============================================================
  // GESTIÓN DE MEMORIA — Reemplazo de páginas
  // ============================================================

  // 2021-01
  {
    id: "so_2021_q5_lru",
    exam: "2021-01",
    topic: "memoria",
    type: "text",
    points: 5,
    question: "Un proceso tiene la cadena de referencias: E D H B D E D A E B E D E B G y 3 marcos. Las 3 primeras referencias producen 3 fallos. ¿Número total de fallos con LRU?",
    correctAnswer: `Simulación LRU con 3 marcos:
E→fallo[E,-,-], D→fallo[E,D,-], H→fallo[E,D,H], B→fallo sale E[B,D,H],
D→ok, E→fallo sale H[B,D,E], D→ok, A→fallo sale B[A,D,E],
E→ok, B→fallo sale D[A,B,E], E→ok, D→fallo sale A[D,B,E],
E→ok, B→ok, G→fallo sale D[G,B,E]

Total: 9 fallos de página.`,
    explanation: "LRU reemplaza la página que lleva más tiempo sin usarse. Los primeros 3 fallos son obligatorios (cold start). Los otros 6 son por capacidad insuficiente.",
  },
  // 2022-01
  {
    id: "so_2022_q2_lru",
    exam: "2022-01",
    topic: "memoria",
    type: "calculation",
    points: 5,
    question: "Cadena de referencias: 2 4 6 1 3 2 4 6 1 3 con 4 marcos. ¿Número de fallos con LRU? ¿Y con FIFO Segunda Oportunidad?",
    correctAnswer: `LRU con 4 marcos:
2→F, 4→F, 6→F, 1→F [2,4,6,1]
3→F sale 2 [3,4,6,1? No. LRU: el más antiguo es 2, sale 2] → [4,6,1,3]
2→F sale 4 [6,1,3,2], 4→F sale 6 [1,3,2,4], 6→F sale 1 [3,2,4,6],
1→F sale 3 [2,4,6,1], 3→F sale 2 [4,6,1,3]
Total: 10 fallos.

FIFO 2ª Oportunidad: igual resultado, 10 fallos.
(El patrón es cíclico con distancia = 4, igual al número de marcos → siempre se desaloja la página que se va a necesitar)`,
    explanation: "Con distancia entre reapariciones igual al número de marcos, cualquier algoritmo de reemplazo produce fallos en cada referencia tras el llenado inicial.",
  },
  // 2024-01
  {
    id: "so_2024_q2_fifo",
    exam: "2024-01",
    topic: "memoria",
    type: "calculation",
    points: 5,
    question: "Cadena de referencias con 4 marcos. Las 4 primeras (2,4,5,1) producen 4 fallos. ¿Total de fallos con FIFO Segunda Oportunidad en las 10 primeras referencias? Cadena: 2 4 5 1 3 2 4 5 1 3.",
    correctAnswer: `FIFO 2ª Oportunidad con 4 marcos:
2→F, 4→F, 5→F, 1→F [2,4,5,1] (4 fallos)
3→F, sale 2 [3,4,5,1] (bit R de 2=0 al entrar último)
2→F, sale 4 [3,2,5,1]
4→F, sale 5 [3,2,4,1]
5→F, sale 1 [3,2,4,5]
1→F, sale 3 [1,2,4,5]
3→F, sale 2 [1,3,4,5]

Total: 10 fallos en las 10 primeras referencias.`,
    explanation: "FIFO 2ª Oportunidad da una segunda vida a páginas referenciadas (bit R=1) antes de reemplazarlas. Con patrón cíclico de distancia = marcos, se producen fallos en cada referencia.",
  },

  // ============================================================
  // PROCESOS E HILOS — V/F y conceptos
  // ============================================================

  // 2021-01
  {
    id: "so_2021_q7_proc",
    exam: "2021-01",
    topic: "procesos",
    type: "matching",
    points: 5,
    question: "Responde Verdadero (V) o Falso (F) sobre procesos:",
    correctAnswer: {
      "La credencial real y la efectiva de un proceso son siempre iguales": "F",
      "Las variables de entorno son iguales para todos los procesos del sistema": "F",
      "Cada proceso tiene su copia de los datos del kernel": "F",
      "La transición de ejecución a espera es SIEMPRE desde modo kernel": "V",
      "El estado de apropiado (preempted) es el mismo que el de listo para ejecución": "V",
      "Al comenzar un programa, las variables de entorno están en la pila de usuario": "V",
      "execvp() crea un nuevo proceso": "F",
      "waitpid(pi2,NULL,0) desasigna la estructura proc del proceso pi2 cuando termina": "V",
    },
    explanation: "Las credenciales real y efectiva pueden diferir (setuid). execvp() NO crea proceso, solo reemplaza la imagen del actual. Hace falta fork() antes.",
  },
  // 2022-01 modelo A
  {
    id: "so_2022_q1_proc",
    exam: "2022-01",
    topic: "procesos",
    type: "matching",
    points: 8,
    question: "Responde V/F sobre procesos (Modelo A del examen):",
    correctAnswer: {
      "Un proceso que no es root SIEMPRE comienza su ejecución en modo kernel": "V",
      "En UNIX con 15 procesos de 6 usuarios ejecutando el mismo programa, hay 6 copias del código en memoria": "F",
      "Cuando se crea un proceso con fork, su PID es 0": "F",
      "La estructura de procesos en UNIX es un grafo": "F",
      "La tabla de procesos está almacenada en la zona de datos del kernel": "V",
      "El código de la ISR de teclado es parte de los datos del kernel": "F",
      "execvp devuelve 0 si tiene éxito y -1 si hay error": "F",
      "Después de exec sobre un fichero setuid, el PID del proceso es el mismo": "V",
    },
    explanation: "Todo proceso arranca en modo kernel (el kernel prepara el entorno usuario). El código se comparte: 1 copia. fork() devuelve 0 al hijo como valor de retorno, pero su PID real > 0. La estructura es un árbol. exec NUNCA retorna en caso de éxito.",
  },
  // 2022-07
  {
    id: "so_2022jul_q3_proc",
    exam: "2022-07",
    topic: "procesos",
    type: "matching",
    points: 8,
    question: "Responde V/F sobre procesos:",
    correctAnswer: {
      "Los algoritmos apropiativos desperdician más tiempo en cambios de contexto": "V",
      "Un programa ejecutado por root pasa más tiempo en modo kernel que si lo ejecuta un usuario normal": "F",
      "En un sistema donde solo hay un proceso listo, bajarle la prioridad hace que tarde más": "F",
      "Un usuario normal puede ejecutar un fichero setuid root con permisos rwsr-sr-x": "V",
      "Los algoritmos con prioridades no apropiativas no tienen inanición": "F",
      "Un bucle de llamadas exec puede llenar la tabla de procesos": "F",
    },
    explanation: "El tiempo en modo kernel depende de las llamadas al sistema, no de quién ejecuta. Si solo hay un proceso, la prioridad no afecta. exec no crea procesos, no llena la tabla.",
  },
  // 2023-07
  {
    id: "so_2023jul_q1_proc",
    exam: "2023-07",
    topic: "procesos",
    type: "matching",
    points: 10,
    question: "Responde V/F sobre procesos e hilos:",
    correctAnswer: {
      "Un SO multiproceso solo puede correr en CPUs con instrucción 'crear proceso'": "F",
      "El número de usuarios que puede soportar un SO multiusuario está limitado por el microprocesador": "F",
      "El administrador (root) puede decidir que un proceso se ejecute siempre en modo kernel": "F",
      "Un proceso zombie ocupa una entrada en la tabla de procesos": "V",
      "La credencial efectiva de un proceso puede cambiar al hacer exec": "V",
      "Después de fork() las credenciales reales y efectivas de padre e hijo son iguales": "V",
      "Un proceso con mínima prioridad puede usar el 100% de CPU si no hay más procesos listos": "V",
      "Un algoritmo no apropiativo es más eficiente en tiempo de CPU para usuario que uno apropiativo": "V",
      "Existe la instrucción hardware 'cambiar prioridad' en los microprocesadores actuales": "F",
      "Todos los procesos creados con fork() tienen el mismo conjunto de variables de entorno": "F",
    },
    explanation: "La creación de procesos es software (llamadas al sistema). El límite de usuarios viene de recursos (memoria, tabla procesos), no del CPU. El modo kernel/user depende del código ejecutado. exec con setuid cambia el EUID.",
  },

  // ============================================================
  // PROCESOS E HILOS — Ejercicios fork y planificación
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q6_fork",
    exam: "2020-01",
    topic: "procesos",
    type: "mc",
    points: 5,
    question: "El siguiente código crea procesos con fork() en un bucle de 32 iteraciones. ¿Qué imprime?\nfor (i=0; i<32; i++) {\n  pid=fork();\n  if (pid==-1) break;\n  printf(\"/%ld/\",(long) pid);\n}",
    options: [
      "Imprime /0/ 32 veces",
      "Imprime /0/ y /un número positivo/ 32 veces en total",
      "Imprime /0/ y /un número positivo/ 2³² veces en total",
      "Imprime /0/ y /un número positivo/ un número finito de veces, menor que 2³²",
      "No imprime nada",
    ],
    correctAnswer: "d",
    explanation: "En cada iteración se duplican los procesos. En total se imprimiría 2³²−1 veces cada mensaje, pero el S.O. no puede tener 2³² procesos — la tabla de procesos se llena y fork() empieza a devolver -1, limitando el número real.",
  },
  // 2021-07
  {
    id: "so_2021jul_q2_exec",
    exam: "2021-07",
    topic: "procesos",
    type: "mc",
    points: 5,
    question: "Código C con bucle for que llama execv('./a.out', NULL, NULL) 10 veces y luego printf y sleep. ¿Qué salida produce?",
    options: [
      "Imprime el mensaje 10 veces y luego duerme 60 segundos",
      "Imprime el mensaje una vez y termina",
      "No produce ninguna salida",
      "Imprime infinitamente",
      "Depende de cuántos procesos se creen",
    ],
    correctAnswer: "c",
    explanation: "En la primera iteración, execv reemplaza el proceso actual por a.out (el mismo programa). La ejecución vuelve a main() desde el principio. Es un bucle infinito: nunca se alcanza el printf ni el sleep.",
  },
  // 2022-01
  {
    id: "so_2022_q3_sched",
    exam: "2022-01",
    topic: "procesos",
    type: "calculation",
    points: 6,
    question: "Linux con 3 procesos tiempo real: A (prio 70, SCHED_RR, CPU 500, I/O 800, CPU 300), B (prio 60, SCHED_RR, CPU 200, I/O 900, CPU 100), C (prio 70, SCHED_FIFO, CPU 300, I/O 400, CPU 100). Calcular tiempos de retorno y espera.",
    correctAnswer: `Prioridad 70 > 60. Entre igual prioridad, SCHED_RR antes que FIFO si ambos listos.
Llegan simultáneamente A y C (prio 70). A (RR) ejecuta 100ms, C (FIFO) ejecuta 300ms.
A ejecuta 400ms más → total 500ms CPU → A a I/O 800ms.
C a I/O 400ms.
B (prio 60) ejecuta 200ms → B a I/O 900ms.
C vuelve (t≈700), ejecuta 100ms → C termina t=900.
A vuelve (t=1300), ejecuta 300ms → A termina t=1600.
B vuelve (t=1100), ejecuta 100ms → B termina t=1700.
Retorno: A=1600, B=1700, C=900.`,
    explanation: "SCHED_RR tiene quantum. SCHED_FIFO ejecuta hasta bloquearse. La prioridad manda: los de prio 70 siempre expropian a los de prio 60.",
  },

  // ============================================================
  // ENTRADA/SALIDA — Planificación de disco
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q7_disk",
    exam: "2020-01",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question: "Disco duro con 2000 cilindros (0-1999). Cabeza en cilindro 605 (acaba de atender 605, antes 602). Cola: [400, 300, 1550, 900, 201, 495]. Indica el orden de atención para SSTF, SCAN y C-LOOK.",
    correctAnswer: `SSTF (más cercano primero): 605 → 495 → 400 → 300 → 201 → 900 → 1550

SCAN (subiendo, atiende en ambos sentidos):
Subiendo: 900 → 1550. Bajando: 495 → 400 → 300 → 201.
Orden: 900, 1550, 495, 400, 300, 201

C-LOOK (solo atiende en subida, salta al mínimo):
Subiendo: 900 → 1550, salta a 201 y sigue: 300 → 400 → 495.
Orden: 900, 1550, 201, 300, 400, 495`,
    explanation: "SSTF minimiza seek time con greedy. SCAN barre ambos sentidos. C-LOOK atiende en un sentido y salta al otro extremo sin atender en el camino de vuelta.",
  },
  // 2021-01
  {
    id: "so_2021_q10_disk",
    exam: "2021-01",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question: "Cola: [25, 100, 360, 77, 125, 222]. Atendidos [100] (primero) y [77]. ¿Siguiente cilindro con SSTF, C-SCAN y SCAN?",
    correctAnswer: `Atendidos 100 → 77. El ascensor está en 77 bajando.

SSTF: más cercano a 77 es 125 (distancia 48). → Siguiente: 125
SCAN: bajando desde 77, siguiente hacia abajo: 25. → Siguiente: 25
C-SCAN: solo atiende bajando. Bajando: 25. → Siguiente: 25`,
    explanation: "Tras atender 100 y 77, el ascensor está en 77 bajando. SSTF elige el más cercano (125). SCAN continúa bajando (25). C-SCAN atiende solo en sentido descendente.",
  },
  // 2021-07
  {
    id: "so_2021jul_q3_disk",
    exam: "2021-07",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question: "Cola: [25, 100, 360, 77, 124, 122]. Atendidos [100] y [77] en ese orden. ¿Puede ser SSTF el algoritmo usado?",
    correctAnswer: `No puede ser SSTF.
Desde 100, distancias: |100-25|=75, |100-77|=23, |100-122|=22, |100-124|=24, |100-360|=260.
La más cercana a 100 es 122 (dist 22), no 77 (dist 23).
Si se atendió 77 en segundo lugar, el algoritmo NO puede ser SSTF.`,
    explanation: "SSTF siempre atiende la petición más cercana a la posición actual. Si 122 está más cerca que 77 desde 100, SSTF habría atendido 122 primero.",
  },
  // 2023-01
  {
    id: "so_2023_q5_disk",
    exam: "2023-01",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question: "Cola: [185, 190, 33, 400, 250, 200]. Atendidos [200] y [190] en ese orden. Orden de las restantes con SSTF, C-LOOK y SCAN.",
    correctAnswer: `Atendidos 200 → 190. Ascensor está en 190 bajando.

SSTF: más cercano a 190 es 185 → 250 → 400 → 33.
Orden: 185, 250, 400, 33

SCAN (bajando, luego sube): 185 → 33 (bajando), luego sube: 250 → 400.
Orden: 185, 33, 250, 400

C-LOOK (solo baja, salta al máximo): 185 → 33 (bajando), salta a 400, sigue: 250.
Orden: 185, 33, 400, 250`,
    explanation: "La dirección del ascensor (subiendo/bajando) es clave para SCAN y C-LOOK. 200→190 indica que va bajando.",
  },
  // 2023-07
  {
    id: "so_2023jul_q7_disk",
    exam: "2023-07",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question: "Cola: [165, 190, 33, 40, 250, 200]. Atendidos [190] y [200] en ese orden. Orden de las restantes con C-LOOK y CSCAN.",
    correctAnswer: `Atendidos 190 → 200. Ascensor está en 200 subiendo.

C-LOOK (solo sube, salta al mínimo): 250 (subiendo), salta a 33 → 40 → 165.
Orden: 250, 33, 40, 165

CSCAN (solo sube, salta al mínimo): igual que C-LOOK en este caso.
Orden: 250, 33, 40, 165`,
    explanation: "190→200 indica que el ascensor va subiendo. C-LOOK/CSCAN suben hasta el máximo y saltan al mínimo para seguir atendiendo en el mismo sentido.",
  },

  // ============================================================
  // ENTRADA/SALIDA — V/F, geometría de disco y DMA
  // ============================================================

  // 2021-01
  {
    id: "so_2021_q9_es",
    exam: "2021-01",
    topic: "entrada-salida",
    type: "matching",
    points: 5,
    question: "Responde V/F sobre conceptos de Entrada/Salida:",
    correctAnswer: {
      "El registro de control de un controlador permite saber si el dispositivo está disponible": "F",
      "La capa de software independiente del dispositivo calcula cuántos sectores deben leerse": "F",
      "Un disco con 4 caras y 16000 pistas/cara tiene 64000 cilindros": "F",
      "El major number de /dev/sdb es 8": "V",
      "Un DMA en modo ráfaga tiene mayor prioridad de acceso al bus que en modo robo de ciclos": "V",
    },
    explanation: "El registro de estado (no control) indica disponibilidad. 4 caras = 16000 cilindros, no 64000. El DMA en ráfaga bloquea el bus hasta terminar.",
  },
  // 2021-07
  {
    id: "so_2021jul_q5_es",
    exam: "2021-07",
    topic: "entrada-salida",
    type: "matching",
    points: 5,
    question: "Responde V/F sobre Entrada/Salida:",
    correctAnswer: {
      "Al llamar a read para 1 byte, el device driver verifica si el bloque está en caché": "F",
      "La capa de software independiente asigna nuevo bloque al escribir y no cabe en el último": "V",
      "El major number de /dev/sda es 0": "F",
      "Disco: 4 platos, 2 caras/plato, 16 sect/pista, 32768 sect totales → 256 cilindros": "V",
      "Tras open+read, lseek al inicio y otro read, a y b tienen el mismo valor": "V",
    },
    explanation: "La verificación de caché la hace la capa de buffer cache (software independiente), no el driver. La asignación de bloques es función del sistema de ficheros.",
  },
  // 2023-01
  {
    id: "so_2023_q6_es",
    exam: "2023-01",
    topic: "entrada-salida",
    type: "matching",
    points: 5,
    question: "Responde V/F sobre Entrada/Salida:",
    correctAnswer: {
      "fprintf prepara el buffer en la capa de software independiente del dispositivo": "F",
      "fprintf(fich,'%s-%d',...) internamente llama a write(1, buffer, 11)": "F",
      "El device driver calcula qué bloques de disco deben estar en memoria para write": "F",
      "Si un fichero ocupa 4090 bytes y se escriben 10 más, se asigna un nuevo bloque": "V",
      "El device driver lanza una interrupción para transferir bloques de caché a disco": "F",
    },
    explanation: "fprintf es libc (espacio usuario), no kernel. El cálculo de bloques lo hace el sistema de ficheros. Las interrupciones las genera el hardware (controladora), no el driver.",
  },

  // ============================================================
  // ENTRADA/SALIDA — Cálculos de geometría de disco
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q9_diskgeo",
    exam: "2020-01",
    topic: "entrada-salida",
    type: "calculation",
    points: 2,
    question: "Disco con 1 plato, 2 caras, 2048 cilindros, 512 sectores/pista, 512 bytes/sector. ¿Cuántos bloques ve el S.O. si se formatea con bloques de 2048 bytes?",
    correctAnswer: `Total sectores = 2 caras × 2048 cilindros × 512 sect/pista = 2,097,152 sectores.
1 bloque = 2048 bytes = 4 sectores (512B c/u).
Nº bloques = 2,097,152 / 4 = 524,288 bloques.`,
    explanation: "Cada bloque del sistema de ficheros agrupa varios sectores físicos. Con bloques de 2KB y sectores de 512B, cada bloque = 4 sectores.",
  },
  // 2021-01
  {
    id: "so_2021_q11_diskgeo",
    exam: "2021-01",
    topic: "entrada-salida",
    type: "calculation",
    points: 2,
    question: "Disco con 16384 sectores, 2 platos, 2 caras/plato, 512B/sector, 16 sectores/pista. ¿Cuántos cilindros? ¿Cuántos bloques con bloques de 2048 bytes?",
    correctAnswer: `Pistas totales = 16384 / 16 = 1024 pistas.
Caras = 2 platos × 2 = 4 caras.
Cilindros = 1024 / 4 = 256 cilindros.

Capacidad = 16384 × 512 = 8,388,608 bytes.
Bloques 2048B = 4 sectores/bloque.
Nº bloques = 16384 / 4 = 4096 bloques.`,
    explanation: "Cada cilindro contiene una pista por cada cara. Con 4 caras, cada cilindro = 4 pistas.",
  },
  // 2022-01
  {
    id: "so_2022_q4_diskgeo",
    exam: "2022-01",
    topic: "entrada-salida",
    type: "calculation",
    points: 2,
    question: "Disco: 32768 sectores, 2 platos, 2 caras/plato, 512B/sector, 16 sectores/pista. ¿Número de cilindros? ¿Número de bloques con bloques de 8192 bytes?",
    correctAnswer: `Pistas totales = 32768 / 16 = 2048 pistas.
Caras = 2 × 2 = 4.
Cilindros = 2048 / 4 = 512 cilindros.

Bloques 8192B = 16 sectores/bloque.
Nº bloques = 32768 / 16 = 2048 bloques.`,
    explanation: "La geometría lógica: pistas/cilindro = número de caras. Bloques = sectores totales / sectores por bloque.",
  },
  // 2023-07
  {
    id: "so_2023jul_q8_diskgeo",
    exam: "2023-07",
    topic: "entrada-salida",
    type: "calculation",
    points: 2,
    question: "Disco: 65536 sectores, 4 platos, 2 caras/plato, 512B/sector, 16 sectores/pista. a) ¿Número de cilindros? b) ¿Número de bloques con bloques de 4096 bytes?",
    correctAnswer: `a) Pistas = 65536/16 = 4096. Caras = 4×2 = 8. Cilindros = 4096/8 = 512.
b) 1 bloque = 4096B = 8 sectores. Bloques = 65536/8 = 8192.`,
    explanation: "Más platos = más pistas por cilindro = menos cilindros para la misma cantidad de sectores.",
  },
];