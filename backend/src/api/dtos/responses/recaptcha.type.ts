export interface VerifyRecaptchaResponse {
  success: boolean;
  message?: string;
}

export interface RecaptchaV2Response {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}