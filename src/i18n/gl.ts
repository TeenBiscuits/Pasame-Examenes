import type { Translations } from "./en";

export const gl: Translations = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      "Plataforma de código aberto para practicar preguntas universitarias. Elixe unha materia para estudar por tema ou en modo cronometrado.",
    addSubject: "Engadir materia?",
    recentlyVisited: "Visitadas recentemente",
    clearRecent: "Limpar materias recentes",
    archiveLabel: "Arquivo de estudo",
    subjectCount: "{count} materias",
    topicPractice: "Práctica por tema",
    examSimulation: "Simulación de exame",
    availableSubjects: "Materias dispoñibles",
    subjectGridTitle: "Elixe o feixe que toca abrir hoxe",
    sheetCallout: "Convocatoria",
    sheetStamp: "Repasar",
    sheetLineTopic: "Tema elixido",
    sheetLineMistakes: "Preguntas falladas",
    sheetLineTomorrow: "Volver mañá",
  },
  subjectHome: {
    notFound: "Materia non atopada",
    returnHome: "Volver ao inicio",
    description:
      "Practica {count} preguntas{repeated} de {exams} exames con respostas modelo e autocorrección.",
    communityDescription:
      "Practica {count} preguntas{repeated} de {exams} recompilacións con respostas modelo e autocorrección.",
    practiceByTopic: "Practicar por tema",
    examSimulations: "Exames",
    practiceSimulations: "Recompilacións",
    originalExams: "Documentos orixinais de exame",
    examDocsDescription:
      "Descarga ou visualiza os PDFs orixinais nos que se basean estas preguntas e simulacións.",
    sourceMaterials: "Materiais fonte",
    sourceMaterialsDescription:
      "Abre os materiais autorizados ou públicos usados como fonte para estas preguntas de práctica.",
    originalDaypos: "Tests Daypo orixinais",
    daypoDocsDescription:
      "Abre os tests Daypo orixinais usados como fonte para estas preguntas de práctica.",
    daypo: "Daypo",
    pdf: "PDF",
    acknowledgments: "Agradecementos e exención de responsabilidade",
    addExam: "Engadir?",
    reportCopyright: "Reportar dereitos de autor",
    copyrightRemoved: "Retirada por dereitos de autor",
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
    practiceNote:
      "Esta práctica cronometrada usa unha estrutura orientativa para estudar. Para as preguntas abertas, autoavalia as túas respostas coas solucións modelo que se mostran tras enviar. As preguntas de test e emparellar autocorríxense.",
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
    practiceSets: "recompilacións",
  },
  contentPolicy: {
    authorized: "Materiais de exame verificados",
    community: "Materiais de práctica da comunidade",
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
    title: "Engadir material de práctica",
    close: "Pechar",
    openIssue: "Abrir un issue",
    openIssueDesc:
      "Propón un exame autorizado, recompilación ou exercicios orixinais usando o modelo de GitHub",
    openIssueUrl:
      "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=add-exam.yml",
    contribute: "Contribúe!",
    contributeDesc:
      "Segue a guía de contribución para engadir contido autorizado ou orixinal cun pull request",
    email: "Escribe un correo",
    legalNotice:
      "Envía só contido orixinal, materiais autorizados ou fontes públicas con permiso para compartirse.",
  },
  copyrightReport: {
    title: "Reportar dereitos de autor",
    close: "Pechar",
    description:
      "Se un exame, proba, compilación ou pregunta debe retirarse por dereitos de autor, envía un correo a pablo.portas@udc.es.",
    includeDetails:
      "Inclúe a materia, o exame/ano ou pregunta afectada e o motivo da solicitude de retirada.",
    email: "Enviar solicitude de retirada",
    emailSubject: "Solicitude de retirada por dereitos de autor - {subjectName}",
    emailBody:
      "Materia: {subjectName}\nID da materia: {subjectId}\n\nExame/ano ou pregunta afectada:\n\nMotivo da solicitude de retirada:\n",
  },
  tour: {
    next: "Seguinte",
    previous: "Anterior",
    done: "Listo",
    reportIssueTitle: "Reportar erro",
    reportIssueDesc:
      "Atopaches un erro nunha pregunta? Fai clic no botón de reportar para abrir un issue en GitHub e axudar a mellorar o contido.",
    practice: {
      step1Title: "Práctica por tema",
      step1Desc:
        "Estás practicando preguntas por tema. Usa a ligazón de volver para regresar á páxina da materia cando queiras.",
      step2Title: "Navegador de preguntas",
      step2Desc:
        "Estes botóns numerados permítenche saltar entre preguntas. As respondidas resáltanse e a actual está destacada coa cor de acento.",
      step3Title: "Responder preguntas",
      step3Desc:
        "Fai clic nunha opción para tipo test, escribe a túa resposta para preguntas abertas, ou selecciona letras para emparellar.",
      step4Title: "Corrixir e enviar",
      step4Desc:
        "Usa 'Corrixir' para verificar unha pregunta, 'Limpar' para borrar a túa resposta ou 'Enviar e ver solucións' para velas todas á vez.",
      step5Title: "Navegar",
      step5Desc:
        "Usa os botóns Anterior / Seguinte ou as teclas de frecha (← →) para moverte entre preguntas.",
    },
    exam: {
      step1Title: "Simulación de proba",
      step1Desc:
        "Isto simula o formato real do exame. O temporizador está en marcha, xestiona ben o teu tempo! O limiar de aprobado móstrase aquí.",
      practiceStep1Desc:
        "Isto é unha práctica cronometrada cunha estrutura orientativa. O temporizador está en marcha, xestiona ben o teu tempo! O limiar de aprobado móstrase aquí.",
      step2Title: "Navegador de preguntas",
      step2Desc:
        "Fai clic nos botóns numerados para saltar entre preguntas. As respondidas resáltanse para seguir o teu progreso.",
      step3Title: "Responder preguntas",
      step3Desc:
        "Responde cada pregunta. Para as preguntas abertas, autoavaliarás a túa resposta comparándoa coa solución modelo tras entregar.",
      step4Title: "Entregar exame",
      step4Desc:
        "Cando remates, fai clic en 'Entregar exame' para ver a túa puntuación e as solucións modelo. Non poderás modificar as túas respostas despois.",
    },
  },
  starPopup: {
    title: "Daríasnos unha estrela?",
    subtitle: "Non queremos o teu diñeiro, só unha estrela en GitHub.",
    starButton: "Dame unha estrela!",
    dismiss: "Agora non",
  },
  disclaimer: {
    text: "As preguntas foron extraídas dos materiais de referencia por procesos automatizados e poderían conter erros. Se atopa algún erro non dubide en",
    reportLink: "Reportar a pregunta",
    postLinkText:
      ". Nalgúns casos pode revisar o material orixinal directamente desde a web.",
  },
  seo: {
    siteName: "Pásame Exámenes",
    locale: "gl_ES",
    homeDescription:
      "Plataforma de código aberto para practicar preguntas universitarias por tema ou en modo cronometrado.",
    defaultDescription:
      "Practica preguntas universitarias con respostas modelo e autocorrección. Preguntas tipo test, de desenvolvemento e de emparellar.",
  },
};
