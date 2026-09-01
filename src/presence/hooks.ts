import { use } from "react";
import { PresenceContext } from "./context-value";

export function usePresence() {
	const context = use(PresenceContext);
	if (!context)
		throw new Error("usePresence must be used within PresenceProvider");
	return context;
}
