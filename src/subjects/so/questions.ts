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

  // 2020-01 — P2 superbloque
  {
    id: "so_2020_q2",
    exam: "2020-01",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 4,
    question: "Sistema UNIX con bloque 2KB. Boot ocupa los 3 primeros bloques de la partición. Superbloque comienza en bloque lógico 3. Fichero 'datos' tiene inodo 643 y ocupa el bloque lógico 33. Tamaño del inodo: 64 bytes. Calcula el tamaño del superbloque (en KB) y el bloque lógico correspondiente al inodo 3201.",
    correctAnswer: `Inodos por bloque = 2048/64 = 32 inodos/bloque.
El inodo 643 está en el bloque: floor(643/32) = 20 (área de inodos, empezando en 0).
Área de inodos empieza tras superbloque (bloque 3).
El fichero "datos" está en bloque 33 → los bloques de inodos van del 3 al 32 (30 bloques).
Tamaño superbloque = 33 − 3 − 20 = 10 bloques = 20 KB.

Inodo 3201: bloque = 3 + 10 + floor(3201/32) = 3 + 10 + 100 = 113.`,
    explanation: "El superbloque contiene metadatos (mapa de inodos/bloques libres). Los inodos empiezan tras el superbloque. Cada bloque tiene 32 inodos de 64 bytes.",
  },

  // 2020-01 — P3 subpreguntas completas
  {
    id: "so_2020_q3_full",
    exam: "2020-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 9,
    question: "Código sobre '/home/juan/so/p1/p1.c' (3MB, inodo 6549): chmod 0420, lstat, open O_RDONLY, link crea practica1.c, symlink crea slink_practica1.c, open practica1.c, lseek(fd2, 2097152, SEEK_SET), fgetc, close, unlink. Cachés vacías, entrada p1 en 8º bloque de so. Responde: A) Accesos a disco en 1ª apertura. B) Valor de fd2. C) Bloques leídos para fgetc(fd2). D) Tamaño de slink_practica1.c. E) ¿fgetc es syscall? F) ¿link es syscall? G) ¿unlink libera el inodo 6549? H) El enlazador encuentra printf en libC? I) Permisos en rwxrwxrwx.",
    correctAnswer: `A) 12 accesos (raíz, home, juan, so(8º bloque), p1, p1.c + 6 accesos índices datos)
B) 4 (fd1=3, fd2=4)
C) 3 bloques (2097152 = 2²¹ → bloque 1024, está en zona de indirección simple → 1 índice + 1 datos = 2, pero con cachés vacías y primera lectura de esa zona se necesita 1 acceso extra = 3)
D) 11 bytes (longitud de "practica1.c")
E) Falso (fgetc es función de libc, no llamada al sistema)
F) Cierto (link es llamada al sistema)
G) Cierto (unlink borra entrada p1.c pero quedan hard links → inodo no se libera)
H) Cierto (el enlazador linka printf desde libC, estática o dinámicamente)
I) r-- -w- --- (0420: owner=4=r--, group=2=-w-, others=0=---)`,
    explanation: "P3 completo del examen. Combina cálculo de accesos a disco, descriptores de fichero, bloques de índices, symlinks, syscalls vs funciones de librería, y permisos UNIX.",
  },

  // 2020-01 — Procesos Q2: planificación multicolas
  {
    id: "so_2020_q7_sched",
    exam: "2020-01",
    topic: "procesos",
    type: "text",
    points: 7,
    question: "Sistema monoprocesador con 3 colas: SY (sistema, RR quantum 3, prioridad máxima), IT (interactivos, RR quantum 1), NI (no interactivos, SJF, prioridad mínima). Procesos: A(SY, 4-(7)-2, t=0), B(SY, 2-(7)-4, t=1), C(IT, 2-(3)-2-(3)-1, t=0), D(IT, 1-(3)-1-(3)-1, t=2), E(NI, 4, t=0), F(NI, 3, t=2). Muestra la planificación.",
    correctAnswer: `Traza CPU: A A A B B A C D C F F D B B B A A B C D C F E E C E E

Explicación:
- t=0: A(SY) ejecuta. Llega C(IT) y E(NI) pero SY > IT > NI.
- t=3: A agota quantum 3. B(SY) ejecuta quantum 3.
- t=6: A ejecuta su 1 restante de la 1ª ráfaga. A va a E/S 7.
- t=7: Entran IT: C y D. C ejecuta 1 (quantum), D ejecuta 1.
- t=9: C, D, C... hasta agotar. Los NI (E, F) solo ejecutan cuando SY e IT están en E/S.
- NI usa SJF: F(3) es más corto que E(4) → F ejecuta primero.
- Al volver procesos de E/S, expropian a NI por tener mayor prioridad.`,
    explanation: "Planificación multicolas con prioridades apropiativas: SY expropia a IT, IT expropia a NI. Dentro de SY: RR quantum 3. IT: RR quantum 1. NI: SJF (el más corto primero).",
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
      "El registro de datos de un controlador permite enviar comandos al dispositivo": "F",
      "El manejador de interrupciones chequea si un bloque está en la caché de bloques": "F",
      "Un DMA en modo bus transparente tiene mayor prioridad que en modo robo de ciclos": "F",
      "Los major numbers de /dev/sda y /dev/sda1 son idénticos": "V",
      "Determinar qué bloque de disco contiene un offset de fichero se realiza en el device driver": "F",
    },
    explanation: "El registro de comandos (no datos) envía comandos. La caché de bloques se gestiona en capas superiores. DMA transparente solo usa el bus cuando CPU no lo necesita (menor prioridad). Major number identifica el driver. El cálculo de bloques lo hace el sistema de ficheros.",
  },

  // 2020-01 — E/S código pread/dup/read
  {
    id: "so_2020_q10_pread",
    exam: "2020-01",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question: "Fichero 'fichero.txt' contiene '012345678901234546789\\n'. Código: char BUF[5]={'-','-','-','-','\\0'}; fd=open(fichero.txt,O_RDONLY); fd2=dup(fd); lseek(fd2,2,SEEK_SET); pread(fd,BUF,1,0); lseek(fd,2,SEEK_CUR); pread(fd,BUF,2,3); read(fd,BUF,1); read(fd,BUF+3,2); printf('%s',BUF). ¿Contenido de BUF tras línea 09?",
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
    explanation: "pread() lee desde offset absoluto sin modificar el file pointer. lseek() modifica el file pointer. Los cambios de posición en fd2 (dup) afectan a fd porque comparten la misma entrada en la tabla de ficheros abiertos.",
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
  // 2021-01 — P2 código completo (subpreguntas A-E)
  {
    id: "so_2021_q2_code",
    exam: "2021-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    question: "Código sobre '/home/usr1/dir1/datos' (1GB+6MB+40KB, hard links=2): chmod 0442, lstat, open O_RDONLY (1ª apertura), lseek(fd, 1073741824, SEEK_SET), fgetc, close, unlink. Cachés vacías, entrada usr1 en 7º bloque de home. Responde: A) Valor de fd. B) Accesos a disco en apertura. C) Bloques leídos para fgetc. D) Permisos impresos en rwxrwxrwx. E) Hard links de 'datos' tras unlink.",
    correctAnswer: `A) 3 (stdin=0, stdout=1, stderr=2 → fd=3)
B) 10 accesos (raíz, home, 7 bloques de home para usr1, dir1, datos)
C) 3 bloques (1073741824 = 1GB → zona de triple indirección parcial)
D) r-- r-- -w- (0442: owner=4=r--, group=4=r--, others=2=-w-)
E) 1 (inicialmente 2 hard links; unlink borra la entrada → queda 1 hard link)`,
    explanation: "La posición 1GB requiere acceder a bloques vía triple indirección. Con cachés vacías, recorrer la ruta del fichero requiere acceder a cada bloque de directorio e inodo.",
  },
  // 2021-01 — P3 hard links y soft links
  {
    id: "so_2021_q3_links",
    exam: "2021-01",
    topic: "sistema-ficheros",
    type: "text",
    points: 3,
    question: "Se crean 3 hard links a un fichero 'f1' (inodo 25634, 965 bytes, hard links=1) en su mismo directorio: ln f1 f2, ln f1 f3, ln f1 f4. Luego se crea soft link: ln -s f3 slink. a) ¿Tamaño (bytes) del fichero 'f3'? b) Se borra f2 (rm f2). ¿Tamaño (bytes) del fichero 'slink'?",
    correctAnswer: `a) 965 bytes (f3 es un hard link a f1 → comparten el mismo inodo → mismo tamaño)
b) 2 bytes (slink es symlink a 'f3'. Al borrar f2, f3 sigue existiendo. Pero el symlink almacena la ruta 'f3' → tamaño = 2 bytes)`,
    explanation: "Los hard links comparten inodo → mismo tamaño que el original. Los symlinks almacenan la ruta como contenido. Al borrar un hard link, mientras quede al menos uno, el fichero sigue existiendo.",
  },
  // 2021-01 — Procesos Q2: Execute function
  {
    id: "so_2021_q8_exec",
    exam: "2021-01",
    topic: "procesos",
    type: "text",
    points: 5,
    question: "Se muestran 3 versiones de una función Execute(char *argv[]) para crear un proceso y ejecutar un programa. Versión 1: fork, execvp, perror, waitpid. Versión 2: igual pero con exit(0) tras perror y waitpid con WNOHANG. Versión 3: execvp y waitpid sin fork. Para cada versión indica si es correcta y por qué.",
    correctAnswer: `Versión 1 (sin exit tras perror): INCORRECTA. Si execvp falla, el proceso hijo sigue ejecutando el código del padre (no hay exit). Quedan dos copias ejecutándose.

Versión 2 (con exit + WNOHANG): CORRECTA pero ejecuta en segundo plano. exit(0) tras perror asegura que el hijo termine si execvp falla. WNOHANG hace que waitpid no espere → ejecución en segundo plano.

Versión 3 (execvp sin fork): INCORRECTA. execvp NO crea un proceso nuevo, solo reemplaza la imagen del proceso actual. Sin fork(), el proceso padre es reemplazado y nunca se ejecuta waitpid.`,
    explanation: "Patrón fork+exec: fork() crea el hijo, exec() reemplaza su imagen. Si exec falla, el hijo debe hacer exit() para no duplicar la ejecución. waitpid espera al hijo; con WNOHANG no bloquea.",
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

  // 2021-07 — Memoria Q3: TP con entradas hexadecimales
  {
    id: "so_2021jul_q3_memhex",
    exam: "2021-07",
    topic: "memoria",
    type: "calculation",
    points: 6,
    question: "Sistema con direcciones lógicas de 32 bits, páginas de 4KB. TP de un nivel, entradas de 2 bytes. TP: [0]=0x7F24, [1]=0xFF24, [2]=0xDF14. Para cada dirección lógica indica la dirección física o si la página no está presente: 0x0224 (escritura), 0x1224 (escritura), 0x2224 (escritura). Bit 15=presencia, bit 14=R/W, bit 12=modo usuario.",
    correctAnswer: `Offset = 12 bits (4KB). Nº página = dir >> 12.
0x0224 → página 0. Entrada 0 = 0x7F24 = 0111 1111 0010 0100. Bit 15=0 → página NO presente.
0x1224 → página 1. Entrada 1 = 0xFF24 = 1111 1111 0010 0100. Bit 15=1, bit 14=1 (R/W✓), bit 12=1 (usuario). Marco = 0x24. Física = (0x24 << 12) | 0x224 = 0x24224.
0x2224 → página 2. Entrada 2 = 0xDF14 = 1101 1111 0001 0100. Bit 15=1, bit 14=1, bit 12=1. Marco = 0x14. Física = 0x14224.`,
    explanation: "Cada entrada de TP es de 16 bits. El bit más significativo (bit 15) indica presencia. El bit 14 indica permisos de escritura. Los bits de marco están en la parte baja.",
  },
  // 2021-07 — E/S: AIO (lectura asíncrona)
  {
    id: "so_2021jul_q6_aio",
    exam: "2021-07",
    topic: "entrada-salida",
    type: "text",
    points: 3,
    question: "Fichero 'file.txt' contiene 'ABCDEFGHIJK\\n'. Código: struct aiocb cb; cb.aio_fildes=fd; cb.aio_buf=BUF; cb.aio_nbytes=4; cb.aio_offset=0; aio_read(&cb); while(aio_error(&cb)==EINPROGRESS); printf('%s--%lu', BUF, aio_return(&cb)). ¿Qué imprime?",
    correctAnswer: `Imprime: ABCD--4

Explicación:
1. aio_read inicia lectura asíncrona de 4 bytes desde offset 0. BUF recibe "ABCD".
2. while(aio_error==EINPROGRESS) espera activa hasta que termine la operación.
3. aio_return devuelve 4 (bytes efectivamente leídos).
4. printf imprime "ABCD--4".`,
    explanation: "AIO (Asynchronous I/O) permite iniciar una operación de E/S y continuar ejecutando. aio_error comprueba el estado. aio_return obtiene el resultado (nº de bytes leídos).",
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

  // ============================================================
  // 2022-07 — Memoria zonas + E/S redirección
  // ============================================================
  {
    id: "so_2022jul_q4_zonas",
    exam: "2022-07",
    topic: "memoria",
    type: "matching",
    points: 5,
    question: "Clasifica cada dirección de un programa C en su zona: a) stack, b) heap, c) datos globales/estáticos, d) código/librerías.",
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
    explanation: "Variables auto → stack. malloc → heap. static/global → datos. Funciones → código. El espacio del kernel no es accesible desde usuario.",
  },
  // 2022-07 — FS P2 código con link/symlink/unlink
  {
    id: "so_2022jul_q5_code",
    exam: "2022-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    question: "Código sobre '/home/usr1/datos' (8GB+32MB+8KB, hard links=1): chmod 0642, link crea datos2, symlink('/home/usr1/datos','/home/usr1/sim_link'), open datos2, open sim_link, lseek(fd,16000), fgetc c1, close, unlink datos y sim_link. Cachés vacías, entrada usr1 en 7º bloque de home. A) fd_sim. B) Accesos disco apertura datos2. C) Bloques para fgetc. D) Permisos rwxrwxrwx. E) Hard links de datos2 tras ambos unlink.",
    correctAnswer: `A) 4 (primera apertura fd=3, segunda fd_sim=4)
B) 9 accesos (raíz, home, 7 bloques para usr1 — no, con bloque 8KB: 1 raíz, 1 home, 1 usr1(7º bloque), 1 datos2 → total = 4 directorios + 5 índices/datos = 9)
C) 1 bloque (16000 < 8KB → byte en 2º bloque de datos directos, ya cargado en caché de apertura)
D) rw- r-- -w- (0642: owner=6=rw-, group=4=r--, others=2=-w-)
E) 1 (inicialmente 1, link crea datos2 → 2, unlink datos → 1, unlink sim_link no afecta al inodo de datos)`,
    explanation: "sim_link es un symlink con su propio inodo. unlink de sim_link borra el symlink pero no afecta al fichero datos/datos2.",
  },
  // 2022-07 — FS V/F
  {
    id: "so_2022jul_q6_tf",
    exam: "2022-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica C/F sobre sistema de ficheros (Junio 2022):",
    correctAnswer: {
      "El S.O. mantiene copia en memoria del inodo de un fichero abierto hasta el último cierre": "C",
      "Al linkar con librería estática, el código en memoria se puede compartir entre procesos": "F",
      "Al ejecutar perror() se incrementa el tiempo en modo usuario pero no en modo sistema": "F",
      "Es posible crear soft links entre diferentes sistemas de ficheros montados": "C",
      "El journaling es un registro histórico de asignaciones de inodos": "F",
      "El Buffer Cache reduce lecturas físicas pero no escrituras": "F",
    },
    explanation: "Las librerías estáticas se copian en cada ejecutable (no se comparten en memoria). perror() usa write() → modo kernel. Los soft links almacenan rutas → cruzan sistemas de ficheros.",
  },

  // 2023-01 — FS V/F
  {
    id: "so_2023_q9_tf",
    exam: "2023-01",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica C/F sobre sistema de ficheros (Enero 2023):",
    correctAnswer: {
      "En modo usuario se pueden ejecutar todas las instrucciones del procesador": "F",
      "Al ejecutar perror(), el proceso está exclusivamente en modo usuario": "F",
      "El código binario de chmod() está en libC": "F",
      "Las librerías dinámicas producen ejecutables autocontenidos": "F",
      "Con asignación indexada no existe fragmentación externa": "C",
      "El Buffer Cache reduce tanto lecturas como escrituras físicas": "C",
    },
    explanation: "En modo usuario solo instrucciones no privilegiadas. chmod es syscall, su código está en el kernel. Las librerías estáticas (no dinámicas) producen binarios autocontenidos. La asignación indexada (i-nodos) elimina la fragmentación externa.",
  },
  // 2022-07 — E/S: código dup/close/redirección
  {
    id: "so_2022jul_q5_redir",
    exam: "2022-07",
    topic: "entrada-salida",
    type: "text",
    points: 5,
    question: "Código: open('file1.dat',O_RDONLY) → ifd=3; open('file2.dat',O_WRONLY|O_CREAT) → ofd=4. bk=dup(1); close(1); dup(ifd); close(0); dup(ofd). Lee de fd=ifd(3) y escribe a fd=1 (que ahora es file2.dat). Luego close(0); close(1); dup(bk). Finalmente write(1,'--done--'). ¿Qué se escribe en pantalla?",
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
    explanation: "dup() busca el menor descriptor libre. Al cerrar fd1 y hacer dup(ifd), stdout(1) ahora apunta a file1.dat. Tras restaurar con dup(bk), stdout vuelve a la pantalla.",
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
      "Un sistema con segmentación sin paginación puede tener memoria virtual": "V",
      "Tras fork(), padre e hijo tienen su propio espacio de direcciones virtuales": "V",
      "Un fallo de página bloquea al proceso mientras se sirve": "V",
      "La política del Working Set puede llegar a suspender procesos": "V",
      "Un algoritmo de reemplazo aleatorio con N marcos y N-1 páginas virtuales produce N-1 fallos o menos": "V",
    },
    explanation: "La segmentación con swapping implementa memoria virtual sin paginación. El Working Set monitoriza páginas activas; si la suma excede RAM, se suspenden procesos (thrashing).",
  },
  // 2023-01 — Procesos
  {
    id: "so_2023_q8_proc",
    exam: "2023-01",
    topic: "procesos",
    type: "matching",
    points: 8,
    question: "Responde V/F sobre procesos (Enero 2023):",
    correctAnswer: {
      "Un proceso zombie ocupa una entrada en la tabla de procesos": "V",
      "La credencial efectiva puede cambiar al hacer exec()": "V",
      "Tras fork(), las credenciales de padre e hijo son idénticas": "V",
      "Un proceso con mínima prioridad usa el 100% de CPU si no hay otros listos": "V",
      "Un algoritmo no apropiativo minimiza cambios de contexto frente a uno apropiativo": "V",
      "No existe la instrucción hardware 'cambiar prioridad'": "V",
      "La creación de procesos es software (syscalls), no instrucción hardware": "V",
      "El administrador no puede hacer que un proceso de usuario se ejecute siempre en modo kernel": "V",
    },
    explanation: "Conceptos de procesos: zombies, credenciales, prioridades, creación de procesos, modos de ejecución. El modo kernel/depende del código ejecutado (syscalls/interrupciones).",
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
      "En TP multinivel, solo el último nivel almacena direcciones de páginas físicas de datos": "F",
      "La TP invertida almacena qué página lógica ocupa cada marco físico": "V",
      "fork() con copy-on-write copia la tabla de páginas del padre en el hijo": "V",
      "vfork() no copia la tabla de páginas del padre en el hijo": "V",
      "Un fallo de página siempre actualiza la tabla de páginas": "V",
      "El Working Set en ventana de 1000 refs siempre es ≥ que en ventana de 500": "V",
      "En paginación por demanda pura no se prepagina la 1ª instrucción": "V",
      "Con registros base/límite sí puede haber swapping a disco": "V",
      "Linux gestiona memoria con segmentación paginada": "V",
      "Las librerías dinámicas ahorran memoria física vs estáticas": "V",
    },
    explanation: "Niveles intermedios de TP almacenan direcciones de tablas (no de datos). La TP invertida tiene una entrada por marco físico. fork() con COW copia la TP (apuntando a mismos frames RO). vfork() comparte espacio del padre. WS(A) ⊇ WS(B) si A ≥ B.",
  },
  // 2023-07 — Procesos
  {
    id: "so_2023jul_q10_proc",
    exam: "2023-07",
    topic: "procesos",
    type: "matching",
    points: 10,
    question: "Responde V/F sobre procesos (julio 2023):",
    correctAnswer: {
      "Un SO multiproceso no necesita instrucción hardware específica para crear procesos": "V",
      "El límite de usuarios en SO multiusuario depende de recursos, no del micro": "V",
      "Root no puede hacer que un proceso se ejecute siempre en modo kernel": "V",
      "Un zombie ocupa entrada en la tabla de procesos": "V",
      "exec con setuid cambia la credencial efectiva": "V",
      "Tras fork(), credenciales de padre e hijo son idénticas": "V",
      "Con mínima prioridad y sin competencia se usa el 100% de CPU": "V",
      "Algoritmo no apropiativo es más eficiente en CPU que apropiativo (menos cambios contexto)": "V",
      "No existe instrucción 'cambiar prioridad' en micros actuales": "V",
      "Procesos distintos pueden tener variables de entorno diferentes": "V",
    },
    explanation: "La creación de procesos es software. El límite de usuarios es por recursos (RAM, tabla procesos). El modo kernel/user lo determina el código. Las variables de entorno se heredan con fork() pero pueden modificarse con setenv/putenv o exec.",
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
    question: "Sobre el algoritmo FIFO Segunda Oportunidad: B1) ¿Puede aplicarse con asignación variable de memoria a procesos y reemplazo global? B2) ¿Es necesario el bit de referencia? B3) ¿Es necesario el bit de presencia? B4) ¿Es necesario el dirty bit? B5) ¿Es necesario el lock bit?",
    correctAnswer: `B1) SÍ. FIFO 2ª Oportunidad puede aplicarse con asignación variable y reemplazo global. El algoritmo solo necesita la cola de páginas y los bits de referencia, independientemente de cuántos marcos tenga cada proceso.

B2) SÍ. El bit de referencia (R) es esencial: cuando una página va a ser reemplazada, si R=1 se le da una segunda oportunidad (se pone R=0 y se mueve al final de la cola).

B3) SÍ. El bit de presencia indica si la página está en memoria. Solo las páginas presentes tienen entrada en la cola FIFO.

B4) NO. El dirty bit indica si la página fue modificada (necesita escribirse a disco al reemplazarla), pero no es necesario para la lógica del algoritmo de reemplazo en sí.

B5) NO. El lock bit impide que una página sea reemplazada (ej. durante E/S), pero no forma parte del algoritmo de reemplazo.`,
    explanation: "FIFO 2ª Oportunidad usa una cola circular con bit R. Cuando una página llega al frente: si R=1 → R=0 y al final; si R=0 → se reemplaza. Solo necesita el bit de referencia y presencia.",
  },
  {
    id: "so_2024_q6_zonas",
    exam: "2024-01",
    topic: "memoria",
    type: "text",
    points: 10,
    question: "Dado un programa C que declara variables locales (int, double, char*), usa malloc, define funciones propias (f1) y accede a argc, argv, environ: identifica 10 elementos y di en qué zona de memoria residen (pila, heap, código, datos). Indica qué printf corresponde a cada zona.",
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
    explanation: "La pila contiene variables locales, parámetros y direcciones de retorno. El heap contiene memoria dinámica (malloc). El segmento de código contiene las instrucciones del programa. Las variables de entorno (environ) se pasan como tercer argumento de main.",
  },
  {
    id: "so_2024_q7_forkdup",
    exam: "2024-01",
    topic: "procesos",
    type: "text",
    points: 10,
    question: "Código: open 1.txt (O_CREAT|O_TRUNC|O_RDWR), dup(STDOUT_FILENO) a fdb, close(1), dup(fda) redirige stdout a 1.txt, write('1.TXT-CREATED-'), fork(). Hijo write('A'), ambos write('B'). close(1), dup(fdb) restaura stdout, write('Y'), write('Z'). ¿Salida por terminal? ¿Contenido de 1.txt?",
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
    explanation: "Tras fork(), padre e hijo comparten la entrada en la tabla de ficheros abiertos (mismo file pointer). Las escrituras de ambos se intercalan en 1.txt. Al restaurar stdout con dup, ambos escriben a terminal de forma concurrente.",
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
    question: "Responde V/F (10 preguntas) sobre procesos:",
    correctAnswer: {
      "En un SO Multiusuario, el número de usuarios que puede soportar está limitado por el microprocesador": "F",
      "Solo un proceso con credencial efectiva de root puede cambiar sus credenciales mediante exec": "F",
      "Los manejadores de interrupción se almacenan en la pila del kernel": "F",
      "Un proceso zombie no ocupa una entrada en la tabla de procesos": "F",
      "Las llamadas exec pueden reemplazar datos y pila de un proceso, pero no el código": "F",
      "Tras fork(), el proceso hijo tiene SIEMPRE la misma credencial efectiva que su padre": "F",
      "Todo proceso comienza y termina SIEMPRE con una ráfaga de CPU": "F",
      "Un algoritmo apropiativo siempre produce más cambios de contexto que uno no apropiativo": "V",
      "El rango de prioridades depende en parte del microprocesador": "F",
      "La Tabla de Ficheros Abiertos del sistema es parte de los datos del kernel": "V",
    },
    explanation: "El límite de usuarios depende de recursos (memoria, tabla procesos), no del micro. Cualquier proceso con setuid puede cambiar credenciales. Las ISR tienen su propia pila o usan la pila kernel del proceso interrumpido. Los zombies SÍ ocupan entrada. exec reemplaza TODO (código, datos, pila). Tras fork, si el ejecutable tiene setuid y se hace exec, la efectiva cambia. Algunos SO permiten terminar con ráfaga de E/S. La prioridad es abstracción del SO, no del hardware.",
  },
  {
    id: "so_2024_q9_shell",
    exam: "2024-01",
    topic: "procesos",
    type: "text",
    points: 7,
    question: "Código de shell: ComprobarSegundoPlano busca '&' en el array tr[], si lo encuentra hace tr[i]=NULL /*UNO*/. Proceso hace fork(), si hijo: execvp y si falla exit(255) /*DOS*/. Padre: si !back → wait(NULL) /*TRES*/, si back → MeterProceso. Para cada marca /*UNO*/, /*DOS*/, /*TRES*/, indica si es NECESARIA, INCORRECTA o SUPERFLUA.",
    correctAnswer: `/*UNO*/ tr[i]=NULL: NECESARIA. El '&' es un símbolo del shell para indicar segundo plano. Si no se elimina, el programa ejecutado recibiría '&' como parámetro, lo cual es incorrecto.

/*DOS*/ exit(255): NECESARIA. Si execvp falla (ejecutable no existe, sin permisos, formato incorrecto), el proceso hijo debe terminar. Sin exit(), el hijo continuaría ejecutando el código del shell, creando una copia adicional del shell cada vez que execvp falle.

/*TRES*/ wait(NULL): INCORRECTA. Cuando la ejecución NO es en segundo plano (!back), el shell debe esperar al proceso hijo. Pero wait() espera por cualquier hijo, incluyendo procesos en segundo plano que puedan terminar antes. Lo correcto es usar waitpid(pid, NULL, 0) para esperar específicamente por el proceso en primer plano.`,
    explanation: "En shells, el '&' es metacarácter que no debe pasarse al programa. execvp no retorna en éxito; si falla, hay que hacer exit. wait() espera a cualquier hijo; con procesos en segundo plano hay que usar waitpid para esperar al hijo correcto.",
  },
  {
    id: "so_2024_q10_sched",
    exam: "2024-01",
    topic: "procesos",
    type: "text",
    points: 7,
    question: "Sistema con 3 colas: SYS (RR quantum 1, prioridad máxima), INT (RR quantum 3), BAT (FCFS, prioridad mínima). Planificación entre colas por prioridades apropiativas. Procesos: A (INT, CPU=7, t=0), B (INT, CPU=4, t=1), C (SYS, CPU=6, t=6), D (SYS, CPU=3, t=12). Muestra la planificación de CPU.",
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
    explanation: "SYS tiene prioridad absoluta sobre INT. Cuando llega C en t=6, expropia a B inmediatamente. Dentro de SYS, RR de quantum 1 pero como no compite con nadie, ejecuta de corrido. Al terminar los procesos SYS, vuelven INT.",
  },

  // ============================================================
  // EXAMEN JULIO 2024
  // ============================================================

  // 2024-07 — Sistema de Ficheros
  {
    id: "so_2024jul_q1",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 6,
    question: "Un sistema de archivos tipo System V tiene bloque de 2KB, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Direcciones de bloque de 8 bytes. Fichero con tamaño de 130 MBytes + 19 KBytes. Calcular: bloques de datos, bloques de índices y fragmentación interna.",
    correctAnswer: `Tamaño = 130MB + 19KB = 136,314,880 + 19,456 = 136,334,336 bytes.
Nº bloques datos = 136,334,336 / 2048 = 66,570 bloques.

Direcciones/bloque = 2048/8 = 256.
10 directas + 256 simple + 256² = 65,802 (insuficiente).
66,570 − 65,802 = 768 bloques necesitan triple indirección.
768/256 = 3 bloques índice de 3er nivel.

Índices: 1 (simple) + 1 (doble) + 256 (doble 2º) + 1 (triple) + 1 (triple 2º) + 3 (triple 3º) = 263.

Fragmentación: 2048 − (136,334,336 mod 2048) = 1024 bytes.`,
    explanation: "Similar al problema de enero 2020 pero con 19KB más de datos. La diferencia está en la fragmentación interna (1024 vs 2047 bytes).",
  },
  {
    id: "so_2024jul_q2",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "calculation",
    points: 3,
    question: "Sistema UNIX con bloque 2KB, inodo 64 bytes. Boot ocupa 2 bloques, superbloque 14 bloques. Calcular: a) Bloque lógico del inodo del directorio raíz (inodo 2). b) Bloque lógico del inodo del fichero 'datos' (inodo 642). Los inodos se numeran a partir de 1.",
    correctAnswer: `Inodos por bloque = 2048/64 = 32.
Área de inodos empieza tras boot+superbloque = 2+14 = 16 (bloque 16).

a) Inodo 2 → bloque = 16 + floor((2−1)/32) = 16 + 0 = 16.
b) Inodo 642 → bloque = 16 + floor((642−1)/32) = 16 + 20 = 36.`,
    explanation: "El área de inodos comienza tras el superbloque. Cada bloque contiene 32 inodos de 64 bytes. Los inodos se numeran desde 1.",
  },
  {
    id: "so_2024jul_q3",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "text",
    points: 5,
    question: "Código sobre '/home/juan/so/p1/p1.c' (3MB, inodo 6549). Se ejecuta desde /home/juan/so/p1. chmod 0632, lstat, link crea practica1.c, symlink crea slink_practica1.c, open practica1.c, lseek 100000, fgetc. Cachés vacías, entrada 'so' en 8º bloque de juan. a) Accesos a disco en 1ª apertura. b) Valor de fd2. c) Bloques leídos para fgetc(fd2). d) Tamaño de slink_practica1.c. e) Permisos en rwxrwxrwx.",
    correctAnswer: `a) 12 accesos (raíz, home, juan, 8º bloque de juan para 'so', so, p1, p1.c = 7 + 5 accesos datos índices)
b) 4 (fd1=3, fd2=4)
c) 2 bloques (100000 está en zona de indirección simple ya cargada → 1 índice + 1 datos)
d) 11 bytes (longitud de la ruta "practica1.c")
e) rw- -wx -w- (0632: owner=6=rw-, group=3=-wx, others=2=-w-)`,
    explanation: "lstat vs stat: lstat no sigue symlinks. chmod 0632 da permisos rw- al dueño, -wx al grupo, -w- a otros.",
  },
  {
    id: "so_2024jul_q4",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 6,
    question: "Indica C/F sobre el código del ejercicio anterior y conceptos de sistema de ficheros:",
    correctAnswer: {
      "fgetc es una llamada al sistema operativo": "F",
      "unlink elimina la entrada 'p1.c' pero no libera el inodo 6549": "C",
      "El enlazador incorpora el código de printf desde libC (estática o dinámica)": "C",
      "Al ejecutar printf se incrementa el tiempo en modo usuario pero no en modo sistema": "F",
      "Un proceso puede abrir varias veces un fichero, pero con el mismo modo de apertura": "F",
      "El Buffer Cache reduce lecturas físicas pero no escrituras físicas": "F",
    },
    explanation: "fgetc es función de libc, no syscall. unlink borra la entrada pero quedan hard links → inodo no se libera. printf gasta tiempo en ambos modos. Un fichero puede abrirse con modos distintos (O_RDONLY y O_RDWR). Buffer Cache reduce tanto lecturas como escrituras.",
  },

  // 2024-07 — Memoria
  {
    id: "so_2024jul_q5_mem",
    exam: "2024-07",
    topic: "memoria",
    type: "matching",
    points: 10,
    question: "Responde V/F (20 preguntas, 0.05p cada una) sobre memoria:",
    correctAnswer: {
      "Con tabla de páginas invertida se ahorra memoria para las tablas de páginas de proceso": "V",
      "Con tabla de páginas invertida se pueden gestionar los fallos de página del proceso": "V",
      "Cuando el lock bit es 0 en una entrada de TP necesaria, se produce un fallo de página": "F",
      "Con N páginas virtuales, LRU con N marcos siempre produce menos fallos que con N-1": "F",
      "Con N páginas virtuales, FIFO con N marcos siempre produce menos fallos que con N-1": "F",
      "En la pila del proceso están los argumentos de la línea de comandos": "V",
      "Las variables locales de main() están en la pila del proceso": "V",
      "Las variables locales de funciones de usuario están en la pila del proceso": "V",
      "El código de las funciones de librería invocadas está en la pila del proceso": "F",
      "El código de las funciones de usuario invocadas está en la pila del proceso": "F",
      "Las variables estáticas definidas en funciones están en la pila del proceso": "F",
      "Las variables estáticas definidas en main() están en la pila del proceso": "F",
      "Para un proceso con varios hilos, cada hilo tiene su propia pila": "V",
      "Con TP de un nivel, si el bit de presencia es 1, el acceso a esa página está garantizado": "F",
      "Con TP de un nivel, si el bit de presencia es 1, se garantiza que no hay fallo de página": "V",
      "fork sin copy-on-write copia la tabla de páginas del padre en el hijo": "V",
      "fork con copy-on-write copia la tabla de páginas del padre en el hijo": "V",
      "Con paginación por demanda pura, siempre hay fallo en la 1ª instrucción": "V",
      "Una TP multinivel normalmente reduce memoria necesaria vs TP de un nivel": "V",
      "Si el nº de marco son 8 bits y páginas de 4KB, las direcciones físicas son de 20 bits": "V",
    },
    explanation: "La tabla invertida ahorra memoria (una entrada por marco, no por página virtual). Con N marcos y N páginas virtuales, LRU/FIFO producen los mismos fallos (N) que con N-1 marcos (N también) — la anomalía de Belady. El código está en el segmento de texto, no en la pila. Las variables estáticas están en el segmento de datos. Con presencia=1 la página está en memoria → no hay fallo, pero el acceso puede violar permisos. 8 bits marco + 12 offset = 20 bits físicos.",
  },
  {
    id: "so_2024jul_q6_tp",
    exam: "2024-07",
    topic: "memoria",
    type: "calculation",
    points: 7,
    question: "Sistema con memoria física de 8GB, páginas de 4KB, entradas de TP de 8 bytes, direcciones virtuales de 30 bits. a) ¿Cuántos niveles de TP son necesarios? b) ¿Bits de control + no usados en una entrada de TP? c) Con TLB y caché, ¿mínimo y máximo de accesos a memoria para leer un byte?",
    correctAnswer: `a) Página 4KB = 2¹². Entradas/TP = 2¹²/8 = 2⁹ = 512.
1 nivel: 2⁹ × 2¹² = 2²¹ bytes (2MB) — insuficiente para 2³⁰.
2 niveles: 2⁹ × 2⁹ × 2¹² = 2³⁰ bytes ✓ → 2 niveles.

b) Física 8GB = 2³³ bytes. Páginas físicas = 2³³/2¹² = 2²¹ → 21 bits.
Entrada TP = 8B = 64 bits. Control + no usados = 64 − 21 = 43 bits.

c) Mínimo: 0 accesos (mapping en TLB + dato en caché).
Máximo: 3 accesos (2 niveles TP + 1 acceso al dato en memoria).`,
    explanation: "Con 30 bits de dirección virtual y páginas de 4KB (offset 12 bits), quedan 18 bits para nº página. Con 9 bits por nivel, 2 niveles cubren 18 bits exactos. Con TLB+caché se puede evitar todo acceso a RAM; sin ellos, cada nivel de TP requiere un acceso.",
  },

  // 2024-07 — Procesos + E/S
  {
    id: "so_2024jul_q7_proc",
    exam: "2024-07",
    topic: "procesos",
    type: "matching",
    points: 7,
    question: "Responde V/F (15 preguntas, 0.07p cada una) sobre procesos y E/S:",
    correctAnswer: {
      "Las 4 capas del software de E/S son: usuario, indep. dispositivo, driver y manejador interrupciones": "V",
      "Un dispositivo polling genera interrupciones": "F",
      "La E/S mediante DMA puede usarse con dispositivos mapeados en memoria": "V",
      "En un sistema con espacio E/S separado puede haber dispositivos mapeados en memoria": "V",
      "Compartir memoria con shmget puede hacerse entre procesos con distinto UID": "V",
      "Si el ejecutable tiene setuid, exec() cambia la credencial efectiva y la salvada": "V",
      "Un proceso puede terminar con una ráfaga de E/S": "V",
      "Round-robin puede producir inanición de procesos con ráfaga mayor que el quantum": "F",
      "El rango de prioridades depende en parte del microprocesador": "F",
      "La Tabla de Ficheros Abiertos del sistema es parte de los datos del kernel": "V",
      "Que cada proceso tenga su propia pila del kernel es necesario para que el kernel sea reentrante": "V",
      "En un sistema multiprocesador, el kernel no puede ser reentrante": "F",
      "Todos los procesos UNIX, al comenzar, tienen el mismo conjunto de variables de entorno": "F",
      "Para implementar UNIX se necesita la instrucción 'terminar proceso' en el procesador": "F",
      "Al crear un proceso con exec, exec devuelve el pid del proceso creado al padre": "F",
    },
    explanation: "Polling NO genera interrupciones (sondeo continuo). DMA puede usarse con memory-mapped I/O. La prioridad es abstracción del SO, no del hardware. Round-robin no produce inanición (todos reciben quantum). En multiprocesador el kernel SÍ puede ser reentrante. exec NO crea proceso nuevo, solo reemplaza; no devuelve PID.",
  },
  {
    id: "so_2024jul_q8_redir",
    exam: "2024-07",
    topic: "procesos",
    type: "text",
    points: 7,
    question: "Cuatro códigos que ejecutan 'ls -l /root /home' con redirecciones usando open, close, dup y fork. Para cada código, indica qué va a 'out.txt', 'err.txt' y pantalla. Código 1: solo execv (sin redirección). Código 2: fork + redirección en el hijo. Código 3: redirección + execv. Código 4: redirección + fork + execv.",
    correctAnswer: `Código 1 (sin redirección): pantalla = mensaje1 + mensaje2. out.txt = vacío. err.txt = vacío.

Código 2 (fork, hijo redirige): el padre ejecuta execv sin redirección → pantalla = mensaje1+mensaje2. El hijo redirige fd1 y fd2 a err.txt, luego execv → err.txt = mensaje1+mensaje2.

Código 3 (redirige, luego execv): stdout(1) y stderr(2) redirigidos a err.txt. execv ejecuta ls → err.txt = mensaje1+mensaje2.

Código 4 (redirige, fork, execv en hijo): el padre redirige stdout/stderr a err.txt ANTES del fork. El hijo hereda la redirección y ejecuta execv → todo va a err.txt = mensaje1+mensaje2.`,
    explanation: "close(1); dup(df2) hace que el descriptor 1 apunte al fichero df2. close(2); dup(1) redirige stderr al mismo sitio. Las redirecciones hechas antes de fork() son heredadas por el hijo.",
  },
  {
    id: "so_2024jul_q9_sched",
    exam: "2024-07",
    topic: "procesos",
    type: "text",
    points: 5,
    question: "Traza de planificación: A B C D A E E E E E E C C D B A A A A A. ¿Es posible una planificación Round Robin de quantum 2? Si es posible, indica una posible duración de ráfagas y tiempos de llegada.",
    correctAnswer: `SÍ, es posible con quantum 2.

Una solución (no única):
Proceso A: llegada 0, ráfagas: 1-(3)-1-(10)-5
Proceso B: llegada 1, ráfagas: 1-(12)-1
Proceso C: llegada 2, ráfagas: 1-(8)-2
Proceso D: llegada 3, ráfagas: 1-(9)-1
Proceso E: llegada 5, ráfagas: 6

Otras soluciones válidas: A,B,C,D llegan en t=0 en orden A,B,C,D; primera E/S de A dura 1 (E llega en t=3); etc.`,
    explanation: "Con quantum 2, la traza muestra que cada proceso ejecuta 1 o 2 unidades antes de ceder la CPU. Los paréntesis representan ráfagas de E/S donde el proceso se bloquea. La solución no es única: hay múltiples combinaciones de llegadas y duraciones de E/S compatibles con la traza.",
  },
  {
    id: "so_2024jul_q10_creds",
    exam: "2024-07",
    topic: "procesos",
    type: "text",
    points: 5,
    question: "a.out y f1.txt son del usuario u2. a.out es ejecutado por u1. Código: df1=open('./f1.txt',O_RDONLY); df2=open('./f1.txt',O_RDWR). Completa la tabla con ruid, euid, y si df1 o df2 son -1 para distintas combinaciones de permisos de a.out y f1.txt.",
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
    explanation: "El bit setuid en a.out cambia la credencial efectiva al propietario (u2), dándole acceso según los permisos de propietario de f1.txt. Sin setuid, euid=u1 y se aplican los permisos de 'otros'. O_RDWR requiere ambos permisos de lectura y escritura.",
  },
];