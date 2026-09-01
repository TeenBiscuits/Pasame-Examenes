import {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	createInitialProfile,
	DEFAULT_PROFILE,
	isValidUsername,
	type LocalProfile,
	PROFILE_STORAGE_KEY,
	parseStoredProfile,
	sanitizeUsername,
} from "./profile";

type ProfileContextValue = {
	profile: LocalProfile;
	isReady: boolean;
	saveUsername: (username: string) => boolean;
	completeNamePrompt: () => void;
	dismissNamePrompt: () => void;
	setNameShared: (isNameShared: boolean) => void;
};

export const ProfileContext = createContext<ProfileContextValue | null>(null);

function writeProfile(profile: LocalProfile) {
	try {
		localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
	} catch {
		/* localStorage unavailable */
	}
}

export function ProfileProvider({ children }: { children: ReactNode }) {
	const [profile, setProfile] = useState<LocalProfile>(DEFAULT_PROFILE);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		let nextProfile: LocalProfile;
		try {
			nextProfile =
				parseStoredProfile(localStorage.getItem(PROFILE_STORAGE_KEY)) ??
				createInitialProfile();
		} catch {
			nextProfile = createInitialProfile();
		}
		setProfile(nextProfile);
		writeProfile(nextProfile);
		setIsReady(true);
	}, []);

	useEffect(() => {
		function handleStorage(event: StorageEvent) {
			if (event.key !== PROFILE_STORAGE_KEY) return;
			const storedProfile = parseStoredProfile(event.newValue);
			if (storedProfile) setProfile(storedProfile);
		}
		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, []);

	const saveUsername = useCallback((value: string) => {
		const username = sanitizeUsername(value);
		if (!isValidUsername(username)) return false;
		setProfile((current) => {
			const nextProfile = { ...current, username };
			writeProfile(nextProfile);
			return nextProfile;
		});
		return true;
	}, []);

	const completeNamePrompt = useCallback(() => {
		setProfile((current) => {
			if (current.hasCompletedNamePrompt) return current;
			const nextProfile = { ...current, hasCompletedNamePrompt: true };
			writeProfile(nextProfile);
			return nextProfile;
		});
	}, []);

	const dismissNamePrompt = useCallback(() => {
		setProfile((current) => {
			const nextProfile = {
				...current,
				username: current.fallbackUsername,
				hasCompletedNamePrompt: true,
				isNameShared: false,
			};
			writeProfile(nextProfile);
			return nextProfile;
		});
	}, []);

	const setNameShared = useCallback((isNameShared: boolean) => {
		setProfile((current) => {
			if (current.isNameShared === isNameShared) return current;
			const nextProfile = { ...current, isNameShared };
			writeProfile(nextProfile);
			return nextProfile;
		});
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
