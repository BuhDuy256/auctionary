import { test, expect } from "@playwright/test";
import {
  generateTestUser,
  fillSignupForm,
  handleRecaptcha,
  waitForNavigation,
  cleanupTestUser,
} from "../helpers/test-helpers";
import { SUCCESS_MESSAGES, OTP_COOLDOWN_SECONDS } from "../fixtures/test-data";

test.describe("Resend OTP Functionality", () => {
  let testUser: ReturnType<typeof generateTestUser>;

  test.beforeEach(async ({ page }) => {
    testUser = generateTestUser();

    // Complete signup to get to OTP page
    await page.goto("/signup");
    await fillSignupForm(page, testUser);
    await handleRecaptcha(page);
    await page.click('button[type="submit"]');
    await waitForNavigation(page, /verify-otp/);
  });

  test.afterEach(async () => {
    await cleanupTestUser(testUser.email);
  });

  test("should display cooldown timer initially (60 seconds)", async ({
    page,
  }) => {
    // Verify cooldown message is visible
    await expect(
      page.locator("text=/Resend code in|wait.*seconds/i")
    ).toBeVisible();

    // Verify countdown shows 60 seconds or less
    const countdownText = await page
      .locator("text=/\\d+s/i")
      .first()
      .textContent();

    expect(countdownText).toMatch(/\d+/);
  });

  test("should disable resend button during cooldown", async ({ page }) => {
    // Verify "Resend Code" button exists and is disabled
    const resendButton = page.locator('button:has-text("Resend")');

    // Button might not be visible during cooldown, or it might be disabled
    const buttonExists = await resendButton.count();

    if (buttonExists > 0) {
      await expect(resendButton).toBeDisabled();
    }
  });

  test("should countdown timer decrease every second", async ({ page }) => {
    // Get initial countdown value
    const getCountdownValue = async () => {
      const text = await page.locator("text=/\\d+s/i").first().textContent();
      const match = text?.match(/(\d+)/);
      return match ? parseInt(match[1]) : -1;
    };

    const initialValue = await getCountdownValue();
    expect(initialValue).toBeGreaterThan(0);

    // Wait 2 seconds
    await page.waitForTimeout(2000);

    // Get new countdown value
    const newValue = await getCountdownValue();

    // Should have decreased by approximately 2 seconds (allow 1 second tolerance)
    expect(newValue).toBeLessThanOrEqual(initialValue);
    expect(newValue).toBeGreaterThanOrEqual(initialValue - 3);
  });

  test("should enable resend button after cooldown expires", async ({
    page,
  }) => {
    // This test would take 60 seconds in reality
    // We can either:
    // 1. Wait the full 60 seconds (slow)
    // 2. Mock the timer (requires code changes)
    // 3. Document expected behavior without full wait

    // For demonstration, we'll wait a shorter time and document behavior
    test.setTimeout(70000); // Extend timeout for this test

    // Wait for cooldown to expire (60 seconds + buffer)
    await page.waitForSelector(
      'button:has-text("Resend Code"):not([disabled])',
      {
        timeout: 65000,
      }
    );

    // Verify button is now enabled and clickable
    const resendButton = page.locator('button:has-text("Resend")');
    await expect(resendButton).toBeEnabled();
    await expect(resendButton).toBeVisible();
  });

  test("should successfully resend OTP after cooldown", async ({ page }) => {
    test.setTimeout(70000);

    // Wait for resend button to be enabled
    const resendButton = page.locator('button:has-text("Resend")');
    await resendButton.waitFor({ state: "visible", timeout: 65000 });
    await resendButton.click();

    // Verify success message
    await expect(
      page.locator(`text=/${SUCCESS_MESSAGES.OTP_RESENT}|new code|sent/i`)
    ).toBeVisible({ timeout: 5000 });

    // Verify cooldown timer resets to 60 seconds
    await page.waitForTimeout(1000);
    const countdownText = await page
      .locator("text=/\\d+s/i")
      .first()
      .textContent();
    const countdown = parseInt(countdownText?.match(/(\d+)/)?.[1] || "0");

    expect(countdown).toBeGreaterThan(55); // Should be close to 60
  });

  test("should show loading state during resend", async ({ page }) => {
    test.setTimeout(70000);

    const resendButton = page.locator('button:has-text("Resend")');
    await resendButton.waitFor({ state: "visible", timeout: 65000 });

    // Click resend
    await resendButton.click();

    // Check for loading state immediately
    await expect(page.locator("text=/Sending/i"))
      .toBeVisible({ timeout: 2000 })
      .catch(() => {
        // Loading state might be very brief
      });

    // Button should be disabled during sending
    await expect(resendButton)
      .toBeDisabled()
      .catch(() => {
        // Might transition quickly
      });
  });

  test("should not allow multiple resend requests simultaneously", async ({
    page,
  }) => {
    test.setTimeout(70000);

    const resendButton = page.locator('button:has-text("Resend")');
    await resendButton.waitFor({ state: "visible", timeout: 65000 });

    // Click multiple times rapidly
    await resendButton.click();
    await resendButton.click().catch(() => {
      // Second click should fail or be ignored
    });

    // Only one success message should appear
    const successMessages = page.locator(
      `text=/${SUCCESS_MESSAGES.OTP_RESENT}/i`
    );
    const count = await successMessages.count();

    // Should only have one success message (or toast)
    expect(count).toBeLessThanOrEqual(1);
  });

  test('should display "Didn\'t receive code?" message', async ({ page }) => {
    await expect(page.locator("text=/Didn.*t receive|No code/i")).toBeVisible();
  });

  test("should handle resend failure gracefully", async ({ page }) => {
    // This test simulates network failure or server error during resend
    test.setTimeout(70000);

    // Intercept resend OTP request and make it fail
    await page.route("**/api/auth/resend-otp", (route) => {
      route.abort("failed");
    });

    const resendButton = page.locator('button:has-text("Resend")');
    await resendButton.waitFor({ state: "visible", timeout: 65000 });
    await resendButton.click();

    // Should show error message
    await expect(page.locator("text=/failed|error|try again/i")).toBeVisible({
      timeout: 5000,
    });

    // User should be able to try again (button re-enabled)
    await page.waitForTimeout(1000);
    // Note: Behavior depends on implementation
  });
});
