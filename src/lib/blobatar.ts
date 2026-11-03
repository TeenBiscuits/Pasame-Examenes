import { palette, traits } from "blobatar";

export const BLOBATAR_TONE = 0.71;

export function getBlobatarColor(name: string) {
	const hue = traits(name).num("hue", 0, 360);
	return palette(hue, true, BLOBATAR_TONE).head ?? "currentColor";
}
