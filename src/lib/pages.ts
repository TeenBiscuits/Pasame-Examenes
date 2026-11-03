export function isHomepage(pathname: string) {
	const segments = pathname.split("/").filter(Boolean);
	return segments.length === 1;
}
