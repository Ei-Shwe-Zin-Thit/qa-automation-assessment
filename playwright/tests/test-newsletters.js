import { test, expect } from '@playwright/test';
import NewslettersPage from '../pages/NewslettersPage';
import { validEmail, invalidEmail } from '../tests-config/test-data.js';

test.describe('Metro newsletters', () => {
  test.beforeEach(async ({ page }) => {

    // Hide the browser automation flag before each test
    // (Setting it to undefined makes the browser look like a real user)
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    // Handle cookie consent banner
    await page.addLocatorHandler(
      page.getByRole('button', { name: /^Accept$/i }),
      async (btn) => {
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
        }
      }
    );

    // NOTE: Metro's newsletter form is protected by Google reCAPTCHA which
    // blocks automated submissions with a 401. I mocked the subscription API
    // so tests are independent of third-party services.
    // The success response shape was determined by reading JS source:
    // success requires { success: true, response: "string" }
    await page.route('**', async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (url.includes('newsletter/subscriber')) {
        if (method === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ response: 'User not found', success: false }),
          });
        } else if (method === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              response: "Great, You're signed up! Remember to check your inbox"
            }),
          });
        } else {
          await route.continue();
        }
      } else {
        await route.continue();
      }
    });
  });

  // Happy path testing (Input is valid email)
  test('Subscribe to two newsletters and verify success message', async ({ page }) => {
    const newsletters = new NewslettersPage(page);

    await newsletters.goto();
    await newsletters.expectPageLoaded();
    await newsletters.clickFirstTwo();
    await newsletters.submitForm(validEmail());

    const result = await newsletters.checkMessage();
    expect(result).toBe('success');
  });

  // Negative testing (Input invalid email)
  test('Invalid email shows browser validation (negative test)', async ({ page }) => {
    const newsletters = new NewslettersPage(page);

    await newsletters.goto();
    await newsletters.expectPageLoaded();
    await newsletters.clickFirstTwo();

    await newsletters.submitInvalidEmail(invalidEmail);
    await newsletters.expectEmailToBeInvalid();
  });
});