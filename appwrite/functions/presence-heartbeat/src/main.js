import { Profanity } from "@2toad/profanity";
import { Client, Query, TablesDB } from "node-appwrite";

const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
const HEARTBEAT_INTERVAL_IN_MS = 5 * 60 * 1000;
const PROFILE_CHANGE_INTERVAL_IN_MS = 5 * 60 * 1000;
const RETENTION_IN_MS = 8 * 24 * 60 * 60 * 1000;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_PUBLIC_PROFILES = 50;
const PUBLIC_PROFILE_LOCK_ROW_ID = "public-profile-cap-lock";
const TRANSACTION_RETRY_LIMIT = 3;
const LOCK_LAST_SEEN_AT = "1970-01-01T00:00:00.000Z";
const profanity = new Profanity({
	languages: ["en", "es"],
	wholeWord: false,
});

function getHeader(req, name) {
	return req.headers[name] ?? req.headers[name.toLowerCase()] ?? null;
}

function getRequiredEnv(name) {
	const value = process.env[name];
	if (!value) throw new Error(`Missing ${name}`);
	return value;
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

	try {
		const userId = getHeader(req, "x-appwrite-user-id");
		const action = req.bodyJson?.action ?? "heartbeat";
		if (
			!userId ||
			(action !== "heartbeat" && action !== "share" && action !== "unshare")
		) {
			return res.json({ error: "Invalid presence request" }, 400);
		}

		const now = Date.now();
		const tablesDB = getTablesDB(req);
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
		error("Could not record weekly presence");
		return res.json({ error: "Could not record presence" }, 500);
	}
};
