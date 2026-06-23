import type { Question } from "../../data/types";
import simplex2026 from "./assets/simplex-2026.jpeg?w=400;800;1200&format=avif;webp;jpeg&as=picture";

export const questions: Question[] = [
  // ============================================================
  // Exam Xaneiro 2024
  // ============================================================

  // --- Tema 2: Planificación ---
  {
    id: "2024-01_q1_1",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "O Diagrama de Gantt ten unha estreita relación coas Redes de Precedencia, pois é unha representación simplificada destas.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "O Diagrama de Gantt é unha representación visual simplificada das relacións de precedencia definidas nas redes PERT/CPM.",
  },
  {
    id: "2024-01_q1_2",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Para aplicar CPM e calcular as datas early e late é imprescindible coñecer as asignacións dos recursos.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "b",
    explanation:
      "O CPM (Critical Path Method) calcúlase sen necesidade de coñecer as asignacións de recursos. O CPM só ten en conta as dependencias e duracións das tarefas.",
  },
  {
    id: "2024-01_q1_3",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "A FC B é equivalente a A CC+2d B se A dura 2 días.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "FC (Finish-to-Start) con 0 días de retraso significa que B comeza cando A remata. CC+2d (Start-to-Start) con 2 días de retraso significa que B comeza 2 días despois de que A comece. Se A dura 2 días, ambas expresións son equivalentes.",
  },

  // --- Tema 3: MS-Project ---
  {
    id: "2024-01_q1_4",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "MS-Project pode identificar sobrecargas que sexan 'ficticias', pero tamén permite confirmar se realmente son sobrecargas ou non.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "MS-Project dispón de ferramentas de análise que permiten distinguir entre sobrecargas reais e ficticias, facilitando a toma de decisións na nivelación de recursos.",
  },
  {
    id: "2024-01_q1_5",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "MS-Project non controla a correcta aplicación en seguimento das restricións lóxicas.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "b",
    explanation:
      "MS-Project si controla e respecta as restricións lóxicas (dependencias entre tarefas) durante o seguimento do proxecto.",
  },
  {
    id: "2024-01_q1_6",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Ao establecer liña de base en MS-Project, os datos previstos 'copianse' nos datos actuais.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "Ao gardar unha liña de base, MS-Project copia os valores planificados (previstos) aos campos de liña de base. Os datos actuais reflíctense nos campos de seguimento.",
  },
  {
    id: "2024-01_q1_7",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "En MS-Project, o camiño crítico sempre será un camiño continuo desde o principio ao final do proxecto.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "b",
    explanation:
      "O camiño crítico en MS-Project non ten por que ser continuo de principio a fin. Pode haber tramos do proxecto sen folgura que non estean conectados entre si.",
  },

  // --- Tema 4: Xestión de Riscos ---
  {
    id: "2024-01_q1_8",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Aínda que haxa unha forma de priorizar riscos, ás veces o Xefe de Proxecto pode e debe tratar como relevantes riscos que non o son atendendo á súa priorización.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "O criterio do xefe de proxecto pode elevar a relevancia dun risco máis aló do que indica a súa priorización cuantitativa, baseándose na experiencia ou en factores non cuantificables.",
  },

  // --- Tema 5: Xestión da Configuración do Software ---
  {
    id: "2024-01_q1_9",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Un Plan de Proxecto é o único produto de saída (entregable) das actividades de Xestión de Proxectos que habería que someter a Xestión da Configuración do Software.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "b",
    explanation:
      "Non só o Plan de Proxecto, senón múltiples entregables da GP (plan de riscos, plan de calidade, EDT, calendario, etc.) deben someterse a GCS.",
  },
  {
    id: "2024-01_q1_10",
    exam: "2024-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Hai polo menos 3 razóns que xustifican, en Xestión da Configuración do Software, a necesidade de ter dispoñibles as versións intermedias dun ECS.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "As versións intermedias dun Elemento de Configuración Software son necesarias para trazabilidade, recuperación ante erros, auditoría e para permitir o traballo paralelo.",
  },

  // --- Tema 8: Calidade ---
  {
    id: "2024-01_q2",
    exam: "2024-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Indique que sentido ten un apartado titulado 'Desviacións ao Sistema de Calidade' nun Plan de Proxecto. Razoe a súa resposta cun exemplo.",
    correctAnswer:
      "Ten o propósito de identificar, documentar e xestionar calquera desviación que poida ocorrer respecto aos estándares de calidade establecidos para o proxecto. Por exemplo, se o estándar esixe revisións de código semanais e unha semana non se pode realizar por sobrecarga, débese documentar a desviación, xustificala e indicar como se compensará.",
    explanation:
      "O apartado serve para manter a trazabilidade dos incumprimentos do sistema de calidade, permitindo accións correctoras e demostrando transparencia na xestión da calidade.",
  },

  // --- Tema 4: Riscos ---
  {
    id: "2024-01_q3",
    exam: "2024-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Indique que finalidade última ten realmente a fórmula de cuantificación de riscos ER = P · I. Razoe a súa resposta.",
    correctAnswer:
      "A finalidade última da cuantificación de riscos (ER = P · I) é estimar o retraso total do proxecto ao sumar todas as exposicións ao risco (ER). Ademais, pódese empregar para axustar a planificación cunha marxe de retraso que absorba os riscos identificados.",
    explanation:
      "P (probabilidade) × I (impacto) dá a Exposición ao Risco, que permite cuantificar economicamente ou temporalmente o efecto esperado dos riscos sobre o proxecto.",
  },

  // --- Tema 7: Negociación ---
  {
    id: "2024-01_q4",
    exam: "2024-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Indique dúas opcións técnicas que inicialmente se poidan aplicar, en xeral, na 'parte de opcións' nunha estratexia de negociación conveniente en planificación de proxectos software.",
    correctAnswer:
      "Dúas opcións técnicas habituais son: (1) Entregas incrementais: dividir o produto en entregas parciais para reducir o risco e obter feedback temperán. (2) Redución ou eliminación de prestacións: axustar o alcance funcional para cumprir con prazos ou orzamentos limitados.",
    explanation:
      "A 'parte de opcións' da estratexia de negociación presenta alternativas técnicas viables que permiten chegar a un acordo sen comprometer a calidade esencial do produto.",
  },

  // --- Tema 3: MS-Project ---
  {
    id: "2024-01_q5",
    exam: "2024-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Indique como modelaría en MS-Project a utilización dun servizo de cómputo na nube (MS Azure) en varias tarefas, tendo en conta que non hai limitación no uso por varias tarefas (servizo baixo demanda) e que ten un coste de 0.25€/h.",
    correctAnswer:
      "Habería que definir un recurso de tipo 'Coste', ao ser un servizo baixo demanda e con coste por hora. Despois de engadir o novo recurso de tipo Coste (MS Azure), asignaríase este recurso ás tarefas correspondentes. O número de horas dependerá da duración da tarefa. Por último, establécese o coste de 0.25€/h para o recurso e MS-Project calcula automaticamente o coste total en función do tempo que se utilice o recurso.",
    explanation:
      "Os recursos de tipo Coste en MS-Project non afectan á programación nin á carga de traballo. Simplemente acumulan custos en función da duración das tarefas ás que se asignan.",
  },
  {
    id: "2024-01_q6",
    exam: "2024-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Indique como modelaría en MS-Project a supervisión de 4h sobre unha determinada tarefa todos os martes e xoves mentres dita tarefa teña lugar.",
    correctAnswer:
      "Asígnase un novo recurso de tipo Traballo que se encargará de facer a supervisión. Despois créase a tarefa de supervisión e asígnaselle o recurso engadido. Por último, configúrase o calendario do recurso para que traballe todos os martes e xoves durante 4 horas.",
    explanation:
      "A configuración do calendario do recurso permite establecer patróns de dispoñibilidade recorrentes, o que fai que MS-Project programe automaticamente as horas de supervisión nos días indicados.",
  },

  // ============================================================
  // Exam Xaneiro 2026
  // ============================================================

  // --- Tema 9: Optimización e Programación Lineal ---
  {
    id: "2026-01_q1",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 3,
    question:
      "Estase decidindo cantos consultores junior (x₁) e cantos consultores senior (x₂) se poden contratar para un novo proxecto, co fin de obter un estándar de calidade máximo (z). Os primeiros supoñen menor coste pero teñen menos experiencia. O orzamento do proxecto está limitado.\n\nEstá a solución óptima no seguinte desenvolvemento? Por que? (En caso afirmativo, indíquese cal é e, en caso contrario, indíquese como continuaría o algoritmo)",
    image: simplex2026,
    correctAnswer:
      "Para determinar se a táboa actual é óptima, hai que comprobar se todos os coeficientes da fila z (custos reducidos) son ≤ 0 nun problema de maximización (ou ≥ 0 en minimización). Se hai algún coeficiente positivo na fila z, a solución non é óptima. Nese caso, a variable con coeficiente máis positivo entra na base, e aplícase a regra do cociente mínimo para determinar a variable saínte. Se todos os coeficientes da fila z son ≤ 0, a solución actual é óptima e lese directamente da columna de valores das variables básicas.",
    explanation:
      "O método Simplex determina a optimalidade verificando os custos reducidos. Se existe algún custo reducido positivo (maximización), a solución pode mellorarse introducindo esa variable na base.",
  },
  {
    id: "2026-01_q2",
    exam: "2026-01",
    topic: "preguntas",
    type: "calculation",
    points: 2,
    question: `Escribe a forma estándar do seguinte problema:

\`\`\`
min  6x₁ − 5x₂
s.a. −x₁ + x₂ = −4
     2x₁ − 3x₂ ≥ 7
     3x₁ − x₂ ≤ 3
     x₁ ≥ 0, x₂ ≥ 0
\`\`\``,
    correctAnswer: `Forma estándar (con variables de exceso e folgura):

\`\`\`
min  6x₁ − 5x₂ + 0s₁ + 0s₂ + 0a₁ + 0a₂
s.a.  x₁ − x₂ + a₁ = 4        (multiplicando a primeira restrición por −1)
     2x₁ − 3x₂ − s₁ + a₂ = 7  (restrición ≥, engádese exceso −s₁ e artificial +a₂)
     3x₁ − x₂ + s₂ = 3         (restrición ≤, engádese folgura +s₂)
     x₁, x₂, s₁, s₂, a₁, a₂ ≥ 0
\`\`\`

A primeira ecuación multiplícase por −1 para ter o lado dereito positivo: x₁ − x₂ = 4. Engádese variable artificial a₁. A segunda restrición leva variable de exceso −s₁ por ser ≥ e artificial a₂. A terceira leva variable de folgura s₂ por ser ≤.`,
    explanation:
      "Na forma estándar, todas as restricións deben ser igualdades con lado dereito ≥ 0. As restricións ≥ requiren variables de exceso e artificiais. As ≤ requiren variables de folgura. As de igualdade requiren artificiais se o lado dereito é positivo.",
  },

  // --- Tema 1: Introdución ---
  {
    id: "2026-01_q3_1",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "É altamente recomendable establecer unha clasificación de proxectos de cara a Xestión de Proxectos e de Riscos e empregala tamén para segmentar os históricos para Estimación.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "A clasificación de proxectos permite aplicar estratexias de xestión adaptadas a cada tipo e usar datos históricos segmentados para mellorar a precisión das estimacións.",
  },

  // --- Tema 2: Planificación ---
  {
    id: "2026-01_q3_2",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "En notación ADM as relacións de precedencia entre as actividades son do tipo acabar-para-empezar.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "ADM (Arrow Diagramming Method) só permite relacións de precedencia do tipo Finish-to-Start (acabar-para-empezar). As outras relacións (SS, FF, SF) son exclusivas de PDM (Precedence Diagramming Method).",
  },
  {
    id: "2026-01_q3_3",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Para calcular as datas early e late en CPM non se necesitan coñecer as asignacións dos recursos.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "O CPM (Critical Path Method) baséase unicamente nas dependencias e duracións das tarefas. As asignacións de recursos non son necesarias para o cálculo das datas early e late.",
  },
  {
    id: "2026-01_q3_4",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "A FC B é equivalente a A CC+2d B se a duración estimada de A é 2 días.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "FC (Finish-to-Start) sen retraso: B empeza cando A termina. CC+2d (Start-to-Start + 2 días): B empeza 2 días despois de A. Se A dura 2 días, ambas significan que B empeza no día 3.",
  },

  // --- Tema 3: MS-Project ---
  {
    id: "2026-01_q3_5",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Se MS-Project identifica unha sobrecarga, non é seguro que ese recurso realice máis esforzo do posible.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "MS-Project pode sinalar sobrecargas que sexan 'ficticias', por exemplo cando un recurso está asignado a tarefas que non se solapan realmente ou cando a dedicación real é inferior á planificada.",
  },
  {
    id: "2026-01_q3_6",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "MS-Project sempre pintará o Camiño Crítico como un camiño continuo desde o principio ao final do proxecto.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "b",
    explanation:
      "O camiño crítico non sempre é unha liña continua de principio a fin. Poden existir múltiples camiños críticos non conectados ou tramos críticos illados noutras partes do proxecto.",
  },

  // --- Tema 4: Riscos ---
  {
    id: "2026-01_q3_7",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Se para un risco se calculou a súa ER e é baixa, o Xefe de Proxecto non pode tratar ese risco como relevante (ER alta).",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "b",
    explanation:
      "O xefe de proxecto ten a potestade de elevar a prioridade dun risco baseándose no seu criterio profesional, experiencia ou factores cualitativos non capturados pola fórmula ER = P · I.",
  },

  // --- Tema 5: Xestión da Configuración do Software ---
  {
    id: "2026-01_q3_8",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "A GCS é unha disciplina dentro da Enxeñaría do Software cuxa única misión é a de controlar a evolución dun sistema software durante o seu ciclo de desenvolvemento.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "b",
    explanation:
      "A GCS (Xestión da Configuración do Software) non só controla a evolución. As súas funcións inclúen tamén a identificación dos elementos de configuración, a auditoría da configuración e o rexistro do estado da configuración.",
  },

  // --- Tema 6: Seguimento e Control ---
  {
    id: "2026-01_q3_9",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Unha boa estratexia é usar as modalidades de seguimento que ofrece MS-Project en función da folgura da tarefa sobre a que se fai seguimento.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "a",
    explanation:
      "As modalidades de seguimento de MS-Project deben elixirse segundo a criticidade da tarefa. Para tarefas do camiño crítico (folgura 0) convén un seguimento máis detallado que para tarefas con folgura ampla.",
  },
  {
    id: "2026-01_q3_10",
    exam: "2026-01",
    topic: "preguntas",
    type: "mc",
    points: 0.5,
    question:
      "Ao establecer liña base en MS-Project, os datos reais 'copianse' nos datos previstos.",
    options: ["V. Verdadeiro", "F. Falso"],
    correctAnswer: "b",
    explanation:
      "É ao revés: ao establecer a liña base, os datos previstos (planificados) cópianse aos campos de liña base. Os datos reais rexístranse posteriormente durante o seguimento.",
  },

  // --- Tema 1: Introdución ---
  {
    id: "2026-01_q4",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Indique cales son as tres características xenéricas que presenta un proxecto.",
    correctAnswer:
      "As tres características xenéricas dun proxecto son:\n\n1. **Temporal**: Todo proxecto ten un inicio e un fin definidos. Non é unha operación continua.\n2. **Único**: O resultado do proxecto é singular; non se trata dun produto ou servizo repetitivo.\n3. **Elaboración progresiva**: O proxecto desenvólvese por etapas e se refina gradualmente a medida que se obtén máis información.",
    explanation:
      "Estas tres características (temporalidade, singularidade e elaboración progresiva) distinguen un proxecto das operacións rutineiras dunha organización.",
  },

  // --- Tema 5: Xestión da Configuración do Software ---
  {
    id: "2026-01_q5",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Indique e xustifique que produtos de saída (entregables) das actividades de Xestión de Proxectos deberían someterse a control de versións en GCS.",
    correctAnswer:
      "Os principais entregables de GP que deben someterse a GCS son:\n\n- **Plan de Proxecto**: evoluciona ao longo do proxecto con revisións e actualizacións.\n- **Plan de Riscos**: os riscos identificados e as súas estratexias de resposta cambian.\n- **Plan de Calidade**: os estándares e métricas poden axustarse.\n- **EDT/WBS**: a descomposición do traballo refínase progresivamente.\n- **Calendario do proxecto**: as datas e fitos actualízanse continuamente.\n\nXustificación: calquera documento que evolucione durante o ciclo de vida do proxecto e cuxas versións intermedias sexan necesarias para trazabilidade e auditoría debe estar baixo control de versións.",
    explanation:
      "A GCS aplícase a todos os elementos que cambian durante o proxecto e cuxo historial de cambios é relevante para a xestión, auditoría ou recuperación ante erros.",
  },

  // --- Tema 7: Negociación ---
  {
    id: "2026-01_q6",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Indique tres opcións técnicas que se poderían aplicar, en xeral, na 'parte de opcións' nunha estratexia de negociación conveniente en planificación de proxectos software.",
    correctAnswer:
      "Tres opcións técnicas habituais son:\n\n1. **Entregas incrementais**: dividir o desenvolvemento en entregas parciais para achegar valor antes e reducir o risco global.\n2. **Redución/eliminación de prestacións**: recortar funcionalidades non críticas para axustarse a prazos ou orzamento.\n3. **Aumento do prazo de entrega**: ampliar o calendario para garantir a calidade ou incluír máis funcionalidades, a cambio de axustes no orzamento.",
    explanation:
      "A 'parte de opcións' nunha negociación presenta alternativas viables que permiten flexibilizar os termos do proxecto sen comprometer a súa viabilidade.",
  },

  // --- Tema 6: Seguimento e Control ---
  {
    id: "2026-01_q7",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "O segundo día da tarefa T, o recurso R1 que a estaba realizando inicia unha baixa laboral. Estímase que tardará 2 meses en volver, un prazo demasiado longo para esperalo. Polo tanto, o seu traballo restante é asumido polo recurso R2, que se incorpora á tarefa o seguinte día á baixa de R1. Indique como actualizaría Project con esta información nunha sesión de seguimento.",
    correctAnswer:
      "Pasos para actualizar MS-Project:\n\n1. Marcar a tarefa T co progreso real ata o momento da baixa (1 día de traballo de R1).\n2. Rexistrar as horas reais traballadas por R1 nese primeiro día.\n3. Editar a asignación de recursos da tarefa T: eliminar a R1 (ou marcar como inactivo) e engadir a R2.\n4. O traballo restante da tarefa asígnase a R2, que comeza o día seguinte á baixa.\n5. MS-Project recalculará automaticamente a nova data de finalización en función da capacidade de R2.",
    explanation:
      "O seguimento en MS-Project require rexistrar o traballo real e redistribuír o traballo restante entre os recursos dispoñibles, respectando as dependencias e o calendario.",
  },

  // --- Tema 3: MS-Project ---
  {
    id: "2026-01_q8",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 1,
    question:
      "Para a realización completa dun proxecto alúgase unha supercomputadora a LeaderGPU por un prezo de 13000 euros ao mes. Como modelaría este coste no proxecto?",
    correctAnswer:
      "Para modelar este coste en MS-Project:\n\n1. Crear un recurso de tipo **Coste** chamado 'LeaderGPU'.\n2. Asignar este recurso ás tarefas do proxecto ou a unha tarefa resumo que abarque todo o proxecto.\n3. Configurar o coste do recurso como 13000€/mes.\n4. MS-Project calculará automaticamente o coste total multiplicando a taxa mensual pola duración en meses das tarefas ás que está asignado o recurso.\n\nAlternativamente, se o custo é fixo independentemente da duración exacta, pódese configurar como custo fixo da tarefa principal do proxecto.",
    explanation:
      "Os recursos de tipo Coste son idóneos para gastos que se acumulan por tempo (alugueiros, servizos) sen afectar á programación nin á carga de traballo.",
  },

  // --- Tema 3: MS-Project (Práctica 1) ---
  {
    id: "2026-01_q9a",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 2.5,
    question:
      "Unha vez finalizado o Doc. Usuario v1, pódense iniciar o modelo de datos e o modelo de arquitectura do sistema. Ambas tarefas son realizadas por D1 e D2 e ambas teñen unha estimación de 80h·h. Cal sería a mellor forma de eliminar a sobrecarga de D1 e D2 nestas tarefas?",
    correctAnswer:
      "A mellor forma de eliminar a sobrecarga de D1 e D2 é **secuenciar as tarefas** en lugar de executalas en paralelo:\n\n1. Establecer unha dependencia FC (Finish-to-Start) entre o modelo de datos e o modelo de arquitectura.\n2. Deste xeito, D1 e D2 traballan primeiro xuntos no modelo de datos (80h·h ÷ 2 = 40h por persoa).\n3. Ao finalizar, traballan xuntos no modelo de arquitectura (outras 40h por persoa).\n4. Así, en ningún momento D1 ou D2 teñen que estar en dúas tarefas simultaneamente.\n\nAlternativa: dividir cada modelo en subtarefas e asignar D1 ao modelo de datos e D2 ao de arquitectura, executándose en paralelo pero con recursos diferenciados.",
    explanation:
      "A sobrecarga (overallocation) prodúcese cando un recurso está asignado a máis dunha tarefa ao mesmo tempo. Secuenciar as tarefas ou dividir os recursos son as estratexias principais para nivelar.",
  },
  {
    id: "2026-01_q9b",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 2.5,
    question:
      "Os 2 modelos anteriores (datos e arquitectura) deben documentarse no Doc. Usuario v2 mediante un capítulo dedicado a cada un. Esta documentación implica 40h·h de traballo (20h·h cada capítulo). Ademais, débena realizar os propios recursos que construíron os modelos e ao mesmo tempo que os constrúen. Modifique/complete o modelo do apartado anterior (a) para representar esta situación. O modelo final debe estar nivelado.",
    correctAnswer:
      "Para modelar esta situación co modelo nivelado:\n\n1. Crear dúas tarefas de documentación: 'Doc. modelo datos v2' (20h·h) e 'Doc. modelo arquitectura v2' (20h·h).\n2. Vincular cada tarefa de documentación en paralelo (SS, Start-to-Start) coa súa correspondente tarefa de construción de modelo.\n3. Asignar D1 e D2 a ambas tarefas de documentación.\n4. Dado que agora D1 e D2 teñen 4 tarefas (2 de modelo + 2 de documentación) executándose en paralelo, haberá sobrecarga.\n5. Para nivelar: dividir D1 e D2 por especialidade. D1 fai o modelo de datos + a súa documentación (80+20=100h·h), D2 fai o modelo de arquitectura + a súa documentación (80+20=100h·h).\n6. Ambas ramas (datos e arquitectura) execútanse en paralelo pero con recursos independentes, eliminando a sobrecarga.\n\nModelo final nivelado: D1 → [Modelo datos (80h) || Doc. datos (20h)] en paralelo con D2 → [Modelo arq. (80h) || Doc. arq. (20h)].",
    explanation:
      "A clave é separar os recursos por modelo para que cada persoa se centre nunha rama completa (modelo + documentación), evitando así o solapamento de asignacións.",
  },
  {
    id: "2026-01_q9c",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 2.5,
    question:
      "Unha vez elaborado o Plan de Instalación e Formación, este debe ser aprobado polo cliente nun prazo de 3 días. Tras a súa aprobación, o cliente disporá de 4 días para preparar as súas oficinas como o indica o plan. Unha vez feitos estes preparativos, poderase realizar a instalación e tras ela a formación.",
    correctAnswer:
      "Modelado en MS-Project:\n\n1. **Tarefa 'Plan de Instalación e Formación'** (duración estimada)\n2. **Fito 'Plan aprobado'**: dependencia FC + 3 días desde a tarefa anterior. Os 3 días representan o prazo máximo de aprobación do cliente.\n3. **Tarefa 'Preparación oficinas'**: dependencia FC desde o fito 'Plan aprobado'. Duración: 4 días (realizada polo cliente).\n4. **Tarefa 'Instalación'**: dependencia FC desde 'Preparación oficinas'.\n5. **Tarefa 'Formación'**: dependencia FC desde 'Instalación'.",
    explanation:
      "O uso de fitos (milestones) para representar aprobacións externas é unha práctica estándar en MS-Project. As dependencias FC (Finish-to-Start) aseguran a secuencia correcta de eventos.",
  },
  {
    id: "2026-01_q9d",
    exam: "2026-01",
    topic: "preguntas",
    type: "text",
    points: 2.5,
    question:
      "A instalación en cliente estaba programada para realizarse os días 26, 27 e 28 de xaneiro de 2026. Tras iso, realizaríase a formación do cliente os días 29 e 30 de xaneiro de 2026. Por alerta climatolóxica, os nosos traballadores non puideron desprazarse ás oficinas do cliente nesas datas. O que ocorreu realmente foi o seguinte: DS1 formou ao cliente online os días 29 e 30 de xaneiro de 2026. DS2-5 realizaron a instalación nas oficinas do cliente os días 2, 3 e 4 de febreiro de 2026, unha vez que a climatoloxía lles permitiu desprazarse.",
    correctAnswer:
      "Actualización no seguimento de MS-Project:\n\n1. **Formación**:\n   - Rexistrar as datas reais de inicio (29/01/2026) e fin (30/01/2026).\n   - Cambiar o recurso asignado: só DS1 (non todos os DS como estaba planificado).\n   - Anotar que se realizou en modalidade online.\n\n2. **Instalación**:\n   - Modificar as datas de inicio (02/02/2026) e fin (04/02/2026).\n   - Actualizar os recursos: DS2, DS3, DS4, DS5.\n   - MS-Project recalculará automaticamente as dependencias.\n\n3. **Xustificación do atraso**:\n   - A alerta climatolóxica impuxo un atraso de 5 días na instalación (do 28/01 ao 04/02).\n   - A formación, con todo, puido manterse nas datas previstas ao realizarse online, pero cun recurso reducido (DS1 en solitario).",
    explanation:
      "O seguimento en MS-Project require rexistrar as datas reais de inicio e fin, así como o traballo real realizado por cada recurso. As desviacións respecto á liña base quedarán reflectidas automaticamente.",
  },
];
