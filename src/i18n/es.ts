import type { Translations } from "./en";

export const es: Translations = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      "Plataforma de código abierto para practicar exámenes universitarios. Elige una asignatura para empezar a practicar con preguntas de exámenes anteriores.",
    addSubject: "¿Añadir asignatura?",
    recentlyVisited: "Visitadas recientemente",
    clearRecent: "Limpiar asignaturas recientes",
  },
  subjectHome: {
    notFound: "Asignatura no encontrada",
    returnHome: "Volver al inicio",
    description:
      "Practica {count} preguntas{repeated} de {exams} exámenes con respuestas modelo y autocorrección.",
    practiceByTopic: "Practicar por tema",
    examSimulations: "Simulaciones de examen completas",
    originalExams: "Documentos originales de examen",
    examDocsDescription:
      "Descarga o visualiza los PDFs originales en los que se basan estas preguntas y simulaciones.",
    pdf: "PDF",
    acknowledgments: "Agradecimientos",
    addExam: "¿Añadir examen?",
    repeatedSuffix: "{count} repetidas a lo largo de los años",
  },
  practiceHome: {
    title: "Practicar por tema",
    subtitle:
      "Elige un tema para practicar. Las preguntas de test y de emparejar se autocorrigen.",
  },
  header: {
    home: "Inicio",
    practice: "Practicar",
  },
  footer: {
    byline: "Pásame Exámenes - Plataforma de estudio de código abierto",
    github: "TeenBiscuits/Pasame-Examenes",
  },
  practice: {
    backToTopics: "← Volver a temas",
    noQuestions: "No se encontraron preguntas para este tema.",
    backToHome: "Volver al inicio",
    score: "Puntuación",
    points: "puntos",
    pointsTotal: "puntos en total",
    allCorrect:
      "Revisa tus respuestas. Verde = correctas. Solo las preguntas de test y de emparejar se autocorrigen.",
    previous: "Anterior",
    next: "Siguiente",
    clear: "Limpiar",
    check: "Corregir",
    submit: "Enviar y ver soluciones",
    runningScore: "Puntuación parcial",
    checked: "corregidas",
    openEnded: "preguntas abiertas",
  },
  exam: {
    backToSubject: "← Volver a la asignatura",
    exitConfirm: "¿Estás seguro de que quieres salir? Tu progreso se perderá.",
    noQuestions: "No se encontraron preguntas para este examen.",
    backToHome: "Volver al inicio",
    questions: "Preguntas",
    totalPoints: "Puntos totales",
    pass: "Aprobado",
    timeLimit: "Tiempo límite",
    minutes: "minutos",
    startExam: "Comenzar examen",
    simulationNote:
      "Esta simulación refleja el formato real del examen. Para las preguntas abiertas, autoevalúa tus respuestas con las soluciones modelo que se muestran tras enviar. Las preguntas de test y emparejar se autocorrigen.",
    submitted: "Examen enviado.",
    passThreshold: "Umbral de aprobado",
    reviewNote:
      "Revisa tus respuestas. Las preguntas abiertas muestran las soluciones modelo para autoevaluación.",
    submitExam: "Entregar examen",
    submitConfirm:
      "¿Estás seguro de que quieres entregar el examen? No podrás modificar tus respuestas.",
    score: "Puntuación",
    outOf: "/",
    pass_: "(APROBADO)",
    fail: "(SUSPENSO)",
    total: "total",
    previous: "Anterior",
    next: "Siguiente",
  },
  questionCard: {
    modelSolution: "Solución modelo",
    gradeAnswer: "Evalúa tu respuesta:",
    correct: "✓ Correcto",
    incorrect: "✗ Incorrecto",
    openSolution: "Abrir soluciones",
    closeSolution: "Cerrar solución",
    yourAnswer: "Tu respuesta",
    correct_: "Correcto",
    reportIssue: "Reportar error",
    repeated: "Repetida",
  },
  subjectCard: {
    topics: "temas",
    questions: "preguntas",
    points: "puntos",
    exams: "exámenes",
  },
  addSubject: {
    title: "Añadir asignatura",
    close: "Cerrar",
    openIssue: "Abrir un issue",
    openIssueDesc:
      "Solicita una nueva asignatura usando la plantilla de GitHub",
    openIssueUrl:
      "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=suggest-subject.yml",
    contribute: "¡Contribuye!",
    contributeDesc:
      "Sigue la guía de contribución para añadirla tú mismo con un pull request",
    email: "Escribe un correo",
  },
  addExam: {
    title: "Añadir examen",
    close: "Cerrar",
    openIssue: "Abrir un issue",
    openIssueDesc:
      "Solicita un nuevo examen para esta asignatura usando la plantilla de GitHub",
    openIssueUrl:
      "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=add-exam.yml",
    contribute: "¡Contribuye!",
    contributeDesc:
      "Sigue la guía de contribución para añadirlo tú mismo con un pull request",
    email: "Escribe un correo",
  },
  tour: {
    next: "Siguiente",
    previous: "Anterior",
    done: "Listo",
    reportIssueTitle: "Reportar error",
    reportIssueDesc:
      "¿Has encontrado un error en una pregunta? Haz clic en el botón de reportar para abrir un issue en GitHub y ayudar a mejorar el contenido.",
    practice: {
      step1Title: "Práctica por tema",
      step1Desc:
        "Estás practicando preguntas por tema. Usa el enlace de volver para regresar a la página de la asignatura cuando quieras.",
      step2Title: "Navegador de preguntas",
      step2Desc:
        "Estos botones numerados te permiten saltar entre preguntas. Las respondidas se resaltan y la actual está destacada con el color de acento.",
      step3Title: "Responder preguntas",
      step3Desc:
        "Haz clic en una opción para tipo test, escribe tu respuesta para preguntas abiertas, o selecciona letras para emparejar.",
      step4Title: "Corregir y enviar",
      step4Desc:
        "Usa 'Corregir' para verificar una pregunta, 'Limpiar' para borrar tu respuesta o 'Enviar y ver soluciones' para ver todas a la vez.",
      step5Title: "Navegar",
      step5Desc:
        "Usa los botones Anterior / Siguiente o las teclas de flecha (← →) para moverte entre preguntas.",
    },
    exam: {
      step1Title: "Simulación de examen",
      step1Desc:
        "Esto simula el formato real del examen. ¡El temporizador está en marcha, gestiona bien tu tiempo! El umbral de aprobado se muestra aquí.",
      step2Title: "Navegador de preguntas",
      step2Desc:
        "Haz clic en los botones numerados para saltar entre preguntas. Las respondidas se resaltan para seguir tu progreso.",
      step3Title: "Responder preguntas",
      step3Desc:
        "Responde cada pregunta. Para las preguntas abiertas, autoevaluarás tu respuesta comparándola con la solución modelo tras entregar.",
      step4Title: "Entregar examen",
      step4Desc:
        "Cuando termines, haz clic en 'Entregar examen' para ver tu puntuación y las soluciones modelo. No podrás modificar tus respuestas después.",
    },
  },
  seo: {
    siteName: "Pásame Exámenes",
    locale: "es_ES",
    homeDescription:
      "Plataforma de código abierto para practicar exámenes universitarios por tema o simular el examen completo.",
    defaultDescription:
      "Practica exámenes universitarios con respuestas modelo y autocorrección. Preguntas tipo test, de desarrollo y de emparejar de exámenes anteriores.",
  },
};
