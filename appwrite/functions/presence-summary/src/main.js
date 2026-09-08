import { Profanity } from "@2toad/profanity";
import { getClient } from "@umami/api-client";
import { Client, Query, TablesDB } from "node-appwrite";

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
const HEARTBEAT_INTERVAL_IN_MS = 5 * 60 * 1000;
const PROFILE_CHANGE_INTERVAL_IN_MS = 5 * 60 * 1000;
const RETENTION_IN_MS = 8 * 24 * 60 * 60 * 1000;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_PUBLIC_PROFILES = 50;
const MAX_EXPOSED_PROFILES = 30;
const PUBLIC_PROFILE_LOCK_ROW_ID = "public-profile-cap-lock";
const TRANSACTION_RETRY_LIMIT = 3;
const LOCK_LAST_SEEN_AT = "1970-01-01T00:00:00.000Z";
const SUMMARY_CACHE_TTL_SECONDS = 5 * 60;
const UMAMI_WEBSITE_ID = "63168f0e-a1cf-4ec6-a0c4-58fc7d57a0f4";
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const profanity = new Profanity({
	languages: ["en", "es"],
	wholeWord: false,
});
let cachedUmamiVisitorCount = null;

function getHeader(req, name) {
	return req.headers[name] ?? req.headers[name.toLowerCase()] ?? null;
}

function getRequiredEnv(name) {
	const value = process.env[name];
	if (!value) throw new Error(`Missing ${name}`);
	return value;
}

async function loginWithConfiguredCredentials(client, userId, secret) {
	const response = await client.login(userId, secret);
	const token = response.data?.token;
	if (!response.ok || typeof token !== "string" || !token) return false;

	client.authToken = token;
	return true;
}

function getVisitorCount(value) {
	if (typeof value === "number") return value;
	if (!value || typeof value !== "object") return null;
	return typeof value.value === "number" ? value.value : null;
}

async function getUmamiVisitorCount() {
	const userId = getRequiredEnv("UMAMI_API_CLIENT_USER_ID").trim();
	const secret = getRequiredEnv("UMAMI_API_CLIENT_SECRET").trim();
	const endpoint = getRequiredEnv("UMAMI_API_CLIENT_ENDPOINT").trim();

	const client = getClient({
		userId,
		secret,
		apiEndpoint: endpoint,
	});
	let loginAttempted = false;

	// The configured production account uses a read-only username and password
	// in these historical env vars. UUID values use Umami's user-id + APP_SECRET
	// token flow, which the client creates in its constructor.
	if (!UUID_PATTERN.test(userId)) {
		loginAttempted = true;
		await loginWithConfiguredCredentials(client, userId, secret);
	}

	const endAt = Date.now();
	const startAt = endAt - WEEK_IN_MS;
	let response = await client.getWebsiteStats(UMAMI_WEBSITE_ID, {
		startAt,
		endAt,
	});

	if (!response.ok && response.status === 401 && !loginAttempted) {
		loginAttempted = true;
		if (await loginWithConfiguredCredentials(client, userId, secret)) {
			response = await client.getWebsiteStats(UMAMI_WEBSITE_ID, {
				startAt,
				endAt,
			});
		}
	}

	if (!response.ok) {
		throw new Error(`Umami stats request failed: ${response.status}`);
	}

	const visitorCount = getVisitorCount(response.data?.visitors);
	if (visitorCount === null || !Number.isFinite(visitorCount)) {
		throw new Error("Umami stats response had no visitor count");
	}

	return Math.max(0, Math.trunc(visitorCount));
}

function getTablesDB(req) {
	const dynamicApiKey = getHeader(req, "x-appwrite-key");
	if (!dynamicApiKey) throw new Error("Missing Appwrite function API key");

	const client = new Client()
		.setEndpoint(getRequiredEnv("APPWRITE_ENDPOINT"))
		.setProject(getRequiredEnv("APPWRITE_PROJECT_ID"))
		.setKey(dynamicApiKey);
	return new TablesDB(client);
}

function tableParams() {
	return {
		databaseId: getRequiredEnv("PRESENCE_DATABASE_ID"),
		tableId: getRequiredEnv("PRESENCE_TABLE_ID"),
	};
}

async function getExistingRow(tablesDB, userId) {
	try {
		return await tablesDB.getRow({ ...tableParams(), rowId: userId });
	} catch {
		return null;
	}
}

function wasRecentlyRecorded(row, now) {
	if (!row || typeof row.lastSeenAt !== "string") return false;
	const lastSeenAt = Date.parse(row.lastSeenAt);
	return (
		Number.isFinite(lastSeenAt) && now - lastSeenAt < HEARTBEAT_INTERVAL_IN_MS
	);
}

function profileChangeRetryAfterSeconds(row, now) {
	if (!row || typeof row.lastProfileChangedAt !== "string") return 0;
	const lastProfileChangedAt = Date.parse(row.lastProfileChangedAt);
	if (!Number.isFinite(lastProfileChangedAt)) return 0;

	const remaining =
		PROFILE_CHANGE_INTERVAL_IN_MS - (now - lastProfileChangedAt);
	return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

async function retainOnlyRecentPublicProfiles(tablesDB, now, transactionId) {
	const recentProfiles = await tablesDB.listRows({
		...tableParams(),
		queries: [
			Query.greaterThan(
				"lastPublicAt",
				new Date(now - WEEK_IN_MS).toISOString(),
			),
			Query.orderAsc("lastPublicAt"),
			Query.limit(1),
		],
		transactionId,
		total: true,
	});

	if (recentProfiles.total <= MAX_PUBLIC_PROFILES) return;
	const oldest = recentProfiles.rows[0];
	if (!oldest) return;
	await tablesDB.updateRow({
		...tableParams(),
		rowId: oldest.$id,
		data: { publicUsername: null, lastPublicAt: null },
		transactionId,
	});
}

function isTransactionConflict(error) {
	return error?.code === 409;
}

async function rollbackTransaction(tablesDB, transactionId) {
	try {
		await tablesDB.updateTransaction({ transactionId, rollback: true });
	} catch {
		// A failed commit can close the transaction before rollback is requested.
	}
}

async function upsertPublicProfileWithinCap(tablesDB, userId, data, now) {
	for (let attempt = 0; attempt < TRANSACTION_RETRY_LIMIT; attempt += 1) {
		const transaction = await tablesDB.createTransaction();
		try {
			await tablesDB.upsertRow({
				...tableParams(),
				rowId: PUBLIC_PROFILE_LOCK_ROW_ID,
				data: {
					lastSeenAt: LOCK_LAST_SEEN_AT,
					publicUsername: null,
					lastPublicAt: null,
					lastProfileChangedAt: null,
				},
				transactionId: transaction.$id,
			});
			await tablesDB.upsertRow({
				...tableParams(),
				rowId: userId,
				data,
				transactionId: transaction.$id,
			});
			await retainOnlyRecentPublicProfiles(tablesDB, now, transaction.$id);
			await tablesDB.updateTransaction({
				transactionId: transaction.$id,
				commit: true,
			});
			return;
		} catch (caughtError) {
			await rollbackTransaction(tablesDB, transaction.$id);
			if (
				!isTransactionConflict(caughtError) ||
				attempt === TRANSACTION_RETRY_LIMIT - 1
			) {
				throw caughtError;
			}
		}
	}
}

async function getWeeklySummary(tablesDB, currentUserId, logError) {
	const cutoff = new Date(Date.now() - WEEK_IN_MS).toISOString();
	const [profilesResult, visitorCountResult] = await Promise.allSettled([
		tablesDB.listRows({
			...tableParams(),
			queries: [
				Query.greaterThan("lastPublicAt", cutoff),
				Query.orderDesc("lastPublicAt"),
				Query.limit(MAX_EXPOSED_PROFILES),
			],
			total: false,
			ttl: SUMMARY_CACHE_TTL_SECONDS,
		}),
		getUmamiVisitorCount(),
	]);
	if (profilesResult.status !== "fulfilled") {
		throw profilesResult.reason;
	}

	let visitorCount = cachedUmamiVisitorCount;
	if (visitorCountResult.status === "fulfilled") {
		visitorCount = visitorCountResult.value;
		cachedUmamiVisitorCount = visitorCount;
	} else {
		logError("Could not read Umami visitor count");
	}

	const students = profilesResult.value.rows.flatMap((row) => {
		const username = row.publicUsername;
		if (typeof username !== "string" || !USERNAME_PATTERN.test(username)) {
			return [];
		}
		return [{ username, isCurrentStudent: row.$id === currentUserId }];
	});

	return { count: visitorCount, students };
}

export default async ({ req, res, error }) => {
	if (getHeader(req, "x-appwrite-trigger") === "schedule") {
		try {
			const cutoff = new Date(Date.now() - RETENTION_IN_MS).toISOString();
			await getTablesDB(req).deleteRows({
				...tableParams(),
				queries: [Query.lessThan("lastSeenAt", cutoff)],
			});
			return res.json({ ok: true });
		} catch {
			error("Could not purge expired presence rows");
			return res.json({ error: "Could not purge presence" }, 500);
		}
	}

	if (req.method !== "POST")
		return res.json({ error: "Method not allowed" }, 405);

	let action = "summary";
	try {
		const userId = getHeader(req, "x-appwrite-user-id");
		action = req.bodyJson?.action ?? "summary";
		if (
			!userId ||
			(action !== "summary" &&
				action !== "heartbeat" &&
				action !== "share" &&
				action !== "unshare")
		) {
			return res.json({ error: "Invalid presence request" }, 400);
		}

		const tablesDB = getTablesDB(req);
		if (action === "summary") {
			return res.json(await getWeeklySummary(tablesDB, userId, error));
		}

		const now = Date.now();
		const existing = await getExistingRow(tablesDB, userId);
		if (action === "heartbeat" && wasRecentlyRecorded(existing, now)) {
			return res.json({ ok: true, isPublic: false });
		}
		const profileChangeRetryAfter =
			action === "heartbeat"
				? 0
				: profileChangeRetryAfterSeconds(existing, now);
		if (profileChangeRetryAfter > 0) {
			return res.json(
				{
					error: "Profile changes are temporarily limited",
					retryAfterSeconds: profileChangeRetryAfter,
				},
				429,
			);
		}

		const timestamp = new Date(now).toISOString();
		const data = { lastSeenAt: timestamp };
		let isPublic = false;
		if (action === "unshare") {
			Object.assign(data, {
				publicUsername: null,
				lastPublicAt: null,
				lastProfileChangedAt: timestamp,
			});
		} else if (action === "share") {
			const username = req.bodyJson?.username;
			if (typeof username !== "string" || !USERNAME_PATTERN.test(username)) {
				return res.json({ error: "Invalid public username" }, 400);
			}

			isPublic = !profanity.exists(username);
			Object.assign(data, { lastProfileChangedAt: timestamp });
			if (isPublic) {
				Object.assign(data, {
					publicUsername: username,
					lastPublicAt: timestamp,
				});
			}
		}

		if (isPublic) {
			await upsertPublicProfileWithinCap(tablesDB, userId, data, now);
		} else {
			await tablesDB.upsertRow({ ...tableParams(), rowId: userId, data });
		}

		return res.json({ ok: true, isPublic });
	} catch {
		if (action === "summary") {
			error("Could not read weekly presence");
			return res.json({ error: "Could not read presence" }, 500);
		}
		error("Could not record weekly presence");
		return res.json({ error: "Could not record presence" }, 500);
	}
};
