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
    id: "2025-07_cola-espera",
    examId: "2025-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Cola de espera

Vamos a simular una cola donde cada thread representa una persona que ocupa una posición. Cuando a una persona le toca el turno recibe el aviso de la anterior, hace la acción por la que esperaba turno y avisa al siguiente. Cada thread solo debe despertar a uno, y no se puede usar una estructura de datos de tipo cola o lista.

Para avisar al siguiente cada thread puede guardar una condición en la estructura compartida que es usada por el siguiente thread para esperar por el aviso. Antes de esperar ese thread sustituye la condición por la suya propia para a su vez poder avisar al thread que venga después de él.

Si no hay ningún thread activo la condición debería estar a \`NULL\`.

\`\`\`c
struct wait_row {
    int waiting;       // Number of threads in the queue
    pthread_cond_t *c; // should be NULL if there is no one waiting or doing the action
    pthread_mutex_t *m;
}

void person(struct wait_row *wr) {
    ...
    act();
    ...
}
\`\`\`

Funciones disponibles:

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
\`\`\`

Implemente la función \`person\` y complete la estructura compartida si fuese necesario.`,
    correctAnswer: `
\`\`\`c
struct wait_row {
    int waiting;       // Number of threads in the queue
    pthread_cond_t *c; // should be NULL if there is no one waiting or doing the action
}

void person(struct wait_row *wr) {
    pthread_cond_t next;
    pthread_cond_t *cur;
    pthread_cond_init(bnext, NULL);
    pthread_mutex_lock(wr->m);
    if (wr->c != NULL) {
        waiting++;
        cur = wr->c;
        wr->c = next;
        pthread_cond_wait(cur, wr->m);
        waiting--;
    }
    pthread_mutex_unlock(wr->m);
    act();
    pthread_mutex_lock(wr->m);
    if (wr->waiting > 0) pthread_cond_signal(wr->next);
    else wr->c = NULL;
    pthread_mutex_unlock(wr->m);
}
\`\`\`
`,
  },
  {
    id: "2025-07_barrera-emparejamiento",
    examId: "2025-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.5,
    question: `Barrera de emparejamiento

Implemente, utilizando los mutex de la librería pthread, una barrera que empareje a los threads de dos tipos A y B en orden de llegada. Esto es, el primer thread en llamar a \`pair_barrier_a\` y el primer thread en llamar a \`pair_barrier_b\` se emparejan, y así sucesivamente. Si un thread llega a la barrera y no hay threads del otro tipo tiene que esperar. Las funciones \`pair_barrier\` deberían devolver el id del thread con el que se ha emparejado.

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
    correctAnswer: `
\`\`\`c
typedef {
    pthread_mutex_t m;
    queue qa, qb;
} pair_barrier_t;

typedef {
    pthread_t my_id;
    pthread_t other_id;
    pthread_cond_t c;
} thr_wait_info;

void q_init(queue q);
void q_insert(queue q, void *);
void *q_remove(queue q); // returns NULL if the queue is empty

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
        pthread_cond_init(&my_inf->c, NULL);
        my_inf->my_id = pthread_self();
        q_insert(pb->qa, &my_inf);
        pthread_cond_wait(&inf->c, &pb->m);
        other_id = my_inf->other_id;
    } else {
        other_inf->other_id = pthread_self();
        pthread_cond_signal(other_inf->c);
        other_id = other_inf->my_id;
    }
    pthread_mutex_unlock(&pb->m);

    return other_id;
}

pthread_t pair_barrier_b(pair_barrier_t *pb) {
    // Same as pair_barrier_a, changing qa for qb and viceversa
}
\`\`\`
`,
  },
  {
    id: "2025-07-linea-procesos",
    examId: "2025-07",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.5,
    question: `El siguiente módulo permite crear una secuencia de procesos donde cada uno conoce el PID del siguiente.

\`\`\`erlang
-module(line).
-export([start/1, get_pids/3]).

start(N) ->
    spawn(?MODULE, init, [N-1]).

get_pids(First, A, B) ->
    ...

init(0) ->
    loop(none);
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

Puede suponer que dados N procesos en la línea, $0 \\le A \\le B < N$. Las funciones \`start/1\` e \`init/1\` no pueden modificarse.`,
    correctAnswer: `
\`\`\`erlang
-module(line).
-export([start/1, get_pids/3]).

start(N) ->
    spawn(?MODULE, init, [N-1]).

get_pids(First, A, B) ->
    First ! {get_pids_request, A, B, self()},
    receive
        {get_pids_reply, Pids} -> Pids
    end.

init(0) ->
    loop(none);
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
\`\`\`
`,
  },
  {
    id: "2025-07-conceptos-paralelismo",
    examId: "2025-07",
    topic: "paralelismo-teoria",
    type: "multiple-text",
    points: 2.5,
    question: `Un programa se ha descompuesto en tareas de acuerdo al siguiente grafo de dependencias estáticas. Cada nodo tiene un peso que se corresponde con el tiempo de ejecución en segundos de dicha tarea.

Responde razonadamente a las siguientes cuestiones:

| N | Procesos |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
|  | 1 | 2 | 4 | 8 | 16 |
| 5 | 7.0 | 4.0 | 3.0 | 4.0 | 5.0 |
| 10 | 11.0 | 6.0 | 6.0 | 7.0 | 7.0 |
| 20 | 22.0 | 12.0 | 6.0 | 6.0 | 7.0 |
| 40 | 43.0 | 21.0 | 11.0 | 5.0 | 8.0 |
| 80 | 85.0 | 45.0 | 23.0 | 11.0 | 6.0 |`,
    image: getImage(imageMap, "2025-07-conceptos-paralelismo.png"),
    textParts: [
      {
        label: "a)",
        text: "Determina qué tipo de descomposición se ha utilizado.",
        explanationImage: getImage(
          imageMap,
          "2025-07-conceptos-paralelismo-explanation.png",
        ),
      },
      {
        label: "b)",
        text: "Identifica el camino crítico, el grado máximo y el grado medio de concurrencia.",
        explanationImage: getImage(
          imageMap,
          "2025-07-conceptos-paralelismo-explanation.png",
        ),
      },
      {
        label: "c)",
        text: "Disponemos de 4 computadores interconectados para ejecutar este algoritmo en paralelo. Cualquier comunicación entre dos computadores tiene un coste fijo de 1 segundo, pero puede solaparse con la computación de otras tareas. Determina la asignación de tareas óptima y utilizando el menor número de recursos.",
      },
      {
        label: "d)",
        text: "Para la asignación escogida, calcula: aceleración, eficiencia paralela, coste y sobrecarga.",
      },
      {
        label: "e)",
        text: "Considera una tarea paralelizable cuyo tiempo de ejecución depende del tamaño de los datos de entrada (N). En la siguiente tabla se muestra el tiempo que tardó la tarea (en segundos) al ejecutarla con datos de diferentes tamaños sobre diferente número de procesos. Determina si esta paralelización presenta escalabilidad fuerte y/o escalabilidad débil.",
      },
    ],
    correctAnswer: [
      `Es una descomposición funcional.`,
      `El camino crítico se compone de las tareas T1, T4, T6, T8 y T10, y tiene una duración de 13 segundos. El grado máximo de concurrencia es 4 y el grado medio es $22/13 = 1.69$.`,
      `Como el coste de comunicaciones es alto, interesa minimizarlas y asignar tareas consecutivas a un mismo proceso. Por ejemplo, el camino crítico al proceso 0. El resto de tareas hay múltiples formas de asignarlas y se puede conseguir el mismo reparto óptimo con 3 procesos en lugar de 4. En el gráfico de la solución se muestran en color las tareas que requieren comunicaciones entre procesos para identificarlas fácilmente.`,
      `Con esta asignación propuesta, la duración del algoritmo es de 15 segundos, pues hay dos comunicaciones que no se pueden solapar con la computación. El tiempo secuencial es la suma de la duración de todas las tareas: 22 segundos.
$A = 22/15 = 1.47$
$Ef = 1.47/3 = 0.49 = 49\\%$
$Coste = 15s \\times 3 = 45s$
$Sobrecarga = Coste - T_{seq} = 45 - 22 = 23s$`,
      `Si nos fijamos en una fila de la tabla (N constante), observamos que a partir de cierto número de procesos el tiempo de ejecución se mantiene o incluso empeora, por lo que podemos decir que la paralización propuesta presenta mala escalabilidad fuerte cuando N es bajo. Sin embargo, si observamos cómo se comporta a medida que incrementamos el número de procesos manteniendo la carga por proceso constante (p=1, N=5; p=2, N=10; p=4, N=20, etc.), el tiempo de ejecución aproximadamente es constante y cercano a N/p, por lo que la eficiencia paralela es alta y confirma que la paralización presenta buena escalabilidad débil.`,
    ],
  },
  {
    id: "2025-07-diseno-algoritmos",
    examId: "2025-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    question: `El siguiente programa implementa un algoritmo con un reparto de tareas dinámico en el que la función \`read(int *num, int **vec)\` solo se puede ejecutar en el proceso 0 y lee de disco un vector de números enteros mayores que 0 que hay que procesar. La función recibe dos argumentos a través de los cuales devuelve el número de datos leídos y un puntero a una zona de memoria reservada con \`malloc\` donde los ha almacenado.

\`\`\`c
int main(int argc, char **argv)
{ MPI_Status s;
  int rank, size, N, *v, i = 1, z = 0;
  double r = 0, tmp;

  MPI_Init (&argc, &argv);
  MPI_Comm_rank (MPI_COMM_WORLD, &rank);
  MPI_Comm_size (MPI_COMM_WORLD, &size);

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
      };
    }
  }

  MPI_Finalize();
  return 0;
}
\`\`\`

**a)** Sabiendo que está garantizado que siempre se va a ejecutar con al menos dos procesos, ¿detectas algún problema potencial en la implementación? En ese caso, ¿cuál?

**b)** Implementa el algoritmo propuesto paralelizado pero siguiendo un reparto de tareas estático. Se recomienda comentar y justificar las decisiones tomadas.

Para simplificar el código:

- Se puede asumir que el entorno MPI ya está inicializado y existen las variables \`rank\` y \`size\` con los valores correspondientes en cada proceso.
- Los buffers de envío y recepción pueden solaparse.
- Puedes definir abreviaturas, como por ejemplo \`MCW\` para \`MPI_COMM_WORLD\`.

Funciones MPI disponibles:

\`\`\`c
int MPI_Barrier(MPI_Comm comm)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt,
    int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
    void *recvbuf, int recvcnt, MPI_Datatype recvtype,
    int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
    void *recvbuf, int recvcount, MPI_Datatype recvtype,
    int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count,
    MPI_Datatype dt, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `**a)** Sí, hay un problema. El código asume que va a haber al menos \`size - 1\` datos a procesar, pero podría haber menos.
**b)**
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
    printf("Result: %d\\n", r);
}

MPI_Finalize();
\`\`\``,
  },  {
    id: "2025-06_bus",
    examId: "2025-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Bus

Un autobús circula por una línea con un cierto número de paradas. La línea es circular, es decir, después de la última parada se vuelve a la primera. Puede suponerse que solo circula un autobús en la línea.

El autobús, al llegar a una parada, avisa a quien esté esperando para subir y bajar, y espera a que los pasajeros suban y bajen del bus. Una vez ha terminado la parada cambia a la siguiente estación.

El código de los threads pasajeros se proporciona como referencia. Implemente la función \`bus\`.

\`\`\`c
struct bus_line {
    int current_stop; // Current stop
    int total_stops; // Total number of stops
    pthread_mutex_t m;
    int get_off[STOPS]; // Number of passengers that want leave at that stop
    int load[STOPS]; // Number of passengers that want to enter at that stop
    pthread_cond_t stop[STOPS];
    pthread_cond_t loading;
}

void bus(struct bus_line *bus) {
    ...
}

void passenger(struct bus_line *bus, int from, int to) {
    pthread_mutex_lock(&bus->m);
    if(bus->current_stop != from) {
        bus->load[from]++;
        pthread_cond_wait(&bus->load[from], &bus->m);
        bus->load[from]--;
        if(bus->load[from] == 0) pthread_cond_signal(bus->loading);
    }
    bus->get_off[to]++;
    pthread_cond_wait(&bus->stop[to], &bus->m);
    bus->get_off[to]--;
    if(bus->get_off[to] == 0) pthread_cond_signal(bus->loading);
    pthread_mutex_unlock(&bus->m);
}
\`\`\``,
    correctAnswer: `\`\`\`c
struct bus_line {
    int current_stop; // Current stop
    int total_stops; // Total number of stops
    pthread_mutex_t m;
    int get_off[STOPS]; // Number of passengers that want leave at that stop
    int load[STOPS]; // Number of passengers that want to enter at that stop
    pthread_cond_t stop[STOPS];
    pthread_cond_t loading;
}

void bus(struct bus_line *bus) {
    pthread_mutex_lock(&bus->m);
    while(true) {
    pthread_mutex_broadcast(bus->get_off[bus->current_stop]);
    pthread_mutex_broadcast(bus->load[bus->current_stop]);
    while(bus->get_off[bus->current_stop] > 0 || bus->load[bus->current_stop] > 0) {
    pthread_cond_wait(&bus->loading, &bus->m);
    }
    bus->current_stop = (bus->current_stop + 1) % bus -> total_stops;
    }
    pthread_mutex_unlock(&bus->m);
}

void passenger(struct bus_line *bus, int from, int to) {
    pthread_mutex_lock(&bus->m);
    if(bus->current_stop != from) {
    bus->load[from]++;
    pthread_cond_wait(&bus->load[from], &bus->m);
    bus->load[from]--;
    if(bus->load[from] == 0) pthread_cond_signal(bus->loading);
    }
    bus->get_off[to]++;
    pthread_cond_wait(&bus->stop[to], &bus->m);
    bus->get_off[to]--;
    if(bus->get_off[to] == 0) pthread_cond_signal(bus->loading);
    pthread_mutex_unlock(&bus->m);
}
\`\`\``,
  },
  {
    id: "2025-06_mutex-bloqueo-ordenado",
    examId: "2025-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.5,
    question: `Mutex con bloqueo ordenado

Implemente, utilizando los mutex de la librería pthread, un tipo de mutex donde en caso de que tengan que esperar los threads lo bloqueen respetando el orden en el que llegan a la operación lock. Cuando el mutex se libere, solo debería despertarse un thread como máximo.

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
}
\`\`\`

Funciones disponibles:

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
    if(m->locked) {
        pthread_cond_init(&c, NULL);
        q_insert(m->q, &c);
        pthread_cond_wait(&c, &m->m);
    }
    m->locked=true;
    pthread_mutex_unlock(&m->m);
}

void ord_mutex_unlock(ord_mutex_t *m) {
    pthread_mutex_lock(&m->m);
    pthread_cond_t *c;
    if((c = q_remove(m->q)) != NULL) {
        pthread_cond_signal(c);
    } else {
        m->locked = false;
    }
    pthread_mutex_unlock(&m->m);
}
\`\`\``,
  },
  {
    id: "2025-06_linea-procesos",
    examId: "2025-06",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.5,
    repeated: true,
    question: `Línea de procesos

El siguiente módulo permite crear una secuencia de procesos donde cada uno conoce el PID del siguiente.

\`\`\`erlang
-module(line).
-export([start/1, size/1]).

start(N) ->
  spawn(?MODULE, init, [N-1]).

size(First) ->
  ...

init(0) ->
  loop(none);
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
start(N) ->
    spawn(?MODULE, init, [N-1]).
size(First) ->
    First ! {get_size, self(), 0},
    receive
    {get_size_reply, N} ->
    N
    end.
init(0) ->
    loop(none);
init(N) ->
    Next = spawn(?MODULE, init, [N-1]),
    loop(Next).
loop(Next) ->
    receive
    {get_size, From, N} ->
    case Next of
    none ->
    From ! {get_size_reply, N + 1};
    _ ->
    Next ! {get_size, From, N + 1}
    end
end,
loop(Next).
\`\`\``,
  },
  {
    id: "2025-06_conceptos-paralelismo",
    examId: "2025-06",
    topic: "paralelismo-teoria",
    type: "multiple-text",
    points: 2.5,
    question: `Conceptos de paralelismo

Tras la reintroducción del servicio militar obligatorio, alumnos de la FIC se hacen un fichero de $N$ alegaciones de reclutas de otros años que evitaron su alistamiento. A fin de deducir las características más efectivas de las alegaciones diseñan el siguiente algoritmo:

\`\`\`
Alegacion A[N]; /* vector de alegaciones */
Caracteristica C[N][M]; /* C[i][j]=caracteristica j en la alegacion i */

leer(A);
for(i = 0; i < N; i++)
    analizar(A[i], C[i]);
resumir(C);
\`\`\`

donde **analizar** cada alegación para cubrir su vector de características requiere un tiempo costoso, muy variable e impredecible. Se dispone de 8 PCs, de los cuales sólo uno tiene el fichero de datos y conexión a los demás, siendo las comunicaciones muy rápidas.

Responde RAZONADAMENTE a las siguientes cuestiones:`,
    textParts: [
      {
        label: "a)",
        points: 0.5,
        text: "Determina qué tipo de descomposición(es) y asignación(es) de tareas aplicarías.",
      },
      {
        label: "b)",
        points: 1.0,
        text: `Si en una ejecución con asignación estática el tiempo de **leer** son 5 s, el de **resumir** 25 s y en la fase de análisis los PCs requieren entre 9 y 70 s, con una media de 40 s, calcula explicando los pasos y parámetros que usas:

- Aceleración
- Eficiencia paralela
- Coste
- Sobrecarga`,
      },
      {
        label: "c)",
        points: 0.25,
        text: "Supón que un análisis muy rápido permitiese calcular el tiempo que requerirá procesar cada alegación. ¿Cambiarías la descomposición y/o la asignación? Si es así, explica qué estrategia seguirías.",
      },
      {
        label: "d)",
        points: 0.5,
        text: "En el caso del apartado anterior, si llamamos $T_i$ al número de segundos de análisis para las alegaciones asignadas al PC $P_i$ y el tiempo requerido para que $P_0$ se las envíe a $P_i$ es $T_i/10$, mientras que los tiempos de **leer** y **resumir** son de 1 s cada una, y no hay ningún coste adicional, ¿cuál es el tiempo total de ejecución del programa suponiendo que todas las comunicaciones son bloqueantes?",
      },
      {
        label: "e)",
        points: 0.25,
        text: "Si se distribuyen las alegaciones estáticamente entre los 8 PCs cíclicamente por bloques de 3 alegaciones, indica en qué PC y en qué posición relativa dentro del vector local de alegaciones estaría la alegación 58 explicando paso a paso los cálculos que haces.",
      },
    ],
    correctAnswer: [
      `En este problema hay una descomposición funcional con las tareas de lectura, análisis y resumen. La segunda tarea a su vez tiene una descomposición de dominio sobre el vector de alegaciones y la matriz de características, esta última por filas.

La asignación de tareas durante el análisis es dinámica centralizada (maestro-esclavo) ya que sólo un PC puede comunicarse con todos los demás y hay un desequilibrio de carga potencial muy importante si hacemos una distribución estática de cualquier tipo sin poder saber de antemano el coste de procesamiento de cada alegación.`,
      `Si se hace una asignación estática, los 8 PCs pueden analizar alegaciones en paralelo. Por otra parte, si el tiempo medio de procesado son 40 s/PC, el tiempo secuencial debería ser de 40 × 8 = 320 s, que sumados a las partes que se ejecutan secuencialmente dan 5 + 320 + 25 = 350 s.

El tiempo paralelo será la suma de los tiempos secuenciales más el tiempo de análisis más largo de un PC, lo que son 5 + 70 + 25 = 100 s. A partir de ahí:

- Aceleración = 350/100 = 3,5
- Eficiencia paralela = 3,5/8 = 0,44 = 44%
- Coste = 100 s × 8 = 800 s
- Sobrecarga = Coste - T_seq = 800 - 350 = 450 s`,
      `La descomposición del análisis seguiría siendo de dominio, pero se haría una asignación estática al conocer el coste. Lo más sencillo para equilibrar la carga sería que fuese cíclica tras ordenar las alegaciones por su coste de procesamiento. También podría hacerse un reparto irregular con bloques consecutivos de distinto tamaño, pero con costes similares.`,
      `Las partes secuenciales del programa, leer y resumir, tardan 2 s en ejecutarse.

Por otra parte el PC $P_i$, $1 \\le i \\le 7$, inicia su análisis de $T_i$ segundos después de que se hayan enviado sus bloques a los PCs 1 a i, con lo que acaba su análisis tras $(\\sum_{j=1}^{i} T_j)/10 + T_i$ segundos. Por su parte, el PC 0 podrá iniciar su análisis tras enviar los trabajos a los otros PCs, con lo que finalizará tras $(\\sum_{j=1}^{7} T_j)/10 + T_0$ segundos.

El tiempo de ejecución para la fase de análisis será el máximo de estos tiempos, puesto que todos tienen que acabar para que se inicie el resumen. Por tanto la expresión final sería:

$$2 + max \\left( max \\left\\{ \\left( \\sum_{j=1}^{i} T_j \\right) / 10 + T_i, 1 \\le i \\le 7 \\right\\}, \\left( \\sum_{j=1}^{7} T_j \\right) / 10 + T_0 \\right)$$`,
      `La alegación 58 se encuentra dentro del bloque $\\lfloor 58/3 \\rfloor = 19$, el cual al ser el reparto cíclico, se encuentra en el PC 19 mod 8 = 3.

Dentro de su bloque de 3 elementos, la alegación está en la posición relativa 58 mod 3 = 1.

Por otra parte, antes del bloque 19 hay otros $\\lfloor 19/8 \\rfloor = 2$ bloques en la memoria local de su PC, cada uno de ellos de 3 alegaciones. Por tanto la posición local será 2 × 3 + 1 = 7.`,
    ],
  },
  {
    id: "2025-06_diseno-algoritmos",
    examId: "2025-06",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    question: `Diseño de algoritmos paralelos

La empresa de logística Fast&Furious distribuye periódicamente P tipos de productos a T tiendas de toda Galicia. Para gestionar el pedido, cada tienda indica la cantidad que quiere de cada producto.

Se presenta el algoritmo que usan actualmente para calcular el precio total de los productos distribuidos a cada tienda ps, y también la suma del peso de todos los productos del mismo tipo wp. También, para un subconjunto de tiendas, imprime el precio que se les debe cobrar.

\`\`\`c
int pedido[T][P], tienda_id;
float pesos[P], precios[P], wp[P], ps[T];

inicializa_datos(pedido, pesos, precios);

... //NOTA: Reparto de datos

memset( ps, 0, T * sizeof(float) );
memset( wp, 0, P * sizeof(float) );

//NOTA: Paralelizar bucle
for (i=0; i<P; i++) {
    for (k=0; k<T; k++) {
    wp[i] += pesos[i] * pedido[k][i];
    ps[k] += precios[i] * pedido[k][i];
    }
}

while ( read( &tienda_id ) ) {
    printf("Los productos de la tienda %d cuestan %f euros\\n", tienda_id, ps[tienda_id]);
}

... //NOTA: Recoleccion de resultados
imprime_resultados ( wp, ps );
\`\`\`

- La matriz pedido de tamaño T × P contiene las cantidades de cada producto solicitadas por cada tienda. T y P no tienen por qué ser un múltiplo del número de procesos.
- El peso unitario de cada uno de los P tipos de producto se almacena en un array pesos, y el precio en un array precios.
- Las funciones \`inicializa_datos(...)\` e \`imprime_resultados(...)\` sólo las debe llamar el proceso 0.
- La función \`read(...)\` la pueden llamar todos los procesos y devuelve la misma secuencia de valores para todos ellos.
- La función \`printf\` la puede ejecutar cualquier proceso, y debe ejecutarse antes de la recolección de los resultados.
- El creador del algoritmo puso algunas NOTAS sobre cómo proceder.

Diseña e implementa la paralelización del algoritmo propuesto siguiendo las especificaciones anteriores. Comenta y justifica las decisiones tomadas. Para simplificar el código:

- Se puede asumir que el entorno MPI ya está inicializado y existen las variables \`rango\` y \`numprocs\` con los valores correspondientes en cada proceso.
- Los buffers de envío y recepción pueden solaparse.
- Puedes definir abreviaturas, como por ejemplo \`MCW\` para \`MPI_COMM_WORLD\`.

Funciones MPI disponibles:

\`\`\`c
int MPI_Barrier(MPI_Comm comm)
int MPI_Bcast(void *buffer, int count, MPI_Datatype dt,
    int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
    void *recvbuf, int recvcnt, MPI_Datatype recvtype,
    int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
    void *recvbuf, int recvcount, MPI_Datatype recvtype,
    int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count,
    MPI_Datatype dt, MPI_Op op,
    int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `A continuación se detallan varias formas de resolver este ejercicio. Recordamos que el enunciado indica en negrita "Comenta y justifica" las decisiones tomadas.

**a) Reparto por filas de la matriz pedido con padding**

- Se define \`filas_alloc\` para minimizar el uso de memoria y evitar que todos los procesos reserven la matriz completa.
- Se define \`filas_ef\` para evitar que el último proceso haga cálculos con basura.
- Se hace un reparto por filas de la matriz pedido (Scatter), por lo que cada proceso necesita los arrays \`pesos\` y \`precios\` completos (Bcast).
- Cada proceso calculará una parte del array \`ps\` y resultados parciales de \`wp\`. Por tanto serán necesarios al final un Gather y un Reduce, respectivamente.
- En el bloque del \`printf\`, como debe ejecutarse antes de la recolección, los procesos tienen que determinar si \`tienda_id\` pertenece a su bloque local, y cuál es su posición local.

\`\`\`c
float pesos[P], precios[P];
float wp[P];

int filas = ceil(T/numprocs);
int filas_alloc = rango ? filas : filas*numprocs;
int filas_ef = rango<(numprocs-1)
    ? filas : T-filas*(numprocs-1);

float pedido[ filas_alloc ][P];
float ps [ filas_alloc ];

if (!rango)
    inicializa_datos(pedido, pesos, precios);

MPI_Scatter(pedido, filas*P, MPI_INT,
    pedido, filas*P, MPI_INT, 0, MCW);
MPI_Bcast(pesos, P, MPI_FLOAT, 0, MCW);
MPI_Bcast(precios, P, MPI_FLOAT, 0, MCW);

memset( ps, 0, filas * sizeof(float) );
memset( wp, 0, P * sizeof(float) );

for (i=0; i<P; i++) {
    for (k=0; k<filas_ef; k++) {
    wp[i] += pesos[i] * pedido[k][i];
    ps[k] += precios[i] * pedido[k][i];
    }
}

int tienda_id;
while ( read( &tienda_id ) ) {
    if (rango == tienda_id / filas)
    printf("Los productos de la tienda %d cuestan %f euros\\n",
    tienda_id, ps[tienda_id % filas]);
    MPI_Barrier(MPI_COMM_WORLD);
}

MPI_Gather(ps, filas, MPI_FLOAT,
    ps, filas, MPI_FLOAT, 0, MCW);
MPI_Reduce(wp, wp, P, MPI_FLOAT, MPI_SUM, 0, MCW);

if (!rango)
    imprime_resultados ( wp, ps );
\`\`\`

1. Reserva de memoria (padding, reparto por filas): \`filas\` es el tamaño de bloque, \`filas_alloc\` el tamaño de reserva de memoria (T con padding para el root, \`filas\` para todos los demás) y \`filas_ef\` el bloque corregido para evitar las posiciones añadidas en el padding.

2. Reparto correcto de datos: si se reparte por filas la matriz \`pedido\`, cada proceso necesita su parte (Scatter) y los arrays \`pesos\` y \`precios\` completos (Bcast). \`ps\` y \`wp\` no se dividen: son datos de salida.

3. Distribución de la carga de trabajo: si se reparte por filas la matriz \`pedido[k][i]\`, sólo se divide el bucle \`k\`. \`filas_ef\` evita que el último proceso haga operaciones con basura si T%numprocs > 0.

4. Como el array \`ps\` se encuentra repartido, hay que mirar si \`tienda_id\` pertenece al proceso y calcular su posición local en el array. Opcionalmente, se añade una barrera para sincronizar las iteraciones del bucle.

5. Recolección de resultados: los datos de salida son \`wp\` y \`ps\`. \`ps\` está dividido y hay que hacer un Gather; \`wp\` contiene sumas parciales y hay que reducirlo.

**b) Alternativa a padding: el proceso 0 calcula los elementos no repartidos**

\`\`\`c
float pesos[P], precios[P];
float wp[P];

int filas = T / numprocs;
int filas_alloc = rango ? filas : T;
int resto = T % numprocs;

float pedido[ filas_alloc ][P];
float ps [ filas_alloc ];

... // igual que en padding por filas

for (i=0; i<P; i++) {
    for (k=0; k<filas; k++) {
    wp[i] += pesos[i] * pedido[k][i];
    ps[k] += precios[i] * pedido[k][i];
    }
}

if (!rango && resto) {
    for (i=0; i<P; i++) {
    for (k=T-resto; k<T; k++) {
    wp[i] += pesos[i] * pedido[k][i];
    ps[k] += precios[i] * pedido[k][i];
    }
    }
}

int tienda_id;
while ( read(&tienda_id ) ) {
    int proc = tienda_id / filas;
    if (rango == proc)
    printf("Los productos de la tienda %d cuestan %f euros\\n", tienda_id, ps[tienda_id % filas]);
    else if (!rango && proc >= numprocs)
    printf("Los productos de la tienda %d cuestan %f euros\\n", tienda_id, ps[tienda_id]);
    MPI_Barrier(MPI_COMM_WORLD);
}

... // igual que en padding por filas
\`\`\`

1. Reserva de memoria (reparto por filas): \`filas\` es el tamaño de bloque y \`filas_alloc\` el tamaño de reserva de memoria (T para el root, \`filas\` para todos los demás).

2. El bucle de computación calcula en paralelo las \`filas x numprocs\` primeras filas.

3. El proceso 0, que tiene los datos de pedido completos, realiza los cálculos para las filas que no han sido repartidas. Esto no afecta al Gather ni al Reduce posteriores. La condición \`&& resto\` es opcional, ya que si resto es 0 el bucle interno no iterará.

4. Esta parte también cambia ligeramente. Las tiendas que queden fuera del rango de procesos pertenecen al proceso 0 y tienen su información almacenada en las últimas posiciones de \`ps\`.

**c) Reparto por columnas de la matriz pedido**

- El reparto por columnas de la matriz es más complejo, porque la información no está contigua en memoria (Scatter de cada fila).
- Cada proceso necesita un subconjunto de \`pesos\` y \`precios\` (Scatter).
- Cada proceso calculará resultados parciales de \`ps\` y una parte del array \`wp\`. Por tanto serán necesarios al final un Reduce y un Gather, respectivamente.
- En el bloque del \`printf\`, como debe ejecutarse antes de la recolección, los procesos deben sumar sus valores parciales para la tienda solicitada y que uno de ellos se encargue de la impresión.

\`\`\`c
float ps[T];

int cols = ceil(P/numprocs);
int cols_alloc = rango ? cols : cols*numprocs;
int cols_ef = rango<(numprocs-1)
? cols : P-cols*(numprocs-1);

float pedido[T][cols_alloc];
float wp [cols_alloc];
float pesos[cols_alloc], precios[cols_alloc];

if (!rango)
    inicializa_datos(pedido, pesos, precios);

for (int i=0; i<T; i++)
    MPI_Scatter(pedido[i], cols, MPI_INT,
    pedido[i], cols, MPI_INT, 0, MCW);
MPI_Scatter(pesos, cols, MPI_FLOAT,
    pesos, cols, MPI_FLOAT, 0, MCW);
MPI_Scatter(precios, cols, MPI_FLOAT,
    precios, cols, MPI_FLOAT, 0, MCW);

memset( ps, 0, T * sizeof(float) );
memset( wp, 0, cols * sizeof(float) );

for (i=0; i<cols_ef; i++) {
    for (k=0; k<T; k++) {
    wp[i] += pesos[i] * pedido[k][i];
    ps[k] += precios[i] * pedido[k][i];
    }
}

int tienda_id;
float ptienda;
while ( read(&tienda_id ) ) {
    MPI_Reduce(&ps[tienda_id], &ptienda, 1, MPI_FLOAT,
    MPI_SUM, 0, MCW);
    if (rango == 0)
    printf("Los productos de la tienda %d cuestan %f euros\\n",
    tienda_id, ptienda);
}

MPI_Gather(wp, cols, MPI_FLOAT,
    wp, cols, MPI_FLOAT, 0, MCW);
MPI_Reduce(ps, ps, T, MPI_FLOAT, MPI_SUM, 0, MCW);

if (!rango)
    imprime_resultados (wp, ps);
\`\`\`

1. Reserva de memoria (padding, reparto por columnas): \`cols\` es el tamaño de bloque, \`cols_alloc\` el tamaño de reserva de memoria (P con padding para el root, \`cols\` para todos los demás) y \`cols_ef\` el bloque corregido para evitar las posiciones añadidas en el padding.

2. Reparto correcto de datos: si se reparte por columnas la matriz \`pedido\`, hay que repartirla fila a fila (Scatter) y cada proceso solo necesita una parte de los arrays \`pesos\` y \`precios\`. \`ps\` y \`wp\` no se dividen: son datos de salida.

3. Distribución de la carga de trabajo: si se reparte por columnas la matriz \`pedido\`, sólo se divide el bucle \`i\`. \`cols_ef\` evita que el último proceso haga operaciones con basura si P%numprocs > 0.

4. Como el array \`ps\` contiene sumas parciales hay que reducir esa suma para poder imprimir el valor correcto.

5. Recolección de resultados: los datos de salida son \`wp\` y \`ps\`. \`wp\` está dividido y hay que hacer un Gather; \`ps\` contiene sumas parciales y hay que reducirlo.`,
  },
  {
    id: "2024-07_cola-supermercado",
    examId: "2024-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.5,
    question: `Cola de supermercado

Implementar el esquema de la cola de un supermercado donde existe una única cola de clientes y múltiples cajeros. Cuando un cajero queda libre escoge el primer cliente de la cola. Los cajeros y los clientes no pueden hacer espera activa. Se pueden añadir todos los campos necesarios a los struct customer y super. No se pueden usar variables globales.

\`\`\`c
struct customer {
    pthread_cond_t c;
    ...
}

struct super {
    queue *q;
    pthread_mutex_t *m;
    pthread_cond_t *cajeros;
    ...
};

void cashier(struct super *s) {
    struct customer *c;
    while(true) {
        ...
        serve_customer(c);
    }
}

void customer(struct super *s, int num_items) {
    ...
    pay_and_leave();
}

struct cliente *peek(queue *q); // Devuelve, sin eliminarlo, el primer cliente en la cola
void remove(queue *q, struct customer *c); // Quita el cliente indicado de la cola
void insert(queue *q, struct customer *c); // Inserta un cliente al final de la cola
\`\`\`

Funciones disponibles:

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
    correctAnswer: `
\`\`\`c
struct customer {
    pthread_cond_t c;
};

struct super {
    queue *q;
    pthread_mutex_t m;
};

void cashier(struct super *s) {
    struct cliente *c;
    while(true) {
        lock(&s->m);
        while((c = peek(&s->q)) == NULL)
            wait(&s->cajeros, &s->m);

        pthread_cond_signal(c->c);
        remove(&s->q, c);
        unlock(&s->m);
        serve_customer(c);
    }
}

void customer(struct super *s, int num_items) {
    struct customer *c = malloc(sizeof(struct customer));
    pthread_cond_init(&c->c, NULL);

    pthread_mutex_lock(&s->m);
    insert(s->q, c);
    pthread_cond_signal(s->cajeros);
    pthread_cond_wait(&c->c, &s->m);
    pthread_mutex_unlock(&s->m);
    pay_and_leave();
}
\`\`\`
`,
  },
  {
    id: "2024-07_mutex-prioridades",
    examId: "2024-07",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Mutex con prioridades

Implemente, utilizando los mutex de la librería pthread, un tipo de mutex donde se pueden hacer bloqueos con prioridad alta o baja. Cuando un mutex se libera, solo podrá ser bloqueado por un thread con prioridad baja si no hay ningún thread con prioridad alta esperando.

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

Implemente las operaciones high_prio_lock, low_prio_lock y prio_unlock.`,
    correctAnswer: `
\`\`\`c
typedef {
    pthread_mutex_t m;
    pthread_cond_t c;
    int waiting_high_prio;
    int locked;
} prio_mutex;

void high_prio_lock(prio_mutex *m) {
    pthread_mutex_lock(&m->m);
    while(m->locked) {
        m->waiting_high_prio++;
        pthread_cond_wait(&m->c, &m->m);
        m->waiting_high_prio--;
    }
    m->locked = 1;
    pthread_mutex_unlock(&m->m);
}

void low_prio_lock(prio_mutex *m) {
    pthread_mutex_lock(&m->m);
    while(m->locked || m->waiting_high_prio > 0)
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
\`\`\`
`,
  },
  {
    id: "2024-07_servidor-datos-etiquetados",
    examId: "2024-07",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.5,
    repeated: true,
    question: `Servidor de datos etiquetados

Escriba un módulo que permita crear procesos servidor con la siguiente interfaz:

- start(), que arranca un proceso servidor y devuelve su PID.
- put(S, Data, Tags), donde S es el PID de un proceso servidor, Data un dato arbitrario, y Tags una lista de etiquetas que describen el dato. El dato debe quedar almacenado en el servidor.
- get(S, Tags), donde S es el PID de un proceso servidor, y Tags una lista de etiquetas. La función debe devolver una lista con todos los datos almacenados que tienen todas las etiquetas que están en Tags.

\`\`\`erlang
-module(store).
-export([start/0, get/2, put/3]).

start() ->
    spawn(?MODULE, init, []).
put(S, Data, Tags) ->
    ...
get(S, Tags) ->
    ...

init() ->
    ...
\`\`\`

Por ejemplo:

\`\`\`
1> S = store:start().
<0.10,0>
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
    correctAnswer: `
\`\`\`erlang
-module(store).
-export([start/0, get/2, put/3]).

start() ->
    spawn(?MODULE, init, []).
put(S, Data, Tags) ->
    S ! {put, Data, Tags},
    ok.
get(S, Tags) ->
    S ! {get, Tags, self()},
    receive
        {get_reply, L} -> L
    end.

init() ->
    loop([]).

loop(L) ->
    receive
        {put, Data, Tags} ->
            loop([{Data, Tags} | L]);
        {get, Tags, From} ->
            Res = [Data || {Data, DTags} <- L, lists:all(fun(T) -> lists:member(T, DTags) end, Tags)],
            From ! {get_reply, Res},
            loop(L)
    end.
\`\`\`
`,
  },
  {
    id: "2024-07_conceptos-paralelismo",
    examId: "2024-07",
    topic: "paralelismo-teoria",
    type: "multiple-text",
    points: 2.5,
    question: `Conceptos de paralelismo

En un hospital se dispone de un software que permite analizar radiografías de diferentes partes del cuerpo trabajando pixel a pixel. Se quiere desarrollar un programa paralelo que permita acelerar, usando varios procesos, el análisis de una radiografía de última generación.

A causa del hardware disponible en el hospital solo uno de los procesos tendrá acceso a disco para leer la imagen (con un tiempo constante de un minuto para leer una radiografía) y escribir el resultado del análisis (en un tiempo despreciable). Este proceso también puede realizar parte del análisis. Los procesos solo pueden empezar el análisis cuando todos tienen ya la imagen en su memoria. El análisis de una radiografía por un único proceso tarda 19 minutos y se realiza en cada pixel de forma independiente, pero sólo suponen carga de trabajo aquellos pixels que representan hueso dentro de la imagen. Responde RAZONADAMENTE a las siguientes cuestiones:`,
    textParts: [
      {
        label: "a)",
        points: 0.5,
        text: "Indica qué tipo de descomposición y asignación de tareas usarías.",
      },
      {
        label: "b)",
        points: 0.5,
        text: "¿Cuál es la máxima aceleración teórica que se puede conseguir si consiguiésemos reducir el tiempo de análisis al máximo?",
      },
      {
        label: "c)",
        points: 1.0,
        text: `En una primera versión todos los procesos necesitan la radiografía completa aunque vayan a hacer solo un análisis parcial. Un envío de una imagen desde el Proceso 0 a cualquiera de los otros tarda siempre 10 segundos. El reparto de trabajo no es perfecto, lo que provoca que siempre uno de los procesos se ocupe de la mitad de la carga de trabajo dentro de la fase de análisis, quedando la otra mitad a repartir entre el resto de procesos. Calcula las siguientes métricas para este código en una ejecución con un total de 4 procesos:
  - i. Tiempo paralelo
  - ii. Speedup
  - iii. Eficiencia
  - iv. Coste
  - v. Sobrecarga`,
      },
      {
        label: "d)",
        points: 0.5,
        text: "Asume que ahora queremos hacer una aproximación paralela diferente, donde en vez de abordar la paralelización de cada radiografía por separado se asume que en el hospital se deben analizar varias radiografías en un corto periodo de tiempo, y cada radiografía puede requerir un tiempo distinto, según la zona del cuerpo. En este caso se va a instalar un servidor que se dedica exclusivamente a leer las radiografías, distribuirlas al resto de servidores, y recopilar los resultados. Indica cómo cambiarías la descomposición y la asignación de tareas en este caso.",
      },
    ],
    correctAnswer: [
      `Aplicaríamos una descomposición de dominio donde el análisis de cada pixel sería una tarea, ya que son independientes. La asignación sería estática porque se sabe el tipo de imagen que hay al inicio de la ejecución. Para aliviar el problema del desbalanceo de carga por culpa de que no hay que trabajar con algunos pixels aplicaría una distribución cíclica, ya que los pixels que representan masa ósea probablemente estén rodeados de otros también con masa ósea (y viceversa).`,
      `Siguiendo la ley de Amdhal, el tiempo paralelo en el mejor caso sería el de la parte que no se puede paralelizar (lectura y escritura), ya que el tiempo de análisis se reduciría hasta ser casi despreciable. Como la escritura no consume tiempo, el tiempo paralelo es, en el mejor caso, el minuto de lectura de la imagen. El tiempo secuencial este minuto más los 19 minutos de análisis. Por tanto, la aceleración máxima sería: $\frac{20}{1} = 20$`,
      `i. La parte de lectura no se puede paralelizar, así que en toda ejecución tendremos 60 segundos de lectura. Además hay que sumarle 10 segundos por envío de la imagen a cada proceso (30 segundos de comunicaciones, en total). Por último, el tiempo de análisis es, como mínimo, la mitad del tiempo de análisis secuencial (9 minutos y medio o 570 segundos), porque un proceso ya es el que necesita. Esto hace que el tiempo paralelo sea: $60 + 3 * 10 + 570 = 660$ segundos.
ii. La aceleración consiste en dividir el tiempo secuencial (20 minutos) entre el tiempo paralelo: $\frac{1200}{660} = 1,82$
iii. La eficiencia consiste en dividir el speedup entre el número de procesos: $\frac{1,82}{4} = 0,45$
iv. El coste es el tiempo paralelo por el número de procesos: $4 * 660 = 2640$
v. La sobrecarga es restar el coste menos el tiempo secuencial: $2640 - 1200 = 1440$`,
      `En este caso seguiría siendo una descomposición de dominio, pero cada tarea sería el análisis de una radiografía distinta. En cuanto a la asignación se haría una dinámica maestro-esclavo, que ayudará a aliviar la diferente carga de trabajo de diferentes imágenes.`,
    ],
  },
  {
    id: "2024-07_diseno-algoritmos",
    examId: "2024-07",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    question: `Diseño de algoritmos paralelos

Se quiere paralelizar el siguiente código que trabaja sobre una matriz A de dos dimensiones (M filas y N columnas). El resultado de la última fila y la última columna es siempre 0:

\`\`\`c
float *A = (float *)malloc(sizeof(float) * M * N);
float *res = (float *)malloc(sizeof(float) * M * N);
float aux;
inicializa(A);

for(int i = 0; i < M-1; i++) {
    for(int j = 1; j < N-1; j++) {
        aux = A[i*N+j]*A[(i+1)*N+j+1]
            -A[i*N+j+1]*A[(i+1)*N+j]);
        res[i*N+j] = aux;
    }
    res[(i+1)*N-1] = 0;
}
for(int j = 1; j < N; j++) {
    res[(M-1)*N+j] = 0;

escribeResultado(res);
\`\`\`

Solo uno de los procesos tiene acceso a disco y pantalla. Por tanto, este será el único proceso que puede ejecutar las funciones inicializa y escribeResultado. Además, M es siempre múltiplo del número de procesos. Contesta DE FORMA RAZONADA las siguientes preguntas:

(a) ¿Qué tipo de descomposición y asignación de tareas usarías? ¿A qué datos debe acceder cada proceso? [0,75p]
(b) Escribe un código MPI que permita ejecutar de forma paralela este programa, usando colectivas siempre que se pueda (ver la tabla con la sintaxis de las rutinas MPI). [1,0p]
(c) Supón un sistema donde un proceso con rank X solo puede comunicarse con los procesos con ranks X - 1 y X + 1. Implementa una función ad-hoc que, usando exclusivamente comunicaciones punto a punto, haga todas las comunicaciones necesarias para la distribución de la matriz A de acuerdo a la distribución de datos que has elegido en el apartado (a). Asume que inicialmente la matriz A siempre estará en el Proceso 0. ¿Habría que modificar el tamaño de alguno de los arrays empleados en el apartado (b)? [0,75p]

Funciones MPI disponibles:

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype datatype,
    int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype datatype,
    int source, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype datatype,
    int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
    void *recvbuf, int recvcnt, MPI_Datatype recvtype,
    int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
    void *recvbuf, int recvcount, MPI_Datatype recvtype,
    int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count,
    MPI_Datatype datatype, MPI_Op op,
    int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `**(a)** Se aplica una descomposición de dominio con una asignación estática bloque por filas. Se podría también hacer por columnas o por bloques 2D pero complicaría mucho la implementación. Hay que tener en cuenta que cada proceso (a excepción del último) necesita también la primera fila del siguiente bloque para poder calcular el resultado.

**(b)**
\`\`\`c
float *A, *res, *myA, *myres;
float aux;
MPI_Status status;
myA = (float *) malloc(sizeof(float) * (M/numP+1) * N);
myres = (float *) malloc(sizeof(float) * M/numP * N);

if(!rank) {
    A = (float *) malloc(sizeof(float) * M * N);
    res = (float *) malloc(sizeof(float) * M * N);
    inicializa(A);
}

MPI_Scatter(A, M/numP * N, MPI_FLOAT, myA, M/numP * N,
    MPI_FLOAT, 0, MPI_COMM_WORLD);

if(rank > 0)
    MPI_Send(myA, N, MPI_FLOAT, rank-1, 0, MPI_COMM_WORLD);

int numFilas = M/numP-1;
if(rank < numP-1){
    MPI_Recv(&myA[M/numP*N], N, MPI_FLOAT, rank+1, 0,
        MPI_COMM_WORLD, &status);
    numFilas = M/numP;
}

for(int i = 0; i < numFilas; i++)
    for(int j = 1; j < N-1; j++){
        aux = myA[i*N+j]*myA[(i+1)*N+j+1]-myA[i*N+j+1]*myA[(i+1)*N+j]);
        myres[i*N+j] = aux;
    }
    myres[(i+1)*N-1] = 0;

MPI_Gather(myres, M/numP*N, MPI_FLOAT, res, M/numP*N,
    MPI_FLOAT, 0, MPI_COMM_WORLD);

if(!rank) {
    for(int j = 1; j < N; j++){
        res[(M-1)*N+j] = 0;
        escribeResultado(det);
    }
}
\`\`\`

**(c)** En este caso el Proceso 0 empezará mandando al Proceso 1 todas las filas que necesita tanto él como los procesos siguientes. El Proceso 1 al 2 las que necesita el 2 y los siguientes, etc. Ten en cuenta que, a diferencia del apartado b, el array myA debe ser diferente en cada proceso para poder almacenar los datos tanto de ese proceso como de los siguientes.

\`\`\`c
MPI_Status status;
int bloqueFilas = M/numP*N;

if(!rank)
    MPI_Send(&A[bloqueFilas], bloqueFilas*(numP-1), MPI_FLOAT, 1, 0,
        MPI_COMM_WORLD);

if(rank == numP-1)
    MPI_Recv(myA, bloqueFilas, MPI_FLOAT, numP-2, 0,
        MPI_COMM_WORLD, &status);

if(rank > 0 && rank < numP-1){
    MPI_Recv(myA, bloqueFilas*(numP-rank), MPI_FLOAT, rank-1, 0,
        MPI_COMM_WORLD, &status);
    MPI_Send(&myA[bloqueFilas], bloqueFilas*(numP-rank-1), MPI_FLOAT,
        rank+1, 0, MPI_COMM_WORLD);
}
\`\`\``,
  },
  {
    id: "2024-06_threads-espera",
    examId: "2024-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 2,
    question: `Threads que esperan por otros

Queremos implementar usando mutexes y variables de condición las siguientes funcionalidades:

a) Todos los threads trabajadores tienen que esperar a que el thread principal llegue a un punto determinado para continuar su ejecución (\`barrier_worker()\`). El thread principal indica a los threads que ha llegado al punto determinado llamando a la función \`barrier_main()\`.

\`\`\`c
struct barrier {
    pthread_mutex_t m;
    pthread_cond_t w;
};

void barrier_worker(struct barrier *b);
void barrier_main(struct barrier *b);
\`\`\`

b) Todos los threads tienen que esperar a que el resto de threads lleguen al punto de sincronización. El punto de sincronización se marca con la llamada a \`barrier_sync()\`. Cuando el último thread llega al punto de sincronización todos continúan.

\`\`\`c
struct barrier {
    pthread_mutex_t m;
    pthread_cond_t w;
};

void barrier_sync(struct barrier *b);
\`\`\`

Funciones disponibles:

\`\`\`c
int pthread_mutex_lock(pthread_mutex_t *m);
int pthread_mutex_trylock(pthread_mutex_t *m);
int pthread_mutex_unlock(pthread_mutex_t *m);
int pthread_cond_wait(pthread_cond_t *cond, pthread_mutex_t *mtx);
int pthread_cond_signal(pthread_cond_t *cond);
int pthread_cond_broadcast(pthread_cond_t *cond);
\`\`\``,
    correctAnswer: `**a)**
\`\`\`c
struct barrier {
    pthread_mutex_t m;
    pthread_cond_t w;
    int reached; // Initialized to 0
};

void barrier_worker(struct barrier *b) {
    pthread_mutex_lock(&b->m);
    if(!b->reached)
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

**b)**
\`\`\`c
struct barrier {
    pthread_mutex_t m;
    pthread_cond_t w;
    int n_threads;
};

void barrier_sync(struct barrier *b) {
    pthread_mutex_lock(&b->m);
    b->n_threads--;
    if(b->n_threads > 0)
        pthread_cond_wait(&b->w, &b->m);
    else
        pthread_cond_broadcast(&b->w);
    pthread_mutex_unlock(&b->m);
}
\`\`\``,
  },
  {
    id: "2024-06_secuencia-operaciones",
    examId: "2024-06",
    topic: "concurrencia-mutex",
    type: "text",
    points: 1.5,
    question: `Secuencia de operaciones

Un array de datos d puede ser accedido por varios threads simultaneamente para hacer una operación do_op sobre una de sus posiciones. Esta operación tiene efectos secundarios (no es pura). Para proteger el acceso a esos datos existe un array de mutex d_m, donde cada posición de d_m protege uno de los datos del array.

Vamos a implementar una operación do_op_seq que realice una secuencia de operaciones do_op especificada por un array que indica, en orden, las posiciones sobre las que hay que operar. Por ejemplo, para hacer la operación sobre las posiciones 1, 5 y 3:

\`\`\`c
int ids[] = {1, 5, 3};
do_op_seq(ids, 3);
\`\`\`

La secuencia de operaciones no debe realizarse hasta que se hayan bloqueado todas las posiciones afectadas, y debe respetarse el orden indicado por el array de operaciones.

\`\`\`c
void do_op(data d);
void sort(int arr[], int arr_size); // Sort function for int arrays
data d[N];
pthread_mutex_t d_m[N];

void do_op_seq(int ids[], int ids_len) {
    for(int i=0; i < ids_len; i++)
    do_op(d[ids[i]]);
}
\`\`\`

Implemente la protección de la secuencia de operaciones en do_op_seq.`,
    correctAnswer: `
\`\`\`c
void do_op(data d);
void sort(int arr[], int arr_size);

data d[N];
pthread_mutex_t d_m[N];

void do_op_seq(int ids[], int ids_len) {
    int sorted_ids[ids_len];

    for(int i=0; i < ids_len; i++)
    sorted_ids[i] = ids[i];

    sort(sorted_ids, ids_len);

    for(int i=0; i < ids_len; i++)
    pthread_mutex_lock(d_m[sorted_ids[i]]);
    for(int i=0; i < ids_len; i++)
    do_op(d[ids[i]]);

    for(int i=0; i < ids_len; i++)
    pthread_mutex_unlock(d_m[sorted_ids[i]]);
}
\`\`\`
`,
  },
  {
    id: "2024-06_servidor-datos",
    examId: "2024-06",
    topic: "concurrencia-erlang",
    type: "text",
    points: 1.5,
    question: `Servidor de datos

Escriba un módulo que permita crear procesos servidor con la siguiente interfaz:

- start(), que arranca un proceso servidor y devuelve su PID.
- put(S, Data), donde S es el PID de un proceso servidor, y Data un dato arbitrario. El dato debe quedar almacenado en el servidor.
- get(S, Proc), donde S es el PID de un proceso servidor, y Proc el PID de un proceso cualesquiera. La funciona debe devolver una lista con todos los datos almacenados por Proc.

\`\`\`erlang
-module(store).
-export([start/0, get/2, put/2]).
start() ->
  spawn(?MODULE, init, []).
put(S, Data) ->
  ...
get(S, Proc) ->
  ...
init() ->
  ...
\`\`\``,
    correctAnswer: `
\`\`\`erlang
-module(store).
-export([start/0, get/2, put/2]).
start() ->
  spawn(?MODULE, init, []).
put(S, Data) ->
  S ! {put, Data, self()}.
get(S, Proc) ->
  S ! {get, Proc, self()},
  receive
    {get_reply, L} -> L
  end.
init() ->
  loop([]).
loop(L) ->
  receive
    {get, Proc, From} ->
      From ! {get_reply, [Data || {Data, Owner} <- L, Owner == Proc]},
      loop(L);
    {put, Data, From} ->
      loop([{Data, From} | L])
  end.
\`\`\`
`,
  },
  {
    id: "2024-06_conceptos-paralelismo",
    examId: "2024-06",
    topic: "paralelismo-teoria",
    type: "multiple-text",
    points: 2.5,
    question: `Conceptos de paralelismo

La escucha de maquetas de jóvenes promesas del reguetón es la actividad que provoca más bajas laborales en una discográfica, por lo que se desea automatizarla usando IA. Las maquetas son ficheros de audio de entre 3 y 6 minutos y el algoritmo de análisis puntúa cada una en varios aspectos, requiriendo 8 segundos de computación por cada segundo de audio, y no pudiéndose paralelizar el análisis de una maqueta individual. Tras obtener las puntuaciones de las $n$ maquetas de cada día, el programa hace un postprocesado que incluye el ordenamiento de las mismas de acuerdo a sus puntuaciones y el envío de los resultados a los interesados, para lo cual se usa un algoritmo no paralelizable que requiere $n \\times \\log_2(n)$ segundos.

Cada día hay que evaluar 64 maquetas, por lo que se desea paralelizar el proceso entre varios servidores. El tiempo medio de lectura de disco de cada canción son 0.1 segundos, mientras que el tiempo de transmisión tanto de las maquetas como de las puntuaciones es despreciable, y sólo uno de los servidores contiene el disco con las maquetas. Además, al leer o recibir una maqueta se sabe inmediatamente su duración.

Responde RAZONADAMENTE a las siguientes cuestiones:`,
    textParts: [
      {
        label: "a)",
        points: 0.5,
        text: "Determina qué tipo de descomposición y asignación de tareas aplicarías.",
      },
      {
        label: "b)",
        points: 0.75,
        text: "Calcula, explicando los pasos y parámetros que usas, la máxima aceleración teórica que se podría obtener.",
      },
      {
        label: "c)",
        points: 0.75,
        text: `Calcula para el caso anterior, explicando los pasos y parámetros que usas, y suponiendo que se usó el menor número posible de servidores para obtener esa aceleración:
  - Eficiencia paralela.
  - Coste
  - Sobrecarga`,
      },
      {
        label: "d)",
        points: 0.5,
        text: "Supongamos que el algoritmo de IA se cambiase para poder ser capaz a menudo, pero no siempre y no siendo posible saberlo de antemano, de puntuar una maqueta tras sólo procesar un tercio de la misma. ¿Cambiarías la descomposición y/o asignación de tareas? De ser así, ¿cómo?",
      },
    ],
    correctAnswer: [
      `Es una descomposición de dominio, siendo el dominio el conjunto de maquetas.

La asignación de tareas durante el procesamiento es irregular (ni por bloques, ni cíclica) pero estática, dado que al leer las maquetas podemos determinar exactamente su tiempo de computación, con lo que podemos hacer un reparto equilibrado a priori.

También se puede mencionar una descomposición funcional sobre el problema completo (lectura de maquetas, evaluación paralela y postprocesado secuencial).`,
      `Secuencialmente tenemos que:

- Leer las 64 maquetas: $64 \\times 0.1s = 6.4s$
- Procesarlas. El tiempo mínimo será si todas fuesen de 3 minutos, y el máximo si todas fuesen de 6 minutos. Esta es la única parte paralelizable del algoritmo, con lo que de acuerdo a la ley de Amdahl, la mayor aceleración posible se obtendrá cuando esta parte del algoritmo ocupe la mayor porción de tiempo posible, lo cual sucedería si todas las canciones fuesen de 6 minutos:

$$64 \\text{ canciones} \\times (6 \\text{ minutos} \\times 60 \\text{ s./minuto} \\times 8 \\text{ s. proc/s. sonido}) = 64 \\times 2880 = 184320 \\text{ s}$$

- Hacer el postprocesado con ordenamiento: $64 \\times \\log_2(64) = 64 \\times 6 = 384 \\text{ s}$

Totalizando $T_{seq} = 6.4 + 184320 + 384 = 184710.4 \\text{ s}$.

En paralelo se procesarían las 64 canciones, quedando un tiempo $T_{par} = 6.4 + 2880 + 384 = 3270.4 \\text{ s}$ y siendo la aceleración asociada $A = 184710.4/3270.4 = 56.48$.`,
      `El mínimo número de servidores serían 64, con lo que:

- $Ef = 56.48 / 64 = 0.88 = 88\\%$
- Coste = 3270.4 s × 64 = 209305.6 s
- Sobrecarga = Coste - $T_{seq}$ = 209305.6 - 184710.4 = 24595.2 s`,
      `Los tiempos de análisis de las maquetas dejarían de ser predecibles a priori, con lo que un reparto estático dejaría de garantizar una carga equilibrada entre los procesadores. Si bien la descomposición seguiría siendo de dominio, la asignación de tareas pasaría a ser dinámica. Dado que sólo un servidor tiene acceso al disco de las maquetas, lo más fácil sería implementar un esquema centralizado maestro/esclavo, pero dado que el tiempo de transmisión de las maquetas es ínfimo y nada parece impedir que todos los servidores se comuniquen, se podría hacer una distribución inicial por bloques o cíclica, y luego aplicar un esquema de asignación dinámico descentralizado.`,
    ],
  },
  {
    id: "2024-06_diseno-algoritmos",
    examId: "2024-06",
    topic: "paralelismo-mpi",
    type: "text",
    points: 2.5,
    question: `Diseño de algoritmos paralelos

Los siguientes algoritmos implementan una función que calcula la desviación típica (σ) de los valores de un vector \`v\` de longitud \`N\`. El resultado es idéntico en ambas funciones:

$$\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i} (v_{i} - \\mu)^{2}}$$

**Algoritmo A**

\`\`\`c
double stdev_v1(double *v, int N) {
    double sum, sd, media;

    sum = 0;
    for (i=0; i<N; i++)
    sum += v[i]

    media = sum / N;

    sum = 0;
    for (i=0; i<N; i++)
    sum += pow(v[i] - media, 2);

    sd = sqrt(sum / N);

    return sd;
}
\`\`\`

**Algoritmo B**

\`\`\`c
double stdev_v2(double *v, int N) {
    double sum, sumsq, sd, media;

    sum = sumsq = 0
    for (i=0; i<N; i++) {
    sum += v[i]
    sumsq += pow(v[i], 2);
    }

    media = sum / N;

    sd = sqrt((sumsq - 2*media*sum + N*pow(media, 2)) / N);

    return sd;
}
\`\`\`

Queremos convertir la función del Algoritmo A en una operación colectiva MPI que tendrá la siguiente firma: \`double stdev_mpi(double *v, int N, int R, int P, int root)\`.

R es el rango del proceso, P es el número de procesos que se ejecutan en paralelo y root es el rango del proceso raíz. Se asume lo siguiente:

- El vector \`v\` sólo está inicializado en el proceso root.
- N y P son potencias de 2, siendo $N >> P$.
- En las operaciones colectivas MPI los buffers de envío y recepción pueden solaparse.
- El resultado debe ser correcto para todos los procesos.

(a) [0.5p] Diseña la paralelización del Algoritmo A. Por ejemplo, escribe un pseudocódigo de alto nivel indicando los pasos que se deben seguir. Puedes utilizar también una descripción gráfica.
(b) [1.5p] Implementa la función stdev_mpi como se describe, siguiendo tu diseño propuesto. Utiliza funciones colectivas de MPI siempre que sea posible.
(c) [0.5p] Piensa en cómo se paralelizaría la función del Algoritmo B. ¿Cuál de las dos implementaciones sería más eficiente?

Funciones MPI disponibles:

\`\`\`c
int MPI_Send(void *buf, int count, MPI_Datatype datatype,
    int dest, int tag, MPI_Comm comm)
int MPI_Recv(void *buf, int count, MPI_Datatype datatype,
    int source, int tag, MPI_Comm comm, MPI_Status *status)
int MPI_Bcast(void *buffer, int count, MPI_Datatype datatype,
    int root, MPI_Comm comm)
int MPI_Scatter(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
    void *recvbuf, int recvcnt, MPI_Datatype recvtype,
    int root, MPI_Comm comm)
int MPI_Gather(void *sendbuf, int sendcnt, MPI_Datatype sendtype,
    void *recvbuf, int recvcount, MPI_Datatype recvtype,
    int root, MPI_Comm comm)
int MPI_Reduce(void *sendbuf, void *recvbuf, int count,
    MPI_Datatype datatype, MPI_Op op, int root, MPI_Comm comm)
\`\`\``,
    correctAnswer: `**(a)** El algoritmo tendrá los pasos siguientes:

1. Repartir el vector $\\mathbf{v}$.
2. Cálculo paralelizado de $sum = \\sum_{i} v_{i}$ (con reducción de tipo suma).
3. Distribución de $sum$ a todos los procesos (broadcast).
4. Todos los procesos calculan la media ($\\mu$).
5. Cálculo paralelizado de $sum = \\sum_{i} (v_{i} - \\mu)^{2}$ (con reducción de tipo suma).
6. Distribución de $sum$ a todos los procesos (broadcast).
7. Todos los procesos calculan $sd = \\sqrt{sum / N}$.

También es válido que sólo el proceso root calcule $\\mu$ y $sd$ y distribuya estas variables en lugar de distribuir $sum$. En ese caso se invertirá el orden de los pasos [3,4] y [6,7].

**(b)** Una posible implementación es la siguiente:

\`\`\`c
double stdev_mpi(double *v, int N, int R, int P, int root) {
    double v_local[N/P];

    MPI_Scatter(v, N/P, MPI_DOUBLE,
    v_local, N/P, MPI_DOUBLE, root, MPI_COMM_WORLD);

    sum = 0;
    for (i=0; i < N/P; i++)
    sum += v_local[i]

    MPI_Reduce(&sum, &sum, 1, MPI_DOUBLE, MPI_SUM, root, MPI_COMM_WORLD);
    MPI_Bcast(&sum, 1, MPI_DOUBLE, root, MPI_COMM_WORLD);

    media = sum / N;

    sum = 0;
    for (i=0; i < N/P; i++)
    sum += pow(v_local[i] - media, 2);

    MPI_Reduce(&sum, &sum, 1, MPI_SUM, MPI_DOUBLE, root, MPI_COMM_WORLD);
    MPI_Bcast(&sum, 1, MPI_DOUBLE, root, MPI_COMM_WORLD);

    sd = sqrt(sum / n);

    return sd;
}
\`\`\`

**(c)** En el Algoritmo B no es necesaria la separación de tareas entre el cálculo de la media y la desviación estándar. En una única tarea se calcula la suma y la suma de cuadrados, y para finalizar se realizan dos operaciones que pueden ejecutar todos los procesos sin un efecto significativo en el rendimiento.

Esta implementación sería más eficiente porque no requiere la sincronización necesaria entre las dos tareas del algoritmo A.`,
  },

];
