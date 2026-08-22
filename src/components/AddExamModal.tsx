import { type Ref, useImperativeHandle, useRef } from "react";
import {
	BranchUp,
	Envelope,
	FilePlus,
	InfoCircle,
	PlusCircle2,
} from "reicon-react";
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

export interface AddExamModalHandle {
	open: () => void;
	close: () => void;
}

interface AddExamModalProps {
	onClose: () => void;
	subjectId: string;
	subjectName: string;
	ref: Ref<AddExamModalHandle>;
}

function AddExamModal({
	onClose,
	subjectId,
	subjectName,
	ref,
}: AddExamModalProps) {
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
			modal: "add_exam",
			method: closeMethodRef.current,
			subjectId,
		});
		onClose();
	});

	const issueUrl = `${t.addExam.openIssueUrl}&title=${encodeURIComponent(subjectName)}&subject=${encodeURIComponent(subjectId)}`;

	return (
		<dialog
			ref={dialogRef}
			closedby="any"
			className={`${compactModalDialogClass} p-6`}
			aria-labelledby="add-exam-title"
		>
			<ModalHeader
				titleId="add-exam-title"
				closeLabel={t.addExam.close}
				onClose={() => {
					closeMethodRef.current = "x";
					closeDialog(dialogRef.current);
				}}
			>
				<FilePlus className="size-5 shrink-0" aria-hidden="true" />
				{t.addExam.title}
			</ModalHeader>

			<div className="space-y-2.5">
				<p className="border-border bg-surface/60 text-fg-muted flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed">
					<InfoCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					<span>{t.addExam.legalNotice}</span>
				</p>

				<ModalActionLink
					href={issueUrl}
					target="_blank"
					rel="noopener noreferrer"
					icon={<PlusCircle2 className="size-5" aria-hidden="true" />}
					iconClassName="bg-accent-light text-accent-fg"
					title={t.addExam.openIssue}
					description={t.addExam.openIssueDesc}
					className="border-accent-border bg-accent-light/60 hover:border-accent hover:bg-accent-light"
					onClick={() => track("add_exam_open_issue", { subjectId })}
				/>

				<ModalActionLink
					href="https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/CONTRIBUTING.md"
					target="_blank"
					rel="noopener noreferrer"
					icon={<BranchUp className="size-5" aria-hidden="true" />}
					iconClassName="bg-contribute-bg text-contribute-fg"
					title={t.addExam.contribute}
					description={t.addExam.contributeDesc}
					className="border-contribute-border bg-contribute-bg hover:border-contribute-hover-border hover:bg-contribute-hover-bg"
					onClick={() => track("add_exam_contribute", { subjectId })}
				/>

				<ModalActionLink
					href="mailto:pablo.portas@udc.es"
					icon={<Envelope className="size-5" aria-hidden="true" />}
					iconClassName="bg-surface text-fg-secondary"
					title={t.addExam.email}
					description="pablo.portas@udc.es"
					className="border-border bg-surface/60 hover:border-accent hover:bg-surface"
					onClick={() => track("add_exam_email", { subjectId })}
				/>
			</div>
		</dialog>
	);
}

export default AddExamModal;
