import type { Question } from "../../data/types";
import type { Picture } from "vite-imagetools";
import { getImage } from "../../lib/image";
import type { ImageMap } from "../../lib/image";

const imageMap = import.meta.glob<{ default: Picture }>(
  "./assets/*.{png,jpeg,jpg}",
  { query: { w: "400;800;1200", format: "avif;webp;png", as: "picture" }, eager: true }
) as ImageMap;

export const questions: Question[] = [
  // ================================================================
  // 2019-07 (Julio 2019 — Convocatoria extraordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2019-07_q1",
    exam: "2019-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `El siguiente código implementa el esquema clásico de productores/consumidores con un buffer acotado de tamaño N usando \`pthread_cond_broadcast\` para despertar a los hilos bloqueados:

\`\`\`c
struct buffer {
  int data[N];
  int count;
  int in, out;
  pthread_mutex_t m;
  pthread_cond_t c;
};

void put(struct buffer *b, int item) {
  pthread_mutex_lock(&b->m);
  while (b->count == N)
    pthread_cond_wait(&b->c, &b->m);
  b->data[b->in] = item;
  b->in = (b->in + 1) % N;
  b->count++;
  pthread_cond_broadcast(&b->c);
  pthread_mutex_unlock(&b->m);
}

int get(struct buffer *b) {
  int item;
  pthread_mutex_lock(&b->m);
  while (b->count == 0)
    pthread_cond_wait(&b->c, &b->m);
  item = b->data[b->out];
  b->out = (b->out + 1) % N;
  b->count--;
  pthread_cond_broadcast(&b->c);
  pthread_mutex_unlock(&b->m);
  return item;
}
\`\`\`

Modifique la implementación para usar \`pthread_cond_signal\` en lugar de \`pthread_cond_broadcast\`, minimizando el número de wakeups. Explique qué cambios son necesarios y por qué su solución es correcta.

Pthread API disponible:

\`\`\`c
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_trylock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `Se necesita usar **dos variables de condición separadas**: una para productores y otra para consumidores. Un productor bloqueado solo necesita ser despertado cuando un consumidor libera espacio (buffer lleno → no lleno). Un consumidor bloqueado solo necesita ser despertado cuando un productor añade un elemento (buffer vacío → no vacío). Con \`signal()\` se despierta exactamente un hilo del tipo adecuado.

\`\`\`c
struct buffer {
  int data[N];
  int count;
  int in, out;
  pthread_mutex_t m;
  pthread_cond_t not_full;
  pthread_cond_t not_empty;
};

void put(struct buffer *b, int item) {
  pthread_mutex_lock(&b->m);
  while (b->count == N)
    pthread_cond_wait(&b->not_full, &b->m);
  b->data[b->in] = item;
  b->in = (b->in + 1) % N;
  b->count++;
  pthread_cond_signal(&b->not_empty);
  pthread_mutex_unlock(&b->m);
}

int get(struct buffer *b) {
  int item;
  pthread_mutex_lock(&b->m);
  while (b->count == 0)
    pthread_cond_wait(&b->not_empty, &b->m);
  item = b->data[b->out];
  b->out = (b->out + 1) % N;
  b->count--;
  pthread_cond_signal(&b->not_full);
  pthread_mutex_unlock(&b->m);
  return item;
}
\`\`\`

Con broadcast se despertaban todos los hilos (productores y consumidores) innecesariamente. Con dos variables de condición y signal, solo se despierta un hilo del tipo que puede progresar, minimizando wakeups espurios.`,
    explanation:
      "La clave es separar las condiciones de espera: not_full para productores (buffer lleno) y not_empty para consumidores (buffer vacío). Al usar signal en lugar de broadcast, solo un hilo relevante es despertado. Un productor que añade un elemento solo necesita despertar a un consumidor; un consumidor que retira un elemento solo necesita despertar a un productor.",
  },
  {
    id: "2019-07_q2",
    exam: "2019-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.75,
    question: `Implemente una librería de mutex recursivos usando los mutex y variables de condición de pthread. Un mutex recursivo permite que el mismo thread lo bloquee múltiples veces (cada \`lock\` debe ir seguido de un \`unlock\` correspondiente). Otros threads deben bloquearse hasta que el propietario libere todos los locks.

Complete la estructura y las funciones:

\`\`\`c
typedef struct {
  pthread_mutex_t m;
  pthread_cond_t c;
  // Añada los campos necesarios
} recursive_mutex_t;

void recursive_mutex_init(recursive_mutex_t *rm) {
  // ...
}

void recursive_mutex_lock(recursive_mutex_t *rm) {
  // ...
}

void recursive_mutex_unlock(recursive_mutex_t *rm) {
  // ...
}
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_mutex_init(pthread_mutex_t *m, pthread_mutex_attr_t *attr);
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_trylock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_init(pthread_cond_t *c, pthread_cond_attr_t *attr);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
pthread_t pthread_self();
int pthread_equal(pthread_t t1, pthread_t t2);
\`\`\``,
    correctAnswer: `\`\`\`c
typedef struct {
  pthread_mutex_t m;
  pthread_cond_t c;
  pthread_t owner;
  int count;
} recursive_mutex_t;

void recursive_mutex_init(recursive_mutex_t *rm) {
  pthread_mutex_init(&rm->m, NULL);
  pthread_cond_init(&rm->c, NULL);
  rm->owner = (pthread_t)0;
  rm->count = 0;
}

void recursive_mutex_lock(recursive_mutex_t *rm) {
  pthread_mutex_lock(&rm->m);
  if (rm->count > 0 && pthread_equal(rm->owner, pthread_self())) {
    rm->count++;
  } else {
    while (rm->count > 0)
      pthread_cond_wait(&rm->c, &rm->m);
    rm->owner = pthread_self();
    rm->count = 1;
  }
  pthread_mutex_unlock(&rm->m);
}

void recursive_mutex_unlock(recursive_mutex_t *rm) {
  pthread_mutex_lock(&rm->m);
  rm->count--;
  if (rm->count == 0) {
    rm->owner = (pthread_t)0;
    pthread_cond_signal(&rm->c);
  }
  pthread_mutex_unlock(&rm->m);
}
\`\`\``,
    explanation:
      "Se almacena el owner (pthread_t) y un contador de locks anidados. En lock, si el mutex ya está bloqueado por el mismo thread, simplemente se incrementa el contador. Si está bloqueado por otro thread, se espera en la variable de condición. En unlock, se decrementa el contador; solo cuando llega a 0 se libera el mutex y se despierta a un thread en espera con signal.",
  },
  {
    id: "2019-07_q3",
    exam: "2019-07",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.25,
    question: `Escriba un módulo Erlang que implemente una barrera con salida periódica. Los procesos se registran en la barrera mediante \`barrier:register(B, Pid)\`. Una vez registrados N procesos, la barrera libera un proceso cada T milisegundos hasta que todos hayan salido.

\`\`\`erlang
-module(barrier).
-export([start/2, init/1, register/2]).

start(N, T) -> spawn(?MODULE, init, [N, T, []]).
register(B, Pid) -> ...
init(N, T, Pids) -> ...
\`\`\`

Donde:
- N es el número de procesos que deben registrarse antes de empezar a liberar
- T es el intervalo en milisegundos entre cada liberación
- Los procesos liberados reciben el mensaje \`done\`

Implemente \`register/2\` e \`init/3\`.`,
    correctAnswer: `\`\`\`erlang
-module(barrier).
-export([start/2, register/2]).

start(N, T) -> spawn(?MODULE, init, [N, T, []]).

register(B, Pid) ->
  B ! {register, Pid},
  receive
    done -> ok
  end.

init(0, T, Pids) ->
  release(Pids, T);
init(N, T, Pids) ->
  receive
    {register, Pid} ->
      init(N - 1, T, [Pid | Pids])
  end.

release([], _) -> ok;
release([Pid | Rest], T) ->
  Pid ! done,
  timer:sleep(T),
  release(Rest, T).
\`\`\``,
    explanation:
      "El proceso barrera mantiene una lista de PIDs pendientes. En init, acumula N registros; cuando N llega a 0, pasa a la fase release. release envía done al primer proceso de la lista, espera T ms con timer:sleep, y continúa recursivamente con el resto. Cada registro se atiende secuencialmente vía receive bloquante.",
  },

  // --- Paralelismo ---

  {
    id: "2019-07_q4",
    exam: "2019-07",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    explanationImage: getImage(imageMap, "pipeline-sensors-2019-07.jpeg"),
    subquestions: [
      "(a) [0.5p] Dibuja el grafo de dependencias para este problema. Diferencia las dependencias de datos y de control.",
      "(b) [0.5p] ¿Qué tipo de descomposición o descomposiciones aplicarías al problema?",
      "(c) [1p] Si queremos comprar una máquina dedicada en exclusiva a ejecutar este algoritmo, calcula cuántos procesadores debería tener para conseguir el objetivo propuesto y describe la asignación entre tareas y procesadores.",
      "(d) [0.5p] Describe en una línea temporal el funcionamiento del pipeline para el procesamiento de 5 bloques de datos (5 ciclos completos de ejecución).",
    ],
    question: `Una aplicación de análisis de datos en tiempo real recibe a través de un conjunto de sensores un flujo de datos constante, y los procesa en un **pipeline** para imprimir periódicamente un valor $S$ que resume los valores registrados por los sensores. La aplicación funciona cíclicamente del siguiente modo: Al comenzar un ciclo, se leen los datos recibidos de los sensores hasta completar un bloque que almacenamos en una matriz $M$ (etapa 1). Ese bloque se procesa en una función $A$, que calcula un índice numérico $I$ (etapa 2). En función del valor de $I$, se decide si se ejecuta la función $B1$ o $B2$, las cuales a partir de $M$ generan una segunda matriz $M2$ (etapa 3). Finalmente, con la matriz $M2$ se calcula el valor de $S$ (etapa 4). El siguiente pseudocódigo describe el algoritmo del pipeline, en el que se indica también la duración del procesamiento secuencial de cada una de las funciones.

\`\`\`c
while(true) {
    M = captura_datos()    // 1) lectura de datos: 50 ms
    I = funcion_A(M)        // 2) funcion A: 50 ms
    if (I >= 0)
        M2 = funcion_B1(M)    // 3.1) funcion B1: 200 ms
    else
        M2 = funcion_B2(M)    // 3.2) funcion B2: 100 ms
    S = funcion_C(M2)        // 4) funcion C: 50 ms
}
\`\`\`

Las funciones $B1$ y $B2$ consisten en la aplicación de una serie de operaciones sobre la matriz $M$. $B1$ es paralelizable con una eficiencia paralela constante del 80% para cualquier número de procesos $P > 1$. $B2$ tiene una parte estrictamente secuencial que tarda 40ms, mientras que el resto es paralelizable con una eficiencia del 100%. El resto de las funciones no son paralelizables. El tiempo de comunicaciones es despreciable. Nuestro objetivo es idear una paralelización del pipeline en el que cada etapa tarde como máximo 50 ms, de modo que se elimine el tiempo de espera entre cada ejecución de la etapa 1.

Responde brevemente a las siguientes cuestiones, justificando tu respuesta.`,
    correctAnswer: `(a) El grafo quedaría de la siguiente forma:

(b) En primer lugar tenemos una **descomposición funcional**. La ejecución en paralelo de B1 y B2, dado que no tienen una dependencia real de datos con la función A, podemos considerarlo una **descomposición especulativa**, aunque por la organización del sistema paralelo como un pipeline no sería necesario, ya que conoceremos el resultado de la ejecución de A antes de ejecutar B1 o B2 sobre esos mismos datos. Por último, para B1 y B2 aplicamos una **descomposición de dominio**.

(c) Podemos definir un pipeline de 4 etapas: (1) captura de datos, (2) función A, (3) ejecución de B1 o B2 en función del resultado anterior, y (4) función C. Idealmente cada etapa debe tardar el mismo tiempo (50ms), determinado por lo que tardan las etapas no paralelizables. Por lo tanto, la aceleración máxima de B1 y B2 con las que podremos obtener una mejora en el tiempo de ejecución será 4 y 2 respectivamente, para que ambas tengan también una duración de 50 ms.

En B1, como la eficiencia paralela es del 80% para $P > 1$ independientemente del valor de $P$, y la eficiencia paralela es la aceleración dividido por el número de procesos ($E = S/P$) tenemos que $P = S/E$. Entonces, para B1 el número de procesos que necesitamos para conseguir una aceleración de $200ms/50ms = 4$ es:

$$P_{B1} \\geq 4/0.8 \\geq 5$$

Para B2 con los datos que tenemos podemos aplicar Amdahl para conseguir una aceleración de $100ms/50ms = 2$:

$$\\frac{1}{0.4 + 0.6/P_{B2}} \\geq 2 \\rightarrow P_{B2} \\geq \\frac{0.6}{1/2 - 0.4} \\geq 6$$

Por tanto, para ejecutar B1 o B2 en 50ms o menos necesitamos 6 procesadores.

Dado que el algoritmo lo podemos ejecutar como un pipeline, usaremos 3 procesadores para ejecutar la captura de datos, A y C (uno para cada función) y 6 para ejecutar B1 o B2. En total, lo ideal sería que la máquina dedicada tuviese al menos **9 procesadores**.

(d) Cada bloque de datos procesado en el pipeline lo denominamos $D_i$. Con la descomposición y asignación propuesta, la ejecución de cada una de las tareas tarda como máximo 50 ms:

| t (ms) | captura | A | B1/B2 | C |
|--------|---------|---|-------|---|
| 0 | $D_0$ | | | |
| 50 | $D_1$ | $D_0$ | | |
| 100 | $D_2$ | $D_1$ | $D_0$ | |
| 150 | $D_3$ | $D_2$ | $D_1$ | $D_0$ |
| 200 | $D_4$ | $D_3$ | $D_2$ | $D_1$ |
| 250 | | $D_4$ | $D_3$ | $D_2$ |
| 300 | | | $D_4$ | $D_3$ |
| 350 | | | | $D_4$ |

y por lo tanto se pueden capturar todos los datos en tiempo real sin que se pierda ninguna lectura de los sensores.`,
    explanation:
      "El pipeline tiene 4 etapas con tiempos variables. El objetivo es balancear las etapas a 50ms paralelizando B1 (que necesita aceleración 4, con eficiencia 80% → 5 procesos) y B2 (que necesita aceleración 2, con eficiencia parcial según Amdahl → 6 procesos). Con 9 procesadores totales (3 para etapas secuenciales + 6 para B1/B2) el pipeline funciona sin esperas.",
  },
  {
    id: "2019-07_q5",
    exam: "2019-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Explica qué tipo de descomposición se ajusta a este algoritmo, justificando la respuesta.",
      "(b) [0.5p] Explica qué tipo de asignación de tareas usarías, justificando la respuesta y explicando a alto nivel cómo funcionaría tu propuesta.",
      "(c) [0.5p] Explica qué tipo de asignación de tareas usarías en el caso de que en general la carga computacional de f(i1(r)) y de f(i2(r)) pudiese ser muy distinta, justificando la respuesta y explicando a alto nivel cómo funcionaría tu propuesta.",
      "(d) [1p] Implementa el algoritmo paralelo en MPI siguiendo el pseudocódigo: i) El proceso 0 lee la entrada de disco. ii) El proceso 0 descompone localmente el trabajo hasta obtener tareas para todos los procesos. iii) El proceso 0 envía trabajo a todos los procesos mediante una colectiva de MPI. iv) Cada proceso ejecuta su trabajo local. v) Obtener el resultado global en el proceso 0 mediante otra colectiva de MPI. vi) El proceso 0 guarda el resultado en el disco.",
    ],
    question: `Debido a su elevado costo en la mayoría de las ejecuciones, se desea paralelizar el algoritmo

\`\`\`c
float f(int r) {
  if (condition(r)) return compute(r);
  else return f(i1(r)) + f(i2(r));
}

main() {
  int input = read_from_file();
  float result = f(input);
  write_to_file(result);
}
\`\`\`

en donde todas las funciones invocadas dentro de f proceden de librerías externas cuya implementación desconocemos. Lo que sí sabemos es que el tiempo de computación de condition, compute, i1 e i2 es fijo independientemente del r utilizado y que el coste computacional de f(i1(r)) y de f(i2(r)) son idénticos para un r dado, con lo que su carga computacional está totalmente equilibrada. Además se sabe que el número de procesos P usado en las ejecuciones siempre será una potencia de 2 y el proceso 0 será el único que puede acceder al sistema de ficheros.

Responde RAZONADAMENTE a las siguientes cuestiones.

API MPI disponible:

\`\`\`c
int MPI_Init(int *argc, char ***argv)
int MPI_Comm_size(MPI_Comm comm, int *size)
int MPI_Comm_rank(MPI_Comm comm, int *rank)
int MPI_Send(void *buf, int count, MPI_Datatype datatype, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype datatype, int source, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Barrier(MPI_Comm comm)
int MPI_Bcast(void *buffer, int count, MPI_Datatype datatype, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Scatterv(const void *sendbuf, const int *sendcounts, const int *displs, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gatherv(const void *sendbuf, int sendcount, MPI_Datatype sendtype, void *recvbuf, const int *recvcounts, const int *displs, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype datatype, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) En esta función el paralelismo procede del hecho de que cada computación para un r distinto de 0 que no cumpla condition puede subdividirse en dos partes que pueden calcularse en paralelo, tratándose además de un proceso recursivo. Así pues, es un caso de **descomposición recursiva o divide-y-vencerás**.

(b) El enunciado indica que siempre que se puede descomponer un cómputo de f, f(i1(r)) y f(i2(r)) tienen el mismo coste, con lo que el trabajo siempre está equilibrado a los distintos niveles de recursividad. Además, como el coste de las funciones usadas dentro de f es fijo, esto indica que si el coste de f(i1(r)) y f(i2(r)) es el mismo, entonces el número de subdivisiones o niveles de recursividad de las dos también es el mismo. Por todo ello la carga puede equilibrarse fácilmente de forma **estática**.

En cuanto a la propuesta de implementación, una estrategia lógica sería ir dividiendo el trabajo en el procesador 0 hasta obtener una tarea para cada procesador disponible (o al menos para el máximo de procesadores posible en el caso de que la descomposición recursiva finalice antes). Entonces repartirlos entre todos los procesadores, tras lo cual cada procesador haría su parte, y finalmente se sumarían los resultados parciales de cada procesador.

(c) Al poder haber mucho **desequilibrio de carga** entre las distintas subtareas y no poder disponer por adelantado del coste concreto de cada tarea, tendremos que recurrir a un reparto de tareas **dinámico**.

Una propuesta posible sería usar un esquema **maestro-esclavo** en el que el proceso 0 hace una descomposición inicial entre los demás procesos y éstos se van quedando con algunos de los subproblemas que generan, mientras que los sobrantes se los mandan al 0, al cual le pedirán trabajo cuando se queden sin él. También le enviarían al proceso 0 los resultados de sus computaciones para que los fuese sumando de cara a obtener el resultado final.

(d) Una propuesta de implementación que cumple con el pseudocódigo proporcionado es:

\`\`\`c
int P, myrank, tmp, offset, *inputs;
float result, rtmp;

MPI_Init(&argc, &argv);
MPI_Comm_size(MPI_COMM_WORLD, &P);
MPI_Comm_rank(MPI_COMM_WORLD, &myrank);

if (myrank == 0) {
    inputs = (int *)malloc(sizeof(int) * P);
    inputs[0] = read_from_file();
    for (offset = 1; offset < P; offset = offset * 2) {
        for (i = 0; i < offset; i++) {
            tmp = inputs[i];
            inputs[i] = i1(tmp);
            inputs[i + offset] = i2(tmp);
        }
    }
}

MPI_Scatter(inputs, 1, MPI_INT, &tmp, 1, MPI_INT, 0, MPI_COMM_WORLD);
rtmp = f(tmp);
MPI_Reduce(&rtmp, &result, 1, MPI_FLOAT, MPI_SUM, 0, MPI_COMM_WORLD);

if (myrank == 0) {
    write_to_file(result);
}
MPI_Finalize();
\`\`\``,
    explanation:
      "La descomposición recursiva (divide-y-vencerás) es natural para este algoritmo: cada llamada a f genera dos subproblemas independientes. Con carga equilibrada entre ramas, la asignación estática funciona bien: el proceso 0 expande el árbol recursivo hasta obtener P tareas y las reparte con MPI_Scatter. Si las ramas tienen carga desigual, se necesita asignación dinámica (maestro-esclavo). El resultado se reduce con MPI_Reduce(SUM).",
  },

  // ================================================================
  // 2020-06 (Junio 2020 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2020-06_q1",
    exam: "2020-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 0.75,
    question: `Durante la pandemia de COVID, un supermercado debe controlar la entrada de clientes para respetar el aforo máximo. Se permite la entrada por grupos (familias que conviven juntas). El aforo se mide en personas, no en grupos.

Implemente el sistema usando mutex y variables de condición de pthread. Complete las funciones \`enter_group\` y \`leave_group\`:

\`\`\`c
struct supermarket {
  int capacity;         // aforo máximo en personas
  int inside;           // personas dentro actualmente
  pthread_mutex_t m;
  pthread_cond_t c;
  // Añada campos si es necesario
};

void enter_group(struct supermarket *s, int group_size) {
  ...
}

void leave_group(struct supermarket *s, int group_size) {
  ...
}
\`\`\`

Los grupos esperan si no hay capacidad suficiente para todos sus miembros. Cuando un grupo sale, debe despertarse a los grupos que estaban esperando si ahora hay espacio.

Pthread API disponible:

\`\`\`c
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `\`\`\`c
struct supermarket {
  int capacity;
  int inside;
  pthread_mutex_t m;
  pthread_cond_t c;
};

void enter_group(struct supermarket *s, int group_size) {
  pthread_mutex_lock(&s->m);
  while (s->inside + group_size > s->capacity)
    pthread_cond_wait(&s->c, &s->m);
  s->inside += group_size;
  pthread_mutex_unlock(&s->m);
}

void leave_group(struct supermarket *s, int group_size) {
  pthread_mutex_lock(&s->m);
  s->inside -= group_size;
  pthread_cond_broadcast(&s->c);
  pthread_mutex_unlock(&s->m);
}
\`\`\`

Se usa broadcast porque un grupo que sale puede liberar suficiente espacio para varios grupos pequeños que estaban esperando. Con signal solo se despertaría uno, pudiendo dejar a otros grupos esperando innecesariamente.`,
    explanation:
      "La condición de espera es que la suma de personas dentro más el tamaño del grupo entrante no supere la capacidad. Como el espacio liberado por un grupo puede ser suficiente para varios grupos pequeños, se usa broadcast para que todos los que esperan reevalúen la condición. Cada grupo comprueba individualmente si ahora cabe.",
  },
  {
    id: "2020-06_q2",
    exam: "2020-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 0.75,
    question: `Implemente un sistema de gestión de turnos (como los de una carnicería o farmacia) usando mutex y variables de condición de pthread. El sistema asigna números consecutivos a los clientes que llegan (\`take_ticket\`) y un empleado atiende al siguiente cliente cuando está libre (\`serve_next\`). Los clientes esperan su turno llamando a \`wait_my_turn\`.

Complete el struct y las funciones:

\`\`\`c
struct ticket_system {
  int next_ticket;      // próximo número a repartir
  int current_ticket;   // número que se está atendiendo ahora
  pthread_mutex_t m;
  pthread_cond_t c;
};

int take_ticket(struct ticket_system *ts) {
  ...
}

void wait_my_turn(struct ticket_system *ts, int ticket) {
  ...
}

void serve_next(struct ticket_system *ts) {
  ...
}
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `\`\`\`c
struct ticket_system {
  int next_ticket;
  int current_ticket;
  pthread_mutex_t m;
  pthread_cond_t c;
};

int take_ticket(struct ticket_system *ts) {
  pthread_mutex_lock(&ts->m);
  int ticket = ts->next_ticket++;
  pthread_mutex_unlock(&ts->m);
  return ticket;
}

void wait_my_turn(struct ticket_system *ts, int ticket) {
  pthread_mutex_lock(&ts->m);
  while (ticket != ts->current_ticket)
    pthread_cond_wait(&ts->c, &ts->m);
  pthread_mutex_unlock(&ts->m);
}

void serve_next(struct ticket_system *ts) {
  pthread_mutex_lock(&ts->m);
  ts->current_ticket++;
  pthread_cond_broadcast(&ts->c);
  pthread_mutex_unlock(&ts->m);
}
\`\`\``,
    explanation:
      "take_ticket asigna el siguiente número de forma atómica. wait_my_turn bloquea al cliente hasta que su número coincida con current_ticket. serve_next incrementa current_ticket y hace broadcast para que todos los clientes en espera comprueben si les toca (el que tenga el número correcto se desbloqueará y los demás volverán a esperar).",
  },
  {
    id: "2020-06_q3",
    exam: "2020-06",
    topic: "concurrencia-erlang",
    type: "text",
    points: 0.5,
    image: getImage(imageMap, "tree-2020-06.jpeg"),
    question: `Se tiene el siguiente árbol de procesos Erlang, donde cada nodo es un proceso que conoce el PID de su padre y de sus hijos (en una lista ordenada de izquierda a derecha):

\`\`\`erlang
-module(tree).
-export([start/0, height/1]).

start() -> spawn(?MODULE, node, [none, []]).

height(Root) -> ...
node(Parent, Children) -> ...
\`\`\`

Implemente la función \`height/1\` que, dado el PID del nodo raíz del árbol, devuelva la altura del árbol (número de niveles). La altura de una hoja es 0.`,
    correctAnswer: `\`\`\`erlang
-module(tree).
-export([start/0, height/1]).

start() -> spawn(?MODULE, node, [none, []]).

height(Root) ->
  Root ! {height, self()},
  receive
    {height_reply, H} -> H
  end.

node(Parent, Children) ->
  receive
    {height, From} ->
      Heights = [begin
                   Child ! {height, self()},
                   receive {height_reply, Hc} -> Hc end
                 end || Child <- Children],
      MaxH = case Heights of
               [] -> 0;
               _  -> lists:max(Heights)
             end,
      From ! {height_reply, MaxH + 1}
  end,
  node(Parent, Children).
\`\`\``,
    explanation:
      "La altura se calcula recursivamente: el proceso raíz envía una petición a cada hijo, que a su vez consulta a sus propios hijos. Cada nodo hoja (sin hijos) devuelve 0. Un nodo interno calcula el máximo de las alturas de sus hijos y suma 1. La función height/1 envía la petición inicial a la raíz y espera la respuesta.",
  },

  // --- Paralelismo ---

  {
    id: "2020-06_q4",
    exam: "2020-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 1,
    subquestions: [
      "(a) [0.25p] Determina qué tipo de descomposición y asignación de tareas aplicarías.",
      "(b) [0.5p] Calcula la máxima aceleración teórica que se podría obtener.",
      "(c) [0.25p] Si la matriz en lugar de ser de 64×64 fuera de 1024×1024 y se dispusiese de 256 procesos, ¿cómo cambiaría la aceleración máxima?",
    ],
    question: `Se quiere procesar un cubo de datos representado por 64 matrices de tamaño 64×64. Cada matriz puede procesarse de forma independiente, requiriendo 10 segundos de CPU por matriz. Adicionalmente, se necesita una fase inicial de carga de datos que tarda 8 segundos (no paralelizable) y una fase final de agregación de resultados que tarda 4 segundos (no paralelizable).

Responde RAZONADAMENTE a las siguientes cuestiones.`,
    correctAnswer: `(a) **Descomposición de dominio** donde el dominio es el conjunto de 64 matrices. Cada tarea es el procesamiento de una matriz. La **asignación es estática por bloques** ya que todas las matrices requieren el mismo tiempo de procesamiento y el número de tareas es conocido a priori.

(b) Tiempo secuencial = 8 + 64×10 + 4 = 652 s. Tiempo paralelo mínimo = 8 + 10 + 4 = 22 s (con 64 procesos, uno por matriz).
- **Aceleración máxima = 652/22 = 29.64**

(c) Con 1024 matrices de 1024×1024 y 256 procesos:
- Tiempo secuencial = 8 + 1024×10 + 4 = 10252 s
- Tiempo paralelo = 8 + (1024/256)×10 + 4 = 8 + 40 + 4 = 52 s
- **Aceleración máxima = 10252/52 = 197.15**

La aceleración mejora significativamente porque la porción paralelizable domina el tiempo total (Ley de Amdahl: la fracción secuencial se vuelve insignificante para problemas grandes).`,
    explanation:
      "La ley de Amdahl establece que el speedup está limitado por la porción secuencial. Con 64 matrices, la parte secuencial (8+4=12s) es el 1.8% del tiempo secuencial. Con 1024 matrices, la parte secuencial baja al 0.12%, permitiendo una aceleración mucho mayor al escalar con más procesos.",
  },
  {
    id: "2020-06_q5",
    exam: "2020-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 1,
    subquestions: [
      "(a) [0.25p] ¿Qué tipo de descomposición y asignación de tareas propones?",
      "(b) [0.5p] Escribe un pseudocódigo paralelo de alto nivel.",
      "(c) [0.25p] ¿Qué función colectiva de MPI usarías para la fase de recuento y por qué?",
    ],
    question: `En unas elecciones, se quiere procesar en paralelo el escrutinio de P colegios electorales. Cada colegio tiene un fichero con los votos que debe ser procesado para extraer el recuento de votos por partido. El recuento de cada colegio es independiente, pero al final hay que sumar los resultados de todos los colegios para obtener el resultado nacional.

Solo el proceso 0 tiene acceso al disco con los ficheros de todos los colegios. El número de colegios P es siempre múltiplo del número de procesos. El tiempo de procesamiento de cada colegio es variable (depende del número de votantes).`,
    correctAnswer: `(a) **Descomposición de dominio** donde el dominio es el conjunto de colegios electorales. La **asignación es dinámica centralizada (maestro-esclavo)**: el proceso 0 actúa como maestro que reparte colegios a los esclavos según van terminando, para balancear la carga dado que el tiempo de procesamiento por colegio es variable e impredecible.

(b) Pseudocódigo:
\`\`\`
Maestro (proceso 0):
  cargar lista de P colegios
  enviar 1 colegio a cada esclavo
  colegios_pendientes = P - (numprocs - 1)
  mientras colegios_pendientes > 0:
    recibir resultados_parciales del esclavo que termina
    si quedan colegios, enviar siguiente colegio a ese esclavo
    colegios_pendientes--
  recibir resultados del resto de esclavos
  sumar todos los resultados parciales → resultado nacional

Esclavo (procesos 1..numprocs-1):
  mientras reciba un colegio:
    procesar fichero del colegio → resultados parciales
    enviar resultados al maestro
\`\`\`

(c) Se usaría **MPI_Reduce con MPI_SUM**. Cada proceso acumula sus resultados parciales en un array (votos por partido) y MPI_Reduce suma todos los arrays elemento a elemento en el proceso 0. Es la colectiva más eficiente para este patrón porque combina comunicación y computación en una sola operación tree-based.`,
    explanation:
      "El patrón maestro-esclavo es ideal cuando las tareas tienen carga variable y un solo proceso tiene acceso a los datos. El maestro distribuye trabajo bajo demanda para minimizar el desbalanceo. MPI_Reduce con MPI_SUM implementa eficientemente la reducción en árbol (O(log P)), combinando resultados parciales en cada nivel.",
  },

  // ================================================================
  // 2020-07 (Julio 2020 — Convocatoria extraordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2020-07_q1",
    exam: "2020-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 0.75,
    question: `Implemente una librería de futures (promesas) en C usando los mutex y variables de condición de pthread. Un future es un valor que será calculado por un thread productor y consumido posteriormente por uno o más threads consumidores. La interfaz es:

- \`future_t *create_future()\`: crea un nuevo future vacío
- \`void promise(future_t *f, void *value)\`: el productor establece el valor del future
- \`void *force(future_t *f)\`: el consumidor espera hasta que el valor esté disponible y lo devuelve
- \`void free_future(future_t *f)\`: libera la memoria del future

Implemente el struct y las funciones:

\`\`\`c
typedef struct {
  // Complete
} future_t;

future_t *create_future() { ... }
void promise(future_t *f, void *value) { ... }
void *force(future_t *f) { ... }
void free_future(future_t *f) { ... }
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_mutex_init(pthread_mutex_t *m, pthread_mutex_attr_t *attr);
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_init(pthread_cond_t *c, pthread_cond_attr_t *attr);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `\`\`\`c
typedef struct {
  pthread_mutex_t m;
  pthread_cond_t c;
  void *value;
  int ready;
} future_t;

future_t *create_future() {
  future_t *f = (future_t *)malloc(sizeof(future_t));
  pthread_mutex_init(&f->m, NULL);
  pthread_cond_init(&f->c, NULL);
  f->value = NULL;
  f->ready = 0;
  return f;
}

void promise(future_t *f, void *value) {
  pthread_mutex_lock(&f->m);
  f->value = value;
  f->ready = 1;
  pthread_cond_broadcast(&f->c);
  pthread_mutex_unlock(&f->m);
}

void *force(future_t *f) {
  pthread_mutex_lock(&f->m);
  while (!f->ready)
    pthread_cond_wait(&f->c, &f->m);
  void *result = f->value;
  pthread_mutex_unlock(&f->m);
  return result;
}

void free_future(future_t *f) {
  pthread_mutex_destroy(&f->m);
  pthread_cond_destroy(&f->c);
  free(f);
}
\`\`\``,
    explanation:
      "El future almacena un flag ready (0/1) y el valor. promise establece el valor, marca ready=1 y hace broadcast para despertar a todos los consumidores en espera (puede haber varios). force espera a que ready sea true. Se usa broadcast en lugar de signal porque pueden ser varios threads esperando por el mismo future.",
  },
  {
    id: "2020-07_q2",
    exam: "2020-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 0.75,
    question: `Implemente la sincronización de un paso de peatones con semáforo usando mutex y variables de condición de pthread. Hay peatones que quieren cruzar y vehículos que quieren pasar. El semáforo puede estar en verde para coches o para peatones. Las reglas son:

- Inicialmente el semáforo está verde para coches
- Los peatones pueden cruzar si el semáforo está en verde para ellos y no hay coches cruzando
- Los coches pueden pasar si el semáforo está en verde para ellos y no hay peatones cruzando
- Cuando no hay coches esperando, el semáforo cambia a verde para peatones
- Cuando no hay peatones esperando, el semáforo cambia a verde para coches

Implemente las funciones \`pedestrian_arrive\`, \`pedestrian_leave\`, \`car_arrive\` y \`car_leave\`:

\`\`\`c
struct crossing {
  int pedestrians_crossing;
  int cars_crossing;
  int pedestrians_waiting;
  int cars_waiting;
  int light; // 0 = cars green, 1 = pedestrians green
  pthread_mutex_t m;
  pthread_cond_t cars_cv;
  pthread_cond_t peds_cv;
};

void pedestrian_arrive(struct crossing *c) { ... }
void pedestrian_leave(struct crossing *c) { ... }
void car_arrive(struct crossing *c) { ... }
void car_leave(struct crossing *c) { ... }
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `\`\`\`c
void pedestrian_arrive(struct crossing *c) {
  pthread_mutex_lock(&c->m);
  c->pedestrians_waiting++;
  while (c->light != 1 || c->cars_crossing > 0)
    pthread_cond_wait(&c->peds_cv, &c->m);
  c->pedestrians_waiting--;
  c->pedestrians_crossing++;
  pthread_mutex_unlock(&c->m);
}

void pedestrian_leave(struct crossing *c) {
  pthread_mutex_lock(&c->m);
  c->pedestrians_crossing--;
  if (c->pedestrians_crossing == 0 && c->cars_waiting > 0) {
    c->light = 0;
    pthread_cond_broadcast(&c->cars_cv);
  }
  pthread_mutex_unlock(&c->m);
}

void car_arrive(struct crossing *c) {
  pthread_mutex_lock(&c->m);
  c->cars_waiting++;
  while (c->light != 0 || c->pedestrians_crossing > 0)
    pthread_cond_wait(&c->cars_cv, &c->m);
  c->cars_waiting--;
  c->cars_crossing++;
  pthread_mutex_unlock(&c->m);
}

void car_leave(struct crossing *c) {
  pthread_mutex_lock(&c->m);
  c->cars_crossing--;
  if (c->cars_crossing == 0 && c->pedestrians_waiting > 0) {
    c->light = 1;
    pthread_cond_broadcast(&c->peds_cv);
  }
  pthread_mutex_unlock(&c->m);
}
\`\`\``,
    explanation:
      "Se modela como un semáforo con exclusión mutua entre peatones y coches. Los peatones esperan si el semáforo no está en verde para ellos o si hay coches cruzando. Cuando el último peatón sale y hay coches esperando, se cambia el semáforo a verde para coches. Ídem para coches. Múltiples peatones (o coches) pueden cruzar simultáneamente mientras el semáforo esté a su favor.",
  },
  {
    id: "2020-07_q3",
    exam: "2020-07",
    topic: "concurrencia-erlang",
    type: "text",
    points: 0.5,
    image: getImage(imageMap, "tree-2020-07.jpeg"),
    question: `Se tiene un árbol de procesos Erlang donde cada nodo almacena un valor entero y conoce el PID de sus hijos. El árbol se representa con el siguiente módulo:

\`\`\`erlang
-module(tree).
-export([start/0, get_value/1, exists/2]).

start() -> spawn(?MODULE, node, [none, 0, []]).

get_value(N) -> ...
exists(N, Value) -> ...

node(Parent, MyValue, Children) ->
  receive
    ...
  end,
  node(Parent, MyValue, Children).
\`\`\`

Implemente:
- \`get_value/1\`: dado el PID de un nodo, devuelve el valor almacenado en ese nodo.
- \`exists/2\`: dado el PID de un nodo raíz y un valor V, devuelve \`true\` si existe algún nodo en el árbol (a cualquier profundidad) que tenga almacenado el valor V, y \`false\` en caso contrario.`,
    correctAnswer: `\`\`\`erlang
-module(tree).
-export([start/0, get_value/1, exists/2]).

start() -> spawn(?MODULE, node, [none, 0, []]).

get_value(N) ->
  N ! {get_value, self()},
  receive
    {value_reply, V} -> V
  end.

exists(N, Value) ->
  N ! {exists, Value, self()},
  receive
    {exists_reply, Found} -> Found
  end.

node(Parent, MyValue, Children) ->
  receive
    {get_value, From} ->
      From ! {value_reply, MyValue};
    {exists, Value, From} ->
      if MyValue == Value ->
           From ! {exists_reply, true};
         true ->
           lists:foreach(fun(C) -> C ! {exists, Value, From} end, Children),
           receive
             {exists_reply, true} ->
               From ! {exists_reply, true};
             {exists_reply, false} ->
               ok  % seguir esperando respuestas de otros hijos
           after 100 ->
             From ! {exists_reply, false}  % timeout: ningún hijo encontró
           end
      end
  end,
  node(Parent, MyValue, Children).
\`\`\``,
    explanation:
      "get_value simplemente envía un mensaje al nodo y espera su valor. exists propaga la búsqueda al subárbol: si el nodo actual tiene el valor, responde true inmediatamente. Si no, reenvía la consulta a todos sus hijos. Un hijo que encuentra el valor responde true. Si ningún hijo responde en un tiempo razonable, se asume false.",
  },

  // --- Paralelismo ---

  {
    id: "2020-07_q4",
    exam: "2020-07",
    topic: "paralelismo-teoria",
    type: "text",
    points: 1,
    subquestions: [
      "(a) [0.25p] Determina qué tipo de descomposición y asignación de tareas aplicarías.",
      "(b) [0.25p] ¿Cuál es la máxima aceleración teórica?",
      "(c) [0.25p] Si cada celda necesita conocer el valor de sus 8 vecinas (incluyendo diagonales) para calcular su siguiente estado, ¿cómo afecta esto a la distribución de datos entre procesos?",
      "(d) [0.25p] Calcula el coste y la sobrecarga para una ejecución con 4 procesos donde el tiempo paralelo es de 15 segundos y el secuencial de 50 segundos.",
    ],
    question: `Se quiere simular un autómata celular sobre una matriz M×M donde el siguiente estado de cada celda depende únicamente de su valor actual y el de sus 4 vecinas (arriba, abajo, izquierda, derecha). El autómata evoluciona durante K iteraciones. Inicialmente solo el proceso 0 conoce la matriz completa.

Responde RAZONADAMENTE a las siguientes cuestiones.`,
    correctAnswer: `(a) **Descomposición de dominio** por bloques de filas de la matriz. Cada proceso recibe M/P filas contiguas. La **asignación es estática** porque la carga de trabajo es uniforme (cada celda requiere el mismo cómputo).

(b) Aplicando la Ley de Amdahl: la parte secuencial es la inicialización (despreciable para matrices grandes) y posibles comunicaciones. Si toda la computación es paralelizable, la **aceleración máxima tiende a P** (el número de procesos).

(c) Con dependencia de 8 vecinas, cada proceso necesita **filas de ghost/HALO** de los procesos vecinos: la fila superior del proceso P_i necesita la última fila del proceso P_{i-1}, y la fila inferior necesita la primera fila del proceso P_{i+1}. En cada iteración K, los procesos adyacentes deben intercambiar estas filas frontera mediante comunicación punto a punto (MPI_Send/MPI_Recv). El coste de comunicación aumenta, pero el patrón de distribución por bloques de filas sigue siendo válido.

(d) Con P=4, T_par = 15s, T_seq = 50s:
- **Coste = 15 × 4 = 60 s**
- **Sobrecarga = 60 − 50 = 10 s**`,
    explanation:
      "En autómatas celulares, la descomposición de dominio por filas es natural. Las celdas halo son necesarias para calcular las celdas del borde de cada bloque. El intercambio de halos entre vecinos es el overhead principal de comunicación. La sobrecarga es la diferencia entre el coste total (tiempo × procesos) y el tiempo secuencial.",
  },
  {
    id: "2020-07_q5",
    exam: "2020-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 1,
    subquestions: [
      "(a) [0.25p] Propón una descomposición y asignación de tareas adecuada.",
      "(b) [0.5p] Implementa con MPI la evolución del autómata celular para una iteración, usando funciones colectivas siempre que sea posible.",
      "(c) [0.25p] Si el número de iteraciones K es elevado y la matriz es pequeña, ¿qué problema de rendimiento puede surgir y cómo lo mitigarías?",
    ],
    question: `Implementa la paralelización con MPI del siguiente autómata celular 1D sobre un vector V de N elementos, donde cada celda evoluciona durante K iteraciones según:

\`\`\`c
for (k = 0; k < K; k++) {
  for (i = 1; i < N - 1; i++) {
    newV[i] = (V[i-1] + V[i] + V[i+1]) / 3;
  }
  swap(V, newV);
}
\`\`\`

El proceso 0 inicializa V y debe recoger el resultado final. N es múltiplo del número de procesos P.

Responde RAZONADAMENTE a las siguientes cuestiones.

MPI disponible:

\`\`\`c
int MPI_Barrier(MPI_Comm comm)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
\`\`\``,
    correctAnswer: `(a) **Descomposición de dominio** por bloques de elementos contiguos del vector. Cada proceso recibe N/P elementos. La **asignación es estática** ya que cada celda requiere el mismo cómputo. Cada proceso necesita acceso al último elemento del vecino izquierdo y al primer elemento del vecino derecho (celdas halo) para calcular los extremos de su bloque.

(b) Implementación MPI:

\`\`\`c
int local_n = N / P;
double *V = (double *)malloc(sizeof(double) * (local_n + 2));  // +2 para halos
double *newV = (double *)malloc(sizeof(double) * (local_n + 2));

// El proceso 0 inicializa y distribuye con Scatter
if (!rank) {
  double *fullV = (double *)malloc(sizeof(double) * N);
  inicializa(fullV);
  MPI_Scatter(fullV, local_n, MPI_DOUBLE, &V[1], local_n, MPI_DOUBLE, 0, MPI_COMM_WORLD);
  free(fullV);
} else {
  MPI_Scatter(NULL, 0, MPI_DATATYPE_NULL, &V[1], local_n, MPI_DOUBLE, 0, MPI_COMM_WORLD);
}

for (int k = 0; k < K; k++) {
  // Intercambio de halos con vecinos
  if (rank > 0)
    MPI_Send(&V[1], 1, MPI_DOUBLE, rank - 1, 0, MPI_COMM_WORLD);
  if (rank < P - 1)
    MPI_Send(&V[local_n], 1, MPI_DOUBLE, rank + 1, 0, MPI_COMM_WORLD);
  if (rank < P - 1)
    MPI_Recv(&V[local_n + 1], 1, MPI_DOUBLE, rank + 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
  if (rank > 0)
    MPI_Recv(&V[0], 1, MPI_DOUBLE, rank - 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);

  // Cálculo local
  for (int i = 1; i <= local_n; i++)
    newV[i] = (V[i-1] + V[i] + V[i+1]) / 3.0;

  double *tmp = V; V = newV; newV = tmp;
}

// Recoger resultado con Gather
if (!rank)
  fullV = (double *)malloc(sizeof(double) * N);
MPI_Gather(&V[1], local_n, MPI_DOUBLE, fullV, local_n, MPI_DOUBLE, 0, MPI_COMM_WORLD);
\`\`\`

(c) Si K es alto y N es pequeño, el **ratio comunicación/cómputo** es desfavorable. En cada iteración se intercambian halos (2 doubles por proceso), pero el cómputo local es mínimo (N/P operaciones). La solución sería **aumentar la granularidad** agrupando varias iteraciones antes de comunicar, o simplemente **ejecutar secuencialmente** si N es muy pequeño. Para N muy pequeño, el overhead de las comunicaciones MPI domina y la ejecución paralela puede ser más lenta que la secuencial.`,
    explanation:
      "El intercambio de halos es necesario en cada iteración para que cada proceso pueda calcular los bordes de su bloque. El patrón Send/Recv es punto a punto entre vecinos. El ratio comunicación/cómputo empeora con matrices pequeñas y muchas iteraciones: el coste de latencia de MPI domina. Agrupar iteraciones reduce el número de comunicaciones al coste de usar halos más anchos.",
  },

  // ================================================================
  // 2024-06 (Junio 2024 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2024-06_q1",
    exam: "2024-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    subquestions: [
      "(a) [1p] Todos los threads trabajadores tienen que esperar a que el thread principal llegue a un punto determinado para continuar su ejecución (barrier_worker()). El thread principal indica a los threads que ha llegado al punto determinado llamando a la función barrier_main().",
      "(b) [1p] Todos los threads tienen que esperar a que el resto de threads lleguen al punto de sincronización. El punto de sincronización se marca con la llamada a barrier_sync(). Cuando el último thread llega al punto de sincronización todos continúan.",
    ],
    question: `Queremos implementar usando mutexes y variables de condición las siguientes funcionalidades:

(a) Todos los threads trabajadores esperan al thread principal (\`barrier_worker\` / \`barrier_main\`).

\`\`\`c
struct barrier {
  pthread_mutex_t m;
  pthread_cond_t w;
};
void barrier_worker(struct barrier *b);
void barrier_main(struct barrier *b);
\`\`\`

(b) Todos los threads esperan a que el resto lleguen al punto de sincronización (\`barrier_sync\`). Cuando el último thread llega, todos continúan.

\`\`\`c
struct barrier {
  pthread_mutex_t m;
  pthread_cond_t w;
};
void barrier_sync(struct barrier *b);
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_trylock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `(a) Barrera con flag reached:

\`\`\`c
struct barrier {
  pthread_mutex_t m;
  pthread_cond_t w;
  int reached;  // Inicializado a 0
};

void barrier_worker(struct barrier *b) {
  pthread_mutex_lock(&b->m);
  if (!b->reached)
    pthread_cond_wait(&b->w, &b->m);
  pthread_mutex_unlock(&b->m);
}

void barrier_main(struct barrier *b) {
  pthread_mutex_lock(&b->m);
  b->reached = 1;
  pthread_cond_broadcast(&b->w);
  pthread_mutex_unlock(&b->m);
}
\`\`\`

(b) Barrera colectiva con contador de threads:

\`\`\`c
struct barrier {
  pthread_mutex_t m;
  pthread_cond_t w;
  int n_threads;
};

void barrier_sync(struct barrier *b) {
  pthread_mutex_lock(&b->m);
  b->n_threads--;
  if (b->n_threads > 0)
    pthread_cond_wait(&b->w, &b->m);
  else
    pthread_cond_broadcast(&b->w);
  pthread_mutex_unlock(&b->m);
}
\`\`\``,
    explanation:
      "(a) Usa un flag reached y broadcast: el principal despierta a todos cuando llega. (b) Usa un contador descendente: cada thread decrementa n_threads; si no es el último, espera; el último hace broadcast para liberar a todos. Es la implementación clásica de barrera con mutex + variable de condición.",
  },

  {
    id: "2024-06_q2",
    exam: "2024-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.5,
    question: `Un array de datos \`d\` puede ser accedido por varios threads simultáneamente para hacer una operación \`do_op\` sobre una de sus posiciones. Esta operación tiene efectos secundarios (no es pura). Para proteger el acceso a esos datos existe un array de mutex \`d_m\`, donde cada posición de \`d_m\` protege uno de los datos del array.

Vamos a implementar una operación \`do_op_seq\` que realice una secuencia de operaciones \`do_op\` especificada por un array que indica, en orden, las posiciones sobre las que hay que operar.

\`\`\`c
void do_op(data d);
void sort(int arr[], int arr_size); // Sort function for int arrays
data d[N];
pthread_mutex_t d_m[N];

void do_op_seq(int ids[], int ids_len) {
  for (int i = 0; i < ids_len; i++)
    do_op(d[ids[i]]);
}
\`\`\`

Implemente la protección de la secuencia de operaciones en \`do_op_seq\`. La secuencia de operaciones no debe realizarse hasta que se hayan bloqueado todas las posiciones afectadas, y debe respetarse el orden indicado por el array de operaciones.`,
    correctAnswer: `\`\`\`c
void do_op(data d);
void sort(int arr[], int arr_size);
data d[N];
pthread_mutex_t d_m[N];

void do_op_seq(int ids[], int ids_len) {
  int sorted_ids[ids_len];
  for (int i = 0; i < ids_len; i++)
    sorted_ids[i] = ids[i];
  sort(sorted_ids, ids_len);
  for (int i = 0; i < ids_len; i++)
    pthread_mutex_lock(&d_m[sorted_ids[i]]);
  for (int i = 0; i < ids_len; i++)
    do_op(d[ids[i]]);
  for (int i = 0; i < ids_len; i++)
    pthread_mutex_unlock(&d_m[sorted_ids[i]]);
}
\`\`\``,
    explanation:
      "Para evitar deadlocks, los mutex deben adquirirse siempre en el mismo orden. La solución ordena los IDs antes de hacer lock, garantizando orden consistente entre threads. Tras adquirir todos los locks, ejecuta las operaciones en el orden original y luego libera todos los locks.",
  },

  {
    id: "2024-06_q3",
    exam: "2024-06",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.5,
    repeated: true,
    question: `Escriba un módulo que permita crear procesos servidor con la siguiente interfaz:

- \`start()\`, que arranca un proceso servidor y devuelve su PID.
- \`put(S, Data)\`, donde S es el PID de un proceso servidor, y Data un dato arbitrario. El dato debe quedar almacenado en el servidor.
- \`get(S, Proc)\`, donde S es el PID de un proceso servidor, y Proc el PID de un proceso cualquiera. La función debe devolver una lista con todos los datos almacenados por Proc.

\`\`\`erlang
-module(store).
-export([start/0, get/2, put/2]).
start() -> spawn(?MODULE, init, []).
put(S, Data) -> ...
get(S, Proc) -> ...
init() -> ...
\`\`\``,
    correctAnswer: `\`\`\`erlang
-module(store).
-export([start/0, get/2, put/2]).

start() -> spawn(?MODULE, init, []).

put(S, Data) -> S ! {put, Data, self()}.

get(S, Proc) ->
  S ! {get, Proc, self()},
  receive
    {get_reply, L} -> L
  end.

init() -> loop([]).

loop(L) ->
  receive
    {get, Proc, From} ->
      From ! {get_reply, [Data || {Data, Owner} <- L, Owner == Proc]},
      loop(L);
    {put, Data, From} ->
      loop([{Data, From} | L])
  end.
\`\`\``,
    explanation:
      "El servidor almacena tuplas {Data, Owner} en una lista en su estado interno. put/2 envía un mensaje asíncrono. get/2 envía una petición al servidor y espera la respuesta con pattern matching. La list comprehension filtra los datos cuyo Owner coincide con Proc.",
  },

  // --- Paralelismo ---

  {
    id: "2024-06_q4",
    exam: "2024-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Determina qué tipo de descomposición y asignación de tareas aplicarías.",
      "(b) [0.75p] Calcula la máxima aceleración teórica que se podría obtener.",
      "(c) [0.75p] Calcula para el caso anterior, suponiendo que se usó el menor número posible de servidores: eficiencia paralela, coste y sobrecarga.",
      "(d) [0.5p] Si el algoritmo de IA se cambiase para poder ser capaz a menudo, pero no siempre y sin saberlo de antemano, de puntuar una maqueta tras sólo procesar un tercio de la misma, ¿cambiarías la descomposición y/o asignación de tareas?",
    ],
    question: `La escucha de maquetas de jóvenes promesas del reguetón es la actividad que provoca más bajas laborales en una discográfica, por lo que se desea automatizarla usando IA. Las maquetas son ficheros de audio de entre 3 y 6 minutos y el algoritmo de análisis puntúa cada una en varios aspectos, requiriendo 8 segundos de computación por cada segundo de audio, y no pudiéndose paralelizar el análisis de una maqueta individual. Tras obtener las puntuaciones de las n maquetas de cada día, el programa hace un postprocesado que incluye el ordenamiento de las mismas de acuerdo a sus puntuaciones y el envío de los resultados a los interesados, para lo cual se usa un algoritmo no paralelizable que requiere n × log₂(n) segundos.

Cada día hay que evaluar 64 maquetas, por lo que se desea paralelizar el proceso entre varios servidores. El tiempo medio de lectura de disco de cada canción son 0.1 segundos, mientras que el tiempo de transmisión tanto de las maquetas como de las puntuaciones es despreciable, y sólo uno de los servidores contiene el disco con las maquetas. Además, al leer o recibir una maqueta se sabe inmediatamente su duración.

Responde RAZONADAMENTE a las siguientes cuestiones.`,
    correctAnswer: `(a) Es una **descomposición de dominio** (dominio = conjunto de maquetas). La asignación de tareas es **irregular pero estática**, dado que al leer las maquetas podemos determinar exactamente su tiempo de computación y hacer un reparto equilibrado a priori. También hay descomposición funcional a nivel del problema completo (lectura, evaluación paralela, postprocesado).

(b) Tiempo secuencial con el peor caso (todas de 6 min → máxima parte paralelizable):
- Lectura: 64 × 0.1 = 6.4 s
- Procesamiento: 64 × (6 × 60 × 8) = 64 × 2880 = 184320 s
- Postprocesado: 64 × log₂(64) = 64 × 6 = 384 s
- **T_seq = 184710.4 s**

Tiempo paralelo (mínimo): lectura (6.4) + 1 maqueta de 6 min (2880) + postprocesado (384) = **3270.4 s**

- **Aceleración máxima = 184710.4 / 3270.4 = 56.48**

(c) Con 64 servidores (uno por maqueta):
- **Eficiencia = 56.48 / 64 = 88%**
- **Coste = 3270.4 × 64 = 209305.6 s**
- **Sobrecarga = 209305.6 − 184710.4 = 24595.2 s**

(d) La descomposición seguiría siendo de dominio, pero la asignación pasaría a ser **dinámica** (los tiempos de análisis dejan de ser predecibles a priori). Dado que sólo un servidor tiene acceso al disco, lo más fácil sería un esquema **centralizado maestro/esclavo**, aunque también podría hacerse distribución inicial por bloques o cíclica con asignación dinámica descentralizada.`,
    explanation:
      "La clave es la ley de Amdahl: el speedup está limitado por la porción secuencial (lectura + postprocesado). El peor caso para la aceleración máxima ocurre cuando la parte paralelizable ocupa la mayor porción posible del tiempo secuencial (maquetas de 6 min). El mínimo número de servidores para la aceleración máxima es igual al número de maquetas (64), uno por cada una.",
  },

  {
    id: "2024-06_q5",
    exam: "2024-06",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    image: getImage(imageMap, "stdev-algorithm-a-2024-06.jpeg"),
    explanationImage: getImage(imageMap, "stdev-algorithm-b-2024-06.jpeg"),
    subquestions: [
      "(a) [0.5p] Diseña la paralelización del Algoritmo A. Escribe un pseudocódigo de alto nivel indicando los pasos que se deben seguir.",
      "(b) [1.5p] Implementa la función stdev_mpi como se describe, siguiendo tu diseño propuesto. Utiliza funciones colectivas de MPI siempre que sea posible.",
      "(c) [0.5p] Piensa en cómo se paralelizará la función del Algoritmo B. ¿Cuál de las dos implementaciones sería más eficiente?",
    ],
    question: `Los siguientes algoritmos implementan una función que calcula la desviación típica (σ) de los valores de un vector 'v' de longitud 'N'. El resultado es idéntico en ambas funciones:

$\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i} (v_i - \\mu)^2}$

Queremos convertir la función del Algoritmo A en una operación colectiva MPI que tendrá la firma:

\`\`\`c
double stdev_mpi(double *v, int N, int R, int P, int root);
\`\`\`

R es el rango del proceso, P es el número de procesos que se ejecutan en paralelo y root es el rango del proceso raíz. Se asume:
- El vector 'v' sólo está inicializado en el proceso root.
- N y P son potencias de 2, siendo N >> P.
- En las operaciones colectivas MPI los buffers de envío y recepción pueden solaparse.
- El resultado debe ser correcto para todos los procesos.

MPI disponible:

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) Pasos de paralelización del Algoritmo A:

1. **Scatter**: Repartir el vector v entre los P procesos
2. **Suma parcial**: Cada proceso calcula sum = Σ(v_local[i])
3. **Reduce (SUM)**: Combinar sumas parciales en root
4. **Bcast**: Distribuir la suma total a todos los procesos
5. **Calcular media**: μ = sum / N (todos los procesos)
6. **Suma de cuadrados**: Cada proceso calcula sum = Σ(v_local[i] − μ)²
7. **Reduce (SUM)**: Combinar sumas de cuadrados en root
8. **Bcast**: Distribuir suma de cuadrados total
9. **Calcular σ**: sd = sqrt(sum / N) (todos los procesos)

(b) Implementación:

\`\`\`c
double stdev_mpi(double *v, int N, int R, int P, int root) {
  double v_local[N/P];
  MPI_Scatter(v, N/P, MPI_DOUBLE, v_local, N/P, MPI_DOUBLE, root, MPI_COMM_WORLD);

  double sum = 0;
  for (int i = 0; i < N/P; i++)
    sum += v_local[i];

  MPI_Reduce(&sum, &sum, 1, MPI_DOUBLE, MPI_SUM, root, MPI_COMM_WORLD);
  MPI_Bcast(&sum, 1, MPI_DOUBLE, root, MPI_COMM_WORLD);

  double media = sum / N;
  sum = 0;
  for (int i = 0; i < N/P; i++)
    sum += pow(v_local[i] - media, 2);

  MPI_Reduce(&sum, &sum, 1, MPI_DOUBLE, MPI_SUM, root, MPI_COMM_WORLD);
  MPI_Bcast(&sum, 1, MPI_DOUBLE, root, MPI_COMM_WORLD);

  return sqrt(sum / N);
}
\`\`\`

(c) En el Algoritmo B no es necesaria la separación entre el cálculo de la media y la desviación estándar. En una única pasada se calcula la suma y la suma de cuadrados. Esta implementación sería **más eficiente** porque no requiere la sincronización (barrera implícita) entre las dos tareas del Algoritmo A, reduciendo el número de reducciones y broadcasts a la mitad.`,
    explanation:
      "El Algoritmo A requiere 2 Reduce + 2 Bcast (uno para la media, otro para la varianza), forzando dos puntos de sincronización global. El Algoritmo B calcula Σv y Σv² en una sola pasada, necesitando solo 1 Reduce + 1 Bcast, lo que reduce la sobrecarga de comunicación significativamente.",
  },

  // ================================================================
  // 2024-07 (Julio 2024 — Convocatoria extraordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2024-07_q1",
    exam: "2024-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.5,
    question: `Implementar el esquema de la cola de un supermercado donde existe una única cola de clientes y múltiples cajeros. Cuando un cajero queda libre escoge el primer cliente de la cola. Los cajeros y los clientes no pueden hacer espera activa. Se pueden añadir todos los campos necesarios a los struct customer y super. No se pueden usar variables globales.

\`\`\`c
struct customer {
  pthread_cond_t c;
};

struct super {
  queue *q;
  pthread_mutex_t *m;
  pthread_cond_t *cajeros;
};

void cashier(struct super *s) {
  struct customer *c;
  while (true) {
    ...
    serve_customer(c);
  }
}

void customer(struct super *s, int num_items) {
  ...
  pay_and_leave();
}

struct cliente *peek(queue *q);               // Devuelve, sin eliminarlo, el primer cliente en la cola
void remove(queue *q, struct customer *c);     // Quita el cliente indicado de la cola
void insert(queue *q, struct customer *c);     // Inserta un cliente al final de la cola
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_mutex_init(pthread_mutex_t *m, pthread_mutex_attr_t *attr);
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_trylock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_init(pthread_cond_t *c, pthread_cond_attr_t *attr);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `\`\`\`c
struct customer {
  pthread_cond_t c;
};

struct super {
  queue *q;
  pthread_mutex_t m;
};

void cashier(struct super *s) {
  struct cliente *c;
  while (true) {
    pthread_mutex_lock(&s->m);
    while ((c = peek(&s->q)) == NULL)
      pthread_cond_wait(&s->cajeros, &s->m);
    pthread_cond_signal(&c->c);
    remove(&s->q, c);
    pthread_mutex_unlock(&s->m);
    serve_customer(c);
  }
}

void customer(struct super *s, int num_items) {
  struct customer *c = malloc(sizeof(struct customer));
  pthread_cond_init(&c->c, NULL);
  pthread_mutex_lock(&s->m);
  insert(s->q, c);
  pthread_cond_signal(&s->cajeros);
  pthread_cond_wait(&c->c, &s->m);
  pthread_mutex_unlock(&s->m);
  pay_and_leave();
}
\`\`\``,
    explanation:
      "Cada cliente tiene su propia variable de condición. Al llegar, se inserta en la cola, hace signal a los cajeros y espera en su condición personal. El cajero, cuando está libre, hace peek de la cola; si está vacía espera en cajeros. Al tomar un cliente, hace signal a la condición de ese cliente y lo elimina de la cola.",
  },

  {
    id: "2024-07_q2",
    exam: "2024-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    repeated: true,
    question: `Implemente, utilizando los mutex de la librería pthread, un tipo de mutex donde se pueden hacer bloqueos con prioridad alta o baja. Cuando un mutex se libera, solo podrá ser bloqueado por un thread con prioridad baja si no hay ningún thread con prioridad alta esperando.

\`\`\`c
typedef {
  pthread_mutex_t m;
  pthread_cond_t c;
  ...
} prio_mutex;

void high_prio_lock(prio_mutex *m) {
  ...
}

void low_prio_lock(prio_mutex *m) {
  ...
}

void prio_unlock(prio_mutex *m) {
  ...
}
\`\`\`

Implemente las operaciones \`high_prio_lock\`, \`low_prio_lock\` y \`prio_unlock\`.`,
    correctAnswer: `\`\`\`c
typedef {
  pthread_mutex_t m;
  pthread_cond_t c;
  int waiting_high_prio;
  int locked;
} prio_mutex;

void high_prio_lock(prio_mutex *m) {
  pthread_mutex_lock(&m->m);
  while (m->locked) {
    m->waiting_high_prio++;
    pthread_cond_wait(&m->c, &m->m);
    m->waiting_high_prio--;
  }
  m->locked = 1;
  pthread_mutex_unlock(&m->m);
}

void low_prio_lock(prio_mutex *m) {
  pthread_mutex_lock(&m->m);
  while (m->locked || m->waiting_high_prio > 0)
    pthread_cond_wait(&m->c, &m->m);
  m->locked = 1;
  pthread_mutex_unlock(&m->m);
}

void prio_unlock(prio_mutex *m) {
  pthread_mutex_lock(&m->m);
  m->locked = 0;
  pthread_cond_broadcast(&m->c);
  pthread_mutex_unlock(&m->m);
}
\`\`\``,
    explanation:
      "Se usa un contador waiting_high_prio para dar preferencia a los hilos de alta prioridad. Un hilo de baja prioridad espera si el mutex está bloqueado O si hay hilos de alta prioridad esperando. El unlock hace broadcast para despertar a todos; los de alta prioridad competirán, y los de baja prioridad volverán a comprobar la condición (waiting_high_prio > 0) antes de adquirir.",
  },

  {
    id: "2024-07_q3",
    exam: "2024-07",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.5,
    question: `Escriba un módulo que permita crear procesos servidor con la siguiente interfaz:

- \`start()\`, que arranca un proceso servidor y devuelve su PID.
- \`put(S, Data, Tags)\`, donde S es el PID de un proceso servidor, Data un dato arbitrario, y Tags una lista de etiquetas que describen el dato.
- \`get(S, Tags)\`, donde S es el PID de un proceso servidor, y Tags una lista de etiquetas. La función debe devolver una lista con todos los datos almacenados que tienen todas las etiquetas que están en Tags.

\`\`\`erlang
-module(store).
-export([start/0, get/2, put/3]).
start() -> spawn(?MODULE, init, []).
put(S, Data, Tags) -> ...
get(S, Tags) -> ...
init() -> ...
\`\`\`

Ejemplo de uso:

\`\`\`erlang
1> S = store:start().
<0.10.0>
2> store:put(S, one, [green, large]).
ok
3> store:put(S, two, [small]).
ok
4> store:get(S, []).
[one, two]
5> store:get(S, [green]).
[one]
6> store:get(S, [red]).
[]
\`\`\``,
    correctAnswer: `\`\`\`erlang
-module(store).
-export([start/0, get/2, put/3]).

start() -> spawn(?MODULE, init, []).

put(S, Data, Tags) ->
  S ! {put, Data, Tags},
  ok.

get(S, Tags) ->
  S ! {get, Tags, self()},
  receive
    {get_reply, L} -> L
  end.

init() -> loop([]).

loop(L) ->
  receive
    {put, Data, Tags} ->
      loop([{Data, Tags} | L]);
    {get, Tags, From} ->
      Res = [Data || {Data, DTags} <- L,
                     lists:all(fun(T) -> lists:member(T, DTags) end, Tags)],
      From ! {get_reply, Res},
      loop(L)
  end.
\`\`\``,
    explanation:
      "El servidor almacena tuplas {Data, Tags} en una lista. put/3 envía un mensaje asíncrono. get/2 envía petición y espera respuesta. La list comprehension filtra usando lists:all/2: un dato se incluye si todas las etiquetas buscadas (Tags) son miembros de las etiquetas del dato (DTags). Si Tags es [] (lista vacía), lists:all devuelve true para todos los datos.",
  },

  // --- Paralelismo ---

  {
    id: "2024-07_q4",
    exam: "2024-07",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Indica qué tipo de descomposición y asignación de tareas usarías.",
      "(b) [0.5p] ¿Cuál es la máxima aceleración teórica que se puede conseguir si consiguiésemos reducir el tiempo de análisis al máximo?",
      "(c) [1.0p] En una ejecución con 4 procesos, donde el reparto no es perfecto (un proceso asume la mitad de la carga, la otra mitad se reparte entre el resto), y cada envío de imagen tarda 10s, calcula: tiempo paralelo, speedup, eficiencia, coste y sobrecarga.",
      "(d) [0.5p] Si en vez de paralelizar cada radiografía por separado, se deben analizar varias radiografías con tiempos distintos, ¿cómo cambiarías la descomposición y asignación?",
    ],
    question: `En un hospital se dispone de un software que permite analizar radiografías de diferentes partes del cuerpo trabajando pixel a pixel. Se quiere desarrollar un programa paralelo que permita acelerar, usando varios procesos, el análisis de una radiografía de última generación.

A causa del hardware disponible en el hospital solo uno de los procesos tendrá acceso a disco para leer la imagen (tiempo constante de 1 minuto para leer una radiografía) y escribir el resultado del análisis (tiempo despreciable). Este proceso también puede realizar parte del análisis. Los procesos solo pueden empezar el análisis cuando todos tienen ya la imagen en su memoria. El análisis de una radiografía por un único proceso tarda 19 minutos y se realiza en cada pixel de forma independiente, pero sólo suponen carga de trabajo aquellos pixels que representan hueso dentro de la imagen.

Responde RAZONADAMENTE a las siguientes cuestiones.`,
    correctAnswer: `(a) **Descomposición de dominio** donde cada pixel sería una tarea independiente. **Asignación estática** porque se sabe el tipo de imagen al inicio. Para aliviar el desbalanceo por los píxeles sin hueso, se aplicaría una **distribución cíclica**, ya que los píxeles con masa ósea probablemente estén agrupados.

(b) Por la ley de Amdahl, el tiempo paralelo mínimo es la parte no paralelizable (1 min de lectura). Tiempo secuencial = 1 + 19 = 20 min. **Aceleración máxima = 20/1 = 20**.

(c) Tiempo secuencial = 20 min = 1200 s.
- Lectura: 60 s (no paralelizable)
- Envío de imagen a 3 procesos: 3 × 10 = 30 s
- Análisis: un proceso asume la mitad = 570 s (9.5 min)
- **Tiempo paralelo = 60 + 30 + 570 = 660 s**
- **Speedup = 1200/660 = 1.82**
- **Eficiencia = 1.82/4 = 0.45 (45%)**
- **Coste = 660 × 4 = 2640 s**
- **Sobrecarga = 2640 − 1200 = 1440 s**

(d) La descomposición seguiría siendo de dominio, pero cada tarea sería el análisis de una radiografía distinta (en lugar de píxeles dentro de una). La asignación pasaría a ser **dinámica maestro-esclavo** para manejar la diferente carga de trabajo entre radiografías de distintas zonas del cuerpo.`,
    explanation:
      "La clave es la ley de Amdahl: la parte secuencial (lectura de 1 min) limita el speedup máximo a 20. En (c), el desbalanceo de carga (un proceso con la mitad del trabajo) degrada fuertemente la eficiencia. En (d), al cambiar la granularidad de la tarea (de píxeles a radiografías completas), la asignación dinámica centralizada es más adecuada para carga variable.",
  },

  {
    id: "2024-07_q5",
    exam: "2024-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.75p] ¿Qué tipo de descomposición y asignación de tareas usarías? ¿A qué datos debe acceder cada proceso?",
      "(b) [1.0p] Escribe un código MPI que permita ejecutar de forma paralela este programa, usando colectivas siempre que se pueda.",
      "(c) [0.75p] Supón un sistema con topología en anillo donde un proceso solo se comunica con sus vecinos. Implementa la distribución de la matriz A usando solo punto a punto, desde el proceso 0. ¿Habría que modificar el tamaño de algún array?",
    ],
    question: `Se quiere paralelizar el siguiente código que trabaja sobre una matriz A de dos dimensiones (M filas y N columnas). El resultado de la última fila y la última columna es siempre 0:

\`\`\`c
float *A = (float *)malloc(sizeof(float) * M * N);
float *res = (float *)malloc(sizeof(float) * M * N);
float aux;
inicializa(A);

for (int i = 0; i < M - 1; i++) {
  for (int j = 1; j < N - 1; j++) {
    aux = A[i*N+j] * A[(i+1)*N+j+1] - A[i*N+j+1] * A[(i+1)*N+j];
    res[i*N+j] = aux;
  }
  res[(i+1)*N-1] = 0;
}
for (int j = 1; j < N; j++) {
  res[(M-1)*N+j] = 0;
}
\`\`\`

Solo uno de los procesos tiene acceso a disco y pantalla. Por tanto, este será el único proceso que puede ejecutar las funciones \`inicializa\` y \`escribeResultado\`. Además, M es siempre múltiplo del número de procesos.

Contesta DE FORMA RAZONADA las siguientes preguntas.

MPI disponible:

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) **Descomposición de dominio** con asignación **estática por bloques de filas**. Cada proceso necesita sus M/P filas más la primera fila del siguiente bloque (para calcular los determinantes 2×2 en el borde). Solo el último proceso no necesita fila extra. También podría hacerse por columnas, pero sería más complejo.

(b) Implementación MPI con colectivas:

\`\`\`c
float *A, *res, *myA, *myres;
float aux;
MPI_Status status;

myA = (float *)malloc(sizeof(float) * (M/P + 1) * N);
myres = (float *)malloc(sizeof(float) * M/P * N);

if (!rank) {
  A = (float *)malloc(sizeof(float) * M * N);
  res = (float *)malloc(sizeof(float) * M * N);
  inicializa(A);
}

MPI_Scatter(A, M/P * N, MPI_FLOAT, myA, M/P * N, MPI_FLOAT, 0, MPI_COMM_WORLD);

if (rank > 0)
  MPI_Send(myA, N, MPI_FLOAT, rank - 1, 0, MPI_COMM_WORLD);

int numFilas = M/P - 1;
if (rank < P - 1) {
  MPI_Recv(&myA[M/P * N], N, MPI_FLOAT, rank + 1, 0, MPI_COMM_WORLD, &status);
  numFilas = M/P;
}

for (int i = 0; i < numFilas; i++) {
  for (int j = 1; j < N - 1; j++) {
    aux = myA[i*N+j] * myA[(i+1)*N+j+1] - myA[i*N+j+1] * myA[(i+1)*N+j];
    myres[i*N+j] = aux;
  }
  myres[i*N+j] = 0; // res[(i+1)*N-1] = 0
}

MPI_Gather(myres, M/P * N, MPI_FLOAT, res, M/P * N, MPI_FLOAT, 0, MPI_COMM_WORLD);

if (!rank) {
  for (int j = 1; j < N; j++)
    res[(M-1)*N+j] = 0;
  escribeResultado(res);
}
\`\`\`

(c) Distribución punto a punto en anillo:

\`\`\`c
int bloqueFilas = M/P * N;

if (!rank)
  MPI_Send(&A[bloqueFilas], bloqueFilas * (P - 1), MPI_FLOAT, 1, 0, MPI_COMM_WORLD);

if (rank == P - 1)
  MPI_Recv(myA, bloqueFilas, MPI_FLOAT, P - 2, 0, MPI_COMM_WORLD, &status);

if (rank > 0 && rank < P - 1) {
  MPI_Recv(myA, bloqueFilas * (P - rank), MPI_FLOAT, rank - 1, 0, MPI_COMM_WORLD, &status);
  MPI_Send(&myA[bloqueFilas], bloqueFilas * (P - rank - 1), MPI_FLOAT, rank + 1, 0, MPI_COMM_WORLD);
}
\`\`\`

Sí, habría que modificar el tamaño de myA: en el apartado (b) era M/P+1 filas, pero aquí los procesos intermedios necesitan almacenar también los datos de los procesos siguientes (myA debe ser de tamaño (P-rank)×M/P×N) para poder reenviarlos.`,
    explanation:
      "Cada proceso necesita acceso a su bloque de filas más una fila extra del vecino para calcular los determinantes en la frontera. En (b), esto se resuelve con Scatter + envío punto a punto de la fila de solape. En (c), con topología en anillo, el proceso 0 envía todo al 1, que extrae su parte y reenvía el resto, y así sucesivamente en cascada — esto requiere más memoria en los procesos intermedios.",
  },

  // ================================================================
  // 2025-06 (Mayo 2025 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2025-06_q1",
    exam: "2025-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    repeated: true,
    question: `Un autobús circula por una línea con un cierto número de paradas. La línea es circular, es decir, después de la última parada se vuelve a la primera. Puede suponerse que solo circula un autobús en la línea.

El autobús, al llegar a una parada, avisa a quien esté esperando para subir y bajar, y espera a que los pasajeros suban y bajen del bus. Una vez ha terminado la parada cambia a la siguiente estación.

El código de los threads pasajeros se proporciona como referencia. Implemente la función \`bus\`.

\`\`\`c
struct bus_line {
  int current_stop; // Current stop
  int total_stops;  // Total number of stops
  pthread_mutex_t m;
  int get_off[STOPS]; // Number of passengers that want leave at that stop
  int load[STOPS];    // Number of passengers that want to enter at that stop
  pthread_cond_t stop[STOPS];
  pthread_cond_t loading;
};

void bus(struct bus_line *bus) {
  ...
}

void passenger(struct bus_line *bus, int from, int to) {
  pthread_mutex_lock(&bus->m);
  if (bus->current_stop != from) {
    bus->load[from]++;
    pthread_cond_wait(&bus->load[from], &bus->m);
    bus->load[from]--;
    if (bus->load[from] == 0) pthread_cond_signal(&bus->loading);
  }
  bus->get_off[to]++;
  pthread_cond_wait(&bus->stop[to], &bus->m);
  bus->get_off[to]--;
  if (bus->get_off[to] == 0) pthread_cond_signal(&bus->loading);
  pthread_mutex_unlock(&bus->m);
}
\`\`\``,
    correctAnswer: `\`\`\`c
void bus(struct bus_line *bus) {
  pthread_mutex_lock(&bus->m);
  while (true) {
    pthread_cond_broadcast(&bus->get_off[bus->current_stop]);
    pthread_cond_broadcast(&bus->load[bus->current_stop]);
    while (bus->get_off[bus->current_stop] > 0 || bus->load[bus->current_stop] > 0) {
      pthread_cond_wait(&bus->loading, &bus->m);
    }
    bus->current_stop = (bus->current_stop + 1) % bus->total_stops;
  }
  pthread_mutex_unlock(&bus->m);
}
\`\`\``,
    explanation:
      "El bus hace broadcast para despertar a todos los pasajeros que quieren bajar y subir en la parada actual. Luego espera con `pthread_cond_wait` hasta que no quede nadie que quiera bajar o subir (`get_off[i] == 0 && load[i] == 0`). Cuando termina, avanza a la siguiente parada circular.",
  },

  {
    id: "2025-06_q2",
    exam: "2025-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.5,
    question: `Implemente, utilizando los mutex de la librería pthread, un tipo de mutex donde en caso de que tengan que esperar los threads lo bloqueen respetando el orden en el que llegan a la operación \`lock\`. Cuando el mutex se libere, solo debería despertarse un thread como máximo.

Para la solución puede usar la cola ya implementada en las funciones \`q_init\`, \`q_insert\` y \`q_remove\`.

\`\`\`c
typedef {
  ...
} ord_mutex_t;

void q_init(queue q);
void q_insert(queue q, void *);
void *q_remove(queue q); // returns NULL if the queue is empty

void ord_mutex_init(ord_mutex_t *m) {
  ...
}

void ord_mutex_lock(ord_mutex_t *m) {
  ...
}

void ord_mutex_unlock(ord_mutex_t *m) {
  ...
}
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_mutex_init(pthread_mutex_t *m, pthread_mutex_attr_t *attr);
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_trylock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_init(pthread_cond_t *c, pthread_cond_attr_t *attr);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `\`\`\`c
typedef {
  pthread_mutex_t m;
  bool locked;
  queue q;
} ord_mutex_t;

void ord_mutex_init(ord_mutex_t *m) {
  pthread_mutex_init(&m->m, NULL);
  m->locked = false;
  q_init(m->q);
}

void ord_mutex_lock(ord_mutex_t *m) {
  pthread_cond_t c;

  pthread_mutex_lock(&m->m);
  if (m->locked) {
    pthread_cond_init(&c, NULL);
    q_insert(m->q, &c);
    pthread_cond_wait(&c, &m->m);
  }
  m->locked = true;
  pthread_mutex_unlock(&m->m);
}

void ord_mutex_unlock(ord_mutex_t *m) {
  pthread_cond_t *c;

  pthread_mutex_lock(&m->m);
  if ((c = q_remove(m->q)) != NULL) {
    pthread_cond_signal(c);
  } else {
    m->locked = false;
  }
  pthread_mutex_unlock(&m->m);
}
\`\`\``,
    explanation:
      "Cada thread que no puede adquirir el mutex crea una variable de condición local, la inserta en la cola y espera en ella. Cuando se libera el mutex, se extrae el primer elemento de la cola (FIFO) y se hace signal a su condición, despertando exactamente un thread y respetando el orden de llegada.",
  },

  {
    id: "2025-06_q3",
    exam: "2025-06",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.5,
    repeated: true,
    question: `El siguiente módulo permite crear una secuencia de procesos donde cada uno conoce el PID del siguiente.

\`\`\`erlang
-module(line).
-export([start/1, size/1]).

start(N) -> spawn(?MODULE, init, [N-1]).

size(First) -> ...

init(0) -> loop(none);
init(N) ->
  Next = spawn(?MODULE, init, [N-1]),
  loop(Next).

loop(Next) ->
  receive
    ...
  end,
  loop(Next).
\`\`\`

Implemente la función \`size/1\`, que dado el PID del primer proceso devuelva el número de procesos de la línea. Las funciones \`start/1\` e \`init/1\` no pueden modificarse.`,
    correctAnswer: `\`\`\`erlang
-module(line).
-export([start/1, init/1, size/1]).

start(N) -> spawn(?MODULE, init, [N-1]).

size(First) ->
  First ! {get_size, self(), 0},
  receive {get_size_reply, N} -> N end.

init(0) -> loop(none);
init(N) ->
  Next = spawn(?MODULE, init, [N-1]),
  loop(Next).

loop(Next) ->
  receive
    {get_size, From, N} ->
      case Next of
        none -> From ! {get_size_reply, N + 1};
        _    -> Next ! {get_size, From, N + 1}
      end
  end,
  loop(Next).
\`\`\``,
    explanation:
      "Se envía un mensaje `get_size` al primer proceso con un contador inicial de 0. Cada proceso incrementa el contador y reenvía el mensaje al siguiente proceso. Cuando el último proceso (cuyo `Next` es `none`) recibe el mensaje, devuelve el resultado al proceso original. Es un patrón de paso de mensajes en cadena.",
  },

  // --- Paralelismo ---

  {
    id: "2025-06_q4",
    exam: "2025-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Determina qué tipo de descomposición(es) y asignación(es) de tareas aplicarías.",
      "(b) [1p] Si en una ejecución con asignación estática el tiempo de leer son 5 s, el de resumir 25 s y en la fase de análisis los PCs requieren entre 9 y 70 s, con una media de 40 s, calcula: aceleración, eficiencia paralela, coste y sobrecarga.",
      "(c) [0.25p] Supón que un análisis muy rápido permitiese calcular el tiempo que requerirá procesar cada alegación. ¿Cambiarías la descomposición y/o la asignación?",
      "(d) [0.5p] Si llamamos Tᵢ al número de segundos de análisis para las alegaciones asignadas al PC Pᵢ y el tiempo requerido para que P₀ se las envíe a Pᵢ es Tᵢ/10, los tiempos de leer y resumir son de 1 s cada una, y no hay ningún coste adicional, ¿cuál es el tiempo total de ejecución suponiendo que todas las comunicaciones son bloqueantes?",
      "(e) [0.25p] Si se distribuyen las alegaciones estáticamente entre los 8 PCs cíclicamente por bloques de 3 alegaciones, indica en qué PC y en qué posición relativa dentro del vector local de alegaciones estaría la alegación 58.",
    ],
    question: `Tras la reintroducción del servicio militar obligatorio, alumnos de la FIC se hacen un fichero de N alegaciones de reclutas de otros años que evitaron su alistamiento. A fin de deducir las características más efectivas de las alegaciones diseñan el siguiente algoritmo:

\`\`\`c
Alegacion A[N];          /* vector de alegaciones */
Caracteristica C[N][M];  /* C[i][j]=característica j en la alegación i */
leer(A);
for (i = 0; i < N; i++)
  analizar(A[i], C[i]);
resumir(C);
\`\`\`

donde analizar cada alegación para cubrir su vector de características requiere un tiempo costoso, muy variable e impredecible. Se dispone de 8 PCs, de los cuales sólo uno tiene el fichero de datos y conexión a los demás, siendo las comunicaciones muy rápidas.

Responde RAZONADAMENTE a las siguientes cuestiones.`,
    correctAnswer: `(a) Hay una **descomposición funcional** con las tareas de lectura, análisis y resumen. La segunda tarea a su vez tiene una **descomposición de dominio** sobre el vector de alegaciones y la matriz de características, esta última por filas. La asignación de tareas durante el análisis es **dinámica centralizada** (maestro-esclavo) ya que sólo un PC puede comunicarse con todos los demás y hay un desequilibrio de carga potencial muy importante si se hace una distribución estática sin conocer de antemano el coste de procesamiento.

(b) Tiempo secuencial = 5 + (40 × 8) + 25 = 350 s. Tiempo paralelo = 5 + 70 + 25 = 100 s.
- Aceleración = 350 / 100 = **3,5**
- Eficiencia = 3,5 / 8 = **44%**
- Coste = 100 × 8 = **800 s**
- Sobrecarga = 800 − 350 = **450 s**

(c) La descomposición del análisis seguiría siendo de dominio, pero se haría una **asignación estática** al conocer el coste. Lo más sencillo para equilibrar la carga sería cíclica tras ordenar las alegaciones por su coste de procesamiento. También podría hacerse un reparto irregular con bloques consecutivos de distinto tamaño pero con costes similares.

(d) Las partes secuenciales (leer y resumir) tardan 2 s. El PC Pᵢ (1 ≤ i ≤ 7) inicia su análisis después de que se hayan enviado sus bloques, por lo que acaba tras (∑ⱼ₌₁ⁱ Tⱼ) / 10 + Tᵢ segundos. El PC 0 finaliza tras (∑ⱼ₌₁⁷ Tⱼ) / 10 + T₀. El tiempo total es: 2 + max(max{(∑ⱼ₌₁ⁱ Tⱼ)/10 + Tᵢ | 1 ≤ i ≤ 7}, (∑ⱼ₌₁⁷ Tⱼ)/10 + T₀)

(e) La alegación 58 está en el bloque ⌊58/3⌋ = 19, el cual está en el PC 19 mod 8 = **3**. Dentro de su bloque, posición relativa = 58 mod 3 = **1**. Antes del bloque 19 hay ⌊19/8⌋ = 2 bloques locales de 3 alegaciones cada uno, por tanto la posición local es 2 × 3 + 1 = **7**.`,
    explanation:
      "La clave es distinguir entre descomposición funcional (tareas secuenciales: leer, analizar, resumir) y de dominio (datos paralelizables: las alegaciones). Con tiempo de análisis impredecible, la asignación dinámica centralizada minimiza el desbalance. El cómputo del speedup usa la ley de Amdahl: el tiempo paralelo está limitado por la tarea más larga.",
  },

  {
    id: "2025-06_q5",
    exam: "2025-06",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    question: `La empresa de logística Fast&Furious distribuye periódicamente P tipos de productos a T tiendas de toda Galicia. Se presenta el algoritmo que usan actualmente para calcular el precio total de los productos distribuidos a cada tienda (ps), y también la suma del peso de todos los productos del mismo tipo (wp). También, para un subconjunto de tiendas, imprime el precio que se les debe cobrar.

\`\`\`c
int pedido[T][P], tienda_id;
float pesos[P], precios[P], wp[P], ps[T];
inicializa_datos(pedido, pesos, precios);

// NOTA: Reparto de datos
memset(ps, 0, T * sizeof(float));
memset(wp, 0, P * sizeof(float));

// NOTA: Paralelizar bucle
for (i = 0; i < P; i++) {
  for (k = 0; k < T; k++) {
    wp[i] += pesos[i] * pedido[k][i];
    ps[k] += precios[i] * pedido[k][i];
  }
}

while (read(&tienda_id)) {
  printf("Los productos de la tienda %d cuestan %f euros\\n",
         tienda_id, ps[tienda_id]);
}

// NOTA: Recoleccion de resultados
imprime_resultados(wp, ps);
\`\`\`

- La matriz \`pedido\` de tamaño T × P contiene las cantidades de cada producto solicitadas por cada tienda. T y P no tienen por qué ser un múltiplo del número de procesos.
- El peso unitario de cada uno de los P tipos de producto se almacena en \`pesos\`, y el precio en \`precios\`.
- \`inicializa_datos()\` e \`imprime_resultados()\` sólo las debe llamar el proceso 0.
- \`read()\` la pueden llamar todos los procesos y devuelve la misma secuencia de valores para todos ellos.
- \`printf\` la puede ejecutar cualquier proceso, y debe ejecutarse antes de la recolección de los resultados.

Diseña e implementa la paralelización del algoritmo propuesto siguiendo las especificaciones anteriores. Comenta y justifica las decisiones tomadas. Se puede asumir que el entorno MPI ya está inicializado con las variables \`rango\` y \`numprocs\`.

MPI disponible:

\`\`\`c
int MPI_Barrier(MPI_Comm comm)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
                void *recvbuf, int recvcnt, MPI_Datatype recvtype,
                int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
               void *recvbuf, int recvcount, MPI_Datatype recvtype,
               int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt,
               MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `**Reparto por filas de la matriz pedido:**

\`\`\`c
float pesos[P], precios[P];
float wp[P];

int filas = ceil(T / numprocs);
int filas_alloc = rango ? filas : filas * numprocs;
int filas_ef = rango < (numprocs - 1) ? filas : T - filas * (numprocs - 1);

float pedido[filas_alloc][P];
float ps[filas_alloc];

if (!rango)
  inicializa_datos(pedido, pesos, precios);

MPI_Scatter(pedido, filas * P, MPI_INT, pedido, filas * P, MPI_INT, 0, MCW);
MPI_Bcast(pesos, P, MPI_FLOAT, 0, MCW);
MPI_Bcast(precios, P, MPI_FLOAT, 0, MCW);

memset(ps, 0, filas * sizeof(float));
memset(wp, 0, P * sizeof(float));

for (i = 0; i < P; i++) {
  for (k = 0; k < filas_ef; k++) {
    wp[i] += pesos[i] * pedido[k][i];
    ps[k] += precios[i] * pedido[k][i];
  }
}

int tienda_id;
while (read(&tienda_id)) {
  if (rango == tienda_id / filas)
    printf("Los productos de la tienda %d cuestan %f euros\\n",
           tienda_id, ps[tienda_id % filas]);
  MPI_Barrier(MPI_COMM_WORLD);
}

MPI_Gather(ps, filas, MPI_FLOAT, ps, filas, MPI_FLOAT, 0, MCW);
MPI_Reduce(wp, wp, P, MPI_FLOAT, MPI_SUM, 0, MCW);

if (!rango)
  imprime_resultados(wp, ps);
\`\`\`

**Decisiones clave:**
- Reparto por filas de la matriz pedido (Scatter), ya que cada proceso necesita calcular filas completas de ps
- Broadcast de pesos y precios (todos los procesos los necesitan completos)
- Padding con \`filas_ef\` para manejar T no múltiplo de numprocs
- Cada proceso tiene ps parcial (Gather) y wp parcial (Reduce con MPI_SUM)
- Para el printf: cada proceso comprueba si \`tienda_id\` pertenece a su bloque local calculando \`tienda_id / filas\` y la posición local como \`tienda_id % filas\``,
    explanation:
      "La paralelización más natural es por filas (dominio sobre tiendas). Cada proceso recibe un bloque de filas de la matriz pedido vía Scatter. Necesita los arrays pesos y precios completos (Bcast). Calcula sumas parciales de ps (por fila) y wp (por columna). El ps requiere Gather (cada proceso tiene una parte independiente) y el wp requiere Reduce (todos contribuyen parcialmente a los mismos elementos). El printf debe ejecutarse antes de Gather/Reduce.",
  },

  // ================================================================
  // 2025-07 (Julio 2025 — Convocatoria extraordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2025-07_q1",
    exam: "2025-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    repeated: true,
    question: `Vamos a simular una cola donde cada thread representa una persona que ocupa una posición. Cuando a una persona le toca el turno recibe el aviso de la anterior, hace la acción por la que esperaba turno, y avisa al siguiente. Cada thread solo debe despertar a uno, y no se puede usar una estructura de datos de tipo cola o lista.

Para avisar al siguiente cada thread puede guardar una condición en la estructura compartida que es usada por el siguiente thread para esperar por el aviso. Antes de esperar ese thread sustituye la condición por la suya propia para a su vez poder avisar al thread que venga después de él.

Si no hay ningún thread activo la condición debería estar a NULL.

\`\`\`c
struct wait_row {
  int waiting;            // Number of threads in the queue
  pthread_cond_t *c;      // should be NULL if there is no one waiting or doing the action
  pthread_mutex_t *m;
};

void person(struct wait_row *wr) {
  ...
  act();
  ...
}
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_mutex_init(pthread_mutex_t *m, pthread_mutex_attr_t *attr);
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_trylock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_init(pthread_cond_t *c, pthread_cond_attr_t *attr);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
pthread_t pthread_self();
\`\`\``,
    correctAnswer: `\`\`\`c
struct wait_row {
  int waiting;            // Number of threads in the queue
  pthread_cond_t *c;      // should be NULL if there is no one waiting or doing the action
};

void person(struct wait_row *wr) {
  pthread_cond_t next;
  pthread_cond_t *cur;
  pthread_cond_init(&next, NULL);
  pthread_mutex_lock(&wr->m);
  if (wr->c != NULL) {
    waiting++;
    cur = wr->c;
    wr->c = next;
    pthread_cond_wait(cur, &wr->m);
    waiting--;
  }
  pthread_mutex_unlock(&wr->m);
  act();
  pthread_mutex_lock(&wr->m);
  if (wr->waiting > 0)
    pthread_cond_signal(&wr->next);
  else
    wr->c = NULL;
  pthread_mutex_unlock(&wr->m);
}
\`\`\``,
    explanation:
      "Se implementa una cola de espera encadenada usando variables de condición. Cada thread crea su propia variable de condición. Si ya hay alguien en la cola (c != NULL), el thread guarda la condición actual, establece la suya como la nueva cabeza de la cola, y espera en la condición anterior. Cuando termina act(), si hay threads esperando, despierta al siguiente con signal; si no, pone c a NULL para que el siguiente thread que llegue sepa que no hay nadie esperando.",
  },

  {
    id: "2025-07_q2",
    exam: "2025-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.5,
    question: `Implemente, utilizando los mutex de la librería pthread, una barrera que empareje a los threads de dos tipos A y B en orden de llegada. Esto es, el primer thread en llamar a \`pair_barrier_a\` y el primer thread en llamar a \`pair_barrier_b\` se emparejan, y así sucesivamente. Si un thread llega a la barrera y no hay threads del otro tipo tiene que esperar. Las funciones \`pair_barrier\` deberían devolver el id del thread con el que se ha emparejado.

Para la solución puede usar la cola ya implementada en las funciones \`q_init\`, \`q_insert\` y \`q_remove\`.

\`\`\`c
typedef {
  ...
} pair_barrier_t;

void q_init(queue q);
void q_insert(queue q, void *);
void *q_remove(queue q); // returns NULL if the queue is empty

void pair_barrier_init(pair_barrier_t *pb) {
  ...
}

pthread_t pair_barrier_a(pair_barrier_t *pb) {
  ...
}

pthread_t pair_barrier_b(pair_barrier_t *pb) {
  ...
}
\`\`\``,
    correctAnswer: `\`\`\`c
typedef {
  pthread_mutex_t m;
  queue qa, qb;
} pair_barrier_t;

typedef {
  pthread_t my_id;
  pthread_t other_id;
  pthread_cond_t c;
} thr_wait_info;

void pair_barrier_init(pair_barrier_t *pb) {
  pthread_mutex_init(&pb->m, NULL);
  q_init(pb->qa);
  q_init(pb->qb);
}

pthread_t pair_barrier_a(pair_barrier_t *pb) {
  thr_wait_info *other_inf;
  pthread_t other_id;

  pthread_mutex_lock(&pb->m);
  if ((other_inf = q_remove(pb->qb)) == NULL) {
    thr_wait_info my_inf;
    pthread_cond_init(&my_inf.c, NULL);
    my_inf.my_id = pthread_self();
    q_insert(pb->qa, &my_inf);
    pthread_cond_wait(&my_inf.c, &pb->m);
    other_id = my_inf.other_id;
  } else {
    other_inf->other_id = pthread_self();
    pthread_cond_signal(&other_inf->c);
    other_id = other_inf->my_id;
  }
  pthread_mutex_unlock(&pb->m);

  return other_id;
}

// pair_barrier_b es simétrico intercambiando qa y qb
pthread_t pair_barrier_b(pair_barrier_t *pb) {
  // Same as pair_barrier_a, changing qa for qb and viceversa
}
\`\`\``,
    explanation:
      "Se usan dos colas, una para cada tipo de thread. Cuando llega un thread A, comprueba si hay algún B esperando en la cola de B. Si lo hay, lo desempareja y le devuelve su ID mediante signal. Si no hay B esperando, A se inserta en su propia cola y espera. La estructura thr_wait_info almacena el ID propio y un campo para que el otro thread escriba su ID, más la variable de condición para la espera.",
  },

  {
    id: "2025-07_q3",
    exam: "2025-07",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.5,
    repeated: true,
    question: `El siguiente módulo permite crear una secuencia de procesos donde cada uno conoce el PID del siguiente.

\`\`\`erlang
-module(line).
-export([start/1, get_pids/3]).

start(N) -> spawn(?MODULE, init, [N-1]).

get_pids(First, A, B) ->
  ...

init(0) -> loop(none);
init(N) ->
  Next = spawn(?MODULE, init, [N-1]),
  loop(Next).

loop(Next) ->
  receive
    ...
  end,
  loop(Next).
\`\`\`

Implemente la función \`get_pids/3\`, que dado el PID del primer proceso, y dos posiciones A y B en la línea, devuelve los PIDs de los procesos entre las posiciones A y B. Por ejemplo, \`get_pids(First, 0, 1)\` devolvería una lista con los dos primeros procesos.

Puede suponer que dados N procesos en la línea, 0 ≤ A ≤ B < N. Las funciones \`start/1\` e \`init/1\` no pueden modificarse.`,
    correctAnswer: `\`\`\`erlang
-module(line).
-export([start/1, get_pids/3]).

start(N) -> spawn(?MODULE, init, [N-1]).

get_pids(First, A, B) ->
  First ! {get_pids_request, A, B, self()},
  receive
    {get_pids_reply, Pids} -> Pids
  end.

init(0) -> loop(none);
init(N) ->
  Next = spawn(?MODULE, init, [N-1]),
  loop(Next).

loop(Next) ->
  receive
    {get_pids_request, 0, 0, From} ->
      From ! {get_pids_reply, [self()]};
    {get_pids_request, 0, B, From} ->
      Next ! {get_pids, B - 1, [self()], From};
    {get_pids_request, A, B, From} ->
      Next ! {get_pids_request, A - 1, B - 1, From};
    {get_pids, 0, Pids, From} ->
      From ! {get_pids_reply, [self() | lists:reverse(Pids)]};
    {get_pids, B, Pids, From} ->
      Next ! {get_pids, B - 1, [self() | Pids], From}
  end,
  loop(Next).
\`\`\``,
    explanation:
      "Se envía una petición al primer proceso con el rango [A, B]. Cada proceso decrementa A y B al reenviar. Cuando A = 0 y B = 0, el proceso se incluye a sí mismo y responde. Cuando A = 0 pero B > 0, el proceso se incluye y empieza la fase de recolección. Los mensajes get_pids con B decreciente recolectan los PIDs en orden y finalmente se devuelven al proceso original con lists:reverse para mantener el orden correcto.",
  },

  // --- Paralelismo ---

  {
    id: "2025-07_q4",
    exam: "2025-07",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    image: getImage(imageMap, "task-graph-2025-07.jpeg"),
    explanationImage: getImage(imageMap, "task-graph-critical-path-2025-07.jpeg"),
    subquestions: [
      "(a) [0.25p] Determina qué tipo de descomposición se ha utilizado.",
      "(b) [0.75p] Identifica el camino crítico, el grado máximo y el grado medio de concurrencia.",
      "(c) [0.5p] Disponemos de 4 computadores interconectados para ejecutar este algoritmo en paralelo. Cualquier comunicación entre dos computadores tiene un coste fijo de 1 segundo, pero puede solaparse con la computación de otras tareas. Determina la asignación de tareas óptima y utilizando el menor número de recursos.",
      "(d) [0.4p] Para la asignación escogida, calcula: aceleración, eficiencia paralela, coste y sobrecarga.",
      "(e) [0.6p] Considera una tarea paralelizable cuyo tiempo de ejecución depende del tamaño de los datos de entrada (N). En la tabla de abajo se muestra el tiempo que tardó la tarea (en segundos) al ejecutarla con datos de diferentes tamaños sobre diferente número de procesos. Determina si esta paralelización presenta escalabilidad fuerte y/o escalabilidad débil.",
    ],
    question: `Un programa se ha descompuesto en tareas de acuerdo al siguiente grafo de dependencias estáticas. Cada nodo tiene un peso que se corresponde con el tiempo de ejecución en segundos de dicha tarea.

Responde RAZONADAMENTE a las siguientes cuestiones:

| N   | p=1 | p=2 | p=4 | p=8 | p=16 |
| --- | --- | --- | --- | --- | ---- |
| 5   | 7.0 | 4.0 | 3.0 | 4.0 | 5.0  |
| 10  | 11.0| 6.0 | 6.0 | 7.0 | 7.0  |
| 20  | 22.0| 12.0| 6.0 | 6.0 | 7.0  |
| 40  | 43.0| 21.0| 11.0| 5.0 | 8.0  |
| 80  | 85.0| 45.0| 23.0| 11.0| 6.0  |`,
    correctAnswer: `(a) Es una **descomposición funcional**.

(b) El camino crítico se compone de las tareas T1, T4, T6, T8 y T10, con una duración de **13 segundos**. El **grado máximo de concurrencia es 4** y el **grado medio es 22/13 ≈ 1.69**.

(c) Como el coste de comunicaciones es alto (1s por comunicación), interesa minimizarlas y asignar tareas consecutivas a un mismo proceso. El camino crítico se asigna a un mismo proceso para evitar comunicaciones en la ruta más larga. Con una buena asignación se puede conseguir el óptimo con **3 procesos** en lugar de 4.

(d) Con la asignación propuesta, la duración del algoritmo es de **15 segundos** (2 comunicaciones no solapables). Tiempo secuencial = 22 segundos.
- Aceleración = 22/15 = **1.47**
- Eficiencia = 1.47/3 = **49%**
- Coste = 15 × 3 = **45 s**
- Sobrecarga = 45 − 22 = **23 s**

(e) **Escalabilidad fuerte:** Observando una fila (N constante), a partir de cierto número de procesos el tiempo se mantiene o empeora → mala escalabilidad fuerte para N bajo. Sin embargo, para N=80 se observa mejora con más procesos.
**Escalabilidad débil:** Manteniendo la carga por proceso constante (p=1 N=5, p=2 N=10, p=4 N=20, p=8 N=40, p=16 N=80), el tiempo de ejecución es aproximadamente constante y cercano a N/p → la eficiencia paralela es alta → **buena escalabilidad débil**.`,
    explanation:
      "La descomposición funcional se identifica porque cada nodo es una tarea distinta, no una partición de datos. El camino crítico determina el tiempo mínimo de ejecución. La asignación debe minimizar comunicaciones en el camino crítico. La escalabilidad fuerte evalúa speedup con tamaño fijo al añadir procesos; la débil evalúa mantener tiempo constante al escalar problema y procesos proporcionalmente.",
  },

  {
    id: "2025-07_q5",
    exam: "2025-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Sabiendo que está garantizado que siempre se va a ejecutar con al menos dos procesos, ¿detectas algún problema potencial en la implementación? En ese caso, ¿cuál?",
      "(b) [2.0p] Implementa el algoritmo propuesto paralelizado pero siguiendo un reparto de tareas estático. Se recomienda comentar y justificar las decisiones tomadas.",
    ],
    question: `El siguiente programa implementa un algoritmo con un reparto de tareas dinámico en el que la función \`read(int *num, int **vec)\` sólo se puede ejecutar en el proceso 0 y lee de disco un vector de números enteros mayores que 0 que hay que procesar. La función recibe dos argumentos a través de los cuales devuelve el número de datos leídos y un puntero a una zona de memoria reservada con \`malloc\` donde los ha almacenado.

\`\`\`c
int main(int argc, char **argv) {
  MPI_Status s;
  int rank, size, N, *v, i = 1, z = 0;
  double r = 0, tmp;

  MPI_Init(&argc, &argv);
  MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  MPI_Comm_size(MPI_COMM_WORLD, &size);

  if (!rank) {
    read(&N, &v);
    for (i = 0; i < (size - 1); i++)
      MPI_Send(&v[i], 1, MPI_INT, i + 1, 0, MPI_COMM_WORLD);
    while (i < N + (size - 1)) {
      MPI_Recv(&tmp, 1, MPI_DOUBLE, MPI_ANY_SOURCE, 0, MPI_COMM_WORLD, &s);
      r += tmp;
      MPI_Send(((i < N) ? &v[i] : &z), 1, MPI_INT, s.MPI_SOURCE, 0, MPI_COMM_WORLD);
      i++;
    }
    printf("Result: %lf\\n", r);
  } else {
    while (i) {
      MPI_Recv(&i, 1, MPI_INT, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
      if (i) {
        tmp = f(i);
        MPI_Send(&tmp, 1, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD);
      }
    }
  }

  MPI_Finalize();
  return 0;
}
\`\`\`

Se puede asumir que el entorno MPI ya está inicializado y existen las variables \`rank\` y \`size\`. MPI disponible:

\`\`\`c
int MPI_Barrier(MPI_Comm comm)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
                void *recvbuf, int recvcnt, MPI_Datatype recvtype,
                int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
               void *recvbuf, int recvcount, MPI_Datatype recvtype,
               int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt,
               MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) Sí, hay un problema. El código asume que va a haber al menos \`size - 1\` datos a procesar, pero podría haber menos. Si N < size - 1, se intentaría acceder a posiciones fuera del vector en el envío inicial.

(b) **Reparto estático con Scatter y Reduce:**

\`\`\`c
int N, *v, i, elems;
double tmp = 0., r;

if (!rank) {
  read(&N, &v);
}

MPI_Bcast(&N, 1, MPI_INT, 0, MPI_COMM_WORLD);
elems = (N + size - 1) / size;

if (!rank) {
  if (N % size) {
    v = (int *)realloc(v, sizeof(int) * elems * size);
  }
} else {
  v = (int *)malloc(sizeof(int) * elems);
}

MPI_Scatter(v, elems, MPI_INT, v, elems, MPI_INT, 0, MPI_COMM_WORLD);

if (rank == (size - 1)) {
  elems = N - elems * (size - 1);
}

for (i = 0; i < elems; i++) {
  tmp += f(v[i]);
}

MPI_Reduce(&tmp, &r, 1, MPI_DOUBLE, MPI_SUM, 0, MPI_COMM_WORLD);

if (!rank) {
  printf("Result: %lf\\n", r);
}

MPI_Finalize();
\`\`\`

**Decisiones clave:**
- Se usa \`MPI_Bcast\` para que todos los procesos conozcan N
- Se calcula \`elems = (N + size - 1) / size\` (división con redondeo hacia arriba) para el tamaño de bloque
- El proceso 0 hace \`realloc\` con padding para que Scatter funcione cuando N no es múltiplo de size
- Se usa \`MPI_Scatter\` para repartir los datos equitativamente
- El último proceso ajusta \`elems\` para no procesar elementos de padding
- Cada proceso aplica \`f()\` a sus elementos locales y acumula en \`tmp\`
- Se usa \`MPI_Reduce\` con \`MPI_SUM\` para combinar los resultados parciales en el proceso 0`,
    explanation:
      "El código original tiene un bug: el bucle inicial envía size-1 elementos asumiendo que N >= size-1. La solución estática usa Scatter para distribuir bloques contiguos equitativamente, con padding si N no es múltiplo de size, y Reduce para sumar los resultados parciales. Esto elimina la comunicación punto a punto del esquema dinámico maestro-esclavo.",
  },

  // ================================================================
  // 2018-06 (Mayo 2018 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2018-06_q1",
    exam: "2018-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Given the implementation of a circular-array queue:

\`\`\`c
typedef struct _queue {
  int size;            // max queue size
  int used;            // current number of elements
  int first;           // index of the first element
  void **data;         // element array
  pthread_mutex_t *lock;
} *queue;

int q_insert(queue q, void *elem) {
  pthread_mutex_lock(q->lock);
  if (q->size == q->used) {
    pthread_mutex_unlock(q->lock);
    return 0;
  }
  q->data[(q->first + q->used) % q->size] = elem;
  q->used++;
  pthread_mutex_unlock(q->lock);
  return 1;
}

void *q_remove(queue q) {
  void *res;
  pthread_mutex_lock(q->lock);
  if (q->used == 0) {
    pthread_mutex_unlock(q->lock);
    return NULL;
  }
  res = q->data[q->first];
  q->first = (q->first + 1) % q->size;
  q->used--;
  pthread_mutex_unlock(q->lock);
  return res;
}

void q_run_when_gt(queue q, void (*f)(queue), int size) {
  ...
}
\`\`\`

Implement \`q_run_when_gt(queue q, void (*f)(queue), int size)\`, which calls function \`f\` passing queue \`q\` as a parameter when the queue \`q\` has more than \`size\` elements. The function \`f\` only needs to be called once per invocation of \`q_run_when_gt\`. The function \`f\` must be called with the queue's mutex held. The queue implementation may be modified if necessary.

\`\`\`c
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_mutex_lock(pthread_mutex_t *mtx);
int pthread_mutex_unlock(pthread_mutex_t *mtx);
\`\`\``,
    correctAnswer: `Add a condition variable and a flag to the queue:

\`\`\`c
typedef struct _queue {
  int size;
  int used;
  int first;
  void **data;
  pthread_mutex_t *lock;
  pthread_cond_t c;
  int notified;   // flag: whether f has already been called
} *queue;

void q_run_when_gt(queue q, void (*f)(queue), int size) {
  pthread_mutex_lock(q->lock);
  q->notified = 0;
  while (q->used <= size) {
    pthread_cond_wait(&q->c, q->lock);
  }
  if (!q->notified) {
    f(q);
    q->notified = 1;
  }
  pthread_mutex_unlock(q->lock);
}
\`\`\`

Also modify \`q_insert\` to signal the condition variable when elements exceed threshhold would be checked by the waiter after returning from \`pthread_cond_wait\`. Alternatively, signal after every insert:

\`\`\`c
int q_insert(queue q, void *elem) {
  pthread_mutex_lock(q->lock);
  if (q->size == q->used) {
    pthread_mutex_unlock(q->lock);
    return 0;
  }
  q->data[(q->first + q->used) % q->size] = elem;
  q->used++;
  pthread_cond_signal(&q->c);
  pthread_mutex_unlock(q->lock);
  return 1;
}
\`\`\``,
    explanation:
      "Add a condition variable and a notified flag to the queue. q_run_when_gt waits while used <= size, then calls f with the lock held and sets notified to prevent double-calling. q_insert signals the condition after adding an element so the waiter re-checks the condition.",
  },

  {
    id: "2018-06_q2",
    exam: "2018-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.75,
    question: `Starting from the in-class example with multiple barbers, there is a queue for customers to be served in arrival order. There are N barbers numbered from 1 to N.

The task is to modify the code so a customer can request a specific barber \`t->barber_num\`. Queue 0 is reserved for customers who don't care which barber (\`t->barber_num == 0\`).

When a barber wakes up, they first check their own specific queue, and only then check queue 0.

\`\`\`c
pthread_mutex_t m[NUM_BARBERS+1];
pthread_cond_t c[NUM_BARBERS+1];
struct queue q[NUM_BARBERS+1];

struct customer {
  pthread_cond_t wait;
  int num;
};

bool queue_is_empty(struct queue *q);
void insert_customer(struct queue *q, struct customer *customer);
struct customer *retrieve_customer(struct queue *q);
int waiting_customers;
pthread_mutex_t m_waiting;

void *barber(void *ptr) {
  struct barber_info *t = ptr;
  while (true) {
    struct customer *customer;
    pthread_mutex_lock(&m[0]);
    while (queue_is_empty(&q[0])) {
      pthread_cond_wait(&c[0], &m[0]);
    }
    customer = retrieve_customer(&q[0]);
    pthread_cond_signal(&customer->wait);
    waiting_customers--;
    pthread_mutex_unlock(&m[0]);
    cut_hair(t->barber_num, customer->num);
    free(customer);
  }
}

void *cust(void *ptr) {
  struct customer_info *t = ptr;
  struct customer *customer = malloc(sizeof(struct customer));
  int barber = t->barber_num;

  pthread_mutex_lock(&m_waiting);
  if (waiting_customers == num_chairs) {
    printf("waiting room full for customer %d\\n", t->customer_num);
    pthread_mutex_unlock(&m_waiting);
    return NULL;
  }
  pthread_mutex_unlock(&m_waiting);

  pthread_cond_init(&customer->wait, NULL);
  customer->num = t->customer_num;

  pthread_mutex_lock(&m[0]);
  insert_customer(&q[0], customer);
  pthread_cond_broadcast(&c[0]);
  waiting_customers++;
  pthread_cond_wait(&customer->wait, &m[0]);
  pthread_mutex_unlock(&m[0]);
  get_hair_cut(t->customer_num);
  return NULL;
}
\`\`\``,
    correctAnswer: `\`\`\`c
void *barber(void *ptr) {
  struct barber_info *t = ptr;
  while (true) {
    struct customer *customer;
    pthread_mutex_lock(&m[t->barber_num]);
    if (!queue_is_empty(&q[t->barber_num])) {
      customer = retrieve_customer(&q[t->barber_num]);
      pthread_cond_signal(&customer->wait);
      waiting_customers--;
      pthread_mutex_unlock(&m[t->barber_num]);
      cut_hair(t->barber_num, customer->num);
      free(customer);
      continue;
    }
    while (queue_is_empty(&q[0])) {
      pthread_cond_wait(&c[t->barber_num], &m[t->barber_num]);
    }
    customer = retrieve_customer(&q[0]);
    pthread_cond_signal(&customer->wait);
    waiting_customers--;
    pthread_mutex_unlock(&m[t->barber_num]);
    cut_hair(t->barber_num, customer->num);
    free(customer);
  }
}

void *cust(void *ptr) {
  struct customer_info *t = ptr;
  struct customer *customer = malloc(sizeof(struct customer));
  int b = t->barber_num;

  pthread_mutex_lock(&m_waiting);
  if (waiting_customers == num_chairs) {
    printf("waiting room full for customer %d\\n", t->customer_num);
    pthread_mutex_unlock(&m_waiting);
    return NULL;
  }
  pthread_mutex_unlock(&m_waiting);

  pthread_cond_init(&customer->wait, NULL);
  customer->num = t->customer_num;

  int q_idx = b ? b : 0;
  pthread_mutex_lock(&m[q_idx]);
  insert_customer(&q[q_idx], customer);
  if (b) pthread_cond_broadcast(&c[b]);
  else pthread_cond_broadcast(&c[0]);
  waiting_customers++;
  pthread_cond_wait(&customer->wait, &m[q_idx]);
  pthread_mutex_unlock(&m[q_idx]);
  get_hair_cut(t->customer_num);
  return NULL;
}
\`\`\``,
    explanation:
      "Each barber has their own queue and condition variable. The barber first checks their specific queue; if empty, waits on their condition. A customer picks the queue: specific barber (b != 0) or shared queue 0. They insert into that queue and signal the corresponding condition. This preserves the priority: barbers serve their own queue before the shared one.",
  },

  {
    id: "2018-06_q3",
    exam: "2018-06",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.25,
    image: getImage(imageMap, "chain-2018-06.jpeg"),
    question: `The module chain implements a chain of processes, where each element knows the PID of the next. Processes are numbered from N (first) to 0 (last).

The chain is created by calling \`start(N)\`, where N is the number of the first process. This function returns the PID of the first process. The function \`send(Chain, Msg)\` sends a message from the first element to the last.

An example execution:

\`\`\`text
1> C = chain:start(3).
<0.62.0>
2> chain:send(C, hola).
hola: 3 steps to go...
hola: 2 steps to go...
hola: 1 steps to go...
hola: end of chain
\`\`\`

Where the chain C has the following structure:

![chain diagram]

\`\`\`erlang
-module(chain).
-export([start/1, init/1, send/2]).

start(N) -> spawn(?MODULE, init, [N]).

send(Chain, Msg) -> Chain ! {send, Msg}.

init(0) -> final_proc_loop();
init(N) ->
  Pid = spawn(?MODULE, init, [N-1]),
  proc_loop(Pid, N).

final_proc_loop() ->
  receive
    {send, Msg} ->
      io:format("~w: end of chain~n", [Msg])
  end,
  final_proc_loop().

proc_loop(Next, N) ->
  receive
    {send, Msg} ->
      io:format("~w: ~w steps to go...~n", [Msg, N]),
      Next ! {send, Msg}
  end,
  proc_loop(Next, N).
\`\`\`

Modify the code so that messages go to the end of the chain and then come back to the beginning. The output after the modifications should be:

\`\`\`text
1> C = chain:start(3).
<0.62.0>
2> chain:send(C, hola).
hola: 3 steps to go...
hola: 2 steps to go...
hola: 1 steps to go...
hola: end of chain, going back
hola: 1 steps back...
hola: 2 steps back...
hola: 3 steps back...
\`\`\``,
    correctAnswer: `The message needs to carry both the original sender PID and a direction flag. When it reaches the end, it switches direction.

\`\`\`erlang
-module(chain).
-export([start/1, init/1, send/2]).

start(N) -> spawn(?MODULE, init, [N]).

send(Chain, Msg) ->
  Chain ! {send, Msg, self()}.

init(0) -> final_proc_loop();
init(N) ->
  Pid = spawn(?MODULE, init, [N-1]),
  proc_loop(Pid, N).

final_proc_loop() ->
  receive
    {send, Msg, From} ->
      io:format("~w: end of chain, going back~n", [Msg]),
      From ! {back, Msg, 1}
  end,
  final_proc_loop().

proc_loop(Next, N) ->
  receive
    {send, Msg, From} ->
      io:format("~w: ~w steps to go...~n", [Msg, N]),
      Next ! {send, Msg, From};
    {back, Msg, Steps} ->
      io:format("~w: ~w steps back...~n", [Msg, Steps]),
      Next ! {back, Msg, Steps + 1}
  end,
  proc_loop(Next, N).
\`\`\`

Note: the original sender receives the \`back\` message with the step count. We need to add a clause to \`send/2\` or handle it differently. Actually, the first process needs to receive the returning message. The cleanest approach: include the sender PID in the message, and have \`final_proc_loop\` send the reply back through the chain. Each process on the return path increments the counter and forwards.`,
    explanation:
      "Pass the original sender PID through the chain. When the last process receives the message, it prints 'end of chain, going back' and sends a {back, Msg, 1} message back to the chain. Each process on the return path prints the step count, increments it, and forwards to the next. The first process terminates the return when it receives the back message.",
  },

  // --- Paralelismo ---

  {
    id: "2018-06_q4",
    exam: "2018-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] The main sequential loop of an application is given. If M = N = P = 1024 and you have 64 processors, how would you decompose the matrix among the processes? Specify block size and worst-case number of data elements a process would communicate per iteration.",
      "(b) [0.5p] Same question with 64 processors but considering M = N = 1024 and P = 64.",
      "(c) [0.5p] An application with the same computational pattern as in (a) estimates maritime fishing quotas at different depths, where only sea cells have computation. What type of task decomposition and task-to-process assignment would you apply?",
      "(d) [0.5p] If in case (a) each evaluation of f requires 7 cycles, copying an element from b to a requires 1 cycle, a message of n elements between any two processes requires 2^18 + 4×n cycles, and other costs are negligible, calculate the expected speedup and parallel efficiency for the parallelized loop.",
      "(e) [0.5p] Indicate in which processor and at which local position the element a[700][400][188] would be found in case (a).",
    ],
    question: `The main sequential loop of an application is:

\`\`\`c
double a[M][N][P], b[M][N][P];
...
while (condition) {
  ...
  for (i = 1; i < M-1; i++)
    for (j = 1; j < N-1; j++)
      for (k = 1; k < P-1; k++) {
        b[i][j][k] = f(a[i-1][j][k], a[i+1][j][k], a[i][j-1][k],
                       a[i][j+1][k], a[i][j][k-1], a[i][j][k+1]);
      }
  ...
  memcpy(a, b, M * N * P * sizeof(double)); // copies b to a
}
\`\`\`

where f uses all its inputs and its computational cost is independent of them.

Answer the following questions REASONABLY, providing numerical answers whenever possible.`,
    correctAnswer: `(a) Domain decomposition. Organize 64 processors as a 4×4×4 mesh. Each process gets a block of 1024/4 × 1024/4 × 1024/4 = 256×256×256 = 2^24 elements. Worst case (interior processes): communicate 6 faces, each 256×256 = 2^16 elements → total **3×2^17 = 393216** elements per iteration.

(b) With M=N=1024, P=64, a 4×4×4 mesh would divide the third dimension into blocks of 16, which is wasteful. Better: use an 8×8×1 mesh. Each process gets 1024/8 × 1024/8 × 64/1 = 128×128×64 elements. No communication needed in the third dimension. Worst case: 4 faces of 128×64 = **32768** elements — clearly better than 147456 from the 4×4×4 approach.

(c) Still domain decomposition, but since computation is irregular (only sea cells), a **cyclic distribution** of blocks is preferable to balance load. However, this increases communication costs versus the block distribution in (a). A trade-off analysis is needed to see if the load-balancing gain outweighs the extra communication.

(d) Sequential: 1024³ × (7+1) = 2^33 = 8589934592 cycles.
Parallel computation per process (worst case): 256³ × (7+1) = 2^27 = 134217728 cycles.
Parallel communication: (2^18 + 4×256×256) × 6 messages = (2^18 + 2^18) × 6 = 2^19 × 6 = 3145728 cycles.
**Speedup = 8589934592 / (134217728 + 3145728) = 62.53**
**Efficiency = 62.53 / 64 = 0.977 (97.7%)**

(e) Processor: (⌊700/256⌋, ⌊400/256⌋, ⌊188/256⌋) = **(2, 1, 0)**
Local position: (700 mod 256, 400 mod 256, 188 mod 256) = **(188, 144, 188)**`,
    explanation:
      "The key is maximizing volume-to-surface ratio. A 4×4×4 mesh is optimal for equal dimensions (case a). When one dimension is small (case b), it's better to leave it undivided. Irregular workloads (case c) require cyclic distribution for load balance. Amdahl's law governs (d): the speedup is limited by the communication overhead of 6 face exchanges per interior process.",
  },

  {
    id: "2018-06_q5",
    exam: "2018-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    image: getImage(imageMap, "gatos-matrix-2018-06.jpeg"),
    explanationImage: getImage(imageMap, "gatos-symmetric-2018-06.jpeg"),
    subquestions: [
      "(a) [0.5p] What type of task decomposition and assignment should we use?",
      "(b) [1p] Sketch MPI pseudocode that parallelizes the proposed solution.",
      "(c) [0.5p] Assuming f takes 1 second, calculate the speedup and parallel efficiency for N = 12 and 3 processes.",
      "(d) [0.5p] We want all processes to obtain the maximum value of the result matrix before sending it to process 0. Each process first obtains its local maximum. With a static dependency graph, show how to perform this in the minimum number of steps for 4 processes. What communications take place?",
    ],
    question: `A team of Dutch researchers has been collecting data on 100,000 cats from Amsterdam and its surroundings. For each cat, around 1,500 features have been extracted. Their goal is to compare each pair of cats according to a function f: G² → R that allows them to classify cats according to a certain criterion, where G is the set of cats in the database. The function f is necessarily symmetric (f(gᵢ, gⱼ) = f(gⱼ, gᵢ)) and incorporates a subset of these features. This function has a fixed cost (independent of its parameters).

To evaluate each function they have designed the following algorithm, which receives as input an array of N elements of type cat_t, and returns a lower triangular N×N matrix with the result of applying function f to each pair of input data:

\`\`\`c
cat_t cats[N];
double res[N][N];

// initialize the cat array
read(cats);

// apply function f
for (i = 0; i < N; ++i)
  for (j = 0; j < i; ++j)
    res[i][j] = f(cats[i], cats[j]);

// write the result
write(res);
\`\`\`

The problem is that the number of comparisons is considerably high (N(N-1)/2), and with their desktop computer it would take weeks to apply each function, so they need a parallel solution.

Assume that both the number of cats N and the number of comparisons N(N-1)/2 are multiples of the number of processes working in parallel. Input/output (functions read() and write()) must be performed by a single process. Consider that in the parallel system, communication time is always negligible compared to computation time.`,
    correctAnswer: `(a) Domain decomposition over the computation of the result matrix (not over the cat vector!). The simplest approach is **one task per row**, producing N tasks of unequal but known-in-advance load: row i does i comparisons. The most effective simple assignment is **static cyclic**. However, a better approach is **symmetric block** assignment: pairing row i with row N-i-1 gives uniform load of N-1 per pair. This yields N/2 tasks of homogeneous load that can be assigned statically and consecutively to processes.

(b) Two approaches:

**Cyclic assignment:**
\`\`\`c
int block_size = N / n_procs;
double res_local[block_size][N];

if (!rank)
  read(cats);

MPI_Bcast(cats, N, MPI_CAT, 0, MPI_COMM_WORLD);

int i_local = 0;
for (i = rank; i < N; i += n_procs) {
  for (j = 0; j < i; ++j)
    res_local[i_local][j] = f(cats[i], cats[j]);
  ++i_local;
}

if (!rank) {
  for (proc = 0; proc < n_procs; proc++) {
    if (proc > 0)
      MPI_Recv(res_local, N * block_size, MPI_DOUBLE, proc,
               MPI_ANY_TAG, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
    for (i = 0; i < block_size; i++)
      memcpy(res[proc + i * n_procs], res_local[i], N * sizeof(double));
  }
  write(res);
} else {
  MPI_Send(res_local, N * block_size, MPI_DOUBLE, 0, 1, MPI_COMM_WORLD);
}
\`\`\`

**Symmetric block assignment:**
\`\`\`c
int block_size = N / n_procs;
int half = block_size / 2;
double res_local[block_size][N];

if (!rank)
  read(cats);

MPI_Bcast(cats, N, MPI_CAT, 0, MPI_COMM_WORLD);

int i_local = 0;
for (i = half * rank; i < half * (rank + 1); i++) {
  int symm_i = N - i - 1;
  for (j = 0; j < i; ++j)
    res_local[i_local][j] = f(cats[i], cats[j]);
  for (j = 0; j < symm_i; ++j)
    res_local[block_size - i_local - 1][j] = f(cats[symm_i], cats[j]);
  ++i_local;
}

if (!rank) {
  for (proc = 0; proc < n_procs; proc++) {
    if (proc > 0)
      MPI_Recv(res_local, N * block_size, MPI_DOUBLE, proc,
               MPI_ANY_TAG, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
    memcpy(res[half * proc], res_local, half * N * sizeof(double));
    memcpy(res[N - half * (proc + 1)], res_local[half], half * N * sizeof(double));
  }
  write(res);
} else {
  MPI_Send(res_local, N * block_size, MPI_DOUBLE, 0, 1, MPI_COMM_WORLD);
}
\`\`\`

(c) Sequential time: N(N-1)/2 = 12×11/2 = 66 seconds.
- Cyclic: process loads = {26, 20, 20} → T_par = 26, speedup = 66/26 = 2.54, eff = 0.85
- Block: process loads = {38, 20, 8} → T_par = 38, speedup = 66/38 = 1.74, eff = 0.58
- Symmetric block: process loads = {22, 22, 22} → T_par = 22, speedup = 66/22 = 3.0, eff = 1.0
- Master/slave: T_par = 36, speedup = 1.83, eff = 0.61

(d) The solution is a binomial tree reduction with replication. In 2 steps (log₂(4) = 2):
- Step 1: P0 ↔ P1 exchange, P2 ↔ P3 exchange. Each keeps the global max of the pair.
- Step 2: P0 ↔ P2 exchange, P1 ↔ P3 exchange. Now all have the global max.

This is a butterfly/all-reduce pattern achieving global result in log₂(P) steps.`,
    explanation:
      "The key insight is that row i performs i comparisons, so rows have very unequal load. Block assignment suffers severe imbalance (first process gets heaviest rows). Cyclic improves balance. Symmetric block achieves perfect balance by pairing complementary rows (i and N-i-1 always sum to N-1). The global max can be computed in log₂(P) steps using a butterfly exchange pattern (all-reduce with replication).",
  },

  // ================================================================
  // 2018-07 (Julio 2018 — Convocatoria extraordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2018-07_q1",
    exam: "2018-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Implement a semaphore library using pthread mutexes and condition variables. The operations to implement are:

- \`sem_init(sem s, int value)\`, which initializes a semaphore with value \`value\`.
- \`sem_p(sem s)\`, which decrements the semaphore's value if it is greater than 0, and waits otherwise.
- \`sem_v(sem s)\`, which wakes up a thread if the semaphore's value is 0 and there are threads waiting, or increments the semaphore's value otherwise.

Do not use busy waiting. Try to minimize the number of threads that are woken up.

\`\`\`c
typedef struct {
  ...
} *sem;

void sem_init(sem s, int value) {
  ...
}

void sem_p(sem s) {
  ...
}

void sem_v(sem s) {
  ...
}
\`\`\`

\`\`\`c
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_mutex_lock(pthread_mutex_t *mtx);
int pthread_mutex_trylock(pthread_mutex_t *mtx);
int pthread_mutex_unlock(pthread_mutex_t *mtx);
\`\`\``,
    correctAnswer: `We need a counter for the semaphore value, and a mutex and condition to protect that counter and wait in sem_p when the counter is 0. We use pthread_cond_signal to minimize wakeups, and a counter for waiting threads.

\`\`\`c
typedef struct {
  int v;               // semaphore value
  int w;               // number of waiting threads
  pthread_mutex_t m;
  pthread_cond_t c;
} *sem;

void sem_init(sem s, int value) {
  s->v = value;
  s->w = 0;
  pthread_mutex_init(&s->m, NULL);
  pthread_cond_init(&s->c, NULL);
}

void sem_p(sem s) {
  pthread_mutex_lock(&s->m);
  if (s->v <= 0) {
    s->w++;
    pthread_cond_wait(&s->c, &s->m);
  } else {
    s->v--;
  }
  pthread_mutex_unlock(&s->m);
}

void sem_v(sem s) {
  pthread_mutex_lock(&s->m);
  if (s->w) {
    s->w--;
    pthread_cond_signal(&s->c);
  } else {
    s->v++;
  }
  pthread_mutex_unlock(&s->m);
}
\`\`\``,
    explanation:
      "Used a counter v for the semaphore value and w for waiting threads. sem_p: if v > 0, decrement immediately; otherwise increment w and wait. sem_v: if any thread is waiting, decrement w and signal exactly one (minimizing wakeups); otherwise increment v. This is a classic semaphore implementation with mutex + condition variable.",
  },

  {
    id: "2018-07_q2",
    exam: "2018-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.75,
    question: `We have a circular doubly-linked list. Assume:
- The list always has at least one element.
- Both \`pos\` and \`elem\` are non-NULL.
- Pointer assignment is atomic.

Modify the implementation of \`remove()\` and \`insert()\` to satisfy:
- The list must work with multiple threads traversing it simultaneously.
- A thread only traverses the list in one direction. If an insertion is happening, the thread may (or may not) see the new element, but the list must always remain circular (no NULL encountered). Same for deletion: the thread may (or may not) see the deleted element.
- To achieve this, write the pointers in the right order so the list is always connected. Use one mutex per list element. Assume the same element is never deleted twice.
- Hint: think about what happens when you assign a NULL pointer.

\`\`\`c
struct list {
  struct list *prev;
  struct list *next;
  ...
};

void remove(list *elem) {
  if (elem->next) {
    elem->next->prev = elem->prev;
  }
  if (elem->prev) {
    elem->prev->next = elem->next;
  }
  elem->prev = NULL;
  elem->next = NULL;
}

void insert(list *pos, list *elem) {
  if (pos->next) {
    pos->next->prev = elem;
  }
  pos->next = elem;
  elem->prev = pos;
  elem->next = pos->next;
}
\`\`\``,
    correctAnswer: `Add one mutex per element. Lock elements in \`next\` order to prevent deadlock. In remove, do NOT set prev/next to NULL (that would break iterators). In insert, assign the new element's pointers first before modifying existing elements' pointers.

\`\`\`c
struct list {
  struct list *prev;
  struct list *next;
  pthread_mutex_t m;
  ...
};

void remove(list *elem) {
  if (elem->prev) pthread_mutex_lock(&elem->prev->m);
  pthread_mutex_lock(&elem->m);
  if (elem->next) pthread_mutex_lock(&elem->next->m);

  if (elem->next)
    elem->next->prev = elem->prev;
  if (elem->prev)
    elem->prev->next = elem->next;

  if (elem->prev) pthread_mutex_unlock(&elem->prev->m);
  pthread_mutex_unlock(&elem->m);
  if (elem->next) pthread_mutex_unlock(&elem->next->m);
}

void insert(list *pos, list *elem) {
  pthread_mutex_lock(&pos->m);
  if (pos->next) pthread_mutex_lock(&pos->next->m);

  elem->prev = pos;          // set new element's pointers first
  elem->next = pos->next;

  if (pos->next)
    pos->next->prev = elem;  // then modify existing elements
  pos->next = elem;

  pthread_mutex_unlock(&pos->m);
  if (pos->next) pthread_mutex_unlock(&pos->next->m);
}
\`\`\``,
    explanation:
      "Use one mutex per node, locked in next order to prevent deadlock. In remove, we don't nullify the deleted node's pointers — this lets iterators that were on the node continue traversing. In insert, assign the new node's prev/next first, then update the existing nodes' pointers. This ordering ensures the list is always connected from any traversal perspective.",
  },

  {
    id: "2018-07_q3",
    exam: "2018-07",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.25,
    image: getImage(imageMap, "ring-chain-2018-07.jpeg"),
    question: `The module chain implements a chain of processes, where each element knows the PID of the next. Processes are numbered from N (first) to 0 (last).

The chain is created by calling \`start(N)\`, where N is the number of the first process. This function returns the PID of the first process. The function \`send(Chain, Msg)\` sends a message from the first element to the last.

An example execution:

\`\`\`text
1> C = chain:start(3).
<0.62.0>
2> chain:send(C, hola).
hola: 3 steps to go...
hola: 2 steps to go...
hola: 1 steps to go...
hola: 0 steps to go...
\`\`\`

Where the chain C has the structure 3 → 2 → 1 → 0.

\`\`\`erlang
-module(chain).
-export([start/1, init/1, send/2]).

start(N) -> spawn(?MODULE, init, [N]).

send(Chain, Msg) -> Chain ! {send, Msg}.

init(0) -> final_proc_loop();
init(N) ->
  Pid = spawn(?MODULE, init, [N-1]),
  proc_loop(Pid, N).

final_proc_loop() ->
  receive
    {send, Msg} ->
      io:format("~w: 0 steps to go...~n", [Msg])
  end,
  final_proc_loop().

proc_loop(Next, N) ->
  receive
    {send, Msg} ->
      io:format("~w: ~w steps to go...~n", [Msg, N]),
      Next ! {send, Msg}
  end,
  proc_loop(Next, N).
\`\`\`

Modify the code so that the structure created is a ring (last process points back to the first). Change the send operation to \`send(Chain, Msg, Nodes)\`, which sends the message around the ring crossing Nodes nodes. After the changes, an example execution is:

\`\`\`text
1> C = chain:start(3).
<0.62.0>
2> chain:send(C, hola, 5).
hola: at node 3 with 5 steps to go...
hola: at node 2 with 4 steps to go...
hola: at node 1 with 3 steps to go...
hola: at node 0 with 2 steps to go...
hola: at node 3 with 1 steps to go...
hola: at node 2 with 0 steps to go...
\`\`\``,
    correctAnswer: `All nodes now have the same behavior: they all have a next node. We pass the first process's PID through initialization so the last process can use it as its next. A single proc_loop handles all nodes.

\`\`\`erlang
-module(chain).
-export([start/1, init/2, init_first/1, send/3]).

start(N) -> spawn(?MODULE, init_first, [N]).

send(Chain, Msg, Nodes) -> Chain ! {send, Msg, Nodes}.

init_first(0) -> proc_loop(self(), 0);
init_first(N) ->
  Next = spawn(?MODULE, init, [self(), N-1]),
  proc_loop(Next, N).

init(First, 0) -> proc_loop(First, 0);
init(First, N) ->
  Next = spawn(?MODULE, init, [First, N-1]),
  proc_loop(Next, N).

proc_loop(Next, N) ->
  receive
    {send, Msg, Nodes} ->
      io:format("~w: at node ~w with ~w steps to go...~n", [Msg, N, Nodes]),
      if Nodes > 0 -> Next ! {send, Msg, Nodes - 1};
         true -> ok
      end
  end,
  proc_loop(Next, N).
\`\`\``,
    explanation:
      "The first process's PID is threaded through all init calls. When the last process (0) is created, it uses the first process's PID as its Next, closing the ring. All processes run the same proc_loop: print the message, decrement the remaining steps, and forward if Nodes > 0. This eliminates the special final_proc_loop — every node behaves identically in the ring.",
  },

  // --- Paralelismo ---

  {
    id: "2018-07_q4",
    exam: "2018-07",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.25p] What decomposition and assignment strategies have been used in designing the parallel system?",
      '(b) [0.5p] Explain how to implement a "summary" operation that counts how many times each team has won, drawn, and lost in a specific matchup between teams A and B.',
      "(c) [0.75p] Suppose the original database has 2^40 rows, the sequential operation takes 64 computation cycles per row, and a network communication between two processes takes 2^16 cycles. What is the obtainable speedup as a function of the number of processes N? What is the parallel efficiency using 16 processes? For what database size N does a speedup of 1.0 occur with 256 processes?",
      "(d) [0.75p] Consider searching for a match between teams A and B on a specific date in two situations: when both the original database and each resulting chunk are sorted by date, and when they are completely unsorted. How would you implement it in each case? In which situation can the search be performed more efficiently? In which one does parallelization provide greater benefit, assuming zero communication cost?",
      '(e) [0.25p] What type of scalability does the "summary" operation exhibit? And the search operation on the unsorted database? And the search operation on the sorted database?',
    ],
    question: `A betting house wants to perform exhaustive analyses of historical match results to calculate counterparties for user bets. The original database is split among N nodes, each with its own local database manager, and an additional node with a global manager handles launching parallel operations. The operations to parallelize are classic database queries (searches, reductions, selections, etc.).

Answer the following questions REASONABLY.`,
    correctAnswer: `(a) Domain decomposition (same operation on different data subsets). The assignment appears to be **dynamic** with a **master-slave** model: the global manager (master) coordinates the local managers (slaves).

(b) Apply the summary operation locally on each fragment. Then perform a reduction (sum) across the three extracted values (wins, draws, losses) from each node. The global manager can collect and aggregate using a binomial tree reduction for O(log N) communication steps.

(c) Sequential time: T_s = 2^40 × 2^6 = 2^46 cycles.
Parallel time (binomial reduce): T_p = 2^46 / N + 3 × 2^16 × log₂(N)

For N = 16: T_16 = 2^42 + 3 × 2^20 cycles. **Speedup ≈ 15.99, Efficiency ≈ 0.99.**

For N = 256, speedup = 1.0 when T_s = T_256:
N × 2^6 = (N × 2^6) / 256 + 3 × 2^16 × 8 → **N ≈ 3 × 2^13 ≈ 24576 rows**

(d) **Unsorted:** Full sequential search on each chunk → O(N/P) each → ideal linear speedup.
**Sorted:** Binary search → O(log(N)) sequential, O(log(N/P)) parallel. Since log(N/P) ∈ O(log(N)), the parallel benefit is just a constant factor reduction → very poor speedup.

(e) **Summary:** Strong scalability (logarithmic reduction cost). **Unsorted search:** Strong scalability (linear). **Sorted search:** Neither strong nor weak scalability is meaningful — the operation is already O(log N) sequentially and parallelization provides negligible gain.`,
    explanation:
      "Domain decomposition with master-slave assignment is natural for database partitioning. The summary operation is a classic map-reduce pattern: local aggregation + global reduction. Amdahl's law limits speedup — the 3×2^16 × log(N) communication cost becomes dominant as N grows. Binary search on sorted data is already O(log N), so parallelizing it yields little benefit regardless of scale.",
  },

  {
    id: "2018-07_q5",
    exam: "2018-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Explain what type of decomposition and task assignment you would use, justifying the answer. Does your decision depend on the values of M, N, and K in any case? Why?",
      "(b) [1p] Implement your parallel algorithm in MPI using collective operations where possible, considering that M > N.",
      "(c) [0.5p] Suppose the network is a ring where each process p can only send messages to p+1 unidirectionally (the last process sends to process 0). Explain in words how you would implement the collectives you used in the previous section.",
      "(d) [0.5p] For M = 1024, K = 512, N = 256 on four processes in the ring system, what is the speedup if computing each element of X requires K cycles and each message between two processes requires S+1 cycles, where S is the message size?",
    ],
    question: `We want to parallelize a multiply-add operation (X = A × B + X) involving three 2D matrices, considering:
- Matrix A is input-only with dimensions M×K.
- Matrix B is input-only with dimensions K×N.
- Matrix X is input/output with dimensions M×N.
- The elements of X at the end must be: x_{i,j} = Σ_{l=0}^{K-1} a_{i,l} × b_{l,j} + x_{i,j}

The machine only allows one processor to read and write matrices from disk, and does NOT allow efficient interleaving of communication and computation. Therefore, parallel algorithms designed for it must only send data before and/or after all processes have done their computation.

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Scatterv(void *sendbuf, int *sendcounts, int *displs, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gatherv(void *sendbuf, int sendcount, MPI_Datatype sendtype, void *recvbuf, int *recvcounts, int *displs, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) Domain decomposition, creating one task per element of X. Use **block distribution by rows** of X, which implies the same distribution for A and replicating B. This is best when M > N (minimizes data to replicate). If N > M, a column distribution (replicating A, distributing B) would be better.

(b) Row distribution with M > N:

\`\`\`c
int dims[3]; // M, N, K
float *A, *B, *X;

if (!rank)
  readMatrices(A, B, X, &dims[0], &dims[1], &dims[2]);

MPI_Bcast(dims, 3, MPI_INT, 0, MPI_COMM_WORLD);

if (rank > 0)
  B = (float *)malloc(sizeof(float) * dims[1] * dims[2]);

MPI_Bcast(B, dims[1] * dims[2], MPI_FLOAT, 0, MPI_COMM_WORLD);

int rows = ceil(dims[0] / P);
float *myA = (float *)malloc(sizeof(float) * rows * dims[2]);
float *myX = (float *)malloc(sizeof(float) * rows * dims[1]);

if ((dims[0] % P != 0) && (rank == 0)) {
  A = (float *)realloc(A, sizeof(float) * P * rows * dims[2]);
  X = (float *)realloc(X, sizeof(float) * P * rows * dims[1]);
}

MPI_Scatter(A, rows * dims[2], MPI_FLOAT, myA, rows * dims[2], MPI_FLOAT, 0, MPI_COMM_WORLD);
MPI_Scatter(X, rows * dims[1], MPI_FLOAT, myX, rows * dims[1], MPI_FLOAT, 0, MPI_COMM_WORLD);

for (i = 0; i < rows; i++) {
  for (j = 0; j < dims[1]; j++) {
    for (k = 0; k < dims[2]; k++) {
      myX[i * dims[1] + j] += myA[i * dims[2] + k] * B[k * dims[1] + j];
    }
  }
}

MPI_Gather(myX, rows * dims[1], MPI_FLOAT, X, rows * dims[1], MPI_FLOAT, 0, MPI_COMM_WORLD);

if (!rank)
  writeMatrix(X, dims[0], dims[1]);
\`\`\`

(c) **Broadcast in a ring:** The root sends data to its successor. Each process receives from predecessor and forwards to successor, except the process whose successor is the root (just receives, doesn't forward).

**Scatter in a ring:** Similar but messages get progressively smaller. Each process calculates how much to receive and forward, forwarding from the correct offset within the received buffer.

**Gather in a ring:** Messages grow progressively. Each process has a buffer where its own data sits first, then receives from predecessor into the rest of the buffer, and sends the concatenated buffer onward.

(d) Sequential: M × N × K = 1024 × 256 × 512 = 134217728 cycles.
Parallel computation per process: 1024/4 × 256 × 512 = 33554432 cycles.

Communication:
- Bcast B: 3 messages of K×N = 512×256 each. 3 × (512×256 + 1) = 393219 cycles.
- Scatter A: sizes 768×K, 512×K, 256×K. Sum: (768×512+1) + (512×512+1) + (256×512+1) = 786435 cycles.
- Scatter X: sizes 768×N, 512×N, 256×N. Sum: 393219 cycles.
- Gather X: same as scatter X in reverse: 393219 cycles.
Total communication: 1966092 cycles.

**T_par = 33554432 + 1966092 = 35520524 cycles.**
**Speedup = 134217728 / 35520524 ≈ 3.78**`,
    explanation:
      "The key decisions: replicate B (shared by all) and distribute A and X by rows. Since M > N, row distribution minimizes the replicated data (B vs A). In a ring, collectives become pipelined point-to-point chains. The speedup is limited by communication — even with a small 4-process ring, communication overhead is ~6% of compute time, giving speedup of 3.78 out of 4.",
  },

  // ================================================================
  // 2019-06 (Mayo 2019 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2019-06_q1",
    exam: "2019-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    image: getImage(imageMap, "intersection-2019-06.jpeg"),
    question: `We are going to simulate an intersection on a road where there is a traffic light that lets cars from each direction pass consecutively.

![intersection diagram]

Both the traffic light and each car arriving at the intersection have their own thread. The intersection is represented by a value of type \`intersection\`, with a field \`direction\` indicating the direction that can cross right now, and a constant \`total_directions\` indicating the total number of directions at the intersection.

The following code implements the periodic direction change:

\`\`\`c
typedef struct _intersection {
  int direction;              // Current direction
  int total_directions;       // Total number of directions
  pthread_mutex_t *lock;
  ...
} *intersection;

int semaphore(intersection i) {
  while (1) {
    pthread_mutex_lock(i->lock);
    i->direction = (i->direction + 1) % i->total_directions;
    pthread_mutex_unlock(i->lock);
    sleep(10);
  }
}

int car(int direction, intersection i) {
  ...
}
\`\`\`

Implement the car's behavior so that it waits until the traffic light lets cars from its direction pass. You may add fields to the intersection structure and modify the semaphore function implementation if necessary.

\`\`\`c
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_mutex_lock(pthread_mutex_t *mtx);
int pthread_mutex_unlock(pthread_mutex_t *mtx);
\`\`\``,
    correctAnswer: `Add an array of condition variables (one per direction) and broadcast on the new direction.

\`\`\`c
typedef struct _intersection {
  int direction;
  int total_directions;
  pthread_mutex_t *lock;
  pthread_cond_t *c;  // pthread_cond_t c[total_directions];
} *intersection;

int semaphore(intersection i) {
  while (1) {
    pthread_mutex_lock(i->lock);
    i->direction = (i->direction + 1) % i->total_directions;
    pthread_cond_broadcast(&i->c[i->direction]);
    pthread_mutex_unlock(i->lock);
    sleep(10);
  }
}

int car(int direction, intersection i) {
  pthread_mutex_lock(i->lock);
  while (direction != i->direction)
    pthread_cond_wait(&i->c[direction], i->lock);
  pthread_mutex_unlock(i->lock);
  // cross the intersection
}
\`\`\``,
    explanation:
      "Add a condition variable array c[total_directions]. The semaphore broadcasts on c[direction] when the direction changes. Each car waits on c[its_direction] while direction != its_direction. Using broadcast (not signal) ensures all waiting cars from the new direction are woken up. The while loop guards against spurious wakeups.",
  },

  {
    id: "2019-06_q2",
    exam: "2019-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.75,
    question: `Given the barber algorithm from class shown below, make the barber know which customer they are cutting hair for, and vice versa, so that they can print messages with the correct values. It must work both when the customer waits in the waiting room and when there is no wait. The algorithm must work with more than one barber.

\`\`\`c
void barber(int barber) {
  int customer = -1;
  while (1) {
    pthread_mutex_lock(&m);
    if (!waiting_customers) {
      free_barbers++;
      pthread_cond_wait(&no_customers, &m);
    }
    pthread_cond_signal(&waiting_room);
    waiting_customers--;
    pthread_mutex_unlock(&m);
    printf("barber %d cut hair of customer %d\\n", barber, customer);
  }
}

void customer(int customer) {
  int barber = -1;
  pthread_mutex_lock(&m);
  if (waiting_customers == MAX_CUSTOMERS) {
    pthread_mutex_unlock(&m);
  } else {
    if (free_barbers > 0) {
      pthread_cond_signal(&no_customers);
      free_barbers--;
    }
    waiting_customers++;
    pthread_cond_wait(&waiting_room, &m);
    pthread_mutex_unlock(&m);
    printf("customer %d got hair cut from barber %d\\n", customer, barber);
  }
}
\`\`\`

You may assume the following data structure is available:

\`\`\`c
typedef struct _queue *queue;  // a FIFO structure

void insert(queue q, void *e);  // Inserts e into q
void *remove(queue q);          // removes an element from q
int elements(queue q);          // returns the number of elements in q
\`\`\``,
    correctAnswer: `Use a shared queue with per-customer info structures. Each customer creates an info struct with their ID and a condition variable, inserts it into the queue, and waits. The barber removes from the queue, fills in their barber ID, signals the customer, and can then print with the correct customer ID.

\`\`\`c
struct c_info {
  int customer;
  int barber;
  pthread_cond_t wait;
};

queue q;

void barber(int barber) {
  int customer = -1;
  struct c_info *elem;

  while (1) {
    pthread_mutex_lock(&m);
    if (!waiting_customers) {
      free_barbers++;
      pthread_cond_wait(&no_customers, &m);
    }
    elem = remove(q);
    elem->barber = barber;
    customer = elem->customer;
    pthread_cond_signal(&elem->wait);
    waiting_customers--;
    pthread_mutex_unlock(&m);
    printf("barber %d cut hair of customer %d\\n", barber, customer);
  }
}

void customer(int customer) {
  int barber = -1;
  struct c_info elem;

  pthread_mutex_lock(&m);
  if (waiting_customers == MAX_CUSTOMERS) {
    pthread_mutex_unlock(&m);
  } else {
    if (free_barbers > 0) {
      pthread_cond_signal(&no_customers);
      free_barbers--;
    }
    waiting_customers++;
    elem.customer = customer;
    pthread_cond_init(&elem.wait, NULL);
    insert(q, &elem);
    pthread_cond_wait(&elem.wait, &m);
    barber = elem.barber;
    pthread_mutex_unlock(&m);
    printf("customer %d got hair cut from barber %d\\n", customer, barber);
  }
}
\`\`\``,
    explanation:
      "A shared FIFO queue holds c_info structs (customer ID, barber ID, condition). The customer inserts their info and waits on their private condition. The barber dequeues, writes their barber ID into the struct, signals the customer, and both can then print with correct IDs. This works regardless of whether the customer waited or was served immediately.",
  },

  {
    id: "2019-06_q3",
    exam: "2019-06",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.25,
    image: getImage(imageMap, "star-2019-06.jpeg"),
    question: `In a star communication system, there is a central process that propagates messages from the nodes located on the outside of the star.

![star diagram]

Node C receives messages from nodes Pᵢ and copies them to the rest of the star nodes (i.e., to everyone except the one that originated the message). For example, in the diagram, if node P₀ sends a message, it must be received by P₁,...,P₆.

The following module is a skeleton of the code for central node C, with two interface functions:

(a) \`start(Pids)\`, where Pids is a list with the PIDs of the processes that form part of the star.
(b) \`send(Center, Msg)\`, where Center is the PID of C, and Msg is the message to be sent to the other processes of the star. This function will be called by the Pᵢ processes.

\`\`\`erlang
-module(star).
-export([start/1, send/2]).

start(Pids) ->
  spawn(?MODULE, loop, [Pids]).

send(Center, Msg) ->
  ...

loop(Pids) ->
  receive
    ...
  end.
\`\`\`

Implement the loop and send functions so that messages sent by processes through send reach all other processes of the star.`,
    correctAnswer: `The sender includes its own PID in the message. The center receives it, then forwards to all processes in Pids except the sender.

\`\`\`erlang
-module(star).
-export([start/1, send/2]).

start(Pids) ->
  spawn(?MODULE, loop, [Pids]).

send(Center, Msg) ->
  Center ! {send, Msg, self()}.

loop(Pids) ->
  receive
    {send, Msg, From} ->
      send_to_all(Pids, Msg, From),
      loop(Pids)
  end.

send_to_all([], _, _) ->
  ok;

send_to_all([From | T], Msg, From) ->
  send_to_all(T, Msg, From);

send_to_all([P | T], Msg, From) ->
  P ! Msg,
  send_to_all(T, Msg, From).
\`\`\``,
    explanation:
      "The sender includes self() in the message so C knows who to exclude. C's loop receives {send, Msg, From} and calls send_to_all, which recurses through Pids. When the current PID matches From, it skips (doesn't forward); otherwise it sends Msg to that PID. This is a clean functional pattern-match solution.",
  },

  // --- Paralelismo ---

  {
    id: "2019-06_q4",
    exam: "2019-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    image: getImage(imageMap, "task-graph-2019-06.jpeg"),
    subquestions: [
      "(a) [0.5p] Calculate, according to Amdahl's law, the maximum speedup this program can achieve.",
      "(b) [0.75p] After applying task decomposition to regions B and C, we find that region B can be executed completely in parallel, while region C has dependencies among some of its tasks. The following figure shows the dependency graph. Knowing that region B tasks each require 4000 operations and region C tasks each require 2500 operations, what is the average degree of concurrency?",
      "(c) [0.5p] If tasks are assigned to four processes as: P0={T0, T1, T5, T6, T7, T8, T15}, P1={T2, T9, T10, T11}, P2={T3, T12, T13}, P3={T4, T14}, what speedup and parallel efficiency would be obtained?",
      "(d) [0.75p] To improve speedup with four processes, we propose dividing EACH task of region B into four completely independent subtasks (e.g., T1 becomes T1.1-T1.4, each with 1000 operations). Does this improve the average degree of concurrency? Provide a task assignment that achieves the best possible speedup for four processes and indicate that speedup value.",
    ],
    question: `Consider a program with four code regions (A, B, C, and D) executed one after another in its initial sequential version. Regions A and D cannot be parallelized, requiring 200 and 300 operations respectively. Regions B and C can be parallelized, performing 16,000 and 25,000 operations respectively.

![task graph]

Answer the following questions REASONABLY.`,
    correctAnswer: `(a) Sequential portion: 200 + 300 = 500 ops. Parallelizable portion: 16000 + 25000 = 41000 ops.

\`\`\`
sp(p → ∞) = T_seq / T_par(p → ∞) = (500 + 41000) / 500 = 41500 / 500 = 83
\`\`\`

**Maximum speedup = 83**

(b) Critical path: T0 (200) → one region B task (4000) → four region C tasks (4 × 2500 = 10000) → T15 (300) = **14500 operations**.

Total operations: 200 + 16000 + 25000 + 300 = 41500.

Average degree of concurrency = 41500 / 14500 = **≈ 2.86**

(c) Process 0 (most loaded): T0, T1, T5, T6, T7, T8, T15 = 200 + 4000 + 2500 + 2500 + 2500 + 2500 + 300 = **14500 operations**.

\`\`\`
Sp(4) = 41500 / 14500 ≈ 2.86
Eff(4) = 2.86 / 4 ≈ 0.72
\`\`\`

(d) **Yes**, the average degree of concurrency improves. The critical path now has only a quarter of T1 (1000 instead of 4000), reducing the critical path to 200 + 1000 + 10000 + 300 = **11500 operations**. New average concurrency: 41500 / 11500 ≈ **3.61**.

Best assignment for 4 processes achieving maximum speedup:
- P0 = T0, T1.1, T5, T6, T7, T8, T15 (11500 ops)
- P1 = T1.2, T2.1, T2.4, T9, T10, T11 (11500 ops)
- P2 = T1.3, T2.2, T3.1, T3.3, T4.1, T12, T13 (11500 ops)
- P3 = T1.4, T2.3, T3.2, T3.4, T4.2, T4.3, T4.4, T14 (11500 ops)

**Speedup = 41500 / 11500 ≈ 3.61, Efficiency = 3.61 / 4 ≈ 0.90**`,
    explanation:
      "Amdahl's law caps speedup at 83 due to the 500 serial operations. The task graph reveals the critical path through T1→T5→T6→T7→T8→T15 dominates. Subdividing T1 (the bottleneck task on the critical path) reduces the critical path length from 14500 to 11500, improving both concurrency and achievable speedup to 3.61. The balanced assignment distributes the four T1 subtasks across all processes.",
  },

  {
    id: "2019-06_q5",
    exam: "2019-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Draw a 9×9 matrix representing u for N = 9. Indicate for each cell whether it is red (R), black (N), or white (B — cells not computed).",
      "(b) [0.5p] Are there dependencies within the red loop? Within the black loop? Between the two loops? Justify your answers.",
      "(c) [0.5p] What type of task decomposition and assignment should we use?",
      "(d) [0.5p] For an execution with three processes and N = 9, indicate which elements each process must access. You may use a graphical representation.",
      "(e) [0.5p] For the same execution, indicate which elements must be communicated between the end of the red loop and the start of the black loop. For each message, indicate the rows/columns sent, message size, sending process, and receiving process.",
    ],
    question: `We want to parallelize the following code that works with 2D matrices following the so-called Red-Black algorithm.

\`\`\`c
void main(int argc, char *argv[]) {
  double tmp;
  double u[N][N];
  readMatrix(u);

  // Red sweep: traversing all red cells
  for (int i = 2; i < N-1; i += 2)
    for (int j = 1; j < N-1; j++) {
      tmp = u[i+1][j] + u[i-1][j] + u[i][j+1] + u[i][j-1] - 4*u[i][j];
      u[i][j] = tmp / 4;
    }

  // Black sweep: traversing all black cells
  for (int i = 1; i < N-1; i += 2)
    for (int j = 1; j < N-1; j++) {
      tmp = u[i+1][j] + u[i-1][j] + u[i][j+1] + u[i][j-1] - 4*u[i][j];
      u[i][j] = tmp / 4;
    }

  writeMatrix(u);
}
\`\`\`

Answer the following questions REASONABLY.`,
    correctAnswer: `(a) For N = 9, the 9×9 matrix (indices 0-8). Border rows/columns (0 and 8) are white (B). Interior red rows are 2, 4, 6; black rows are 1, 3, 5, 7.

\`\`\`
  B B B B B B B B B
  B N N N N N N N B
  B R R R R R R R B
  B N N N N N N N B
  B R R R R R R R B
  B N N N N N N N B
  B R R R R R R R B
  B N N N N N N N B
  B B B B B B B B B
\`\`\`

(b) Within each sweep, there are **column dependencies**: computing (i, j) requires the already-computed value (i, j-1). There are **no row dependencies within the same sweep** because each sweep skips every other row. **Between sweeps**: the black sweep depends on the red sweep because black cells need their red neighbors (i-1, j) and (i+1, j) which were computed in the red sweep.

(c) **Domain decomposition** over matrix u is appropriate. Row-wise distribution is simpler in C (row-major memory). Each row is a task. **Block assignment** keeps consecutive rows together, minimizing communication — only the boundary rows between blocks need to be exchanged. The first and last processes' outer boundary rows have less work (border cells are not computed), causing slight imbalance that's negligible for large matrices.

(d) 3 processes, N = 9. Each process handles 3 rows (block assignment):
- P0: computes rows 1-3, needs rows 0-4
- P1: computes rows 3-5, needs rows 2-6
- P2: computes rows 6-8, needs rows 5-9 (needs row 5 and row 9 which is border)

Specifically, P0 accesses rows 0-4, P1 accesses rows 2-6, P2 accesses rows 5-8. Each process needs its block plus one row above (for dependency on i-1) and one row below (for dependency on i+1).

(e) Red-to-black communication: black cells need their updated red neighbors.

**P0 → P1**: Row 2 (computed red row by P0), needed by P1 for computing black row 1. Sends the 7 interior elements of row 2 (columns 1-7). Size = 7 doubles.

**P2 → P1**: Row 6 (computed red row by P2), needed by P1 for computing black row 7. Sends the 7 interior elements of row 6 (columns 1-7). Size = 7 doubles.

No other communications needed: P0 and P2 have all boundary red rows they need locally. P1 receives from both neighbors.`,
    explanation:
      "The Red-Black (checkerboard) algorithm enables parallelism because red cells only depend on black neighbors (which are unchanged during the red sweep) and black cells only depend on red neighbors (just updated). Row-wise block decomposition is natural. Only boundary rows need communication between sweeps: each process sends its edge red rows to the neighbor that needs them for the black sweep. The dependency pattern is local (5-point stencil).",
  },

  // ================================================================
  // 2021-06 (Junio 2021 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2021-06_q1",
    exam: "2021-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2.5,
    question: `En un servidor web se gestionan las peticiones usando un modelo de productores/consumidores donde un dispatcher recibe las peticiones y las inserta en una cola, y varios threads worker las procesan.

\`\`\`c
struct request_queue {
    queue requests;
    pthread_mutex_t queue_lock;
    pthread_cond_t queue_full, queue_empty;
};

// Funciones ya implementadas en otros módulos del sistema
int elements(queue *q);
request *remove(queue *q);
void insert(queue *q, request *r);
int buffer_size(queue *q);
void register_worker(pthread_t id);

void *dispatcher(void *ptr) {
    struct request_queue *req = ptr;
    while(1) {
        request r = accept_connection();

        pthread_mutex_lock(&req->queue_lock);
        while(elements(&req->requests)==buffer_size(&req->requests))
            pthread_cond_wait(&req->queue_full, &req->queue_lock);

        insert(&req->requests, r);

        if(elements(&req->requests)==1)
            pthread_cond_broadcast(&req->queue_empty);
        pthread_mutex_unlock(&req->queue_lock);
    }
}

void *worker(void *ptr) {
    struct request_queue *req = ptr;
    while(1) {
        request r;

        pthread_mutex_lock(&req->queue_lock);
        while(elements(&req->requests)==0)
            pthread_cond_wait(&req->queue_empty, &req->queue_lock);

        r = remove(&req->requests);

        if(elements(&req->requests)==buffer_size(&req->requests)-1)
            pthread_cond_broadcast(&req->queue_full);
        pthread_mutex_unlock(&req->queue_lock);

        serve_request(r);
    }
}
\`\`\`

Para garantizar que el sistema es capaz de adaptarse a la carga de trabajo en cada momento, modifique la implementación de tal forma que:

a) Cuando un worker se encuentre la cola de peticiones llena debe iniciar un nuevo thread worker para aumentar la capacidad del sistema. Para registrar el nuevo worker en el sistema llame a la función \`register_worker\` pasando el id del nuevo thread.

b) Para no tener demasiados procesos cuando no haya peticiones, solo debería haber un worker esperando. Si un worker ve la cola de peticiones vacía cuando ya hay otro worker esperando debería terminar y no esperar.

\`\`\`c
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_mutex_lock(pthread_mutex_t *mtx);
int pthread_mutex_unlock(pthread_mutex_t *mtx);
int pthread_create(pthread_t *thread, const pthread_attr_t *attr,
    void *(*fun) (void *), void *arg);
\`\`\``,
    correctAnswer: `Se añade un contador \`waiting_workers\` a la estructura. En el dispatcher se usa \`signal\` en lugar de \`broadcast\` para despertar solo a un worker.

\`\`\`c
struct request_queue {
    queue requests;
    pthread_mutex_t queue_lock;
    pthread_cond_t queue_full, queue_empty;
    int waiting_workers;
};

void *dispatcher(void *ptr) {
    struct request_queue *req = ptr;
    while(1) {
        request r = accept_connection();

        pthread_mutex_lock(&req->queue_lock);
        while(elements(&req->requests)==buffer_size(&req->requests))
            pthread_cond_wait(&req->queue_full, &req->queue_lock);

        insert(&req->requests, r);

        if(req->waiting_workers) {
            req->waiting_workers--;
            pthread_cond_signal(&req->queue_empty);
        }
        pthread_mutex_unlock(&req->queue_lock);
    }
}

void *worker(void *ptr) {
    struct request_queue *req = ptr;
    while(1) {
        request r;

        pthread_mutex_lock(&req->queue_lock);
        while(elements(&req->requests)==0) {
            if(req->waiting_workers > 0) {
                pthread_mutex_unlock(&req->queue_lock);
                return NULL;
            }
            req->waiting_workers++;
            pthread_cond_wait(&req->queue_empty, &req->queue_lock);
        }

        r = remove(&req->requests);

        if(elements(&req->requests)==buffer_size(&req->requests)-1) {
            pthread_t new_worker_id;
            pthread_cond_broadcast(&req->queue_full);
            pthread_create(&new_worker_id, NULL, worker, req);
            register_worker(new_worker_id);
        }
        pthread_mutex_unlock(&req->queue_lock);

        serve_request(r);
    }
}
\`\`\``,
    explanation:
      "waiting_workers counts how many workers are waiting for work. A worker that finds the queue empty checks if another worker is already waiting — if so, it terminates (return NULL). Otherwise, it increments waiting_workers and waits. The dispatcher uses signal (not broadcast) to wake exactly one worker. When the queue is nearly full after a removal, the worker spawns a new thread to increase capacity.",
  },

  {
    id: "2021-06_q2",
    exam: "2021-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2.5,
    repeated: true,
    subquestions: [
      "(a) [1p] Thread principal espera por todos: el thread principal crea una nueva barrera con barrier_create(). Cuando el thread principal quiere esperar a que todos los threads lleguen a un punto determinado llamará a barrier_server(). El resto de threads, al llegar al punto de sincronización llaman a barrier_client(). Los threads clientes no tienen que esperar a que todos lleguen, simplemente indican al thread principal que ya han llegado.",
      "(b) [0.75p] Todos los threads esperan por todos: modifique el código del apartado anterior para que todos los threads esperen por todos. Cuando un thread llega a la barrera, indica al thread principal que ya ha llegado, y espera a que el thread principal le diga que ya han llegado todos.",
      "(c) [0.75p] Función barrier_destroy(): necesitamos liberar la struct barrier con barrier_destroy() que la llamará el thread principal después de barrier_server(). Tiene que asegurarse de que todos los threads clientes ya no estén usando la estructura.",
    ],
    question: `Dado un thread principal y varios threads auxiliares, implemente un sistema de barreras.

\`\`\`c
struct barrier {
    ...
};

struct barrier *barrier_create(int num_threads) {
    ...
}

int barrier_server(struct barrier *barrier) {
    ...
}

int barrier_client(struct barrier *barrier) {
    ...
}

int barrier_destroy(struct barrier *barrier) {
    ...
}
\`\`\`

Pthread API disponible:

\`\`\`c
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_mutex_lock(pthread_mutex_t *mtx);
int pthread_mutex_unlock(pthread_mutex_t *mtx);
int pthread_create(pthread_t *thread, const pthread_attr_t *attr,
    void *(*fun) (void *), void *arg);
int pthread_join(pthread_t thread, void **retval);
int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *attr);
int pthread_mutex_destroy(pthread_mutex_t *mutex);
int pthread_cond_init(pthread_cond_t *cond, pthread_condattr_t *cond_attr);
int pthread_cond_destroy(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `(a) Barrera donde el servidor espera notificaciones de los clientes:

\`\`\`c
struct barrier {
    int num_threads;
    int counter;
    pthread_mutex_t m;
    pthread_cond_t server;
};

struct barrier *barrier_create(int num_threads) {
    struct barrier *b = malloc(sizeof(struct barrier));
    if (!b) return NULL;
    b->num_threads = num_threads;
    b->counter = 0;
    if (pthread_mutex_init(&b->m, NULL)) { free(b); return NULL; }
    if (pthread_cond_init(&b->server, NULL)) {
        pthread_mutex_destroy(&b->m); free(b); return NULL;
    }
    return b;
}

int barrier_server(struct barrier *barrier) {
    pthread_mutex_lock(&barrier->m);
    while (barrier->counter < barrier->num_threads)
        pthread_cond_wait(&barrier->server, &barrier->m);
    pthread_mutex_unlock(&barrier->m);
    return 0;
}

int barrier_client(struct barrier *barrier) {
    pthread_mutex_lock(&barrier->m);
    barrier->counter++;
    pthread_mutex_unlock(&barrier->m);
    pthread_cond_signal(&barrier->server);
    return 0;
}
\`\`\`

(b) Se añade una condición para los clientes y el servidor hace broadcast cuando todos han llegado:

\`\`\`c
struct barrier {
    int num_threads;
    int counter;
    pthread_mutex_t m;
    pthread_cond_t server;
    pthread_cond_t clients;
};

// barrier_create: igual que antes, añadiendo init de clients

int barrier_server(struct barrier *barrier) {
    pthread_mutex_lock(&barrier->m);
    while (barrier->counter < barrier->num_threads)
        pthread_cond_wait(&barrier->server, &barrier->m);
    pthread_cond_broadcast(&barrier->clients);
    pthread_mutex_unlock(&barrier->m);
    return 0;
}

int barrier_client(struct barrier *barrier) {
    pthread_mutex_lock(&barrier->m);
    barrier->counter++;
    pthread_cond_signal(&barrier->server);
    pthread_cond_wait(&barrier->clients, &barrier->m);
    pthread_mutex_unlock(&barrier->m);
    return 0;
}
\`\`\`

(c) Se añade una condición \`destroy\` y un contador de threads activos. Los clientes decrementan el contador al salir y avisan con signal a destroy. El servidor en barrier_destroy espera hasta que counter == 0:

\`\`\`c
struct barrier {
    int num_threads;
    int counter;
    pthread_mutex_t m;
    pthread_cond_t server;
    pthread_cond_t clients;
    pthread_cond_t destroy;
};

int barrier_client(struct barrier *barrier) {
    pthread_mutex_lock(&barrier->m);
    barrier->counter++;
    pthread_cond_signal(&barrier->server);
    pthread_cond_wait(&barrier->clients, &barrier->m);
    barrier->counter--;
    pthread_cond_signal(&barrier->destroy);
    pthread_mutex_unlock(&barrier->m);
    return 0;
}

int barrier_destroy(struct barrier *barrier) {
    pthread_mutex_lock(&barrier->m);
    while (barrier->counter > 0)
        pthread_cond_wait(&barrier->destroy, &barrier->m);
    pthread_mutex_unlock(&barrier->m);
    pthread_cond_destroy(&barrier->server);
    pthread_cond_destroy(&barrier->clients);
    pthread_cond_destroy(&barrier->destroy);
    pthread_mutex_destroy(&barrier->m);
    free(barrier);
    return 0;
}
\`\`\``,
    explanation:
      "(a) Simple notification barrier: clients increment counter and signal server; server waits until counter == num_threads. (b) Two-phase barrier: after all clients arrive, server broadcasts to release them all. (c) Safe destruction: clients decrement counter on exit and signal destroy; barrier_destroy waits until counter == 0 before freeing. This is the classic three-condition-variable barrier pattern.",
  },

  // --- Paralelismo ---

  {
    id: "2021-06_q3",
    exam: "2021-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    image: getImage(imageMap, "border-map-2021-06.jpeg"),
    subquestions: [
      "(a) [0.5p] Si la computación de cada celda es independiente, ¿qué tipo de descomposición y de asignación de tareas aplicarías en este problema?",
      "(b) [1p] Si al paralelizar el problema sobre 16 procesos el número mínimo, medio y máximo de celdas vigiladas por proceso es 100, 120, 140, respectivamente. ¿Cuál es el tiempo de ejecución paralelo de una iteración del bucle, el speedup y la eficiencia?",
      "(c) [0.5p] Supongamos que se modifica el algoritmo de forma que el cómputo asociado a cada celda vigilada requiere 3 escalares de cada una de sus 4 celdas vecinas, y que paralelizamos por bloques de filas con una media de 9 celdas vigiladas por fila. Si la matriz fuese de 160×160 y usásemos 16 procesadores, ¿cuál sería el tiempo de ejecución de una iteración?",
      "(d) [0.5p] Si descomponemos la matriz de 160×160 sobre una malla de 4×7 procesadores de forma no cíclica, ¿a qué proceso sería asignado el elemento (100,100) y cuál será su posición relativa?",
    ],
    question: `A lo largo de una frontera se han instalado cámaras y sensores a fin de detectar posibles intrusiones. La información recogida se mapea sobre una matriz en la que cada celda representa una porción de terreno. En cada celda vigilada se ejecuta un algoritmo que determina si puede haber una intrusión.

\`\`\`c
while (1) {
    para cada celda de interés (i,j):
        datos_celda(i,j) = recabar_datos(i,j);
        estimación(i,j) = computación(datos_celda(i,j));
    estimación_global = reducción(estimación);
    si intrusión(estimación_global):
        emitir_alarma();
}
\`\`\`

El coste por celda vigilada de recabar_datos son 120 ms y el de computación 180 ms. La función reducción reduce a un escalar la información de si ha habido intrusión en alguna celda y su coste computacional es prácticamente cero, lo cual también ocurre con intrusión y emitir_alarma. El sistema no permite solapar comunicaciones y computaciones y necesita 4 + 1×n ms para comunicar n escalares entre dos procesadores.

Responde RAZONADAMENTE a las siguientes cuestiones.`,
    correctAnswer: `(a) La computación sobre la matriz tiene peso irregular (solo celdas vigiladas). La mejor opción es crear un vector de estructuras con las V celdas vigiladas y sus índices (i,j), y dividir este vector por bloques o cíclicamente entre los procesadores. Esto garantiza el máximo equilibrio. El reparto por bloques da ⌈V/P⌉ celdas por proceso (excepto el último). La asignación es **estática** ya que el coste por celda es fijo y conocido.

(b) El proceso más cargado tiene 140 celdas → 140 × (120 + 180) = 42000 ms = 42 s. La reducción binomial en 16 procesos: log₂(16) = 4 pasos, cada uno 4 + 1×1 = 5 ms → 20 ms. Tiempo paralelo = 42.02 s.

Total celdas vigiladas: 120 × 16 = 1920. Tiempo secuencial: 1920 × 300 ms = 576 s.

- **Speedup = 576 / 42.02 ≈ 13.71**
- **Eficiencia = 13.71 / 16 ≈ 0.857 (85.7%)**

(c) Cada proceso procesa 160/16 = 10 filas × 9 celdas = 90 celdas. Tiempo cómputo = 90 × 300 ms = 27 s. Reducción entre 16 procesos: 20 ms → 27.02 s.

Comunicación de vecinos: cada proceso necesita mandar/recibir 3 escalares por celda vecina a las celdas vigiladas. Con optimización (mandar solo los índices de columnas una vez al inicio, luego solo los 3 escalares en cada iteración): 2 × (4 + 9×3) = 2 × 31 = 62 ms.

Tiempo total ≈ 27.02 + 0.062 = **27.08 s**.

(d) Bloques de 160/4=40 × ⌈160/7⌉=23. Procesador: (⌊100/40⌋, ⌊100/23⌋) = **(2, 4)**.
Posición local: (100 mod 40, 100 mod 23) = **(20, 8)**.`,
    explanation:
      "The key insight is that only border cells have computation (irregular load). A vector of structures approach (storing only the active cells) gives perfect load balance. The 300ms per cell (120+180) dominates. Communication is kept minimal by only sending the 3 scalar values for neighboring cells rather than entire rows.",
  },

  {
    id: "2021-06_q4",
    exam: "2021-06",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    image: getImage(imageMap, "task-graph-2021-06.jpeg"),
    explanationImage: getImage(imageMap, "pipeline-timeline-2021-06.jpeg"),
    subquestions: [
      "(a) [0.5p] Indica el tipo de descomposición que debemos aplicar al problema, y la asignación de tareas a los procesos.",
      "(b) [0.5p] Determina la latencia de procesamiento de un bloque de datos y la aceleración tras la ejecución de 100 iteraciones del bucle while.",
      "(c) [1.5p] Realiza una implementación paralela del algoritmo usando MPI.",
    ],
    question: `Un sistema de monitorización en tiempo real dispone de una sonda que proporciona un bloque de datos en 50 ms, representados en un vector v de n elementos. El procesamiento de cada bloque consiste en calcular un valor r como el producto escalar entre el resultado de multiplicar una matriz cuadrada A de n×n por el vector v, y el propio vector ordenado v̂. Finalmente, update actualiza el estado del sistema.

\`\`\`c
double A[N][N], v[N], v_sort[N], Av[N], a;
input_matrix(A,N,N);     // lee la matriz A (15 ms)
while(1) {
    input_vector(v,N);   // accede a la sonda (50 ms)
    for (i=0; i<N; i++) { // producto matriz-vector (50 ms)
        Av[i] = 0.0;
        for (j=0; j<N; j++)
            Av[i] += A[i][j]*v[j];
    }
    sort(v, v_sort);     // ordena el vector (20 ms)
    a = 0.0;
    for (i=0; i<N; i++)  // producto escalar (30 ms)
        a += Av[i] * v_sort[i];
    update(a);           // actualización de estado (10 ms)
}
\`\`\`

La sonda produce datos constantemente. Esta implementación secuencial provoca la pérdida de gran cantidad de información porque se emplea demasiado tiempo en procesar cada vector. Queremos una implementación paralela que minimice el tiempo de espera entre lecturas de la sonda. Disponemos de 4 núcleos. Las funciones input_matrix, input_vector, sort y update no pueden paralelizarse, pero cualquier proceso puede realizar cualquiera de ellas. El coste de comunicaciones es despreciable.

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) **Descomposición funcional** organizando el sistema como un **pipeline**. Asignación de tareas:
- P0: input_vector (50 ms)
- P1: producto matriz-vector (50 ms)
- P2: sort (20 ms)
- P3: producto escalar + update (40 ms)
Cada etapa del pipeline tiene duración máxima de 50 ms.

(b) Latencia (camino crítico): 50 + 50 + 30 + 10 = **140 ms**.
100 bloques secuenciales: 160 × 100 = 16000 ms.
Pipeline: 50 × 99 + 140 = **5090 ms**.
**Aceleración = 16000 / 5090 ≈ 3.14**

(c) Implementación MPI con pipeline:

\`\`\`c
double A[N][N], v[N], v_sort[N], Av[N], a;

// Solo el proceso 1 necesita la matriz A
if (mpi_rank == 1)
    input_matrix(A, N, N);

while (1) {
    if (mpi_rank == 0) {
        input_vector(v, N);
        MPI_Send(v, N, MPI_DOUBLE, 1, 0, MPI_COMM_WORLD);
        MPI_Send(v, N, MPI_DOUBLE, 2, 0, MPI_COMM_WORLD);
    }
    else if (mpi_rank == 1) {
        MPI_Recv(v, N, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        for (i = 0; i < N; i++) {
            Av[i] = 0.0;
            for (j = 0; j < N; j++)
                Av[i] += A[i][j] * v[j];
        }
        MPI_Send(Av, N, MPI_DOUBLE, 3, 0, MPI_COMM_WORLD);
    }
    else if (mpi_rank == 2) {
        MPI_Recv(v, N, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        sort(v, v_sort);
        MPI_Send(v_sort, N, MPI_DOUBLE, 3, 1, MPI_COMM_WORLD);
    }
    else if (mpi_rank == 3) {
        MPI_Recv(Av, N, MPI_DOUBLE, 1, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        MPI_Recv(v_sort, N, MPI_DOUBLE, 2, 1, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        a = 0.0;
        for (i = 0; i < N; i++)
            a += Av[i] * v_sort[i];
        update(a);
    }
}
\`\`\``,
    explanation:
      "Functional decomposition into a pipeline is optimal here. P0 reads the sensor and fans out data to P1 (matrix-vector) and P2 (sort). P1 and P2 work in parallel, then both send results to P3 for the dot product and update. The pipeline's throughput is determined by the slowest stage (50 ms). Blocking sends (MPI_Send) synchronize the pipeline naturally.",
  },

  // ================================================================
  // 2021-07 (Julio 2021 — Convocatoria extraordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2021-07_q1",
    exam: "2021-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2.5,
    question: `Queremos implementar un sistema donde una serie de clientes esperan a ser atendidos por un servidor. Los clientes esperan en una cola indicada por \`c->queue_number\` de entre N posibles, numeradas de 0 a N-1. Dentro de cada cola los clientes deben ser atendidos en orden de llegada, y una vez son avisados por el servidor llaman a \`get_service()\`.

El servidor atiende a un cliente de cada vez, rotando entre las colas, es decir, atendiendo un cliente de la cola 0, después de la 1, y así sucesivamente. Si una cola está vacía, el servidor debe pasar a la siguiente. No es necesario controlar el caso de que todas las colas estén vacías. Para simular el proceso de atender al cliente el servidor llama a \`serve()\`.

Las llamadas a \`serve()\` y \`get_service()\` deben hacerse sin ningún mutex bloqueado.

\`\`\`c
#define N ...

void insert(queue *q, void *);
void *remove(queue *q);
int elements(queue *q);

struct customer {
    int queue_number;
};

queue *q[N];

void *customer(void *ptr) {
    struct customer *c = ptr;
    ...
    get_service();
}

void *server(void *ptr) {
    while(1) {
        ...
        serve();
    }
}
\`\`\`

Complete la implementación de \`customer\` y \`server\`.`,
    correctAnswer: `Se necesita una variable de condición por cola. Cada cliente tiene su propia variable de condición para ser despertado individualmente. El servidor rota entre las colas en orden circular.

\`\`\`c
#define N ...

struct customer_info {
    struct customer *c;
    pthread_cond_t wait;
};

pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t q_cv[N];
int current_queue = 0;

void *customer(void *ptr) {
    struct customer *c = ptr;
    struct customer_info ci;
    ci.c = c;
    pthread_cond_init(&ci.wait, NULL);

    pthread_mutex_lock(&m);
    insert(q[c->queue_number], &ci);
    pthread_cond_signal(&q_cv[c->queue_number]);
    pthread_cond_wait(&ci.wait, &m);
    pthread_mutex_unlock(&m);

    get_service();
    return NULL;
}

void *server(void *ptr) {
    while (1) {
        pthread_mutex_lock(&m);
        int found = 0;
        for (int i = 0; i < N; i++) {
            int q_idx = (current_queue + i) % N;
            if (elements(q[q_idx]) > 0) {
                struct customer_info *ci = remove(q[q_idx]);
                pthread_cond_signal(&ci->wait);
                current_queue = (q_idx + 1) % N;
                found = 1;
                break;
            }
        }
        if (!found)
            pthread_cond_wait(&q_cv[current_queue], &m);
        pthread_mutex_unlock(&m);

        if (found)
            serve();
    }
}
\`\`\``,
    explanation:
      "Each queue has a condition variable. Customers insert their info struct into their assigned queue, signal the queue's CV, and wait on their personal condition. The server iterates through queues in round-robin order, starting from current_queue. When it finds a non-empty queue, it removes the first customer, signals them, and updates current_queue to the next queue (ensuring fair rotation). If all queues are empty, the server waits on the current queue's CV.",
  },

  {
    id: "2021-07_q2",
    exam: "2021-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [1.25p] Crear la función runner() que simula un corredor en una carrera de relevos usando broadcast.",
      "(b) [1.25p] Modificar la implementación anterior para que se pueda usar signal() en vez de broadcast(), es decir, cada corredor despierta solo al siguiente.",
    ],
    question: `Crear la función \`runner()\` que simula un corredor en una carrera de relevos.

Cosas a tener en cuenta:
- No pueden usarse variables globales.
- No puede hacerse espera activa.
- El primer (1) y el último (N) corredor son especiales.
- El primero tiene que esperar a que se dé la salida, y que ésta sea válida. Si no es válida hay que repetir la carrera. La variable \`valid_start\` indica si la salida es válida. La variable de condición \`start\` se lanza cada vez que hay una salida.
- El último corredor tiene que imprimir un mensaje cuando llega a meta.
- Cada corredor imprimirá desde qué hora está listo, a qué hora recibe el testigo y a qué hora termina su relevo. Usar la función \`seconds_since_start()\` para saber cuántos segundos han pasado desde el comienzo de la carrera.
- Los corredores tienen que correr en orden de número (parámetro \`id_runner\`).
- Cada corredor tiene que pasar el testigo al siguiente corredor. Pista, úsese un campo en la estructura \`token\`.
- El programa tiene que funcionar incluso si un corredor se despierta en un momento en que no le toque correr.
- Cada corredor tiene que ejecutar la función \`run_100_meters()\`, que es la que simula que ha corrido los metros que le corresponde.

\`\`\`c
struct token {
    int total_num_runners;
    pthread_cond_t start;
    bool valid_start;
};

void runner(int id_runner, struct token *t) {
    ...
    run_100_meters();
    ...
}

int seconds_since_start(void);
\`\`\`

\`\`\`c
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_mutex_lock(pthread_mutex_t *mtx);
int pthread_mutex_unlock(pthread_mutex_t *mtx);
int pthread_cond_init(pthread_cond_t *cond, pthread_condattr_t *cond_attr);
\`\`\``,
    correctAnswer: `(a) Con broadcast:

\`\`\`c
struct token {
    int total_num_runners;
    pthread_cond_t start;
    bool valid_start;
    pthread_mutex_t m;
    pthread_cond_t runner_cv;  // shared condition for all runners
    int next_runner;           // which runner should run now
};

void runner(int id_runner, struct token *t) {
    printf("Runner %d ready at %d\\n", id_runner, seconds_since_start());

    if (id_runner == 1) {
        pthread_mutex_lock(&t->m);
        while (!t->valid_start)
            pthread_cond_wait(&t->start, &t->m);
        printf("Runner %d starts at %d\\n", id_runner, seconds_since_start());
        pthread_mutex_unlock(&t->m);
    } else {
        pthread_mutex_lock(&t->m);
        while (t->next_runner != id_runner)
            pthread_cond_wait(&t->runner_cv, &t->m);
        printf("Runner %d receives token and starts at %d\\n", id_runner, seconds_since_start());
        pthread_mutex_unlock(&t->m);
    }

    run_100_meters();

    printf("Runner %d ends at %d\\n", id_runner, seconds_since_start());

    pthread_mutex_lock(&t->m);
    if (id_runner == t->total_num_runners) {
        printf("Last runner finished! Race complete.\\n");
        t->next_runner = 1;
    } else {
        t->next_runner = id_runner + 1;
    }
    pthread_cond_broadcast(&t->runner_cv);
    pthread_mutex_unlock(&t->m);
}
\`\`\`

(b) Con signal (cada corredor despierta solo al siguiente):

\`\`\`c
struct token {
    int total_num_runners;
    pthread_cond_t start;
    bool valid_start;
    pthread_mutex_t m;
    pthread_cond_t *runner_cv;  // array: pthread_cond_t runner_cv[total_num_runners+1]
    int current;
};

void runner(int id_runner, struct token *t) {
    printf("Runner %d ready at %d\\n", id_runner, seconds_since_start());

    pthread_mutex_lock(&t->m);

    if (id_runner == 1) {
        while (!t->valid_start)
            pthread_cond_wait(&t->start, &t->m);
    } else {
        while (t->current != id_runner)
            pthread_cond_wait(&t->runner_cv[id_runner], &t->m);
    }

    printf("Runner %d starts at %d\\n", id_runner, seconds_since_start());
    pthread_mutex_unlock(&t->m);

    run_100_meters();

    printf("Runner %d ends at %d\\n", id_runner, seconds_since_start());

    pthread_mutex_lock(&t->m);
    if (id_runner == t->total_num_runners) {
        printf("Last runner finished!\\n");
        t->current = 1;
    } else {
        t->current = id_runner + 1;
        pthread_cond_signal(&t->runner_cv[id_runner + 1]);
    }
    pthread_mutex_unlock(&t->m);
}
\`\`\``,
    explanation:
      "(a) Uses broadcast: all runners share a single runner_cv. When a runner finishes, they set next_runner and broadcast. Runners whose id_runner doesn't match next_runner go back to waiting. (b) Uses signal with individual CVs: each runner has its own condition variable. The finishing runner signals only the specific next runner. This is more efficient as only one thread wakes up. The while loop guard (current != id_runner) handles spurious wakeups and ensures correct ordering even if a runner wakes at the wrong time.",
  },

  // --- Paralelismo ---

  {
    id: "2021-07_q3",
    exam: "2021-07",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] ¿Cuál es la aceleración máxima que puede obtener BarbaFIC en el proceso completo de búsqueda del tesoro gracias a dividir la segunda fase entre varios piratas?",
      "(b) [0.5p] ¿Qué tipo de descomposición y asignación de tareas está usando BarbaFIC?",
      "(c) [0.5p] Con 100 fragmentos iguales, 90 minutos por fragmento, 10 minutos de viaje entre exploraciones y 4 marineros, ¿cuál es la aceleración y la eficiencia?",
      "(d) [0.5p] ¿Cuál es el mínimo número de marineros para hacer la búsqueda al menos cuatro veces más rápido que secuencialmente?",
      "(e) [0.5p] Indica una optimización que se podría realizar al proceso de búsqueda paralelo.",
    ],
    question: `El capitán pirata BarbaFIC tiene un método para esconder tesoros: los distribuye en muchas bolsitas que entierra a lo largo de una isla. Para recuperarlo: 1) Analiza el mapa de la isla dividiéndola en fragmentos iguales; 2) Cava hoyos en cada fragmento, uno tras otro, para encontrar partes del tesoro.

El análisis del mapa siempre necesita 1/10 del tiempo total y solo lo hace BarbaFIC. Para el segundo paso contrata marineros. Cada marinero cava fragmentos asignados, vuelve a la playa donde BarbaFIC le asigna un nuevo fragmento.

Responde DE FORMA RAZONADA.`,
    correctAnswer: `(a) Por la ley de Amdahl: la parte secuencial (análisis del mapa) es 1/10 del tiempo total. La aceleración máxima es:

**A_max = (1/10 + 9/10) / (1/10) = 1 / (1/10) = 10**

(b) **Descomposición de dominio** (divide la isla en fragmentos iguales) y **asignación dinámica del tipo maestro-esclavo** (BarbaFIC coordina, los marineros ejecutan y vuelven por nuevas tareas).

(c) Tiempo secuencial total: análisis 1000 min + cavar 9000 min = **10000 min**.
Con 4 marineros: cada uno cava 25 fragmentos → 25×90 = 2250 min. Viajes: (25−1)×10 = 240 min extra. Tiempo paralelo fase 2: 2490 min. Total paralelo: 1000 + 2490 = 3490 min.

**Aceleración = 10000 / 3490 ≈ 2.87**
**Eficiencia = 2.87 / 5 ≈ 0.57**

(d) Con n marineros: T_par(n) = 1000 + (100/n)×90 + (100/n − 1)×10.
Para speedup = 4: 10000 / T_par(n) = 4.
Despejando: 10000 / (1000 + 9000/n + 1000/n − 10) = 4 → n ≈ 6.62 → **7 marineros**.

(e) Optimización: en lugar de asignar un fragmento cada vez, BarbaFIC puede asignar un conjunto de fragmentos por adelantado a cada marinero (asignación estática), eliminando los viajes de retorno. Como los fragmentos son homogéneos (90 min cada uno), el reparto estático es óptimo y elimina los 240 min de overhead de viajes.`,
    explanation:
      "Amdahl's law: the 10% sequential fraction (map analysis) caps speedup at 10. The master-slave assignment has overhead from mariners returning for new tasks. With 4 mariners, the coordination overhead (240 min of travel) significantly reduces efficiency. Static assignment would eliminate this overhead entirely when fragment times are uniform.",
  },

  {
    id: "2021-07_q4",
    exam: "2021-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Descomposición y asignación de tareas justificadas.",
      "(b) [1.25p] Código MPI reflejando la descomposición y asignación propuesta, sin colectivas.",
      "(c) [0.75p] ¿Es posible mejorar el código mediante colectivas? De ser así escribe la versión correspondiente en MPI.",
    ],
    question: `Queremos paralelizar el siguiente código en un sistema de P procesadores donde el procesador 0 es el único que tiene acceso al disco duro y N es múltiplo de P:

\`\`\`c
void main(int argc, char *argv[]) {
    double max_desv, media = 0., max = 0., min = 0.;
    double u[N][N];

    LeeMatriz(u);

    // calcular estadísticas
    for(int i=0; i<N; i++)
        for(int j=0; j<N; j++){
            media = media + u[i][j];
            if(u[i][j] > max) max = u[i][j];
            if(u[i][j] < min) min = u[i][j];
        }
    media = media / (N*N);
    max_desv = ((max - media) > (media - min)) ? (max - media) : (media - min);

    // modificar matriz
    for(int i=0; i<N; i++)
        for(int j=0; j<N; j++){
            u[i][j] = u[i][j] - max_desv;
        }
    EscribeMatriz(u);
}
\`\`\`

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Allreduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) Descomposición híbrida con 4 fases: lectura (T1), cálculo de estadísticas (T2), modificación (T3), escritura (T4). T2 y T3 se subdividen: T3 es **descomposición de dominio** con operaciones paralelas sobre la matriz. T2 es una descomposición **divide-y-vencerás** (media, máximo y mínimo de submatrices que luego se combinan). La asignación es **estática** (todos los elementos son conocidos de antemano).

(b) Sin colectivas:

\`\`\`c
int rank, P;
double max_desv, media = 0., max = 0., min = 0.;
double u[N][N], buf[3];

if(!rank) {
    LeeMatriz(u);
    for(int i = 1; i < P; i++)
        MPI_Send(u[N/P*i], N/P*N, MPI_DOUBLE, i, 0, MPI_COMM_WORLD);
} else {
    MPI_Recv(u, N/P*N, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
}

for(int i=0; i<N/P; i++)
    for(int j=0; j<N; j++){
        media += u[i][j];
        if(u[i][j] > max) max = u[i][j];
        if(u[i][j] < min) min = u[i][j];
    }

if(!rank) {
    for(int i = 1; i < P; i++) {
        MPI_Recv(buf, 3, MPI_DOUBLE, MPI_ANY_SOURCE, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        media += buf[0];
        if(buf[1] > max) max = buf[1];
        if(buf[2] < min) min = buf[2];
    }
    media /= (N*N);
    max_desv = ((max - media) > (media - min)) ? (max - media) : (media - min);
    for(int i = 1; i < P; i++)
        MPI_Send(&max_desv, 1, MPI_DOUBLE, i, 0, MPI_COMM_WORLD);
} else {
    buf[0] = media; buf[1] = max; buf[2] = min;
    MPI_Send(buf, 3, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD);
    MPI_Recv(&max_desv, 1, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
}

for(int i=0; i<N/P; i++)
    for(int j=0; j<N; j++)
        u[i][j] -= max_desv;

if(!rank) {
    for(int i = 1; i < P; i++)
        MPI_Recv(u[N/P*i], N/P*N, MPI_DOUBLE, i, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
    EscribeMatriz(u);
} else
    MPI_Send(u, N/P*N, MPI_DOUBLE, 0, 0, MPI_COMM_WORLD);
\`\`\`

(c) Con colectivas (mucho más limpio):

\`\`\`c
int rank, P;
double max_desv, media = 0., max = 0., min = 0.;
double u[N][N], buf;

if(!rank) LeeMatriz(u);

MPI_Scatter(u, N/P*N, MPI_DOUBLE, rank ? u : MPI_IN_PLACE, N/P*N, MPI_DOUBLE, 0, MPI_COMM_WORLD);

for(int i=0; i<N/P; i++)
    for(int j=0; j<N; j++){
        media += u[i][j];
        if(u[i][j] > max) max = u[i][j];
        if(u[i][j] < min) min = u[i][j];
    }

MPI_Allreduce(&media, &buf, 1, MPI_DOUBLE, MPI_SUM, MPI_COMM_WORLD);
media = buf / (N*N);
MPI_Allreduce(&max, &buf, 1, MPI_DOUBLE, MPI_MAX, MPI_COMM_WORLD);
max = buf;
MPI_Allreduce(&min, &buf, 1, MPI_DOUBLE, MPI_MIN, MPI_COMM_WORLD);
min = buf;
max_desv = ((max - media) > (media - min)) ? (max - media) : (media - min);

for(int i=0; i<N/P; i++)
    for(int j=0; j<N; j++)
        u[i][j] -= max_desv;

MPI_Gather(rank ? u : MPI_IN_PLACE, N/P*N, MPI_DOUBLE, u, N/P*N, MPI_DOUBLE, 0, MPI_COMM_WORLD);
if(!rank) EscribeMatriz(u);
\`\`\``,
    explanation:
      "The improvement with collectives is dramatic: Scatter replaces manual point-to-point sends for data distribution; Allreduce with MPI_SUM/MAX/MIN replaces the manual master-slave result gathering, eliminating the need for collecting buf[3] arrays at the root and broadcasting max_desv; Gather replaces the manual point-to-point result collection. Allreduce also gives correct results on all processes, eliminating the need to broadcast max_desv.",
  },

  // ================================================================
  // 2022-06 (Junio 2022 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2022-06_q1",
    exam: "2022-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Un sistema gestiona la salida a disco a través de un único thread que recibe peticiones del resto de threads del sistema. Cuando un thread quiere realizar una operación de escritura, envía una petición a través de una cola. Para simplificar, asumimos que la cola es segura frente a accesos concurrentes.

\`\`\`c
struct request {
    request_info inf;
    ...
};

// Funciones ya implementadas
struct request *remove_request();
void insert_request(struct request *r);

void submit_request(struct request *r) {
    insert_request(r);
}

void wait_till_done(struct request *r) {
    ...
}

void *io_thread(void *ptr) {
    while (1) {
        struct request *r;
        r = remove_request();
        do_io(r->inf);
    }
}
\`\`\`

Implemente la función \`wait_till_done\`, y modifique \`io_thread\` y \`submit_request\` para que los threads que han enviado una petición puedan llamarla para esperar hasta que ésta se haya completado. Si la escritura ya se completó la llamada debería volver inmediatamente. Puede añadir más campos a la estructura \`request\` si lo necesita.

\`\`\`c
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_mutex_lock(pthread_mutex_t *mtx);
int pthread_mutex_unlock(pthread_mutex_t *mtx);
int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *attr);
int pthread_cond_init(pthread_cond_t *cond, pthread_condattr_t *cond_attr);
\`\`\``,
    correctAnswer: `Se añade un mutex, una variable de condición y un flag done a cada request.

\`\`\`c
struct request {
    request_info inf;
    pthread_mutex_t m;
    pthread_cond_t c;
    int done;
};

void submit_request(struct request *r) {
    r->done = 0;
    pthread_mutex_init(&r->m, NULL);
    pthread_cond_init(&r->c, NULL);
    insert_request(r);
}

void wait_till_done(struct request *r) {
    pthread_mutex_lock(&r->m);
    if (!r->done)
        pthread_cond_wait(&r->c, &r->m);
    pthread_mutex_unlock(&r->m);
}

void *io_thread(void *ptr) {
    while (1) {
        struct request *r;
        r = remove_request();
        do_io(r->inf);
        pthread_mutex_lock(&r->m);
        r->done = 1;
        pthread_cond_broadcast(&r->c);
        pthread_mutex_unlock(&r->m);
    }
}
\`\`\``,
    explanation:
      "Each request gets its own mutex and condition variable plus a done flag. submit_request initializes them and sets done=0. wait_till_done checks the flag; if not done, waits on the condition. io_thread, after completing the I/O, locks the mutex, sets done=1, and broadcasts to wake any waiters. The broadcast ensures all waiters (if any) are woken, and the if (!done) check in wait_till_done ensures it returns immediately if already completed.",
  },

  {
    id: "2022-06_q2",
    exam: "2022-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    repeated: true,
    question: `Crear la función \`runner()\` que simula un corredor en una carrera de relevos con equipos.

Condiciones:
- No pueden usarse variables globales ni espera activa ni semáforos.
- El primer (1) y el último (N) corredor de cada equipo son especiales.
- El primero espera a que se dé una salida válida (\`valid_start\`). Si no es válida, se repite.
- Cada corredor indica con un mensaje desde qué hora está listo, a qué hora recibe el testigo y a qué hora termina su relevo. Usar \`seconds_since_start()\`.
- El último corredor de cada equipo indica en qué posición ha llegado.
- Los corredores de cada equipo corren en orden de número (parámetro \`id_runner\`).
- Cada corredor pasa el testigo al siguiente del mismo equipo.
- El programa debe funcionar incluso si un corredor se despierta cuando no le toca correr.
- Se pueden añadir campos a \`struct global\` y \`struct team\`.
- Hay que minimizar el tiempo desde que un corredor puede correr hasta que empieza a correr.

\`\`\`c
struct global {
    pthread_cond_t start;
    pthread_mutex_t m;
    bool valid_start;     // initialized to false
};

struct team {
    int num_runners_team;
};

void runner(struct global *g, struct team *t, int id_runner) {
    ...
    run_100_meters();
    ...
}

int seconds_since_start(void);
\`\`\``,
    correctAnswer: `\`\`\`c
struct global {
    pthread_cond_t start;
    pthread_mutex_t m;
    bool valid_start;
    int position;           // current finishing position
};

struct team {
    int num_runners_team;
    char *team_name;
    pthread_cond_t wait_token[];  // one per runner
    pthread_mutex_t m;
    int next;                    // which runner should run next
};

void runner(struct global *g, struct team *t, int id_runner) {
    printf("Runner %d is ready at %d\\n", id_runner, seconds_since_start());

    if (id_runner == 1) {
        pthread_mutex_lock(&g->m);
        while (!g->valid_start)
            pthread_cond_wait(&g->start, &g->m);
        pthread_mutex_unlock(&g->m);
        pthread_mutex_lock(&t->m);
        t->next = 2;
    } else {
        pthread_mutex_lock(&t->m);
        while (t->next != id_runner)
            pthread_cond_wait(&t->wait_token[id_runner - 2], &t->m);
        t->next++;
    }

    printf("Runner %d starts running at %d\\n", id_runner, seconds_since_start());
    pthread_mutex_unlock(&t->m);

    run_100_meters();

    printf("Runner %d ends running at %d\\n", id_runner, seconds_since_start());

    if (id_runner == t->num_runners_team) {
        pthread_mutex_lock(&g->m);
        int pos = ++g->position;
        pthread_mutex_unlock(&g->m);
        printf("Team %s finish in position %d\\n", t->team_name, pos);
    } else {
        pthread_mutex_lock(&t->m);
        pthread_cond_signal(&t->wait_token[id_runner - 1]);
        pthread_mutex_unlock(&t->m);
    }
}
\`\`\``,
    explanation:
      "Runner 1 waits for the global valid_start, then sets t->next = 2 and releases the team mutex before running. Other runners wait until t->next == id_runner. After running: if last, increments the global position counter and prints the team's finishing position; otherwise signals the next runner's specific condition variable. The per-runner condition variables (wait_token[]) ensure each runner only wakes the next one. The while loop (t->next != id_runner) guards against spurious wakeups and ensures correct ordering even if a runner wakes at the wrong time.",
  },

  {
    id: "2022-06_q3",
    exam: "2022-06",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1,
    repeated: true,
    question: `Tenemos un sistema con un grupo de procesos distribuidos en una estructura de anillo, donde cada proceso conoce únicamente el PID del siguiente.

\`\`\`erlang
-module(ring).
-export([start/1, init/0, ring_size/1]).

start(N) ->
    Pids = start_processes(N),
    send_next(Pids),
    Pids.

ring_size(Pid) ->
    ...

start_processes(0) -> [];
start_processes(N) -> [spawn(?MODULE, init, []) | start_processes(N - 1)].

send_next([], []) -> ok;
send_next([Pid | Pids], [Next_pid | Next_pids]) ->
    Pid ! {next, Next_pid},
    send_next(Pids, Next_pids).

send_next([Pid | Pids]) ->
    send_next([Pid | Pids], Pids ++ [Pid]).

init() ->
    receive
        {next, Next_pid} ->
            loop(Next_pid)
    end.

loop(Next_pid) ->
    ...
    loop(Next_pid).
\`\`\`

Implemente la función \`ring_size/1\`, que dado el pid de uno de los procesos del anillo, devuelve el número total de procesos que forman parte del mismo. Modifique únicamente las funciones \`ring_size\` y \`loop\`.`,
    correctAnswer: `\`\`\`erlang
-module(ring).
-export([start/1, init/0, ring_size/1]).

start(N) ->
    Pids = start_processes(N),
    send_next(Pids),
    Pids.

ring_size(Pid) ->
    Pid ! {get_size, self(), Pid},
    receive
        {get_size_reply, Size} -> Size
    end.

start_processes(0) -> [];
start_processes(N) -> [spawn(?MODULE, init, []) | start_processes(N - 1)].

send_next([], []) -> ok;
send_next([Pid | Pids], [Next_pid | Next_pids]) ->
    Pid ! {next, Next_pid},
    send_next(Pids, Next_pids).

send_next([Pid | Pids]) ->
    send_next([Pid | Pids], Pids ++ [Pid]).

init() ->
    receive
        {next, Next_pid} ->
            loop(Next_pid)
    end.

loop(Next_pid) ->
    receive
        {get_size, From, First} ->
            Next_pid ! {go_around, From, First, 1};
        {go_around, From, self(), N} ->
            From ! {get_size_reply, N};
        {go_around, From, First, N} ->
            Next_pid ! {go_around, From, First, N + 1}
    end,
    loop(Next_pid).
\`\`\``,
    explanation:
      "ring_size sends a {get_size, From, First} message to the starting process, where First is the PID of the starting process (used to detect when we've gone full circle). The receiving process forwards a {go_around, From, First, 1} message to its Next_pid. Each subsequent process increments N and forwards. When the message returns to the starting process (Next_pid == self()), it replies with the final count. This is a classic token-ring counting algorithm.",
  },

  // --- Paralelismo ---

  {
    id: "2022-06_q4",
    exam: "2022-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] ¿Cuál es la máxima aceleración que se podría conseguir si invertimos muchos recursos en la realización de las encuestas telefónicas?",
      "(b) [0.5p] ¿Qué descomposición y asignación de tareas utilizarías? (densidad no uniforme, director asigna al inicio, no disponible durante las encuestas)",
      "(c) [1p] Con 3 trabajadores, balanceo perfecto (100000 encuestas cada uno), reunión de 15 min con cada trabajador, recolección instantánea: calcula tiempo paralelo, speedup, eficiencia, coste y sobrecarga.",
      "(d) [0.5p] ¿Qué optimización se te ocurre si el director pudiese estar disponible en todo momento pero no está dispuesto a realizar llamadas?",
    ],
    question: `En estos momentos de "gripalización del COVID", un gobierno quiere hacer una encuesta telefónica a los 300000 domicilios de una región de 30000km². Cada llamada dura un minuto. El proyecto empieza con una tarea inicial de 4 horas donde el director divide el mapa en fragmentos de 10km² (solo él puede hacerlo). Al final, el director necesita otras 4 horas para integrar y analizar los resultados.

Responde DE FORMA RAZONADA.`,
    correctAnswer: `(a) Tareas secuenciales: descomposición del mapa (240 min) + integración (240 min) = 480 min. Llamadas: 300000 min. Fracción secuencial = 480 / 300480 = 0.0016.
**Aceleración máxima = 1 / 0.0016 = 625**

(b) **Descomposición de dominio** (cada fragmento es una tarea). **Asignación estática cíclica**: como la densidad de población no es uniforme (fragmentos urbanos tienen más llamadas), la cíclica distribuye mejor la carga agrupada que una asignación bloque. No se puede usar dinámica porque el director no está disponible durante las encuestas.

(c) Tiempo secuencial = 4h + 300000 min + 4h = 480 + 300000 = **300480 min**.
Tiempo paralelo:
- Análisis inicial (director solo): 240 min
- Reuniones (3 × 15 min, secuenciales): 45 min
- Encuestas (cada trabajador 100000 min, en paralelo): 100000 min
- Análisis final (director solo): 240 min
**T_par = 240 + 45 + 100000 + 240 = 100525 min**

**Speedup = 300480 / 100525 ≈ 2.99**
**Eficiencia = 2.99 / 4 ≈ 0.75**
**Coste = 100525 × 4 = 402100 min**
**Sobrecarga = 402100 − 300480 = 101620 min**

(d) Si el director está disponible: los trabajadores mandan resultados de cada fragmento según terminan. El director puede ir integrando y analizando en paralelo con las encuestas restantes, reduciendo el tiempo final de análisis casi a cero. Asignación maestro-esclavo no es buena porque cada asignación requiere una reunión de 15 min (overhead alto). Mejor: asignación estática inicial con entrega incremental de resultados.`,
    explanation:
      "Amdahl's law with only 0.16% sequential portion gives theoretical max speedup of 625. In practice, the director's coordination overhead (sequential meetings of 45 min) and the fixed 480 min of sequential work severely limit real speedup to just 2.99 with 4 people. The key bottleneck is the 100000 min of parallel work — the sequential overhead becomes negligible relative to this, but the speedup is limited because the sequential phases (480 min) add directly to the parallel time.",
  },

  {
    id: "2022-06_q5",
    exam: "2022-06",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    image: getImage(imageMap, "matrix-diagram-2022-06.jpeg"),
    subquestions: [
      "(a) [0.5p] Describe la paralelización más directa de este problema: de qué se haría cargo cada procesador, cómo se distribuirían/replicarían las matrices, y el tipo de asignación de tareas.",
      "(b) [1p] Escribe el código MPI asociado usando colectivas siempre que sea posible, asumiendo 10 procesos.",
      "(c) [0.5p] Calcula el número de datos que el servidor envía y recibe a/de cada uno de los otros ordenadores para C=50, P=200, M=20, N=20.",
      "(d) [0.5p] Dado que P (implicados) es mucho mayor que C (casos), ¿sería mejor otra estrategia de paralelización? Justifica con números.",
    ],
    question: `Un periódico mantiene una matriz A de tamaño C×P donde A_{ij} mide el nivel de implicación de la persona j en el caso de corrupción i. Recibe periódicamente dos matrices X e Y de tamaños P×M y P×N. Se calcula un índice de interés I_i sobre cada caso:

\`\`\`c
I_i = 0;
for (j = 0; j < P; j++) {
    for (k = 0; k < M; k++)
        I_i += A[i][j] * X[j][k];
    for (k = 0; k < N; k++)
        I_i -= A[i][j] * Y[j][k];
}
\`\`\`

Se dispone de un único servidor con disco (conectado a otros 9 ordenadores sin conexión entre sí). Toda operación en punto flotante o copia requiere 1 ciclo de CPU; la transmisión de un dato por red requiere 3 ciclos. Las colectivas no finalizan hasta que todos los mensajes se han completado. El proceso 0 se ejecuta en el servidor. Se desea paralelizar el cómputo del interés.

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) Cada proceso calcula C/10 elementos de I. **Descomposición de dominio** con **asignación estática**. Cada proceso recibe un bloque de C/10 filas de A (Scatter) y las matrices X e Y completas (Bcast, replicadas). El vector I global se obtiene con Gather.

(b) Código MPI:

\`\`\`c
double *A, *X, *Y, *I;
int rank, C, P, M, N, i, j, k;

if (!rank) read(&A, &X, &Y, &C, &P, &M, &N);

MPI_Bcast(&C, 1, MPI_INT, 0, MPI_COMM_WORLD);
MPI_Bcast(&P, 1, MPI_INT, 0, MPI_COMM_WORLD);
MPI_Bcast(&M, 1, MPI_INT, 0, MPI_COMM_WORLD);
MPI_Bcast(&N, 1, MPI_INT, 0, MPI_COMM_WORLD);

if (rank) {
    A = (double *)malloc(sizeof(double) * C/10 * P);
    X = (double *)malloc(sizeof(double) * P * M);
    Y = (double *)malloc(sizeof(double) * P * N);
}
I = (double *)malloc(sizeof(double) * C);

MPI_Scatter(A, C/10 * P, MPI_DOUBLE, rank ? A : MPI_IN_PLACE, C/10 * P, MPI_DOUBLE, 0, MPI_COMM_WORLD);
MPI_Bcast(X, P * M, MPI_DOUBLE, 0, MPI_COMM_WORLD);
MPI_Bcast(Y, P * N, MPI_DOUBLE, 0, MPI_COMM_WORLD);

for (i = 0; i < C/10; i++) {
    I[i] = 0;
    for (j = 0; j < P; j++) {
        for (k = 0; k < M; k++)
            I[i] += A[i * P + j] * X[j * M + k];
        for (k = 0; k < N; k++)
            I[i] -= A[i * P + j] * Y[j * N + k];
    }
}

MPI_Gather(rank ? I : MPI_IN_PLACE, C/10, MPI_DOUBLE, I, C/10, MPI_DOUBLE, 0, MPI_COMM_WORLD);
if (!rank) print(I, C);
\`\`\`

(c) Datos enviados del servidor a cada proceso: 4 enteros + C/10×P de A (=5×200=1000) + P×M de X (=200×20=4000) + P×N de Y (=4000) = **9004 datos**. Recibidos: C/10 = **5 datos**.

(d) **Sí**, es mejor particionar por la dimensión más grande (P). Partir A por bloques de columnas y X e Y por bloques de filas. Cada proceso obtiene un vector parcial I de C elementos (contribución de P/10=20 personas). Luego Reduce (SUM) para obtener I final.

Envío por proceso: 4 + C×P/10 + P/10×M + P/10×N = 4 + 1000 + 400 + 400 = **1804 datos** (vs 9004). Recibidos para Reduce: C = 50 datos.

Reducción: (9004+5)/(1804+50) ≈ **4.86× menos datos**. Coste extra: 9 sumas × 50 = 450 sumas (despreciable frente al ahorro en comunicación).`,
    explanation:
      "The key insight is that P (people, 200) is much larger than C (cases, 50). The naive row-wise partition of A (by cases) replicates X and Y entirely. A smarter column-wise partition of A (by people) avoids replicating X and Y entirely, instead sending each process only the columns of A and rows of X/Y it needs. This dramatically reduces communication volume at a negligible extra compute cost (a final Reduce instead of Gather).",
  },

  // ================================================================
  // 2022-07 (Julio 2022 — Convocatoria extraordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2022-07_q1",
    exam: "2022-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Un sistema tiene NTHREADS threads, de los que únicamente hay uno activo en cada momento. Ese thread le pasa el turno a otro thread del grupo, e imprime un mensaje con su número y el del thread que continúa el ciclo.

\`\`\`c
#define NTHREADS ...

struct tag_group {
    int current_thread;  // active thread
};

struct thr_args {
    int my_number;
    struct tag_group *t;  // Shared
};

void thread(void *ptr) {
    struct thr_args *p = ptr;
    int next;

    while (1) {
        ...
        next = rand() % NTHREADS;
        printf("thread %d tagging thread %d\\n", p->my_number, next);
    }
}
\`\`\`

Implemente la función thread de tal forma que el comportamiento sea el descrito. Cada thread debe despertar únicamente al siguiente, no a todos.

\`\`\`c
int pthread_cond_broadcast(pthread_cond_t *cond);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_mutex_lock(pthread_mutex_t *mtx);
int pthread_mutex_unlock(pthread_mutex_t *mtx);
\`\`\``,
    correctAnswer: `Se añade un array de variables de condición (una por thread) y un mutex.

\`\`\`c
#define NTHREADS ...

struct tag_group {
    int current_thread;
    pthread_mutex_t m;
    pthread_cond_t cond[NTHREADS];
};

struct thr_args {
    int my_number;
    struct tag_group *t;
};

void thread(void *ptr) {
    struct thr_args *args = ptr;
    int next;

    while (1) {
        pthread_mutex_lock(&args->t->m);
        while (args->t->current_thread != args->my_number)
            pthread_cond_wait(&args->t->cond[args->my_number], &args->t->m);
        pthread_mutex_unlock(&args->t->m);

        next = rand() % NTHREADS;
        printf("thread %d tagging thread %d\\n", args->my_number, next);

        pthread_mutex_lock(&args->t->m);
        args->t->current_thread = next;
        pthread_cond_signal(&args->t->cond[next]);
        pthread_mutex_unlock(&args->t->m);
    }
}
\`\`\``,
    explanation:
      "Each thread has its own condition variable in the cond[] array. The active thread (current_thread == my_number) picks a random next thread, updates current_thread, and signals only that specific thread's condition variable using pthread_cond_signal. All other threads wait on their own condition variable. This ensures exactly one thread is active at any time and only one thread is woken up per transition.",
  },

  {
    id: "2022-07_q2",
    exam: "2022-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Implementar un sistema de gestión de memoria multithread. El API tiene dos operaciones: \`malloc()\` y \`free()\`. Existen varios buckets de tamaños de memoria, todos potencias de 2: 8, 16, 32, 64, 128, 256, 512.

- Existe un array \`buckets\` con una entrada para cada tamaño.
- Cada entrada tiene una lista de bloques libres del tamaño correspondiente.
- \`malloc(size)\`: busca un bloque en el primer bucket donde cabe (malloc(7) → bucket 8, malloc(59) → bucket 64). Si no hay bloques disponibles, busca en el bucket inmediatamente superior, lo parte en dos, uno se devuelve y el otro se inserta en la lista del bucket inferior.
- \`free(pointer, size)\`: libera el bloque indicado, insertándolo en el bucket correspondiente.
- El sistema debe funcionar de forma multithread.
- Hay que minimizar el tiempo que hay un mutex bloqueado. Pista: úsese un mutex por bucket.
- El tamaño n (donde n = 2^c) se almacena en la posición c - 3.

\`\`\`c
struct list_t;

struct elem {
    void *pointer;
};

struct bucket {
    size_t size;
    list_t *blocks;
};

struct bucket buckets[NUM];

struct elem *elem_create(void);
void elem_delete(struct elem *elem);
void list_insert(struct list_t *list, struct elem *elem);
struct elem *list_next(struct list_t *list);  // returns NULL if empty
\`\`\``,
    correctAnswer: `Se añade un mutex por bucket. La función buddy_malloc recursiva busca hacia arriba y divide bloques.

\`\`\`c
#define MIN_SIZE 3   // 2^3 = 8
#define MAX_SIZE 9   // 2^9 = 512

struct bucket {
    size_t size;
    list_t *blocks;
    pthread_mutex_t m;
};

struct bucket buckets[MAX_SIZE - MIN_SIZE + 1];

// Recursive buddy allocation: try bucket i, if empty try i+1 and split
struct elem *buddy_malloc(int i) {
    if (i > MAX_SIZE) return NULL;

    pthread_mutex_lock(&buckets[i - MIN_SIZE].m);
    struct elem *e = list_next(buckets[i - MIN_SIZE].blocks);
    pthread_mutex_unlock(&buckets[i - MIN_SIZE].m);

    if (e != NULL) return e;

    e = buddy_malloc(i + 1);
    if (e == NULL) return NULL;

    // Split: create buddy and insert into current bucket
    struct elem *buddy = elem_create();
    buddy->pointer = (char *)e->pointer + (1 << (i - 1));
    pthread_mutex_lock(&buckets[i - MIN_SIZE].m);
    list_insert(buckets[i - MIN_SIZE].blocks, buddy);
    pthread_mutex_unlock(&buckets[i - MIN_SIZE].m);

    return e;
}

void *malloc(size_t size) {
    for (int i = MIN_SIZE; i <= MAX_SIZE; i++) {
        if (size <= (1 << i)) {
            return buddy_malloc(i)->pointer;
        }
    }
    return NULL;
}

void free(void *pointer, size_t size) {
    for (int i = MIN_SIZE; i <= MAX_SIZE; i++) {
        if (size <= (1 << i)) {
            struct elem *e = elem_create();
            e->pointer = pointer;
            pthread_mutex_lock(&buckets[i - MIN_SIZE].m);
            list_insert(buckets[i - MIN_SIZE].blocks, e);
            pthread_mutex_unlock(&buckets[i - MIN_SIZE].m);
            return;
        }
    }
}
\`\`\``,
    explanation:
      "A buddy allocator with per-bucket mutexes. buddy_malloc recursively searches upward for a free block. When found in a larger bucket, it's split: the lower half is returned, the upper half is inserted as a new free block in the current bucket. This minimizes lock contention (one mutex per bucket, not a global lock). free simply inserts the freed block into the appropriate bucket. The index mapping (c - 3) converts power-of-2 exponent to array index.",
  },

  {
    id: "2022-07_q3",
    exam: "2022-07",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1,
    question: `En un sistema existe un servicio de log que recibe mensajes de otros procesos con un nivel de gravedad asociado, y los imprime por pantalla o no según el nivel mínimo de gravedad actual.

El servidor proporciona un API con dos funciones:
- \`set_log_level/2\`, que permite cambiar el nivel de gravedad del servidor de log. Los mensajes solo se imprimirán si su nivel de gravedad es igual o superior al valor establecido.
- \`log/3\`, que envía un mensaje con su nivel de gravedad al servidor.

Implemente las funciones \`set_log_level/2\`, \`log/3\` y \`loop\` para que el sistema tenga el comportamiento descrito.

\`\`\`erlang
-module(log).
-export([start/0, init/0, set_log_level/2, log/3]).

start() -> spawn(?MODULE, init, []).

set_log_level(Log_Server, Level) ->
    ...

log(Log_Server, Msg, Level) ->
    ...

init() -> loop(0).

loop(Current_Level) ->
    ...

log_message(Msg, Level) ->
    io:format("[~w]: ~w~n", [Level, Msg]).
\`\`\``,
    correctAnswer: `\`\`\`erlang
-module(log).
-export([start/0, init/0, set_log_level/2, log/3]).

start() -> spawn(?MODULE, init, []).

set_log_level(Log_Server, Level) ->
    Log_Server ! {set_log_level, Level}.

log(Log_Server, Msg, Level) ->
    Log_Server ! {log, Msg, Level}.

init() -> loop(0).

loop(Current_Level) ->
    receive
        {set_log_level, Level} ->
            loop(Level);
        {log, Msg, Level} ->
            if Level >= Current_Level ->
                   log_message(Msg, Level);
               true -> ok
            end,
            loop(Current_Level)
    end.

log_message(Msg, Level) ->
    io:format("[~w]: ~w~n", [Level, Msg]).
\`\`\``,
    explanation:
      "The log server maintains a Current_Level in its state. set_log_level sends a message to update it. log sends a message with the message and its level. The server checks if the message's level is >= Current_Level before printing. This is a clean Erlang actor pattern: the server loops receiving messages, pattern-matching on the message type and updating state accordingly.",
  },

  // --- Paralelismo ---

  {
    id: "2022-07_q4",
    exam: "2022-07",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    image: getImage(imageMap, "task-graph-2022-07.jpeg"),
    subquestions: [
      "(a) [0.5p] ¿Cuál es la aceleración máxima si la primera tarea (lectura del genoma) siempre la hace un único proceso, no se puede simultanear con ninguna otra, y siempre tarda el 5% del tiempo total?",
      "(b) [0.5p] Con el grafo de 11 tareas dado, ¿cuáles son el Máximo Grado de Concurrencia y el Grado Medio de Concurrencia?",
      "(c) [0.5p] Con 3 procesos, ¿cuál sería la asignación óptima?",
      "(d) [0.5p] ¿Cuáles son el speedup y la eficiencia de la asignación propuesta?",
      "(e) [0.5p] ¿Se consigue alguna ganancia real al usar 3 procesos comparado con 2? ¿Sería interesante usar más de 3?",
    ],
    question: `Una empresa ha desarrollado aplicaciones bioinformáticas ejecutadas en forma de grafo. En todas las ejecuciones se empieza leyendo un genoma de un fichero y luego se ejecutan varias aplicaciones, algunas simultáneas y otras con dependencias.

El grafo tiene 11 tareas con los siguientes tiempos:
- Tareas 0, 4, 9, 10: 10 minutos.
- Tareas 1, 3, 5, 7, 8: 20 minutos.
- Tareas 2 y 6: 30 minutos.

Responde DE FORMA RAZONADA.`,
    correctAnswer: `(a) Por la ley de Amdahl: la parte secuencial es el 5% (lectura del genoma).
**Aceleración máxima = (0.05 + 0.95) / 0.05 = 1 / 0.05 = 20**

(b) El camino crítico es T0 → T2 → T3 → T6 → T8 = 10 + 30 + 20 + 30 + 20 = **110 minutos**.
Tiempo secuencial total = 10×4 + 20×5 + 30×2 = 40 + 100 + 60 = **200 minutos**.
**Máximo Grado de Concurrencia = 7** (los nodos hoja simultáneos).
**Grado Medio de Concurrencia = 200 / 110 ≈ 1.82**

(c) Asignación óptima:
- Proceso 0: T0 (10), T2 (30), T3 (20), T6 (30), T8 (20) = 110 min
- Proceso 1: T1 (20), T4 (10), T5 (20), T9 (10) = 60 min
- Proceso 2: T7 (20), T10 (10) = 30 min

(d) **Speedup = 200 / 110 ≈ 1.82**
**Eficiencia = 1.82 / 3 ≈ 0.61**

(e) **Sí**, con 2 procesos no se puede ejecutar T5, T6 y T7 simultáneamente (necesitan 3 para el máximo paralelismo en ese punto). Con más de 3 procesos **no se gana nada** porque el camino crítico tiene 3 tareas como máximo en paralelo en cualquier punto (limitado por las dependencias del grafo).`,
    explanation:
      "The critical path (T0→T2→T3→T6→T8) determines the minimum execution time of 110 minutes. With 3 processes, the critical path entirely occupies one process, while the other two handle the remaining parallel work. The average concurrency of 1.82 means that on average fewer than 2 tasks can run concurrently. Adding a 4th process provides no benefit because the dependency graph never allows more than 3 concurrent tasks at any point.",
  },

  {
    id: "2022-07_q5",
    exam: "2022-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Indica el tipo de descomposición y asignación que usarías para paralelizar esta aplicación.",
      "(b) [0.75p] Escribe el código MPI asociado usando colectivas siempre que se pueda. Asume que L es múltiplo del número de procesos.",
      "(c) [0.5p] Con red en topología de anillo, explica de palabra cómo realizarías un MPI_Bcast con raíz 0. ¿Cuántos pasos se necesitarían para numP procesos?",
      "(d) [0.75p] Escribe con MPI_Send/MPI_Recv la implementación de la colectiva del apartado anterior para un array de caracteres A de tamaño L.",
    ],
    question: `Una de las aplicaciones consiste en comparar dos secuencias de ADN y proporcionar como resultado el número de posiciones en las que ambas secuencias tienen el mismo valor.

\`\`\`c
char *seq1 = (char *)malloc(sizeof(char) * L);
char *seq2 = (char *)malloc(sizeof(char) * L);
leeDeDisco(seq1, seq2, L);
int numIgual = 0;

for (int i = 0; i < L; i++)
    if (seq1[i] == seq2[i])
        numIgual++;

escribeResultado(numIgual);
\`\`\`

Solo uno de los procesos tiene acceso a disco y pantalla (funciones \`leeDeDisco\` y \`escribeResultado\`). Contesta DE FORMA RAZONADA.

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Allreduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) **Descomposición de dominio** con una tarea por cada posición de las secuencias (misma operación en todas). **Asignación estática por bloques** ya que la carga de trabajo es homogénea. Cada proceso recibe L/P caracteres de cada secuencia.

(b) Código MPI con colectivas:

\`\`\`c
char *seq1, *seq2;
int numIgual, resParcial;

if (rank == 0) {
    seq1 = (char *)malloc(sizeof(char) * L);
    seq2 = (char *)malloc(sizeof(char) * L);
    leeDeDisco(seq1, seq2, L);
} else {
    seq1 = (char *)malloc(sizeof(char) * L/numP);
    seq2 = (char *)malloc(sizeof(char) * L/numP);
}

resParcial = 0;

MPI_Scatter(seq1, L/numP, MPI_CHAR, rank ? seq1 : MPI_IN_PLACE,
            L/numP, MPI_CHAR, 0, MPI_COMM_WORLD);
MPI_Scatter(seq2, L/numP, MPI_CHAR, rank ? seq2 : MPI_IN_PLACE,
            L/numP, MPI_CHAR, 0, MPI_COMM_WORLD);

for (int i = 0; i < L/numP; i++)
    if (seq1[i] == seq2[i])
        resParcial++;

MPI_Reduce(&resParcial, &numIgual, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);

if (rank == 0)
    escribeResultado(numIgual);
\`\`\`

(c) En un anillo, el proceso 0 envía el array simultáneamente en ambas direcciones (al proceso 1 y al proceso numP-1). Cada proceso, al recibir, reenvía al siguiente en su dirección hasta que el array alcanza el extremo opuesto. El número de pasos es **⌈numP/2⌉**.

Los procesos en el punto medio (rank == numP/2 o numP/2+1) son los últimos en recibir y no reenvían.

(d) Implementación del broadcast en anillo:

\`\`\`c
int soyFinal = 0;
if ((rank == numP/2) || (rank == numP/2 + 1))
    soyFinal = 1;

int caminoAscendente = 0;
if (rank <= numP/2)
    caminoAscendente = 1;

if (rank == 0) {
    MPI_Send(A, L, MPI_CHAR, 1, 0, MPI_COMM_WORLD);
    MPI_Send(A, L, MPI_CHAR, numP-1, 0, MPI_COMM_WORLD);
} else {
    MPI_Recv(A, L, MPI_CHAR, MPI_ANY_SOURCE, 0, MPI_COMM_WORLD,
             MPI_STATUS_IGNORE);
    if (!soyFinal) {
        if (caminoAscendente)
            MPI_Send(A, L, MPI_CHAR, rank+1, 0, MPI_COMM_WORLD);
        else
            MPI_Send(A, L, MPI_CHAR, rank-1, 0, MPI_COMM_WORLD);
    }
}
\`\`\``,
    explanation:
      "The comparison is embarrassingly parallel — each position is independent. Domain decomposition by blocks of L/P positions works perfectly. Scatter distributes the sequences, each process counts matches locally, and Reduce sums them. For a ring broadcast, the bidirectional approach sends from root in both directions simultaneously, halving the number of steps compared to unidirectional. The midpoint processes detect they're the last to receive and stop forwarding.",
  },

  // ================================================================
  // 2023-06 (Mayo 2023 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2023-06_q1",
    exam: "2023-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2.5,
    repeated: true,
    question: `Una barrera es una estructura de sincronización que para un grupo de threads hasta que un cierto número ha llegado hasta ella. Los distintos threads llaman a una función barrier() que marca el punto de espera:

\`\`\`c
// N threads running this code
...
barrier(b);  // All threads stop here until n have reached this point
...
\`\`\`

Defina la estructura barrier_t y la función barrier de forma que paren a los threads hasta que n hayan llegado a la barrera.

\`\`\`c
typedef struct {
    int n;  // Number of threads that must reach the barrier to continue
    ...
} barrier_t;

void barrier(barrier_t *b) {
    ...
}
\`\`\`

\`\`\`c
int mtx_lock(mtx_t *mtx);
int mtx_trylock(mtx_t *mtx);
int mtx_unlock(mtx_t *mtx);
int cnd_wait(cnd_t *cond, mtx_t *mtx);
int cnd_signal(cnd_t *cond);
int cnd_broadcast(cnd_t *cond);
\`\`\``,
    correctAnswer: `\`\`\`c
typedef struct {
    int n;                 // Number of threads that must reach the barrier
    int thr_reached;       // How many have reached so far (starts at 0)
    mtx_t lock;
    cnd_t barrier_wait;
} barrier_t;

void barrier(barrier_t *b) {
    mtx_lock(&b->lock);
    b->thr_reached++;
    if (b->thr_reached < b->n)
        cnd_wait(&b->barrier_wait, &b->lock);
    else
        cnd_broadcast(&b->barrier_wait);
    mtx_unlock(&b->lock);
}
\`\`\``,
    explanation:
      "Classic reusable barrier with mutex + condition variable. Each thread increments thr_reached. If not all have arrived, the thread waits. The last thread (thr_reached == n) broadcasts to wake all waiting threads. The counter thr_reached is not reset — for a reusable barrier, you'd need an additional phase counter or reset logic. This implementation assumes single-use or manual reset between uses.",
  },

  {
    id: "2023-06_q2",
    exam: "2023-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2.5,
    question: `Vamos a simular un paso peatonal con un semáforo que regula el paso tanto de vehículos como de peatones. El semáforo, cada peatón y cada coche está representado por un thread. La variable green indica quién tiene el semáforo en verde.

Los peatones pueden cruzar todos a la vez, pero los vehículos tienen que ir de uno en uno respetando su orden de llegada. Para marcar ese orden hay dos contadores compartidos: \`last_car\` indica cuál es el número del último coche, y \`first_car\` qué coche es el siguiente en cruzar.

Como el semáforo cambia inmediatamente, tanto coches como peatones tienen que asegurarse de que el cruce está libre. Es decir, aunque tengan el semáforo en verde, los coches deberían esperar a que los peatones terminen de cruzar (y viceversa).

\`\`\`c
#define CARS 0
#define PEDESTRIANS 1
#define SEMAPHORE_TIME ...

struct crossing {
    int first_car;
    int last_car;
    int green;
    mtx_t cross_m;
    cnd_t cars_wait, peds_wait;
};

int semaphore(void *ptr) {
    struct crossing *cross = ptr;
    while (true) {
        mtx_lock(&cross->cross_m);
        cross->green = (cross->green + 1) % 2;
        if (cross->green == CARS)
            cnd_broadcast(&cross->cars_wait);
        else
            cnd_broadcast(&cross->peds_wait);
        mtx_unlock(&cross->cross_m);
        sleep(SEMAPHORE_TIME);
    }
}

int pedestrian(void *ptr) {
    struct crossing *cross = ptr;
    // pedestrian enters
    do_cross();
    // pedestrian exits
}

int car(void *ptr) {
    struct crossing *cross = ptr;
    // car enters
    do_cross();
    // car exits
}
\`\`\`

Implemente las funciones \`pedestrian\` y \`car\`. Puede modificar la estructura crossing si lo necesita.`,
    correctAnswer: `Se añaden contadores de peatones/coches cruzando actualmente. Los coches usan first_car/last_car para orden FIFO.

\`\`\`c
#define CARS 0
#define PEDESTRIANS 1

struct crossing {
    int first_car;      // starts at 0
    int last_car;       // starts at 0
    int green;
    mtx_t cross_m;
    int pedestrians;    // starts at 0 — pedestrians currently crossing
    int cars;           // starts at 0 — whether a car is crossing (0 or 1)
    cnd_t cars_wait, peds_wait;
};

int pedestrian(void *ptr) {
    struct crossing *cross = ptr;

    mtx_lock(&cross->cross_m);
    while (cross->green != PEDESTRIANS || cross->cars > 0)
        cnd_wait(&cross->peds_wait, &cross->cross_m);
    cross->pedestrians++;
    mtx_unlock(&cross->cross_m);

    do_cross();

    mtx_lock(&cross->cross_m);
    cross->pedestrians--;
    if (cross->pedestrians == 0 && cross->green == CARS)
        cnd_broadcast(&cross->cars_wait);
    mtx_unlock(&cross->cross_m);

    return 0;
}

int car(void *ptr) {
    struct crossing *cross = ptr;
    int myturn;

    mtx_lock(&cross->cross_m);
    myturn = cross->last_car;
    cross->last_car++;
    while (cross->green != CARS || cross->first_car != myturn || cross->pedestrians > 0)
        cnd_wait(&cross->cars_wait, &cross->cross_m);
    cross->cars = 1;
    mtx_unlock(&cross->cross_m);

    do_cross();

    mtx_lock(&cross->cross_m);
    cross->cars = 0;
    cross->first_car++;
    if (cross->green == CARS)
        cnd_broadcast(&cross->cars_wait);
    else
        cnd_broadcast(&cross->peds_wait);
    mtx_unlock(&cross->cross_m);

    return 0;
}
\`\`\``,
    explanation:
      "Pedestrians: wait until green == PEDESTRIANS AND no cars are crossing, then increment pedestrians counter and cross. On exit, decrement pedestrians; if the last pedestrian leaves and light is now green for cars, broadcast to waiting cars. Cars: take a ticket (myturn = last_car++), wait until green == CARS AND it's their turn (first_car == myturn) AND no pedestrians crossing. Set cars=1 (mutual exclusion for cars). On exit, set cars=0, increment first_car, and broadcast to next car or pedestrians if light changed.",
  },

  // --- Paralelismo ---

  {
    id: "2023-06_q3",
    exam: "2023-06",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Determina qué tipo de descomposición y asignación de tareas se ha hecho en este procedimiento.",
      "(b) [1.25p] Con tiempo medio de procesamiento de 40 min, mínimo de 28 min, máximo de 50 min: calcula tiempo secuencial, tiempo paralelo, aceleración, eficiencia, coste y sobrecarga.",
      "(c) [0.75p] Si al abrir un palet se puede estimar su tiempo y dividirlo en 2 si es demasiado alto: ¿qué tipo de descomposición y asignación se realiza? ¿Es más o menos eficiente? Justifica con granularidad y balanceo de carga.",
    ],
    question: `Un supermercado recibe diariamente 32 palets. El Supervisor de Recepción de Productos (SRP) gestiona un Equipo de Reposición de Lineales (ERL) de 8 trabajadores (incluyéndose él mismo).

- Al comenzar, el SRP dedica 15 minutos a recibir la mercancía.
- Los miembros del ERL se alternan para descargar palets (2 min por palet, una sola carretilla).
- Cada miembro procesa los palets que ha descargado: anota en el IRM y mueve productos a lineales. Tiempo variable: 3 a 20 min por palet.
- Cuando un miembro termina sus palets, ayuda a compañeros que aún tengan palets.
- Finalmente, el SRP necesita 10 minutos para verificar el IRM.

Responde DE FORMA RAZONADA.`,
    correctAnswer: `(a) **Descomposición de dominio** (dominio = conjunto de palets). La asignación de tareas durante el procesamiento es **dinámica descentralizada** (los trabajadores terminan sus palets y ayudan a otros, sin coordinación central). Adicionalmente hay descomposición funcional sobre el problema completo (recepción, descarga, procesamiento, verificación) y una asignación estática cíclica inicial para la descarga.

(b) Tiempo secuencial (todo lo hace una persona): 15 + 2×32 + 40×8 + 10 = 15 + 64 + 320 + 10 = **409 min**.

Tiempo paralelo: 15 + 2×32 + 50 + 10 = 15 + 64 + 50 + 10 = **139 min** (el trabajador más lento tarda 50 min).

**Aceleración = 409 / 139 ≈ 2.94**
**Eficiencia = 2.94 / 8 ≈ 0.37 (37%)**
**Coste = 139 × 8 = 1112 min**
**Sobrecarga = 1112 − 409 = 703 min**

(c) Es una **descomposición recursiva** (las tareas se subdividen en tiempo de ejecución hasta que su carga está por debajo de un nivel crítico). La asignación sigue siendo **dinámica descentralizada**.
**Es más eficiente** porque se reduce la granularidad (grano más fino), generando tareas con coste más homogéneo que, junto con la asignación dinámica, permite **balancear mejor la carga de trabajo**. Tareas más pequeñas significan que ningún trabajador se queda atascado con un palet muy grande mientras otros están ociosos.`,
    explanation:
      "The sequential time assumes one person does everything. The parallel time is governed by the slowest worker (50 min) plus the fixed serial phases (15 + 64 + 10 = 89 min). The low efficiency (37%) is due to the 89 min of serial work dominating when the parallel phase is only 50 min. Recursive decomposition (splitting large pallets) reduces granularity, making task sizes more uniform and improving load balance — the key bottleneck in the original approach.",
  },

  {
    id: "2023-06_q4",
    exam: "2023-06",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Indica razonadamente qué tipo de descomposición y asignación de tareas usarías para desarrollar ese código paralelo.",
      "(b) [1.25p] Escribe el código MPI asociado usando funciones colectivas siempre que sea posible. Asume que el número de procesos es divisor de M y de N.",
      "(c) [0.75p] Se desea modificar la aplicación para que P0 busque el alumno con mayor puntuación. Indica, de palabra, cómo modificarías el código del apartado anterior para que esta búsqueda del máximo también se realice en paralelo.",
    ],
    question: `Un conjunto de empresas tiene acceso a la tabla T de M filas (alumnos) y N columnas (asignaturas) con el histórico de notas. Para un cierto perfil se crea un vector de ponderación V de N elementos. Las empresas calculan una puntuación para cada alumno i: P_i = Σⱼ(T_{i,j} · V_j).

Solo un proceso (P0) tiene acceso a la tabla T (función leeTabla), inicializa V (inicializaVector), y vuelca las puntuaciones (vuelcaPuntuaciones). El objetivo es obtener y volcar las puntuaciones de todos los alumnos.

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) **Descomposición de dominio** donde una tarea se asocia al cálculo de cada valor P_i. La **asignación es estática** porque se conocen de antemano el número de tareas y todas tienen el mismo coste computacional (mismo número de operaciones por alumno). Vale tanto bloque como cíclica, pero bloque es más sencilla de implementar.

(b) Código MPI:

\`\`\`c
float *T, *V, *myT, *myP, *P;
V = (float *)malloc(sizeof(float) * N);
myT = (float *)malloc(sizeof(float) * M/numP * N);
myP = (float *)malloc(sizeof(float) * M/numP);

if (!rank) {
    T = (float *)malloc(sizeof(float) * M * N);
    P = (float *)malloc(sizeof(float) * M);
    leeTabla(T);
    inicializaVector(V);
}

MPI_Scatter(T, M/numP * N, MPI_FLOAT, myT, M/numP * N, MPI_FLOAT, 0, MPI_COMM_WORLD);
MPI_Bcast(V, N, MPI_FLOAT, 0, MPI_COMM_WORLD);

for (i = 0; i < M/numP; i++) {
    myP[i] = 0;
    for (j = 0; j < N; j++)
        myP[i] += myT[i * N + j] * V[j];
}

MPI_Gather(myP, M/numP, MPI_FLOAT, P, M/numP, MPI_FLOAT, 0, MPI_COMM_WORLD);

if (!rank)
    vuelcaPuntuaciones(P);
\`\`\`

(c) Para encontrar el alumno con máxima puntuación en paralelo:
1. Cada proceso, durante el bucle de cálculo, guarda el máximo local de sus alumnos y el índice de fila (id) de ese alumno.
2. Se hace un Gather de los máximos locales hacia P0.
3. P0 recorre el array de máximos para encontrar el proceso k que tiene la puntuación más alta.
4. Se hace otro Gather de los ids de los máximos locales hacia P0.
5. P0 toma el id de la posición k del segundo Gather como el alumno con mejor puntuación.

Alternativa más elegante: usar MPI_Reduce con MPI_MAXLOC, que devuelve tanto el valor máximo como el rango del proceso que lo obtuvo, en una sola operación colectiva.`,
    explanation:
      "The computation is a simple matrix-vector product (T × V). Scatter distributes rows of T (each row = one student). Bcast shares V with all processes. Each process computes a partial P vector. Gather collects all partial results. For finding the max in parallel: each process tracks its local max + index, then a two-phase Gather approach (or MPI_MAXLOC) identifies the global maximum and its owner for later retrieval of the student ID.",
  },

  // ================================================================
  // 2023-07 (Julio 2023 — Convocatoria extraordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2023-07_q1",
    exam: "2023-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2.5,
    question: `Un grupo de N poetas se sienta en una mesa formando una fila, numerados de 0 a N-1. Disponen de un único bolígrafo, por lo que solo una persona puede estar escribiendo a la vez. El número de quien tiene el bolígrafo está indicado por el campo \`pen_holder\`, y el número de a quien le toca escribir por \`current_poet\`.

Cuando la persona indicada por \`current_poet\` recibe el bolígrafo escribe durante un tiempo, representado por una llamada a \`write()\`, que debe hacerse sin ningún mutex bloqueado. Cuando finaliza, escoge a la siguiente persona que recibirá el bolígrafo generando un número aleatorio entre 0 y N-1, pero garantizando que no es ella misma.

Como están sentados en la mesa formando una fila, para hacer llegar el bolígrafo hasta esa persona tiene que irse pasando por todas las personas que estén entre ellas. Por ejemplo, para pasar el bolígrafo de la persona 5 a la 8, la 5 se lo pasaría a la 6, la 6 a la 7, y la 7 a la 8. El bolígrafo puede tener que ir hacia el final o hacia el principio de la mesa.

Cuando una de las personas no tenga que escribir ni pasar el bolígrafo deberá estar esperando. No deben usarse esperas activas, ni despertar a más de una persona a la vez.

\`\`\`c
#define N ...
void write();
int rand();  // returns random number between 0 and RAND_MAX

typedef struct {
    int current_poet;  // starts with valid value 0..N-1
    int pen_holder;    // which poet has the pen right now
} poet_group;

typedef struct {
    int id;
    poet_group *group;
} poet_info;

void poet(poet_info *inf) {
    ...
}
\`\`\`

\`\`\`c
int mtx_lock(mtx_t *mtx);
int mtx_trylock(mtx_t *mtx);
int mtx_unlock(mtx_t *mtx);
int cnd_wait(cnd_t *cond, mtx_t *mtx);
int cnd_signal(cnd_t *cond);
int cnd_broadcast(cnd_t *cond);
\`\`\``,
    correctAnswer: `Se añade un array de variables de condición (una por poeta) y un mutex. El bolígrafo avanza paso a paso hacia current_poet, despertando solo al siguiente en la cadena.

\`\`\`c
#define N ...

void write();
int rand();

typedef struct {
    int current_poet;
    int pen_holder;     // starts with same value as current_poet
    mtx_t lock;
    cnd_t waiting[N];
} poet_group;

typedef struct {
    int id;
    poet_group *group;
} poet_info;

void poet(poet_info *inf) {
    while (true) {
        mtx_lock(&inf->group->lock);
        while (inf->group->pen_holder != inf->id)
            cnd_wait(&inf->group->waiting[inf->id], &inf->group->lock);

        if (inf->group->current_poet == inf->id) {
            mtx_unlock(&inf->group->lock);
            write();
            mtx_lock(&inf->group->lock);
            while (inf->group->current_poet == inf->id)
                inf->group->current_poet = rand() % N;
        }

        if (inf->group->current_poet > inf->id)
            inf->group->pen_holder++;
        else
            inf->group->pen_holder--;

        cnd_signal(&inf->group->waiting[inf->group->pen_holder]);
        mtx_unlock(&inf->group->lock);
    }
}
\`\`\``,
    explanation:
      "The pen moves step by step: each poet wakes up when pen_holder == their id. If they are the current_poet, they write and pick a new random current_poet (different from themselves). Then they pass the pen one step toward current_poet: if current_poet > id, pen_holder moves right (++); otherwise moves left (--). They signal only the next poet in the chain. This ensures at most one wakeup per step, and the pen travels one position at a time through the row of poets.",
  },

  {
    id: "2023-07_q2",
    exam: "2023-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2.5,
    question: `Un grupo de threads necesita usar una unidad de un recurso del cual hay unidades limitadas, pero que no se consume al usarlo. Para manejar esos recursos se utiliza una pila almacenada en un array con un número que marca la cima.

Cuando un thread necesita hacer una operación, tiene que comprobar si hay alguno disponible. Si es así, lo retira de la estructura, lo usa, y lo vuelve a insertar para que los siguientes puedan utilizarlo. Si no hay ninguno libre debería esperar a que lo haya sin usar esperas activas.

Implemente la función worker con el comportamiento descrito.

\`\`\`c
typedef struct {
    resource *pool[...];
    int top;  // top of the resource stack
    ...
} resource_pool;

void worker(resource_pool *p) {
    resource *r;
    ...
    use(r);
    ...
}
\`\`\``,
    correctAnswer: `Se añade un mutex y una variable de condición. Cuando la pila está vacía (top == -1), el worker espera. Al devolver un recurso, si la pila estaba vacía se hace broadcast para despertar a los workers en espera.

\`\`\`c
typedef struct {
    resource *pool[...];
    int top;             // top of the resource stack
    mtx_t lock;
    cnd_t empty;
} resource_pool;

void worker(resource_pool *p) {
    resource *r;

    mtx_lock(&p->lock);
    while (p->top == -1)
        cnd_wait(&p->empty, &p->lock);
    r = p->pool[p->top];
    p->top--;
    mtx_unlock(&p->lock);

    use(r);

    mtx_lock(&p->lock);
    p->top++;
    p->pool[p->top] = r;
    if (p->top == 0)     // was empty before returning
        cnd_broadcast(&p->empty);
    mtx_unlock(&p->lock);
}
\`\`\``,
    explanation:
      "A resource pool implemented as a stack (LIFO). top tracks the stack pointer; top == -1 means empty. Workers lock the mutex, wait while empty, pop a resource, unlock, use it, then lock again to push it back. The broadcast on returning the first resource (top == 0 after push) wakes any waiting workers. Broadcast is used rather than signal because multiple workers might be waiting, and we want to wake all eligible ones.",
  },

  // --- Paralelismo ---

  {
    id: "2023-07_q3",
    exam: "2023-07",
    topic: "paralelismo-teoria",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [0.5p] Si todos los vídeos están ya cargados y el algoritmo de toma de decisiones no se puede paralelizar, ¿cuál es la aceleración máxima?",
      "(b) [0.5p] Indica DE FORMA RAZONADA cuál sería la mejor descomposición y asignación de tareas.",
      "(c) [1p] Con 9 servidores de análisis, tiempo medio de análisis de 3h, máximo 5h, mínimo 2h, comunicaciones despreciables: calcula tiempo paralelo, aceleración, eficiencia, coste y sobrecarga.",
      "(d) [0.5p] Si el servidor de almacenamiento también puede analizar y se puede estimar a priori el tiempo de cada vídeo, ¿cambiarías la descomposición o asignación?",
    ],
    question: `La policía local quiere automatizar la regulación de semáforos analizando vídeos de cámaras de tráfico cada noche. Con el número actual de cámaras se necesitarían 20 horas secuenciales, de las cuales solo 5 minutos se deben al algoritmo de toma de decisiones (no paralelizable). Dicho algoritmo no puede empezar hasta que todos los vídeos hayan sido analizados.

Datos adicionales:
- Cada vídeo no se puede dividir entre varios procesos.
- El tiempo de análisis de cada vídeo puede variar mucho (duración, calles, vehículos).
- No se puede saber a priori el tiempo de análisis de un vídeo.
- Solo un servidor (de almacenamiento) tiene contacto con las cámaras y suministra los vídeos a los servidores de análisis.
- Los servidores de análisis no están conectados entre sí, solo con el de almacenamiento.

Responde DE FORMA RAZONADA.`,
    correctAnswer: `(a) Tiempo secuencial = 20h = 1200 min. Parte secuencial = 5 min (toma de decisiones).
**Aceleración máxima = 1200 / 5 = 240**

(b) **Descomposición de dominio** (cada vídeo es una tarea indivisible). La única asignación viable es **dinámica maestro-esclavo** con el servidor de almacenamiento como maestro.
- Una asignación estática no tiene sentido porque: (i) el servidor de almacenamiento no realiza análisis inicialmente, (ii) el tiempo de análisis varía mucho y es impredecible.
- Una asignación dinámica descentralizada no es posible porque los servidores de análisis no están conectados entre sí.

(c) Tiempo paralelo = máximo entre servidores (5h = 300 min) + 5 min de toma de decisiones = **305 min**.

**Aceleración = 1200 / 305 ≈ 3.93**
**Eficiencia = 3.93 / 10 ≈ 0.393**
**Coste = 10 × 305 = 3050 min**
**Sobrecarga = 3050 − 1200 = 1850 min**

(d) Sí cambiaría. Al poder estimar a priori el tiempo de cada vídeo:
- **Asignación estática**: se reparten los vídeos para equilibrar la carga total por servidor, usando también el servidor de almacenamiento para análisis.
- La descomposición de dominio se mantiene.
- Esto elimina el overhead de comunicación maestro-esclavo y aprovecha mejor todos los recursos (10 servidores analizando en lugar de 9).`,
    explanation:
      "Amdahl's law gives theoretical max speedup of 240, but the practical speedup is only 3.93 due to severe load imbalance (max 5h vs min 2h per server). The master-slave assignment has inherent overhead but is the only option when analysis times are unpredictable. With predictable times, static assignment with load-aware scheduling can use all 10 servers (including the storage server) and achieve much better balance, potentially approaching the theoretical speedup more closely.",
  },

  {
    id: "2023-07_q4",
    exam: "2023-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    subquestions: [
      "(a) [1p] Escribe un código MPI que permita ejecutar de forma paralela este programa, usando colectivas siempre que se pueda.",
      "(b) [0.75p] Con 10 procesos, M=5000, N=2000, func() tarda 1 segundo y cada colectiva tarda D×10⁻³ segundos (D = total de elementos enviados). Calcula la aceleración.",
      "(c) [0.75p] Si func() depende también de A[(i+1)*N+j] y A[(i-1)*N+j] (5 parámetros), explica cómo cambiarías la distribución de datos.",
    ],
    question: `Se quiere paralelizar el siguiente código que trabaja sobre una matriz A de M filas y N columnas:

\`\`\`c
int *A = (int *)malloc(sizeof(int) * M * N);
int *B = (int *)malloc(sizeof(int) * M * N);
int aux, max = 0;
leeDeDisco(A);

for (int i = 0; i < M; i++)
    for (int j = 1; j < N-1; j++) {
        aux = func(A[i*N+j], A[i*N+j-1], A[i*N+j+1]);
        B[i*N+j] = aux;
        if (max < aux)
            max = aux;
    }

escribeResultado(B, max);
\`\`\`

Solo uno de los procesos tiene acceso a disco y pantalla (funciones leeDeDisco y escribeResultado). M y N son múltiplos del número de procesos.

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype dt, int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype dt, int src, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt, int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcnt, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype, void *recvbuf, int recvcount, MPI_Datatype recvtype, int root, MPI_Comm comm)
int MPI_Allreduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count, MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `(a) Descomposición de dominio con asignación estática bloque por filas (sin dependencias entre filas):

\`\`\`c
int *A, *B, *myA, *myB;
int aux, max, mymax = 0;

myA = (int *)malloc(sizeof(int) * M/numP * N);
myB = (int *)malloc(sizeof(int) * M/numP * N);

if (!rank) {
    A = (int *)malloc(sizeof(int) * M * N);
    B = (int *)malloc(sizeof(int) * M * N);
    leeDeDisco(A);
}

MPI_Scatter(A, M/numP * N, MPI_INT, myA, M/numP * N, MPI_INT, 0, MPI_COMM_WORLD);

for (int i = 0; i < M/numP; i++)
    for (int j = 1; j < N-1; j++) {
        aux = func(myA[i*N+j], myA[i*N+j-1], myA[i*N+j+1]);
        myB[i*N+j] = aux;
        if (mymax < aux)
            mymax = aux;
    }

MPI_Gather(myB, M/numP * N, MPI_INT, B, M/numP * N, MPI_INT, 0, MPI_COMM_WORLD);
MPI_Reduce(&mymax, &max, 1, MPI_INT, MPI_MAX, 0, MPI_COMM_WORLD);

if (!rank)
    escribeResultado(B, max);
\`\`\`

(b) Tiempo secuencial = 5000 × 2000 × 1 = **10⁷ segundos**.
Tiempo de cómputo paralelo por proceso = (5000/10) × 2000 × 1 = **10⁶ segundos**.
Tiempo de comunicaciones:
- Scatter: 9 × (5000/10 × 2000 × 10⁻³) = 9 × 1000 = **9000 s**
- Gather: 9 × 1000 = **9000 s**
- Reduce: 9 × 1 × 10⁻³ ≈ **0.009 s** (despreciable)
Total comunicaciones ≈ 18000 s.
T_par = 1000000 + 18000 = **1018000 s**.

**Aceleración = 10⁷ / 1018000 ≈ 9.82**

(c) Con dependencia de vecinos verticales (i+1, i-1), ya no basta con Scatter de bloques de filas independientes. Cada proceso necesita también:
- La fila anterior al inicio de su bloque (de su vecino izquierdo/arriba).
- La fila posterior al final de su bloque (de su vecino derecho/abajo).

Cambios necesarios:
1. **No se puede usar Scatter**: en su lugar, se usan MPI_Send/MPI_Recv punto a punto para que cada proceso reciba su bloque de filas más las filas halo (las filas frontera de los vecinos).
2. **myA debe ser más grande**: tamaño (M/numP + 2) × N para incluir las filas halo superior e inferior.
3. **La recolección (Gather y Reduce) no cambia**: cada proceso sigue calculando la misma porción de B y el mismo mymax local.`,
    explanation:
      "With only horizontal dependencies (j-1, j+1), block row distribution works perfectly with Scatter — all data a process needs is within its own rows. The speedup is excellent (9.82 out of 10) because communication overhead (18000s) is only 1.8% of compute time. With additional vertical dependencies, halo rows must be exchanged between neighbors, requiring larger local buffers and point-to-point communication instead of the simple Scatter. The Gather and Reduce remain unchanged since each process still computes the same portion of the output.",
  },
];
