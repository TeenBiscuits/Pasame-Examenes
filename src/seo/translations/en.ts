import type { SeoTranslations } from "../translation-types";

export const seoTranslations = {
	home: {
		faqTitle: "Frequently asked questions",
		faqs: [
			{
				question: "What will I find on Pásame Exámenes?",
				answer:
					"Pásame Exámenes is an open-source platform for practicing questions from degree subjects at the Faculty of Computer Science of A Coruña (FIC), organized by topic and timed sessions.",
			},
			{
				question: "How do I start practicing a subject?",
				answer:
					"Open a subject card, then choose a topic, practice set, or exam from its page.",
			},
			{
				question: "What's the difference between topic practice and an exam?",
				answer:
					"Topic practice focuses on one part of the syllabus. Exam mode and timed practice simulate a complete session with a time limit.",
			},
			{
				question: "Which question formats can I practice?",
				answer:
					"You can practice multiple-choice, text, matching, fill-in-the-blank, and multi-part questions. Multiple-choice and matching questions are graded automatically; open-ended questions are self-graded with help from the model answer.",
			},
			{
				question: "What are model answers for?",
				answer:
					"They are reference solutions that help you review and assess your answers. They come from original materials or from people who contribute to the project.",
			},
			{
				question: "Where is my progress stored?",
				answer:
					"The site stores your progress, attempts, preferences, and recently visited subjects in your browser's local storage. You do not need an account, but the data is not synced between devices and is removed when you clear this site's data.",
			},
			{
				question: "Why do some questions repeat?",
				answer:
					"A question may repeat or closely resemble one from another exam session or compilation. The app marks these matches so you can see how much of the syllabus you are covering. We try to detect them accurately, but some may go unnoticed.",
			},
			{
				question: "How are the questions and documents sourced?",
				answer:
					"Each subject page lists its sources. Some use authorized exams, while others use compilations or community materials. If a PDF or original material is available, we link it from the relevant page with its licensing information. Questions are extracted automatically, so errors are possible. If you find one, report it so we can fix it.",
			},
			{
				question: "How reliable are the answers?",
				answer:
					"We review and correct answers continuously. If you spot an error, report it from the question so we can fix it. Unlike Daypo tests or compilations uploaded to Wuolah, errors here can be corrected. We have already reviewed many answers from well-known compilations. Linus's Law sums it up: with enough people looking, errors eventually surface.",
			},
			{
				question: "Who is behind the project?",
				answer:
					"I'm Pablo Portas López, and I maintain the project with help from everyone who wants to contribute. I built this website to offer a more current, transparent, ad-free, open-source way to prepare for exams. I hope you find it useful.",
			},
		],
	},
	subjectHome: {
		notFound: "Subject Not Found",
	},
	footer: {
		privacyTitle: "Privacy Policy",
	},
	seo: {
		siteName: "Pásame Exámenes",
		questionSingular: "question",
		questionPlural: "questions",
		examSingular: "exam",
		examPlural: "exams",
		compilationSingular: "compilation",
		compilationPlural: "compilations",
		privacyMetaDescription:
			"This page describes the types of data Pásame Exámenes collects and how and where that data is processed.",
		homeTitle: "Practice FIC Exam Questions by Topic",
		homeMetaDescription:
			"Practice FIC exam questions by topic or in timed sets. Check your answers, review model solutions, and prepare for exams.",
		defaultDescription:
			"Practice FIC exam questions with self-grading and model solutions. Choose a topic or timed set and start studying.",
		subjectAuthorizedTitle: "{subjectName}: exam questions",
		subjectCommunityTitle: "{subjectName}: compilations",
		subjectAuthorizedDescription:
			"Practice {count}{subjectName} {questionLabel} from {examCount} {examLabel}. Check your answers and review model solutions.",
		subjectCommunityDescription:
			"Practice {count}{subjectName} {questionLabel} from {examCount} {compilationLabel}. Check your answers and review model solutions.",
		topicAuthorizedTitle: "{topicName}: {subjectName}",
		topicCommunityTitle: "{topicName}: {subjectName}",
		topicAuthorizedDescription:
			"Practice {count}{topicName} {questionLabel} from {subjectName}. Review model answers.",
		topicCommunityDescription:
			"Practice {count}{topicName} {questionLabel} from {subjectName}. Review model answers.",
		topicAuthorizedDescriptionShort:
			"Practice {count}{topicName} {questionLabel}. Review model answers.",
		topicCommunityDescriptionShort:
			"Practice {count}{topicName} {questionLabel}. Review model answers.",
		examAuthorizedTitle: "{examName}: {subjectName} | simulator",
		examPracticeTitle: "{examName}: {subjectName} | practice",
		examAuthorizedShortTitle: "{examName}: simulator",
		examPracticeShortTitle: "{examName}: practice",
		examAuthorizedDescription:
			"Practice the {examName} {subjectName} exam{questionCount}. It lasts {durationMinutes} minutes and includes model answers.",
		examPracticeDescription:
			"Practice the {examName} {subjectName} compilation{questionCount}. It lasts {durationMinutes} minutes and includes model answers.",
		examAuthorizedDescriptionShort:
			"Practice the {examName} exam{questionCount}. It lasts {durationMinutes} minutes and includes model answers.",
		examPracticeDescriptionShort:
			"Practice the {examName} compilation{questionCount}. It lasts {durationMinutes} minutes and includes model answers.",
		questionCountSuffix: " with {count} {questionLabel}",
	},
} as const satisfies SeoTranslations;
