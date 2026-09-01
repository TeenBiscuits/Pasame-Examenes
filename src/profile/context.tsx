import {
	type ReactNode,
	useCallback,
	useMemo,
	useSyncExternalStore,
} from "react";
import { ProfileContext } from "./context-value";
import { isValidUsername, sanitizeUsername } from "./profile";
import {
	getProfileServerSnapshot,
	getProfileSnapshot,
	subscribeToProfile,
	updateStoredProfile,
} from "./store";

export function ProfileProvider({ children }: { children: ReactNode }) {
	const { profile, isReady } = useSyncExternalStore(
		subscribeToProfile,
		getProfileSnapshot,
		getProfileServerSnapshot,
	);

	const saveUsername = useCallback((value: string) => {
		const username = sanitizeUsername(value);
		if (!isValidUsername(username)) return false;
		updateStoredProfile((current) =>
			current.username === username ? current : { ...current, username },
		);
		return true;
	}, []);

	const completeNamePrompt = useCallback(() => {
		updateStoredProfile((current) =>
			current.hasCompletedNamePrompt
				? current
				: { ...current, hasCompletedNamePrompt: true },
		);
	}, []);

	const dismissNamePrompt = useCallback(() => {
		updateStoredProfile((current) => ({
			...current,
			username: current.fallbackUsername,
			hasCompletedNamePrompt: true,
			isNameShared: false,
		}));
	}, []);

	const setNameShared = useCallback((isNameShared: boolean) => {
		updateStoredProfile((current) =>
			current.isNameShared === isNameShared
				? current
				: { ...current, isNameShared },
		);
	}, []);

	const value = useMemo(
		() => ({
			profile,
			isReady,
			saveUsername,
			completeNamePrompt,
			dismissNamePrompt,
			setNameShared,
		}),
		[
			completeNamePrompt,
			dismissNamePrompt,
			isReady,
			profile,
			saveUsername,
			setNameShared,
		],
	);

	return (
		<ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
	);
}
