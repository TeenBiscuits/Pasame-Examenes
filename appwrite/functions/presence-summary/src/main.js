import { Client, Query, TablesDB } from "node-appwrite";

const MAX_EXPOSED_PROFILES = 30;
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;
const SUMMARY_CACHE_TTL_SECONDS = 5 * 60;

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

export default async ({ req, res, error }) => {
	if (req.method !== "POST")
		return res.json({ error: "Method not allowed" }, 405);

	try {
		const currentUserId = getHeader(req, "x-appwrite-user-id");
		if (!currentUserId) return res.json({ error: "Unauthenticated" }, 401);

		const cutoff = new Date(Date.now() - WEEK_IN_MS).toISOString();
		const tablesDB = getTablesDB(req);
		const [visits, publicProfiles] = await Promise.all([
			tablesDB.listRows({
				...tableParams(),
				queries: [Query.greaterThan("lastSeenAt", cutoff), Query.limit(1)],
				total: true,
				ttl: SUMMARY_CACHE_TTL_SECONDS,
			}),
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
		]);

		const students = publicProfiles.rows.flatMap((row) => {
			const username = row.publicUsername;
			if (typeof username !== "string" || !USERNAME_PATTERN.test(username)) {
				return [];
			}
			return [{ username, isCurrentStudent: row.$id === currentUserId }];
		});

		return res.json({ count: visits.total, students });
	} catch {
		error("Could not read weekly presence");
		return res.json({ error: "Could not read presence" }, 500);
	}
};
