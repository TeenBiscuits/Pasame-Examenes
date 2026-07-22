export const en = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      "Open-source platform for practicing university questions. Choose a subject below to study by topic or timed practice set.",
    addSubject: "Add Subject?",
    recentlyVisited: "Recently visited",
    clearRecent: "Clear recent subjects",
    quote: "Exams don't repeat, but they rhyme.",
  },
  subjectHome: {
    notFound: "Subject Not Found",
    returnHome: "Return to Home",
    description:
      "Practice {count} questions{repeated} from {exams} exams with model answers and self-grading.",
    communityDescription:
      "Practice {count} questions{repeated} from {exams} compilations with model answers and self-grading.",
    practiceByTopic: "Topics",
    examSimulations: "Exams",
    practiceSimulations: "Compilations",
    originalExams: "Original Exam Documents",
    examDocsDescription:
      "Download or view the original PDF exams that these practice questions and simulations are based on.",
    sourceMaterials: "Source Materials",
    sourceMaterialsDescription:
      "Open the authorized or public source materials used for these practice questions.",
    originalDaypos: "Original Daypo Tests",
    daypoDocsDescription:
      "Open the original Daypo tests used as the source for these practice questions.",
    daypo: "Daypo",
    pdf: "PDF",
    acknowledgments: "Acknowledgments and Disclaimer",
    contentLicense: "Specific Content License",
    addExam: "Add?",
    reportCopyright: "Report copyright",
    copyrightRemoved: "Removed for copyright reasons",
    repeatedSuffix: "{count} repeated questions across years",
  },
  practiceHome: {
    title: "Practice by Topic",
    subtitle:
      "Choose a topic to practice. MC and matching questions are auto-graded.",
  },
  header: {
    home: "Home",
    practice: "Practice",
  },
  footer: {
    github: "GitHub",
    by: "by",
    isLicensedUnder: "is licensed under",
    licenses: "Licenses",
    privacy: "Privacy Policy",
    close: "Close",
    licenseTitle: "Licenses",
    licenseIntro:
      "Pásame Exámenes separates the license for the website software from the license for the content published on it.",
    contentLicenseTitle: "Content: CC BY-NC-SA 4.0",
    contentLicenseDescription:
      "Unless a subject page states otherwise, content uploaded to this website is licensed under CC BY-NC-SA 4.0.",
    softwareLicenseTitle: "Software: Apache 2.0",
    softwareLicenseDescription:
      "The platform source code is licensed under the Apache License, Version 2.0.",
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
          "Local preferences: selected language, selected theme, viewed tours, GitHub star popup state, and recently visited subjects.",
          "Study progress stored locally: attempts, scores, topics, and subject progress saved in your browser.",
          "Analytics data: page views, interaction events, performance data, approximate device/browser information, and an anonymous local identifier for Rybbit.",
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
          "Under the GDPR, the main legal basis is legitimate interest: keeping the website available, secure, understandable, and useful for students. This includes analytics and performance measurement, limited by data minimization.",
          "Local preferences and progress are processed to provide the functionality requested by the user. Legal obligations may also apply where necessary.",
        ],
      },
      {
        title: "Local Storage",
        paragraphs: [
          "Most study-related data is stored only in your browser through localStorage or sessionStorage. It is not part of a user account and may be deleted by clearing this website's data in your browser settings.",
          "The anonymous Rybbit identifier is also stored locally as rybbit_uid. Deleting this site's local data resets that identifier and removes locally stored preferences and progress.",
        ],
      },
      {
        title: "Analytics",
        paragraphs: [
          "Analytics are collected with a self-hosted Rybbit instance at analytics.pablopl.dev. Rybbit is operated by the controller for this website; data is not sent to Rybbit as a cloud analytics provider.",
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
          "Some external providers may process data outside the European Economic Area. Where this happens, it is handled under the safeguards described in each provider's privacy policy or data processing terms. The self-hosted Rybbit setup does not imply a transfer of analytics data to a cloud provider.",
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
        name: "Rybbit",
        description:
          "Self-hosted analytics software used at analytics.pablopl.dev; linked as software documentation/reference, not as a cloud processor for this site.",
        href: "https://rybbit.com/es/docs",
        linkLabel: "Rybbit docs",
        target: "rybbit_docs",
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
    backToTopics: "← Back to Topics",
    noQuestions: "No questions found for this topic.",
    backToHome: "Back to Home",
    score: "Score",
    points: "points",
    pointsTotal: "points total",
    allCorrect:
      "Review your answers below. Green = correct answers. Only multiple-choice and matching questions are auto-graded.",
    previous: "Previous",
    next: "Next",
    clear: "Clear",
    check: "Check",
    submit: "Submit & Show Answers",
    runningScore: "Running score",
    checked: "checked",
    openEnded: "open-ended questions",
  },
  exam: {
    backToSubject: "← Back to Subject",
    exitConfirm: "Are you sure you want to exit? Your progress will be lost.",
    noQuestions: "No questions found for this exam.",
    backToHome: "Back to Home",
    questions: "Questions",
    totalPoints: "Total Points",
    pass: "Pass",
    timeLimit: "Time Limit",
    minutes: "minutes",
    startExam: "Start Exam",
    simulationNote:
      "This simulation mirrors the real exam format. For open-ended questions, self-grade your answers against the model solutions shown after submission. MC and matching questions are auto-graded.",
    practiceNote:
      "This timed practice uses an indicative structure for studying. For open-ended questions, self-grade your answers against the model solutions shown after submission. MC and matching questions are auto-graded.",
    submitted: "Exam Submitted.",
    passThreshold: "Pass threshold",
    reviewNote:
      "Review your answers below. Open-ended questions show model answers for self-grading.",
    submitExam: "Submit Exam",
    submitConfirm:
      "Are you sure you want to submit your exam? You won't be able to change your answers.",
    score: "Score",
    outOf: "/",
    pass_: "(PASS)",
    fail: "(FAIL)",
    total: "total",
    previous: "Previous",
    next: "Next",
  },
  questionCard: {
    modelSolution: "Model Solution",
    gradeAnswer: "Grade your answer:",
    correct: "✓ Correct",
    incorrect: "✗ Incorrect",
    openSolution: "Open Solutions",
    closeSolution: "Close Solution",
    yourAnswer: "Your answer",
    correct_: "Correct",
    reportIssue: "Report Issue",
    repeated: "Repeated",
  },
  subjectCard: {
    topics: "topics",
    questions: "questions",
    points: "points",
    exams: "exams",
    practiceSets: "compilations",
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
    email: "Send removal request",
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
        "Click an option for multiple-choice, type your answer for text questions, or select matching letters for matching questions.",
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
    starButton: "Give us a star!",
    dismiss: "Not now",
  },
  disclaimer: {
    text: "Questions have been extracted from reference materials through automated processes and may contain errors. If you find an error, please",
    reportLink: "Report the question",
    postLinkText:
      ". In some cases you can review the original material directly from the website.",
  },
  seo: {
    siteName: "Pásame Exámenes",
    locale: "en_US",
    homeDescription:
      "Open-source platform for practicing university questions by topic or timed practice set.",
    defaultDescription:
      "Practice university questions with model answers and self-grading. Multiple-choice, text, and matching questions.",
  },
};

export type Translations = typeof en;
