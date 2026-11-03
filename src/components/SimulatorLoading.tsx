import { useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Skeleton } from "skullet/react";
import SimulatorPreview, {
	type SimulatorPreviewProps,
} from "./SimulatorPreview";

interface SimulatorLoadingProps extends SimulatorPreviewProps {
	loading: boolean;
	loadingLabel: string;
	children?: ReactNode;
	shapeId?: string;
}

export default function SimulatorLoading({
	loading,
	loadingLabel,
	children,
	shapeId,
	...preview
}: SimulatorLoadingProps) {
	const pathname = useLocation({ select: (location) => location.pathname });
	return (
		<Skeleton
			className="simulator-loading"
			id={`simulator:${pathname}:${preview.kind ?? "practice"}:${preview.questionType ?? "mc"}:${shapeId ?? "initial"}`}
			loading={loading}
			label={loadingLabel}
		>
			{loading ? <SimulatorPreview {...preview} /> : children}
		</Skeleton>
	);
}
