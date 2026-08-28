export interface Faq {
	question: string;
	answer: string;
}

export interface SeoTranslations {
	home: {
		faqTitle: string;
		faqs: readonly Faq[];
	};
	subjectHome: {
		notFound: string;
	};
	footer: {
		privacyTitle: string;
	};
	seo: {
		siteName: string;
		questionSingular: string;
		questionPlural: string;
		examSingular: string;
		examPlural: string;
		compilationSingular: string;
		compilationPlural: string;
		privacyMetaDescription: string;
		homeTitle: string;
		homeMetaDescription: string;
		defaultDescription: string;
		subjectAuthorizedTitle: string;
		subjectCommunityTitle: string;
		subjectAuthorizedDescription: string;
		subjectCommunityDescription: string;
		topicAuthorizedTitle: string;
		topicCommunityTitle: string;
		topicAuthorizedDescription: string;
		topicCommunityDescription: string;
		topicAuthorizedDescriptionShort: string;
		topicCommunityDescriptionShort: string;
		examAuthorizedTitle: string;
		examPracticeTitle: string;
		examAuthorizedShortTitle: string;
		examPracticeShortTitle: string;
		examAuthorizedDescription: string;
		examPracticeDescription: string;
		examAuthorizedDescriptionShort: string;
		examPracticeDescriptionShort: string;
		questionCountSuffix: string;
	};
}
