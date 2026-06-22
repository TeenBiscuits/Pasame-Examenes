import type { Question } from "../../data/types";
import taskGraphImg from "./assets/task-graph-2025-07.jpeg";

export const questions: Question[] = [
  // ================================================================
  // 2025-06 (Mayo 2025 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2025-06_q1",
    exam: "2025-06",
    topic: "concurrencia",
    type: "text",
    points: 2,
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
    topic: "concurrencia",
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
    topic: "concurrencia",
    type: "text",
    points: 1.5,
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
    topic: "paralelismo",
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
    topic: "paralelismo",
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
    topic: "concurrencia",
    type: "text",
    points: 2,
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
    topic: "concurrencia",
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
    topic: "concurrencia",
    type: "text",
    points: 1.5,
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
    topic: "paralelismo",
    type: "text",
    points: 2.5,
    image: taskGraphImg,
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
    topic: "paralelismo",
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
];
