import { test, expect } from "@playwright/test";
import { API_ENDPOINTS, ZODIAC_SIGNS } from "../tests-config/api-test-data.js";

// Reusable helper function for GET endpoints to avoid duplication
// Validates status code and content type, then returns JSON body
async function validateGetEndpoint(request, endpoint) {
	const response = await request.get(endpoint);

	// Validate status code
	expect(response.status()).toBe(200);

	// Validate response is JSON
	expect(response.headers()['content-type']).toContain('application/json');

	// Return json
	return await response.json();
}

test.describe("Test WP-JSON @api endpoints @desktopOnly", () => {

	// Test metro app editions endpoint
	test("Test metro app editions endpoint", async ({ request }) => {
		// Call reusable helper
		const body = await validateGetEndpoint(
			request,
			API_ENDPOINTS.appEditions
		);

		// Validate response is an array with data
		expect(Array.isArray(body)).toBeTruthy();
		expect(body.length).toBeGreaterThan(0);

		// Checking the structure of the first edition, as all other editions follow the same structure.
		const firstEdition = body[0];

		// Validate key fields exist
		expect(firstEdition).toHaveProperty("id");
		expect(firstEdition).toHaveProperty("date_gmt");
		expect(firstEdition).toHaveProperty("slug");
		expect(firstEdition).toHaveProperty("title");
		expect(firstEdition).toHaveProperty("featured_media_sizes");
		expect(firstEdition).toHaveProperty("metro_app_edition_puzzle_plus");

		// Validate types
		expect(typeof firstEdition.id).toBe("number");
		expect(typeof firstEdition.slug).toBe("string");
		expect(typeof firstEdition.title).toBe("string");

		// Validate date format is correct e.g. "2026-03-03T00:05:00Z"
		expect(typeof firstEdition.date_gmt).toBe("string");
		expect(firstEdition.date_gmt).toMatch(/^\d{4}-\d{2}-\d{2}T/);

		// Validate puzzle_plus is a boolean (true or false)
		expect(typeof firstEdition.metro_app_edition_puzzle_plus).toBe("boolean");

		// Validate featured_media_sizes has portrait with a valid URL
		expect(firstEdition.featured_media_sizes).toHaveProperty("portrait");
		expect(firstEdition.featured_media_sizes.portrait).toHaveProperty("url");
		expect(firstEdition.featured_media_sizes.portrait.url).toContain("metro.co.uk");
	});

	// Test trending commercial video endpoint
	test("Test trending commercial video endpoint", async ({ request, isMobile }) => {
		// Skip for mobile viewports
		test.skip(isMobile, "This test is not applicable to mobile viewports");

		// Call reusable helper
		const body = await validateGetEndpoint(
			request,
			API_ENDPOINTS.trendingVideos
		);

		// Validate root structure
		expect(body).toHaveProperty("videos");
		expect(body).toHaveProperty("total");

		expect(Array.isArray(body.videos)).toBeTruthy();
		expect(typeof body.total).toBe("number");

		// Ensure at least one video exists
		expect(body.videos.length).toBeGreaterThan(0);

		// Validate total matches actual videos count
		expect(body.total).toBe(body.videos.length);

		// Checking the structure of the first video, as all other videos follow the same structure.
		const firstVideo = body.videos[0];

		// Validate key fields exist
		expect(firstVideo).toHaveProperty("id");
		expect(firstVideo).toHaveProperty("headline");
		expect(firstVideo).toHaveProperty("duration");
		expect(firstVideo).toHaveProperty("adsEnabled");
		expect(firstVideo).toHaveProperty("metroReadMore");

		// Validate types
		expect(typeof firstVideo.id).toBe("number");
		expect(typeof firstVideo.headline).toBe("string");
		expect(typeof firstVideo.duration).toBe("number");
		expect(typeof firstVideo.adsEnabled).toBe("boolean");

		// Validate headline is not empty
		expect(firstVideo.headline.length).toBeGreaterThan(0);

		// Validate duration is a positive number 
		expect(firstVideo.duration).toBeGreaterThan(0);

		// Validate metroReadMore is an array with 3 items
		// [url, Readmore information, Readmore type]
		expect(Array.isArray(firstVideo.metroReadMore)).toBeTruthy();
		expect(firstVideo.metroReadMore.length).toBe(3);
		expect(firstVideo.metroReadMore[0]).toContain('metro.co.uk');
	});

	// Test videos search endpoint
	test("Test videos search endpoint", async ({ request }) => {
		// Call reusable helper
		const body = await validateGetEndpoint(
			request,
			API_ENDPOINTS.videosSearch
		);

		// Validate root structure
		expect(body).toHaveProperty("videos");
		expect(body).toHaveProperty("total");

		expect(Array.isArray(body.videos)).toBeTruthy();
		expect(typeof body.total).toBe("number");

		// Ensure at least one video exists
		expect(body.videos.length).toBeGreaterThan(0);

		// Total should be greater than or equal to the number returned
		expect(body.total).toBeGreaterThanOrEqual(body.videos.length);

		// Checking the structure of the first video, as all other videos follow the same structure.
		const firstVideo = body.videos[0];

		// Identity fields 
		expect(firstVideo).toHaveProperty("id");
		expect(typeof firstVideo.id).toBe("number");

		expect(firstVideo).toHaveProperty("headline");
		expect(typeof firstVideo.headline).toBe("string");
		expect(firstVideo.headline.length).toBeGreaterThan(0);

		// Url should follow the Metro video path format
		expect(firstVideo).toHaveProperty("url");
		expect(typeof firstVideo.url).toBe("string");
		expect(firstVideo.url).toMatch(/^\/video\//);

		// Validate Date field 
		expect(firstVideo).toHaveProperty("createdDate");
		expect(typeof firstVideo.createdDate).toBe("string");
		expect(firstVideo.createdDate).toMatch(/^\d{4}-\d{2}-\d{2}T/);

		// Media  
		expect(firstVideo).toHaveProperty("duration");
		expect(typeof firstVideo.duration).toBe("number");
		expect(firstVideo.duration).toBeGreaterThan(0);

		// Checking Boolean flags 
		expect(typeof firstVideo.isCommercial).toBe("boolean");
		expect(typeof firstVideo.familyFriendly).toBe("boolean");
		expect(typeof firstVideo.sponsored).toBe("boolean");
		expect(typeof firstVideo.adsEnabled).toBe("boolean");

		expect(firstVideo).toHaveProperty("status");
		expect(typeof firstVideo.status).toBe("string");

		// Checking Renditions array
		expect(Array.isArray(firstVideo.renditions)).toBeTruthy();
		expect(firstVideo.renditions.length).toBeGreaterThan(0);

		const firstRendition = firstVideo.renditions[0];
		expect(firstRendition).toHaveProperty("url");
		expect(firstRendition.url).toContain("videos.metro.co.uk");
		expect(firstRendition).toHaveProperty("videoContainer");
		expect(firstRendition.videoContainer).toBe("MP4");
		expect(typeof firstRendition.videoDuration).toBe("number");
		expect(firstRendition.videoDuration).toBeGreaterThan(0);

		// Thumbimage 
		expect(firstVideo).toHaveProperty("thumbImage");
		expect(firstVideo.thumbImage).toHaveProperty("hostUrl");
		expect(firstVideo.thumbImage.hostUrl).toContain("dailymail.co.uk");
		expect(typeof firstVideo.thumbImage.width).toBe("number");
		expect(typeof firstVideo.thumbImage.height).toBe("number");

		// Validating metroReadMore is array
		expect(Array.isArray(firstVideo.metroReadMore)).toBeTruthy();
	});

	// Test videos search with invalid data
	test("Test videos search with invalid data", async ({ request }) => {
		// Call reusable helper
		const body = await validateGetEndpoint(
			request,
			API_ENDPOINTS.videosSearchInvalid
		);

		// Validate total is 0 for invalid endpoint
		expect(body).toHaveProperty("total");
		expect(body.total).toBe(0);
	});

	// Test daily horoscope endpoint
	test("Test daily horoscope endpoint", async ({ request }) => {
		// Call reusable helper
		const body = await validateGetEndpoint(
			request,
			API_ENDPOINTS.horoscopes
		);

		// Root structure validation
		expect(body).toHaveProperty("signs");
		expect(body).toHaveProperty("latest");

		expect(typeof body.signs).toBe("object");

		// "latest" is a URL to the horoscope article
		expect(typeof body.latest).toBe("string");
		expect(body.latest).toContain('metro.co.uk');
		expect(body.latest).toMatch(/^https?:\/\//);

		// Validate all 12 zodiac signs exist
		const signKeys = Object.keys(body.signs);
		expect(signKeys.length).toBe(12);

		// Validate every sign has correct structure and content
		// Checking all signs to ensure all signs are included
		ZODIAC_SIGNS.forEach(sign => {
			const horoscope = body.signs[sign];

			// Ensure sign exists
			expect(horoscope, `Missing sign: ${sign}`).toBeTruthy();

			// Validate key fields
			expect(horoscope).toHaveProperty('full');
			expect(horoscope).toHaveProperty('preview');

			// Validate types
			expect(typeof horoscope.full).toBe('string');
			expect(typeof horoscope.preview).toBe('string');

			// Validate content is not empty
			expect(horoscope.full.length).toBeGreaterThan(0);
			expect(horoscope.preview.length).toBeGreaterThan(0);

			// Preview should be shorter than full horoscope
			expect(horoscope.preview.length).toBeLessThan(horoscope.full.length);
		});
	});
});
// Checking Invalid endpoint returns 404
test("Check Invalid endpoint returns 404", async ({ request }) => {
	const response = await request.get(API_ENDPOINTS.invalidEndpoint);  //
	expect(response.status()).toBe(404);
});

