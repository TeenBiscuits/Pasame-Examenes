import type { Translations } from "./en";

export const es: Translations = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      "Plataforma de código abierto para practicar exámenes universitarios. Elige una asignatura para empezar a practicar con preguntas de exámenes anteriores.",
    addSubject: "¿Añadir asignatura?",
  },
  subjectHome: {
    notFound: "Asignatura no encontrada",
    returnHome: "Volver al inicio",
    practiceByTopic: "Practicar por tema",
    examSimulations: "Simulaciones de examen completas",
    originalExams: "Documentos originales de examen",
    examDocsDescription:
      "Descarga o visualiza los PDFs originales en los que se basan estas preguntas y simulaciones.",
    pdf: "PDF",
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
  },
  subjectCard: {
    questions: "preguntas",
    points: "puntos",
    topics: "temas",
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
};
