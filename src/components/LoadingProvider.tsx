import type { ReactNode } from "react";
import type { SkulletTheme } from "skullet";
import { SkulletProvider } from "skullet/react";

// Both schemes use the active palette's tokens, including manually selected palettes.
const colors = {
	base: "var(--color-border)",
	highlight: "var(--color-surface-alt)",
};
const theme: SkulletTheme = {
	light: colors,
	dark: colors,
	animation: "shimmer",
	speed: "slow",
};

export default function LoadingProvider({ children }: { children: ReactNode }) {
	return (
		<SkulletProvider theme={theme} reveal="smart">
			{children}
		</SkulletProvider>
	);
}
