import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => ({
	// Decisión temporal: ahora no necesitamos SSR en tiempo de petición.
	defaultSsr: false,
}));
