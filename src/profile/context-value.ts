import { createContext } from "react";
import type { LocalProfile } from "./profile";

export type ProfileContextValue = {
	profile: LocalProfile;
	isReady: boolean;
	saveUsername: (username: string) => boolean;
	completeNamePrompt: () => void;
	dismissNamePrompt: () => void;
	setNameShared: (isNameShared: boolean) => void;
	setStudyPresenceBadgeVisible: (isVisible: boolean) => void;
};

export const ProfileContext = createContext<ProfileContextValue | null>(null);
