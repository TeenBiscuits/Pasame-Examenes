import { GraduationCap, Users3, Verified } from "reicon-react";
import type { SubjectMeta } from "../data/types";
import { useT } from "../i18n/hooks";
import { hasAuthorizedExamContent } from "../lib/content-policy";

interface ContentPolicyIconProps {
	subject: SubjectMeta;
	className?: string;
	svgOnly?: boolean;
	variant?: "policy" | "verified";
}

function ContentPolicyGlyph({
	isAuthorized,
	isVerified,
	className,
	label,
}: {
	isAuthorized: boolean;
	isVerified: boolean;
	className: string;
	label: string;
}) {
	if (isAuthorized && isVerified) {
		return <Verified className={className} role="img" aria-label={label} />;
	}

	if (isAuthorized) {
		return (
			<GraduationCap
				size={24}
				weight="Filled"
				className={className}
				role="img"
				aria-label={label}
			/>
		);
	}

	return (
		<Users3
			className={className}
			role="img"
			weight="Filled"
			aria-label={label}
		/>
	);
}

export default function ContentPolicyIcon({
	subject,
	className = "",
	svgOnly = false,
	variant = "policy",
}: ContentPolicyIconProps) {
	const t = useT();
	const isAuthorized = hasAuthorizedExamContent(subject);
	if (variant === "verified" && !isAuthorized) return null;

	const label = isAuthorized
		? t.contentPolicy.authorized
		: t.contentPolicy.community;
	const useVerifiedIcon = variant === "verified";
	const icon = (
		<ContentPolicyGlyph
			isAuthorized={isAuthorized}
			isVerified={useVerifiedIcon}
			className={svgOnly ? className : "size-4"}
			label={label}
		/>
	);

	if (svgOnly) {
		return icon;
	}

	return (
		<span
			className={`inline-flex size-6 shrink-0 items-center justify-center rounded border ${
				useVerifiedIcon
					? "border-warning-border bg-warning-bg text-warning-fg"
					: isAuthorized
						? "border-accent-border bg-accent-light text-accent-fg"
						: "border-contribute-border bg-contribute-bg text-contribute-fg"
			} ${className}`}
			title={label}
		>
			{icon}
		</span>
	);
}
