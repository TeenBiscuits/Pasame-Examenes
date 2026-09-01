import { useRef, useSyncExternalStore } from "react";
import { Book, Trash5 } from "reicon-react";
import AddSubjectModal, {
	type AddSubjectModalHandle,
} from "../components/AddSubjectModal";
import FaqSection from "../components/FaqSection";
import Hero from "../components/Hero";
import StudyQuote from "../components/StudyQuote";
import SubjectCard from "../components/SubjectCard";
import { useT } from "../i18n/hooks";
import type { HomeSubjectBuildStats } from "../lib/content-stats";
import { LangLink } from "../lib/lang-link";
import {
	clearRecentSubjects,
	getRecentSubjects,
	getServerRecentSubjects,
	recordSubjectClick,
	subscribeToRecentSubjects,
} from "../lib/recent";
import { track } from "../lib/umami";
import { subjects } from "../subjects";

const MAX_SLOTS = 3;

function TrashIcon() {
	return <Trash5 className="size-4" weight="Filled" />;
}

function PlaceholderCard() {
	return (
		<div
			className="border-border block w-full rounded-xl border-2 border-dashed p-5"
			aria-hidden="true"
		>
			<div className="invisible flex items-center gap-3">
				<span className="text-2xl">&nbsp;</span>
				<span className="text-base font-semibold">&nbsp;</span>
			</div>
		</div>
	);
}

function slotClassName(i: number, isPlaceholder: boolean): string | undefined {
	if (isPlaceholder) {
		if (i >= 2) return "hidden lg:block";
		return "hidden sm:block";
	}
	if (i >= 2) return "block sm:hidden lg:block";
	return undefined;
}

export default function Home({
	subjectStats,
}: {
	subjectStats: Record<string, HomeSubjectBuildStats>;
}) {
	const t = useT();
	const modalRef = useRef<AddSubjectModalHandle>(null);
	const recentIds = useSyncExternalStore(
		subscribeToRecentSubjects,
		getRecentSubjects,
		getServerRecentSubjects,
	);
	const recentSubjects = recentIds
		.map((id) => subjects.find((s) => s.id === id))
		.filter((s): s is NonNullable<typeof s> => s != null);

	function handleClearRecent() {
		clearRecentSubjects();
		track("clear_recent_subjects", { count: recentSubjects.length });
	}

	const slots = Array.from({ length: MAX_SLOTS }, (_, i) => {
		const subject = recentSubjects[i];
		return subject
			? { type: "subject" as const, subject }
			: { type: "placeholder" as const };
	});

	return (
		<div className="relative">
			<Hero
				emojis={subjects.map((s) => s.icon)}
				className="animate-fade-in animate-duration-fast"
			>
				<h1 className="text-fg mb-3 text-4xl font-semibold sm:text-5xl lg:text-6xl">
					{t.home.title}
				</h1>
				<p className="text-fg-secondary mx-auto max-w-2xl text-base sm:text-lg lg:text-xl">
					{t.home.subtitle}
				</p>
			</Hero>
			<div className="animate-fade-in animate-duration-fast mx-auto max-w-6xl px-4 text-center">
				{recentSubjects.length > 0 && (
					<div className="mb-6 text-left">
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-fg-muted text-sm font-semibold tracking-wide uppercase">
								{t.home.recentlyVisited}
							</h2>
							<button
								type="button"
								data-cuelume-press="whisper"
								onClick={handleClearRecent}
								className="text-fg-muted hover:text-incorrect-fg rounded p-1 transition-colors"
								aria-label={t.home.clearRecent}
								title={t.home.clearRecent}
							>
								<TrashIcon />
							</button>
						</div>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{slots.map((slot, i) => (
								<div
									key={
										slot.type === "subject"
											? slot.subject.id
											: `placeholder-${i}`
									}
									className={slotClassName(i, slot.type === "placeholder")}
								>
									{slot.type === "subject" ? (
										<LangLink
											to={`/${slot.subject.id}`}
											data-cuelume-hover="tick"
											data-cuelume-press
											onClick={() => {
												recordSubjectClick(slot.subject.id);
												track("subject_card_click", {
													subjectId: slot.subject.id,
													location: "recent",
												});
											}}
											className="interactive-card border-border bg-surface-alt block w-full rounded-xl border-2 px-5 py-4 hover:shadow-md"
										>
											<div className="flex items-center gap-3">
												<span className="text-4xl" aria-hidden="true">
													{slot.subject.icon}
												</span>
												<span className="text-fg text-base font-semibold">
													{slot.subject.name}
												</span>
											</div>
										</LangLink>
									) : (
										<PlaceholderCard />
									)}
								</div>
							))}
						</div>
						<hr className="border-border mt-6" />
					</div>
				)}

				<div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
					{subjects.map((subject) => (
						<div key={subject.id}>
							<SubjectCard subject={subject} stats={subjectStats[subject.id]} />
						</div>
					))}
					<div>
						<button
							type="button"
							data-cuelume-hover="tick"
							data-cuelume-press="bloom"
							onClick={() => {
								modalRef.current?.open();
								track("add_subject_modal_open");
							}}
							className="interactive-card border-border text-fg-muted hover:text-accent-fg hover:border-accent hover:bg-accent-light/30 block h-full min-h-[160px] w-full cursor-pointer rounded-xl border-2 border-dashed p-5 hover:shadow-md"
						>
							<div className="flex h-full flex-col items-center justify-center gap-2">
								<span className="text-4xl leading-none font-light">
									<Book className="size-8" aria-hidden="true" />
								</span>
								<span className="text-sm font-medium">{t.home.addSubject}</span>
							</div>
						</button>
					</div>
				</div>

				<FaqSection />

				<AddSubjectModal ref={modalRef} onClose={() => {}} />
			</div>
			<StudyQuote quote={t.home.quote} />
		</div>
	);
}
