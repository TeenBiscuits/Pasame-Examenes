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
    type: "text",
    points: 7,
    repeated: true,
    question:
      "Un sistema de archivos tipo UNIX System V tiene un tamaño de bloque de 2Kbytes, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 8 bytes. Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con un tamaño de 130 Mbytes+1byte, diferenciando entre bloques de datos y bloques de índices.",
    correctAnswer: `Tamaño de bloque: 2KB = 2048 bytes. 130 MB + 1 byte ≈ 136,314,881 bytes
Nº bloques de datos = ceil(136,314,881 / 2048) = 66,561 bloques

Direcciones por bloque de índices = 2048 / 8 = 256 direcciones
Capacidad con 10 directas + indirecta simple (256) + indirecta doble (256² = 65,536) = 65,802 bloques
Faltan 66,561 − 65,802 = 759 bloques → necesitan triple indirección
759 / 256 ≈ 3 bloques de índice de 3er nivel

Nº bloques de índices = 1 (simple) + 1 (doble) + 256 (doble 2º) + 1 (triple) + 1 (triple 2º) + 3 (triple 3º) = 263

Fragmentación interna: 2048 − (136,314,881 mod 2048) = 2047 bytes`,
    explanation:
      "El cálculo de bloques de índices es clave: cada nivel de indirección añade capacidad pero también overhead de bloques de metadatos.",
  },
  {
    id: "so_2021_q1",
    exam: "2021-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 6,
    question:
      "Un sistema de archivos tipo UNIX System V tiene tamaño de bloque de 4Kbytes, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 8 bytes. Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con un tamaño de 1 Gbyte + 6 Mbytes + 40 Kbytes.",
    correctAnswer: `Tamaño total = 1,080,074,240 bytes. Bloque = 4KB = 4,096 bytes
Nº bloques de datos = ceil(1,080,074,240 / 4,096) = 263,690 bloques

Direcciones por bloque de índices = 4096/8 = 512
Con 10 directas + indirecta simple (512) + indirecta doble (512²=262,144) = 262,666 bloques
Faltan 263,690 − 262,666 = 1,024 bloques → triple indirección: 2 bloques índice 3er nivel

Índices: 1 (simple) + 1 (doble) + 512 (doble 2º) + 1 (triple) + 1 (triple 2º) + 2 (triple 3º) = 518
Fragmentación interna: 0 bytes (división exacta)`,
    explanation:
      "Con bloques más grandes caben más direcciones por bloque de índices (512 vs 256), reduciendo los niveles de indirección necesarios.",
  },
  // 2021-07
  {
    id: "so_2021jul_q1",
    exam: "2021-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 6,
    question:
      "Un sistema de archivos tipo UNIX System V tiene un tamaño de bloque de 8Kbytes, i-nodos con 12 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 8 bytes. Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con un tamaño de 8 Gbytes + 32 Mbytes + 1024 bytes.",
    correctAnswer: `Tamaño total ≈ 8,623,490,048 bytes. Bloque = 8KB = 8,192 bytes.
Nº bloques datos = ceil(8,623,490,048 / 8,192) = 1,052,673 bloques.

Direcciones por bloque índices = 8192 / 8 = 1024
12 directas → 12 bloques
Indirecta simple: +1024 → 1,036
Indirecta doble: +1024² = +1,048,576 → 1,049,612
Faltan: 1,052,684 − 1,049,612 = 3,063 bloques → triple indirección

Índices: 1 (simple) + 1 (doble) + 1024 (doble 2º) + 1 (triple) + 1 (triple 2º) + 3 (triple 3º) = 1,031
Fragmentación interna: 8,192 − (8,623,490,048 mod 8,192) = 7,168 bytes`,
    explanation:
      "Al aumentar el tamaño de bloque, cada nivel de indirección escala cuadráticamente/cúbicamente. Con bloques de 8KB y direcciones de 8B, cada bloque de índices contiene 1024 punteros.",
  },
  // 2022-01
  {
    id: "so_2022_q1",
    exam: "2022-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 6,
    question:
      "Un sistema de archivos tipo UNIX System V tiene un tamaño de bloque de 2Kbytes, i-nodos con 12 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 4 bytes. Calcular el tamaño máximo de un fichero al utilizar los niveles de indirección simple, doble y triple. Indicar también el número de bloques de índices usado exclusivamente en cada nivel.",
    correctAnswer: `Bloque = 2KB, direcciones de 4B → 512 punteros por bloque índice.

Indirecta simple: 512 × 2KB = 1MB (+12 directas × 2KB = 24KB) = 1MB + 24KB. 1 bloque índice.
Indirecta doble: 512² × 2KB = 512MB. Total: 512MB + 1MB + 24KB. Bloques índice: 1 + 512 = 513.
Indirecta triple: 512³ × 2KB = 256GB. Total: 256GB + 512MB + 1MB + 24KB. Bloques índice: 1 + 512 + 512² = 262,657.`,
    explanation:
      "La capacidad escala: ×512 por cada nivel de indirección adicional. Con direcciones de 4 bytes caben el doble de punteros por bloque que con 8 bytes.",
  },
  // 2023-01
  {
    id: "so_2023_q1",
    exam: "2023-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 6,
    question:
      "Calcular cuántos bloques de disco son necesarios (en el área de datos) para representar un archivo de tamaño 1 Gbyte + 6 Mbytes + 10 Kbytes. Sistema UNIX, tamaño de bloque 4 KB, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple, direcciones de bloque de 8 bytes.",
    correctAnswer: `Tamaño = 1,079,705,610 bytes. Bloques 4KB → 262,403 bloques totales.
Direcciones por bloque = 4096/8 = 512.
10 directas + 512 indirecta simple + 512² indirecta doble = 262,666 (cubre todo con doble indirección parcial).
Datos: 262,403 − 10 − 512 − 512×511 = 262,147 bloques datos.
Índices: 1 (simple) + 1 (doble) + 516 (doble 2º nivel) = 518.
Fragmentación: 2048 bytes.`,
    explanation:
      "Similar al problema de 2021 pero con datos diferentes para practicar el mismo concepto desde otro ángulo.",
  },
  // 2023-07
  {
    id: "so_2023jul_q1",
    exam: "2023-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 6,
    question:
      "Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con tamaño de 516 Mbytes + 1048 bytes. Sistema UNIX System V, bloque 2KB, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple, direcciones de bloque de 4 bytes.",
    correctAnswer: `Tamaño = 516MB + 1048B = 541,066,280 bytes. Bloques 2KB → 264,193 bloques.
Direcciones por bloque = 2048/4 = 512.
10 directas + 512 indirecta simple + 512² = 262,666 (cubre con doble indirección). Sobran bloques de triple.
Datos: 264,193 − 10 − 512 − 512×515 = 258,049. Índices: 1 + 1 + 517 = 519.
Fragmentación: 1000 bytes.`,
    explanation:
      "Con direcciones de 4 bytes en bloques de 2KB caben 512 punteros, igual que con direcciones de 8 bytes en bloques de 4KB.",
  },
  // 2023-07 — P2: superbloque e inodo
  {
    id: "so_2023jul_q2_superbloque",
    exam: "2023-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 2,
    question:
      "En el sistema de archivos UNIX de la P1 (tamaño de bloque de 2KB), el boot ocupa los 3 primeros bloques de la partición. El superbloque comienza en el bloque lógico 3. El fichero 'datos' tiene asociado el inodo 60 (los inodos comienzan con el inodo 1) y ese inodo está en el bloque lógico 13. El tamaño del inodo es de 64 bytes. Calcula el tamaño del superbloque (en KB) y el bloque lógico correspondiente al inodo 3201.",
    correctAnswer: `Inodos por bloque = 2048 / 64 = 32 inodos/bloque.
Inodo 60 → bloque relativo en el área de inodos = floor((60 − 1) / 32) = floor(59 / 32) = 1.
El área de inodos comienza tras el superbloque (bloque 3).
3 + tamaño_superbloque + 1 = 13 → tamaño_superbloque = 9 bloques.
Tamaño en KB = 9 × 2KB = 18 KB.

Inodo 3201 → bloque relativo = floor((3201 − 1) / 32) = floor(3200 / 32) = 100.
Bloque lógico = 3 (inicio partición) + 9 (superbloque) + 100 = 112.`,
    explanation:
      "Cada bloque de 2KB contiene 32 inodos de 64 bytes. Conocida la posición del inodo 60 (bloque 13) y sabiendo que el área de inodos arranca tras el superbloque (bloque 3), despejamos el tamaño del superbloque. Para el inodo 3201 basta sumar: inicio + superbloque + offset dentro del área de inodos.",
  },
  // 2023-01 — P3: tamaño del boot
  {
    id: "so_2023_q3_boot",
    exam: "2023-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 3,
    question:
      "Sistema UNIX: bloque 4KB, superbloque ocupa 7 bloques. Bloques numerados desde 0. El fichero 'datos' tiene inodo 642, que está en el bloque lógico 21. Tamaño de inodo: 64 bytes. Calcula el tamaño del boot en KB.",
    correctAnswer: `Inodos por bloque = 4096 / 64 = 64 inodos/bloque.
Inodo 642 → bloque relativo en el área de inodos = floor((642 − 1) / 64) = floor(641 / 64) = 10.
El área de inodos comienza tras el boot y el superbloque.
Boot + 7 (superbloque) + 10 (offset área inodos) = 21
Boot + 17 = 21 → Boot = 4 bloques.
Tamaño en KB = 4 × 4KB = 16 KB.`,
    explanation:
      "Conocido el bloque lógico del inodo 642 (21) y el tamaño del superbloque (7 bloques), se despeja el tamaño del boot contando hacia atrás desde el inicio del área de inodos.",
  },
  // 2024-01
  {
    id: "so_2024_q1",
    exam: "2024-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 6,
    question:
      "Un sistema de archivos tipo UNIX tiene un tamaño de bloque de 8Kbytes, i-nodos con 12 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 4 bytes. i) Calcular el tamaño máximo de un fichero usando indirección doble. ii) Calcular cuántos bloques son necesarios para un fichero de 96 Gbytes + 103 Kbytes. iii) Calcular la fragmentación interna.",
    correctAnswer: `i) Direcciones por bloque = 8KB/4B = 2048. Indirecta doble: 2048² × 8KB = 32GB. Con simple (2048×8KB=16MB) y 12 directas (96KB) → máximo = 32GB + 16MB + 96KB.

ii) 96GB + 103KB = 103,079,215,104 bytes. Bloques datos = 12,582,912 + 13. Índices = 6,149.
iii) Fragmentación interna: 1024 bytes.`,
    explanation:
      "Con bloques de 8KB y direcciones de 4 bytes, cada bloque de índices tiene 2048 entradas, lo que acelera el crecimiento de la capacidad por nivel.",
  },

  // 2024-01 — P2: tamaño de inodo y bloque lógico
  {
    id: "so_2024_q2_inodo",
    exam: "2024-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 3,
    question:
      "Sistema de archivos UNIX con bloque de 8KB. El tamaño de la lista de inodos en disco es de 32 MB. El superbloque mantiene un mapa de bits de inodos libres que ocupa 8 bloques. i) Calcular el tamaño (en bytes) de un inodo. ii) Si la lista de inodos comienza en el bloque lógico 10, ¿qué bloque lógico corresponde al inodo 1285?",
    correctAnswer: `i) El mapa de bits de inodos ocupa 8 bloques × 8 KB = 64 KB = 65,536 bytes = 524,288 bits.
Cada bit representa un inodo (libre/ocupado), por tanto hay 524,288 inodos en total.
Tamaño lista inodos = 32 MB = 33,554,432 bytes.
Tamaño de un inodo = 33,554,432 / 524,288 = 64 bytes.

ii) Inodos por bloque = 8 KB / 64 bytes = 8,192 / 64 = 128 inodos.
La lista de inodos empieza en bloque 10. Los inodos se numeran desde 1.
Inodo 1285 → offset en inodos desde inicio = 1285 − 1 = 1284.
Bloque relativo dentro de la lista = floor(1284 / 128) = 10.
Bloque lógico = 10 (inicio) + 10 = 20.`,
    explanation:
      "El mapa de bits de inodos ocupa 8 bloques de 8KB = 64KB. Con 64KB × 8 bits/byte = 524,288 bits, cada uno representa un inodo. El tamaño total de la lista de inodos (32MB) dividido por el número de inodos da 64 bytes por inodo. Con 128 inodos por bloque (8192/64), el inodo 1285 está en el bloque 10 de la lista, que es el bloque lógico 20.",
  },

  // 2020-01 — P2 superbloque
  {
    id: "so_2020_q2",
    exam: "2020-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 4,
    question:
      "Sistema UNIX con bloque 2KB. Boot ocupa los 3 primeros bloques de la partición. Superbloque comienza en bloque lógico 3. Fichero 'datos' tiene inodo 643 y ocupa el bloque lógico 33. Tamaño del inodo: 64 bytes. Calcula el tamaño del superbloque (en KB) y el bloque lógico correspondiente al inodo 3201.",
    correctAnswer: `Inodos por bloque = 2048/64 = 32 inodos/bloque.
El inodo 643 está en el bloque: floor(643/32) = 20 (área de inodos, empezando en 0).
Área de inodos empieza tras superbloque (bloque 3).
El fichero "datos" está en bloque 33 → los bloques de inodos van del 3 al 32 (30 bloques).
Tamaño superbloque = 33 − 3 − 20 = 10 bloques = 20 KB.

Inodo 3201: bloque = 3 + 10 + floor(3201/32) = 3 + 10 + 100 = 113.`,
    explanation:
      "El superbloque contiene metadatos (mapa de inodos/bloques libres). Los inodos empiezan tras el superbloque. Cada bloque tiene 32 inodos de 64 bytes.",
  },

  // 2020-01 — P3 subpreguntas completas
  {
    id: "so_2020_q3_full",
    exam: "2020-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 9,
    repeated: true,
    question:
      "Código sobre '/home/juan/so/p1/p1.c' (3MB, inodo 6549): chmod 0420, lstat, open O_RDONLY, link crea practica1.c, symlink crea slink_practica1.c, open practica1.c, lseek(fd2, 2097152, SEEK_SET), fgetc, close, unlink. Cachés vacías, entrada p1 en 8º bloque de so. Responde: A) Accesos a disco en 1ª apertura. B) Valor de fd2. C) Bloques leídos para fgetc(fd2). D) Tamaño de slink_practica1.c. E) ¿fgetc es syscall? F) ¿link es syscall? G) ¿unlink libera el inodo 6549? H) El enlazador encuentra printf en libC? I) Permisos en rwxrwxrwx.",
    correctAnswer: `A) 12 accesos (raíz, home, juan, so(8º bloque), p1, p1.c + 6 accesos índices datos)
B) 4 (fd1=3, fd2=4)
C) 3 bloques (2097152 = 2²¹ → bloque 1024, está en zona de indirección simple → 1 índice + 1 datos = 2, pero con cachés vacías y primera lectura de esa zona se necesita 1 acceso extra = 3)
D) 11 bytes (longitud de "practica1.c")
E) Falso (fgetc es función de libc, no llamada al sistema)
F) Cierto (link es llamada al sistema)
G) Cierto (unlink borra entrada p1.c pero quedan hard links → inodo no se libera)
H) Cierto (el enlazador linka printf desde libC, estática o dinámicamente)
I) r-- -w- --- (0420: owner=4=r--, group=2=-w-, others=0=---)`,
    explanation:
      "P3 completo del examen. Combina cálculo de accesos a disco, descriptores de fichero, bloques de índices, symlinks, syscalls vs funciones de librería, y permisos UNIX.",
  },

  // 2020-01 — Procesos Q2: planificación multicolas
  {
    id: "so_2020_q7_sched",
    exam: "2020-01",
    topic: "procesos",
    type: "text",
    points: 7,
    repeated: true,
    question:
      "Sistema monoprocesador con 3 colas: SY (sistema, RR quantum 3, prioridad máxima), IT (interactivos, RR quantum 1), NI (no interactivos, SJF, prioridad mínima). Procesos: A(SY, 4-(7)-2, t=0), B(SY, 2-(7)-4, t=1), C(IT, 2-(3)-2-(3)-1, t=0), D(IT, 1-(3)-1-(3)-1, t=2), E(NI, 4, t=0), F(NI, 3, t=2). Muestra la planificación.",
    correctAnswer: `Traza CPU: A A A B B A C D C F F D B B B A A B C D C F E E C E E

Explicación:
- t=0: A(SY) ejecuta. Llega C(IT) y E(NI) pero SY > IT > NI.
- t=3: A agota quantum 3. B(SY) ejecuta quantum 3.
- t=6: A ejecuta su 1 restante de la 1ª ráfaga. A va a E/S 7.
- t=7: Entran IT: C y D. C ejecuta 1 (quantum), D ejecuta 1.
- t=9: C, D, C... hasta agotar. Los NI (E, F) solo ejecutan cuando SY e IT están en E/S.
- NI usa SJF: F(3) es más corto que E(4) → F ejecuta primero.
- Al volver procesos de E/S, expropian a NI por tener mayor prioridad.`,
    explanation:
      "Planificación multicolas con prioridades apropiativas: SY expropia a IT, IT expropia a NI. Dentro de SY: RR quantum 3. IT: RR quantum 1. NI: SJF (el más corto primero).",
  },

  // 2020-01 — E/S V/F
  {
    id: "so_2020_q8_es",
    exam: "2020-01",
    topic: "entrada-salida",
    type: "matching",
    points: 5,
    question: "Indica V/F sobre Entrada/Salida:",
    correctAnswer: {
      "El registro de datos de un controlador permite enviar comandos al dispositivo":
        "F",
      "El manejador de interrupciones chequea si un bloque está en la caché de bloques":
        "F",
      "Un DMA en modo bus transparente tiene mayor prioridad que en modo robo de ciclos":
        "F",
      "Los major numbers de /dev/sda y /dev/sda1 son idénticos": "V",
      "Determinar qué bloque de disco contiene un offset de fichero se realiza en el device driver":
        "F",
    },
    explanation:
      "El registro de comandos (no datos) envía comandos. La caché de bloques se gestiona en capas superiores. DMA transparente solo usa el bus cuando CPU no lo necesita (menor prioridad). Major number identifica el driver. El cálculo de bloques lo hace el sistema de ficheros.",
  },

  // 2020-01 — E/S código pread/dup/read
  {
    id: "so_2020_q10_pread",
    exam: "2020-01",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question:
      "Fichero 'fichero.txt' contiene '012345678901234546789\\n'. Código: char BUF[5]={'-','-','-','-','\\0'}; fd=open(fichero.txt,O_RDONLY); fd2=dup(fd); lseek(fd2,2,SEEK_SET); pread(fd,BUF,1,0); lseek(fd,2,SEEK_CUR); pread(fd,BUF,2,3); read(fd,BUF,1); read(fd,BUF+3,2); printf('%s',BUF). ¿Contenido de BUF tras línea 09?",
    correctAnswer: `Tras l.09: BUF = {'3','4','-','-','\\0'}

Paso a paso:
1. open → fd=3. dup(fd)→fd2=4 (comparten file pointer).
2. lseek(fd2,2,SEEK_SET) → file pointer de fd/fd2 = 2.
3. pread(fd,BUF,1,0) → lee desde offset absoluto 0: '0'. BUF={'0','-','-','-','\\0'}. pread NO modifica file pointer.
4. lseek(fd,2,SEEK_CUR) → file pointer = 2+2 = 4.
5. pread(fd,BUF,2,3) → lee desde offset 3: '3','4'. BUF={'3','4','-','-','\\0'}.
6. read(fd,BUF,1) → lee 1 byte desde file pointer=4: '4'. BUF={'4','4','-','-','\\0'}.
7. read(fd,BUF+3,2) → lee 2 bytes desde fp=5: '5','4'. BUF={'4','4','5','4','\\0'}.
8. printf imprime "4454".`,
    explanation:
      "pread() lee desde offset absoluto sin modificar el file pointer. lseek() modifica el file pointer. Los cambios de posición en fd2 (dup) afectan a fd porque comparten la misma entrada en la tabla de ficheros abiertos.",
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
    question:
      "Tras ejecutar chmod con 0420 sobre un fichero, ¿qué permisos se muestran en formato rwxrwxrwx?",
    options: [
      "rwx r-- ---",
      "r-- -w- ---",
      "r-- r-- r--",
      "--- -w- ---",
      "-w- r-- ---",
    ],
    correctAnswer: "b",
    explanation:
      "0420 en octal: owner=4 (r--), group=2 (-w-), others=0 (---). Resultado: r---w----",
  },
  // 2021-01
  {
    id: "so_2021_q4_tf",
    exam: "2021-01",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question:
      "Indica si es cierto (C) o falso (F) cada afirmación sobre sistemas de ficheros UNIX:",
    correctAnswer: {
      "Mientras un fichero está abierto, el S.O. mantiene una copia de su inodo en memoria principal":
        "C",
      "El contenido de un directorio se almacena en el área de datos": "C",
      "El código enlazado con una librería dinámica es autocontenido": "F",
      "El código binario de fork() se encuentra en la librería estándar de C (libC)":
        "F",
      "Es posible crear hard links entre diferentes sistemas de ficheros montados":
        "F",
      "El tipo de fichero 'link simbólico' se codifica en el campo modo del inodo":
        "C",
      "El journaling registra las operaciones de metadatos antes de aplicarlas para recuperación tras caídas":
        "C",
      "El Buffer Cache no minimiza errores ante caídas de alimentación": "C",
    },
    explanation:
      "El inodo en memoria se mantiene mientras el fichero está abierto. Los hard links solo funcionan dentro del mismo sistema de ficheros. El journaling registra operaciones para recuperación.",
  },
  // 2021-01 — P2 código completo (subpreguntas A-E)
  {
    id: "so_2021_q2_code",
    exam: "2021-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    question:
      "Código sobre '/home/usr1/dir1/datos' (1GB+6MB+40KB, hard links=2): chmod 0442, lstat, open O_RDONLY (1ª apertura), lseek(fd, 1073741824, SEEK_SET), fgetc, close, unlink. Cachés vacías, entrada usr1 en 7º bloque de home. Responde: A) Valor de fd. B) Accesos a disco en apertura. C) Bloques leídos para fgetc. D) Permisos impresos en rwxrwxrwx. E) Hard links de 'datos' tras unlink.",
    correctAnswer: `A) 3 (stdin=0, stdout=1, stderr=2 → fd=3)
B) 10 accesos (raíz, home, 7 bloques de home para usr1, dir1, datos)
C) 3 bloques (1073741824 = 1GB → zona de triple indirección parcial)
D) r-- r-- -w- (0442: owner=4=r--, group=4=r--, others=2=-w-)
E) 1 (inicialmente 2 hard links; unlink borra la entrada → queda 1 hard link)`,
    explanation:
      "La posición 1GB requiere acceder a bloques vía triple indirección. Con cachés vacías, recorrer la ruta del fichero requiere acceder a cada bloque de directorio e inodo.",
  },
  // 2021-01 — P3 hard links y soft links
  {
    id: "so_2021_q3_links",
    exam: "2021-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 3,
    question:
      "Se crean 3 hard links a un fichero 'f1' (inodo 25634, 965 bytes, hard links=1) en su mismo directorio: ln f1 f2, ln f1 f3, ln f1 f4. Luego se crea soft link: ln -s f3 slink. a) ¿Tamaño (bytes) del fichero 'f3'? b) Se borra f2 (rm f2). ¿Tamaño (bytes) del fichero 'slink'?",
    correctAnswer: `a) 965 bytes (f3 es un hard link a f1 → comparten el mismo inodo → mismo tamaño)
b) 2 bytes (slink es symlink a 'f3'. Al borrar f2, f3 sigue existiendo. Pero el symlink almacena la ruta 'f3' → tamaño = 2 bytes)`,
    explanation:
      "Los hard links comparten inodo → mismo tamaño que el original. Los symlinks almacenan la ruta como contenido. Al borrar un hard link, mientras quede al menos uno, el fichero sigue existiendo.",
  },
  // 2021-01 — Procesos Q2: Execute function
  {
    id: "so_2021_q8_exec",
    exam: "2021-01",
    topic: "procesos",
    type: "text",
    points: 5,
    question:
      "Se muestran 3 versiones de una función Execute(char *argv[]) para crear un proceso y ejecutar un programa. Versión 1: fork, execvp, perror, waitpid. Versión 2: igual pero con exit(0) tras perror y waitpid con WNOHANG. Versión 3: execvp y waitpid sin fork. Para cada versión indica si es correcta y por qué.",
    correctAnswer: `Versión 1 (sin exit tras perror): INCORRECTA. Si execvp falla, el proceso hijo sigue ejecutando el código del padre (no hay exit). Quedan dos copias ejecutándose.

Versión 2 (con exit + WNOHANG): CORRECTA pero ejecuta en segundo plano. exit(0) tras perror asegura que el hijo termine si execvp falla. WNOHANG hace que waitpid no espere → ejecución en segundo plano.

Versión 3 (execvp sin fork): INCORRECTA. execvp NO crea un proceso nuevo, solo reemplaza la imagen del proceso actual. Sin fork(), el proceso padre es reemplazado y nunca se ejecuta waitpid.`,
    explanation:
      "Patrón fork+exec: fork() crea el hijo, exec() reemplaza su imagen. Si exec falla, el hijo debe hacer exit() para no duplicar la ejecución. waitpid espera al hijo; con WNOHANG no bloquea.",
  },
  // 2021-07
  {
    id: "so_2021jul_q4_tf",
    exam: "2021-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    repeated: true,
    question: "Indica si es cierto (C) o falso (F) sobre sistemas de ficheros:",
    correctAnswer: {
      "El S.O. mantiene una copia en memoria del inodo de un fichero abierto hasta el último cierre":
        "C",
      "Al enlazar con librería dinámica, las funciones se integran en el ejecutable":
        "F",
      "Al ejecutar printf se incrementa el tiempo en modo usuario y en modo sistema":
        "C",
      "Es posible crear soft links entre diferentes sistemas de ficheros montados":
        "C",
      "La idea fundamental del journaling es llevar control histórico de asignaciones de inodos":
        "F",
      "El Buffer Cache reduce el número de lecturas y escrituras físicas sobre los discos":
        "C",
    },
    explanation:
      "Los soft links almacenan rutas, no dependen del inodo destino → pueden cruzar sistemas de ficheros. Los hard links no pueden.",
  },

  // 2021-07 — Memoria Q3: TP con entradas hexadecimales
  {
    id: "so_2021jul_q3_memhex",
    exam: "2021-07",
    topic: "memoria",
    type: "text",
    points: 6,
    question:
      "Sistema con direcciones lógicas de 32 bits, páginas de 4KB. TP de un nivel, entradas de 2 bytes. TP: [0]=0x7F24, [1]=0xFF24, [2]=0xDF14. Para cada dirección lógica indica la dirección física o si la página no está presente: 0x0224 (escritura), 0x1224 (escritura), 0x2224 (escritura). Bit 15=presencia, bit 14=R/W, bit 12=modo usuario.",
    correctAnswer: `Offset = 12 bits (4KB). Nº página = dir >> 12.
0x0224 → página 0. Entrada 0 = 0x7F24 = 0111 1111 0010 0100. Bit 15=0 → página NO presente.
0x1224 → página 1. Entrada 1 = 0xFF24 = 1111 1111 0010 0100. Bit 15=1, bit 14=1 (R/W✓), bit 12=1 (usuario). Marco = 0x24. Física = (0x24 << 12) | 0x224 = 0x24224.
0x2224 → página 2. Entrada 2 = 0xDF14 = 1101 1111 0001 0100. Bit 15=1, bit 14=1, bit 12=1. Marco = 0x14. Física = 0x14224.`,
    explanation:
      "Cada entrada de TP es de 16 bits. El bit más significativo (bit 15) indica presencia. El bit 14 indica permisos de escritura. Los bits de marco están en la parte baja.",
  },
  // 2021-07 — E/S: AIO (lectura asíncrona)
  {
    id: "so_2021jul_q6_aio",
    exam: "2021-07",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question:
      "Fichero 'file.txt' contiene 'ABCDEFGHIJK\\n'. Código: struct aiocb cb; cb.aio_fildes=fd; cb.aio_buf=BUF; cb.aio_nbytes=4; cb.aio_offset=0; aio_read(&cb); while(aio_error(&cb)==EINPROGRESS); printf('%s--%lu', BUF, aio_return(&cb)). ¿Qué imprime?",
    correctAnswer: `Imprime: ABCD--4

Explicación:
1. aio_read inicia lectura asíncrona de 4 bytes desde offset 0. BUF recibe "ABCD".
2. while(aio_error==EINPROGRESS) espera activa hasta que termine la operación.
3. aio_return devuelve 4 (bytes efectivamente leídos).
4. printf imprime "ABCD--4".`,
    explanation:
      "AIO (Asynchronous I/O) permite iniciar una operación de E/S y continuar ejecutando. aio_error comprueba el estado. aio_return obtiene el resultado (nº de bytes leídos).",
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
      "Una llamada al sistema se puede implementar con una interrupción software que cambia el modo de ejecución":
        "C",
      "Al ejecutar printf, el proceso está ejecutando exclusivamente en modo sistema":
        "F",
      "El código binario de lseek() se encuentra en la librería estándar de C":
        "F",
      "Las librerías estáticas permiten compartir código entre procesos en tiempo de ejecución":
        "F",
      "La fragmentación externa no existe con asignación indexada de bloques":
        "C",
      "El bit UID y el sticky bit forman parte del campo 'modo' del inodo": "C",
    },
    explanation:
      "printf se ejecuta en modo usuario (formateo) y modo sistema (write). lseek es llamada al sistema, su código está en el kernel. Las librerías dinámicas (no estáticas) permiten compartir código.",
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
      "En modo usuario se puede ejecutar todo el repertorio de instrucciones del procesador":
        "F",
      "Al ejecutar perror(), el proceso está exclusivamente en modo usuario":
        "F",
      "El código binario de chmod() se encuentra en libC": "F",
      "Las librerías dinámicas se usan para tener ejecutables autocontenidos":
        "F",
      "Con asignación indexada de bloques puede existir fragmentación externa":
        "F",
      "El Buffer Cache permite reducir tanto lecturas como escrituras": "C",
    },
    explanation:
      "En modo usuario solo instrucciones no privilegiadas. Las librerías estáticas (no dinámicas) producen ejecutables autocontenidos. La asignación indexada elimina la fragmentación externa.",
  },
  // 2023-01 — P2: Código con chmod/link/symlink/open/lseek/fgetc
  {
    id: "so_2023_q2_code",
    exam: "2023-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    repeated: true,
    question:
      "Un proceso abre 2 veces '/home/user1/so/practicas/p1.c' (1GB+6MB+10KB, hard links=2). chmod 0654, link crea p1_hlink.c, symlink crea p1_slink → p1_hlink.c. fd1=open(p1.c,O_RDONLY) [1ª apertura], fd2=open(p1_hlink.c,O_RDWR). lseek(fd1,1000000,SEEK_SET), fgetc c1. lseek(fd2,8000,SEEK_SET), fgetc c2. close ambos, unlink p1_slink. Cachés vacías, usuario efectivo = propietario. Responde:\nA) Tamaño de p1_slink.\nB) Bloques leídos para c1.\nC) Bloques leídos para c2.\nD) Permisos de p1.c en rwxrwxrwx.\nE) Hard links de p1.c tras unlink.",
    correctAnswer: `A) 35 bytes (longitud de la ruta "/home/user1/so/practicas/p1_hlink.c")
B) 2 bloques (offset 1000000 está en zona de indirección simple: 1 bloque índice + 1 bloque datos)
C) 1 bloque (offset 8000 está en zona directa; el inodo ya está en caché por la 1ª apertura)
D) rw- r-x r-- (0654: owner=6=rw-, group=5=r-x, others=4=r--)
E) 3 (inicialmente 2, link crea p1_hlink.c → 3, unlink borra p1_slink [symlink] → no afecta a p1.c → sigue 3)`,
    explanation:
      "El symlink almacena la ruta como contenido → tamaño = longitud de la ruta. Tras la 1ª apertura, el inodo y primeros bloques están en caché. 0654 = rw-r-xr--. El unlink del symlink no afecta al contador de hard links del fichero original.",
  },
  // 2023-07
  {
    id: "so_2023jul_q4_tf",
    exam: "2023-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    repeated: true,
    question: "Indica si es cierto (C) o falso (F) sobre sistemas de ficheros:",
    correctAnswer: {
      "El S.O. mantiene el número de aperturas en el inodo en memoria, no en el inodo en disco":
        "C",
      "Al enlazar con librería dinámica, las funciones se integran en el fichero ejecutable":
        "F",
      "Al ejecutar printf se incrementa tanto el tiempo en modo usuario como en modo sistema":
        "C",
      "Es posible crear hard links entre diferentes sistemas de ficheros montados":
        "F",
      "El journaling es un registro histórico de creaciones y eliminaciones de ficheros":
        "F",
      "El Buffer Cache reduce tanto lecturas como escrituras físicas": "C",
    },
    explanation:
      "El contador de aperturas es información volátil en el in-core inode. Las librerías dinámicas no integran su código en el ejecutable. El journaling registra operaciones, no es un historial.",
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
      "El número de aperturas de un fichero se mantiene en el inodo en memoria, no en el inodo en disco":
        "C",
      "Al ejecutar sin(x) de la librería matemática, el proceso está exclusivamente en modo usuario":
        "C",
      "La librería estándar de C (libC) incluye el código binario de unlink()":
        "F",
      "Las librerías dinámicas facilitan la actualización de componentes del SO":
        "C",
      "Un sistema de ficheros con journaling disminuye la fragmentación externa":
        "F",
      "La asociación entre uid y nombre de usuario está en /etc/passwd (getpwuid)":
        "C",
    },
    explanation:
      "sin() es una función puramente matemática que no requiere llamadas al sistema. unlink() es una llamada al sistema, su código está en el kernel. El journaling no afecta a la fragmentación.",
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
    question:
      "Se crea soft link (ln -s practica.c slink) y posteriormente hard link al soft link (ln slink hard_slink). a) Indicar el tamaño (bytes) del fichero hard_slink. b) Número de hard links de hard_slink. c) Al borrar practica.c, ¿se puede acceder al contenido a través de slink? d) ¿Y a través de hard_slink?",
    correctAnswer: `a) 10 bytes (hard_slink es hard link a slink, que es symlink → su tamaño es la longitud de la ruta "practica.c")
b) 2 (slink tenía 1 hard link, al crear hard_slink ahora tiene 2)
c) No (slink apunta a "practica.c" que ya no existe → symlink roto)
d) No (hard_slink es hard link a slink, no a practica.c → sigue la misma ruta simbólica rota)`,
    explanation:
      "Un hard link a un symlink no 'hereda' el destino del symlink, solo comparte su inodo. Al borrar el destino, el symlink se rompe independientemente de cómo se acceda a él.",
  },
  // 2022-01
  {
    id: "so_2022_q2_superbloque",
    exam: "2022-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 4,
    question:
      "En sistema UNIX con bloque 2KB, boot ocupa 3 bloques. Superbloque empieza en bloque 3. Fichero 'datos' con inodo 325 ocupa bloque 30. Tamaño inodo: 128 bytes. Calcular tamaño del superbloque en KB.",
    correctAnswer: `Inodos por bloque = 2048/128 = 16 inodos/bloque.
Inodo 325 → bloque = 325/16 = 20 (empezando desde 0 en área de inodos).
El área de inodos empieza tras el superbloque (bloque 3).
Si el inodo 325 está en el bloque 20 del área de inodos:
Bloque lógico = 3 + tamaño_superbloque + 20 = 30
Tamaño superbloque = 30 - 3 - 20 = 7 bloques = 14 KB`,
    explanation:
      "El superbloque contiene el mapa de bits de inodos/bloques libres y metadatos del sistema de ficheros.",
  },
  // 2022-01 — P3: código link/symlink/unlink
  {
    id: "so_2022_q3_code",
    exam: "2022-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    repeated: true,
    question:
      "Código sobre '/home/user1/so/practicas/p1.c' (32GB, hard links=1): chmod 0752, link crea p1_hlink.c, symlink crea p1_slink a p1.c, open p1.c O_RDONLY (1ª apertura), open p1_hlink.c O_RDWR, lseek(fd2, 1000000, SEEK_SET), fgetc, close, unlink p1_slink. Cachés vacías, entrada user1 en 3er bloque de home. A) fd2, B) accesos disco 1ª apertura, C) bloques para fgetc, D) permisos rwxrwxrwx, E) hard links tras unlink.",
    correctAnswer: `A) 4 (fd1=3, fd2=4)
B) 7 accesos (raíz, home, 3 bloques de home para user1, so, practicas, p1.c)
C) 2 bloques (1000000 < 2KB×1024=2MB → zona directa ya cargada en apertura: 1 índice + 1 datos)
D) rwx r-x -w- (0752: owner=7=rwx, group=5=r-x, others=2=-w-)
E) 2 (inicialmente 1, link crea p1_hlink.c → 2, unlink(p1_slink) borra el symlink → no afecta hard links de p1.c)`,
    explanation:
      "chmod 0752 establece permisos en octal. El unlink sobre un symlink borra el enlace simbólico, no el fichero destino. Los hard links solo se crean con link(), no con symlink().",
  },
  // 2024-01
  {
    id: "so_2024_q3_code",
    exam: "2024-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    question:
      "Un proceso abre '/home/juan/practicas/p1.c' (inodo 5002, 2 hard links, 32GB). Se crea hard link practica1.c, luego symlink p1_slink → practica1.c. chmod 0640, dup, lseek 2.000.000, fgetc. Después close y dos unlink. a) Valor de fd2 (dup de fd1). b) Bloques leídos para fgetc(fd2). c) Permisos del inodo 5002 tras chmod. d) Hard links de p1_slink. e) Hard links del inodo 5002 tras ambos unlink.",
    correctAnswer: `a) 4 (fd1=3, dup(fd1)=4)
b) 2 bloques (bloque índice + bloque datos, el offset 2.000.000 está en zona de indirección simple)
c) rw- r-- --- (0640 = rw-r-----)
d) 1 (p1_slink es un symlink nuevo, tiene su propio inodo con 1 hard link)
e) 1 (inicialmente 2, link crea practica1.c → 3, unlink practica1.c → 2, unlink p1.c → 1)`,
    explanation:
      "Cada symlink es un fichero independiente con su propio inodo. Los hard links comparten inodo. Cada unlink decrementa el contador de hard links del inodo.",
  },
  // 2023-07 código
  {
    id: "so_2023jul_q3_code",
    exam: "2023-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    question:
      "Código: open p1.c (3MB, hard links=2), link crea practica1.c (hard link), symlink crea slink_practica1.c. chmod 0752. a) Accesos a disco en 1ª apertura (cachés vacías, entrada p1.c en 2º bloque de su directorio). b) Bloques leídos para fgetc(fd2) con lseek 524288. c) Valor de fd3=dup(fd2). d) Bloques de datos liberados al hacer unlink de p1.c. e) Hard links de slink_practica1.c tras unlink.",
    correctAnswer: `a) 5 accesos (bloques de directorios: raíz, home, juan, so(2ºbloque), p1.c)
b) 2 bloques (524288 = 512KB, está en bloque 256 → indirección simple: índice + datos)
c) 5 (fd1=3, fd2=4, fd3=dup(fd2)=5)
d) 0 bloques (unlink borra p1.c pero contador de hard links pasa de 3 a 2 → no llega a 0)
e) 1 (slink_practica1.c es symlink independiente, siempre tiene 1 hard link)`,
    explanation:
      "Los bloques solo se liberan cuando el contador de hard links llega a 0. El symlink es un fichero aparte con su propio inodo y contador.",
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
    repeated: true,
    question: "Responde Verdadero (V) o Falso (F) sobre gestión de memoria:",
    correctAnswer: {
      "En la pila del proceso están las variables locales y parámetros de funciones":
        "V",
      "Las variables automáticas definidas en main() no están en la pila del proceso":
        "F",
      "Para un proceso con varios hilos, cada hilo tiene su propio espacio de direcciones":
        "F",
      "Con tabla de páginas en un nivel (sin caché/TLB), una instrucción simple implica dos accesos a memoria":
        "V",
      "Con tabla de páginas de dos niveles (sin caché/TLB), una instrucción simple implica exactamente dos accesos":
        "F",
      "Con TLB y caché, ejecutar una instrucción puede implicar ningún acceso a memoria":
        "V",
      "Con páginas más grandes, el tamaño de la tabla de páginas de un nivel se reduce":
        "V",
      "Una tabla de páginas multinivel típicamente reduce la memoria necesaria vs un nivel":
        "V",
      "Con Tablas de Páginas Invertidas, las páginas virtuales pueden ser más grandes que las físicas":
        "F",
      "Cuando el dirty bit está a 0, existe copia exacta de la página en almacenamiento":
        "V",
    },
    explanation:
      "Los hilos comparten espacio de direcciones pero tienen pilas independientes. La TLB y caché pueden evitar accesos a RAM. Las TP multinivel ahorran memoria al crear solo tablas necesarias.",
  },
  // 2021-07
  {
    id: "so_2021jul_q1_mem",
    exam: "2021-07",
    topic: "memoria",
    type: "matching",
    points: 10,
    repeated: true,
    question: "Responde V/F sobre gestión de memoria:",
    correctAnswer: {
      "En la pila del proceso está el código de las funciones que se llaman":
        "F",
      "Las variables locales de main() están en el segmento de datos": "F",
      "Para un proceso con varios hilos, los hilos comparten código y datos":
        "V",
      "El código de malloc está en el espacio de direcciones del kernel": "F",
      "Con tabla de páginas de 3 niveles (sin caché/TLB), ejecutar una instrucción implica 4 accesos a memoria":
        "V",
      "Con TLB y caché, ejecutar una instrucción puede implicar 0 accesos a memoria":
        "V",
      "En segmentación pura sin paginación, es imposible implementar memoria virtual":
        "F",
      "Con direcciones físicas de 32 bits y páginas de 4KB, la página virtual puede ser de 33 bits":
        "V",
      "Con Tabla de Páginas Invertida hay una tabla de páginas por proceso":
        "F",
      "Con N páginas virtuales y N marcos, LRU produce los mismos fallos que con N+1 marcos":
        "V",
    },
    explanation:
      "En la pila están los marcos de activación (datos), no el código. Las variables locales de main() están en la pila. La TP invertida es global, una entrada por marco físico.",
  },

  // ============================================================
  // GESTIÓN DE MEMORIA — Cálculos de tablas de páginas
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q5_tp",
    exam: "2020-01",
    topic: "memoria",
    type: "text",
    points: 5,
    question:
      "Sistema con direccionamiento de memoria física de 8GB, tamaño de página de 8KB y entrada de TP de 4 bytes. ¿Cuántos niveles de TP son necesarios para direcciones virtuales de 46 bits si cada TP es de tamaño una página? ¿Cuántos bits de control/no usados hay en una entrada? Con TLB y caché de datos e instrucciones, ¿cuál sería el número mínimo y máximo de accesos a memoria para una lectura de un byte?",
    correctAnswer: `Página = 8KB = 2¹³ bytes. Entradas por TP = 2¹³/4 = 2¹¹ = 2048 entradas.
1 nivel: 2¹¹ × 2¹³ = 2²⁴ bytes (16MB)
2 niveles: 2¹¹ × 2¹¹ × 2¹³ = 2³⁵ bytes (32GB)
3 niveles: 2¹¹ × 2¹¹ × 2¹¹ × 2¹³ = 2⁴⁶ bytes ✓

→ 3 niveles.

Memoria física 8GB = 2³³ bytes. Páginas 2¹³ → 2²⁰ páginas físicas → 20 bits.
Entrada TP = 32 bits → bits control/no usados = 32 − 20 = 12 bits.

Con TLB y caché:
Mínimo: 0 accesos a memoria (mapping en TLB + dato en caché).
Máximo: 4 accesos a memoria (3 niveles TP + acceso al dato, sin aciertos de TLB ni caché).`,
    explanation:
      "Con 3 niveles de 11 bits + 13 bits offset = 46 bits. Los 12 bits restantes se usan para válido, R/W, referencia, dirty, etc. Con TLB+caché, el mejor caso evita todo acceso a RAM; el peor caso requiere recorrer los 3 niveles de TP más el acceso al dato = 4 accesos.",
  },
  // 2021-01
  {
    id: "so_2021_q6_tp",
    exam: "2021-01",
    topic: "memoria",
    type: "text",
    points: 5,
    question:
      "Arquitectura con direcciones virtuales de 64 bits, físicas de 52 bits, páginas de 256KB (2¹⁸ bytes), TP en 2 niveles con igual número de bits por nivel y entradas de 8 bytes. ¿Bits no usados en dirección virtual? ¿Bits para seleccionar entrada de TP raíz?",
    correctAnswer: `Página = 256KB = 2¹⁸ bytes.
Entradas por TP = 2¹⁸/8 = 2¹⁵ → 15 bits/nivel.
Formato: [no usados] [15 bits] [15 bits] [18 bits offset]
Total usado = 15 + 15 + 18 = 48 bits.
Bits no usados = 64 − 48 = 16 bits.
Bits para tabla raíz = 15 bits.`,
    explanation:
      "64 bits de dirección virtual son más que suficientes. Solo se usan 48 bits. La TP raíz se indexa con los 15 bits superiores.",
  },
  // 2023-01 — Memoria Q3: Paginación en 2 niveles
  {
    id: "so_2023_q3_tp",
    exam: "2023-01",
    topic: "memoria",
    type: "text",
    points: 7.5,
    question:
      "Sistema de paginación en dos niveles. Páginas de 4KB. Nivel 0: página raíz. Nivel 1: páginas necesarias para espacio virtual de 32 bits. Cada página de TP tiene 1024 entradas, 1 byte reservado por entrada.\n\na) Formato de direcciones virtuales.\nb) Tamaño del espacio virtual.\nc) Tamaño máximo del espacio físico.\nd) Espacio ocupado por la TP de un proceso que usa todo su espacio virtual.\ne) Linux requiere áreas separadas de código, datos y pila. ¿Cómo se implementa? (opciones 1-4).",
    correctAnswer: `a) [10 bits nivel 0] [10 bits nivel 1] [12 bits offset]
b) 2³² bytes = 4 GB
c) 4KB / 1024 entradas = 4 bytes por entrada. 1 byte reservado → 3 bytes para nº de frame = 24 bits. 2²⁴ frames × 2¹² bytes = 2³⁶ bytes = 64 GB
d) 1 página nivel 0 (4KB) + 2¹⁰ páginas nivel 1 (4KB c/u) = 4KB + 4MB = 4 MB + 4 KB
e) Opción 4: Linux se implementa sobre esta arquitectura pero no usando solo los registros del procesador. Linux usa paginación en 4 niveles en x86-64, adaptando la arquitectura de 2 niveles mediante software adicional.`,
    explanation:
      "Con 1024 entradas por TP, se necesitan 10 bits por nivel. 12 bits offset para páginas de 4KB. 3 bytes para frame → 24 bits → 64GB máx. La TP completa ocupa 1 página raíz + 1024 páginas de nivel 1. Linux no puede usar solo registros base/límite; se adapta con niveles adicionales por software.",
  },
  // 2023-07
  {
    id: "so_2023jul_q2_tp",
    exam: "2023-07",
    topic: "memoria",
    type: "text",
    points: 6,
    question:
      "Sistema de paginación con direcciones lógicas de 16 bits y páginas de 4KB. a) Traduce direcciones lógicas 11034 (P1) y 12345 (P2) a direcciones físicas usando sus tablas de páginas. b) Sin memoria virtual, ¿podrían ejecutarse copias de P1 y P2 simultáneamente? c) ¿Podría ejecutarse un P3 que necesite 20 páginas lógicas? d) Construye una tabla de páginas invertida para P1 y P2.",
    correctAnswer: `a) P1: 11034/4096 = 2, offset = 2842. TP P1: pág 2 → frame 1 → física = 1×4096+2842 = 6938.
   P2: 12345/4096 = 3, offset = 57. TP P2: pág 3 → frame 4 → física = 4×4096+57 = 16441.

b) Sí, si hay suficiente memoria física para alojar todos los frames.

c) No. 16 bits − 12 offset = 4 bits para nº página → máximo 16 páginas lógicas.

d) TP invertida: cada frame físico una entrada (PID, pág_lógica).`,
    explanation:
      "Con 16 bits totales y páginas de 4KB (offset 12 bits), solo quedan 4 bits para direccionar páginas → máximo 16 páginas por proceso.",
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
    question:
      "Un proceso tiene la cadena de referencias: E D H B D E D A E B E D E B G y 3 marcos. Las 3 primeras referencias producen 3 fallos. ¿Número total de fallos con LRU?",
    correctAnswer: `Simulación LRU con 3 marcos:
E→fallo[E,-,-], D→fallo[E,D,-], H→fallo[E,D,H], B→fallo sale E[B,D,H],
D→ok, E→fallo sale H[B,D,E], D→ok, A→fallo sale B[A,D,E],
E→ok, B→fallo sale D[A,B,E], E→ok, D→fallo sale A[D,B,E],
E→ok, B→ok, G→fallo sale D[G,B,E]

Total: 9 fallos de página.`,
    explanation:
      "LRU reemplaza la página que lleva más tiempo sin usarse. Los primeros 3 fallos son obligatorios (cold start). Los otros 6 son por capacidad insuficiente.",
  },
  // 2022-01 — Memoria Q1: 10 V/F
  {
    id: "so_2022_q3_mem_vf",
    exam: "2022-01",
    topic: "memoria",
    type: "matching",
    points: 10,
    question: "Responde V/F sobre gestión de memoria:",
    correctAnswer: {
      "En sistemas sin paginación con intercambio a disco no podía haber relocalización de direcciones ni estática ni dinámica":
        "F",
      "El código está en direcciones bajas del espacio virtual para que el acceso a instrucciones sea más rápido":
        "F",
      "Un fallo de página pone al proceso en estado bloqueado intercambiado a disco":
        "F",
      "FIFO y FIFO segunda oportunidad tienen el mismo coste de implementación":
        "F",
      "execve() copia las tablas de páginas del padre en el proceso creado":
        "F",
      "fork() en Linux copia las áreas de memoria vm_areas del padre al hijo":
        "V",
      "free() puede tomar como argumento una variable estática": "V",
      "Con N marcos, N−1 páginas virtuales y reemplazo aleatorio: N−1 o menos fallos":
        "V",
      "Con N marcos, N−1 páginas virtuales y reemplazo FIFO: N−1 o menos fallos":
        "V",
      "Dir virtuales 48 bits, TP 1 nivel, 4 bytes/entrada, páginas 8KB: la TP ocupa 2^24 bytes":
        "F",
    },
    explanation:
      "1) Sí podía haber relocalización estática. 2) La posición del código no afecta a la velocidad. 3) El fallo de página pone al proceso en bloqueado (esperando E/S), no intercambiado. 4) FIFO 2ªO necesita bit de referencia extra. 5) execve() reemplaza el espacio de direcciones, no copia. 6) fork() copia vm_areas (metadatos), las páginas se comparten COW. 7) free() acepta cualquier puntero válido del heap. 8-9) Con N marcos y N−1 páginas, en el peor caso caben todas menos 1 → N−1 fallos. 10) TP = (2^48/2^13)×4 = 2^35×4 = 2^37 bytes (128GB), no 2^24.",
  },
  // 2022-01
  {
    id: "so_2022_q2_lru",
    exam: "2022-01",
    topic: "memoria",
    type: "text",
    points: 5,
    question:
      "Cadena de referencias: 2 4 6 1 3 2 4 6 1 3 con 4 marcos. ¿Número de fallos con LRU? ¿Y con FIFO Segunda Oportunidad?",
    correctAnswer: `LRU con 4 marcos:
2→F, 4→F, 6→F, 1→F [2,4,6,1]
3→F sale 2 [3,4,6,1? No. LRU: el más antiguo es 2, sale 2] → [4,6,1,3]
2→F sale 4 [6,1,3,2], 4→F sale 6 [1,3,2,4], 6→F sale 1 [3,2,4,6],
1→F sale 3 [2,4,6,1], 3→F sale 2 [4,6,1,3]
Total: 10 fallos.

FIFO 2ª Oportunidad: igual resultado, 10 fallos.
(El patrón es cíclico con distancia = 4, igual al número de marcos → siempre se desaloja la página que se va a necesitar)`,
    explanation:
      "Con distancia entre reapariciones igual al número de marcos, cualquier algoritmo de reemplazo produce fallos en cada referencia tras el llenado inicial.",
  },
  // 2024-01
  {
    id: "so_2024_q2_fifo",
    exam: "2024-01",
    topic: "memoria",
    type: "text",
    points: 5,
    question:
      "Un proceso tiene la cadena de referencias a páginas: 2 4 5 1 3 5 6 2 5 3, y tiene asignados cuatro marcos de memoria. Las cuatro primeras referencias (2,4,5,1) producen necesariamente 4 fallos de página porque ninguna página del proceso estaba en memoria. ¿Cuál es el número total de fallos de páginas que se producen con el algoritmo de reemplazo FIFO Segunda Oportunidad en las 10 primeras referencias?",
    correctAnswer: `FIFO 2ª Oportunidad con 4 marcos:
1. 2 → F [2, -, -, -]
2. 4 → F [2, 4, -, -]
3. 5 → F [2, 4, 5, -]
4. 1 → F [2, 4, 5, 1] (4 fallos obligatorios)
5. 3 → F, el más antiguo es 2 (R=0) → se reemplaza [4, 5, 1, 3] (5º fallo)
6. 5 → Hit, se pone su bit R = 1 [4, 5*, 1, 3]
7. 6 → F, el más antiguo es 4 (R=0) → se reemplaza [5*, 1, 3, 6] (6º fallo)
8. 2 → F, el más antiguo es 5, pero tiene R=1 → segunda oportunidad: se pone R=0 y se mueve al final de la cola [1, 3, 6, 5]. El siguiente más antiguo es 1 (R=0) → se reemplaza [3, 6, 5, 2] (7º fallo)
9. 5 → Hit, se pone R = 1 [3, 6, 5*, 2]
10. 3 → Hit, se pone R = 1 [3*, 6, 5*, 2]

Total: 7 fallos de página.`,
    explanation:
      "FIFO Segunda Oportunidad (o algoritmo del reloj) da una segunda vida a páginas referenciadas (R=1) antes de reemplazarlas, bajando su bit R a 0 y enviándolas al final de la cola. En esta cadena se logran evitar fallos en las últimas referencias gracias a esto.",
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
      "Las variables de entorno son iguales para todos los procesos del sistema":
        "F",
      "Cada proceso tiene su copia de los datos del kernel": "F",
      "La transición de ejecución a espera es SIEMPRE desde modo kernel": "V",
      "El estado de apropiado (preempted) es el mismo que el de listo para ejecución":
        "V",
      "Al comenzar un programa, las variables de entorno están en la pila de usuario":
        "V",
      "execvp() crea un nuevo proceso": "F",
      "waitpid(pi2,NULL,0) desasigna la estructura proc del proceso pi2 cuando termina":
        "V",
    },
    explanation:
      "Las credenciales real y efectiva pueden diferir (setuid). execvp() NO crea proceso, solo reemplaza la imagen del actual. Hace falta fork() antes.",
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
      "Un proceso que no es root SIEMPRE comienza su ejecución en modo kernel":
        "V",
      "En UNIX con 15 procesos de 6 usuarios ejecutando el mismo programa, hay 6 copias del código en memoria":
        "F",
      "Cuando se crea un proceso con fork, su PID es 0": "F",
      "La estructura de procesos en UNIX es un grafo": "F",
      "La tabla de procesos está almacenada en la zona de datos del kernel":
        "V",
      "El código de la ISR de teclado es parte de los datos del kernel": "F",
      "execvp devuelve 0 si tiene éxito y -1 si hay error": "F",
      "Después de exec sobre un fichero setuid, el PID del proceso es el mismo":
        "V",
    },
    explanation:
      "Todo proceso arranca en modo kernel (el kernel prepara el entorno usuario). El código se comparte: 1 copia. fork() devuelve 0 al hijo como valor de retorno, pero su PID real > 0. La estructura es un árbol. exec NUNCA retorna en caso de éxito.",
  },
  // 2022-07
  {
    id: "so_2022jul_q3_proc",
    exam: "2022-07",
    topic: "procesos",
    type: "matching",
    points: 8,
    repeated: true,
    question: "Responde V/F sobre procesos:",
    correctAnswer: {
      "Los algoritmos apropiativos desperdician más tiempo en cambios de contexto":
        "V",
      "Un programa ejecutado por root pasa más tiempo en modo kernel que si lo ejecuta un usuario normal":
        "F",
      "En un sistema donde solo hay un proceso listo, bajarle la prioridad hace que tarde más":
        "F",
      "Un usuario normal puede ejecutar un fichero setuid root con permisos rwsr-sr-x":
        "V",
      "Los algoritmos con prioridades no apropiativas no tienen inanición": "F",
      "Un bucle de llamadas exec puede llenar la tabla de procesos": "F",
    },
    explanation:
      "El tiempo en modo kernel depende de las llamadas al sistema, no de quién ejecuta. Si solo hay un proceso, la prioridad no afecta. exec no crea procesos, no llena la tabla.",
  },
  // 2023-07
  {
    id: "so_2023jul_q1_proc",
    exam: "2023-07",
    topic: "procesos",
    type: "matching",
    points: 10,
    repeated: true,
    question: "Responde V/F sobre procesos e hilos:",
    correctAnswer: {
      "Un SO multiproceso solo puede correr en CPUs con instrucción 'crear proceso'":
        "F",
      "El número de usuarios que puede soportar un SO multiusuario está limitado por el microprocesador":
        "F",
      "El administrador (root) puede decidir que un proceso se ejecute siempre en modo kernel":
        "F",
      "Un proceso zombie ocupa una entrada en la tabla de procesos": "V",
      "La credencial efectiva de un proceso puede cambiar al hacer exec": "V",
      "Después de fork() las credenciales reales y efectivas de padre e hijo son iguales":
        "V",
      "Un proceso con mínima prioridad puede usar el 100% de CPU si no hay más procesos listos":
        "V",
      "Un algoritmo no apropiativo es más eficiente en tiempo de CPU para usuario que uno apropiativo":
        "V",
      "Existe la instrucción hardware 'cambiar prioridad' en los microprocesadores actuales":
        "F",
      "Todos los procesos creados con fork() tienen el mismo conjunto de variables de entorno":
        "F",
    },
    explanation:
      "La creación de procesos es software (llamadas al sistema). El límite de usuarios viene de recursos (memoria, tabla procesos), no del CPU. El modo kernel/user depende del código ejecutado. exec con setuid cambia el EUID.",
  },

  // 2023-07 — Procesos Q2: waitpid bug en shell
  {
    id: "so_2023jul_q3_waitpid",
    exam: "2023-07",
    topic: "procesos",
    type: "text",
    points: 5,
    question:
      "Un shell mantiene una lista de procesos en segundo plano. La función actualizarProceso usa: if (waitpid(p->pid, &est, WNOHANG|WUNTRACED|WCONTINUED) != -1) { ... } para detectar cambios de estado. Explica por qué esta comprobación es incorrecta y cuál sería la correcta.",
    correctAnswer: `Es incorrecta porque waitpid puede devolver tres tipos de valores:
- −1: error (ej. el proceso cuyo pid se le pasa no existe).
- El PID del hijo cuyo estado ha cambiado.
- 0: se ha llamado con WNOHANG y no tiene nada que informar (no modifica el entero est).

Al comparar con != −1, cuando waitpid retorna 0 (sin cambios) se entra en el if y se lee información no válida de la variable est (no modificada por waitpid), interpretando incorrectamente el estado del proceso.

La comprobación correcta es:
if (waitpid(p->pid, &est, WNOHANG|WUNTRACED|WCONTINUED) == p->pid) { ... }`,
    explanation:
      "waitpid con WNOHANG retorna 0 cuando ningún hijo ha cambiado de estado, sin modificar wstatus. Comparar != −1 trata erróneamente ese 0 como un cambio de estado y accede a est sin haber sido actualizada.",
  },

  // 2023-07 — Procesos Q3: credenciales y permisos
  {
    id: "so_2023jul_q4_credenciales",
    exam: "2023-07",
    topic: "procesos",
    type: "text",
    points: 5,
    repeated: true,
    question:
      'a.out y f1.txt son del usuario u1. a.out es ejecutado por u2 desde el mismo directorio. Código:\ndf1 = open("./f1.txt", O_RDWR);\ndf2 = open("./f1.txt", O_RDONLY);\nCompleta la tabla indicando ruid, euid y si df1 o df2 son −1 para cada combinación de permisos:\n\n| a.out | f1.txt | ruid | euid | df1=−1? | df2=−1? |\n| rwxrwxrwx | rwxrwxrwx | | | | |\n| rwxr-xr-x | rwxr-xr-x | | | | |\n| rwxr-xr-x | rwxr--r-- | | | | |\n| rwxr-xr-x | rwsr-xr-x | | | | |\n| rwxr-xr-x | rwsr--r-- | | | | |\n| rwxr-xr-x | rws--- | | | | |\n| rwsr-xr-x | rwxr-xr-x | | | | |\n| rwsr-xr-x | rwxr--r-- | | | | |\n| rwsr-xr-x | rwsr-xr-x | | | | |\n| rwsr-xr-x | rwsr--r-- | | | | |\n| rwsr-xr-x | rws--- | | | | |',
    correctAnswer: `| a.out | f1.txt | ruid | euid | df1=−1? | df2=−1? |
| rwxrwxrwx | rwxrwxrwx | u2 | u2 | no | no |
| rwxr-xr-x | rwxr-xr-x | u2 | u2 | sí | no |
| rwxr-xr-x | rwxr--r-- | u2 | u2 | sí | no |
| rwxr-xr-x | rwsr-xr-x | u2 | u2 | sí | no |
| rwxr-xr-x | rwsr--r-- | u2 | u2 | sí | no |
| rwxr-xr-x | rws--- | u2 | u2 | sí | sí |
| rwsr-xr-x | rwxr-xr-x | u2 | u1 | no | no |
| rwsr-xr-x | rwxr--r-- | u2 | u1 | no | no |
| rwsr-xr-x | rwsr-xr-x | u2 | u1 | no | no |
| rwsr-xr-x | rwsr--r-- | u2 | u1 | no | no |
| rwsr-xr-x | rws--- | u2 | u1 | no | no |

Regla: ruid siempre = u2 (quien ejecuta). Si a.out tiene setuid (rws), euid = u1 (propietario de a.out); si no, euid = u2. Los permisos de f1.txt se comprueban con la credencial efectiva: si euid = u1 se miran los permisos de propietario; si euid = u2 se miran los de otros. O_RDWR necesita lectura+escritura, O_RDONLY solo lectura.`,
    explanation:
      "El bit setuid en el ejecutable cambia la euid al propietario (u1), lo que da acceso según permisos de propietario de f1.txt. Sin setuid, euid = u2 y se aplican los permisos de 'otros', que carecen de escritura en todos los casos menos el primero (777). La última fila (rws---) también falla df2 con euid=u2 porque 'otros' no tiene ningún permiso de lectura.",
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
    question:
      'El siguiente código crea procesos con fork() en un bucle de 32 iteraciones. ¿Qué imprime?\nfor (i=0; i<32; i++) {\n  pid=fork();\n  if (pid==-1) break;\n  printf("/%ld/",(long) pid);\n}',
    options: [
      "Imprime /0/ 32 veces",
      "Imprime /0/ y /un número positivo/ 32 veces en total",
      "Imprime /0/ y /un número positivo/ 2³² veces en total",
      "Imprime /0/ y /un número positivo/ un número finito de veces, menor que 2³²",
      "No imprime nada",
    ],
    correctAnswer: "d",
    explanation:
      "En cada iteración se duplican los procesos. En total se imprimiría 2³²−1 veces cada mensaje, pero el S.O. no puede tener 2³² procesos — la tabla de procesos se llena y fork() empieza a devolver -1, limitando el número real.",
  },
  // 2021-07
  {
    id: "so_2021jul_q2_exec",
    exam: "2021-07",
    topic: "procesos",
    type: "mc",
    points: 5,
    question:
      "Código C con bucle for que llama execv('./a.out', NULL, NULL) 10 veces y luego printf y sleep. ¿Qué salida produce?",
    options: [
      "Imprime el mensaje 10 veces y luego duerme 60 segundos",
      "Imprime el mensaje una vez y termina",
      "No produce ninguna salida",
      "Imprime infinitamente",
      "Depende de cuántos procesos se creen",
    ],
    correctAnswer: "c",
    explanation:
      "En la primera iteración, execv reemplaza el proceso actual por a.out (el mismo programa). La ejecución vuelve a main() desde el principio. Es un bucle infinito: nunca se alcanza el printf ni el sleep.",
  },
  // 2022-01 — Procesos Q2: fork counting
  {
    id: "so_2022_q2_fork",
    exam: "2022-01",
    topic: "procesos",
    type: "text",
    points: 6,
    question:
      'Código C: #define VECES 2. for(i=0; i<VECES; i++) { pid=fork(); if(pid==-1) break; if(pid==0) fork(); printf("/%ld/*\\n",(long)pid); }. ¿Cuántas líneas de salida produce? ¿Cuántas son "/0/*"?',
    correctAnswer: `Total: 12 líneas, de las cuales 8 son "/0/*".

Explicación:
Iteración i=0: fork() crea hijo1 (pid=0 en hijo, >0 en padre). En el hijo1, pid==0 → fork() crea hijo2 (pid=0 en hijo2). 3 procesos llegan a printf, 2 escriben "/0/*".
Iteración i=1: los 3 procesos ejecutan esta iteración. Cada uno hace fork() → 3×2=6 procesos. En cada fork(), solo el hijo tiene pid==0 → ejecuta otro fork(). Total: 3 padres × 1 hijo directo = 3 + 3 hijos × 1 hijo extra = 3 = 9 procesos nuevos en i=1. Total procesos en printf en i=1: 9. De ellos, 6 escriben "/0/*".
Total líneas: 3 + 9 = 12. Total "/0/*": 2 + 6 = 8.`,
    explanation:
      "En la 1ª iteración, el fork() padre crea un hijo (pid=0). Solo el hijo ejecuta el segundo fork() (if pid==0). En la 2ª iteración, los 3 procesos resultantes repiten el patrón, generando 9 procesos más.",
  },
  // 2022-01
  {
    id: "so_2022_q3_sched",
    exam: "2022-01",
    topic: "procesos",
    type: "text",
    points: 6,
    question:
      "Linux con 3 procesos tiempo real: A (prio 70, SCHED_RR, CPU 500, I/O 800, CPU 300), B (prio 60, SCHED_RR, CPU 200, I/O 900, CPU 100), C (prio 70, SCHED_FIFO, CPU 300, I/O 400, CPU 100). Calcular tiempos de retorno y espera.",
    correctAnswer: `Prioridad 70 > 60. Entre igual prioridad, SCHED_RR antes que FIFO si ambos listos.
Llegan simultáneamente A y C (prio 70). A (RR) ejecuta 100ms, C (FIFO) ejecuta 300ms.
A ejecuta 400ms más → total 500ms CPU → A a I/O 800ms.
C a I/O 400ms.
B (prio 60) ejecuta 200ms → B a I/O 900ms.
C vuelve (t≈700), ejecuta 100ms → C termina t=900.
A vuelve (t=1300), ejecuta 300ms → A termina t=1600.
B vuelve (t=1100), ejecuta 100ms → B termina t=1700.
Retorno: A=1600, B=1700, C=900.`,
    explanation:
      "SCHED_RR tiene quantum. SCHED_FIFO ejecuta hasta bloquearse. La prioridad manda: los de prio 70 siempre expropian a los de prio 60.",
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
    question:
      "Disco duro con 2000 cilindros (0-1999). Cabeza en cilindro 605 (acaba de atender 605, antes 602). Cola: [400, 300, 1550, 900, 201, 495]. Indica el orden de atención para SSTF, SCAN y C-LOOK.",
    correctAnswer: `SSTF (más cercano primero): 605 → 495 → 400 → 300 → 201 → 900 → 1550

SCAN (subiendo, atiende en ambos sentidos):
Subiendo: 900 → 1550. Bajando: 495 → 400 → 300 → 201.
Orden: 900, 1550, 495, 400, 300, 201

C-LOOK (solo atiende en subida, salta al mínimo):
Subiendo: 900 → 1550, salta a 201 y sigue: 300 → 400 → 495.
Orden: 900, 1550, 201, 300, 400, 495`,
    explanation:
      "SSTF minimiza seek time con greedy. SCAN barre ambos sentidos. C-LOOK atiende en un sentido y salta al otro extremo sin atender en el camino de vuelta.",
  },
  // 2021-01
  {
    id: "so_2021_q10_disk",
    exam: "2021-01",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "Cola: [25, 100, 360, 77, 125, 222]. Atendidos [100] (primero) y [77]. ¿Siguiente cilindro con SSTF, C-SCAN y SCAN?",
    correctAnswer: `Atendidos 100 → 77. El ascensor está en 77 bajando.

SSTF: más cercano a 77 es 125 (distancia 48). → Siguiente: 125
SCAN: bajando desde 77, siguiente hacia abajo: 25. → Siguiente: 25
C-SCAN: solo atiende bajando. Bajando: 25. → Siguiente: 25`,
    explanation:
      "Tras atender 100 y 77, el ascensor está en 77 bajando. SSTF elige el más cercano (125). SCAN continúa bajando (25). C-SCAN atiende solo en sentido descendente.",
  },
  // 2021-07
  {
    id: "so_2021jul_q3_disk",
    exam: "2021-07",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question:
      "Cola: [25, 100, 360, 77, 124, 122]. Atendidos [100] y [77] en ese orden. ¿Puede ser SSTF el algoritmo usado?",
    correctAnswer: `No puede ser SSTF.
Desde 100, distancias: |100-25|=75, |100-77|=23, |100-122|=22, |100-124|=24, |100-360|=260.
La más cercana a 100 es 122 (dist 22), no 77 (dist 23).
Si se atendió 77 en segundo lugar, el algoritmo NO puede ser SSTF.`,
    explanation:
      "SSTF siempre atiende la petición más cercana a la posición actual. Si 122 está más cerca que 77 desde 100, SSTF habría atendido 122 primero.",
  },
  // 2023-01
  {
    id: "so_2023_q5_disk",
    exam: "2023-01",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "Cola: [185, 190, 33, 400, 250, 200]. Atendidos [200] y [190] en ese orden. Orden de las restantes con SSTF, C-LOOK y SCAN.",
    correctAnswer: `Atendidos 200 → 190. Ascensor está en 190 bajando.

SSTF: más cercano a 190 es 185 → 250 → 400 → 33.
Orden: 185, 250, 400, 33

SCAN (bajando, luego sube): 185 → 33 (bajando), luego sube: 250 → 400.
Orden: 185, 33, 250, 400

C-LOOK (solo baja, salta al máximo): 185 → 33 (bajando), salta a 400, sigue: 250.
Orden: 185, 33, 400, 250`,
    explanation:
      "La dirección del ascensor (subiendo/bajando) es clave para SCAN y C-LOOK. 200→190 indica que va bajando.",
  },
  // 2023-07
  {
    id: "so_2023jul_q7_disk",
    exam: "2023-07",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question:
      "Cola: [165, 190, 33, 40, 250, 200]. Atendidos [190] y [200] en ese orden. Orden de las restantes con C-LOOK y CSCAN.",
    correctAnswer: `Atendidos 190 → 200. Ascensor está en 200 subiendo.

C-LOOK (solo sube, salta al mínimo): 250 (subiendo), salta a 33 → 40 → 165.
Orden: 250, 33, 40, 165

CSCAN (solo sube, salta al mínimo): igual que C-LOOK en este caso.
Orden: 250, 33, 40, 165`,
    explanation:
      "190→200 indica que el ascensor va subiendo. C-LOOK/CSCAN suben hasta el máximo y saltan al mínimo para seguir atendiendo en el mismo sentido.",
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
      "El registro de control de un controlador permite saber si el dispositivo está disponible":
        "F",
      "La capa de software independiente del dispositivo calcula cuántos sectores deben leerse":
        "F",
      "Un disco con 4 caras y 16000 pistas/cara tiene 64000 cilindros": "F",
      "El major number de /dev/sdb es 8": "V",
      "Un DMA en modo ráfaga tiene mayor prioridad de acceso al bus que en modo robo de ciclos":
        "V",
    },
    explanation:
      "El registro de estado (no control) indica disponibilidad. 4 caras = 16000 cilindros, no 64000. El DMA en ráfaga bloquea el bus hasta terminar.",
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
      "Al llamar a read para 1 byte, el device driver verifica si el bloque está en caché":
        "F",
      "La capa de software independiente asigna nuevo bloque al escribir y no cabe en el último":
        "V",
      "El major number de /dev/sda es 0": "F",
      "Disco: 4 platos, 2 caras/plato, 16 sect/pista, 32768 sect totales → 256 cilindros":
        "V",
      "Tras open+read, lseek al inicio y otro read, a y b tienen el mismo valor":
        "V",
    },
    explanation:
      "La verificación de caché la hace la capa de buffer cache (software independiente), no el driver. La asignación de bloques es función del sistema de ficheros.",
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
      "fprintf prepara el buffer en la capa de software independiente del dispositivo":
        "F",
      "fprintf(fich,'%s-%d',...) internamente llama a write(1, buffer, 11)":
        "F",
      "El device driver calcula qué bloques de disco deben estar en memoria para write":
        "F",
      "Si un fichero ocupa 4090 bytes y se escriben 10 más, se asigna un nuevo bloque":
        "V",
      "El device driver lanza una interrupción para transferir bloques de caché a disco":
        "F",
    },
    explanation:
      "fprintf es libc (espacio usuario), no kernel. El cálculo de bloques lo hace el sistema de ficheros. Las interrupciones las genera el hardware (controladora), no el driver.",
  },
  // 2023-01 — E/S Q2: AIO + read con lseek
  {
    id: "so_2023_q12_aio",
    exam: "2023-01",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "El fichero 'a.dat' contiene 'ABCDEFGH\\n'. Código:\n\nchar BUF1[8] = {'\\0','\\0','\\0','\\0','\\0','\\0','\\0','\\0'};\nchar BUF2[8] = {'\\0','\\0','\\0','\\0','\\0','\\0','\\0','\\0'};\nint fd = open(\"a.dat\", O_RDONLY);\nlseek(fd, 5, SEEK_CUR);\nret1 = read(fd, BUF1, 10);\nprintf(\"%s--%ld\", BUF1, ret1); // lin.09\naio.aio_fildes = fd; aio.aio_buf = BUF2; aio.aio_nbytes = 4;\naio.aio_offset = 2; aio.aio_sigevent.sigev_notify = SIGEV_NONE;\nret2 = aio_read(&aio);\nwhile(aio_error(&aio) == EINPROGRESS);\nret3 = aio_return(&aio);\nprintf(\"%s--%ld\", BUF2, ret2); // lin.17\n\n¿Qué imprime lin.09 y lin.17?",
    correctAnswer: `printf lin.09: FGH\\n--4
lseek posiciona el offset en 5 → lectura desde 'F'. read intenta leer 10 bytes pero solo quedan 4 (FGH\\n). ret1 = 4.

printf lin.17: CDEF--0
aio_read inicia lectura asíncrona de 4 bytes desde offset 2 del fichero → 'C','D','E','F' en BUF2. ret2 = 0 (aio_read devuelve 0 si la petición se encola correctamente; −1 si hay error). ret3 = 4 (bytes leídos, no se imprime).`,
    explanation:
      "lseek posiciona el puntero; read devuelve los bytes realmente leídos. aio_read es asíncrono: ret2=0 indica que la petición se encoló sin error. El while espera activamente. aio_return devuelve el número de bytes leídos.",
  },

  // ============================================================
  // ENTRADA/SALIDA — Cálculos de geometría de disco
  // ============================================================

  // 2020-01
  {
    id: "so_2020_q9_diskgeo",
    exam: "2020-01",
    topic: "entrada-salida",
    type: "text",
    points: 2,
    question:
      "Disco con 1 plato, 2 caras, 2048 cilindros, 512 sectores/pista, 512 bytes/sector. ¿Cuántos bloques ve el S.O. si se formatea con bloques de 2048 bytes?",
    correctAnswer: `Total sectores = 2 caras × 2048 cilindros × 512 sect/pista = 2,097,152 sectores.
1 bloque = 2048 bytes = 4 sectores (512B c/u).
Nº bloques = 2,097,152 / 4 = 524,288 bloques.`,
    explanation:
      "Cada bloque del sistema de ficheros agrupa varios sectores físicos. Con bloques de 2KB y sectores de 512B, cada bloque = 4 sectores.",
  },
  // 2021-01
  {
    id: "so_2021_q11_diskgeo",
    exam: "2021-01",
    topic: "entrada-salida",
    type: "text",
    points: 2,
    question:
      "Disco con 16384 sectores, 2 platos, 2 caras/plato, 512B/sector, 16 sectores/pista. ¿Cuántos cilindros? ¿Cuántos bloques con bloques de 2048 bytes?",
    correctAnswer: `Pistas totales = 16384 / 16 = 1024 pistas.
Caras = 2 platos × 2 = 4 caras.
Cilindros = 1024 / 4 = 256 cilindros.

Capacidad = 16384 × 512 = 8,388,608 bytes.
Bloques 2048B = 4 sectores/bloque.
Nº bloques = 16384 / 4 = 4096 bloques.`,
    explanation:
      "Cada cilindro contiene una pista por cada cara. Con 4 caras, cada cilindro = 4 pistas.",
  },
  // 2022-01
  {
    id: "so_2022_q4_diskgeo",
    exam: "2022-01",
    topic: "entrada-salida",
    type: "text",
    points: 2,
    question:
      "Disco: 32768 sectores, 2 platos, 2 caras/plato, cada pista contiene 8 sectores. ¿Número de cilindros? ¿Número de bloques si se formatea usando bloques de 16 sectores?",
    correctAnswer: `Pistas totales = 32768 / 8 = 4096 pistas.
Caras = 2 × 2 = 4 caras.
Cilindros = 4096 / 4 = 1024 cilindros.

Nº bloques = 32768 / 16 = 2048 bloques.`,
    explanation:
      "Cada cilindro agrupa las pistas correspondientes en todas las caras (4 pistas por cilindro en este caso). El número de bloques del SO es simplemente el número total de sectores dividido por los sectores por bloque (16).",
  },
  // 2022-01 — E/S Q2: código pread/dup/lseek
  {
    id: "so_2022_q5_pread",
    exam: "2022-01",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "Fichero 'file.txt' contiene '0123456789012345\\n'. Código: char BUF[6]={'x','x','x','x','\\0'}; fd=open(file.txt,O_RDONLY); fd2=dup(fd); lseek(fd2,3,SEEK_SET); printf(BUF); pread(fd,BUF+1,2,0); lseek(fd,1,SEEK_CUR); printf(BUF); pread(fd,BUF,2,3); printf(BUF); read(fd,BUF+2,1); read(fd,BUF+3,2); printf(BUF). ¿Qué imprime cada printf (lin.06, lin.09, lin.11, lin.14)?",
    correctAnswer: `printf lin.06: xxxx
printf lin.09: x01xx
printf lin.11: 341xx
printf lin.14: 34456

Paso a paso:
1. BUF={'x','x','x','x','\\0'}, fd=3, fd2=4 (dup comparten file pointer).
2. lseek(fd2,3,SEEK_SET) → file pointer = 3.
3. printf lin.06: BUF no se ha modificado → "xxxx".
4. pread(fd,BUF+1,2,0) → lee desde offset 0: '0','1'. BUF={'x','0','1','x','\\0'}. pread NO modifica file pointer.
5. lseek(fd,1,SEEK_CUR) → file pointer = 3+1 = 4.
6. printf lin.09: "x01xx".
7. pread(fd,BUF,2,3) → lee desde offset 3: '3','4'. BUF={'3','4','1','x','\\0'}. file pointer sigue en 4.
8. printf lin.11: "341xx".
9. read(fd,BUF+2,1) → lee 1 byte desde fp=4: '4'. BUF={'3','4','4','x','\\0'}. fp=5.
10. read(fd,BUF+3,2) → lee 2 bytes desde fp=5: '5','6'. BUF={'3','4','4','5','6'}.
11. printf lin.14: "34456".`,
    explanation:
      "pread() lee desde un offset absoluto sin modificar el file pointer. lseek() modifica el file pointer. dup() hace que fd y fd2 compartan la misma entrada en la tabla de ficheros abiertos (mismo file pointer).",
  },
  // 2022-01 — E/S Q3: redirección con dup/close
  {
    id: "so_2022_q6_redir",
    exam: "2022-01",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "Fichero 'file.txt' contiene '0123456789\\n'. 'file2.dat' no existe. Código: ifd=open(file.txt,O_RDONLY); ofd=open(file2.dat,O_WRONLY|O_CREAT|O_TRUNC,0666); bk=dup(1); close(1); close(0); dup(ifd); dup(ofd); while(read(0,buf+i,1)) i++; write(1,buf,i); close(1); dup(bk); write(1,\"--done--\",8). A) Contenido de entradas 0-5 de la tabla de ficheros abiertos al ejecutar write de line.13. B) ¿Qué se muestra por pantalla?",
    correctAnswer: `A) Tabla de ficheros abiertos en line.13:
Entrada 0 → file.txt (redirigida con dup(ifd))
Entrada 1 → stdout (restaurada con dup(bk), apunta a pantalla)
Entrada 2 → stderr
Entrada 3 → file.txt (ifd original)
Entrada 4 → file2.dat (ofd original)
Entrada 5 → stdout (bk, copia de stdout)

B) Por pantalla se muestra: --done--

Justificación:
1. bk=dup(1)=5 guarda copia de stdout.
2. close(1); close(0): libera fd 0 y fd 1.
3. dup(ifd): ifd=3 → dup busca menor libre (0) → fd 0 = file.txt.
4. dup(ofd): ofd=4 → dup busca menor libre (1) → fd 1 = file2.dat.
5. El while lee de fd 0 (file.txt) byte a byte y write a fd 1 (file2.dat). Copia file.txt → file2.dat.
6. close(1): cierra fd 1.
7. dup(bk=5): dup busca menor libre (1) → fd 1 = stdout (pantalla).
8. write(1,"--done--",8): escribe 8 bytes a stdout → se ve "--done--" en pantalla.`,
    explanation:
      "El código redirige stdin a file.txt y stdout a file2.dat, copia el contenido, luego restaura stdout a la pantalla y escribe '--done--'. El write de la línea 10 no se ve en pantalla porque stdout estaba redirigido a file2.dat.",
  },
  // 2023-07
  {
    id: "so_2023jul_q8_diskgeo",
    exam: "2023-07",
    topic: "entrada-salida",
    type: "text",
    points: 2,
    question:
      "Disco: 65536 sectores, 4 platos, 2 caras/plato, 512B/sector, 16 sectores/pista. a) ¿Número de cilindros? b) ¿Número de bloques con bloques de 4096 bytes?",
    correctAnswer: `a) Pistas = 65536/16 = 4096. Caras = 4×2 = 8. Cilindros = 4096/8 = 512.
b) 1 bloque = 4096B = 8 sectores. Bloques = 65536/8 = 8192.`,
    explanation:
      "Más platos = más pistas por cilindro = menos cilindros para la misma cantidad de sectores.",
  },

  // 2023-07 — E/S Q2: redirección con dup/close
  {
    id: "so_2023jul_q5_redireccion",
    exam: "2023-07",
    topic: "entrada-salida",
    type: "text",
    points: 2,
    question:
      "El fichero 'file.txt' contiene '0123456789\\n'. El fichero 'file2.dat' no existe. Completa la línea 09 para que el write de la línea 10 escriba 'done' en 'file2.dat'. No se permite llamar a open() de nuevo.\n\nbk = dup(STDOUT_FILENO);\nifd = open(\"file.txt\", O_RDONLY);\nofd = open(\"file2.dat\", O_WRONLY|O_CREAT|O_TRUNC, 0666);\nclose(STDOUT_FILENO);\ndup(ifd);      // ahora fd 1 apunta a file.txt\nclose(STDOUT_FILENO);  // cierra fd 1\n/* línea 09: ??? */\nwrite(STDOUT_FILENO, \"done\", 4);",
    correctAnswer: `dup(ofd);

Traza de descriptores:
- bk = dup(1) → bk = 3 (copia de stdout, por si se necesita restaurar).
- ifd = open("file.txt", O_RDONLY) → ifd = 4.
- ofd = open("file2.dat", O_WRONLY|O_CREAT|O_TRUNC, 0666) → ofd = 5.
- close(1); dup(ifd) → fd 1 = file.txt.
- close(1) → fd 1 queda libre.
- dup(ofd) → dup busca el menor descriptor libre (1) y lo hace apuntar a file2.dat.
- write(1, "done", 4) → escribe en file2.dat.`,
    explanation:
      "Tras cerrar fd 1, dup(ofd) copia el descriptor de file2.dat al descriptor 1 (stdout), redirigiendo la salida estándar a file2.dat.",
  },

  // 2023-07 — E/S Q4: pread/read/dup con a.dat
  {
    id: "so_2023jul_q6_pread",
    exam: "2023-07",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "El fichero 'a.dat' contiene 'ABCDEFGH\\n'. ¿Qué se escribe en pantalla en las llamadas a printf de las líneas lin.11 y lin.14? Asúmase que no hay errores.\n\nchar BUF1[8]={'0','0','0','0','0','0','0','0'};\nchar BUF2[8]={'0','0','0','0','0','0','0','0'};\nint fd = open(\"a.dat\", O_RDONLY);\nlseek(fd, 3, SEEK_CUR);          // posición → 3\nret1 = pread(fd, BUF1, 10, 7);   // lee desde offset absoluto 7\nint fd2 = dup(fd);\nret1 = read(fd, BUF1, 2);        // lee desde posición actual (3)\nprintf(\"%s--%ld\", BUF1, ret1); // lin.11\nclose(fd);\nret2 = read(fd2, BUF2, 3);       // lin.13\nprintf(\"%s--%ld\", BUF2, ret2); // lin.14",
    correctAnswer: `printf lin.11: DE--2

Explicación paso a paso:
- lseek(fd, 3, SEEK_CUR): posición actual = 0 + 3 = 3 (apunta a 'D').
- pread(fd, BUF1, 10, 7): lee desde offset absoluto 7 ('H') hasta 10 bytes. Solo quedan 2 bytes ("H\\n"). ret1 = 2. pread NO modifica la posición actual del fichero.
- fd2 = dup(fd): fd2 comparte la misma entrada en la tabla de ficheros abiertos (comparten file pointer).
- read(fd, BUF1, 2): lee 2 bytes desde posición 3 → 'D','E'. BUF1 = "DE000000", ret1 = 2.
- printf imprime "DE--2".

printf lin.14: FGH--3

Explicación:
- close(fd): cierra fd. fd2 sigue activo porque dup incrementó el contador de referencias de la entrada.
- La posición actual era 3 + 2 = 5 tras read(fd, BUF1, 2).
- read(fd2, BUF2, 3): lee 3 bytes desde posición 5 → 'F','G','H'. BUF2 = "FGH00000", ret2 = 3.
- printf imprime "FGH--3".`,
    explanation:
      "pread() lee desde un offset absoluto sin modificar el puntero de posición. dup() hace que fd y fd2 compartan la misma entrada en la tabla de ficheros abiertos; los cambios de posición en fd afectan a fd2. close(fd) no invalida fd2 porque la entrada sigue referenciada.",
  },

  // ============================================================
  // 2022-07 — Memoria zonas + E/S redirección
  // ============================================================
  {
    id: "so_2022_q4_zonas",
    exam: "2022-01",
    topic: "memoria",
    type: "matching",
    points: 5,
    question:
      "Clasifica cada dirección de un programa C en su zona: a) stack, b) heap, c) datos globales/estáticos, d) código/librerías.",
    correctAnswer: {
      "&a (variable auto local)": "a",
      "&p (puntero local)": "a",
      "&p[0] (malloc)": "b",
      "sbrk(0)-0xFF (zona heap alta)": "b",
      "&pi (static)": "c",
      "&t (global)": "c",
      "f1 (función propia)": "d",
      "getpid (función librería)": "d",
      "fork (función librería)": "d",
    },
    explanation:
      "Variables auto → stack. malloc → heap. static/global → datos. Funciones → código. El espacio del kernel no es accesible desde usuario.",
  },
  // 2022-07 — FS P2 código con link/symlink/unlink
  {
    id: "so_2022jul_q5_code",
    exam: "2022-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    repeated: true,
    question:
      "Código sobre '/home/usr1/datos' (8GB+32MB+8KB, hard links=1): chmod 0642, link crea datos2, symlink('/home/usr1/datos','/home/usr1/sim_link'), open datos2, open sim_link, lseek(fd,16000), fgetc c1, close, unlink datos y sim_link. Cachés vacías, entrada usr1 en 7º bloque de home. A) fd_sim. B) Accesos disco apertura datos2. C) Bloques para fgetc. D) Permisos rwxrwxrwx. E) Hard links de datos2 tras ambos unlink.",
    correctAnswer: `A) 4 (primera apertura fd=3, segunda fd_sim=4)
B) 9 accesos (raíz, home, 7 bloques para usr1 — no, con bloque 8KB: 1 raíz, 1 home, 1 usr1(7º bloque), 1 datos2 → total = 4 directorios + 5 índices/datos = 9)
C) 1 bloque (16000 < 8KB → byte en 2º bloque de datos directos, ya cargado en caché de apertura)
D) rw- r-- -w- (0642: owner=6=rw-, group=4=r--, others=2=-w-)
E) 1 (inicialmente 1, link crea datos2 → 2, unlink datos → 1, unlink sim_link no afecta al inodo de datos)`,
    explanation:
      "sim_link es un symlink con su propio inodo. unlink de sim_link borra el symlink pero no afecta al fichero datos/datos2.",
  },
  // 2022-07 — FS V/F
  {
    id: "so_2022jul_q6_tf",
    exam: "2022-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    repeated: true,
    question: "Indica C/F sobre sistema de ficheros (Junio 2022):",
    correctAnswer: {
      "El S.O. mantiene copia en memoria del inodo de un fichero abierto hasta el último cierre":
        "C",
      "Al linkar con librería estática, el código en memoria se puede compartir entre procesos":
        "F",
      "Al ejecutar perror() se incrementa el tiempo en modo usuario pero no en modo sistema":
        "F",
      "Es posible crear soft links entre diferentes sistemas de ficheros montados":
        "C",
      "El journaling es un registro histórico de asignaciones de inodos": "F",
      "El Buffer Cache reduce lecturas físicas pero no escrituras": "F",
    },
    explanation:
      "Las librerías estáticas se copian en cada ejecutable (no se comparten en memoria). perror() usa write() → modo kernel. Los soft links almacenan rutas → cruzan sistemas de ficheros.",
  },
  // 2022-07 — E/S: código dup/close/redirección
  {
    id: "so_2022jul_q5_redir",
    exam: "2022-07",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "Código: open('file1.dat',O_RDONLY) → ifd=3; open('file2.dat',O_WRONLY|O_CREAT) → ofd=4. bk=dup(1); close(1); dup(ifd); close(0); dup(ofd). Lee de fd=ifd(3) y escribe a fd=1 (que ahora es file2.dat). Luego close(0); close(1); dup(bk). Finalmente write(1,'--done--'). ¿Qué se escribe en pantalla?",
    correctAnswer: `Solo se escribe "--done--" en pantalla.

Paso a paso:
1. bk=dup(1) → bk=5 apunta a stdout (pantalla).
2. close(1); dup(ifd=3) → fd1=file1.dat. ¡Stdout ahora es file1.dat!
3. close(0); dup(ofd=4) → fd0=file2.dat.
4. read(3...) lee de file1.dat (fd3 sigue siendo file1.dat).
5. write(1...) escribe buf en file1.dat (no en file2.dat).
6. close(0); close(1); dup(bk=5) → fd0=stdout. fd1 sigue cerrado.
7. write(1,...) escribe "--done--" en pantalla (stdout, vía fd0 duplicado).

Nota: el código tiene un comportamiento sutil con los descriptores.`,
    explanation:
      "dup() busca el menor descriptor libre. Al cerrar fd1 y hacer dup(ifd), stdout(1) ahora apunta a file1.dat. Tras restaurar con dup(bk), stdout vuelve a la pantalla.",
  },
  // 2023-01 — Memoria V/F
  {
    id: "so_2023_q7_mem",
    exam: "2023-01",
    topic: "memoria",
    type: "matching",
    points: 5,
    question: "Responde V/F sobre memoria (Enero 2023):",
    correctAnswer: {
      "Un sistema con segmentación sin paginación puede tener memoria virtual":
        "V",
      "Tras fork(), padre e hijo tienen su propio espacio de direcciones virtuales":
        "V",
      "Un fallo de página bloquea al proceso mientras se sirve": "V",
      "La política del Working Set puede llegar a suspender procesos": "V",
      "Un algoritmo de reemplazo aleatorio con N marcos y N-1 páginas virtuales produce N-1 fallos o menos":
        "V",
    },
    explanation:
      "La segmentación con swapping implementa memoria virtual sin paginación. El Working Set monitoriza páginas activas; si la suma excede RAM, se suspenden procesos (thrashing).",
  },
  // 2023-01 — Memoria Q2: Zonificación de direcciones
  {
    id: "so_2023_q2_zonas",
    exam: "2023-01",
    topic: "memoria",
    type: "matching",
    points: 7.5,
    question:
      'Clasifica cada dirección del programa C en su zona (1=stack, 2=heap, 3=datos globales/estáticos, 4=código):\n\ndouble t[3] global; static double sd en f1(); malloc(4096); strdup("beta"); argc, argv.',
    correctAnswer: {
      "A: p=&argc": "1",
      "B: &p": "1",
      "C: &args": "1",
      "D: argv": "1",
      "E: &argv[0]": "1",
      "F: t": "3",
      "G: &t[0]": "3",
      "H: &t": "3",
      "I: &sd": "3",
      "J: &s1": "1",
      "K: &s2": "1",
      "L: s1": "2",
      "M: s2": "2",
      "N: strcpy": "4",
      "O: exit": "4",
    },
    explanation:
      "p, args, s1, s2 son variables locales → stack. & de locales también stack. t y sd son global/static → zona 3. s1/s2 (sin &) apuntan a malloc/strdup → heap (2). strcpy y exit son direcciones de funciones → código (4).",
  },
  // 2023-01 — Procesos Q1: 10 V/F
  {
    id: "so_2023_q9_proctf",
    exam: "2023-01",
    topic: "procesos",
    type: "matching",
    points: 10,
    question: "Responde V/F (10 preguntas) sobre procesos:",
    correctAnswer: {
      "La mayoría de procesadores modernos tienen la instrucción 'terminar proceso'":
        "F",
      "En un monoprocesador, un programa solo puede dar lugar a un proceso":
        "F",
      "Si un proceso es el único listo, su prioridad no influye en el tiempo de ejecución":
        "V",
      "Salvo modificación posterior, dos procesos del mismo usuario tienen las mismas variables de entorno":
        "F",
      "Salvo modificación posterior, dos procesos que ejecutan el mismo programa tienen las mismas variables de entorno":
        "F",
      "Un manejador de interrupciones es siempre parte del código del kernel":
        "V",
      "Un proceso con credencial real de root puede acceder a cualquier fichero":
        "F",
      "En RR quantum 100ms, si un proceso tiene ráfaga 80ms, el siguiente puede obtener CPU 120ms seguidos":
        "F",
      "Un proceso no puede realizar más de una llamada exec desde que se crea hasta que termina":
        "F",
      "Existen situaciones en las que fork() puede cambiar la credencial": "F",
    },
    explanation:
      "No existe instrucción 'terminar proceso' (es syscall). Un programa puede generar múltiples procesos. Si es el único listo, la prioridad no importa. Las variables de entorno se heredan de padre, no del usuario/programa. La credencial real no basta (se usa la efectiva). En RR con quantum 100, tras ráfaga de 80 el siguiente tiene máximo 100ms. Un proceso puede hacer múltiples exec (ej. shell). fork() no cambia credenciales.",
  },
  // 2023-01 — Procesos (Q8)
  {
    id: "so_2023_q8_proc",
    exam: "2023-01",
    topic: "procesos",
    type: "matching",
    points: 8,
    repeated: true,
    question: "Responde V/F sobre procesos (Enero 2023):",
    correctAnswer: {
      "Un proceso zombie ocupa una entrada en la tabla de procesos": "V",
      "La credencial efectiva puede cambiar al hacer exec()": "V",
      "Tras fork(), las credenciales de padre e hijo son idénticas": "V",
      "Un proceso con mínima prioridad usa el 100% de CPU si no hay otros listos":
        "V",
      "Un algoritmo no apropiativo minimiza cambios de contexto frente a uno apropiativo":
        "V",
      "No existe la instrucción hardware 'cambiar prioridad'": "V",
      "La creación de procesos es software (syscalls), no instrucción hardware":
        "V",
      "El administrador no puede hacer que un proceso de usuario se ejecute siempre en modo kernel":
        "V",
    },
    explanation:
      "Conceptos de procesos: zombies, credenciales, prioridades, creación de procesos, modos de ejecución. El modo kernel/depende del código ejecutado (syscalls/interrupciones).",
  },
  // 2023-01 — Procesos Q2: SV/BuscarVariable
  {
    id: "so_2023_q10_sv",
    exam: "2023-01",
    topic: "procesos",
    type: "text",
    points: 5,
    question:
      "Código C con funciones BuscarVariable y SV. SV reemplaza la variable v1 por v2 con valor vle (cadena 'v2=vle'), comprobando que v2 no existe y v1 sí. Tras ejecución EXITOSA de SV, indica para cada afirmación si es CIERTA SIEMPRE (A), puede ser cierta a veces (B) o FALSA SIEMPRE (C):\n\n1. El entorno de env (3er arg de main) y environ son el mismo.\n2. El número de variables de entorno en uno de los entornos ha cambiado.\n3. Una variable aparece duplicada en algún entorno.\n4. Aunque los entornos estén correctamente terminados en NULL, es posible que SV produzca segmentation fault.\n5. Una variable que solo existía en uno de los entornos ahora existe en ambos.",
    correctAnswer: `1: B — Serán el mismo o no dependiendo de si lo eran antes de llamar a SV.
2: C — SV sustituye una variable por otra, no cambia el número de variables.
3: C — SV comprueba que v2 no existe previamente, evita duplicados.
4: C — La asignación de memoria es correcta (strlen(v2)+strlen(vle)+2 para '=' y '\\0'). Si no hay memoria, SV devuelve -1.
5: B — Es posible si la variable sustituta ya existía en el otro entorno.`,
    explanation:
      "La función SV sustituye la variable v1 por v2=valor. El +2 en malloc cubre el '=' y el terminador nulo. No hay riesgo de segmentation fault porque la memoria se asigna correctamente y se comprueba el retorno de malloc.",
  },
  // 2023-01 — Procesos Q3: Credenciales y permisos
  {
    id: "so_2023_q11_credenciales",
    exam: "2023-01",
    topic: "procesos",
    type: "text",
    points: 5,
    repeated: true,
    question:
      'a.out y f1.txt son del usuario u1. a.out es ejecutado por u2 desde el mismo directorio. Código:\ndf1 = open("./f1.txt", O_RDWR);\ndf2 = open("./f1.txt", O_RDONLY);\n\nCompleta la tabla indicando ruid, euid y si df1 o df2 son −1 para cada combinación de permisos:\n\n| a.out | f1.txt | ruid | euid | df1=−1? | df2=−1? |\n| rwxrwxrwx | rwxrwxrwx | | | | |\n| rwxr-xr-x | rwxr-xr-x | | | | |\n| rwxr-xr-x | rwxr--r-- | | | | |\n| rwxr-xr-x | rwsr-xr-x | | | | |\n| rwxr-xr-x | rwsr--r-- | | | | |\n| rwxr-xr-x | rws--- | | | | |\n| rwsr-xr-x | rwxr-xr-x | | | | |\n| rwsr-xr-x | rwxr--r-- | | | | |\n| rwsr-xr-x | rwsr-xr-x | | | | |\n| rwsr-xr-x | rwsr--r-- | | | | |\n| rwsr-xr-x | rws--- | | | | |',
    correctAnswer: `| a.out | f1.txt | ruid | euid | df1=−1? | df2=−1? |
| rwxrwxrwx | rwxrwxrwx | u2 | u2 | no | no |
| rwxr-xr-x | rwxr-xr-x | u2 | u2 | sí | no |
| rwxr-xr-x | rwxr--r-- | u2 | u2 | sí | no |
| rwxr-xr-x | rwsr-xr-x | u2 | u2 | sí | no |
| rwxr-xr-x | rwsr--r-- | u2 | u2 | sí | no |
| rwxr-xr-x | rws--- | u2 | u2 | sí | sí |
| rwsr-xr-x | rwxr-xr-x | u2 | u1 | no | no |
| rwsr-xr-x | rwxr--r-- | u2 | u1 | no | no |
| rwsr-xr-x | rwsr-xr-x | u2 | u1 | no | no |
| rwsr-xr-x | rwsr--r-- | u2 | u1 | no | no |
| rwsr-xr-x | rws--- | u2 | u1 | no | no |

Regla: ruid siempre = u2 (quien ejecuta). Si a.out tiene setuid (rws), euid = u1 (propietario); si no, euid = u2. Los permisos de f1.txt se comprueban con la credencial efectiva: euid=u1 → permisos de propietario; euid=u2 → permisos de otros. O_RDWR necesita lectura+escritura, O_RDONLY solo lectura.`,
    explanation:
      "El bit setuid en el ejecutable cambia la euid al propietario (u1), dando acceso según permisos de propietario de f1.txt. Sin setuid, euid=u2 y se aplican permisos de 'otros', que carecen de escritura salvo en el primer caso (777). Con f1.txt rws--- y euid=u2, 'otros' no tiene ningún permiso → ambos descriptores fallan.",
  },
  // 2023-07 — Memoria V/F adicionales
  {
    id: "so_2023jul_q9_mem",
    exam: "2023-07",
    topic: "memoria",
    type: "matching",
    points: 10,
    question: "Responde V/F sobre memoria (julio 2023):",
    correctAnswer: {
      "En TP multinivel, solo el último nivel almacena direcciones de páginas físicas de datos":
        "F",
      "La TP invertida almacena qué página lógica ocupa cada marco físico": "V",
      "fork() con copy-on-write copia la tabla de páginas del padre en el hijo":
        "V",
      "vfork() no copia la tabla de páginas del padre en el hijo": "V",
      "Un fallo de página siempre actualiza la tabla de páginas": "V",
      "El Working Set en ventana de 1000 refs siempre es ≥ que en ventana de 500":
        "V",
      "En paginación por demanda pura no se prepagina la 1ª instrucción": "V",
      "Con registros base/límite sí puede haber swapping a disco": "V",
      "Linux gestiona memoria con segmentación paginada": "V",
      "Las librerías dinámicas ahorran memoria física vs estáticas": "V",
    },
    explanation:
      "Niveles intermedios de TP almacenan direcciones de tablas (no de datos). La TP invertida tiene una entrada por marco físico. fork() con COW copia la TP (apuntando a mismos frames RO). vfork() comparte espacio del padre. WS(A) ⊇ WS(B) si A ≥ B.",
  },

  // ============================================================
  // ENERO 2024 — Memoria (Working Set + zonas + fork/dup)
  // ============================================================

  {
    id: "so_2024_q5_ws",
    exam: "2024-01",
    topic: "memoria",
    type: "text",
    points: 5,
    question:
      "Sobre el algoritmo FIFO Segunda Oportunidad: B1) ¿Puede aplicarse con asignación variable de memoria a procesos y reemplazo global? B2) ¿Es necesario el bit de referencia? B3) ¿Es necesario el bit de presencia? B4) ¿Es necesario el dirty bit? B5) ¿Es necesario el lock bit?",
    correctAnswer: `B1) SÍ. FIFO 2ª Oportunidad puede aplicarse con asignación variable y reemplazo global. El algoritmo solo necesita la cola de páginas y los bits de referencia, independientemente de cuántos marcos tenga cada proceso.

B2) SÍ. El bit de referencia (R) es esencial: cuando una página va a ser reemplazada, si R=1 se le da una segunda oportunidad (se pone R=0 y se mueve al final de la cola).

B3) SÍ. El bit de presencia indica si la página está en memoria. Solo las páginas presentes tienen entrada en la cola FIFO.

B4) NO. El dirty bit indica si la página fue modificada (necesita escribirse a disco al reemplazarla), pero no es necesario para la lógica del algoritmo de reemplazo en sí.

B5) NO. El lock bit impide que una página sea reemplazada (ej. durante E/S), pero no forma parte del algoritmo de reemplazo.`,
    explanation:
      "FIFO 2ª Oportunidad usa una cola circular con bit R. Cuando una página llega al frente: si R=1 → R=0 y al final; si R=0 → se reemplaza. Solo necesita el bit de referencia y presencia.",
  },
  {
    id: "so_2024_q6_zonas",
    exam: "2024-01",
    topic: "memoria",
    type: "text",
    points: 10,
    question:
      "Dado un programa C que declara variables locales (int, double, char*), usa malloc, define funciones propias (f1) y accede a argc, argv, environ: identifica 10 elementos y di en qué zona de memoria residen (pila, heap, código, datos). Indica qué printf corresponde a cada zona.",
    correctAnswer: `1. &d → pila de usuario (d es variable local tipo char*)
2. &e → pila de usuario (e es variable local tipo double)
3. &d[0] → heap (d apunta a memoria reservada con malloc)
4. &d[1] → heap (siguiente byte del bloque malloc)
5. argc → pila de usuario (parámetro de main)
6. f1 → segmento de código (dirección de función propia)
7. f1+1 → segmento de código (siguiente instrucción)
8. s[0] → segmento de datos/pila (argv, puntero a cadena)
9. t[0] → pila de usuario (environ, variables de entorno)
10. &t → pila de usuario (dirección del array de punteros a entorno)`,
    explanation:
      "La pila contiene variables locales, parámetros y direcciones de retorno. El heap contiene memoria dinámica (malloc). El segmento de código contiene las instrucciones del programa. Las variables de entorno (environ) se pasan como tercer argumento de main.",
  },
  {
    id: "so_2024_q7_forkdup",
    exam: "2024-01",
    topic: "procesos",
    type: "text",
    points: 10,
    question:
      "Código: open 1.txt (O_CREAT|O_TRUNC|O_RDWR), dup(STDOUT_FILENO) a fdb, close(1), dup(fda) redirige stdout a 1.txt, write('1.TXT-CREATED-'), fork(). Hijo write('A'), ambos write('B'). close(1), dup(fdb) restaura stdout, write('Y'), write('Z'). ¿Salida por terminal? ¿Contenido de 1.txt?",
    correctAnswer: `SALIDA POR TERMINAL: YZ (padre) + YZ (hijo) = YZYZ (o entrelazados: YZYZ, YYZZ, etc.)

CONTENIDO 1.txt: 1.TXT-CREATED-BAB

Explicación:
1. stdout se redirige a 1.txt → "1.TXT-CREATED-" se escribe en 1.txt.
2. fork() crea hijo. Ambos tienen stdout → 1.txt.
3. Padre e hijo escriben "B" → 1.txt tiene "...B" de cada uno = "BAB".
   El hijo además escribe "A" antes → el hijo escribe "AB", el padre "B".
   Como comparten file pointer, el resultado es "1.TXT-CREATED-BAB".
4. Ambos cierran stdout(1) y lo restauran con dup(fdb) → stdout = terminal.
5. Ambos escriben "YZ" a terminal → 4 letras total (YZYZ, con posible entrelazado).`,
    explanation:
      "Tras fork(), padre e hijo comparten la entrada en la tabla de ficheros abiertos (mismo file pointer). Las escrituras de ambos se intercalan en 1.txt. Al restaurar stdout con dup, ambos escriben a terminal de forma concurrente.",
  },

  // ============================================================
  // ENERO 2024 — Procesos (V/F + shell + planificación)
  // ============================================================

  {
    id: "so_2024_q8_proc",
    exam: "2024-01",
    topic: "procesos",
    type: "matching",
    points: 10,
    repeated: true,
    question: "Responde V/F (10 preguntas) sobre procesos:",
    correctAnswer: {
      "En un SO Multiusuario, el número de usuarios que puede soportar está limitado por el microprocesador":
        "F",
      "Solo un proceso con credencial efectiva de root puede cambiar sus credenciales mediante exec":
        "F",
      "Los manejadores de interrupción se almacenan en la pila del kernel": "F",
      "Un proceso zombie no ocupa una entrada en la tabla de procesos": "F",
      "Las llamadas exec pueden reemplazar datos y pila de un proceso, pero no el código":
        "F",
      "Tras fork(), el proceso hijo tiene SIEMPRE la misma credencial efectiva que su padre":
        "F",
      "Todo proceso comienza y termina SIEMPRE con una ráfaga de CPU": "F",
      "Un algoritmo apropiativo siempre produce más cambios de contexto que uno no apropiativo":
        "V",
      "El rango de prioridades depende en parte del microprocesador": "F",
      "La Tabla de Ficheros Abiertos del sistema es parte de los datos del kernel":
        "V",
    },
    explanation:
      "El límite de usuarios depende de recursos (memoria, tabla procesos), no del micro. Cualquier proceso con setuid puede cambiar credenciales. Las ISR tienen su propia pila o usan la pila kernel del proceso interrumpido. Los zombies SÍ ocupan entrada. exec reemplaza TODO (código, datos, pila). Tras fork, si el ejecutable tiene setuid y se hace exec, la efectiva cambia. Algunos SO permiten terminar con ráfaga de E/S. La prioridad es abstracción del SO, no del hardware.",
  },
  {
    id: "so_2024_q9_shell",
    exam: "2024-01",
    topic: "procesos",
    type: "text",
    points: 7,
    question:
      "Código de shell: ComprobarSegundoPlano busca '&' en el array tr[], si lo encuentra hace tr[i]=NULL /*UNO*/. Proceso hace fork(), si hijo: execvp y si falla exit(255) /*DOS*/. Padre: si !back → wait(NULL) /*TRES*/, si back → MeterProceso. Para cada marca /*UNO*/, /*DOS*/, /*TRES*/, indica si es NECESARIA, INCORRECTA o SUPERFLUA.",
    correctAnswer: `/*UNO*/ tr[i]=NULL: NECESARIA. El '&' es un símbolo del shell para indicar segundo plano. Si no se elimina, el programa ejecutado recibiría '&' como parámetro, lo cual es incorrecto.

/*DOS*/ exit(255): NECESARIA. Si execvp falla (ejecutable no existe, sin permisos, formato incorrecto), el proceso hijo debe terminar. Sin exit(), el hijo continuaría ejecutando el código del shell, creando una copia adicional del shell cada vez que execvp falle.

/*TRES*/ wait(NULL): INCORRECTA. Cuando la ejecución NO es en segundo plano (!back), el shell debe esperar al proceso hijo. Pero wait() espera por cualquier hijo, incluyendo procesos en segundo plano que puedan terminar antes. Lo correcto es usar waitpid(pid, NULL, 0) para esperar específicamente por el proceso en primer plano.`,
    explanation:
      "En shells, el '&' es metacarácter que no debe pasarse al programa. execvp no retorna en éxito; si falla, hay que hacer exit. wait() espera a cualquier hijo; con procesos en segundo plano hay que usar waitpid para esperar al hijo correcto.",
  },
  {
    id: "so_2024_q10_sched",
    exam: "2024-01",
    topic: "procesos",
    type: "text",
    points: 7,
    question:
      "Sistema con 3 colas: SYS (RR quantum 1, prioridad máxima), INT (RR quantum 3), BAT (FCFS, prioridad mínima). Planificación entre colas por prioridades apropiativas. Procesos: A (INT, CPU=7, t=0), B (INT, CPU=4, t=1), C (SYS, CPU=6, t=6), D (SYS, CPU=3, t=12). Muestra la planificación de CPU.",
    correctAnswer: `Traza: A A A | B B B | A A A | B | A | C C C C C C | D D D | (resto de A y B?)

La solución oficial es: A A A B B B C C C C C C D D D A A A B A

Explicación:
t=0-2: A ejecuta 3 (INT, quantum 3).
t=3-5: B ejecuta 3 (INT, quantum 3). A queda con 4 restantes, B con 1.
t=6: Llega C (SYS, prioridad máxima) → expropia. C ejecuta.
t=6-11: C ejecuta 6 (SYS, RR quantum 1 → como no hay otros en SYS, ejecuta sus 6 seguidos).
t=12: Llega D (SYS). C ha terminado.
t=12-14: D ejecuta 3.
t=15-18: Vuelven A y B de INT. A ejecuta 3+1=4 (quantum 3 + queda 1).
t=19: B ejecuta su unidad restante.`,
    explanation:
      "SYS tiene prioridad absoluta sobre INT. Cuando llega C en t=6, expropia a B inmediatamente. Dentro de SYS, RR de quantum 1 pero como no compite con nadie, ejecuta de corrido. Al terminar los procesos SYS, vuelven INT.",
  },

  // ============================================================
  // EXAMEN JULIO 2024
  // ============================================================

  // 2024-07 — Sistema de Ficheros
  {
    id: "so_2024jul_q1",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 6,
    repeated: true,
    question:
      "Un sistema de archivos tipo System V tiene bloque de 2KB, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Direcciones de bloque de 8 bytes. Fichero con tamaño de 130 MBytes + 19 KBytes. Calcular: bloques de datos, bloques de índices y fragmentación interna.",
    correctAnswer: `Tamaño = 130MB + 19KB = 136,314,880 + 19,456 = 136,334,336 bytes.
Nº bloques datos = 136,334,336 / 2048 = 66,570 bloques.

Direcciones/bloque = 2048/8 = 256.
10 directas + 256 simple + 256² = 65,802 (insuficiente).
66,570 − 65,802 = 768 bloques necesitan triple indirección.
768/256 = 3 bloques índice de 3er nivel.

Índices: 1 (simple) + 1 (doble) + 256 (doble 2º) + 1 (triple) + 1 (triple 2º) + 3 (triple 3º) = 263.

Fragmentación: 2048 − (136,334,336 mod 2048) = 1024 bytes.`,
    explanation:
      "Similar al problema de enero 2020 pero con 19KB más de datos. La diferencia está en la fragmentación interna (1024 vs 2047 bytes).",
  },
  {
    id: "so_2024jul_q2",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 3,
    question:
      "Sistema UNIX con bloque 2KB, inodo 64 bytes. Boot ocupa 2 bloques, superbloque 14 bloques. Calcular: a) Bloque lógico del inodo del directorio raíz (inodo 2). b) Bloque lógico del inodo del fichero 'datos' (inodo 642). Los inodos se numeran a partir de 1.",
    correctAnswer: `Inodos por bloque = 2048/64 = 32.
Área de inodos empieza tras boot+superbloque = 2+14 = 16 (bloque 16).

a) Inodo 2 → bloque = 16 + floor((2−1)/32) = 16 + 0 = 16.
b) Inodo 642 → bloque = 16 + floor((642−1)/32) = 16 + 20 = 36.`,
    explanation:
      "El área de inodos comienza tras el superbloque. Cada bloque contiene 32 inodos de 64 bytes. Los inodos se numeran desde 1.",
  },
  {
    id: "so_2024jul_q3",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    repeated: true,
    question:
      "Código sobre '/home/juan/so/p1/p1.c' (3MB, inodo 6549). Se ejecuta desde /home/juan/so/p1. chmod 0632, lstat, link crea practica1.c, symlink crea slink_practica1.c, open practica1.c, lseek 100000, fgetc. Cachés vacías, entrada 'so' en 8º bloque de juan. a) Accesos a disco en 1ª apertura. b) Valor de fd2. c) Bloques leídos para fgetc(fd2). d) Tamaño de slink_practica1.c. e) Permisos en rwxrwxrwx.",
    correctAnswer: `a) 12 accesos (raíz, home, juan, 8º bloque de juan para 'so', so, p1, p1.c = 7 + 5 accesos datos índices)
b) 4 (fd1=3, fd2=4)
c) 2 bloques (100000 está en zona de indirección simple ya cargada → 1 índice + 1 datos)
d) 11 bytes (longitud de la ruta "practica1.c")
e) rw- -wx -w- (0632: owner=6=rw-, group=3=-wx, others=2=-w-)`,
    explanation:
      "lstat vs stat: lstat no sigue symlinks. chmod 0632 da permisos rw- al dueño, -wx al grupo, -w- a otros.",
  },
  {
    id: "so_2024jul_q4",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    repeated: true,
    question:
      "Indica C/F sobre el código del ejercicio anterior y conceptos de sistema de ficheros:",
    correctAnswer: {
      "fgetc es una llamada al sistema operativo": "F",
      "unlink elimina la entrada 'p1.c' pero no libera el inodo 6549": "C",
      "El enlazador incorpora el código de printf desde libC (estática o dinámica)":
        "C",
      "Al ejecutar printf se incrementa el tiempo en modo usuario pero no en modo sistema":
        "F",
      "Un proceso puede abrir varias veces un fichero, pero con el mismo modo de apertura":
        "F",
      "El Buffer Cache reduce lecturas físicas pero no escrituras físicas": "F",
    },
    explanation:
      "fgetc es función de libc, no syscall. unlink borra la entrada pero quedan hard links → inodo no se libera. printf gasta tiempo en ambos modos. Un fichero puede abrirse con modos distintos (O_RDONLY y O_RDWR). Buffer Cache reduce tanto lecturas como escrituras.",
  },

  // 2024-07 — Memoria
  {
    id: "so_2024jul_q5_mem",
    exam: "2024-07",
    topic: "memoria",
    type: "matching",
    points: 10,
    repeated: true,
    question: "Responde V/F (20 preguntas, 0.05p cada una) sobre memoria:",
    correctAnswer: {
      "Con tabla de páginas invertida se ahorra memoria para las tablas de páginas de proceso":
        "V",
      "Con tabla de páginas invertida se pueden gestionar los fallos de página del proceso":
        "V",
      "Cuando el lock bit es 0 en una entrada de TP necesaria, se produce un fallo de página":
        "F",
      "Con N páginas virtuales, LRU con N marcos siempre produce menos fallos que con N-1":
        "F",
      "Con N páginas virtuales, FIFO con N marcos siempre produce menos fallos que con N-1":
        "F",
      "En la pila del proceso están los argumentos de la línea de comandos":
        "V",
      "Las variables locales de main() están en la pila del proceso": "V",
      "Las variables locales de funciones de usuario están en la pila del proceso":
        "V",
      "El código de las funciones de librería invocadas está en la pila del proceso":
        "F",
      "El código de las funciones de usuario invocadas está en la pila del proceso":
        "F",
      "Las variables estáticas definidas en funciones están en la pila del proceso":
        "F",
      "Las variables estáticas definidas en main() están en la pila del proceso":
        "F",
      "Para un proceso con varios hilos, cada hilo tiene su propia pila": "V",
      "Con TP de un nivel, si el bit de presencia es 1, el acceso a esa página está garantizado":
        "F",
      "Con TP de un nivel, si el bit de presencia es 1, se garantiza que no hay fallo de página":
        "V",
      "fork sin copy-on-write copia la tabla de páginas del padre en el hijo":
        "V",
      "fork con copy-on-write copia la tabla de páginas del padre en el hijo":
        "V",
      "Con paginación por demanda pura, siempre hay fallo en la 1ª instrucción":
        "V",
      "Una TP multinivel normalmente reduce memoria necesaria vs TP de un nivel":
        "V",
      "Si el nº de marco son 8 bits y páginas de 4KB, las direcciones físicas son de 20 bits":
        "V",
    },
    explanation:
      "La tabla invertida ahorra memoria (una entrada por marco, no por página virtual). Con N marcos y N páginas virtuales, LRU/FIFO producen los mismos fallos (N) que con N-1 marcos (N también) — la anomalía de Belady. El código está en el segmento de texto, no en la pila. Las variables estáticas están en el segmento de datos. Con presencia=1 la página está en memoria → no hay fallo, pero el acceso puede violar permisos. 8 bits marco + 12 offset = 20 bits físicos.",
  },
  {
    id: "so_2024jul_q6_tp",
    exam: "2024-07",
    topic: "memoria",
    type: "text",
    points: 7,
    question:
      "Sistema con memoria física de 8GB, páginas de 4KB, entradas de TP de 8 bytes, direcciones virtuales de 30 bits. a) ¿Cuántos niveles de TP son necesarios? b) ¿Bits de control + no usados en una entrada de TP? c) Con TLB y caché, ¿mínimo y máximo de accesos a memoria para leer un byte?",
    correctAnswer: `a) Página 4KB = 2¹². Entradas/TP = 2¹²/8 = 2⁹ = 512.
1 nivel: 2⁹ × 2¹² = 2²¹ bytes (2MB) — insuficiente para 2³⁰.
2 niveles: 2⁹ × 2⁹ × 2¹² = 2³⁰ bytes ✓ → 2 niveles.

b) Física 8GB = 2³³ bytes. Páginas físicas = 2³³/2¹² = 2²¹ → 21 bits.
Entrada TP = 8B = 64 bits. Control + no usados = 64 − 21 = 43 bits.

c) Mínimo: 0 accesos (mapping en TLB + dato en caché).
Máximo: 3 accesos (2 niveles TP + 1 acceso al dato en memoria).`,
    explanation:
      "Con 30 bits de dirección virtual y páginas de 4KB (offset 12 bits), quedan 18 bits para nº página. Con 9 bits por nivel, 2 niveles cubren 18 bits exactos. Con TLB+caché se puede evitar todo acceso a RAM; sin ellos, cada nivel de TP requiere un acceso.",
  },

  // 2024-07 — Procesos + E/S
  {
    id: "so_2024jul_q7_proc",
    exam: "2024-07",
    topic: "procesos",
    type: "matching",
    points: 7,
    question:
      "Responde V/F (15 preguntas, 0.07p cada una) sobre procesos y E/S:",
    correctAnswer: {
      "Las 4 capas del software de E/S son: usuario, indep. dispositivo, driver y manejador interrupciones":
        "V",
      "Un dispositivo polling genera interrupciones": "F",
      "La E/S mediante DMA puede usarse con dispositivos mapeados en memoria":
        "V",
      "En un sistema con espacio E/S separado puede haber dispositivos mapeados en memoria":
        "V",
      "Compartir memoria con shmget puede hacerse entre procesos con distinto UID":
        "V",
      "Si el ejecutable tiene setuid, exec() cambia la credencial efectiva y la salvada":
        "V",
      "Un proceso puede terminar con una ráfaga de E/S": "F",
      "Round-robin puede producir inanición de procesos con ráfaga mayor que el quantum":
        "F",
      "El rango de prioridades depende en parte del microprocesador": "F",
      "La Tabla de Ficheros Abiertos del sistema es parte de los datos del kernel":
        "V",
      "Que cada proceso tenga su propia pila del kernel es necesario para que el kernel sea reentrante":
        "V",
      "En un sistema multiprocesador, el kernel no puede ser reentrante": "F",
      "Todos los procesos UNIX, al comenzar, tienen el mismo conjunto de variables de entorno":
        "F",
      "Para implementar UNIX se necesita la instrucción 'terminar proceso' en el procesador":
        "F",
      "Al crear un proceso con exec, exec devuelve el pid del proceso creado al padre":
        "F",
    },
    explanation:
      "Polling NO genera interrupciones (sondeo continuo). DMA puede usarse con memory-mapped I/O. Un proceso no puede terminar con una ráfaga de E/S porque su última operación (ej. exit o return) requiere CPU. La prioridad es abstracción del SO, no del hardware. Round-robin no produce inanición (todos reciben quantum). En multiprocesador el kernel SÍ puede ser reentrante. exec NO crea proceso nuevo, solo reemplaza; no devuelve PID.",
  },
  {
    id: "so_2024jul_q8_redir",
    exam: "2024-07",
    topic: "procesos",
    type: "text",
    points: 7,
    question:
      "Cuatro códigos que ejecutan 'ls -l /root /home' con redirecciones usando open, close, dup y fork. Para cada código, indica qué va a 'out.txt', 'err.txt' y pantalla. Código 1: solo execv (sin redirección). Código 2: fork + redirección en el hijo. Código 3: redirección + execv. Código 4: redirección + fork + execv.",
    correctAnswer: `Código 1 (sin redirección): pantalla = mensaje1 + mensaje2. out.txt = vacío. err.txt = vacío.

Código 2 (fork, hijo redirige): el padre ejecuta execv sin redirección → pantalla = mensaje1+mensaje2. El hijo redirige fd1 y fd2 a err.txt, luego execv → err.txt = mensaje1+mensaje2.

Código 3 (redirige, luego execv): stdout(1) y stderr(2) redirigidos a err.txt. execv ejecuta ls → err.txt = mensaje1+mensaje2.

Código 4 (redirige, fork, execv en hijo): el padre redirige stdout/stderr a err.txt ANTES del fork. El hijo hereda la redirección y ejecuta execv → todo va a err.txt = mensaje1+mensaje2.`,
    explanation:
      "close(1); dup(df2) hace que el descriptor 1 apunte al fichero df2. close(2); dup(1) redirige stderr al mismo sitio. Las redirecciones hechas antes de fork() son heredadas por el hijo.",
  },
  {
    id: "so_2024jul_q9_sched",
    exam: "2024-07",
    topic: "procesos",
    type: "text",
    points: 5,
    question:
      "Traza de planificación: A B C D A E E E E E E C C D B A A A A A. ¿Es posible una planificación Round Robin de quantum 2? Si es posible, indica una posible duración de ráfagas y tiempos de llegada.",
    correctAnswer: `SÍ, es posible con quantum 2.

Una solución (no única):
Proceso A: llegada 0, ráfagas: 1-(3)-1-(10)-5
Proceso B: llegada 1, ráfagas: 1-(12)-1
Proceso C: llegada 2, ráfagas: 1-(8)-2
Proceso D: llegada 3, ráfagas: 1-(9)-1
Proceso E: llegada 5, ráfagas: 6

Otras soluciones válidas: A,B,C,D llegan en t=0 en orden A,B,C,D; primera E/S de A dura 1 (E llega en t=3); etc.`,
    explanation:
      "Con quantum 2, la traza muestra que cada proceso ejecuta 1 o 2 unidades antes de ceder la CPU. Los paréntesis representan ráfagas de E/S donde el proceso se bloquea. La solución no es única: hay múltiples combinaciones de llegadas y duraciones de E/S compatibles con la traza.",
  },
  {
    id: "so_2024jul_q10_creds",
    exam: "2024-07",
    topic: "procesos",
    type: "text",
    points: 5,
    repeated: true,
    question:
      "a.out y f1.txt son del usuario u2. a.out es ejecutado por u1. Código: df1=open('./f1.txt',O_RDONLY); df2=open('./f1.txt',O_RDWR). Completa la tabla con ruid, euid, y si df1 o df2 son -1 para distintas combinaciones de permisos de a.out y f1.txt.",
    correctAnswer: `| a.out | f1.txt | ruid | euid | df1=-1? | df2=-1? |
| rwxrwxrwx | rwxrwxrwx | u1 | u1 | no | no |
| rwsr-xr-x | rwxr-xr-x | u1 | u2 | no | no |
| rwsr-xr-x | rwxr--r-- | u1 | u2 | no | no |
| rwsr-xr-x | rwsr-xr-x | u1 | u2 | no | no |
| rwsr-xr-x | rwsr--r-- | u1 | u2 | no | no |
| rwsr-xr-x | rws------ | u1 | u2 | no | no |
| rwxr-xr-x | rwxr-xr-x | u1 | u1 | no | sí |
| rwxr-xr-x | rwxr--r-- | u1 | u1 | no | sí |
| rwxr-xr-x | rwsr-xr-x | u1 | u1 | no | sí |
| rwxr-xr-x | rwsr--r-- | u1 | u1 | no | sí |
| rwxr-xr-x | rws------ | u1 | u1 | sí | sí |

Regla: ruid SIEMPRE = u1 (quien ejecuta). Si a.out tiene setuid (rws), euid = u2 (propietario). Si no, euid = u1.
df1 (O_RDONLY): necesita permiso de lectura. df2 (O_RDWR): necesita lectura+escritura.
Cuando euid=u2 se miran permisos de propietario; cuando euid=u1 se miran permisos de otros (asumiendo que u1 no está en el grupo).`,
    explanation:
      "El bit setuid en a.out cambia la credencial efectiva al propietario (u2), dándole acceso según los permisos de propietario de f1.txt. Sin setuid, euid=u1 y se aplican los permisos de 'otros'. O_RDWR requiere ambos permisos de lectura y escritura.",
  },
  // ============================================================
  // JULIO 2022 — Sistema de Ficheros P1: Cálculo bloques
  // ============================================================
  {
    id: "so_2022jul_q1_fs",
    exam: "2022-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 6,
    question:
      "Un sistema de archivos tipo UNIX tiene un tamaño de bloque de 8Kbytes, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 8 bytes. Calcular cuántos bloques de disco son necesarios (en el área de datos) para representar el archivo 'datos' cuando su tamaño es de 8 Gbytes + 32 Mbytes + 8 Kbytes. Discriminar cuántos bloques son de datos y cuántos de índices.",
    correctAnswer: `Tamaño = 8GB + 32MB + 8KB = 8,623,497,216 bytes. Bloque = 8KB = 8,192 bytes.
Nº bloques de datos = 8,623,497,216 / 8,192 = 1,052,673 bloques = 1M + 4K + 1.

Direcciones por bloque índice = 8,192 / 8 = 1,024.
10 directas → 10 bloques.
Indirecta simple: +1,024 → 1,034.
Indirecta doble: +1,024² = +1,048,576 → 1,049,610.
Faltan: 1,052,673 − 1,049,610 = 3,063 bloques → triple indirección: 3 bloques índice 3er nivel.

Nº bloques de índices = 1 (simple) + 1 (doble) + 1,024 (doble 2º) + 1 (triple) + 1 (triple 2º) + 3 (triple 3º) = 1,031.
Fragmentación interna: 0 bytes (división exacta).`,
    explanation:
      "Con bloques de 8KB y direcciones de 8B, cada bloque de índices tiene 1024 entradas. La triple indirección aporta 1024³ bloques. La división es exacta → sin fragmentación.",
  },

  // ============================================================
  // JULIO 2022 — Sistema de Ficheros P3: Bloques lógicos de inodos
  // ============================================================
  {
    id: "so_2022jul_q2_inodo",
    exam: "2022-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 3,
    question:
      "En la partición de disco correspondiente, calcular qué número de bloque lógico corresponde al inodo del directorio raíz (se comienza a contar en el bloque lógico 0), y cuál bloque lógico al inodo del fichero 'datos' (inodo 400), suponiendo: i) El nº de inodo del '/' es el 2, y al fichero 'datos' le corresponde el inodo nº 400 (los inodos se comienzan a numerar a partir de 1). ii) El tamaño de un inodo es de 64 bytes (tamaño bloque = 8Kbytes). iii) El boot ocupa 2 bloques y el superbloque 9 bloques.",
    correctAnswer: `Inodos por bloque = 8,192 / 64 = 128 inodos/bloque.
Área de inodos empieza tras boot + superbloque = 2 + 9 = 11 (bloque 11).

Nº bloque lógico del inodo de '/' (inodo 2):
= 11 + floor((2 − 1) / 128) = 11 + 0 = 11.

Nº bloque lógico del inodo de 'datos' (inodo 400):
= 11 + floor((400 − 1) / 128) = 11 + 3 = 14.`,
    explanation:
      "Los inodos se numeran desde 1. El inodo 1 está en el bloque 11 (primer bloque tras boot+superbloque). Cada bloque tiene 128 inodos. Inodo 400 → bloque 11 + floor(399/128) = 11 + 3 = 14.",
  },

  // ============================================================
  // JULIO 2022 — Memoria Q1: 10 V/F sobre memoria
  // ============================================================
  {
    id: "so_2022jul_q3_memtf",
    exam: "2022-07",
    topic: "memoria",
    type: "matching",
    points: 10,
    question: "Responde V/F (10 preguntas) sobre gestión de memoria:",
    correctAnswer: {
      "Una ventaja de la paginación multinivel frente a un nivel es que reduce referencias a páginas inválidas":
        "F",
      "La TLB permite reducir las referencias a páginas inválidas de los procesos":
        "F",
      "En un sistema con Tabla de Páginas Invertida hay una TP invertida por proceso":
        "F",
      "En Linux, implementar swap como archivo en vez de partición dedicada es más rápido":
        "F",
      "Al volver con éxito de fork() con copy-on-write, se duplican las TP y las páginas R/W del padre en el hijo":
        "F",
      "Una variable estática no puede almacenar el valor devuelto por malloc()":
        "F",
      "Con N marcos, N-1 páginas virtuales y FIFO 2ªO, se producen N-1 o menos fallos":
        "V",
      "Con registros límite sin base: puede ejecutarse código absoluto y con relocalización estática":
        "V",
      "Una función con variables estáticas entre sus locales no usa el stack de usuario":
        "F",
      "Con dir virtual 48 bits, TP 1 nivel, 4 bytes/entrada, 4KB págs → la TP ocupa 2²⁴ páginas":
        "F",
    },
    explanation:
      "La paginación multinivel reduce memoria para TP, no referencias a páginas inválidas. La TLB acelera traducción, no reduce páginas inválidas. TP invertida es global (una por sistema). Swap en archivo añade overhead del sistema de ficheros. fork() con COW solo copia TP (no páginas). Una variable estática SÍ puede almacenar resultado de malloc. FIFO 2ªO con N-1 págs y N marcos: máximo N-1 fallos. Sin registro base, el código absoluto funciona con límites; relocalización estática también. Las estáticas están en segmento datos, no en pila, pero la función sigue usando stack para otras locales. TP 1 nivel: 2^48/2^12=2^36 entradas × 4B = 2^38 bytes / 2^12 = 2^26 páginas (no 2^24).",
  },

  // ============================================================
  // JULIO 2022 — Memoria Q2: Paginación vs Segmentación
  // ============================================================
  {
    id: "so_2022jul_q4_memseg",
    exam: "2022-07",
    topic: "memoria",
    type: "text",
    points: 4,
    question:
      "Sistema con 64 Kbytes de memoria física. El SO y sus estructuras ocupan 16 Kbytes. Hay dos procesos: P1 con 19 Kbytes de código y 5 Kbytes de datos, P2 con 15 Kbytes de código y 8 Kbytes de datos. A) ¿Pueden caber estos procesos en memoria física si se usan páginas de 2 Kbytes? B) ¿Y si se usa segmentación pura?",
    correctAnswer: `A) Paginación: NO caben.
Marcos de 2KB → total marcos físicos = 64KB / 2KB = 32 marcos.
SO ocupa 16KB = 8 marcos.
P1: ceil(19/2) + ceil(5/2) = 10 + 3 = 13 marcos.
P2: ceil(15/2) + ceil(8/2) = 8 + 4 = 12 marcos.
Total = 8 + 13 + 12 = 33 marcos > 32 marcos disponibles.

B) Segmentación pura: SÍ caben.
Se asigna cada segmento con su tamaño exacto:
Total = 16KB (SO) + 19KB (código P1) + 5KB (datos P1) + 15KB (código P2) + 8KB (datos P2) = 63KB < 64KB.`,
    explanation:
      "Con paginación hay fragmentación interna: cada página se asigna completa aunque no se use. Con segmentación, los segmentos tienen el tamaño exacto necesario, aprovechando mejor la memoria.",
  },

  // ============================================================
  // JULIO 2022 — Memoria Q3: Cálculo TLB
  // ============================================================
  {
    id: "so_2022jul_q5_tlb",
    exam: "2022-07",
    topic: "memoria",
    type: "text",
    points: 3.5,
    question:
      "Considere una arquitectura de memoria con un TLB con tiempo de acceso de 1ns (tanto para acierto como para fallo en el TLB), tablas de páginas en 4 niveles con 512 entradas cada una. El tiempo de acceso a memoria es 100ns. Suponga que no hay fallos de página a disco. ¿Qué porcentaje de acierto en el TLB se necesita para tener un tiempo efectivo de acceso a memoria de 110 ns?",
    correctAnswer: `T_acceso = T_TLB + T_mem
Con acierto TLB (HR): 1ns (TLB) + 100ns (mem) = 101ns
Con fallo TLB (1−HR): 1ns (TLB) + 4 × 100ns (4 niveles TP) + 100ns (mem) = 501ns

HR × 101 + (1 − HR) × 501 = 110
101·HR + 501 − 501·HR = 110
391 = 400·HR
HR = 391/400 = 0.9775 = 97.75%`,
    explanation:
      "Con 4 niveles de TP, cada fallo de TLB requiere recorrer los 4 niveles (4 accesos a memoria) más el acceso al dato (1 acceso). Con acierto solo se necesita el acceso al dato.",
  },

  // ============================================================
  // JULIO 2022 — Memoria Q4: V/F sobre registros base+límite
  // ============================================================
  {
    id: "so_2022jul_q6_membase",
    exam: "2022-07",
    topic: "memoria",
    type: "matching",
    points: 2.5,
    question:
      "Considera el esquema de gestión de memoria con un registro base y un registro límite. Responde V/F (5 preguntas):",
    correctAnswer: {
      "No proporciona relocalización dinámica": "F",
      "No proporciona protección de la memoria": "F",
      "El espacio lógico de direcciones de un proceso es contiguo": "V",
      "Puede tener el problema de fragmentación externa": "V",
      "Un proceso sólo puede tener un segmento": "V",
    },
    explanation:
      "Base+límite SÍ proporciona relocalización dinámica (dirección lógica + base = física) y SÍ proporciona protección (comprobación contra el límite). El espacio lógico es contiguo (un solo segmento). La fragmentación externa aparece al asignar/liberar segmentos de distinto tamaño.",
  },

  // ============================================================
  // JULIO 2022 — E/S Q1: V/F sobre Entrada/Salida
  // ============================================================
  {
    id: "so_2022jul_q7_estf",
    exam: "2022-07",
    topic: "entrada-salida",
    type: "matching",
    points: 5,
    question: "Responde V/F (5 preguntas) sobre Entrada/Salida:",
    correctAnswer: {
      "La capa de software independiente del dispositivo calcula qué bloque contiene el i-ésimo byte de un fichero":
        "V",
      "En una operación de salida, el registro de control indica si el dato ya fue transferido al dispositivo":
        "F",
      "Un disco duro con 4 caras y 4096 pistas por cara tiene 1024 cilindros":
        "F",
      "Los minor numbers de /dev/sda1 y /dev/sdb1 son idénticos": "F",
      "El uso de dispositivos mapeados a memoria requiere instrucciones especiales como IN":
        "F",
    },
    explanation:
      "La capa independiente del dispositivo traduce offsets a bloques lógicos. El registro de estado (no control) indica transferencia completada. Con 4 caras = 4096 cilindros (no 1024). /dev/sda1 y /dev/sdb1 son particiones de discos distintos → minor numbers diferentes. Los dispositivos memory-mapped usan loads/stores normales, no instrucciones especiales de E/S.",
  },

  // ============================================================
  // JULIO 2022 — E/S Q2: Planificación de disco
  // ============================================================
  {
    id: "so_2022jul_q8_disk",
    exam: "2022-07",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "La cola de peticiones de E/S para acceder a cilindros de un disco contiene las peticiones [166, 100, 160, 77, 135, 12], tras haber atendido las peticiones [110] y [115] (en este orden). Indique en qué orden se atenderán las restantes peticiones con SSTF, C-LOOK y SCAN.",
    correctAnswer: `Atendidos 110 → 115. Ascensor está en 115 subiendo.

SSTF (más cercano primero):
115 → 100 (dist 15) → 77 (dist 23) → 135 (dist 58) → 160 (dist 25) → 166 (dist 6) → 12 (dist 154).
Orden: 100, 77, 135, 160, 166, 12

C-LOOK (solo sube, salta al mínimo):
Subiendo desde 115: 135 → 160 → 166. Salta a 12 → 77 → 100.
Orden: 135, 160, 166, 12, 77, 100

SCAN (sube, luego baja):
Subiendo desde 115: 135 → 160 → 166. Bajando: 100 → 77 → 12.
Orden: 135, 160, 166, 100, 77, 12`,
    explanation:
      "110→115 indica dirección ascendente. SSTF siempre elige el más cercano. C-LOOK solo atiende en subida y salta al mínimo. SCAN barre en ambos sentidos: sube hasta el máximo y luego baja.",
  },

  // ============================================================
  // JULIO 2022 — E/S Q3: AIO + pread
  // ============================================================
  {
    id: "so_2022jul_q9_aio",
    exam: "2022-07",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question:
      "El fichero 'a.dat' contiene 'ABCDEFGHIJKL\\n'. ¿Qué se escribe en pantalla en las llamadas a printf de las líneas lin.08 y lin.17?\n\nCódigo:\nint fd = open('a.dat', O_RDONLY);\nchar BUF1[5] = {'\\0','\\0','\\0','\\0'};\nchar BUF2[5] = {'\\0','\\0','\\0','\\0'};\nret1 = pread(fd, BUF1, 4, 2);\nprintf('%s==%ld', BUF1, ret1); // lin.08\n\naio.aio_fildes = fd; aio.aio_buf = BUF2; aio.aio_nbytes = 4;\naio.aio_offset = 1; aio.aio_sigevent.sigev_notify = SIGEV_NONE;\nret2 = aio_read(&aio);\nwhile(aio_error(&aio) == EINPROGRESS);\nret3 = aio_return(&aio);\nprintf('%s==%ld', BUF2, ret2); // lin.17",
    correctAnswer: `printf lin.08: CDEF==4

pread lee 4 bytes desde offset 2 del fichero → 'C','D','E','F' en BUF1. ret1 = 4 (bytes leídos).
El carácter nulo en BUF1[4] termina la cadena.

printf lin.17: BCDE==0

aio_read inicia lectura asíncrona de 4 bytes desde offset 1 → 'B','C','D','E' en BUF2.
ret2 = 0 (aio_read devuelve 0 si la petición se encola correctamente; −1 si hay error).
ret3 = 4 (aio_return devuelve los bytes leídos, pero no se imprime).`,
    explanation:
      "pread() lee desde offset absoluto sin modificar el file pointer. aio_read() inicia lectura asíncrona y devuelve 0 en éxito (la petición se encoló). aio_return() obtiene el resultado cuando termina. El while espera activamente a que termine la operación.",
  },

  // ============================================================
  // JULIO 2022 — Procesos Q1: 8 V/F sobre procesos
  // ============================================================
  {
    id: "so_2022jul_q10_proctf",
    exam: "2022-07",
    topic: "procesos",
    type: "matching",
    points: 8,
    question: "Responde V/F (8 preguntas) sobre procesos:",
    correctAnswer: {
      "En un proceso de root, las llamadas a funciones de la librería matemática son en modo usuario":
        "V",
      "Mientras quede memoria libre en el sistema, una llamada a fork() crea un proceso":
        "V",
      "En UNIX con 3 usuarios ejecutando el mismo navegador, hay una sola copia del código en memoria":
        "V",
      "La llamada fork() nunca devuelve 1": "V",
      "El root puede crear enlaces simbólicos entre procesos de distintos usuarios":
        "F",
      "El código de la ISR de teclado se ejecuta SIEMPRE en modo kernel": "V",
      "Si 'file' existe y tiene permiso de ejecución, execv() no devuelve nada":
        "F",
      "Un fichero setuid del root solo puede ser ejecutado por un proceso con credencial efectiva de root":
        "F",
    },
    explanation:
      "Las funciones de librería (incluyendo math) son código de usuario. fork() crea proceso mientras haya recursos. El código se comparte entre procesos (read-only). fork() devuelve 0 al hijo o PID>0 al padre, nunca 1. Root no puede crear enlaces simbólicos 'entre procesos' (los symlinks son entre ficheros, no procesos). Las ISR se ejecutan en modo kernel. execv SÍ devuelve −1 en caso de error (no es que 'no devuelva nada'). Cualquier usuario puede ejecutar un setuid root.",
  },

  // ============================================================
  // JULIO 2022 — Procesos Q2: fork + execl
  // ============================================================
  {
    id: "so_2022jul_q11_forkexecl",
    exam: "2022-07",
    topic: "procesos",
    type: "text",
    points: 6,
    question:
      "Sea el siguiente código en C, con todos los includes necesarios y que compila correctamente. Se supone que ni execl ni fork producen error.\n\n#define VECES 3\nint Valor;\nmain(int argc, char *argv[]) {\n  pid_t pid;\n  Valor = 2022;\n  for (i = 0; i < VECES; i++) {\n    pid = fork() + fork();\n    if (execl('./b.out', './b.out', NULL) == -1)\n      exit(0);\n    printf('/%d/\\n', Valor);\n  }\n}\n\n/* Código de b.out */\nint Valor;\nmain(int argc, char *argv[]) {\n  printf('/%d/\\n', Valor);\n}\n\na) ¿Cuántas líneas de salida produce?\nb) ¿Cuántas de ellas son '/0/'?",
    correctAnswer: `a) 4 líneas de salida.

En la primera iteración (i=0): fork()+fork() crea 3 procesos hijos (total 4 procesos). Los 4 procesos llegan al execl('./b.out',...). Como execl tiene éxito, reemplaza la imagen de los 4 procesos por b.out. Ninguno llega al printf('/%d/', Valor) del programa original.

b) Las 4 líneas son '/0/'.

b.out tiene una variable global 'Valor' sin inicializar (extern). En C, las variables globales no inicializadas se inicializan a 0. Cada uno de los 4 procesos ejecuta b.out e imprime '/0/'.`,
    explanation:
      "fork()+fork() en una línea crea 3 hijos (total 4 procesos). execl() exitoso reemplaza el código → nunca se ejecuta el printf del padre. b.out imprime Valor=0 (global sin inicializar).",
  },

  // ============================================================
  // JULIO 2022 — Procesos Q3: Planificación multicolas
  // ============================================================
  {
    id: "so_2022jul_q12_sched",
    exam: "2022-07",
    topic: "procesos",
    type: "text",
    points: 6,
    question:
      "Un sistema tiene tres tipos de procesos:\n- RT (tiempo real): prioridades máximas, planificación por prioridades estáticas apropiativas (mayor número = mayor prioridad).\n- IT (interactivos): prioridad estática 0, round-robin quantum 300ms.\n- IDLE: mínima prioridad, solo se ejecutan si no hay ningún otro proceso listo. Entre ellos SRTF.\n\nProcesos:\nA: RT, PRI=20, AT=0, ráfagas 300-(700)-200\nB: RT, PRI=25, AT=200, ráfagas 300-(900)-100\nC: RT, PRI=30, AT=400, ráfagas 100-(300)-100-(400)-100\nD: IT, PRI=0, AT=900, ráfagas 400-(200)-500\nE: IDLE, PRI=-1, AT=500, ráfagas 400\nF: IDLE, PRI=-1, AT=1200, ráfagas 100-(100)-100\n\nIndica cuál es la planificación correcta (entre 4 opciones).",
    correctAnswer: `La planificación correcta es la 3.

CPU: A A B B C B A E C D D D D C A B A D D D D D F E F E E

Explicación:
- t=0-199: A (RT, prio 20) ejecuta.
- t=200: Llega B (RT, prio 25 > 20) → expropia a A. B ejecuta.
- t=400: Llega C (RT, prio 30 > 25) → expropia a B. C ejecuta.
- t=500: C termina 1ª ráfaga (100ms) y va a E/S 300ms. B (prio 25) retoma.
- t=600: B termina 1ª ráfaga (300ms) y va a E/S 900ms. A (prio 20) retoma.
- t=700: A termina 1ª ráfaga (300ms) y va a E/S 700ms. No hay RT listos.
- t=700-900: E (IDLE) ejecuta 200ms.
- t=800: C vuelve de E/S (RT, prio 30) → expropia a E. C ejecuta 100ms, va a E/S 400ms.
- t=900: Aún no hay RT listos. Llega D (IT). D ejecuta (RR quantum 300).
- t=900-1200: D ejecuta 300ms (quantum), luego lo expropia... pero como no hay otros IT, sigue. D ejecuta 400ms, va a E/S 200ms.
- t=1100: C vuelve (RT, prio 30) → expropia. C ejecuta 100ms, va a E/S 400ms.
- t=1200: No hay RT listos. A vuelve (RT, prio 20) → ejecuta 200ms. A termina.
- t=1400: B vuelve (RT, prio 25) → ejecuta 100ms. B termina.
- t=1500: D vuelve (IT) → ejecuta 500ms (RR, nadie compite). D termina.
- t=2000: F (IDLE) ejecuta 100ms, va a E/S 100ms. E ejecuta lo que falta.
- t=2100: F vuelve, ejecuta 100ms. E ejecuta. Alternan IDLE con SRTF.

Las planificaciones 1 y 4 son incorrectas porque tratan las prioridades RT como no apropiativas. La 2 es incorrecta porque en t=1200 F (IDLE) se ejecuta habiendo D (IT) listo.`,
    explanation:
      "RT tiene prioridad absoluta sobre IT e IDLE. Entre RT, prioridad numérica mayor gana y es apropiativo. IT usa RR quantum 300. IDLE solo cuando no hay RT ni IT listos. La planificación 3 respeta todas estas reglas.",
  },

  // ============================================================
  // 2021-01 NUEVAS — Memoria Q1: 10 V/F
  // ============================================================
  {
    id: "so_2021_q14_memtf",
    exam: "2021-01",
    topic: "memoria",
    type: "matching",
    points: 10,
    question: "Responde V/F sobre gestión de memoria:",
    correctAnswer: {
      "En la pila del proceso está el código de las funciones recursivas cuando se llaman":
        "F",
      "Cuando se ejecuta un programa C, las variables locales del main() están en la pila del proceso":
        "V",
      "Para un proceso con varios hilos, los hilos comparten código, datos y pila":
        "F",
      "El código de la función de librería malloc usada en un programa C está en el espacio de direcciones del proceso":
        "V",
      "Con tabla de páginas de 3 niveles (sin caché ni TLB), ejecutar una instrucción que suma una constante a un registro implica exactamente 3 accesos a memoria":
        "F",
      "Con TP de 3 niveles (raíz no fija en memoria) y procesador con caché y TLB, ejecutar una instrucción puede implicar 4 accesos a memoria":
        "V",
      "Si las direcciones físicas son de 32 bits y las páginas de 4KB, el número de página virtual necesariamente viene dado por 20 bits":
        "F",
      "En un sistema con segmentación sin paginación (segmentación pura), es posible implementar memoria virtual":
        "V",
      "Con Tabla de Páginas Invertida, los sistemas operativos no podrían resolver los fallos de página de los procesos":
        "F",
      "Para un proceso cuyo espacio virtual ocupa N páginas, el algoritmo FIFO produce siempre los mismos fallos con N marcos que con N+1":
        "V",
    },
    explanation:
      "La pila contiene marcos de activación (datos), no el código de funciones. Los hilos comparten código y datos pero NO la pila (cada hilo tiene su propia pila). malloc está en el espacio de direcciones del proceso (librería enlazada), no en el kernel. Sin TLB ni caché, 3 niveles de TP requieren 3 accesos para traducción + 1 acceso para la instrucción = 4 accesos, no 3. Con TLB+caché puede haber fallos y requerir múltiples accesos. El nº de página virtual no depende del tamaño de dirección física. La segmentación pura permite swapping de segmentos (memoria virtual). La TP invertida SÍ permite resolver fallos de página. Con N páginas virtuales y N o N+1 marcos, FIFO produce N fallos en ambos casos (todos los fallos son de cold start).",
  },

  // ============================================================
  // 2021-01 NUEVAS — Procesos Q3: FCFS/SRTF scheduling
  // ============================================================
  {
    id: "so_2021_q12_sched",
    exam: "2021-01",
    topic: "procesos",
    type: "text",
    points: 5,
    question:
      "En un sistema hay dos procesos A y B con duraciones 4-(5)-3 (ráfaga CPU de 4, seguida de E/S de 5, seguida de CPU de 3) y 2-(4)-1 (ráfaga CPU de 2, seguida de E/S de 4, seguida de CPU de 1) respectivamente. Los instantes de llegada son 0 para A y 1 para B. Rellena la tabla con el tiempo de retorno para A, tiempo de retorno para B y el porcentaje de uso de la CPU (en %), para los casos de multiprogramación con FCFS, multiprogramación con SRTF y NO multiprogramación.",
    correctAnswer: `|   | FCFS | SRTF | NO Multiprogram |
| --- | --- | --- | --- |
| Tiempo Retorno A | 12 | 14 | 12 |
| Tiempo Retorno B | 12 | 7 | 18 |
| Uso de CPU (%) | 76.9 | 71.4 | 52.6 |

FCFS: A ejecuta 4 (t=0-4). B llega t=1, espera. A va a E/S 5 (t=4-9). B ejecuta 2 (t=4-6). B va a E/S 4 (t=6-10). CPU idle (t=6-9). A vuelve t=9, ejecuta 3 (t=9-12). A termina t=12. B vuelve t=10, espera CPU. B ejecuta 1 (t=12-13). B termina t=13. Retorno A=12, B=12 (13−1). CPU = (4+2+3+1)/13 = 10/13 = 76.9%.

SRTF: t=0, solo A ejecuta 1. t=1, llega B con ráfaga 2 < A restante 3 → B ejecuta 2 (t=1-3). B va a E/S 4 (t=3-7). A ejecuta 3 restantes (t=3-6). A va a E/S 5 (t=6-11). CPU idle (t=6-7). B vuelve t=7, ejecuta 1 (t=7-8). B termina t=8. CPU idle (t=8-11). A vuelve t=11, ejecuta 3 (t=11-14). A termina t=14. Retorno A=14, B=7 (8−1). CPU = (1+2+3+1+3)/14 = 10/14 = 71.4%.

NO Multiprogram: A ejecuta 4 (t=0-4), E/S 5 (t=4-9), CPU 3 (t=9-12). A termina t=12. B ejecuta 2 (t=12-14), E/S 4 (t=14-18), CPU 1 (t=18-19). B termina t=19. Retorno A=12, B=18 (19−1). CPU = (4+3+2+1)/19 = 10/19 = 52.6%.`,
    explanation:
      "En FCFS, A no es expropiado por B aunque B tenga ráfaga más corta. En SRTF, B expropia a A en t=1 porque le queda menos CPU. En no multiprogramación, los procesos se ejecutan secuencialmente (primero A completo, luego B).",
  },

  // ============================================================
  // 2021-01 NUEVAS — E/S Q4: pread/read code (Opción A)
  // ============================================================
  {
    id: "so_2021_q13_pread",
    exam: "2021-01",
    topic: "entrada-salida",
    type: "text",
    points: 2.5,
    question:
      "El fichero 'fichero.txt' contiene '012345678901234567890\\n'. ¿Cuál será el contenido de BUF[i] (i=0..4) tras ejecutar la instrucción en la línea 08 del siguiente programa?\n\nchar BUF[5] = {'-', '-', '-', '-', '\\0'};\nint fd = open(\"fichero.txt\", O_RDONLY);\nint fd2 = dup(fd);\nlseek(fd2, 2, SEEK_SET);\npread(fd, BUF, 1, 0);\nlseek(fd, 2, SEEK_CUR);\npread(fd, BUF+1, 3, 1);",
    correctAnswer: `Tras línea 08: BUF = {'0', '1', '2', '3', '\\0'}

Paso a paso:
1. open → fd=3. dup(fd) → fd2=4 (comparten file pointer).
2. lseek(fd2, 2, SEEK_SET) → file pointer de fd y fd2 = 2.
3. pread(fd, BUF, 1, 0) → lee desde offset absoluto 0: '0'. BUF={'0','-','-','-','\\0'}. pread NO modifica el file pointer.
4. lseek(fd, 2, SEEK_CUR) → file pointer = 2+2 = 4.
5. pread(fd, BUF+1, 3, 1) → lee desde offset absoluto 1: '1','2','3'. BUF={'0','1','2','3','\\0'}.`,
    explanation:
      "pread() lee desde un offset absoluto sin modificar el puntero de posición del fichero. dup() hace que fd y fd2 compartan el mismo file pointer. lseek() modifica la posición compartida.",
  },

  // ============================================================
  // 2021-07 NUEVAS — FS P2: Code analysis
  // ============================================================
  {
    id: "so_2021jul_q7_fscode",
    exam: "2021-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    repeated: true,
    question:
      "Código sobre '/home/usr1/datos' (8GB+32MB+1024B, hard links=2): chmod 0752, printf permisos, link crea datos2, open datos O_RDONLY (fd1), open datos2 O_RDONLY (fd2), lseek fd2 4.000.000, c1=fgetc(fd1), c2=fgetc(fd2), close, unlink datos. Cachés vacías, entrada usr1 en 7º bloque de home. Responde: A) Valor de fd2. B) Accesos a disco en 1ª apertura. C) Bloques leídos para c2. D) Permisos impresos en rwxrwxrwx. E) Hard links de 'datos' tras unlink.",
    correctAnswer: `A) 4 (fd1=3, fd2=4)

B) 9 accesos (raíz, home, 7º bloque de home para usr1, datos = 4 bloques de directorio + 5 bloques de índices)

C) 2 bloques (4.000.000 está en zona de indirección simple → 1 bloque índice + 1 bloque datos)

D) rwx r-x -w- (0752: owner=7=rwx, group=5=r-x, others=2=-w-)

E) 2 (inicialmente 2 hard links; link crea datos2 → 3; unlink datos → 2)`,
    explanation:
      "link crea un hard link → el contador de hard links del inodo pasa a 3. Al hacer unlink de 'datos', el contador baja a 2 (queda 'datos2'). El fichero no se borra porque el contador no llega a 0.",
  },

  // ============================================================
  // 2021-07 NUEVAS — Memoria Q2: FIFO 2ª Oportunidad
  // ============================================================
  {
    id: "so_2021jul_q8_fifo2",
    exam: "2021-07",
    topic: "memoria",
    type: "text",
    points: 4,
    question:
      "Un proceso tiene la cadena de referencias: 4 3 4 5 1 4 2 1 3 4 1 4 y 3 marcos asignados. Las 4 primeras referencias (4,3,4,5) producen 3 fallos (4, 3 y 5, ya que 4 ya está en memoria en la 3ª referencia). ¿Número total de fallos con FIFO Segunda Oportunidad?",
    correctAnswer: `Simulación FIFO 2ª Oportunidad con 3 marcos:
1. 4 → F [4*, -, -]
2. 3 → F [4*, 3*, -]
3. 4 → Hit, R(4)=1 [4*, 3*, -]
4. 5 → F, el más antiguo es 4 (R=1) → segunda oportunidad: R(4)=0, pasa al final [3*, 5*, 4]
5. 1 → F, el más antiguo es 3 (R=1) → segunda oportunidad: R(3)=0, pasa al final [5*, 4, 3]. Siguiente: 5 (R=1) → R(5)=0, pasa al final [4, 3, 5]. Siguiente: 4 (R=0) → se reemplaza [1*, 3, 5]
6. 4 → F, 3 (R=0) se reemplaza [1*, 4*, 5]
7. 2 → F, 5 (R=0) se reemplaza [1*, 4*, 2*]
8. 1 → Hit, R(1)=1 [1*, 4*, 2*]
9. 3 → F, 4 (R=1) → R(4)=0, al final [1*, 2*, 4]. Siguiente: 2 (R=1) → R(2)=0, al final [1*, 4, 2]. Siguiente: 1 (R=1) → R(1)=0, al final [4, 2, 1]. Todos tienen R=0, se reemplaza el primero [3*, 2, 1]
10. 4 → F, 2 (R=0) se reemplaza [3*, 4*, 1]
11. 1 → Hit, R(1)=1 [3*, 4*, 1*]
12. 4 → Hit, R(4)=1 [3*, 4*, 1*]

Total: 8 fallos de página.`,
    explanation:
      "FIFO 2ª Oportunidad (algoritmo del reloj) da una segunda vida a páginas con bit R=1 antes de reemplazarlas, bajando su bit R a 0 y enviándolas al final de la cola. En esta cadena se evitan fallos en las referencias 1 y 4 del final gracias a esto.",
  },

  // ============================================================
  // 2021-07 NUEVAS — Procesos Q1: Planificación inversa
  // ============================================================
  {
    id: "so_2021jul_q9_schedinv",
    exam: "2021-07",
    topic: "procesos",
    type: "text",
    points: 8,
    repeated: true,
    question:
      "Sistema monoprocesador con 3 colas: SY (RR quantum 3, prioridad máxima), IT (RR quantum 1), NI (SJF, prioridad mínima). Planificación entre colas por prioridades apropiativas. Dada la traza de CPU: A A A B B C D C D C - B B A A A B B F F G G D C G G G, deduce las duraciones de ráfagas y los intervalos de llegada de cada proceso. A y B son SY, C y D son IT, F y G son NI. La E/S de cada proceso debe ser la mínima compatible con la planificación.",
    correctAnswer: `| Proceso | Ráfagas | Tiempo de llegada | Tipo |
| --- | --- | --- | --- |
| A | 3-(8)-3 | 0 | SY |
| B | 2-(6)-2-(1)-2 | 0-3 | SY |
| C | 3-(12)-1 | 0-5 | IT |
| D | 2-(13)-1 | 0-6 | IT |
| F | 2 | 11-18 | NI |
| G | 5 | 11-20 | NI |

Explicación:
- A ejecuta 3 (quantum 3) → va a E/S 8. B ejecuta 2 (quantum 3, pero solo necesita 2) → va a E/S 6.
- C y D (IT) ejecutan intercalados con quantum 1. C ejecuta 3, D ejecuta 2 en sus primeras ráfagas.
- Ambos van a E/S: C 12, D 13. Hay un hueco de CPU (el '-' en la traza) donde no hay procesos listos.
- B vuelve de E/S y ejecuta 2 → va a E/S 1 (mínima para que A vuelva antes).
- A vuelve y ejecuta 3. B vuelve y ejecuta 2.
- F y G (NI, SJF): F(2) es más corto que G(5) → F ejecuta primero. Luego G ejecuta.
- D y C vuelven de E/S: D ejecuta 1, C ejecuta 1. G termina sus 5 unidades restantes.`,
    explanation:
      "La traza de CPU permite deducir las ráfagas observando cuántas unidades consecutivas ejecuta cada proceso. La E/S mínima se deduce de los huecos en la traza. Los procesos NI solo ejecutan cuando SY e IT están en E/S.",
  },

  // ============================================================
  // 2021-07 NUEVAS — Procesos Q3: 6 V/F
  // ============================================================
  {
    id: "so_2021jul_q10_proctf",
    exam: "2021-07",
    topic: "procesos",
    type: "matching",
    points: 6,
    repeated: true,
    question: "Responde V/F sobre procesos:",
    correctAnswer: {
      "Los algoritmos apropiativos desperdician más tiempo en cambios de contexto":
        "V",
      "Un programa ejecutado por root pasa más tiempo en modo kernel que si lo ejecuta un usuario normal":
        "F",
      "En un sistema donde solo hay un proceso listo, bajarle la prioridad hace que tarde más en ejecutarse":
        "F",
      "Un usuario normal, que no es del grupo root, puede ejecutar un fichero setuid y setgid del root con permisos rwsr-sr-x":
        "V",
      "Los algoritmos con prioridades no apropiativas no tienen inanición (starvation)":
        "F",
      "Un bucle de llamadas exec puede llenar la tabla de procesos del sistema":
        "F",
    },
    explanation:
      "Los algoritmos apropiativos generan más cambios de contexto por expropiación. El tiempo en modo kernel depende de las llamadas al sistema, no de quién ejecuta. Si solo hay un proceso, la prioridad no afecta (siempre obtiene la CPU). setuid permite ejecutar con la credencial del propietario. Los algoritmos con prioridades no apropiativas SÍ pueden tener inanición (un proceso de baja prioridad nunca ejecuta si siempre hay procesos de mayor prioridad). exec no crea procesos nuevos, solo reemplaza la imagen del actual → no puede llenar la tabla de procesos.",
  },

  // ============================================================
  // 2021-07 NUEVAS — E/S Q1 Opción B: 5 V/F
  // ============================================================
  {
    id: "so_2021jul_q11_estf",
    exam: "2021-07",
    topic: "entrada-salida",
    type: "matching",
    points: 5,
    question: "Responde V/F sobre Entrada/Salida (Opción B):",
    correctAnswer: {
      "Al llamar a open para abrir un fichero en modo lectura, el device driver verifica los permisos del fichero":
        "F",
      "La capa de software a nivel de usuario asigna un nuevo bloque al escribir y no cabe en el último":
        "F",
      "Cola [26, 124, 126, 100, 160, 77] atendidos [100] y [77] puede ser SSTF":
        "V",
      "Disco 32768 sect, 2 platos, 2 caras, 32 sect/pista → 256 cilindros": "V",
      "Tras open+read+lseek(0)+read, a y b contienen el mismo valor": "V",
    },
    explanation:
      "La verificación de permisos la hace la capa de software independiente del dispositivo, no el driver. La asignación de bloques la hace el sistema de ficheros (capa independiente), no el software de usuario. Desde 100, la más cercana es 77 (distancia 23) → SSTF es posible. 32768/32=1024 pistas, 2×2=4 caras, 1024/4=256 cilindros. Tras lseek(0,SEEK_SET), el segundo read también lee el primer byte.",
  },

  // ============================================================
  // 2021-07 NUEVAS — E/S Q2 Opción B: AIO code
  // ============================================================
  {
    id: "so_2021jul_q12_aio2",
    exam: "2021-07",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question:
      "Fichero 'file.txt' contiene 'ABCDEFGHIJK\\n'. Código: struct aiocb aio; char BUF[5]={'\\0','\\0','\\0','\\0','\\0'}; fd=open('file.txt',O_RDONLY); aio.aio_fildes=fd; aio.aio_buf=BUF; aio.aio_nbytes=4; aio.aio_offset=0; aio_read(&aio); while(aio_error(&aio)==EINPROGRESS); leidos=aio_return(&aio); printf('%lu==%s', leidos, BUF). ¿Qué imprime?",
    correctAnswer: `Imprime: 4==ABCD

Explicación:
1. aio_read inicia lectura asíncrona de 4 bytes desde offset 0. BUF recibe "ABCD".
2. while(aio_error==EINPROGRESS) espera activa hasta que termine la operación.
3. aio_return devuelve 4 (bytes efectivamente leídos).
4. printf imprime "4==ABCD".`,
    explanation:
      "AIO (Asynchronous I/O) permite iniciar E/S y continuar ejecutando. aio_error comprueba el estado (EINPROGRESS = en curso). aio_return obtiene los bytes leídos. Esta es la variante Opción B que imprime los bytes leídos primero (formato '4==ABCD').",
  },

  // ============================================================
  // 2021-07 NUEVAS — E/S Q3: Redirección
  // ============================================================
  {
    id: "so_2021jul_q13_redir",
    exam: "2021-07",
    topic: "entrada-salida",
    type: "text",
    points: 7,
    question:
      'Dado el programa, asumiendo que file1.dat contiene \'0123456789\\n\' y file2.dat no existe. Completa A) la tabla de descriptores tras línea 13, y B) indica qué sucede al ejecutar la línea 15.\n\nifd = open("file1.dat", O_RDONLY);  // ifd=3\nofd = open("file2.dat", O_WRONLY|O_CREAT, 0666);  // ofd=4\nbk = dup(STDOUT_FILENO);     // bk=5 (stdout)\nclose(STDOUT_FILENO);        // cierra fd 1\ndup(ifd);                     // fd 1 = file1.dat\nclose(STDIN_FILENO);          // cierra fd 0\ndup(ofd);                     // fd 0 = file2.dat\nwhile (read(STDOUT_FILENO, buf+i, 1)) i++;  // lee de fd 1 (file1.dat)\nwrite(STDIN_FILENO, buf, i);  // escribe a fd 0 (file2.dat)\nclose(STDIN_FILENO);          // cierra fd 0\ndup(bk);                      // fd 0 = stdout\nwrite(STDIN_FILENO, "done\\n", 5);  // línea 15',
    correctAnswer: `A) Tabla de descriptores tras línea 13:
| fd | apunta a |
| --- | --- |
| 0 | stdout (pantalla) |
| 1 | file1.dat |
| 2 | stderr |
| 3 | file1.dat |
| 4 | file2.dat |
| 5 | stdout (pantalla) |

B) La línea 15 escribe "done\\n" en pantalla.

Explicación:
- Tras close(0) y dup(bk), fd 0 apunta a stdout (pantalla).
- write(STDIN_FILENO, "done\\n", 5) escribe en fd 0, que ahora es stdout.
- Por tanto, "done\\n" se muestra en pantalla.`,
    explanation:
      "El programa redirige stdout (fd 1) a file1.dat y stdin (fd 0) a file2.dat. Lee de file1.dat vía fd 1 (STDOUT_FILENO) y escribe a file2.dat vía fd 0 (STDIN_FILENO). Tras cerrar fd 0 y hacer dup(bk), fd 0 apunta a la pantalla. La línea 15 escribe a fd 0, que ahora es stdout → 'done\\n' en pantalla.",
  },
];
