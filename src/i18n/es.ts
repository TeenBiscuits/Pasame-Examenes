import type { Translations } from "./en";

export const es: Translations = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      "Plataforma de código abierto para practicar preguntas universitarias. Elige una asignatura para estudiar por tema o en modo cronometrado.",
    addSubject: "¿Añadir asignatura?",
    recentlyVisited: "Visitadas recientemente",
    clearRecent: "Limpiar asignaturas recientes",
  },
  subjectHome: {
    notFound: "Asignatura no encontrada",
    returnHome: "Volver al inicio",
    description:
      "Practica {count} preguntas{repeated} de {exams} exámenes con respuestas modelo y autocorrección.",
    communityDescription:
      "Practica {count} preguntas{repeated} de {exams} recopilatorios con respuestas modelo y autocorrección.",
    practiceByTopic: "Practicar por tema",
    examSimulations: "Exámenes",
    practiceSimulations: "Recopilatorios",
    originalExams: "Documentos originales de examen",
    examDocsDescription:
      "Descarga o visualiza los PDFs originales en los que se basan estas preguntas y simulaciones.",
    sourceMaterials: "Materiales fuente",
    sourceMaterialsDescription:
      "Abre los materiales autorizados o públicos usados como fuente para estas preguntas de práctica.",
    originalDaypos: "Tests Daypo originales",
    daypoDocsDescription:
      "Abre los tests Daypo originales usados como fuente para estas preguntas de práctica.",
    daypo: "Daypo",
    pdf: "PDF",
    acknowledgments: "Agradecimientos y exención de responsabilidad",
    contentLicense: "Licencia específica del contenido",
    addExam: "¿Añadir?",
    reportCopyright: "Reportar derechos de autor",
    copyrightRemoved: "Retirada por derechos de autor",
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
    github: "GitHub",
    by: "por",
    isLicensedUnder: "está licenciado bajo",
    licenses: "Licencias",
    privacy: "Política de privacidad",
    close: "Cerrar",
    licenseTitle: "Licencias",
    licenseIntro:
      "Pásame Exámenes separa la licencia del software de la web de la licencia del contenido publicado en ella.",
    contentLicenseTitle: "Contenido: CC BY-NC-SA 4.0",
    contentLicenseDescription:
      "Salvo que la página de una asignatura indique otra cosa, el contenido subido a esta web está licenciado bajo CC BY-NC-SA 4.0.",
    softwareLicenseTitle: "Software: Apache 2.0",
    softwareLicenseDescription:
      "El código fuente de la plataforma está licenciado bajo Apache License, Version 2.0.",
    licensePage: "Página de la licencia",
    legalText: "Texto legal",
    linksLabel: "Enlaces legales y del proyecto",
    privacyTitle: "Política de privacidad",
    privacyLastUpdated: "Última actualización: 8 de julio de 2026",
    privacySummary:
      "Pásame Exámenes es una web educativa y de código abierto, sin cuentas de usuario y sin backend propio. Usa almacenamiento local del navegador para preferencias y progreso de estudio, y analítica para entender uso, rendimiento y errores.",
    privacySections: [
      {
        title: "Responsable",
        paragraphs: [
          "El responsable del tratamiento de esta web es Pablo Portas López. Puedes contactar con el responsable sobre cuestiones de privacidad en pablo.portas@udc.es.",
        ],
      },
      {
        title: "Datos que tratamos",
        paragraphs: [
          "La web puede tratar datos técnicos de acceso, datos locales de preferencias, progreso local de estudio y datos de analítica.",
        ],
        items: [
          "Datos técnicos: dirección IP, navegador, dispositivo, URL solicitada, referrer, idioma, fecha y hora, y registros similares de servidor o CDN.",
          "Preferencias locales: idioma seleccionado, tema seleccionado, tours vistos, estado del popup de GitHub y asignaturas visitadas recientemente.",
          "Progreso de estudio almacenado localmente: intentos, puntuaciones, temas y progreso por asignatura guardados en tu navegador.",
          "Datos de analítica: páginas vistas, eventos de interacción, rendimiento, información aproximada de dispositivo/navegador y un identificador anónimo local para Umami.",
          "Replays de sesión y heatmaps en la instancia self-hosted de Umami, activados con un muestreo aleatorio del 30%.",
          "Caché temporal del contador de estrellas de GitHub en sessionStorage tras solicitar datos públicos del repositorio a GitHub.",
        ],
      },
      {
        title: "Finalidades",
        paragraphs: [
          "Los datos se tratan únicamente para finalidades relacionadas con operar, proteger, medir y mejorar la web.",
        ],
        items: [
          "Prestar la web y enrutar solicitudes mediante infraestructura de hosting y CDN.",
          "Recordar tu idioma, tema, asignaturas recientes, tours y avisos descartados.",
          "Guardar progreso de estudio localmente para que puedas continuar practicando en el mismo dispositivo.",
          "Medir uso, rendimiento, errores, patrones de navegación e interacciones con funciones.",
          "Mejorar contenido, usabilidad, accesibilidad y fiabilidad.",
          "Prevenir abuso, diagnosticar problemas técnicos y mantener la seguridad.",
        ],
      },
      {
        title: "Base jurídica",
        paragraphs: [
          "Bajo el RGPD, la base jurídica principal es el interés legítimo: mantener la web disponible, segura, comprensible y útil para estudiantes. Esto incluye analítica, medición de rendimiento, heatmaps y replays de sesión, limitados mediante minimización de datos y un muestreo aleatorio del 30% para replays y heatmaps.",
          "Las preferencias y el progreso local se tratan para proporcionar la funcionalidad solicitada por la persona usuaria. También pueden aplicarse obligaciones legales cuando sea necesario.",
        ],
      },
      {
        title: "Almacenamiento local",
        paragraphs: [
          "La mayoría de datos relacionados con el estudio se almacenan solo en tu navegador mediante localStorage o sessionStorage. No forman parte de una cuenta de usuario y pueden eliminarse borrando los datos de este sitio en la configuración del navegador.",
          "El identificador anónimo de Umami también se guarda localmente como umami_uid. Al borrar los datos locales de este sitio se reinicia ese identificador y se eliminan preferencias y progreso guardados localmente.",
        ],
      },
      {
        title: "Analítica, replays y heatmaps",
        paragraphs: [
          "La analítica se recoge con una instancia self-hosted de Umami en analytics.pablopl.dev. Umami es operado por el responsable de esta web; los datos no se envían a Umami Software como proveedor cloud de analítica.",
          "Umami está configurado para respetar Do Not Track en el script estándar de analítica. Los replays de sesión y heatmaps se usan para entender problemas de usabilidad y se muestrean aleatoriamente en el 30% de las visitas.",
          "También se usa Ahrefs Analytics para entender tráfico y rendimiento de la web. Ahrefs trata datos conforme a su propia política de privacidad.",
        ],
      },
      {
        title: "Conservación",
        paragraphs: [
          "Los datos locales del navegador se conservan hasta que los elimines o hasta que el navegador los borre. Los datos técnicos y de analítica se conservan durante el tiempo necesario para obtener estadísticas, mejorar el servicio, diagnosticar incidencias y mantener la seguridad. Los datos agregados o anonimizados pueden conservarse durante más tiempo cuando ya no identifican a una persona usuaria.",
        ],
      },
      {
        title: "Transferencias internacionales",
        paragraphs: [
          "Algunos proveedores externos pueden tratar datos fuera del Espacio Económico Europeo. Cuando ocurra, se realizará conforme a las garantías descritas en la política de privacidad o condiciones de tratamiento de cada proveedor. La configuración self-hosted de Umami no implica transferencia de datos de analítica a Umami Software.",
        ],
      },
      {
        title: "Tus derechos RGPD",
        paragraphs: [
          "Puedes solicitar acceso, rectificación, supresión, limitación, portabilidad u oposición al tratamiento cuando proceda. También puedes presentar una reclamación ante una autoridad de protección de datos.",
          "Para ejercer tus derechos, escribe a pablo.portas@udc.es. Como no hay cuentas, algunos datos pueden existir solo en tu navegador y puedes eliminarlos directamente borrando los datos locales de este sitio.",
        ],
      },
      {
        title: "Cambios",
        paragraphs: [
          "Esta política puede actualizarse si la web cambia sus tratamientos de datos, configuración de analítica o proveedores. La versión más reciente está disponible desde el pie de página de la web.",
        ],
      },
    ],
    privacyProvidersTitle: "Proveedores externos y referencias",
    privacyProvidersIntro:
      "Estos proveedores o referencias son relevantes para el funcionamiento y medición de la web:",
    privacyProviders: [
      {
        name: "Vercel",
        description: "Infraestructura de hosting y despliegue.",
        href: "https://vercel.com/legal/privacy-policy",
        linkLabel: "Política de privacidad",
        target: "vercel_privacy",
      },
      {
        name: "Cloudflare",
        description: "CDN, seguridad, caché y entrega de tráfico.",
        href: "https://www.cloudflare.com/privacypolicy/",
        linkLabel: "Política de privacidad",
        target: "cloudflare_privacy",
      },
      {
        name: "Umami",
        description:
          "Software de analítica self-hosted usado en analytics.pablopl.dev; se enlaza como documentación/referencia del software, no como encargado cloud de esta web.",
        href: "https://umami.is/privacy",
        linkLabel: "Privacidad de Umami",
        target: "umami_privacy",
      },
      {
        name: "Documentación de Umami",
        description:
          "Documentación sobre funciones de tracking y payloads de analítica recogidos.",
        href: "https://umami.is/docs/tracker-functions",
        linkLabel: "Docs de tracking",
        target: "umami_docs",
      },
      {
        name: "Ahrefs",
        description: "Analítica externa de tráfico y rendimiento de la web.",
        href: "https://ahrefs.com/legal/privacy-policy",
        linkLabel: "Política de privacidad",
        target: "ahrefs_privacy",
      },
      {
        name: "GitHub",
        description:
          "Alojamiento del repositorio y API pública usada para mostrar el contador de estrellas del repositorio.",
        href: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
        linkLabel: "Declaración de privacidad",
        target: "github_privacy",
      },
    ],
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
    practiceNote:
      "Esta práctica cronometrada usa una estructura orientativa para estudiar. Para las preguntas abiertas, autoevalúa tus respuestas con las soluciones modelo que se muestran tras enviar. Las preguntas de test y emparejar se autocorrigen.",
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
    practiceSets: "recopilatorios",
  },
  contentPolicy: {
    authorized: "Materiales de examen verificados",
    community: "Materiales de práctica de la comunidad",
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
    title: "Añadir material de práctica",
    close: "Cerrar",
    openIssue: "Abrir un issue",
    openIssueDesc:
      "Propón un examen autorizado, recopilatorio o ejercicios originales usando la plantilla de GitHub",
    openIssueUrl:
      "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=add-exam.yml",
    contribute: "¡Contribuye!",
    contributeDesc:
      "Sigue la guía de contribución para añadir contenido autorizado u original con un pull request",
    email: "Escribe un correo",
    legalNotice:
      "Envía solo contenido original, materiales autorizados o fuentes públicas con permiso para compartirse.",
  },
  copyrightReport: {
    title: "Reportar derechos de autor",
    close: "Cerrar",
    description:
      "Si un examen, prueba, recopilatorio o pregunta debe retirarse por derechos de autor, envía un correo a pablo.portas@udc.es.",
    includeDetails:
      "Incluye la asignatura, el examen/año o pregunta afectada y el motivo de la solicitud de retirada.",
    email: "Enviar solicitud de retirada",
    emailSubject: "Solicitud de retirada por derechos de autor - {subjectName}",
    emailBody:
      "Asignatura: {subjectName}\nID de asignatura: {subjectId}\n\nExamen/año o pregunta afectada:\n\nMotivo de la solicitud de retirada:\n",
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
      step1Title: "Simulación de prueba",
      step1Desc:
        "Esto simula el formato real del examen. ¡El temporizador está en marcha, gestiona bien tu tiempo! El umbral de aprobado se muestra aquí.",
      practiceStep1Desc:
        "Esto es una práctica cronometrada con estructura orientativa. ¡El temporizador está en marcha, gestiona bien tu tiempo! El umbral de aprobado se muestra aquí.",
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
  starPopup: {
    title: "¿Nos darías una estrella?",
    subtitle: "No queremos tu dinero, solo una estrella en GitHub.",
    starButton: "¡Dame una estrella!",
    dismiss: "Ahora no",
  },
  disclaimer: {
    text: "Las preguntas han sido extraídas de los materiales de referencia por procesos automatizados y podrían contener errores. Si encuentra algún error no dude en",
    reportLink: "Reportar la pregunta",
    postLinkText:
      ". En algunos casos puede revisar el material original directamente desde la web.",
  },
  seo: {
    siteName: "Pásame Exámenes",
    locale: "es_ES",
    homeDescription:
      "Plataforma de código abierto para practicar preguntas universitarias por tema o en modo cronometrado.",
    defaultDescription:
      "Practica preguntas universitarias con respuestas modelo y autocorrección. Preguntas tipo test, de desarrollo y de emparejar.",
  },
};
