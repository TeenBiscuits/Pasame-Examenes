import {
	createRouter as createTanStackRouter,
	ErrorComponent,
} from "@tanstack/react-router";
import { captureException } from "./lib/umami";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultErrorComponent: ErrorComponent,
		defaultOnCatch: captureException,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
