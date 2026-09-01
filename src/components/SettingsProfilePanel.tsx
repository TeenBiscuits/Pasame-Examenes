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
}: {
	username: string;
	onUsernameChange: (username: string) => void;
	onShare: () => void;
	onStopSharing: () => void;
	isNameShared: boolean;
	isSubmitting: boolean;
	status: "idle" | "saved" | "error";
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
		</div>
	);
}
