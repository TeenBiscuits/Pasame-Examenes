const TEMPLATE_SUBJECT_ID = "_template";
const SECRET_SUBJECT_IDS = new Set(["espain"]);

function vercelEnvironment(): string | undefined {
	const clientEnvironment = import.meta.env?.VERCEL_ENV;
	if (clientEnvironment) return clientEnvironment;
	if (typeof process !== "undefined") return process.env.VERCEL_ENV;
	return undefined;
}

export function isDevelopmentOrVercelPreview(): boolean {
	return (
		import.meta.env?.DEV === true ||
		(typeof process !== "undefined" &&
			process.env.NODE_ENV === "development") ||
		vercelEnvironment() === "preview"
	);
}

export function isSecretSubject(subjectId: string): boolean {
	return SECRET_SUBJECT_IDS.has(subjectId);
}

export function isTemplateSubject(subjectId: string): boolean {
	return subjectId === TEMPLATE_SUBJECT_ID;
}

export function isHomepageSubject(subjectId: string): boolean {
	if (isSecretSubject(subjectId)) return false;
	return !isTemplateSubject(subjectId) || isDevelopmentOrVercelPreview();
}

export function isNavigableSubject(subjectId: string): boolean {
	return !isTemplateSubject(subjectId) || isDevelopmentOrVercelPreview();
}

export function isIndexableSubject(subjectId: string): boolean {
	return !isSecretSubject(subjectId) && !isTemplateSubject(subjectId);
}
