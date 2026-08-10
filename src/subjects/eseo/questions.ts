import type { Question } from "../../data/types";

export const questions: Question[] = [
  {
    id: "2024-07_ficheros_p1",
    examId: "2024-07",
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
    examId: "2024-07",
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
    examId: "2024-07",
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
    examId: "2024-07",
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
    examId: "2024-07",
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
    examId: "2024-07",
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
    examId: "2024-07",
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
    examId: "2024-07",
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
    examId: "2024-07",
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
    examId: "2024-07",
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
  },  {
    id: "2024-01_ficheros_p1",
    examId: "2024-01",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.6,
    question: `Un sistema de archivos tipo UNIX tiene un tamaño de bloque de 8Kbytes, i-nodos con 12 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 4 bytes. *i)* Calcular el tamaño máximo que podría tener un fichero al usar la indirección doble (sumando lógicamente los bloques de la indirección simple más los 12 bloques de los punteros directos). *ii)* Calcular cuántos bloques de disco son necesarios (en el área de datos) para representar un archivo de tamaño 96 Gbytes + 103 Kbytes. Discriminar cuántos bloques son de datos y cuántos de índices. *iii)* Calcular la fragmentación interna de ese fichero.`,
    fillStatements: [
      {
        label: "i)",
        text: "Tamaño máximo del fichero con la indirección doble (sumando los bloques de la indirección simple y los 12 bloques directos): {{blank}}",
      },
      { label: "ii)", text: "Nº de bloques de datos: {{blank}}" },
      { label: "ii)", text: "Nº de bloques de índices: {{blank}}" },
      {
        label: "iii)",
        text: "Fragmentación interna del fichero: {{blank}} (bytes)",
      },
    ],
    correctAnswer: [
      "32Gbytes + 16 Mbytes + 96 Kbytes",
      "12Mbloques + 13",
      "6149",
      "1024",
    ],
    development: `Cada bloque de índices almacena 8192/4 = **2048 = 2^11 direcciones**.

**i)** Con la indirección doble se pueden direccionar:

$$
12 + 2048 + 2048 \\times 2048 = 4.196.364\\ \\text{bloques}
$$

$$
4.196.364 \\times 8\\ \\mathrm{Kbytes} = \\textbf{32 Gbytes + 16 Mbytes + 96 Kbytes}
$$

**ii)** Bloques de datos: 96 Gbytes = 96 × 2^20 bloques de 8 Kbytes = 12.582.912 bloques completos. Los 103 Kbytes restantes ocupan 103 × 1024 / 8192 = 12,875 → 12 bloques completos + 1 bloque parcial = 13. Total: 12.582.912 + 13 = **12Mbloques + 13** bloques de datos.

Bloques de índices:
- Los 12 primeros bloques son directos.
- Indirecta simple: 1 bloque de índice (cubre 2048 bloques). Quedan 12.582.925 - 12 - 2048 = 12.580.865.
- Indirecta doble: 1 bloque de primer nivel + 2048 bloques de segundo nivel = 2049 (cubre 2048² = 4.194.304 bloques). Quedan 12.580.865 - 4.194.304 = 8.386.561.
- Indirecta triple: 1 bloque de primer nivel + 2 bloques de segundo nivel (⌈4096/2048⌉) + 4096 bloques de tercer nivel (⌈8.386.561/2048⌉ = 4096) = 4099.

Total bloques de índices: 1 + 2049 + 4099 = **6149**.

**iii)** El último bloque parcial contiene 7168 bytes de datos (103 Kbytes = 12 × 8192 + 7168), por lo que la fragmentación interna es:

$$
8192 - 7168 = \\textbf{1024 bytes}
$$`,
  },
  {
    id: "2024-01_ficheros_p2",
    examId: "2024-01",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.3,
    question: `En ese sistema de archivos UNIX (tamaño de bloque de 8Kbytes), el tamaño de la lista de inodos en disco es de 32 Mbytes. El superbloque mantiene un mapa de bits de inodos libres para determinar los inodos libres/ocupados de la lista de inodos. Ese mapa de bits, que es parte del superbloque, ocupa un total de 8 bloques. *i)* Calcular el tamaño (en bytes) de un inodo. *ii)* Si la lista de inodos comienza en el bloque lógico 10 (desde el inicio de la partición), ¿qué bloque lógico corresponde al inodo 1285?`,
    fillStatements: [
      { text: "i) Tamaño del inodo: {{blank}} (bytes)" },
      { text: "ii) Bloque lógico del inodo 1285: {{blank}}" },
    ],
    correctAnswer: ["64", "20"],
    development: `**i)** El mapa de bits ocupa 8 bloques de 8192 bytes = 65536 bytes = 524.288 bits → permite controlar **524.288 inodos**. Como la lista de inodos ocupa 32 Mbytes:

$$
\\frac{32\\ \\mathrm{Mbytes}}{524.288\\ \\text{inodos}} = \\textbf{64 bytes/inodo}
$$

**ii)** Inodos por bloque: 8192 / 64 = **128**. El inodo 1285 ocupa la posición 1284 (los inodos se numeran desde 1) → bloque relativo ⌊1284/128⌋ = 10 dentro de la lista de inodos. Como la lista comienza en el bloque lógico 10:

$$
10 + 10 = \\textbf{20}
$$`,
  },
  {
    id: "2024-01_ficheros_p3",
    examId: "2024-01",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.5,
    question: `Un proceso abre el archivo \`/home/juan/practicas/p1.c\`, cuyo número de inodo es el 5002 y su número de hard links inicial es 2. El tamaño del fichero es de 32 Gbytes y se suponen los datos referentes al sistema de ficheros del ejercicio P1 (tamaño de bloque, punteros de acceso directos e indirectos). Se suponen todos los permisos necesarios en acceso a directorios, apertura del fichero y cambio de sus permisos. Las cachés de datos e inodos están inicialmente vacías. Indicar lo siguiente referente al trozo de código:
\`\`\`c
int fd1=open("/home/juan/practicas/p1.c", O_RDONLY); /* es la primera apertura de fichero del proceso */
link("/home/juan/practicas/p1.c", "/home/juan/practicas/practica1.c"); /* crea hard link */
chmod("/home/juan/practicas/practica1.c", 0640);
symlink("/home/juan/practicas/practica1.c", "/home/juan/practicas/p1_slink"); /* crea link simbólico p1_slink */
int fd2=dup (fd1);

lseek(fd2, 2.000.000, SEEK_SET); /* SEEK_SET indica que el desplazamiento se considera a partir del origen del fichero */
char c=fgetc(fd2);
close(fd1); close (fd2);
unlink("/home/juan/practicas/practica1.c");
unlink("/home/juan/practicas/p1.c");
\`\`\`

Cada apartado puntúa 0.1p.`,
    fillStatements: [
      {
        label: "A.",
        text: "¿Cuál es el valor asignado al descriptor de fichero fd2?: {{blank}}",
      },
      {
        label: "B.",
        text: "Indica el número de bloques que el SO necesita leer en disco para obtener el valor de c con fgetc(fd2): {{blank}}",
      },
      {
        label: "C.",
        text: "Indica los permisos del inodo 5002 en formato rwxrwxrwx (después de ejecutar chmod): {{blank}}",
      },
      {
        label: "D.",
        text: "¿Cuál es el número de hard links del fichero /home/juan/practicas/p1_slink?: {{blank}}",
      },
      {
        label: "E.",
        text: "¿Cuál es el número de hard links del inodo 5002 después de ejecutar las dos llamadas unlink?: {{blank}}",
      },
    ],
    correctAnswer: ["4", "2", "rw- r-- ---", "1", "1"],
    development: `**A.** Descriptores ocupados: 0 (stdin), 1 (stdout), 2 (stderr). fd1 = 3 (primera apertura del proceso) y fd2 = dup(fd1) = **4**.

**B.** lseek(fd2, 2.000.000, SEEK_SET) → bloque de datos ⌊2.000.000/8192⌋ = 244. Los 12 punteros directos cubren los bloques 0-11; la indirecta simple cubre los bloques 12-2059, por lo que el bloque 244 se accede a través de la indirecta simple. Como la caché de datos está vacía: lectura del bloque de índice indirecto (1) + lectura del bloque de datos (1) = **2**.

**C.** chmod 0640 → **rw- r-- ---**. El chmod se aplica al inodo 5002, compartido por ambos hard links (p1.c y practica1.c).

**D.** p1_slink es un enlace simbólico; su número de hard links es **1** y no cambia con los unlink.

**E.** Hard links iniciales de p1.c: 2. link(practica1.c) → 3. Tras unlink de practica1.c → 2, y tras unlink de p1.c → **1**. El inodo 5002 no se libera porque aún tiene 1 enlace.`,
  },
  {
    id: "2024-01_ficheros_p4",
    examId: "2024-01",
    topic: "sistema-ficheros",
    type: "matching",
    points: 0.6,
    question: `Indicar si es cierto/falso en cada pregunta. Cada apartado puntúa 0.1p. Cada respuesta errónea puntúa -0.1p. Cuestiones no respondidas no puntúan. La puntuación mínima de P4 es 0, es decir, en ningún caso P4 lleva a puntuación negativa para el total del examen.`,
    correctAnswer: {
      "A. El número de aperturas de un fichero se mantiene en el inodo en memoria, no en el inodo en disco (en la lista de inodos en disco). Cierto/Falso:":
        "V",
      "B. Al ejecutar la función *sin(x)* de la librería matemática, el proceso está ejecutando exclusivamente en modo usuario. Cierto/Falso:":
        "V",
      "C. La librería estándar de C (*libC*) incluye el código binario de *unlink()*. Cierto/Falso:":
        "F",
      "D. Las librerías dinámicas facilitan la actualización de componentes del SO. Cierto/Falso:":
        "V",
      "E. Un sistema de ficheros con registro (*journaling file system*) disminuye la fragmentación externa. Cierto/Falso:":
        "F",
      "F. La asociación entre el *uid* (*user identifier*) del inodo y el nombre simbólico del usuario (propietario del fichero) se encuentra en el fichero */etc/passwd* y puede obtenerse con *getpwuid*. Cierto/Falso:":
        "V",
    },
  },
  {
    id: "2024-01_memoria_1a",
    examId: "2024-01",
    topic: "memoria",
    type: "fill",
    points: 0.5,
    question: `Un proceso tiene la cadena de referencias a páginas que se muestra y tiene asignados cuatro marcos de memoria. Las cuatro primeras referencias, esto es, las referencias a las páginas 2, 4, 5 y 1, producen necesariamente 4 fallos de página porque ninguna página del proceso estaba en memoria. ¿Cuál es el número total de fallos de página que se producen con el algoritmo de reemplazo FIFO Segunda Oportunidad en las 10 primeras referencias? Obviamente hay que contar esos 4 fallos iniciales en el total. Tanto la asignación de páginas a frames como el total de número de fallos deben ser correctos para puntuar la pregunta.

Cadena de referencias:

| 2 | 4 | 5 | 1 | 3 | 5 | 6 | 2 | 5 | 3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
    fillStatements: [
      { text: "Número total de fallos de página: {{blank}}" },
      {
        text: "Contenido de los 4 marcos al final de las 10 referencias (de arriba abajo, separados por comas): {{blank}}",
      },
    ],
    correctAnswer: ["7", "3, 6, 5, 2"],
    development: `FIFO Segunda Oportunidad (algoritmo del reloj) con 4 marcos. Cada página cargada/referenciada tiene el bit de referencia a 1; al reemplazar se recorre el reloj desde la posición actual dando una segunda oportunidad (se limpia el bit y se avanza) a las páginas con bit de referencia a 1.

| Ref | 2 | 4 | 5 | 1 | 3 | 5 | 6 | 2 | 5 | 3 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Marco 1 | 2 | 2 | 2 | 2 | 3 | 3 | 3 | 3 | 3 | 3 |
| Marco 2 | | 4 | 4 | 4 | 4 | 4 | 6 | 6 | 6 | 6 |
| Marco 3 | | | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| Marco 4 | | | | 1 | 1 | 1 | 1 | 2 | 2 | 2 |
| Fallo | F | F | F | F | F | | F | F | | |

- Referencia 5 (página 3): fallo. Las páginas 2, 4, 5 y 1 tienen el bit de referencia a 1 (se limpian en una vuelta completa) y se reemplaza la página 2 por la 3 → marcos [3, 4, 5, 1].
- Referencia 7 (página 6): fallo. El reloj está en la posición de la página 4, con bit 0 → se reemplaza por 6 → [3, 6, 5, 1].
- Referencia 8 (página 2): fallo. El reloj está en la página 5, que fue referenciada (bit 1) → se limpia y se avanza; la página 1 tiene bit 0 → se reemplaza por 2 → [3, 6, 5, 2].
- Referencias 6, 9 y 10 (páginas 5, 5 y 3): aciertos.

Total de fallos: **7**. Contenido final de los marcos: **3, 6, 5, 2**.`,
  },
  {
    id: "2024-01_memoria_1b",
    examId: "2024-01",
    topic: "memoria",
    type: "matching",
    points: 0.5,
    question: `Respecto al algoritmo de reemplazo FIFO Segunda Oportunidad de la pregunta anterior, conteste SI/NO y la razón a las siguientes preguntas:`,
    correctAnswer: {
      "B1. ¿Puede este algoritmo aplicarse con asignación variable de memoria a procesos y reemplazo global? Conteste SI/NO y la razón":
        "SI",
      "B2. ¿Para implementar este algoritmo es necesario el bit de referencia? Conteste SI/NO y la razón":
        "SI",
      "B3. ¿Para implementar este algoritmo es necesario el bit de presencia? Conteste SI/NO y la razón":
        "SI",
      "B4. ¿Para implementar este algoritmo es necesario el dirty bit (bit de modificación)? Conteste SI/NO y la razón":
        "NO",
      "B5. ¿Para implementar este algoritmo es necesario el lock bit? Conteste SI/NO y la razón":
        "NO",
    },
    explanation: `**B1:** SI, el algoritmo (en su variante de reloj) puede usarse con asignación variable de memoria a procesos y reemplazo global: se mantiene un reloj sobre todos los marcos y se busca la página víctima entre los marcos del sistema.

**B2:** SI, el bit de referencia es la esencia del algoritmo: permite dar la "segunda oportunidad" a las páginas referenciadas recientemente.

**B3:** SI, hace falta el bit de presencia para saber si una página está en memoria; si no está presente se produce el fallo de página.

**B4:** NO, el algoritmo no necesita saber si la página ha sido modificada: no distingue entre páginas limpias y sucias a la hora de elegir víctima (en una implementación con soporte hardware de escritura diferida puede usarse para optimizar, pero no es necesario).

**B5:** NO, el algoritmo no necesita bloquear páginas en memoria.

Explicado todo en las clases de la asignatura.`,
  },
  {
    id: "2024-01_memoria_2",
    examId: "2024-01",
    topic: "memoria",
    type: "text",
    points: 1.0,
    question: `Considere este código. Debe escribir en el espacio reservado 10 sentencias printf para obtener (las direcciones en hexadecimal):
\`\`\`c
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int f1(int f)
{
    int a,b;
    a=4;
    b=a++;
    return(a+b+f);
}

int main(int argc, char *s[], char *t[])
{
    char *d;
    double e;

    e= (double) f1(3);
    d=(char *) malloc(100);
    strcpy(d,"alfa");

    /* escribir aquí las 10 sentencias printf */

    free(d);
    exit(0);
}
\`\`\`

1. dirección de una variable almacenada en la pila de usuario
2. dirección de otra variable almacenada en la pila de usuario
3. una dirección del heap
4. otra dirección del heap
5. número de tokens de la línea de comando como entero
6. una dirección del segmento de código del programa
7. otra dirección del segmento de código del programa
8. el nombre del ejecutable como string
9. la primera variable de entorno como string
10. la dirección del array de punteros a las variables de entorno`,
    correctAnswer: `Las 10 sentencias printf (una posible solución, la que aparece en el examen):

\`\`\`c
printf ("dir variable almacenada en pila usuario: %p\\n",&d);
printf ("dir otra variable almacenada en pila usuario: %p\\n",&e);
printf ("una dir heap: %p\\n",&d[0]);
printf ("otra dir heap: %p\\n",&d[1]);
printf ("num tokens linea comando como entero: %d\\n",argc);
printf ("dir segmento código del programa: %p\\n",f1);
printf ("otra dir segmento código del programa %p\\n",f1 +1);
printf ("nombre del ejecutable como string %s\\n",s[0]);
printf ("primera variable de entorno como string %s\\n",t[0]);
printf ("dir array punteros a las var entorno %p\\n",&t);
\`\`\``,
  },
  {
    id: "2024-01_es_1",
    examId: "2024-01",
    topic: "entrada-salida",
    type: "text",
    points: 1.0,
    question: `Este código se compila y ejecuta sin errores; considere además una ejecución en la que las llamadas al sistema no devuelven error. Debe indicar cuál es la salida que se produce por el terminal (o indique NINGUNA si la salida es nula) y el contenido del archivo 1.txt al finalizar la ejecución (o indique VACÍO si existe con 0 bytes, o BORRADO si ha sido borrado). Finalmente debe dar una explicación de lo que hace el código y por qué produce esa salida; sin esta explicación la pregunta no consigue puntuación.
\`\`\`c
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>

int main(int argc, char *s[], char *t[])
{
    int fda, fdb, pid;
    if ((fda=open("./1.txt", O_CREAT | O_TRUNC | O_RDWR ,0777))==-1){
        perror("No se puede abrir fichero objetivo");
        exit(0);
    }
    fdb=dup(STDOUT_FILENO);
    close(STDOUT_FILENO);
    dup(fda);

    write(STDOUT_FILENO, "1.TXT-CREATED-", 14);

    if ((pid=fork())==-1) {
        perror("Fallo en fork");
        exit(0);
    }
    else if (pid==0)
        write(STDOUT_FILENO, "A", 1);
    else { }

    write(STDOUT_FILENO, "B", 1);

    close(STDOUT_FILENO);
    dup(fdb);

    write(STDOUT_FILENO, "Y", 1);
    write(STDOUT_FILENO, "Z", 1);

    close(fdb);
    exit(0);
}
\`\`\``,
    correctAnswer: `**Salida por terminal:** YZYZ

**Contenido de 1.txt:** 1.TXT-CREATED-BAB

**Explicación:** fdb = dup(1) guarda una copia del descriptor 1 (terminal) → fdb = 3. A continuación close(1) libera el descriptor 1 y dup(fda) lo duplica en el descriptor libre más bajo → el descriptor 1 apunta ahora a 1.txt (con O_TRUNC). Por tanto el write de "1.TXT-CREATED-" va al fichero 1.txt. Tras el fork, el hijo y el padre comparten la misma entrada de la Tabla de Ficheros Abiertos (y por tanto el mismo offset); el hijo escribe "A" y ambos procesos escriben "B" en el fichero → "1.TXT-CREATED-BAB" (el orden de A y B puede variar: en las partes en las que dos procesos se ejecutan concurrentemente son posibles otros entrelazados). Después, ambos procesos cierran el descriptor 1 y ejecutan dup(fdb): el descriptor 1 vuelve a apuntar al terminal; ambos escriben "Y" y "Z" → "YZYZ" en el terminal.`,
  },
  {
    id: "2024-01_procesos_q1",
    examId: "2024-01",
    topic: "procesos",
    type: "matching",
    points: 1.0,
    repeated: true,
    question: `Responda Verdadero/Falso (o no conteste) a cada pregunta (correcta 0.1; incorrecta -0.1). La puntuación mínima es cero para esta pregunta.`,
    correctAnswer: {
      "1. En un Sistema Operativo Multiusuario, el número de usuarios que puede soportar está limitado por el microprocesador. Cierto/Falso:":
        "F",
      "2. Sólo un proceso con credencial efectiva del root puede cambiar sus credenciales mediante una de las llamadas exec. Cierto/Falso:":
        "F",
      "3. Los manejadores de interrupción se almacenan en la pila del kernel. Cierto/Falso:":
        "F",
      "4. Un proceso zombie no ocupa una entrada en la tabla de procesos. Cierto/Falso:":
        "F",
      "5. Las llamadas al sistema exec pueden reemplazar los datos y la pila de un proceso, pero no el código. Cierto/Falso:":
        "F",
      "6. Inmediatamente después de su creación, un proceso creado mediante fork() tiene SIEMPRE la misma credencial efectiva que su proceso padre, aunque la real puede no coincidir. Cierto/Falso:":
        "F",
      "7. Todo proceso es una sucesión de ráfagas de CPU y e/s y comienza y termina SIEMPRE (independientemente del S.O.) con una ráfaga de CPU. Cierto/Falso:":
        "V",
      "8. Un algoritmo apropiativo siempre produce más cambios de contexto (o como mucho los mismos) que uno no apropiativo. Cierto/Falso:":
        "V",
      "9. La prioridad es un entero y su rango de valores depende, en parte, del microprocesador, p.e. una versión de linux para procesadores intel probablemente tenga distintos valores para las prioridades que la misma versión para procesadores superSPARC. Cierto/Falso:":
        "F",
      "10. En un sistema tipo UNIX, la Tabla de Ficheros Abiertos del sistema es parte de los datos de kernel. Cierto/Falso:":
        "V",
    },
  },
  {
    id: "2024-01_procesos_q2",
    examId: "2024-01",
    topic: "procesos",
    type: "table-fill",
    points: 0.75,
    question: `Se muestra el código de un shell para la ejecución creando procesos en primer y segundo plano. tr es un array terminado a NULL de punteros a caracter con el ejecutable y sus parámetros. Asumimos que un & al final indica ejecución en segundo plano. Se supone además que dicho shell lleva una lista de los procesos que ejecuta en segundo plano (LP). Para cada una de las sentencias marcadas /*UNO*/, /*DOS*/ y /*TRES*/ decir si es NECESARIA, INCORRECTA o SUPERFLUA (no es necesaria ni incorrecta, es decir el código funciona tanto con ella como sin ella) justificándolo adecuadamente.
\`\`\`c
ListaProcesos LP;
...
int ComprobarSegundoPlano(char *tr[])
{
    int i;
    for (i=0; tr[i]!=NULL; i++)
    if (!strcmp(tr[i],"&")){
    tr[i]=NULL;    /*UNO*/
    return 1;
    }
    return 0;
}
void Proceso (char *tr[])
{
    int back;
    pid_t pid;
    back=ComprobarSegundoPlano (tr);
    if ((pid=fork())==-1){
    perror ("Impossible crear proceso");
    return;
    }
    if (pid==0){
    if (execvp(tr[0], tr)==-1)
    perror ("Impossible ejecutar");
    exit(255);    /*DOS*/
    }
    if (!back)
    wait (NULL);    /*TRES*/
    else
    MeterProceso(&LP,pid,tr);
}
\`\`\``,
    tableFill: {
      headers: ["Sentencia", "Clasificación"],
      rows: [
        ["/*UNO*/ tr[i]=NULL;", "{{blank}}"],
        ["/*DOS*/ exit(255);", "{{blank}}"],
        ["/*TRES*/ wait(NULL);", "{{blank}}"],
      ],
    },
    correctAnswer: ["NECESARIA", "NECESARIA", "INCORRECTA"],
    development: `| Sentencia | Clasificación | Justificación |
| --- | --- | --- |
| UNO | **NECESARIA** | El & es un símbolo del shell para indicar que la ejecución es en segundo plano. Si no hacemos tr[i]=NULL, el programa a ejecutar recibe el símbolo & como parámetro, lo cual es incorrecto. |
| DOS | **NECESARIA** | En el caso de que execvp falle (ejecutable no existe, falta de permisos de ejecución, formato incorrecto de ejecutable...), debemos terminar la ejecución del proceso hijo; de lo contrario, cada vez que execvp no pueda ejecutar lo que se le pide, habrá otra copia del shell. |
| TRES | **INCORRECTA** | En el caso de que la ejecución no sea en segundo plano (!back) el shell debe esperar, pero dado que hay procesos en segundo plano, deberá usar waitpid para esperar específicamente por el proceso en primer plano, ya que wait espera por cualquiera (p.e. uno de los que esté en segundo plano). Lo correcto sería usar waitpid (pid, NULL, 0). |`,
  },
  {
    id: "2024-01_procesos_q3",
    examId: "2024-01",
    topic: "procesos",
    type: "table-fill",
    points: 0.75,
    question: `Un sistema tiene una planificación con múltiples colas. Hay tres colas: la cola SYS para procesos del sistema, la cola INT para procesos interactivos de los usuarios y la cola BAT para procesos no interactivos. La planificación entre las colas es por prioridades apropiativas, siendo la cola SYS la cola de prioridad más alta y la cola BAT la de prioridad más baja. La planificación en la cola SYS es un RR de cuanto 1, la cola INT lleva una planificación RR de cuanto 3 y la cola BAT se planifica por FCFS. Mostrar la planificación de la CPU en el cuadro para los siguientes procesos: A, proceso interactivo de usuario, con una ráfaga CPU de 7 y llega en el instante 0; B, proceso interactivo de usuario, con una ráfaga CPU de 4 y que llega en el instante 1; C, proceso del sistema con una ráfaga CPU de 6 y que llega en el instante 6; D, proceso del sistema con una ráfaga CPU de 3 y que llega en el instante 12.`,
    tableFill: {
      headers: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
      ],
      rows: [
        [
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
          "{{blank}}",
        ],
      ],
    },
    correctAnswer: [
      "A",
      "A",
      "A",
      "B",
      "B",
      "B",
      "C",
      "C",
      "C",
      "C",
      "C",
      "C",
      "D",
      "D",
      "D",
      "A",
      "A",
      "A",
      "B",
      "A",
    ],
    development: `| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | A | A | B | B | B | C | C | C | C | C | C | D | D | D | A | A | A | B | A |

- Instante 0: llega A (INT, ráfaga 7). Ejecuta su cuanto RR de 3: 0-3 (usa 3 de 7).
- Instante 1: llega B (INT, ráfaga 4), pasa a la cola INT detrás de A.
- Instante 3: A agota su cuanto; B ejecuta su cuanto RR de 3: 3-6 (usa 3 de 4).
- Instante 6: llega C (SYS, ráfaga 6). La cola SYS tiene prioridad más alta → apropia a B. C ejecuta 6-12 (cuanto 1, pero es el único proceso de la cola SYS).
- Instante 12: C termina y llega D (SYS, ráfaga 3) → D ejecuta 12-15.
- Instante 15: D termina; vuelve la cola INT: A (le quedan 4) ejecuta su cuanto de 3: 15-18; B (le queda 1) ejecuta 18-19; A (le queda 1) ejecuta 19-20.

Planificación final: **A A A B B B C C C C C C D D D A A A B A**.`,
  },
  {
    id: "2023-07_ficheros_p1",
    examId: "2023-07",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.6,
    question: `Un sistema de archivos tipo UNIX System V tiene un tamaño de bloque de 2 Kbytes, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 4 bytes. Calcular cuántos bloques son necesarios en el área de datos para representar un fichero con un tamaño de 516 Mbytes + 1048 bytes, diferenciando entre bloques de datos y bloques de índices.`,
    fillStatements: [
      { text: "Nº bloques de datos: {{blank}}" },
      { text: "Nº de bloques de índices: {{blank}}" },
      { text: "Fragmentación interna del fichero: {{blank}}" },
    ],
    correctAnswer: ["258K+1", "519", "1000 bytes"],
    development: `**Cálculo:** Bloque de 2 Kbytes y direcciones de bloque de 4 bytes → cada bloque de índices almacena 2048/4 = 512 direcciones.

Bloques de datos: 516 Mbytes = 516 × 1024 = 528384 Kbytes → 528384 / 2 = 264192 bloques completos de 2 Kbytes. Los 1048 bytes restantes ocupan un bloque parcial más → **264193 = 258K + 1 bloques de datos**.

Bloques de datos que necesitan índice: 264193 - 10 directos = 264183.

- Indirecta simple: 1 bloque de índice (cubre 512 bloques).
- Quedan 264183 - 512 = 263671 bloques para la indirecta doble → 1 bloque de primer nivel + 512 bloques de segundo nivel.
- Quedan 263671 - 262144 = 1527 bloques para la indirecta triple → 1 bloque de primer nivel + 1 bloque de segundo nivel + ⌈1527/512⌉ = 3 bloques de tercer nivel.

Total bloques de índices: 1 + (1 + 512) + (1 + 1 + 3) = **519**.

Fragmentación interna: 2048 - 1048 = **1000 bytes**.`,
  },
  {
    id: "2023-07_ficheros_p2",
    examId: "2023-07",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.2,
    question: `En ese sistema de archivos UNIX (P1, tamaño de bloque de 2 Kbytes), el *boot* ocupa los 3 primeros bloques de su partición de disco. Por tanto, el *superbloque* comienza en el bloque lógico 3 de la partición de disco del sistema de ficheros (se numera a partir del bloque 0). El fichero "datos" tiene asociado el inodo 60 (los inodos comienzan con el inodo 1) y ese inodo está en el bloque (lógico) 13 desde el principio de la partición. El tamaño del inodo es de 64 bytes. Calcula el tamaño (en Kbytes, no bloques) del *superbloque* y el bloque lógico (desde el principio de la partición) correspondiente al inodo 3201.`,
    fillStatements: [
      { text: "Tamaño del *superbloque*: {{blank}} (Kbytes)" },
      { text: "Bloque lógico del inodo 3201: {{blank}}" },
    ],
    correctAnswer: ["18", "112"],
    development: `Inodos por bloque: 2048 / 64 = **32 inodos por bloque**.

El inodo 60 está en el bloque lógico 13. Los inodos se numeran desde 1: el inodo 60 ocupa la posición 59 → bloque relativo ⌊59/32⌋ = 1 dentro de la lista de inodos. Por tanto la lista de inodos comienza en el bloque lógico 13 - 1 = **12**.

El *superbloque* va del bloque 3 al 11 → 12 - 3 = 9 bloques × 2 Kbytes = **18 Kbytes**.

Inodo 3201: posición 3201 - 1 = 3200 → bloque relativo 3200/32 = 100 → bloque lógico 12 + 100 = **112**.`,
  },
  {
    id: "2023-07_ficheros_p3",
    examId: "2023-07",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.6,
    question: `En el sistema de archivos del problema P1 (tamaño de bloque 2 Kbytes, 10 punteros directos, ...), tenemos el archivo \`/home/juan/so/p1.c\` con un tamaño de 3 Mbytes e inodo número 6549 con número de hard links inicial de 2. Al ejecutar un proceso (con el código principal indicado a continuación), el usuario efectivo del proceso coincide con el propietario del fichero (p1.c), y tiene además los permisos de acceso y lectura a los directorios *raíz*, *home*, *juan* y *so*. Las cachés de datos e inodos están inicialmente vacías y la entrada p1.c está en el segundo bloque de su directorio padre (so), mientras las demás entradas están en el primer bloque de su directorio padre. Indicar lo siguiente referente al trozo de código:

\`\`\`c
struct stat buf, char c;
int fd1,fd2,fd3;
chmod("/home/juan/so/p1.c", 0752);
printf("%s", convertir_permisos(0752)); /* se convierten los permisos en octal a formato rwxrwxrwx y se imprimen*/
fd1=open("/home/juan/so/p1.c", O_RDONLY); /* es la primera apertura de fichero del proceso */
link("/home/juan/so/p1.c", "/home/juan/so/practica1.c"); /* se crea hard link practica1.c */
symlink("/home/juan/so/practica1.c", "/home/juan/so/slink_practica1.c"); /* se crea link simbólico a practica1.c */
fd2=open("/home/juan/so/practica1.c", O_RDONLY); /*segunda apertura */
lseek(fd2, 524288, SEEK_SET); /* 524288 = 2^19 */
/* SEEK_SET indica que el desplazamiento se considera a partir del origen del fichero */
c=fgetc(fd2);
fd3=dup(fd2);
close(fd2); close(fd1); close (fd3);
unlink("/home/juan/so/p1.c");
\`\`\``,
    fillStatements: [
      {
        label: "A.",
        text: "¿Cuál es el número de accesos necesarios a disco, únicamente en el área de datos, en la primera apertura de p1.c?: {{blank}}",
      },
      {
        label: "B.",
        text: "Indica el número de bloques que el SO necesita leer en disco para obtener el valor de c en fgetc(fd2): {{blank}}",
      },
      {
        label: "C.",
        text: "¿Cuál es el valor asignado al descriptor de fichero fd3?: {{blank}}",
      },
      {
        label: "D.",
        text: "Al ejecutar unlink, ¿cuántos bloques de datos (no índices) del fichero p1.c se liberan en el área de datos?: {{blank}}",
      },
      {
        label: "E.",
        text: "¿Cuál es el número de hard links de slink_practica1.c después de ejecutar unlink?: {{blank}}",
      },
      {
        label: "F.",
        text: "Indica los permisos del fichero que se imprimen en formato rwxrwxrwx: {{blank}}",
      },
    ],
    correctAnswer: ["5", "2", "5", "0", "1", "rwx r-x -w-"],
    development: `**A.** Accesos en el área de datos en la primera apertura de p1.c: bloque del directorio raíz (1) + bloque de *home* (1) + bloque de *juan* (1) + primer bloque de *so* (1) + segundo bloque de *so*, donde está la entrada p1.c (1) = **5**. La lectura del inodo 6549 se produce en la lista de inodos, no en el área de datos.

**B.** lseek(fd2, 524288, SEEK_SET) → bloque de datos 524288/2048 = 256. Los 10 punteros directos cubren los bloques 0-9; la indirecta simple cubre los bloques 10-521, por lo que el bloque 256 se accede a través de la indirecta simple. Como la caché de datos está vacía: lectura del bloque de índice indirecto (1) + lectura del bloque de datos (1) = **2**.

**C.** Descriptores ocupados: 0 (stdin), 1 (stdout), 2 (stderr). fd1 = 3 (primera apertura), fd2 = 4 (segunda apertura), fd3 = dup(fd2) = **5**.

**D.** Tras crear el hard link practica1.c el fichero tiene 3 enlaces; unlink de p1.c lo deja en 2 → el inodo 6549 no se libera → **0** bloques de datos liberados.

**E.** slink_practica1.c es un enlace simbólico; su número de hard links es **1** y no cambia con el unlink de p1.c.

**F.** chmod 0752 → **rwx r-x -w-**.`,
  },
  {
    id: "2023-07_ficheros_p4",
    examId: "2023-07",
    topic: "sistema-ficheros",
    type: "matching",
    points: 0.6,
    question: `Indicar si es cierto/falso en cada pregunta. (Cada apartado puntúa 0.1p. Cada respuesta errónea puntúa -0.1. Cuestiones no respondidas no puntúan. La puntuación mínima de esta parte es 0.)`,
    correctAnswer: {
      "A. El S.O. puede abrir varias veces un fichero y con distintos modos de apertura, y ese número de aperturas se mantiene en el inodo en memoria, pero no en el inodo en la Lista de Inodos en disco. Cierto/Falso:":
        "V",
      "B. Al linear un código con una librería dinámica, las funciones necesarias de la librería se integran en el fichero ejecutable. Cierto/Falso:":
        "F",
      "C. Al ejecutar la función *printf* de C se incrementa tanto el tiempo de ejecución en modo usuario como en modo sistema. Cierto/Falso:":
        "V",
      "D. Es posible crear *hard links* entre diferentes sistemas de ficheros montados. Cierto/Falso:":
        "F",
      "E. La idea fundamental de un sistema de ficheros Unix basado en registro (*journaling file system*) es llevar control/registro de las creaciones y eliminaciones de los ficheros a lo largo del tiempo. Cierto/Falso:":
        "F",
      "F. El *Buffer Cache* reduce tanto el número de lecturas como de escrituras físicas sobre los discos montados. Cierto/Falso:":
        "V",
    },
  },
  {
    id: "2023-07_memoria_1",
    examId: "2023-07",
    topic: "memoria",
    type: "matching",
    points: 1.0,
    question: `Cada una de las preguntas siguientes son de responder V/F (Verdadero/Falso) o no responder. Respuesta correcta: +0.1; Respuesta incorrecta: -0.1. Puntuación mínima para esta pregunta: 0.`,
    correctAnswer: {
      "1. En sistemas con tablas de páginas multinivel, sólo las páginas del último nivel de la tabla de páginas almacenan la dirección de páginas físicas.":
        "F",
      "2. Las entradas de una tabla de páginas invertida, además de bits de control y otros usos, almacenan la dirección de la página física que se corresponde con una página lógica.":
        "F",
      "3. Una llamada al sistema fork() con el mecanismo copy-on-write no copia la tabla de páginas del proceso padre en el proceso hijo.":
        "F",
      "4. Una llamada al sistema vfork() no copia la tabla de páginas del proceso padre en el proceso hijo.":
        "V",
      "5. Un servicio de fallo de página siempre tiene que actualizar la tabla de páginas del proceso.":
        "V",
      "6. El Working Set de un proceso calculado en sus últimas 1000 referencias a memoria es siempre mayor o igual al calculado en sus últimas 500 referencias a memoria.":
        "V",
      "7. En un sistema con paginación por demanda pura, para que un proceso pueda ejecutar su primera instrucción se necesita prepaginar la página de código que contiene la primera instrucción antes de que el proceso pase al estado en ejecución.":
        "F",
      "8. En un sistema de memoria basado en un registro base y un registro límite no puede haber intercambio de procesos a disco.":
        "F",
      "9. El sistema operativo Linux, gestiona la memoria con segmentación paginada.":
        "V",
      "10. Una ventaja de las librerías de enlace dinámico con respecto a las librerías de enlace estático es el ahorro de memoria física.":
        "V",
    },
  },
  {
    id: "2023-07_memoria_2a",
    examId: "2023-07",
    topic: "memoria",
    type: "fill",
    points: 0.4,
    question: `Un sistema de paginación utiliza direcciones lógicas de 16 bits y páginas de 4 Kilobytes. A continuación se muestran las tablas de páginas de dos procesos en ejecución, Proceso 1 y Proceso 2. Solo las entradas e información necesaria para la traducción de direcciones se muestran en la tabla (los bits de permiso y otros no se muestran), y los valores se muestran en decimal. Traduzca las direcciones lógicas a sus direcciones físicas correspondientes.

Tabla de páginas del Proceso 1 (P1):

| Página | Marco |
| --- | --- |
| 0 | 3 |
| 1 | 7 |
| 2 | 1 |
| 3 | 5 |

Tabla de páginas del Proceso 2 (P2):

| Página | Marco |
| --- | --- |
| 0 | 2 |
| 1 | 0 |
| 2 | 6 |
| 3 | 4 |`,
    fillStatements: [
      { label: "P1 (11034)", text: "Dirección física: {{blank}}" },
      { label: "P2 (12345)", text: "Dirección física: {{blank}}" },
    ],
    correctAnswer: ["6938", "16441"],
    development: `Páginas de 4 Kbytes = 4096 bytes.

**P1:** 11034 / 4096 = 2 (página 2), offset 2842. La TP de P1 dice página 2 → marco 1. Dirección física: 1 × 4096 + 2842 = **6938**.

**P2:** 12345 / 4096 = 3 (página 3), offset 57. La TP de P2 dice página 3 → marco 4. Dirección física: 4 × 4096 + 57 = **16441**.`,
  },
  {
    id: "2023-07_memoria_2b",
    examId: "2023-07",
    topic: "memoria",
    type: "text",
    points: 0.2,
    question: `Si el sistema no tiene memoria virtual, ¿podría ejecutar simultáneamente otros dos procesos P3 y P4, copias de P1 y P2 respectivamente? Si/No, ¿por qué?`,
    correctAnswer: `Sí, si tiene suficiente memoria física instalada y las entradas en la TP tienen bits suficientes para direccionar ese número de frames.`,
  },
  {
    id: "2023-07_memoria_2c",
    examId: "2023-07",
    topic: "memoria",
    type: "text",
    points: 0.2,
    question: `Si el sistema no tiene memoria virtual, ¿podría ejecutar simultáneamente, con P1 y P2, otro proceso P3 que necesite 20 páginas lógicas para su ejecución? Si/No, ¿por qué?`,
    correctAnswer: `No. Las direcciones lógicas sólo tienen 4 bits para el número de página. Máximo 16 páginas lógicas de un proceso.`,
  },
  {
    id: "2023-07_memoria_2d",
    examId: "2023-07",
    topic: "memoria",
    type: "table-fill",
    points: 0.2,
    question: `Construye una tabla de páginas invertida para un sistema que pueda ejecutar simultáneamente los procesos P1 y P2 del apartado a). Rellena el identificador de proceso y el número de página lógica que ocupa cada marco.`,
    tableFill: {
      headers: ["Marco", "Process ID", "Número página"],
      rows: [
        ["0", "{{blank}}", "{{blank}}"],
        ["1", "{{blank}}", "{{blank}}"],
        ["2", "{{blank}}", "{{blank}}"],
        ["3", "{{blank}}", "{{blank}}"],
        ["4", "{{blank}}", "{{blank}}"],
        ["5", "{{blank}}", "{{blank}}"],
        ["6", "{{blank}}", "{{blank}}"],
        ["7", "{{blank}}", "{{blank}}"],
      ],
    },
    correctAnswer: [
      "2",
      "1",
      "1",
      "2",
      "2",
      "0",
      "1",
      "0",
      "2",
      "3",
      "1",
      "3",
      "2",
      "2",
      "1",
      "1",
    ],
    development: `La tabla de páginas invertida tiene una entrada por marco físico. Para cada marco se indica qué proceso lo usa y qué página lógica de ese proceso reside en él.

De las tablas de páginas del apartado a):

| Proceso | Página lógica | Marco |
| --- | --- | --- |
| P1 | 0 | 3 |
| P1 | 1 | 7 |
| P1 | 2 | 1 |
| P1 | 3 | 5 |
| P2 | 0 | 2 |
| P2 | 1 | 0 |
| P2 | 2 | 6 |
| P2 | 3 | 4 |

Invertida (por marco): marco 0 → P2 página 1; marco 1 → P1 página 2; marco 2 → P2 página 0; marco 3 → P1 página 0; marco 4 → P2 página 3; marco 5 → P1 página 3; marco 6 → P2 página 2; marco 7 → P1 página 1.`,
  },
  {
    id: "2023-07_procesos_q1",
    examId: "2023-07",
    topic: "procesos",
    type: "matching",
    points: 1.0,
    question: `Responda Verdadero/Falso (o no conteste) a cada pregunta (0.1 cada una). Respuesta incorrecta: -0.1. La puntuación mínima es cero para esta pregunta.`,
    correctAnswer: {
      '1. Un sistema Operativo Multiproceso solo puede correr en ordenadores cuyo microprocesador tenga la instrucción "crear proceso".':
        "F",
      "2. En un Sistema Operativo Multiusuario, el número de usuarios que puede soportar está limitado por el microprocesador.":
        "F",
      "3. El administrador (root) de un sistema puede decidir que un proceso cualquiera se ejecute todo el rato en modo kernel.":
        "F",
      "4. Un proceso zombie ocupa una entrada en la tabla de procesos.": "V",
      "5. La credencial efectiva de un proceso puede cambiar al hacer una llamada exec.":
        "V",
      "6. Después de hacer fork() las credenciales reales y efectivas de los procesos padre e hijo son exactamente las mismas.":
        "V",
      "7. Un proceso con la mínima prioridad puede usar el 100% de la CPU si no hay más procesos listos (runnable) en el sistema.":
        "V",
      "8. Desde el punto de vista de tiempo de CPU dedicado a los procesos de usuario un algoritmo no apropiativo es más eficiente que uno apropiativo.":
        "V",
      '9. La instrucción "cambiar prioridad" existe en los microprocesadores actuales y además es una instrucción privilegiada.':
        "F",
      "10. En un sistema, todos los procesos creados mediante fork() tienen el mismo conjunto de variables de entorno.":
        "F",
    },
  },
  {
    id: "2023-07_procesos_q2",
    examId: "2023-07",
    topic: "procesos",
    type: "text",
    points: 0.5,
    question: `Queremos que un shell lleve una lista de procesos que ejecuta en segundo plano; en el cuadro vemos la declaración de la lista (implementada como array) y la función ActualizarListaProcesos, que será invocada para actualizar la lista de procesos en segundo plano. Se supone que el shell mete los procesos (con los valores adecuados en su struct PROCESO) al ser creados como ACTIVOS. En el apéndice puede verse la documentación de las llamadas al sistema y macros utilizadas.

\`\`\`c
#define ACTIVO 1
#define PARADO 2
#define SENALADO 4
#define TERMINADO 8
#define ALL 15

struct PROCESO {
    pid_t pid;
    uid_t uid;
    int estado;
    int valor;    /*para almacenar el valor o la senal*/
    time_t hora;
    char *linea;
};

struct LISTAPROC {
    struct PROCESO d[MAXLISTAPROC];
    int fin;
};
typedef struct LISTAPROC TLISTAPROC;
...
void actualizarProceso (struct PROCESO* p)
{
    int est;

    if (waitpid(p->pid,&est,WNOHANG |WUNTRACED |WCONTINUED)!=-1){
    if (WIFEXITED(est))
    {p->estado=TERMINADO; p->valor=WEXITSTATUS(est);}
    else if (WIFSIGNALED(est))
    {p->estado=SENALADO; p->valor=WTERMSIG(est);}
    else if (WIFSTOPPED(est))
    {p->estado=PARADO; p->valor=WSTOPSIG(est);}
    else if (WIFCONTINUED(est))
    {p->estado=ACTIVO; p->valor=0;}
    }
}
void ActualizarListaProcesos(TLISTAPROC *l)
{
    int i;
    for (i=0; i<l->fin; i++)
    actualizarProceso (&l->d[i]);
}
\`\`\`

a) Código incorrecto: explicar por qué.`,
    correctAnswer: `Es incorrecta porque waitpid() puede devolver:

- **-1**: error, p.e. el proceso cuyo pid se le pasa no existe.
- **el pid que recibe**: hay cambios en el proceso que se reporten en el entero est.
- **0**: se ha llamado con WNOHANG y no tiene nada que informar; en ese caso no devuelve información en el entero est.

Al comprobar únicamente \`!= -1\`, el valor 0 se interpreta como un cambio de estado y las macros WIF... se aplican a un entero est sin información válida, por lo que el programa no actualiza bien los estados de los procesos.

Debería ser:

\`\`\`c
if (waitpid(p->pid,&est,WNOHANG |WUNTRACED |WCONTINUED)==p->pid){...
\`\`\``,
  },
  {
    id: "2023-07_procesos_q3",
    examId: "2023-07",
    topic: "procesos",
    type: "table-fill",
    points: 0.5,
    repeated: true,
    question: `Sea el siguiente código en C, con todos los includes necesarios y que compila correctamente y que produce un ejecutable a.out.

Tanto a.out como f1.txt son del usuario u1, a.out es ejecutado por un usuario u2, desde el mismo directorio donde están a.out y f1.txt.

Completar el siguiente cuadro indicando las credenciales reales y efectivas del proceso que ejecuta a.out y si alguno de los descriptores df1 o df2 es -1 dependiendo de los permisos de a.out y f1.txt.

\`\`\`c
int main (int argc, char *argv[])
{
    int df1, df2;
    df1=open ("./f1.txt", O_RDWR);
    df2=open ("./f1.txt", O_RDONLY);
    printf("%d, %d\\n", df1, df2);
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
      ],
    },
    correctAnswer: [
      "u2",
      "u2",
      "no",
      "no",
      "u2",
      "u2",
      "SI",
      "NO",
      "u2",
      "u2",
      "SI",
      "NO",
      "u2",
      "u2",
      "SI",
      "NO",
      "u2",
      "u2",
      "SI",
      "NO",
      "u2",
      "u2",
      "SI",
      "SI",
      "u2",
      "u1",
      "NO",
      "NO",
      "u2",
      "u1",
      "NO",
      "NO",
      "u2",
      "u1",
      "NO",
      "NO",
      "u2",
      "u1",
      "NO",
      "NO",
      "u2",
      "u1",
      "NO",
      "NO",
    ],
    development: `EXPLICACION: exec() cambia la credencial efectiva a la del propietario del fichero cuando el fichero ejecutable tiene el permiso setuid; por tanto, en los casos en que a.out tiene el permiso setuid la credencial efectiva es u1. La credencial real es siempre u2 (quien ejecuta). Para el acceso a ficheros se comprueba la credencial efectiva: cuando es u1 se miran los permisos de propietario, y cuando es u2 los permisos del grupo o de resto (es indistinto que u1 y u2 sean o no del mismo grupo: para f1.txt los permisos de grupo son iguales que los de resto). La apertura O_RDWR necesita permiso de escritura; la apertura O_RDONLY sólo necesita permiso de lectura.`,
  },
  {
    id: "2023-07_es_1",
    examId: "2023-07",
    topic: "entrada-salida",
    type: "fill",
    points: 0.5,
    question: `Tenemos un disco que contiene 65536 (=64*1024) sectores. El disco tiene 4 platos y 2 caras en cada plato. Cada sector contiene 512 bytes, y cada pista contiene 16 sectores. Se ha formateado usando bloques de 4096 bytes.

A. ¿Cuál es el número total de cilindros del disco? Justifique su respuesta.
B. ¿Cuántos bloques se pueden almacenar en el disco? Justifique su respuesta.`,
    fillStatements: [
      { text: "A. Número total de cilindros del disco: {{blank}}" },
      {
        text: "B. Número de bloques que se pueden almacenar en el disco: {{blank}}",
      },
    ],
    correctAnswer: ["512", "8192"],
    development: `**A.** Número de pistas: 65536 sectores × (1 pista / 16 sectores) = 4096 pistas. Cada cilindro contiene 2 × 4 = 8 pistas (4 platos × 2 caras). Cilindros: 4096 / 8 = **512**.

**B.** Cada bloque de 4096 bytes ocupa 4096/512 = 8 sectores. Bloques: 65536 / 8 = **8192**.`,
  },
  {
    id: "2023-07_es_2",
    examId: "2023-07",
    topic: "entrada-salida",
    type: "fill",
    points: 0.25,
    question: `El fichero "file.txt" contiene "0123456789\\n". El fichero file2.dat no existe.

Complete las líneas 08 y 09 para que el write de la línea 10 escriba "done" en el fichero file2.dat. NO es posible volver a llamar a open() de nuevo.

\`\`\`c
/* line.01 */ int main() {    /*program_dous23.c*/
/* line.02 */    int i=0,ifd,ofd,bk;
/* line.03 */    bk=dup(STDOUT_FILENO);    // note: STDOUT_FILENO = 1
/* line.04 */    ifd = open("file.txt",O_RDONLY);
/* line.05 */    ofd = open("file2.dat",O_WRONLY|O_CREAT|O_TRUNC, 0666);
/* line.06 */    close(STDOUT_FILENO);
/* line.07 */    dup(ifd);
/* line.08 */    _______________________________
/* line.09 */    _______________________________
/* line.10 */    write(STDOUT_FILENO,"done",4);    /**/
\`\`\``,
    fillStatements: [
      { label: "Línea 08:", text: "{{blank}}" },
      { label: "Línea 09:", text: "{{blank}}" },
    ],
    correctAnswer: ["close(STDOUT_FILENO);", "dup(ofd);"],
    development: `Tras la línea 07: bk = dup(1) → bk = 3; ifd = 4; ofd = 5; close(1) deja libre el descriptor 1; dup(ifd) duplica ifd en el descriptor libre más bajo → el descriptor 1 apunta ahora al fichero "file.txt".

Para que write(1, "done", 4) escriba en file2.dat: la línea 08 debe cerrar de nuevo el descriptor 1 (close(STDOUT_FILENO)) y la línea 09 duplicar ofd en el descriptor libre más bajo (dup(ofd)) → el descriptor 1 apunta a file2.dat.`,
  },
  {
    id: "2023-07_es_3",
    examId: "2023-07",
    topic: "entrada-salida",
    type: "table-fill",
    points: 0.25,
    question: `La cola de peticiones de E/S para acceder a cilindros de un disco contenía las peticiones [165, 190, 33, 40, 250, 200]. Ya se han atendido las peticiones [190] y [200] (en este orden). ¿En qué orden se atenderán las restantes peticiones?`,
    tableFill: {
      headers: ["Algoritmo", "Cilindros accedidos (en orden)"],
      rows: [
        ["C-LOOK", "{{blank}} → {{blank}} → {{blank}} → {{blank}}"],
        ["CSCAN", "{{blank}} → {{blank}} → {{blank}} → {{blank}}"],
      ],
    },
    correctAnswer: ["250", "33", "40", "165", "250", "33", "40", "165"],
    development: `Tras atender 190 y 200 (en ese orden), el cabezal se mueve en sentido ascendente.

**C-LOOK:** sube hasta el cilindro 250 (el más alto pendiente) y luego vuelve al más bajo pendiente (33): **250 → 33 → 40 → 165**.

**CSCAN:** igual que C-LOOK (no hay peticiones por encima de 250): **250 → 33 → 40 → 165**.`,
  },
  {
    id: "2023-07_es_4",
    examId: "2023-07",
    topic: "entrada-salida",
    type: "fill",
    points: 0.5,
    question: `El fichero "a.dat" contiene "ABCDEFGH\\n". ¿Qué se escribe en pantalla en las llamadas a printf de las líneas lin.11 y lin.14?

\`\`\`c
//lin.01: int main(int argc, char *argv[]) /*program catro23.c*/
//lin.02: {
//lin.03: long ret1, ret2;
//lin.04: char BUF1[8] = {'\\0', '\\0', '\\0', '\\0', '\\0', '\\0', '\\0', '\\0'};
//lin.05: char BUF2[8] = {'\\0', '\\0', '\\0', '\\0', '\\0', '\\0', '\\0', '\\0'};
//lin.06: int fd = open("a.dat", O_RDONLY);
//lin.07: lseek(fd, 3, SEEK_CUR);
//lin.08: ret1 = pread(fd, BUF1, 10, 7);
//lin.09: int fd2 = dup(fd);
//lin.10: ret1 = read(fd, BUF1, 2);
//lin.11: printf("%s--%ld", BUF1, ret1);    /**/
//lin.12: close(fd);
//lin.13: ret2 = read(fd2, BUF2, 3);
//lin.14: printf("%s--%ld", BUF2, ret2);    /**/
//lin.15: }
\`\`\`

*Asúmase que no se producen errores durante la ejecución.*`,
    fillStatements: [
      { label: "printf lin.11:", text: "{{blank}}" },
      { label: "printf lin.14:", text: "{{blank}}" },
    ],
    correctAnswer: ["DE--2", "FGH--3"],
    development: `**printf lin.11:** lseek(fd, 3, SEEK_CUR) posiciona el offset de lectura en la posición 3 (se leerá a partir de la 'D'). pread(fd, BUF1, 10, 7) intenta leer 10 bytes desde el offset 7 sin modificar el offset del fichero: sólo quedan 2 (H\\n) → ret1 = 2. A continuación read(fd, BUF1, 2) lee 2 bytes desde el offset 3 → BUF1 = "DE", ret1 = 2. Se muestra **"DE--2"**.

**printf lin.14:** fd2 = dup(fd) comparte la misma entrada de la Tabla de Ficheros Abiertos; el read anterior avanzó el offset compartido a la posición 5. close(fd) no afecta a fd2 (queda abierto). read(fd2, BUF2, 3) lee 3 bytes desde la posición 5 → BUF2 = "FGH", ret2 = 3. Se muestra **"FGH--3"**.`,
  },
  {
    id: "2023-01_ficheros_p1",
    examId: "2023-01",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.6,
    question: `Un sistema de archivos tipo UNIX tiene un tamaño de bloque de 4Kbytes, i-nodos con 10 direcciones directas, una indirecta simple, una indirecta doble y una indirecta triple. Utiliza direcciones de bloque de 8 bytes. Calcular cuántos bloques de disco son necesarios (en el área de datos) para representar un archivo de tamaño 1 Gbytes + 6 Mbytes + 10 Kbytes. Discriminar cuántos bloques son de datos y cuántos de índices.`,
    fillStatements: [
      { text: "Nº bloques de datos: {{blank}}" },
      { text: "Nº de bloques de índices: {{blank}}" },
      { text: "Fragmentación interna del fichero: {{blank}}" },
    ],
    correctAnswer: [
      "0.25 Mbloques + 1.5 Kbloques + 3 bloques",
      "518",
      "2048 bytes",
    ],
  },
  {
    id: "2023-01_ficheros_p2",
    examId: "2023-01",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.5,
    question: `Un proceso abre 2 veces el archivo \`/home/user1/so/practicas/p1.c\`, cuyo número de hard links inicial es 2. El tamaño del fichero es de 1Gbytes + 6Mbytes + 10Kbytes y se suponen los datos referentes al sistema de ficheros del ejercicio P1 (tamaño bloque, punteros acceso directos e indirectos). El usuario efectivo del proceso coincide con el propietario del fichero, y tiene además los permisos de acceso a los directorios raíz, home, user1, so y practicas. Las cachés de datos e inodos están inicialmente vacías. Indicar lo siguiente referente al trozo de código:
\`\`\`c
chmod("/home/user1/so/practicas/p1.c", 0654);
link("/home/user1/so/practicas/p1.c", "/home/user1/so/practicas/p1_hlink.c");
symlink("/home/user1/so/practicas/p1_hlink.c", "/home/user1/so/practicas/p1_slink");
/* crea link simbólico p1_slink */

int fd1=open("/home/user1/so/practicas/p1.c", O_RDONLY); /* es la primera apertura de fichero del proceso */
int fd2=open("/home/user1/so/practicas/p1_hlink.c", O_RDWR);

lseek(fd1, 1.000.000, SEEK_SET); /* SEEK_SET indica que el desplazamiento se considera a partir del origen del fichero */
char c1=fgetc(fd1);

lseek(fd2, 8.000, SEEK_SET);
char c2=fgetc(fd2);

close(fd1); close(fd2);

unlink("/home/user1/so/practicas/p1_slink");
\`\`\``,
    fillStatements: [
      {
        label: "A.",
        text: "¿Cuál es el tamaño del fichero p1_slink?: {{blank}} (indicar bytes/Mbytes/Gbytes)",
      },
      {
        label: "B.",
        text: "Indica el número de bloques que el SO necesita leer en disco para obtener el valor de c1 en fgetc(fd1): {{blank}}",
      },
      {
        label: "C.",
        text: "Indica el número de bloques que el SO necesita leer en disco para obtener el valor de c2 en fgetc(fd2): {{blank}}",
      },
      {
        label: "D.",
        text: "Indica los permisos del fichero p1.c (después de ejecutar chmod) en formato rwxrwxrwx: {{blank}}",
      },
      {
        label: "E.",
        text: "¿Cuál es el número de hard links de p1.c después de ejecutar unlink?: {{blank}}",
      },
    ],
    correctAnswer: ["35 bytes", "2", "1", "rw- r-x r--", "3"],
  },
  {
    id: "2023-01_ficheros_p3",
    examId: "2023-01",
    topic: "sistema-ficheros",
    type: "fill",
    points: 0.3,
    question: `En el sistema de archivos UNIX previo (tamaño de bloque de 4 Kbytes), el *superbloque* ocupa 7 bloques de su partición de disco. Los bloques se numeran a partir del bloque 0. Un fichero "datos" tiene asociado el *inodo* 642 y este inodo está en el bloque (lógico) 21 desde el principio de la partición. El tamaño del *inodo* es de 64 bytes. Calcula el tamaño (en Kbytes, no bloques) del *boot*.`,
    fillStatements: [{ text: "Tamaño del *boot*: {{blank}} (Kbytes)" }],
    correctAnswer: ["16"],
  },
  {
    id: "2023-01_ficheros_p4",
    examId: "2023-01",
    topic: "sistema-ficheros",
    type: "matching",
    points: 0.6,
    question: `Indicar si es cierto/falso en cada pregunta. (Cada apartado puntúa 0.1p. Cada respuesta errónea puntúa -0.1. Cuestiones no respondidas no puntúan. La puntuación mínima de esta parte es 0.)`,
    correctAnswer: {
      "A. Cuando un proceso ejecuta en modo usuario, se puede ejecutar todo el repertorio de instrucciones máquina del procesador. Cierto/Falso:":
        "F",
      "B. Al ejecutar la función de entrada/salida de C *perror()*, el proceso está ejecutando exclusivamente en modo usuario. Cierto/Falso:":
        "F",
      "C. El código binario de *chmod()* se encuentra en la librería estándar de C (*libC*). Cierto/Falso:":
        "F",
      "D. Las librerías dinámicas se usan para tener ejecutables con código autocontenido. Cierto/Falso:":
        "F",
      "E. Con un sistema de ficheros con asignación indexada de bloques (como la de Unix), puede existir fragmentación externa. Cierto/Falso:":
        "F",
      "F. El Buffer Cache permite reducir operaciones de lectura sobre los discos montados, pero no operaciones de escritura en los mismos. Cierto/Falso:":
        "F",
    },
  },
  {
    id: "2023-01_memoria_1",
    examId: "2023-01",
    topic: "memoria",
    type: "matching",
    points: 0.5,
    question: `Cada una de las preguntas siguientes son de responder V/F (Verdadero/Falso) o no responder. Respuesta correcta: +0.1; Respuesta incorrecta: -0.1. Puntuación mínima para esta pregunta: 0.`,
    correctAnswer: {
      "1. Un sistema con segmentación pero sin paginación, puede tener memoria virtual.":
        "V",
      "2. A la vuelta de una llamada al sistema fork(), el proceso padre y el proceso hijo tienen su propio espacio de direcciones virtuales.":
        "V",
      "3. Un servicio de fallo de página de un proceso necesita poner al proceso en el estado de bloqueado mientras se sirve el fallo de página.":
        "V",
      "4. Un sistema operativo que implementa la política del Working Set para la gestión de la memoria virtual, puede llegar a suspender procesos y pasarlos al espacio de intercambio.":
        "V",
      "5. Una ventaja de un sistema de tablas de páginas multinivel con respecto a uno de un nivel es el menor espacio en memoria para las tablas de páginas de los procesos.":
        "V",
    },
  },
  {
    id: "2023-01_memoria_2",
    examId: "2023-01",
    topic: "memoria",
    type: "matching",
    points: 0.75,
    question: `Para cada una de las siguientes preguntas (respuesta correcta: +0.05) indique qué se muestra en pantalla eligiendo una de las respuestas posibles de entre las siguientes:

1) una dirección del Espacio de Direcciones Virtuales del proceso, área de stack
2) una dirección del Espacio de Direcciones Virtuales del proceso, área de datos dinámicos
3) una dirección del Espacio de Direcciones Virtuales del proceso, áreas de datos globales y estáticos
4) una dirección del Espacio de Direcciones Virtuales del proceso, áreas de código propio o librerías
5) una dirección del Espacio de Direcciones Virtuales del kernel, área de stack
6) una dirección del Espacio de Direcciones Virtuales del kernel, área de datos dinámicos
7) una dirección del Espacio de Direcciones Virtuales del kernel, áreas de datos globales y estáticos
8) una dirección del Espacio de Direcciones Virtuales del kernel, áreas de código propio o librerías
9) una dirección física
10) un valor que no es una dirección válida del proceso ni del kernel (ni lógica, ni física)

El código que se muestra se compila y ejecuta correctamente:
\`\`\`c
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>

double t[3] = {1.0, 2.0, 3.0};

void f1()
{
    static double sd;
    char *s1 = malloc(4096);
    char *s2;

    sd = t[1];

    printf ("I: &sd %p\\n",&sd);

    strcpy(s1, "alfa");
    s2 = strdup("beta");

    printf ("J: &s1 %p\\n",&s1);
    printf ("K: &s2 %p\\n",&s2);

    printf ("L: s1 %p\\n",s1);
    printf ("M: s2 %p\\n",s2);

    printf ("N: strcpy %p\\n",strcpy);
    printf ("O: exit %p\\n",exit);
}

int main(int argc, char *argv[])
{
    int args;
    int *p;

    args=argc;
    p=&argc;

    printf ("A: p %p\\n", p);
    printf ("B: &p %p\\n",&p);
    printf ("C: &args %p\\n",&args);

    printf ("D argv %p\\n", argv);
    printf ("E &argv[0] %p\\n", &argv[0]);

    printf ("F: t %p\\n", t);
    printf ("G: &t[0] %p\\n", &t[0]);
    printf ("H: &t %p\\n", &t);

    f1();
    exit(0);
}
\`\`\`

Responda para cada printf (A-O) con el número de la opción correcta.`,
    correctAnswer: {
      "A. p": "1",
      "B. &p": "1",
      "C. &args": "1",
      "D. argv": "1",
      "E. &argv[0]": "1",
      "F. t": "3",
      "G. &t[0]": "3",
      "H. &t": "3",
      "I. &sd": "3",
      "J. &s1": "1",
      "K. &s2": "1",
      "L. s1": "2",
      "M. s2": "2",
      "N. strcpy": "4",
      "O. exit": "4",
    },
  },
  {
    id: "2023-01_memoria_3",
    examId: "2023-01",
    topic: "memoria",
    type: "fill",
    points: 0.75,
    question: `Considere un sistema de paginación en dos niveles. Las páginas son de 4 Kbytes. El nivel 0 tiene una página raíz y el nivel 1 tiene las páginas necesarias para el espacio de direcciones virtuales de 32 bits. Cada página de la tabla de páginas de ambos niveles contiene 1024 entradas, 1 byte de cada entrada está reservado para permisos y otros usos del SO.

*El resultado final y los cálculos o explicaciones deben ser correctos y suficientes para puntuar cada pregunta (0.15 por apartado).*`,
    fillStatements: [
      {
        label: "a)",
        text: "Formato de las direcciones virtuales: {{blank}}",
      },
      {
        label: "b)",
        text: "Tamaño del espacio de direcciones virtuales: {{blank}}",
      },
      {
        label: "c)",
        text: "Tamaño máximo posible del espacio de direcciones físicas con estas especificaciones: {{blank}}",
      },
      {
        label: "d)",
        text: "Espacio ocupado por la tabla de páginas para un proceso que use todo su espacio de direcciones virtuales: {{blank}}",
      },
      {
        label: "e)",
        text: "Indique la respuesta correcta (1-4): {{blank}}",
      },
    ],
    correctAnswer: [
      "10 bits entrada TP nivel 0, 10 bits entrada TP nivel 1, 12 bits offset página",
      "2^32 bytes = 4 Gigabytes",
      "2^24 frames de 2^12 bytes = 64 Gigabytes",
      "4 Megabytes + 4 Kbytes",
      "4",
    ],
    development: `**a)** Páginas de 4 Kbytes:

$$
4\\ \\mathrm{Kbytes} = 2^{12}\\ \\mathrm{bytes}
$$

$$
\\frac{2^{12}\\ \\mathrm{bytes}}{2^2\\ \\mathrm{bytes/entrada}} = 2^{10}\\ \\text{entradas por página de tabla}
$$

Cada página de la tabla contiene 1024 entradas, por lo que cada nivel de la TP necesita 10 bits del espacio virtual. Formato de la dirección virtual: **10 bits entrada TP nivel 0, 10 bits entrada TP nivel 1, 12 bits offset página**.

**b)** Espacio de direcciones virtuales de 32 bits:

$$
2^{10} \\times 2^{10} \\times 2^{12} = 2^{32}\\ \\mathrm{bytes} = 4\\ \\mathrm{Gigabytes}
$$

**c)** Cada entrada de la TP ocupa:

$$
\\frac{2^{12}\\ \\mathrm{bytes/página}}{2^{10}\\ \\text{entradas}} = 4\\ \\mathrm{bytes/entrada}
$$

De esos 4 bytes, 1 byte está reservado para permisos y otros usos del SO, por lo que quedan **3 bytes para direccionar frames**:

$$
2^{24}\\ \\text{frames de } 2^{12}\\ \\mathrm{bytes} = 64\\ \\mathrm{Gigabytes}
$$

**d)** Para un proceso que use todo su espacio virtual: **1 página de nivel cero** y $2^{10}$ páginas de $2^{12}$ bytes en el nivel 1:

$$
2^{10} \\times 2^{12} = 2^{22}\\ \\mathrm{bytes} = 4\\ \\mathrm{Megabytes} + 4\\ \\mathrm{Kbytes}
$$

**e)** Respuesta correcta: **4**. Linux está implementado sobre esta arquitectura pero no usando los registros del procesador como base/límite de segmentos. Explicado en clase para Linux 64 bits con paginación en 4 niveles; la explicación es similar adaptada a esta arquitectura.`,
  },
  {
    id: "2023-01_procesos_q1",
    examId: "2023-01",
    topic: "procesos",
    type: "matching",
    points: 1.0,
    question: `Responda Verdadero/Falso (o no conteste) a cada pregunta (0.1 cada una). Respuesta incorrecta -0.1. La puntuación mínima es cero para esta pregunta.`,
    correctAnswer: {
      '1. La mayoría de los procesadores modernos tienen la instrucción "terminar proceso" en su juego de instrucciones.':
        "F",
      "2. En un sistema monoprocesador un programa solo puede dar lugar a un proceso.":
        "F",
      "3. Si un proceso es el único proceso listo en el sistema, su prioridad no influye en el tiempo de ejecución.":
        "V",
      "4. Salvo que las modifiquen después de haber sido creados, dos procesos del mismo usuario tienen el mismo conjunto de variables de entorno.":
        "F",
      "5. Salvo que las modifiquen después de haber sido creados, dos procesos que ejecutan el mismo programa tienen el mismo conjunto de variables de entorno.":
        "F",
      "6. Un manejador de interrupciones es siempre parte del código del kernel.":
        "V",
      "7. Un proceso con la credencial real de usuario del root puede acceder a cualquier fichero en el sistema.":
        "F",
      "8. En un sistema round-robin de cuanto 100ms, si un proceso tiene una ráfaga CPU de 80ms, el siguiente puede obtener la CPU durante 120ms seguidos.":
        "F",
      "9. Desde que es creado, hasta que termina, un proceso no puede realizar más de una llamada exec.":
        "F",
      "10. Existen situaciones en las que fork() puede cambiar la credencial.":
        "F",
    },
  },
  {
    id: "2023-01_procesos_q2",
    examId: "2023-01",
    topic: "procesos",
    type: "matching",
    points: 0.5,
    question: `Sea el siguiente código en C, con todos los includes necesarios y que compila correctamente:
\`\`\`c
int BuscarVariable (char * var, char *e[])
{
    int pos=0;
    char aux[MAXVAR];

    strcpy (aux,var);
    strcat (aux,"=");

    while (e[pos]!=NULL)
    if (!strncmp(e[pos],aux,strlen(aux)))
    return (pos);
    else
    pos++;
    return(-1);
}

int SV(char *v1, char *v2, char *vle, char *e[])
{
    int pos;
    char *aux;

    if ((pos=BuscarVariable(v2,e))!=-1)
    {errno=EEXIST;return(-1);}
    if ((pos=BuscarVariable(v1,e))==-1)
    {errno=ENOENT;return(-1);}

    if ((aux=(char *)malloc(strlen(v2)+strlen(vle)+2))==NULL)
    {errno=ENOMEM; return -1;}
    strcpy(aux,v2);
    strcat(aux,"=");
    strcat(aux,vle);
    e[pos]=aux;
    return (pos);
}
\`\`\`

Indicar cuál de las siguientes afirmaciones es CIERTA SIEMPRE (A), puede ser cierta a veces (B) o es FALSA SIEMPRE (C), después de una EXITOSA ejecución (que no devuelve -1) de la función SV. (+0.1 correcta, -0.05 incorrecta)`,
    correctAnswer: {
      "1. El entorno de env (tercer argumento de main) y el de environ son el mismo.":
        "B",
      "2. El número de variables de entorno en uno de los entornos (env o environ) ha cambiado.":
        "C",
      "3. Una variable de entorno aparece duplicada en alguno de los entornos.":
        "C",
      "4. Aunque los entornos estén correctamente terminados a NULL y las variables sean cadenas correctamente terminadas, es posible que esta función produzca segmentation fault.":
        "C",
      "5. Una variable que solo existía en uno de los entornos ahora existe en los dos.":
        "B",
    },
    development: `EXPLICACION: La función SV sustituye la variable v1 por v2 con valor vle (cadena "v2=vle") comprobando previamente que v2 no existe y que v1 sí existe.

**1-B:** serán el mismo o no, dependiendo de si lo eran antes de llamar a SV.

**2-C:** SV sustituye una variable por otra, por tanto no cambia el número de variables.

**3-C:** SV comprueba que v2 no existe previamente.

**4-C:** la asignación de memoria es correcta (el +2 es para el "=" y el carácter fin de cadena). Si no hay memoria disponible la función devuelve -1.

**5-B:** es posible, en el caso de que la variable sustituta sea la que existe en el entorno donde no ejecutamos SV. Ahora existe en los dos.`,
  },
  {
    id: "2023-01_procesos_q3",
    examId: "2023-01",
    topic: "procesos",
    type: "table-fill",
    points: 0.5,
    repeated: true,
    question: `Sea el siguiente código en C, con todos los includes necesarios y que compila correctamente y que produce un ejecutable a.out.
\`\`\`c
int main (int argc, char *argv[])
{
    int df1, df2;

    df1=open ("./f1.txt", O_RDWR);
    df2=open ("./f1.txt", O_RDONLY);
    printf("%d, %d\\n", df1, df2);
}
\`\`\`

Tanto a.out como f1.txt son del usuario u1, a.out es ejecutado por un usuario u2, desde el mismo directorio donde están a.out y f1.txt.

Completar el siguiente cuadro indicando las credenciales reales y efectivas del proceso que ejecuta a.out y si alguno de los descriptores df1 o df2 es -1 dependiendo de los permisos de a.out y f1.txt.`,
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
      ],
    },
    correctAnswer: [
      "u2",
      "u2",
      "no",
      "no",
      "u2",
      "u2",
      "SI",
      "NO",
      "u2",
      "u2",
      "SI",
      "NO",
      "u2",
      "u2",
      "SI",
      "NO",
      "u2",
      "u2",
      "SI",
      "NO",
      "u2",
      "u2",
      "SI",
      "SI",
      "u2",
      "u1",
      "NO",
      "NO",
      "u2",
      "u1",
      "NO",
      "NO",
      "u2",
      "u1",
      "NO",
      "NO",
      "u2",
      "u1",
      "NO",
      "NO",
      "u2",
      "u1",
      "NO",
      "NO",
    ],
    development: `EXPLICACION: exec() cambia la credencial efectiva a la del propietario del fichero cuando el fichero ejecutable tiene el permiso setuid; por tanto, en los casos en que a.out tiene el permiso setuid la credencial efectiva es u1. Para el acceso a ficheros se comprueba la credencial efectiva: cuando la credencial efectiva es u1 se miran los permisos de propietario, y cuando es u2 los permisos del resto (es indistinto que u1 y u2 sean o no del mismo grupo: los permisos de grupo son iguales que los de resto).`,
  },
  {
    id: "2023-01_es_1",
    examId: "2023-01",
    topic: "entrada-salida",
    type: "matching",
    points: 0.5,
    question: `Ante la siguiente llamada a función \`fprintf(fich, "%s-%d\\n", "feliz", 2023)\`, respóndase V/F (Verdadero/Falso) o deje en blanco.

Respuesta correcta: +0.1; Respuesta incorrecta: -0.1. Puntuación mínima en esta pregunta: 0.`,
    correctAnswer: {
      'A. La capa del subsistema de E/S denominada "software independiente del dispositivo" prepara un buffer en el que se almacena la cadena "feliz-2023\\n" y a continuación realiza una llamada al sistema.':
        "F",
      "B. Dado el buffer del apartado A, internamente fprintf realizará una llamada a write(1, buffer, 11). Asúmase que no se ha hecho ninguna llamada a close antes de la llamada a fprintf.":
        "F",
      'C. La capa del subsistema de E/S denominada "controlador de dispositivo o device driver" se encarga de calcular qué bloque (o bloques) de disco debe(n) estar en memoria para completar la operación write.':
        "F",
      'D. Si el fichero asociado ocupaba 4090 bytes antes de llamar a fprintf, y el sistema de ficheros que lo contiene usa bloques de 4096 bytes, la capa del subsistema de E/S denominada "software independiente del dispositivo" hará que se asigne un nuevo bloque al fichero. Dicho bloque estará en la caché de bloques y a él se copiarán los datos "2023\\n". El nuevo tamaño del fichero será de 4101 bytes.':
        "V",
      'E. En algún momento, la capa del subsistema de E/S denominada "controlador de dispositivo o device driver" lanzará una interrupción para que los dos bloques asociados al fichero sean transferidos desde la caché de bloques a disco.':
        "F",
    },
  },
  {
    id: "2023-01_es_2",
    examId: "2023-01",
    topic: "entrada-salida",
    type: "table-fill",
    points: 0.5,
    question: `La cola de peticiones de E/S para acceder a cilindros de un disco contenía las peticiones [185, 190, 33, 400, 250, 200]. Ya se han atendido las peticiones [200] y [190] (en este orden). ¿En qué orden se atenderán las restantes peticiones? (Completar los cilindros que faltan para cada algoritmo.)`,
    tableFill: {
      headers: ["Algoritmo", "Cilindros accedidos (en orden)"],
      rows: [
        ["SSTF", "200 → 190 → 185 → {{blank}} → {{blank}} → {{blank}}"],
        ["C-LOOK", "200 → 190 → 185 → {{blank}} → {{blank}} → {{blank}}"],
        ["CSCAN", "200 → 190 → 185 → {{blank}} → {{blank}} → {{blank}}"],
        ["SCAN", "200 → 190 → 185 → {{blank}} → {{blank}} → {{blank}}"],
      ],
    },
    correctAnswer: [
      "250",
      "400",
      "33",
      "33",
      "400",
      "250",
      "33",
      "400",
      "250",
      "33",
      "250",
      "400",
    ],
  },
  {
    id: "2023-01_es_3",
    examId: "2023-01",
    topic: "entrada-salida",
    type: "fill",
    points: 0.5,
    question: `El fichero "a.dat" contiene "ABCDEFGH\\n". ¿Qué se escribe en pantalla en las llamadas a printf de las líneas lin.09 y lin.17?
\`\`\`c
//lin.01: int main(int argc, char *argv[])
//lin.02: {errno=0;
//lin.03: struct aiocb aio; long ret1, ret2, ret3;
//lin.04: char BUF1[8] = ('\\0', '\\0', '\\0', '\\0', '\\0', '\\0', '\\0', '\\0');
//lin.05: char BUF2[8] = ('\\0', '\\0', '\\0', '\\0', '\\0', '\\0', '\\0', '\\0');
//lin.06: int fd = open("a.dat", O_RDONLY);
//lin.07: lseek(fd, 5, SEEK_CUR);
//lin.08: ret1 = read(fd, BUF1, 10);
//lin.09: printf("%s--%ld", BUF1, ret1);
//lin.10: aio.aio_fildes = fd;
//lin.11: aio.aio_buf = BUF2; aio.aio_nbytes = 4;
//lin.12: aio.aio_reqprio = 0; aio.aio_offset = 2;
//lin.13: aio.aio_sigevent.sigev_notify = SIGEV_NONE;
//lin.14: ret2 = aio_read(&aio);
//lin.15: while(aio_error(&aio) == EINPROGRESS);
//lin.16: ret3 = aio_return(&aio);
//lin.17: printf("%s--%ld", BUF2, ret2);
//lin.18: }
\`\`\`

Nota: asúmase que no hubo ningún error de ejecución.`,
    fillStatements: [
      { label: "printf lin.09:", text: "{{blank}}" },
      { label: "printf lin.17:", text: "{{blank}}" },
    ],
    correctAnswer: ["FGH\\n--4", "CDEF--0"],
    development: `**printf lin.09:** lseek posiciona el offset de lectura en el fichero en la posición 5 → se leerá a partir de la posición con la 'F'. read trata de leer 10 bytes, pero solo quedan 4 por leer (FGH\\n) y los almacena en BUF1 → "FGH\\n". ret1 guarda el valor devuelto por read; esto es, cuántos bytes se han leído → 4. Se muestra "FGH\\n--4".

**printf lin.17:** BUF2 contiene 4 chars del fichero, leídos a partir del offset 2 del fichero → "CDEF". ret2 guarda un 0 (indica si se han producido errores en aio_read: no → 0; -1 si hay error al encolar la petición). ret3 guarda cuántos bytes se han leído = 4. El printf muestra ret2 = 0 → "CDEF--0".`,
  },

];
