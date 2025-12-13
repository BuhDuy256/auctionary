import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import upgradeRequestRouter from "../api/routes/upgradeRequest.route";
import * as upgradeRequestService from "../services/upgradeRequest.service";
import { envConfig } from "../configs/env.config";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Mock the upgrade request service
jest.mock("../services/upgradeRequest.service");

// Create Express app for testing
const app = express();
app.use(express.json());
// Add response interceptor middleware BEFORE routes
app.use(responseInterceptor);
app.use("/api/users", upgradeRequestRouter);
// Add error handler middleware AFTER routes
app.use(errorHandler);

// Helper function to generate mock JWT tokens
const generateToken = (payload: any) => {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  });
};

// Mock user payloads
const activeUser = {
  id: 1,
  userId: 1,
  email: "user@test.com",
  roles: ["bidder"],
  permissions: [],
};

const pendingUpgradeUser = {
  id: 2,
  userId: 2,
  email: "pending@test.com",
  roles: ["bidder"],
  permissions: [],
};

describe("Upgrade Request Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/users/upgrade-request", () => {
    const endpoint = "/api/users/upgrade-request";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .post(endpoint)
        .send({ message: "I want to become a seller" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", "Bearer invalid-token")
        .send({ message: "I want to become a seller" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 400 when message is missing", async () => {
      const token = generateToken(activeUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when message is too short (< 20 chars)", async () => {
      const token = generateToken(activeUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Too short" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when message exceeds 500 characters", async () => {
      const token = generateToken(activeUser);
      const longMessage = "a".repeat(501);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ message: longMessage });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when message contains invalid characters", async () => {
      const token = generateToken(activeUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({
          message: "I want to become a seller <script>alert('xss')</script>",
        });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 201 and create upgrade request with valid message", async () => {
      const mockResponse = {
        requestId: 1,
        message:
          "Upgrade request submitted successfully. We will review your request soon.",
      };
      (
        upgradeRequestService.submitUpgradeRequest as jest.Mock
      ).mockResolvedValue(mockResponse);

      const token = generateToken(activeUser);
      const response = await request(app)
        .post(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({
          message:
            "I would like to upgrade my account to become a seller on this platform. Thank you for your consideration.",
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(mockResponse);
      expect(upgradeRequestService.submitUpgradeRequest).toHaveBeenCalledWith(
        1,
        "I would like to upgrade my account to become a seller on this platform. Thank you for your consideration."
      );
    });
  });

  describe("GET /api/users/upgrade-request/status", () => {
    const endpoint = "/api/users/upgrade-request/status";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 200 with null request when user has no upgrade request", async () => {
      const mockResponse = {
        request: null,
      };
      (
        upgradeRequestService.getMyUpgradeRequestStatus as jest.Mock
      ).mockResolvedValue(mockResponse);

      const token = generateToken(activeUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResponse);
      expect(
        upgradeRequestService.getMyUpgradeRequestStatus
      ).toHaveBeenCalledWith(1);
    });

    it("should return 200 with request details when user has pending request", async () => {
      const mockResponse = {
        request: {
          requestId: 1,
          userId: 2,
          status: "pending",
          message: "I want to become a seller",
          createdAt: new Date().toISOString(),
          approvedAt: null,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      };
      (
        upgradeRequestService.getMyUpgradeRequestStatus as jest.Mock
      ).mockResolvedValue(mockResponse);

      const token = generateToken(pendingUpgradeUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResponse);
      expect(
        upgradeRequestService.getMyUpgradeRequestStatus
      ).toHaveBeenCalledWith(2);
    });
  });

  describe("PATCH /api/users/upgrade-request/cancel", () => {
    const endpoint = "/api/users/upgrade-request/cancel";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).patch(endpoint);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 200 and cancel pending upgrade request", async () => {
      const mockResponse = {
        message: "Upgrade request cancelled successfully",
      };
      (
        upgradeRequestService.cancelMyUpgradeRequest as jest.Mock
      ).mockResolvedValue(mockResponse);

      const token = generateToken(pendingUpgradeUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResponse);
      expect(upgradeRequestService.cancelMyUpgradeRequest).toHaveBeenCalledWith(
        2
      );
    });
  });
});
