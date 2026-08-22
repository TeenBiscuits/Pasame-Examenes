export function ssrDuringBuildPrerender(): boolean {
	return (
		typeof process !== "undefined" && process.env.TSS_PRERENDERING === "true"
	);
}
