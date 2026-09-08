type AppwritePresenceConfig = {
	endpoint: string;
	projectId: string;
	functionId: string;
};

function getRequiredPublicEnv(name: keyof ImportMetaEnv) {
	const value = import.meta.env[name];
	return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function getAppwritePresenceConfig(): AppwritePresenceConfig | null {
	const endpoint = getRequiredPublicEnv("VITE_APPWRITE_ENDPOINT");
	const projectId = getRequiredPublicEnv("VITE_APPWRITE_PROJECT_ID");
	const functionId =
		getRequiredPublicEnv("VITE_APPWRITE_PRESENCE_FUNCTION_ID") ??
		getRequiredPublicEnv("VITE_APPWRITE_PRESENCE_SUMMARY_FUNCTION_ID");

	if (!endpoint || !projectId || !functionId) {
		return null;
	}

	return { endpoint, projectId, functionId };
}
