import { useEffect, useRef, useState } from "react";
import {
	BookOpen,
	CaretRight,
	CheckSquare,
	DocText,
	Restart,
	TriangleWarning,
	XSquare,
} from "reicon-react";
import type { Picture } from "vite-imagetools";
import type { Question, QuestionType } from "../data/types";
import { useT } from "../i18n/hooks";
import {
	getPartSelfGradeKey,
	getTextPartPoints,
	isAutomaticallyCorrect,
	isFillAnswerCorrect,
} from "../lib/grading";
import { useCommandHandlers } from "../lib/keyboard-commands";
import { InlineMarkdown, Markdown } from "../lib/markdown";
import { formatPoints } from "../lib/points";
import { playError, playSuccess } from "../lib/sound";
import { track } from "../lib/umami";

function defaultLabel(index: number) {
	return `${String.fromCharCode(97 + index)})`;
}

function QuestionImage({
	image,
	alt,
	maxHeight,
}: {
	image: Picture | string | (Picture | string)[];
	alt: string;
	maxHeight: "300px" | "400px";
}) {
	const heightClass = maxHeight === "400px" ? "max-h-[400px]" : "max-h-[300px]";
	const images = Array.isArray(image) ? image : [image];

	return (
		<div className="border-border bg-surface flex max-w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border p-2">
			{images.map((source, index) =>
				typeof source === "object" ? (
					<picture key={source.img.src}>
						{Object.entries(source.sources).map(([format, srcset]) => (
							<source key={format} srcSet={srcset} type={`image/${format}`} />
						))}
						<img
							src={source.img.src}
							alt={images.length > 1 ? `${alt} ${index + 1}` : alt}
							width={source.img.w}
							height={source.img.h}
							style={{
								aspectRatio: `${source.img.w} / ${source.img.h}`,
							}}
							className={`${heightClass} max-w-full object-contain`}
							loading="lazy"
						/>
					</picture>
				) : (
					<img
						key={source}
						src={source}
						alt={images.length > 1 ? `${alt} ${index + 1}` : alt}
						className={`${heightClass} max-w-full object-contain`}
						loading="lazy"
					/>
				),
			)}
		</div>
	);
}

interface QuestionCardProps {
	question: Question;
	index: number;
	total: number;
	topicLabel: string;
	megatopicLabel?: string;
	examTitle?: string;
	subjectId: string;
	topicKey?: string;
	examId?: string;
	mode?: "practice" | "exam";
	onAnswer: (questionId: string, answer: string) => void;
	savedAnswer?: string;
	showResult?: boolean;
	selfGrade?: "correct" | "incorrect";
	/** Per-question self-grades keyed by `getPartSelfGradeKey` for `multiple-text` parts. */
	selfGrades?: Record<string, "correct" | "incorrect">;
	onSelfGrade?: (questionId: string, grade: "correct" | "incorrect") => void;
	direction?: "next" | "prev";
}

function getQuestionTypeLabel(
	type: QuestionType,
	labels: Record<QuestionType, string>,
): string {
	return labels[type];
}

function buildReportUrl(
	question: Question,
	subjectId: string,
	reportTitle: string,
	questionTypes: Record<QuestionType, string>,
): string {
	const base = "https://github.com/TeenBiscuits/Pasame-Examenes/issues/new";
	const params = new URLSearchParams();
	params.set("template", "report-question.yml");
	params.set("title", `[${reportTitle}] ${question.id}`);
	params.set("subject", subjectId);
	params.set("question-id", question.id);
	params.set(
		"question-type",
		getQuestionTypeLabel(question.type, questionTypes),
	);
	return `${base}?${params.toString()}`;
}

const solutionPanelClass =
	"bg-surface border-border -mx-4 space-y-3 border-y px-4 py-4 sm:-mx-6 sm:px-6";

type SelfGrade = "correct" | "incorrect";

function SelfGradeControls({
	questionId,
	grade,
	onSelfGrade,
}: {
	questionId: string;
	grade?: SelfGrade;
	onSelfGrade: (questionId: string, grade: SelfGrade) => void;
}) {
	const t = useT();

	const handleGrade = (nextGrade: SelfGrade) => {
		if (nextGrade === "correct") {
			playSuccess();
		} else {
			playError();
		}
		onSelfGrade(questionId, nextGrade);
	};

	const buttonBaseClass =
		"flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out focus-visible:ring-2 focus-visible:outline-none motion-reduce:transition-none active:scale-[0.96]";

	return (
		<div className="border-border border-t pt-3">
			<p className="text-fg-secondary mb-2 text-xs font-semibold">
				{t.questionCard.gradeAnswer}
			</p>
			<div className="grid grid-cols-2 gap-2">
				<button
					type="button"
					aria-pressed={grade === "correct"}
					onClick={() => handleGrade("correct")}
					className={`${buttonBaseClass} focus-visible:ring-correct-fg ${grade === "correct" ? "bg-correct-bg border-correct-border text-correct-fg" : "bg-surface-alt border-border text-fg-secondary hover:bg-correct-bg hover:border-correct-border hover:text-correct-fg"}`}
				>
					<CheckSquare
						size={16}
						weight={grade === "correct" ? "Filled" : "Outline"}
						aria-hidden="true"
					/>
					{t.questionCard.correct}
				</button>
				<button
					type="button"
					aria-pressed={grade === "incorrect"}
					onClick={() => handleGrade("incorrect")}
					className={`${buttonBaseClass} focus-visible:ring-incorrect-fg ${grade === "incorrect" ? "border-incorrect-border bg-incorrect-bg text-incorrect-fg" : "bg-surface-alt border-border text-fg-secondary hover:border-incorrect-border hover:bg-incorrect-bg hover:text-incorrect-fg"}`}
				>
					<XSquare
						size={16}
						weight={grade === "incorrect" ? "Filled" : "Outline"}
						aria-hidden="true"
					/>
					{t.questionCard.incorrect}
				</button>
			</div>
		</div>
	);
}

function DevelopmentDisclosure({
	development,
	questionId,
	subjectId,
	topicKey,
	examId,
	mode,
}: {
	development: string;
	questionId: string;
	subjectId: string;
	topicKey?: string;
	examId?: string;
	mode?: "practice" | "exam";
}) {
	const [isOpen, setIsOpen] = useState(false);
	const t = useT();

	return (
		<div className="mt-3 space-y-3">
			<button
				type="button"
				data-cuelume-press={isOpen ? "droplet" : "bloom"}
				className="text-accent-fg hover:text-accent-hover focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
				onClick={() => {
					const next = !isOpen;
					track("solution_toggle", {
						questionId,
						action: next ? "open" : "close",
						panel: "development",
						subjectId,
						topic: topicKey,
						examId: examId,
						mode,
					});
					setIsOpen(next);
				}}
			>
				<BookOpen size={16} aria-hidden="true" />
				{isOpen
					? t.questionCard.closeDevelopment
					: t.questionCard.openDevelopment}
			</button>
			{isOpen && (
				<div className={solutionPanelClass}>
					<h4 className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
						{t.questionCard.development}
					</h4>
					<Markdown className="text-fg-secondary font-sans text-xs">
						{development}
					</Markdown>
				</div>
			)}
		</div>
	);
}

function getFillInputWidth(answer: string): "w-16" | "w-24" | "w-36" | "w-52" {
	const length = answer.trim().length;
	if (length <= 4) return "w-16";
	if (length <= 9) return "w-24";
	if (length <= 18) return "w-36";
	return "w-52";
}

function MCQuestion({
	question,
	onAnswer,
	savedAnswer,
	showResult,
	subjectId,
	topicKey,
	examId,
	mode,
}: QuestionCardProps) {
	const [isOpen, setIsOpen] = useState(false);
	const t = useT();

	function answerWithShortcut(letter: string) {
		if (showResult || !question.options) return;
		const optionIndex = letter.charCodeAt(0) - 97;
		if (optionIndex >= question.options.length) return;
		track("question_answer", {
			questionId: question.id,
			type: "mc",
			answer: letter,
			subjectId,
			topic: topicKey,
			examId: examId,
			mode,
			source: "keyboard",
		});
		onAnswer(question.id, letter);
	}

	const canAnswer = !showResult && !!question.options;
	useCommandHandlers("question-card", {
		"answer-a": canAnswer ? () => answerWithShortcut("a") : undefined,
		"answer-b": canAnswer ? () => answerWithShortcut("b") : undefined,
		"answer-c": canAnswer ? () => answerWithShortcut("c") : undefined,
		"answer-d": canAnswer ? () => answerWithShortcut("d") : undefined,
		"answer-e": canAnswer ? () => answerWithShortcut("e") : undefined,
	});

	if (!question.options) return null;

	return (
		<div className="space-y-2">
			{question.options.map((opt, i) => {
				const letter = String.fromCharCode(97 + i);
				const key = `${question.id}-opt-${letter}`;
				const isSelected = savedAnswer === letter;
				const isCorrect = question.correctAnswer === letter;
				let className =
					"text-fg w-full p-3 rounded-lg border-2 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition duration-150 text-left text-sm flex items-start gap-3";
				if (showResult && isCorrect) {
					className += " bg-correct-bg border-correct-border";
				} else if (isSelected && showResult && !isCorrect) {
					className += " bg-incorrect-bg border-incorrect-border";
				} else if (isSelected && !showResult) {
					className += " bg-accent-light border-accent";
				} else {
					className += " border-border hover:border-border bg-surface-alt";
				}

				return (
					<button
						type="button"
						key={key}
						data-cuelume-press
						className={className}
						onClick={() => {
							if (showResult) return;
							track("question_answer", {
								questionId: question.id,
								type: "mc",
								answer: letter,
								subjectId,
								topic: topicKey,
								examId: examId,
								mode,
							});
							onAnswer(question.id, letter);
						}}
						disabled={!!showResult}
					>
						<span
							className={`bg-code mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${isSelected ? "animate-pop" : ""}`}
						>
							{letter}
						</span>
						<span className="flex-1">
							<InlineMarkdown>
								{opt.replace(/^[a-eA-E][.)]\s*/, "")}
							</InlineMarkdown>
						</span>
					</button>
				);
			})}
			{showResult &&
				(question.explanation != null || question.explanationImage) && (
					<div className="mt-3 space-y-3">
						<button
							type="button"
							data-cuelume-press={isOpen ? "droplet" : "bloom"}
							className="text-accent-fg hover:text-accent-hover focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
							onClick={() => {
								const next = !isOpen;
								track("solution_toggle", {
									questionId: question.id,
									action: next ? "open" : "close",
									subjectId,
									topic: topicKey,
									examId: examId,
									mode,
								});
								setIsOpen(next);
							}}
						>
							<BookOpen size={16} aria-hidden="true" />
							{isOpen
								? t.questionCard.closeSolution
								: t.questionCard.openSolution}
						</button>
						{isOpen && (
							<div className={solutionPanelClass}>
								{question.explanation != null && (
									<Markdown className="text-fg-muted text-xs italic">
										{question.explanation}
									</Markdown>
								)}
								{question.explanationImage && (
									<QuestionImage
										image={question.explanationImage}
										alt={t.questionCard.solutionIllustration}
										maxHeight="300px"
									/>
								)}
							</div>
						)}
					</div>
				)}
		</div>
	);
}

function TextQuestion({
	question,
	onAnswer,
	savedAnswer,
	showResult,
	selfGrade,
	onSelfGrade,
	subjectId,
	topicKey,
	examId,
	mode,
}: QuestionCardProps) {
	const [isOpen, setIsOpen] = useState(false);
	const t = useT();
	const textStartedRef = useRef(false);

	useEffect(() => {
		textStartedRef.current = false;
	}, []);

	return (
		<div>
			<label htmlFor={`answer-${question.id}`} className="sr-only">
				{t.questionCard.yourAnswer}
			</label>
			<textarea
				id={`answer-${question.id}`}
				aria-label={t.questionCard.yourAnswer}
				className="border-border bg-surface-alt text-fg focus:border-accent focus-visible:ring-accent min-h-[120px] w-full resize-y rounded-lg border-2 p-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
				placeholder={t.questionCard.typeAnswer}
				autoComplete="off"
				spellCheck={false}
				value={savedAnswer || ""}
				onChange={(e) => {
					onAnswer(question.id, e.target.value);
					if (!textStartedRef.current) {
						textStartedRef.current = true;
						track("question_answer", {
							questionId: question.id,
							type: "text",
							action: "started",
							subjectId,
							topic: topicKey,
							examId: examId,
							mode,
						});
					}
				}}
				disabled={!!showResult}
			/>
			{showResult && (
				<div className="mt-3 space-y-3">
					<button
						type="button"
						data-cuelume-press={isOpen ? "droplet" : "bloom"}
						className="text-accent-fg hover:text-accent-hover focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
						onClick={() => {
							const next = !isOpen;
							track("solution_toggle", {
								questionId: question.id,
								action: next ? "open" : "close",
							});
							setIsOpen(next);
						}}
					>
						<BookOpen size={16} aria-hidden="true" />
						{isOpen
							? t.questionCard.closeSolution
							: t.questionCard.openAndSelfGrade}
					</button>

					{isOpen && (
						<div className={solutionPanelClass}>
							<h4 className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
								{t.questionCard.modelSolution}
							</h4>
							<Markdown className="text-fg-secondary font-sans text-xs">
								{typeof question.correctAnswer === "string"
									? question.correctAnswer
									: JSON.stringify(question.correctAnswer, null, 2)}
							</Markdown>
							{question.explanation != null && (
								<Markdown className="text-fg-muted text-xs italic">
									{question.explanation}
								</Markdown>
							)}
							{question.explanationImage && (
								<QuestionImage
									image={question.explanationImage}
									alt={t.questionCard.solutionIllustration}
									maxHeight="300px"
								/>
							)}

							{onSelfGrade && (
								<SelfGradeControls
									questionId={question.id}
									grade={selfGrade}
									onSelfGrade={onSelfGrade}
								/>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function MultipleTextQuestion({
	question,
	onAnswer,
	savedAnswer,
	showResult,
	onSelfGrade,
	selfGrades,
	subjectId,
	topicKey,
	examId,
	mode,
}: QuestionCardProps) {
	const [openParts, setOpenParts] = useState<Record<number, boolean>>({});
	const t = useT();
	const textStartedRef = useRef(false);
	const parts = question.textParts || [];
	const solutions = Array.isArray(question.correctAnswer)
		? question.correctAnswer
		: [];

	useEffect(() => {
		textStartedRef.current = false;
	}, []);

	let answers: string[] = [];
	if (savedAnswer) {
		try {
			const parsed = JSON.parse(savedAnswer);
			if (Array.isArray(parsed)) answers = parsed;
		} catch {
			answers = [];
		}
	}

	return (
		<div className="space-y-4">
			{parts.map((part, partIndex) => {
				const isOpen = !!openParts[partIndex];
				const grade = selfGrades?.[getPartSelfGradeKey(question.id, partIndex)];
				return (
					// Parts are static and never reordered during a question session.
					// biome-ignore lint/suspicious/noArrayIndexKey: the part index is the stable identity in question data
					<div key={`${question.id}-part-${partIndex}`}>
						<div className="mb-1.5 flex items-baseline gap-2">
							<span className="bg-code text-fg-secondary shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-bold">
								{part.label || defaultLabel(partIndex)}
							</span>
							<span className="text-fg-secondary flex-1 text-sm">
								<InlineMarkdown>{part.text}</InlineMarkdown>
							</span>
							<span className="bg-accent-light text-accent-fg shrink-0 rounded px-1.5 py-0.5 font-mono text-xs whitespace-nowrap">
								{formatPoints(getTextPartPoints(question, partIndex))}
								{t.questionCard.pointsShort}
							</span>
						</div>
						<label
							htmlFor={`answer-${question.id}-${partIndex}`}
							className="sr-only"
						>
							{part.label || defaultLabel(partIndex)}{" "}
							{t.questionCard.yourAnswer}
						</label>
						<textarea
							id={`answer-${question.id}-${partIndex}`}
							aria-label={`${part.label || defaultLabel(partIndex)} ${t.questionCard.yourAnswer}`}
							className="border-border bg-surface-alt text-fg focus:border-accent focus-visible:ring-accent min-h-[100px] w-full resize-y rounded-lg border-2 p-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
							placeholder={t.questionCard.typeAnswer}
							autoComplete="off"
							spellCheck={false}
							value={answers[partIndex] || ""}
							onChange={(e) => {
								const next = [...answers];
								next[partIndex] = e.target.value;
								onAnswer(question.id, JSON.stringify(next));
								if (!textStartedRef.current) {
									textStartedRef.current = true;
									track("question_answer", {
										questionId: question.id,
										type: "multiple-text",
										action: "started",
										subjectId,
										topic: topicKey,
										examId: examId,
										mode,
									});
								}
							}}
							disabled={!!showResult}
						/>
						{showResult && typeof solutions[partIndex] === "string" && (
							<div className="mt-3 space-y-3">
								<button
									type="button"
									data-cuelume-press={isOpen ? "droplet" : "bloom"}
									className="text-accent-fg hover:text-accent-hover focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
									onClick={() => {
										const next = !isOpen;
										track("solution_toggle", {
											questionId: question.id,
											action: next ? "open" : "close",
											panel: "part",
											part: partIndex,
										});
										setOpenParts((prev) => ({ ...prev, [partIndex]: next }));
									}}
								>
									<BookOpen size={16} aria-hidden="true" />
									{isOpen
										? t.questionCard.closeSolution
										: t.questionCard.openSolution}
								</button>
								{isOpen && (
									<div className={solutionPanelClass}>
										<h4 className="text-fg-muted text-xs font-semibold tracking-wider uppercase">
											{t.questionCard.modelSolution}
										</h4>
										<Markdown className="text-fg-secondary font-sans text-xs">
											{solutions[partIndex]}
										</Markdown>
										{part.explanationImage && (
											<QuestionImage
												image={part.explanationImage}
												alt={t.questionCard.solutionIllustration}
												maxHeight="300px"
											/>
										)}
										{onSelfGrade && (
											<SelfGradeControls
												questionId={getPartSelfGradeKey(question.id, partIndex)}
												grade={grade}
												onSelfGrade={onSelfGrade}
											/>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

function FillQuestion({
	question,
	onAnswer,
	savedAnswer,
	showResult,
	selfGrade,
	onSelfGrade,
	subjectId,
	topicKey,
	examId,
	mode,
}: QuestionCardProps) {
	const t = useT();
	const statements = question.fillStatements || [];
	const correctAnswers = question.correctAnswer as string[];
	const automaticallyCorrect = isAutomaticallyCorrect(question, savedAnswer);
	let answers: string[] = [];
	if (savedAnswer) {
		try {
			const parsed = JSON.parse(savedAnswer);
			if (Array.isArray(parsed)) answers = parsed;
		} catch {
			answers = [];
		}
	}

	let blankIndex = 0;
	return (
		<div className="space-y-3">
			{statements.map((statement, statementIndex) => {
				const parts = statement.text.split("{{blank}}");
				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: statements are static question data
						key={`${question.id}-fill-${statementIndex}`}
						className="text-fg-secondary flex items-baseline gap-2 text-sm leading-relaxed"
					>
						{statement.label && (
							<span className="text-fg-muted shrink-0 font-semibold">
								{statement.label}
							</span>
						)}
						<span>
							{parts.map((part, partIndex) => {
								const currentBlankIndex = blankIndex;
								const hasBlankAfter = partIndex < parts.length - 1;
								if (hasBlankAfter) blankIndex++;
								return (
									<span
										// biome-ignore lint/suspicious/noArrayIndexKey: markdown fragments keep their source order
										key={`${question.id}-fill-part-${statementIndex}-${partIndex}`}
									>
										<InlineMarkdown>{part}</InlineMarkdown>
										{hasBlankAfter && (
											<>
												<label
													htmlFor={`${question.id}-blank-${currentBlankIndex}`}
													className="sr-only"
												>
													{statement.label || `${statementIndex + 1}`}{" "}
													{currentBlankIndex + 1}
												</label>
												<input
													id={`${question.id}-blank-${currentBlankIndex}`}
													name={`${question.id}-blank-${currentBlankIndex}`}
													type="text"
													autoComplete="off"
													enterKeyHint="next"
													aria-label={`${t.questionCard.typeAnswer} ${statement.label || statementIndex + 1}-${currentBlankIndex + 1}`}
													value={answers[currentBlankIndex] || ""}
													onChange={(event) => {
														const next = [...answers];
														next[currentBlankIndex] = event.target.value;
														onAnswer(question.id, JSON.stringify(next));
														track("question_answer", {
															questionId: question.id,
															type: "fill",
															blank: currentBlankIndex,
															subjectId,
															topic: topicKey,
															examId: examId,
															mode,
														});
													}}
													disabled={!!showResult}
													className={`mx-1 inline-block min-h-8 ${getFillInputWidth(correctAnswers[currentBlankIndex] || "")} focus-visible:ring-accent max-w-[min(100%,13rem)] rounded-md border-2 px-1.5 py-0.5 align-middle text-sm transition-colors transition-shadow duration-200 focus-visible:ring-2 focus-visible:outline-none ${
														showResult
															? isFillAnswerCorrect(
																	savedAnswer,
																	correctAnswers[currentBlankIndex] || "",
																	currentBlankIndex,
																)
																? "border-correct-border bg-correct-bg text-correct-fg"
																: "border-contribute-border bg-contribute-bg text-contribute-fg"
															: "border-border bg-surface"
													}`}
												/>
												{showResult && (
													<span className="text-fg-muted text-xs">
														({t.questionCard.modelSolution}:{" "}
														{correctAnswers[currentBlankIndex]})
													</span>
												)}
											</>
										)}
									</span>
								);
							})}
						</span>
					</div>
				);
			})}
			{showResult && onSelfGrade && !automaticallyCorrect && (
				<SelfGradeControls
					questionId={question.id}
					grade={selfGrade}
					onSelfGrade={onSelfGrade}
				/>
			)}
			{showResult && question.development && (
				<DevelopmentDisclosure
					development={question.development}
					questionId={question.id}
					subjectId={subjectId}
					topicKey={topicKey}
					examId={examId}
					mode={mode}
				/>
			)}
		</div>
	);
}

function TableFillQuestion({
	question,
	onAnswer,
	savedAnswer,
	showResult,
	selfGrade,
	onSelfGrade,
	subjectId,
	topicKey,
	examId,
	mode,
}: QuestionCardProps) {
	const t = useT();
	const table = question.tableFill;
	const correctAnswers = question.correctAnswer as string[];
	const automaticallyCorrect = isAutomaticallyCorrect(question, savedAnswer);
	let answers: string[] = [];
	if (savedAnswer) {
		try {
			const parsed = JSON.parse(savedAnswer);
			if (Array.isArray(parsed)) answers = parsed;
		} catch {
			answers = [];
		}
	}

	if (!table) return null;

	let blankIndex = 0;
	return (
		<div className="space-y-3">
			<div className="border-border overflow-x-auto rounded-lg border">
				<table className="divide-border min-w-full divide-y text-sm">
					<thead className="bg-surface">
						<tr>
							{table.headers.map((header) => (
								<th
									key={`${question.id}-table-fill-header-${header}`}
									scope="col"
									className="text-fg px-4 py-2 text-left font-semibold whitespace-nowrap"
								>
									<InlineMarkdown>{header}</InlineMarkdown>
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-border bg-surface-alt divide-y">
						{table.rows.map((row, rowIndex) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: table rows are static question data
							<tr key={`${question.id}-table-fill-row-${rowIndex}`}>
								{row.map((cell, columnIndex) => {
									const parts = cell.split("{{blank}}");
									return (
										<td
											// biome-ignore lint/suspicious/noArrayIndexKey: table cells are static question data
											key={`${question.id}-table-fill-cell-${rowIndex}-${columnIndex}`}
											className="text-fg-secondary px-4 py-2 align-middle"
										>
											{parts.map((part, partIndex) => {
												const currentBlankIndex = blankIndex;
												const hasBlankAfter = partIndex < parts.length - 1;
												if (hasBlankAfter) blankIndex++;
												return (
													<span
														// biome-ignore lint/suspicious/noArrayIndexKey: markdown fragments keep their source order
														key={`${question.id}-table-fill-part-${rowIndex}-${columnIndex}-${partIndex}`}
													>
														<InlineMarkdown>{part}</InlineMarkdown>
														{hasBlankAfter && (
															<>
																<label
																	htmlFor={`${question.id}-table-blank-${currentBlankIndex}`}
																	className="sr-only"
																>
																	{rowIndex + 1}-{columnIndex + 1} blank{" "}
																	{currentBlankIndex + 1}
																</label>
																<input
																	id={`${question.id}-table-blank-${currentBlankIndex}`}
																	name={`${question.id}-table-blank-${currentBlankIndex}`}
																	type="text"
																	autoComplete="off"
																	enterKeyHint="next"
																	aria-label={`${t.questionCard.typeAnswer} ${rowIndex + 1}-${columnIndex + 1}-${currentBlankIndex + 1}`}
																	value={answers[currentBlankIndex] || ""}
																	onChange={(event) => {
																		const next = [...answers];
																		next[currentBlankIndex] =
																			event.target.value;
																		onAnswer(question.id, JSON.stringify(next));
																		track("question_answer", {
																			questionId: question.id,
																			type: "table-fill",
																			blank: currentBlankIndex,
																			subjectId,
																			topic: topicKey,
																			examId: examId,
																			mode,
																		});
																	}}
																	disabled={!!showResult}
																	className={`mx-1 inline-block min-h-8 ${getFillInputWidth(correctAnswers[currentBlankIndex] || "")} focus-visible:ring-accent max-w-[min(100%,13rem)] rounded-md border-2 px-1.5 py-0.5 align-middle text-sm transition-colors transition-shadow duration-200 focus-visible:ring-2 focus-visible:outline-none ${
																		showResult
																			? isFillAnswerCorrect(
																					savedAnswer,
																					correctAnswers[currentBlankIndex] ||
																						"",
																					currentBlankIndex,
																				)
																				? "border-correct-border bg-correct-bg text-correct-fg"
																				: "border-contribute-border bg-contribute-bg text-contribute-fg"
																			: "border-border bg-surface"
																	}`}
																/>
																{showResult && (
																	<span className="text-fg-muted text-xs">
																		({t.questionCard.modelSolution}:{" "}
																		{correctAnswers[currentBlankIndex]})
																	</span>
																)}
															</>
														)}
													</span>
												);
											})}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{showResult && onSelfGrade && !automaticallyCorrect && (
				<SelfGradeControls
					questionId={question.id}
					grade={selfGrade}
					onSelfGrade={onSelfGrade}
				/>
			)}
			{showResult && question.development && (
				<DevelopmentDisclosure
					development={question.development}
					questionId={question.id}
					subjectId={subjectId}
					topicKey={topicKey}
					examId={examId}
					mode={mode}
				/>
			)}
		</div>
	);
}

function MatchingQuestion({
	question,
	onAnswer,
	savedAnswer,
	showResult,
	subjectId,
	topicKey,
	examId,
	mode,
}: QuestionCardProps) {
	const [isOpen, setIsOpen] = useState(false);
	const t = useT();
	const correctAnswer = question.correctAnswer as Record<string, string>;
	const items = Object.keys(correctAnswer);
	const letters = [...new Set(Object.values(correctAnswer))].sort((a, b) => {
		if (a === "V" && b === "F") return -1;
		if (a === "F" && b === "V") return 1;
		return a.localeCompare(b);
	});
	const [selected, setSelected] = useState<Record<string, string>>(() => {
		if (savedAnswer) {
			try {
				return JSON.parse(savedAnswer);
			} catch {
				return {};
			}
		}
		return {};
	});

	const handleSelect = (item: string, letter: string) => {
		if (showResult) return;
		const next = { ...selected, [item]: letter };
		setSelected(next);
		onAnswer(question.id, JSON.stringify(next));
	};

	return (
		<div className="space-y-2">
			{items.map((item, i) => {
				const userAnswer = selected[item];

				return (
					<div key={item} className="flex items-center gap-3 text-sm">
						<span className="text-fg-muted w-6 text-center font-mono text-xs">
							{i + 1}.
						</span>
						<span className="text-fg-secondary flex-1">
							<InlineMarkdown>{item}</InlineMarkdown>
						</span>
						<div className="flex gap-1">
							{letters.map((letter) => {
								const chosen = userAnswer === letter;
								const real = correctAnswer[item] === letter;
								let cls =
									"w-9 h-9 rounded-md border-2 text-xs font-bold font-mono active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition flex items-center justify-center";
								if (showResult && real) {
									cls += " bg-correct-bg border-correct-border text-correct-fg";
								} else if (showResult && chosen && !real) {
									cls +=
										" bg-incorrect-bg border-incorrect-border text-incorrect-fg";
								} else if (chosen) {
									cls += " bg-accent-light border-accent text-accent-fg";
								} else {
									cls +=
										" border-border text-fg-muted hover:border-fg-muted bg-surface-alt";
								}
								return (
									<button
										type="button"
										key={letter}
										data-cuelume-press
										className={cls}
										onClick={() => {
											track("question_answer", {
												questionId: question.id,
												type: "matching",
												item,
												answer: letter,
												subjectId,
												topic: topicKey,
												examId: examId,
												mode,
											});
											handleSelect(item, letter);
										}}
										disabled={!!showResult}
										aria-label={t.questionCard.matchItemTo
											.replace("{item}", item)
											.replace("{letter}", letter)}
									>
										{letter}
									</button>
								);
							})}
						</div>
					</div>
				);
			})}
			{showResult &&
				(question.explanation != null || question.explanationImage) && (
					<div className="mt-3 space-y-3">
						<button
							type="button"
							data-cuelume-press={isOpen ? "droplet" : "bloom"}
							className="text-accent-fg hover:text-accent-hover focus-visible:ring-accent hover:border-accent-border inline-flex items-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none active:scale-95"
							onClick={() => {
								const next = !isOpen;
								track("solution_toggle", {
									questionId: question.id,
									action: next ? "open" : "close",
									subjectId,
									topic: topicKey,
									examId: examId,
									mode,
								});
								setIsOpen(next);
							}}
						>
							<BookOpen size={16} aria-hidden="true" />
							{isOpen
								? t.questionCard.closeSolution
								: t.questionCard.openSolution}
						</button>
						{isOpen && (
							<div className={solutionPanelClass}>
								{question.explanation != null && (
									<Markdown className="text-fg-muted text-xs italic">
										{question.explanation}
									</Markdown>
								)}
								{question.explanationImage && (
									<QuestionImage
										image={question.explanationImage}
										alt={t.questionCard.solutionIllustration}
										maxHeight="300px"
									/>
								)}
							</div>
						)}
					</div>
				)}
		</div>
	);
}

export default function QuestionCard(props: QuestionCardProps) {
	const questionProps = props;
	const { question } = questionProps;
	const t = useT();

	return (
		<div className="flex flex-col rounded-xl shadow-sm">
			<div className="border-border bg-surface-alt rounded-t-xl border-x-2 border-t-2 px-4 py-4 sm:px-6 sm:py-6">
				<div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
					<span className="bg-code text-fg-secondary rounded px-2 py-0.5 font-mono text-xs">
						{t.questionCard.questionPrefix}
						{questionProps.index + 1}/{questionProps.total}
					</span>
					<span className="bg-accent-light text-accent-fg rounded px-2 py-0.5 font-mono text-xs">
						{formatPoints(question.points)}
						{t.questionCard.pointsShort}
					</span>
					<span className="text-fg-muted order-last flex w-full min-w-0 items-center gap-0.5 text-xs sm:order-none sm:w-auto sm:flex-1">
						{questionProps.megatopicLabel && (
							<>
								<span className="truncate">{questionProps.megatopicLabel}</span>
								<CaretRight
									size={12}
									weight="Filled"
									aria-hidden="true"
									className="shrink-0"
								/>
							</>
						)}
						<span className="truncate">{questionProps.topicLabel}</span>
					</span>
					{(question.repeated || questionProps.examTitle) && (
						<div className="ml-auto flex items-center gap-2 sm:ml-0">
							{question.repeated && (
								<span className="border-reward-border bg-reward-light text-reward-fg flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold">
									<Restart size={10} aria-hidden="true" />
									{t.questionCard.repeated}
								</span>
							)}
							{questionProps.examTitle && (
								<span className="text-fg-muted flex items-center gap-1 text-right text-xs whitespace-nowrap">
									<DocText size={14} aria-hidden="true" />
									{questionProps.examTitle}
								</span>
							)}
						</div>
					)}
				</div>
				<div>
					<Markdown className="text-fg mb-4 text-sm font-medium">
						{question.question}
					</Markdown>
					{question.image && (
						<div className="mb-4">
							<QuestionImage
								image={question.image}
								alt={`Illustration for ${question.id}`}
								maxHeight="400px"
							/>
						</div>
					)}
				</div>
				{question.type === "mc" && (
					<MCQuestion
						key={`mc-${question.id}-${questionProps.savedAnswer || ""}`}
						{...questionProps}
					/>
				)}
				{question.type === "text" && <TextQuestion {...questionProps} />}
				{question.type === "multiple-text" && (
					<MultipleTextQuestion {...questionProps} />
				)}
				{question.type === "fill" && <FillQuestion {...questionProps} />}
				{question.type === "table-fill" && (
					<TableFillQuestion {...questionProps} />
				)}
				{question.type === "matching" && (
					<MatchingQuestion
						key={`match-${question.id}-${questionProps.savedAnswer || ""}`}
						{...questionProps}
					/>
				)}
			</div>
			<div className="bg-card-footer border-card-footer-border text-fg-muted flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-b-xl border-x-2 border-b-2 px-4 py-1 text-xs sm:px-6">
				<span className="text-fg-muted inline-flex min-w-0 items-center gap-1.5 text-xs font-semibold">
					<span
						className="question-card-brand-mark bg-fg-muted size-[18px] shrink-0"
						aria-hidden="true"
					/>
					<span className="hidden truncate sm:inline">Pásame Exámenes</span>
				</span>
				<div className="flex min-w-0 items-center justify-end gap-2">
					<span className="text-fg-muted min-w-0 truncate font-mono text-[10px] select-all">
						{question.id}
					</span>
					<a
						data-tour="report-issue"
						data-cuelume-hover="whisper"
						data-cuelume-press="whisper"
						href={buildReportUrl(
							question,
							questionProps.subjectId,
							t.questionCard.reportIssueTitle,
							t.questionCard.questionTypes,
						)}
						target="_blank"
						rel="noopener noreferrer"
						className="text-fg-muted hover:text-incorrect-fg focus-visible:ring-incorrect-fg inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
						onClick={() => {
							track("report_issue", {
								questionId: question.id,
								subjectId: questionProps.subjectId,
								topic: questionProps.topicKey,
								examId: questionProps.examId,
								mode: questionProps.mode,
							});
						}}
					>
						<TriangleWarning size={16} aria-hidden="true" />
						{t.questionCard.reportIssue}
					</a>
				</div>
			</div>
		</div>
	);
}
