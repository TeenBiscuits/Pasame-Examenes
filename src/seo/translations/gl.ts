import type { SeoTranslations } from "../translation-types";

export const seoTranslations = {
	home: {
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
	},
	footer: {
		privacyTitle: "Política de privacidade",
	},
	seo: {
		siteName: "Pásame Exámenes",
		questionSingular: "pregunta",
		questionPlural: "preguntas",
		examSingular: "exame",
		examPlural: "exames",
		compilationSingular: "recompilación",
		compilationPlural: "recompilacións",
		privacyMetaDescription:
			"Aquí descríbense os tipos de datos que Pásame Exámenes recompila e a forma e o lugar do tratamento destes datos.",
		homeTitle: "Practica preguntas de exames da FIC",
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
} as const satisfies SeoTranslations;
