import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import userRouter from "../api/routes/user.route";
import * as userService from "../services/user.service";
import { envConfig } from "../configs/env.config";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Mock the user service
jest.mock("../services/user.service");

// Create Express app for testing
const app = express();
app.use(express.json());
// Add response interceptor middleware BEFORE routes
app.use(responseInterceptor);
app.use("/api/users", userRouter);
// Add error handler middleware AFTER routes
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

describe("User Profile Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/users/me/stats", () => {
    const endpoint = "/api/users/me/stats";

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

    it("should return 200 and user stats for authenticated user", async () => {
      const mockStats = {
        stats: {
          rating: 85,
          likes: 17,
          dislikes: 3,
          auctionsWon: 12,
        },
      };
      (userService.getStats as jest.Mock).mockResolvedValue(mockStats);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockStats);
      expect(userService.getStats).toHaveBeenCalledWith(1);
    });
  });

  describe("GET /api/users/me/bids", () => {
    const endpoint = "/api/users/me/bids";

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

    it("should return 200 and active bids for authenticated user", async () => {
      const mockBids = [
        {
          id: 1,
          productId: 10,
          productName: "Vintage Camera",
          bidAmount: 250,
          currentPrice: 275,
          status: "outbid",
          placedAt: new Date().toISOString(),
        },
        {
          id: 2,
          productId: 11,
          productName: "Antique Watch",
          bidAmount: 500,
          currentPrice: 500,
          status: "winning",
          placedAt: new Date().toISOString(),
        },
      ];
      (userService.getActiveBids as jest.Mock).mockResolvedValue(mockBids);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockBids);
      expect(response.body.data).toHaveLength(2);
      expect(userService.getActiveBids).toHaveBeenCalledWith(1);
    });

    it("should return 200 with empty array when user has no active bids", async () => {
      (userService.getActiveBids as jest.Mock).mockResolvedValue([]);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe("GET /api/users/me/won-auctions", () => {
    const endpoint = "/api/users/me/won-auctions";

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

    it("should return 200 and won auctions for authenticated user", async () => {
      const mockAuctions = [
        {
          id: 5,
          productName: "Gaming Console",
          winningBid: 400,
          wonAt: new Date().toISOString(),
          imageUrl: "/images/console.jpg",
        },
        {
          id: 8,
          productName: "Laptop",
          winningBid: 800,
          wonAt: new Date().toISOString(),
          imageUrl: "/images/laptop.jpg",
        },
      ];
      (userService.getWonAuctions as jest.Mock).mockResolvedValue(mockAuctions);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockAuctions);
      expect(response.body.data).toHaveLength(2);
      expect(userService.getWonAuctions).toHaveBeenCalledWith(1);
    });

    it("should return 200 with empty array when user has no won auctions", async () => {
      (userService.getWonAuctions as jest.Mock).mockResolvedValue([]);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe("PATCH /api/users/me/profile", () => {
    const endpoint = "/api/users/me/profile";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .patch(endpoint)
        .send({ fullName: "John Doe" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", "Bearer invalid-token")
        .send({ fullName: "John Doe" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 400 when fullName is too short", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ fullName: "J" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when fullName contains numbers", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ fullName: "John123 Doe" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when fullName contains special characters", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ fullName: "John@Doe" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and update profile with fullName only", async () => {
      const mockUpdatedUser = {
        id: 1,
        fullName: "John Doe",
        email: "user@test.com",
      };
      (userService.updateProfile as jest.Mock).mockResolvedValue(
        mockUpdatedUser
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ fullName: "John Doe" });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedUser);
      expect(userService.updateProfile).toHaveBeenCalledWith(1, {
        fullName: "John Doe",
        address: undefined,
      });
    });

    it("should return 200 and update profile with fullName and address", async () => {
      const mockUpdatedUser = {
        id: 1,
        fullName: "Jane Smith",
        email: "user@test.com",
        address: "123 Main St",
      };
      (userService.updateProfile as jest.Mock).mockResolvedValue(
        mockUpdatedUser
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ fullName: "Jane Smith", address: "123 Main St" });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedUser);
      expect(userService.updateProfile).toHaveBeenCalledWith(1, {
        fullName: "Jane Smith",
        address: "123 Main St",
      });
    });

    it("should return 200 and update profile with address only", async () => {
      const mockUpdatedUser = {
        id: 1,
        fullName: "John Doe",
        email: "user@test.com",
        address: "456 Oak Ave",
      };
      (userService.updateProfile as jest.Mock).mockResolvedValue(
        mockUpdatedUser
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ fullName: "AB", address: "456 Oak Ave" });

      expect(response.status).toBe(200);
    });
  });

  describe("PATCH /api/users/me/email", () => {
    const endpoint = "/api/users/me/email";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .patch(endpoint)
        .send({ email: "new@test.com", password: "password123" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", "Bearer invalid-token")
        .send({ email: "new@test.com", password: "password123" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 400 when email format is invalid", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "invalid-email", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when password is missing", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "new@test.com" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when password is empty string", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "new@test.com", password: "" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and update email with correct password", async () => {
      const mockUpdatedUser = {
        id: 1,
        fullName: "John Doe",
        email: "newemail@test.com",
      };
      (userService.updateEmail as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "newemail@test.com", password: "correctPassword123" });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedUser);
      expect(userService.updateEmail).toHaveBeenCalledWith(
        1,
        "newemail@test.com",
        "correctPassword123"
      );
    });
  });

  describe("PATCH /api/users/me/password", () => {
    const endpoint = "/api/users/me/password";

    it("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .patch(endpoint)
        .send({ currentPassword: "old123", newPassword: "NewPass123" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, no token");
    });

    it("should return 401 when an invalid token is provided", async () => {
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", "Bearer invalid-token")
        .send({ currentPassword: "old123", newPassword: "NewPass123" });

      expect(response.status).toBe(401);
      expect(response.body.data.message).toBe("Not authorized, token failed");
    });

    it("should return 400 when currentPassword is missing", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ newPassword: "NewPass123" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when newPassword is too short", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ currentPassword: "oldPassword", newPassword: "Short1" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when newPassword lacks uppercase letter", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ currentPassword: "oldPassword", newPassword: "newpass123" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when newPassword lacks lowercase letter", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ currentPassword: "oldPassword", newPassword: "NEWPASS123" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when newPassword lacks number", async () => {
      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({ currentPassword: "oldPassword", newPassword: "NewPassword" });

      expect(response.status).toBe(400);
      expect(response.body.details).toBeDefined();
    });

    it("should return 200 and change password with valid data", async () => {
      const mockUpdatedUser = {
        id: 1,
        fullName: "John Doe",
        email: "user@test.com",
      };
      (userService.changePassword as jest.Mock).mockResolvedValue(
        mockUpdatedUser
      );

      const token = generateToken(authenticatedUser);
      const response = await request(app)
        .patch(endpoint)
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "OldPassword123",
          newPassword: "NewPassword123",
        });

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockUpdatedUser);
      expect(userService.changePassword).toHaveBeenCalledWith(
        1,
        "OldPassword123",
        "NewPassword123"
      );
    });
  });
});
