import { configureBoneyard } from "boneyard-js/react";
import "../bones/registry";

// The Vite plugin generates registrations, but does not apply runtime config.
// Palette tokens resolve in both color schemes without requiring a .dark class.
configureBoneyard({
	shimmerColor: "var(--color-surface-alt)",
	darkShimmerColor: "var(--color-surface-alt)",
});
