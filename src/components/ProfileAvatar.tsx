import { Blobatar } from "@blobatar/react";
import type { DragEvent } from "react";
import { BLOBATAR_TONE } from "../profile/profile";

export default function ProfileAvatar({
	username,
	size,
	animated = false,
	title,
	className,
}: {
	username: string;
	size: number;
	animated?: boolean;
	title?: string;
	className?: string;
}) {
	return (
		<Blobatar
			name={username}
			size={size}
			tone={BLOBATAR_TONE}
			animate={animated ? "always" : undefined}
			title={title}
			className={className}
			draggable={false}
			onDragStart={(event: DragEvent<Element>) => event.preventDefault()}
		/>
	);
}
