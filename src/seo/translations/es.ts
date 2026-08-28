import type { SeoTranslations } from "../translation-types";

export const seoTranslations = {
	home: {
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
	},
	footer: {
		privacyTitle: "Política de privacidad",
	},
	seo: {
		siteName: "Pásame Exámenes",
		questionSingular: "pregunta",
		questionPlural: "preguntas",
		examSingular: "examen",
		examPlural: "exámenes",
		compilationSingular: "recopilatorio",
		compilationPlural: "recopilatorios",
		privacyMetaDescription:
			"Aquí se describen los tipos de datos que Pásame Exámenes recopila y la forma y el lugar del tratamiento de dichos datos.",
		homeTitle: "Practica preguntas de exámenes de la FIC",
		homeMetaDescription:
			"Practica preguntas de exámenes de la FIC por tema o con simulacros cronometrados. Comprueba tus respuestas y consulta soluciones modelo.",
		defaultDescription:
			"Practica preguntas de exámenes de la FIC con autocorrección y soluciones modelo. Elige un tema o un simulacro y empieza a estudiar.",
		subjectAuthorizedTitle: "{subjectName}: preguntas de examen",
		subjectCommunityTitle: "{subjectName}: recopilatorios",
		subjectAuthorizedDescription:
			"Practica {count}{questionLabel} de {subjectName} de {examCount} {examLabel}. Comprueba tus respuestas y consulta soluciones modelo.",
		subjectCommunityDescription:
			"Practica {count}{questionLabel} de {subjectName} de {examCount} {compilationLabel}. Comprueba tus respuestas y consulta soluciones modelo.",
		topicAuthorizedTitle: "{topicName}: {subjectName}",
		topicCommunityTitle: "{topicName}: {subjectName}",
		topicAuthorizedDescription:
			"Practica {count}{questionLabel} de {topicName} de {subjectName}. Revisa las respuestas modelo.",
		topicCommunityDescription:
			"Practica {count}{questionLabel} de {topicName} de {subjectName}. Revisa las respuestas modelo.",
		topicAuthorizedDescriptionShort:
			"Practica {count}{questionLabel} de {topicName}. Revisa las respuestas modelo.",
		topicCommunityDescriptionShort:
			"Practica {count}{questionLabel} de {topicName}. Revisa las respuestas modelo.",
		examAuthorizedTitle: "{examName}: {subjectName} | simulador",
		examPracticeTitle: "{examName}: {subjectName} | práctica",
		examAuthorizedShortTitle: "{examName}: simulador",
		examPracticeShortTitle: "{examName}: práctica",
		examAuthorizedDescription:
			"Practica el examen {examName} de {subjectName}{questionCount}. Dura {durationMinutes} minutos e incluye respuestas modelo.",
		examPracticeDescription:
			"Practica el recopilatorio {examName} de {subjectName}{questionCount}. Dura {durationMinutes} minutos e incluye respuestas modelo.",
		examAuthorizedDescriptionShort:
			"Practica el examen {examName}{questionCount}. Dura {durationMinutes} minutos e incluye respuestas modelo.",
		examPracticeDescriptionShort:
			"Practica el recopilatorio {examName}{questionCount}. Dura {durationMinutes} minutos e incluye respuestas modelo.",
		questionCountSuffix: " con {count} {questionLabel}",
	},
} as const satisfies SeoTranslations;
