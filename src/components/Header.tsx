import { useLocation, useParams } from "@tanstack/react-router";
import { useLang, useT } from "../i18n/hooks";
import { LangLink as Link } from "../lib/lang-link";
import { track } from "../lib/umami";
import { getSubject } from "../subjects";
import GitHubStarButton from "./GitHubStarButton";
import SettingsModal from "./SettingsModal";

function acronym(name: string): string {
	const letters = name.replace(/[^A-Z]/g, "");
	return letters || name.charAt(0).toUpperCase();
}

export default function Header() {
	const location = useLocation();
	const { subjectId } = useParams({ strict: false });
	const { lang } = useLang();
	const t = useT();
	const subject = subjectId ? getSubject(subjectId) : null;

	const abbr = subject ? acronym(subject.name) : "";

	const subjectPath = subjectId ? `/${lang}/${subjectId}` : "";
	const subjectLinkBase = `inline-flex h-10 items-center rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors ${
		subjectId &&
		(
			location.pathname === subjectPath ||
				location.pathname.startsWith(`${subjectPath}/`)
		)
			? "bg-accent-light text-accent-fg"
			: "text-fg-secondary hover:text-fg"
	}`;
	const acronymLinkClasses = `px-1.5 sm:px-3 ${subjectLinkBase}`;
	const subjectLinkClasses = `min-w-0 truncate px-3 ${subjectLinkBase}`;

	return (
		<header className="safe-area-top bg-surface-alt border-border border-b sm:sticky sm:top-0 sm:z-50">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
				<Link
					to="/"
					data-cuelume-hover="sparkle"
					data-cuelume-press
					className="text-fg hover:text-accent-fg focus-visible:ring-accent group flex items-center gap-2 rounded-md text-lg font-bold transition-colors focus-visible:ring-2 focus-visible:outline-none"
					onClick={() => {
						track("nav_click", { target: "home" });
					}}
				>
					<img
						src="/favicon.svg"
						alt="Logotipo de Pásame Exámenes"
						width={36}
						height={36}
						className="size-9"
					/>
					<p className="text-sm sm:text-lg">{t.home.title}</p>
				</Link>
				<div className="flex items-center gap-1 text-sm sm:gap-3">
					{subject && (
						<>
							<Link
								to={`/${subjectId}`}
								data-cuelume-hover="tick"
								data-cuelume-press
								className={`md:hidden ${acronymLinkClasses}`}
								onClick={() => {
									track("nav_click", {
										target: "subject_home",
										subjectId: subjectId || "",
									});
								}}
								title={subject.name}
							>
								{abbr}
							</Link>
							<Link
								to={`/${subjectId}`}
								data-cuelume-hover="tick"
								data-cuelume-press
								className={`hidden md:inline-flex ${subjectLinkClasses}`}
								onClick={() => {
									track("nav_click", {
										target: "subject_home",
										subjectId: subjectId || "",
									});
								}}
								title={subject.name}
							>
								{subject.name}
							</Link>
						</>
					)}
					<GitHubStarButton />
					<SettingsModal />
				</div>
			</div>
		</header>
	);
}
