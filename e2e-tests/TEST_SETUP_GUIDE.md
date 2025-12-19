# E2E Test Setup Guide

## Overview

This guide explains how to properly set up and run E2E tests for the authentication flow.

## Current Authentication Flow

### 1. Signup Flow

- User submits signup form with reCAPTCHA
- Backend creates user with `is_verified: false`, `status: 'pending_verification'`
- Backend generates 6-digit OTP and stores in `user_otps` table
- Backend sends OTP via email
- Backend returns `accessToken` (user is auto-logged in but unverified)
- Frontend stores token in localStorage
- Frontend redirects to `/verify-otp`

### 2. OTP Verification Flow

- **IMPORTANT**: User must be authenticated (have valid token in localStorage)
- Backend endpoint `/api/auth/verify-otp` requires:
  - `requireAuth` middleware (checks token)
  - `requirePendingUser` middleware (checks user is not verified)
- User submits 6-digit OTP
- Backend validates OTP from `user_otps` table
- Backend marks user as verified (`is_verified: true`, `status: 'active'`)
- Frontend redirects to home page

### 3. Resend OTP Flow

- Requires authentication (same as verification)
- 60-second cooldown enforced on frontend
- Backend invalidates old OTPs and generates new one

## Required Backend Test Endpoint

To run E2E tests successfully, you need to create a test endpoint to retrieve OTPs. This is necessary because:

1. E2E tests run in a browser and can't directly access the database
2. Email services may not be available in test environments
3. Tests need to verify the actual OTP generation logic

### Create Test Endpoint (Development/Testing Only)

Create a new file: `backend/src/api/routes/test.route.ts`

```typescript
import express from "express";
import db from "../../database/db";

const router = express.Router();

// Only enable in test/development environments
if (process.env.NODE_ENV === "production") {
  throw new Error("Test routes should not be loaded in production!");
}

/**
 * Get OTP for a user by email (for E2E testing only)
 * POST /api/test/get-otp
 * Body: { email: string, purpose?: 'signup' | 'reset_password' }
 */
router.post("/get-otp", async (req, res) => {
  try {
    const { email, purpose = "signup" } = req.body;

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = await db("user_otps")
      .where({
        user_id: user.id,
        purpose,
        consumed_at: null,
      })
      .orderBy("created_at", "desc")
      .first();

    if (!otp) {
      return res.status(404).json({ message: "No OTP found for this user" });
    }

    res.json({
      otpCode: otp.otp_code,
      expiresAt: otp.expires_at,
      purpose: otp.purpose,
    });
  } catch (error) {
    console.error("Error fetching OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Delete test user and all related data (for cleanup after tests)
 * DELETE /api/test/cleanup-user/:email
 */
router.delete("/cleanup-user/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete in order to respect foreign key constraints
    await db("user_otps").where({ user_id: user.id }).del();
    await db("refresh_tokens").where({ user_id: user.id }).del();
    await db("users_roles").where({ user_id: user.id }).del();
    await db("users").where({ id: user.id }).del();

    res.json({ message: "User cleaned up successfully" });
  } catch (error) {
    console.error("Error cleaning up user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
```

### Register Test Routes

In `backend/src/server.ts`, add the test routes (only in non-production):

```typescript
// ... other imports
import testRouter from "./api/routes/test.route";

// ... existing middleware

// Test routes (development/testing only)
if (process.env.NODE_ENV !== "production") {
  app.use("/api/test", testRouter);
  console.log("🧪 Test routes enabled at /api/test");
}

// ... rest of routes
```

## Update Test Helpers

Update `e2e-tests/e2e/helpers/test-helpers.ts`:

```typescript
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function getOTPForUser(email: string): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/test/get-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, purpose: "signup" }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get OTP: ${response.statusText}`);
    }

    const data = await response.json();
    return data.otpCode;
  } catch (error) {
    console.error("Error fetching OTP:", error);
    throw error;
  }
}

export async function cleanupTestUser(email: string): Promise<void> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/test/cleanup-user/${encodeURIComponent(email)}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      console.log(`✅ Cleaned up test user: ${email}`);
    }
  } catch (error) {
    console.error("Error cleaning up test user:", error);
  }
}
```

## Environment Configuration

### Backend `.env`

```env
NODE_ENV=development
RECAPTCHA_SECRET_KEY=your_secret_key_here
# ... other vars
```

### E2E Tests `.env`

Create `e2e-tests/.env`:

```env
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

## Running Tests

### 1. Start Backend

```bash
cd backend
npm run dev
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Run E2E Tests

```bash
cd e2e-tests

# Run all tests
npm run test:e2e

# Run specific test suite
npm run test:e2e -- auth/01-signup-valid.spec.ts

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific browser
npm run test:e2e -- --project=chromium
```

## Important Notes

1. **reCAPTCHA in Tests**: Use test keys or bypass reCAPTCHA in test environment
   - Get test keys from: https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do
2. **OTP Expiry**: Default OTP expires in 10 minutes (600 seconds)
3. **Token Storage**: Tokens are stored in localStorage, persisting across page refreshes

4. **Authentication Required**: OTP verification and resend endpoints require valid JWT token

5. **Test Isolation**: Each test should clean up after itself to avoid conflicts

## Troubleshooting

### Tests failing with "Invalid OTP"

- Ensure test endpoint is properly implemented and accessible
- Check that OTPs are being generated correctly
- Verify OTP hasn't expired (10-minute window)

### Tests failing with "Authentication required"

- Ensure token is stored in localStorage after signup
- Check that token is valid and not expired
- Verify requireAuth middleware is functioning correctly

### Tests timing out

- Increase timeout in playwright.config.ts
- Check that backend and frontend are running
- Ensure network requests aren't being blocked

### ReCAPTCHA blocking tests

- Use reCAPTCHA test keys in development
- Implement bypass in test environment
- Check handleRecaptcha() helper function
