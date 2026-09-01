import type { Account, Functions } from "appwrite";
import { isValidUsername, sanitizeUsername } from "../profile/profile";
import { getAppwritePresenceConfig } from "./config";
import type { WeeklyPresence, WeeklyStudent } from "./types";

type AppwriteServices = {
	account: Account;
	functions: Functions;
};

export type PresenceAction =
	| { type: "heartbeat" }
	| { type: "share"; username: string }
	| { type: "unshare" };

export type PresenceUpdate = {
	isPublic: boolean;
	isRateLimited: boolean;
};

let servicesPromise: Promise<AppwriteServices | null> | null = null;
let sessionPromise: Promise<void> | null = null;

async function getServices(): Promise<AppwriteServices | null> {
	const config = getAppwritePresenceConfig();
	if (!config) return null;

	servicesPromise ??= import("appwrite").then(
		({ Account, Client, Functions }) => {
			const client = new Client()
				.setEndpoint(config.endpoint)
				.setProject(config.projectId);
			return { account: new Account(client), functions: new Functions(client) };
		},
	);

	return servicesPromise;
}

async function ensureAnonymousSession(services: AppwriteServices) {
	sessionPromise ??= (async () => {
		try {
			await services.account.get();
			return;
		} catch {
			try {
				await services.account.createAnonymousSession();
			} catch {
				// Otra pestaña puede haber creado la sesión mientras tanto.
				await services.account.get();
			}
		}
	})();

	try {
		await sessionPromise;
	} catch (error) {
		sessionPromise = null;
		throw error;
	}
}

function parseStudent(
	value: unknown,
): Omit<WeeklyStudent, "profileKey"> | null {
	if (!value || typeof value !== "object") return null;
	const { username, isCurrentStudent } = value as Record<string, unknown>;
	if (typeof username !== "string" || typeof isCurrentStudent !== "boolean") {
		return null;
	}

	const normalizedUsername = sanitizeUsername(username);
	if (!isValidUsername(normalizedUsername)) return null;

	return { username: normalizedUsername, isCurrentStudent };
}

function parseSummary(responseBody: string): WeeklyPresence | null {
	try {
		const value = JSON.parse(responseBody) as Record<string, unknown>;
		if (!Array.isArray(value.students) || !Number.isInteger(value.count)) {
			return null;
		}

		const sameAliasCount = new Map<string, number>();
		const students = value.students.flatMap((candidate) => {
			const student = parseStudent(candidate);
			if (!student) return [];

			const occurrence = sameAliasCount.get(student.username) ?? 0;
			sameAliasCount.set(student.username, occurrence + 1);
			return [{ ...student, profileKey: `${student.username}-${occurrence}` }];
		});
		const studentCount = Math.max(0, Number(value.count));
		return {
			studentCount: Math.max(studentCount, students.length),
			students,
			hasSummary: true,
		};
	} catch {
		return null;
	}
}

async function execute(functionId: string, body: string) {
	const services = await getServices();
	if (!services) return null;
	await ensureAnonymousSession(services);
	return services.functions.createExecution({
		functionId,
		body,
		async: false,
		headers: { "content-type": "application/json" },
	});
}

function parsePresenceUpdate(responseBody: string): PresenceUpdate | null {
	try {
		const value = JSON.parse(responseBody) as Record<string, unknown>;
		if (value.ok !== true || typeof value.isPublic !== "boolean") return null;
		return { isPublic: value.isPublic, isRateLimited: false };
	} catch {
		return null;
	}
}

function parseRateLimit(responseBody: string): PresenceUpdate | null {
	try {
		const value = JSON.parse(responseBody) as Record<string, unknown>;
		return typeof value.retryAfterSeconds === "number"
			? { isPublic: false, isRateLimited: true }
			: null;
	} catch {
		return null;
	}
}

export async function recordWeeklyVisit(
	action: PresenceAction = { type: "heartbeat" },
): Promise<PresenceUpdate | null> {
	const config = getAppwritePresenceConfig();
	if (!config) return null;

	const body =
		action.type === "share"
			? (() => {
					const username = sanitizeUsername(action.username);
					if (!isValidUsername(username)) return null;
					return JSON.stringify({ action: "share", username });
				})()
			: JSON.stringify({ action: action.type });
	if (!body) return null;

	const execution = await execute(config.heartbeatFunctionId, body);
	if (!execution) return null;
	if (
		execution.responseStatusCode >= 200 &&
		execution.responseStatusCode < 300
	) {
		return parsePresenceUpdate(execution.responseBody);
	}
	return execution.responseStatusCode === 429
		? parseRateLimit(execution.responseBody)
		: null;
}

export async function getWeeklyPresence(): Promise<WeeklyPresence | null> {
	const config = getAppwritePresenceConfig();
	if (!config) return null;

	const execution = await execute(config.summaryFunctionId, "{}");
	if (
		!execution ||
		execution.responseStatusCode < 200 ||
		execution.responseStatusCode >= 300
	) {
		return null;
	}

	return parseSummary(execution.responseBody);
}
