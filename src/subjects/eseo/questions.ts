import type { Question } from "../../data/types";

export const questions: Question[] = [
  {
    id: "2024-07_ficheros_p1",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.6,
    question: `
Un sistema de archivos tipo system V tiene un tamaño de bloque de 2 Kbytes e inodos con 10 direcciones directas de bloques, una indirecta simple, una indirecta doble y una indirecta triple. Además, utiliza direcciones de bloques de 8 bytes. Consideremos un fichero con tamaño de 130 MBytes + 19 Kbytes.

Calcular cuántos bloques de disco son necesarios, en el área de datos, para representar ese archivo.
`,
    fillStatements: [
      { text: "Número bloques de datos: {{blank}}" },
      { text: "Número de bloques de índices: {{blank}}" },
      { text: "Fragmentación interna último bloque de datos: {{blank}}" },
    ],
    correctAnswer: ["65Kbloques+10", "263", "1Kbyte"],
  },
  {
    id: "2024-07_ficheros_p2",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.3,
    question: `
Calcular qué número de bloque lógico corresponde al inodo del directorio raíz (se comienza a contar en el bloque lógico 0), y cuál bloque lógico al inodo de un fichero “datos”, suponiendo lo siguiente:

i) El nº de inodo del “/” es el 2, y el fichero “datos” corresponde al inodo número 642 (los inodos se comienzan a numerar a partir de 1).

ii) El tamaño de un inodo es de 64 bytes (tamaño bloque = 2Kbytes).

iii) El boot ocupa 2 bloques y el superbloque 14 bloques.
    `,
    fillStatements: [
      { text: "Nº bloque lógico del inodo de “/”: {{blank}}" },
      { text: "Nº bloque lógico del inodo de fichero “datos”: {{blank}}" },
    ],
    correctAnswer: ["16", "36"],
  },
  {
    id: "2024-07_ficheros_p3",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.5,
    question: `En el sistema de archivos del problema P1 (tamaño bloque 2Kbytes, 10 punteros directos, ...), tenemos el archivo \`/home/juan/so/p1/p1.c\` con un tamaño de 3Mbytes e inodo número 6549. Al ejecutar un proceso (con el código indicado a continuación), el usuario efectivo del proceso coincide con el propietario del fichero (p1.c), y tiene además los permisos de acceso y lectura a los directorios *raíz*, *home*, *juan*, *so* y *p1*, además del permiso de escritura en el directorio *p1*. Las cachés de datos e inodos están inicialmente vacías y la entrada *so* está en el octavo bloque de su directorio padre (*juan*), mientras las demás entradas están en el primer bloque de sus directorios padre. Contestar lo siguiente referente al siguiente código (se ejecuta desde el directorio \`/home/juan/so/p1\`):
\`\`\`c
main (){
  struct stat buf, char c;
  int fd1=open('/home/juan/so/p1/p1.c', O_RDONLY);
  chmod('p1.c', 0632);
  lstat('p1.c', &buf);
  printf('%s', convertir_permisos(buf.st_mode));
    /* se convierten los permisos a formato rwxwxwxw y se imprimen */
  link('p1.c', 'practica1.c'); /* hard link 'practica1.c' */
  symlink('practica1.c', 'slink_practica1.c'); /* link simbólico, symbolic link 'slink_practica1.c' */
  int fd2=open('practica1.c', O_RDONLY);
  lseek(fd2, 100000, SEEK_SET);
    /* SEEK_SET - el desplazamiento se considera a partir del origen del fichero */
  c=fgetc(fd2);
  close(fd2); close(fd1);
  unlink('p1.c'); }
\`\`\``,
    fillStatements: [
      {
        label: "A.",
        text: "¿Cuál es el número de accesos necesarios a disco, únicamente en el área de datos, en la primera apertura del fichero p1.c?: {{blank}}",
      },
      {
        label: "B.",
        text: "¿Cuál es el valor asignado al descriptor de fichero fd2 tras la segunda apertura?: {{blank}}",
      },
      {
        label: "C.",
        text: "Indica el número de bloques que el S.O. necesita leer en disco para obtener el valor de c en fgetc(fd2): {{blank}}",
      },
      {
        label: "D.",
        text: "¿Cuál es el tamaño del fichero “slink_practica1.c”: {{blank}} (indicar unidad: bytes, Kbytes, Mbytes, ...)",
      },
      {
        label: "E.",
        text: "Indica los permisos del fichero p1.c impresos en formato rwxrwxrwx: {{blank}}",
      },
    ],
    correctAnswer: ["12", "4", "2", "11 bytes", "rw- -wx -w-"],
  },
  {
    id: "2024-07_ficheros_p4",
    exam: "2024-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 0.6,
    question: `
Indicar si es cierto/falso en cada pregunta. Las 4 primeras preguntas (A, B, C y D) se refieren a este código (del ejercicio previo P3):
\`\`\`c
main (){
  struct stat buf, char c;
  int fd1=open('/home/juan/so/p1/p1.c', O_RDONLY);
  chmod('p1.c', 0632);
  lstat('p1.c', &buf);
  printf('%s', convertir_permisos(buf.st_mode));
    /* se convierten los permisos a formato rwxwxwxw y se imprimen */
  link('p1.c', 'practica1.c'); /* hard link 'practica1.c' */
  symlink('practica1.c', 'slink_practica1.c'); /* link simbólico, symbolic link 'slink_practica1.c' */
  int fd2=open('practica1.c', O_RDONLY);
  lseek(fd2, 100000, SEEK_SET);
    /* SEEK_SET - el desplazamiento se considera a partir del origen del fichero */
  c=fgetc(fd2);
  close(fd2); close(fd1);
  unlink('p1.c'); }
\`\`\``,
    correctAnswer: {
      "A. *fgetc* es una llamada al sistema operativo. Cierto/Falso:": "F",
      'B. *unlink* va a eliminar la entrada de directorio "p1.c" en su directorio padre pero no libera el inodo 6549. Cierto/Falso:':
        "V",
      "C. El lincador incorpora el código de *printf* desde la librería estándar de C (versión estática o dinámica de la librería). Cierto/Falso:":
        "V",
      "D. Al ejecutar la función *printf* de C se incrementa el tiempo de ejecución en modo usuario pero no en modo sistema. Cierto/Falso:":
        "F",
      "E. Un proceso puede abrir varias veces un fichero, pero debe ser con el mismo modo de apertura. Cierto/Falso:":
        "F",
      "F. El *Buffer Cache* reduce el número de lecturas físicas, pero no de escrituras físicas, sobre los discos montados. Cierto/Falso:":
        "F",
    },
  },
  {
    id: "2024-07_memoria_1",
    exam: "2024-07",
    topic: "memoria",
    type: "matching",
    points: 1.0,
    question: `Responda Verdadero/Falso V/F`,
    correctAnswer: {
      "1. Con Táboa de páxinas invertidas, afórrase memoria para as táboas de páxinas de proceso con respecto aos sistemas de táboas de páxinas.":
        "V",
      "2. Con Táboa de páxinas invertidas podense xestionar os fallos da páxina do proceso.":
        "V",
      "3. Cando o lock bit é 0 nunha entrada da táboa de páxinas necesaria para un acceso á memoria, prodúcese un fallo de páxina no acceso a esa páxina.":
        "F",
      "4. Para un proceso cun espazo virtual de N páxinas, o algoritmo LRU con N marcos sempre (é dicir, en calquera execución do proceso) produce menos erros de páxina que o LRU con N-1 marcos.":
        "F",
      "5. Para un proceso cun espazo virtual de N páxinas, o algoritmo FIFO con N marcos sempre (é dicir, en calquera execución do proceso) produce menos erros de páxina que FIFO con N-1 marcos.":
        "F",
      "6. Na pila do proceso están os argumentos da liña de comandos.": "V",
      "7. As variables locais de main() están na pila do proceso.": "V",
      "8. As variables locais das funcións definidas polo usuario están na pila do proceso.":
        "V",
      "9. O código para as funcións da librería invocadas polo proceso está na pila do proceso.":
        "F",
      "10. O código para as funcións definidas polo usuario e invocadas está na pila do proceso.":
        "F",
      "11. As variables estáticas definidas en funcións definidas polo usuario están na pila do proceso.":
        "F",
      "12. As variables estáticas definidas en main() están na pila do proceso.":
        "F",
      "13. Para un proceso con varios fios de execución, cada fio ten a súa propia pila.":
        "V",
      "14. Considere un sistema de memoria cunha táboa de páxinas dun nivel, se nunha entrada de TP o bit de presenza é 1 (páxina presente) o acceso a esa páxina está garantido":
        "F",
      "15. Considere un sistema de memoria cunha táboa de páxinas dun nivel, se nunha entrada de TP o bit de presenza é 1 (páxina presente) garántese que non hai fallo de páxina na referencia a esa páxina.":
        "V",
      "16. Unha chamada de sistema fork en sistemas Unix antigos sen un mecanismo de copy-on-write, copia a táboa de páxinas do proceso pai no proceso fillo.":
        "V",
      "17. Unha chamada de sistema fork nos sistemas Unix modernos cun mecanismo de copy-on-write, copia a táboa de páxinas do proceso pai no proceso fillo.":
        "V",
      "18. Nun sistema con paxinación por demanda pura, sempre se produce un fallo de páxina cando se executa a primeira instrución.":
        "V",
      "19. Unha táboa de páxinas de varios niveis normalmente reduce a cantidade de memoria necesaria para almacenar táboas de páxinas en comparación cunha táboa de páxinas dun só nivel.":
        "V",
      "20. Se o número de marco vén dado por 8 bits e as páxinas son de 4Kbytes, os enderezos físicos son de 20 bits.":
        "V",
    },
  },
  {
    id: "2024-07_memoria_2",
    exam: "2024-07",
    topic: "memoria",
    type: "fill",
    points: 1.5,
    question: `
a) Para un sistema de tabla de páginas multinivel con un direccionamiento de memoria física de 8GBytes, tamaño de página de 4Kbytes y tamaño de una entrada de tabla de páginas de 8 bytes. ¿Cuántos niveles son necesarios para la tabla de páginas si el sistema tiene direcciones virtuales de 30 bits, si tanto la página del nivel raíz como las páginas de los otros niveles ocupan todo su espacio con entradas de la tabla de página? Debe indicar los cálculos para que la respuesta puntúe.

b) Para la solución anterior, ¿de cuántos bits de control (bit referencia, bit R/W, dirty bit, etc) y bits no usados (se pide la suma total de ambos tipos), se dispone en una entrada de tabla de página de cada nivel? Debe indicar los cálculos para que la respuesta puntúe.

c) Imagine que con la solución anterior el procesador dispone de caché de datos e instrucciones y TLB, en este caso, para una operación de lectura de un byte de memoria (debe dar la explicación correcta para que la respuesta puntúe),`,
    fillStatements: [
      { label: "a)", text: "Número de niveles: {{blank}}" },
      {
        label: "b)",
        text: "Bits de control y bits no usados (suma total): {{blank}}",
      },
      {
        label: "c)",
        text: "¿Cuál sería el número mínimo de accesos a memoria? : {{blank}}",
      },
      {
        label: "c)",
        text: "¿Cuál sería el número máximo de accesos a memoria?: {{blank}}",
      },
    ],
    development: `**a)** Páginas de 4Kbytes:

$$
4\\ \\mathrm{Kbytes} = 2^{12}\\ \\mathrm{bytes}
$$

$$
\\frac{2^{12}\\ \\mathrm{bytes}}{2^3\\ \\mathrm{bytes}} = 2^9\\ \\text{entradas por tabla de páginas}
$$

Un TP de un nivel puede direccionar:

$$
2^9\\ \\text{entradas} \\times 2^{12}\\ \\mathrm{bytes} = 2^{21}\\ \\mathrm{bytes}
$$

Con dos niveles de TP se pueden direccionar:

$$
2^9\\ \\text{entradas} \\times 2^9\\ \\text{entradas} \\times 2^{12}\\ \\mathrm{bytes} = 2^{30}\\ \\mathrm{bytes}
$$

Por tanto son suficientes dos niveles para gestionar direcciones virtuales de 30 bits.

**b)** Páginas de 4Kbytes:

$$
4\\ \\mathrm{Kbytes} = 2^{12}\\ \\mathrm{bytes}
$$

Memoria física de 8Gbytes:

$$
8\\ \\mathrm{Gbytes} = 2^3\\ \\mathrm{bytes}
$$

$$
\\frac{2^3\\ \\mathrm{bytes}}{2^{12}\\ \\mathrm{bytes}} = 2^2\\ \\text{páginas físicas}
$$

Se necesitan 21 bits en la entrada de la TP para poder direccionar las $2^2$ páginas físicas.

Entradas en la TP de 8 bytes:

$$
8\\ \\mathrm{bytes} = 64\\ \\mathrm{bits}
$$

$$
64 - 21 = 43\\ \\text{bits no usados}
$$

Lo mismo para todos los niveles.

**c)** Número mínimo: el mapping página lógica a página física se encuentra en la TLB, y el byte de memoria en la caché:

$$
0\\ \\text{accesos a memoria}
$$

Número máximo: 2 accesos a memoria para cada nivel de la TP y 1 acceso a memoria para conseguir el byte en memoria:

$$
2 + 1 = 3\\ \\text{accesos a memoria}
$$`,
    correctAnswer: ["2", "43", "0", "3"],
  },
  {
    id: "2024-07_procesos_q1",
    exam: "2024-07",
    topic: "procesos",
    type: "matching",
    points: 1.0,
    question: "Responda Verdadero/Falso",
    correctAnswer: {
      "La cuatro capas del software de e/s son: software de nivel de usuario, software independiente dispositivo y manejador de interrupciones.":
        "V",
      "Un dispositivo 'polling' genera interrupciones": "F",
      "La e/s mediante DMA puede usarse con dispositivos mapeados en memoria.":
        "V",
      "En un sistema que tiene espacio e/s separado puede haber también dispositivos mapeados en memoria.":
        "V",
      "Compartir memoria con shmget puede hacerse entre procesos con distinto uid":
        "V",
      "En el caso de que el ejecutable tenga el bit setuid, exec() cambia la credencial efectiva y la salvada":
        "V",
      "Todo proceso es una sucesión de ráfagas de CPU y e/s. En algunos S.O. se permite que un proceso termine con una ráfaga de e/s.":
        "F",
      "Una planificación round-robin puede producir inanición de procesos con una ráfaga mayor que el quanto":
        "F",
      "La prioridad es un entero y su rango de valores depende, en parte, del microprocesador, p.e. una versión de linux para procesadores intel probablemente tenga distintos valores para las prioridades que la misma versión para procesadores superSPARC":
        "F",
      "En un sistema tipo UNIX, la Tabla de Ficheros Abiertos del sistema es parte los datos de kernel":
        "V",
      "Que cada proceso tenga su propia pila del kernel es condición necesaria para que el kernel del S.O. sea reentrante":
        "V",
      "En un sistema multiprocesador, el kernel no puede ser reentrante": "F",
      "Todos los procesos de un sistema tipo UNIX, al comenzar, tienen el mismo conjunto de variables de entorno":
        "F",
      "Para implementar un S.O. tipo UNIX para un determinado microprocesador, es condición necesaria que el procesador tenga la instrucción 'terminar proceso' o equivalente":
        "F",
      "Al crear un proceso mediante exec, exec devuelve el pid del proceso creado al proceso padre":
        "F",
    },
  },
  {
    id: "2024-07_procesos_q2",
    exam: "2024-07",
    topic: "entrada-salida",
    type: "table-fill",
    points: 0.75,
    question: `La salida de ls es la que se muestra en el cuadro, donde denominaremos mensaje1 a \`/home: drwx--- 95 usuario usuario 4096 Jun 21 10:23 usuario\` y mensaje2 a \`ls: cannot open directory '/root': Permission denied\` es decir, mensaje1 es lo que va a la salida estandar y mensaje2 lo que va al error estandar. Se supone que ninguna de las llamadas al sistema producen ningun error y que los códigos tienen los includes correspondientes.

\`\`\`shell
usuario@unixmachine:~$ ls -l /root /home
/home:
drwx--- 95 usuario usuario 4096 Jun 21 10:23 usuario
ls: cannot open directory '/root': Permission denied
\`\`\`

Código 1
\`\`\`c
main()
{
    char *arg[]={"ls","-l","/root","/home",NULL};
    execv("/bin/ls", arg);
}
\`\`\`

Código 2
\`\`\`c
main()
{
    int df1; df2;
    char *arg[]={"ls","-l","/root","/home",NULL};
    if (fork()==0) {
        df1=open("out.txt",0_WRONLY,0_CREAT, 0_TRUNC,0777);
        df2=open("err.txt",0_WRONLY,0_CREAT, 0_TRUNC,0777);
        close(1); dup (df2);
        close(2); dup(1);
    }
    execv("/bin/ls", arg);
}
\`\`\`

Código 3
\`\`\`c
main()
{
    int df1; df2;
    char *arg[]={"ls","-l","/root","/home",NULL};

    df1=open("out.txt",0_WRONLY,0_CREAT, 0_TRUNC,0777);
    df2=open("err.txt",0_WRONLY,0_CREAT, 0_TRUNC,0777);
    close(1); dup (df2);
    close(2); dup(1);
    execv("/bin/ls", arg);
}
\`\`\`

Código 4
\`\`\`c
main()
{
    int df1; df2;
    char *arg[]={"ls","-l","/root","/home",NULL};

    df1=open("out.txt",0_WRONLY,0_CREAT, 0_TRUNC,0777);
    df2=open("err.txt",0_WRONLY,0_CREAT, 0_TRUNC,0777);
    close(1); dup (df2);
    close(2); dup(1);
    if (fork()==0)
        execv("/bin/ls", arg);
}
\`\`\`

Rellenar el siguiente cuadro indicando lo que va a los ficheros "out.txt", "err.txt" y a la pantalla, tras la ejecución de cada uno de los códigos., tal como aparece para el código1`,
    tableFill: {
      headers: ["", 'fichero "out.txt"', 'fichero "err.txt"', "pantalla"],
      rows: [
        ["Código 1", "---", "---", "mensaje1 mensaje2"],
        ["Código 2", "{{blank}}", "{{blank}}", "{{blank}}"],
        ["Código 3", "{{blank}}", "{{blank}}", "{{blank}}"],
        ["Código 4", "{{blank}}", "{{blank}}", "{{blank}}"],
      ],
    },
    correctAnswer: [
      "---",
      "mensaje1 mensaje2",
      "mensaje1 mensaje2",
      "---",
      "mensaje1 mensaje2",
      "---",
      "---",
      "mensaje1 mensaje2",
      "---",
    ],
    development: `EXPLICACION: El código de redirección redirecciona salida y error estándar al fichero err.txt.

Código 2: La redirección se hace en el hijo, el padre ejecuta el exec sin redirección y el hijo con redirección

Código 3: Se hace la redirección y luego el exec

Código 4: El padre hace la redirección antes de crear el hijo. El hijo hereda la redirección y hace el exec

Código 1: out.txt ---; err.txt ---; pantalla mensaje1 mensaje2
Código 2: out.txt ---; err.txt mensaje1 mensaje2; pantalla mensaje1 mensaje2
Código 3: out.txt [vacío]; err.txt mensaje1 mensaje2; pantalla [vacío]
Código 4: out.txt [vacío]; err.txt mensaje1 mensaje2; pantalla [vacío]`,
  },
  {
    id: "2024-07_procesos_q3",
    exam: "2024-07",
    topic: "procesos",
    type: "text",
    points: 0.5,
    question: `Se muestra una planificación en un sistema monoprocesador.

|  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  A | B | C | D | A | E | E | E | E | E | E | C | C | D | B | A | A | A | A | A  |

¿Es posible que se trate de una planificación round robin de quanto 2? Elegir a) (Si) o b) (No) y contestar lo que se pide en ese caso.

a) Si. Indique una posible duración de las ráfagas de CPU y e/s de los procesos así como sus instantes de llegada.

b) No. Justifíquese por qué.`,
    correctAnswer: `SI, es posible. La solución mas simple (no la única) sería:

|  PROCESO | LLEGADA | RAFAGAS  |
| --- | --- | --- |
|  A | 0 | 1-(3)-1-(10)-5 |
|  B | 1 | 1-(12)-1 |
|  C | 2 | 1-(8)-2 |
|  D | 3 | 1-(9)-1 |
|  E | 5 | 6 |

Los números entre paréntesis representan ráfagas de e/s y los sin paréntesis ráfagas de CPU, p.e 1-(2)-3 representa una ráfaga de CPU de 1, seguida de una ráfaga de e/s de 2, seguida de una ráfaga de CPU de 3

La solución no es única, por ejemplo

*ABCD llegan todos en el instante 0 en el orden ABCD y E en el instante 5, (resto de datos igual)

*ABCD llegan todos en el instante 0 en el orden ABCD, la primera ráfaga de e/s de A es de 1, y E llega en el instante 3 (resto de datos igual)

*A llega en el instante 0, BCD llegan en el instante 1 en el orden BCD, la primera ráfaga de e/s de A es de 1 y E llega en el instante 3 (resto de datos igual)

*...`,
  },
  {
    id: "2024-07_procesos_q4",
    exam: "2024-07",
    topic: "procesos",
    type: "table-fill",
    points: 0.5,
    question: `Sea el siguiente código en C, con todos los includes necesarios, que compila correctamente y que produce un ejecutable a.out.

Tanto a.out como f1.txt son del usuario u2, a.out es ejecutado por un usuario u1, desde el mismo directorio donde están a.out y f1.txt.

Completar el siguiente cuadro indicando las credenciales reales y efectivas del proceso que ejecuta a.out y si alguno de los descriptores df1 o df2 es -1 dependiendo de los permisos de a.out y f1.txt.

\`\`\`c
    int main (int argc, char *argv[])
    {
        int df1, df2;
        df1=open ("./f1.txt", 0_RDONLY);
        df2=open ("./f1.txt", 0_RDWR);
        printf ("%d, %d\\n", df1, df2);
    }
\`\`\``,
    tableFill: {
      headers: ["a.out", "f1.txt", "ruid", "euid", "df1=-1?", "df2=-1?"],
      rows: [
        [
          "rwxrwxrwx",
          "rwxrwxrwx",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwsr-xr-x",
          "rwxr-xr-x",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwsr-xr-x",
          "rwxr--r--",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwsr-xr-x",
          "rwsr-xr-x",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwsr-xr-x",
          "rwsr--r--",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwsr-xr-x",
          "rws---",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwxr-xr-x",
          "rwxr-xr-x",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwxr-xr-x",
          "rwxr--r--",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwxr-xr-x",
          "rwsr-xr-x",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwxr-xr-x",
          "rwsr--r--",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
        [
          "rwxr-xr-x",
          "rws---",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
      ],
    },
    correctAnswer: [
      "u1",
      "u1",
      "no",
      "no",
      "u1",
      "u2",
      "no",
      "no",
      "u1",
      "u2",
      "no",
      "no",
      "u1",
      "u2",
      "no",
      "no",
      "u1",
      "u2",
      "no",
      "no",
      "u1",
      "u2",
      "no",
      "no",
      "u1",
      "u1",
      "no",
      "si",
      "u1",
      "u1",
      "no",
      "si",
      "u1",
      "u1",
      "no",
      "si",
      "u1",
      "u1",
      "no",
      "si",
      "u1",
      "u1",
      "si",
      "si",
    ],
    development: `EXPLICACIÓN: La credencial real es SIEMPRE la de quien ejecuta el fichero. Si el ejecutable tiene el bit setuid, exec cambia la credencial efectiva a la del propietario del ejecutable (o sea, cuando los permisos del ejecutable son rws-r-x-r-x, la credencial efectiva es u2).

Hay dos aperturas, df1 en modo solo lectura, y df2 en modo lectura/escritura. Cuando la credencial efectiva es u2 se miran los permisos de propietario y cuando la credencial efectiva es u1 se miran los permisos de resto ya que no sabemos si u1 pertenece al grupo del fichero (no importaría los permisos de resto y de grupo son los mismos)`,
  },
];
