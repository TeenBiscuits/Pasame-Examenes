export const en = {
  home: {
    title: "Pásame Exámenes",
    subtitle:
      "Open-source platform for practicing university exams. Choose a subject below to start drilling questions from past exams.",
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
    examSimulations: "Full Exam Simulations",
    originalExams: "Original Exam Documents",
    examDocsDescription:
      "Download or view the original PDF exams that these practice questions and simulations are based on.",
    pdf: "PDF",
    acknowledgments: "Acknowledgments",
    addExam: "Add Exam?",
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
    questions: "questions",
    points: "points",
    exams: "exams",
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
  seo: {
    siteName: "Pásame Exámenes",
    locale: "en_US",
    homeDescription:
      "Open-source platform for practicing university exams by topic or simulating the full exam.",
    defaultDescription:
      "Practice university exams with model answers and self-grading. Multiple-choice, text, and matching questions from past exams.",
  },
};

export type Translations = typeof en;
