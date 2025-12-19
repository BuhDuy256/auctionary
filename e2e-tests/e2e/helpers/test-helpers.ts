import { Page, expect } from "@playwright/test";

/**
 * Generate random email for testing
 */
export function generateTestEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test.e2e.${timestamp}.${random}@example.com`;
}

/**
 * Generate random user data
 */
export function generateTestUser() {
  const email = generateTestEmail();
  return {
    fullName: "Test User Auctionary",
    email,
    password: "TestPassword123!",
    address: "123 Test Street, Test City",
  };
}

/**
 * Fill signup form
 */
export async function fillSignupForm(
  page: Page,
  userData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    address?: string;
  }
) {
  await page.fill('input[name="fullName"]', userData.fullName);
  await page.fill('input[name="email"]', userData.email);
  await page.fill('input[name="password"]', userData.password);
  await page.fill(
    'input[name="confirm_password"]',
    userData.confirmPassword || userData.password
  );

  if (userData.address) {
    await page.fill('input[name="address"]', userData.address);
  }
}

/**
 * Handle reCAPTCHA (skip in test environment)
 * In production, you might use a test reCAPTCHA key or mock the verification
 */
export async function handleRecaptcha(page: Page) {
  // Check if reCAPTCHA is present
  const recaptchaFrame = page.frameLocator('iframe[src*="recaptcha"]').first();
  const recaptchaCheckbox = recaptchaFrame.locator(".recaptcha-checkbox");

  try {
    // Wait for reCAPTCHA to load (with short timeout)
    await recaptchaCheckbox.waitFor({ timeout: 3000 });

    // In test environment, reCAPTCHA might be disabled or use test keys
    // If present, try to check it
    if (await recaptchaCheckbox.isVisible()) {
      await recaptchaCheckbox.click();
      // Wait for verification
      await page.waitForTimeout(1000);
    }
  } catch (error) {
    // reCAPTCHA not present or disabled in test mode - continue
    console.log("reCAPTCHA not found or already bypassed");
  }
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(
  page: Page,
  expectedUrl: string | RegExp
) {
  await page.waitForURL(expectedUrl, { timeout: 10000 });
}

/**
 * Get OTP from database or test API endpoint
 * IMPORTANT: Implement this function to fetch real OTP for actual E2E tests
 *
 * Backend stores OTPs in 'user_otps' table with columns:
 * - user_id, otp_code, purpose ('signup' | 'reset_password'), expires_at, consumed_at
 */
export async function getOTPForUser(email: string): Promise<string> {
  // OPTION 1: Query database directly (requires database connection in tests)
  // import db from '../path-to-db-config';
  // const user = await db('users').where({ email }).first();
  // if (!user) throw new Error('User not found');
  // const otp = await db('user_otps')
  //   .where({ user_id: user.id, purpose: 'signup', consumed_at: null })
  //   .orderBy('created_at', 'desc')
  //   .first();
  // return otp?.otp_code;

  // OPTION 2: Call test API endpoint (recommended - create this endpoint for testing)
  // const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
  // const response = await fetch(`${BACKEND_URL}/api/test/get-otp`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, purpose: 'signup' })
  // });
  // const data = await response.json();
  // return data.otpCode;

  // OPTION 3: For development/demo - return mock OTP
  // WARNING: This will fail with real backend unless OTP happens to be '123456'
  console.warn("⚠️ Using mock OTP - implement getOTPForUser() for real tests");
  return "123456"; // Mock OTP - replace with real implementation
}

/**
 * Fill OTP input (handles individual digit inputs)
 */
export async function fillOTPInput(page: Page, otp: string) {
  // Wait for OTP inputs to be visible and ready
  // OTP inputs have inputMode="numeric" and maxLength="1"
  const multipleInputs = page.locator(
    'input[inputMode="numeric"][maxLength="1"]'
  );

  // Wait for first input to be visible
  await multipleInputs.first().waitFor({ state: "visible", timeout: 5000 });

  const inputCount = await multipleInputs.count();

  if (inputCount === 6) {
    // Multiple input fields (one per digit) - fill each digit
    for (let i = 0; i < 6; i++) {
      await multipleInputs.nth(i).fill(otp[i]);
    }
  } else {
    // Fallback: try single input field
    const singleInput = page.locator('input[type="text"][maxlength="6"]');
    const singleInputCount = await singleInput.count();

    if (singleInputCount > 0) {
      await singleInput.fill(otp);
    } else {
      throw new Error(
        `OTP input fields not found. Expected 6 inputs, found ${inputCount}`
      );
    }
  }
}

/**
 * Wait for toast/notification
 */
export async function waitForToast(page: Page, message: string | RegExp) {
  const toast = page.locator("text=" + message);
  await expect(toast).toBeVisible({ timeout: 5000 });
}

/**
 * Check if element has error state
 */
export async function hasErrorState(
  page: Page,
  selector: string
): Promise<boolean> {
  const element = page.locator(selector);
  const classes = await element.getAttribute("class");
  return classes?.includes("error") || classes?.includes("invalid") || false;
}

/**
 * Clean up test user from database
 * This is a placeholder - implement based on your setup
 */
export async function cleanupTestUser(email: string) {
  // OPTION 1: Direct database cleanup
  // await pool.query('DELETE FROM users WHERE email = $1', [email]);
  // await pool.query('DELETE FROM otps WHERE email = $1', [email]);

  // OPTION 2: Call test API endpoint
  // await fetch(`${process.env.BACKEND_URL}/test/cleanup-user/${email}`, {
  //   method: 'DELETE'
  // });

  console.log(`🧹 Cleanup test user: ${email}`);
}

/**
 * Verify email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verify password strength
 */
export function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Take screenshot with custom name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Verify user is logged in (check for token in localStorage)
 */
export async function isUserLoggedIn(page: Page): Promise<boolean> {
  const token = await page.evaluate(() => localStorage.getItem("token"));
  return !!token;
}

/**
 * Logout user (clear session)
 */
export async function logoutUser(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem("token");
    localStorage.clear();
  });
}

/**
 * Get current user from localStorage
 */
export async function getCurrentUser(page: Page) {
  return await page.evaluate(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // Decode JWT token (basic implementation)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  });
}
