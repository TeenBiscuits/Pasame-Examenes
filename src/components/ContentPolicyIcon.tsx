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
	const icon = isAuthorized ? (
		useVerifiedIcon ? (
			<Verified
				className={svgOnly ? className : "size-4"}
				role="img"
				aria-label={label}
			/>
		) : (
			<GraduationCap
				size={24}
				weight="Filled"
				className={svgOnly ? className : "size-4"}
				role="img"
				aria-label={label}
			/>
		)
	) : (
		<Users3
			className={svgOnly ? className : "size-4"}
			role="img"
			weight="Filled"
			aria-label={label}
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
