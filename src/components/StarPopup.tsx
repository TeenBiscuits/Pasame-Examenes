import { useCallback, useEffect, useRef } from "react";
import { StarSparkle } from "reicon-react";
import { useT } from "../i18n/hooks";
import { closeDialog, showDialog, useDialogDismiss } from "../lib/dialog";
import { playSound } from "../lib/sound";
import {
	claimStarPopupMilestone,
	STAR_POPUP_PROGRESS_EVENT,
	shouldShowRandomStarPopup,
	writeStarPopupDismissed,
} from "../lib/star-popup";
import { track } from "../lib/umami";
import { compactModalDialogClass } from "./Modal";

function StarIcon() {
	return <StarSparkle size={20} weight="Filled" aria-hidden="true" />;
}

function handleSparkle() {
	playSound("success");
}

export default function StarPopup() {
	const t = useT();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const openRef = useRef<boolean | null>(null);
	const triggerRef = useRef<"first_questions" | "random">("random");

	const finish = useCallback((clickedStar: boolean) => {
		if (!openRef.current) return;
		openRef.current = false;
		writeStarPopupDismissed();
		closeDialog(dialogRef.current);
		playSound(clickedStar ? "success" : "close");
		track(clickedStar ? "star_popup_click" : "star_popup_dismiss", {
			trigger: triggerRef.current,
		});
	}, []);

	const dismiss = useCallback(() => finish(false), [finish]);
	const dismissRef = useRef(dismiss);

	useDialogDismiss(dialogRef, () => dismissRef.current());

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const showMilestone = () => {
			if (!claimStarPopupMilestone()) return;
			triggerRef.current = "first_questions";
			openRef.current = true;
			if (!dialog.open) {
				showDialog(dialog);
				track("star_popup_show", { trigger: triggerRef.current });
			}
		};
		const handleClose = () => dismissRef.current();
		dialog.addEventListener("close", handleClose);
		window.addEventListener(STAR_POPUP_PROGRESS_EVENT, showMilestone);
		window.addEventListener("storage", showMilestone);

		showMilestone();
		if (openRef.current === null) {
			openRef.current = shouldShowRandomStarPopup();
		}
		if (openRef.current && !dialog.open) {
			showDialog(dialog);
			track("star_popup_show", { trigger: triggerRef.current });
		}
		return () => {
			dialog.removeEventListener("close", handleClose);
			window.removeEventListener(STAR_POPUP_PROGRESS_EVENT, showMilestone);
			window.removeEventListener("storage", showMilestone);
		};
	}, []);

	function handleStar() {
		finish(true);
	}

	const repoUrl = "https://github.com/TeenBiscuits/Pasame-Examenes";

	return (
		<dialog
			ref={dialogRef}
			closedby="any"
			className={`${compactModalDialogClass} p-6`}
			aria-labelledby="star-popup-title"
		>
			<div className="text-center">
				<button
					type="button"
					aria-label={t.starPopup.sparkleButton}
					onClick={handleSparkle}
					className="bg-reward-light text-github-star mx-auto mb-4 flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color,scale] duration-150 ease-out hover:bg-reward-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reward-fg active:scale-[0.96]"
				>
					<StarIcon />
				</button>

				<h2
					id="star-popup-title"
					className="text-fg mb-2 text-lg font-semibold"
				>
					{t.starPopup.title}
				</h2>
				<p className="text-fg-secondary mb-6 text-sm">{t.starPopup.subtitle}</p>

				<div className="flex flex-col gap-2">
					<a
						href={repoUrl}
						target="_blank"
						rel="noopener noreferrer"
						data-cuelume-hover="sparkle"
						data-cuelume-navigate
						onClick={handleStar}
						className="bg-reward text-on-reward hover:bg-reward-hover inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold no-underline transition-[background-color,scale] duration-150 ease-out active:scale-[0.96]"
					>
						<StarIcon />
						{t.starPopup.starButton}
					</a>
					<button
						type="button"
						onClick={dismiss}
						className="text-fg-muted hover:text-fg-secondary hover:bg-surface cursor-pointer rounded-lg px-4 py-2 text-sm transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.96]"
					>
						{t.starPopup.dismiss}
					</button>
				</div>
			</div>
		</dialog>
	);
}
