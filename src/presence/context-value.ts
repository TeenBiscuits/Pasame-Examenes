import { createContext } from "react";
import type { PresenceUpdate } from "./appwrite-client";
import type { WeeklyPresence } from "./types";

export type PresenceState = WeeklyPresence & {
	isUsingMockData: boolean;
};

export type PresenceContextValue = PresenceState & {
	shareUsername: (username: string) => Promise<PresenceUpdate | null>;
	stopSharingUsername: () => Promise<boolean>;
};

export const PresenceContext = createContext<PresenceContextValue | null>(null);
