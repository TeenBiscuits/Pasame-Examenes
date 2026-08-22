import type { Translations } from "./en";

export const es: Translations = {
	home: {
		title: "Pásame Exámenes",
		subtitle:
			"Plataforma de código abierto para practicar preguntas de exámenes de la FIC. Elige una asignatura para estudiar por tema o en modo cronometrado.",
		addSubject: "¿Añadir asignatura?",
		recentlyVisited: "Visitadas recientemente",
		clearRecent: "Limpiar asignaturas recientes",
		quote: "Los exámenes no se repiten, pero riman",
		faqTitle: "Preguntas frecuentes",
		faqs: [
			{
				question: "¿Qué encontrarás en Pásame Exámenes?",
				answer:
					"Pásame Exámenes es una plataforma de código abierto para practicar preguntas de las asignaturas de los grados de la Facultade de Informática da Coruña (FIC), organizadas por temas y sesiones cronometradas.",
			},
			{
				question: "¿Cómo empiezo a practicar una asignatura?",
				answer:
					"Abre la tarjeta de una asignatura y elige un tema, una práctica o un examen desde su página.",
			},
			{
				question: "¿Practicar por tema o hacer un examen?",
				answer:
					"La práctica por tema se centra en un bloque concreto. El modo examen y la práctica cronometrada simulan una sesión completa con tiempo limitado.",
			},
			{
				question: "¿Qué formatos de preguntas puedo practicar?",
				answer:
					"Puedes practicar preguntas tipo test, de texto, de emparejamiento, de rellenar huecos y con varias partes. Las de test y emparejamiento se corrigen automáticamente; las preguntas abiertas se autoevalúan con ayuda de la respuesta modelo.",
			},
			{
				question: "¿Para qué sirven las respuestas modelo?",
				answer:
					"Son soluciones de referencia que te ayudan a revisar y valorar tus respuestas. Proceden de materiales originales o de las aportaciones de personas colaboradoras.",
			},
			{
				question: "¿Dónde se guarda mi progreso?",
				answer:
					"La web guarda el progreso, los intentos, las preferencias y las asignaturas visitadas en el almacenamiento local de tu navegador. No necesitas una cuenta, pero los datos no se sincronizan entre dispositivos y desaparecen al borrar los datos de este sitio.",
			},
			{
				question: "¿Por qué se repiten algunas preguntas?",
				answer:
					"Una pregunta puede repetirse o parecerse mucho a otra de distintas convocatorias o recopilatorios. La aplicación marca estas coincidencias para que sepas cuánto del temario estás cubriendo. Intentamos detectarlas con precisión, aunque alguna puede pasar desapercibida.",
			},
			{
				question: "¿Cuál es el origen de las preguntas y los documentos?",
				answer:
					"La página de cada asignatura indica sus fuentes. Algunas usan exámenes autorizados y otras recopilatorios o materiales comunitarios. Si hay un PDF o material original, lo enlazamos desde la página correspondiente con su información de licencia. Las preguntas se extraen automáticamente, por lo que pueden contener errores. Si encuentras uno, repórtalo para que podamos corregirlo.",
			},
			{
				question: "¿Hasta qué punto son fiables las respuestas?",
				answer:
					"Revisamos y corregimos las respuestas de forma continua. Si detectas un error, repórtalo desde la pregunta para que podamos solucionarlo. A diferencia de los tests de Daypo o de los recopilatorios subidos a Wuolah, aquí los errores se pueden corregir. Ya hemos revisado muchas respuestas de recopilatorios conocidos. La ley de Linus resume la idea: con suficientes personas revisando, los errores acaban por aparecer.",
			},
			{
				question: "¿Quién está detrás del proyecto?",
				answer:
					"Soy Pablo Portas López y mantengo el proyecto con la ayuda de todas las personas que quieren colaborar. Creé esta web para ofrecer una forma más actual, transparente, sin anuncios y de código abierto de preparar los exámenes. Espero que te resulte útil.",
			},
		],
	},
	subjectHome: {
		notFound: "Asignatura no encontrada",
		returnHome: "Volver al inicio",
		description:
			"Practica {count} preguntas{repeated} de {exams} exámenes con respuestas modelo y autocorrección.",
		communityDescription:
			"Practica {count} preguntas{repeated} de {exams} recopilatorios con respuestas modelo y autocorrección.",
		questionSources: "Fuentes de las preguntas",
		questionSourcesDescription:
			"Elige de qué exámenes o recopilatorios salen las preguntas de tus temas. Puedes cambiarlo cuando quieras.",
		selectedSources: "{selected} de {total} fuentes seleccionadas",
		selectAllSources: "Seleccionar todas",
		practiceByTopic: "Temas",
		resetTopicProgress: "Restablecer progreso de los temas",
		resetTopicProgressConfirm:
			"¿Restablecer todo el progreso de los temas de esta asignatura? Esta acción no se puede deshacer.",
		resetTopicProgressCancel: "Cancelar",
		resetTopicProgressAction: "Restablecer progreso",
		examSimulations: "Exámenes",
		practiceSimulations: "Recopilatorios",
		originalExams: "Documentos originales de examen",
		examDocsDescription:
			"Descarga o visualiza los PDFs originales en los que se basan estas preguntas y simulaciones.",
		sourceMaterials: "Materiales fuente",
		sourceMaterialsDescription:
			"Abre los materiales autorizados o públicos usados como fuente para estas preguntas de práctica.",
		originalContent: "Enlace al contenido original",
		originalContentDescription:
			"Abre el contenido original usado como fuente para estas preguntas de práctica.",
		original: "Original",
		pdf: "PDF",
		acknowledgments: "Agradecimientos y exención de responsabilidad",
		legalInformation: "Información legal de la asignatura",
		contentLicense: "Licencia del contenido",
		addExam: "¿Añadir?",
		reportCopyright: "Reportar",
		copyrightRemoved: "Retirada por derechos de autor",
		repeatedSuffix: "{count} repetidas a lo largo de los años",
	},
	practiceHome: {
		title: "Practicar por tema",
		subtitle:
			"Elige un tema para practicar. Las preguntas de test y de emparejar se autocorrigen; las de texto y rellenar huecos se autoevalúan.",
	},
	header: {
		home: "Inicio",
		practice: "Practicar",
		star: "Estrella",
		starOnGithub: "Dar una estrella en GitHub",
		skipToContent: "Ir al contenido principal",
	},
	settings: {
		title: "Ajustes",
		open: "Abrir ajustes",
		close: "Cerrar ajustes",
		language: "Idioma",
		theme: "Tema",
		volume: "Volumen de los sonidos",
		volumeDescription:
			"Ajusta el volumen de los sonidos de interacción de la interfaz.",
		version: "Versión de la app",
		mute: "Silenciar sonidos",
		unmute: "Activar sonidos",
	},
	appUpdate: {
		message: "Actualizado a la última versión {version}",
		dismiss: "Cerrar aviso de actualización",
	},
	theme: {
		system: "🖥️ Sistema",
		light: "☀️ Claro",
		dark: "🌙 Oscuro",
		princess: "👑 Princesa",
		latte: "🌻 Latte",
		frappe: "🪴 Frappé",
		macchiato: "🌺 Macchiato",
		mocha: "🌿 Mocha",
	},
	footer: {
		github: "GitHub",
		by: "por",
		contentIsLicensedUnder: "El contenido está licenciado bajo",
		licenses: "Licencias",
		privacy: "Política de privacidad",
		close: "Cerrar",
		licenseTitle: "Licencias",
		licenseIntro:
			"Pásame Exámenes separa la licencia del software de la web de la licencia del contenido publicado en ella.",
		contentLicenseTitle: "Contenido: CC BY-SA 4.0 por defecto",
		contentLicenseDescription:
			"Las preguntas, imágenes y documentos originales de examen usan CC BY-SA 4.0 salvo que la página de la asignatura indique otra licencia.",
		softwareLicenseTitle: "Software: Apache 2.0",
		softwareLicenseDescription:
			"El código fuente, la configuración y la documentación de la plataforma están licenciados bajo Apache License, Version 2.0.",
		license: "Licencia",
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
					"Preferencias locales: idioma seleccionado, tema seleccionado, volumen de los sonidos de la interfaz, fuentes de preguntas seleccionadas, tours vistos, estado del popup de GitHub y asignaturas visitadas recientemente.",
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
		backToTopics: "Volver a temas",
		noQuestions: "No se encontraron preguntas para este tema.",
		backToHome: "Volver al inicio",
		score: "Puntuación",
		points: "puntos",
		pointsTotal: "puntos en total",
		allCorrect:
			"Revisa tus respuestas. Verde = correctas. Solo las preguntas de test y de emparejar se autocorrigen; las de texto y rellenar huecos se autoevalúan.",
		previous: "Anterior",
		next: "Siguiente",
		clear: "Limpiar",
		check: "Corregir",
		submit: "Enviar y ver soluciones",
		runningScore: "Puntuación parcial",
		checked: "corregidas",
		openEnded: "preguntas abiertas",
		selfGradeHint:
			"Autoevalúa tus respuestas de texto y de rellenar huecos para ver tu puntuación final.",
		allSelfGraded: "Todas las respuestas autoevaluadas",
	},
	exam: {
		backToSubject: "Volver a la asignatura",
		exitConfirm: "¿Estás seguro de que quieres salir? Tu progreso se perderá.",
		exitModalTitle: "¿Salir del examen?",
		exitModalCancel: "Continuar examen",
		exitModalConfirm: "Salir del examen",
		noQuestions: "No se encontraron preguntas para este examen.",
		backToHome: "Volver al inicio",
		questions: "Preguntas",
		totalPoints: "Puntos totales",
		pass: "Aprobado",
		timeLimit: "Tiempo límite",
		minutes: "minutos",
		startExam: "Comenzar examen",
		simulationNote:
			"Esta simulación refleja el formato real del examen. Para las preguntas abiertas y de rellenar huecos, autoevalúa tus respuestas con las soluciones modelo que se muestran tras enviar. Las preguntas de test y emparejar se autocorrigen.",
		simulationScoringNote:
			"En algunos exámenes reales fallar una pregunta resta puntos; en esta simulación no se tiene en cuenta esto.",
		practiceNote:
			"Esta práctica cronometrada usa una estructura orientativa para estudiar. Para las preguntas abiertas y de rellenar huecos, autoevalúa tus respuestas con las soluciones modelo que se muestran tras enviar. Las preguntas de test y emparejar se autocorrigen.",
		practiceScoringNote:
			"En algunos exámenes reales fallar una pregunta resta puntos; en esta práctica no se tiene en cuenta esto.",
		submitted: "Examen enviado.",
		passThreshold: "Umbral de aprobado",
		reviewNote:
			"Revisa tus respuestas. Las preguntas abiertas y de rellenar huecos muestran las soluciones modelo para autoevaluación.",
		selfGradeHint:
			"Autoevalúa tus respuestas de texto y de rellenar huecos para ver tu puntuación final.",
		submitExam: "Entregar examen",
		submitConfirm:
			"¿Estás seguro de que quieres entregar el examen? No podrás modificar tus respuestas.",
		submitModalTitle: "Entregar examen",
		submitModalBody:
			"¿Estás seguro de que quieres entregar el examen? No podrás modificar tus respuestas.",
		submitModalCancel: "Cancelar",
		submitModalConfirm: "Entregar",
		timeUpModalTitle: "Tiempo agotado",
		timeUpModalBody:
			"Se ha agotado el tiempo. El examen se entregará automáticamente.",
		timeUpModalAcknowledge: "Entendido",
		score: "Puntuación",
		outOf: "/",
		pass_: "(APROBADO)",
		fail: "(SUSPENSO)",
		total: "total",
		previous: "Anterior",
		next: "Siguiente",
		questionSummary: "{questions} preguntas · {points} puntos",
	},
	questionCard: {
		modelSolution: "Solución modelo",
		solutionIllustration: "Ilustración de la solución",
		gradeAnswer: "Evalúa tu respuesta:",
		correct: "Correcta",
		incorrect: "Incorrecta",
		openSolution: "Mostrar solución",
		openAndSelfGrade: "Mostrar solución y autoevaluarse",
		closeSolution: "Ocultar solución",
		development: "Desarrollo",
		openDevelopment: "Ver desarrollo",
		closeDevelopment: "Ocultar desarrollo",
		yourAnswer: "Tu respuesta",
		typeAnswer: "Escribe tu respuesta…",
		matchItemTo: "Relacionar {item} con {letter}",
		questionPrefix: "P",
		pointsShort: "p",
		correct_: "Correcto",
		reportIssue: "Reportar error",
		reportIssueTitle: "Corregir pregunta",
		questionTypes: {
			mc: "Tipo test (mc)",
			text: "Texto abierto (text)",
			"multiple-text": "Texto abierto con apartados (multiple-text)",
			matching: "Emparejar (matching)",
			fill: "Rellenar huecos (fill)",
			"table-fill": "Rellenar tabla (table-fill)",
		},
		repeated: "Repetida",
	},
	subjectCard: {
		topics: "temas",
		questions: "preguntas",
		points: "puntos",
		exams: "exámenes",
		practiceSets: "recopilatorios",
		course: "{course}º curso",
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
		email: "Reportar",
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
		sparkleButton: "Haz brillar la estrella",
		starButton: "¡Dame una estrella!",
		dismiss: "Ahora no",
	},
	disclaimer: {
		text: "Las preguntas han sido extraídas de los materiales de referencia por procesos automatizados y podrían contener errores. Si encuentra algún error no dude en",
		reportLink: "Reportar la pregunta",
		postLinkText: ".",
		originalMaterialPrefix: "Puede revisar el",
		originalMaterialLink: "material original",
	},
	seo: {
		siteName: "Pásame Exámenes",
		locale: "es_ES",
		homeTitle: "Practica preguntas de exámenes de la FIC",
		homeDescription:
			"Practica preguntas de exámenes de la FIC por tema o con simulacros cronometrados. Comprueba tus respuestas y consulta soluciones modelo.",
		homeMetaDescription:
			"Practica preguntas de exámenes de la FIC por tema o con simulacros cronometrados. Comprueba tus respuestas y consulta soluciones modelo.",
		socialHomeTitle: "Practica exámenes de la FIC con Pásame Exámenes",
		socialHomeDescription:
			"Encuentra preguntas por tema y simulacros cronometrados para preparar tus asignaturas. Comprueba tus respuestas y consulta soluciones modelo.",
		defaultDescription:
			"Practica preguntas de exámenes de la FIC con autocorrección y soluciones modelo. Elige un tema o un simulacro y empieza a estudiar.",
		subjectAuthorizedTitle: "{subjectName}: preguntas de examen resueltas",
		subjectCommunityTitle: "{subjectName}: preguntas y recopilatorios",
		subjectAuthorizedDescription:
			"Practica {count}preguntas de {subjectName} de {examCount} exámenes. Comprueba tus respuestas y consulta soluciones modelo. {degree}, {course}º curso.",
		subjectCommunityDescription:
			"Practica {count}preguntas de {subjectName} de {examCount} recopilatorios. Comprueba tus respuestas y consulta soluciones modelo. {degree}, {course}º curso.",
		socialSubjectAuthorizedTitle:
			"Practica {subjectName}: exámenes y preguntas resueltas",
		socialSubjectCommunityTitle:
			"Practica {subjectName}: recopilatorios y preguntas resueltas",
		socialSubjectAuthorizedDescription:
			"Practica {count}preguntas de {subjectName} de {examCount} exámenes. Comprueba tus respuestas y consulta soluciones modelo.",
		socialSubjectCommunityDescription:
			"Practica {count}preguntas de {subjectName} de {examCount} recopilatorios. Comprueba tus respuestas y consulta soluciones modelo.",
		topicAuthorizedTitle: "{topicName}: preguntas de {subjectName}",
		topicCommunityTitle: "{topicName}: preguntas de {subjectName}",
		topicAuthorizedDescription:
			"Practica {count}preguntas de {topicName} de exámenes de {subjectName}, con respuestas modelo y autocorrección. {courseCode}, {degree}, {course}º curso.",
		topicCommunityDescription:
			"Practica {count}preguntas de {topicName} de recopilatorios de {subjectName}, con respuestas modelo y autocorrección. {courseCode}, {degree}, {course}º curso.",
		examAuthorizedTitle: "{examName} de {subjectName}: simulador",
		examPracticeTitle: "{examName} de {subjectName}: práctica cronometrada",
		examAuthorizedDescription:
			"Simula el examen {examName} de {subjectName}{questionCount}. {totalPoints} puntos, {durationMinutes} minutos, respuestas modelo y autocorrección.",
		examPracticeDescription:
			"Practica el recopilatorio cronometrado {examName} de {subjectName}{questionCount}. {totalPoints} puntos, {durationMinutes} minutos, respuestas modelo y autocorrección.",
		questionCountSuffix: " con {count} preguntas",
	},
};
