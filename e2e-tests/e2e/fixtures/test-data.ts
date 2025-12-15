/**
 * Test data fixtures for E2E tests
 */

export const VALID_USER = {
  fullName: "John Doe",
  email: "john.doe.test@example.com",
  password: "SecurePass123!",
  address: "123 Main St, City, Country",
};

export const INVALID_EMAILS = [
  { value: "invalid", error: "Invalid email format" },
  { value: "test@", error: "Invalid email format" },
  { value: "@example.com", error: "Invalid email format" },
  { value: "test @example.com", error: "Invalid email format" },
];

export const WEAK_PASSWORDS = [
  { value: "short", error: "Password must be at least 8 characters" },
  { value: "1234567", error: "Password must be at least 8 characters" },
  { value: "abc123", error: "Password must be at least 8 characters" },
];

export const STRONG_PASSWORDS = [
  "SecurePass123!",
  "MyP@ssw0rd",
  "Test1234567890",
  "ComplexPass#2024",
];

export const REQUIRED_FIELDS = [
  { field: "fullName", label: "Full Name" },
  { field: "email", label: "Email" },
  { field: "password", label: "Password" },
  { field: "confirm_password", label: "Confirm Password" },
];

export const ERROR_MESSAGES = {
  DUPLICATE_EMAIL: "Email already exists",
  WEAK_PASSWORD: "Password must be at least 8 characters",
  INVALID_EMAIL: "Invalid email format",
  PASSWORD_MISMATCH: "Passwords do not match",
  RECAPTCHA_REQUIRED: "Please complete the reCAPTCHA",
  INVALID_OTP: "Invalid or expired OTP",
  EXPIRED_OTP: "OTP has expired",
  MISSING_FIELD: "This field is required",
};

export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: "Account created",
  OTP_SENT: "verification code has been sent",
  OTP_VERIFIED: "Account verified successfully",
  OTP_RESENT: "A new verification code has been sent",
};

export const VALID_OTP = "123456";
export const INVALID_OTP = "000000";
export const INCOMPLETE_OTP = "123";

export const OTP_COOLDOWN_SECONDS = 60;
