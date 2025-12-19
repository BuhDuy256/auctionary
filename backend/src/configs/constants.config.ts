export const ALLOWED_SORT_FIELDS = [
  "endTime",
  "price",
  "bidCount",
  "createdAt",
] as const;

export const MASK_CONSTANTS = {
  NAME_VISIBLE_CHARS: 4,
  MASK_CHAR: "*",
} as const;

export const AUTH_CONSTANTS = {
  OTP_EXPIRY_MINUTES: 15,
  REFRESH_TOKEN_COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000,
} as const;

export const JWT_CONSTANTS = {
  ACCESS_EXPIRES_IN: "15m",
  REFRESH_EXPIRES_IN: "7d",
  REFRESH_EXPIRY_DAYS: 7,
} as const;

export const RECAPTCHA_CONSTANTS = {
  VERIFY_URL: "https://www.google.com/recaptcha/api/siteverify",
} as const;

export const OTP_EXPIRY_MINUTES = AUTH_CONSTANTS.OTP_EXPIRY_MINUTES;
export const REFRESH_TOKEN_EXPIRY_DAYS = JWT_CONSTANTS.REFRESH_EXPIRY_DAYS;
