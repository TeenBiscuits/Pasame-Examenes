import { useEffect, useRef, useState } from "react";
import { XSquare } from "reicon-react";
import { useT } from "../i18n/hooks";
import { playSound } from "../lib/sound";
import { usePresence } from "../presence/hooks";
import { useProfile } from "../profile/hooks";
import {
	isValidUsername,
	MAX_USERNAME_LENGTH,
	MIN_USERNAME_LENGTH,
	sanitizeUsername,
} from "../profile/profile";
import ProfileAvatar from "./ProfileAvatar";

const PROMPT_DELAY_MS = 2_000;

export default function ProfileWelcomePrompt() {
	const t = useT();
	const {
		profile,
		isReady,
		saveUsername,
		completeNamePrompt,
		dismissNamePrompt,
		setNameShared,
	} = useProfile();
	const { shareUsername } = usePresence();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [usernameDraft, setUsernameDraft] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		if (!isReady || profile.hasCompletedNamePrompt) return;
		setUsernameDraft("");

		let idleId: number | undefined;
		const delayId = window.setTimeout(() => {
			const reveal = () => {
				if (
					document.visibilityState === "visible" &&
					!document.querySelector("dialog[open]")
				) {
					setIsOpen(true);
				}
			};
			if ("requestIdleCallback" in window) {
				idleId = window.requestIdleCallback(reveal, { timeout: 1_000 });
			} else {
				reveal();
			}
		}, PROMPT_DELAY_MS);

		return () => {
			window.clearTimeout(delayId);
			if (idleId !== undefined && "cancelIdleCallback" in window) {
				window.cancelIdleCallback(idleId);
			}
		};
	}, [isReady, profile.hasCompletedNamePrompt]);

	useEffect(() => {
		if (!isOpen) return;
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== "Escape") return;
			event.preventDefault();
			dismiss();
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (isOpen && !dialog.open) dialog.show();
		if (!isOpen && dialog.open) dialog.close();
	}, [isOpen]);

	function dismiss() {
		dismissNamePrompt();
		setIsOpen(false);
		playSound("droplet");
	}

	async function submit() {
		const username = sanitizeUsername(usernameDraft || profile.username);
		if (!isValidUsername(username) || !saveUsername(username)) {
			setHasError(true);
			return;
		}

		setIsSubmitting(true);
		setHasError(false);
		try {
			const result = await shareUsername(username);
			setNameShared(result?.isPublic ?? false);
			completeNamePrompt();
			setIsOpen(false);
			playSound("chime");
		} finally {
			setIsSubmitting(false);
		}
	}

	if (!isReady) return null;

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby="profile-welcome-title"
			className="border-border bg-surface-alt fixed right-4 bottom-22 left-4 z-50 mx-auto w-auto max-w-md rounded-2xl border p-4 shadow-xl sm:right-auto sm:bottom-4 sm:left-4 sm:mx-0 sm:w-[26rem] sm:p-5"
		>
			<div className="grid grid-cols-[auto_minmax(0,1fr)] items-stretch gap-x-3">
				<div className="bg-surface size-12 shrink-0 overflow-hidden rounded-xl outline outline-black/10 dark:outline-white/10">
					<ProfileAvatar
						username={usernameDraft || profile.username}
						size={48}
						animated
						className="size-full rounded-xl"
					/>
				</div>
				<div className="flex min-w-0 items-start gap-3">
					<div className="min-w-0 flex-1">
						<h2 id="profile-welcome-title" className="text-fg font-semibold">
							{t.profileWelcome.title}
						</h2>
						<p className="text-fg-muted mt-1 text-sm leading-relaxed">
							{t.profileWelcome.description}
						</p>
					</div>
					<button
						type="button"
						onClick={dismiss}
						className="text-fg-muted hover:bg-surface hover:text-fg focus-visible:ring-accent inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-[color,background-color,scale] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none active:scale-[0.96]"
						aria-label={t.profileWelcome.close}
					>
						<XSquare className="size-5" aria-hidden="true" />
					</button>
				</div>
			</div>

			<form
				className="mt-4"
				autoComplete="off"
				data-1p-ignore="true"
				data-lpignore="true"
				data-bwignore="true"
				data-dashlane-ignore="true"
				data-protonpass-ignore="true"
				onSubmit={(event) => {
					event.preventDefault();
					void submit();
				}}
			>
				<label htmlFor="profile-welcome-username" className="sr-only">
					{t.profileWelcome.username}
				</label>
				<div className="border-border bg-surface focus-within:border-accent focus-within:ring-accent flex min-h-12 items-center rounded-xl border-2 px-3 focus-within:ring-2">
					<span className="text-fg-muted font-mono text-xl" aria-hidden="true">
						@
					</span>
					<input
						id="profile-welcome-username"
						type="text"
						value={usernameDraft}
						placeholder={profile.username}
						onChange={(event) => {
							setUsernameDraft(sanitizeUsername(event.target.value));
							setHasError(false);
						}}
						minLength={MIN_USERNAME_LENGTH}
						maxLength={MAX_USERNAME_LENGTH}
						autoComplete="off"
						autoCapitalize="none"
						autoCorrect="off"
						data-1p-ignore="true"
						data-lpignore="true"
						data-bwignore="true"
						data-dashlane-ignore="true"
						data-protonpass-ignore="true"
						data-form-type="other"
						spellCheck={false}
						aria-invalid={hasError || undefined}
						aria-describedby={hasError ? "profile-welcome-error" : undefined}
						className="text-fg placeholder:text-fg-secondary min-w-0 flex-1 bg-transparent py-2 font-mono text-xl outline-none"
					/>
				</div>
				{hasError ? (
					<p
						id="profile-welcome-error"
						className="text-incorrect-fg mt-2 text-sm"
						role="alert"
					>
						{t.profileWelcome.invalidUsername}
					</p>
				) : null}
				<div className="mt-3 flex items-center gap-3">
					<button
						type="submit"
						disabled={isSubmitting}
						className="bg-accent text-on-accent hover:bg-accent-hover focus-visible:ring-accent inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-[background-color,scale] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none active:scale-[0.96] disabled:cursor-wait disabled:opacity-70"
					>
						{t.profileWelcome.continue}
					</button>
					<button
						type="button"
						onClick={dismiss}
						className="text-fg-secondary hover:text-fg focus-visible:ring-accent inline-flex min-h-11 cursor-pointer items-center rounded-xl px-2 py-2.5 text-sm font-medium transition-[color,scale] duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none active:scale-[0.96]"
					>
						{t.profileWelcome.notNow}
					</button>
				</div>
				<p className="text-fg-muted mt-3 text-right text-[0.65rem] leading-snug">
					{t.profileWelcome.notCookieBanner}
				</p>
			</form>
		</dialog>
	);
}
