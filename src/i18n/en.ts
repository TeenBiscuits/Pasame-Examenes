export const en = {
	home: {
		title: "Pásame Exámenes",
		subtitle:
			"Open-source platform for practicing FIC exam questions. Choose a subject below to study by topic or timed practice set.",
		addSubject: "Add Subject?",
		recentlyVisited: "Recently visited",
		clearRecent: "Clear recent subjects",
		quote: "Exams don't repeat, but they rhyme.",
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
		returnHome: "Return to Home",
		description:
			"Practice {count} questions{repeated} from {exams} exams with model answers and self-grading.",
		communityDescription:
			"Practice {count} questions{repeated} from {exams} compilations with model answers and self-grading.",
		questionSources: "Question sources",
		questionSourcesDescription:
			"Choose which exams or compilations provide questions for your topics. You can change this at any time.",
		selectedSources: "{selected} of {total} sources selected",
		selectAllSources: "Select all",
		practiceByTopic: "Topics",
		resetTopicProgress: "Reset topic progress",
		resetTopicProgressConfirm:
			"Reset all topic progress for this subject? This cannot be undone.",
		resetTopicProgressCancel: "Cancel",
		resetTopicProgressAction: "Reset progress",
		examSimulations: "Exams",
		practiceSimulations: "Compilations",
		originalExams: "Original Exam Documents",
		examDocsDescription:
			"Download or view the original PDF exams that these practice questions and simulations are based on.",
		sourceMaterials: "Source Materials",
		sourceMaterialsDescription:
			"Open the authorized or public source materials used for these practice questions.",
		originalContent: "Link to original content",
		originalContentDescription:
			"Open the original content used as the source for these practice questions.",
		original: "Original",
		pdf: "PDF",
		acknowledgments: "Acknowledgments and Disclaimer",
		legalInformation: "Subject legal information",
		contentLicense: "Content license",
		addExam: "Add?",
		reportCopyright: "Report",
		copyrightRemoved: "Removed for copyright reasons",
		repeatedSuffix: "{count} repeated questions across years",
	},
	practiceHome: {
		title: "Practice by Topic",
		subtitle:
			"Choose a topic to practice. MC and matching questions are auto-graded; text and fill-in-the-blank questions are self-graded.",
	},
	header: {
		home: "Home",
		practice: "Practice",
		star: "Star",
		starOnGithub: "Star on GitHub",
		skipToContent: "Skip to main content",
	},
	settings: {
		title: "Settings",
		open: "Open settings",
		close: "Close settings",
		language: "Language",
		theme: "Theme",
		volume: "Sound volume",
		volumeDescription: "Adjust the volume of interface feedback sounds.",
		version: "App version",
		mute: "Mute sounds",
		unmute: "Turn sounds on",
	},
	appUpdate: {
		message: "Updated to the latest version {version}",
		dismiss: "Dismiss update notice",
	},
	theme: {
		system: "🖥️ System",
		light: "☀️ Light",
		dark: "🌙 Dark",
		princess: "👑 Princess",
		latte: "🌻 Latte",
		frappe: "🪴 Frappé",
		macchiato: "🌺 Macchiato",
		mocha: "🌿 Mocha",
	},
	footer: {
		github: "GitHub",
		by: "by",
		contentIsLicensedUnder: "Content is licensed under",
		licenses: "Licenses",
		privacy: "Privacy Policy",
		close: "Close",
		licenseTitle: "Licenses",
		licenseIntro:
			"Pásame Exámenes separates the license for the website software from the license for the content published on it.",
		contentLicenseTitle: "Content: CC BY-SA 4.0 by default",
		contentLicenseDescription:
			"Questions, images, and original exam documents use CC BY-SA 4.0 unless the subject page states a different license.",
		softwareLicenseTitle: "Software: Apache 2.0",
		softwareLicenseDescription:
			"The platform source code, configuration, and documentation are licensed under the Apache License, Version 2.0.",
		license: "License",
		licensePage: "License page",
		legalText: "Legal text",
		linksLabel: "Legal and project links",
		privacyTitle: "Privacy Policy",
		privacyLastUpdated: "Last updated: 8 July 2026",
		privacySummary:
			"Pásame Exámenes is an educational, open-source website with no user accounts and no own backend. It uses local browser storage for preferences and study progress, and analytics to understand usage, performance, and errors.",
		privacySections: [
			{
				title: "Controller",
				paragraphs: [
					"The controller for this website is Pablo Portas López. You can contact the controller about privacy matters at pablo.portas@udc.es.",
				],
			},
			{
				title: "Data We Process",
				paragraphs: [
					"The website may process technical access data, local preference data, local study progress, and analytics data.",
				],
				items: [
					"Technical data: IP address, browser, device, requested URL, referrer, language, date and time, and similar server or CDN logs.",
					"Local preferences: selected language, selected theme, interface sound volume, selected question sources, viewed tours, GitHub star popup state, and recently visited subjects.",
					"Study progress stored locally: attempts, scores, topics, and subject progress saved in your browser.",
					"Analytics data: page views, interaction events, performance data, approximate device/browser information, and an anonymous local identifier for Umami.",
					"Session replays and heatmaps in the self-hosted Umami instance, enabled with a random 30% sample rate.",
					"Temporary GitHub star-count cache stored in session storage after requesting public repository data from GitHub.",
				],
			},
			{
				title: "Purposes",
				paragraphs: [
					"Data is processed only for purposes connected to operating, securing, measuring, and improving the website.",
				],
				items: [
					"Provide the website and route requests through hosting and CDN infrastructure.",
					"Remember your language, theme, recent subjects, tours, and dismissed prompts.",
					"Save study progress locally so you can continue practicing on the same device.",
					"Measure usage, performance, errors, navigation patterns, and feature interactions.",
					"Improve content, usability, accessibility, and reliability.",
					"Prevent abuse, diagnose technical issues, and maintain security.",
				],
			},
			{
				title: "Legal Basis",
				paragraphs: [
					"Under the GDPR, the main legal basis is legitimate interest: keeping the website available, secure, understandable, and useful for students. This includes analytics, performance measurement, heatmaps, and session replays, which are limited by data minimization and a 30% random sample rate for replays and heatmaps.",
					"Local preferences and progress are processed to provide the functionality requested by the user. Legal obligations may also apply where necessary.",
				],
			},
			{
				title: "Local Storage",
				paragraphs: [
					"Most study-related data is stored only in your browser through localStorage or sessionStorage. It is not part of a user account and may be deleted by clearing this website's data in your browser settings.",
					"The anonymous Umami identifier is also stored locally as umami_uid. Deleting this site's local data resets that identifier and removes locally stored preferences and progress.",
				],
			},
			{
				title: "Analytics, Replays, and Heatmaps",
				paragraphs: [
					"Analytics are collected with a self-hosted Umami instance at analytics.pablopl.dev. Umami is operated by the controller for this website; data is not sent to Umami Software as a cloud analytics provider.",
					"Umami is configured to respect Do Not Track for the standard analytics script. Session replays and heatmaps are used to understand usability problems and are sampled randomly at 30% of visits.",
					"Ahrefs Analytics is also used to understand traffic and website performance. Ahrefs processes data according to its own privacy policy.",
				],
			},
			{
				title: "Retention",
				paragraphs: [
					"Local browser data is kept until you delete it or your browser removes it. Analytics and technical data are kept for the time necessary to produce statistics, improve the service, diagnose incidents, and maintain security. Aggregated or anonymized data may be kept longer where it no longer identifies a user.",
				],
			},
			{
				title: "International Transfers",
				paragraphs: [
					"Some external providers may process data outside the European Economic Area. Where this happens, it is handled under the safeguards described in each provider's privacy policy or data processing terms. The self-hosted Umami setup does not imply a transfer of analytics data to Umami Software.",
				],
			},
			{
				title: "Your GDPR Rights",
				paragraphs: [
					"You may request access, rectification, erasure, restriction, portability, or object to processing where applicable. You may also lodge a complaint with a data protection authority.",
					"To exercise your rights, email pablo.portas@udc.es. Because there are no accounts, some data may only exist in your browser and can be deleted directly by clearing this site's local data.",
				],
			},
			{
				title: "Changes",
				paragraphs: [
					"This policy may be updated when the website changes its data practices, analytics configuration, or providers. The latest version is available from the footer of the website.",
				],
			},
		],
		privacyProvidersTitle: "External Providers and References",
		privacyProvidersIntro:
			"These providers or references are relevant to the operation and measurement of the website:",
		privacyProviders: [
			{
				name: "Vercel",
				description: "Hosting and deployment infrastructure.",
				href: "https://vercel.com/legal/privacy-policy",
				linkLabel: "Privacy policy",
				target: "vercel_privacy",
			},
			{
				name: "Cloudflare",
				description: "CDN, security, caching, and traffic delivery.",
				href: "https://www.cloudflare.com/privacypolicy/",
				linkLabel: "Privacy policy",
				target: "cloudflare_privacy",
			},
			{
				name: "Umami",
				description:
					"Self-hosted analytics software used at analytics.pablopl.dev; linked as software documentation/reference, not as a cloud processor for this site.",
				href: "https://umami.is/privacy",
				linkLabel: "Umami privacy",
				target: "umami_privacy",
			},
			{
				name: "Umami Docs",
				description:
					"Documentation for tracker functions and collected analytics payloads.",
				href: "https://umami.is/docs/tracker-functions",
				linkLabel: "Tracker docs",
				target: "umami_docs",
			},
			{
				name: "Ahrefs",
				description: "External analytics for traffic and website performance.",
				href: "https://ahrefs.com/legal/privacy-policy",
				linkLabel: "Privacy policy",
				target: "ahrefs_privacy",
			},
			{
				name: "GitHub",
				description:
					"Repository hosting and public API used to display the repository star count.",
				href: "https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement",
				linkLabel: "Privacy statement",
				target: "github_privacy",
			},
		],
	},
	practice: {
		backToTopics: "Back to Topics",
		noQuestions: "No questions found for this topic.",
		backToHome: "Back to Home",
		score: "Score",
		points: "points",
		pointsTotal: "points total",
		allCorrect:
			"Review your answers below. Green = correct answers. Only multiple-choice and matching questions are auto-graded; text and fill-in-the-blank questions are self-graded.",
		previous: "Previous",
		next: "Next",
		clear: "Clear",
		check: "Check",
		submit: "Submit & Show Answers",
		runningScore: "Running score",
		checked: "checked",
		openEnded: "open-ended questions",
		selfGradeHint: "Self-grade your text answers to see your final score.",
		allSelfGraded: "All answers self-graded",
	},
	exam: {
		backToSubject: "Back to Subject",
		exitConfirm: "Are you sure you want to exit? Your progress will be lost.",
		exitModalTitle: "Leave exam?",
		exitModalCancel: "Continue exam",
		exitModalConfirm: "Leave exam",
		noQuestions: "No questions found for this exam.",
		backToHome: "Back to Home",
		questions: "Questions",
		totalPoints: "Total Points",
		pass: "Pass",
		timeLimit: "Time Limit",
		minutes: "minutes",
		startExam: "Start Exam",
		simulationNote:
			"This simulation mirrors the real exam format. For open-ended and fill-in-the-blank questions, self-grade your answers against the model solutions shown after submission. MC and matching questions are auto-graded.",
		simulationScoringNote:
			"Some real exams subtract points for an incorrect answer; this simulation does not take that into account.",
		practiceNote:
			"This timed practice uses an indicative structure for studying. For open-ended and fill-in-the-blank questions, self-grade your answers against the model solutions shown after submission. MC and matching questions are auto-graded.",
		practiceScoringNote:
			"Some real exams subtract points for an incorrect answer; this practice does not take that into account.",
		submitted: "Exam Submitted.",
		passThreshold: "Pass threshold",
		reviewNote:
			"Review your answers below. Open-ended questions show model answers for self-grading.",
		selfGradeHint: "Self-grade your text answers to see your final score.",
		submitExam: "Submit Exam",
		submitConfirm:
			"Are you sure you want to submit your exam? You won't be able to change your answers.",
		submitModalTitle: "Submit Exam",
		submitModalBody:
			"Are you sure you want to submit? You won't be able to change your answers.",
		submitModalCancel: "Cancel",
		submitModalConfirm: "Submit",
		timeUpModalTitle: "Time's Up",
		timeUpModalBody:
			"Time has run out. Your exam will be submitted automatically.",
		timeUpModalAcknowledge: "Understood",
		score: "Score",
		outOf: "/",
		pass_: "(PASS)",
		fail: "(FAIL)",
		total: "total",
		previous: "Previous",
		next: "Next",
		questionSummary: "{questions} questions · {points} points",
	},
	questionCard: {
		modelSolution: "Model Solution",
		solutionIllustration: "Solution illustration",
		gradeAnswer: "Grade your answer:",
		correct: "Correct",
		incorrect: "Incorrect",
		openSolution: "Show solution",
		openAndSelfGrade: "Show solution and self-evaluate",
		closeSolution: "Hide solution",
		development: "Worked solution",
		openDevelopment: "Show worked solution",
		closeDevelopment: "Hide worked solution",
		yourAnswer: "Your answer",
		typeAnswer: "Type your answer…",
		matchItemTo: "Match {item} to {letter}",
		questionPrefix: "Q",
		pointsShort: "p",
		correct_: "Correct",
		reportIssue: "Report Issue",
		reportIssueTitle: "Correct Question",
		questionTypes: {
			mc: "Multiple Choice (mc)",
			text: "Open Text (text)",
			"multiple-text": "Text with parts (multiple-text)",
			matching: "Matching (matching)",
			fill: "Fill in the blanks (fill)",
			"table-fill": "Fill in a table (table-fill)",
		},
		repeated: "Repeated",
	},
	subjectCard: {
		topics: "topics",
		questions: "questions",
		points: "points",
		exams: "exams",
		practiceSets: "compilations",
		course: "Year {course}",
	},
	contentPolicy: {
		authorized: "Verified exam materials",
		community: "Community practice materials",
	},
	addSubject: {
		title: "Add a Subject",
		close: "Close",
		openIssue: "Open an Issue",
		openIssueDesc:
			"Request a new subject via a pre-filled GitHub issue template",
		openIssueUrl:
			"https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=suggest-subject.yml",
		contribute: "Contribute!",
		contributeDesc:
			"Follow the contribution guide to add it yourself via pull request",
		email: "Send an email",
	},
	addExam: {
		title: "Add Practice Material",
		close: "Close",
		openIssue: "Open an Issue",
		openIssueDesc:
			"Propose an authorized exam, practice set, or original exercises via a GitHub issue template",
		openIssueUrl:
			"https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=add-exam.yml",
		contribute: "Contribute!",
		contributeDesc:
			"Follow the contribution guide to add authorized or original content via pull request",
		email: "Send an email",
		legalNotice:
			"Only submit original content, authorized materials, or public sources with permission to share.",
	},
	copyrightReport: {
		title: "Report copyright",
		close: "Close",
		description:
			"If an exam, test, compilation, or question should be removed for copyright reasons, send an email to pablo.portas@udc.es.",
		includeDetails:
			"Please include the subject, exam/year or affected question, and the reason for the removal request.",
		email: "Report",
		emailSubject: "Copyright removal request - {subjectName}",
		emailBody:
			"Subject: {subjectName}\nSubject ID: {subjectId}\n\nAffected exam/year or question:\n\nReason for removal request:\n",
	},
	tour: {
		next: "Next",
		previous: "Previous",
		done: "Done",
		reportIssueTitle: "Report Issue",
		reportIssueDesc:
			"Found a mistake in a question? Click the report button to open a GitHub issue and help improve the content.",
		practice: {
			step1Title: "Topic Practice",
			step1Desc:
				"You're now practicing questions by topic. Use the back link to return to the subject page anytime.",
			step2Title: "Question Navigator",
			step2Desc:
				"These numbered buttons let you jump between questions. Answered ones are highlighted, and the current one is highlighted with the accent color.",
			step3Title: "Answer Questions",
			step3Desc:
				"Click an option for multiple-choice, type your answer for text or fill-in-the-blank questions, or select matching letters for matching questions.",
			step4Title: "Check & Submit",
			step4Desc:
				"Use 'Check' to verify a single question, 'Clear' to erase your answer, or 'Submit & Show Answers' to see all solutions at once.",
			step5Title: "Navigate",
			step5Desc:
				"Use the Previous / Next buttons or your keyboard arrow keys (← →) to move between questions.",
		},
		exam: {
			step1Title: "Exam Simulation",
			step1Desc:
				"This simulates the real exam format. The timer is counting down, so manage your time wisely! The pass threshold is shown here.",
			practiceStep1Desc:
				"This is a timed practice set with an indicative structure. The timer is counting down, so manage your time wisely! The pass threshold is shown here.",
			step2Title: "Question Navigator",
			step2Desc:
				"Click numbered buttons to jump between questions. Answered questions are highlighted so you can track your progress.",
			step3Title: "Answer Questions",
			step3Desc:
				"Answer each question. For open-ended text questions, you'll self-grade your answer against the model solution after submission.",
			step4Title: "Submit Exam",
			step4Desc:
				"When you're done, click 'Submit Exam' to see your score and model solutions. You won't be able to change answers after submitting.",
		},
	},
	starPopup: {
		title: "Would you give us a star?",
		subtitle: "We don't want your money, just a star on GitHub.",
		sparkleButton: "Make the star sparkle",
		starButton: "Give us a star!",
		dismiss: "Not now",
	},
	disclaimer: {
		text: "Questions have been extracted from reference materials through automated processes and may contain errors. If you find an error, please",
		reportLink: "Report the question",
		postLinkText: ".",
		originalMaterialPrefix: "You can review the",
		originalMaterialLink: "original material",
	},
	seo: {
		siteName: "Pásame Exámenes",
		locale: "en_US",
		examSingular: "exam",
		examPlural: "exams",
		compilationSingular: "compilation",
		compilationPlural: "compilations",
		questionSingular: "question",
		questionPlural: "questions",
		privacyMetaDescription:
			"This page describes the types of data Pásame Exámenes collects and how and where that data is processed.",
		homeTitle: "Practice FIC Exam Questions by Topic",
		homeDescription:
			"Practice FIC exam questions by topic or in timed sets. Check your answers, review model solutions, and prepare for exams.",
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
};

export type Translations = typeof en;
