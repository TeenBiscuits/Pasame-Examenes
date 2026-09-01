import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import { useRef } from "react";
import { useT } from "../i18n/hooks";
import { playSound } from "../lib/sound";
import { useProfile } from "../profile/hooks";
import {
	BLOBATAR_TONE,
	MAX_USERNAME_LENGTH,
	MIN_USERNAME_LENGTH,
} from "../profile/profile";

function getCaretPosition(input: HTMLInputElement) {
	const selectionStart = input.selectionStart;
	if (selectionStart === null) return null;

	const styles = getComputedStyle(input);
	const mirror = document.createElement("span");
	mirror.style.cssText =
		"position:absolute;top:0;left:-9999px;visibility:hidden;white-space:pre";
	for (const property of [
		"fontFamily",
		"fontSize",
		"fontWeight",
		"fontStyle",
		"fontVariant",
		"letterSpacing",
		"textTransform",
	] as const) {
		mirror.style[property] = styles[property];
	}
	mirror.textContent = input.value.slice(0, selectionStart);
	document.body.appendChild(mirror);
	const textWidth = mirror.getBoundingClientRect().width;
	mirror.remove();

	const bounds = input.getBoundingClientRect();
	const start =
		bounds.left +
		(Number.parseFloat(styles.borderLeftWidth) || 0) +
		(Number.parseFloat(styles.paddingLeft) || 0);
	const end =
		bounds.right -
		(Number.parseFloat(styles.borderRightWidth) || 0) -
		(Number.parseFloat(styles.paddingRight) || 0);

	return {
		x: Math.min(Math.max(start - input.scrollLeft + textWidth, start), end),
		y: bounds.top + bounds.height / 2,
	};
}

export default function UsernameField({
	username,
	onUsernameChange,
}: {
	username: string;
	onUsernameChange: (username: string) => void;
}) {
	const t = useT();
	const { profile } = useProfile();
	const inputRef = useRef<HTMLInputElement>(null);
	const { ref: blobatarRef, lookAt } = useGaze({
		travel: 4,
		lookAt: "pointer",
	});

	function aimAtCaret() {
		if (!inputRef.current) return;
		const position = getCaretPosition(inputRef.current);
		if (position) lookAt(position);
	}

	return (
		<section className="mx-auto w-full max-w-sm space-y-4 sm:max-w-[25rem] sm:space-y-5">
			<button
				type="button"
				data-cuelume-press="bloom"
				onClick={() => playSound("chime")}
				aria-label={t.settings.playBlobatar}
				title={t.settings.playBlobatar}
				className="bg-surface-alt focus-visible:ring-accent mx-auto grid size-36 cursor-pointer place-items-center rounded-3xl shadow-sm outline outline-black/10 transition-[scale,box-shadow] duration-150 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.96] sm:size-52 sm:rounded-[2rem] dark:outline-white/10"
			>
				<Blobatar
					ref={blobatarRef}
					name={username || profile.username}
					size={176}
					tone={BLOBATAR_TONE}
					animate="always"
					className="pointer-events-none size-32 rounded-2xl sm:size-44"
				/>
			</button>

			<div className="space-y-2">
				<label
					htmlFor="settings-profile-name"
					className="text-fg text-sm font-semibold sm:text-base"
				>
					{t.settings.username}
				</label>
				<div className="border-border bg-surface focus-within:border-accent focus-within:ring-accent flex min-h-12 items-center rounded-xl border-2 px-3 focus-within:ring-2 sm:min-h-14 sm:px-4">
					<span
						className="text-fg-muted font-mono text-xl sm:text-2xl"
						aria-hidden="true"
					>
						@
					</span>
					<input
						ref={inputRef}
						id="settings-profile-name"
						type="text"
						value={username}
						onChange={(event) => {
							onUsernameChange(event.target.value);
							requestAnimationFrame(aimAtCaret);
						}}
						onKeyUp={aimAtCaret}
						onClick={aimAtCaret}
						onSelect={aimAtCaret}
						onFocus={() => requestAnimationFrame(aimAtCaret)}
						onBlur={() => lookAt("pointer")}
						minLength={MIN_USERNAME_LENGTH}
						maxLength={MAX_USERNAME_LENGTH}
						size={MAX_USERNAME_LENGTH}
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
						aria-describedby="settings-username-description"
						className="username-field__input text-fg w-[24ch] max-w-[calc(100%-1.5rem)] flex-none bg-transparent py-2 font-mono outline-none"
					/>
				</div>
				<p
					id="settings-username-description"
					className="text-fg-muted text-xs leading-relaxed sm:text-sm"
				>
					{t.settings.usernameDescription}
				</p>
			</div>
		</section>
	);
}
