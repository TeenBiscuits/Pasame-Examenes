import { palette, traits } from "blobatar";

export const PROFILE_STORAGE_KEY = "local-profile-v1";
export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 24;
export const BLOBATAR_TONE = 0.71;

export type LocalProfile = {
	username: string;
	fallbackUsername: string;
	hasCompletedNamePrompt: boolean;
	isNameShared: boolean;
	isStudyPresenceBadgeVisible: boolean;
};

export const DEFAULT_PROFILE: LocalProfile = {
	username: "lovelace000",
	fallbackUsername: "lovelace000",
	hasCompletedNamePrompt: true,
	isNameShared: false,
	isStudyPresenceBadgeVisible: true,
};

export const USERNAME_BASES = [
	"lovelace",
	"hopper",
	"lamarr",
	"perlman",
	"hamilton",
	"blackwell",
	"mary_jackson",
	"bouman",
	"borg",
	"sophie_wilson",
	"turing",
	"boole",
	"alan_kay",
	"dijkstra",
	"knuth",
	"moore",
	"berners_lee",
	"torvalds",
	"cerf",
	"ritchie",
] as const;

function randomInteger(maxExclusive: number) {
	if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
		const value = new Uint32Array(1);
		crypto.getRandomValues(value);
		return (value[0] ?? 0) % maxExclusive;
	}
	return Math.floor(Math.random() * maxExclusive);
}

export function createRandomUsername() {
	const base = USERNAME_BASES[randomInteger(USERNAME_BASES.length)];
	const suffix = String(randomInteger(1000)).padStart(3, "0");
	return `${base}${suffix}`;
}

export function createInitialProfile(): LocalProfile {
	const username = createRandomUsername();
	return {
		username,
		fallbackUsername: username,
		hasCompletedNamePrompt: false,
		isNameShared: false,
		isStudyPresenceBadgeVisible: true,
	};
}

export function sanitizeUsername(value: string) {
	return value
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/^@+/, "")
		.replace(/\s+/g, "_")
		.replace(/[^a-z0-9_]/g, "")
		.replace(/_+/g, "_")
		.slice(0, MAX_USERNAME_LENGTH);
}

export function isValidUsername(username: string) {
	return /^[a-z0-9_]{3,24}$/.test(username);
}

export function getBlobatarColor(name: string) {
	const hue = traits(name).num("hue", 0, 360);
	return palette(hue, true, BLOBATAR_TONE).head ?? "currentColor";
}

export function parseStoredProfile(raw: string | null): LocalProfile | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as Partial<LocalProfile>;
		const username = sanitizeUsername(parsed.username ?? "");
		if (!isValidUsername(username)) return null;

		const fallbackUsername = sanitizeUsername(
			parsed.fallbackUsername ?? username,
		);
		return {
			username,
			fallbackUsername: isValidUsername(fallbackUsername)
				? fallbackUsername
				: username,
			// Los perfiles previos a la bienvenida no deben interrumpirse al migrar.
			hasCompletedNamePrompt:
				typeof parsed.hasCompletedNamePrompt === "boolean"
					? parsed.hasCompletedNamePrompt
					: true,
			isNameShared:
				typeof parsed.isNameShared === "boolean" ? parsed.isNameShared : false,
			isStudyPresenceBadgeVisible:
				typeof parsed.isStudyPresenceBadgeVisible === "boolean"
					? parsed.isStudyPresenceBadgeVisible
					: true,
		};
	} catch {
		return null;
	}
}
