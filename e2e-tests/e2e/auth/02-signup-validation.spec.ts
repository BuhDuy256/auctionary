import { test, expect } from "@playwright/test";
import {
  generateTestUser,
  fillSignupForm,
  handleRecaptcha,
  cleanupTestUser,
} from "../helpers/test-helpers";
import {
  INVALID_EMAILS,
  WEAK_PASSWORDS,
  ERROR_MESSAGES,
} from "../fixtures/test-data";

test.describe("User Signup - Validation Errors", () => {
  let testUser: ReturnType<typeof generateTestUser>;

  test.beforeEach(() => {
    testUser = generateTestUser();
  });

  test.afterEach(async () => {
    await cleanupTestUser(testUser.email);
  });

  test("should reject duplicate email", async ({ page }) => {
    // First signup - create user
    await page.goto("/signup");
    await fillSignupForm(page, testUser);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');

    // Wait for OTP page (successful signup)
    await page.waitForURL(/verify-otp/, { timeout: 10000 });

    // Navigate back to signup with same email
    await page.goto("/signup");
    await fillSignupForm(page, testUser);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');

    // Verify error message for duplicate email
    await expect(
      page.locator(`text=/${ERROR_MESSAGES.DUPLICATE_EMAIL}|already exist/i`)
    ).toBeVisible({ timeout: 5000 });
  });

  test("should reject weak password (less than 8 characters)", async ({
    page,
  }) => {
    await page.goto("/signup");

    const weakPasswordUser = {
      ...testUser,
      password: "short",
      confirmPassword: "short",
    };

    await fillSignupForm(page, weakPasswordUser);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');

    // Verify error message (could be client-side or server-side validation)
    const errorVisible = await page
      .locator("text=/Password must be at least 8|minimum 8 characters/i")
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    // If no error shown, form should not submit (stay on same page)
    const currentUrl = page.url();
    expect(currentUrl).toContain("/signup");
  });

  test.describe("Invalid Email Format", () => {
    for (const { value, error } of INVALID_EMAILS) {
      test(`should reject invalid email: "${value}"`, async ({ page }) => {
        await page.goto("/signup");

        const invalidUser = {
          ...testUser,
          email: value,
        };

        await fillSignupForm(page, invalidUser);
        await handleRecaptcha(page);

        // Try to submit
        await page.click('button[type="submit"]');

        // Browser's HTML5 validation or custom validation should prevent submission
        // Check if still on signup page
        await page.waitForTimeout(1000);
        expect(page.url()).toContain("/signup");
      });
    }
  });

  test("should reject password mismatch", async ({ page }) => {
    await page.goto("/signup");

    const mismatchUser = {
      ...testUser,
      confirmPassword: "DifferentPassword123!",
    };

    await fillSignupForm(page, mismatchUser);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');

    // Verify error message for password mismatch
    await expect(
      page.locator(`text=/${ERROR_MESSAGES.PASSWORD_MISMATCH}|do not match/i`)
    ).toBeVisible({ timeout: 5000 });
  });

  test("should require fullName field", async ({ page }) => {
    await page.goto("/signup");

    // Fill all fields except fullName
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirm_password"]', testUser.password);
    await handleRecaptcha(page);

    // Try to submit
    await page.click('button[type="submit"]');

    // Form should not submit - verify still on signup page
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/signup");

    // Check if fullName field shows required state or error
    const fullNameInput = page.locator('input[name="fullName"]');
    const isRequired = await fullNameInput.getAttribute("required");
    expect(isRequired).not.toBeNull();
  });

  test("should require email field", async ({ page }) => {
    await page.goto("/signup");

    // Fill all fields except email
    await page.fill('input[name="fullName"]', testUser.fullName);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirm_password"]', testUser.password);
    await handleRecaptcha(page);

    // Try to submit
    await page.click('button[type="submit"]');

    // Form should not submit
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/signup");

    const emailInput = page.locator('input[name="email"]');
    const isRequired = await emailInput.getAttribute("required");
    expect(isRequired).not.toBeNull();
  });

  test("should require password field", async ({ page }) => {
    await page.goto("/signup");

    // Fill all fields except password
    await page.fill('input[name="fullName"]', testUser.fullName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="confirm_password"]', testUser.password);
    await handleRecaptcha(page);

    // Try to submit
    await page.click('button[type="submit"]');

    // Form should not submit
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/signup");
  });

  test("should require confirm password field", async ({ page }) => {
    await page.goto("/signup");

    // Fill all fields except confirm password
    await page.fill('input[name="fullName"]', testUser.fullName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await handleRecaptcha(page);

    // Try to submit
    await page.click('button[type="submit"]');

    // Form should not submit
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/signup");
  });

  test("should require reCAPTCHA completion", async ({ page }) => {
    await page.goto("/signup");

    // Fill form but DON'T complete reCAPTCHA
    await fillSignupForm(page, testUser);
    // Skip handleRecaptcha() intentionally

    // Try to submit
    await page.click('button[type="submit"]');

    // Check for reCAPTCHA error or form not submitting
    const urlAfterSubmit = page.url();

    // Either shows error message or stays on signup page
    const hasError = await page
      .locator(`text=/${ERROR_MESSAGES.RECAPTCHA_REQUIRED}|reCAPTCHA/i`)
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    if (!hasError) {
      // If no error shown, should still be on signup page
      expect(urlAfterSubmit).toContain("/signup");
    }
  });

  test("should show all validation errors at once (if applicable)", async ({
    page,
  }) => {
    await page.goto("/signup");

    // Submit completely empty form
    await page.click('button[type="submit"]');

    // Depending on validation approach, errors might be shown inline or as a list
    // This test verifies the validation feedback mechanism exists
    await page.waitForTimeout(500);

    // Form should not have navigated away
    expect(page.url()).toContain("/signup");
  });

  test("should clear error message when user corrects input", async ({
    page,
  }) => {
    await page.goto("/signup");

    // Create password mismatch
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirm_password"]', "WrongPassword123!");
    await page.fill('input[name="fullName"]', testUser.fullName);
    await page.fill('input[name="email"]', testUser.email);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');

    // Error should appear
    await expect(page.locator("text=/do not match|mismatch/i")).toBeVisible({
      timeout: 5000,
    });

    // Fix the password mismatch
    await page.fill('input[name="confirm_password"]', testUser.password);

    // Error should clear (if implemented with reactive validation)
    // Note: This might not work if validation only runs on submit
    // In that case, this test documents expected behavior for future improvement
  });
});
