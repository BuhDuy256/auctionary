# E2E Tests for Auctionary

This directory contains end-to-end tests for the Auctionary application using Playwright.

## Prerequisites

- Node.js 16+ installed
- Both frontend and backend servers must be running
- Playwright browsers installed

## Installation

```bash
cd e2e-tests
npm install
npx playwright install
```

## Configuration

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Update `.env` with your local environment settings:

- `FRONTEND_URL`: Your frontend dev server URL (default: `http://localhost:5173`)
- `BACKEND_URL`: Your backend dev server URL (default: `http://localhost:3000`)

## Setup Before Running Tests

### 1. Start the Servers

**Terminal 1 - Backend:**

```bash
cd ../backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd ../frontend
npm run dev
```

### 2. Configure OTP Retrieval (Important!)

The tests need to retrieve OTP codes for verification. You have several options:

#### Option A: Create a Test API Endpoint (Recommended)

Add a test endpoint in your backend that returns the latest OTP for a given email:

```typescript
// backend/src/api/routes/test.route.ts (only in development)
router.get("/test/get-otp/:email", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Not found" });
  }

  const { email } = req.params;
  const otp = await otpRepository.getLatestOTP(email);
  res.json({ otp: otp?.code });
});
```

Then update `e2e/helpers/test-helpers.ts` → `getOTPForUser()` to call this endpoint.

#### Option B: Direct Database Query

Update `getOTPForUser()` to query your database directly.

#### Option C: Use Mock OTP (Quick Start)

For initial testing, the tests will use a mock OTP (`123456`). This won't work with real backend validation.

### 3. Handle reCAPTCHA

For E2E tests, reCAPTCHA should be disabled or use test keys:

**Option 1: Test reCAPTCHA Key**

- Use Google's test site key: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- This key always passes validation

**Option 2: Environment Variable**

- Set `SKIP_RECAPTCHA=true` in backend `.env` for test environment
- Update reCAPTCHA middleware to skip validation when this flag is set

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test Suite

```bash
npx playwright test auth/01-signup-valid
npx playwright test auth/02-signup-validation
npx playwright test auth/03-otp-verification
npx playwright test auth/04-otp-resend
npx playwright test auth/05-otp-navigation
```

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Only on Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## View Test Results

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Test Structure

```
e2e-tests/
├── e2e/
│   ├── auth/                           # Authentication tests
│   │   ├── 01-signup-valid.spec.ts     # Valid signup flow
│   │   ├── 02-signup-validation.spec.ts # Signup validation errors
│   │   ├── 03-otp-verification.spec.ts  # OTP verification flow
│   │   ├── 04-otp-resend.spec.ts       # Resend OTP functionality
│   │   └── 05-otp- navigation.spec.ts   # Edge cases & navigation
│   ├── helpers/
│   │   └── test-helpers.ts             # Reusable test utilities
│   └── fixtures/
│       └── test-data.ts                # Test data & constants
├── playwright.config.ts                # Playwright configuration
├── .env.example                        # Environment variables template
└── README.md                          # This file
```

## Test Coverage

### User Registration (Section 1.1 of E2E Checklist)

✅ **Signup with Valid Credentials**

- Email validation
- Password strength enforcement
- reCAPTCHA validation
- OTP sent to email
- Redirect to OTP verification page

✅ **Signup with Invalid Data**

- Duplicate email rejection
- Weak password rejection
- Invalid email format rejection
- Missing required fields validation

✅ **OTP Verification**

- Valid OTP code verification
- Invalid OTP code rejection
- Expired OTP rejection
- Resend OTP functionality
- Post-verification redirect

## Troubleshooting

### Tests Fail with "Timeout" Error

- Ensure frontend and backend servers are running
- Check that URLs in `.env` are correct
- Verify servers are accessible at configured URLs

### Tests Fail with "OTP Invalid" Error

- Implement `getOTPForUser()` function in `test-helpers.ts`
- Ensure OTP retrieval method is working
- Check that OTP expiration time is sufficient

### Tests Fail with "reCAPTCHA Required" Error

- Use test reCAPTCHA key or disable reCAPTCHA for tests
- Update `.env` to skip reCAPTCHA validation

### Tests Fail on "Duplicate Email"

- Ensure test cleanup is working (`cleanupTestUser()`)
- Manually clear test users from database
- Use unique email prefixes with timestamps

## Writing New Tests

1. Create a new `.spec.ts` file in the appropriate directory
2. Import helpers from `../helpers/test-helpers`
3. Import test data from `../fixtures/test-data`
4. Use descriptive test names that match the E2E checklist
5. Clean up test data in `afterEach()` hooks

Example:

```typescript
import { test, expect } from "@playwright/test";
import { generateTestUser, cleanupTestUser } from "../helpers/test-helpers";

test.describe("My New Feature", () => {
  let testUser;

  test.beforeEach(() => {
    testUser = generateTestUser();
  });

  test.afterEach(async () => {
    await cleanupTestUser(testUser.email);
  });

  test("should do something", async ({ page }) => {
    // Your test code here
  });
});
```

## Continuous Integration

To run tests in CI/CD:

```bash
# Install dependencies
npm ci
npx playwright install --with-deps

# Run tests
npx playwright test --reporter=github
```

## Notes

- Tests run sequentially to avoid authentication conflicts
- Test user emails are generated with timestamps to ensure uniqueness
- Screenshots and videos are captured on test failures
- HTML report is generated after each test run

## Need Help?

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [E2E Test Checklist](./e2e/e2e_test_checklist.md)
