import { type Ref, useImperativeHandle, useRef } from "react";
import { Copyright, Envelope, InfoCircle } from "reicon-react";
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

const CONTACT_EMAIL = "pablo.portas@udc.es";

export interface CopyrightReportModalHandle {
	open: () => void;
	close: () => void;
}

interface CopyrightReportModalProps {
	onClose: () => void;
	subjectId: string;
	subjectName: string;
	ref: Ref<CopyrightReportModalHandle>;
}

function CopyrightReportModal({
	onClose,
	subjectId,
	subjectName,
	ref,
}: CopyrightReportModalProps) {
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
			modal: "copyright_report",
			method: closeMethodRef.current,
			subjectId,
		});
		onClose();
	});

	const emailSubject = t.copyrightReport.emailSubject.replace(
		"{subjectName}",
		subjectName,
	);
	const emailBody = t.copyrightReport.emailBody
		.replace("{subjectName}", subjectName)
		.replace("{subjectId}", subjectId);
	const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

	return (
		<dialog
			ref={dialogRef}
			closedby="any"
			className={`${compactModalDialogClass} p-6`}
			aria-labelledby="copyright-report-title"
		>
			<ModalHeader
				titleId="copyright-report-title"
				closeLabel={t.copyrightReport.close}
				onClose={() => {
					closeMethodRef.current = "x";
					closeDialog(dialogRef.current);
				}}
			>
				<Copyright className="size-5 shrink-0" aria-hidden="true" />
				{t.copyrightReport.title}
			</ModalHeader>

			<div className="space-y-3">
				<p className="text-fg-secondary text-sm leading-relaxed">
					{t.copyrightReport.description}
				</p>
				<p className="border-border bg-surface/60 text-fg-muted flex items-start gap-2 rounded-xl border p-3 text-xs leading-relaxed">
					<InfoCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
					<span>{t.copyrightReport.includeDetails}</span>
				</p>

				<ModalActionLink
					href={mailtoUrl}
					icon={<Envelope className="size-5" aria-hidden="true" />}
					iconClassName="bg-danger-light text-danger-fg"
					title={t.copyrightReport.email}
					description={CONTACT_EMAIL}
					className="border-danger-border bg-danger-light/60 hover:border-danger-fg hover:bg-danger-light"
					onClick={() => track("copyright_report_email", { subjectId })}
				/>
			</div>
		</dialog>
	);
}

export default CopyrightReportModal;
