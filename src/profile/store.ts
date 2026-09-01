import {
	createInitialProfile,
	DEFAULT_PROFILE,
	type LocalProfile,
	PROFILE_STORAGE_KEY,
	parseStoredProfile,
} from "./profile";

export type ProfileSnapshot = {
	profile: LocalProfile;
	isReady: boolean;
};

const serverSnapshot: ProfileSnapshot = {
	profile: DEFAULT_PROFILE,
	isReady: false,
};

let snapshot = serverSnapshot;
let hasLoadedProfile = false;
const listeners = new Set<() => void>();

function writeProfile(profile: LocalProfile) {
	try {
		localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
	} catch {
		/* localStorage unavailable */
	}
}

function readProfile() {
	try {
		return (
			parseStoredProfile(localStorage.getItem(PROFILE_STORAGE_KEY)) ??
			createInitialProfile()
		);
	} catch {
		return createInitialProfile();
	}
}

function notifyListeners() {
	for (const listener of listeners) listener();
}

function replaceProfile(profile: LocalProfile) {
	snapshot = { profile, isReady: true };
	notifyListeners();
}

function handleStorage(event: StorageEvent) {
	if (event.key !== PROFILE_STORAGE_KEY) return;
	const profile = parseStoredProfile(event.newValue);
	if (profile) replaceProfile(profile);
}

export function subscribeToProfile(listener: () => void) {
	listeners.add(listener);
	if (listeners.size === 1) {
		window.addEventListener("storage", handleStorage);
	}

	if (!hasLoadedProfile) {
		hasLoadedProfile = true;
		const profile = readProfile();
		writeProfile(profile);
		replaceProfile(profile);
	}

	return () => {
		listeners.delete(listener);
		if (listeners.size === 0) {
			window.removeEventListener("storage", handleStorage);
		}
	};
}

export function getProfileSnapshot() {
	return snapshot;
}

export function getProfileServerSnapshot() {
	return serverSnapshot;
}

export function updateStoredProfile(
	update: (profile: LocalProfile) => LocalProfile,
) {
	const nextProfile = update(snapshot.profile);
	if (nextProfile === snapshot.profile) return nextProfile;

	writeProfile(nextProfile);
	replaceProfile(nextProfile);
	return nextProfile;
}
