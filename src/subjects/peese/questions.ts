import type { Question } from "../../data/types";

export const questions: Question[] = [
  // ================================================================
  // Enero 2026 — Teoría (8.5 ptos, 17 preguntas)
  // ================================================================

  {
    id: "2026-01_t1",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Qué se obtiene como resultado de la fase de análisis del sistema?",
    options: [
      "A. Modelos que reflejan los requisitos del usuario",
      "B. Modelos que reflejan la arquitectura del sistema",
      "C. Manuales de usuario",
      "D. a) y b) son resultados de la fase de análisis",
    ],
    correctAnswer: "a",
    explanation:
      "La fase de análisis produce modelos que reflejan los requisitos del usuario. Los modelos de arquitectura se obtienen en la fase de diseño.",
  },
  {
    id: "2026-01_t2",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question: "¿Cuál es una ventaja del modelo en V respecto al cascada?",
    options: [
      "A. Requiere menos pruebas",
      "B. Permite desarrollo ágil",
      "C. Mejora la gestión de riesgos",
      "D. Promueve pruebas tempranas",
    ],
    correctAnswer: "d",
    explanation:
      "El modelo en V promueve pruebas tempranas al vincular cada fase de desarrollo con su correspondiente fase de verificación/validación.",
  },
  {
    id: "2026-01_t3",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "En el marco de los modelos de análisis, ¿cuál de los siguientes enfoques se caracteriza por establecer una separación clara y explícita entre el modelado de los procesos y el modelado de los datos?",
    options: [
      "A. Enfoque estructurado",
      "B. Enfoque orientado a objetos",
      "C. Ninguno de los enfoques de análisis mantiene esta separación",
      "D. Todos los enfoques de análisis mantienen esta separación",
    ],
    correctAnswer: "a",
    explanation:
      "El enfoque estructurado separa explícitamente el modelado de procesos (DFD) y el modelado de datos (DER). El enfoque OO los unifica en clases.",
  },
  {
    id: "2026-01_t4",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Qué afirmación sobre la jerarquía en un Diagrama de Flujo de Datos (DFD) es falsa?",
    options: [
      "A. Todos los procesos deben explosionarse al mismo nivel de profundidad",
      "B. El Diagrama de Contexto modela todo el sistema en una única burbuja o proceso",
      "C. El Diagrama de Sistema modela los principales subsistemas",
      "D. Todos los niveles deben cumplir con el principio de conservación de flujo",
    ],
    correctAnswer: "a",
    explanation:
      "Es falso que todos los procesos deban explosionarse al mismo nivel. Cada rama de la jerarquía puede alcanzar distinta profundidad según la complejidad del proceso.",
  },
  {
    id: "2026-01_t5",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es la característica principal que define a las pruebas de caja negra?",
    options: [
      "A. Se basan en el conocimiento detallado de la estructura interna del código",
      "B. Su objetivo es verificar que cada rama y condición lógica se ejecute al menos una vez",
      "C. Requieren obligatoriamente diagramas de transición para poder ser diseñadas",
      "D. Se centran en el comportamiento observable del software a través de entradas y salidas esperadas",
    ],
    correctAnswer: "d",
    explanation:
      "Las pruebas de caja negra se centran en el comportamiento observable, verificando salidas para entradas dadas sin conocer la implementación interna.",
  },
  {
    id: "2026-01_t6",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es el objetivo principal de la norma ISO/IEC 25000 (SQuaRE)?",
    options: [
      "A. La creación de un marco común para evaluar la calidad del proceso software",
      "B. La gestión de la seguridad física de los centros de datos",
      "C. La evaluación de la madurez de los procesos de la organización",
      "D. La creación de un marco común para evaluar la calidad del producto software",
    ],
    correctAnswer: "d",
    explanation:
      "ISO/IEC 25000 (SQuaRE) establece un marco común para evaluar la calidad del producto software, no del proceso.",
  },
  {
    id: "2026-01_t7",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál de las siguientes afirmaciones es correcta en un ciclo de vida en espiral?",
    options: [
      "A. Permite desarrollar versiones incrementales del software",
      "B. Permite combinar la naturaleza de los prototipos con aspectos del modelo en cascada",
      "C. Tanto (a) como (b) son ciertas",
      "D. Ninguna de las anteriores es correcta",
    ],
    correctAnswer: "c",
    explanation:
      "El modelo en espiral combina elementos del modelo en cascada con prototipado iterativo, y permite desarrollar versiones incrementales.",
  },
  {
    id: "2026-01_t8",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál de los siguientes no es un tipo de requisito en Ingeniería del Software?",
    options: [
      "A. Requisitos de negocio",
      "B. Requisitos opcionales",
      "C. Requisitos de usuario",
      "D. Todas las respuestas anteriores son tipos de requisitos",
    ],
    correctAnswer: "b",
    explanation:
      "Los tipos de requisito estándar son: de negocio, de usuario y de sistema (funcionales y no funcionales). «Requisitos opcionales» no es un tipo reconocido.",
  },
  {
    id: "2026-01_t9",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál es el nivel de prueba que tiene como objetivo específico detectar errores en las interfaces y asegurar el correcto flujo de datos entre módulos o servicios?",
    options: [
      "A. Pruebas de aceptación",
      "B. Pruebas de integración",
      "C. Pruebas de sistema",
      "D. Pruebas unitarias",
    ],
    correctAnswer: "b",
    explanation:
      "Las pruebas de integración verifican la interacción entre módulos, detectando errores en interfaces y flujo de datos entre componentes.",
  },
  {
    id: "2026-01_t10",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Qué tipo de relación entre casos de uso se utiliza para modelar comportamiento opcional?",
    options: [
      "A. Asociación",
      "B. Inclusión",
      "C. Generalización",
      "D. Extensión",
    ],
    correctAnswer: "d",
    explanation:
      "La relación «extend» modela comportamiento opcional que se añade a un caso de uso base bajo ciertas condiciones. «Include» es obligatorio.",
  },
  {
    id: "2026-01_t11",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      'Si tras analizar un módulo de software observamos que realiza tareas tan dispares como "validar usuario", "generar factura" y "enviar correo electrónico", ¿qué principio de diseño se está incumpliendo primordialmente?',
    options: [
      "A. El principio de bajo acoplamiento",
      "B. El principio de alta cohesión",
      "C. El principio de ocultamiento de información",
      "D. El principio de abstracción de datos",
    ],
    correctAnswer: "b",
    explanation:
      "Un módulo que realiza tareas no relacionadas tiene baja cohesión. El principio de alta cohesión establece que cada módulo debe tener una responsabilidad clara y única.",
  },
  {
    id: "2026-01_t12",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "En el Diseño Estructurado, ¿cuál de las siguientes técnicas permite transformar un DFD en la arquitectura del sistema?",
    options: [
      "A. Análisis de Transformación",
      "B. Análisis de Transacción",
      "C. Tanto el Análisis de Transformación como el de Transacción",
      "D. Ninguna de las anteriores",
    ],
    correctAnswer: "c",
    explanation:
      "Ambas técnicas (análisis de transformación y de transacción) se usan en Diseño Estructurado para derivar la arquitectura a partir de DFDs.",
  },
  {
    id: "2026-01_t13",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Qué tipo de mantenimiento se enfoca en mejorar la eficiencia o añadir funciones no previstas?",
    options: [
      "A. Preventivo",
      "B. Perfectivo",
      "C. Correctivo",
      "D. Predictivo",
    ],
    correctAnswer: "b",
    explanation:
      "El mantenimiento perfectivo mejora el rendimiento o añade nuevas funcionalidades no previstas originalmente. El correctivo repara defectos.",
  },
  {
    id: "2026-01_t14",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Qué impacto tiene en el manejo de excepciones la práctica de capturar errores mediante bloques except vacíos?",
    options: [
      "A. Optimiza la experiencia del usuario final al suprimir la visualización técnica del traceback durante la ejecución",
      "B. Garantiza que el programa mantenga un estado consistente al evitar que la excepción se propague a la función llamadora",
      "C. Pueden impedir la detección y resolución del fallo, pudiendo ocultar problemas que comprometen la depuración y corrección del sistema",
      "D. Actúa como un mecanismo de control de impacto que permite al programa reaccionar de forma predecible ante errores de dominio",
    ],
    correctAnswer: "c",
    explanation:
      "Los bloques except vacíos ocultan las excepciones, impidiendo la detección y resolución del fallo, lo que compromete la depuración.",
  },
  {
    id: "2026-01_t15",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuál de los siguientes roles no está definido explícitamente en la metodología Scrum?",
    options: [
      "A. Jefe de Proyecto",
      "B. Scrum Master",
      "C. Propietario del producto",
      "D. Equipo de desarrollo",
    ],
    correctAnswer: "a",
    explanation:
      "Scrum define tres roles: Scrum Master, Product Owner y Equipo de Desarrollo. El rol de Jefe de Proyecto no existe en Scrum.",
  },
  {
    id: "2026-01_t16",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question:
      "¿Cuáles de las siguientes afirmaciones son principios de la Ingeniería del Software?",
    options: [
      "A. Localización",
      "B. Abstracción",
      "C. Tanto (a) como (b) son principios de la Ingeniería del Software",
      "D. Ninguno de los anteriores son principios de la Ingeniería del Software",
    ],
    correctAnswer: "c",
    explanation:
      "Tanto la localización (principio de mantener relacionado lo que se usa junto) como la abstracción son principios fundamentales de la Ingeniería del Software.",
  },
  {
    id: "2026-01_t17",
    exam: "2026-01",
    topic: "teoria",
    type: "mc",
    points: 0.5,
    question: "¿Qué es un hito en la planificación?",
    options: [
      "A. Una actividad a la que hay que prestar especial atención debido a su alto coste",
      "B. Un punto de control sin duración",
      "C. Un área de duración indefinida",
      "D. Una subcontrata",
    ],
    correctAnswer: "b",
    explanation:
      "Un hito (milestone) es un punto de control que marca un evento significativo en el proyecto, sin duración asociada.",
  },
];
