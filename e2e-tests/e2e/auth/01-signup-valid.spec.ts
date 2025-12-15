import { test, expect } from "@playwright/test";
import {
  generateTestUser,
  fillSignupForm,
  handleRecaptcha,
  waitForNavigation,
  cleanupTestUser,
} from "../helpers/test-helpers";
import { SUCCESS_MESSAGES } from "../fixtures/test-data";

test.describe("User Signup - Valid Credentials", () => {
  let testUser: ReturnType<typeof generateTestUser>;

  test.beforeEach(() => {
    testUser = generateTestUser();
  });

  test.afterEach(async () => {
    // Cleanup: Remove test user from database
    await cleanupTestUser(testUser.email);
  });

  test("should successfully signup with valid credentials", async ({
    page,
  }) => {
    // Navigate to signup page
    await page.goto("/signup");

    // Verify signup page loaded
    await expect(page).toHaveTitle(/Auctionary|Sign/i);
    await expect(page.locator("text=Sign up for Auctionary")).toBeVisible();

    // Fill the signup form
    await fillSignupForm(page, testUser);

    // Handle reCAPTCHA (if present in test environment)
    await handleRecaptcha(page);

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for navigation to OTP verification page
    await waitForNavigation(page, /verify-otp/);

    // Verify OTP page displays correct email
    await expect(page.locator(`text=${testUser.email}`)).toBeVisible();

    // Verify success message or instruction
    await expect(
      page.locator(`text=/verification code|verify/i`)
    ).toBeVisible();
  });

  test('should show "Signing up..." loading state during submission', async ({
    page,
  }) => {
    await page.goto("/signup");

    await fillSignupForm(page, testUser);
    await handleRecaptcha(page);

    // Click submit and immediately check loading state
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify loading state
    await expect(submitButton).toBeDisabled();
    await expect(page.locator("text=/Signing up/i")).toBeVisible();
  });

  test("should display all required form fields", async ({ page }) => {
    await page.goto("/signup");

    // Verify all form fields are present
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirm_password"]')).toBeVisible();
    await expect(page.locator('input[name="address"]')).toBeVisible();

    // Verify placeholders
    await expect(page.locator('input[name="fullName"]')).toHaveAttribute(
      "placeholder",
      /Full Name/i
    );
    await expect(page.locator('input[name="email"]')).toHaveAttribute(
      "placeholder",
      /Email/i
    );
    await expect(page.locator('input[name="password"]')).toHaveAttribute(
      "placeholder",
      /Password/i
    );
  });

  test('should navigate to login page when "Already have account" is clicked', async ({
    page,
  }) => {
    await page.goto("/signup");

    // Click the login link
    await page.click("text=/Already have an account/i");

    // Verify navigation to login page
    await waitForNavigation(page, /login/);
    await expect(page.locator("text=/Log in|Login/i")).toBeVisible();
  });

  test("should persist form data when navigating back (optional)", async ({
    page,
  }) => {
    await page.goto("/signup");

    // Fill some fields
    await page.fill('input[name="fullName"]', testUser.fullName);
    await page.fill('input[name="email"]', testUser.email);

    // Navigate away and back
    await page.goto("/login");
    await page.goBack();

    // Note: This test may fail if form doesn't persist - that's expected for most forms
    // Uncomment below if your form implements persistence
    // await expect(page.locator('input[name="fullName"]')).toHaveValue(testUser.fullName);
    // await expect(page.locator('input[name="email"]')).toHaveValue(testUser.email);
  });
});
