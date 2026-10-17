import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { ResponsiveBones } from "boneyard-js/react";
import config from "../boneyard.config.json";

for (const kind of ["practice", "exam"]) {
	const name = `simulator-${kind}`;
	const file = new URL(`../src/bones/${name}.bones.json`, import.meta.url);
	const data: ResponsiveBones = JSON.parse(readFileSync(file, "utf8"));
	for (const width of config.breakpoints) {
		const capture = data.breakpoints[width];
		assert(capture, `${name}: missing ${width}px capture`);
		assert(capture.height > 0, `${name}: ${width}px capture has no height`);
		assert(capture.bones.length > 0, `${name}: ${width}px capture has no bones`);
	}
}

console.log("Both simulator skeletons have non-empty captures at every breakpoint.");
