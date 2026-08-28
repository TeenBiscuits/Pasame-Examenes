import { defineUnlighthouseConfig } from "unlighthouse/config";

const site =
	process.env.UNLIGHTHOUSE_SITE?.trim() || "http://127.0.0.1:4173";

export default defineUnlighthouseConfig({
	site,
	outputPath: "./unlighthouse/runs",
	// Keep optional promotional and repository requests out of the benchmark.
	// These values affect only the isolated Unlighthouse browser context.
	localStorage: {
		star_popup_dismissed: String(Date.now()),
	},
	sessionStorage: {
		gh_star_count: "0",
		gh_star_count_ts: String(Date.now()),
	},
	// Each run should produce fresh Lighthouse data instead of restoring a
	// previous report from Unlighthouse's cache.
	cache: false,
	scanner: {
		device: "mobile",
		throttle: true,
		samples: 3,
		crawler: true,
		dynamicSampling: false,
		maxRoutes: false,
		sitemap: ["/sitemap.xml"],
		// The local sitemap is the source of truth for route discovery.
		robotsTxt: false,
	},
	lighthouseOptions: {
		onlyCategories: ["performance"],
	},
	// Keep scans serial so a full local run does not create a burst of
	// requests to optional third-party services.
	puppeteerClusterOptions: {
		maxConcurrency: 1,
	},
});
