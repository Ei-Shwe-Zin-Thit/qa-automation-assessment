import { devices } from "@playwright/test";

// This is a sample config for what users might be running locally.
const config = {
	testDir: "./tests",
	testMatch: "**/test*.js",
	/* Maximum time one test can run for. */
	timeout: 30 * 1000,
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		timeout: 5000,
	},
	workers: 1,
	// @TODO find the most common browsers/sizes/devices based on our analytics.
	projects: [
		{
			name: "Google Chrome",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1280, height: 720 },
				channel: "chrome",
				headless: false,
			},
		},
		{
			name: "Mobile Safari",
			use: {
				...devices["iPhone 15"],
				headless: false,
			},
			grepInvert: /@desktopOnly/, // This excludes tests tagged with @desktopOnly
		},
	],
	reporter: [["list"], ["html", { outputFolder: "test-results" }]],
	use: {
		baseURL: process.env.BASE_URL || "https://metro.co.uk",
		trace: 'on', 
		launchOptions: { slowMo: 250 },
		// Set browser data to emulate a London location.
		geolocation: { longitude: 0.1933, latitude: 51.501 },
		locale: "en-GB",
		timezoneId: "Europe/London",
		// Send an extra header for each request so we can identify it in the logs.
		// extraHTTPHeaders: {
		// 	"X-QA-Test": "playwright",
		// },
	},
};

module.exports = config;
