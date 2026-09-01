import { getSubject } from "../subjects";

export function isPresencePage(pathname: string) {
	const segments = pathname.split("/").filter(Boolean);
	return (
		segments.length === 1 ||
		(segments.length === 2 && getSubject(segments[1] ?? "") !== undefined)
	);
}
