import { type RefObject, useEffect, useRef } from "react";

export type DialogDismissMethod = "backdrop" | "esc";

interface DialogCloseState {
	timer: number | null;
	transitionEnd: ((event: TransitionEvent) => void) | null;
}

const closeStates = new WeakMap<HTMLDialogElement, DialogCloseState>();
const openingTimers = new WeakMap<HTMLDialogElement, number>();
const focusRestoreTargets = new WeakMap<HTMLDialogElement, HTMLElement>();

function parseCssTime(value: string) {
	const trimmed = value.trim();
	if (trimmed.endsWith("ms")) return Number.parseFloat(trimmed);
	if (trimmed.endsWith("s")) return Number.parseFloat(trimmed) * 1000;
	return 0;
}

function getTransitionDuration(dialog: HTMLDialogElement) {
	const styles = window.getComputedStyle(dialog);
	const durations = styles.transitionDuration.split(",").map(parseCssTime);
	const delays = styles.transitionDelay.split(",").map(parseCssTime);

	return durations.reduce(
		(longest, duration, index) =>
			Math.max(longest, duration + (delays[index] ?? delays.at(-1) ?? 0)),
		0,
	);
}

function clearCloseState(dialog: HTMLDialogElement) {
	const state = closeStates.get(dialog);
	if (!state) return;

	if (state.timer !== null) window.clearTimeout(state.timer);
	if (state.transitionEnd) {
		dialog.removeEventListener("transitionend", state.transitionEnd);
	}
	closeStates.delete(dialog);
}

function clearOpeningState(dialog: HTMLDialogElement) {
	const timer = openingTimers.get(dialog);
	if (timer === undefined) return;

	window.clearTimeout(timer);
	openingTimers.delete(dialog);
}

function restoreFocus(dialog: HTMLDialogElement) {
	const target = focusRestoreTargets.get(dialog);
	focusRestoreTargets.delete(dialog);
	if (!target?.isConnected) return;

	target.focus({ preventScroll: true });
}

export function showDialog(dialog: HTMLDialogElement | null) {
	if (!dialog) return;

	clearCloseState(dialog);
	clearOpeningState(dialog);
	dialog.classList.remove("is-closing");

	if (dialog.open) {
		dialog.classList.remove("is-opening");
		dialog.focus({ preventScroll: true });
		return;
	}

	const activeElement = document.activeElement;
	if (
		activeElement instanceof HTMLElement &&
		activeElement !== document.body &&
		activeElement !== dialog
	) {
		focusRestoreTargets.set(dialog, activeElement);
	}

	dialog.classList.add("is-opening");
	dialog.tabIndex = -1;
	dialog.showModal();
	dialog.focus({ preventScroll: true });
	void dialog.offsetWidth;

	const timer = window.setTimeout(() => {
		openingTimers.delete(dialog);
		if (dialog.open) dialog.classList.remove("is-opening");
	}, 0);
	openingTimers.set(dialog, timer);
}

export function closeDialog(
	dialog: HTMLDialogElement | null,
	afterClose?: () => void,
) {
	if (!dialog?.open) {
		if (dialog) clearOpeningState(dialog);
		afterClose?.();
		return;
	}
	if (closeStates.has(dialog)) return;

	clearOpeningState(dialog);
	dialog.classList.remove("is-opening");
	dialog.classList.add("is-closing");

	const finish = () => {
		clearCloseState(dialog);
		dialog.classList.remove("is-closing");
		if (dialog.open) dialog.close();
		restoreFocus(dialog);
		afterClose?.();
	};
	const duration = getTransitionDuration(dialog);
	const state: DialogCloseState = {
		timer: null,
		transitionEnd: null,
	};
	closeStates.set(dialog, state);

	if (duration < 16) {
		state.timer = window.setTimeout(finish, 0);
		return;
	}

	const transitionEnd = (event: TransitionEvent) => {
		if (
			event.target === dialog &&
			["opacity", "translate", "scale", "transform"].includes(
				event.propertyName,
			)
		) {
			finish();
		}
	};

	state.timer = window.setTimeout(finish, duration + 80);
	state.transitionEnd = transitionEnd;
	dialog.addEventListener("transitionend", transitionEnd);
}

export function useDialogDismiss(
	dialogRef: RefObject<HTMLDialogElement | null>,
	onDismiss?: (method: DialogDismissMethod) => void,
) {
	const onDismissRef = useRef(onDismiss);

	useEffect(() => {
		onDismissRef.current = onDismiss;
	}, [onDismiss]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const supportsNativeLightDismiss =
			typeof HTMLDialogElement !== "undefined" &&
			"closedBy" in HTMLDialogElement.prototype;
		let backdropClickPending = false;

		const handleBackdropClick = (event: MouseEvent) => {
			if (event.target !== dialog) {
				backdropClickPending = false;
				return;
			}

			if (supportsNativeLightDismiss) {
				backdropClickPending = true;
				return;
			}

			onDismissRef.current?.("backdrop");
			closeDialog(dialog);
		};

		const handleCancel = (event: Event) => {
			event.preventDefault();
			const method = backdropClickPending ? "backdrop" : "esc";
			backdropClickPending = false;
			onDismissRef.current?.(method);
			closeDialog(dialog);
		};

		dialog.addEventListener("click", handleBackdropClick);
		dialog.addEventListener("cancel", handleCancel);
		return () => {
			dialog.removeEventListener("click", handleBackdropClick);
			dialog.removeEventListener("cancel", handleCancel);
		};
	}, [dialogRef]);
}

export function useDialogClose(
	dialogRef: RefObject<HTMLDialogElement | null>,
	onClose?: () => void,
) {
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleClose = () => onCloseRef.current?.();
		dialog.addEventListener("close", handleClose);
		return () => dialog.removeEventListener("close", handleClose);
	}, [dialogRef]);
}
