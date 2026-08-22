import { type Ref, useImperativeHandle, useRef } from "react";
import { Book, BranchUp, Envelope, PlusCircle2 } from "reicon-react";
import { useT } from "../i18n/hooks";
import {
	closeDialog,
	showDialog,
	useDialogClose,
	useDialogDismiss,
} from "../lib/dialog";
import { playSound } from "../lib/sound";
import { track } from "../lib/umami";
import { compactModalDialogClass, ModalActionLink, ModalHeader } from "./Modal";

export interface AddSubjectModalHandle {
	open: () => void;
	close: () => void;
}

interface AddSubjectModalProps {
	onClose: () => void;
	ref: Ref<AddSubjectModalHandle>;
}

function AddSubjectModal({ onClose, ref }: AddSubjectModalProps) {
	const t = useT();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const closeMethodRef = useRef<"x" | "backdrop" | "esc">("backdrop");

	useImperativeHandle(ref, () => ({
		open: () => showDialog(dialogRef.current),
		close: () => closeDialog(dialogRef.current),
	}));

	useDialogDismiss(dialogRef, (method) => {
		closeMethodRef.current = method;
		playSound("droplet");
	});
	useDialogClose(dialogRef, () => {
		track("modal_close", {
			modal: "add_subject",
			method: closeMethodRef.current,
		});
		onClose();
	});

	return (
		<dialog
			ref={dialogRef}
			closedby="any"
			className={`${compactModalDialogClass} p-6`}
			aria-labelledby="add-subject-title"
		>
			<ModalHeader
				titleId="add-subject-title"
				closeLabel={t.addSubject.close}
				onClose={() => {
					closeMethodRef.current = "x";
					closeDialog(dialogRef.current);
				}}
			>
				<Book className="size-5 shrink-0" aria-hidden="true" />
				{t.addSubject.title}
			</ModalHeader>

			<div className="space-y-2.5">
				<ModalActionLink
					href={t.addSubject.openIssueUrl}
					target="_blank"
					rel="noopener noreferrer"
					icon={<PlusCircle2 className="size-5" aria-hidden="true" />}
					iconClassName="bg-accent-light text-accent-fg"
					title={t.addSubject.openIssue}
					description={t.addSubject.openIssueDesc}
					className="border-accent-border bg-accent-light/60 hover:border-accent hover:bg-accent-light"
					onClick={() => track("add_subject_open_issue")}
				/>

				<ModalActionLink
					href="https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/CONTRIBUTING.md"
					target="_blank"
					rel="noopener noreferrer"
					icon={<BranchUp className="size-5" aria-hidden="true" />}
					iconClassName="bg-contribute-bg text-contribute-fg"
					title={t.addSubject.contribute}
					description={t.addSubject.contributeDesc}
					className="border-contribute-border bg-contribute-bg hover:border-contribute-hover-border hover:bg-contribute-hover-bg"
					onClick={() => track("add_subject_contribute")}
				/>

				<ModalActionLink
					href="mailto:pablo.portas@udc.es"
					icon={<Envelope className="size-5" aria-hidden="true" />}
					iconClassName="bg-surface text-fg-secondary"
					title={t.addSubject.email}
					description="pablo.portas@udc.es"
					className="border-border bg-surface/60 hover:border-accent hover:bg-surface"
					onClick={() => track("add_subject_email")}
				/>
			</div>
		</dialog>
	);
}

export default AddSubjectModal;
