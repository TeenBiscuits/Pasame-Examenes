import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// Reuse the browser already installed by Unlighthouse; no extra dependency/download.
const requireUnlighthouse = createRequire(import.meta.resolve("unlighthouse"));
const { default: puppeteer } = await import(
	pathToFileURL(requireUnlighthouse.resolve("puppeteer")).href
);
const site = new URL(process.env.SITE_URL ?? "http://127.0.0.1:3000");
const browser = await puppeteer.launch({ headless: true });

try {
	for (const [width, lang] of [
		[320, "es"],
		[320, "gl"],
		[320, "en"],
		[390, "es"],
		[430, "es"],
		[768, "es"],
		[1440, "es"],
	]) {
		const context = await browser.createBrowserContext();
		try {
			const page = await context.newPage();
			await page.setViewport({
				width,
				height: 900,
				isMobile: width < 640,
				hasTouch: width < 640,
			});
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				const url = new URL(request.url());
				if (url.origin === site.origin || url.protocol === "data:") {
					void request.continue();
				} else {
					void request.abort();
				}
			});
			await page.goto(new URL(`/${lang}`, site).href, {
				waitUntil: "networkidle2",
			});
			await page.waitForSelector(".home-quote-avatar__swim");
			// Prove the names themselves fit, rather than merely being clipped.
			const unclipped = await page.addStyleTag({
				content: ".home-quote__viewport { overflow: visible !important; }",
			});
			for (const longNames of [false, true]) {
				if (longNames) {
					await page.$$eval(".home-quote-avatar__tooltip a span", (names) => {
						for (const name of names) name.textContent = `@${"w".repeat(39)}`;
					});
				}
				for (const visible of [false, true]) {
					await page.$$eval(
						".home-quote-avatar",
						(avatars, shown) => {
							for (const avatar of avatars)
								avatar.dataset.namePinned = String(shown);
						},
						visible,
					);
					const failures = await page.evaluate(() => {
						const failures = [];
						for (const phase of [0, 0.16, 0.32, 0.48, 0.84, 1]) {
							for (const swim of document.querySelectorAll(
								".home-quote-avatar__swim",
							)) {
								for (const animation of swim.getAnimations()) {
									animation.pause();
									const { duration, delay } = animation.effect.getTiming();
									animation.currentTime =
										delay + Number(duration) * (1 + phase);
								}
							}
							const viewport = document.documentElement.clientWidth;
							const scroll = document.documentElement.scrollWidth;
							const outside = [
								...document.querySelectorAll(".home-quote-avatar__tooltip"),
							]
								.map((name) => name.getBoundingClientRect())
								.filter(
									(bounds) => bounds.left < -1 || bounds.right > viewport + 1,
								)
								.map(({ left, right }) => ({ left, right }));
							if (scroll > viewport || outside.length) {
								failures.push({ phase, viewport, scroll, outside });
							}
						}
						return failures;
					});
					assert.deepEqual(
						failures,
						[],
						`${width}/${lang}, longNames=${longNames}, visible=${visible}`,
					);
				}
			}
			await unclipped.evaluate((style) => style.remove());
			await page.addStyleTag({
				content: "html { scroll-behavior: auto !important; }",
			});
			const avatar = await page.$(".home-quote-avatar:has(a)");
			await avatar.evaluate((element) =>
				element.scrollIntoView({ behavior: "instant", block: "center" }),
			);
			const button = await avatar.$("button");
			// Exercise the actual drag bounds at both lateral edges.
			for (const x of [width - 1, 1]) {
				const bounds = await button.boundingBox();
				await page.mouse.move(
					bounds.x + bounds.width / 2,
					bounds.y + bounds.height / 2,
				);
				await page.mouse.down();
				await page.mouse.move(x, bounds.y + bounds.height / 2, { steps: 8 });
				await page.mouse.up();
				await page.waitForFunction(
					() =>
						document.documentElement.scrollWidth <=
						document.documentElement.clientWidth,
				);
				const nameBounds = await avatar.$eval(
					".home-quote-avatar__tooltip",
					(name) => {
						const { left, right } = name.getBoundingClientRect();
						return {
							left,
							right,
							viewport: document.documentElement.clientWidth,
						};
					},
				);
				assert(
					nameBounds.left >= -1 && nameBounds.right <= nameBounds.viewport + 1,
					JSON.stringify(nameBounds),
				);
			}
			console.log(
				`PASS ${width}px/${lang}: swimming, hidden/visible/long names and both drag edges`,
			);
		} finally {
			await context.close();
		}
	}
} finally {
	await browser.close();
}
