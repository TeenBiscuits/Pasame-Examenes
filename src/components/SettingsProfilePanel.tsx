import { useT } from "../i18n/hooks";
import UsernameField from "./UsernameField";

export default function SettingsProfilePanel({
	username,
	onUsernameChange,
	onShare,
	onStopSharing,
	isNameShared,
	isSubmitting,
	status,
	isStudyPresenceBadgeVisible,
	onStudyPresenceBadgeVisibilityChange,
}: {
	username: string;
	onUsernameChange: (username: string) => void;
	onShare: () => void;
	onStopSharing: () => void;
	isNameShared: boolean;
	isSubmitting: boolean;
	status: "idle" | "saved" | "error";
	isStudyPresenceBadgeVisible: boolean;
	onStudyPresenceBadgeVisibilityChange: (isVisible: boolean) => void;
}) {
	const t = useT();

	return (
		<div className="space-y-8">
			<div>
				<h2
					id="settings-profile-title"
					className="text-fg text-base font-semibold"
				>
					{t.settings.profileSocial}
				</h2>
				<p className="text-fg-muted mt-1 text-sm leading-relaxed">
					{t.settings.profileSocialDescription}
				</p>
			</div>

			<UsernameField username={username} onUsernameChange={onUsernameChange} />

			<div className="mx-auto flex w-full max-w-xl flex-wrap items-center justify-center gap-3">
				<button
					type="button"
					onClick={onShare}
					disabled={isSubmitting}
					className="bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-accent inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-[background-color,scale] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none active:scale-[0.96] disabled:cursor-wait disabled:opacity-70"
				>
					{t.settings.shareUsername}
				</button>
				{isNameShared ? (
					<button
						type="button"
						onClick={onStopSharing}
						disabled={isSubmitting}
						className="text-fg-secondary hover:bg-surface hover:text-fg focus-visible:ring-accent inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium transition-[background-color,color,scale] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none active:scale-[0.96] disabled:cursor-wait disabled:opacity-70"
					>
						{t.settings.stopSharingUsername}
					</button>
				) : null}
			</div>
			<p
				className={`min-h-5 text-center text-sm ${status === "error" ? "text-incorrect-fg" : "text-fg-muted"}`}
				role="status"
			>
				{status === "saved"
					? t.settings.usernameSaved
					: status === "error"
						? t.settings.usernameSaveError
						: null}
			</p>

			<div className="border-border mx-auto flex w-full max-w-xl items-center justify-between gap-4 border-t pt-6">
				<div className="min-w-0">
					<p
						id="settings-show-presence-label"
						className="text-fg text-sm font-medium"
					>
						{t.settings.showStudyPresenceBadge}
					</p>
					<p className="text-fg-muted mt-1 text-sm leading-relaxed">
						{t.settings.showStudyPresenceBadgeDescription}
					</p>
				</div>
				<button
					type="button"
					role="switch"
					aria-checked={isStudyPresenceBadgeVisible}
					aria-labelledby="settings-show-presence-label"
					onClick={() =>
						onStudyPresenceBadgeVisibilityChange(!isStudyPresenceBadgeVisible)
					}
					className={`focus-visible:ring-accent relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none ${
						isStudyPresenceBadgeVisible
							? "border-accent bg-accent"
							: "border-border bg-surface-alt"
					}`}
				>
					<span
						aria-hidden="true"
						className={`bg-surface absolute top-1 size-[1.125rem] rounded-full shadow-sm transition-transform duration-150 ${
							isStudyPresenceBadgeVisible
								? "translate-x-[1.625rem]"
								: "translate-x-1"
						}`}
					/>
				</button>
			</div>
		</div>
	);
}
