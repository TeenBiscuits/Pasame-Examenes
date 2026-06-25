import type { Translations } from "./en";

export const gl: Translations = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      "Plataforma de código aberto para practicar exames universitarios. Elixe unha materia para comezar a practicar con preguntas de exames anteriores.",
    addSubject: "Engadir materia?",
    recentlyVisited: "Visitadas recentemente",
    clearRecent: "Limpar materias recentes",
  },
  subjectHome: {
    notFound: "Materia non atopada",
    returnHome: "Volver ao inicio",
    description:
      "Practica {count} preguntas{repeated} de {exams} exames con respostas modelo e autocorrección.",
    practiceByTopic: "Practicar por tema",
    examSimulations: "Simulacións de exame completas",
    originalExams: "Documentos orixinais de exame",
    examDocsDescription:
      "Descarga ou visualiza os PDFs orixinais nos que se basean estas preguntas e simulacións.",
    pdf: "PDF",
    acknowledgments: "Agradecementos",
    addExam: "Engadir exame?",
    repeatedSuffix: "{count} repetidas ao longo dos anos",
  },
  practiceHome: {
    title: "Practicar por tema",
    subtitle:
      "Elixe un tema para practicar. As preguntas de test e de emparellar autocorríxense.",
  },
  header: {
    home: "Inicio",
    practice: "Practicar",
  },
  footer: {
    byline: "Pásame Exámenes - Plataforma de estudo de código aberto",
    github: "TeenBiscuits/Pasame-Examenes",
  },
  practice: {
    backToTopics: "← Volver a temas",
    noQuestions: "Non se atoparon preguntas para este tema.",
    backToHome: "Volver ao inicio",
    score: "Puntuación",
    points: "puntos",
    pointsTotal: "puntos en total",
    allCorrect:
      "Revisa as túas respostas. Verde = correctas. Só as preguntas de test e de emparellar se autocorrigen.",
    previous: "Anterior",
    next: "Seguinte",
    clear: "Limpar",
    check: "Corrixir",
    submit: "Enviar e ver solucións",
    runningScore: "Puntuación parcial",
    checked: "corrixidas",
    openEnded: "preguntas abertas",
  },
  exam: {
    backToSubject: "← Volver á materia",
    exitConfirm: "Estás seguro de que queres saír? O teu progreso perderase.",
    noQuestions: "Non se atoparon preguntas para este exame.",
    backToHome: "Volver ao inicio",
    questions: "Preguntas",
    totalPoints: "Puntos totais",
    pass: "Aprobado",
    timeLimit: "Límite de tempo",
    minutes: "minutos",
    startExam: "Comezar exame",
    simulationNote:
      "Esta simulación reflicte o formato real do exame. Para as preguntas abertas, autoavalia as túas respostas coas solucións modelo que se mostran tras enviar. As preguntas de test e emparellar autocorríxense.",
    submitted: "Exame enviado.",
    passThreshold: "Limiar de aprobado",
    reviewNote:
      "Revisa as túas respostas. As preguntas abertas mostran as solucións modelo para autoavaliación.",
    submitExam: "Entregar exame",
    submitConfirm:
      "Estás seguro de que queres entregar o exame? Non poderás modificar as túas respostas.",
    score: "Puntuación",
    outOf: "/",
    pass_: "(APROBADO)",
    fail: "(SUSPENSO)",
    total: "total",
    previous: "Anterior",
    next: "Seguinte",
  },
  questionCard: {
    modelSolution: "Solución modelo",
    gradeAnswer: "Avalía a túa resposta:",
    correct: "✓ Correcto",
    incorrect: "✗ Incorrecto",
    openSolution: "Abrir solucións",
    closeSolution: "Pechar solución",
    yourAnswer: "A túa resposta",
    correct_: "Correcto",
    reportIssue: "Reportar erro",
    repeated: "Repetida",
  },
  subjectCard: {
    topics: "temas",
    questions: "preguntas",
    points: "puntos",
    exams: "exames",
  },
  addSubject: {
    title: "Engadir materia",
    close: "Pechar",
    openIssue: "Abrir un issue",
    openIssueDesc: "Solicita unha nova materia usando o modelo de GitHub",
    openIssueUrl:
      "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=suggest-subject.yml",
    contribute: "Contribúe!",
    contributeDesc:
      "Segue a guía de contribución para engadila ti mesmo cun pull request",
    email: "Escribe un correo",
  },
  addExam: {
    title: "Engadir exame",
    close: "Pechar",
    openIssue: "Abrir un issue",
    openIssueDesc:
      "Solicita un novo exame para esta materia usando o modelo de GitHub",
    openIssueUrl:
      "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=add-exam.yml",
    contribute: "Contribúe!",
    contributeDesc:
      "Segue a guía de contribución para engadilo ti mesmo cun pull request",
    email: "Escribe un correo",
  },
  seo: {
    siteName: "Pásame Exámenes",
    locale: "gl_ES",
    homeDescription:
      "Plataforma de código aberto para practicar exames universitarios por tema ou simular o exame completo.",
    defaultDescription:
      "Practica exames universitarios con respostas modelo e autocorrección. Preguntas tipo test, de desenvolvemento e de emparellar de exames anteriores.",
  },
};
