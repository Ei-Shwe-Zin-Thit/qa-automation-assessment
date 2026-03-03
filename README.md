# Playwright Automated Testing task

## Overview
This exercise evaluates your ability to extend existing Playwright tests using modern best practices and to design new reliable automated tests that validate real user workflows.

---

## Instructions

### Part 1: Extend API tests
Demonstrate your ability to scale an existing API test suite.

1. Extend the provided /tests/test-api.js: 

2. Add coverage for the following endpoints:

GET https://metro.co.uk/wp-json/videos/search

GET https://metro.co.uk/wp-json/metro-horoscopes/daily

3. Don't just check for a 200 OK. 

4. Validate that the JSON structure contains essential keys (e.g. video titles, horoscope signs).

5. If you find yourself duplicating logic from existing tests, refactor it using Playwright's best practices.

---

### Part 2: Newsletter Subscription Test

Create a new Playwright test that:

1. Navigates to:
   https://metro.co.uk/newsletters/

2. Subscribes successfully to **at least two newsletters** available on the page
3. Verifies that subscription action results in a visible success confirmation message

---

## Expectations

- Follow **Playwright best practices**, including:
  - Reliable waiting strategies (no hard-coded timeouts)
  - Stable locators and meaningful assertions where possible
  - Reusable utilities where appropriate 
  - Clear test structure and naming

- Do not use Cucumber/Gherkin or BDD frameworks

---

## Deliverables
- Scale the existing API test suite
- New newsletter subscription test file
- Brief documentation or inline comments explaining your approach

## My Approach

### Part 1: Extend API Tests
- Extended the existing test suite with two new endpoints: videos search and daily horoscopes
- Created a reusable `validateGetEndpoint()` helper to eliminate duplicated request logic and keep tests DRY
- Validated response structure, data types, and content format — not just checking for a 200 status code

### Part 2: Newsletter Subscription Test
- Implemented the Page Object Model (POM) pattern in `pages/NewslettersPage.js` for maintainability and separation of concerns
- Used network mocking to bypass reCAPTCHA, which cannot be reliably automated
- Covered two scenarios: a happy path (selecting 2+ newsletters, submitting a valid email, and verifying the success confirmation message) and a negative test (invalid email triggering HTML5 browser validation)
- Used `page.addLocatorHandler()` to handle the cookie consent banner 

