/* eslint-disable no-useless-escape */
import type { Question } from "../../data/types";
import type { Picture } from "vite-imagetools";
import { getImage } from "../../lib/image";
import type { ImageMap } from "../../lib/image";

const imageMap = import.meta.glob<{ default: Picture }>(
  "./assets/*.{png,jpeg,jpg}",
  { query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" }, eager: true }
) as ImageMap;

export const questions: Question[] = [
  // 2021-01_q1
  {
    id: "2021-01_q1",
    exam: "2021-01",
    topic: "segmentacion",
    type: "text",
    points: 1,
    question: `Un procesador implementa un camino de datos segmentado con 10 etapas. Cada una de las etapas se completa en un ciclo de reloj. En este procesador todas las instrucciones pasan por todas las etapas, y las instrucciones de salto condicional (bne, beq) son las únicas que pueden provocar un riesgo. Cuando una instrucción de salto condicional termina de ejecutar la etapa 1, el *pipeline* se bloquea hasta que se evalúa la condición de salto.

Sobre este procesador ejecutamos un código que tarda 1809 ciclos tras la ejecución efectiva de 1000 instrucciones, de las cuales 200 son instrucciones de salto condicional y 400 son operaciones en punto flotante.`,
    subquestions: [
      `Determina en qué etapa del camino de datos se evalúa la condición de salto.`,
      `Calcula cuál de las siguientes acciones aplicadas individualmente mejora el rendimiento del procesador en mayor medida:
- Reducir la longitud del *pipeline* en 2 etapas, sin que afecte a los riesgos que se pudiesen producir.
- Mover la evaluación de la condición de salto a la etapa 4
- Utilizar una estrategia de predicción de salto que en el código descrito tiene una tasa de acierto de un 20%
- Utilizar una estrategia de salto retardado, sabiendo que en término medio disponemos de 1,5 instrucciones para rellenar el hueco de retardo (el resto se rellena con instrucciones *nop*).`,
      `Al compilar el código fuente que produjo el código máquina anterior con nuestro nuevo compilador, al que hemos denominado *ecc*, obtenemos un código de 1400 instrucciones efectivas de las que 600 son operaciones en punto flotante, que tarda 2200 ciclos en ejecutarse. Buscamos una métrica de rendimiento con la que mostrar que *ecc* supera al compilador anterior.
- Determina con qué métrica podríamos alardear más de nuestro nuevo compilador: tiempo de ejecución, MIPS o GFLOPS.
- Desde el punto de vista de un potencial usuario de *ecc*, ¿sería una comparación justa?`,
    ],
    correctAnswer: `a) La condición de salto se evalúa en la etapa 5. Sin riesgos, el código se ejecutaría en 1009 ciclos (10 de la primera instrucción + 1 por cada una de las 999 restantes). Los $1809 - 1009 = 800$ ciclos extra están provocados por las 200 instrucciones de salto, a razón de 4 ciclos cada una → la condición se evalúa en la etapa $1 + 4 = 5$.

b) ■ Reducir el pipeline en 2 etapas: solo aporta 2 ciclos de mejora.
■ Mover evaluación a etapa 4: cada salto provoca 3 ciclos de bloqueo. Aceleración = $\frac{{1809}}{{1009+200 \times 3}} = \frac{{1809}}{{1609}} = 1,12$
■ Predictor 20% acierto: 40 aciertos sin riesgo, 160 fallos con 4 ciclos. Ciclos = $1009+160 \times 4 = 1649$. Aceleración = $1809/1649 = 1,097$
■ Salto retardado (1,5 instr de relleno): riesgo por salto = $4 - 1,5 = 2,5$ ciclos. Aceleración = $\frac{{1809}}{{1009+200 \times 2,5}} = \frac{{1809}}{{1509}} = 1,20$. **Es la opción más beneficiosa.**

c) ■ Tiempo de ejecución no sirve (el nuevo código tarda más ciclos).
■ MIPS: $\frac{{1400/(2200 \times T_c \times 10^6)}}{{1000/(1809 \times T_c \times 10^6)}} = 1,15$ veces mayor.
■ GFLOPS: $\frac{{600/(2200 \times T_c \times 10^6)}}{{400/(1809 \times T_c \times 10^6)}} = 1,23$ veces mayor.
■ La mejor métrica es GFLOPS, aunque no sería una comparación justa (el compilador original genera código más eficiente y un compilador debe minimizar el tiempo de ejecución).`,
    explanation: `Sin riesgos, un pipeline de 10 etapas ejecuta N instrucciones en $10 + (N-1)$ ciclos. Los 800 ciclos extra se deben a los 200 saltos (4 ciclos/salto). El salto retardado es la mejor opción. GFLOPS infla artificialmente la mejora porque el nuevo código tiene más operaciones FP.`,
  },
  // 2021-01_q2
  {
    id: "2021-01_q2",
    exam: "2021-01",
    topic: "cache",
    type: "text",
    points: 1,
    question: `Los códigos de tipo "streaming", entre los que se encuentran los reproductores de vídeo o audio, se caracterizan por consumir grandes cantidades de datos, pero no reusarlos. Considérese el siguiente código:

\`\`\`
int A[N];
for( i = 0; i < N; ++i ) {
    r += A[i];
}
\`\`\`

Contesta a las siguientes preguntas:`,
    subquestions: [
      `Asumiendo una cache de correspondencia directa de 64 kB con tamaño de línea de 32 bytes, y que el tamaño de un int es de 4 bytes, ¿cuál será la tasa de fallos de este código? ¿Qué tipo de fallos es el más común en este código?`,
      `¿Cómo varía la tasa de fallos al variar el tamaño del array? ¿Y al variar el tamaño de la cache?`,
      `¿Cómo varía la tasa de fallos para tamaños de línea de 16, 64 y 128 bytes?`,
      `Supongamos otro código que presenta las siguientes tasas de fallo según el tamaño de bloque:

|  8: 4% | 16: 3% | 32: 2% | 64: 1.5% | 128: 1%  |
| --- | --- | --- | --- | --- |

¿Cuál es el tamaño de línea L óptimo para una latencia de acceso de 20*L ciclos?`,
    ],
    correctAnswer: `a) Línea de 32 bytes, enteros de 4 bytes → cada línea trae 8 enteros a cache. Al no haber reuso y con recorrido secuencial, hay 1 fallo forzoso por cada 8 accesos → tasa de fallos = $\frac{{1}}{{8}}$. Todos los fallos son forzosos (no hay reuso → no puede haber fallos de capacidad ni de conflicto).

b) Ni el tamaño del array ni el de la cache influyen. Solo afecta el tamaño de la línea cache y el tamaño de cada elemento del array.

c) Para 16, 64 y 128 bytes se almacenan respectivamente 4, 16 y 32 enteros por línea. Tasas de fallos: $\frac{{1}}{{4}}$, $\frac{{1}}{{16}}$, $\frac{{1}}{{32}}$.

d) Penalización por fallo = tamaño_línea × 20 × tasa_fallos:
- 8B: $8 \times 20 \times 0,04 = 6,4$ ciclos
- 16B: $16 \times 20 \times 0,03 = 9,6$ ciclos
- 32B: $32 \times 20 \times 0,02 = 12,8$ ciclos
- 64B: $64 \times 20 \times 0,015 = 19,2$ ciclos
- 128B: $128 \times 20 \times 0,01 = 25,6$ ciclos
El mejor tamaño de línea es 8B: el incremento de tamaño no mejora la tasa de fallos lo suficiente para compensar el aumento en la penalización.`,
    explanation: `En código streaming sin reuso, la tasa de fallos depende únicamente del número de elementos que caben en una línea cache. Al no haber reuso, todos los fallos son forzosos. El tamaño de línea óptimo minimiza el producto tamaño × tasa_fallos.`,
  },
  // 2021-01_q3
  {
    id: "2021-01_q3",
    exam: "2021-01",
    topic: "memoria-virtual",
    type: "text",
    points: 1,
    question: `Considera un computador con un sistema de memoria virtual paginado, una TLB, una única caché y que soporta varios procesos. La memoria es direccionable a nivel de byte y el tamaño del espacio virtual es de 256 TB. La TLB tiene 128 entradas y es totalmente asociativa. La caché, de 4 MB, es asociativa por conjuntos de 8 vías y el tamaño de línea es de 64 B.`,
    subquestions: [
      `Calcula el tamaño de página mínimo que permitiría aplicar la técnica VIPT (índice virtual, etiqueta física) en este sistema.`,
      `¿Cuántas páginas virtuales se soportarían por proceso?`,
      `Justifica razonadamente si las siguientes afirmaciones son verdaderas o falsas:
- Aumentar el tamaño de página haría que se redujese el tamaño de la tabla de páginas.
- Aumentar el tamaño de página haría que se redujese la fragmentación interna.
- Duplicar el tamaño de la TLB impediría aplicar la técnica VIPT.
- Sería posible seguir utilizando la técnica VIPT en un sistema de memoria virtual segmentada en el que la longitud máxima de segmento fuese el tamaño de página calculado anteriormente.
- Sería eficiente aplicar la técnica de escritura directa (write-through) en el sistema de memoria virtual.
- Nunca sería útil tener un espacio de memoria física mayor que el espacio de memoria virtual.`,
    ],
    correctAnswer: `a) $|V| = 256\ TB = 2^{{48}}B \Rightarrow$ DV de 48 bits.
$|C| = 4\ MB = 2^{{22}}B$, $|l| = 64\ B = 2^6B \Rightarrow \Delta_l$ de 6 bits.
#líneas $= 2^{{22-6}} = 2^{{16}}$, #conjuntos $= 2^{{16-3}} = 2^{{13}} \Rightarrow$ índice de 13 bits.
Para VIPT, el índice debe estar dentro del desplazamiento de página: $p \geq (13 + 6) = 19 \Rightarrow |P| \geq 2^{{19}}B = 512\ KB$.

b) Cada proceso tiene su propio espacio virtual. Con $p = 19$, quedan $48 - 19 = 29$ bits para el número de página virtual. $\#PV \leq 2^{{29}}$.

c) ■ VERDADERO. Al aumentar el tamaño de página se reduce el número de páginas → la tabla tiene menos entradas y éstas son más pequeñas (menos bits para PF).
■ FALSO. Aumenta la probabilidad de tener espacio desaprovechado en cada página (fragmentación interna).
■ FALSO. La TLB es una caché de traducciones; duplicar su tamaño no afecta a la viabilidad de VIPT.
■ FALSO. En segmentación, el desplazamiento dentro del segmento se suma a la dirección física base, por lo que esos bits de la DV no coinciden con los últimos bits de la DF.
■ FALSO. En write-through cada escritura va al nivel inferior (disco), cuyo tiempo de acceso es varios órdenes de magnitud mayor.
■ FALSO. Con varios procesos, tener más memoria física permite mantener más páginas en memoria y acelerar cambios de contexto. También útil para múltiples máquinas virtuales.`,
    explanation: `VIPT requiere que índice + desplazamiento de línea ≤ desplazamiento de página. Con |V|=256TB, DV=48 bits. Caché de 4MB, 8 vías, línea 64B → 13 bits índice + 6 bits despl = 19 bits → página mínima $2^{{19}}$B = 512 KB.`,
  },
  // 2021-01_q4
  {
    id: "2021-01_q4",
    exam: "2021-01",
    topic: "buses",
    type: "text",
    points: 1,
    explanationImage: getImage(imageMap, "2021-01_q4_bus-async.jpeg"),
    question: `Sea un computador con las siguientes características:

- Las direcciones de memoria y las palabras son de 64 bits.
- Tiene una jerarquía caché de dos niveles. El primer nivel tiene una tasa de fallo del 10 % y un tiempo de acierto de 5 ns. El segundo nivel tiene un tiempo de acierto de 8 ns y una tasa de fallo del 40 %. El tiempo medio de acceso a todo el sistema de memoria es de 9 ns cuando ambos niveles tienen un tamaño de línea de 8 palabras.
- La caché de segundo nivel se conecta mediante un bus síncrono de 64 bits a la memoria principal, en el que tanto una transferencia de 64 bits como el envío de la dirección de memoria requieren 1 ciclo de reloj.
- El sistema de memoria y el bus soportan accesos a bloques de 8 palabras de 64 bits. Se necesitan dos ciclos de reloj entre dos operaciones de bus (se supondrá el bus libre antes de cada acceso). La memoria tarda lo equivalente a 20 ciclos del bus en acceder a las primeras 4 palabras del bloque; y luego cada grupo adicional de cuatro palabras del mismo bloque se lee en 13 ciclos de bus. Se considerará que la transferencia de los datos por el bus puede solaparse con la lectura de las cuatro palabras siguientes.`,
    subquestions: [
      `La frecuencia del bus síncrono que comunica la caché de segundo nivel con la memoria principal. El ancho de banda y la latencia para la lectura, desde la caché de segundo nivel, de 128 palabras de memoria, en el caso de transferencias de bloques de 8 palabras.`,
      `Supongamos que este bus soporta transacciones de bloques de 4 palabras y que la penalización por fallo de la caché de segundo nivel es de 54 nanosegundos cuando trabaja con líneas de 4 palabras. ¿Tendría sentido reemplazar este bus síncrono de memoria por un bus asíncrono donde cada paso del protocolo handshaking requiere de 30 nanosegundos en transferencias de bloques de 4 palabras? ¿Por qué? Justifica numéricamente tu respuesta. ¿En el caso general tiene sentido reemplazar un bus de memoria síncrono por uno asíncrono?`,
      `Este computador tiene un total de 1024 GB de información muy valiosa almacenada en disco. Dispongo de hasta 1000 euros para montar un RAID y sabiendo que cada disco de 256 GB me cuesta 100 euros, ¿qué configuración RAID escogería?`,
    ],
    correctAnswer: `a) Tiempo medio acceso: $9\ ns = 5 + 0,1 \times (8 + 0,4 \times PF) \Rightarrow PF = 80\ ns$.
1 transacción: 1 ciclo env dir + 20 ciclos acceso pal 0-3 + max(4 ciclos envío pal 0-3, 13 ciclos acceso pal 4-7) + 4 ciclos envío pal 4-7 + 2 ciclos espera = 40 ciclos.
Si 40 ciclos = 80 ns → $T_{{ciclo}} = 2\ ns$ → $f = 500\ MHz$.

128 palabras = 16 transacciones. Latencia = $16 \times 40 = 640$ ciclos = 1280 ns.
Ancho de banda = $\frac{{128 \times 8\ B}}{{1280 \times 10^{{-9}}\ s}} = 800\ MB/s$.

b) Bus asíncrono: 7 pasos de handshaking × 30 ns = 210 ns mínimo por transacción, independientemente de los datos. El bus síncrono tarda 54 ns → es más rápido. Los buses síncronos son mejores para dispositivos rápidos; los asíncronos para dispositivos de velocidades variadas.

c) Con 1000€ y discos de 100€ (256 GB), se pueden comprar 10 discos. Como los datos son muy valiosos, la configuración más adecuada es RAID 1 (preferiblemente 1+0) aunque sacrifique rendimiento.`,
    explanation: `Se calcula PF a partir del tiempo medio de acceso del sistema de memoria. Cada transacción de 8 palabras requiere 40 ciclos. Con $T_{{ciclo}}=2$ns, f=500MHz. El bus asíncrono tiene una latencia base mucho mayor por el handshaking.`,
  },
  // 2021-07_q1
  {
    id: "2021-07_q1",
    exam: "2021-07",
    topic: "segmentacion",
    type: "text",
    points: 1,
    question: `A continuación se muestra un **fragmento** del diagrama multiciclo que resulta de la ejecución de un código en un procesador MIPS de 5 etapas como el estudiado en clase. En este diagrama no se señalan explícitamente los riesgos ni las anticipaciones. En el código existen instrucciones anteriores y posteriores a este fragmento que desconocemos.

|   | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  1 loop: lw $t0, 0($a0) | IF | ID | EX | MEM | WB |  |  |  |  |  |  |   |
|  2 lw $t1, 4($a0) |  | IF | ID | EX | MEM | WB |  |  |  |  |  |   |
|  3 add $t2, $t2, $t0 |  |  | IF | ID | – | EX | MEM | WB |  |  |  |   |
|  4 addi $a0, $a0, 8 |  |  |  | IF | – | ID | EX | MEM | WB |  |  |   |
|  5 sw $t1, 0($a1) |  |  |  |  |  | IF | ID | EX | MEM | WB |  |   |
|  6 sw $t2, 4($a1) |  |  |  |  |  |  | IF | ID | EX | MEM | WB |   |
|  7 bne $a1, $a0, loop |  |  |  |  |  |  |  | IF | ID | EX | MEM | WB  |`,
    subquestions: [
      `Razona (cuando sea posible) si este procesador incorpora las siguientes técnicas estudiadas en clase. En caso afirmativo, indica cuáles de ellas incorpora.
- Unidad de detección de riesgos
- Unidad de anticipación a la etapa EX
- Resolución de salto en la etapa ID
- Salto fijo no efectivo`,
      `Dadas las instrucciones del código anterior, razona si podemos reordenarlas de forma que ocurran riesgos de control, de datos y estructurales, aunque se modifique la lógica original del código.`,
      `Si el procesador implementa la técnica de salto retardado, determina qué instrucciones podemos mover con seguridad al hueco de retardo, indicando también posibles modificaciones necesarias, y razona cuál sería la mejor opción.`,
    ],
    correctAnswer: `a) ■ Hay unidad de detección de riesgos: la burbuja en la instrucción 3 (ciclo 5) lo demuestra.
■ No hay unidad de anticipación a EX: si la hubiera, el riesgo RAW entre 1 y 3 no se habría producido al poder anticipar $t0.
■ La resolución de salto en ID y salto fijo no efectivo no se pueden determinar: cuando el salto ejecuta ID los datos ya están en el banco de registros, y no se muestra qué ocurre después del salto.

b) El código original ya presenta un riesgo RAW entre 1 y 3. La instrucción 7 conlleva riesgo de control salvo con salto retardado. No es posible forzar un riesgo estructural porque todas las instrucciones tienen la misma latencia y nunca coincidirán en la misma etapa.

c) Las instrucciones 1, 2 y 4 se podrían mover "desde destino de salto" con modificaciones, pero se ejecutarían una vez más al finalizar el bucle (inseguro sin conocer el código posterior). La 3 no puede moverse por dependencias. Las instrucciones 5 y 6 pueden moverse con seguridad (no tienen dependencias con instrucciones posteriores). Si el salto se decide en ID, se crearía un riesgo entre 4 y 7 sin beneficio.`,
    explanation: `Analizando el diagrama: la burbuja en el ciclo 5 de la instrucción 3 indica detección de riesgos. La ausencia de anticipación se deduce porque el riesgo RAW persiste. Las instrucciones 5 y 6 son las mejores candidatas para el hueco de retardo.`,
  },
  // 2021-07_q2
  {
    id: "2021-07_q2",
    exam: "2021-07",
    topic: "cache",
    type: "text",
    points: 1,
    question: `Un computador dispone de una caché de un único nivel asociativa por conjuntos de 4 vías, de 64 kB en total, con tamaño de línea de 16 bytes.

Considérese el siguiente código:

\`\`\`
int A[N][M];
for( i = 0; i < M; ++i ) {
    for( j = 0; j < N; ++j ) {
        r += A[j][i];
    }
}
\`\`\`

Sabiendo que el tamaño de un int es de 4 bytes, que las variables escalares se almacenan en registros del micro, y que tanto N como M son potencias de 2, contesta a las siguientes preguntas:`,
    subquestions: [
      `Calcula el valor de M para que cada acceso al array en una nueva iteración del bucle interno vaya a parar al mismo conjunto caché que en la iteración anterior. Para dicho valor de M, calcula el valor de N de modo que no se produzcan fallos de conflicto en el acceso al array completo.`,
      `Partiendo de los valores calculados de N y M, deduce la relación entre ambos para garantizar un acceso al array libre de fallos de conflicto. Recuerda que tanto N como M se suponen potencias de 2.`,
      `¿Qué ocurre si duplicamos la asociatividad, pero manteniendo el tamaño total de la caché constante?`,
      `Calcula la tasa de fallos para M=2048, N=16.`,
    ],
    correctAnswer: `a) $T_{{cache}} = 2^{{16}}B$, $T_{{linea}} = 2^4B$, #vías = 4: hay $2^{{16}}/2^4/2^2 = 2^{{10}}$ conjuntos. En cada iteración saltamos M elementos de 4B: $4 \times M$ Bytes. Para coincidir en el mismo conjunto, el salto debe ser $2^{{10}} \times 2^4 = 2^{{14}}$ Bytes. Como cada elemento ocupa 4B → $M = 2^{{12}} = 4096$. Con 4 vías, podemos repetir el mismo conjunto 4 veces sin fallo de conflicto → $N \leq 4$.

b) Si se reduce M a la mitad se alternan 2 conjuntos (8 vías). Si se vuelve a reducir, 4 conjuntos (16 vías), etc. Al reducir M podemos incrementar N proporcionalmente: $M = 2^k$, $N \leq \max(4, 2^{{14-k}})$. Si M > 4096, N debe mantenerse ≤ 4.

c) Se permiten valores mayores de N: $N \leq \max(8, 2^{{13-k}})$.

d) Con $M = 2^{{11}} = 2048$ y $N = 2^4 = 16$, la tasa de fallos es del 100%. Con $M = 2^{{11}}$ se repite el mismo conjunto cada 2 iteraciones. En las 8 primeras iteraciones se llenan los 2 conjuntos accedidos, y en las 8 restantes se sobreescriben los datos → no pueden ser reutilizados en la segunda columna.`,
    explanation: `El acceso es por columnas (A[j][i]), lo que genera saltos grandes en memoria. La clave es que el salto entre iteraciones del bucle interno es de M elementos, y para mapear al mismo conjunto ese salto debe ser múltiplo del tamaño total de la caché.`,
  },
  // 2021-07_q3
  {
    id: "2021-07_q3",
    exam: "2021-07",
    topic: "memoria-virtual",
    type: "text",
    points: 1,
    explanationImage: getImage(imageMap, "2021-07_q3_mem-map.jpeg"),
    question: `Considera un computador con un sistema de memoria virtual segmentado. El tamaño del espacio virtual es de 16 TB y el tamaño del espacio físico es de 4 GB. El tamaño máximo de segmento es de 2 GB. En un momento dado, los siguientes segmentos están residentes en memoria física:

- Segmento 0x11, de 256 MB y que comienza en la dirección 0x00000000.
- Segmento 0x22, de 1 GB y que comienza en la dirección 0x20000000.
- Segmento 0x33, de 512 MB y que comienza en la dirección 0x80000000.
- Segmento 0x44, de 256 MB y que comienza en la dirección 0xD0000000.`,
    subquestions: [
      `Dibuja un esquema que represente el estado de la memoria física del sistema, indicando todos los segmentos residentes.`,
      `Diseña razonadamente una posible estructura de la tabla de segmentos de este sistema. Ejemplifica su funcionamiento traduciendo la dirección virtual 0x1987654321.`,
      `Se reciben, secuencialmente, peticiones para ubicar los siguientes segmentos:
- Segmento 0xAA, de 256 MB.
- Segmento 0xBB, de 576 MB.
Explica detalladamente cómo se atenderían con el algoritmo Best-Fit.`,
      `Este sistema de memoria virtual, ¿presenta fragmentación interna? ¿Y fragmentación externa? Justifica tu respuesta apoyándote en los apartados anteriores.`,
    ],
    correctAnswer: `a) Esquema de memoria física:
- 0x00000000–0x0FFFFFFF: Segmento 0x11 (256 MB)
- 0x10000000–0x1FFFFFFF: Libre (256 MB)
- 0x20000000–0x5FFFFFFF: Segmento 0x22 (1 GB)
- 0x60000000–0x7FFFFFFF: Libre (512 MB)
- 0x80000000–0x9FFFFFFF: Segmento 0x33 (512 MB)
- 0xA0000000–0xCFFFFFFF: Libre (768 MB)
- 0xD0000000–0xDFFFFFFF: Segmento 0x44 (256 MB)
- 0xE0000000–0xFFFFFFFF: Libre (512 MB)

b) Estructura de entrada: Residencia (1) | Control (c bits) | Dirección base (32 bits) | Tamaño (31 bits).
$|F| = 4\ GB = 2^{{32}}B$, $max|S| = 2\ GB = 2^{{31}}B$. $|V| = 16\ TB = 2^{{44}}B$. DV de 44 bits: nSV (13 bits) | $\Delta_s$ (31 bits).

Traducción de 0x1987654321: nSV = 0x33, $\Delta_s = 0x07654321$. El segmento 0x33 es residente con base 0x80000000 y tamaño 0x20000000. $\Delta_s \leq 0x20000000$ → traducción válida: DF = 0x80000000 + 0x07654321 = 0x87654321.

c) Best-Fit: se ordenan los huecos libres por tamaño creciente.
Huecos iniciales: 256MB (0x10000000), 512MB (0x60000000), 768MB (0xA0000000), 512MB (0xE0000000).
- Segmento 0xAA (256 MB): se asigna al primer hueco de 256 MB en 0x10000000.
- Segmento 0xBB (576 MB): se asigna al hueco de 768 MB en 0xA0000000 (quedan 192 MB libres).

d) No presenta fragmentación interna: los segmentos virtuales tienen tamaño variable para ajustarse a los datos/código necesarios.
Sí presenta fragmentación externa: es común que queden espacios libres pequeños no útiles (ej: el nuevo hueco de 192 MB generado en el apartado c).`,
    explanation: `En memoria virtual segmentada, los segmentos tienen tamaño variable. La tabla de segmentos almacena la dirección base física y el tamaño. Best-Fit asigna el hueco más pequeño que satisface la petición. La fragmentación externa es inherente a la segmentación.`,
  },
  // 2021-07_q4
  {
    id: "2021-07_q4",
    exam: "2021-07",
    topic: "buses",
    type: "text",
    points: 1,
    question: `Sea un computador con las siguientes características:

- Las direcciones de memoria y las palabras son de 32 bits.
- Tiene un sistema de memoria que permite accesos en bloques de 4, 8 y 16 palabras.
- Tenemos dos buses candidatos para conectarse a este sistema de memoria, ambos son síncronos, de 32 bits y tienen la misma frecuencia de reloj. El bus A soporta accesos en bloques de 8 palabras de 32 bits y no requiere ciclos de espera entre operaciones. El bus B soporta accesos en bloques de 16 palabras de 32 bits y necesita esperar un número de ciclos entre el envío de dos bloques (se supondrá el bus libre antes de cada acceso).
- Para cada bloque, la memoria tarda 20 ciclos del bus en acceder a las primeras 4 palabras; y cada grupo adicional de 4 palabras se lee en 10 ciclos. Se considerará que la transferencia de los datos por el bus puede solaparse con la lectura de las cuatro palabras siguientes.`,
    subquestions: [
      `El número de ciclos de espera que tendrá que realizar el Bus B en cada transacción para que el ancho de banda del Bus A sea igual al ancho de banda del Bus B cuando se leen 128 palabras de memoria.`,
      `Este computador tiene un total de 1024 GB de información almacenada en 4 discos de 256 GB en RAID 0. Me dispongo a montar un sistema RAID para tener cierta tolerancia a fallos, pero que me ofrezca concurrencia a la hora de acceder a los datos. ¿Qué configuración RAID escogería y cuántos discos requeriría? Hay una oferta de un proveedor que me ofrece a precio muy económico hasta 8 discos de la misma serie de fabricación. ¿Es buena idea?`,
    ],
    correctAnswer: `a) BUS A: 128/8 = 16 transacciones. Cada transacción: 1 ciclo env dir + 20 ciclos primeras 4 pal + max(4, 10) + 4 ciclos últimas 4 pal = 35 ciclos. Total: 16 × 35 = 560 ciclos.

BUS B: 128/16 = 8 transacciones. Cada transacción: 1 + 20 + max(4,10) + max(4,10) + max(4,10) + 4 + T_esp = 55 + T_esp ciclos. Total: $8 \times (55 + T_{{esp}})$ ciclos.

Para igualar anchos de banda: $560 = (55 + T_{{esp}}) \times 8 \Rightarrow T_{{esp}} = 15$ ciclos.

b) RAID 4, 5 y 6 necesitan 1, 1 y 2 discos extra respectivamente. RAID 4 tiene cuello de botella. RAID 5 y 6 son mejores. RAID 6 ofrece mayor tolerancia a fallos. No es buena idea usar discos de la misma serie: si falla uno, es probable que fallen todos los de la misma serie de fabricación.`,
    explanation: `Se igualan los tiempos totales de ambos buses para encontrar T_esp. Para RAID con tolerancia a fallos y concurrencia, RAID 5 o 6 son las opciones. Discos de misma serie comparten defectos de fabricación.`,
  },
  // 2022-01_q1
  {
    id: "2022-01_q1",
    exam: "2022-01",
    topic: "segmentacion",
    type: "text",
    points: 1,
    question: `El siguiente código se ejecuta en un procesador MIPS de 5 etapas como el estudiado en clase (IF, ID, EX, MEM, WB). Este procesador cuenta con una unidad de detección de riesgos en la etapa ID y una unidad de anticipación en la etapa EX. El salto se decide en la etapa ID y se utiliza una técnica de predicción de salto.

\`\`\`
1       addi $t4, $0, 10
2 loop: lw $a1, 0($a0)
3       lw $t0, 0($a1)
4       sw $t0, 0($a0)
5       addi $t4, $t4, -1
6       addi $a0, $a0, 4
7       bne $t4, $0, loop
8       sw $t0, 0($a0)
\`\`\`

Responde razonadamente a las siguientes cuestiones:`,
    subquestions: [
      `Identifica las dependencias y su tipo dentro del bucle en el código anterior. ¿Cuáles de estas dependencias provocarán un riesgo en la ejecución?`,
      `Discute la veracidad de la siguiente afirmación: "Si el procesador implementase salto retardado, se puede eliminar la instrucción 4 y, tras la ejecución, el array que recorre $a0 tendrá los mismos valores que en el resultado original pero desplazados una posición."`,
      `Calcula la tasa de acierto del predictor de salto según los siguientes modos de procesamiento de salto que podría implementar el procesador: salto fijo no efectivo, predictor de salto de 1 bit y predictor de salto de 2 bits. En los modos de predicción dinámica, la predicción inicial es de salto no efectivo.`,
      `Para cada una de las etapas del pipeline distintas de EX, razona si sería posible mover a dicha etapa la unidad de anticipación y en caso afirmativo determina si el rendimiento sería mejor o peor que con la configuración del enunciado.`,
    ],
    correctAnswer: `a) Dependencias dentro del bucle (líneas 2-7):
- 2→3: Dependencia verdadera ($a1). Provoca riesgo RAW (no se puede anticipar $a1 hasta finalizar MEM).
- 3→4: Dependencia verdadera ($t0). Provoca riesgo RAW (no se puede anticipar $t0 hasta finalizar MEM).
- 6→2, 6→4: Antidependencia ($a0).
- 5→7: Dependencia verdadera ($t4). Provoca riesgo RAW.
También hay antidependencia en memoria entre 4 y 2 en [$a0+0].

b) Es FALSO. La instrucción 8 del hueco de retardo sobreescribiría en cada iteración el valor que leerá la instrucción 2 en la siguiente iteración.

c) El salto se ejecuta 10 veces:
- Salto fijo no efectivo: TA = 1/10.
- Predictor 1 bit: TA = 8/10.
- Predictor 2 bits: TA = 7/10.

d) ■ IF: No tiene sentido, no se ha decodificado la instrucción.
■ ID: Anticipando a la salida del banco de registros, se elimina el riesgo entre 5 y 7, pero en dependencias con lw se necesita un ciclo adicional → rendimiento PEOR.
■ MEM: Anticipando a la entrada del banco de memoria, se elimina el riesgo entre 3 y 4, pero el riesgo entre 2 y 3 se incrementa en un ciclo → rendimiento NO VARÍA.
■ WB: No tiene sentido, no hay registros de segmentación posteriores.`,
    explanation: `Las dependencias verdaderas que pasan por memoria (lw → uso) siempre provocan riesgos RAW en MIPS de 5 etapas. Con salto fijo no efectivo solo se acierta cuando el salto no se toma (última iteración). Mover la anticipación a otras etapas tiene trade-offs.`,
  },
  // 2022-01_q2
  {
    id: "2022-01_q2",
    exam: "2022-01",
    topic: "cache",
    type: "text",
    points: 1,
    question: `Una computadora dispone de un sistema de memoria cache de dos niveles. El primero nivel tiene un tiempo de acierto de 1 ciclo, mientras que el segundo nivel tiene una penalización por fallo de 50 ciclos. El tamaño de línea, tanto a nivel de cache como de memoria principal, es de 16 bytes. El tamaño de palabra es de 4 bytes. Considere el siguiente código:

\`\`\`
int A[2*N];
for( i = 0; i < N; ++i ) {
    r += A[2*i];
}
\`\`\`

El tamaño de un int es de 4 bytes, y las variables escalares se almacenan en registros del micro. Responda a las siguientes preguntas:`,
    subquestions: [
      `Indíquese la tasa de fallos local de la cache de nivel 1.`,
      `Indíquese la tasa de fallos global de la cache de nivel 2.`,
      `Sabiendo que el tiempo medio de acceso a memoria durante la ejecución de este programa es de 31 ciclos, indique el tiempo de acierto de la cache de segundo nivel.`,
      `Supóngase un sistema sin caches en el que la matriz A se almacena en una memoria principal con entrelazado de orden inferior a nivel de palabra. Se sabe que en este caso se pueden atender simultáneamente hasta un máximo de cuatro accesos consecutivos del código anterior. Indíquese cuantos módulos componen el sistema.`,
    ],
    correctAnswer: `El acceso al array es secuencial saltando un elemento (de cada 8 Bytes se leen 4).

a) Cada fallo en L1 trae de L2 16 bytes, que contienen datos útiles para esa iteración y la siguiente. La tasa local de fallos es del 50%.

b) Cuando ocurre un fallo en L1 también ocurre en L2 (no se reutilizan datos). Tasa local en L2 = 100%. Tasa global = 50%.

c) $TMA = 1 + 0.5 \times (t_{{accesoL2}} + 1 \times 50) = 31 \Rightarrow t_{{accesoL2}} = 10$ ciclos.

d) En cada acceso se cargan 4 palabras (16B) desde MP, suficientes para 2 iteraciones. Con entrelazado de orden inferior a nivel de palabra, cada palabra está en un módulo diferente. Para atender simultáneamente 4 iteraciones (= 2 accesos) se necesitan 8 módulos de memoria.`,
    explanation: `Con líneas de 16B y palabras de 4B, cada línea cubre 2 accesos (se accede a A[2*i], saltando un elemento). En L2 no hay reuso → todos los fallos de L1 también fallan en L2. El entrelazado de orden inferior distribuye palabras consecutivas en módulos diferentes.`,
  },
  // 2022-01_q3
  {
    id: "2022-01_q3",
    exam: "2022-01",
    topic: "memoria-virtual",
    type: "text",
    points: 1,
    question: `Considera un sistema de memoria virtual paginado en 2 niveles. El tamaño del espacio virtual es de 256 TiB y el del espacio físico es de 4 GiB. El tamaño de página es de 64 KiB y se dispone de una TLB totalmente asociativa de 512 entradas. Las tablas de páginas de ambos niveles tienen el mismo número de entradas y la misma estructura. Cada entrada contiene, además del bit de residencia, 7 bits de control.`,
    subquestions: [
      `Si sabemos que la dirección virtual 0x395B 1880 51A9 se traduce en la dirección física 0xEDDB 51A9 y que la entrada correspondiente en la tabla de segundo nivel comienza en la dirección 0x9ED3 4980, escribe un posible contenido para las entradas de todas las tablas que permitan hacer esta traducción (indicando asimismo sus campos).`,
      `Escribe los contenidos de las entradas en la TLB implicadas en la anterior traducción. Indica qué cambios se producirían si, justo a continuación, el procesador emite la dirección 0x395B 1880 51E9.`,
      `Calcula el tamaño conjunto de todas las tablas de páginas de un proceso. Si el tamaño de página se incrementase a 16 MiB manteniendo el tamaño de los espacios virtual y físico y la información de control, ¿aumentaría o disminuiría el espacio ocupado por las tablas? Razona tu respuesta.`,
      `Si en este ordenador tenemos una caché de 8 MiB asociativa por conjuntos con 16 vías y un tamaño de línea de 64 B, ¿podría aplicarse la técnica VIPT (índice virtual, etiqueta física)? Justifica tu respuesta.`,
    ],
    correctAnswer: `a) $|V| = 256\ TiB = 2^{{48}}B$, $|F| = 4\ GiB = 2^{{32}}B$, $|P| = 64\ KiB = 2^{{16}}B$.
Índices de 16 bits cada uno.

DV: PV1=0x395B | PV2=0x1880 | Δ=0x51A9
DF: PF=0xEDDB | Δ=0x51A9

TP₁[0x395B]: R=1 | control=0 | PF=0x9ED3 → 0x809ED3
TP₂[0x1880]: R=1 | control=0 | PF=0xEDDB → 0x80EDDB

b) TLB: PV=0x395B1880 | PF=0xEDDB
La dirección 0x395B 1880 51E9 está en la misma página (solo cambia Δ) → TLB no cambia.

c) $|TP_1| = 2^{{16}} \times 3\ B = 192\ KiB$. $|TP| \approx 12\ GiB$.
Al incrementar el tamaño de página DISMINUYE el espacio ocupado (menos páginas → menos entradas y más pequeñas).

d) $|C| = 8\ MiB = 2^{{23}}B$, $|l| = 64B$, #líneas $= 2^{{17}}$, #conjuntos $= 2^{{13}}$ (16 vías) → índice 13 + despl 6 = 19 bits > Δ (16 bits) → NO es posible VIPT.`,
    explanation: `Con páginas de 64 KiB, Δ=16 bits. Pero índice (13) + despl (6) = 19 bits > 16 → VIPT no viable. El tamaño total de las tablas crece exponencialmente con la paginación en 2 niveles.`,
  },
  // 2022-01_q4
  {
    id: "2022-01_q4",
    exam: "2022-01",
    topic: "buses",
    type: "text",
    points: 1,
    question: `Tenemos un sistema con memoria virtual de páginas de 2 kiB que conecta la memoria principal con el almacenamiento secundario mediante un bus síncrono de 128 bits a 100 MHz. Las transferencias de las páginas están gestionadas por una DMA a través de este bus en bloques del tamaño de la anchura del bus, necesitando 280 ns para la lectura del primer bloque y 100 ns para el resto en una operación de lectura de una página. Tanto el envío de 128 bits como el de la dirección requieren un ciclo. Las transferencias pueden solaparse con la lectura de los siguientes. La DMA realiza la lectura de una página en una única transacción.

El almacenamiento secundario tiene una capacidad neta de 8 TiB, repartidos en cuatro discos con accesos concurrentes. Se quiere RAID con información redundante. Precios de discos de 2 TB:
- MACWEL: serie 3NV-0001 450€, 4NW-0001 490€
- TEABATE: WW-0001-YN1 440€
- EastDigi: ED-A-0001-W 430€, ED-A-0015-Y 460€, ED-B-1020-C 500€

Presupuesto máximo: 2500€.`,
    subquestions: [
      `Latencia para la lectura de una página.`,
      `Ancho de banda del bus para las operaciones de lectura de página desde el almacenamiento secundario.`,
      `¿Qué tipo de RAID implementarías con el mejor rendimiento? ¿Por qué?`,
      `¿Cuál sería la combinación de discos que utilizarías y cuál sería su coste? Razona la elección.`,
    ],
    correctAnswer: `a) Bus 128 bits = 16 B/transf. NL = 2 kiB / 16 B = 128 lecturas.
$T = 1/100\ MHz = 10\ ns$.
Transferencia: 1 ciclo dir + 280 ns (28 ciclos) + 127 × 100 ns (10 ciclos) + 1 ciclo = 1 + 28 + 1270 + 1 = 1300 ciclos.
Latencia = $1300 \times 10 = 13000\ ns = 13\ \mu s$.

b) $AB = 2\ kiB / (13 \times 10^{{-6}}\ s) \approx 154\ MB/s$.

c) RAID 5 da mejor rendimiento que RAID 4 (sin cuello de botella en disco de paridad). RAID 6 requiere 6 discos (≥2580€, excede presupuesto).

d) RAID 5 con 5 discos. Para mayor fiabilidad, de distintas series: 450+490+440+430+460 = 2270€.`,
    explanation: `La DMA lee en bloques de 16B (ancho de bus 128 bits). El primer bloque tarda más (280 ns) que los subsiguientes (100 ns). Para RAID 5 con presupuesto limitado, se eligen discos de distintas series para maximizar fiabilidad.`,
  },
  // 2022-07_q1
  {
    id: "2022-07_q1",
    exam: "2022-07",
    topic: "segmentacion",
    type: "text",
    points: 3,
    question: `El siguiente fragmento de código se ejecuta en un procesador segmentado de 5 etapas: IF, ID, EX, MEM e WB. En ninguna de las etapas pueden coincidir dos instrucciones, aunque utilicen bancos de registros diferentes. El procesador tiene una frecuencia de reloj de 2 GHz, unidad de detección de riesgos en ID y unidad de anticipación en EX. La ejecución de una suma en punto flotante tiene una latencia de 2 ciclos. El salto se decide en ID y se usa salto fijo no efectivo.

\`\`\`
1. addi $s3, $0, 4
2. loop: lwc1 $f0, 0($s2)
3.     add.s $f1, $f0, $f0
4.     add.s $f2, $f2, $f1
5.     addi $s3, $s3,-1
6.     add $s2, $s2, 4
7.     bne $s3, $0, loop
8. swc1 $f2, 0($s2)
\`\`\``,
    subquestions: [
      `Dibuja el diagrama en múltiples ciclos para la ejecución de una iteración del código. Señala explícitamente las anticipaciones y los bloqueos.`,
      `Indica sobre el diagrama de qué tipo son los riesgos presentes en la ejecución.`,
      `Calcula el CPI para la ejecución completa de este código.`,
      `Calcula el rendimiento según la métrica MFLOPS.`,
      `Supón que el código se ejecuta en un procesador que implementa salto retardado. Justifica, para cada una de las instrucciones, si la podrías mover al hueco de retardo (indicando modificaciones necesarias), y qué efecto tendría sobre los riesgos. Indica razonadamente cuál es la mejor opción.`,
    ],
    correctAnswer: `a) Diagrama:

|   | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | IF | ID | EX | MEM | WB |   |   |   |   |    |    |    |    |    |    |    |   |
| 2 |    | IF | ID | EX | MEM | WB↓f0 |   |   |   |    |    |    |    |    |    |    |   |
| 3 |    |    | IF | ID | (ID) | A1 | A2 | MEM↓f1 | WB |    |    |    |    |    |    |    |   |
| 4 |    |    |    | IF | (IF) | ID | (ID) | A1 | A2 | MEM | WB |    |    |    |    |    |   |
| 5 |    |    |    |    |    | IF | (IF) | ID | EX | (EX) | MEM | WB |    |    |    |    |   |
| 6 |    |    |    |    |    |    |    | IF | ID | (ID) | EX | MEM | WB |    |    |    |   |
| 7 |    |    |    |    |    |    |    |    | IF | (IF) | ID | (ID) | EX | MEM | WB |    |   |
| 8 |    |    |    |    |    |    |    |    |    |    | IF | (IF) | (nop) | (nop) | (nop) | (nop) |   |
| 2 |    |    |    |    |    |    |    |    |    |    |    |    | IF | ID | EX | MEM | WB |

b) Riesgos: 2→3 (RAW), 3→4 (RAW), 4→5 (estructural), 5→7 (RAW), 7→8 (control).

c) #ciclos = 5 iniciales + 11 × 4 iteraciones = 49. #instr = 1 + 6×4 + 1 = 26. CPI = 49/26 = 1,88.

d) #flops = 2 × 4 = 8. $T_{{cpu}} = 49/(2 \times 10^9) = 24,5\ ns$. MFLOPS = 326,53.

e) Instr 5 (addi $s3,$s3,-1) en el hueco de retardo, cambiando inmediato a 3: elimina riesgo con 7 (2 ciclos). **Es la mejor opción.**`,
    explanation: `La latencia FP de 2 ciclos añade burbujas. La restricción de 1 instr por etapa MEM/WB fuerza riesgos estructurales. La instrucción 5 en el hueco de retardo es óptima.`,
  },
  // 2022-07_q2
  {
    id: "2022-07_q2",
    exam: "2022-07",
    topic: "cache",
    type: "text",
    points: 2,
    question: `Un computador tiene una memoria principal de 4 GiB y una memoria caché de 64 KiB con un tamaño de línea de 16 bytes. Estando la caché inicialmente vacía, se ejecuta un código que accede a determinadas direcciones de memoria en el orden indicado. Todos los accesos son de escritura, y la caché utiliza allocate-on-write.`,
    subquestions: [
      `Caché de correspondencia directa con write-back. Rellena la tabla para las direcciones 0xFF306423, 0xFF30642A, 0xFF30642F, 0xFF3A6423, 0xFF3A6427, 0xFF306424: etiqueta, índice, desplazamiento; acierto/fallo; tipo de fallo; y si provoca escritura en MP.`,
      `Caché asociativa por conjuntos de 16 vías con LRU y write-through. Rellena los mismos campos para las mismas direcciones.`,
      `Sabiendo que el tiempo medio de acceso del apartado b) fue de 34 ciclos, y el tiempo de acierto caché es de 1 ciclo, calcula el tiempo de acceso a memoria principal.`,
    ],
    correctAnswer: `a) Correspondencia directa: Etiqueta 16b | Índice 12b | Despl 4b.

| Dirección | Etiq. | Índice | Despl. | A/F | Tipo fallo | Esc MP? |
|---|---|---|---|---|---|---|
| 0xFF306423 | FF30 | 642 | 3 | Fallo | Forzoso | No |
| 0xFF30642A | FF30 | 642 | A | Acierto | – | No |
| 0xFF30642F | FF30 | 642 | F | Acierto | – | No |
| 0xFF3A6423 | FF3A | 642 | 3 | Fallo | Forzoso | Sí |
| 0xFF3A6427 | FF3A | 642 | 7 | Acierto | – | No |
| 0xFF306424 | FF30 | 642 | 4 | Fallo | Conflicto | Sí |

b) 16 vías: Etiqueta 20b | Conjunto 8b | Despl 4b.

| Dirección | Etiq. | Conjunto | Despl. | A/F | Tipo fallo | Esc MP? |
|---|---|---|---|---|---|---|
| 0xFF306423 | FF306 | 42 | 3 | Fallo | Forzoso | Sí |
| 0xFF30642A | FF306 | 42 | A | Acierto | – | Sí |
| 0xFF30642F | FF306 | 42 | F | Acierto | – | Sí |
| 0xFF3A6423 | FF3A6 | 42 | 3 | Fallo | Forzoso | Sí |
| 0xFF3A6427 | FF3A6 | 42 | 7 | Acierto | – | Sí |
| 0xFF306424 | FF306 | 42 | 4 | Acierto | – | Sí |

c) $T_m = 1 + P_f \times (1/3) = 34 \Rightarrow P_f = 99$ ciclos. Tiempo acceso MP = 100 ciclos.`,
    explanation: `Con write-back solo se escribe a MP al reemplazar líneas modificadas. Con write-through toda escritura va a MP. Con 16 vías, todas las direcciones caben en el mismo conjunto sin conflictos.`,
  },
  // 2022-07_q3
  {
    id: "2022-07_q3",
    exam: "2022-07",
    topic: "memoria-virtual",
    type: "text",
    points: 2,
    question: `Supón que un sistema de memoria virtual paginada, que utiliza un esquema de traducción directa en un único nivel, tiene un espacio virtual de 256 TiB y un espacio físico de 64 GiB. El tamaño de página es 4 KiB y se dispone de una TLB totalmente asociativa de 512 entradas. El RBTP contiene 0x0 0000 0000. Cada entrada tiene bit de residencia (MSB), 7 bits de control y número de página física. El contenido del byte en la dirección física X es (X mod 256).`,
    subquestions: [
      `Determina el número de bits que ocupa cada campo en una entrada de la tabla de páginas.`,
      `Muestra el proceso de traducción de la DV 0x31F3 1E4B A4CD: identifica campos de la DV, determina dirección y contenido de la entrada de la TP, comprueba validez, y calcula la DF resultante.`,
      `Calcula el tamaño de la tabla de páginas y compáralo con la memoria disponible. ¿Ves algún problema? Si es así, propón una solución.`,
      `Se propone eliminar el dirty bit para reducir el tamaño de la tabla de páginas. Explica si ves algún inconveniente.`,
    ],
    correctAnswer: `a) $|F| = 64\ GiB = 2^{{36}}B$, $|P| = 4\ KiB = 2^{{12}}B$ → PF 24 bits. Entrada: R(1) | Control(7) | PF(24) = 32 bits = 4 Bytes.

b) DV 48 bits: PV = 36 bits | Δ = 12 bits. 0x31F3 1E4B A4CD → PV = 0x31F31E4BA, Δ = 0x4CD.
Dir entrada = 0 + 0x31F31E4BA × 4 = 0xC7CC792E8.
Contenido (X mod 256): E8 E9 EA EB. R = 1 (0xE8 = 11101000). Traducción válida.
PF = 0xE9EAEB. DF = 0xE9EAEB4CD.
TLB: PV = 0x31F31E4BA | PF = 0xE9EAEB. 0x31F3 1E4B A4CE está en la misma página → TLB no cambia.

c) $|TP| = 2^{{36}} \times 4\ B = 256\ GiB$. ¡Mayor que la memoria física (64 GiB)! Soluciones: paginación multinivel, aumentar tamaño de página, reducir espacio virtual.

d) El tamaño de entrada debe ser múltiplo de 8 bits → eliminar 1 bit no reduce el tamaño. Además, el dirty bit evita escrituras innecesarias a disco (operación muy lenta) → su eliminación impactaría negativamente en el rendimiento.`,
    explanation: `Con traducción directa, la tabla de páginas crece con el número de páginas virtuales. Con 256 TiB y páginas de 4 KiB, ocupa 256 GiB, más que la memoria física → imposible. Se necesita paginación multinivel.`,
  },
  // 2022-07_q4
  {
    id: "2022-07_q4",
    exam: "2022-07",
    topic: "buses",
    type: "text",
    points: 0.6,
    question: `Tenemos un sistema con memoria virtual de páginas de 16 kiB que conecta la memoria principal con el almacenamiento secundario mediante un bus síncrono a 20 MHz. Las transacciones están gestionadas por una DMA en bloques del tamaño de la anchura del bus, necesitando 50 ns para la lectura de cada bloque. Tanto la transferencia de un bloque como el envío de la dirección requieren un ciclo. Las transferencias pueden solaparse con la lectura de los siguientes. La DMA realiza la lectura de una página en una única transacción.`,
    subquestions: [
      `Calcula la anchura mínima del bus necesaria para que la latencia de la lectura de una página sea menor de 150 μs. La anchura debe ser potencia en base 2 de bytes (2ⁿ bytes, n ∈ ℕ).`,
      `Para la anchura determinada, calcula el ancho de banda para las operaciones de lectura de página.`,
    ],
    correctAnswer: `a) Anchura = $2^n$ bytes. NL = $16\ kiB / 2^n = 2^{{14-n}}$. $T = 1/20\ MHz = 50\ ns$.
Latencia = $50 + 50 \times 2^{{14-n}} + 50 = 50(2 + 2^{{14-n}})\ ns = 0,1(1 + 2^{{13-n}})\ \mu s$.

n=2: $L = 0,1(1 + 2^{{11}}) = 204,9\ \mu s > 150$.
n=3: $L = 0,1(1 + 2^{{10}}) = 102,5\ \mu s < 150$.

Anchura mínima: $2^3 = 8$ bytes = 64 bits.

b) $AB = 16\ kiB / (102,5 \times 10^{{-6}}\ s) \approx 160\ MB/s$.`,
    explanation: `Se prueba con diferentes anchuras de bus (potencias de 2) hasta encontrar la mínima que da latencia < 150 μs. Con 8 bytes (64 bits) se consigue.`,
  },
  // 2022-07_q5
  {
    id: "2022-07_q5",
    exam: "2022-07",
    topic: "raid",
    type: "text",
    points: 0.4,
    question: `Las siguientes afirmaciones contienen algún error. Corrígelas justificando la respuesta.`,
    subquestions: [
      `Suponiendo discos de 1 TiB y una capacidad neta de 8 TiB, los RAID 5 y RAID 6 tendrán una capacidad total de 9 TiB, con la información de redundancia repartida cíclicamente a lo largo de todos los discos.`,
      `Las desventajas de los SSD frente a los HDD son la menor capacidad, el mayor coste y la mayor posibilidad de fallos de funcionamiento.`,
    ],
    correctAnswer: `a) CORRECCIÓN: RAID 5 tendrá 9 TiB totales y RAID 6 tendrá 10 TiB totales. RAID 6 almacena dos ECCs en discos diferentes, necesitando un disco más que RAID 5.

b) CORRECCIÓN: Las desventajas de los SSD son la menor capacidad y el mayor coste. Los SSD son más robustos que los HDD (sin componentes mecánicos).`,
    explanation: `RAID 5 usa 1 disco de paridad, RAID 6 usa 2. Los SSD no tienen partes móviles → más fiables, no más propensos a fallos.`,
  },
  // 2023-01_q3
  {
    id: "2023-01_q3",
    exam: "2023-01",
    topic: "rendimiento",
    type: "text",
    points: 0.75,
    question: `Un núcleo de un procesador Intel Core i9-12900K trabaja a una frecuencia base de 4.0 GHz, y posee dos unidades de ejecución vectoriales AVX-2 capaces de ejecutar 8 operaciones en punto flotante por ciclo cada una.`,
    subquestions: [
      `¿Cuál es el rendimiento máximo teórico en GFLOPS de este núcleo? Sabiendo que el procesador cuenta con ocho núcleos idénticos, ¿cuál será el rendimiento máximo teórico del procesador completo?`,
      `Se ejecuta en el procesador el siguiente código:

\`\`\`
float r, a[N];
for ( int i = 0; i < N; ++i )
    r = r + a[i];
\`\`\`

Supongamos que el rendimiento no está limitado por las unidades FP sino por el sistema de memoria. Si tiene un ancho de banda de 32 GB/s, ¿cuál será el rendimiento máximo en GFLOPS? (float = 4 bytes).`,
      `El código ensamblador del lazo incluye una carga, una suma FP, una suma de enteros con inmediato y un salto condicional. Con un rendimiento de 6.4 GFLOPS, ¿cuál ha sido el rendimiento en MIPS?`,
    ],
    correctAnswer: `a) 1 núcleo: $4,0\ GHz \times 2\ VU \times 8\ FLOPS/VU = 64\ GFLOPS$.
Procesador: $64 \times 8 = 512\ GFLOPS$.

b) $32 \times 10^9 / 4 = 8$ Gfloats/s transferidos. 1 FLOP por float → 8 GFLOPS.

c) 6,4 GFLOPS × 4 instr/FLOP = 25,6 × 10⁹ instr/s = 25600 MIPS.`,
    explanation: `El rendimiento pico es frecuencia × unidades FP × ops por unidad. El ancho de banda limita el rendimiento real (memory-bound). MIPS = GFLOPS × relación instr/FLOP.`,
  },
  // 2023-01_q4
  {
    id: "2023-01_q4",
    exam: "2023-01",
    topic: "memoria-virtual",
    type: "text",
    points: 2,
    question: `La CPU solicita los datos correspondientes a la dirección virtual 0x0121 27B4. En la entrada de la TP de primer nivel se encuentra 0xA274 14A0 y en la de segundo nivel 0x8002 4605.

Contexto: Memoria principal 1 GiB ($2^{{30}}B$). Tamaño de página 4 kiB. Cada TP ocupa exactamente una página. Cada entrada ocupa 4 Bytes: bit más significativo = residencia, bits menos significativos = número de PF. Los restantes son bits de protección/control. TLB de 256 entradas.`,
    subquestions: [
      `Determina en qué campos se divide la dirección virtual.`,
      `Determina cómo se divide una dirección física para memoria virtual.`,
      `Calcula la dirección física de las entradas de las TP de nivel 1 y 2 si la TP₁ está al comienzo de la memoria física.`,
      `¿Cuál es la dirección física resultante del proceso de traducción?`,
      `¿Qué información se escribirá en la TLB?`,
      `Determina el tamaño del Espacio Virtual.`,
      `Si la caché L1 es VIPT (índice virtual, etiqueta física), calcula en qué conjunto de la caché se encontrará el dato referenciado por la DV del enunciado.`,
      `¿Qué ventajas e inconvenientes tiene una caché virtual con respecto a otros tipos de caché?`,
      `¿Qué ventaja aporta realizar la traducción en varios niveles con respecto a una traducción directa en un único nivel?`,
    ],
    correctAnswer: `a) Páginas 4 kiB → Δ = 12 bits. Cada TP: $2^{{12}}/4 = 2^{{10}}$ entradas → PV1, PV2 de 10 bits.
DV: PV1=0x004 | PV2=0x212 | Δ=0x7B4.

b) 1 GiB → $2^{{30}}/2^{{12}} = 2^{{18}}$ PF. DF: PF (18 bits) | Δ (12 bits).

c) RBTP₁ = 0. DirE1 = 0 + 0x004 × 4 = 0x10.
TP₁ = 0xA27414A0 → PF(TP₂) = 0x014A0. RBTP₂ = 0x014A0000.
DirE2 = 0x014A0000 + 0x212 × 4 = 0x014A0848.

d) TP₂ = 0x80024605 → PF = 0x24605. DF = 0x246057B4.

e) TLB: PV = 0x01212 | PF = 0x24605.

f) DV = 10+10+12 = 32 bits → Espacio virtual = $2^{{32}} = 4$ GiB.

g) L1: línea 64B → despl = 6b. 512 líneas / 8 vías = 64 conjuntos → índice 6b.
Δ = 0x7B4 = 0111 1011 0100₂ → Índice = 011110₂ = 0x1E.

h) Ventaja: acceso directo a caché sin traducción (solo se traduce en fallo). Inconveniente: necesita información de proceso en directorio caché o purgar en cambios de contexto.

i) Se reduce el espacio para almacenar las tablas de páginas, manteniendo solo las secciones del espacio virtual utilizado.`,
    explanation: `Páginas de 4 KiB, entradas de 4B → 1024 entradas/tabla → 10 bits/nivel. Espacio virtual = 32 bits (4 GiB). VIPT viable porque índice+despl (12 bits) ≤ Δ (12 bits).`,
  },
  // 2023-01_q5
  {
    id: "2023-01_q5",
    exam: "2023-01",
    topic: "raid",
    type: "text",
    points: 0.5,
    explanationImage: getImage(imageMap, "2023-01_q5_raid-10.jpeg"),
    question: `El almacenamiento secundario de este sistema está configurado en RAID 1+0 para incrementar la seguridad de la información.`,
    subquestions: [
      `¿Cuántos discos reales tiene el sistema para la capacidad neta de 8 TiB?`,
      `¿Qué ventajas o inconvenientes tendría sobre el método actual utilizar RAID 0+1?`,
      `Para incrementar la información neta sin invertir en nuevo hardware, garantizando redundancia, se implementa RAID 6. ¿Cuál sería ahora la cantidad de información neta?`,
    ],
    correctAnswer: `a) RAID 1+0: mirroring sobre striping. Para 8 TiB netos (4 discos de 2 TiB) se necesitan 4 discos espejo → 8 discos total.

b) RAID 0+1 es mirror sobre stripe. Misma redundancia pero menos tolerante a fallos: en RAID 1+0, solo el fallo del espejo (1 de 7) causa error; en RAID 0+1, cualquier fallo en el otro RAID 0 causa error.

c) RAID 6 con 8 discos de 2 TiB: doble paridad ocupa 2 discos → capacidad neta = 6 × 2 = 12 TiB.`,
    explanation: `RAID 1+0 (stripe of mirrors) es más robusto que RAID 0+1 (mirror of stripes) ante fallos múltiples. RAID 6 sacrifica 2 discos para paridad.`,
  },
  // 2023-01_q6
  {
    id: "2023-01_q6",
    exam: "2023-01",
    topic: "buses",
    type: "text",
    points: 0.75,
    question: `A través del bus indicado, la CPU solicita la transferencia de una página (4 kiB) a memoria física. En cada ciclo de reloj (frecuencia 1 GHz) se transmiten 64 bits o una dirección. El bus permite transacciones de 32 palabras, necesitando 100 ns para el acceso al primer bloque de 8 palabras y 30 ns para cada grupo adicional de 8 palabras. La transferencia puede solaparse con el acceso a los siguientes datos. Entre transacciones se espera 1 ciclo.`,
    subquestions: [
      `¿Cuántas transacciones de bus se realizarán para transferir una página completa?`,
      `Calcula la latencia de la transferencia completa.`,
    ],
    correctAnswer: `a) 1 transacción = 32 × 8 B = 256 B = $2^8$ B. $2^{{12}}/2^8 = 16$ transacciones.

b) $T_{{ciclo}} = 1\ ns$. 1 transacción (32 pal = 4 bloques de 8 pal):
1 env dir + 100 acceso bloque 1 + 3×max(8,30) + 8 envío último + 1 espera = 1+100+90+8+1 = 200 ns.
Latencia total = 16 × 200 = 3200 ns = 3,2 μs.`,
    explanation: `Con palabras de 64 bits (8B) y bus de 64 bits, 1 palabra/ciclo. El primer bloque tarda 100 ns, los siguientes 30 ns. El solapamiento oculta parcialmente la latencia.`,
  },
  // 2023-07_q1
  {
    id: "2023-07_q1",
    exam: "2023-07",
    topic: "rendimiento",
    type: "text",
    points: 0.75,
    question: `Un *benchmark* en un procesador determinado tarda 5 s en finalizar, con un total de $20 \times 10^9$ instrucciones ejecutadas. El 25% del tiempo se emplea en instrucciones de punto flotante.`,
    subquestions: [
      `¿Cuál es el MIPS alcanzado?`,
      `¿Cuál es el GFLOPS alcanzado?`,
      `Aplicando la ley de Amdahl, ¿cuánto tendríamos que mejorar la unidad FP para conseguir una aceleración del 10%?`,
    ],
    correctAnswer: `a) $MIPS = \frac{{20 \times 10^9}}{{5 \times 10^6}} = 4000$.

b) $GFLOPS = \frac{{20 \times 10^9 \times 0,25}}{{5 \times 10^9}} = 1$.

c) $A = \frac{{1}}{{(1-F_{{PF}}) + F_{{PF}}/A_{{PF}}}}$. Con $A=1,1$, $F_{{PF}}=0,25$:
$1,1 = \frac{{1}}{{0,75 + 0,25/A_{{PF}}}} \Rightarrow A_{{PF}} \approx 1,57$. Mejorar FP un 57%.`,
    explanation: `MIPS = instr/(tiempo×10⁶). GFLOPS = instr FP/(tiempo×10⁹). Amdahl: para aceleración global 10%, la fracción FP (25%) debe acelerarse 57%.`,
  },
  // 2023-07_q2
  {
    id: "2023-07_q2",
    exam: "2023-07",
    topic: "segmentacion",
    type: "text",
    points: 2,
    repeated: true,
    question: `El siguiente código se ejecuta en el procesador segmentado MIPS de 5 etapas: IF, ID, EX, MEM, WB. Salto decidido en ID, salto fijo no efectivo, detección de riesgos en ID, anticipación en EX. La suma FP requiere 3 ciclos y está segmentada. MEM y WB solo albergan una instrucción.

\`\`\`
1   addi $s0, $0, 4
   Loop:
2   lwc1 $f1, 0($a1)
3   add.s $f2, $f1, $f2
4   addi $a1, $a1, 4
5   addi $s0, $s0, -1
6   bne $s0, $0, Loop
   End:
7   swc1 $f2, 0($a2)
\`\`\``,
    subquestions: [
      `Indica dos dependencias verdaderas dentro del bucle.`,
      `Indica una antidependencia dentro del bucle.`,
      `¿Se produce alguna anticipación? Indica entre qué instrucciones y etapas.`,
      `Indica los riesgos de datos en el bucle y de qué tipo son.`,
      `¿Cómo se podría optimizar la ejecución reordenando las instrucciones 3, 4 y 5?`,
      `Si utilizásemos salto retardado, ¿qué instrucción colocarías en el hueco de retardo?`,
      `¿Qué etapas utiliza bne? Si el salto se decidiese en EX, ¿cuáles usaría?`,
    ],
    correctAnswer: `a) Dependencias verdaderas: entre 2 y 3 ($f1); entre 5 y 6 ($s0).

b) Antidependencia: entre 2 y 4 ($a1).

c) Sí, entre 2 y 3: add.s lee $f1 desde MEM/WB antes de que se escriba en WB.

d) Dos riesgos RAW: 2→3 ($f1) y 5→6 ($s0).

e) Poniendo la instr 5 después de la 2:
\`\`\`
1 addi $s0, $0, 4
2 Loop: lwc1 $f1, 0($a1)
5 addi $s0, $s0, -1
3 add.s $f2, $f1, $f2
4 addi $a1, $a1, 4
6 bne $s0, $0, Loop
7 End: swc1 $f2, 0($a2)
\`\`\`

f) La instr 5 en el hueco de retardo (modificando valor inicial a 3) evita el bloqueo de 2 ciclos con 6. **Es la mejor solución.**

g) Con salto en ID: solo IF e ID. Con salto en EX: IF, ID, EX y MEM.`,
    explanation: `La latencia FP de 3 ciclos segmentada aumenta la distancia productor-consumidor. Reordenar instrucciones independientes reduce bloqueos. La instr 5 en el hueco de retardo elimina el riesgo RAW más costoso (2 ciclos).`,
  },
  // 2023-07_q3
  {
    id: "2023-07_q3",
    exam: "2023-07",
    topic: "cache",
    type: "text",
    points: 2,
    question: `Un sistema con 1 MiB de memoria principal incluye una caché L1 de 32 KiB, asociativa por conjuntos de 2 vías, con líneas de 16 B. Política de postescritura. Estando la caché vacía, se ejecuta:

\`\`\`
int i, A[256], B[128];
for (i = 0; i < 4; i++)
    B[i] = A[i+1] + A[i+128];
\`\`\`

A comienza en 0x0A000, B inmediatamente a continuación. int = 4 bytes. Variables escalares en registros.`,
    subquestions: [
      `Calcula las direcciones de memoria a las que accede este código.`,
      `Determina cómo se divide una dirección física desde el punto de vista de la caché.`,
      `Rellena la tabla de accesos: dirección, etiqueta, conjunto (hex); acierto/fallo; tipo de fallo; escritura en MP.`,
      `Indica cómo quedaría el directorio caché (conjunto, vía, BV, BM, etiqueta).`,
      `Con TMA = 52 ciclos y t_acierto = 1 ciclo, calcula el tiempo medio de acceso al nivel inferior.`,
      `Calcula el tamaño mínimo de L1 para preservar la tasa de fallos observada (misma línea y asociatividad).`,
    ],
    correctAnswer: `a) &A = 0x0A000, &B = 0x0A400.
i=0: A[1]=0x0A004, A[128]=0x0A200, B[0]=0x0A400
... (12 accesos en total).

b) Caché 32 KiB, línea 16B, 2 vías: Despl 4b, #líneas=2¹¹, #conj=2¹⁰ (índice 10b), Etiqueta 6b.

c) Tabla (resumen): 12 accesos, 8 aciertos, 4 fallos forzosos. Escrituras en MP: No (write-back, solo al reemplazar modificadas).

d) Directorio: Conj 0x200 vía0 (BV=1,BM=0,Etiq=0x02), 0x201 vía0, 0x220 vía0, 0x240 vía0 (BM=1).

e) $52 = 1 + (4/12)P_f \Rightarrow P_f = 153$ ciclos.

f) Conflicto cuando #conjuntos baje a 0x40 → tamaño mín = 0x40×2×16 = 2 KiB.`,
    explanation: `Con write-back, las escrituras no van a MP salvo al reemplazar líneas modificadas. Las escrituras en B modifican líneas del conjunto 0x240 (BM=1). Tamaño mínimo sin conflictos: 2 KiB.`,
  },
  // 2023-07_q4
  {
    id: "2023-07_q4",
    exam: "2023-07",
    topic: "memoria-virtual",
    type: "text",
    points: 2,
    question: `Un sistema con 64 GiB de MP ($2^{{36}}$B) y espacio virtual de 1 TiB ($2^{{40}}$B) paginado en 2 niveles. Páginas de 64 KiB ($2^{{16}}$B). Cada TP tiene 4096 entradas ($2^{{12}}$) de 4 bytes: MSB = residencia, LSB = PF. CPU solicita DV 0x01 F004 D38C. TP₁ = 0xA274 14A0, TP₂ = 0x8002 4605.`,
    subquestions: [
      `Determina en qué campos (longitud y valores) se divide la dirección virtual.`,
      `Calcula la dirección física de la entrada correspondiente de la TP de nivel 2.`,
      `¿Cuál es la dirección física resultante del proceso de traducción?`,
      `Calcula cuánto ocupan las tablas de páginas necesarias para esta traducción.`,
      `Determina si existe fragmentación interna o externa en la gestión de memoria virtual.`,
      `¿Podría ser VIPT una caché L1 de 32 KiB, 8 vías, línea 64 bytes?`,
    ],
    correctAnswer: `a) Δ = 16 bits. PV1 y PV2: 12 bits cada uno.
DV: PV1=0x01F | PV2=0x004 | Δ=0xD38C.

b) TP₁ R=1 (0xA=1010). PF(TP₂)=0x414A0. RBTP₂=0x414A0000.
DirE2 = 0x414A0000 + 0x004×4 = 0x414A0010.

c) TP₂ R=1 (0x8=1000). PF=0x24605. DF=0x24605D38C.

d) TP₁: $2^{{12}}\times4 = 16\ KiB$. TP₂: 16 KiB. Total: 32 KiB.

e) Fragmentación interna: cada TP ocupa 16 KiB pero la página es 64 KiB → solo 1/4 usado. No hay fragmentación externa (sistema paginado).

f) L1: despl 6b, índice 6b (64 conjuntos). 6+6=12 ≤ Δ(16) → SÍ es posible VIPT.`,
    explanation: `Con páginas de 64 KiB, Δ=16 bits. Índice(6)+despl(6)=12 ≤ 16 → VIPT viable. Fragmentación interna porque las tablas ocupan menos que una página completa.`,
  },
  // 2023-07_q5
  {
    id: "2023-07_q5",
    exam: "2023-07",
    topic: "raid",
    type: "text",
    points: 0.5,
    repeated: true,
    question: `Disponemos de 4 discos de 1 TB en configuración RAID 0.`,
    subquestions: [
      `¿Cuántos discos necesitaríamos para mantener la misma información neta en RAID 4, 5 o 6?`,
      `¿Qué ventajas o inconvenientes tendría utilizar RAID 5 sobre RAID 4?`,
    ],
    correctAnswer: `a) RAID 0: 4 TB netos. RAID 4: 5 discos. RAID 5: 5 discos. RAID 6: 6 discos.

b) RAID 5 distribuye la paridad evitando el cuello de botella del disco de paridad de RAID 4. Mejor rendimiento concurrente y mayor vida útil (el disco de paridad en RAID 4 se escribe más frecuentemente).`,
    explanation: `RAID 4 centraliza la paridad → cuello de botella. RAID 5 distribuye la paridad entre todos los discos, mejorando rendimiento y fiabilidad.`,
  },
  // 2023-07_q6
  {
    id: "2023-07_q6",
    exam: "2023-07",
    topic: "buses",
    type: "text",
    points: 0.75,
    question: `Sea un computador con: sistema de memoria y bus que soporta bloques de 64 palabras de 32 bits; bus síncrono de 64 bits a 2 GHz (1 ciclo para transferencia de 64 bits o envío de dirección); tiempo de acceso a memoria para cada 4 palabras = 1 ns; transferencias y accesos solapables; bus disponible antes de cada acceso.

Calcula la latencia y el ancho de banda para la lectura de 1024 palabras.`,
    subquestions: [],
    correctAnswer: `$T_{{ciclo}} = 0,5\ ns$. 1024/64 = 16 transacciones.
1 transacción: 1 env dir + 2 acc prim 4 pal + 16×2 env/solap = 35 ciclos.
Latencia: 16×35×0,5 = 280 ns.
AB: $(1024\times4)/(280\times10^{{-9}}) = 14,63\ GB/s$.`,
    explanation: `Con bus de 64 bits y palabras de 32 bits: 2 palabras/ciclo. Acceso a memoria (1 ns = 2 ciclos) y transferencia se solapan perfectamente.`,
  },

  // 2024-01_q1
  {
    id: "2024-01_q1",
    exam: "2024-01",
    topic: "rendimiento",
    type: "text",
    points: 0.75,
    question: `M1 y M2 son dos máquinas con el mismo repertorio de instrucciones y el mismo compilador. Hay 4 clases de instrucciones (A, B, C, D). M1: 500 MHz, M2: 750 MHz.

|  Tipo | CPI M1 | CPI M2 |
| --- | --- | --- |
|  A | 1 | 2 |
|  B | 2 | 2 |
|  C | 3 | 4 |
|  D | 4 | 4 |`,
    subquestions: [
      `Si el número de instrucciones se divide equitativamente entre los tipos, ¿cuánto más rápida es M2 respecto a M1?`,
      `¿A qué frecuencia de reloj tendría M1 el mismo rendimiento que M2?`,
    ],
    correctAnswer: `a) $CPI_{{M1}} = 2,5$. $CPI_{{M2}} = 3$. $T_{{M1}} = N\times2,5/500M = N\times5\ ns$. $T_{{M2}} = N\times3/750M = N\times4\ ns$. M2 es $5/4 = 1,25$ veces más rápida.

b) $\frac{{2,5}}{{F1}} = \frac{{3}}{{750M}} \Rightarrow F1 = 625\ MHz$.`,
    explanation: `CPI medio = media aritmética (distribución equitativa). Para igualar rendimiento, se ajusta la frecuencia proporcionalmente al CPI.`,
  },
  // 2024-01_q2
  {
    id: "2024-01_q2",
    exam: "2024-01",
    topic: "memoria-virtual",
    type: "text",
    points: 2,
    question: `Considera un computador con memoria virtual paginada, TLB de 8 entradas y caché de 2 KiB ($2^{{11}}$B) asociativa por conjuntos de 4 vías con línea de 16 bytes. Espacio virtual: 512 MiB ($2^{{29}}$B). Páginas: 256 bytes ($2^8$B). Cada entrada de TP ocupa 2 bytes: 1 bit residencia + número PF.`,
    subquestions: [
      `Determina el tamaño de la memoria principal.`,
      `Razona si sería posible que el sistema utilizase traducción directa en un único nivel.`,
      `Determina si es posible que la caché sea VIPT. En caso negativo, indica qué cambiar.`,
      `Cada TP ocupa exactamente 1 página. Calcula cuántas entradas tiene cada TP y en cuántos niveles se realiza la traducción.`,
      `En la traducción de DV 0x116453C, la entrada de la TP de último nivel contiene 0xFF45. Calcula la DF resultante.`,
      `Si la TP de último nivel reside en la PF 0x4130, calcula la dirección de la entrada a consultar.`,
      `Tras esa traducción, indica qué información se almacenará en la TLB.`,
    ],
    correctAnswer: `a) Entrada 2B: 1b R + 15b PF. MP: $2^{{15}} \times 2^8 = 2^{{23}}B = 8\ MiB$.

b) $2^{{29}}/2^8 = 2^{{21}}$ PV. TP: $2^{{21}}\times2 = 4\ MiB$ (mitad de MP). Posible pero no práctico.

c) Caché: $2^{{11-4-2}} = 32$ conjuntos → índice 5b + despl 4b = 9b > Δ(8b) → NO VIPT. Reducir caché a 1 KiB o duplicar asociatividad.

d) Cada tabla: 128 entradas (7 bits). PV = 21 bits → 3 niveles.

e) 0xFF45 → R=1, PF=0x7F45. DF = 0x7F453C.

f) PV3 = 0x45. RBTP₃ = 0x413000. Dir = 0x413000 + 0x45×2 = 0x41308A.

g) TLB: PV=0x11645 | PF=0x7F45.`,
    explanation: `Con páginas de 256B y entradas de 2B: 128 entradas/tabla (7 bits), 3 niveles. VIPT no viable (índice+despl > Δ).`,
  },
  // 2024-01_q3
  {
    id: "2024-01_q3",
    exam: "2024-01",
    topic: "raid",
    type: "mc",
    points: 0.5,
    question: `Marca con una × la única respuesta correcta (correcta: +0,1; incorrecta: -0,05).`,
    options: [
      `(a) A. Es un sistema de almacenamiento que utiliza una única unidad de disco para mayor eficiencia. B. Es un tipo de disco óptico utilizado para almacenar archivos multimedia. C. Es un método para combinar múltiples discos en un solo volumen con el fin de mejorar la redundancia y/o el rendimiento.`,
      `(b) A. Utiliza una técnica de duplicación de datos para mejorar la redundancia. B. Distribuye tiras de paridad a lo largo de todos los discos para eliminar cuellos de botella. C. Emplea paridad y otro ECC para recuperarse de dos fallos de disco simultáneos.`,
      `(c) A. Discos duros (HDD) y unidades de estado sólido (SSD). B. Memoria caché y registros de la CPU. C. Memoria RAM y ROM.`,
      `(d) A. RAID 0. B. RAID 6. C. RAID 5.`,
      `(e) A. Menor coste por GByte. B. Mayor fiabilidad. C. Mayor velocidad de transferencia.`,
    ],
    subquestions: [
      `¿Cuál describe mejor un array de discos (RAID)?`,
      `¿Cuál describe mejor RAID 5?`,
      `¿Qué dispositivos son almacenamiento secundario?`,
      `¿Qué RAID permite recuperarse de dos fallos simultáneos?`,
      `¿Qué ventaja de SSD frente a HDD **no es cierta**?`,
    ],
    correctAnswer: "c,b,a,b,a",
    explanation: `(a) RAID combina múltiples discos. (b) RAID 5 distribuye paridad. (c) HDD y SSD. (d) RAID 6 soporta 2 fallos. (e) SSD NO menor coste/GB.`,
  },
  // 2024-01_q4
  {
    id: "2024-01_q4",
    exam: "2024-01",
    topic: "buses",
    type: "text",
    points: 0.75,
    question: `Sistema: bloques de 64 palabras de 64 bits; bus síncrono 128 bits a 4 GHz; acceso: 8 primeras palabras 10 ns, cada grupo adicional de 8 palabras 2 ns; transferencias y accesos solapables; sin esperas entre transacciones.

Calcula latencia y ancho de banda para lectura de 1024 palabras.`,
    subquestions: [],
    correctAnswer: `$T_{{ciclo}} = 0,25\ ns$. 1024/64 = 16 transacciones.
1 transacción (8 grupos de 8 pal): 1 env + 40 acc + 7×8 solap + 4 env = 101 ciclos.
Latencia: 16×101×0,25 = 404 ns.
AB: $(1024\times8)/(404\times10^{{-9}}) = 20,28\ GB/s$.`,
    explanation: `Acceso primer bloque (8 palabras): 40 ciclos. Subsiguientes: 8 ciclos. El solapamiento oculta parcialmente la latencia.`,
  },
  // 2024-07_q1
  {
    id: "2024-07_q1",
    exam: "2024-07",
    topic: "segmentacion",
    type: "text",
    points: 2,
    repeated: true,
    question: `Código en procesador segmentado 5 etapas (IF,ID,EX,MEM,WB). Saltos en ID con fijo no efectivo. Detección en ID, anticipación en EX. Suma FP segmentada: 3 ciclos. MEM/WB: 1 instrucción.

\`\`\`
1   addi $s0, $0, 4
   Loop:
2   lwc1 $f1, 0($a1)
3   add.s $f2, $f1, $f2
4   addi $a1, $a1, 4
5   addi $s0, $s0, -1
6   bne $s0, $0, Loop
   End:
7   swc1 $f2, 0($a2)
\`\`\``,
    subquestions: [
      `Muestra el diagrama multiciclo para la primera iteración, marcando anticipaciones y bloqueos.`,
      `Indica dos dependencias verdaderas y una antidependencia dentro del bucle.`,
      `Identifica sobre el diagrama un riesgo estructural y un riesgo de control.`,
      `Con predictor de saltos dinámico de 1-bit, ¿cuántas veces se predeciría correctamente?`,
      `Si se emplease salto retardado, razona sobre usar la instrucción 5.`,
      `Razona qué señales (MemRead, MemWrite, RegWrite, Mem2Reg, Branch, IF_flush) están activas en el ciclo 5.`,
    ],
    correctAnswer: `a) La instr 3 sufre 1 ciclo de bloqueo esperando $f1 desde MEM. La instr 5 se bloquea 1 ciclo por RAW con 6.

b) Verdaderas: 2→3 ($f1), 5→6 ($s0). Antidependencia: 2→4 ($a1).

c) Estructural: ciclo 10 (MEM ocupada por 3 y 4). Control: ciclo 13 (bne en ID, IF de 7 especulativa).

d) 4 iteraciones, 1-bit inicial no efectivo: fallo, acierto, acierto, fallo → 2 aciertos.

e) Posible desde destino de salto: replicar instr 5 o modificar instr 1 a $s0=3. Al terminar $s0=-1.

f) Ciclo 5: WB de addi (RegWrite), MEM de lwc1 (MemRead).`,
    explanation: `Latencia FP 3 ciclos añade bloqueos. Predictor 1-bit acierta 2/4. Ciclo 5: WB addi + MEM lwc1.`,
  },
  // 2024-07_q2
  {
    id: "2024-07_q2",
    exam: "2024-07",
    topic: "cache",
    type: "text",
    points: 2,
    repeated: true,
    question: `MP 1 MiB, caché asociativa 2 vías, 512 B, línea 16 B, LRU. Write-back, write-allocate. A[32][64] desde 0x0A000, int=4B. Escalares en registros.

\`\`\`
int i, j, A[32][64];
for (i = 0; i < 2; i++)
    for (j = 0; j < 2; j++)
        A[j+1][i*2] = A[j][0]
\`\`\``,
    subquestions: [
      `Calcula A[i][j] en función de i y j.`,
      `Partición en campos de una DF para caché.`,
      `Rellena tabla de accesos: dirección, etiqueta, índice (hex); acierto/fallo; tipo; escritura MP.`,
      `Con TMA=43 ciclos y t_acierto=1, calcula tiempo acceso MP.`,
      `Discute: i) Caché víctima reduce tasa fallos y TMA. ii) L2 doble tamaño → sin escrituras a MP. iii) Write-through → sin fallos de conflicto.`,
    ],
    correctAnswer: `a) A[i][j] = 0x0A000 + 0x100i + 0x4j.

b) Despl 4b, #conj=16 (índice 4b), Etiqueta 12b.

c) 8 accesos al conjunto 0. Hay 6 fallos (3 forzosos, 3 conflicto), 2 aciertos. 2 escrituras a MP (write-back al reemplazar modificadas).

d) $43 = 1 + (6/8)TMP \Rightarrow TMP = 56$ ciclos.

e) i. FALSO: víctima reduce TMA pero NO tasa de fallos. ii. VERDADERO: índice L2 tiene 1 bit más → sin conflictos. iii. FALSO: write-through no evita conflictos.`,
    explanation: `Con 2 vías y todo en conjunto 0, hay conflictos. Write-back escribe a MP al reemplazar líneas modificadas.`,
  },
  // 2024-07_q3
  {
    id: "2024-07_q3",
    exam: "2024-07",
    topic: "rendimiento",
    type: "text",
    points: 0.75,
    question: `Programa: $10^9$ instr, 1,4 s. 30% sumas doble precisión (4 ciclos), 10% E/S (10 ciclos), resto enteras (1 ciclo).`,
    subquestions: [
      `Calcula el CPI.`,
      `Calcula FLOPS.`,
      `Calcula frecuencia de reloj.`,
      `Aceleración 2,5× en E/S. ¿Cuánto más rápido?`,
      `Benchmark SPEC: 1,3, 1,1, 1,6 s. Referencia: 24 s. Calcula ratio SPEC.`,
    ],
    correctAnswer: `a) $CPI = 0,3\times4 + 0,1\times10 + 0,6\times1 = 2,8$.

b) $FLOPS = 0,3\times10^9/1,4 = 214\ MFLOPS$.

c) $f = 2,8\times10^9/1,4 = 2\ GHz$.

d) $F_m = 10/(12+10+6) = 0,357$. $A = 1/(1-0,357+0,357/2,5) = 1,27$.

e) Mediana: 1,3 s. Ratio = $24/1,3 = 18,46$.`,
    explanation: `CPI ponderado. FLOPS solo FP. Amdahl sobre E/S (35,7%). SPEC usa mediana.`,
  },
  // 2024-07_q4
  {
    id: "2024-07_q4",
    exam: "2024-07",
    topic: "memoria-virtual",
    type: "text",
    points: 2,
    question: `Computador con 1 GiB ($2^{{30}}$B) MP, memoria virtual paginada en 2 niveles. Páginas 4 KiB ($2^{{12}}$B). Cada TP ocupa 1 página. Entrada: 1b R + 1b mod + 12b control + PF.`,
    subquestions: [
      `Determina el tamaño del espacio virtual.`,
      `Traducción DV 0x0116453C: entrada último nivel = 0x90431F45. ¿Válida? Calcula DF.`,
      `TLB: PV 0x44510→PF 0x1F34C, PV 0xD178C→0x2ABD0, PV 0x44511→0x0A1B3, PV 0x3A022→0x1BD42. Indica DV traducible y DF.`,
      `Describe una utilidad de la memoria virtual.`,
      `Ventaja e inconveniente de caché virtual frente a física.`,
    ],
    correctAnswer: `a) DF 30b: Δ=12b + PF=18b. Entrada 32b=4B. Cada TP: $2^{{12}}/4=2^{{10}}$ entradas. DV: PV1(10)+PV2(10)+Δ(12)=32b. Espacio virtual = $2^{{32}}=4\ GiB$.

b) Δ=0x53C. Entrada=0x90431F45 → R=1. PF=0x31F45. DF=0x31F4553C.

c) Primera entrada con Δ=0: DV 0x44510000 → DF 0x1F34C000.

d) Ejecutar programas > MP; aislamiento de procesos; múltiples programas.

e) Ventaja: acceso a caché sin traducción previa. Inconveniente: necesita mecanismos de seguridad entre procesos.`,
    explanation: `Con páginas 4 KiB y entradas 4B: 1024 entradas/tabla (10 bits). Espacio virtual 32 bits = 4 GiB.`,
  },
  // 2024-07_q5
  {
    id: "2024-07_q5",
    exam: "2024-07",
    topic: "raid",
    type: "text",
    points: 0.5,
    repeated: true,
    question: `Completa correctamente las siguientes afirmaciones:`,
    subquestions: [
      `Con discos de 1 TiB y capacidad neta 8 TiB, un RAID 6 tendrá capacidad total de __ TiB.`,
      `Ventajas SSD vs HDD: más __ y más __.`,
      `HDD y SSD forman parte del nivel de memoria __.`,
      `RAID 4 y 5 son similares, pero RAID 5 no tiene __ en el acceso a la paridad.`,
      `Al implementar RAID, discos de distinta __ para mayor fiabilidad.`,
    ],
    correctAnswer: `a) 10 TiB. b) rápidos, silenciosos. c) secundaria. d) cuello de botella. e) serie de fabricación.`,
    explanation: `RAID 6: 8 TiB datos + 2 TiB paridad. SSD sin partes mecánicas. RAID 5 distribuye paridad.`,
  },
  // 2024-07_q6
  {
    id: "2024-07_q6",
    exam: "2024-07",
    topic: "buses",
    type: "text",
    points: 0.75,
    question: `Sistema: páginas 4 KiB, bus síncrono 64 bits a 50 MHz. DMA: transacciones de 128 palabras (8B/p). 1ª palabra: 300 ns, resto: 150 ns. Envío/dirección: 1 ciclo. Transferencias solapables. Entre transacciones: 2 ciclos de espera.

Calcula latencia y ancho de banda para lectura de una página.`,
    subquestions: [],
    correctAnswer: `$T_{{ciclo}} = 20\ ns$. 4 KiB/8B = 512 palabras. 512/128 = 4 transacciones.
1 transacción: 20 + 300 + 127×150 + 20 = 19390 ns.
Esperas: 3×40 = 120 ns.
Latencia: 4×19390+120 = 77680 ns ≈ 77,7 μs.
AB: $4\ KiB/77680ns \approx 52,7\ MB/s$.`,
    explanation: `Primera palabra: 300 ns, resto 150 ns. Con 127 adicionales domina lectura. DMA: 4 transacciones/página.`,
  },
  // 2025-01_q1
  {
    id: "2025-01_q1",
    exam: "2025-01",
    topic: "rendimiento",
    type: "text",
    points: 0.75,
    repeated: true,
    question: `M1 y M2 son dos máquinas con el mismo repertorio de instrucciones y el mismo compilador. Hay 5 clases de instrucciones (A, B, C, D y E). M1: 5 GHz, M2: 4.5 GHz.

|  Tipo | CPI M1 | CPI M2 | Frecuencia (%) |
| --- | --- | --- | --- |
|  A | 1.0 | 0.8 | 10 |
|  B | 2.5 | 2.0 | 15 |
|  C | 1.2 | 1.0 | 30 |
|  D | 3.0 | 2.5 | 25 |
|  E | 2.0 | 1.8 | 20 |`,
    subquestions: [
      `¿Qué máquina es más rápida y por cuánto?`,
      `Si A y C son instrucciones FP, determina los GFLOPS de M2 durante la ejecución del programa.`,
      `¿Cuánto necesitaríamos mejorar el coprocesador FP de la máquina más lenta para que igualase el rendimiento de la más rápida?`,
    ],
    correctAnswer: `a) $CPI_{{M1}} = 0,1\times1 + 0,15\times2,5 + 0,3\times1,2 + 0,25\times3 + 0,2\times2 = 1,985$.
$CPI_{{M2}} = 0,1\times0,8 + 0,15\times2 + 0,3\times1 + 0,25\times2,5 + 0,2\times1,8 = 1,665$.
M2 es $\frac{{1,985\times4,5}}{{1,665\times5}} = 1,073$ veces más rápida.

b) $GIPS_{{M2}} = 4,5/1,665 = 2,70$. $GFLOPS_{{M2}} = 40\%\times2,70 = 1,08\ GFLOPS$.

c) $f_{{M1,flops}} = (0,1\times1 + 0,3\times1,2)/1,985 = 23,2\%$.
Amdahl: $1,073 = \frac{{1}}{{0,768 + 0,232/x}} \Rightarrow x = 1,415$. Mejorar FP 41,5%.`,
    explanation: `CPI ponderado por frecuencia de aparición. M2 gana por menor CPI pese a menor frecuencia. Amdahl sobre la fracción FP (23,2%) requiere acelerar FP 41,5%.`,
  },
  // 2025-01_q2
  {
    id: "2025-01_q2",
    exam: "2025-01",
    topic: "memoria-virtual",
    type: "text",
    points: 2,
    question: `Computador con memoria virtual paginada: páginas 4 KiB ($2^{{12}}$), traducción en 2 niveles. Espacio virtual: 16 GiB ($2^{{34}}$). Espacio físico: 64 MiB ($2^{{26}}$). Cada TP ocupa exactamente una página. Cada entrada: bit de validez + bit de modificación + número PF. TLB de 4 entradas.

Contenido de TLB, TP₁ (residente en PF 0x3000) y TP₂:

|  TLB PV | TLB PF | TP₁ Entrada | TP₁ Contenido | TP₂ Dirección | TP₂ Contenido |
| 004FC4 | 13A1 | ... | ... | ... | ... |
| 354043 | 0354 | 6A7 | 0354 | [1BC0086] | 8FC4 |
| 354044 | 2BC0 | 6A8 | 9BC0 | [1BC0088] | ABC0 |
| 2BC004 | 23A1 | 6A9 | 9BC1 | [1BC008A] | DFAB |`,
    subquestions: [
      `Indica cómo se divide y cuántos bits tiene cada campo de las direcciones virtuales y físicas.`,
      `Dadas las DV 0x2BC004354 y 0x354045ADA, realiza la traducción a DF. Para TP₁ se indica el número de entrada, para TP₂ la dirección.`,
      `En la TLB y en TP₁ hay una entrada con valor 0x0354. Razona si es posible que ambas tengan ese mismo valor y sea correcto.`,
      `Con caché L1 de 32 KiB y línea 16 Bytes, determina la asociatividad mínima para VIPT.`,
      `Si la traducción se hiciese en 3 niveles en lugar de 2 (mismo tamaño de página), ¿las TP de un proceso necesitarían más o menos memoria física? Razona con el concepto de fragmentación.`,
      `Si se ejecutan 4 procesos simultáneamente, indica qué cantidad de memoria virtual y física está disponible para cada uno.`,
    ],
    correctAnswer: `a) DV (34b): PV=22b, Δ=12b. PV1=11b, PV2=11b. DF (26b): PF=14b, Δ=12b.

b) 0x2BC004354: PV=0x2BC004 está en TLB → PF=0x23A1. DF=0x23A1354.
0x354045ADA: PV₁=0x6A8, PV₂=0x045. TP₁[0x6A8]=0x9BC0 → R=1, RBTP₂=0x1BC0.
Dir entrada TP₂ = 0x1BC0000 + 0x045×2 = 0x1BC008A. Contenido=0xDFAB → R=1, PF=0x1FAB. DF=0x1FABADA.

c) Sí es correcto. En TLB, 0x0354 es PF. En TP₁[0x6A7]=0x0354, R=0 → entrada no válida, resto de bits no significativos. Coincidencia casual.

d) 32 KiB, línea 16B → despl 4b. Correspondencia directa: índice 11b. Índice+despl=15 > Δ(12). Para índice ≤ 8b: asociatividad mínima $2^{{11-8}} = 8$ vías.

e) MÁS memoria. Actualmente cada tabla ocupa 1 página (4 KiB). Con 3 niveles hay más tablas, más pequeñas, pero cada una ocupa 1 página → más fragmentación interna → más espacio total.

f) Cada proceso: 16 GiB de espacio virtual independiente. Los 64 MiB de espacio físico se comparten según necesidad.`,
    explanation: `Con 34 bits DV y páginas 4 KiB (Δ=12): 22 bits PV en 11+11. Para VIPT, índice+despl ≤ 12 → con línea 16B (despl=4), índice ≤ 8 → mínimo 8 vías.`,
  },
  // 2025-01_q3
  {
    id: "2025-01_q3",
    exam: "2025-01",
    topic: "buses",
    type: "text",
    points: 0.75,
    question: `Computador con: palabras de 64 bits; sistema que soporta bloques de hasta 16 palabras; bus síncrono de 128 bits a 100 MHz (1 ciclo para transferencia o dirección); acceso: 4 primeras palabras 80 ns, cada grupo adicional de 4 palabras 30 ns; transferencias y accesos solapables; sin esperas entre transacciones; páginas de memoria virtual de 1 KiB.

Calcula latencia y ancho de banda para la lectura de una página.`,
    subquestions: [],
    correctAnswer: `$T_{{ciclo}} = 10\ ns$. 1 KiB/128B = 8 transacciones.
1 transacción (16 pal = 4 grupos de 4): 1 env + 8 acc + 3×3 solap + 2 env = 20 ciclos.
Latencia: 8×20×10 = 1600 ns = 1,6 μs.
AB: $1\ KiB/1,6\mu s = 640\ MB/s$.`,
    explanation: `Páginas de 1 KiB, transacciones de 16 palabras (128 B) → 8 transacciones. Acceso primer grupo: 80 ns (8 ciclos); subsiguientes: 30 ns (3 ciclos).`,
  },
  // 2025-01_q4
  {
    id: "2025-01_q4",
    exam: "2025-01",
    topic: "raid",
    type: "text",
    points: 0.5,
    repeated: true,
    question: `Contesta las siguientes preguntas:`,
    subquestions: [
      `RAID 1+0 con discos de 1 TiB y capacidad neta 5 TiB. Se reconfigura a RAID 6 aprovechando todos los discos. ¿Cuál sería la nueva capacidad neta?`,
      `Indica dos ventajas de los SSD frente a los HDD.`,
    ],
    correctAnswer: `a) RAID 1+0 de 5 TiB netos → 10 discos de 1 TiB. RAID 6 con 10 discos: 2 para redundancia → 8 TiB netos.

b) Mayor velocidad de transferencia, menor latencia, tiempo de acceso uniforme, menor consumo, más silenciosos, menor tamaño/peso, mayor fiabilidad (sin partes mecánicas).`,
    explanation: `RAID 1+0 duplica datos (50% eficiencia). RAID 6 usa doble paridad, mucho más eficiente. SSD superan a HDD en casi todo excepto capacidad y coste/GB.`,
  },
  // 2025-07_q1
  {
    id: "2025-07_q1",
    exam: "2025-07",
    topic: "rendimiento",
    type: "text",
    points: 0.75,
    repeated: true,
    question: `Un programa consta de $10^9$ instrucciones. El 60% son operaciones FP que tardan 10 ciclos, las restantes 5 ciclos. Se ejecuta en S1 (multiciclo a 2 GHz) y S2 (segmentado a 500 MHz). En S2 el programa tarda 3 segundos.`,
    subquestions: [
      `Calcula el CPI de S1 y S2.`,
      `Calcula el rendimiento de S1 según FLOPS.`,
      `Usando Amdahl, determina en qué proporción debe mejorarse la unidad FP de S1 para igualar el tiempo de S2.`,
    ],
    correctAnswer: `a) $CPI_{{S1}} = (0,6\times10 + 0,4\times5) = 8$. $CPI_{{S2}} = 3\times0,5G/1G = 1,5$.

b) $T_{{S1}} = 8G/2G = 4\ s$. $FLOPS = 0,6G/4 = 150\ MFLOPS$.

c) $A = 4/3$. $f_m = 6/8 = 3/4$. $4/3 = 1/(1-3/4 + (3/4)/A_m) \Rightarrow A_m = 1,5$. Mejorar FP 50%.`,
    explanation: `S1 multiciclo (CPI=8). S2 segmentado (CPI=1,5). Amdahl sobre fracción FP (75% del tiempo): mejorar FP en factor 1,5 para igualar a S2.`,
  },
  // 2025-07_q2
  {
    id: "2025-07_q2",
    exam: "2025-07",
    topic: "memoria-virtual",
    type: "text",
    points: 2,
    question: `Computador con 32 KiB ($2^{{15}}$B) MP y 1 MiB ($2^{{20}}$B) memoria virtual paginada en 2 niveles. 128 páginas físicas ($2^7$). Cada TP ocupa exactamente 1 página. Cada entrada: 1b R + 1b mod + 23b control + PF.`,
    subquestions: [
      `Indica en qué campos y con qué valores (hex) se dividen DV 0x5D392 y DF 0x72B4.`,
      `Calcula cuánto ocuparían todas las TP de nivel 2 de un proceso.`,
      `Traduce las siguientes DV (se indica contenido de TP₁ y TP₂):
|  DV | TP1 | TP2 | DF |
| 905D7 | 8341 1C00 | 6529 AC32 | |
| 72A42 | 9B21 6B30 | C2A8 04A5 | |
| C3B12 | D281 6A03 | 8A21 BC52 | |`,
      `Para 0x905D7, determina la dirección de la entrada en TP₂.`,
      `Con 256 KiB de memoria virtual (10 bits PV, 8 bits Δ), determina la partición más eficiente de PV en 2 niveles.`,
    ],
    correctAnswer: `a) $2^{{15}}/2^7 = 2^8$ B/página. Entrada: 1+1+23+7=32b=4B. Cada TP: $2^8/4=64$ entradas (6b).
DV 20b: PV1=6b | PV2=6b | Δ=8b. DF 15b: PF=7b | Δ=8b.
0x5D392: PV1=0x17 | PV2=0x13 | Δ=0x92. 0x72B4: PF=0x72 | Δ=0xB4.

b) 1 TP₁ + 64 TP₂ × 256 B = 16 KiB.

c) 0x905D7: TP₁ R=1, PF(TP₂)=0x41C00. Dir entrada TP₂ = 0x41C0000+0x5×4. TP₂ R=0 → NO posible.
0x72A42: TP₁ R=1, PF(TP₂)=0x16B30. TP₂ R=1, PF=0x04A5 → DF=0x2542.
0xC3B12: TP₁ R=1, PF(TP₂)=0x16A03. TP₂ R=1, PF=0xBC52 → DF=0x5212.

d) TP₂ en PF 0. Entrada 5. Dir = 0 + 5×4 = 0x0014.

e) PV1=4b, PV2=6b. 16 TP₂ de 64 entradas cada una (completamente llenas, sin fragmentación interna). Total: 16×256B = 4 KiB.`,
    explanation: `Páginas de 256B, PV 10 bits → óptimo 4+6 para minimizar tablas de nivel 2 manteniéndolas llenas.`,
  },
  // 2025-07_q3
  {
    id: "2025-07_q3",
    exam: "2025-07",
    topic: "raid",
    type: "text",
    points: 0.5,
    repeated: true,
    question: `Tenemos discos de 2 TiB y queremos RAID con capacidad neta de 10 TiB. Razona la capacidad total de RAID 5 y RAID 6. Indica dos características comunes y una diferencia.`,
    subquestions: [],
    correctAnswer: `RAID 5: 1 disco paridad → 6 discos = 12 TiB totales.
RAID 6: 2 discos paridad → 7 discos = 14 TiB totales.

Características comunes: striping de datos, reparto cíclico de redundancia, E/S concurrentes.
Diferencia: RAID 5 usa 1 función de redundancia (tolera 1 fallo), RAID 6 usa 2 (tolera 2 fallos).`,
    explanation: `10 TiB netos con discos de 2 TiB → 5 discos datos. RAID 5: +1 paridad (6 discos, 12 TiB). RAID 6: +2 paridad (7 discos, 14 TiB).`,
  },
  // 2025-07_q4
  {
    id: "2025-07_q4",
    exam: "2025-07",
    topic: "buses",
    type: "text",
    points: 0.75,
    question: `Sistema con páginas de 1 KiB, bus síncrono de 128 bits a 1 GHz. DMA en bloques del ancho del bus: primer bloque 300 ns, resto 10 ns. Una transacción por página. Envío de 128 bits o dirección: 1 ciclo. Transferencias solapables con lecturas. Al finalizar, CPU atiende interrupción: 17 instrucciones, 4 ciclos cada una, CPU a 1 GHz.

Calcula latencia y ancho de banda para lectura de una página.`,
    subquestions: [],
    correctAnswer: `$T_{{ciclo}} = 1\ ns$. Página 1 KiB/16B = 64 transferencias.
Lectura: 1 env + 300 1er bloque + 63×10 + 1 env últ + 17×4 rutina = 1+300+630+1+68 = 1000 ns.
AB: $1\ KiB/1000ns = 1\ GB/s$.`,
    explanation: `DMA lee página completa en una transacción de 64 bloques de 16B. Primer bloque 300 ns, resto 10 ns. Rutina de interrupción añade 68 ns.`,
  },
  // 2025-07_q5
  {
    id: "2025-07_q5",
    exam: "2025-07",
    topic: "segmentacion",
    type: "text",
    points: 2,
    repeated: true,
    question: `Código en procesador segmentado 5 etapas. Saltos en ID con fijo no efectivo. Detección en ID, anticipación en EX. Suma FP segmentada: 3 ciclos. MEM/WB: 1 instrucción.

\`\`\`
1   addi $t4, $0, 10
   Loop:
2   lw $a1, 0($a0)
3   add $t0, $a1, $t4
4   sw $t0, 0($a0)
5   addi $t4, $t4, -1
6   addi $a0, $a0, 4
7   bne $t4, $0, Loop
8   sw $t0, 0($a0)
\`\`\``,
    subquestions: [
      `Muestra el diagrama multiciclo para la primera iteración.`,
      `Indica dos dependencias verdaderas y una antidependencia en el bucle.`,
      `¿Cuáles de estas dependencias generan un riesgo? ¿De qué tipo?`,
      `Discute: "Si el procesador implementase salto retardado, se puede eliminar la instr 4 y el array tendrá los mismos valores desplazados una posición."`,
      `Calcula la tasa de acierto del predictor: salto fijo no efectivo, predictor 1 bit, predictor 2 bits (predicción inicial no efectivo).`,
      `Razona qué señales (MemRead, MemWrite, RegWrite, Mem2Reg, Branch, IF_flush) están activas en el ciclo 8.`,
    ],
    correctAnswer: `a) La instr 3 sufre 1 ciclo de bloqueo (RAW, esperando $a1 desde MEM de instr 2). La instr 4 se bloquea 1 ciclo (RAW, $t0).

b) Verdaderas: $a1 entre 3 y 2; $t0 entre 4 y 3. Antidependencia: $t4 entre 5 y 3.

c) La dependencia 3→2 genera riesgo RAW (leer $a1 de MEM para anticipar a EX de instr 3).

d) FALSO. La instr 8 del hueco de retardo sobreescribiría en cada iteración el valor que leerá la instr 2 en la siguiente iteración.

e) 10 iteraciones. Fijo no efectivo: TA=1/10. Predictor 1 bit: TA=8/10. Predictor 2 bits: TA=7/10.

f) Ciclo 8: WB de add (RegWrite), MEM de sw (MemWrite).`,
    explanation: `Similar al 2022-01_q1. El riesgo RAW entre lw y add provoca 1 ciclo de bloqueo. Predictor 1 bit acierta 8/10. Ciclo 8: WB add + MEM sw.`,
  },
  // 2025-07_q6
  {
    id: "2025-07_q6",
    exam: "2025-07",
    topic: "cache",
    type: "text",
    points: 2,
    repeated: true,
    question: `Computador con MP de 256 KiB y caché de correspondencia directa de 1024 B con líneas de 4 bytes. Write-back y write-allocate. Matriz A[7][1024] desde 0x06000, int=4B. Escalares en registros.

\`\`\`
int i, j, A[7][1024];
for (i = 1; i <= 2; i++)
    for (j = 1; j <= 2; j++)
        A[j][i] = A[0][1024 - j]
\`\`\``,
    subquestions: [
      `Calcula A[j][i] en función de j e i.`,
      `Partición de una DF para la caché.`,
      `Rellena tabla de accesos: dirección, etiqueta, índice (hex); acierto/fallo; tipo; escritura MP.`,
      `Con TMA=43 ciclos y t_acierto=1, calcula tiempo acceso MP.`,
      `Discute: i) En esta caché se podría solapar comprobación de etiqueta con transmisión de datos. ii) Solo los fallos de conflicto provocan escrituras a MP.`,
    ],
    correctAnswer: `a) A[j][i] = 0x06000 + 0x1000j + 0x4i.

b) Caché 1024B, línea 4B, correspondencia directa: Despl 2b, #líneas=256 (índice 8b), Etiqueta 8b.

c) 8 accesos. Direcciones: 06FFC, 07004, 06FF8, 08004, 06FFC, 07008, 06FF8, 08008. Hay 6 fallos (4 forzosos, 2 conflicto), 2 aciertos. 2 escrituras a MP (write-back al reemplazar modificadas).

d) $43 = 1 + (6/8)TMP \Rightarrow TMP = 56$ ciclos.

e) i. VERDADERO: en correspondencia directa, los datos solo pueden proceder de la única línea del conjunto → se puede iniciar transmisión mientras se comprueba etiqueta.
ii. FALSO: cualquier fallo (forzoso, capacidad o conflicto) que expulse una línea modificada provocará escritura a MP.`,
    explanation: `Correspondencia directa con líneas de 4B: 256 conjuntos (8 bits índice). Write-back escribe a MP al reemplazar líneas modificadas.`,
  },
  // 2026-01_q1
  {
    id: "2026-01_q1",
    exam: "2026-01",
    topic: "rendimiento",
    type: "text",
    points: 0.75,
    question: `El Intel Xeon 6980P tiene 128 núcleos a 2 GHz. Cada núcleo: 2 unidades FP de 512 bits. Cada instrucción FP: 16 flops doble precisión/ciclo o 32 flops simple precisión/ciclo.`,
    subquestions: [
      `¿Cuál es el rendimiento máximo en GFLOPS por núcleo en doble precisión? ¿Y del procesador completo?`,
      `Benchmark SPEC en doble precisión: 40% del tiempo en flops, rendimiento 32 GFLOPS. Se cambia a simple precisión (32 flops/ciclo). ¿Qué rendimiento se espera?`,
      `Por cada instr FP (doble precisión) hay 2 instr de soporte. Con 32 GFLOPS y 16 flops/instr FP, ¿cuál es el IPC?`,
    ],
    correctAnswer: `a) $GFLOPS_{{core}} = 2\times16\times2 = 64\ GFLOPS$. $GFLOPS_{{proc}} = 128\times64 = 8192\ GFLOPS$.

b) $f_m = 0,4$. $A_m = 32/16 = 2$. $A = 1/(0,6 + 0,4/2) = 1,25$. $GFLOPS_{{sp}} = 32\times1,25 = 40\ GFLOPS$.

c) $32G/16 = 2\ Ginst_{{FP}}/s$. $2\times3 = 6\ Ginst/s$. $IPC = 6/2 = 3$.`,
    explanation: `Rendimiento pico: 64 GFLOPS/núcleo. Amdahl al duplicar flops/instr en fracción FP (40%): aceleración 1,25×. IPC = instr totales/s / frecuencia.`,
  },
  // 2026-01_q2
  {
    id: "2026-01_q2",
    exam: "2026-01",
    topic: "memoria-virtual",
    type: "text",
    points: 2,
    question: `Computador con 16 MiB ($2^{{24}}$) MP. Memoria virtual paginada con direcciones de 26 bits, traducción en 2 niveles. Páginas de 256B. TP₁ ocupa exactamente 1 página. Cada entrada: 32 bits (1b R + control + PF).

DV 0x13020A8 se traduce a DF 0x8420A8. TP₁ en PF 0x14A7. RBTP₂ = 0xBD8000.`,
    subquestions: [
      `Indica cómo se divide y qué valor tiene cada campo de DV y DF.`,
      `Con bits de control = 0, determina el valor de las entradas de TP que permiten la traducción.`,
      `Calcula la dirección física de la entrada en TP₂.`,
      `Calcula cuánto ocupan las TP necesarias para esta traducción (en potencias de 2).`,
      `Con caché L1 asociativa 16 vías, línea 32B, ¿qué tamaño máximo para VIPT?`,
      `Indica ventaja e inconveniente de incrementar el tamaño de página según fragmentación y localidad.`,
      `Describe qué ocurre cuando el bit de residencia en TP₂ está inactivo durante una traducción.`,
    ],
    correctAnswer: `a) TP₁: $2^8/4 = 2^6$ entradas → PV1=6b. DV(26b): PV1=6b | PV2=12b | Δ=8b. DF(24b): PF=16b | Δ=8b.
0x13020A8: PV1=0x13 | PV2=0x020 | Δ=0xA8. 0x8420A8: PF=0x8420 | Δ=0xA8.

b) TP₁: R=1, control=0, PF(TP₂)=0xBD80 → 0x8000BD80.
TP₂: R=1, control=0, PF=0x8420 → 0x80008420.

c) DirE2 = 0xBD8000 + 0x020×4 = 0xBD8080.

d) TP₁: $2^6\times4 = 2^8$ B. TP₂: $2^{{12}}\times4 = 2^{{14}}$ B. Total: $2^8 + 2^{{14}}$ B.

e) Δ=8b. Despl línea 32B=5b. Índice máx=3b. $2^3\times16\times2^5 = 2^{{12}} = 4\ KiB$ máximo.

f) Ventaja: mejora localidad espacial (más datos contiguos por página). Inconveniente: aumenta fragmentación interna (más espacio desaprovechado por página).

g) Fallo de página: el SO transfiere los datos desde almacenamiento secundario a una PF (swap), actualiza la TP y reanuda la traducción.`,
    explanation: `Páginas 256B, TP₁=1 página: PV1=6b, PV2=12b, Δ=8b. VIPT: índice+despl ≤ 8; con línea 32B (despl=5), índice ≤ 3 → máximo 4 KiB.`,
  },
  // 2026-01_q3
  {
    id: "2026-01_q3",
    exam: "2026-01",
    topic: "buses",
    type: "text",
    points: 0.75,
    question: `DMA que gestiona transferencia de páginas entre disco y memoria. Palabras de 64 bits. Sistema soporta bloques de hasta 32 palabras. Bus síncrono de 64 bits a 500 MHz (1 ciclo para transferencia o dirección). Acceso: 8 primeras palabras 62 ns, cada grupo adicional de 8 palabras 40 ns. Transferencias y accesos solapables. DMA por ráfagas: 40 ciclos libres entre transacciones. Páginas de memoria virtual de 4 KiB.`,
    subquestions: [
      `Número de ciclos necesarios para cada transacción.`,
      `Número de transacciones para transferir una página completa.`,
      `Latencia para la transferencia de una página (en ns).`,
      `Ancho de banda del sistema (MB/s aproximado).`,
    ],
    correctAnswer: `a) $T_{{ciclo}} = 2\ ns$. 1 transacción (32 pal = 4 grupos de 8): 1 env + 31 acc + 3×20 solap + 8 env = 100 ciclos.

b) Transacción = 32×8 = 256 B. 4 KiB/256 = 16 transacciones.

c) Esperas: 15×40×2 = 1200 ns. Transferencia: 16×100×2 = 3200 ns. Latencia: 3200+1200 = 4400 ns = 4,4 μs.

d) $AB = 4\ KiB/4,4\mu s \approx 900\ MB/s$.`,
    explanation: `DMA por ráfagas con 40 ciclos (80 ns) entre transacciones. Acceso primer grupo 62 ns (31 ciclos), siguientes 40 ns (20 ciclos). 16 transacciones + 15 esperas.`,
  },
  // 2026-01_q4
  {
    id: "2026-01_q4",
    exam: "2026-01",
    topic: "raid",
    type: "mc",
    points: 0.5,
    repeated: true,
    question: `Marca con una × la única respuesta correcta (correcta: +0,1; cada dos incorrectas: -0,1).`,
    options: [
      `(a) A. Superficie magnetizable. B. Memoria flash. C. Memoria óptica.`,
      `(b) A. Mayor capacidad. B. Menor coste por GB. C. Mayor velocidad y ausencia de partes mecánicas.`,
      `(c) A. Redundant Array of Independent Disks. B. Random Access of Integrated Devices. C. Reliable Architecture for Input Data.`,
      `(d) A. Con códigos Hamming. B. Con paridad distribuida. C. Con duplicación completa de los datos en discos espejo.`,
      `(e) A. RAID 3. B. RAID 6. C. RAID 5.`,
    ],
    subquestions: [
      `¿Cuál es la tecnología base de un disco duro (HDD)?`,
      `¿Cuál es una ventaja principal de los SSD frente a los HDD?`,
      `¿Qué significa RAID?`,
      `¿Cómo se logra la redundancia en RAID 1?`,
      `¿Qué nivel RAID permite recuperarse de dos fallos simultáneos?`,
    ],
    correctAnswer: "a,c,a,c,b",
    explanation: `(a) HDD: superficie magnetizable. (b) SSD: mayor velocidad y sin partes mecánicas. (c) RAID = Redundant Array of Independent Disks. (d) RAID 1: mirroring (duplicación completa). (e) RAID 6 tolera 2 fallos simultáneos.`,
  },
];
