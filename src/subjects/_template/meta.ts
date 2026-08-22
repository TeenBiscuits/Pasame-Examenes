import type { SubjectMeta } from "../../data/types";

export const meta: SubjectMeta = {
	id: "_template",
	lastmod: "2026-07-25",
	name: "Template Subject",
	degree: "Grao en Enxeñaría informática",
	course: 1,
	courseCode: "TMP101",
	icon: "📝",
	contentPolicy: "community-practice",
	acknowledgments:
		"Questions provided by the Template Department. Answers by Prof. Example.",
	contentLicense: {
		spdxId: "LicenseRef-Template-Example",
		name: "Template Example Content License",
		url: "https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/LICENSES/LicenseRef-Template-Example.txt",
		notice:
			"Example-only license for demonstrating subject-specific content licensing.",
	},
	topics: [
		{ key: "topic-1", label: "Foundations", icon: "📌" },
		{ key: "topic-2", label: "Data and Reasoning", icon: "🔍" },
		{
			key: "syntax-highlighting",
			label: "Code Rendering",
			icon: "💻",
		},
		{
			key: "markdown-complete",
			label: "Markdown Coverage",
			icon: "✍️",
		},
		{
			key: "lorem-ipsum",
			label: "Long-form Text",
			icon: "📖",
		},
		{
			key: "visual-assets",
			label: "Images and Solutions",
			icon: "🖼️",
		},
		{
			key: "question-types",
			label: "Question Types",
			icon: "🧪",
		},
	],
	megatopics: [
		{
			key: "group-a",
			label: "Group A",
			topics: ["topic-1"],
		},
		{
			key: "group-b",
			label: "Group B",
			topics: ["topic-2"],
		},
		{
			key: "rendering-tests",
			label: "Rendering Fixtures",
			topics: ["syntax-highlighting", "markdown-complete", "visual-assets"],
		},
		{
			key: "long-form",
			label: "Long-form Content",
			topics: ["lorem-ipsum"],
		},
		{
			key: "assessment",
			label: "Assessment Fixtures",
			topics: ["question-types"],
		},
	],
	exams: [
		{
			id: "2024",
			title: "2024 Exam",
			durationMinutes: 5,
			hasPdf: false,
		},
		{
			id: "2025-01",
			title: "January 2025",
			durationMinutes: 15,
			hasPdf: false,
		},
		{
			id: "2023",
			title: "2023 Exam",
			durationMinutes: 0,
			hasPdf: false,
			deleteRights: true,
		},
		{
			id: "code-rendering",
			title: "Code Rendering Lab",
			durationMinutes: 30,
			hasPdf: false,
		},
		{
			id: "markdown-complete",
			title: "Markdown Coverage Exam",
			durationMinutes: 20,
			hasPdf: false,
		},
		{
			id: "lorem-ipsum",
			title: "Long-form Reading Exam",
			durationMinutes: 25,
			hasPdf: false,
		},
		{
			id: "visual-assets",
			title: "Visual Assets Exam",
			durationMinutes: 20,
			hasPdf: false,
		},
		{
			id: "question-types",
			title: "Question Types Exam",
			durationMinutes: 15,
			hasPdf: false,
		},
	],
};

void meta;
