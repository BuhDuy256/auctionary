import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import sellerRouter from "../api/routes/seller.route";
import * as sellerService from "../services/seller.service";
import { envConfig } from "../configs/env.config";
import { errorHandler } from "../api/middlewares/error.middleware";
import { responseInterceptor } from "../api/middlewares/response-interceptor.middleware";

// Mock the seller service
jest.mock("../services/seller.service");

// Create Express app for testing
const app = express();
app.use(express.json());
// Add response interceptor middleware BEFORE routes
app.use(responseInterceptor);
app.use("/api/seller", sellerRouter);
// Add error handler middleware AFTER routes
app.use(errorHandler);

// Helper function to generate mock JWT tokens
const generateToken = (payload: any) => {
  return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET as string, {
    expiresIn: "1h",
  });
};

// Mock user payloads
// Note: seller controller checks `user.id` not `user.userId`
const sellerUser = {
  id: 1,
  userId: 1,
  email: "seller@test.com",
  roles: ["seller"],
  permissions: [],
};

describe("Seller Routes - Dashboard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/seller/dashboard", () => {
    const endpoint = "/api/seller/dashboard";

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

    it("should return 200 and dashboard data for authenticated seller", async () => {
      const mockDashboard = {
        stats: {
          totalListings: 25,
          activeListings: 15,
          soldListings: 8,
          totalRevenue: 15000,
          pendingPayments: 2,
        },
        listings: [
          {
            id: 1,
            name: "Vintage Camera",
            startingPrice: 100,
            currentPrice: 250,
            status: "active",
            bidCount: 12,
            endTime: new Date(Date.now() + 86400000).toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Antique Watch",
            startingPrice: 200,
            currentPrice: 500,
            status: "active",
            bidCount: 8,
            endTime: new Date(Date.now() + 172800000).toISOString(),
            createdAt: new Date().toISOString(),
          },
        ],
      };
      (sellerService.getSellerDashboard as jest.Mock).mockResolvedValue(
        mockDashboard
      );

      const token = generateToken(sellerUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockDashboard);
      expect(sellerService.getSellerDashboard).toHaveBeenCalledWith(1);
    });

    it("should return 200 with empty listings when seller has no products", async () => {
      const mockDashboard = {
        stats: {
          totalListings: 0,
          activeListings: 0,
          soldListings: 0,
          totalRevenue: 0,
          pendingPayments: 0,
        },
        listings: [],
      };
      (sellerService.getSellerDashboard as jest.Mock).mockResolvedValue(
        mockDashboard
      );

      const token = generateToken(sellerUser);
      const response = await request(app)
        .get(endpoint)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(mockDashboard);
      expect(response.body.data.listings).toHaveLength(0);
    });
  });
});
