// Mock services - must be at the top for Jest hoisting
jest.mock("../services/auth.service");

// Mock reCAPTCHA middleware to always pass validation in tests
jest.mock("../api/middlewares/recaptcha.middleware", () => ({
  validateRecaptchaV2: jest.fn((_req, _res, next) => next()),
}));

import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import authRouter from "../api/routes/auth.route";
import * as authService from "../services/auth.service";
import { envConfig } from "../configs/env.config";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Create Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser()); // Required for cookie handling
app.use(responseInterceptor);
app.use("/api/auth", authRouter);
app.use(errorHandler);

// Helper function to generate mock JWT tokens
const generateToken = (payload: any) => {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  });
};

// Mock user payload
const authenticatedUser = {
  id: 1,
  userId: 1,
  email: "user@test.com",
  roles: ["bidder"],
  permissions: [],
};

describe("Auth Routes - Signup & Login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    const endpoint = "/api/auth/signup";

    it("should return 400 when email format is invalid", async () => {
      const response = await request(app).post(endpoint).send({
        fullName: "John Doe",
        email: "invalid-email",
        password: "Password123",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when password is too short", async () => {
      const response = await request(app).post(endpoint).send({
        fullName: "John Doe",
        email: "test@example.com",
        password: "Short1",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when password lacks uppercase letter", async () => {
      const response = await request(app).post(endpoint).send({
        fullName: "John Doe",
        email: "test@example.com",
        password: "password123",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when password lacks lowercase letter", async () => {
      const response = await request(app).post(endpoint).send({
        fullName: "John Doe",
        email: "test@example.com",
        password: "PASSWORD123",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when password lacks number", async () => {
      const response = await request(app).post(endpoint).send({
        fullName: "John Doe",
        email: "test@example.com",
        password: "PasswordOnly",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when fullName is too short", async () => {
      const response = await request(app).post(endpoint).send({
        fullName: "J",
        email: "test@example.com",
        password: "Password123",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when fullName contains numbers", async () => {
      const response = await request(app).post(endpoint).send({
        fullName: "John123 Doe",
        email: "test@example.com",
        password: "Password123",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when recaptchaToken is missing", async () => {
      const response = await request(app).post(endpoint).send({
        fullName: "John Doe",
        email: "test@example.com",
        password: "Password123",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 201 and create user with valid data", async () => {
      const mockResult = {
        user: {
          id: 1,
          fullName: "John Doe",
          email: "test@example.com",
          emailVerified: false,
        },
      };
      (authService.signupUser as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app).post(endpoint).send({
        fullName: "John Doe",
        email: "test@example.com",
        password: "Password123",
        address: "123 Main St",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockResult);
      expect(authService.signupUser).toHaveBeenCalledWith({
        fullName: "John Doe",
        email: "test@example.com",
        password: "Password123",
        address: "123 Main St",
        recaptchaToken: "fake-token",
      });
    });
  });

  describe("POST /api/auth/login", () => {
    const endpoint = "/api/auth/login";

    it("should return 400 when email is invalid", async () => {
      const response = await request(app).post(endpoint).send({
        email: "invalid-email",
        password: "password",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when password is missing", async () => {
      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when recaptchaToken is missing", async () => {
      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        password: "password",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 with tokens for verified user", async () => {
      const mockResult = {
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
        user: {
          id: 1,
          fullName: "John Doe",
          email: "test@example.com",
          emailVerified: true,
        },
      };
      (authService.loginUser as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        password: "Password123",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBe("fake-access-token");
      expect(response.body.data.user).toEqual(mockResult.user);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain("refreshToken");
    });

    it("should return 200 with requiresVerification for unverified user", async () => {
      const mockResult = {
        requiresVerification: true,
        user: {
          id: 2,
          fullName: "Jane Doe",
          email: "unverified@example.com",
          emailVerified: false,
        },
      };
      (authService.loginUser as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app).post(endpoint).send({
        email: "unverified@example.com",
        password: "Password123",
        recaptchaToken: "fake-token",
      });

      expect(response.status).toBe(200);
      expect(response.body.data.requiresVerification).toBe(true);
      expect(response.body.data.user).toEqual(mockResult.user);
    });
  });
});

describe("Auth Routes - OAuth", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/google-login", () => {
    const endpoint = "/api/auth/google-login";

    it("should return 400 when Google code is missing", async () => {
      const response = await request(app).post(endpoint).send({});

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and login with Google code", async () => {
      const mockResult = {
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
        user: {
          id: 1,
          fullName: "Google User",
          email: "google@example.com",
        },
      };
      (authService.loginWithGoogle as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post(endpoint)
        .send({ code: "fake-google-code" });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBe("fake-access-token");
      expect(response.body.data.user).toEqual(mockResult.user);
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });

  describe("POST /api/auth/facebook-login", () => {
    const endpoint = "/api/auth/facebook-login";

    it("should return 400 when Facebook access token is missing", async () => {
      const response = await request(app).post(endpoint).send({});

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and login with Facebook token", async () => {
      const mockResult = {
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
        user: {
          id: 1,
          fullName: "Facebook User",
          email: "facebook@example.com",
        },
      };
      (authService.loginWithFacebook as jest.Mock).mockResolvedValue(
        mockResult
      );

      const response = await request(app)
        .post(endpoint)
        .send({ accessToken: "fake-facebook-token" });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBe("fake-access-token");
      expect(response.body.data.user).toEqual(mockResult.user);
      expect(response.headers["set-cookie"]).toBeDefined();
    });
  });
});

describe("Auth Routes - Token Management", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/refresh", () => {
    const endpoint = "/api/auth/refresh";

    it("should return 401 when refresh token is not provided", async () => {
      const response = await request(app).post(endpoint).send({});

      expect(response.status).toBe(401);
    });

    it("should return 200 and refresh token from cookie", async () => {
      const mockResult = {
        accessToken: "new-access-token",
      };
      (authService.refreshAccessToken as jest.Mock).mockResolvedValue(
        mockResult
      );

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", ["refreshToken=fake-refresh-token"])
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResult);
      expect(authService.refreshAccessToken).toHaveBeenCalledWith(
        "fake-refresh-token"
      );
    });

    it("should return 200 and refresh token from body", async () => {
      const mockResult = {
        accessToken: "new-access-token",
      };
      (authService.refreshAccessToken as jest.Mock).mockResolvedValue(
        mockResult
      );

      const response = await request(app)
        .post(endpoint)
        .send({ refreshToken: "fake-refresh-token-from-body" });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResult);
      expect(authService.refreshAccessToken).toHaveBeenCalledWith(
        "fake-refresh-token-from-body"
      );
    });
  });

  describe("POST /api/auth/logout", () => {
    const endpoint = "/api/auth/logout";

    it("should return 200 and logout with refresh token", async () => {
      (authService.logoutUser as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", ["refreshToken=fake-refresh-token"])
        .send({});

      expect(response.status).toBe(200);
      expect(authService.logoutUser).toHaveBeenCalledWith("fake-refresh-token");
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain("refreshToken=;");
    });

    it("should return 200 even without refresh token", async () => {
      const response = await request(app).post(endpoint).send({});

      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/auth/me", () => {
    const endpoint = "/api/auth/me";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when invalid token is provided", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 200 and user data for authenticated user", async () => {
      const mockUser = {
        id: 1,
        fullName: "John Doe",
        email: "user@test.com",
        roles: ["bidder"],
      };
      (authService.getAuthenticatedUser as jest.Mock).mockResolvedValue(
        mockUser
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUser);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledWith(1);
    });
  });

  describe("POST /api/auth/logout-all", () => {
    const endpoint = "/api/auth/logout-all";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).post(endpoint);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when invalid token is provided", async () => {
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 200 and logout from all devices", async () => {
      (authService.logoutAllDevices as jest.Mock).mockResolvedValue(undefined);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(authService.logoutAllDevices).toHaveBeenCalledWith(1);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"][0]).toContain("refreshToken=;");
    });
  });
});

describe("Auth Routes - OTP Verification", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/verify-otp", () => {
    const endpoint = "/api/auth/verify-otp";

    it("should return 400 when userId is missing", async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ otp: "123456" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when OTP is missing", async () => {
      const response = await request(app).post(endpoint).send({ userId: 1 });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and verify OTP with valid data", async () => {
      const mockResult = {
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
        user: {
          id: 1,
          fullName: "John Doe",
          email: "test@example.com",
          emailVerified: true,
        },
      };
      (authService.verifyOTP as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app)
        .post(endpoint)
        .send({ userId: 1, otp: "123456" });

      expect(response.status).toBe(200);
      expect(response.body.data.accessToken).toBe("fake-access-token");
      expect(response.body.data.user).toEqual(mockResult.user);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(authService.verifyOTP).toHaveBeenCalledWith(1, "123456");
    });
  });

  describe("POST /api/auth/resend-otp", () => {
    const endpoint = "/api/auth/resend-otp";

    it("should return 400 when userId is missing", async () => {
      const response = await request(app).post(endpoint).send({});

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and resend OTP for valid userId", async () => {
      const mockResult = {
        message: "OTP resent successfully",
      };
      (authService.resendOTP as jest.Mock).mockResolvedValue(mockResult);

      const response = await request(app).post(endpoint).send({ userId: 1 });

      expect(response.status).toBe(200);
      expect(authService.resendOTP).toHaveBeenCalledWith(1);
    });
  });
});

describe("Auth Routes - Password Reset", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/forgot-password", () => {
    const endpoint = "/api/auth/forgot-password";

    it("should return 400 when email format is invalid", async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ email: "invalid-email" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and request password reset", async () => {
      const mockResult = {
        message: "Password reset OTP sent to your email",
      };
      (authService.requestPasswordReset as jest.Mock).mockResolvedValue(
        mockResult
      );

      const response = await request(app)
        .post(endpoint)
        .send({ email: "test@example.com" });

      expect(response.status).toBe(200);
      expect(authService.requestPasswordReset).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });

  describe("POST /api/auth/reset-password", () => {
    const endpoint = "/api/auth/reset-password";

    it("should return 400 when email is invalid", async () => {
      const response = await request(app).post(endpoint).send({
        email: "invalid-email",
        otp: "123456",
        newPassword: "NewPassword123",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when OTP is invalid length", async () => {
      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        otp: "123",
        newPassword: "NewPassword123",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when newPassword is too short", async () => {
      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        otp: "123456",
        newPassword: "Short1",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when newPassword lacks uppercase", async () => {
      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        otp: "123456",
        newPassword: "newpassword123",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when newPassword lacks lowercase", async () => {
      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        otp: "123456",
        newPassword: "NEWPASSWORD123",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when newPassword lacks number", async () => {
      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        otp: "123456",
        newPassword: "NewPassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and reset password with valid OTP", async () => {
      const mockResult = {
        message: "Password reset successfully",
      };
      (authService.resetPasswordWithOTP as jest.Mock).mockResolvedValue(
        mockResult
      );

      const response = await request(app).post(endpoint).send({
        email: "test@example.com",
        otp: "123456",
        newPassword: "NewPassword123",
      });

      expect(response.status).toBe(200);
      expect(authService.resetPasswordWithOTP).toHaveBeenCalledWith({
        email: "test@example.com",
        otp: "123456",
        newPassword: "NewPassword123",
      });
    });
  });
});
