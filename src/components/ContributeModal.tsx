import { type RefObject, useRef, useState } from "react";
import { BranchUp, Envelope, PlusCircle2 } from "reicon-react";
import { useT } from "../i18n/hooks";
import { closeDialog, useDialogClose, useDialogDismiss } from "../lib/dialog";
import { playSound } from "../lib/sound";
import { track } from "../lib/umami";
import BlobatarCreator from "./BlobatarCreator";
import ContributorAvatar from "./ContributorAvatar";
import { compactModalDialogClass, ModalActionLink, ModalHeader } from "./Modal";

export default function ContributeModal({
	dialogRef,
}: {
	dialogRef: RefObject<HTMLDialogElement | null>;
}) {
	const t = useT();
	const [username, setUsername] = useState("");
	const [showOptions, setShowOptions] = useState(false);
	const optionsRef = useRef<HTMLParagraphElement>(null);
	useDialogClose(dialogRef, () => {
		setShowOptions(false);
		setUsername("");
	});
	useDialogDismiss(dialogRef, () => playSound("close"));
	return (
		<dialog
			ref={dialogRef}
			closedby="any"
			className={`${compactModalDialogClass} p-6`}
			aria-labelledby="contribute-title"
		>
			<ModalHeader
				titleId="contribute-title"
				closeLabel={t.addSubject.close}
				onClose={() => closeDialog(dialogRef.current)}
			>
				<BranchUp className="size-5 shrink-0" aria-hidden="true" />
				{t.contributors.title}
			</ModalHeader>

			{showOptions ? (
				<>
					<p
						ref={optionsRef}
						tabIndex={-1}
						className="text-fg-secondary mb-5 flow-root text-sm leading-relaxed outline-none"
					>
						<span
							className="border-border bg-surface-alt float-right rounded-xl border p-2"
							aria-hidden="true"
						>
							<ContributorAvatar
								username={username || "lovelace"}
								size={80}
								animated
								className="size-20"
							/>
						</span>
						<strong className="font-bold">{t.contributors.intro}</strong>
						{t.contributors.description}
					</p>
					<div className="space-y-2.5">
						<ModalActionLink
							href="https://github.com/TeenBiscuits/Pasame-Examenes/issues/new/choose"
							target="_blank"
							rel="noopener noreferrer"
							icon={<PlusCircle2 className="size-5" aria-hidden="true" />}
							iconClassName="bg-accent-light text-accent-fg"
							title={t.addSubject.openIssue}
							description={t.contributors.openIssueDesc}
							className="border-accent-border bg-accent-light/60 hover:border-accent hover:bg-accent-light"
							onClick={() => track("contribution_open_issue")}
						/>

						<ModalActionLink
							href="https://github.com/TeenBiscuits/Pasame-Examenes/blob/main/CONTRIBUTING.md"
							target="_blank"
							rel="noopener noreferrer"
							icon={<BranchUp className="size-5" aria-hidden="true" />}
							iconClassName="bg-contribute-bg text-contribute-fg"
							title={t.addSubject.contribute}
							description={t.contributors.contributeDesc}
							className="border-contribute-border bg-contribute-bg hover:border-contribute-hover-border hover:bg-contribute-hover-bg"
							onClick={() => track("contribution_contribute")}
						/>

						<ModalActionLink
							href="mailto:pablo.portas@udc.es"
							icon={<Envelope className="size-5" aria-hidden="true" />}
							iconClassName="bg-surface text-fg-secondary"
							title={t.addSubject.email}
							description="pablo.portas@udc.es"
							className="border-border bg-surface/60 hover:border-accent hover:bg-surface"
							onClick={() => track("contribution_email")}
						/>
					</div>
				</>
			) : (
				<BlobatarCreator
					username={username}
					onUsernameChange={setUsername}
					onNext={() => {
						setShowOptions(true);
						requestAnimationFrame(() => optionsRef.current?.focus());
					}}
				/>
			)}
		</dialog>
	);
}
