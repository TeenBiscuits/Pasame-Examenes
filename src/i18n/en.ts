export const en = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      'Open-source platform for practicing university "exams". Choose a subject below to start drilling questions from past exams.',
    addSubject: "Add Subject?",
    recentlyVisited: "Recently visited",
    clearRecent: "Clear recent subjects",
  },
  subjectHome: {
    notFound: "Subject Not Found",
    returnHome: "Return to Home",
    description:
      "Practice {count} questions{repeated} from {exams} exams with model answers and self-grading.",
    practiceByTopic: "Practice by Topic",
    examSimulations: "Complete exam simulations/tests/compilations",
    originalExams: "Original Exam Documents",
    examDocsDescription:
      "Download or view the original PDF exams that these practice questions and simulations are based on.",
    originalDaypos: "Original Daypo Tests",
    daypoDocsDescription:
      "Open the original Daypo tests used as the source for these practice questions.",
    daypo: "Daypo",
    pdf: "PDF",
    acknowledgments: "Acknowledgments and Disclaimer",
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
    byline: "Pásame Exámenes - Open Source Study Platform",
    github: "TeenBiscuits/Pasame-Examenes",
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
    exams: '"exams"',
  },
  addSubject: {
    title: "Add a Subject",
    close: "Close",
    openIssue: "Open an Issue",
    openIssueDesc: "Request a new test via a pre-filled GitHub issue template",
    openIssueUrl:
      "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=suggest-subject.yml",
    contribute: "Contribute!",
    contributeDesc:
      "Follow the contribution guide to add it yourself via pull request",
    email: "Send an email",
  },
  addExam: {
    title: "Add an Exam",
    close: "Close",
    openIssue: "Open an Issue",
    openIssueDesc:
      "Request a new exam for this subject via a pre-filled GitHub issue template",
    openIssueUrl:
      "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new?template=add-exam.yml",
    contribute: "Contribute!",
    contributeDesc:
      "Follow the contribution guide to add it yourself via pull request",
    email: "Send an email",
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
      'Open-source platform for practicing university "exams" by topic or simulating the full exam.',
    defaultDescription:
      "Practice university exams with model answers and self-grading. Multiple-choice, text, and matching questions from past exams.",
  },
};

export type Translations = typeof en;
