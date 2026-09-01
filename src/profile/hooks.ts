import { use } from "react";
import { ProfileContext } from "./context-value";

export function useProfile() {
	const context = use(ProfileContext);
	if (!context)
		throw new Error("useProfile must be used within ProfileProvider");
	return context;
}
