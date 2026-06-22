import type { Question } from "../../data/types";
import taskGraphImg from "./assets/task-graph-2025-07.jpeg";
import stdevAlgAImg from "./assets/stdev-algorithm-a-2024-06.jpeg";

export const questions: Question[] = [
  // ================================================================
  // 2024-06 (Junio 2024 — Convocatoria ordinaria)
  // ================================================================

  // --- Concurrencia ---

  {
    id: "2024-06_q1",
    exam: "2024-06",
    topic: "concurrencia",
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
    topic: "concurrencia",
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
    topic: "concurrencia",
    type: "text",
    points: 1.5,
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
    topic: "paralelismo",
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
    topic: "paralelismo",
    type: "text",
    points: 2.5,
    image: stdevAlgAImg,
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
    topic: "concurrencia",
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
    topic: "concurrencia",
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
    topic: "concurrencia",
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
    topic: "paralelismo",
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
    topic: "paralelismo",
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
    topic: "concurrencia",
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
