import { Alarm, AngleLeftSquare, AngleRightSquare, Exit } from "reicon-react";
import type { Question, QuestionType } from "../data/types";
import { useT } from "../i18n/hooks";
import { formatPoints } from "../lib/points";
import QuestionCard from "./QuestionCard";
import SimulatorLayout from "./SimulatorLayout";

export interface SimulatorPreviewProps {
	kind?: "practice" | "exam";
	questionType?: QuestionType;
	optionCount?: number;
	textPartCount?: number;
	title?: string;
	topicLabel?: string;
	questionCount?: number;
	totalPoints?: number;
}

const sampleQuestion: Question = {
	id: "loading-sample",
	examId: "sample",
	topic: "sample",
	type: "mc",
	points: 1,
	question:
		"Un programa ejecuta una serie de instrucciones en un procesador. ¿Qué cambio permite reducir su tiempo de ejecución manteniendo el mismo resultado?",
	options: [
		"Reducir el número de ciclos necesarios para ejecutar el programa.",
		"Aumentar el tiempo que tarda cada ciclo del procesador.",
		"Añadir instrucciones sin modificar la frecuencia de reloj.",
		"Mantener constantes todos los parámetros de ejecución.",
	],
	correctAnswer: "a",
};

const sampleQuestions: Record<QuestionType, Question> = {
	mc: sampleQuestion,
	text: {
		...sampleQuestion,
		type: "text",
		question:
			"Explica cómo influyen el número de instrucciones, los ciclos por instrucción y la frecuencia del procesador en el tiempo de ejecución de un programa.",
		correctAnswer:
			"El tiempo depende del número de instrucciones, los ciclos por instrucción y la duración de cada ciclo.",
	},
	"multiple-text": {
		...sampleQuestion,
		type: "multiple-text",
		question:
			"Analiza el rendimiento de un programa a partir de los parámetros de su procesador.",
		textParts: [
			{
				text: "Calcula el tiempo de ejecución a partir de la frecuencia y el número de ciclos.",
			},
			{
				text: "Explica cómo cambia el resultado al reducir el número de instrucciones.",
			},
		],
		correctAnswer: ["Tiempo de ejecución", "Reducción del tiempo"],
	},
	fill: {
		...sampleQuestion,
		type: "fill",
		question: "Completa las relaciones entre las magnitudes de rendimiento.",
		fillStatements: [
			{
				text: "El tiempo de ejecución es el número de ciclos dividido entre {{blank}}.",
			},
			{
				text: "Los ciclos dependen del número de instrucciones y de {{blank}}.",
			},
		],
		correctAnswer: ["la frecuencia", "los ciclos por instrucción"],
	},
	"table-fill": {
		...sampleQuestion,
		type: "table-fill",
		question:
			"Completa la tabla con las magnitudes que faltan para cada procesador.",
		tableFill: {
			headers: ["Procesador", "Ciclos", "Tiempo"],
			rows: [
				["A", "2000", "{{blank}}"],
				["B", "{{blank}}", "2 ms"],
			],
		},
		correctAnswer: ["1 ms", "4000"],
	},
	matching: {
		...sampleQuestion,
		type: "matching",
		question:
			"Relaciona cada concepto con la magnitud que representa en el rendimiento de un procesador.",
		options: ["Frecuencia", "CPI", "Tiempo de ejecución"],
		correctAnswer: {
			Frecuencia: "Ciclos por segundo",
			CPI: "Ciclos por instrucción",
			"Tiempo de ejecución": "Segundos por programa",
		},
	},
};
const ignoreAnswer = () => {};
const sampleChips = Array.from({ length: 30 }, (_, index) => index + 1);

/** Real question markup, without session hooks, timers, persistence or active shortcuts. */
export default function SimulatorPreview({
	kind = "practice",
	questionType = "mc",
	optionCount,
	textPartCount,
	title,
	topicLabel,
	questionCount = 12,
	totalPoints = questionCount,
}: SimulatorPreviewProps) {
	const t = useT();
	const labels = kind === "exam" ? t.exam : t.practice;
	const sample = sampleQuestions[questionType];
	const question: Question = {
		...sample,
		...(questionType === "mc" && optionCount !== undefined
			? {
					options: Array.from(
						{ length: optionCount },
						(_, index) => sampleQuestion.options?.[index % 4] ?? "",
					),
				}
			: {}),
		...(questionType === "multiple-text" && textPartCount !== undefined
			? {
					textParts: Array.from(
						{ length: textPartCount },
						(_, index) => sample.textParts?.[index % 2] ?? { text: "" },
					),
				}
			: {}),
	};

	return (
		<div inert data-question-type={question.type}>
			<SimulatorLayout>
				<div className="text-accent-fg mb-3 inline-flex items-center gap-1.5 text-sm sm:mb-4">
					<Exit size={16} aria-hidden="true" />
					{kind === "exam" ? t.exam.backToSubject : t.practice.backToTopics}
				</div>
				<div className="sticky-player-header bg-surface border-border sticky z-40 -mx-4 mb-4 border-b px-4 pt-2 pb-3 sm:mb-6">
					<div className="flex items-center justify-between gap-4">
						<div className="min-w-0">
							<h2 className="text-fg truncate text-xl font-semibold sm:text-2xl">
								{title ?? labels.loadingQuestions}
							</h2>
							<p className="text-fg-muted mt-1 text-sm">
								{questionCount} {t.subjectCard.questions} ·{" "}
								{formatPoints(totalPoints)} {t.practice.pointsTotal}
							</p>
						</div>
						{kind === "exam" && (
							<span className="text-fg-secondary flex shrink-0 items-center gap-1.5 font-mono text-sm font-bold">
								<Alarm size={16} aria-hidden="true" />
								60:00
							</span>
						)}
					</div>
					<div className="question-nav-scroll mt-4 mb-0 flex gap-2 overflow-x-auto overflow-y-hidden pb-0 sm:pb-2">
						{sampleChips.slice(0, questionCount).map((number) => (
							<span
								key={number}
								className="border-border text-fg-muted flex size-[42px] shrink-0 items-center justify-center rounded-md border font-mono text-xs"
							>
								{number}
							</span>
						))}
					</div>
				</div>
				<QuestionCard
					question={question}
					index={0}
					total={questionCount}
					topicLabel={topicLabel ?? title ?? labels.loadingQuestions}
					subjectId="sample"
					mode={kind}
					onAnswer={ignoreAnswer}
					keyboardEnabled={false}
				/>
				<div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-6">
					<span className="border-border inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm">
						<AngleLeftSquare size={18} aria-hidden="true" />
						{labels.previous}
					</span>
					<span className="bg-accent text-on-accent rounded-lg px-4 py-2 text-sm font-medium">
						{kind === "exam" ? t.exam.submitExam : t.practice.submit}
					</span>
					<span className="border-border inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm">
						{labels.next}
						<AngleRightSquare size={18} aria-hidden="true" />
					</span>
				</div>
			</SimulatorLayout>
		</div>
	);
}
