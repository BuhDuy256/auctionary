import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import adminRouter from "../api/routes/admin.route";
import * as adminService from "../services/admin.service";
import { envConfig } from "../configs/env.config";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Mock the admin service
jest.mock("../services/admin.service");

// Create Express app for testing
const app = express();
app.use(express.json());
// Add response interceptor middleware BEFORE routes
app.use(responseInterceptor);
app.use("/api/admin", adminRouter);
// Add error handler middleware AFTER routes
app.use(errorHandler);

// Helper function to generate mock JWT tokens
const generateToken = (payload: any) => {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  });
};

// Mock user payloads
const adminUser = {
  userId: 1,
  email: "admin@test.com",
  roles: ["admin"],
  permissions: ["admin.access"],
};

const regularUser = {
  userId: 2,
  email: "user@test.com",
  roles: ["bidder"],
  permissions: [],
};

describe("Admin Routes - User Management", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/admin/users", () => {
    const endpoint = "/api/admin/users";

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

    it("should return 403 when user is not admin", async () => {
      const token = generateToken(regularUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 200 and all users for admin user", async () => {
      const mockUsers = {
        users: [
          {
            id: 1,
            fullName: "John Doe",
            email: "john@test.com",
            role: "bidder",
            status: "active",
            reputation: 80,
            positiveReviews: 8,
            negativeReviews: 2,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            fullName: "Jane Smith",
            email: "jane@test.com",
            role: "seller",
            status: "active",
            reputation: 100,
            positiveReviews: 10,
            negativeReviews: 0,
            createdAt: new Date().toISOString(),
          },
        ],
      };
      (adminService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const token = generateToken(adminUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUsers);
      expect(adminService.getAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe("PATCH /api/admin/users/:id/suspend", () => {
    const endpoint = "/api/admin/users";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).patch(`${endpoint}/1/suspend`);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user is not admin", async () => {
      const token = generateToken(regularUser);
      const response = await request(app)
        .patch(`${endpoint}/1/suspend`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when id is not a valid number", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/invalid/suspend`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when id is not a positive integer", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/-1/suspend`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and suspend user for valid id", async () => {
      const mockResponse = {
        id: 1,
        status: "suspended",
      };
      (adminService.suspendUser as jest.Mock).mockResolvedValue(mockResponse);

      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/1/suspend`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResponse);
      expect(adminService.suspendUser).toHaveBeenCalledWith(1);
    });
  });
});

describe("Admin Routes - Upgrade Requests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/admin/upgrade-requests", () => {
    const endpoint = "/api/admin/upgrade-requests";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user is not admin", async () => {
      const token = generateToken(regularUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 200 and all upgrade requests for admin user", async () => {
      const mockRequests = {
        requests: [
          {
            id: 1,
            userId: 2,
            user: {
              id: 2,
              fullName: "John Doe",
              email: "john@test.com",
              reputation: 80,
              positiveReviews: 8,
              negativeReviews: 2,
              createdAt: new Date().toISOString(),
            },
            message: "I want to become a seller",
            status: "pending",
            createdAt: new Date().toISOString(),
            approvedAt: null,
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ],
      };
      (adminService.getAllUpgradeRequests as jest.Mock).mockResolvedValue(
        mockRequests
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockRequests);
      expect(adminService.getAllUpgradeRequests).toHaveBeenCalledTimes(1);
    });
  });

  describe("PATCH /api/admin/upgrade-requests/:id/approve", () => {
    const endpoint = "/api/admin/upgrade-requests";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).patch(`${endpoint}/1/approve`);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user is not admin", async () => {
      const token = generateToken(regularUser);
      const response = await request(app)
        .patch(`${endpoint}/1/approve`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when id is not a valid number", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/invalid/approve`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and approve request for valid id", async () => {
      const mockResponse = {
        id: 1,
        userId: 2,
        status: "approved",
        approvedAt: new Date().toISOString(),
      };
      (adminService.approveUpgradeRequest as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/1/approve`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResponse);
      expect(adminService.approveUpgradeRequest).toHaveBeenCalledWith(1);
    });
  });

  describe("PATCH /api/admin/upgrade-requests/:id/reject", () => {
    const endpoint = "/api/admin/upgrade-requests";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app).patch(`${endpoint}/1/reject`);

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 403 when user is not admin", async () => {
      const token = generateToken(regularUser);
      const response = await request(app)
        .patch(`${endpoint}/1/reject`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.data.message).toContain("Forbidden");
    });

    it("should return 400 when id is not a valid number", async () => {
      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/invalid/reject`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and reject request for valid id", async () => {
      const mockResponse = {
        id: 1,
        userId: 2,
        status: "rejected",
      };
      (adminService.rejectUpgradeRequest as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const token = generateToken(adminUser);
      const response = await request(app)
        .patch(`${endpoint}/1/reject`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockResponse);
      expect(adminService.rejectUpgradeRequest).toHaveBeenCalledWith(1);
    });
  });
});
