type AppwritePresenceConfig = {
	endpoint: string;
	projectId: string;
	heartbeatFunctionId: string;
	summaryFunctionId: string;
};

function getRequiredPublicEnv(name: keyof ImportMetaEnv) {
	const value = import.meta.env[name];
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getAppwritePresenceConfig(): AppwritePresenceConfig | null {
	const endpoint = getRequiredPublicEnv("VITE_APPWRITE_ENDPOINT");
	const projectId = getRequiredPublicEnv("VITE_APPWRITE_PROJECT_ID");
	const heartbeatFunctionId = getRequiredPublicEnv(
		"VITE_APPWRITE_PRESENCE_HEARTBEAT_FUNCTION_ID",
	);
	const summaryFunctionId = getRequiredPublicEnv(
		"VITE_APPWRITE_PRESENCE_SUMMARY_FUNCTION_ID",
	);

	if (!endpoint || !projectId || !heartbeatFunctionId || !summaryFunctionId) {
		return null;
	}

	return { endpoint, projectId, heartbeatFunctionId, summaryFunctionId };
}
