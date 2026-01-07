import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().min(1, "NODE_ENV is required"),
  PORT: z.string().default("3000").transform(Number),
  CLIENT_URL: z.string().default("http://localhost:5173"),

  // Database
  SUPABASE_HOST: z.string().min(1, "SUPABASE_HOST is required"),
  SUPABASE_PORT: z.string().default("5432").transform(Number),
  SUPABASE_USER: z.string().min(1, "SUPABASE_USER is required"),
  SUPABASE_PASSWORD: z.string().min(1, "SUPABASE_PASSWORD is required"),
  SUPABASE_DB: z.string().min(1, "SUPABASE_DB is required"),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),

  // Email
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().default("587").transform(Number),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email("EMAIL_FROM must be a valid email"),
  RESEND_API_KEY: z.string().optional(),

  // OTP
  OTP_EXPIRY_MINUTES: z.string().default("10").transform(Number),
  SKIP_OTP: z.string().default("false").transform(Boolean),

  // RECAPTCHA
  RECAPTCHA_SECRET_KEY: z.string().min(1, "RECAPTCHA_SECRET_KEY is required"),
  RECAPTCHA_SITE_KEY: z.string().min(1, "RECAPTCHA_SITE_KEY is required"),
  SKIP_RECAPTCHA: z.string().default("false").transform(Boolean),

  // GOOGLE
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables:",
    parsedEnv.error.issues
      .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
      .join("\n")
  );
  process.exit(1);
}

// Transform/Fallback logic
const data = parsedEnv.data;
if (!data.RESEND_API_KEY && data.EMAIL_PASSWORD) {
  data.RESEND_API_KEY = data.EMAIL_PASSWORD;
}

if (!data.RESEND_API_KEY) {
  console.error(
    "RESEND_API_KEY (or EMAIL_PASSWORD) is required for email service."
  );
  process.exit(1);
}

export const envConfig = data as typeof data & { RESEND_API_KEY: string };
