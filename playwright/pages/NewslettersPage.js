import { expect } from '@playwright/test';

class NewslettersPage {
    constructor(page) {
        this.page = page;

        // Locators for Letter title and total card
        this.headingLetter = page.getByRole('heading', { level: 1, name: /newsletters/i });
        this.cards = page.locator('div.newsletter-manager__signup.newsletter');

        // Locators for subscribing new letters
        this.emailInput = page.getByLabel('Email');
        this.agreeLabel = page.locator('label[for="newsletter-signup__newsletters-page_agree"]'); // For clicking the accept button
        this.agreeInput = page.locator('#newsletter-signup__newsletters-page_agree'); // For assertion of accept button
        this.signUpButton = page.getByRole('button', { name: 'Sign Up' });

        // Match exact success text (Result messages)
        this.successMessage = page.getByText(/signed up/i);
        this.errorMessage = page.getByText(/something went wrong/i);

        // Newsletter card button states
        this.cardAddBtn = (card) => card.getByRole('button', { name: /subscribe to newsletter/i }); // "+" button
        this.cardSelectedBtn = (card) => card.getByRole('button', { name: /unsubscribe/i }); // "Ticked" button
    }

    // Navigation 
    async goto() {
        await this.page.goto('/newsletters/', { waitUntil: 'domcontentloaded' });
    }

    // Assertion 'Newsletters' title is visible when the page loads
    async expectPageLoaded() {
        await expect(this.headingLetter).toBeVisible();
    }

    // Step 1: select 2 newsletters and verify "+" becomes "tick" 
    async clickFirstTwo() {
        await expect(this.cards.first()).toBeVisible();
        for (let i = 0; i < 2; i++) {
            const card = this.cards.nth(i);
            const addBtn = this.cardAddBtn(card);

            // Assertion for + visible
            await expect(addBtn).toBeVisible();

            // click "+"
            await addBtn.click();

            // after click, the selected/tick button should appear
            await expect(this.cardSelectedBtn(card)).toBeVisible();
        }
    }

    // Step 2: fill form, click tick consent, submit
    async submitForm(email) {
        // assert email form is visible, then fill the email
        await expect(this.emailInput).toBeVisible();
        await this.emailInput.fill(email);

        // tick agree checkbox and assert checkbox is checked
        await expect(this.agreeLabel).toBeVisible();
        await this.agreeLabel.click();
        await expect(this.agreeInput).toBeChecked();

        // Assert sign up button is visible, then click sign up
        await expect(this.signUpButton).toBeVisible();
        await this.signUpButton.click();
    }

    // Step 3: wait for success OR error message 
    async checkMessage() {
        // waits until either success or error appears
        await expect(this.successMessage.or(this.errorMessage)).toBeVisible();

        // return result so test can assert what it wants
        return (await this.successMessage.isVisible()) ? 'success' : 'error';
    }

    // Negative test: invalid email 
    async submitInvalidEmail(email) {
        await expect(this.emailInput).toBeVisible();
        await this.emailInput.fill(email);
        await this.agreeLabel.click();
        await this.signUpButton.click();
    }

    // Invalid email assertion
    async expectEmailToBeInvalid() {
        // HTML validity.valid should be false
        await expect(this.emailInput).toHaveJSProperty('validity.valid', false);
    }
}

export default NewslettersPage;





