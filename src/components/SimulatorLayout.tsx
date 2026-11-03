import type { ReactNode } from "react";

export default function SimulatorLayout({ children }: { children: ReactNode }) {
	return (
		<div
			className="mx-auto max-w-3xl px-4 py-4 sm:py-8"
			style={{ overflowAnchor: "none" }}
		>
			{children}
		</div>
	);
}
