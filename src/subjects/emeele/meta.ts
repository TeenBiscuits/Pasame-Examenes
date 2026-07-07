import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
  id: "emeele",
  name: "Introduction to Machine Learning",
  university: "Linnaeus University",
  courseCode: "2DV516",
  icon: "🤖",
  contentPolicy: "authorized-exams",
  topics: [
    { key: "kNN", label: "k-Nearest Neighbors", icon: "🎯", color: "blue" },
    {
      key: "Bias-Variance",
      label: "Bias-Variance Tradeoff",
      icon: "⚖️",
      color: "indigo",
    },
    {
      key: "Linear & Logistic Regression",
      label: "Linear & Logistic Regression",
      icon: "📈",
      color: "green",
    },
    {
      key: "Model Selection & Regularization",
      label: "Model Selection & Regularization",
      icon: "🔧",
      color: "purple",
    },
    {
      key: "Neural Networks",
      label: "Neural Networks",
      icon: "🧠",
      color: "pink",
    },
    {
      key: "Decision Trees & Ensembles",
      label: "Decision Trees & Ensembles",
      icon: "🌳",
      color: "amber",
    },
    {
      key: "Support Vector Machines",
      label: "Support Vector Machines",
      icon: "📐",
      color: "red",
    },
    { key: "Clustering", label: "Clustering", icon: "🔮", color: "cyan" },
    {
      key: "Dimensionality Reduction",
      label: "Dimensionality Reduction",
      icon: "📉",
      color: "orange",
    },
  ],
  exams: [
    {
      year: "2024",
      title: "2024 Exam",
      date: "2024",
      description: "40 points · 10 questions",
      passPoints: 20,
      totalPoints: 40,
      durationMinutes: 300,
    },
    {
      year: "2025",
      title: "2025 Exam",
      date: "2025",
      description: "52 points · mixed formats",
      passPoints: 26,
      totalPoints: 52,
      durationMinutes: 300,
    },
  ],
};
