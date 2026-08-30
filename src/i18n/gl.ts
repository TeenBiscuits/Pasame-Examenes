import type { Translations } from "./en";

export const gl: Translations = {
	home: {
		title: "Pásame Exámenes",
		subtitle:
			"Plataforma de código aberto para practicar preguntas de exames da FIC. Elixe unha materia para estudar por tema ou en modo cronometrado.",
		addSubject: "Engadir materia?",
		recentlyVisited: "Visitadas recentemente",
		clearRecent: "Limpar materias recentes",
		quote: "Os exames non se repiten, pero riman.",
		faqTitle: "Preguntas frecuentes",
		faqs: [
			{
				question: "Que podes atopar en Pásame Exámenes?",
				answer:
					"Pásame Exámenes é unha plataforma de código aberto para practicar preguntas das materias dos graos da Facultade de Informática da Coruña (FIC), organizadas por temas e sesións cronometradas.",
			},
			{
				question: "Como comezo a practicar unha materia?",
				answer:
					"Abre a tarxeta dunha materia e escolle un tema, unha práctica ou un exame desde a súa páxina.",
			},
			{
				question:
					"Que diferenza hai entre practicar por tema e facer un exame?",
				answer:
					"A práctica por tema céntrase nun bloque concreto. O modo exame e a práctica cronometrada simulan unha sesión completa cun tempo limitado.",
			},
			{
				question: "Que formatos de preguntas podo practicar?",
				answer:
					"Podes practicar preguntas tipo test, de texto, de emparellamento, de encher ocos e con varias partes. As de test e emparellamento corríxense automaticamente; as preguntas abertas autoavalíanse coa axuda da resposta modelo.",
			},
			{
				question: "Para que serven as respostas modelo?",
				answer:
					"Son solucións de referencia que che axudan a revisar e valorar as túas respostas. Proceden de materiais orixinais ou das achegas das persoas colaboradoras.",
			},
			{
				question: "Onde se garda o meu progreso?",
				answer:
					"A web garda o progreso, os intentos, as preferencias e as materias visitadas no almacenamento local do teu navegador. Non necesitas unha conta, pero os datos non se sincronizan entre dispositivos e desaparecen ao borrar os datos deste sitio.",
			},
			{
				question: "Por que se repiten algunhas preguntas?",
				answer:
					"Unha pregunta pode repetirse ou parecerse moito a outra de distintas convocatorias ou recompilacións. A aplicación marca estas coincidencias para que saibas canto do temario estás cubrindo. Tentamos detectalas con precisión, aínda que algunha pode pasar desapercibida.",
			},
			{
				question: "Cal é a orixe das preguntas e dos documentos?",
				answer:
					"A páxina de cada materia indica as súas fontes. Algunhas usan exames autorizados e outras recompilacións ou materiais comunitarios. Se hai un PDF ou material orixinal, enlazámolo desde a páxina correspondente coa súa información de licenza. As preguntas extráense automaticamente, polo que poden conter erros. Se atopas un, repórtao para que poidamos corrixilo.",
			},
			{
				question: "Que fiabilidade teñen as respostas?",
				answer:
					"Revisamos e corriximos as respostas de forma continua. Se detectas un erro, repórtao desde a pregunta para que poidamos solucionalo. A diferenza dos tests de Daypo ou das recompilacións subidas a Wuolah, aquí os erros pódense corrixir. Xa revisamos moitas respostas de recompilacións coñecidas. A lei de Linus resume a idea: con suficientes persoas revisando, os erros acaban por aparecer.",
			},
			{
				question: "Quen está detrás do proxecto?",
				answer:
					"Son Pablo Portas López e manteño o proxecto coa axuda de todas as persoas que queren colaborar. Creei esta web para ofrecer unha forma máis actual, transparente, sen anuncios e de código aberto de preparar os exames. Espero que che sexa útil.",
			},
		],
	},
	subjectHome: {
		notFound: "Materia non atopada",
		returnHome: "Volver ao inicio",
		description:
			"Practica {count} preguntas{repeated} de {exams} exames con respostas modelo e autocorrección.",
		communityDescription:
			"Practica {count} preguntas{repeated} de {exams} recompilacións con respostas modelo e autocorrección.",
		questionSources: "Fontes das preguntas",
		questionSourcesDescription:
			"Elixe de que exames ou recompilacións saen as preguntas dos teus temas. Podes cambialo cando queiras.",
		selectedSources: "{selected} de {total} fontes seleccionadas",
		selectAllSources: "Seleccionar todas",
		practiceByTopic: "Temas",
		resetTopicProgress: "Restablecer o progreso dos temas",
		resetTopicProgressConfirm:
			"Restablecer todo o progreso dos temas desta materia? Esta acción non se pode desfacer.",
		resetTopicProgressCancel: "Cancelar",
		resetTopicProgressAction: "Restablecer o progreso",
		examSimulations: "Exames",
		practiceSimulations: "Recompilacións",
		originalExams: "Documentos orixinais de exame",
		examDocsDescription:
			"Descarga ou visualiza os PDFs orixinais nos que se basean estas preguntas e simulacións.",
		sourceMaterials: "Materiais fonte",
		sourceMaterialsDescription:
			"Abre os materiais autorizados ou públicos usados como fonte para estas preguntas de práctica.",
		originalContent: "Ligazón ao contido orixinal",
		originalContentDescription:
			"Abre o contido orixinal usado como fonte para estas preguntas de práctica.",
		original: "Orixinal",
		pdf: "PDF",
		acknowledgments: "Agradecementos e exención de responsabilidade",
		legalInformation: "Información legal da materia",
		contentLicense: "Licenza do contido",
		addExam: "Engadir?",
		reportCopyright: "Reportar",
		copyrightRemoved: "Retirada por dereitos de autor",
		repeatedSuffix: "{count} repetidas ao longo dos anos",
	},
	practiceHome: {
		title: "Practicar por tema",
		subtitle:
			"Elixe un tema para practicar. As preguntas de test e de emparellar autocorríxense; as de texto e encher ocos autoavalíanse.",
	},
	header: {
		home: "Inicio",
		practice: "Practicar",
		star: "Estrela",
		starOnGithub: "Dar unha estrela en GitHub",
		skipToContent: "Ir ao contido principal",
	},
	settings: {
		title: "Axustes",
		open: "Abrir axustes",
		close: "Pechar axustes",
		general: "Xeral",
		generalDescription: "Idioma e son.",
		appearance: "Aparencia",
		appearanceDescription: "Escolle como se ve a aplicación.",
		menuNavigation: "Seccións de axustes",
		language: "Idioma",
		theme: "Aparencia",
		colorScheme: "Esquema de cores",
		colorSchemeOptions: {
			system: "Sistema",
			light: "Claro",
			dark: "Escuro",
		},
		themes: "Paletas de cores",
		themesDescription: "Escolle unha paleta para cada esquema de cores.",
		lightTheme: "Paleta clara",
		darkTheme: "Paleta escura",
		volume: "Volume dos sons",
		volumeDescription: "Axusta o volume dos sons de interacción da interface.",
		version: "Versión da app",
		openRepository: "Abrir o repositorio en GitHub",
		addTheme: "Engadir paleta",
		mute: "Silenciar os sons",
		unmute: "Activar os sons",
		keyboardShortcuts: "Atallos de teclado",
		keyboardShortcutsDescription:
			"Personaliza os comandos de cada parte da aplicación. Os cambios gárdanse neste navegador.",
		resetShortcuts: "Restablecer todos",
		resetShortcut: "Restablecer este atallo",
		heldKeys: "Premidas",
		pressKeys: "Preme as teclas…",
		recording: "Gravando…",
		editShortcut: "Editar atallo",
		shortcutUnassigned: "Sen asignar",
		saveShortcut: "Gardar",
		cancelShortcut: "Cancelar",
		shortcutConflict: "Este atallo entra en conflito con outro comando.",
		shortcutConflictDescription:
			" Usa outra combinación para que cada atallo teña un único destino.",
		shortcutHint: "Combinación de teclas",
		sequenceHint: "Secuencia · preme varias teclas",
		shortcutScopes: {
			global: "En toda a aplicación",
			practiceExam: "Tema e exame",
		},
		shortcutCommands: {
			"open-settings": "Abrir axustes",
			"go-home": "Ir ao inicio",
			"cycle-theme": "Cambiar a aparencia",
			"previous-question": "Pregunta anterior",
			"next-question": "Pregunta seguinte",
			"first-question": "Ir á primeira pregunta",
			"last-question": "Ir á última pregunta",
			"check-question": "Comprobar a pregunta",
			"clear-answer": "Borrar a resposta",
			"submit-session": "Enviar a práctica / entregar o exame",
			"start-exam": "Comezar o exame",
			"answer-a": "Elixir a opción A",
			"answer-b": "Elixir a opción B",
			"answer-c": "Elixir a opción C",
			"answer-d": "Elixir a opción D",
			"answer-e": "Elixir a opción E",
		},
	},
	appUpdate: {
		message: "Actualizado á última versión {version}",
		dismiss: "Pechar o aviso de actualización",
	},
	theme: {
		system: "🖥️ Sistema",
		light: "☀️ Sol",
		dark: "🌙 Lúa",
		princess: "👑 Princesa",
		latte: "🌻 Latte",
		frappe: "🪴 Frappé",
		macchiato: "🌺 Macchiato",
		mocha: "🌿 Mocha",
	},
	footer: {
		github: "GitHub",
		by: "por",
		contentIsLicensedUnder: "O contido está licenciado baixo",
		licenses: "Licenzas",
		privacy: "Política de privacidade",
		close: "Pechar",
		licenseTitle: "Licenzas",
		licenseIntro:
			"Pásame Exámenes separa a licenza do software da web da licenza do contido publicado nela.",
		contentLicenseTitle: "Contido: CC BY-SA 4.0 por defecto",
		contentLicenseDescription:
			"As preguntas, imaxes e documentos orixinais de exame usan CC BY-SA 4.0 salvo que a páxina da materia indique outra licenza.",
		softwareLicenseTitle: "Software: Apache 2.0",
		softwareLicenseDescription:
			"O código fonte, a configuración e a documentación da plataforma están licenciados baixo Apache License, Version 2.0.",
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
					"Preferencias locais: idioma seleccionado, aparencia seleccionada, volume dos sons da interface, fontes de preguntas seleccionadas, tours vistos, estado do popup de GitHub e materias visitadas recentemente.",
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
					"Lembrar o teu idioma, aparencia, materias recentes, tours e avisos descartados.",
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
		backToTopics: "Volver a temas",
		noQuestions: "Non se atoparon preguntas para este tema.",
		loadingQuestions: "Cargando preguntas…",
		loadError: "Non se puideron cargar as preguntas.",
		retry: "Tentar de novo",
		backToHome: "Volver ao inicio",
		score: "Puntuación",
		points: "puntos",
		pointsTotal: "puntos en total",
		allCorrect:
			"Revisa as túas respostas. Verde = correctas. Só as preguntas de test e de emparellar se autocorrigen; as de texto e encher ocos autoavalíanse.",
		previous: "Anterior",
		next: "Seguinte",
		clear: "Limpar",
		check: "Corrixir",
		submit: "Enviar e ver solucións",
		runningScore: "Puntuación parcial",
		checked: "corrixidas",
		openEnded: "preguntas abertas",
		selfGradeHint:
			"Autoavalia as túas respostas de texto e de encher ocos para ver a túa puntuación final.",
		allSelfGraded: "Todas as respostas autoavaliadas",
	},
	exam: {
		backToSubject: "Volver á materia",
		exitConfirm: "Estás seguro de que queres saír? O teu progreso perderase.",
		exitModalTitle: "Saír do exame?",
		exitModalCancel: "Continuar o exame",
		exitModalConfirm: "Saír do exame",
		noQuestions: "Non se atoparon preguntas para este exame.",
		loadingQuestions: "Cargando preguntas…",
		loadError: "Non se puideron cargar as preguntas.",
		retry: "Tentar de novo",
		backToHome: "Volver ao inicio",
		questions: "Preguntas",
		totalPoints: "Puntos totais",
		pass: "Aprobado",
		timeLimit: "Límite de tempo",
		minutes: "minutos",
		startExam: "Comezar exame",
		simulationNote:
			"Esta simulación reflicte o formato real do exame. Para as preguntas abertas e de encher ocos, autoavalia as túas respostas coas solucións modelo que se mostran tras enviar. As preguntas de test e emparellar autocorríxense.",
		simulationScoringNote:
			"Nalgúns exames reais fallar unha pregunta resta puntos; nesta simulación non se ten en conta isto.",
		practiceNote:
			"Esta práctica cronometrada usa unha estrutura orientativa para estudar. Para as preguntas abertas e de encher ocos, autoavalia as túas respostas coas solucións modelo que se mostran tras enviar. As preguntas de test e emparellar autocorríxense.",
		practiceScoringNote:
			"Nalgúns exames reais fallar unha pregunta resta puntos; nesta práctica non se ten en conta isto.",
		submitted: "Exame enviado.",
		passThreshold: "Limiar de aprobado",
		reviewNote:
			"Revisa as túas respostas. As preguntas abertas e de encher ocos mostran as solucións modelo para autoavaliación.",
		selfGradeHint:
			"Autoavalia as túas respostas de texto e de encher ocos para ver a túa puntuación final.",
		submitExam: "Entregar exame",
		submitConfirm:
			"Estás seguro de que queres entregar o exame? Non poderás modificar as túas respostas.",
		submitModalTitle: "Entregar exame",
		submitModalBody:
			"Estás seguro de que queres entregar o exame? Non poderás modificar as túas respostas.",
		submitModalCancel: "Cancelar",
		submitModalConfirm: "Entregar",
		timeUpModalTitle: "Tempo esgotado",
		timeUpModalBody: "Esgotouse o tempo. O exame entregarase automaticamente.",
		timeUpModalAcknowledge: "Entendido",
		score: "Puntuación",
		outOf: "/",
		pass_: "(APROBADO)",
		fail: "(SUSPENSO)",
		total: "total",
		previous: "Anterior",
		next: "Seguinte",
		questionSummary: "{questions} preguntas · {points} puntos",
	},
	questionCard: {
		modelSolution: "Solución modelo",
		solutionIllustration: "Ilustración da solución",
		gradeAnswer: "Avalía a túa resposta:",
		correct: "Correcta",
		incorrect: "Incorrecta",
		openSolution: "Mostrar solución",
		openAndSelfGrade: "Mostrar solución e autoavaliarse",
		closeSolution: "Ocultar solución",
		development: "Desenvolvemento",
		openDevelopment: "Ver desenvolvemento",
		closeDevelopment: "Ocultar desenvolvemento",
		yourAnswer: "A túa resposta",
		typeAnswer: "Escribe a túa resposta…",
		matchItemTo: "Relacionar {item} con {letter}",
		questionPrefix: "P",
		pointsShort: "p",
		correct_: "Correcto",
		reportIssue: "Reportar erro",
		reportIssueTitle: "Corrixir pregunta",
		questionTypes: {
			mc: "Tipo test (mc)",
			text: "Texto aberto (text)",
			"multiple-text": "Texto aberto con apartados (multiple-text)",
			matching: "Emparellar (matching)",
			fill: "Encher ocos (fill)",
			"table-fill": "Encher táboa (table-fill)",
		},
		repeated: "Repetida",
	},
	subjectCard: {
		topics: "temas",
		questions: "preguntas",
		points: "puntos",
		exams: "exames",
		practiceSets: "recompilacións",
		course: "{course}º curso",
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
		email: "Reportar",
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
		sparkleButton: "Fai brillar a estrela",
		starButton: "Dame unha estrela!",
		dismiss: "Agora non",
	},
	disclaimer: {
		text: "As preguntas foron extraídas dos materiais de referencia por procesos automatizados e poderían conter erros. Se atopa algún erro non dubide en",
		reportLink: "Reportar a pregunta",
		postLinkText: ".",
		originalMaterialPrefix: "Pode revisar o",
		originalMaterialLink: "material orixinal",
	},
	seo: {
		siteName: "Pásame Exámenes",
		locale: "gl_ES",
		examSingular: "exame",
		examPlural: "exames",
		compilationSingular: "recompilación",
		compilationPlural: "recompilacións",
		questionSingular: "pregunta",
		questionPlural: "preguntas",
		privacyMetaDescription:
			"Aquí descríbense os tipos de datos que Pásame Exámenes recompila e a forma e o lugar do tratamento destes datos.",
		homeTitle: "Practica preguntas de exames da FIC",
		homeDescription:
			"Practica preguntas de exames da FIC por tema ou con simulacións cronometradas. Comproba as túas respostas e consulta solucións modelo.",
		homeMetaDescription:
			"Practica preguntas de exames da FIC por tema ou con simulacións cronometradas. Comproba as túas respostas e consulta solucións modelo.",
		defaultDescription:
			"Practica preguntas de exames da FIC con autocorrección e solucións modelo. Escolle un tema ou unha simulación e comeza a estudar.",
		subjectAuthorizedTitle: "{subjectName}: preguntas de exame",
		subjectCommunityTitle: "{subjectName}: recompilacións",
		subjectAuthorizedDescription:
			"Practica {count}{questionLabel} de {subjectName} de {examCount} {examLabel}. Comproba as túas respostas e consulta solucións modelo.",
		subjectCommunityDescription:
			"Practica {count}{questionLabel} de {subjectName} de {examCount} {compilationLabel}. Comproba as túas respostas e consulta solucións modelo.",
		topicAuthorizedTitle: "{topicName}: {subjectName}",
		topicCommunityTitle: "{topicName}: {subjectName}",
		topicAuthorizedDescription:
			"Practica {count}{questionLabel} de {topicName} de {subjectName}. Consulta respostas modelo.",
		topicCommunityDescription:
			"Practica {count}{questionLabel} de {topicName} de {subjectName}. Consulta respostas modelo.",
		topicAuthorizedDescriptionShort:
			"Practica {count}{questionLabel} de {topicName}. Consulta respostas modelo.",
		topicCommunityDescriptionShort:
			"Practica {count}{questionLabel} de {topicName}. Consulta respostas modelo.",
		examAuthorizedTitle: "{examName}: {subjectName} | simulador",
		examPracticeTitle: "{examName}: {subjectName} | práctica",
		examAuthorizedShortTitle: "{examName}: simulador",
		examPracticeShortTitle: "{examName}: práctica",
		examAuthorizedDescription:
			"Practica o exame {examName} de {subjectName}{questionCount}. Dura {durationMinutes} minutos e inclúe respostas modelo.",
		examPracticeDescription:
			"Practica a recompilación {examName} de {subjectName}{questionCount}. Dura {durationMinutes} minutos e inclúe respostas modelo.",
		examAuthorizedDescriptionShort:
			"Practica o exame {examName}{questionCount}. Dura {durationMinutes} minutos e inclúe respostas modelo.",
		examPracticeDescriptionShort:
			"Practica a recompilación {examName}{questionCount}. Dura {durationMinutes} minutos e inclúe respostas modelo.",
		questionCountSuffix: " con {count} {questionLabel}",
	},
};
