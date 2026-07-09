import type { Translations } from "./en";

export const gl: Translations = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      "Plataforma de código aberto para practicar preguntas universitarias. Elixe unha materia para estudar por tema ou en modo cronometrado.",
    addSubject: "Engadir materia?",
    recentlyVisited: "Visitadas recentemente",
    clearRecent: "Limpar materias recentes",
    quote: "Os exames non se repiten, pero riman.",
  },
  subjectHome: {
    notFound: "Materia non atopada",
    returnHome: "Volver ao inicio",
    description:
      "Practica {count} preguntas{repeated} de {exams} exames con respostas modelo e autocorrección.",
    communityDescription:
      "Practica {count} preguntas{repeated} de {exams} recompilacións con respostas modelo e autocorrección.",
    practiceByTopic: "Temas",
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
    contentLicense: "Licenza específica do contido",
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
    github: "GitHub",
    by: "por",
    isLicensedUnder: "está licenciado baixo",
    licenses: "Licenzas",
    privacy: "Política de privacidade",
    close: "Pechar",
    licenseTitle: "Licenzas",
    licenseIntro:
      "Pásame Exámenes separa a licenza do software da web da licenza do contido publicado nela.",
    contentLicenseTitle: "Contido: CC BY-NC-SA 4.0",
    contentLicenseDescription:
      "Salvo que a páxina dunha materia indique outra cousa, o contido subido a esta web está licenciado baixo CC BY-NC-SA 4.0.",
    softwareLicenseTitle: "Software: Apache 2.0",
    softwareLicenseDescription:
      "O código fonte da plataforma está licenciado baixo Apache License, Version 2.0.",
    license: "Licenza",
    licensePage: "Páxina da licenza",
    legalText: "Texto legal",
    linksLabel: "Ligazóns legais e do proxecto",
    privacyTitle: "Política de privacidade",
    privacyLastUpdated: "Última actualización: 8 de xullo de 2026",
    privacySummary:
      "Pásame Exámenes é unha web educativa e de código aberto, sen contas de usuario e sen backend propio. Usa almacenamento local do navegador para preferencias e progreso de estudo, e analítica para entender uso, rendemento e erros.",
    privacySections: [
      {
        title: "Responsable",
        paragraphs: [
          "O responsable do tratamento desta web é Pablo Portas López. Podes contactar co responsable sobre cuestións de privacidade en pablo.portas@udc.es.",
        ],
      },
      {
        title: "Datos que tratamos",
        paragraphs: [
          "A web pode tratar datos técnicos de acceso, datos locais de preferencias, progreso local de estudo e datos de analítica.",
        ],
        items: [
          "Datos técnicos: enderezo IP, navegador, dispositivo, URL solicitada, referrer, idioma, data e hora, e rexistros similares de servidor ou CDN.",
          "Preferencias locais: idioma seleccionado, tema seleccionado, tours vistos, estado do popup de GitHub e materias visitadas recentemente.",
          "Progreso de estudo almacenado localmente: intentos, puntuacións, temas e progreso por materia gardados no teu navegador.",
          "Datos de analítica: páxinas vistas, eventos de interacción, rendemento, información aproximada de dispositivo/navegador e un identificador anónimo local para Umami.",
          "Replays de sesión e heatmaps na instancia self-hosted de Umami, activados cunha mostraxe aleatoria do 30%.",
          "Caché temporal do contador de estrelas de GitHub en sessionStorage tras solicitar datos públicos do repositorio a GitHub.",
        ],
      },
      {
        title: "Finalidades",
        paragraphs: [
          "Os datos trátanse unicamente para finalidades relacionadas con operar, protexer, medir e mellorar a web.",
        ],
        items: [
          "Prestar a web e enrutar solicitudes mediante infraestrutura de hosting e CDN.",
          "Lembrar o teu idioma, tema, materias recentes, tours e avisos descartados.",
          "Gardar progreso de estudo localmente para que poidas continuar practicando no mesmo dispositivo.",
          "Medir uso, rendemento, erros, patróns de navegación e interaccións con funcións.",
          "Mellorar contido, usabilidade, accesibilidade e fiabilidade.",
          "Previr abuso, diagnosticar problemas técnicos e manter a seguridade.",
        ],
      },
      {
        title: "Base xurídica",
        paragraphs: [
          "Baixo o RGPD, a base xurídica principal é o interese lexítimo: manter a web dispoñible, segura, comprensible e útil para estudantes. Isto inclúe analítica, medición de rendemento, heatmaps e replays de sesión, limitados mediante minimización de datos e unha mostraxe aleatoria do 30% para replays e heatmaps.",
          "As preferencias e o progreso local trátanse para proporcionar a funcionalidade solicitada pola persoa usuaria. Tamén poden aplicarse obrigas legais cando sexa necesario.",
        ],
      },
      {
        title: "Almacenamento local",
        paragraphs: [
          "A maioría de datos relacionados co estudo almacénanse só no teu navegador mediante localStorage ou sessionStorage. Non forman parte dunha conta de usuario e poden eliminarse borrando os datos deste sitio na configuración do navegador.",
          "O identificador anónimo de Umami tamén se garda localmente como umami_uid. Ao borrar os datos locais deste sitio reiníciase ese identificador e elimínanse preferencias e progreso gardados localmente.",
        ],
      },
      {
        title: "Analítica, replays e heatmaps",
        paragraphs: [
          "A analítica recóllese cunha instancia self-hosted de Umami en analytics.pablopl.dev. Umami é operado polo responsable desta web; os datos non se envían a Umami Software como provedor cloud de analítica.",
          "Umami está configurado para respectar Do Not Track no script estándar de analítica. Os replays de sesión e heatmaps úsanse para entender problemas de usabilidade e móstranse aleatoriamente no 30% das visitas.",
          "Tamén se usa Ahrefs Analytics para entender tráfico e rendemento da web. Ahrefs trata datos conforme á súa propia política de privacidade.",
        ],
      },
      {
        title: "Conservación",
        paragraphs: [
          "Os datos locais do navegador consérvanse ata que os elimines ou ata que o navegador os borre. Os datos técnicos e de analítica consérvanse durante o tempo necesario para obter estatísticas, mellorar o servizo, diagnosticar incidencias e manter a seguridade. Os datos agregados ou anonimizados poden conservarse durante máis tempo cando xa non identifican unha persoa usuaria.",
        ],
      },
      {
        title: "Transferencias internacionais",
        paragraphs: [
          "Algúns provedores externos poden tratar datos fóra do Espazo Económico Europeo. Cando ocorra, farase conforme ás garantías descritas na política de privacidade ou condicións de tratamento de cada provedor. A configuración self-hosted de Umami non implica transferencia de datos de analítica a Umami Software.",
        ],
      },
      {
        title: "Os teus dereitos RGPD",
        paragraphs: [
          "Podes solicitar acceso, rectificación, supresión, limitación, portabilidade ou oposición ao tratamento cando proceda. Tamén podes presentar unha reclamación ante unha autoridade de protección de datos.",
          "Para exercer os teus dereitos, escribe a pablo.portas@udc.es. Como non hai contas, algúns datos poden existir só no teu navegador e podes eliminalos directamente borrando os datos locais deste sitio.",
        ],
      },
      {
        title: "Cambios",
        paragraphs: [
          "Esta política pode actualizarse se a web cambia os seus tratamentos de datos, configuración de analítica ou provedores. A versión máis recente está dispoñible desde o pé de páxina da web.",
        ],
      },
    ],
    privacyProvidersTitle: "Provedores externos e referencias",
    privacyProvidersIntro:
      "Estes provedores ou referencias son relevantes para o funcionamento e medición da web:",
    privacyProviders: [
      {
        name: "Vercel",
        description: "Infraestrutura de hosting e despregamento.",
        href: "https://vercel.com/legal/privacy-policy",
        linkLabel: "Política de privacidade",
        target: "vercel_privacy",
      },
      {
        name: "Cloudflare",
        description: "CDN, seguridade, caché e entrega de tráfico.",
        href: "https://www.cloudflare.com/privacypolicy/",
        linkLabel: "Política de privacidade",
        target: "cloudflare_privacy",
      },
      {
        name: "Umami",
        description:
          "Software de analítica self-hosted usado en analytics.pablopl.dev; enlázase como documentación/referencia do software, non como encargado cloud desta web.",
        href: "https://umami.is/privacy",
        linkLabel: "Privacidade de Umami",
        target: "umami_privacy",
      },
      {
        name: "Documentación de Umami",
        description:
          "Documentación sobre funcións de tracking e payloads de analítica recollidos.",
        href: "https://umami.is/docs/tracker-functions",
        linkLabel: "Docs de tracking",
        target: "umami_docs",
      },
      {
        name: "Ahrefs",
        description: "Analítica externa de tráfico e rendemento da web.",
        href: "https://ahrefs.com/legal/privacy-policy",
        linkLabel: "Política de privacidade",
        target: "ahrefs_privacy",
      },
      {
        name: "GitHub",
        description:
          "Aloxamento do repositorio e API pública usada para mostrar o contador de estrelas do repositorio.",
        href: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
        linkLabel: "Declaración de privacidade",
        target: "github_privacy",
      },
    ],
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
    emailSubject:
      "Solicitude de retirada por dereitos de autor - {subjectName}",
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
